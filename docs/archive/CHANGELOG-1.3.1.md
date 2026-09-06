# CHANGELOG — LƯU TRỮ, bản 1.3.1

> **CHỮ GIỮ NGUYÊN, chỉ ĐỔI CHỖ.** Cắt từ `CHANGELOG.md` bằng `npm run don`.
> Sổ phát hành là file CHỈ-THÊM nên phình vô hạn — 301 dòng / ngân sách 300.
> Không dòng nào bị sửa, không dòng nào bị bỏ. Bản mới nhất vẫn ở [CHANGELOG.md](../../CHANGELOG.md).

## 1.3.1 — 2026-09-05 — Bộ đếm "code đã đổi" thôi đếm sản phẩm của chính bộ sinh

Cổng đóng phiên có **một mục đỏ vĩnh viễn**: *"Sự thật máy sinh còn tươi"*. Không thứ tự commit
nào hội tụ được, và nó đã đỏ suốt nhiều phiên trước khi ai đó đuổi tới gốc.

**Nguyên nhân, đúng một cái.** Bộ đếm *"code đã đổi sau lần kiểm chứng"* miễn trừ ba file máy
sinh bằng một danh sách cứng trong code: `llms.txt`, `repo-map.json`, `DASHBOARD.md`. Repo nhà
sinh thêm **hai trang HTML** — chúng mang đuôi `.html` nên lọt vào danh sách đuôi file hành vi và
**bị đếm là code đã đổi**. Nên mỗi commit sinh lại artifact tự cộng thêm một vào chính con số mà
artifact vừa sinh phải khớp: artifact vừa commit xong là lập tức cũ.

Đây đúng vòng lặp mà chú thích ngay trên khối đó mô tả và tin là đã chặn — chặn cho ba file, sót
hai file thêm vào sau. Bản vá cũ chữa **triệu chứng ở ba file cụ thể**; bản này chữa **hình dạng
lỗi**.

**Khai ở cấu hình, không đóng cứng trong code.** Khối mới `generated_files` trong
`.repo-structure.json`: `generators` trả lời *"chạy lệnh nào để sinh lại"*, khối này trả lời
*"lệnh đó đẻ ra file nào"*. Khác nhau một chữ, và chính chỗ khác đó là cái bẫy. Đóng cứng tên hai
trang kia vào code là không được: tên chúng mang tên dự án, mà bộ đếm đi theo bản trích sang mọi
repo — làm thế là phát tên repo gốc đi khắp nơi, và lặp lại đúng bệnh *"đo được đúng một nghề"*
mà lớp `behaviour_globs` sinh ra để chữa.

**Một chẩn đoán sai bị bác, ghi lại vì bài học đáng hơn bản vá.** Phiên đuổi lỗi này ban đầu kết
luận có **hai** bug xếp chồng, cái thứ hai là *"bộ sinh và bộ kiểm bất đồng đúng một đơn vị —
sinh ra 11, cổng đòi 12"*. Audit độc lập bác, và đo lại xác nhận: `11` là con số nằm trong **file
đã commit**, `12` là con số **sinh lại tại HEAD**. Một bộ đếm, hai thời điểm.
*"Hai con số khác nhau"* chưa phải *"hai bộ đếm khác nhau"* — phải hỏi hai con số ấy đọc từ đâu
trước khi kết luận.

**Phép ghim cũng vá, vì nó xanh suốt trong khi ca hỏng nằm ngay trong repo.** Khối kiểm cũ thử
đúng ba file cứng — không thử hai file đang gây lỗi. Nay thêm ca cho file repo tự khai, **kèm vế
thứ hai**: file **chưa** khai thì vẫn phải bị đếm. Thiếu vế đó thì một bản vá biến mọi `.html`
thành không-đếm cũng qua được phép kiểm.
**Đột biến kiểm:** bỏ đúng dòng vừa thêm khỏi bộ đếm → suite **đỏ đúng chỗ**
(`DASHBOARD-Ten-Repo.html da khai la may sinh, khong duoc dem`), hoàn nguyên → xanh lại.

**Tầng máy đổi nên bản phát tăng:** `1.3.0` → `1.3.1`, dấu vân tay `5b2b74c0eee8e3b6` đã ghi vào
sổ phát hành. Repo đang ghim bản khung nhận bản vá bằng `npm run upgrade`, không chép tay.

---

**Bản cũ hơn đã dời sang** [docs/archive/CHANGELOG-1.3.0.md](docs/archive/CHANGELOG-1.3.0.md) — chữ giữ nguyên từng dòng.
