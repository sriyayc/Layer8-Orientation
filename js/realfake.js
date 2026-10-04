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
    roundChip: $("roundChip"), clock: $("rfClock"), timeNum: $("timeNum"),
    segments: $("segments"), segs: Array.prototype.slice.call($("segments").children),
    kicker: $("kicker"), question: $("question"),
    options: $("options"), result: $("result"), next: $("nextBtn")
  };

  var state = { round: 0, phase: "idle", deadline: 0, interval: null, buttons: [], correctIdx: -1, lastSec: null };

  function missingBox(src) {
    return L8.el("div", { class: "missing", text: "MISSING IMAGE: " + src });
  }

  function logoContent(src, name) {
    var plate = L8.el("div", { class: "plate" });
    var img = L8.el("img", { src: src, alt: name + " logo option", draggable: "false" });
    img.addEventListener("error", function () { img.replaceWith(missingBox(src)); });
    // fill the plate, but never blow a small source image up more than 2x
    img.addEventListener("load", function () {
      img.style.maxWidth = img.naturalWidth * 2 + "px";
      img.style.maxHeight = img.naturalHeight * 2 + "px";
    });
    plate.appendChild(img);
    return plate;
  }

  // A URL rendered the way a link looks in a document: blue and underlined.
  // Line breaks are only allowed after URL punctuation, never mid-word.
  function urlContent(url) {
    var plate = L8.el("div", { class: "plate" });
    var link = L8.el("span", { class: "doc" });
    url.split(/(?<=[\/.\-?=&_])/).forEach(function (part, i) {
      if (i) link.appendChild(document.createElement("wbr"));
      link.appendChild(document.createTextNode(part));
    });
    plate.appendChild(link);
    return plate;
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
      ui.kicker.innerHTML = "Challenge · <b>logo</b>";
      ui.question.innerHTML = "";
      ui.question.append("Which ", L8.el("span", { class: "brand-name", text: logo.name }), " logo is real?");
      options = [
        { real: true, node: logoContent(logo.real, logo.name) },
        { real: false, node: logoContent(logo.fake, logo.name) }
      ];
    } else {
      var pair = urlBy[urlDeck.next()];
      ui.kicker.innerHTML = "Challenge · <b>link</b>";
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
      var wrap = L8.el("div", { class: "opt-wrap glow" });
      var btn = L8.el("button", { class: "rf-option panel", type: "button", "aria-label": "Option " + (i ? "B" : "A") });
      wrap.appendChild(btn);
      var bar = L8.el("div", { class: "rf-option__bar" });
      var key = L8.el("span", { class: "rf-option__key" });
      key.innerHTML = "<b>" + (i + 1) + "</b>Option " + (i ? "B" : "A");
      bar.appendChild(key);
      btn.appendChild(bar);
      btn.appendChild(opt.node);
      btn.addEventListener("click", function () { choose(i); });
      ui.options.appendChild(wrap);
      state.buttons.push(btn);
      if (opt.real) state.correctIdx = i;
    });

    ui.roundChip.textContent = String(state.round).padStart(2, "0");
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
    ui.timeNum.textContent = String(secs).padStart(2, "0");
    ui.segs.forEach(function (s, i) { s.classList.toggle("on", i < secs); });
    var level = left <= 3000 ? "danger" : "ok";
    ui.segments.setAttribute("data-level", level);
    ui.clock.setAttribute("data-level", level);
    if (secs <= 3 && secs > 0 && secs !== state.lastSec) { state.lastSec = secs; L8.sound.tick(); }
    if (left <= 0) timeUp();
  }

  function tag(btn, text) {
    btn.querySelector(".rf-option__bar").appendChild(L8.el("span", { class: "rf-option__tag", text: text }));
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
      chosen.parentNode.classList.add("win");
      tag(chosen, "REAL");
      state.buttons[1 - i].parentNode.classList.add("dim");
      FX.flash("#3dff8f");
      FX.burstAt(chosen, { count: 120, power: 10 });
      ui.result.textContent = "CORRECT! THAT'S THE REAL ONE";
      ui.result.classList.add("rf-result--ok");
      L8.sound.success();
    } else {
      chosen.classList.add("is-wrong");
      chosen.parentNode.classList.add("lose");
      tag(chosen, "FAKE");
      FX.flash("#ff3d5a");
      FX.shake(chosen.parentNode);
      correct.classList.add("is-reveal");
      correct.parentNode.classList.add("win");
      tag(correct, "REAL");
      ui.result.textContent = "WRONG! THAT ONE'S A FAKE";
      ui.result.classList.add("rf-result--bad");
      L8.sound.error();
    }
    lock();
  }

  function timeUp() {
    if (state.phase !== "running") return;
    stopClock();
    state.phase = "timeout";
    var correct = state.buttons[state.correctIdx];
    correct.classList.add("is-reveal");
    correct.parentNode.classList.add("win");
    tag(correct, "REAL");
    state.buttons[1 - state.correctIdx].parentNode.classList.add("dim");
    FX.flash("#ff9a1f");
    ui.result.textContent = "TIME'S UP!";
    ui.result.classList.add("rf-result--time");
    L8.sound.timeup();
    lock();
  }

  function begin() {
    if (state.phase !== "idle" || state.counting) return;
    state.counting = true;
    FX.countdown(["READY?", "GO!"], function () {
      state.counting = false;
      ui.start.classList.add("hidden");
      ui.game.classList.remove("hidden");
      newRound();
    });
  }

  ui.startBtn.addEventListener("click", begin);
  ui.next.addEventListener("click", newRound);

  document.addEventListener("keydown", function (e) {
    if (state.phase === "idle") {
      if (e.key === "Enter" && document.activeElement !== ui.startBtn) { begin(); e.preventDefault(); }
      return;
    }
    if (state.phase === "running") {
      if (e.key === "1" || e.key === "ArrowLeft") { choose(0); e.preventDefault(); }
      else if (e.key === "2" || e.key === "ArrowRight") { choose(1); e.preventDefault(); }
    } else if ((e.key === "Enter" || e.key === "n" || e.key === "N") && document.activeElement !== ui.next) {
      newRound(); e.preventDefault();
    }
  });

  document.addEventListener("visibilitychange", function () { if (state.phase === "running") tick(); });

  FX.init({ calm: true });
  L8.bindMuteButton($("muteBtn"));
  L8.startClock($("clock"));
})();
