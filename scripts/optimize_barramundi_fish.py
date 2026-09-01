import bpy
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
source=ROOT/"assets"/"external"/"khronos"/"BarramundiFish.glb"
target=ROOT/"public"/"hero"/"aquarium"/"small-fish.glb"
bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
meshes=[obj for obj in bpy.context.scene.objects if obj.type=="MESH"]
largest=max(meshes,key=lambda obj:len(obj.data.vertices)); largest.name="FishBody"
for obj in meshes:
    if len(obj.data.vertices)>1500:
        bpy.context.view_layer.objects.active=obj; obj.select_set(True)
        modifier=obj.modifiers.new("Web Decimation","DECIMATE"); modifier.ratio=.48
        bpy.ops.object.modifier_apply(modifier=modifier.name); obj.select_set(False)
for image in bpy.data.images:
    width,height=image.size
    if max(width,height)>1024:
        ratio=1024/max(width,height); image.scale(max(1,int(width*ratio)),max(1,int(height*ratio)))
bpy.ops.export_scene.gltf(filepath=str(target),export_format="GLB",export_apply=True,export_animations=True,export_materials="EXPORT",export_yup=True,export_image_format="JPEG",export_jpeg_quality=72)
print("Optimized Barramundi fish exported",target.stat().st_size)
