<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$first_name     = htmlspecialchars($body['first_name'] ?? '');
$last_name      = htmlspecialchars($body['last_name'] ?? '');
$email          = htmlspecialchars($body['email'] ?? '');
$phone          = htmlspecialchars($body['phone'] ?? '—');
$service        = htmlspecialchars($body['service'] ?? '—');
$event_date     = htmlspecialchars($body['event_date'] ?? '—');
$event_location = htmlspecialchars($body['event_location'] ?? '—');
$message        = htmlspecialchars($body['message'] ?? '');

if (!$first_name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
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
    'to'      => ['unicornevents2007@gmail.com'],
    'subject' => "New Contact Enquiry from $first_name $last_name",
    'html'    => $html
]);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $RESEND_API_KEY,
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email', 'detail' => $response]);
}