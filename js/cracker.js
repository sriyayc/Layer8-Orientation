/* Password Cracker game logic.
   Phases: ready (clues sealed) → running → cracked | timeout. */

(function () {
  var DURATION = 120 * 1000;   // 2 minutes per vault
  var HINT_PENALTY = 10 * 1000; // 10 seconds per hint

  var playable = window.VAULTS.filter(function (v) {
    return !v.flagged && /^\d{4}$/.test(v.answer);
  });
  var byId = {};
  window.VAULTS.forEach(function (v) { byId[v.id] = v; });

  var deck = new L8.Deck("l8.cracker.deck", playable.map(function (v) { return v.id; }));
  var done = {};

  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    chip: $("vaultChip"), title: $("vaultTitle"), veil: $("veil"), body: $("clueBody"),
    dial: $("dial"), ticks: $("dialTicks"), timerText: $("timerText"),
    num: $("vaultNum"), briefState: $("briefState"), hintCount: $("hintCount"),
    code: $("code"), inputs: Array.prototype.slice.call($("code").querySelectorAll("input")),
    status: $("status"),
    start: $("startBtn"), crack: $("crackBtn"), hint: $("hintBtn"), next: $("nextBtn"),
    drawer: $("drawer"), backdrop: $("drawerBackdrop"), grid: $("vaultGrid"),
    answerOut: $("answerOut"), peek: $("peekBtn")
  };

  var state = { vault: null, phase: "ready", deadline: 0, remaining: DURATION, interval: null, lastTick: null, hints: 0, lit: -1 };

  // 120 tick marks, one per second, drawn once.
  var TICKS = DURATION / 1000;
  var tickEls = [];
  (function buildDial() {
    var ns = "http://www.w3.org/2000/svg";
    for (var i = 0; i < TICKS; i++) {
      var a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
      var major = i % 10 === 0;
      var r1 = major ? 80 : 84, r2 = 96;
      var line = document.createElementNS(ns, "line");
      line.setAttribute("x1", 100 + r1 * Math.cos(a));
      line.setAttribute("y1", 100 + r1 * Math.sin(a));
      line.setAttribute("x2", 100 + r2 * Math.cos(a));
      line.setAttribute("y2", 100 + r2 * Math.sin(a));
      if (major) line.setAttribute("class", "major");
      ui.ticks.appendChild(line);
      tickEls.push(line);
    }
  })();

  /* ---------- rendering ---------- */

  function renderClues(v) {
    var body = ui.body;
    body.innerHTML = "";
    if (v.intro) body.appendChild(L8.el("p", { text: v.intro }));
    if (v.items.length) {
      var list = L8.el(v.ordered ? "ol" : "ul");
      v.items.forEach(function (t) { list.appendChild(L8.el("li", { text: t })); });
      body.appendChild(list);
    }
    if (v.outro) body.appendChild(L8.el("p", { class: "outro", text: v.outro }));
    var chars = (v.intro || "").length + v.items.join("").length + (v.outro || "").length;
    body.classList.toggle("dense", v.items.length > 8 || chars > 420);
    // lines type in one after another when the brief is revealed
    Array.prototype.forEach.call(body.querySelectorAll("p, li"), function (n, i) {
      n.style.animationDelay = (i * 70) + "ms";
    });
  }

  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    s = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function renderTimer() {
    var r = Math.max(0, state.remaining);
    ui.timerText.textContent = fmt(r);
    // remaining seconds light up clockwise from 12 o'clock
    var lit = Math.ceil(r / 1000);
    if (lit !== state.lit) {
      state.lit = lit;
      for (var i = 0; i < TICKS; i++) tickEls[i].classList.toggle("on", i < lit);
    }
    var level = r <= 10000 ? "danger" : r <= 30000 ? "warn" : "ok";
    if (state.phase !== "running") level = state.phase === "timeout" ? "danger" : "ok";
    ui.dial.setAttribute("data-level", level);
    ui.dial.classList.toggle("running", state.phase === "running");
    document.body.classList.toggle("alarm", state.phase === "running" && r <= 10000);
  }

  var STATUS_ICON = { ok: "unlock", bad: "cross", time: "clock", info: "info" };
  function setStatus(kind, html) {
    ui.status.className = "status" + (kind ? " status--" + kind : "");
    ui.status.innerHTML = html ? L8.ICONS[STATUS_ICON[kind]] + "<div>" + html + "</div>" : "";
  }

  function show(btn, on) { btn.classList.toggle("hidden", !on); }

  function renderPhase() {
    var p = state.phase;
    show(ui.start, p === "ready");
    show(ui.crack, p === "running");
    show(ui.hint, p === "running");
    show(ui.next, p === "cracked" || p === "timeout");
    ui.veil.classList.toggle("hidden", p !== "ready");
    ui.briefState.innerHTML = p === "ready" ? "Brief · <b>sealed</b>" : p === "running" ? "Brief · <b>live</b>" : p === "cracked" ? "Vault · <b>open</b>" : "Vault · <b>locked</b>";
    ui.hintCount.innerHTML = "Hints <b>" + state.hints + "</b>";
    ui.body.classList.toggle("hidden", p === "ready");
    ui.inputs.forEach(function (i) { i.disabled = p !== "running"; });
    ui.code.classList.toggle("ok", p === "cracked");
    renderTimer();
    renderGrid();
  }

  function renderGrid() {
    ui.grid.innerHTML = "";
    window.VAULTS.forEach(function (v) {
      var b = L8.el("button", { type: "button", text: v.id });
      var disabled = v.flagged || !/^\d{4}$/.test(v.answer);
      if (disabled) {
        b.disabled = true;
        b.title = "Flagged: " + (v.flagReason || "answer is not a 4-digit code");
      } else {
        b.title = v.title;
        b.addEventListener("click", function () { loadVault(v.id); closeDrawer(); });
      }
      if (state.vault && v.id === state.vault.id) b.className = "current";
      else if (done[v.id]) b.className = "done";
      ui.grid.appendChild(b);
    });
  }

  /* ---------- flow ---------- */

  function loadVault(id) {
    stopClock();
    state.vault = byId[id];
    state.phase = "ready";
    state.remaining = DURATION;
    state.lastTick = null;
    state.hints = 0;
    ui.chip.textContent = state.vault.id.toUpperCase();
    ui.num.textContent = state.vault.id === "37b" ? "37B" : state.vault.id;
    L8.scramble(ui.title, state.vault.title, 450);
    renderClues(state.vault);
    clearInputs();
    setStatus("", "");
    renderPhase();
    ui.start.focus();
  }

  function startVault() {
    if (state.phase !== "ready" || state.counting) return;
    state.counting = true;
    ui.start.disabled = true;
    FX.countdown(["READY?", "GO!"], function () {
      state.counting = false;
      ui.start.disabled = false;
      if (state.phase === "ready") beginClock();
    });
  }

  function beginClock() {
    state.phase = "running";
    state.deadline = Date.now() + DURATION;
    state.remaining = DURATION;
    state.interval = setInterval(tick, 100);
    renderPhase();
    ui.inputs[0].focus();
  }

  function stopClock() {
    if (state.interval) clearInterval(state.interval);
    state.interval = null;
  }

  function tick() {
    state.remaining = state.deadline - Date.now();
    var secs = Math.ceil(state.remaining / 1000);
    if (secs <= 5 && secs > 0 && secs !== state.lastTick) { state.lastTick = secs; L8.sound.tick(); }
    if (state.remaining <= 0) return timeUp();
    renderTimer();
  }

  function timeUp() {
    stopClock();
    state.remaining = 0;
    state.phase = "timeout";
    done[state.vault.id] = true;
    setStatus("time", "TIME'S UP!<small>VAULT REMAINS LOCKED.</small>");
    L8.sound.timeup();
    renderPhase();
    FX.flash("#ff3d5a");
    FX.shake(document.getElementById("stage"));
    ui.next.focus();
  }

  function hint() {
    if (state.phase !== "running") return;
    state.deadline -= HINT_PENALTY;
    state.hints++;
    ui.hintCount.innerHTML = "Hints <b>" + state.hints + "</b>";
    L8.sound.penalty();
    FX.flash("#ff2e97");
    var badge = L8.el("div", { class: "penalty", text: "−10s" });
    ui.dial.appendChild(badge);
    setTimeout(function () { badge.remove(); }, 1400);
    tick();
    if (state.phase === "running") ui.inputs[firstEmpty()].focus();
  }

  function entered() {
    return ui.inputs.map(function (i) { return i.value; }).join("");
  }

  function crack() {
    if (state.phase !== "running") return;
    var code = entered();
    if (!/^\d{4}$/.test(code)) {
      shake();
      setStatus("info", "Enter all 4 digits first");
      ui.inputs[firstEmpty()].focus();
      return;
    }
    if (code === state.vault.answer) {
      stopClock();
      state.phase = "cracked";
      done[state.vault.id] = true;
      setStatus("ok", "VAULT CRACKED!");
      L8.sound.success();
      renderPhase();
      FX.flash("#3dff8f");
      FX.burstAt(ui.code, { count: 140, power: 11 });
      setTimeout(function () { FX.burstAt(ui.dial, { count: 70, power: 8 }); }, 180);
      ui.next.focus();
    } else {
      shake();
      FX.flash("#ff3d5a");
      L8.sound.error();
      setStatus("bad", "INCORRECT CODE — TRY AGAIN");
      clearInputs();
      ui.inputs[0].focus();
    }
  }

  function nextVault() {
    var id = deck.next();
    // skip the vault that's already on screen if the deck happens to land on it
    if (state.vault && id === state.vault.id && playable.length > 1) id = deck.next();
    loadVault(id);
  }

  function shake() {
    ui.code.classList.remove("shake");
    void ui.code.offsetWidth; // restart animation
    ui.code.classList.add("shake");
  }

  /* ---------- code inputs ---------- */

  function clearInputs() { ui.inputs.forEach(function (i) { i.value = ""; }); }
  function firstEmpty() {
    for (var i = 0; i < 4; i++) if (!ui.inputs[i].value) return i;
    return 3;
  }

  ui.inputs.forEach(function (input, idx) {
    input.addEventListener("input", function () {
      var digits = input.value.replace(/\D/g, "");
      if (digits.length > 1) {
        // typed over an existing digit, or pasted several digits
        fill(idx, digits);
        return;
      }
      input.value = digits;
      if (digits && idx < 3) ui.inputs[idx + 1].focus();
      if (ui.status.classList.contains("status--bad") || ui.status.classList.contains("status--info")) setStatus("", "");
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        ui.inputs[idx - 1].value = "";
        ui.inputs[idx - 1].focus();
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && idx > 0) {
        ui.inputs[idx - 1].focus(); e.preventDefault();
      } else if (e.key === "ArrowRight" && idx < 3) {
        ui.inputs[idx + 1].focus(); e.preventDefault();
      } else if (e.key === "Enter") {
        crack(); e.preventDefault();
      }
    });
    input.addEventListener("focus", function () { input.select(); });
    input.addEventListener("paste", function (e) {
      var text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
      if (text) { e.preventDefault(); fill(idx, text); }
    });
  });

  function fill(from, digits) {
    for (var i = 0; i < digits.length && from + i < 4; i++) ui.inputs[from + i].value = digits[i];
    ui.inputs[Math.min(3, from + digits.length)].focus();
  }

  /* ---------- buttons & keys ---------- */

  ui.start.addEventListener("click", startVault);
  ui.crack.addEventListener("click", crack);
  ui.hint.addEventListener("click", hint);
  ui.next.addEventListener("click", nextVault);

  document.addEventListener("keydown", function (e) {
    if (!ui.drawer.classList.contains("hidden")) {
      if (e.key === "Escape") closeDrawer();
      return;
    }
    if (e.target.tagName === "INPUT") return;
    if (e.key === "Enter" && document.activeElement && document.activeElement.tagName === "BUTTON") return; // let the button handle it
    if (e.key === "Enter") {
      if (state.phase === "ready") startVault();
      else if (state.phase === "cracked" || state.phase === "timeout") nextVault();
    }
  });

  /* ---------- operator drawer ---------- */

  function openDrawer() {
    ui.drawer.classList.remove("hidden");
    ui.backdrop.classList.remove("hidden");
    renderGrid();
  }
  function closeDrawer() {
    ui.drawer.classList.add("hidden");
    ui.backdrop.classList.add("hidden");
    hideAnswer();
  }
  function showAnswer() { if (state.vault) ui.answerOut.textContent = state.vault.answer; }
  function hideAnswer() { ui.answerOut.textContent = "····"; }

  $("operatorBtn").addEventListener("click", openDrawer);
  $("drawerClose").addEventListener("click", closeDrawer);
  ui.backdrop.addEventListener("click", closeDrawer);
  ["mousedown", "touchstart"].forEach(function (ev) { ui.peek.addEventListener(ev, showAnswer); });
  ["mouseup", "mouseleave", "touchend", "touchcancel", "blur"].forEach(function (ev) { ui.peek.addEventListener(ev, hideAnswer); });
  ui.peek.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") showAnswer(); });
  ui.peek.addEventListener("keyup", hideAnswer);

  $("restartBtn").addEventListener("click", function () {
    if (state.vault) loadVault(state.vault.id);
    closeDrawer();
  });
  $("resetDeckBtn").addEventListener("click", function () {
    deck.reset();
    done = {};
    renderGrid();
  });

  L8.bindMuteButton($("muteBtn"));
  L8.startClock($("clock"));

  // keep the timer honest if the tab was hidden
  document.addEventListener("visibilitychange", function () { if (state.phase === "running") tick(); });

  FX.init({ calm: true });
  nextVault();
})();
