<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$body = json_decode(file_get_contents('php://input'), true);
$videoId = $body['videoId'] ?? '';
if (!$videoId) { http_response_code(400); echo json_encode(['error' => 'Missing videoId']); exit; }

$config = ['type' => 'youtube', 'videoId' => $videoId];
file_put_contents(__DIR__ . '/../video-config.json', json_encode($config));
echo json_encode(['success' => true]);