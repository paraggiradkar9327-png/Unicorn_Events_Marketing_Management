/**
 * UNICORN EVENTS — Admin Panel
 *
 * SECRET TRIGGER: Press the tilde key (~) three times rapidly
 * to reveal the admin button in the bottom-right corner.
 *
 * PASSWORD: unicorn2026
 *
 * The uploaded video is stored in IndexedDB so it persists
 * across page refreshes without needing a server.
 */

(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────
  const ADMIN_PASSWORD = 'unicorn2026';
  const SECRET_KEY = '`';   // tilde/backtick key
  const SECRET_PRESSES = 3;     // how many times to press it
  const SECRET_WINDOW_MS = 1500;  // within this time window
  const DB_NAME = 'unicornEventsAdmin';
  const DB_VERSION = 1;
  const STORE_NAME = 'heroVideo';
  const VIDEO_KEY = 'currentVideo';
  // ──────────────────────────────────────────────────────────

  let keyPressLog = [];
  let db = null;

  // ─── INDEXEDDB SETUP ──────────────────────────────────────
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        e.target.result.createObjectStore(STORE_NAME);
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function saveVideoToDB(blob) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, VIDEO_KEY);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function getVideoFromDB() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(VIDEO_KEY);
      req.onsuccess = (e) => resolve(e.target.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // ─── APPLY VIDEO TO HERO ──────────────────────────────────
  function applyVideoToHero(url) {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;
    // Update the source and reload
    const source = heroVideo.querySelector('source');
    if (source) source.src = url;
    else {
      const s = document.createElement('source');
      s.src = url;
      s.type = 'video/mp4';
      heroVideo.appendChild(s);
    }
    heroVideo.load();
    heroVideo.play().catch(() => { });
  }

  // ─── LOAD SAVED VIDEO ON PAGE LOAD ───────────────────────
  async function loadSavedVideo() {
    try {
      db = await openDB();
      const blob = await getVideoFromDB();
      if (blob) {
        const url = URL.createObjectURL(blob);
        applyVideoToHero(url);
      }
    } catch (err) {
      console.warn('[Admin] Could not load saved video:', err);
    }
  }

  // ─── SECRET KEY LISTENER ──────────────────────────────────
  function initSecretTrigger() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== SECRET_KEY) return;

      const now = Date.now();
      keyPressLog = keyPressLog.filter(t => now - t < SECRET_WINDOW_MS);
      keyPressLog.push(now);

      if (keyPressLog.length >= SECRET_PRESSES) {
        keyPressLog = [];
        showAdminTriggerBtn();
      }
    });
  }

  // ─── ADMIN TRIGGER BUTTON ─────────────────────────────────
  function showAdminTriggerBtn() {
    const btn = document.getElementById('admin-trigger-btn');
    if (!btn) return;
    btn.style.display = 'block';
    // Auto-hide after 8 seconds if admin doesn't click
    setTimeout(() => {
      if (btn.style.display !== 'none') btn.style.display = 'none';
    }, 8000);
  }

  // ─── MODAL CONTROLS ───────────────────────────────────────
  function openModal() {
    const overlay = document.getElementById('admin-overlay');
    overlay.classList.add('active');
    document.getElementById('admin-trigger-btn').style.display = 'none';
    resetToPasswordStep();
    setTimeout(() => document.getElementById('admin-password-input').focus(), 100);
  }

  function closeModal() {
    document.getElementById('admin-overlay').classList.remove('active');
    resetToPasswordStep();
  }

  function resetToPasswordStep() {
    document.getElementById('admin-step-password').style.display = 'block';
    document.getElementById('admin-step-upload').style.display = 'none';
    document.getElementById('admin-password-input').value = '';
    document.getElementById('admin-password-error').textContent = '';
  }

  // ─── PASSWORD STEP ────────────────────────────────────────
  function handlePasswordSubmit() {
    const input = document.getElementById('admin-password-input');
    const error = document.getElementById('admin-password-error');
    const val = input.value.trim();

    if (val === ADMIN_PASSWORD) {
      error.textContent = '';
      document.getElementById('admin-step-password').style.display = 'none';
      document.getElementById('admin-step-upload').style.display = 'block';
    } else {
      error.textContent = 'Incorrect password. Please try again.';
      input.value = '';
      input.focus();
    }
  }

  // ─── UPLOAD STEP ─────────────────────────────────────────
  function handleFileSelected(file) {
    if (!file) return;

    const nameEl = document.getElementById('upload-filename');
    const btn = document.getElementById('upload-submit-btn');
    nameEl.textContent = file.name;
    btn.disabled = false;
  }

  async function handleUploadSubmit() {
    const fileInput = document.getElementById('video-file-input');
    const file = fileInput.files[0];
    if (!file) return;

    const btn = document.getElementById('upload-submit-btn');
    const progress = document.getElementById('upload-progress');
    const bar = document.getElementById('upload-progress-bar');
    const success = document.getElementById('upload-success');

    btn.disabled = true;
    btn.textContent = 'Saving...';
    progress.classList.add('active');

    // Simulate progress while reading
    let pct = 0;
    const ticker = setInterval(() => {
      pct = Math.min(pct + 8, 85);
      bar.style.width = pct + '%';
    }, 80);

    try {
      // Save blob to IndexedDB
      await saveVideoToDB(file);
      clearInterval(ticker);
      bar.style.width = '100%';

      // Apply to hero video
      const url = URL.createObjectURL(file);
      applyVideoToHero(url);

      // Show success, then close modal
      setTimeout(() => {
        progress.classList.remove('active');
        bar.style.width = '0%';
        success.classList.add('active');
        btn.style.display = 'none'; // hide upload button after upload

        setTimeout(() => {
          success.classList.remove('active');
          closeModal();
          btn.style.display = '';
          btn.disabled = false;
          btn.textContent = 'Upload Video';
          fileInput.value = '';
          document.getElementById('upload-filename').textContent = '';
        }, 2200);
      }, 400);

    } catch (err) {
      clearInterval(ticker);
      progress.classList.remove('active');
      bar.style.width = '0%';
      btn.disabled = false;
      btn.textContent = 'Upload Video';
      alert('Failed to save video. Please try again.');
      console.error('[Admin] Upload error:', err);
    }
  }

  // ─── DRAG & DROP ──────────────────────────────────────────
  function initDragDrop() {
    const zone = document.getElementById('upload-drop-zone');
    if (!zone) return;

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        document.getElementById('video-file-input').files = e.dataTransfer.files;
        handleFileSelected(file);
      }
    });
  }

  // ─── WIRE UP ALL EVENTS ───────────────────────────────────
  function initEvents() {
    // Trigger button → open modal
    document.getElementById('admin-trigger-btn')
      .addEventListener('click', openModal);

    // Close button
    document.getElementById('admin-close')
      .addEventListener('click', closeModal);

    // Click outside modal → close
    document.getElementById('admin-overlay')
      .addEventListener('click', (e) => {
        if (e.target === document.getElementById('admin-overlay')) closeModal();
      });

    // Password: submit on Enter or button click
    document.getElementById('admin-password-input')
      .addEventListener('keydown', (e) => { if (e.key === 'Enter') handlePasswordSubmit(); });
    document.getElementById('admin-password-btn')
      .addEventListener('click', handlePasswordSubmit);

    // File input change
    document.getElementById('video-file-input')
      .addEventListener('change', (e) => handleFileSelected(e.target.files[0]));

    // Upload submit
    document.getElementById('upload-submit-btn')
      .addEventListener('click', handleUploadSubmit);

    initDragDrop();
  }

  // ─── INIT ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    loadSavedVideo();
    initSecretTrigger();
    initEvents();
  });

  // Run after DOM is ready
  document.addEventListener('DOMContentLoaded', renderBrandGrid);

})();
