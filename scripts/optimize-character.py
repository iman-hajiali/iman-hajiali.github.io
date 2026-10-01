"""Export a lower-poly web review GLB without modifying the source blend.

Usage: blender -b iman-site-motion-v1.blend -P optimize-character.py -- output.glb
"""

import json
import sys
from pathlib import Path

import bpy


def main():
    marker = sys.argv.index("--")
    target = Path(sys.argv[marker + 1]).resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    mesh = bpy.data.objects["Replacement_GL_B_Original_Texture_Preserved"]
    rig = bpy.data.objects["Iman_Test_Armature"]
    before = len(mesh.data.polygons)

    reduction = mesh.modifiers.new("Web geometry reduction", "DECIMATE")
    reduction.ratio = 0.55
    reduction.use_collapse_triangulate = True
    # Simplify the base geometry before the armature deforms it.
    bpy.context.view_layer.objects.active = mesh
    for _ in range(len(mesh.modifiers) - 1):
        bpy.ops.object.modifier_move_up(modifier=reduction.name)
    mesh.select_set(True)
    bpy.ops.object.modifier_apply(modifier=reduction.name)
    after = len(mesh.data.polygons)

    bpy.context.scene.frame_set(1)
    if mesh.parent is not rig:
        world = mesh.matrix_world.copy()
        mesh.parent = rig
        mesh.matrix_world = world
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    mesh.hide_render = False
    rig.hide_render = False
    result = bpy.ops.export_scene.gltf(
        filepath=str(target),
        export_format="GLB",
        use_selection=True,
        export_animations=True,
        export_frame_range=True,
        export_animation_mode="ACTIONS",
        export_skins=True,
        export_materials="EXPORT",
        export_texcoords=True,
        export_normals=True,
        export_image_format="AUTO",
        export_apply=True,
        export_cameras=False,
        export_lights=False,
        export_extras=False,
    )
    print("WEB_EXPORT=" + json.dumps({
        "result": list(result),
        "source_faces": before,
        "optimized_faces": after,
        "target": str(target),
        "bytes": target.stat().st_size,
    }))


if __name__ == "__main__":
    main()
