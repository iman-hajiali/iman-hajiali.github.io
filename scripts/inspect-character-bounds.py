"""Report the skinned source mesh's vertical bounds in Blender metres."""

import bpy

obj = bpy.data.objects["Replacement_GL_B_Original_Texture_Preserved"]
for frame in (18, 100, 130, 178):
    bpy.context.scene.frame_set(frame)
    evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh = evaluated.to_mesh()
    zs = [(evaluated.matrix_world @ vertex.co).z for vertex in mesh.vertices]
    print(f"BOUNDS frame={frame} min_z={min(zs):.5f} max_z={max(zs):.5f}")
    evaluated.to_mesh_clear()
