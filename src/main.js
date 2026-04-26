import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { SpriteMaterial, Sprite } from 'three';
import { or } from 'three/tsl';
document.body.style.margin = '0';
document.body.style.background = 'rgb(0,0,0)';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ui = document.createElement('div');
ui.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center">
      <span style="color:white;font-size:30px;font-family:'Orbitron',sans-serif;margin-right:12px;margin-top:20px;margin-left:40px">Orientation: </span>
      <div style="display:flex;border:2px solid white;border-radius:6px;overflow:hidden;cursor:pointer;margin-top:20px">
        <div id="northBtn" style="padding:8px 16px;color:#333;pointer-events:auto;background:#cbcbcb;font-family:'Orbitron',sans-serif">N</div>
        <div id="southBtn" style="padding:8px 16px;color:white;pointer-events:auto;background:#333;font-family:'Orbitron',sans-serif">S</div>
      </div>
    </div>
    <span style="color:white;font-size:30px;font-family:'Orbitron',sans-serif;margin-right:40px;margin-top:20px">Credits: Siddhant Thendral Arasu</span>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">
    <div style="margin-left:40px;color:white;pointer-events:auto;font-family:'Orbitron',sans-serif;font-size:30px;display:flex;align-items:center">
      Position:
      <input type="range" id="posSlider" min="0" max="6" value="0" step="0.1" style="margin-left:12px;width:150px;accent-color:#cbcbcb">
    </div>
    <div style="display:flex;align-items:center;gap:20px;margin-right:40px">
      <span style="color:white;font-size:30px;font-family:'Orbitron',sans-serif">Advanced View</span>
      <div style="display:flex;border:2px solid white;border-radius:6px;overflow:hidden;cursor:pointer">
        <div id="advancedOn" style="padding:8px 16px;color:#ffffff;pointer-events:auto;background:#333;font-family:'Orbitron',sans-serif">ON</div>
        <div id="advancedOff" style="padding:8px 16px;color:#333;pointer-events:auto;background:#cbcbcb;font-family:'Orbitron',sans-serif">OFF</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:40px;right:40px;text-align:right">
    <div style="color:white;font-size:40px;font-family:'Orbitron',sans-serif">Rudimentary Lenz' Law</div>
    <div style="color:white;font-size:40px;font-family:'Orbitron',sans-serif">Visualizer</div>
  </div>
`;
document.body.appendChild(ui);

ui.style.position = 'fixed';
ui.style.zIndex = '999';
ui.style.top = '20px';
ui.style.left = '20px';
ui.style.display = 'flex';
ui.style.alignItems = 'center';
ui.style.flexDirection = 'column';
ui.style.alignItems = 'flex-start';
ui.style.pointerEvents = 'none';
ui.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;`;

const infoBox = document.createElement('div');
infoBox.style.cssText = `
  position: fixed;
  top: 140px;
  left: 1845px;
  width: 420px;
  height: 0px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  overflow: hidden;
`;

document.body.appendChild(infoBox);
infoBox.style.pointerEvents = 'auto';

const infoText = document.createElement('p');
infoText.style.cssText = `
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-size: 17px;
  padding: 16px;
  opacity: 0;
  margin: 0;
`;
infoText.textContent = 'test message';
infoBox.appendChild(infoText);

const style = document.createElement('style');
style.textContent = `
  @keyframes expandHeight {
    from { height: 0px; }
    to { height: 210px; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);
setTimeout(() => infoBox.style.border = 'none', 0);

function showInfo(message) {
  infoBox.style.border = '1px solid rgba(255,255,255,0.2)';
  infoText.innerHTML = message;
  
  infoBox.style.animation = 'none';
  infoText.style.animation = 'none';
  
  requestAnimationFrame(() => {
    infoBox.style.animation = 'expandHeight 0.5s ease forwards';
    infoText.style.animation = 'fadeIn 0.3s ease forwards';
    infoText.style.animationDelay = '0.4s';
  });
}
function hideInfo() {
  infoBox.style.animation = 'expandHeight 0.5s ease reverse';
  infoText.style.animation = 'fadeIn 0.3s ease reverse';
  infoText.style.animationDelay = '0s';
  setTimeout(() => infoBox.style.border = 'none', 0);
}

const magnet = new THREE.Group();

const g1 = new THREE.BoxGeometry(1.3, 1.5, 0.3);
const m1 = new THREE.MeshStandardMaterial({ color: 0x0077ff, metalness: 1.0, roughness: 0.45, envMap: scene.environment });
const halfOne = new THREE.Mesh(g1, m1);
halfOne.position.y = -0.75;

const g2 = new THREE.BoxGeometry(1.3, 1.5, 0.3);
const m2 = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 1.0, roughness: 0.45, envMap: scene.environment });
const halfTwo = new THREE.Mesh(g2, m2);
halfTwo.position.y = 0.75;

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
  magnet.add(northText);

  const tg2 = new TextGeometry('S', {
    font: font,
    size: 0.5,
    depth: 0.1,
  });
  const tm2 = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const southText = new THREE.Mesh(tg2, tm2);
  southText.position.set(-0.2, -1.4, 0.075);
  magnet.add(southText);
});

magnet.add(halfOne);
magnet.add(halfTwo);
scene.add(magnet);

const light = new THREE.PointLight(0xffffff, 85);
light.position.set(5, 5, 5);
const light2 = new THREE.PointLight(0xffffff, 42.5);
light2.position.set(-5, -5, -5);
const ambientLight = new THREE.AmbientLight(0xffffff, 100);
scene.add(ambientLight);
scene.add(light);
scene.add(light2);

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, -2, 0);
controls.enableDamping = true;

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
magnet.add(arrow);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(3, 0.1, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 1.0, roughness: 0.45, envMap: scene.environment })
);
torus.position.set(0, -3, -0);
torus.rotateX(Math.PI / 2);
scene.add(torus);

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(0, 170, 255, 1)');
  gradient.addColorStop(1, 'rgba(0, 170, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}
const glowTexture = makeGlowTexture();
const glowMaterial = new SpriteMaterial({
  map: glowTexture,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

const arrowCount = 12;
const radius = 3;
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

for (let i = 0; i < arrowCount; i++) {
  const arrow = new THREE.Mesh(fieldArrowGeometry, fieldArrowMaterial);
  const glow = new Sprite(glowMaterial);
  glow.scale.set(0.5, 0.5, 0.5);
  arrow.add(glow);

  fieldArrows.push(arrow);
  scene.add(arrow);
}

const chevronShape = new THREE.Shape();
chevronShape.moveTo(-0.2, 0.2/2);
chevronShape.lineTo(-0.2, -0.15/2);
chevronShape.lineTo(0, -0.35/2);
chevronShape.lineTo(0.2, -0.15/2);
chevronShape.lineTo(0.2, 0.2/2);
chevronShape.lineTo(0, 0);
chevronShape.lineTo(-0.2, 0.2/2);

const chevronCount = 4;
const columnTop = 0.75 * (1.5) + 0.1;
const columnBottom = -0.25 * (1.5) + 0.1;
const columnHeight = 1 * (1.5);
let chevronOffset = 0;

function createChevronColumn(x, y, color, up=true) {
  const chevronGroup = new THREE.Group();
  const chevrons = [];

  const chevronGeometry = new THREE.ShapeGeometry(chevronShape);
  const chevronMaterial = new THREE.MeshStandardMaterial({
    color: color,
    side: THREE.DoubleSide,
    clippingPlanes: [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), columnTop + y),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -(columnBottom + y) - 0.3)
    ]
  })

  for (let i = 0; i < chevronCount; i++){
    const chevron = new THREE.Mesh(chevronGeometry, chevronMaterial);
    chevron.rotation.z = up ? Math.PI : 0;
    chevron.position.set(x, columnBottom + (i/chevronCount) * columnHeight, 0);
    chevronGroup.add(chevron);
    chevrons.push(chevron);
  }

  scene.add(chevronGroup);
  return {chevrons, offset: 0, up, x, y};
}

const col1 = createChevronColumn(1.2, -0.6, 0x00ff00, false);
const col2 = createChevronColumn(-1.2, -0.6, 0xFF2400, true);

const rowChevrons = [];
const rowChevronCount = 3;
const rowSpacing = 0.45;

const chevronGeometry = new THREE.ShapeGeometry(chevronShape);
const chevronMaterial = new THREE.MeshStandardMaterial({
  color: 0x100026,
  side: THREE.DoubleSide,
})

for (let i = 0; i < rowChevronCount; i++) {
  const chevron = new THREE.Mesh(chevronGeometry, chevronMaterial);
  chevron.position.set(-((rowChevronCount - 1) * rowSpacing / 2) + i * rowSpacing, magnet.position.y - 1.7, 0);
  rowChevrons.push(chevron);
  scene.add(chevron);
}

col1.chevrons.forEach(c => c.visible = false);
col2.chevrons.forEach(c => c.visible = false);
rowChevrons.forEach(c => c.visible = false);

//Genuine mess I have no clue why this works but it does so I'm not gonna question it
let direction = 1; //0 - Down, 1 - Up
let orientation = 0;//0 - North Up, 1 - South Up

function updateMagnet(posY = 0) {
  if (magnet.position.y > -posY) {
    direction = 0;
  }
  else {
    direction = 1;
  }
  if (orientation === 1) {
    magnet.rotation.set(0, 0, Math.PI);
    magnet.position.set(0, -posY, -0.15);
  }
  else {
    magnet.rotation.set(0, 0, 0);
    magnet.position.set(0, -posY, 0);
  }
  col1.y = -0.6 - posY
  col2.y = -0.6 - posY
  col1.chevrons[0].material.clippingPlanes[0].constant = columnTop + col1.y;
  col1.chevrons[0].material.clippingPlanes[1].constant = -(columnBottom + col1.y) - 0.3;
  col2.chevrons[0].material.clippingPlanes[0].constant = columnTop + col2.y;
  col2.chevrons[0].material.clippingPlanes[1].constant = -(columnBottom + col2.y)

  const baseRotation = direction === 0 ? Math.PI : 0;
  const cancelFlip = orientation === 1 ? -Math.PI : 0;
  arrow.rotation.set(0, 0, baseRotation + cancelFlip);

  if (direction === 0) {
    arrow.position.set(0.012, orientation === 1 ? - 0.6 : 0.6, 0.075);
  }
  else {
    arrow.position.set(0.012, orientation === 1 ? 0.6 : -0.6, 0.075);
  }
}
updateMagnet();

document.getElementById('northBtn').addEventListener('click', function() {
  if (orientation === 1) {
    orientation = 0;
    document.getElementById('northBtn').style.background = '#cbcbcb';
    document.getElementById('northBtn').style.color = '#333';
    document.getElementById('southBtn').style.background = '#333';
    document.getElementById('southBtn').style.color = 'white';
    updateMagnet(-magnet.position.y);
  }
});

document.getElementById('southBtn').addEventListener('click', function() {
  if (orientation === 0) {
    orientation = 1;
    document.getElementById('northBtn').style.background = '#333';
    document.getElementById('northBtn').style.color = 'white';
    document.getElementById('southBtn').style.background = '#cbcbcb';
    document.getElementById('southBtn').style.color = '#333';
    updateMagnet(-magnet.position.y);
  }
});

let advancedStatus = false;
document.getElementById('advancedOn').addEventListener('click', function() {
    if (!advancedStatus){
      document.getElementById('advancedOn').style.background = '#cbcbcb';
      document.getElementById('advancedOn').style.color = '#333';
      document.getElementById('advancedOff').style.background = '#333';
      document.getElementById('advancedOff').style.color = 'white';
      showInfo(`Magnet-Interior Magnetic Field:
        <div id="colorSelectorOne" style="display:inline-block;border:2px solid #000000;border-radius:10px;padding:2px 30px;color:#BC13FE;pointer-events:auto;background:#BC13FE;font-family:'Orbitron',sans-serif">N</div>
        <br>
        Magnetic Force on Magnet:
        <div id="colorSelectorTwo" style="display:inline-block;margin-top:10px;border:2px solid #000000;border-radius:10px;padding:2px 30px;color:#FF5F1F;pointer-events:auto;background:#FF5F1F;font-family:'Orbitron',sans-serif">N</div>
        <br>
        Magnetic Force on Loop:
        <div id="colorSelectorThree" style="display:inline-block;margin-top:10px;border:2px solid #000000;border-radius:10px;padding:2px 30px;color:#39FF14;pointer-events:auto;background:#39FF14;font-family:'Orbitron',sans-serif">N</div>
        <div style="margin-top:13px">Z-Value (M-Height): <span id="zVal">0</span></div>
        <div style="margin-top:13px">Normalized Current: <span id="normCurrent">0</span></div>
      `);
      col1.chevrons.forEach(c => c.visible = true);
      col2.chevrons.forEach(c => c.visible = true);
      rowChevrons.forEach(c => c.visible = true);
      advancedStatus = true;
    }
});

document.getElementById('advancedOff').addEventListener('click', function() {
  if (advancedStatus){
    document.getElementById('advancedOn').style.background = '#333';
    document.getElementById('advancedOn').style.color = 'white';
    document.getElementById('advancedOff').style.background = '#cbcbcb';
    document.getElementById('advancedOff').style.color = '#333';
    setTimeout(() => hideInfo(), 0);
    col1.chevrons.forEach(c => c.visible = false);
    col2.chevrons.forEach(c => c.visible = false);
    rowChevrons.forEach(c => c.visible = false);
    advancedStatus = false;
  }
});

document.getElementById('posSlider').addEventListener('input', function() {
  const value = parseFloat(this.value);
  updateMagnet(value);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  renderer.localClippingEnabled = true;
  const time = Date.now() * 0.001;
  function currentAtZ(z) {
    return (27 * z) / Math.pow(z * z + 9, 2.5);
  }
  const maxCurrent = currentAtZ(1.5);
  const normalizedCurrent = currentAtZ(3 + magnet.position.y) / maxCurrent;
  const zValEl = document.getElementById('zVal');
  const normEl = document.getElementById('normCurrent');
  if (zValEl) zValEl.textContent = (magnet.position.y + 3).toFixed(2);
  if (normEl) normEl.textContent = ((direction === 0 && orientation === 0) || (direction === 1 && orientation === 1)) ? normalizedCurrent.toFixed(3) : (-normalizedCurrent).toFixed(3);
  fieldArrows.forEach((arrow, i) => {
    const angle = (i / arrowCount) * Math.PI * 2 - time * normalizedCurrent * 3;
    if ((direction === 0 && orientation === 0) || (direction === 1 && orientation === 1)) {
      arrow.position.set(Math.sin(angle) * radius, -2.7, Math.cos(angle) * radius);
      arrow.rotation.set(Math.PI/2, 0, -angle + Math.PI/2 + (normalizedCurrent < 0 ? Math.PI : 0));
    }
    else {
      arrow.position.set(Math.cos(angle) * radius, -2.7, Math.sin(angle) * radius);
      arrow.rotation.set(Math.PI/2, 0, angle + Math.PI + (normalizedCurrent < 0 ? Math.PI : 0));
    }
  });
  const magnetBelowTorus = magnet.position.y < -3;
  col1.up = ((direction === 0 && orientation === 0) || (direction === 1 && orientation === 1)) !== magnetBelowTorus;
  col2.up = !col1.up;
  col1.chevrons.forEach(c => c.rotation.z = col1.up ? Math.PI : 0);
  col2.chevrons.forEach(c => c.rotation.z = col2.up ? Math.PI : 0);
  [col1, col2].forEach(col => {
    col.offset += col.up ? 0.02 : -0.02;
    if (col.up) {
      if (col.offset >= columnHeight / chevronCount) col.offset -= columnHeight / chevronCount;
    }
    else {
      if (col.offset <= -columnHeight / chevronCount) col.offset += columnHeight / chevronCount;
    }
    col.chevrons.forEach((chevron, i) => {
      if (col.up){
        chevron.position.y = columnTop + col.y - 0.2 - (i/chevronCount) * columnHeight + col.offset;
      }
      else {
        chevron.position.y = columnTop + col.y + 0.2 - (i/chevronCount) * columnHeight + col.offset;
      }
    });
  });
  rowChevrons.forEach((chevron, i) => {
    chevron.position.set(-((rowChevronCount - 1) * rowSpacing / 2) + i * rowSpacing, magnet.position.y + (orientation === 1 ? -1.7 : 1.7), 0);
    chevron.rotation.z = orientation === 1 ? 0 : Math.PI;
  });
}
animate();
