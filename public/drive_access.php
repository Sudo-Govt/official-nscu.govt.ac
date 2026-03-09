<?php
/**
 * NSCU Drive Access API - drive_access.php
 * 
 * Place this file at:
 * /home/rajvardhan/en.nscu.govt.ac/15346245624674568ghjdf45w6345634gsdfg3t45634turti78/45yjtyj767i678e65w5esgjgkuilo9o674562345325656ysgsfdgdghmfyuio/drive_access.php
 * 
 * This API manages:
 * 1. Personal user storage (100MB per user, folder per UUID)
 * 2. Institutional library storage (unlimited, shared)
 * 
 * Authentication: Shared secret token via header or query param
 */

// ===== CONFIGURATION =====
define('API_TOKEN', 'YOUR_DRIVE_API_TOKEN_HERE'); // CHANGE THIS to a strong random string
define('BASE_DIR', __DIR__ . '/storage');
define('USERS_DIR', BASE_DIR . '/users');
define('LIBRARY_DIR', BASE_DIR . '/library');
define('USER_QUOTA_BYTES', 100 * 1024 * 1024); // 100MB per user
define('MAX_UPLOAD_SIZE', 50 * 1024 * 1024); // 50MB per file upload

// ===== CORS HEADERS =====
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Token');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ===== AUTHENTICATION =====
function authenticate() {
    $token = null;
    
    // Check header first
    $headers = getallheaders();
    if (isset($headers['X-API-Token'])) {
        $token = $headers['X-API-Token'];
    } elseif (isset($headers['x-api-token'])) {
        $token = $headers['x-api-token'];
    }
    
    // Fallback to query param
    if (!$token && isset($_GET['token'])) {
        $token = $_GET['token'];
    }
    
    if (!$token || !hash_equals(API_TOKEN, $token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'message' => 'Invalid or missing API token']);
        exit;
    }
}

// ===== HELPERS =====
function sanitize_path($path) {
    // Prevent directory traversal
    $path = str_replace(['..', "\0"], '', $path);
    $path = preg_replace('#/+#', '/', $path);
    $path = trim($path, '/');
    return $path;
}

function get_dir_size($dir) {
    $size = 0;
    if (!is_dir($dir)) return 0;
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
        $size += $file->getSize();
    }
    return $size;
}

function ensure_dir($dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

function get_mime_type($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimes = [
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls' => 'application/vnd.ms-excel',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt' => 'application/vnd.ms-powerpoint',
        'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp',
        'mp4' => 'video/mp4', 'webm' => 'video/webm', 'avi' => 'video/x-msvideo',
        'mp3' => 'audio/mpeg', 'wav' => 'audio/wav',
        'epub' => 'application/epub+zip',
        'txt' => 'text/plain', 'csv' => 'text/csv',
        'zip' => 'application/zip', 'rar' => 'application/x-rar-compressed',
    ];
    return $mimes[$ext] ?? 'application/octet-stream';
}

function list_files($dir, $prefix = '') {
    $files = [];
    if (!is_dir($dir)) return $files;
    
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        $relative = $prefix ? $prefix . '/' . $item : $item;
        
        if (is_dir($path)) {
            $files = array_merge($files, list_files($path, $relative));
        } else {
            $files[] = [
                'name' => $item,
                'path' => $relative,
                'size' => filesize($path),
                'type' => get_mime_type($item),
                'modified' => date('c', filemtime($path)),
            ];
        }
    }
    return $files;
}

function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// ===== INIT STORAGE DIRS =====
ensure_dir(USERS_DIR);
ensure_dir(LIBRARY_DIR);

// ===== AUTHENTICATE =====
authenticate();

// ===== ROUTING =====
$action = $_GET['action'] ?? '';
$scope = $_GET['scope'] ?? 'user'; // 'user' or 'library'
$user_id = $_GET['user_id'] ?? '';
$file_path = sanitize_path($_GET['path'] ?? '');

// ===== ACTIONS =====
switch ($action) {
    
    // ---------- HEALTH CHECK ----------
    case 'ping':
        json_response([
            'status' => 'ok',
            'message' => 'NSCU Drive API is running',
            'version' => '1.0.0',
            'timestamp' => date('c'),
            'storage' => [
                'users_dir_exists' => is_dir(USERS_DIR),
                'library_dir_exists' => is_dir(LIBRARY_DIR),
                'writable' => is_writable(BASE_DIR),
            ]
        ]);
        break;

    // ---------- CREATE USER FOLDER ----------
    case 'create_user':
        if (!$user_id) json_response(['error' => 'user_id is required'], 400);
        
        $user_dir = USERS_DIR . '/' . sanitize_path($user_id);
        ensure_dir($user_dir);
        
        json_response([
            'success' => true,
            'message' => "User folder created for $user_id",
            'user_id' => $user_id,
            'quota_bytes' => USER_QUOTA_BYTES,
            'quota_mb' => USER_QUOTA_BYTES / 1024 / 1024,
        ]);
        break;

    // ---------- LIST FILES ----------
    case 'list':
        if ($scope === 'library') {
            $target_dir = LIBRARY_DIR;
            $subfolder = sanitize_path($_GET['folder'] ?? '');
            if ($subfolder) $target_dir .= '/' . $subfolder;
        } else {
            if (!$user_id) json_response(['error' => 'user_id is required'], 400);
            $target_dir = USERS_DIR . '/' . sanitize_path($user_id);
        }
        
        if (!is_dir($target_dir)) {
            ensure_dir($target_dir);
        }
        
        $files = list_files($target_dir);
        $total_size = get_dir_size($target_dir);
        
        $response = [
            'files' => $files,
            'total_files' => count($files),
            'total_size' => $total_size,
        ];
        
        if ($scope === 'user') {
            $response['quota_bytes'] = USER_QUOTA_BYTES;
            $response['quota_used'] = $total_size;
            $response['quota_remaining'] = max(0, USER_QUOTA_BYTES - $total_size);
            $response['quota_percent'] = round(($total_size / USER_QUOTA_BYTES) * 100, 2);
        }
        
        json_response($response);
        break;

    // ---------- UPLOAD FILE ----------
    case 'upload':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            json_response(['error' => 'POST method required'], 405);
        }
        
        if ($scope === 'library') {
            $target_dir = LIBRARY_DIR;
            $subfolder = sanitize_path($_GET['folder'] ?? '');
            if ($subfolder) $target_dir .= '/' . $subfolder;
        } else {
            if (!$user_id) json_response(['error' => 'user_id is required'], 400);
            $target_dir = USERS_DIR . '/' . sanitize_path($user_id);
        }
        
        ensure_dir($target_dir);
        
        if (empty($_FILES)) {
            json_response(['error' => 'No files uploaded'], 400);
        }
        
        $uploaded = [];
        $errors = [];
        
        // Handle multiple files (field name: "files[]" or "file")
        $file_keys = array_keys($_FILES);
        
        foreach ($file_keys as $key) {
            $file_data = $_FILES[$key];
            
            // Handle array of files
            if (is_array($file_data['name'])) {
                for ($i = 0; $i < count($file_data['name']); $i++) {
                    $name = $file_data['name'][$i];
                    $tmp = $file_data['tmp_name'][$i];
                    $size = $file_data['size'][$i];
                    $err = $file_data['error'][$i];
                    
                    $result = process_upload($name, $tmp, $size, $err, $target_dir, $scope, $user_id);
                    if ($result['success']) {
                        $uploaded[] = $result;
                    } else {
                        $errors[] = $result;
                    }
                }
            } else {
                $result = process_upload($file_data['name'], $file_data['tmp_name'], $file_data['size'], $file_data['error'], $target_dir, $scope, $user_id);
                if ($result['success']) {
                    $uploaded[] = $result;
                } else {
                    $errors[] = $result;
                }
            }
        }
        
        json_response([
            'uploaded' => $uploaded,
            'errors' => $errors,
            'total_uploaded' => count($uploaded),
            'total_errors' => count($errors),
        ]);
        break;

    // ---------- DOWNLOAD / STREAM FILE ----------
    case 'download':
        if (!$file_path) json_response(['error' => 'path is required'], 400);
        
        if ($scope === 'library') {
            $full_path = LIBRARY_DIR . '/' . $file_path;
        } else {
            if (!$user_id) json_response(['error' => 'user_id is required'], 400);
            $full_path = USERS_DIR . '/' . sanitize_path($user_id) . '/' . $file_path;
        }
        
        if (!file_exists($full_path) || !is_file($full_path)) {
            json_response(['error' => 'File not found'], 404);
        }
        
        $mime = get_mime_type($full_path);
        $filename = basename($full_path);
        $filesize = filesize($full_path);
        
        // Support range requests for video/audio streaming
        header("Content-Type: $mime");
        header("Accept-Ranges: bytes");
        header("Content-Disposition: inline; filename=\"$filename\"");
        
        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            preg_match('/bytes=(\d+)-(\d*)/', $range, $matches);
            $start = intval($matches[1]);
            $end = $matches[2] !== '' ? intval($matches[2]) : $filesize - 1;
            $length = $end - $start + 1;
            
            http_response_code(206);
            header("Content-Range: bytes $start-$end/$filesize");
            header("Content-Length: $length");
            
            $fp = fopen($full_path, 'rb');
            fseek($fp, $start);
            echo fread($fp, $length);
            fclose($fp);
        } else {
            header("Content-Length: $filesize");
            readfile($full_path);
        }
        exit;

    // ---------- DELETE FILE ----------
    case 'delete':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            json_response(['error' => 'POST or DELETE method required'], 405);
        }
        
        if (!$file_path) json_response(['error' => 'path is required'], 400);
        
        if ($scope === 'library') {
            $full_path = LIBRARY_DIR . '/' . $file_path;
        } else {
            if (!$user_id) json_response(['error' => 'user_id is required'], 400);
            $full_path = USERS_DIR . '/' . sanitize_path($user_id) . '/' . $file_path;
        }
        
        if (!file_exists($full_path)) {
            json_response(['error' => 'File not found'], 404);
        }
        
        if (unlink($full_path)) {
            json_response(['success' => true, 'message' => 'File deleted', 'path' => $file_path]);
        } else {
            json_response(['error' => 'Failed to delete file'], 500);
        }
        break;

    // ---------- GET QUOTA ----------
    case 'quota':
        if (!$user_id) json_response(['error' => 'user_id is required'], 400);
        
        $user_dir = USERS_DIR . '/' . sanitize_path($user_id);
        $used = is_dir($user_dir) ? get_dir_size($user_dir) : 0;
        
        json_response([
            'user_id' => $user_id,
            'quota_bytes' => USER_QUOTA_BYTES,
            'quota_used' => $used,
            'quota_remaining' => max(0, USER_QUOTA_BYTES - $used),
            'quota_percent' => round(($used / USER_QUOTA_BYTES) * 100, 2),
            'quota_mb' => [
                'total' => round(USER_QUOTA_BYTES / 1024 / 1024, 2),
                'used' => round($used / 1024 / 1024, 2),
                'remaining' => round(max(0, USER_QUOTA_BYTES - $used) / 1024 / 1024, 2),
            ]
        ]);
        break;

    // ---------- LIST LIBRARY CATEGORIES ----------
    case 'library_categories':
        $categories = [];
        if (is_dir(LIBRARY_DIR)) {
            foreach (scandir(LIBRARY_DIR) as $item) {
                if ($item === '.' || $item === '..') continue;
                $path = LIBRARY_DIR . '/' . $item;
                if (is_dir($path)) {
                    $categories[] = [
                        'name' => $item,
                        'file_count' => count(list_files($path)),
                        'total_size' => get_dir_size($path),
                    ];
                }
            }
        }
        json_response(['categories' => $categories]);
        break;

    // ---------- CREATE LIBRARY CATEGORY ----------
    case 'create_category':
        $category = sanitize_path($_GET['category'] ?? '');
        if (!$category) json_response(['error' => 'category name is required'], 400);
        
        $cat_dir = LIBRARY_DIR . '/' . $category;
        ensure_dir($cat_dir);
        json_response(['success' => true, 'message' => "Library category '$category' created"]);
        break;

    default:
        json_response(['error' => 'Invalid action', 'available_actions' => [
            'ping', 'create_user', 'list', 'upload', 'download', 'delete', 'quota', 
            'library_categories', 'create_category'
        ]], 400);
}

// ===== UPLOAD PROCESSOR =====
function process_upload($name, $tmp, $size, $error, $target_dir, $scope, $user_id) {
    if ($error !== UPLOAD_ERR_OK) {
        return ['success' => false, 'file' => $name, 'error' => "Upload error code: $error"];
    }
    
    if ($size > MAX_UPLOAD_SIZE) {
        return ['success' => false, 'file' => $name, 'error' => 'File exceeds max upload size of 50MB'];
    }
    
    // Check quota for user uploads
    if ($scope === 'user' && $user_id) {
        $user_dir = USERS_DIR . '/' . sanitize_path($user_id);
        $current_usage = get_dir_size($user_dir);
        if (($current_usage + $size) > USER_QUOTA_BYTES) {
            $remaining_mb = round((USER_QUOTA_BYTES - $current_usage) / 1024 / 1024, 2);
            return ['success' => false, 'file' => $name, 'error' => "Quota exceeded. Only {$remaining_mb}MB remaining"];
        }
    }
    
    // Sanitize filename
    $safe_name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);
    $dest = $target_dir . '/' . $safe_name;
    
    // Avoid overwriting - add timestamp if exists
    if (file_exists($dest)) {
        $ext = pathinfo($safe_name, PATHINFO_EXTENSION);
        $base = pathinfo($safe_name, PATHINFO_FILENAME);
        $safe_name = $base . '_' . time() . '.' . $ext;
        $dest = $target_dir . '/' . $safe_name;
    }
    
    if (move_uploaded_file($tmp, $dest)) {
        return [
            'success' => true,
            'file' => $safe_name,
            'original_name' => $name,
            'size' => $size,
            'type' => get_mime_type($safe_name),
            'path' => $safe_name,
        ];
    }
    
    return ['success' => false, 'file' => $name, 'error' => 'Failed to save file'];
}
?>
