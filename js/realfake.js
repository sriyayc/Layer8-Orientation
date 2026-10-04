/* Real or Fake game logic.
   Each round: random type (logo or URL), random left/right placement, 10-second timer.
   No score — this runs as one station of the Hopscotch game. */

(function () {
  var ROUND_MS = 10 * 1000;

  var logoDeck = new L8.Deck("l8.rf.logos", window.LOGOS.map(function (l) { return l.slug; }));
  var urlDeck = new L8.Deck("l8.rf.urls", window.URLS.map(function (u) { return u.id; }));
  var logoBy = {}, urlBy = {};
  window.LOGOS.forEach(function (l) { logoBy[l.slug] = l; });
  window.URLS.forEach(function (u) { urlBy[u.id] = u; });

  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    start: $("startScreen"), game: $("game"), startBtn: $("startBtn"),
    roundChip: $("roundChip"), timeChip: $("timeChip"),
    bar: $("timebar"), fill: $("timebarFill"),
    kicker: $("kicker"), question: $("question"),
    options: $("options"), result: $("result"), next: $("nextBtn")
  };

  var state = { round: 0, phase: "idle", deadline: 0, interval: null, buttons: [], correctIdx: -1, lastSec: null };

  var LOCK_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function missingBox(src) {
    return L8.el("div", { class: "missing", text: "MISSING IMAGE: " + src });
  }

  function logoContent(src, name) {
    var img = L8.el("img", { class: "rf-option__img", src: src, alt: name + " logo option", draggable: "false" });
    img.addEventListener("error", function () { img.replaceWith(missingBox(src)); });
    return img;
  }

  function urlContent(url) {
    var wrap = L8.el("div", { class: "urlbar-wrap" });
    var dots = L8.el("div", { class: "browser-dots" }, [L8.el("i"), L8.el("i"), L8.el("i")]);
    var bar = L8.el("div", { class: "urlbar" });
    bar.innerHTML = LOCK_SVG;
    // allow line breaks only after URL punctuation, never mid-word
    var span = L8.el("span");
    url.split(/(?<=[/.-?=&_])/).forEach(function (part, i) {
      if (i) span.appendChild(document.createElement("wbr"));
      span.appendChild(document.createTextNode(part));
    });
    bar.appendChild(span);
    wrap.appendChild(dots);
    wrap.appendChild(bar);
    return wrap;
  }

  function newRound() {
    stopClock();
    state.round++;
    state.phase = "running";
    state.lastSec = null;

    var isLogo = Math.random() < 0.5;
    var realFirst = Math.random() < 0.5;
    var options = [];

    if (isLogo) {
      var logo = logoBy[logoDeck.next()];
      ui.kicker.textContent = "Logo challenge";
      ui.question.innerHTML = "";
      ui.question.append("Which ", L8.el("span", { class: "rf-prompt__brand", text: logo.name }), " logo is real?");
      options = [
        { real: true, node: logoContent(logo.real, logo.name) },
        { real: false, node: logoContent(logo.fake, logo.name) }
      ];
    } else {
      var pair = urlBy[urlDeck.next()];
      ui.kicker.textContent = "URL challenge";
      ui.question.textContent = "Which website link is real?";
      options = [
        { real: true, node: urlContent(pair.real) },
        { real: false, node: urlContent(pair.fake) }
      ];
    }
    if (!realFirst) options.reverse();

    ui.options.innerHTML = "";
    state.buttons = [];
    options.forEach(function (opt, i) {
      var btn = L8.el("button", { class: "rf-option", type: "button", "aria-label": "Option " + (i + 1) });
      btn.appendChild(L8.el("span", { class: "rf-option__key", text: String(i + 1) }));
      btn.appendChild(opt.node);
      btn.addEventListener("click", function () { choose(i); });
      ui.options.appendChild(btn);
      state.buttons.push(btn);
      if (opt.real) state.correctIdx = i;
    });

    ui.roundChip.textContent = "Round " + state.round;
    ui.result.textContent = "";
    ui.result.className = "rf-result";
    ui.next.classList.add("hidden");

    state.deadline = Date.now() + ROUND_MS;
    state.interval = setInterval(tick, 50);
    tick();
  }

  function stopClock() {
    if (state.interval) clearInterval(state.interval);
    state.interval = null;
  }

  function tick() {
    var left = Math.max(0, state.deadline - Date.now());
    var secs = Math.ceil(left / 1000);
    ui.timeChip.textContent = "⏱ " + secs;
    ui.fill.style.transform = "scaleX(" + left / ROUND_MS + ")";
    ui.bar.setAttribute("data-level", left <= 3000 ? "danger" : "ok");
    if (secs <= 3 && secs > 0 && secs !== state.lastSec) { state.lastSec = secs; L8.sound.tick(); }
    if (left <= 0) timeUp();
  }

  function tag(btn, text) {
    btn.appendChild(L8.el("span", { class: "rf-option__tag", text: text }));
  }

  function lock() {
    state.buttons.forEach(function (b) { b.disabled = true; });
    ui.next.classList.remove("hidden");
    ui.next.focus();
  }

  function choose(i) {
    if (state.phase !== "running") return;
    stopClock();
    state.phase = "answered";
    var chosen = state.buttons[i];
    var correct = state.buttons[state.correctIdx];
    if (i === state.correctIdx) {
      chosen.classList.add("is-correct");
      tag(chosen, "✔ REAL");
      state.buttons[1 - i].classList.add("is-dim");
      ui.result.textContent = "Correct — that's the real one!";
      ui.result.classList.add("rf-result--ok");
      L8.sound.success();
    } else {
      chosen.classList.add("is-wrong");
      tag(chosen, "✘ FAKE");
      correct.classList.add("is-reveal");
      tag(correct, "✔ REAL");
      ui.result.textContent = "Wrong — that one's a fake.";
      ui.result.classList.add("rf-result--bad");
      L8.sound.error();
    }
    lock();
  }

  function timeUp() {
    if (state.phase !== "running") return;
    stopClock();
    state.phase = "timeout";
    ui.timeChip.textContent = "⏱ 0";
    var correct = state.buttons[state.correctIdx];
    correct.classList.add("is-reveal");
    tag(correct, "✔ REAL");
    state.buttons[1 - state.correctIdx].classList.add("is-dim");
    ui.result.textContent = "⏰ Time's up!";
    ui.result.classList.add("rf-result--time");
    L8.sound.timeup();
    lock();
  }

  ui.startBtn.addEventListener("click", function () {
    ui.start.classList.add("hidden");
    ui.game.classList.remove("hidden");
    newRound();
  });
  ui.next.addEventListener("click", newRound);

  document.addEventListener("keydown", function (e) {
    if (state.phase === "idle") return;
    if (state.phase === "running") {
      if (e.key === "1" || e.key === "ArrowLeft") { choose(0); e.preventDefault(); }
      else if (e.key === "2" || e.key === "ArrowRight") { choose(1); e.preventDefault(); }
    } else if ((e.key === "Enter" || e.key === "n" || e.key === "N") && document.activeElement !== ui.next) {
      newRound(); e.preventDefault();
    }
  });

  document.addEventListener("visibilitychange", function () { if (state.phase === "running") tick(); });

  L8.bindMuteButton($("muteBtn"));
})();
