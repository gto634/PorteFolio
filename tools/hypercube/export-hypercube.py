"""Export the supplied Blender morphs as a complete, seamless web loop.

Run from the repository:
blender --background --disable-autoexec sources/hypercube/Hypercube.blend --python tools/hypercube/export-hypercube.py
The source .blend is read only; all changes stay in the export session.
"""
import bpy
import gzip
import hashlib
import json
import math
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parents[2]
output = root / 'assets' / 'models'
output.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
model = next(obj for obj in scene.objects if obj.type == 'MESH' and obj.data.shape_keys)
keys = model.data.shape_keys
targets = list(keys.key_blocks)[1:]
if not targets:
    raise RuntimeError('The source model has no animated morph targets.')
# Match the web model's smaller joints in the GLB and loading poster as well.
# Work on each disconnected source sphere, preserving its animated center.
adjacency = [set() for _ in model.data.vertices]
for edge in model.data.edges:
    a, b = edge.vertices
    adjacency[a].add(b)
    adjacency[b].add(a)
remaining = set(range(len(adjacency)))
while remaining:
    pending = [remaining.pop()]
    component = []
    while pending:
        index = pending.pop()
        component.append(index)
        for neighbour in adjacency[index]:
            if neighbour in remaining:
                remaining.remove(neighbour)
                pending.append(neighbour)
    if len(component) == 162:
        for key in keys.key_blocks:
            center = sum((key.data[i].co for i in component), Vector()) / len(component)
            for i in component:
                key.data[i].co = center + (key.data[i].co - center) * 0.85
closing_error = max((a.co - b.co).length for a, b in zip(keys.key_blocks[0].data, targets[-1].data))
if closing_error > 0.00001:
    raise RuntimeError(f'The final morph does not close the supplied loop: {closing_error}')
# Remove the source's tiny floating-point error at the duplicated endpoint.
for basis, endpoint in zip(keys.key_blocks[0].data, targets[-1].data):
    endpoint.co = basis.co

# The supplied timeline uses only the first half of the stored morph sequence.
# Retain every supplied position and restore the complete sequence, including
# its final target, which coincides with Basis to floating-point precision.
model.animation_data_clear()
keys.animation_data_clear()
scene.frame_start = 1
scene.frame_end = len(targets) + 1
scene.render.fps = 24
scene.render.fps_base = 1
for index, key in enumerate(targets, start=2):
    key.value = 0
    for frame in sorted({1, max(1, index - 1), index, min(scene.frame_end, index + 1), scene.frame_end}):
        key.value = 1 if frame == index else 0
        key.keyframe_insert(data_path='value', frame=frame)
action = keys.animation_data.action
action.name = 'Hypercube_Loop'
for layer in action.layers:
    for strip in layer.strips:
        for bag in strip.channelbags:
            for curve in bag.fcurves:
                for point in curve.keyframe_points:
                    point.interpolation = 'LINEAR'
scene.frame_set(1)
model.name = 'Hypercube'
# Blender Y maps to glTF -Z: this quarter-turn makes the upward morph move right.
model.rotation_mode = 'XYZ'
model.rotation_euler.rotate_axis('Y', math.pi / 2)

material = bpy.data.materials.new('Portfolio_Pink')
material.diffuse_color = (0.9301, 0.4910, 0.6239, 1)
shader = material.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value = material.diffuse_color
shader.inputs['Metallic'].default_value = 0.08
shader.inputs['Roughness'].default_value = 0.5
model.data.materials.clear()
model.data.materials.append(material)
for obj in bpy.context.selected_objects:
    obj.select_set(False)
model.select_set(True)
bpy.context.view_layer.objects.active = model
glb = output / 'hypercube.glb'
bpy.ops.export_scene.gltf(
    filepath=str(glb), export_format='GLB', use_selection=True,
    export_animation_mode='ACTIVE_ACTIONS', export_frame_range=True,
    export_nla_strips_merged_animation_name='Hypercube_Loop',
    export_anim_slide_to_zero=True,
    export_force_sampling=False, export_optimize_animation_size=True,
    export_morph=True, export_morph_normal=True, export_morph_tangent=False,
    export_cameras=False, export_lights=False,
)
raw = glb.read_bytes()
(output / 'hypercube.glb.gz').write_bytes(gzip.compress(raw, compresslevel=9, mtime=0))
metadata = {
    'source': Path(bpy.data.filepath).relative_to(root).as_posix(),
    'source_sha256': hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest(),
    'animation': 'Hypercube_Loop',
    'frames': [scene.frame_start, scene.frame_end],
    'fps': scene.render.fps,
    'duration_seconds': (scene.frame_end - scene.frame_start) / scene.render.fps,
    'morph_targets': len(targets),
    'joint_radius_scale': 0.85,
    'loop_endpoint_max_error': closing_error,
    'orientation': 'rightward morph; Blender Y +90 degrees',
    'glb_bytes': len(raw),
    'gzip_bytes': (output / 'hypercube.glb.gz').stat().st_size,
}
(output / 'hypercube.json').write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
print('HYPERCUBE_EXPORT', json.dumps(metadata))

# A transparent render of the same mesh provides the no-JS/loading fallback.
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 768
scene.render.resolution_y = 768
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = str(output / 'hypercube-poster.png')
scene.view_settings.view_transform = 'AgX'
world = bpy.data.worlds.new('Portfolio_World')
world.node_tree.nodes.get('Background').inputs['Color'].default_value = (0.35, 0.30, 0.42, 1)
world.node_tree.nodes.get('Background').inputs['Strength'].default_value = 0.45
scene.world = world
camera_data = bpy.data.cameras.new('Portfolio_Camera')
camera = bpy.data.objects.new('Portfolio_Camera', camera_data)
scene.collection.objects.link(camera)
camera.location = (0.2, -1.2, 0.1083333333)
camera.rotation_euler = (-camera.location).to_track_quat('-Z', 'Y').to_euler()
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 3.1 * 0.3933333456516266 / 2.4
scene.camera = camera
for name, position, energy, color in (
    ('Key', (0.4, -0.7, 1), 10, (1, 0.85, 0.91)),
    ('Fill', (-0.8, -0.4, 0.3), 5, (0.75, 0.72, 1)),
    ('Rim', (0.5, 0.8, 0.7), 12, (1, 0.65, 0.8)),
):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.color = color
    data.shape = 'DISK'
    data.size = 0.75
    light = bpy.data.objects.new(name, data)
    scene.collection.objects.link(light)
    light.location = position
    light.rotation_euler = (-light.location).to_track_quat('-Z', 'Y').to_euler()
bpy.ops.render.render(write_still=True)
