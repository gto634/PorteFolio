// Interpolate joint centers only. Bars stay rigid and their normals never morph.
// The duplicated final pose is omitted; periodic neighbours keep the seam smooth.
export const PLAYBACK_RATE = 0.0625;

export function createVertexLoop(rig) {
    const count = rig.poses.length - 1;
    const size = rig.poses[0].length * 3;
    const values = rig.poses.map(pose => pose.flat());
    const duration = rig.duration;
    if (count < 3 || size !== 48 || duration <= 0 || values.some(pose => pose.length !== size)) {
        throw new Error('Invalid hypercube joint sequence');
    }
    return {
        duration,
        size,
        sample(time, output) {
            const phase = ((time % duration) + duration) % duration / duration * count;
            const pose = Math.floor(phase);
            const t = phase - pose, t2 = t * t, t3 = t2 * t;
            const coefficients = [
                -0.5 * t + t2 - 0.5 * t3,
                1 - 2.5 * t2 + 1.5 * t3,
                0.5 * t + 2 * t2 - 1.5 * t3,
                -0.5 * t2 + 0.5 * t3,
            ];
            for (let coordinate = 0; coordinate < size; coordinate++) {
                let value = 0;
                for (let neighbour = 0; neighbour < 4; neighbour++) {
                    const index = (pose + neighbour - 1 + count) % count;
                    value += coefficients[neighbour] * values[index][coordinate];
                }
                output[coordinate] = value;
            }
        },
    };
}
