<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
$file = __DIR__ . '/../video-config.json';
if (!file_exists($file)) { echo json_encode([]); exit; }
echo file_get_contents($file);