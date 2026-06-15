// Add these two lines in server.js alongside existing /api/ routes
app.post('/send-wedding.php', (req, res) => res.redirect(307, '/api/send-wedding'));
app.post('/send-contact.php', (req, res) => res.redirect(307, '/api/send-contact'));