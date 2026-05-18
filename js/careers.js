
(function () {
    'use strict';

    /* ── CONFIG — same pattern as admin.js on the homepage ── */
    const ADMIN_PASSWORD = 'unicorn2026';
    const SECRET_KEY = '`';
    const SECRET_PRESSES = 3;
    const SECRET_WINDOW_MS = 1500;
    const JOBS_KEY = 'unicorn_careers_jobs';

    /* ── DEFAULT SEED DATA ── */
    const defaultJobs = [
        {
            id: 1, title: 'Senior Event Producer', dept: 'Event Production',
            type: 'full-time', location: 'Mumbai', experience: '5+ years',
            salary: '₹10–14 LPA', urgent: true,
            desc: 'Lead end-to-end production of large-scale corporate events and brand activations across India. Own timelines, vendor relationships, and on-ground execution.',
            skills: ['Event Management', 'Vendor Coordination', 'Budget Management', 'Team Leadership'],
            postedAt: '2026-05-01'
        },
        {
            id: 2, title: 'Creative Director', dept: 'Creative & Design',
            type: 'full-time', location: 'Delhi', experience: '7+ years',
            salary: '₹15–20 LPA', urgent: false,
            desc: 'Drive the creative vision across all brand activations and event experiences. Guide designers and collaborate with clients to deliver breathtaking visual identities.',
            skills: ['Art Direction', 'Brand Identity', 'Adobe Suite', 'Team Management'],
            postedAt: '2026-05-03'
        },
        {
            id: 3, title: 'Marketing Executive', dept: 'Marketing & Branding',
            type: 'full-time', location: 'Pune, Hybrid', experience: '2–4 years',
            salary: '₹5–8 LPA', urgent: false,
            desc: 'Plan and execute digital and offline marketing campaigns. Manage social media, content calendars, and post-event analytics reports.',
            skills: ['Social Media', 'Content Creation', 'Google Ads', 'Analytics'],
            postedAt: '2026-05-05'
        },
        {
            id: 4, title: 'Event Coordinator (Intern)', dept: 'Event Production',
            type: 'internship', location: 'Nagpur', experience: 'Fresher',
            salary: '₹12,000/month', urgent: true,
            desc: 'A hands-on internship assisting in logistics, vendor communication, and on-ground support for live events. Perfect launching pad for a career in event management.',
            skills: ['MS Office', 'Communication', 'Multitasking', 'Enthusiasm'],
            postedAt: '2026-05-10'
        },
        {
            id: 5, title: 'AV & Technical Lead', dept: 'Technology & AV',
            type: 'freelance', location: 'Pan-India', experience: '4+ years',
            salary: 'Per Project', urgent: false,
            desc: 'Manage sound, lighting, and stage technology for live events and concerts. Work with our production team to deliver flawless technical execution.',
            skills: ['Sound Engineering', 'Lighting Design', 'Stage Management', 'Equipment Setup'],
            postedAt: '2026-05-08'
        }
    ];

    /* ── DATA ── */
    function loadJobs() {
        try { const s = localStorage.getItem(JOBS_KEY); return s ? JSON.parse(s) : [...defaultJobs]; }
        catch { return [...defaultJobs]; }
    }
    function saveJobs(j) { try { localStorage.setItem(JOBS_KEY, JSON.stringify(j)); } catch { } }

    let allJobs = loadJobs();
    let activeFilter = 'all';

    function typeLabel(t) {
        return { 'full-time': 'Full-Time', 'part-time': 'Part-Time', 'freelance': 'Freelance', 'internship': 'Internship' }[t] || t;
    }

    /* ── RENDER PUBLIC LISTINGS ── */
    function renderJobs() {
        const grid = document.getElementById('jobs-grid');
        const filtered = activeFilter === 'all' ? allJobs : allJobs.filter(j => j.type === activeFilter);

        if (!filtered.length) {
            grid.innerHTML = `<div class="no-jobs">
          <svg viewBox="0 0 24 24"><path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
          <p>No openings right now. Check back soon.</p>
        </div>`;
            return;
        }

        grid.innerHTML = filtered.map(job => `
        <div class="job-card fade-in">
          <div class="job-top">
            <div>
              <h3>${job.title}</h3>
              <p class="job-dept">${job.dept}</p>
            </div>
            <span class="job-badge ${job.urgent ? 'urgent' : ''}">${job.urgent ? 'Urgent' : typeLabel(job.type)}</span>
          </div>
          <p class="job-desc">${job.desc}</p>
          <div class="job-meta">
            <span class="job-tag">
              <svg viewBox="0 0 24 24"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
              ${job.location}
            </span>
            <span class="job-tag">
              <svg viewBox="0 0 24 24"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ${typeLabel(job.type)}
            </span>
            ${job.experience ? `<span class="job-tag">
              <svg viewBox="0 0 24 24"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"/></svg>
              ${job.experience ?
                    (job.experience.includes("years") ? job.experience : `${job.experience} years`)
                    : ''} 
            </span>` : ''}
            ${job.salary ? `<span class="job-tag">
              <svg viewBox="0 0 24 24"><path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ${job.salary ?
                    (job.salary.includes("LPA") ? job.salary : `${job.salary} LPA`)
                    : ''} 
            </span>` : ''}
          </div>
          <div class="job-apply-row">
            <svg viewBox="0 0 24 24"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            <p>To apply, email your resume to <a href="mailto:support@unicornevent.com?subject=${encodeURIComponent('Application: ' + job.title)}">support@unicornevent.com</a> </p>
          </div>
        </div>
      `).join('');

        requestAnimationFrame(() => {
            document.querySelectorAll('#jobs-grid .fade-in').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 70);
            });
        });
    }

    /* ── RENDER ADMIN MANAGE LIST ── */
    function renderAdminList() {
        const list = document.getElementById('admin-jobs-list');
        if (!allJobs.length) {
            list.innerHTML = '<p class="admin-empty">No listings yet. Post one to get started.</p>';
            return;
        }
        list.innerHTML = allJobs.map(job => `
        <div class="admin-job-row">
          <div class="admin-job-row-info">
            <div class="title">${job.title}</div>
            <div class="meta">${typeLabel(job.type)} &middot; ${job.location}</div>
          </div>
          <button class="admin-del-btn" data-id="${job.id}" aria-label="Delete ${job.title}">&times;</button>
        </div>
      `).join('');

        list.querySelectorAll('.admin-del-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                allJobs = allJobs.filter(j => j.id !== id);
                saveJobs(allJobs);
                renderJobs();
                renderAdminList();
            });
        });
    }

    /* ── FILTER BUTTONS ── */
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderJobs();
        });
    });

    /* ── ADMIN TABS ── */
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            if (tab.dataset.tab === 'manage') renderAdminList();
        });
    });

    /* ── POST JOB ── */
    document.getElementById('post-job-btn').addEventListener('click', () => {
        const title = document.getElementById('job-title').value.trim();
        const dept = document.getElementById('job-dept').value;
        const type = document.getElementById('job-type').value;
        const loc = document.getElementById('job-location').value.trim();
        const desc = document.getElementById('job-desc').value.trim();
        const err = document.getElementById('post-error');

        if (!title || !dept || !type || !loc || !desc) {
            err.textContent = 'Please fill all required fields (marked *).'; return;
        }
        err.textContent = '';

        const skillsRaw = document.getElementById('job-skills').value.trim();
        allJobs.unshift({
            id: Date.now(), title, dept, type, location: loc,
            experience: document.getElementById('job-experience').value.trim(),
            salary: document.getElementById('job-salary').value.trim(),
            desc,
            skills: skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            urgent: document.getElementById('job-urgent').value === 'true',
            postedAt: new Date().toISOString().split('T')[0]
        });
        saveJobs(allJobs);
        renderJobs();

        ['job-title', 'job-location', 'job-experience', 'job-salary', 'job-desc', 'job-skills']
            .forEach(id => { document.getElementById(id).value = ''; });
        document.getElementById('job-dept').value = '';
        document.getElementById('job-type').value = '';
        document.getElementById('job-urgent').value = 'false';

        const succ = document.getElementById('post-success');
        succ.classList.add('active');
        setTimeout(() => succ.classList.remove('active'), 3500);
    });

    document.getElementById('clear-form-btn').addEventListener('click', () => {
        ['job-title', 'job-location', 'job-experience', 'job-salary', 'job-desc', 'job-skills']
            .forEach(id => { document.getElementById(id).value = ''; });
        document.getElementById('job-dept').value = '';
        document.getElementById('job-type').value = '';
        document.getElementById('job-urgent').value = 'false';
        document.getElementById('post-error').textContent = '';
    });

    /* ════════════════════════════════════════
       ADMIN SECRET TRIGGER — identical to admin.js
       Press backtick (`) three times within 1.5s
    ════════════════════════════════════════ */
    let keyLog = [];

    document.addEventListener('keydown', (e) => {
        if (e.key !== SECRET_KEY) return;
        const now = Date.now();
        keyLog = keyLog.filter(t => now - t < SECRET_WINDOW_MS);
        keyLog.push(now);
        if (keyLog.length >= SECRET_PRESSES) { keyLog = []; showTrigger(); }
    });

    function showTrigger() {
        const btn = document.getElementById('admin-trigger-btn');
        btn.style.display = 'block';
        setTimeout(() => { if (btn.style.display !== 'none') btn.style.display = 'none'; }, 8000);
    }

    function openModal() {
        document.getElementById('admin-overlay').classList.add('active');
        document.getElementById('admin-trigger-btn').style.display = 'none';
        resetToPassword();
        setTimeout(() => document.getElementById('admin-password-input').focus(), 100);
    }

    function closeModal() {
        document.getElementById('admin-overlay').classList.remove('active');
        resetToPassword();
    }

    function resetToPassword() {
        document.getElementById('admin-step-password').style.display = 'block';
        document.getElementById('admin-step-jobs').style.display = 'none';
        document.getElementById('admin-password-input').value = '';
        document.getElementById('admin-password-error').textContent = '';
    }

    function checkPassword() {
        const input = document.getElementById('admin-password-input');
        const error = document.getElementById('admin-password-error');
        if (input.value.trim() === ADMIN_PASSWORD) {
            error.textContent = '';
            document.getElementById('admin-step-password').style.display = 'none';
            document.getElementById('admin-step-jobs').style.display = 'block';
        } else {
            error.textContent = 'Incorrect password. Please try again.';
            input.value = ''; input.focus();
        }
    }

    document.getElementById('admin-trigger-btn').addEventListener('click', openModal);
    document.getElementById('admin-close').addEventListener('click', closeModal);
    document.getElementById('admin-overlay').addEventListener('click', (e) => { if (e.target.id === 'admin-overlay') closeModal(); });
    document.getElementById('admin-password-btn').addEventListener('click', checkPassword);
    document.getElementById('admin-password-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPassword(); });

    /* ── FADE-IN OBSERVER ── */
    const obs = new IntersectionObserver(entries => {
        entries.forEach(el => { if (el.isIntersecting) { el.target.classList.add('visible'); obs.unobserve(el.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

    /* ── FOOTER YEAR ── */
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    /* ── INIT ── */
    renderJobs();

})();