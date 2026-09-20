import {
  ACESFilmicToneMapping, AnimationMixer, Box3, DirectionalLight, Group,
  HemisphereLight, Mesh, OrthographicCamera, PCFShadowMap, PlaneGeometry,
  Scene, ShadowMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function releaseModel(root) {
  const textures = new Set(), materials = new Set(), geometries = new Set(), skeletons = new Set();
  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.skeleton) skeletons.add(object.skeleton);
    for (const material of [object.material].flat().filter(Boolean)) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  textures.forEach((texture) => { texture.source.data?.close?.(); texture.dispose(); });
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
  skeletons.forEach((skeleton) => skeleton.dispose());
}

export async function mountCat(canvas) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    return () => {}; // Optional decoration on devices without WebGL.
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const scene = new Scene();
  const camera = new OrthographicCamera(-1.7, 1.7, 1.36, -1.36, 0.1, 30);
  camera.position.set(3, 1.97, 5);
  camera.lookAt(0, 1.27, 0);
  scene.add(new HemisphereLight(0xfff4e5, 0x777f95, 2.4));
  const key = new DirectionalLight(0xfff1dc, 3.2);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -3;
  key.shadow.camera.right = key.shadow.camera.top = 3;
  key.shadow.normalBias = 0.025;
  key.shadow.bias = -0.0002;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new DirectionalLight(0xdceaff, 1.8);
  fill.position.set(3, 3, -4);
  scene.add(fill);
  const floor = new Mesh(new PlaneGeometry(12, 12), new ShadowMaterial({ opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.015;
  floor.receiveShadow = true;
  scene.add(floor);
  let gltf;
  try {
    gltf = await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/cat/companion.glb`);
  } catch (error) {
    releaseModel(scene);
    key.shadow.dispose();
    renderer.dispose();
    throw error;
  }
  const model = gltf.scene;
  model.rotation.x = Math.PI;
  model.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(model);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const pivot = new Group();
  model.position.sub(new Vector3(center.x, bounds.min.y, center.z));
  pivot.add(model);
  pivot.scale.setScalar(1.75 / size.y);
  pivot.rotation.y = Math.PI - 0.25;
  scene.add(pivot);
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.frustumCulled = false;
    for (const material of [object.material].flat()) {
      material.flatShading = false;
      if (material.map) material.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    }
  });
  const mixer = new AnimationMixer(model);
  if (gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let last = 0;
  let disposed = false;
  const render = () => renderer.render(scene, camera);
  const frame = (now) => {
    if (last) mixer.update(Math.min((now - last) / 1000, 0.05));
    last = now;
    render();
  };
  const syncMotion = () => {
    last = 0;
    renderer.setAnimationLoop(!document.hidden && !motion.matches ? frame : null);
    if (motion.matches) mixer.setTime(0);
    render();
  };
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.left = -1.36 * width / height;
    camera.right = -camera.left;
    camera.updateProjectionMatrix();
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  motion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  const contextLost = (event) => { event.preventDefault(); renderer.setAnimationLoop(null); };
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', syncMotion);
  resize();
  syncMotion();
  canvas.dataset.catReady = 'true';
  return () => {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    observer.disconnect();
    motion.removeEventListener('change', syncMotion);
    document.removeEventListener('visibilitychange', syncMotion);
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', syncMotion);
    mixer.stopAllAction();
    mixer.uncacheRoot(model);
    releaseModel(scene);
    key.shadow.dispose();
    renderer.dispose();
    delete canvas.dataset.catReady;
  };
}
