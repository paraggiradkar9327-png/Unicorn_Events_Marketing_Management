<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

$name           = htmlspecialchars($body['name'] ?? '');
$mobile         = htmlspecialchars($body['mobile'] ?? '');
$email          = htmlspecialchars($body['email'] ?? '');
$city           = htmlspecialchars($body['city'] ?? '');
$bride_name     = htmlspecialchars($body['bride_name'] ?? '—');
$groom_name     = htmlspecialchars($body['groom_name'] ?? '—');
$wedding_date   = htmlspecialchars($body['wedding_date'] ?? '');
$venue_location = htmlspecialchars($body['venue_location'] ?? '—');
$guests         = htmlspecialchars($body['guests'] ?? '—');
$budget         = htmlspecialchars($body['budget'] ?? '—');
$venue_type     = htmlspecialchars($body['venue_type'] ?? '—');
$theme          = htmlspecialchars($body['theme'] ?? '—');
$special        = htmlspecialchars($body['special'] ?? '—');

if (!$name || !$email || !$wedding_date) {
    http_response_code(400); echo json_encode(['error' => 'Missing required fields']); exit;
}

$RESEND_API_KEY = 're_RQnXyWFo_Fj3SYmPseg9eDiKZi9awGYyN';

$html = "
<h2 style='color:#6a0dad'>New Wedding Enquiry</h2>
<table style='border-collapse:collapse;width:100%;font-family:Arial,sans-serif'>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9;width:160px'><b>Name</b></td><td style='padding:8px;border:1px solid #ddd'>$name</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Mobile</b></td><td style='padding:8px;border:1px solid #ddd'>$mobile</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Email</b></td><td style='padding:8px;border:1px solid #ddd'>$email</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>City</b></td><td style='padding:8px;border:1px solid #ddd'>$city</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Bride</b></td><td style='padding:8px;border:1px solid #ddd'>$bride_name</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Groom</b></td><td style='padding:8px;border:1px solid #ddd'>$groom_name</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Wedding Date</b></td><td style='padding:8px;border:1px solid #ddd'>$wedding_date</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Venue Location</b></td><td style='padding:8px;border:1px solid #ddd'>$venue_location</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Guests</b></td><td style='padding:8px;border:1px solid #ddd'>$guests</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Budget</b></td><td style='padding:8px;border:1px solid #ddd'>&#8377;$budget</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Venue Type</b></td><td style='padding:8px;border:1px solid #ddd'>$venue_type</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Types of Events</b></td><td style='padding:8px;border:1px solid #ddd'>$theme</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Special Requirements</b></td><td style='padding:8px;border:1px solid #ddd'>$special</td></tr>
</table>";

$payload = json_encode([
    'from'    => 'Unicorn Events <onboarding@resend.dev>',
    'to'      => ['unicornevents2007@gmail.com'],
    'subject' => "New Wedding Enquiry from $name",
    'html'    => $html
]);

$context = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => implode("\r\n", [
            'Authorization: Bearer ' . $RESEND_API_KEY,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ]),
        'content' => $payload,
        'ignore_errors' => true
    ],
    'ssl' => [
        'verify_peer'      => false,
        'verify_peer_name' => false
    ]
]);

$response = file_get_contents('https://api.resend.com/emails', false, $context);
$httpCode = 0;
foreach ($http_response_header as $h) {
    if (preg_match('/HTTP\/\d\.\d (\d+)/', $h, $m)) $httpCode = (int)$m[1];
}

if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email', 'detail' => $response, 'code' => $httpCode]);
}
EOF

# Same fix for send-contact.php
cat > /home/claude/project_modified/send-contact.php << 'EOF'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

$first_name     = htmlspecialchars($body['first_name'] ?? '');
$last_name      = htmlspecialchars($body['last_name'] ?? '');
$email          = htmlspecialchars($body['email'] ?? '');
$phone          = htmlspecialchars($body['phone'] ?? '—');
$service        = htmlspecialchars($body['service'] ?? '—');
$event_date     = htmlspecialchars($body['event_date'] ?? '—');
$event_location = htmlspecialchars($body['event_location'] ?? '—');
$message        = htmlspecialchars($body['message'] ?? '');

if (!$first_name || !$email || !$message) {
    http_response_code(400); echo json_encode(['error' => 'Missing required fields']); exit;
}

$RESEND_API_KEY = 're_RQnXyWFo_Fj3SYmPseg9eDiKZi9awGYyN';

$html = "
<h2 style='color:#6a0dad'>New Contact Enquiry</h2>
<table style='border-collapse:collapse;width:100%;font-family:Arial,sans-serif'>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9;width:160px'><b>Name</b></td><td style='padding:8px;border:1px solid #ddd'>$first_name $last_name</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Email</b></td><td style='padding:8px;border:1px solid #ddd'>$email</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Phone</b></td><td style='padding:8px;border:1px solid #ddd'>$phone</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Service</b></td><td style='padding:8px;border:1px solid #ddd'>$service</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Event Date</b></td><td style='padding:8px;border:1px solid #ddd'>$event_date</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Event Location</b></td><td style='padding:8px;border:1px solid #ddd'>$event_location</td></tr>
  <tr><td style='padding:8px;border:1px solid #ddd;background:#f9f9f9'><b>Message</b></td><td style='padding:8px;border:1px solid #ddd'>$message</td></tr>
</table>";

$payload = json_encode([
    'from'    => 'Unicorn Events <onboarding@resend.dev>',
    'to'      => ['uevents21@gmail.com'],
    'subject' => "New Contact Enquiry from $first_name $last_name",
    'html'    => $html
]);

$context = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => implode("\r\n", [
            'Authorization: Bearer ' . $RESEND_API_KEY,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ]),
        'content' => $payload,
        'ignore_errors' => true
    ],
    'ssl' => [
        'verify_peer'      => false,
        'verify_peer_name' => false
    ]
]);

$response = file_get_contents('https://api.resend.com/emails', false, $context);
$httpCode = 0;
foreach ($http_response_header as $h) {
    if (preg_match('/HTTP\/\d\.\d (\d+)/', $h, $m)) $httpCode = (int)$m[1];
}

if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email', 'detail' => $response, 'code' => $httpCode]);
}