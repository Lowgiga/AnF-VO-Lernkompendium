/*
 * RobotNav v2.8.0
 * Five-part architecture: DOM inventory -> obstacle cache -> position planner
 * -> motion controller -> event scheduler.
 * Standalone browser JavaScript; no network calls, dependencies, timers for polling,
 * or perpetual animation loop. Compatible with the v2.7.0 HTML contract.
 */
(function () {
  'use strict';

  var stage = document.getElementById('object-stage');
  if (!stage) return;
  var robot = stage.querySelector('.robot3d');
  var debugEnabled = /[?&]robotdebug=1(?:&|$)/.test(window.location.search) && window.innerWidth > 760;
  var debugCanvas = null, debugCtx = null;
  var lastSide = 'right', lastProgress = null, lastTarget = null;
  var raf = 0, dirtyFlags = 0, processing = false, destroyed = false;
  var stateTimer = 0, resizeObserver = null, mutationObserver = null;
  var cache = [], cacheValid = false, inventoryDirty = true;
  var scrollRoots = new Map(), observedRoots = new Set();
  var ownWriteDepth = 0, ownMutationTargets = new WeakSet();
  var diagnostics = { scans: 0, measurements: 0, flushes: 0, observerCallbacks: 0, lastFlushMs: 0, maxFlushMs: 0, lastFlags: 0 };

  var FLAGS = { NONE: 0, SCROLL: 1, STICKY: 2, MEDIA: 4, RESIZE: 8, DOM: 16, FULL: 32, VIEW: 64, PAGE: 128 };
  var LAYOUT_FLAGS = FLAGS.MEDIA | FLAGS.RESIZE | FLAGS.DOM | FLAGS.FULL | FLAGS.VIEW | FLAGS.PAGE;
  var BASE_W = 300, BASE_H = 350, EDGE = 12, MIN_SIDE = 104;
  var HARD = 'header,dialog,[role="dialog"],[aria-modal="true"],button,input,textarea,select,video,iframe,canvas,img,svg,a,[class*="logo"],[id*="logo"],[data-robot-obstacle="hard"]';
  var TEXT = 'h1,h2,h3,h4,h5,h6,p,li,summary,legend,label,td,th,figcaption,blockquote,[data-robot-obstacle="text"]';
  var LANDMARK = '.startbox,.tocle,.card,article.page.current,.info section,[data-robot-anchor]';

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function area(r) { return Math.max(0, r.width) * Math.max(0, r.height); }
  function rectOf(el) {
    diagnostics.measurements++;
    var r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  }
  function intersects(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
  function overlapArea(a, b) {
    return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  }
  function computedVisible(el, r) {
    if (!el || !el.isConnected || el.closest('#object-stage') || el.closest('.vhid') ||
        el.closest('[aria-hidden="true"]') || el.closest('[data-robot-passable="true"]') ||
        el.closest('[hidden],template')) return false;
    if (r.width < 4 || r.height < 4) return false;
    var cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity !== 0;
  }
  function visible(el) {
    if (!el) return false;
    var r = rectOf(el);
    return computedVisible(el, r) && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }

  // 1. DOM Inventory: classify each obstacle once per layout epoch and retain element references.
  function nearestScrollRoot(el) {
    var p = el.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      var cs = window.getComputedStyle(p);
      if (/(auto|scroll|overlay)/.test(cs.overflowY + ' ' + cs.overflowX) &&
          (p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1)) return p;
      p = p.parentElement;
    }
    return window;
  }
  function classify(el) {
    var forced = el.getAttribute('data-robot-obstacle');
    if (forced === 'none') return null;
    if (forced === 'hard' || el.matches(HARD)) return 'hard';
    if (forced === 'text' || el.matches(TEXT)) return 'text';
    return null;
  }
  function inventory() {
    diagnostics.scans++;
    var nodes = document.querySelectorAll(HARD + ',' + TEXT), out = [], seen = new Set();
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (seen.has(el) || !el.isConnected || el.closest('#object-stage')) continue;
      seen.add(el);
      var type = classify(el);
      if (!type) continue;
      if (type === 'text') {
        if (el.parentElement && el.parentElement.closest('button,a.tocl,[role="dialog"],[aria-modal="true"]')) continue;
        var content = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!content && !el.getAttribute('aria-label')) continue;
      }
      var cs = window.getComputedStyle(el);
      var sticky = cs.position === 'sticky';
      var fixed = cs.position === 'fixed';
      var root = fixed ? window : nearestScrollRoot(el);
      var r = rectOf(el), pad = type === 'hard' ? 10 : 5;
      var sy = root === window ? window.scrollY : root.scrollTop;
      var sx = root === window ? window.scrollX : root.scrollLeft;
      var docRect = { left: r.left - (fixed ? 0 : -sx), right: r.right - (fixed ? 0 : -sx),
        top: r.top + (fixed ? 0 : sy), bottom: r.bottom + (fixed ? 0 : sy), width: r.width, height: r.height };
      out.push({ el: el, type: type, tag: el.tagName.toLowerCase(), label: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 54),
        pad: pad, fixed: fixed, sticky: sticky, root: root, doc: docRect, rect: r, rootScrollX: sx, rootScrollY: sy });
    }
    cache = out;
    cacheValid = true;
    inventoryDirty = false;
    refreshScrollRoots();
    return out;
  }
  function refreshScrollRoots() {
    var next = new Set([window]);
    for (var i = 0; i < cache.length; i++) if (cache[i].root !== window) next.add(cache[i].root);
    observedRoots.forEach(function (root) {
      if (!next.has(root)) { root.removeEventListener('scroll', onScroll, scrollOptions); observedRoots.delete(root); }
    });
    next.forEach(function (root) {
      if (!observedRoots.has(root)) { root.addEventListener('scroll', onScroll, scrollOptions); observedRoots.add(root); }
    });
  }

  // 2. Obstacle Cache: convert document/root coordinates to current viewport coordinates.
  function currentObstacles() {
    if (!cacheValid || inventoryDirty) inventory();
    var out = [];
    for (var i = 0; i < cache.length; i++) {
      var o = cache[i];
      if (!o.el.isConnected) { inventoryDirty = true; continue; }
      var r;
      // Sticky elements change their viewport position at a threshold: measure only those live.
      if (o.sticky || o.fixed) {
        r = rectOf(o.el);
      } else if (o.root === window) {
        var sy = window.scrollY, sx = window.scrollX;
        r = { left: o.doc.left - sx, right: o.doc.right - sx, top: o.doc.top - sy, bottom: o.doc.bottom - sy,
          width: o.doc.width, height: o.doc.height };
      } else {
        var dx = o.root.scrollLeft - o.rootScrollX, dy = o.root.scrollTop - o.rootScrollY;
        r = { left: o.rect.left - dx, right: o.rect.right - dx,
          top: o.rect.top - dy, bottom: o.rect.bottom - dy,
          width: o.rect.width, height: o.rect.height };
      }
      if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) continue;
      out.push({ left: r.left - o.pad, top: r.top - o.pad, right: r.right + o.pad, bottom: r.bottom + o.pad,
        width: r.width + 2 * o.pad, height: r.height + 2 * o.pad, type: o.type, tag: o.tag, label: o.label });
    }
    var header = document.querySelector('header');
    if (header && visible(header) && !out.some(function (o) { return o.tag === 'header'; })) {
      var h = rectOf(header); out.push({ left: h.left, top: h.top, right: h.right, bottom: h.bottom, width: h.width, height: h.height, type: 'hard', tag: 'header', label: 'Kopfzeile' });
    }
    return out;
  }

  function findTarget() {
    var current = document.querySelector('article.page.current');
    if (current && visible(current)) return current;
    var view = document.querySelector('.view.active');
    if (!view) return document.querySelector('main');
    var list = view.querySelectorAll(LANDMARK + ',.info'), best = null, bestScore = -Infinity;
    for (var i = 0; i < list.length; i++) {
      var el = list[i]; if (!visible(el)) continue;
      var r = rectOf(el), shown = overlapArea(r, { left: 0, top: 0, right: innerWidth, bottom: innerHeight });
      var score = shown / Math.max(1, area(r)) - Math.abs((r.top + r.height / 2) - innerHeight * .48) / Math.max(1, innerHeight) * .12;
      if (score > bestScore) { best = el; bestScore = score; }
    }
    return best || view;
  }

  // 3. Position Planner: deterministic weighted scoring with collision penalties and hysteresis.
  function makeCandidates(targetRect, obstacles, headerBottom) {
    var spaces = { left: targetRect.left - EDGE, right: innerWidth - targetRect.right - EDGE };
    var maxSpace = Math.max(spaces.left, spaces.right); if (maxSpace < MIN_SIDE) return [];
    var scale = clamp(Math.min(1, (maxSpace - 8) / BASE_W), .42, 1);
    var w = BASE_W * scale, h = Math.min(BASE_H * scale, Math.max(130, innerHeight - headerBottom - EDGE * 2));
    var candidates = [], sides = ['left', 'right'];
    var ys = [targetRect.top + targetRect.height * .22 - h * .25, targetRect.top + targetRect.height * .5 - h * .5, targetRect.bottom - h - targetRect.height * .16];
    var gaps = [10, 22, 34];
    for (var s = 0; s < sides.length; s++) {
      var side = sides[s], space = spaces[side]; if (space < w + 8) continue;
      for (var g = 0; g < gaps.length; g++) {
        var gap = gaps[g]; if (space < w + gap) continue;
        var x = side === 'right' ? targetRect.right + gap : targetRect.left - w - gap;
        for (var y = 0; y < ys.length; y++) {
          var top = clamp(ys[y], headerBottom + EDGE, innerHeight - h - EDGE);
          var box = { left: x, top: top, right: x + w, bottom: top + h, width: w, height: h };
          var score = 0, hardHits = 0, textHits = 0;
          for (var k = 0; k < obstacles.length; k++) {
            var ob = obstacles[k]; if (!intersects(box, ob)) continue;
            var frac = overlapArea(box, ob) / Math.max(1, Math.min(area(box), area(ob)));
            if (ob.type === 'hard') { score += frac * 160; hardHits++; } else { score += frac * 26; textHits++; }
          }
          if (side !== lastSide) score += 16;
          score += gap * .035;
          if (stage.dataset.navLeft) score += Math.hypot(x - parseFloat(stage.dataset.navLeft), top - parseFloat(stage.dataset.navTop)) * .018;
          candidates.push({ side: side, gap: gap, x: x, y: top, w: w, h: h, scale: scale, score: score, hardHits: hardHits, textHits: textHits, space: space });
        }
      }
    }
    candidates.sort(function (a, b) { return a.score - b.score; }); return candidates;
  }
  function pageProgress(targetRect, headerBottom) {
    var travel = Math.max(1, targetRect.height - Math.max(180, innerHeight - headerBottom - 48));
    return clamp((headerBottom + 24 - targetRect.top) / travel, 0, 1);
  }

  // 4. Motion Controller: only writes changed values; scheduler ignores those exact owned mutations.
  function ownedWrite(el, fn) {
    if (!el) return;
    ownWriteDepth++;
    try { fn(); } finally { ownWriteDepth--; ownMutationTargets.add(el); }
  }
  function setStyle(el, prop, value) { if (el.style.getPropertyValue(prop) !== String(value)) el.style.setProperty(prop, String(value)); }
  function state(name, duration) {
    if (stage.getAttribute('data-robot-state') !== name) stage.setAttribute('data-robot-state', name);
    window.clearTimeout(stateTimer);
    if (name !== 'rest') stateTimer = window.setTimeout(function () {
      if (!destroyed && stage.getAttribute('data-robot-state') !== 'rest') stage.setAttribute('data-robot-state', 'rest');
    }, duration || 520);
  }
  function placeRobot(chosen, progress, reason) {
    ownedWrite(stage, function () {
      stage.classList.remove('robot-nav-hidden');
      setStyle(stage, 'left', Math.round(chosen.x) + 'px'); setStyle(stage, 'top', Math.round(chosen.y) + 'px');
      setStyle(stage, 'right', 'auto'); setStyle(stage, 'bottom', 'auto');
      setStyle(stage, 'width', Math.round(chosen.w) + 'px'); setStyle(stage, 'height', Math.round(chosen.h) + 'px');
      setStyle(stage, 'opacity', clamp(.48 + chosen.scale * .48, .55, .96));
      if (stage.dataset.navLeft !== String(chosen.x)) stage.dataset.navLeft = String(chosen.x);
      if (stage.dataset.navTop !== String(chosen.y)) stage.dataset.navTop = String(chosen.y);
      if (stage.dataset.navSide !== chosen.side) stage.dataset.navSide = chosen.side;
    });
    lastSide = chosen.side;
    if (!robot) return;
    ownedWrite(robot, function () {
      var inward = clamp((chosen.gap - 10) / 24, 0, 1);
      setStyle(robot, 'left', chosen.side === 'right' ? '0%' : '66%');
      setStyle(robot, 'bottom', (4 + progress * 48).toFixed(1) + '%');
      setStyle(robot, '--robot-nav-inset', (chosen.side === 'right' ? -1 : 1) * (4 + inward * 12) + 'px');
      setStyle(robot, '--robot-nav-yaw', chosen.side === 'right' ? '-16deg' : '16deg');
    });
    if (lastProgress !== null && Math.abs(progress - lastProgress) > .035 && (reason === 'scroll' || reason === 'sticky')) state('climb', 430);
    else if (reason === 'page') state('turn', 720);
    else if (!stage.getAttribute('data-robot-state')) state('rest', 0);
    lastProgress = progress;
  }
  function hideRobot() { ownedWrite(stage, function () { stage.classList.add('robot-nav-hidden'); }); }
  function createDebug() {
    if (!debugEnabled || debugCanvas) return;
    debugCanvas = document.createElement('canvas'); debugCanvas.id = 'robot-nav-debug'; debugCanvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(debugCanvas); debugCtx = debugCanvas.getContext('2d');
  }
  function drawDebug(obstacles, target, chosen) {
    if (!debugEnabled || !debugCtx) return;
    var d = Math.min(window.devicePixelRatio || 1, 1.5), w = innerWidth, h = innerHeight;
    if (debugCanvas.width !== Math.round(w * d)) debugCanvas.width = Math.round(w * d);
    if (debugCanvas.height !== Math.round(h * d)) debugCanvas.height = Math.round(h * d);
    setStyle(debugCanvas, 'width', w + 'px'); setStyle(debugCanvas, 'height', h + 'px');
    debugCtx.setTransform(d, 0, 0, d, 0, 0); debugCtx.clearRect(0, 0, w, h);
    obstacles.forEach(function (o) {
      debugCtx.fillStyle = o.type === 'hard' ? 'rgba(190,55,48,.12)' : 'rgba(220,151,52,.12)';
      debugCtx.strokeStyle = o.type === 'hard' ? 'rgba(190,55,48,.85)' : 'rgba(220,151,52,.78)';
      debugCtx.lineWidth = 1; debugCtx.fillRect(o.left, o.top, o.width, o.height); debugCtx.strokeRect(o.left, o.top, o.width, o.height);
    });
    if (target) { var r = rectOf(target); debugCtx.setLineDash([5, 4]); debugCtx.strokeStyle = 'rgba(67,151,112,.9)'; debugCtx.lineWidth = 2; debugCtx.strokeRect(r.left, r.top, r.width, r.height); debugCtx.setLineDash([]); }
    if (chosen) { debugCtx.strokeStyle = 'rgba(33,153,166,.95)'; debugCtx.lineWidth = 2; debugCtx.strokeRect(chosen.x, chosen.y, chosen.w, chosen.h); }
  }

  function update(reason, flags) {
    if (destroyed) return;
    if (innerWidth <= 760) {
      ownedWrite(stage, function () { stage.classList.remove('robot-nav-hidden'); setStyle(stage, 'opacity', '.08'); });
      drawDebug([], null, null); return;
    }
    var target = findTarget();
    if (!target) { hideRobot(); drawDebug([], null, null); return; }
    var tr = rectOf(target), header = document.querySelector('header'), hb = header && visible(header) ? rectOf(header).bottom : 0;
    var obstacles = currentObstacles(), choices = makeCandidates(tr, obstacles, hb), chosen = choices[0];
    if (!chosen || (chosen.hardHits > 0 && chosen.score > 100)) { hideRobot(); drawDebug(obstacles, target, null); return; }
    placeRobot(chosen, pageProgress(tr, hb), reason);
    lastTarget = target;
    drawDebug(obstacles, target, chosen);
  }

  // 5. Event Scheduler: bitmask coalescing, snapshot processing, no dropped events, explicit teardown.
  function scheduleFlags(flags) {
    if (destroyed) return;
    dirtyFlags |= flags;
    if (flags & LAYOUT_FLAGS) { cacheValid = false; inventoryDirty = true; }
    if (raf || processing) return;
    raf = window.requestAnimationFrame(flush);
  }
  function flush() {
    raf = 0;
    if (destroyed || dirtyFlags === FLAGS.NONE) return;
    var current = dirtyFlags; dirtyFlags = FLAGS.NONE; processing = true;
    var start = window.performance && performance.now ? performance.now() : Date.now();
    diagnostics.flushes++; diagnostics.lastFlags = current;
    var reason = current & FLAGS.PAGE ? 'page' : current & FLAGS.FULL ? 'layout' : current & FLAGS.VIEW ? 'view' :
      current & FLAGS.RESIZE ? 'resize' : current & FLAGS.MEDIA ? 'media' : current & FLAGS.DOM ? 'view' : current & FLAGS.STICKY ? 'sticky' : 'scroll';
    try {
      if (current & LAYOUT_FLAGS) { cacheValid = false; inventoryDirty = true; }
      update(reason, current);
    } catch (err) {
      // Preserve events scheduled while processing; a failure only invalidates derived cache.
      cacheValid = false; inventoryDirty = true;
      if (window.console && console.error) console.error('[RobotNav v2.8.0] update failed:', err);
    } finally {
      processing = false;
      var end = window.performance && performance.now ? performance.now() : Date.now();
      diagnostics.lastFlushMs = end - start; diagnostics.maxFlushMs = Math.max(diagnostics.maxFlushMs, diagnostics.lastFlushMs);
      if (dirtyFlags !== FLAGS.NONE && !destroyed && !raf) raf = window.requestAnimationFrame(flush);
    }
  }
  var scrollOptions = { passive: true };
  function onScroll() { scheduleFlags(FLAGS.SCROLL | FLAGS.STICKY); }
  function onResize() { scheduleFlags(FLAGS.RESIZE); }
  function observerRelevant(records) {
    for (var i = 0; i < records.length; i++) {
      var m = records[i], t = m.target;
      if (t === debugCanvas || (stage && (t === stage || stage.contains(t)))) continue;
      if (ownWriteDepth > 0 || ownMutationTargets.has(t)) continue;
      if (m.type === 'childList') return true;
      if (m.type === 'attributes' && /^(class|style|hidden|open|src|srcset|width|height|aria-hidden|aria-expanded|data-robot-obstacle|data-robot-passable)$/.test(m.attributeName || '')) return true;
    }
    return false;
  }
  function onMutations(records) {
    diagnostics.observerCallbacks++;
    if (destroyed || !observerRelevant(records)) return;
    scheduleFlags(FLAGS.DOM);
  }
  function onAssetLoad(e) {
    var t = e.target;
    if (t && /^(IMG|VIDEO|IFRAME)$/.test(t.tagName)) scheduleFlags(FLAGS.MEDIA);
  }
  function onPage() { scheduleFlags(FLAGS.FULL | FLAGS.PAGE); }
  function onView() { scheduleFlags(FLAGS.FULL | FLAGS.VIEW); }
  function onFontsReady() { if (!destroyed) scheduleFlags(FLAGS.MEDIA); }

  window.addEventListener('scroll', onScroll, scrollOptions);
  window.addEventListener('resize', onResize, scrollOptions);
  window.addEventListener('kompendium:pagechange', onPage);
  window.addEventListener('kompendium:viewchange', onView);
  window.addEventListener('load', onFontsReady, true);
  document.addEventListener('load', onAssetLoad, true);
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(function () { scheduleFlags(FLAGS.RESIZE); });
    var main = document.querySelector('main'); if (main) resizeObserver.observe(main);
  }
  if (window.MutationObserver) {
    mutationObserver = new MutationObserver(onMutations);
    mutationObserver.observe(document.body, { subtree: true, childList: true, attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'open', 'src', 'srcset', 'width', 'height', 'aria-hidden', 'aria-expanded', 'data-robot-obstacle', 'data-robot-passable'] });
  }
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') document.fonts.ready.then(onFontsReady);
  if (debugEnabled) createDebug();

  function inspect() {
    var target = findTarget();
    return { version: '2.8.0', target: target ? target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') : null,
      obstacles: currentObstacles(), side: lastSide, progress: lastProgress, debug: debugEnabled,
      cacheValid: cacheValid, cacheSize: cache.length, scrollRoots: observedRoots.size,
      diagnostics: Object.assign({}, diagnostics) };
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
    dirtyFlags = FLAGS.NONE;
    window.clearTimeout(stateTimer);
    window.removeEventListener('scroll', onScroll, scrollOptions);
    window.removeEventListener('resize', onResize, scrollOptions);
    window.removeEventListener('kompendium:pagechange', onPage);
    window.removeEventListener('kompendium:viewchange', onView);
    window.removeEventListener('load', onFontsReady, true);
    document.removeEventListener('load', onAssetLoad, true);
    observedRoots.forEach(function (root) { if (root !== window) root.removeEventListener('scroll', onScroll, scrollOptions); });
    observedRoots.clear();
    if (resizeObserver) resizeObserver.disconnect();
    if (mutationObserver) mutationObserver.disconnect();
    if (debugCanvas && debugCanvas.parentNode) debugCanvas.parentNode.removeChild(debugCanvas);
    cache = []; cacheValid = false; inventoryDirty = true;
    if (window.RobotNav && window.RobotNav.destroy === destroy) delete window.RobotNav;
  }
  window.RobotNav = { schedule: function (reason) {
    var map = { layout: FLAGS.FULL, view: FLAGS.FULL | FLAGS.VIEW, resize: FLAGS.RESIZE, scroll: FLAGS.SCROLL | FLAGS.STICKY, sticky: FLAGS.STICKY, page: FLAGS.FULL | FLAGS.PAGE, media: FLAGS.MEDIA, dom: FLAGS.DOM };
    scheduleFlags(map[reason] || FLAGS.FULL);
  }, inspect: inspect, destroy: destroy, flags: FLAGS };
  scheduleFlags(FLAGS.FULL);
})();
