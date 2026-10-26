# Máy chủ web nhỏ để xem website trên máy (không cần cài thêm gì).
# Chạy bằng file xem-thu.bat ở thư mục gốc.
param(
  [int]$Port = 8000,
  [switch]$NoBrowser
)

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$types = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"; ".md" = "text/plain; charset=utf-8"; ".txt" = "text/plain; charset=utf-8"
  ".svg" = "image/svg+xml"; ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".gif" = "image/gif"
  ".webp" = "image/webp"; ".ico" = "image/x-icon"; ".pdf" = "application/pdf"; ".mp3" = "audio/mpeg"; ".mp4" = "video/mp4"
}

# If the port is busy (e.g. the site is already open in another window), try the next ones.
$listener = $null
for ($try = $Port; $try -lt $Port + 20; $try++) {
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$try/")
  try { $l.Start(); $listener = $l; $Port = $try; break } catch { $l.Close() }
}
if (-not $listener) {
  Write-Host "Khong mo duoc may chu web (cac cong $Port den $($Port + 19) deu dang ban). Hay khoi dong lai may roi thu lai." -ForegroundColor Red
  exit 1
}

$url = "http://localhost:$Port/"
Write-Host ""
Write-Host "  Website dang chay tai: $url" -ForegroundColor Green
Write-Host "  Dong cua so nay de tat."
Write-Host ""
if (-not $NoBrowser) { Start-Process $url }

while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/")
    if ($rel -eq "") { $rel = "index.html" }
    $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if ((Test-Path -LiteralPath $path -PathType Container)) { $path = Join-Path $path "index.html" }
    if (-not $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 - Khong tim thay: /$rel")
      $res.ContentType = "text/plain; charset=utf-8"
    } else {
      $ext = [IO.Path]::GetExtension($path).ToLower()
      $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
      $res.Headers.Add("Cache-Control", "no-cache")
      $bytes = [IO.File]::ReadAllBytes($path)
    }
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
