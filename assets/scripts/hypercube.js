// The joints and animation are extracted from the supplied Hypercube.blend.
// The complete introduction uses one world frame and one perspective camera.
import { createVertexLoop, PLAYBACK_RATE } from './hypercube-animation.js';

const intro = document.querySelector('#intro');
const visual = intro.querySelector('.intro-visual');
const canvas = intro.querySelector('#hypercube');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let visible = false;
let loading = false;
let failed = false;
let contextLost = false;
let renderer, scene, camera, loop, hypercube, floor, frameCamera;
let playbackTime = 0;
let frame = 0;
let lastTime = 0;

function setRenderState(state) {
    intro.dataset.renderState = visual.dataset.renderState = state;
}
function render() {
    if (renderer && !contextLost) renderer.render(scene, camera);
}
function resize() {
    if (!renderer) return;
    const section = intro.getBoundingClientRect();
    const slot = visual.getBoundingClientRect();
    const width = intro.clientWidth;
    const height = Math.max(intro.clientHeight, intro.scrollHeight);
    if (!width || !height || !slot.height) return;
    canvas.style.height = `${height}px`;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    frameCamera(camera, width, height,
        slot.left - section.left + slot.width / 2,
        slot.top - section.top + intro.scrollTop + slot.height / 2, slot.height);
    render();
}
function tick(now) {
    frame = 0;
    if (!visible || document.hidden || motion.matches || contextLost) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;
    playbackTime = (playbackTime + delta * PLAYBACK_RATE) % loop.duration;
    hypercube.update(playbackTime);
    render();
    frame = requestAnimationFrame(tick);
}
function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (!renderer) {
        if (visible && !document.hidden && !loading && !failed) load();
        return;
    }
    if (visible && !document.hidden && !motion.matches && !contextLost) {
        visual.dataset.animationState = 'playing';
        frame = requestAnimationFrame(tick);
    } else {
        visual.dataset.animationState = 'paused';
        if (visible && !document.hidden) render();
    }
}
async function load() {
    loading = true;
    setRenderState('loading');
    try {
        const [THREE, sceneTools, response] = await Promise.all([
            import('../vendor/three/three.module.min.js'),
            import('./hypercube-scene.js'),
            fetch(new URL('../models/hypercube-rig.json', import.meta.url)),
        ]);
        if (!response.ok) throw new Error('Hypercube joint animation unavailable');
        const rig = await response.json();
        loop = createVertexLoop(rig);
        frameCamera = sceneTools.frameIntroCamera;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(28, 1, 0.1, 150);
        camera.position.set(2.8, 1.65, 8);
        camera.lookAt(0, 0, 0);
        hypercube = sceneTools.createHypercube(rig, loop);
        floor = sceneTools.createFloor();
        scene.add(hypercube.group, floor);
        scene.add(new THREE.HemisphereLight(0xffedf4, 0x332338, 2));
        const key = new THREE.DirectionalLight(0xffeef5, 3.5);
        key.position.set(3, 4, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xf7bacf, 2);
        rim.position.set(-4, 1, -3);
        scene.add(rim);
        visual.dataset.loopDuration = (loop.duration / PLAYBACK_RATE).toFixed(3);
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.setClearColor(0x000000, 0);
        resize();
        setRenderState('ready');
        loading = false;
        sync();
    } catch (error) {
        failed = true;
        loading = false;
        renderer?.dispose();
        renderer = undefined;
        setRenderState('fallback');
        console.warn('Hypercube: keeping the static model preview.', error);
    }
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(intro);
resizeObserver.observe(visual);
new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
}, { root: document.querySelector('.scroll-container'), threshold: 0.01 }).observe(intro);
document.addEventListener('visibilitychange', sync);
motion.addEventListener('change', sync);
canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    contextLost = true;
    setRenderState('fallback');
    sync();
});
canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    resize();
    setRenderState('ready');
    sync();
});
