(function () {
  'use strict';

  var video     = document.getElementById('wildlife-video');
  var toggleBtn = document.getElementById('btn-toggle');
  var btnLabel  = document.getElementById('btn-label');
  var btnIcon   = document.getElementById('btn-icon');
  var statusMsg = document.getElementById('btn-status');

  if (!video || !toggleBtn) return;

  function isPlaying() {
    return !video.paused && !video.ended && video.readyState > 2;
  }

  function isHidden() {
    return video.classList.contains('is-hidden');
  }

  function syncButtonUI() {
    if (isHidden()) {
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Play Video';
      toggleBtn.setAttribute('aria-label', 'Show and play the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'false');
      statusMsg.textContent = 'Video hidden';
    } else if (isPlaying()) {
      btnIcon.textContent  = '⊗';
      btnLabel.textContent = 'Hide Video';
      toggleBtn.setAttribute('aria-label', 'Pause and hide the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'true');
      statusMsg.textContent = 'Now playing';
    } else {
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Play Video';
      toggleBtn.setAttribute('aria-label', 'Play the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'false');
      statusMsg.textContent = 'Paused';
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
      video.play().catch(function (err) {
        console.warn('Playback prevented by browser:', err);
        statusMsg.textContent = 'Press play on the video';
      });
    }

    syncButtonUI();
  }

  toggleBtn.addEventListener('click', handleToggle);

  video.addEventListener('play',  syncButtonUI);
  video.addEventListener('pause', syncButtonUI);
  video.addEventListener('ended', syncButtonUI);

  syncButtonUI();

  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 35;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.5 ? '61,122,79' : '212,168,83'
    };
  }

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.dx;
      p.y += p.dy;

      if (p.y + p.r < 0) {
        p.y = canvas.height + p.r;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -p.r) p.x = canvas.width + p.r;
      if (p.x > canvas.width + p.r) p.x = -p.r;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  animate();

})();
