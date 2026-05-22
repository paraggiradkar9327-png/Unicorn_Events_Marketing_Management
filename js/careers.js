(() => {
    'use strict';

    /* ───────────────── CONFIG ───────────────── */
    const CONFIG = {
        ADMIN_PASSWORD: 'unicorn2026',
        SECRET_KEY: '`',
        SECRET_PRESSES: 3,
        SECRET_WINDOW_MS: 1500,
        JOBS_KEY: 'unicorn_careers_jobs'
    };

    /* ───────────────── HELPERS ───────────────── */
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const safeParse = (value, fallback) => {
        try {
            return JSON.parse(value) || fallback;
        } catch {
            return fallback;
        }
    };

    const typeMap = {
        'full-time': 'Full-Time',
        'part-time': 'Part-Time',
        freelance: 'Freelance',
        internship: 'Internship'
    };

    const typeLabel = (type) => typeMap[type] || type;

    /* ───────────────── DEFAULT DATA ───────────────── */
    const defaultJobs = [
        {
            id: 1,
            title: 'Senior Event Producer',
            dept: 'Event Production',
            type: 'full-time',
            location: 'Mumbai',
            experience: '5+ years',
            salary: '₹10–14 LPA',
            urgent: true,
            desc: 'Lead end-to-end production of large-scale corporate events and brand activations across India.',
            skills: ['Event Management', 'Vendor Coordination'],
            postedAt: '2026-05-01'
        }
    ];

    /* ───────────────── STATE ───────────────── */
    let jobs = safeParse(
        localStorage.getItem(CONFIG.JOBS_KEY),
        [...defaultJobs]
    );

    let activeFilter = 'all';
    let secretKeys = [];

    /* ───────────────── ELEMENTS ───────────────── */
    const elements = {
        jobsGrid: $('#jobs-grid'),
        adminList: $('#admin-jobs-list'),
        footerYear: $('#footer-year'),

        overlay: $('#admin-overlay'),
        triggerBtn: $('#admin-trigger-btn'),

        passwordStep: $('#admin-step-password'),
        jobsStep: $('#admin-step-jobs'),

        passwordInput: $('#admin-password-input'),
        passwordError: $('#admin-password-error'),

        postError: $('#post-error'),
        postSuccess: $('#post-success')
    };

    /* ───────────────── STORAGE ───────────────── */
    const saveJobs = () => {
        localStorage.setItem(CONFIG.JOBS_KEY, JSON.stringify(jobs));
    };

    /* ───────────────── TEMPLATE HELPERS ───────────────── */
    const icon = {
        location: `
      <svg viewBox="0 0 24 24">
        <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
      </svg>
    `,
        clock: `
      <svg viewBox="0 0 24 24">
        <path d="M12 6v6h4.5"/>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    `,
        money: `
      <svg viewBox="0 0 24 24">
        <path d="M12 6v12"/>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    `
    };

    const createTag = (svg, text) => `
    <span class="job-tag">
      ${svg}
      ${text}
    </span>
  `;

    /* ───────────────── RENDER JOBS ───────────────── */
    function renderJobs() {
        const filtered =
            activeFilter === 'all'
                ? jobs
                : jobs.filter(job => job.type === activeFilter);

        if (!filtered.length) {
            elements.jobsGrid.innerHTML = `
        <div class="no-jobs">
          <p>No openings right now. Check back soon.</p>
        </div>
      `;
            return;
        }

        elements.jobsGrid.innerHTML = filtered.map(job => `
      <article class="job-card fade-in">

        <div class="job-top">
          <div>
            <h3>${job.title}</h3>
            <p class="job-dept">${job.dept}</p>
          </div>

          <span class="job-badge ${job.urgent ? 'urgent' : ''}">
            ${job.urgent ? 'Urgent' : typeLabel(job.type)}
          </span>
        </div>

        <p class="job-desc">${job.desc}</p>

        <div class="job-meta">
          ${createTag(icon.location, job.location)}
          ${createTag(icon.clock, typeLabel(job.type))}

          ${job.experience
                ? createTag(icon.clock, job.experience)
                : ''}

          ${job.salary
                ? createTag(icon.money, job.salary)
                : ''}
        </div>

        <div class="job-apply-row">
          <p>
            Apply:
            <a href="mailto:support@unicornevent.com?subject=${encodeURIComponent(`Application: ${job.title}`)}">
              support@unicornevent.com
            </a>
          </p>
        </div>

      </article>
    `).join('');

        animateCards();
    }

    /* ───────────────── RENDER ADMIN LIST ───────────────── */
    function renderAdminList() {
        if (!jobs.length) {
            elements.adminList.innerHTML =
                '<p class="admin-empty">No listings available.</p>';
            return;
        }

        elements.adminList.innerHTML = jobs.map(job => `
      <div class="admin-job-row">
        <div class="admin-job-row-info">
          <div class="title">${job.title}</div>
          <div class="meta">
            ${typeLabel(job.type)} · ${job.location}
          </div>
        </div>

        <button
          class="admin-del-btn"
          data-id="${job.id}">
          &times;
        </button>
      </div>
    `).join('');
    }

    /* ───────────────── DELETE JOB ───────────────── */
    elements.adminList?.addEventListener('click', (e) => {
        const btn = e.target.closest('.admin-del-btn');
        if (!btn) return;

        const id = Number(btn.dataset.id);

        jobs = jobs.filter(job => job.id !== id);

        saveJobs();
        renderJobs();
        renderAdminList();
    });

    /* ───────────────── FILTERS ───────────────── */
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {

            $$('.filter-btn').forEach(b =>
                b.classList.remove('active')
            );

            btn.classList.add('active');

            activeFilter = btn.dataset.filter;

            renderJobs();
        });
    });

    /* ───────────────── ADMIN TABS ───────────────── */
    $$('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {

            $$('.admin-tab').forEach(t =>
                t.classList.remove('active')
            );

            $$('.admin-tab-panel').forEach(panel =>
                panel.classList.remove('active')
            );

            tab.classList.add('active');

            $(`#tab-${tab.dataset.tab}`)
                ?.classList.add('active');

            if (tab.dataset.tab === 'manage') {
                renderAdminList();
            }
        });
    });

    /* ───────────────── FORM HELPERS ───────────────── */
    const formFields = [
        'job-title',
        'job-location',
        'job-experience',
        'job-salary',
        'job-desc',
        'job-skills'
    ];

    function clearForm() {
        formFields.forEach(id => {
            $(`#${id}`).value = '';
        });

        $('#job-dept').value = '';
        $('#job-type').value = '';
        $('#job-urgent').value = 'false';

        elements.postError.textContent = '';
    }

    /* ───────────────── POST JOB ───────────────── */
    $('#post-job-btn')?.addEventListener('click', () => {

        const data = {
            title: $('#job-title').value.trim(),
            dept: $('#job-dept').value,
            type: $('#job-type').value,
            location: $('#job-location').value.trim(),
            experience: $('#job-experience').value.trim(),
            salary: $('#job-salary').value.trim(),
            desc: $('#job-desc').value.trim(),
            skills: $('#job-skills')
                .value
                .split(',')
                .map(s => s.trim())
                .filter(Boolean),
            urgent: $('#job-urgent').value === 'true'
        };

        if (
            !data.title ||
            !data.dept ||
            !data.type ||
            !data.location ||
            !data.desc
        ) {
            elements.postError.textContent =
                'Please fill all required fields.';
            return;
        }

        jobs.unshift({
            ...data,
            id: Date.now(),
            postedAt: new Date().toISOString().split('T')[0]
        });

        saveJobs();

        renderJobs();

        clearForm();

        elements.postSuccess.classList.add('active');

        setTimeout(() => {
            elements.postSuccess.classList.remove('active');
        }, 3000);
    });

    $('#clear-form-btn')?.addEventListener('click', clearForm);

    /* ───────────────── SECRET ADMIN ACCESS ───────────────── */
    document.addEventListener('keydown', (e) => {

        if (e.key !== CONFIG.SECRET_KEY) return;

        const now = Date.now();

        secretKeys = secretKeys.filter(
            t => now - t < CONFIG.SECRET_WINDOW_MS
        );

        secretKeys.push(now);

        if (secretKeys.length >= CONFIG.SECRET_PRESSES) {
            secretKeys = [];
            showTrigger();
        }
    });

    function showTrigger() {
        elements.triggerBtn.style.display = 'block';

        setTimeout(() => {
            elements.triggerBtn.style.display = 'none';
        }, 8000);
    }

    function resetModal() {
        elements.passwordStep.style.display = 'block';
        elements.jobsStep.style.display = 'none';

        elements.passwordInput.value = '';
        elements.passwordError.textContent = '';
    }

    function openModal() {
        elements.overlay.classList.add('active');

        resetModal();

        setTimeout(() => {
            elements.passwordInput.focus();
        }, 100);
    }

    function closeModal() {
        elements.overlay.classList.remove('active');
        resetModal();
    }

    function verifyPassword() {

        if (
            elements.passwordInput.value.trim() ===
            CONFIG.ADMIN_PASSWORD
        ) {
            elements.passwordStep.style.display = 'none';
            elements.jobsStep.style.display = 'block';
            return;
        }

        elements.passwordError.textContent =
            'Incorrect password';

        elements.passwordInput.value = '';
        elements.passwordInput.focus();
    }

    /* ───────────────── MODAL EVENTS ───────────────── */
    elements.triggerBtn?.addEventListener('click', openModal);

    $('#admin-close')?.addEventListener('click', closeModal);

    elements.overlay?.addEventListener('click', (e) => {
        if (e.target.id === 'admin-overlay') {
            closeModal();
        }
    });

    $('#admin-password-btn')
        ?.addEventListener('click', verifyPassword);

    elements.passwordInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verifyPassword();
    });

    /* ───────────────── ANIMATIONS ───────────────── */
    function animateCards() {
        requestAnimationFrame(() => {
            $$('#jobs-grid .fade-in').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 60);
            });
        });
    }

    /* ───────────────── OBSERVER ───────────────── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    $$('.fade-in').forEach(el => observer.observe(el));

    /* ───────────────── INIT ───────────────── */
    elements.footerYear.textContent =
        new Date().getFullYear();

    renderJobs();

})();