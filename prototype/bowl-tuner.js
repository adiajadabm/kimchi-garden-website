// Bibimbap tuner — a slider panel for the hero's 3D bowl.
// Opens with ?tune in the address or Shift+T. Changes show live and are remembered in this browser
// until you press Reset. Nothing here changes the site for anyone else until you export the settings.
(function () {
  var B = window.KGBowl, P = B.params, D = B.defaults;
  var STORE = 'kg-bowl-tune';
  function save() { try { localStorage.setItem(STORE, JSON.stringify(P)); } catch (e) {} }
  function copy(src, dst) { Object.keys(src).forEach(function (k) { if (k === 'colors') Object.assign(dst.colors, src.colors); else dst[k] = src[k]; }); }

  var style = document.createElement('style');
  style.textContent =
    '.lil-gui.kg-tuner{--background-color:#1a1238;--text-color:#fff4dc;--title-background-color:#c4501a;--title-text-color:#fff;' +
    '--widget-color:#2e2560;--hover-color:#3b3176;--focus-color:#4a3f8f;--number-color:#ffd400;--string-color:#9fe05a;' +
    '--font-family:"Figtree",system-ui,sans-serif;--font-size:12px;--width:300px;' +
    'position:fixed;top:calc(64px + env(safe-area-inset-top,0px));left:12px;z-index:90;max-height:calc(100vh - 80px);overflow:auto;' +
    'border:3px solid #1a1238;box-shadow:6px 6px 0 #1a1238}' +
    '.lil-gui.kg-tuner .title{font-family:"Anton",Impact,sans-serif;letter-spacing:.06em;text-transform:uppercase;font-size:14px}' +
    '.kg-tune-tip{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:91;background:#1a1238;color:#fff4dc;' +
    'font:600 13px/1.3 Figtree,sans-serif;padding:10px 14px;border:2px solid #ffd400;box-shadow:3px 3px 0 #ffd400}';
  document.head.appendChild(style);

  var gui = new lil.GUI({ title: '3D bibimbap tuner' });
  gui.domElement.classList.add('kg-tuner');
  gui.onChange(function () { save(); B.apply(); });

  // ---- Presets ----
  var PRESETS = {
    'Site default': {},
    'Big dramatic burst': { height: 1.6, spread: 1.7, speed: 0.05, float: 0.16, spin: 1.8, toppingSize: 1.15, key: 3.2, shadow: 0.5 },
    'Gentle float': { height: 0.7, spread: 0.8, speed: 0.04, float: 0.05, spin: 0.4, floatSpeed: 0.6 },
    'Exploded view (frozen)': { mode: 'manual', burst: 1, spin: 0, float: 0, autoRotate: 0 },
    'Slow showcase spin': { mode: 'loop', autoRotate: 0.35, speed: 0.035, spin: 0.6 },
    'Top-down menu shot': { bowlTilt: 1.15, camHeight: 3.2, lookY: -1.4, mode: 'closed', starburst: true },
    'Moody low light': { exposure: 0.8, key: 3.6, keyAngle: -70, rim: 2.6, fill: 0.15, env: 0.45, shadow: 0.62 },
    'Bright & poppy': { exposure: 1.2, key: 2, rim: 1, fill: 1.1, env: 1.5, shadow: 0.25 }
  };
  var ui = { preset: 'Site default' };
  gui.add(ui, 'preset', Object.keys(PRESETS)).name('Preset').onChange(function (name) {
    copy(JSON.parse(JSON.stringify(D)), P); copy(PRESETS[name], P);
    gui.controllersRecursive().forEach(function (c) { c.updateDisplay(); });
    save(); B.apply();
  });

  // ---- Burst ----
  var f = gui.addFolder('Burst');
  f.add(P, 'mode', { 'Hover the bowl (site)': 'hover', 'Always burst': 'open', 'Always settled': 'closed', 'Loop on its own': 'loop', 'Manual (use slider)': 'manual' }).name('Trigger');
  f.add(P, 'burst', 0, 1, 0.01).name('Burst amount (manual)');
  f.add(P, 'height', 0.2, 2.5, 0.05).name('How high it flies');
  f.add(P, 'spread', 0.2, 2.5, 0.05).name('How wide it spreads');
  f.add(P, 'speed', 0.01, 0.3, 0.005).name('Burst speed');
  f.add({ play: function () { B.replay(); } }, 'play').name('▶ Play burst (hover mode)');

  // ---- Motion ----
  f = gui.addFolder('Motion');
  f.add(P, 'float', 0, 0.5, 0.01).name('Float bob');
  f.add(P, 'floatSpeed', 0, 3, 0.05).name('Float speed');
  f.add(P, 'spin', 0, 5, 0.05).name('Topping spin');
  f.add(P, 'autoRotate', -1.5, 1.5, 0.05).name('Bowl auto-rotate');
  f.add(P, 'tiltFollow', 0, 1.5, 0.05).name('Follows cursor');

  // ---- Bowl & toppings ----
  f = gui.addFolder('Bowl & toppings');
  f.add(P, 'bowlTilt', -0.2, 1.4, 0.01).name('Bowl tilt');
  f.add(P, 'scale', 0.5, 1.6, 0.01).name('Overall size');
  f.add(P, 'offsetY', -1.5, 1.5, 0.01).name('Move up / down');
  f.add(P, 'toppingSize', 0.4, 2.2, 0.01).name('Topping size');

  // ---- Camera ----
  f = gui.addFolder('Camera');
  f.add(P, 'fov', 15, 70, 1).name('Lens (field of view)');
  f.add(P, 'zoom', 0.5, 1.8, 0.01).name('Zoom out');
  f.add(P, 'camHeight', -2, 6, 0.05).name('Camera height');
  f.add(P, 'lookY', -3, 1.5, 0.05).name('Aim up / down');
  f.close();

  // ---- Lighting ----
  f = gui.addFolder('Lighting');
  f.add(P, 'exposure', 0.4, 2, 0.01).name('Brightness');
  f.add(P, 'key', 0, 6, 0.05).name('Main light');
  f.add(P, 'keyAngle', -180, 180, 1).name('Main light angle');
  f.add(P, 'rim', 0, 6, 0.05).name('Back rim light');
  f.add(P, 'fill', 0, 3, 0.05).name('Fill light');
  f.add(P, 'env', 0, 3, 0.05).name('Shine / reflections');
  f.add(P, 'shadow', 0, 1, 0.01).name('Shadow darkness');
  f.close();

  // ---- Colors ----
  f = gui.addFolder('Colors');
  var LABELS = { carrot: 'Carrots', spinach: 'Spinach', cabbage: 'Purple cabbage', radish: 'Pickled radish', zucchini: 'Zucchini', beef: 'Beef',
    yolk: 'Egg yolk', eggWhite: 'Egg white', gochujang: 'Gochujang', rice: 'Rice', pot: 'Stone pot', tray: 'Tray' };
  Object.keys(LABELS).forEach(function (k) { f.addColor(P.colors, k).name(LABELS[k]); });
  f.close();

  // ---- Backdrop ----
  f = gui.addFolder('Backdrop');
  f.add(P, 'starburst').name('Show starburst');
  f.add(P, 'starburstSpin').name('Starburst spins');
  f.close();

  // ---- Save / share ----
  f = gui.addFolder('Save');
  function text() { return '// The hero bibimbap\'s look, exported from the tuner\nwindow.BOWL_SETTINGS = ' + JSON.stringify(P, null, 2) + ';\n'; }
  function tip(msg) {
    var t = document.createElement('div'); t.className = 'kg-tune-tip'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600);
  }
  f.add({ copy: function () {
    var json = JSON.stringify(P, null, 2);
    (navigator.clipboard ? navigator.clipboard.writeText(json) : Promise.reject()).then(function () { tip('Settings copied. Paste them to Claude to make this the default.'); },
      function () { window.prompt('Copy these settings:', JSON.stringify(P)); });
  } }, 'copy').name('📋 Copy settings');
  f.add({ dl: function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text()], { type: 'text/javascript' }));
    a.download = 'bowl-settings.js'; document.body.appendChild(a); a.click(); a.remove();
    tip('Saved. Replace prototype/bowl-settings.js with this file to make it the default.');
  } }, 'dl').name('⬇ Download bowl-settings.js');
  f.add({ reset: function () {
    try { localStorage.removeItem(STORE); } catch (e) {}
    copy(JSON.parse(JSON.stringify(D)), P); copy(window.BOWL_SETTINGS || {}, P); ui.preset = 'Site default';
    gui.controllersRecursive().forEach(function (c) { c.updateDisplay(); }); B.apply();
    tip('Back to the site\'s current look.');
  } }, 'reset').name('↺ Reset');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  tip('Tuner open. Changes are live and stay in this browser only. Shift+T hides it.');
  window.KGBowlTuner = { gui: gui, toggle: function () { gui.show(gui._hidden); } };
})();
