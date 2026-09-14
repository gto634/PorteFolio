// Camera and projection fitted to tracked landmarks in 150px-8-cell-simple.gif.
// See tools/hypercube-reference.json for manual observations and reconstructed tracks.
(() => {
    const canvas = document.querySelector('#hypercube');
    const context = canvas.getContext('2d');
    if (!context) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const vertices = Array.from({ length: 16 }, (_, i) => [0, 1, 2, 3].map(axis => (i >> axis & 1) ? 1 : -1));
    const edges = vertices.flatMap((_, i) => [0, 1, 2, 3].filter(axis => !(i >> axis & 1)).map(axis => [i, i ^ (1 << axis)]));
    const faces = [];
    for (let a = 0; a < 4; a++) {
        for (let b = a + 1; b < 4; b++) {
            for (let i = 0; i < 16; i++) {
                if (!(i & (1 << a)) && !(i & (1 << b))) faces.push([i, i ^ (1 << a), i ^ (1 << a) ^ (1 << b), i ^ (1 << b)]);
            }
        }
    }
    const reference = {
        yaw: 0.538086766, pitch: -0.343615790, roll: -0.008714286,
        distance4: 2.98189109, distance3: 8.65078570,
        phase: -0.016638775, quarterTurnMs: 3360
    };
    let width = 0, height = 0, frame = 0, last = 0, angle = reference.phase, visible = false;
    let accent = '#F7BACF';
    function rotate(point, a, b, theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        [point[a], point[b]] = [point[a] * c - point[b] * s, point[a] * s + point[b] * c];
    }
    function projectVertices(theta) {
        return vertices.map(vertex => {
            const p = [...vertex];
            // (x,w) rotates; (y,z) stays fixed. Each (x,w) pair therefore
            // carries an upright square. Four squares exchange size/position.
            rotate(p, 0, 3, theta);
            const perspective4 = reference.distance4 / (reference.distance4 - p[3]);
            const q = p.slice(0, 3).map(value => value * perspective4);
            rotate(q, 0, 2, reference.yaw);
            rotate(q, 1, 2, reference.pitch);
            rotate(q, 0, 1, reference.roll);
            const perspective3 = reference.distance3 / (reference.distance3 - q[2]);
            return { x: q[0] * perspective3, y: q[1] * perspective3, z: q[2], size: perspective3 };
        });
    }
    function vertexOccluders(index, points, thickness) {
        const vertex = points[index];
        const radius = thickness * vertex.size * 0.8;
        const inverseDepth = 1 / (reference.distance3 - vertex.z);
        const occluders = [];
        for (const [a, b] of edges) {
            // A joint always covers its own incident tubes, regardless of depth.
            if (a === index || b === index) continue;
            const p = points[a], q = points[b];
            const dp = 1 / (reference.distance3 - p.z);
            const dq = 1 / (reference.distance3 - q.z);
            if (Math.max(dp, dq) <= inverseDepth + 1e-9) continue;
            let start = 0, end = 1;
            // Reciprocal camera distance varies linearly along a projected line.
            // Clip to the part in front of this vertex, not the edge's mean depth.
            if (Math.min(dp, dq) < inverseDepth) {
                const crossing = (inverseDepth - dp) / (dq - dp);
                if (dp < inverseDepth) start = crossing;
                else end = crossing;
            }
            const x = p.x + (q.x - p.x) * start;
            const y = p.y + (q.y - p.y) * start;
            const dx = (q.x - p.x) * (end - start);
            const dy = (q.y - p.y) * (end - start);
            const lengthSquared = dx * dx + dy * dy;
            if (lengthSquared < 0.01) continue;
            const tubeRadius = thickness * (p.size + q.size) / 4;
            const t = Math.max(0, Math.min(1, ((vertex.x - x) * dx + (vertex.y - y) * dy) / lengthSquared));
            if (Math.hypot(vertex.x - x - t * dx, vertex.y - y - t * dy) > radius + tubeRadius) continue;
            occluders.push({ a, b, x, y, dx, dy, radius: tubeRadius });
        }
        return occluders;
    }
    function excludeTube(tube) {
        const { x, y, dx, dy, radius } = tube;
        const direction = Math.atan2(dy, dx);
        const nx = -Math.sin(direction) * radius, ny = Math.cos(direction) * radius;
        context.beginPath();
        context.rect(0, 0, width, height);
        context.moveTo(x + nx, y + ny);
        context.lineTo(x + dx + nx, y + dy + ny);
        context.arc(x + dx, y + dy, radius, direction + Math.PI / 2, direction - Math.PI / 2, true);
        context.lineTo(x - nx, y - ny);
        context.arc(x, y, radius, direction - Math.PI / 2, direction + Math.PI / 2, true);
        context.closePath();
        // Intersect successive masks, so overlapping occluders cannot reopen holes.
        context.clip('evenodd');
    }
    function draw() {
        context.clearRect(0, 0, width, height);
        const mobile = width <= 1024;
        const scale = Math.min(width * (mobile ? 0.17 : 0.10), height * 0.14);
        const cx = width * (mobile ? 0.48 : 0.73), cy = height * (mobile ? 0.60 : 0.5);
        const points = projectVertices(angle).map(p => ({ ...p, x: cx + p.x * scale, y: cy + p.y * scale }));
        // A faint surface tint gives the wireframe volume without hiding its center.
        context.fillStyle = accent;
        context.globalAlpha = 0.012;
        faces.forEach(face => {
            context.beginPath();
            face.forEach((i, corner) => {
                const p = points[i];
                if (corner === 0) context.moveTo(p.x, p.y);
                else context.lineTo(p.x, p.y);
            });
            context.closePath();
            context.fill();
        });
        context.globalAlpha = 1;
        context.lineCap = 'round';
        // Draw tubes first. Each vertex then covers its incident tubes, but is
        // locally masked by unrelated tubes in front of it at the overlap.
        const primitives = [
            ...edges.map(([a, b]) => ({ a, b, z: (points[a].z + points[b].z) / 2 })).sort((a, b) => a.z - b.z),
            ...points.map((p, i) => ({ i, z: p.z })).sort((a, b) => a.z - b.z)
        ];
        const thickness = Math.max(3, scale * 0.075);
        primitives.forEach(item => {
            if (item.i !== undefined) {
                const p = points[item.i], radius = thickness * p.size * 0.8;
                context.save();
                vertexOccluders(item.i, points, thickness).forEach(excludeTube);
                context.globalAlpha = 1;
                const lighting = context.createRadialGradient(p.x - radius * 0.3, p.y - radius * 0.3, 0, p.x, p.y, radius);
                lighting.addColorStop(0, '#fff0f6');
                lighting.addColorStop(0.4, accent);
                lighting.addColorStop(1, '#654458');
                context.fillStyle = lighting;
                context.beginPath();
                context.arc(p.x, p.y, radius, 0, Math.PI * 2);
                context.fill();
                context.restore();
                return;
            }
            const p = points[item.a], q = points[item.b];
            const lineWidth = thickness * (p.size + q.size) / 2;
            const dx = q.x - p.x, dy = q.y - p.y, length = Math.hypot(dx, dy);
            if (length < 0.1) return;
            const nx = -dy / length * lineWidth / 2, ny = dx / length * lineWidth / 2;
            const shading = context.createLinearGradient(p.x - nx, p.y - ny, p.x + nx, p.y + ny);
            shading.addColorStop(0, '#67465c');
            shading.addColorStop(0.35, accent);
            shading.addColorStop(0.55, '#ffe5ef');
            shading.addColorStop(1, '#916079');
            context.globalAlpha = Math.max(0.35, Math.min(1, 0.7 + item.z * 0.18));
            context.strokeStyle = shading;
            context.lineWidth = lineWidth;
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(q.x, q.y);
            context.stroke();
        });
        context.globalAlpha = 1;
    }
    function tick(now) {
        // Keep vertex identities continuous across the quarter-turn symmetry.
        if (last) angle = (angle + Math.min(now - last, 50) * (Math.PI / 2) / reference.quarterTurnMs) % (Math.PI * 2);
        last = now;
        draw();
        frame = requestAnimationFrame(tick);
    }
    function sync() {
        cancelAnimationFrame(frame);
        last = 0;
        draw();
        if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
    }
    new ResizeObserver(() => {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        const ratio = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        accent = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#F7BACF';
        draw();
    }).observe(canvas);
    new IntersectionObserver(entries => {
        visible = entries[0].intersectionRatio > 0.01;
        sync();
    }, { threshold: 0.01 }).observe(canvas);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
})();
