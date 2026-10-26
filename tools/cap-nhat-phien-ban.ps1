# Gắn số phiên bản mới (?v=năm-tháng-ngày-giờ-phút) vào các file CSS/JS trong index.html,
# để trình duyệt của học viên tải bản mới ngay sau khi web được cập nhật (không dùng bản lưu tạm cũ).
# Chạy trước mỗi lần commit + push.
$index = Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")).Path "index.html"
$v = Get-Date -Format "yyyyMMddHHmm"
$html = [IO.File]::ReadAllText($index, [Text.Encoding]::UTF8)
$html = [regex]::Replace($html, '(href|src)="((?:assets/[A-Za-z0-9_.-]+\.(?:css|js))|firebase-config\.js)(\?v=\d+)?"', ('$1="$2?v=' + $v + '"'))
[IO.File]::WriteAllText($index, $html, (New-Object Text.UTF8Encoding($false)))
Write-Host "Phien ban: $v"
