<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const open = ref(false);
const canvasHost = ref<HTMLElement>();
const closeButton = ref<HTMLButtonElement>();
const foodCount = ref(0);
const plantCount = ref(24);
const status = ref("Double-click the water to feed the fish");
let cleanupScene: (() => void) | undefined;

function showAquarium() { open.value = true; }
function hideAquarium() { open.value = false; }
function onKeydown(event: KeyboardEvent) { if (event.key === "Escape" && open.value) hideAquarium(); }

function createAquarium(host: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x263431);
  scene.fog = new THREE.FogExp2(0x759b95, .012);
  const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, .1, 100);
  camera.position.set(0, 3.35, 13.4);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false; controls.minDistance = 10.5; controls.maxDistance = 16;
  controls.minPolarAngle = Math.PI * .3; controls.maxPolarAngle = Math.PI * .58; controls.target.set(0, 1.65, 0);

  scene.add(new THREE.HemisphereLight(0xf4fff9, 0x31433a, 2.25));
  const topLight = new THREE.DirectionalLight(0xfff4dc, 4.2); topLight.position.set(-3, 10, 6); scene.add(topLight);
  const fillLight = new THREE.DirectionalLight(0xb9dfff, 2.1); fillLight.position.set(7, 4, 8); scene.add(fillLight);
  const glow = new THREE.PointLight(0xd7fff4, 10, 18); glow.position.set(-4, 5, 3); scene.add(glow);

  const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc8f4ee, transparent: true, opacity: .065, transmission: .88, roughness: .06, side: THREE.DoubleSide });
  const tank = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 7), glassMaterial); tank.position.y = 3.45; scene.add(tank);
  const waterGeometry = new THREE.PlaneGeometry(11.78, 6.78, 42, 24); waterGeometry.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(waterGeometry, new THREE.MeshPhysicalMaterial({ color: 0x8ee9d8, transparent: true, opacity: .28, transmission: .82, roughness: .12, metalness: .02, clearcoat: 1, clearcoatRoughness: .08, side: THREE.DoubleSide }));
  water.position.y = 6.86; scene.add(water);
  const rim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(12.08, 7.08, 7.08)), new THREE.LineBasicMaterial({ color: 0xb6fff0, transparent: true, opacity: .28 })); rim.position.y = 3.45; scene.add(rim);

  const textureLoader = new THREE.TextureLoader();
  const soilMap = textureLoader.load("/hero/aquarium/textures/soil.jpg");
  const mossMap = textureLoader.load("/hero/aquarium/textures/moss.jpg");
  for (const texture of [soilMap, mossMap]) { texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(4.5, 2.8); texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); }
  const soil = new THREE.Mesh(new THREE.BoxGeometry(11.45, .38, 6.35), new THREE.MeshStandardMaterial({ map: soilMap, color: 0x665846, roughness: .98 }));
  soil.position.y = .08; scene.add(soil);
  const mossCover = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 6.08, 26, 16), new THREE.MeshStandardMaterial({ map: mossMap, color: 0x5d7c4d, roughness: 1 }));
  mossCover.rotation.x = -Math.PI / 2; mossCover.position.y = .285; scene.add(mossCover);

  type FishAgent = { mesh: THREE.Group; tail?: THREE.Object3D; velocity: THREE.Vector3; phase: number; wander: THREE.Vector3 };
  const fishes: FishAgent[] = [];
  const plants: THREE.Object3D[] = [];
  let plantTemplate: THREE.Group | undefined;
  let disposed = false;
  const loader = new GLTFLoader();
  loader.load("/hero/aquarium/aquascape.glb", ({ scene: aquascape }) => {
    if (disposed) return;
    aquascape.name = "Blender aquascape";
    aquascape.traverse((child) => {
      if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; }
      if (/moss|carpet|grass|fern/i.test(child.name)) {
        if (/grass|fern/i.test(child.name) && Math.random() < .62) child.visible = false;
        else { child.userData.phase = Math.random() * Math.PI * 2; plants.push(child); }
      }
    });
    scene.add(aquascape); status.value = "The aquascape is alive — tap the water to feed";
  }, undefined, () => { status.value = "The aquascape could not be loaded"; });
  loader.load("/hero/aquarium/small-plant.glb", ({ scene: model }) => { plantTemplate = model; });
  loader.load("/hero/aquarium/small-fish.glb", ({ scene: model }) => {
    if (disposed) return;
    for (let index = 0; index < 18; index++) {
      const fish = model.clone(true);
      fish.name = `Blender fish ${index + 1}`;
      fish.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = child.material.clone();
        }
      });
      fish.position.set(-4.5 + Math.random() * 9, 1.25 + Math.random() * 4.35, -2.45 + Math.random() * 4.9);
      const fishSize = new THREE.Box3().setFromObject(fish).getSize(new THREE.Vector3());
      const targetLength = .58 + Math.random() * .22;
      fish.scale.setScalar(targetLength / Math.max(fishSize.x, fishSize.y, fishSize.z)); scene.add(fish);
      fishes.push({ mesh: fish, tail: fish.getObjectByName("FishTail"), velocity: new THREE.Vector3((Math.random() > .5 ? 1 : -1) * (.5 + Math.random() * .18), (Math.random() - .5) * .08, (Math.random() - .5) * .16), phase: Math.random() * 10, wander: new THREE.Vector3() });
    }
  }, undefined, () => { status.value = "The fish could not be loaded"; });

  const foods: Array<{ mesh: THREE.Mesh; age: number }> = [];
  const foodMaterial = new THREE.MeshStandardMaterial({ color: 0xffd35a, emissive: 0x6b3d00 });
  function feedAt(x: number, z: number) {
    for (let i = 0; i < 7; i++) {
      const pellet = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), foodMaterial);
      pellet.position.set(x + (Math.random() - .5) * .7, 6.7 + Math.random() * .3, z + (Math.random() - .5) * .7); scene.add(pellet); foods.push({ mesh: pellet, age: 0 });
    }
    foodCount.value += 7; status.value = "Dinner time — the fish are coming!";
  }
  function feedCenter() { feedAt((Math.random() - .5) * 4, (Math.random() - .5) * 2); }
  function growPlant() {
    if (!plantTemplate) { status.value = "The new plant is still acclimating"; return; }
    const plant = plantTemplate.clone(true); plant.position.set(-4.3 + Math.random() * 8.6, .22, -2.25 + Math.random() * 4.5); plant.rotation.y = Math.random() * Math.PI * 2; plant.scale.setScalar(.75 + Math.random() * .45); plant.userData.phase = Math.random() * Math.PI * 2; scene.add(plant); plants.push(plant); plantCount.value++; status.value = "A new Java fern has been planted";
  }

  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2(); const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -3.2);
  function onCanvasClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest("button")) return;
    const rect = renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera); const point = new THREE.Vector3(); raycaster.ray.intersectPlane(plane, point); feedAt(THREE.MathUtils.clamp(point.x, -5, 5), THREE.MathUtils.clamp(point.z, -3, 3));
  }
  renderer.domElement.addEventListener("dblclick", onCanvasClick);
  (host as HTMLElement & { feedCenter?: () => void; growPlant?: () => void }).feedCenter = feedCenter;
  (host as HTMLElement & { feedCenter?: () => void; growPlant?: () => void }).growPlant = growPlant;

  const bubbles = Array.from({ length: 28 }, () => { const bubble = new THREE.Mesh(new THREE.SphereGeometry(.035 + Math.random() * .055, 8, 8), new THREE.MeshBasicMaterial({ color: 0xb9fff0, transparent: true, opacity: .58 })); bubble.position.set(-5 + Math.random() * 10, Math.random() * 6, -3 + Math.random() * 6); scene.add(bubble); return bubble; });
  const clock = new THREE.Clock(); let frame = 0;
  function animate() {
    frame = requestAnimationFrame(animate); const dt = Math.min(clock.getDelta(), .04); const elapsed = clock.elapsedTime;
    const waterPositions = waterGeometry.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < waterPositions.count; index++) waterPositions.setY(index, Math.sin(waterPositions.getX(index) * 1.35 + elapsed * 1.1) * .045 + Math.cos(waterPositions.getZ(index) * 1.7 + elapsed * .8) * .025);
    waterPositions.needsUpdate = true;
    foods.forEach((food) => { food.mesh.position.y -= dt * .65; food.mesh.position.x += Math.sin(food.age * 3) * dt * .08; food.age += dt; });
    for (let i = foods.length - 1; i >= 0; i--) if (foods[i].mesh.position.y < .25 || foods[i].age > 13) { scene.remove(foods[i].mesh); foods.splice(i, 1); }
    fishes.forEach((fish, fishIndex) => {
      const nearest = foods.reduce<{ mesh: THREE.Mesh; age: number } | undefined>((best, food) => !best || fish.mesh.position.distanceTo(food.mesh.position) < fish.mesh.position.distanceTo(best.mesh.position) ? food : best, undefined);
      const steering = new THREE.Vector3();
      if (nearest) {
        const desired = nearest.mesh.position.clone().sub(fish.mesh.position).normalize().multiplyScalar(1.05);
        steering.add(desired.sub(fish.velocity).clampLength(0, .42));
        if (fish.mesh.position.distanceTo(nearest.mesh.position) < .35) { scene.remove(nearest.mesh); foods.splice(foods.indexOf(nearest), 1); foodCount.value = Math.max(0, foodCount.value - 1); }
      } else {
        fish.wander.set(Math.sin(elapsed * .31 + fish.phase), Math.sin(elapsed * .21 + fish.phase) * .18, Math.cos(elapsed * .27 + fish.phase * 1.7) * .34);
        steering.addScaledVector(fish.wander, .11);
        const neighbours = fishes.filter((other, index) => index !== fishIndex && fish.mesh.position.distanceTo(other.mesh.position) < 2.2);
        if (neighbours.length) {
          const alignment = neighbours.reduce((sum, other) => sum.add(other.velocity), new THREE.Vector3()).divideScalar(neighbours.length).normalize().multiplyScalar(.66);
          const center = neighbours.reduce((sum, other) => sum.add(other.mesh.position), new THREE.Vector3()).divideScalar(neighbours.length);
          steering.add(alignment.sub(fish.velocity).multiplyScalar(.16));
          steering.add(center.sub(fish.mesh.position).normalize().multiplyScalar(.055));
        }
      }
      const margin = new THREE.Vector3(4.65, 5.55, 2.45);
      if (Math.abs(fish.mesh.position.x) > margin.x) steering.x -= Math.sign(fish.mesh.position.x) * .72;
      if (fish.mesh.position.y < 1.0) steering.y += .62; else if (fish.mesh.position.y > margin.y) steering.y -= .62;
      if (Math.abs(fish.mesh.position.z) > margin.z) steering.z -= Math.sign(fish.mesh.position.z) * .72;
      fish.velocity.addScaledVector(steering, dt).clampLength(.38, nearest ? 1.08 : .76);
      fish.mesh.position.addScaledVector(fish.velocity, dt);
      const yaw = Math.atan2(-fish.velocity.z, fish.velocity.x); const pitch = Math.atan2(fish.velocity.y, Math.hypot(fish.velocity.x, fish.velocity.z));
      const targetRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, pitch * .55)); fish.mesh.quaternion.slerp(targetRotation, 1 - Math.exp(-dt * 3.4));
      if (fish.tail) fish.tail.rotation.y = Math.sin(elapsed * (7.2 + fish.velocity.length() * 3) + fish.phase) * .24;
    });
    plants.forEach((plant) => { plant.rotation.z = Math.sin(elapsed * 1.15 + plant.userData.phase) * .045; });
    bubbles.forEach((bubble) => { bubble.position.y += dt * (.2 + bubble.scale.x * .3); if (bubble.position.y > 6.7) bubble.position.y = .2; });
    controls.update(); renderer.render(scene, camera);
  }
  animate();
  const resize = () => { if (!host.clientWidth || !host.clientHeight) return; camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); };
  const observer = new ResizeObserver(resize); observer.observe(host);
  return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); renderer.domElement.removeEventListener("dblclick", onCanvasClick); controls.dispose(); renderer.dispose(); host.replaceChildren(); };
}

function feedFish() { (canvasHost.value as HTMLElement & { feedCenter?: () => void })?.feedCenter?.(); }
function addPlant() { (canvasHost.value as HTMLElement & { growPlant?: () => void })?.growPlant?.(); }

watch(open, async (isOpen) => {
  document.body.classList.toggle("aquarium-is-open", isOpen);
  if (isOpen) { await nextTick(); if (canvasHost.value) cleanupScene = createAquarium(canvasHost.value); closeButton.value?.focus(); }
  else { cleanupScene?.(); cleanupScene = undefined; foodCount.value = 0; plantCount.value = 24; status.value = "Double-click the water to feed the fish"; }
});
window.addEventListener("keydown", onKeydown);
onBeforeUnmount(() => { cleanupScene?.(); window.removeEventListener("keydown", onKeydown); document.body.classList.remove("aquarium-is-open"); });
</script>

<template>
  <svg v-if="!open" class="aquarium-hotspot-map" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet">
    <defs><radialGradient id="aquarium-outer-halo"><stop offset="0%" stop-color="#52ff9b" stop-opacity="0"/><stop offset="79%" stop-color="#52ff9b" stop-opacity="0"/><stop offset="86%" stop-color="#52ff9b" stop-opacity=".34"/><stop offset="100%" stop-color="#52ff9b" stop-opacity="0"/></radialGradient></defs>
    <g class="aquarium-hotspot" role="button" tabindex="0" aria-label="Open the interactive aquarium" @click.stop="showAquarium" @keydown.enter.prevent.stop="showAquarium" @keydown.space.prevent.stop="showAquarium">
      <circle class="aquarium-hotspot__halo" cx="1390" cy="620" r="80"/><circle class="aquarium-hotspot__outline" cx="1390" cy="620" r="64"/>
      <g class="aquarium-hotspot__label"><rect x="1330" y="694" width="120" height="28"/><text x="1390" y="712" text-anchor="middle">Open aquarium</text></g>
    </g>
  </svg>
  <Teleport to="body"><Transition name="aquarium-reveal"><div v-if="open" class="aquarium-app" role="dialog" aria-modal="true" aria-label="Interactive 3D aquarium">
    <div class="aquarium-app__tank"><div ref="canvasHost" class="aquarium-app__canvas" aria-label="3D aquarium. Drag to look around and double-click the water to drop food."/></div>
    <header class="aquarium-app__header"><div><p>Living system · Tank 05</p><h2>Neon reef</h2><small>{{ status }}</small></div><button ref="closeButton" type="button" @click="hideAquarium">Exit aquarium <span>×</span></button></header>
    <aside class="aquarium-app__controls" aria-label="Aquarium controls"><button type="button" @click="feedFish"><span>Feed fish</span><small>{{ foodCount ? `${foodCount} pellets drifting` : 'Drop a small meal' }}</small></button><button type="button" @click="addPlant"><span>Grow a plant</span><small>{{ plantCount }} plants in the habitat</small></button><p>Drag to orbit · scroll to zoom · double-click the tank to feed</p></aside>
  </div></Transition></Teleport>
</template>
