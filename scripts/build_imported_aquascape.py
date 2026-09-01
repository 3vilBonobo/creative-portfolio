import bpy
import math
import random
from pathlib import Path

random.seed(108)
ROOT=Path(__file__).resolve().parents[1]
ASSET_ROOT=ROOT/"assets"/"external"/"polyhaven"
OUT_ROOT=ROOT/"public"/"hero"/"aquarium"
SOURCE_ROOT=ROOT/"assets"/"blender"

def clear():
    bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes,bpy.data.curves,bpy.data.materials,bpy.data.images):
        for item in list(block):
            if item.users==0: block.remove(item)

def import_asset(asset_id):
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(ASSET_ROOT/asset_id/f"{asset_id}.gltf"))
    return [obj for obj in bpy.data.objects if obj not in before and obj.type=="MESH"]

def clone(source,name,location,scale,rotation=(0,0,0)):
    obj=source.copy(); obj.data=source.data; obj.name=name; bpy.context.collection.objects.link(obj)
    obj.hide_render=False; obj.hide_viewport=False
    obj.location=location; obj.scale=scale if isinstance(scale,tuple) else (scale,scale,scale); obj.rotation_euler=rotation
    return obj

def simple_material(name,color,roughness):
    mat=bpy.data.materials.new(name); mat.use_nodes=True
    bsdf=mat.node_tree.nodes.get("Principled BSDF"); bsdf.inputs["Base Color"].default_value=(*color,1); bsdf.inputs["Roughness"].default_value=roughness
    return mat

clear()
rock=import_asset("boulder_01")[0]
rock.name="PH_Boulder_Master"; rock.hide_render=True; rock.hide_viewport=True
bpy.context.view_layer.objects.active=rock; rock.select_set(True)
dec=rock.modifiers.new("Web Decimation","DECIMATE"); dec.ratio=.2
bpy.ops.object.modifier_apply(modifier=dec.name); rock.select_set(False)

wood=import_asset("dead_tree_trunk_02")[0]
wood.name="PH_Deadwood_Master"; wood.hide_render=True; wood.hide_viewport=True
bpy.context.view_layer.objects.active=wood; wood.select_set(True)
dec=wood.modifiers.new("Web Decimation","DECIMATE"); dec.ratio=.28
bpy.ops.object.modifier_apply(modifier=dec.name); wood.select_set(False)

formation=import_asset("coast_land_rocks_03")[0]
formation.name="PH_RockFormation_Master"; formation.hide_render=True; formation.hide_viewport=True
bpy.context.view_layer.objects.active=formation; formation.select_set(True)
dec=formation.modifiers.new("Web Decimation","DECIMATE"); dec.ratio=.055
bpy.ops.object.modifier_apply(modifier=dec.name); formation.select_set(False)

ferns=import_asset("fern_02")
for obj in ferns: obj.hide_render=True; obj.hide_viewport=True
moss_parts=import_asset("moss_01")
for obj in moss_parts: obj.hide_render=True; obj.hide_viewport=True
broad_leaf=import_asset("calathea_orbifolia_01")
bark_parts=import_asset("bark_debris_01")
for obj in [*broad_leaf,*bark_parts]: obj.hide_render=True; obj.hide_viewport=True

soil_mat=simple_material("Wet aquasoil",(.035,.026,.018),.96)
sand_mat=simple_material("Natural river sand",(.39,.31,.19),.91)
bpy.ops.mesh.primitive_cube_add(location=(0,0,-.16)); bed=bpy.context.object; bed.name="Aquasoil substrate"; bed.scale=(5.75,3.12,.28); bed.data.materials.append(soil_mat)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); bevel=bed.modifiers.new("Rounded substrate","BEVEL"); bevel.width=.16; bevel.segments=3
bpy.ops.mesh.primitive_cube_add(location=(0,1.0,.03)); sand=bpy.context.object; sand.name="River sand path"; sand.scale=(.92,1.9,.08); sand.data.materials.append(sand_mat)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); bevel=sand.modifiers.new("Natural path edge","BEVEL"); bevel.width=.42; bevel.segments=6

rock_layout=[
(-4.25,-.45,.38,(1.18,.9,1.38),.05),(-3.25,-.82,.52,(1.2,1.02,1.62),.72),(-2.25,-.55,.34,(.82,.72,1.04),1.4),
(-4.65,.7,.25,(.72,.65,.82),2.1),(-3.55,.55,.26,(.92,.7,.95),2.75),(-2.65,.8,.2,(.62,.58,.72),.4),
(4.2,-.52,.46,(1.15,.88,1.48),2.7),(3.2,-.8,.58,(1.28,.94,1.7),1.95),(2.2,-.42,.3,(.78,.66,1.02),.8),
(4.62,.72,.28,(.72,.63,.9),1.1),(3.55,.62,.24,(.94,.72,1.0),.25),(2.62,.8,.2,(.62,.55,.72),2.45),
]
rocks=[]
for i,(x,y,z,scale,rz) in enumerate(rock_layout): rocks.append(clone(rock,f"Scanned stone {i+1:02d}",(x,y,z),scale,(random.uniform(-.18,.18),random.uniform(-.16,.16),rz)))
clone(formation,"Left layered formation",(-3.45,.45,.05),(.47,.42,.78),(0,.06,-.12))
clone(formation,"Right layered formation",(3.45,.5,.04),(.43,.4,.82),(0,-.08,math.pi+.08))
for i,(x,y,z,scale,rz) in enumerate([(-3.75,-.2,1.45,(1.15,.9,1.7),.4),(-2.75,.0,1.25,(.92,.76,1.45),1.2),(3.75,-.2,1.5,(1.18,.92,1.78),2.6),(2.7,.0,1.28,(.9,.75,1.5),1.8)]):
    rocks.append(clone(rock,f"Upper scanned stone {i+1:02d}",(x,y,z),scale,(random.uniform(-.12,.12),random.uniform(-.12,.12),rz)))

wood_layout=[
((-3.55,.05,.58),(1.18,.58,.58),(0,-.88,.18)),
((-2.65,.18,1.22),(.88,.42,.42),(0,-1.02,.62)),
((-3.05,.48,1.65),(.68,.34,.34),(.12,-1.08,-.48)),
((3.55,.02,.62),(1.18,.58,.58),(0,.88,math.pi-.18)),
((2.62,.18,1.28),(.88,.42,.42),(0,1.03,math.pi-.62)),
((3.02,.48,1.72),(.68,.34,.34),(-.12,1.08,math.pi+.48)),
((0,.55,.34),(.82,.42,.42),(0,-.18,.04)),
]
woods=[]
for i,(location,scale,rotation) in enumerate(wood_layout): woods.append(clone(wood,f"Scanned driftwood {i+1}",location,scale,rotation))

plant_zones=[(-4.4,-1.25),(-3.65,-1.35),(-2.75,-1.0),(-4.35,.7),(-3.2,.8),(-2.25,.62),(4.4,-1.25),(3.55,-1.35),(2.65,-1.0),(4.35,.7),(3.2,.8),(2.25,.62)]
for i in range(28):
    zx,zy=random.choice(plant_zones); source=random.choice(ferns); scale=random.uniform(.55,1.22)
    clone(source,f"Real fern {i+1:03d}",(zx+random.uniform(-.62,.62),zy+random.uniform(-.48,.48),.16+random.uniform(0,.24)),scale,(random.uniform(-.08,.08),random.uniform(-.08,.08),random.random()*math.tau))

for i in range(16):
    side=-1 if i<8 else 1; source=random.choice(broad_leaf); x=side*random.uniform(2.0,4.9); y=random.uniform(-1.8,1.75)
    clone(source,f"Broad aquatic leaf {i+1:02d}",(x,y,.2),random.uniform(.62,1.05),(0,0,random.random()*math.tau))

for i in range(22):
    source=random.choice(bark_parts); x=random.uniform(-4.5,4.5); y=random.uniform(-1.2,1.1)
    clone(source,f"Natural bark detail {i+1:02d}",(x,y,.14+random.random()*.12),random.uniform(1.1,1.8),(random.uniform(-.18,.18),random.uniform(-.18,.18),random.random()*math.tau))

for i in range(96):
    side=-1 if random.random()<.5 else 1
    x=side*random.uniform(1.3,5.25); y=random.uniform(-2.55,2.55)
    if abs(x)<1.65 and y>.15: continue
    source=random.choice(moss_parts); scale=random.uniform(9,22)
    clone(source,f"Real moss {i+1:03d}",(x,y,.12+random.uniform(0,.12)),scale,(random.uniform(-.12,.12),random.uniform(-.12,.12),random.random()*math.tau))

for i,stone in enumerate(rocks):
    for j in range(2):
        source=random.choice(moss_parts); scale=random.uniform(12,25)
        clone(source,f"Stone moss {i+1:02d}-{j+1}",(stone.location.x+random.uniform(-.45,.45),stone.location.y+random.uniform(-.35,.35),stone.location.z+stone.dimensions.z*.42),scale,(0,0,random.random()*math.tau))

wood_moss_zones=[(-3.45,.02,.82),(-3.05,.12,1.35),(-2.72,.22,1.85),(3.45,.02,.86),(3.02,.12,1.42),(2.72,.22,1.92),(-.55,.52,.48),(.55,.52,.48)]
for i in range(30):
    zx,zy,zz=random.choice(wood_moss_zones); source=random.choice(moss_parts)
    clone(source,f"Driftwood moss {i+1:03d}",(zx+random.uniform(-.34,.34),zy+random.uniform(-.2,.2),zz+random.uniform(-.1,.12)),random.uniform(10,18),(random.uniform(-.25,.25),random.uniform(-.25,.25),random.random()*math.tau))

for source in [rock,wood,formation,*ferns,*moss_parts,*broad_leaf,*bark_parts]:
    bpy.data.objects.remove(source,do_unlink=True)

for image in bpy.data.images:
    width,height=image.size
    if max(width,height)>512:
        ratio=512/max(width,height); image.scale(max(1,int(width*ratio)),max(1,int(height*ratio)))

bpy.context.scene.world.color=(.008,.018,.013)
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE_ROOT/"aquascape-imported.blend"))
bpy.ops.export_scene.gltf(filepath=str(OUT_ROOT/"aquascape.glb"),export_format="GLB",export_apply=True,export_animations=False,export_materials="EXPORT",export_yup=True,export_image_format="AUTO",export_jpeg_quality=76)
print("Imported CC0 aquascape exported")
