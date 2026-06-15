<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if (!isset($_FILES['video'])) { http_response_code(400); echo json_encode(['error' => 'No file uploaded']); exit; }

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$ext = pathinfo($_FILES['video']['name'], PATHINFO_EXTENSION);
$filename = 'hero-video.' . $ext;
$dest = $uploadDir . $filename;

if (move_uploaded_file($_FILES['video']['tmp_name'], $dest)) {
    $src = '/Unicorn_Events_Marketing_Management/uploads/' . $filename;
    $config = ['type' => 'file', 'src' => $src];
    file_put_contents(__DIR__ . '/../video-config.json', json_encode($config));
    echo json_encode(['success' => true, 'src' => $src]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Upload failed']);
}