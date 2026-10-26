# Quy tắc dự án: Website học EJU song ngữ Nhật–Việt

## 1. Giữ giao diện như bản mẫu

- `eju-mau.html` là bản mẫu gốc, dùng để đối chiếu. **Không sửa, không xóa** file này.
- Bố cục, font chữ, khoảng cách, hiệu ứng và cách hoạt động phải giống bản mẫu: header + menu môn học, dải hồ sơ trang đầu, trang khóa học (vòng tiến độ, cúp chương), trang video (tab Bài giảng / Lời giải / Tóm tắt / Các bài khác), bài tập tự chấm, nút JP / JP+VI / VI, chế độ tối, giao diện điện thoại.
- Các thay đổi đã được chủ dự án duyệt (không đổi lại):
  - Màu chủ đạo **cam**: `--accent #B9531A`, `--accent-soft #FCEBDD`, `--band #C2571A` (tối: `#F4A261`, `#3A2414`, `#4A2410`).
  - Môn Xã hội màu **tím**: `#7A4FB5` (tối: `#B28DE8`).
  - Sửa lỗi hộp thông báo video luôn hiện (`.pnote[hidden]`).
  - Tên website: **Newmichi EJU With haiyen.1995** (thẻ `<title>`; chữ cạnh logo: "Newmichi EJU" / "With haiyen.1995").
  - Logo ba ô: **E nền xanh** `#1F66C9`, **J nền cam** `#C2571A`, **U nền trắng** chữ đậm. Giữ nguyên ở cả chế độ tối.
  - Thứ tự nút ngôn ngữ: **VI · JP+VI · JP · EN**.
  - Font chữ kiểu **Times**: Times New Roman (dự phòng Tinos) cho chữ Việt/Latin, **Shippori Mincho** cho chữ Nhật.
  - Khung bài giảng (`.pbody`) **nền xanh nhạt** `--lesson-bg #EAF4FD` (tối `#142233`). Chữ tab/chip trang bài **in đậm, màu đậm**.
  - Chỗ quan trọng tô **đỏ đậm** (`!!…!!`, class `hl`, `--hl #C62828`); **thuật ngữ `**…**` trong bài cũng hiện đỏ đậm**. **Khung ghi nhớ** (`! …`, class `memo`): nền trắng nổi, viền trái và nhãn **đỏ**, nhãn 重要 · Quan trọng; không dùng nền đỏ. **Khung lưu ý** (`? …`, class `note`): nền xanh đậm hơn nền trang, viền trái xanh, nhãn 注意 · Lưu ý, cho trường hợp đặc biệt.
  - **Hàng nút dưới video** (mục `## 動画` trong file bài): mỗi nút tua video bài giảng tới mốc thời gian (không tải lại khung, dùng YouTube `enablejsapi` + `postMessage`) hoặc chuyển sang video 解説/単語, và đưa chữ bên phải tới đúng mục. Bài 1 dùng 6 nút: Mở đầu · Phần 1 · Phần 2 · Luyện tập (video chữa bài) · Tóm tắt · Từ vựng (video từ vựng); không có nút Ví dụ. Bài có mục này thì không hiện hàng 3 nút 授業·解説·単語. Trên máy tính (>900px) video + hàng nút **ghim** bên trái (`.wstick`).
  - Cột video mặc định **42%**, cột chữ phần còn lại. Giữa hai cột có **thanh kéo** (`.wsplit`, ⋮) để học viên tự chỉnh cỡ video (28%–70%), bấm đúp về mặc định, phím ← →; cỡ đã chọn nhớ trong trình duyệt (`eju-video-width`). Điện thoại không có thanh này.
  - Bài có thể có **tiêu đề nhỏ** (`### …`) và **hình minh họa** (`![chú thích](file)` trong `content/images/`). Sơ đồ Toán Claude tự vẽ bằng SVG (nền trắng, chữ Times/Shippori).
  - Mục まとめ phải đầy đủ: công thức và ví dụ cho từng ý, không chỉ vài câu chung chung.
  - `[hidden]` luôn ẩn (`display:none !important`): lời giải 解説 chỉ hiện sau khi bấm Chấm điểm.
  - Môn Toán theo **20 chủ đề đề cương EJU** (`content/math-topics.json`). Menu Toán: 数学Ⅰ → 数学A → 数学Ⅱ → 数学B → 数学Ⅲ → 数学C (通常学習編), rồi コース1 (chủ đề 1–7) và コース2 (chủ đề 1–20). Chủ đề 13 thuộc 数学B; 19 và 20 thuộc cả 数学Ⅱ và 数学Ⅲ.
  - Trong chương Toán có **dòng tiêu đề mục lớn** (1), (2)… (class `tsec-t`).
  - Trang bài có tối đa 3 video: video chính (bài giảng) ở khung trên, dưới khung là nút **授業 · 解説 · 単語** (`video`, `video_kaisetsu`, `video_tango`).
- Muốn thay đổi giao diện ngoài những điểm trên thì **hỏi chủ dự án trước**.
- Màu chỉ khai báo dạng biến ở đầu `assets/style.css`, có bản cho chế độ tối. Không viết mã màu rời rạc trong code.

## 2. Mọi nội dung đều song ngữ

- Mọi chữ hiển thị cho học viên phải có **cả tiếng Nhật và tiếng Việt**, và hiển thị đúng ở cả ba chế độ JP / JP+VI / VI.
- Trong code giao diện (`assets/app.js`), dùng các hàm có sẵn `bi()`, `bs()`, `jv()`, `unit()`, `para([ja, vi])`. Không viết chữ chỉ có một ngôn ngữ.
- Trong file bài học (`content/lessons/*.md`): mỗi câu tiếng Nhật có một dòng `VI:` ngay bên dưới (đoạn văn, ý tóm tắt, đề bài, lời giải, tiêu đề cột so sánh, chú thích bảng). Phần thông tin đầu file phải có cả `title` (Nhật) và `vi` (Việt).
- Ngoại lệ: công thức toán/hóa đứng riêng, đáp án trắc nghiệm ngắn (thuật ngữ, số), danh sách 用語/単語 (đã có cột nghĩa tiếng Việt).
- Tên khóa, chương, bài "Sắp có" trong `content/courses.json` và các dòng trong `content/site.json` luôn có cặp `ja` / `vi`.

### Tiếng Anh (chế độ EN)

- **Giao diện** (menu, nút, tiêu đề, thông báo) phải có đủ tiếng Anh. Chữ giao diện mới thêm vào `UI_EN` trong `assets/app.js`, hoặc truyền tham số thứ ba cho `bi()` / `bs()` / `jv()`.
- **Nội dung bài học**: tiếng Anh là **không bắt buộc**, viết bằng dòng `EN:` (và `en:` ở đầu file, cột thứ tư ở 用語/単語).
  Thiếu tiếng Anh thì chế độ EN hiện **tiếng Nhật** (riêng nghĩa của từ vựng thì hiện tiếng Việt).
- Tên môn, khóa, chương trong `courses.json` và chữ trong `site.json` nên có thêm `en`.
- Không bao giờ để chế độ EN hiện ô trống: phần tiếng Nhật chỉ ẩn khi có bản tiếng Anh thay thế (class `xe`).

## 3. Đăng nhập và dữ liệu học viên

- Phải đăng nhập mới vào được trang học. Trang chào kiểu Try IT: logo Newmichi, nút ログイン và 新規登録, link điều khoản. Ai cũng tự đăng ký được.
- Tài khoản dùng Firebase (Authentication + Firestore), cấu hình trong `firebase-config.js`. Để trống thì chạy chế độ thử (tài khoản lưu trong trình duyệt). Mọi chỗ gọi tài khoản đi qua `window.EJUAuth` (`assets/auth.js`), cả hai chế độ cùng một giao diện hàm.
- Tiến độ học lưu theo tài khoản (`users/{uid}`); bảng xếp hạng (`ranking/{uid}`) chỉ có tên hiển thị và số bài hoàn thành, **không bao giờ hiện email người khác**.
- Tên hiển thị là dữ liệu người dùng nhập: luôn `esc()` trước khi đưa vào HTML.
- Đổi cấu trúc dữ liệu Firestore thì sửa `firestore.rules` cùng lúc và nhắc chủ dự án dán lại quy tắc.
- Mọi chữ trên màn đăng nhập/đăng ký và thông báo lỗi cũng phải có đủ JP, VI, EN.

## 4. Nội dung tách khỏi code

- Nội dung bài học chỉ nằm trong `content/`. Thêm hoặc sửa bài thì không cần sửa code.
- Cú pháp file bài học được mô tả trong `HUONG-DAN.md`. Thay đổi cú pháp thì cập nhật `assets/lesson-parser.js` và `HUONG-DAN.md` cùng lúc, và mọi file trong `content/lessons/` phải vẫn đọc được.
- Thông báo lỗi nội dung viết bằng tiếng Việt, ghi rõ tên file và số dòng.

## 5. Quy trình thêm bài (đã thống nhất)

- Chủ dự án soạn bài trên Claude chat (claude.ai), rồi copy dán vào đây kèm khóa học, chương và tên file mong muốn.
- Việc của Claude ở đây:
  1. Lưu thành `content/lessons/<mã-bài>.md`. Mã bài chỉ gồm chữ không dấu, số, `-`, `_`; nếu chủ dự án không đặt tên thì tự đặt theo kiểu các bài có sẵn (vd `m3a`) và báo lại.
  2. Bài Toán: thêm mã bài vào `"lessons"` của đúng chủ đề và mục (1), (2)… trong `content/math-topics.json` (khai báo một lần, tự hiện ở môn và cả コース1/コース2), rồi bỏ các mục `planned` mà bài đã dạy. Môn khác: thêm vào đúng chương trong `content/courses.json`. Không rõ bài thuộc mục nào thì hỏi.
  3. Sửa lỗi định dạng nếu có, nhưng không tự ý đổi nội dung kiến thức. Thấy chỗ nghi sai (đáp án, công thức, bản dịch) thì hỏi lại.
  4. Thiếu dòng `VI:` thì báo cho chủ dự án, không tự bịa bản dịch khi chưa được đồng ý.
  5. Mở web kiểm tra bài mới (hộp đỏ báo lỗi, công thức, chấm điểm, bốn chế độ ngôn ngữ) rồi mới báo xong.
- Website đưa lên **GitHub Pages**. Sau khi kiểm tra xong: chạy `tools/cap-nhat-phien-ban.ps1` (gắn số phiên bản mới vào CSS/JS trong `index.html`, để trình duyệt học viên không dùng bản lưu tạm cũ — GitHub cho lưu tạm 10 phút), rồi `git add` các file đã đổi, commit (lời nhắn tiếng Việt ngắn gọn), `git push`, rồi báo chủ dự án link trang bài mới (`https://<username>.github.io/<repo>/#v-<mã-bài>`). Git ở `C:\Program Files\Git\cmd\git.exe`. Có file `.nojekyll` ở thư mục gốc, không được xóa (thiếu nó GitHub sẽ không phục vụ file `.md`).

## 6. Kiểm tra trước khi báo xong

- Chạy bằng `tools/server.ps1` (hoặc `xem-thu.bat`). Máy không có Node/Python.
- Kiểm tra ở cả bốn chế độ ngôn ngữ (VI, JP+VI, JP, EN), chế độ tối và độ rộng điện thoại (375px, không tràn ngang).
- Không có hộp đỏ báo lỗi nội dung và không có lỗi trong console.
- Trao đổi với chủ dự án bằng tiếng Việt.
