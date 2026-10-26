# Quy trình thêm bài mới (rút kinh nghiệm từ Bài 1)

## 1. Đánh giá Bài 1

**Kết quả:** Bài 1 (式の展開と因数分解) đã lên web với đủ:
- 3 video và 6 nút mục lục video;
- chữ đỏ, khung ghi nhớ, khung lưu ý, hình minh họa;
- ba thứ tiếng;
- tóm tắt đầy đủ.

**Tốn thời gian nhất:**

| Việc | Vì sao mất nhiều vòng trao đổi | Lần sau |
|---|---|---|
| Giao diện (màu nền, phông chữ, chữ đỏ, khung, cỡ video) | Chốt dần qua nhiều lần xem | **Đã chốt xong**, bài sau dùng lại, không cần bàn lại |
| Xếp bài vào đâu (chương, chủ đề) | Lúc gửi bài chưa ghi rõ | Ghi sẵn **chủ đề › mục** trong tin nhắn (mục 3) |
| Mục lục video, nút nào phát video nào | Mốc thời gian gửi sau, nút đổi nhiều lần | Gửi sẵn **mục lục YouTube**, dùng đúng 6 nút chuẩn (mục 4) |
| Phần tóm tắt quá sơ sài | File soạn ban đầu chỉ có 4 câu | Prompt soạn bài yêu cầu sẵn **công thức + ví dụ** cho từng ý (mục 5) |
| Tạo tài khoản GitHub, lỗi trình duyệt lưu bản cũ | Việc thiết lập ban đầu | **Đã xong**, lần sau không gặp lại |

**Lỗi Claude Code gây ra và cách tránh lần sau:**
- Nút "Phần 1" nhảy sai mục; thanh kéo cỡ video quá mờ, khó thấy; chưa tính tới việc trình duyệt giữ bản cũ.
  → Lần sau Claude Code **tự bấm thử từng nút như học viên** và **kiểm tra lại trên web thật sau khi đưa lên** (bấm Ctrl+F5).
- Phát hiện và sửa luôn hai lỗi có từ bản mẫu gốc: lời giải hiện sẵn trước khi làm bài, và công thức dài làm tràn màn hình điện thoại.

**Mục tiêu từ Bài 2:** chỉ **2 lượt trao đổi** cho mỗi bài:
1. Bạn gửi bài.
2. Claude Code làm xong và mời bạn xem trên máy. Bạn duyệt, Claude Code đưa lên web.

## 2. Các bước cho mỗi bài mới

| Bước | Ai làm | Việc |
|---|---|---|
| 1 | Bạn | Đăng video lên YouTube (bài giảng, chữa bài, từ vựng). Ghi lại **mục lục thời gian** của video bài giảng. |
| 2 | Bạn | Soạn bài trên **Claude chat** bằng prompt ở mục 5. Nhận về file `.md`. |
| 3 | Bạn | Mở Claude Code trong thư mục `EJU WEB`, gửi file kèm **tin nhắn mẫu ở mục 3**. |
| 4 | Claude Code | Lưu bài, xếp vào đúng chủ đề, vẽ hình, kiểm tra theo **danh sách ở mục 6**, mở trên máy cho bạn xem. |
| 5 | Bạn | Xem trong khung trình duyệt bên cạnh. Trả lời **"đưa lên web"** hoặc ghi chỗ cần sửa. |
| 6 | Claude Code | Gắn số phiên bản, commit, đẩy lên GitHub, chờ web cập nhật, kiểm tra trên web thật, gửi **link bài**. |

## 3. Tin nhắn mẫu gửi Claude Code (bước 3)

```
Bài mới: Toán Course 1 – Bài 2
File: C:\...\bai-02.md
Mã bài: k1-02
Chủ đề › mục: 1. Số và biểu thức › (2) 実数   (bài dạy các mục nhỏ: 実数, 根号を含む式の計算)

Video bài giảng: https://youtu.be/...
Mục lục video bài giảng:
0:00 Mở đầu
0:20 Phần 1: ...
5:10 Phần 2: ...
9:30 Tổng kết
Video chữa bài tập: https://youtu.be/...
Video từ vựng: https://youtu.be/...

Hình minh họa cần vẽ: (ví dụ: trục số cho căn bậc hai; sơ đồ ...)
Ghi chú khác: ...
```

**Mã bài:** `k1-01`, `k1-02`… cho Toán Course 1. Tên file hình bắt đầu bằng mã bài, ví dụ `k1-02-trucso.svg`.

## 4. Giao diện đã chốt (không cần bàn lại)

- **Phông chữ:** nền bài giảng xanh nhạt; chữ Nhật Shippori Mincho, chữ Việt Times New Roman.
- **Chữ đỏ đậm:**
  - thuật ngữ `**…**`;
  - chỗ quan trọng nhất `!!…!!`.
- **Khung:**
  - `! …` là khung **重要 · Quan trọng** (nền trắng, viền đỏ), dùng cho ý chính, quy tắc, thứ tự các bước;
  - `? …` là khung **注意 · Lưu ý** (nền xanh), dùng cho trường hợp đặc biệt, chỗ hay nhầm.
- **Tiêu đề nhỏ** `### …` chia bài giảng thành từng phần. Nên **trùng với các phần trong video**.
- **Hàng nút dưới video, chuẩn 6 nút:**
  - Mở đầu · Phần 1 · Phần 2 · Tổng kết: tua video bài giảng;
  - Luyện tập: phát video chữa bài;
  - Từ vựng: phát video từ vựng.
  Bài có 3 phần thì thêm "Phần 3". Mỗi nút đưa chữ bên phải tới **đầu phần tương ứng**.
- **Video ghim bên trái**, học viên kéo thanh ⋮ để chỉnh cỡ.
- **Ba thứ tiếng:** mỗi câu Nhật có `VI:` (bắt buộc) và `EN:` (nên có).

## 5. Prompt soạn bài trên Claude chat (bước 2)

Chép nguyên đoạn dưới, thay phần trong `< >`:

```
Hãy soạn bài học Toán EJU <Course 1 – Bài 2: tên bài> thành MỘT file Markdown đúng định dạng sau.
Mỗi câu tiếng Nhật có dòng "VI:" (tiếng Việt) và "EN:" (tiếng Anh) ngay bên dưới.

---
title: <tên bài tiếng Nhật>
vi: <tên tiếng Việt>
en: <tên tiếng Anh>
video: <link video bài giảng>
video_kaisetsu: <link video chữa bài>
video_tango: <link video từ vựng>
duration: <độ dài video bài giảng, ví dụ 10:15>
board: <chữ Nhật ngắn> | <chữ Việt ngắn>
---

## 動画
- 0:00 | はじめに | Mở đầu | Introduction | point
- <mốc> | 第1部 <tên> | Phần 1: <tên> | Part 1: <tên> | <chữ của tiêu đề ### đầu tiên của phần 1>
- <mốc> | 第2部 <tên> | Phần 2: <tên> | Part 2: <tên> | <chữ của tiêu đề ### đầu tiên của phần 2>
- 解説 | 練習 | Luyện tập | Practice | pr
- <mốc tổng kết> | まとめ | Tóm tắt | Summary | sum
- 単語 | 単語 | Từ vựng | Vocabulary | terms

## Point
(Chia bằng tiêu đề "### <tên Nhật>" + dòng VI: + dòng EN:, theo đúng các phần của video.
 Thuật ngữ viết **thuật ngữ**. Ý quan trọng nhất viết !!…!!.
 Khung ghi nhớ: dòng bắt đầu "! ". Trường hợp đặc biệt / chỗ hay nhầm: dòng bắt đầu "? ".
 Công thức trong câu viết \( … \); công thức riêng một dòng viết \[ … \], mỗi dòng không quá dài.
 Chỗ cần hình minh họa: ghi một dòng  ![<chú thích Nhật> | <Việt> | <Anh>](<mã-bài>-<tên>.svg)  và mô tả hình cần vẽ.)

## 例題
<đề>
VI: …
EN: …
解答: <lời giải>
VI: …
EN: …

## 練習
(6–10 câu kiểu EJU. Câu điền ô: dùng [A][B]…, mỗi ô MỘT chữ số hoặc dấu −, có dòng "答え: A=…, B=…".
 Câu trắc nghiệm: đáp án 1. 2. 3. …, thêm ✓ cuối đáp án đúng. Mỗi câu có "解説:" + VI: + EN:.)

## まとめ
(Chia bằng "### 1. …", "### 2. …". MỖI ý phải có công thức và một ví dụ có lời giải ngắn.
 Có thứ tự các bước thì đặt trong khung "! ".)

## 用語
- 漢字 | cách đọc | nghĩa tiếng Việt | nghĩa tiếng Anh

Yêu cầu: kiểm tra lại mọi đáp án và mọi phép tính trước khi trả file.
```

## 6. Danh sách Claude Code tự kiểm tra trước khi mời bạn xem

- [ ] Web không hiện hộp đỏ báo lỗi. Câu Nhật và câu Việt của bạn giữ nguyên, không bị sửa chữ.
- [ ] Mã bài đã thêm vào đúng chủ đề › mục trong `content/math-topics.json`, và đã bỏ các thẻ "Sắp có" mà bài đã dạy.
- [ ] Bài hiện đúng ở môn (数学Ⅰ…), ở コース1 và コース2.
- [ ] Công thức hiển thị đủ, không còn ký hiệu `\(`.
- [ ] Bấm từng nút dưới video: video tua đúng giây hoặc đổi đúng video, chữ bên phải tới đúng phần.
- [ ] Chấm điểm: để trống thì 0 điểm, điền đúng hết thì đủ điểm. Lời giải chỉ hiện sau khi chấm.
- [ ] Hình minh họa hiện đúng chỗ. Trên điện thoại không tràn ngang. Chế độ tối dễ đọc.
- [ ] Bốn chế độ VI · JP+VI · JP · EN không có ô trống.
- [ ] Sau khi đưa lên: mở web thật, bấm Ctrl+F5, kiểm tra lại trang bài, rồi mới gửi link.

## 7. Việc còn lại (chưa làm)

- **Tài khoản thật bằng Firebase:** đăng nhập hiện vẫn ở chế độ thử. Xem HUONG-DAN.md mục 11.
- **Sửa điều khoản** `content/terms.md` (đang là bản mẫu) và thay `[EMAIL LIÊN HỆ]`.
- **Hai bài mẫu cũ** 「展開」の公式 và 「因数分解」とは？ trùng nội dung với Bài 1, nằm cùng mục. Nên xóa khi bạn đồng ý.
