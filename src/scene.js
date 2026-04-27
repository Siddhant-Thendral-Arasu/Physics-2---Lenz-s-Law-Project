//Scene: Sets up the canvas, scene, and objects
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { SpriteMaterial, Sprite } from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = true;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -2, 0);
    controls.enableDamping = true;

    camera.position.z = 5;

    const light = new THREE.PointLight(0xffffff, 85);
    light.position.set(5, 5, 5);
    const light2 = new THREE.PointLight(0xffffff, 42.5);
    light2.position.set(-5, -5, -5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 100);
    scene.add(ambientLight, light, light2);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return { scene, camera, renderer, controls };
}

export function createMagnet(scene) {
    const magnetGroup = new THREE.Group();

    const g1 = new THREE.BoxGeometry(1.3, 1.5, 0.3);
    const m1 = new THREE.MeshStandardMaterial({ color: 0x0077ff, metalness: 1.0, roughness: 0.45, envMap: scene.environment });
    const halfOne = new THREE.Mesh(g1, m1);
    halfOne.position.y = -0.75;
    
    const g2 = new THREE.BoxGeometry(1.3, 1.5, 0.3);
    const m2 = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 1.0, roughness: 0.45, envMap: scene.environment });
    const halfTwo = new THREE.Mesh(g2, m2);
    halfTwo.position.y = 0.75;

    magnetGroup.add(halfOne, halfTwo);

    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0);
    arrowShape.lineTo(0.2/2.5, 0);
    arrowShape.lineTo(0.2/2.5, 0.4+0.5);
    arrowShape.lineTo(0.35/2.5, 0.4+0.5);
    arrowShape.lineTo(0, 0.7+0.5);
    arrowShape.lineTo(-0.35/2.5, 0.4+0.5);
    arrowShape.lineTo(-0.2/2.5, 0.4+0.5);
    arrowShape.lineTo(-0.2/2.5, 0);
    arrowShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
    const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0x08E8DE });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(0.012, -0.6, 0.075);
    magnetGroup.add(arrow);

    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
      const tg1 = new TextGeometry('N', {
        font: font,
        size: 0.5,
        depth: 0.1,
      });
      const tm1 = new THREE.MeshStandardMaterial({ color: 0x222222 });
      const northText = new THREE.Mesh(tg1, tm1);
      northText.position.set(-0.2, 0.9, 0.075);
      magnetGroup.add(northText);
    
      const tg2 = new TextGeometry('S', {
        font: font,
        size: 0.5,
        depth: 0.1,
      });
      const tm2 = new THREE.MeshStandardMaterial({ color: 0x222222 });
      const southText = new THREE.Mesh(tg2, tm2);
      southText.position.set(-0.2, -1.4, 0.075);
      magnetGroup.add(southText);
    });

    scene.add(magnetGroup);
    return { magnet: magnetGroup, internalArrow: arrow };
}

export function createTorus(scene) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.1, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 1.0, roughness: 0.45, envMap: scene.environment })
    );
    torus.position.set(0, -3, -0);
    torus.rotateX(Math.PI / 2);
    scene.add(torus);
    return torus;
}

export function buildFieldArrows(scene, count, radius) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(0, 170, 255, 1)');
    gradient.addColorStop(1, 'rgba(0, 170, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const glowTexture = new THREE.CanvasTexture(canvas);
    const glowMaterial = new SpriteMaterial({
        map: glowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const fieldArrows = [];
    
    const fieldArrowShape = new THREE.Shape();
    fieldArrowShape.moveTo(0, -0.15);
    fieldArrowShape.lineTo(0.06, -0.15);
    fieldArrowShape.lineTo(0.06, 0.05);
    fieldArrowShape.lineTo(0.12, 0.05);
    fieldArrowShape.lineTo(0, 0.15);
    fieldArrowShape.lineTo(-0.12, 0.05);
    fieldArrowShape.lineTo(-0.06, 0.05);
    fieldArrowShape.lineTo(-0.06, -0.15);
    fieldArrowShape.lineTo(0, -0.15);
    
    const fieldArrowGeometry = new THREE.ShapeGeometry(fieldArrowShape);
    const fieldArrowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00aaff,
      emissive: 0x00aaff,
      emissiveIntensity: 1,
      side: THREE.DoubleSide
    });
    
    for (let i = 0; i < count; i++) {
      const arrow = new THREE.Mesh(fieldArrowGeometry, fieldArrowMaterial);
      const glow = new Sprite(glowMaterial);
      glow.scale.set(0.5, 0.5, 0.5);
      arrow.add(glow);
      fieldArrows.push(arrow);
      scene.add(arrow);
    }
    return fieldArrows;
}

export function createChevronColumn(scene, x, y, color, up, top, bottom, height, count) {
  const group = new THREE.Group();
  const chevrons = [];
  
  const shape = new THREE.Shape();
  shape.moveTo(-0.2, 0.1); shape.lineTo(-0.2, -0.075); shape.lineTo(0, -0.175);
  shape.lineTo(0.2, -0.075); shape.lineTo(0.2, 0.1); shape.lineTo(0, 0);

  const mat = new THREE.MeshStandardMaterial({
    color: color,
    side: THREE.DoubleSide,
    clippingPlanes: [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), top + y),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -(bottom + y) - 0.3)
    ]
  });

  const geo = new THREE.ShapeGeometry(shape);

  for (let i = 0; i < count; i++) {
    const c = new THREE.Mesh(geo, mat);
    c.rotation.z = up ? Math.PI : 0;
    c.position.set(x, bottom + (i/count) * height, 0);
    group.add(c);
    chevrons.push(c);
  }
  scene.add(group);
  return { group, chevrons, material: mat, y, offset: 0 };
}

export function buildRowChevrons(scene, count, spacing) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.2, 0.1); shape.lineTo(-0.2, -0.075); shape.lineTo(0, -0.175);
  shape.lineTo(0.2, -0.075); shape.lineTo(0.2, 0.1); shape.lineTo(0, 0);

  const mat = new THREE.MeshStandardMaterial({ color: 0x100026, side: THREE.DoubleSide });
  const geo = new THREE.ShapeGeometry(shape);
  const rows = [];

  for (let i = 0; i < count; i++) {
    const c = new THREE.Mesh(geo, mat);
    // Initial position is handled in main animation loop
    scene.add(c);
    rows.push(c);
  }
  return rows;
}