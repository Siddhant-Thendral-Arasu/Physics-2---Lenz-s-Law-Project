//UI: Sets up basic UI, including text, buttons, sliders, and keyframes

export function setupUI(state, onUpdate) {
  const ui = document.createElement('div');
  ui.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;`;
  
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

  // Info Box setup
  const infoBox = document.createElement('div');
  infoBox.style.cssText = `position: fixed; top: 140px; right: 40px; width: 420px; height: 0px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; overflow: hidden; pointer-events: auto;`;
  infoBox.style.border = 'none';
  
  const infoText = document.createElement('p');
  infoText.style.cssText = `color: white; font-family: 'Orbitron', sans-serif; font-size: 17px; padding: 16px; opacity: 0; margin: 0;`;
  infoBox.appendChild(infoText);
  document.body.appendChild(infoBox);

  const style = document.createElement('style');
  style.textContent = `
    .info-box-active {
      animation: expandHeight 0.5s ease forwards;
      border: 1px solid rgba(255,255,255,0.2) !important;
    }
    .info-box-inactive {
      animation: shrinkHeight 0.5s ease forwards;
    }
    .text-fade-in { animation: fadeIn 0.3s ease forwards 0.4s; }
    .text-fade-out { animation: fadeIn 0.2s ease reverse forwards; }

    @keyframes expandHeight { 
      from { height: 0px; opacity: 0; } 
      to { height: 210px; opacity: 1; } 
    }
    @keyframes shrinkHeight { 
      from { height: 210px; opacity: 1; } 
      to { height: 0px; opacity: 0; } 
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;
  document.head.appendChild(style);

  // Event Listeners
  document.getElementById('northBtn').addEventListener('click', () => {
    if (state.orientation === 1) {
      state.orientation = 0;
      updateOrientationButtons();
      onUpdate();
    }
  });

  document.getElementById('southBtn').addEventListener('click', () => {
    if (state.orientation === 0) {
      state.orientation = 1;
      updateOrientationButtons();
      onUpdate();
    }
  });

  document.getElementById('posSlider').addEventListener('input', (e) => {
    state.posY = parseFloat(e.target.value);
    onUpdate();
  });

  document.getElementById('advancedOn').addEventListener('click', () => {
    if (!state.advancedStatus) {
      state.advancedStatus = true;
      updateAdvancedButtons();
      showInfo();
      onUpdate();
    }
  });

  document.getElementById('advancedOff').addEventListener('click', () => {
    if (state.advancedStatus) {
      state.advancedStatus = false;
      updateAdvancedButtons();
      hideInfo();
      onUpdate();
    }
  });

  // UI Helpers
  function updateOrientationButtons() {
    const n = document.getElementById('northBtn');
    const s = document.getElementById('southBtn');
    n.style.background = state.orientation === 0 ? '#cbcbcb' : '#333';
    n.style.color = state.orientation === 0 ? '#333' : 'white';
    s.style.background = state.orientation === 1 ? '#cbcbcb' : '#333';
    s.style.color = state.orientation === 1 ? '#333' : 'white';
  }

  function updateAdvancedButtons() {
    const on = document.getElementById('advancedOn');
    const off = document.getElementById('advancedOff');
    on.style.background = state.advancedStatus ? '#cbcbcb' : '#333';
    on.style.color = state.advancedStatus ? '#333' : 'white';
    off.style.background = !state.advancedStatus ? '#cbcbcb' : '#333';
    off.style.color = !state.advancedStatus ? '#333' : 'white';
  }

  function showInfo() {
    infoBox.classList.remove('info-box-inactive');
    infoBox.classList.add('info-box-active');
  
    infoText.classList.remove('text-fade-out');
    infoText.classList.add('text-fade-in');

    infoText.innerHTML = `Magnet-Interior Magnetic Field:
      <div style="display:inline-block;border:2px solid #000000;border-radius:10px;padding:2px 30px;color:#BC13FE;background:#BC13FE;font-family:'Orbitron',sans-serif">N</div>
      <br>
      Magnetic Force on Magnet:
      <div style="display:inline-block;margin-top:10px;border:2px solid #000000;border-radius:10px;padding:2px 30px;color:#FF5F1F;background:#FF5F1F;font-family:'Orbitron',sans-serif">N</div>
      <br>
      Magnetic Force on Loop:
      <div style="display:inline-block;margin-top:10px;border:2px solid #000000;border-radius:10px;padding:2px 30px;color:#39FF14;background:#39FF14;font-family:'Orbitron',sans-serif">N</div>
      <div style="margin-top:13px">Z-Value (M-Height): <span id="zVal">0</span></div>
      <div style="margin-top:13px">Normalized Current: <span id="normCurrent">0</span></div>`;
  }

  function hideInfo() {
    infoBox.classList.remove('info-box-active');
    infoBox.classList.add('info-box-inactive');
  
    infoText.classList.remove('text-fade-in');
    infoText.classList.add('text-fade-out');

    setTimeout(() => { if(!state.advancedStatus) infoBox.style.border = 'none'; }, 500);
  }
}