/* =========================================
   Save Our Wildlife — script.js
   Q4: Toggle button logic (hide / play)
   ========================================= */

(function () {
  'use strict';

  /* --- DOM References --- */
  const video     = document.getElementById('wildlife-video');
  const toggleBtn = document.getElementById('btn-toggle');
  const btnLabel  = document.getElementById('btn-label');
  const btnIcon   = document.getElementById('btn-icon');
  const statusMsg = document.getElementById('btn-status');

  /* Guard: exit silently if elements are missing */
  if (!video || !toggleBtn) return;

  /* --- Helper: is the video currently playing? --- */
  function isPlaying() {
    return !video.paused && !video.ended && video.readyState > 2;
  }

  /* --- Helper: is the video currently hidden? --- */
  function isHidden() {
    return video.classList.contains('is-hidden');
  }

  /* --- Update button label and aria state --- */
  function syncButtonUI() {
    if (isHidden()) {
      /* Video is hidden → button will show & play */
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Play Video';
      toggleBtn.setAttribute('aria-label', 'Show and play the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'false');
      statusMsg.textContent = 'Video hidden';
    } else if (isPlaying()) {
      /* Video is playing → button will hide */
      btnIcon.textContent  = '⊗';
      btnLabel.textContent = 'Hide Video';
      toggleBtn.setAttribute('aria-label', 'Pause and hide the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'true');
      statusMsg.textContent = 'Now playing';
    } else {
      /* Video visible but paused → button will play */
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Play Video';
      toggleBtn.setAttribute('aria-label', 'Play the wildlife video');
      toggleBtn.setAttribute('aria-pressed', 'false');
      statusMsg.textContent = 'Paused';
    }
  }

  /* --- Core Toggle Logic (Q4 requirement) ---
       • If the video IS playing  → pause it and hide it
       • If the video is NOT playing (paused or hidden) → show it and play it
  ------------------------------------------- */
  function handleToggle() {
    if (isPlaying()) {
      /* Video is playing → hide it */
      video.pause();
      video.classList.add('is-hidden');
      /*  Notify screen readers */
      video.setAttribute('aria-hidden', 'true');
    } else {
      /* Video is not playing (paused or hidden) → show & play */
      video.classList.remove('is-hidden');
      video.removeAttribute('aria-hidden');
      video.play().catch(function (err) {
        /* Autoplay may be blocked by browser policy; inform user */
        console.warn('Playback prevented by browser:', err);
        statusMsg.textContent = 'Press play on the video';
      });
    }

    syncButtonUI();
  }

  /* --- Event Listeners --- */
  toggleBtn.addEventListener('click', handleToggle);

  /* Keep button label in sync with native video controls */
  video.addEventListener('play',   syncButtonUI);
  video.addEventListener('pause',  syncButtonUI);
  video.addEventListener('ended',  syncButtonUI);

  /* --- Keyboard: Space / Enter already fire click; nothing extra needed --- */

  /* --- Initial state --- */
  syncButtonUI();

})();
