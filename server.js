const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend('re_QN5kfgNZ_LUQY7SzYudk5X6oDF2rg3wvf');

app.use(express.static(__dirname));
app.use(express.json());

// ─── CONTACT FORM ─────────────────────────────────────────
app.post('/api/send-contact', async (req, res) => {
  const { first_name, last_name, email, phone, service, event_date, event_location, message } = req.body;

  if (!first_name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Unicorn Events <sales.unicornevents@gmail.com>',
      to: ['unicornevents2007@gmail.com'],
      subject: `New Contact Enquiry from ${first_name} ${last_name}`,
      html: `
        <h2 style="color:#6a0dad">New Contact Enquiry</h2>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;width:160px"><b>Name</b></td><td style="padding:8px;border:1px solid #ddd">${first_name} ${last_name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Phone</b></td><td style="padding:8px;border:1px solid #ddd">${phone || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Service</b></td><td style="padding:8px;border:1px solid #ddd">${service || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Event Date</b></td><td style="padding:8px;border:1px solid #ddd">${event_date || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Event Location</b></td><td style="padding:8px;border:1px solid #ddd">${event_location || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Message</b></td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>
        </table>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Contact email sent! ID:', data.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Contact mail error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ─── WEDDING FORM ─────────────────────────────────────────
app.post('/api/send-wedding', async (req, res) => {
  const { name, mobile, email, city, bride_name, groom_name, wedding_date,
    venue_location, guests, services, budget, venue_type, theme, special } = req.body;

  if (!name || !email || !wedding_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Unicorn Events <onboarding@resend.dev>',
      to: ['unicornevents2007@gmail.com'],
      subject: `New Wedding Enquiry from ${name}`,
      html: `
        <h2 style="color:#6a0dad">New Wedding Enquiry</h2>
        <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;width:160px"><b>Name</b></td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Mobile</b></td><td style="padding:8px;border:1px solid #ddd">${mobile}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>City</b></td><td style="padding:8px;border:1px solid #ddd">${city}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Bride</b></td><td style="padding:8px;border:1px solid #ddd">${bride_name || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Groom</b></td><td style="padding:8px;border:1px solid #ddd">${groom_name || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Wedding Date</b></td><td style="padding:8px;border:1px solid #ddd">${wedding_date}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Venue Location</b></td><td style="padding:8px;border:1px solid #ddd">${venue_location || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Guests</b></td><td style="padding:8px;border:1px solid #ddd">${guests || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Budget</b></td><td style="padding:8px;border:1px solid #ddd">₹${budget || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Venue Type</b></td><td style="padding:8px;border:1px solid #ddd">${venue_type || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Types of Events</b></td><td style="padding:8px;border:1px solid #ddd">${theme || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Special Requirements</b></td><td style="padding:8px;border:1px solid #ddd">${special || '—'}</td></tr>
        </table>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Wedding email sent! ID:', data.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Wedding mail error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ─── VIDEO ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'hero-video' + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const CONFIG_FILE = path.join(__dirname, 'video-config.json');
function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}
function writeConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data));
}

app.get('/api/video-config', (req, res) => res.json(readConfig()));

app.post('/api/upload-video', upload.single('video'), (req, res) => {
  writeConfig({ type: 'file', src: '/uploads/' + req.file.filename });
  res.json({ success: true, src: '/uploads/' + req.file.filename });
});

app.post('/api/set-youtube', (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });
  writeConfig({ type: 'youtube', videoId });
  res.json({ success: true });
});

// ─── CAREERS ──────────────────────────────────────────────
const JOBS_FILE = path.join(__dirname, 'jobs.json');

function readJobs() {
  if (!fs.existsSync(JOBS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8')); }
  catch { return []; }
}
function writeJobs(jobs) {
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

app.get('/api/jobs', (req, res) => res.json(readJobs()));

app.post('/api/jobs', (req, res) => {
  const { title, dept, type, location, experience, salary, desc, skills, urgent } = req.body;
  if (!title || !dept || !type || !location || !desc)
    return res.status(400).json({ error: 'Missing required fields' });

  const jobs = readJobs();
  const newJob = {
    id: Date.now(), title, dept, type, location,
    experience: experience || '', salary: salary || '',
    desc, skills: Array.isArray(skills) ? skills : [],
    urgent: !!urgent,
    postedAt: new Date().toISOString().split('T')[0]
  };
  jobs.unshift(newJob);
  writeJobs(jobs);
  res.json({ success: true, job: newJob });
});

app.delete('/api/jobs/:id', (req, res) => {
  const id = Number(req.params.id);
  writeJobs(readJobs().filter(j => j.id !== id));
  res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});