// Physical rendering invariants: source poses, rigid bars, continuous loop and
// responsive framing. Run with `node tools/hypercube/check-hypercube.mjs`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from '../../assets/vendor/three/three.module.min.js';
import { createVertexLoop, PLAYBACK_RATE } from '../../assets/scripts/hypercube-animation.js';
import { createHypercube, createFloor, frameIntroCamera } from '../../assets/scripts/hypercube-scene.js';

const rig = JSON.parse(readFileSync(new URL('../../assets/models/hypercube-rig.json', import.meta.url)));
const loop = createVertexLoop(rig);
const model = createHypercube(rig, loop);
const coordinates = new Float64Array(48);
assert.equal(new Set(rig.edges.map(edge => edge.join(','))).size, 32);
for (let i = 0; i < 16; i++) assert.equal(rig.edges.filter(edge => edge.includes(i)).length, 4);
let poseError = 0, endpointError = 0, radiusError = 0, minimumLength = Infinity;
for (let i = 0; i < rig.poses.length - 1; i++) {
    loop.sample(loop.duration * i / (rig.poses.length - 1), coordinates);
    rig.poses[i].flat().forEach((value, j) => { poseError = Math.max(poseError, Math.abs(value - coordinates[j])); });
}
const matrix = new THREE.Matrix4();
const radialX = new THREE.Vector3(), radialZ = new THREE.Vector3();
for (let i = 0; i <= 4000; i++) {
    model.update(loop.duration * i / 4000);
    rig.edges.forEach(([a, b], index) => {
        model.bars.getMatrixAt(index, matrix);
        const lower = new THREE.Vector3(0, -0.5, 0).applyMatrix4(matrix);
        const upper = new THREE.Vector3(0, 0.5, 0).applyMatrix4(matrix);
        endpointError = Math.max(endpointError, lower.distanceTo(model.points[a]), upper.distanceTo(model.points[b]));
        radialX.setFromMatrixColumn(matrix, 0);
        radialZ.setFromMatrixColumn(matrix, 2);
        radiusError = Math.max(radiusError, Math.abs(radialX.length() - 1), Math.abs(radialZ.length() - 1));
        minimumLength = Math.min(minimumLength, model.points[a].distanceTo(model.points[b]));
        assert.ok(matrix.elements.every(Number.isFinite));
    });
}
assert.ok(poseError < 1e-12, `Source centers changed: ${poseError}`);
assert.ok(endpointError < 1e-7, `Bar detached: ${endpointError}`);
assert.ok(radiusError < 1e-7, `Bar radius changed: ${radiusError}`);
assert.ok(minimumLength > 1e-6);
const start = new Float64Array(48), end = new Float64Array(48);
loop.sample(0, start); loop.sample(loop.duration, end);
assert.deepEqual(start, end);
const epsilon = 1e-6, before = new Float64Array(48), after = new Float64Array(48);
loop.sample(-epsilon, before); loop.sample(epsilon, after);
let seamPositionError = 0, seamTangentError = 0;
for (let i = 0; i < 48; i++) {
    seamPositionError = Math.max(seamPositionError, Math.abs(before[i] - after[i]));
    seamTangentError = Math.max(seamTangentError, Math.abs((start[i] - before[i]) / epsilon - (after[i] - start[i]) / epsilon));
}
assert.ok(seamPositionError < 1e-5);
assert.ok(seamTangentError < 1e-4);
for (const [width, height, x, y, slot] of [[1440,900,1000,485,708], [863,871,568,460,430], [390,844,183,610,318]]) {
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 150);
    camera.position.set(2.8, 1.65, 8); camera.lookAt(0,0,0);
    frameIntroCamera(camera, width, height, x, y, slot);
    camera.updateMatrixWorld();
    const center = new THREE.Vector3().project(camera);
    assert.ok(Math.abs((center.x + 1) * width / 2 - x) < 1e-9);
    assert.ok(Math.abs((1 - center.y) * height / 2 - y) < 1e-9);
}
const floor = createFloor();
assert.ok(floor.geometry.parameters.width / 2 > 65 * 10, 'Floor edge must lie beyond its fade distance');
console.log(JSON.stringify({ sourcePoses: rig.poses.length, checkedBarPoses: 4001 * 32,
    poseError, endpointError, radiusError, minimumLength, seamPositionError, seamTangentError,
    loopSeconds: loop.duration / PLAYBACK_RATE, cameraFraming: 'desktop/tablet/mobile passed' }, null, 2));
