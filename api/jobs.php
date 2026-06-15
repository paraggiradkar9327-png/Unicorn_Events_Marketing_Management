<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$JOBS_FILE = __DIR__ . '/../jobs.json';

function readJobs($file) {
    if (!file_exists($file)) return [];
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : [];
}
function writeJobs($file, $jobs) {
    file_put_contents($file, json_encode($jobs, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(readJobs($JOBS_FILE));

} elseif ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $title    = $body['title'] ?? '';
    $dept     = $body['dept'] ?? '';
    $type     = $body['type'] ?? '';
    $location = $body['location'] ?? '';
    $desc     = $body['desc'] ?? '';
    if (!$title || !$dept || !$type || !$location || !$desc) {
        http_response_code(400); echo json_encode(['error' => 'Missing required fields']); exit;
    }
    $jobs = readJobs($JOBS_FILE);
    $newJob = [
        'id'         => time() * 1000,
        'title'      => $title,
        'dept'       => $dept,
        'type'       => $type,
        'location'   => $location,
        'experience' => $body['experience'] ?? '',
        'salary'     => $body['salary'] ?? '',
        'desc'       => $desc,
        'skills'     => is_array($body['skills'] ?? null) ? $body['skills'] : [],
        'urgent'     => !empty($body['urgent']),
        'postedAt'   => date('Y-m-d')
    ];
    array_unshift($jobs, $newJob);
    writeJobs($JOBS_FILE, $jobs);
    echo json_encode(['success' => true, 'job' => $newJob]);

} elseif ($method === 'DELETE') {
    $uri = $_SERVER['REQUEST_URI'];
    preg_match('/\/(\d+)$/', $uri, $matches);
    $id = isset($matches[1]) ? (int)$matches[1] : 0;
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Missing id']); exit; }
    $jobs = array_filter(readJobs($JOBS_FILE), fn($j) => $j['id'] !== $id);
    writeJobs($JOBS_FILE, array_values($jobs));
    echo json_encode(['success' => true]);
}