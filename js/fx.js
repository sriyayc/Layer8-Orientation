/* Arcade effects: animated background, pixel bursts, flashes, countdown, CRT boot, card tilt.
   Everything degrades to nothing when the user prefers reduced motion. */

var FX = (function () {
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- CRT overlays + boot ---------- */
  function mountOverlays() {
    var crt = document.createElement("div");
    crt.className = "crt";
    document.body.appendChild(crt);
    var flashEl = document.createElement("div");
    flashEl.className = "fx-flash";
    document.body.appendChild(flashEl);
    FX._flash = flashEl;
  }

  function boot() {
    if (reduced) return;
    document.body.classList.add("booting");
    setTimeout(function () { document.body.classList.remove("booting"); }, 650);
  }

  /* ---------- background: starfield + perspective grid floor ---------- */
  function background(opts) {
    opts = opts || {};
    var calm = !!opts.calm;           // game screens: dimmer so text stays readable
    var horizonAt = opts.horizon || (calm ? 0.78 : 0.64);
    var canvas = document.createElement("canvas");
    canvas.id = "fx-bg";
    document.body.prepend(canvas);
    var ctx = canvas.getContext("2d");
    var W, H, stars = [];

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((W * H) / (calm ? 9000 : 5500));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * horizonAt,
          z: Math.random() * 0.8 + 0.2,
          tw: Math.random() * Math.PI * 2
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    var t0 = performance.now();
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      var hy = H * horizonAt;

      // stars drift left, twinkle
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x -= s.z * 0.15;
        if (s.x < 0) { s.x = W; s.y = Math.random() * hy; }
        var a = (0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + s.tw))) * s.z * (calm ? 0.55 : 1);
        ctx.fillStyle = "rgba(220,230,255," + a.toFixed(3) + ")";
        var sz = s.z > 0.75 ? 2 : 1;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), sz, sz);
      }

      // horizon glow
      var g = ctx.createLinearGradient(0, hy - 60, 0, hy + 10);
      g.addColorStop(0, "rgba(255,46,151,0)");
      g.addColorStop(1, calm ? "rgba(255,46,151,.12)" : "rgba(255,46,151,.28)");
      ctx.fillStyle = g;
      ctx.fillRect(0, hy - 60, W, 70);

      // floor grid
      var floorH = H - hy;
      var alpha = calm ? 0.22 : 0.5;
      ctx.lineWidth = 1;
      // horizontal lines rushing toward the viewer
      var rows = 16, speed = 0.35;
      for (var r = 0; r < rows; r++) {
        var p = ((r + (t * speed) % 1) / rows);
        var y = hy + floorH * Math.pow(p, 2.4);
        ctx.strokeStyle = "rgba(255,46,151," + (alpha * Math.min(1, p * 1.6)).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      // vertical lines to the vanishing point
      var cols = 22, vx = W / 2;
      for (var c = -cols; c <= cols; c++) {
        var bx = vx + (c / cols) * W * 1.6;
        var grad = ctx.createLinearGradient(0, hy, 0, H);
        grad.addColorStop(0, "rgba(41,231,255,0)");
        grad.addColorStop(1, "rgba(41,231,255," + (alpha * 0.8).toFixed(3) + ")");
        ctx.strokeStyle = grad;
        ctx.beginPath(); ctx.moveTo(vx + (c / cols) * 40, hy); ctx.lineTo(bx, H); ctx.stroke();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    }
    var raf = requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) raf = requestAnimationFrame(draw);
    });
  }

  /* ---------- pixel confetti ---------- */
  var pCanvas, pCtx, parts = [], pRaf = null;
  function ensureParticles() {
    if (pCanvas) return;
    pCanvas = document.createElement("canvas");
    pCanvas.id = "fx-particles";
    document.body.appendChild(pCanvas);
    pCtx = pCanvas.getContext("2d");
    var fit = function () {
      pCanvas.width = window.innerWidth * dpr; pCanvas.height = window.innerHeight * dpr;
      pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);
  }
  function burst(x, y, opts) {
    if (reduced) return;
    opts = opts || {};
    ensureParticles();
    var colors = opts.colors || ["#29e7ff", "#ff2e97", "#ffd400", "#3dff8f", "#ffffff"];
    var n = opts.count || 90;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var v = (opts.power || 9) * (0.35 + Math.random());
      parts.push({
        x: x, y: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - (opts.lift || 4),
        s: Math.random() < 0.3 ? 8 : 5,
        c: colors[Math.floor(Math.random() * colors.length)],
        life: 1, decay: 0.012 + Math.random() * 0.012
      });
    }
    if (!pRaf) pRaf = requestAnimationFrame(stepParticles);
  }
  function burstAt(el, opts) {
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }
  function stepParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.vy += 0.32; p.vx *= 0.985;
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0 || p.y > window.innerHeight + 20) { parts.splice(i, 1); continue; }
      pCtx.globalAlpha = Math.max(0, p.life);
      pCtx.fillStyle = p.c;
      pCtx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    pCtx.globalAlpha = 1;
    pRaf = parts.length ? requestAnimationFrame(stepParticles) : null;
  }

  /* ---------- flash + shake ---------- */
  function flash(color) {
    var el = FX._flash;
    if (!el || reduced) return;
    el.style.background = color || "#fff";
    el.classList.remove("go");
    void el.offsetWidth;
    el.classList.add("go");
  }
  function shake(el) {
    if (!el || reduced) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    setTimeout(function () { el.classList.remove("shake"); }, 450);
  }

  /* ---------- READY / GO overlay ---------- */
  function countdown(words, done) {
    if (reduced) { done(); return; }
    var box = document.createElement("div");
    box.className = "countdown";
    document.body.appendChild(box);
    var i = 0;
    (function next() {
      if (i >= words.length) { box.remove(); done(); return; }
      var w = words[i++];
      box.innerHTML = "";
      var span = document.createElement("span");
      span.textContent = w;
      if (i === words.length) { span.className = "go"; L8.sound.go(); } else { L8.sound.count(); }
      box.appendChild(span);
      setTimeout(next, i === words.length ? 420 : 620);
    })();
  }

  /* ---------- 3D tilt toward the cursor ---------- */
  function tilt(el, max) {
    if (reduced) return;
    max = max || 7;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "rotateY(" + (px * max) + "deg) rotateX(" + (-py * max) + "deg) translateZ(0)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }

  function init(opts) {
    if (opts && opts.calm) document.body.classList.add("calm");
    mountOverlays();
    background(opts);
    boot();
  }

  return { init: init, burst: burst, burstAt: burstAt, flash: flash, shake: shake, countdown: countdown, tilt: tilt };
})();
