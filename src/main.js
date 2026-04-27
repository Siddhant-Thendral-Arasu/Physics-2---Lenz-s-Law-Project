//Main: Handles overall creation as well as main animation loop
import * as THREE from 'three';
import { STATE, getDirectionalCurrent } from './physics.js';
import { 
  createScene, 
  createMagnet, 
  createTorus, 
  buildFieldArrows, 
  createChevronColumn, 
  buildRowChevrons, 
} from './scene.js';
import { setupUI } from './ui.js';

const { scene, camera, renderer, controls } = createScene();

const {magnet, internalArrow} = createMagnet(scene);
const torus = createTorus(scene);
const fieldArrows = buildFieldArrows(scene, STATE.arrowCount, STATE.radius);
const rowChevrons = buildRowChevrons(scene, 3, 0.75);

const colHeight = 1.5;
const colTop = 0.75 * 1.5 + 0.1;
const colBottom = -0.25 * 1.5 + 0.1;

const col1 = createChevronColumn(scene, 1.2, -0.6, 0x00ff00, false, colTop, colBottom, colHeight, 4);
const col2 = createChevronColumn(scene, -1.2, -0.6, 0xFF2400, true, colTop, colBottom, colHeight, 4);

function updateMagnet(){
  STATE.direction = (magnet.position.y > -STATE.posY) ? 1 : 0;

if (STATE.orientation === 1) {
    magnet.rotation.set(0, 0, Math.PI);
    magnet.position.set(0, -STATE.posY, -0.15);
  } else {
    magnet.rotation.set(0, 0, 0);
    magnet.position.set(0, -STATE.posY, 0);
  }

  col1.y = -0.6 - STATE.posY;
  col2.y = -0.6 - STATE.posY;
  col1.material.clippingPlanes[0].constant = colTop + col1.y;
  col1.material.clippingPlanes[1].constant = -(colBottom + col1.y) - 0.3;
  col2.material.clippingPlanes[0].constant = colTop + col2.y;
  col2.material.clippingPlanes[1].constant = -(colBottom + col2.y);

  const isMismatched = (STATE.direction === 1) !== (STATE.orientation === 1);
  internalArrow.rotation.set(0, 0, isMismatched ? Math.PI : 0);
  internalArrow.position.set(0.012, isMismatched ? 0.6 : -0.6, 0.075);
  
  const visible = STATE.advancedStatus;
  [...col1.chevrons, ...col2.chevrons, ...rowChevrons].forEach(c => 
    c.visible = visible
  );
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const time = Date.now() * 0.001;
  const normalizedCurrent = getDirectionalCurrent(magnet.position.y, STATE.direction, STATE.orientation);

  const zValEl = document.getElementById('zVal');
  const normEl = document.getElementById('normCurrent');
  if (zValEl) zValEl.textContent = (STATE.posY + 3).toFixed(2);
  if (normEl) normEl.textContent = normalizedCurrent.toFixed(3);

  fieldArrows.forEach((arrow, i) => {
      const angle = (i / STATE.arrowCount) * Math.PI * 2 - time * Math.abs(normalizedCurrent) * 3;
      if (normalizedCurrent >= 0) {
        arrow.position.set(Math.sin(angle) * STATE.radius, -2.7, Math.cos(angle) * STATE.radius);
        arrow.rotation.set(Math.PI/2, 0, -angle + Math.PI/2);
      } else {
        arrow.position.set(Math.cos(angle) * STATE.radius, -2.7, Math.sin(angle) * STATE.radius);
        arrow.rotation.set(Math.PI/2, 0, angle + Math.PI);
      }
  });

  const magnetBelowTorus = magnet.position.y < -3;
  const col1Up = ((STATE.direction === 1 && STATE.orientation === 0) || (STATE.direction === 0 && STATE.orientation === 1)) !== magnetBelowTorus;

  [col1, col2].forEach((col, i) => {
    const isUp = i === 0 ? col1Up : !col1Up;
    col.offset = (col.offset || 0) + (isUp ? 0.02 : -0.02);
    if (isUp && col.offset >= colHeight / 4) col.offset -= colHeight / 4;
    if (!isUp && col.offset <= -colHeight / 4) col.offset += colHeight / 4;

    col.chevrons.forEach((chevron, i) => {
      chevron.rotation.z = isUp ? Math.PI : 0;
      const basePos = colTop + col.y + (isUp ? -0.2 : 0.2);
      chevron.position.y = basePos - (i/4) * colHeight + col.offset;
    });
  });

  rowChevrons.forEach((chevron, i) => {
    chevron.position.set(-((3 - 1) * 0.45 / 2) + i * 0.45, magnet.position.y + (STATE.orientation === 1 ? -1.7 : 1.7), 0);
    chevron.rotation.z = (STATE.orientation === 1) ? 0 : Math.PI;
  });

  renderer.render(scene, camera);
}

setupUI(STATE, updateMagnet)
updateMagnet();
animate();
