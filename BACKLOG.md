# BACKLOG — sổ nợ của repo bộ khung

> **Vì sao có file này:** `AGENTS.md` mục 0 bước 2 bắt mọi phiên *"việc ngoài phạm vi → ghi vào
> `BACKLOG.md`, không tự làm"*. `MULTIFLOW.md` trỏ theo, và `what-next.mjs` đọc nó ở 6 chỗ.
> **Nhưng tới 2026-09-05 file này chưa từng tồn tại.** Nên suốt từ đầu, luật bảo AI ghi nợ vào
> một chỗ không có, và `npm run what-next` báo *"0 việc mở"* cho mọi vùng — không phải vì hết
> việc, mà vì không có chỗ để việc rơi vào. Đây đúng bệnh repo này từng bắt với `claim.mjs`:
> *luật trỏ tới thứ không tồn tại thì nó không phải luật, nó là chữ.*

**Quy ước sổ — `what-next.mjs` đọc đúng ba thứ này, sai một ký tự là mục biến mất:**

- Nhóm ưu tiên: một dòng `## P1` … `## P9`. Mục nằm dưới nhóm nào ăn ưu tiên nhóm đó.
- Mỗi mục: `### KHUNG-<số> · <tiêu đề>`.
- Đóng một mục: **gạch ngang mã** — `### ~~KHUNG-1~~ · …`. Giữ lại, đừng xoá: sổ còn dùng để
  tra lịch sử. Viết `ĐÓNG` mà quên gạch thì lệnh **nêu tên mục đó** là khai sai, không im lặng.

---

## P1

### ~~KHUNG-1~~ · Mục đỏ "Sự thật máy sinh còn tươi" — MỘT bug, không phải hai

**ĐÃ VÁ 05/09, bản 1.3.1.** Khối `generated_files` trong `.repo-structure.json` + bộ đếm đọc nó.
Đức chốt cắt bản mới. Xem CHANGELOG 1.3.1.

Cổng đóng phiên có **một mục đỏ vĩnh viễn**.

**Nguyên nhân, đúng một cái:** khối `MAY_SINH` trong `build-dashboard.mjs:408` chỉ miễn trừ
`llms.txt`, `repo-map.json`, `DASHBOARD.md`. Hai trang `DASHBOARD-<repo>.html` và
`SO-MIGRATE-<repo>.html` **cũng do bộ sinh viết ra** nhưng mang đuôi `.html`, nên
`isBehaviourFile()` đếm chúng là "code đã đổi". Mỗi commit sinh lại artifact tự cộng thêm một
vào chính con số mà artifact vừa sinh phải khớp — artifact vừa commit xong là lập tức cũ.
Đúng vòng lặp mà chú thích ngay trên khối đó mô tả và tin là đã chặn: chặn cho ba file, sót hai
file thêm vào sau.

**MỘT CHẨN ĐOÁN SAI, GHI LẠI ĐỂ KHÔNG AI ĐUỔI LẠI:** bản đầu của mục này (và Log
`claude-dieu-phoi-0509` trong `HANDOFF.md`) khẳng định có **nguyên nhân thứ hai** — "bộ sinh và
bộ kiểm bất đồng đúng một đơn vị: sinh ra 11, state-check đòi 12". **Sai.** Audit độc lập của
Codex ngày 05/09 chỉ ra, và đo lại xác nhận: `11` là con số nằm trong **file đã commit**, `12`
là con số **sinh lại tại HEAD**. Một bộ đếm, hai thời điểm — không phải hai bộ đếm bất đồng.
Đo lại dứt điểm tại HEAD `85accf1`: `git show HEAD:DASHBOARD.md` cho `CÓ (11 commit)`, sinh lại
trên đĩa cho `CÓ (14 commit)`. Bài học: *"hai con số khác nhau"* chưa phải *"hai bộ đếm khác
nhau"* — phải hỏi hai con số đó được đọc từ đâu trước khi kết luận.

Vá được bằng cách thêm hai trang HTML vào khối miễn trừ. Vùng: `_code`. **Sửa là đổi dấu vân tay
tầng máy → buộc cắt 1.3.1 → chạm hai repo đang ghim bản khung. Cần người chốt trước khi làm.**

### ~~KHUNG-5~~ · Phép ghim của khối miễn trừ bỏ sót đúng hai file gây lỗi

**ĐÃ VÁ 05/09, bản 1.3.1** — cùng lượt với KHUNG-1, kèm đột biến kiểm chứng minh nó đỏ được.

`tests/core-contract.mjs` thử `isBehaviourFile()` với đúng ba file `repo-map.json`, `llms.txt`,
`DASHBOARD.md` — **không thử hai trang HTML**, dù chúng được khai là máy sinh trong
`.repo-structure.json`. Nên phép kiểm xanh trong khi ca hỏng đang tồn tại ngay trong repo. Đây
là luật vàng số 2 bị vi phạm ở chính bộ phép kiểm: *fixture phải dựng nổi ca hỏng*. Đi kèm
KHUNG-1, sửa cùng lượt. Vùng: `_code`.

## P2

### ~~KHUNG-2~~ · Hai quy trình migrate không đi theo bản trích

**ĐỨC CHỐT 05/09, xem [decisions.md](decisions.md):** migrate là việc của người **cầm** bộ khung,
nên hai quy trình đó **ở lại nhà**. Nhưng lượt migrate nay gồm **ba** việc chứ không một —
migrate + audit + bring assistant onboard — và checklist tính năng đã viết vào
`docs/protocols/CHUYEN-REPO-LEN-CHUAN.md`. Việc còn lại tách thành KHUNG-13.

### KHUNG-13 · Bản trích phát đi luật bắt dùng HAI file mà nó không mang theo

**Đo 05/09, chưa vá.** `template/AGENTS.md:11` bắt ghi việc ngoài phạm vi vào `BACKLOG.md`;
`template/AGENTS.md:175` bắt ghi quyết định vào `decisions.md`. **Bản trích không mang file nào
trong hai.**

Nên **mọi repo dựng từ khuôn sinh ra đã mang sẵn** đúng bệnh repo nhà vừa vá cùng ngày (KHUNG-7,
và chính `BACKLOG.md` này): luật trỏ tới thứ không tồn tại · `what-next` báo *"0 việc mở"* vĩnh
viễn · quyết định của người chốt không có chỗ hạ cánh.

Đây là **lần thứ TƯ** cùng hình dạng lỗi, và lần này nó **được nhân bản sang mọi repo đích** —
nặng hơn ba lần trước cộng lại. Bản vá: bản trích mang theo hạt giống hai file đó, mỗi file một
dòng tiêu đề và quy ước sổ là đủ. **Không nằm trong `scripts/` hay `tests/` nên không buộc cắt
bản mới** — cùng cơ chế đã đo khi thêm `.gitattributes`.

Lối đi tạm cho ai migrate trước khi vá: thả tay hai file vào repo đích; đã ghi ngay trong quy
trình migrate, chỗ người migrate thật sự đọc. Vùng: `_code` (bộ sinh) + `_template`.

### KHUNG-14 · Chưa lượt migrate nào đi qua phép thử "assistant onboard"

Đức chốt 05/09: lượt migrate **không xong khi cổng xanh**, mà xong khi một phiên AI ở repo đích
nhận được khoá và làm trọn một việc nhỏ tới lúc cổng xanh, không cần ai ở bộ khung giải thích.

Hai lượt 03/09 (`nav_platform_main`, `Project 3 AI Agent Unify`) đều **dừng ở mức cổng xanh** —
tức theo định nghĩa mới thì **cả hai chưa xong việc thứ ba**. Ba phép thử đã viết trong quy trình
migrate; chưa lượt nào chạy chúng. Gắn với KHUNG-3 (đo lại hai pilot ở bản hiện tại): làm cùng
lượt thì rẻ hơn hai lượt. Vùng: *(chạy ở repo đích, không đòi khoá của bộ khung)*.

### KHUNG-3 · Hai pilot migrate chưa đo lại ở bản khung hiện tại

`nav_platform_main` và `Project 3 AI Agent Unify` migrate ngày 03/09 ở bản **0.3.0**; nay là
**1.3.0**. Không ai biết chúng còn khớp không, và không ai biết bao nhiêu thứ đã trôi. Đo rẻ:
`npm run assess -- <đường-dẫn-repo>` cho từng repo, rồi so với `muc_sau` ghi trong hồ sơ
`docs/migrations/`. **Chỉ đọc, không đòi khoá nào.**

## P3

### KHUNG-4 · Ba luật lớn của vai điều phối chưa có phép kiểm máy

`ORCHESTRATOR.md` tự khai: hàng rào chống trượt vai · query-driven · luật nạp báo cáo năm mục —
cả ba **chưa có phép kiểm nào canh**. Ở repo sinh ra sổ này, một phép kiểm cho hàng rào **đã
được viết nhưng chưa đi theo bộ khung**. `AGENTS.md` mục 7: *luật nào máy không kiểm được thì
sớm muộn cũng bị bỏ qua* — nên ba mục đó hiện là quy ước, không phải chốt. Vùng: `_code`.

### KHUNG-6 · Danh tính phiên là thứ TỰ KHAI — ba lớp quy trách nhiệm đều tin lời khai

Audit độc lập Codex 05/09. Cả ba chốt quy trách nhiệm chỉ so chuỗi, không có gì chứng minh
người chạy đúng là người họ khai:

- `claim.mjs` — trả quyền chỉ kiểm `--as` có khớp `owner` không. Phiên B biết tên phiên A là
  chạy được `--release <khoá> --as A`, và bảng quyền tin.
- `safe-push.mjs` — commit thuộc về ai chỉ dựa vào dòng chữ `Lane:` trong thông điệp commit.
- `session-check.mjs` — commit **thiếu** nhãn chỉ bị cảnh báo; `safe-push` khi đó quy về chủ vùng
  hiện tại. Nên sau khi vùng đổi chủ, commit cũ không nhãn **bị quy cho người mới**.

Cần nói thẳng giới hạn trước khi ai đó định "vá": ba cơ chế này sinh ra để chống **giẫm chân do
vô ý** giữa các phiên AI hợp tác, không phải chống **mạo danh cố ý**. Chống mạo danh thật cần
chữ ký, tức một hạng mục khác hẳn. Việc đáng làm trước mắt có thể chỉ là **ghi rõ giới hạn đó
vào `MULTIFLOW.md`**, để không ai đọc bốn cơ chế kia như một lớp bảo mật. Vùng: `_docs`
(nếu chỉ ghi giới hạn) hoặc `_code` (nếu muốn siết thật).

### KHUNG-7 · Luật đóng phiên bắt ghi vào `decisions.md` — file không tồn tại

`AGENTS.md` mục 7 bước 2: *"Quyết định mới của Đức → `decisions.md`"*. Repo **không có file này**,
và Bản đồ file cũng không khai nó. Nên khi Đức chốt một việc thật, phiên AI không có đích hợp lệ
để tuân luật — và quyết định rơi vào `HANDOFF.md` hoặc bốc hơi.

**Đây là lần thứ BA cùng một hình dạng lỗi trong repo này:** `claim.mjs` (audit 03/09) ·
`BACKLOG.md` (05/09) · `decisions.md` (05/09). Ba lần, ba file khác nhau, cùng một bệnh: luật
trỏ tới thứ không tồn tại. Đáng cân nhắc một phép kiểm máy quét chính điều này, thay vì chờ lần
thứ tư. Vùng: `_root` + `_code`.

### KHUNG-8 · Luật bắt ghi vào "bảng lỗi của sổ tay" — không chỉ ra bảng nào

`AGENTS.md` mục 7 bước 3 bắt thêm một dòng vào *"bảng lỗi của sổ tay"* khi gặp lỗi mới ở hệ thống
bên ngoài. Repo không có bảng nào được đặt tên là bảng lỗi. Mỗi phiên sẽ ghi vào một chỗ khác,
hoặc bỏ qua. Cùng họ với KHUNG-7. Vùng: `_root`.

### KHUNG-9 · `can-nang.mjs` xác nhận "đã có ca hỏng" bằng cách TÌM CHUỖI

`coCaHong()` chỉ hỏi: tên phép kiểm có xuất hiện đâu đó trong `tests/cong-do-that.mjs` không.
**Một cái tên nằm trong dòng chú thích cũng đủ** để phép kiểm đó được đánh dấu là "đã có ca
hỏng", dù không assertion nào chứng minh nó đỏ được.

Mỉa mai đúng chỗ: đây là công cụ sinh ra để phát hiện *luật chưa từng chặn được gì*, và bản thân
nó đang dùng một phép đo không phân biệt được hai nhánh — chính luật vàng số 2. Vùng: `_code`.

### KHUNG-10 · `cong-do-that.mjs` dựng ca đỏ cho 6 trong 11 mục cổng, nhưng bảng tra nói như thể cả cổng

Bảng tra `AGENTS.md` mục 6 giới thiệu file này là chỗ *"biết cổng đóng phiên có ĐỎ THẬT được
không"*. Thực tế nó dựng ca hỏng cho **sáu** mục; cổng có **mười một**. Bốn mục chưa có ca kho
thật độc lập trong file đó: file mới đã khai vào Bản đồ · HANDOFF đã ghi Log · **Sự thật máy
sinh còn tươi** · cổng cấu trúc được gọi và truyền đúng kết quả.

Chú ý mục thứ ba: đó chính là mục đang đỏ vĩnh viễn (KHUNG-1). Một mục vừa chưa chứng minh được
là đỏ-thật-được, vừa đang đỏ thật — và không ai bắt được sự trớ trêu đó cho tới khi audit ngoài
vào đọc. Việc rẻ nhất: sửa câu trong bảng tra cho khớp bằng chứng. Vùng: `_docs`.

### KHUNG-11 · Repo đã vượt ngân sách cân nặng của chính nó

`can-nang.mjs` đặt ngân sách tài liệu **2.200 dòng**. **Đo lại độc lập 05/09: 3.198 dòng — vượt
998 dòng, 45%.** (Codex báo 3.169; chênh vì `BACKLOG.md` vừa thêm. Hai lượt đo khớp nhau.)
`AGENTS.md` mục 8 nói rõ: quá ngân sách thì **phải BỚT trước khi nghĩ tới nới**.

Ba con số còn lại vẫn trong ngân sách, nhưng **một con số sát trần đáng để mắt**: thời gian chạy
trọn bộ phép kiểm **174/180 giây**. Còn 6 giây. Thêm một suite nữa là vượt — và đã thấy hệ quả
thật trong phiên 05/09: `npm test` vượt quá thời gian chờ mặc định, phải chạy nền. Phép kiểm
chậm tới mức người ta ngại chạy là phép kiểm sắp bị bỏ qua.

Bớt cái gì thì cần Đức chốt hướng — đây là tài liệu của repo, không phải code thừa. Vùng:
`_docs` + `_root`.

### KHUNG-12 · Lớp "nghề nào đếm file nghề ấy" chưa từng chạy ở luồng thật

Phát hiện khi vá KHUNG-1. `isBehaviourFile()` nhận `opts.behaviourGlobs` để repo Python khai
`**/*.py` mà đếm cho đúng — nhưng trước bản 1.3.1, `changedCommitCount()` gọi nó **không kèm
tham số nào**. Tức lớp đó chưa bao giờ chạy ở luồng thật: repo Python vẫn bị đo là "code không
đổi", đúng cái mà chú thích của chính lớp đó nói là đã chữa. Và repo 3AI migrate 03/09 **chính
là Python**.

Bản 1.3.1 đã nối đường truyền tham số (`behaviourOpts`), nên chỗ vá sẵn sàng. Còn thiếu hai vế:
**khai `behaviour_globs`** ở nơi cần, và **một phép ghim dựng nổi ca hỏng** cho nó — không thì
lại đúng bệnh KHUNG-5. Vùng: `_code`.

### KHUNG-15 · Cổng báo "Test xanh ĐỎ" trong khi mọi suite exit 0

**Triệu chứng, đo 05/09 — KHÔNG chẩn đoán nguyên nhân ở đây** (mục nợ ghi triệu chứng; tìm
nguyên nhân là việc của executor có brief):

- `npm test` → **exit 0**, 145 phép xanh, 0 đỏ.
- `node tests/cong-do-that.mjs` → exit 0. `node tests/core-contract.mjs` → exit 0.
- `node scripts/session-check.mjs --as <phiên>` → mục **"Test xanh" ĐỎ**, với dòng giải thích
  `suite gốc repo ĐỎ →` rồi liệt kê **toàn dòng `ok`**.

Một chi tiết đáng đưa cho người điều tra, không phải kết luận: các phép kiểm được liệt kê ở đó
mang tên chứa sẵn chữ **`HỎNG`**, **`KHÔNG BIẾT`**, **`XOÁ`** — vì chúng là các phép kiểm *về*
trạng thái hỏng. Nếu cổng phân loại kết quả suite bằng cách dò chuỗi trong output thì đó là chỗ
đáng nhìn trước tiên.

**Hướng sai lệch là fail-closed** (báo đỏ khi thực ra xanh), nhẹ hơn chiều ngược lại. Nhưng hậu
quả thật vẫn nặng: **cổng đóng phiên không đóng được**, nên hoặc phiên treo, hoặc người ta bắt
đầu push khi đỏ — và một khi đã push-khi-đỏ một lần thì lần sau dễ hơn.

Gắn với KHUNG-9 (`can-nang` xác nhận ca hỏng bằng tìm chuỗi) và KHUNG-10: nếu đúng là dò chuỗi
thì đây là **lần thứ ba** một cơ chế của bộ khung dùng phép đo bằng chuỗi văn bản. Vùng: `_code`.
