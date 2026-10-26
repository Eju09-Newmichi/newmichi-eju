# Hướng dẫn sử dụng website EJU

## 1. Xem website trên máy

Bấm đúp vào **`xem-thu.bat`**. Một cửa sổ đen hiện ra và trình duyệt tự mở trang `http://localhost:8000`.
Muốn tắt thì đóng cửa sổ đen.

> Đừng bấm đúp trực tiếp vào `index.html`: trình duyệt sẽ chặn đọc các file bài học, nên trang chỉ hiện thông báo lỗi.

Sửa xong một file bài học thì chỉ cần **tải lại trang** (F5) là thấy thay đổi.

## 2. Các thư mục

```
index.html              khung trang (không cần sửa)
assets/                 giao diện và chương trình (không cần sửa)
content/
  site.json             dòng "học viên", dòng chữ cuối trang, bài gợi ý
  courses.json          môn → khóa học → chương → danh sách bài
  math-topics.json      20 chủ đề Toán EJU: mục lớn, bài, bài "Sắp có" (xem mục 6b)
  lessons/              mỗi bài một file .md
  images/               hình minh họa trong bài
  terms.md              điều khoản sử dụng và chính sách riêng tư (BẢN MẪU, cần sửa)
firebase-config.js      mã cấu hình Firebase cho đăng nhập (xem mục 11)
firestore.rules         quy tắc bảo mật dán vào Firebase (xem mục 11)
xem-thu.bat             mở website trên máy
tools/server.ps1        máy chủ nhỏ mà xem-thu.bat dùng
eju-mau.html            bản mẫu gốc (giữ để đối chiếu, có thể xóa)
```

Mở và sửa các file trong `content/` bằng Notepad, VS Code hoặc bất kỳ trình soạn văn bản nào. Khi lưu, chọn mã hóa **UTF-8**.

## 3. Thêm một bài mới (2 bước)

### Bước 1: tạo file bài học

Tạo file mới trong `content/lessons/`, ví dụ `m2f.md`. **Tên file chính là mã bài**, chỉ dùng chữ không dấu, số, `-` và `_`.
Cách nhanh nhất là chép một bài có sẵn rồi sửa lại.

### Bước 2: ghi mã bài vào danh sách

**Bài Toán** ghi vào `content/math-topics.json` (xem mục 6b): tìm đúng chủ đề và mục (1), (2)…, thêm mã bài vào `"lessons"`
và xóa mục "Sắp có" tương ứng trong `"planned"`. Bài sẽ tự hiện ở môn (数学Ⅰ, A…), ở コース1 và コース2.

**Các môn khác** ghi vào `content/courses.json`: tìm đúng khóa học và chương, thêm mã bài vào danh sách `"lessons"`:

```json
{"ja":"第2章 二次関数","vi":"Chương 2: Hàm số bậc hai","lessons":["m2a","m2b","m2c","m2d","m2e","m2f"]},
```

Thứ tự trong danh sách là thứ tự bài trên web (nút Bài trước / Bài sau đi theo thứ tự này).

## 4. Cách viết một file bài học

```markdown
---
title: 「平方完成」のやり方
vi: Cách hoàn thành bình phương
video: https://www.youtube.com/watch?v=XXXXXXXXXXX
duration: 08:35
board: y = (x − p)² + q
---

## Point

**平方完成**とは、\(y = x^2 + bx + c\) を変形することである。
VI: Hoàn thành bình phương là đưa \(y = x^2 + bx + c\) về dạng mới.

\[ x^2 + bx = \left(x + \frac{b}{2}\right)^2 - \left(\frac{b}{2}\right)^2 \]

## 例題

\(y = x^2 + 6x + 4\) を平方完成せよ。
VI: Hoàn thành bình phương y = x² + 6x + 4.
解答: \(y = (x+3)^2 - 5\)

## 練習

### 問1
\(y = x^2 - 10x + 20 = (x -\) [A]\()^2 -\) [B]
VI: Hoàn thành bình phương y = x² − 10x + 20.
答え: A=5, B=5
解説: −10 の半分は −5。
VI: Một nửa của −10 là −5.

### 問2
放物線 \(y = 3x^2 - x + 1\) について正しいものはどれか。
VI: Nhận định nào đúng?
1. 上に凸で、最大値をもつ
2. 下に凸で、最小値をもつ ✓
3. 上に凸で、最小値をもつ
解説: \(a = 3 \gt 0\) なので下に凸。
VI: a = 3 > 0 nên parabol quay lên.

## まとめ

- 係数の半分を2乗して引く。
VI: Lấy một nửa hệ số, bình phương rồi trừ đi.

## 用語

- 平方完成 | へいほうかんせい | hoàn thành bình phương
- 係数 | けいすう | hệ số
```

### Quy tắc chung

- **Dòng `VI:`** đặt ngay dưới câu tiếng Nhật là bản dịch của câu đó. Chế độ **JP** ẩn dòng này, chế độ **VI** chỉ hiện dòng này.
  Câu không có `VI:` thì hiện ở mọi chế độ.
- **Dòng `EN:`** (không bắt buộc) là bản dịch tiếng Anh, đặt cạnh dòng `VI:` (trước hay sau đều được).
  Ở chế độ **EN**: câu có `EN:` hiện tiếng Anh, câu chưa có `EN:` hiện tiếng Nhật. Các chế độ khác không hiện dòng `EN:`.
  `EN:` dùng được ở mọi chỗ dùng được `VI:`, trừ ô trong bảng.
- **`**chữ**`** làm nổi bật thuật ngữ (in đậm, font tiếng Nhật).
- **`!!chữ!!`** tô **đỏ, in đậm** chỗ quan trọng nhất (dùng ít thôi để còn nổi bật).
- **Công thức toán**: trong câu viết `\( ... \)`; công thức riêng một dòng viết `\[ ... \]` hoặc `$$ ... $$`.
  Dấu nhỏ hơn / lớn hơn trong công thức nên viết `\lt` và `\gt`. Công thức hóa học viết `\(\ce{H2O}\)`.
- Dòng trống ngăn cách các đoạn.

### Phần thông tin đầu file (giữa hai dòng `---`)

| Tên | Ý nghĩa | Bắt buộc |
|---|---|---|
| `title` | Tên bài tiếng Nhật | có |
| `vi` | Tên bài tiếng Việt | không |
| `en` | Tên bài tiếng Anh | không |
| `video` | Link YouTube bài giảng (xem mục 5) | không |
| `video_kaisetsu` | Link YouTube chữa bài tập | không |
| `video_tango` | Link YouTube từ vựng | không |
| `duration` | Độ dài video, dạng `phút:giây` | không |
| `board` | Chữ trên ảnh bìa bài học. Nhiều dòng thì ngăn bằng ` \| ` | không (mặc định là tên bài) |
| `kind` | Ghi `vocab` nếu là bài từ vựng | không |

### Các mục (đều không bắt buộc, mục nào không có thì web tự ẩn)

| Mục | Nội dung |
|---|---|
| `## Point` | Phần giảng lý thuyết |
| `## 例題` | Một câu ví dụ; dòng `解答:` là lời giải |
| `## 練習` | Bài tập tự chấm điểm, mỗi câu bắt đầu bằng `###` |
| `## まとめ` | Tóm tắt, mỗi ý một dòng `- ` |
| `## 用語` | Thuật ngữ: `- 漢字 \| cách đọc \| nghĩa tiếng Việt` (có thể thêm `\| nghĩa tiếng Anh`) |
| `## 単語` | Danh sách từ của bài từ vựng (cùng cách viết với 用語) |

### Bài tập trong `## 練習`

**Câu điền ô** (giống đề EJU): trong đề viết `[A]`, `[B]`... ở chỗ cần điền, rồi thêm dòng `答え: A=5, B=3`.
Mỗi ô chỉ là **một chữ số hoặc dấu −**. Số có hai chữ số như 16 thì dùng hai ô `[A][B]` với `答え: A=1, B=6`.

**Câu trắc nghiệm**: liệt kê đáp án `1.` `2.` `3.`... (tối đa 6), thêm **✓** ở cuối đáp án đúng
(hoặc thay ✓ bằng một dòng `答え: 2`).

Mỗi câu cần có dòng `解説:` (lời giải), có thể kèm `VI:` ngay dưới.

Học viên trả lời **đúng hết** các câu thì bài được tính là **hoàn thành**. Bài không có bài tập được tính hoàn thành khi học viên bấm xem video.

### Thành phần đặc biệt trong `## Point` và `## まとめ`

Mục まとめ viết được mọi thứ giống `## Point` (đoạn văn, công thức, danh sách, khung ghi nhớ, tiêu đề nhỏ, hình).

**Tiêu đề nhỏ** (chia bài giảng thành từng phần):
```
### 因数分解
VI: Phân tích nhân tử
EN: Factorization
```

**Khung ghi nhớ** (khung trắng nổi bật, nhãn "重要 · Quan trọng"): mỗi dòng bắt đầu bằng `! ` (dấu chấm than rồi dấu cách).
Nhiều dòng `! ` liền nhau gộp vào một khung.
```
! 因数分解は「共通因数 → 乗法公式 → たすき掛け」の順に考える。
VI: Phân tích nhân tử theo thứ tự: nhân tử chung → hằng đẳng thức → nhân chéo.
```

**Hình minh họa:** để file hình (`.svg`, `.png`, `.jpg`) trong `content/images/`, rồi viết một dòng:
```
![図1 たすき掛け | Hình 1: Nhân chéo | Figure 1: Cross method](k1-01-tasuki.svg)
```
Phần trong `[ ]` là chú thích dưới hình (Nhật | Việt | Anh). Tên file hình nên bắt đầu bằng mã bài (ví dụ `k1-01-...`).

**Danh sách:**
```
- 原子番号 ＝ 陽子の数
VI: Số hiệu nguyên tử = số proton
- 質量数 ＝ 陽子の数 ＋ 中性子の数
VI: Số khối = số proton + số neutron
```

**Dòng công thức chữ, căn giữa:** `>> ATP → ADP ＋ リン酸 ＋ エネルギー`

**Hai cột so sánh:**
```
::: cot 光合成
VI: Quang hợp
葉緑体で行われる。
VI: Diễn ra ở lục lạp.
:::
::: cot 呼吸
VI: Hô hấp
おもにミトコンドリアで行われる。
VI: Chủ yếu ở ty thể.
:::
```

**Bảng** (trong ô, ` / ` ngăn tiếng Nhật và tiếng Việt; ô chỉ có ○ × △ được căn giữa):
```
| 細胞小器官 / Bào quan | はたらき / Chức năng | 動物 / Động vật | 植物 / Thực vật |
|---|---|---|---|
| 核 / Nhân | DNA をもつ / Chứa DNA | ○ | ○ |
| 葉緑体 / Lục lạp | 光合成を行う / Quang hợp | × | ○ |
注: ○ あり · × なし
VI: ○ có · × không có
```

### Bài từ vựng

```markdown
---
title: 「細胞」の用語
vi: Từ vựng: tế bào
kind: vocab
duration: 03:30
board: 細胞・核・葉緑体
---

## 単語

- 細胞 | さいぼう | tế bào
- 核膜 | かくまく | màng nhân
```
Bài kiểm tra trắc nghiệm của bài từ vựng được tạo tự động từ danh sách từ.

Muốn có nghĩa tiếng Anh thì thêm cột thứ tư: `- 細胞 | さいぼう | tế bào | cell`.
Ở chế độ EN, từ có cột tiếng Anh hiện nghĩa tiếng Anh, từ chưa có thì vẫn hiện nghĩa tiếng Việt.

Bài `content/lessons/m2a.md` là ví dụ đầy đủ có cả `VI:` và `EN:`.

## 5. Video YouTube

Dán link vào dòng `video:`. Dạng link nào cũng được:

```
video: https://www.youtube.com/watch?v=aqz-KE-bpKQ
video: https://youtu.be/aqz-KE-bpKQ
video: https://www.youtube.com/shorts/aqz-KE-bpKQ
video: https://youtu.be/aqz-KE-bpKQ?t=90        ← bắt đầu từ giây thứ 90
```

Trang bài học vẫn hiện ảnh bìa như cũ; học viên bấm nút ▶ thì video phát ngay trong khung.
Bài chưa có link thì bấm ▶ sẽ hiện "Video đang được chuẩn bị".

Video phải để chế độ **Công khai** hoặc **Không công khai (Unlisted)** và cho phép nhúng. Video **Riêng tư** sẽ không phát được.

### Video chữa bài tập và video từ vựng (không bắt buộc)

```
video: https://youtu.be/WUlPuueAG8U              ← bài giảng (video chính)
video_kaisetsu: https://youtu.be/obo97g5895Y     ← chữa bài tập
video_tango: https://youtu.be/5Q7t2gl5n8Q        ← từ vựng
```

Khi bài có thêm video, ngay dưới khung video hiện các nút **授業 Bài giảng · 解説 Chữa bài tập · 単語 Từ vựng**;
bấm nút nào thì khung phát video đó. Video nào để trống thì nút đó tự ẩn.
`duration:` là độ dài video bài giảng.

## 6. Khóa học, chương và bài "Sắp có"

Mỗi chương trong `courses.json` có thể có:
- `"lessons"`: các bài đã có file;
- `"planned"`: các bài dự kiến, hiện thẻ mờ "Sắp có", ví dụ
  `"planned":[{"ja":"「正弦定理」の使い方","vi":"Cách dùng định lý sin"}]`.

Chương không có cả hai thì hiện "Chương này đang được soạn".

Thêm một khóa học mới: chép một khối `{ "id": ..., "chapters": [...] }` có sẵn, đổi `id` (không trùng khóa khác), `subject`, `series`, `name`, `vi`, `en`.
`subject` phải là một trong: `nihongo`, `sugaku`, `rika`, `shakai`, `tango`.
Nếu `series` là tên mới, thêm bản dịch của nó vào `"series_vi"` và `"series_en"`.

Môn, khóa học, chương và bài "Sắp có" đều có thêm `"en"` (tên tiếng Anh, hiện ở chế độ EN). Thiếu `"en"` thì chế độ EN hiện tên tiếng Nhật.

Lưu ý cú pháp JSON: các mục cách nhau bằng dấu phẩy, mục cuối cùng **không** có dấu phẩy, chữ đặt trong dấu `"`.

## 6b. Môn Toán: 20 chủ đề (`content/math-topics.json`)

Môn Toán xếp theo **20 chủ đề của đề cương EJU**. Mỗi chủ đề khai báo **một lần** trong `content/math-topics.json`:

```json
{
  "no": 1, "tag": "数学Ⅰ", "ja": "数と式", "vi": "Số và biểu thức", "en": "Numbers and expressions",
  "sections": [
    {"ja":"式の計算","vi":"Tính toán biểu thức","en":"Calculating expressions","lessons":["k1-01"]},
    {"ja":"実数","vi":"Số thực","en":"Real numbers","planned":[
      {"ja":"実数","vi":"Số thực","en":"Real numbers"},
      {"ja":"根号を含む式の計算","vi":"Tính toán biểu thức chứa căn","en":"Expressions with square roots"}]}
  ]
}
```

- `sections` là các mục lớn (1), (2)… theo thứ tự (số (1), (2) web tự đánh).
- Trong mỗi mục: `"lessons"` là các bài đã có, `"planned"` là các mục nhỏ chưa có bài (thẻ "Sắp có").
  Có bài mới thì thêm mã bài vào `"lessons"` và xóa mục tương ứng trong `"planned"`.

Các khóa Toán trong `content/courses.json` chỉ ghi **số chủ đề**, web tự dựng chương:

| Khóa | Chủ đề |
|---|---|
| 数学Ⅰ | 1, 2, 3, 4 |
| 数学A | 5, 6, 7 |
| 数学Ⅱ | 8, 9, 10, 11, 19, 20 |
| 数学B | 12, 13 |
| 数学Ⅲ | 17, 18, 19, 20 |
| 数学C | 14, 15, 16 |
| コース1 (EJU) | 1 → 7 |
| コース2 (EJU) | 1 → 20 |

Vì vậy một bài ở chủ đề 1 tự hiện trong 数学Ⅰ, コース1 và コース2. Muốn đổi chủ đề của một khóa thì sửa dòng `"topics": [...]` của khóa đó.

## 7. Thông tin chung (`content/site.json`)

- `member`: dòng giới thiệu dưới tên học viên ở dải màu cam trang đầu (tên lấy từ tài khoản đăng nhập).
- `recommended`: mã các bài gợi ý khi học viên chưa xem bài nào.
- `footer`: các dòng chữ cuối trang.

Mỗi dòng chữ có `ja`, `vi` và `en` (tiếng Anh, không bắt buộc).

## 8. Khi file bị viết sai

Web sẽ hiện **hộp đỏ** phía trên trang, ghi rõ tên file, số dòng và lỗi gì, ví dụ:

> `content/lessons/m2b.md` · dòng 30: Các ô trong đề (A, B) không khớp với đáp án (A).

Bài bị lỗi tạm thời bị ẩn, các bài khác vẫn chạy bình thường. Sửa xong, tải lại trang là hộp đỏ biến mất.

## 9. Đưa website lên mạng (miễn phí)

Website đang chạy trên **GitHub Pages**:

- Trang web: https://eju09-newmichi.github.io/newmichi-eju/
- Mã nguồn (kho GitHub): https://github.com/Eju09-Newmichi/newmichi-eju

Mỗi lần có bài mới, Claude Code kiểm tra trên máy rồi commit và `git push`; khoảng 1 phút sau web tự cập nhật.
Link trực tiếp tới một bài có dạng `https://eju09-newmichi.github.io/newmichi-eju/#v-<mã-bài>`; người chưa đăng nhập
sẽ được đưa vào đúng bài đó ngay sau khi đăng nhập.

Không xóa file `.nojekyll` ở thư mục gốc (thiếu nó GitHub không phục vụ các file `.md` của bài học).
Khi kết nối Firebase, nhớ thêm `eju09-newmichi.github.io` vào **Authorized domains** (mục 11).

Trên mạng thì không cần `xem-thu.bat`.

## 10. Ghi chú

- Nút ngôn ngữ: **VI** (chỉ tiếng Việt) · **JP+VI** (song ngữ) · **JP** (chỉ tiếng Nhật) · **EN** (tiếng Anh).
  Giao diện (menu, nút, tiêu đề) đã có đủ tiếng Anh; nội dung bài học có tiếng Anh tới đâu là nhờ các dòng `EN:` bạn thêm vào.

- Tiến độ học, lịch sử xem và bookmark lưu **theo tài khoản** (khi đã kết nối Firebase), đổi máy vẫn còn.
- Màu chủ đạo (cam) nằm ở đầu file `assets/style.css`, các dòng `--accent`, `--accent-soft`, `--band`.
- Bảng xếp hạng xếp các học viên theo số bài đã hoàn thành (chỉ hiện tên hiển thị, không hiện email).

## 11. Đăng nhập (Firebase)

Website có trang chào với hai nút **ログイン** (Đăng nhập) và **新規登録** (Đăng ký). Chưa đăng nhập thì không vào được trang học.

### Chế độ thử

Khi `firebase-config.js` còn để trống, web chạy ở **chế độ thử**: tài khoản chỉ lưu trên trình duyệt của máy đang dùng,
không gửi được email quên mật khẩu, và trang chào hiện dòng "Chế độ thử". Dùng để xem trước, **không dùng cho học viên thật**.

### Kết nối Firebase (làm một lần, miễn phí)

1. Vào https://console.firebase.google.com, đăng nhập bằng tài khoản Google, bấm **Create a project** (Tạo dự án).
   Đặt tên, ví dụ `newmichi-eju`. Google Analytics có thể tắt.
2. **Bật đăng nhập bằng email:** menu trái **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save**.
3. **Tạo cơ sở dữ liệu:** **Build → Firestore Database → Create database**. Chọn vị trí gần học viên (ví dụ `asia-northeast1` Tokyo hoặc `asia-southeast1` Singapore),
   chọn **Start in production mode**.
4. **Dán quy tắc bảo mật:** trong Firestore, mở tab **Rules**, xóa hết nội dung cũ, dán toàn bộ nội dung file `firestore.rules`, bấm **Publish**.
5. **Lấy mã cấu hình:** bấm bánh răng ⚙ → **Project settings** → kéo xuống **Your apps** → bấm biểu tượng **</>** (Web) → đặt tên → **Register app**.
   Firebase hiện một đoạn `const firebaseConfig = { apiKey: "...", authDomain: "...", ... }`.
6. Mở `firebase-config.js`, chép từng giá trị (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) vào giữa các dấu `""` tương ứng, lưu lại.
7. Tải lại trang: dòng "Chế độ thử" biến mất là đã kết nối xong. Thử đăng ký một tài khoản.

`apiKey` của Firebase không phải mật khẩu bí mật; để nó trong website là bình thường. Dữ liệu được bảo vệ bởi quy tắc ở bước 4.

### Khi đưa web lên mạng

Vào **Authentication → Settings → Authorized domains → Add domain**, thêm tên miền của website
(ví dụ `newmichi-eju.netlify.app`). Thiếu bước này thì trang đăng nhập báo lỗi tên miền chưa được thêm.

### Quản lý học viên

- Xem danh sách tài khoản: **Authentication → Users**. Ở đây có thể tắt (Disable) hoặc xóa tài khoản.
- Khi xóa một tài khoản, vào thêm **Firestore Database** để xóa dữ liệu của người đó trong `users` và `ranking` (tìm theo mã User UID).
- Email đặt lại mật khẩu do Firebase gửi; nội dung thư sửa được ở **Authentication → Templates**.

### Điều khoản

`content/terms.md` là **bản mẫu**. Hãy đọc lại, sửa cho đúng cách bạn vận hành và thay `[EMAIL LIÊN HỆ]` bằng email thật trước khi mở cho học viên.

### Giới hạn cần biết

Màn đăng nhập chặn người lạ vào trang học, nhưng các file trong `content/` vẫn nằm công khai trên máy chủ web:
ai biết đường dẫn chính xác (ví dụ `.../content/lessons/m2a.md`) vẫn tải được. Video YouTube cũng vậy nếu để chế độ Không công khai.
Muốn khóa hẳn nội dung thì cần chuyển bài học vào Firebase (làm thêm sau nếu cần).
