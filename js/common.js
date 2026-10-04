/* Shared helpers. Plain scripts (no modules) so the site runs from file:// offline. */

var L8 = (function () {
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // localStorage can be unavailable (private windows, blocked storage) — never let it break the game.
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };

  /* A shuffled deck of ids that is remembered per laptop, so the same item
     doesn't come up again until every item has been used once. */
  function Deck(key, ids) {
    this.key = key;
    this.ids = ids.slice();
    var saved = store.get(key, null);
    var valid = saved && Array.isArray(saved.order) &&
      saved.order.length === ids.length &&
      saved.order.every(function (id) { return ids.indexOf(id) !== -1; });
    if (valid) {
      this.order = saved.order;
      this.pos = saved.pos;
    } else {
      this.order = shuffle(ids);
      this.pos = 0;
    }
  }
  Deck.prototype.next = function () {
    if (this.pos >= this.order.length) {
      var last = this.order[this.order.length - 1];
      this.order = shuffle(this.ids);
      // avoid showing the same item twice in a row across a reshuffle
      if (this.order.length > 1 && this.order[0] === last) {
        this.order.push(this.order.shift());
      }
      this.pos = 0;
    }
    var id = this.order[this.pos++];
    this.save();
    return id;
  };
  Deck.prototype.save = function () {
    store.set(this.key, { order: this.order, pos: this.pos });
  };
  Deck.prototype.reset = function () {
    this.order = shuffle(this.ids);
    this.pos = 0;
    this.save();
  };

  // Tiny synthesized sounds (no audio files needed).
  var ctx = null;
  var muted = store.get("l8.muted", false);
  function tone(freqs, dur, type) {
    if (muted) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var t = ctx.currentTime;
      freqs.forEach(function (f, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type || "sine";
        o.frequency.value = f;
        var start = t + i * dur * 0.6;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(start); o.stop(start + dur + 0.02);
      });
    } catch (e) { /* audio unavailable */ }
  }
  var sound = {
    success: function () { tone([523, 659, 784, 1047, 1319], 0.16, "square"); },
    error: function () { tone([220, 165], 0.2, "square"); },
    timeup: function () { tone([392, 330, 262, 196], 0.3, "square"); },
    tick: function () { tone([880], 0.05, "square"); },
    penalty: function () { tone([300, 200], 0.14, "sawtooth"); },
    count: function () { tone([440], 0.12, "square"); },
    go: function () { tone([880, 1175], 0.14, "square"); },
    select: function () { tone([660], 0.05, "square"); },
    isMuted: function () { return muted; },
    toggle: function () { muted = !muted; store.set("l8.muted", muted); return muted; }
  };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) {
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  function bindMuteButton(btn) {
    if (!btn) return;
    var render = function () {
      btn.setAttribute("aria-label", sound.isMuted() ? "Unmute sounds" : "Mute sounds");
      btn.title = btn.getAttribute("aria-label");
      btn.innerHTML = sound.isMuted()
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
    };
    btn.addEventListener("click", function () { sound.toggle(); render(); });
    render();
  }

  // Live HH:MM:SS readout in the top bar.
  function startClock(node) {
    if (!node) return;
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var render = function () {
      var d = new Date();
      node.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    };
    render();
    setInterval(render, 1000);
  }

  // Short "decode" effect: random glyphs settle into the final text, left to right.
  var GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>";
  function scramble(node, text, duration) {
    if (!node) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = text;
      return;
    }
    duration = duration || 520;
    var start = performance.now();
    if (node._scramble) cancelAnimationFrame(node._scramble);
    var frame = function (now) {
      var p = Math.min(1, (now - start) / duration);
      var settled = Math.floor(p * text.length);
      var out = text.slice(0, settled);
      for (var i = settled; i < text.length; i++) {
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      node.textContent = out;
      if (p < 1) node._scramble = requestAnimationFrame(frame);
      else node._scramble = null;
    };
    node._scramble = requestAnimationFrame(frame);
  }

  var ICONS = {
    unlock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/></svg>',
    cross: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
    info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>'
  };

  return {
    shuffle: shuffle, store: store, Deck: Deck, sound: sound, el: el,
    bindMuteButton: bindMuteButton, startClock: startClock, scramble: scramble, ICONS: ICONS
  };
})();
