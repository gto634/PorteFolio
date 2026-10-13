"""Extract the supplied Blender joints and their animation without morphing bars.

blender --background --disable-autoexec sources/hypercube/Hypercube.blend --python tools/hypercube/export-hypercube-rig.py
This reads the source without saving it. The 16 spheres and 32 cylinders retain
their original centers, connections, radii and every supplied animation pose.
"""
import bpy
import hashlib
import json
import numpy as np
from pathlib import Path

root = Path(__file__).resolve().parents[2]
obj = next(o for o in bpy.context.scene.objects if o.type == 'MESH' and o.data.shape_keys)
keys = list(obj.data.shape_keys.key_blocks)
adj = [set() for _ in obj.data.vertices]
for edge in obj.data.edges:
    a, b = edge.vertices
    adj[a].add(b)
    adj[b].add(a)
remaining = set(range(len(adj)))
components = []
while remaining:
    stack = [remaining.pop()]
    ids = []
    while stack:
        i = stack.pop()
        ids.append(i)
        for neighbour in adj[i]:
            if neighbour in remaining:
                remaining.remove(neighbour)
                stack.append(neighbour)
    components.append(sorted(ids))

# These component sizes describe the actual supplied icospheres and cylinders.
joints = [ids for ids in components if len(ids) == 162]
bars = [ids for ids in components if len(ids) == 44]
if len(joints) != 16 or len(bars) != 32:
    raise RuntimeError('Unexpected source topology; recheck joint extraction.')
basis = np.array([list(p.co) for p in keys[0].data])
centers = np.array([basis[ids].mean(axis=0) for ids in joints])
edges = []
max_endpoint_error = 0
for ids in bars:
    points = basis[ids]
    centered = points - points.mean(axis=0)
    _, vectors = np.linalg.eigh(centered.T @ centered)
    projections = centered @ vectors[:, -1]
    caps = [points[projections < 0].mean(axis=0), points[projections > 0].mean(axis=0)]
    ends = []
    for cap in caps:
        distances = np.linalg.norm(centers - cap, axis=1)
        ends.append(int(distances.argmin()))
        max_endpoint_error = max(max_endpoint_error, float(distances.min()))
    edges.append(sorted(ends))
if max_endpoint_error > 1e-6 or len({tuple(e) for e in edges}) != 32:
    raise RuntimeError('Source bars could not be matched to their joints.')

# Blender Y +90 degrees then Blender-to-web axes: (x,y,z) -> (z,-x,-y).
poses = []
for key in keys:
    vertices = np.array([list(p.co) for p in key.data])
    pose = np.array([vertices[ids].mean(axis=0) for ids in joints])
    poses.append(pose[:, [2, 0, 1]] * [1, -1, -1])
closing_error = float(np.max(np.abs(poses[-1] - poses[0])))
if closing_error > 1e-6:
    raise RuntimeError('The supplied center tracks do not close.')
poses[-1] = poses[0].copy()
joint_radius = float(np.mean(np.linalg.norm(basis[joints[0]] - centers[0], axis=1)))
result = {
    'source': Path(bpy.data.filepath).relative_to(root).as_posix(),
    'source_sha256': hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest(),
    'duration': (len(poses) - 1) / 24,
    'joint_radius': round(joint_radius, 8),
    'bar_radius': 0.01,
    'edges': edges,
    'poses': [[[round(float(v), 8) for v in center] for center in pose] for pose in poses],
}
path = root / 'assets/models/hypercube-rig.json'
path.write_text(json.dumps(result, separators=(',', ':')) + '\n', encoding='utf-8')
print('HYPERCUBE_RIG', json.dumps({'joints': len(joints), 'bars': len(edges), 'poses': len(poses),
    'endpoint_error': max_endpoint_error, 'loop_error': closing_error, 'bytes': path.stat().st_size}))
