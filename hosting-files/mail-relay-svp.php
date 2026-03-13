<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input || ($input['secret'] ?? '') !== 'BombovO2025relay') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit();
}

require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';
require __DIR__ . '/PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.m1.websupport.sk';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@bombovo.sk';
    $mail->Password   = 'BombovO2025/';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'quoted-printable';

    $mail->setFrom('info@bombovo.sk', 'Bombovo');
    $mail->addAddress('sabina@bombovo.sk');
    $mail->Subject = 'Nova prihlaska SvP';
    $mail->isHTML(true);
    $mail->Body = '<html><body>
<h2>Nova prihlaska Skola v prirode</h2>
<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:sans-serif;">
  <tr><td><b>Datum prichodu</b></td><td>' . htmlspecialchars($input['datumPrichodu'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Veduci pobytu</b></td><td>' . htmlspecialchars($input['veduciPobytu'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Nazov skoly</b></td><td>' . htmlspecialchars($input['nazovSkoly'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Adresa</b></td><td>' . htmlspecialchars($input['adresa'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>PSC</b></td><td>' . htmlspecialchars($input['psc'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Mesto</b></td><td>' . htmlspecialchars($input['mesto'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Telefon</b></td><td>' . htmlspecialchars($input['telefon'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Email</b></td><td>' . htmlspecialchars($input['emailKontakt'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Stredisko</b></td><td>' . htmlspecialchars($input['stredisko'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Alternativne stredisko</b></td><td>' . htmlspecialchars($input['alternativneStredisko'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Animacny program</b></td><td>' . htmlspecialchars($input['animacnyProgram'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Bombovy balicek</b></td><td>' . htmlspecialchars($input['bombovyBalicek'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Pocet pedagogov</b></td><td>' . htmlspecialchars($input['pocetPedagogov'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Vek ziakov</b></td><td>' . htmlspecialchars($input['vekZiakov'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Pocet ziakov</b></td><td>' . htmlspecialchars($input['pocetZiakov'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Zdravotnik</b></td><td>' . htmlspecialchars($input['zdravotnik'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
  <tr><td><b>Poznamka</b></td><td>' . htmlspecialchars($input['poznamka'] ?? '', ENT_QUOTES, 'UTF-8') . '</td></tr>
</table>
</body></html>';

    $mail->send();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
