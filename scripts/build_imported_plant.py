import bpy
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
source=ROOT/"assets"/"external"/"polyhaven"/"fern_02"/"fern_02.gltf"
target=ROOT/"public"/"hero"/"aquarium"/"small-plant.glb"
bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
meshes=[obj for obj in bpy.context.scene.objects if obj.type=="MESH"]
keep=max(meshes,key=lambda obj:len(obj.data.vertices)); keep.name="RealJavaFern"
for obj in meshes:
    if obj!=keep: bpy.data.objects.remove(obj,do_unlink=True)
keep.location=(0,0,0)
for image in bpy.data.images:
    width,height=image.size
    if max(width,height)>512:
        ratio=512/max(width,height); image.scale(max(1,int(width*ratio)),max(1,int(height*ratio)))
bpy.ops.export_scene.gltf(filepath=str(target),export_format="GLB",export_apply=True,export_animations=False,export_materials="EXPORT",export_yup=True,export_image_format="AUTO",export_jpeg_quality=74)
print("Realistic fern exported",target.stat().st_size)
