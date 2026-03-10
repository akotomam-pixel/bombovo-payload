<?php
// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// Secret key check
$secret = 'BombovoProfis2025xyz';
$providedSecret = $_SERVER['HTTP_X_PROXY_SECRET'] ?? '';
if ($providedSecret !== $secret) {
    http_response_code(403);
    die('Forbidden');
}

// Get and validate target URL
$targetUrl = $_GET['target'] ?? '';
if (empty($targetUrl)) {
    http_response_code(400);
    die('Missing target parameter');
}

// Only allow requests to ProfisXML
if (strpos($targetUrl, 'xml.bombovo.sk') === false) {
    http_response_code(400);
    die('Invalid target — only xml.bombovo.sk is allowed');
}

// Read raw SOAP body from Vercel
$body = file_get_contents('php://input');
if (empty($body)) {
    http_response_code(400);
    die('Empty request body');
}

// Get SOAPAction header if present
$soapAction = $_SERVER['HTTP_SOAPACTION'] ?? '';

// Build headers to forward
$headers = [
    'Content-Type: text/xml; charset=utf-8',
];
if (!empty($soapAction)) {
    $headers[] = 'SOAPAction: "' . $soapAction . '"';
}

// Forward to ProfisXML via cURL
$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_FOLLOWLOCATION => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($curlError) {
    http_response_code(502);
    header('Content-Type: text/plain');
    die('Proxy cURL error: ' . $curlError);
}

// Return the ProfisXML response back to Vercel as-is
http_response_code($httpCode);
header('Content-Type: text/xml; charset=utf-8');
echo $response;
