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

### ~~KHUNG-13~~ · ĐÓNG 06/09 · Bản trích phát đi luật bắt dùng HAI file mà nó không mang theo

> **ĐÓNG 06/09 — đo lại: bản trích ĐÃ mang cả `BACKLOG.md` lẫn `decisions.md`.** Và `F12` (`tests/core-contract.mjs`) nay chặn **hình dạng** lỗi này chứ không chỉ hai file cụ thể: luật trong khuôn trỏ tới file bản trích không mang thì đỏ.

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

### ~~KHUNG-7~~ · ĐÓNG 06/09 · Luật đóng phiên bắt ghi vào `decisions.md` — file không tồn tại

> **ĐÓNG 06/09 — đo lại thì không còn đúng.** `decisions.md` đã có ở repo này từ 05/09 và đang được ghi đều; bản trích cũng mang nó. Mục này để mở thêm một ngày sau khi đã được vá — **sổ nợ cũng mục được**, và đó là lý do `npm run what-next` phải được đọc cùng số đo chứ không đọc một mình.

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

### KHUNG-11 · Repo vượt ngân sách — nay có CƠ CHẾ dọn, không còn là việc làm tay

> **Đức chốt 06/09:** cắt gọn + dời sang lưu trữ, KHÔNG xoá. Đã làm một vòng, mỗi bước có md5
> chứng minh không mất byte: `HANDOFF.md` 1.273→415 · `CHANGELOG.md` 806→241 · `ROADMAP-V1`
> vào lưu trữ. Tổng tài liệu **3.681 → 2.999**. Kèm theo phải vá một mâu thuẫn trong chính
> `can-nang.mjs`: nó bảo dời sang `docs/archive/` trong khi vẫn quét đệ quy cả `docs/` — làm
> đúng lời khuyên thì tổng TĂNG. Nay `docs/archive/` được miễn.
>
> **ĐỨC CHỐT 06/09 — vòng hai: cần CƠ CHẾ dọn, không phải một lượt dọn.** *"Nội dung sẽ luôn
> bị phình sau 1 quá trình."* Đã dựng `scripts/don.mjs` (`npm run don`) và cho đi theo bản trích,
> nên mọi repo migrate cũng dọn được. Ghim ở `tests/don-smoke.mjs`, **bốn vế**, cả bốn qua đột
> biến kiểm. `HANDOFF.md` 1.311 → 598 · `CHANGELOG.md` 335 → 262, không mất byte nào.
>
> **Còn treo, và KHÔNG chặn ai:** còn vượt **799 dòng**, và lối duy nhất còn lại là gọt
> `docs/protocols/ORCHESTRATOR.md` (426 dòng). Tôi KHÔNG tự gọt: mỗi mục trong đó gắn một sự
> cố có thật, khối chú thích cuối file bị `tests/template-null-repo.mjs` ghim, và gọt hết 276
> dòng cũng chỉ còn 2.723 — **vẫn vượt**. Tức 2.200 là con số đặt theo mong muốn, chưa từng
> đặt theo số đo. Hai lối: (a) gọt thật và chấp nhận mất nội dung; (b) đặt lại ngân sách theo
> số đo hôm nay + biên, và ghi rõ vì sao.

`can-nang.mjs` đặt ngân sách tài liệu **2.200 dòng**. **Đo lại độc lập 05/09: 3.198 dòng — vượt
998 dòng, 45%.** (Codex báo 3.169; chênh vì `BACKLOG.md` vừa thêm. Hai lượt đo khớp nhau.)
`AGENTS.md` mục 8 nói rõ: quá ngân sách thì **phải BỚT trước khi nghĩ tới nới**.

Ba con số còn lại vẫn trong ngân sách, nhưng **một con số sát trần đáng để mắt**: thời gian chạy
trọn bộ phép kiểm **174/180 giây**. Còn 6 giây. Thêm một suite nữa là vượt — và đã thấy hệ quả
thật trong phiên 05/09: `npm test` vượt quá thời gian chờ mặc định, phải chạy nền. Phép kiểm
chậm tới mức người ta ngại chạy là phép kiểm sắp bị bỏ qua.

Bớt cái gì thì cần Đức chốt hướng — đây là tài liệu của repo, không phải code thừa. Vùng:
`_docs` + `_root`.

### ~~KHUNG-12~~ · Lớp "nghề nào đếm file nghề ấy" chưa từng chạy ở luồng thật

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

**BỔ SUNG 05/09, và đây là dữ kiện quan trọng hơn lần đỏ đầu: NÓ CHẬP CHỜN.** Lượt chạy ngay
sau đó, cùng lệnh, cùng repo, không sửa gì liên quan → mục *"Test xanh"* **XANH**. Tức nó không
đỏ ổn định.

Phép kiểm chập chờn **tệ hơn** phép kiểm đỏ ổn định, vì hai lý do:
1. Đỏ ổn định thì ai cũng phải xử. Chập chờn thì người ta **chạy lại cho tới khi xanh** — và
   thói quen đó vô hiệu hoá cổng mà không ai phải quyết định vô hiệu hoá nó.
2. Nó xoá bằng chứng của chính mình: lần chạy sau xanh thì không còn gì để điều tra.

Ai nhận mục này: **đừng bắt đầu bằng cách chạy lại cho ra đỏ.** Bắt đầu bằng câu hỏi *cổng đọc
kết quả suite từ đâu, và cái gì khác nhau giữa hai lượt chạy* — thời gian chạy, thứ tự suite,
trạng thái cây làm việc, hay output bị cắt. Ghi lại lượt nào đỏ lượt nào xanh trước khi đổi
bất cứ dòng nào.

### ~~KHUNG-16~~ · ĐÓNG 06/09 · `DASHBOARD.md` nhúng mã commit HEAD nên KHÔNG THỂ hội tụ

> **CHỜ NGƯỜI CHỐT:** chọn một trong ba lối (bỏ mã commit · nhúng mã commit cha · miễn hai dòng khỏi phép so) — là quyết định kiến trúc, không phải bản vá.

**Đo dứt điểm 05/09.** Sau khi bản 1.3.1 vá cột `changedCount` và mốc kiểm chứng được cập nhật,
trang vẫn lệch mỗi lượt — và diff cho thấy **đúng hai dòng**:

```
-Trang được sinh tại commit `0b1e0f4` …
+Trang được sinh tại commit `d639387` …
-2. **Phiên gần nhất** — … @ `0b1e0f4` …
+2. **Phiên gần nhất** — … @ `d639387` …
```

Trang **nhúng mã commit của HEAD**. Mà commit chính trang đó lại đổi HEAD. Nên: sinh → commit →
HEAD đổi → trang vừa commit đã cũ. **Không thứ tự commit nào hội tụ**, kể cả sinh-ngay-trước-push.

Đây là **giới hạn thiết kế**, không phải lỗi lập trình — và phải nói rõ thế, vì ai nhận mục này
mà đi "sửa bug" sẽ không tìm thấy bug nào. Ba lối, chọn một là quyết định kiến trúc:

1. **Bỏ mã commit khỏi trang** — giữ ngày, bỏ mã. Rẻ nhất; mất khả năng truy trang này sinh tại
   commit nào.
2. **Nhúng mã commit CHA** (`HEAD` lúc sinh sẽ thành cha của commit chứa trang) — hội tụ, nhưng
   chỉ đúng khi trang luôn được commit ngay sau khi sinh, tức thêm một quy ước bất thành văn.
3. **Miễn hẳn hai dòng đó khỏi phép so tươi** — cổng chỉ so phần còn lại. Giữ được thông tin,
   nhưng phép kiểm thôi canh một phần nội dung.

**Hậu quả nếu để nguyên:** mục *"Sự thật máy sinh còn tươi"* của cổng đóng phiên **đỏ lại sau mỗi
commit**, và mọi phiên đều phải chạy thêm một vòng sinh-lại-commit vô ích rồi vẫn đỏ. Đây là lý
do thật khiến mục đó đỏ suốt nhiều phiên trước — bản 1.3.1 vá **một** trong **hai** đường; đây là
đường còn lại. Vùng: `_code`.

### KHUNG-17 · Mục "đang chờ người chốt" của bản đồ việc CHỈ đọc sổ ý tưởng, không đọc sổ nợ

**Đo 05/09.** `npm run what-next` in ra:

```
C · ĐANG CHỜ NGƯỜI CHỐT — 0 mục, không ai làm thay được
  (không có)
```

Trong khi sổ nợ **đang có ít nhất hai mục cần người chốt**: KHUNG-11 (*bớt cái gì trong 998 dòng
vượt ngân sách*) và KHUNG-16 (*chọn một trong ba lối cho mã commit nhúng trong trang*).

Nguyên nhân ở `scripts/what-next.mjs:285` — `locChoNguoiChot(ideas, …)` lọc từ **`IDEAS.md`**,
không từ `BACKLOG.md`. Repo này không có `IDEAS.md`, nên mục C luôn rỗng.

**Vì sao nguy hiểm hơn một mục hiển thị thiếu:** dòng in ra là *"0 mục, không ai làm thay được"*
— tức nó **khẳng định đã kiểm và không có gì**. Chính công cụ này ở chỗ khác phân biệt rất kỹ
giữa *"0 vì đã kiểm"* và *"KHÔNG LỌC ĐƯỢC"*; ở đây nó nói vế thứ nhất trong khi thực tế là chưa
nhìn vào đúng sổ. Người chốt đọc bảng và tin rằng mình không có gì phải quyết.

Sửa được theo hai hướng, và cần chọn: (a) mục C đọc cả sổ nợ, nhận diện bằng một quy ước khai
tay trong mục nợ; hay (b) giữ nguyên phạm vi nhưng **đổi câu chữ** cho đúng — *"0 mục trong sổ ý
tưởng; mục nợ KHÔNG được lọc ở đây"*. Hướng (b) rẻ hơn nhiều và đã đủ chặn cái hại chính.
Vùng: `_code`.

### ~~KHUNG-18~~ · ĐÓNG 06/09 · Mã việc không nhận tiền tố có SỐ — repo tên chứa số vấp ngay

**Vấp thật 05/09, lượt migrate `n8n-orchestrator`.** Mã việc tự nhiên cho repo đó là `N8N-1`.
Bản đồ việc **bỏ qua im lặng** — `MA_VIEC = /^###\s+~*\s*([A-Z]+-\d+)~*.../` đòi tiền tố CHỈ
gồm chữ cái, nên `N8N` không khớp.

**Không có cảnh báo nào.** Mục nằm trong sổ, đúng định dạng `### <MÃ>-<số> · <tiêu đề>` theo mắt
người đọc, và biến mất khỏi bảng. Đây đúng cái mà quy ước sổ tự cảnh báo — *"sai quy ước một ký
tự là mục biến mất"* — nhưng ở đây người viết **không sai quy ước**: quy ước chưa bao giờ nói
tiền tố phải toàn chữ cái.

Phải lách bằng cách đổi mã sang `CP-`. Repo nào tên chứa số (n8n · s3 · web3 · i18n) đều vấp.

Hai lối: (a) nới regex cho phép chữ+số trong tiền tố — cẩn thận đừng để `## P1` lọt vào; hay
(b) giữ nguyên nhưng **nói rõ trong quy ước sổ** và cho lệnh **nêu tên mục bị bỏ qua** thay vì im
lặng. Lối (b) rẻ hơn và chữa đúng cái hại chính: im lặng. Vùng: `_code`.

### ~~KHUNG-19~~ · Cổng đóng cứng vị trí "Bản đồ file" ở AGENTS.md

**Vấp thật 05/09.** Repo `n8n-orchestrator` để Bản đồ file ở `design_brief.md` mục 8 — hợp lệ
theo luật của chính nó, và luật đó có trước bộ khung. Cổng đóng phiên **chỉ tìm trong
`AGENTS.md`**, nên đỏ cho tới khi phải thêm một mục thứ hai vào `AGENTS.md`.

Kết quả: repo đó nay có **hai** bản đồ file ở hai file khác nhau. Chạy được, nhưng là hai nguồn
cho một khái niệm — đúng bệnh mà cả bộ khung sinh ra để chữa, và lần này **bộ khung là thủ phạm**.

Sửa: cho repo khai nơi đặt bản đồ trong `.repo-structure.json` (ví dụ `docs.file_map`), mặc định
vẫn là `AGENTS.md`. Vùng: `_code`.

### ~~KHUNG-20~~ · `units.behaviour_globs` bị validator TỪ CHỐI, dù chú thích trong code dạy đúng trường đó

**Vấp thật 05/09, và đây là KHUNG-12 nặng hơn tưởng.** Khai `units.behaviour_globs` vào
`.repo-structure.json` thì `readStructureFromDisk` **ném lỗi**:
`CAU_TRUC_HONG: units.behaviour_globs — không phải trường hợp lệ. Hợp lệ: root_dir, marker, depth, ten`

Trong khi `build-dashboard.mjs:416` viết nguyên văn: *"Nên repo tự khai `units.behaviour_globs`"*.

Tức lớp "nghề nào đếm file nghề ấy" **không dùng được**: chú thích dạy một trường, bộ kiểm cấm
trường ấy, và không ai đối chiếu hai chỗ. KHUNG-12 nói lớp đó *chưa được truyền vào luồng thật*;
đo tiếp thì hoá ra nó còn **chưa khai được**.

**Hậu quả đang sống:** repo `n8n-orchestrator` là Python + YAML, phải gỡ khai báo để chạy tiếp,
nên cột "code đã đổi sau lần kiểm chứng" ở đó **mù với `tools/*.py` và `state/*.yaml`** — tức mù
với gần như toàn bộ repo. Làm cùng lượt với KHUNG-12. Vùng: `_code`.

### ~~KHUNG-21~~ · `claim.mjs` crash khi một khoá có giá trị `null`

**Vấp thật 05/09.** Bảng quyền khai `{"_root": null}` — cách viết tự nhiên cho "chưa ai giữ" —
làm `claim.mjs --list` **ném `TypeError: Cannot read properties of null (reading 'owner')`** và
chết ở dòng 143.

Khuôn đúng là object đủ năm trường, nhưng **không chỗ nào nói thế**, và lệnh không nói ra khi
gặp `null` — nó nổ. So với chính triết lý của bộ khung: đầu vào hỏng thì phải **nói rõ hỏng ở
đâu**, không phải rơi stack trace vào mặt người dùng. Vùng: `_code`.

### KHUNG-22 · Chưa ghim được "collectModel có truyền opts xuống không"

Lộ ra khi đột biến bản vá 1.3.3. Phép ghim F13 kiểm `behaviourOptsFrom()` trả đúng, và
`isBehaviourFile()` nhận đúng — nhưng **gỡ dòng truyền opts trong `collectModel` thì suite vẫn
XANH**. Tức vế "bộ sinh có thật sự dùng lớp đó không" chưa có ai canh.

Đây đúng hình dạng của KHUNG-12 vừa đóng: hàm đúng, không ai gọi, chú thích nói như thể đã dùng.
Ghim được vế này cần một bộ `deps` giả đầy đủ cho `collectModel` — chưa có helper nào trong
`tests/`, nên là một lượt riêng. Ghi ra thay vì để người sau tưởng F13 đã phủ. Vùng: `_code`.

### ~~KHUNG-23~~ · ĐÓNG 06/09 · `ALL_SKILL_MANAGEMENT` — audit tiền-migrate xong, CHƯA migrate

Trial ngày 05/09: đo bằng `npm run assess` (**mức 1/3**, 0/32 file khớp, không có
`package.json`) rồi giao Codex audit độc lập trên bản clone.

**Kết quả đáng giá nhất — bốn file trùng tên đang giữ 1824 dòng nội dung riêng:**
`AGENTS.md` (26 luật riêng) · `DASHBOARD.md` (viết tay, có mirror sang Google Sheet) ·
`decisions.md` (sổ chỉ-thêm) · `handoff.md` (**1225 dòng**). Thả đè là mất sạch. Đã thành **luật
cứng ở BƯỚC 0** của quy trình migrate.

Repo này còn có `authority_matrix.md` + `discussion_protocol.md` + `rounds/` — tức **đã có sẵn cơ
chế phân quyền và hiệp đồng nhiều AI trước khi bộ khung đến**. Đây là ca khó nhất trong ba repo
đã chạm: hai bộ luật hiệp đồng chồng nhau, không phải một bộ luật gặp một repo trống.

**Chưa migrate, cố ý.** Cần Đức chốt trước: gộp hai cơ chế hiệp đồng thế nào — giữ
`authority_matrix` làm chuẩn và bộ khung chỉ thêm khoá vùng, hay ngược lại. Cùng câu hỏi với
CP-1 ở repo n8n, nhưng nặng hơn vì repo này lấy chính việc điều phối AI làm nghề.

> **XONG 06/09 — đã migrate thật, cổng XANH TOÀN BỘ, đã đẩy.** Hồ sơ:
> [docs/migrations/2026-09-06-all-skill-management.md](docs/migrations/2026-09-06-all-skill-management.md).
> Bốn file trùng tên giữ **1824 dòng — không file nào bị đè**, kiểm bằng `--numstat` chứ không
> bằng mắt. Ba lỗi mới tìm ra: KHUNG-26, KHUNG-27, và ca `handoff.md`/`HANDOFF.md` cùng-một-file
> trên Windows (đã thành mục của quy trình migrate).
>
> **ĐÃ CHỐT 06/09 — Đức chọn: BỘ KHUNG THẮNG, bỏ luật cũ.** Luật đã viết thành một mục của
> [quy trình migrate](docs/protocols/CHUYEN-REPO-LEN-CHUAN.md), áp cho cả repo này lẫn `n8n`.
>
> **Còn treo là THI HÀNH, không phải quyết định.** Quyết định chốt *cơ chế nào là chuẩn*, nó
> KHÔNG phải giấy phép xoá file: `AGENTS.md` mục 2 hàng 1 vẫn nguyên, và BƯỚC 0 vẫn cấm đè bốn
> file đang giữ 1824 dòng. Đường đi: **khai tử luật cũ, giữ văn bản cũ** — dán một dòng "không
> còn hiệu lực từ 06/09" lên đầu `authority_matrix.md` và `discussion_protocol.md`. Mỗi lượt
> thi hành vẫn phải hỏi Đức riêng.

### ~~KHUNG-25~~ · ĐÓNG 06/09 · Sổ tay bảo trì bảo DỌN nhật ký, cổng đóng phiên CẤM — thử thật, cổng thắng

> **ĐÃ CHỐT 06/09 — Đức duyệt bản vá.** Cổng nay CHO xoá dòng khỏi `HANDOFF.md` **khi và chỉ khi**
> từng dòng bị xoá có bản khớp BYTE trong `*/archive/*`. Xoá mà không có bản lưu trữ khớp thì
> vẫn ĐỎ, và sửa dòng cũ tại chỗ cũng vẫn ĐỎ. Ghim ở `tests/cong-do-that.mjs` khối 9, **năm vế**.

**Đo thật 06/09, không phải suy luận.**

| Luật | Nói gì |
|---|---|
| `can-nang.mjs` + [sổ tay bảo trì](docs/BAO-TRI-DINH-KY.md) | nhật ký quá **600 dòng** thì **phải dời** phần cũ sang `docs/archive/` |
| `session-check.mjs`, hàm `coDongMoi` | `HANDOFF.md` phải **thêm > 0 dòng VÀ xoá = 0 dòng** |

Nhật ký đang **1.273 dòng**. Làm đúng luật thứ nhất là xoá 858 dòng, tức luật thứ hai chặn —
và chặn **vĩnh viễn**, không phải một lượt: mọi lượt sau vẫn thấy `xoa > 0` khi so với `origin/main`.

**Đã thử, không phải đoán:** cắt xuống 455 dòng → cổng ĐỎ ở mục *"HANDOFF đã ghi Log phiên này"*.
Ghi thêm một commit **chỉ-thêm** để cứu → **vẫn đỏ**, vì `coDongMoi` cộng dồn cả dải chưa đẩy
chứ không đọc riêng commit cuối. Đã hoàn nguyên, md5 khớp bản `fa7e8a7`.

**Vì sao cổng ĐÚNG, đừng vội gọi nó là bug.** Nó không đọc được ý định; nó thấy một commit xoá
858 dòng lịch sử của phiên khác. Đó chính là thứ nó sinh ra để chặn. Luật vàng 3 cấm gỡ bảo vệ
cho test xanh, và "gỡ điều kiện `xoa === 0`" chính là gỡ bảo vệ.

**Bản vá đề xuất — SIẾT chứ không nới.** Cho phép xoá **khi và chỉ khi** từng dòng bị xoá xuất
hiện **nguyên văn** trong một file dưới `docs/archive/` trong cùng lượt đẩy. Xoá mà không có bản
sao lưu trữ khớp byte thì **vẫn đỏ**. Tức cổng thôi giả định "không dời được", và bắt đầu **kiểm
chứng** luật *dời chỗ chứ không xoá* thay vì cấm cả hai.

Ca hỏng phải dựng nổi trước khi vá — ba vế, thiếu vế nào thì bản vá là đồ trang trí:
1. xoá 10 dòng, **không** có file lưu trữ → phải ĐỎ
2. xoá 10 dòng, có file lưu trữ nhưng **lệch một ký tự** → phải ĐỎ
3. xoá 10 dòng, có file lưu trữ **khớp byte** → XANH

**Không chốt thì hậu quả cụ thể:** nhật ký phình mãi. Nó là thứ **mọi phiên AI phải nạp**, ở
**mọi repo** dùng bộ khung — nên phí nhân theo (số repo × số phiên), khác hẳn tài liệu tra cứu
chỉ đọc khi cần. Hiện 1.310 dòng và chỉ có một chiều: tăng. Vùng: `_code` + luật.


### ~~KHUNG-26~~ · ĐÓNG 06/09 · Bộ khung ĐÓNG CỨNG tên `DASHBOARD.md` — repo nào đã có bảng viết tay đều phải nhường

**Vấp thật 06/09, lượt migrate `ALL_SKILL_MANAGEMENT`.** Repo đó có một bảng theo dõi **viết
tay 123 dòng**, có mirror sang Google Sheet, được `HANDOFF.md` · `decisions.md` ·
`03_templates/` trỏ tới. Chạy `npm run overview` một lần là **đè mất sạch**.

`DASHBOARD_FILE = "DASHBOARD.md"` là hằng số trong `build-dashboard.mjs`. Repo đích không khai
được tên khác, nên **repo phải đổi tên file của mình để nhường bộ sinh** — ngược chiều: bộ khung
là khách, nó đang bắt chủ nhà dọn phòng.

Đã lách bằng cách đổi tên bản viết tay sang `DASHBOARD-THU-CONG.md` (md5 không đổi), nhưng mọi
repo sau có `DASHBOARD.md` viết tay đều dính lại.

Ba tên còn lại cùng bệnh: `llms.txt` · `repo-map.json` · `HANDOFF.md`.

**ĐÃ VÁ 06/09, bản 1.3.11.** Khai `generated_names` trong `.repo-structure.json`:

```json
"generated_names": { "dashboard": "BANG-MAY-SINH.md", "llms": "cong-vao.txt", "repo_map": "ban-do.json" }
```

Khai thiếu khoá nào thì khoá đó dùng mặc định. Đầu vào sai bị **từ chối thẳng**, không lùi về
mặc định im lặng — gõ sai tên khoá, để dấu gạch chéo, hay khai hai artifact trùng tên đều đỏ.

Ghim ở `F17` (`tests/core-contract.mjs`): dựng một **repo git thật**, khai ba tên riêng, trồng
một file viết tay mang tên cũ, rồi đòi bộ sinh ghi đúng ba tên đã khai **và** file viết tay
không suy suyển. Vế đối chứng: repo không khai thì hành vi cũ y nguyên.

**Còn một việc nhỏ, không gấp:** `ALL_SKILL_MANAGEMENT` vẫn đang mang cách lách cũ
(`DASHBOARD-THU-CONG.md`). Nâng repo đó lên 1.3.11 rồi khai `generated_names` là trả được tên
`DASHBOARD.md` về cho bảng viết tay. Không ai bị chặn, nên chưa làm.

### ~~KHUNG-27~~ · ĐÓNG 06/09 · Bản trích KHÔNG mang `docs/LEGEND.md` và `docs/HUONG-DAN.md` — hai file repo mới cần nhất

**Vấp thật 06/09.** Viết bản đồ file cho repo đích, trỏ tới hai file đó vì repo nhà có. Kiểm lại
trước khi commit thì **cả hai không tồn tại** ở repo đích.

Đây là hình dạng lỗi đã đếm **lần thứ năm**: *luật trỏ tới một thứ không tồn tại*. `F12` ở
`tests/core-contract.mjs` canh đúng hình dạng này cho `AGENTS.md` của bản trích — nhưng nó
không canh được bản đồ file do người viết tay ở repo đích.

Trớ trêu ở chỗ hai file này là **thứ repo mới cần nhất**: `LEGEND.md` (47 dòng) là từ điển
thuật ngữ — gate · claim · lane · fail-closed; `HUONG-DAN.md` (148 dòng) là bản hướng dẫn cho
người mới và cho phiên AI mới. Repo vừa lắp bộ khung là lúc **cần nhất** hai thứ đó, và là lúc
duy nhất không có.

**ĐÃ VÁ 06/09, bản 1.3.11.** Cả hai vào `VERBATIM`. `LEGEND.md` chép **nguyên văn** (không có
gì riêng của repo nhà). `HUONG-DAN.md` qua một bộ lọc **cắt theo KHỐI, không theo dòng**: bỏ
một dòng lệnh mà để lại tiêu đề với bảng giải thích thì người đọc thấy một mục cụt, còn khó
hiểu hơn là không có mục nào. Ba thứ bị cắt: `npm run assess` · khoá vùng `_template` · câu tự
giới thiệu "bộ khung này".

Ghim ở `F18`, kèm vế đối chứng *"bộ lọc cắt quá tay"* — ba mục phải còn nguyên sau khi lọc.


### ~~KHUNG-28~~ · ĐÓNG 06/09 · `upgrade.mjs` CHỈ đẩy tầng máy — file tài liệu mới không bao giờ tới repo đã lắp

**Vấp thật 06/09, lượt nâng `ALL_SKILL_MANAGEMENT` từ 1.3.8 lên 1.3.11.**
`npm run upgrade -- --apply` mang **4 file `scripts/`** và cập nhật sổ ghim. Nó **không** mang
`docs/LEGEND.md` và `docs/HUONG-DAN.md` — hai file bản trích 1.3.11 vừa thêm. Phải chép tay.

**Hậu quả nếu để nguyên:** mọi repo đã lắp đóng băng ở tầng tài liệu tại thời điểm lắp. Bộ khung
thêm sổ tay mới bao nhiêu cũng chỉ tới **repo dựng mới**, không tới repo đang sống — mà repo
đang sống mới là chỗ cần sổ tay.

Nó không phải bug: `upgrade.mjs` sinh ra để **vá tầng máy an toàn** (từ chối ghi đè file đã sửa
tay). Tài liệu thì repo đích **được phép sửa** cho nghề của mình, nên ghi đè thẳng là sai.

**Ba lối, chọn một là quyết định kiến trúc:**
1. Chỉ mang file tài liệu **repo đích CHƯA CÓ** — file đã có thì kể tên, để người tự trộn.
2. Mang tất, nhưng file đã sửa tay thì ghi ra `<tên>.moi` cạnh bản cũ.
3. Không mang, nhưng **liệt kê** tài liệu bản trích có mà repo đích thiếu, kèm câu lệnh chép.

**ĐÃ VÁ 06/09, bản 1.3.13 — lối 1.** `upgrade.mjs` nay so thêm **tầng tài liệu**, in riêng, ba
trạng thái: `THIẾU` (mang sang) · `KHÁC` (**chỉ kể tên, không bao giờ ghi đè**) · `ĐÃ MỚI`.

In riêng chứ không trộn vào bảng tầng máy — hai tầng hai luật, trộn lại là mời người đọc tưởng
`KHÁC` ở tài liệu cũng sẽ bị ghi đè như `CŨ` ở máy.

Ghim ở `F19`. Đột biến kiểm bắt được **một phép kiểm trang trí của chính tôi**: vế đầu chỉ gọi hàm so
sánh, nên phá hẳn vòng ghi đi mà không gì đỏ. Phải thêm một vế chạy `--apply` THẬT trên repo thật.

### ~~KHUNG-29~~ · ĐÓNG 06/09 · Bộ sinh đọc cấu hình từ HEAD — khai `generated_names` rồi chạy ngay là ĐÈ MẤT

**Vấp thật 06/09, và vấp bởi chính người vừa vá KHUNG-26.**

Khai `generated_names` vào `.repo-structure.json` rồi chạy `npm run overview` **trước khi
commit**: bộ sinh đọc cấu hình **từ HEAD**, nên nó dùng cấu hình CŨ và ghi đè đúng cái file mà
`generated_names` sinh ra để bảo vệ. Md5 bảng viết tay đổi từ `0b41e4d3…` sang `673f36df…`.

Cứu được vì nội dung còn trong git. **Nhưng nếu file đó chưa từng được commit thì mất hẳn.**

Bộ sinh **có** cảnh báo — *"CẢNH BÁO THỨ TỰ: 3 file đầu vào đang sửa dở chưa commit"* — nhưng
nó **in ra SAU khi đã ghi**, và không kể tên `.repo-structure.json` là loại đặc biệt. Cảnh báo
sau khi mất là biên bản, không phải cảnh báo.

**Cách sửa:** thấy `.repo-structure.json` sửa dở mà **khối `generated_names` khác với bản ở
HEAD** thì **DỪNG TRƯỚC KHI GHI**, mã thoát khác 0, nói rõ "commit cấu hình trước". Chỉ chặn
đúng khối đó — sửa dở phần khác của cấu hình không đáng chặn cả lượt sinh.

**ĐÃ VÁ 06/09, bản 1.3.13.** Bộ sinh dừng với mã thoát **2** và **không ghi một byte nào**, kèm
thông báo nói rõ HEAD định ghi vào đâu và đĩa định ghi vào đâu. Đo thật ở repo nhà: md5 của
`DASHBOARD.md` không đổi, không file mới nào được tạo.

Chỉ chặn đúng khối `generated_names`. Đọc đĩa là một **ngoại lệ hẹp** (`readDia`), dùng đúng MỘT chỗ —
`F19` đếm số lần gọi để lời hứa *"trang suy ra từ HEAD"* không bị nới dần.

Đột biến kiểm cũng bắt được một phép kiểm **vô hiệu**: vế kiểm thứ tự dò chuỗi `tenMaySinhLech(deps)`,
mà chính dòng **khai báo hàm** cũng chứa chuỗi đó và luôn nằm trước — nên nó LUÔN xanh dù có đổi chỗ hay
không. Đã đổi sang dò **chỗ gọi**.


### KHUNG-30 · `Project 3 AI Agent Unify` chưa nâng được — luật của CHÍNH REPO ĐÓ chặn

> **CHỜ NGƯỜI CHỐT:** nhánh đang lệch `origin/main` **5 sau / 48 trước**. Nâng bộ khung trên một
> nhánh lệch xa như thế là quyết định của Đức, không phải của AI.

**Đo 06/09, và đây là lượt giao việc cho Codex CLI đầu tiên có kết quả dùng được.**

Codex đọc đề bài [NANG-BO-KHUNG.md](briefs/NANG-BO-KHUNG.md), rồi **DỪNG** với đúng mẫu báo cáo
năm dòng. Hai lý do nó nêu, **tôi đã kiểm chứng độc lập, cả hai ĐÚNG**:

| Codex nói | Đo lại |
|---|---|
| nhánh lệch `origin/main` 48/5 commit | `git rev-list --left-right --count` → **5 / 48**. Đúng |
| repo có luật *"Cloud Sync Hold"* bắt dừng | `AGENTS.md` mục **8A** của repo đó. Có thật |

Luật 8A nói: *trước khi ghi bất kỳ file local nào, phải `git fetch origin main` và kiểm tra
Local có đang sau `origin/main` không*. Local đang sau **5 commit**, nên luật bắt dừng.

**Đây KHÔNG phải lỗi của bộ khung, cũng không phải lỗi của Codex.** Nó là hai bộ luật gặp nhau
và bộ luật của chủ nhà thắng — đúng như phải thế. Cái đáng ghi là **Codex đã đọc luật của repo
đích và tuân**, chứ không cắm đầu chạy đề bài.

**Ba lối, cần Đức chọn:**
1. Nâng trên nhánh `main` thay vì nhánh tính năng — sạch nhất, nhưng nhánh tính năng vẫn phải
   nâng riêng khi merge.
2. `git pull` 5 commit của cloud xuống trước theo đúng luật 8A, rồi nâng.
3. Hoãn — repo đó đang có việc dở của phiên khác (3 file), nâng sau khi việc đó xong.

**Kèm một giới hạn kỹ thuật đo được:** `codex exec -s workspace-write` **không chạy được
`git fetch`** — sandbox từ chối ghi `.git/FETCH_HEAD`. Nghĩa là mọi việc giao cho Codex mà cần
đọc trạng thái nhánh xa đều phải `git fetch` **trước** rồi mới giao. Ghi vào đề bài.


### KHUNG-31 · Báo cáo năm dòng của phiên nhận việc là LỜI TỰ KHAI, không ai kiểm

**Hình dạng:** cùng hình dạng với KHUNG-6 (danh tính phiên là thứ tự khai).

`npm run giao-viec` nay đo repo đích rất kỹ **trước** khi giao. Nhưng sau khi giao thì không có
gì cả: phiên nhận việc trả về năm dòng `REPO / VIỆC / MÁY / CỔNG / CÒN MỞ`, và **cả năm dòng
đều là lời phiên đó tự khai**. Trial 05/09 đã cho thấy chuyện này không lý thuyết — một phiên
audit báo ba lệnh thoát mã `2/1/1`, đo lại thì cả ba exit 0.

Luật vàng số 4 bảo phải tự kiểm chứng lại. Nhưng "phải tự kiểm chứng" là một câu chữ, và câu
chữ thì lần thứ ba có người bỏ qua — đúng lý do `giao-viec.mjs` được viết ra.

**Lối đi có thể:** một lệnh `nghiem-thu` chạy ở repo nhà, trỏ vào repo đích, tự đo lại đúng năm
con số ấy rồi in bảng `KHAI / ĐO ĐƯỢC / KHỚP?`. Nó đọc được `git log` của repo đích để biết
phiên kia đã commit gì, chạy lại `npm test` và cổng, và so với những gì phiên kia khai.

**Chưa làm vì:** mới có đúng MỘT lượt giao thật. Luật mục 8 bảo chưa có chuyện xảy ra thật thì
đừng thêm — mà chuyện *đã* xảy ra một lần (mã thoát khai sai) là ở lượt **audit**, không phải
lượt giao qua đề bài mới này. Đợi thêm hai ba lượt nữa rồi hẵng quyết hình dạng của lệnh.

### KHUNG-24 · Bảng có tab "Đã xong", nhưng chỉ đọc sổ nợ của repo NHÀ

Tab mới (05/09) chiếu mục nợ đã gạch mã — 7 việc. Nhưng nó chỉ đọc `BACKLOG.md` ở gốc; repo có
đơn vị con, mỗi đơn vị một sổ nợ, thì các mục đã đóng ở đơn vị con **không hiện**. Chưa đau ở
repo nhà (không có đơn vị con), sẽ đau ở repo dùng `units.root_dir`. Vùng: `_code`.
