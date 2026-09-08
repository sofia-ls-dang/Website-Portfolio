<?php
/**
 * contact.php
 * Handles the contact form submission.
 * Receives POST data, validates it, and sends an email.
 *
 * TO USE: Replace YOUR_EMAIL below with your actual email address.
 * Run this on a PHP server (XAMPP locally, or InfinityFree/Render for hosting).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ---- CONFIG ----
define('TO_EMAIL', 'YOUR_EMAIL@example.com');  // <-- change this
define('SITE_NAME', 'sofia dang website');
// ----------------

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

// Sanitize input — removes HTML tags and extra whitespace
function clean(string $input): string {
    return trim(strip_tags($input));
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$message = clean($_POST['message'] ?? '');

// ---- SERVER-SIDE VALIDATION ----
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
}
if (empty($message)) {
    $errors[] = 'Message is required.';
}
if (strlen($message) > 5000) {
    $errors[] = 'Message is too long (max 5000 characters).';
}

// ---- BASIC HONEYPOT (spam protection) ----
// Add <input type="text" name="website" style="display:none"> to your form.
// Real users won't fill it; bots will.
if (!empty($_POST['website'])) {
    // Silently reject spam without revealing the trap
    echo json_encode(['success' => true]);
    exit;
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
    exit;
}

// ---- BUILD EMAIL ----
$subject = "[" . SITE_NAME . "] New message from {$name}";

$body = "You have a new message from your portfolio contact form.\n\n"
      . "-------------------------------------------\n"
      . "Name:    {$name}\n"
      . "Email:   {$email}\n"
      . "-------------------------------------------\n\n"
      . "Message:\n{$message}\n\n"
      . "-------------------------------------------\n"
      . "Sent at: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = implode("\r\n", [
    "From: {$name} <{$email}>",
    "Reply-To: {$email}",
    "X-Mailer: PHP/" . phpversion(),
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
]);

// ---- SEND ----
$sent = mail(TO_EMAIL, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    // mail() failed — common on localhost. Use PHPMailer + SMTP for production.
    echo json_encode([
        'success' => false,
        'error'   => 'Email could not be sent. Check your server mail config.'
    ]);
}
?>
