
/* ── Services Dropdown ── */
const trigger = document.getElementById('servicesTrigger');
const dropdown = document.getElementById('servicesDropdown');
const chevron = document.getElementById('servicesChevron');
const trigText = document.getElementById('servicesTriggerText');
const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');

function updateTriggerText() {
    const selected = [...checkboxes].filter(c => c.checked).map(c => c.value);
    if (selected.length === 0) {
        trigText.textContent = 'Choose services…';
        trigText.classList.remove('has-value');
    } else {
        trigText.textContent = selected.join(', ');
        trigText.classList.add('has-value');
    }
}

trigger.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    trigger.classList.toggle('open', open);
    chevron.classList.toggle('open', open);
});

trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
    }
});

checkboxes.forEach(cb => cb.addEventListener('change', updateTriggerText));

document.addEventListener('click', e => {
    if (!document.getElementById('servicesWrapper').contains(e.target)) {
        dropdown.classList.remove('open');
        trigger.classList.remove('open');
        chevron.classList.remove('open');
    }
});

/* ════════════════════════════════════════
   EmailJS Configuration
   ─────────────────────────────────────
   SETUP (free, 2 minutes):
   1. Go to https://www.emailjs.com and sign up
   2. Add Gmail as an Email Service → copy the Service ID
   3. Create an Email Template → copy the Template ID
      (Use these variables in your template:
       {{from_name}}, {{mobile}}, {{from_email}}, {{city}},
       {{bride_name}}, {{groom_name}}, {{wedding_date}},
       {{venue_location}}, {{guests}}, {{services}},
       {{budget}}, {{venue_type}}, {{theme}}, {{special}})
   4. Go to Account → copy your Public Key
   5. Replace the three placeholders below
   ════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ← replace
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // ← replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace

emailjs.init(EMAILJS_PUBLIC_KEY);

document.getElementById('weddingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = this;
    let valid = true;

    /* Validate required fields */
    form.querySelectorAll('[required]').forEach(field => {
        const parent = field.closest('.field');
        if (!field.value.trim()) {
            if (parent) parent.classList.add('error');
            valid = false;
        } else {
            if (parent) parent.classList.remove('error');
        }
    });

    /* Validate radio */
    const venueType = form.querySelector('input[name="venue_type"]:checked');
    if (!venueType) {
        valid = false;
        const rf = form.querySelector('input[name="venue_type"]').closest('.field');
        if (rf) rf.classList.add('error');
    }

    if (!valid) {
        form.querySelector('.error input, .error textarea, .error .services-trigger')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    /* Gather data */
    const templateParams = {
        to_email: 'unicornevents2007@gmail.com',
        from_name: document.getElementById('name').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        city: document.getElementById('city').value.trim(),
        bride_name: document.getElementById('bride').value.trim(),
        groom_name: document.getElementById('groom').value.trim(),
        wedding_date: document.getElementById('wdate').value,
        venue_location: document.getElementById('venue').value.trim(),
        guests: document.getElementById('guests').value.trim(),
        services: [...checkboxes].filter(c => c.checked).map(c => c.value).join(', ') || 'None selected',
        budget: '₹' + document.getElementById('budget').value.trim(),
        venue_type: venueType ? venueType.value : '',
        theme: document.getElementById('theme').value.trim() || '—',
        special: document.getElementById('special').value.trim() || '—',
    };

    /* Disable button & show loading */
    const btn = form.querySelector('.submit-btn');
    btn.disabled = true;
    btn.querySelector('.submit-btn-text').textContent = 'Sending…';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            form.style.display = 'none';
            const success = document.getElementById('formSuccess');
            success.style.display = 'flex';
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(err => {
            console.error('EmailJS error:', err);
            btn.disabled = false;
            btn.querySelector('.submit-btn-text').textContent = 'Submit Enquiry';
            document.getElementById('sendError').style.display = 'block';
        });
});

/* Remove error on input */
document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
        const parent = el.closest('.field');
        if (parent) parent.classList.remove('error');
    });
});
