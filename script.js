(function () {
  'use strict';

  var SPLASH_DURATION = 2800;
  var FACTS = [
    'Over 41,000 species are currently threatened with extinction worldwide.',
    'Deforestation destroys an area of forest the size of a football pitch every second.',
    'Elephants can communicate using sounds too low for humans to hear.',
    'Coral reefs support 25% of all marine life but cover less than 1% of the ocean floor.',
    'A single bee colony can pollinate 300 million flowers each day.',
    'Tigers have lost 95% of their historical range in the last century.',
    'The Amazon rainforest produces about 20% of the world\'s oxygen.',
    'Sea turtles have existed for more than 100 million years.',
    'Pangolins are the most trafficked mammals on Earth.',
    'Wolves were reintroduced to Yellowstone and revived entire ecosystems.'
  ];

  var splash       = document.getElementById('splash');
  var splashCanvas = document.getElementById('splash-canvas');
  var video        = document.getElementById('wildlife-video');
  var toggleBtn    = document.getElementById('btn-toggle');
  var btnLabel     = document.getElementById('btn-label');
  var btnIcon      = document.getElementById('btn-icon');
  var statusMsg    = document.getElementById('btn-status');
  var badgeEl      = document.querySelector('.video-card__badge');
  var badgeText    = document.getElementById('badge-text');
  var progressBar  = document.getElementById('video-progress');
  var timeDisplay  = document.getElementById('video-time');
  var factText     = document.getElementById('fact-text');
  var factCard     = document.getElementById('fact-card');
  var particleCV   = document.getElementById('particle-canvas');

  function initSplashParticles() {
    if (!splashCanvas) return;
    var ctx = splashCanvas.getContext('2d');
    var dots = [];
    var count = 60;

    function resize() {
      splashCanvas.width = window.innerWidth;
      splashCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * splashCanvas.width,
        y: Math.random() * splashCanvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.05
      });
    }

    var running = true;

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0) d.x = splashCanvas.width;
        if (d.x > splashCanvas.width) d.x = 0;
        if (d.y < 0) d.y = splashCanvas.height;
        if (d.y > splashCanvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(46,204,113,' + d.alpha + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();

    setTimeout(function () { running = false; }, SPLASH_DURATION + 800);
  }

  function dismissSplash() {
    if (!splash) {
      revealElements();
      return;
    }
    splash.classList.add('is-gone');
    setTimeout(function () {
      splash.style.display = 'none';
      revealElements();
    }, 600);
  }

  function revealElements() {
    var els = document.querySelectorAll('.reveal-element');
    for (var i = 0; i < els.length; i++) {
      (function (el, delay) {
        setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);
      })(els[i], i * 200);
    }
  }

  initSplashParticles();
  setTimeout(dismissSplash, SPLASH_DURATION);

  if (!video || !toggleBtn) return;

  function isPlaying() {
    return !video.paused && !video.ended && video.readyState > 2;
  }

  function isHidden() {
    return video.classList.contains('is-hidden');
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateTimeDisplay() {
    if (!timeDisplay) return;
    var cur = video.currentTime || 0;
    var dur = video.duration || 0;
    if (isNaN(dur)) dur = 0;
    timeDisplay.textContent = formatTime(cur) + ' / ' + formatTime(dur);
  }

  function updateProgress() {
    if (!progressBar) return;
    var pct = 0;
    if (video.duration && !isNaN(video.duration)) {
      pct = (video.currentTime / video.duration) * 100;
    }
    progressBar.style.width = pct + '%';
  }

  function syncButtonUI() {
    if (isHidden()) {
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Play Video';
      toggleBtn.setAttribute('aria-label', 'Show and play the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'false');
      statusMsg.textContent = 'Hidden';
      if (badgeEl) {
        badgeEl.classList.remove('is-live');
        badgeText.textContent = 'Hidden';
      }
    } else if (isPlaying()) {
      btnIcon.textContent  = '⏸';
      btnLabel.textContent = 'Hide Video';
      toggleBtn.setAttribute('aria-label', 'Pause and hide the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'true');
      statusMsg.textContent = 'Playing';
      if (badgeEl) {
        badgeEl.classList.add('is-live');
        badgeText.textContent = 'Now playing';
      }
    } else {
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Play Video';
      toggleBtn.setAttribute('aria-label', 'Play the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'false');
      statusMsg.textContent = 'Paused';
      if (badgeEl) {
        badgeEl.classList.remove('is-live');
        badgeText.textContent = 'Paused';
      }
    }
  }

  function handleToggle() {
    if (isPlaying()) {
      video.pause();
      video.classList.add('is-hidden');
      video.setAttribute('aria-hidden', 'true');
    } else {
      video.classList.remove('is-hidden');
      video.removeAttribute('aria-hidden');
      video.play().catch(function () {
        statusMsg.textContent = 'Tap play on video';
      });
    }
    syncButtonUI();
  }

  toggleBtn.addEventListener('click', handleToggle);
  video.addEventListener('play', syncButtonUI);
  video.addEventListener('pause', syncButtonUI);
  video.addEventListener('ended', function () {
    syncButtonUI();
    if (progressBar) progressBar.style.width = '0%';
  });
  video.addEventListener('timeupdate', function () {
    updateTimeDisplay();
    updateProgress();
  });
  video.addEventListener('loadedmetadata', updateTimeDisplay);

  syncButtonUI();

  var factIndex = Math.floor(Math.random() * FACTS.length);

  function showFact() {
    if (!factText || !factCard) return;
    factCard.classList.add('is-swapping');
    setTimeout(function () {
      factText.textContent = FACTS[factIndex];
      factIndex = (factIndex + 1) % FACTS.length;
      factCard.classList.remove('is-swapping');
    }, 400);
  }

  showFact();
  setInterval(showFact, 6000);

  if (!particleCV) return;
  var pCtx = particleCV.getContext('2d');
  var particles = [];
  var PCOUNT = 40;

  function pResize() {
    particleCV.width  = window.innerWidth;
    particleCV.height = window.innerHeight;
  }
  pResize();
  window.addEventListener('resize', pResize);

  for (var i = 0; i < PCOUNT; i++) {
    particles.push({
      x: Math.random() * particleCV.width,
      y: Math.random() * particleCV.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.25,
      dy: -Math.random() * 0.25 - 0.05,
      alpha: Math.random() * 0.2 + 0.05,
      color: Math.random() > 0.6 ? '240,192,64' : '46,204,113'
    });
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCV.width, particleCV.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      if (p.y + p.r < 0) {
        p.y = particleCV.height + p.r;
        p.x = Math.random() * particleCV.width;
      }
      if (p.x < -p.r) p.x = particleCV.width + p.r;
      if (p.x > particleCV.width + p.r) p.x = -p.r;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      pCtx.fill();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

})();
