import * as THREE from '../vendor/three/three.module.min.js';

export const VIEW_HEIGHT = 3.1;
export const FLOOR_HEIGHT = -1.35;

// Only the joint centers deform. A rigid cylinder is fitted between each pair,
// avoiding twisted cross-sections and interpolated normals in the source morphs.
export function createHypercube(rig, loop) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0xf7bacf, metalness: 0.08, roughness: 0.5 });
    const scale = 2.4 / (2 * (Math.max(...rig.poses[0].flat().map(Math.abs)) + rig.joint_radius));
    group.scale.setScalar(scale);
    const joints = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(rig.joint_radius * 0.85, 3), material, 16);
    const bars = new THREE.InstancedMesh(new THREE.CylinderGeometry(rig.bar_radius, rig.bar_radius, 1, 24), material, rig.edges.length);
    joints.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    bars.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Their initial bounds would not cover all the changing poses.
    joints.frustumCulled = bars.frustumCulled = false;
    group.add(joints, bars);
    const coordinates = new Float64Array(loop.size);
    const points = Array.from({ length: 16 }, () => new THREE.Vector3());
    const transform = new THREE.Object3D();
    const direction = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const unit = new THREE.Vector3(1, 1, 1);
    function update(time) {
        loop.sample(time, coordinates);
        for (let i = 0; i < points.length; i++) {
            points[i].fromArray(coordinates, i * 3);
            transform.position.copy(points[i]);
            transform.quaternion.identity();
            transform.scale.copy(unit);
            transform.updateMatrix();
            joints.setMatrixAt(i, transform.matrix);
        }
        rig.edges.forEach(([a, b], i) => {
            direction.subVectors(points[b], points[a]);
            const length = direction.length();
            transform.position.copy(points[a]).add(points[b]).multiplyScalar(0.5);
            transform.quaternion.setFromUnitVectors(up, direction.multiplyScalar(1 / length));
            transform.scale.set(1, length, 1);
            transform.updateMatrix();
            bars.setMatrixAt(i, transform.matrix);
        });
        joints.instanceMatrix.needsUpdate = bars.instanceMatrix.needsUpdate = true;
    }
    update(0);
    return { group, joints, bars, points, update };
}

// World-space grid, anti-aliased in the shader. Distance and shallow viewing
// angles fade it out long before the plane's far boundary can be seen.
export function createFloor() {
    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
            gridColor: { value: new THREE.Color(0x77717f) },
            axisXColor: { value: new THREE.Color(0xe192b0) },
            axisYColor: { value: new THREE.Color(0xf7bacf) },
        },
        vertexShader: `
            varying vec3 worldPosition;
            void main() {
                worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 worldPosition;
            uniform vec3 gridColor;
            uniform vec3 axisXColor;
            uniform vec3 axisYColor;
            float gridLine(vec2 position, float spacing) {
                vec2 coordinate = position / spacing;
                vec2 footprint = max(fwidth(coordinate), vec2(0.00001));
                vec2 line = abs(fract(coordinate - 0.5) - 0.5) / footprint;
                float coverage = 1.0 - min(min(line.x, line.y), 1.0);
                // Remove subpixel moire at the horizon, as in Blender's viewport.
                return coverage * (1.0 - smoothstep(0.15, 0.65, max(footprint.x, footprint.y)));
            }
            void main() {
                vec2 position = worldPosition.xz;
                vec2 footprint = max(fwidth(position), vec2(0.00001));
                float minor = gridLine(position, 0.65);
                float major = gridLine(position, 3.25);
                float axisX = 1.0 - smoothstep(0.0, footprint.y * 1.4, abs(position.y));
                float axisY = 1.0 - smoothstep(0.0, footprint.x * 1.4, abs(position.x));
                vec3 color = mix(gridColor, axisXColor, axisX);
                color = mix(color, axisYColor, axisY);
                float opacity = max(minor * 0.24, major * 0.38);
                opacity = max(opacity, max(axisX, axisY) * 0.65);
                vec3 viewDirection = cameraPosition - worldPosition;
                float distanceFade = 1.0 - smoothstep(12.0, 65.0, length(viewDirection));
                float horizonFade = smoothstep(0.025, 0.13, abs(normalize(viewDirection).y));
                gl_FragColor = vec4(color, opacity * distanceFade * horizonFade);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }
        `,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_HEIGHT;
    floor.frustumCulled = false;
    return floor;
}

// Shift the projection rather than rotating/moving the model. Its screen
// location follows the responsive layout while the floor shares its 3D frame.
export function frameIntroCamera(camera, width, height, anchorX, anchorY, visualHeight) {
    camera.aspect = width / height;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(VIEW_HEIGHT * height / visualHeight / (2 * camera.position.length())));
    camera.setViewOffset(width, height, width / 2 - anchorX, height / 2 - anchorY, width, height);
    camera.updateProjectionMatrix();
}
