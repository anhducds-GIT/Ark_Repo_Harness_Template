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

### KHUNG-47 · Suite ĐỘT BIẾN ghi thẳng vào file ĐÃ COMMIT của cây làm việc chính

**Không phải giả định — đã làm hỏng một commit thật hôm nay (08/09).** `tests/upgrade-smoke.mjs`
khối 14 ghi `"1".repeat(16)` đè lên một dòng của `RELEASE-LEDGER.json` **THẬT ở gốc repo**, chạy
ba lệnh để đòi chúng DỪNG, rồi khôi phục trong `finally`. Đúng thiết kế, và đó là một phép ghim
tốt — ở một repo MỘT lane.

Repo này có nhiều lane dùng **chung một cây làm việc**. Trong đúng cửa sổ vài giây đó, lane
`harness-loi-01` chạy `git add RELEASE-LEDGER.json` và **commit c385f4c mang theo dòng hỏng**:
`"1.2.10": "1111111111111111"` thay cho `946065fa2778e0e4`. Sổ phát hành là sổ **CHỈ THÊM** — một
dòng đã phát bị đổi là **nói dối về một bản đã phát**, đúng thứ chính khối 14 sinh ra để chặn.

**Vì sao không ai đỏ:** `finally` khôi phục kịp, nên cây làm việc sạch lại ngay và mọi phép kiểm
sau đó xanh. Chỉ lộ ra vì lượt sau `git status` báo `RELEASE-LEDGER.json` sửa dở — mà nội dung
"sửa dở" chính là bản ĐÚNG. Nhìn ngược.

**Cùng họ với ba file `.gitignore` của `bang-song/`**: thứ nào một tiến trình ghi đè liên tục thì
không được nằm ở chỗ lane khác đang `git add`. Khác ở chỗ đây là file **phải** commit.

Ứng viên rẻ nhất: khối 14 chép cả repo sang thư mục tạm rồi phá bản chép (đắt), hoặc `build-template.mjs`
và `upgrade.mjs` nhận cờ trỏ sang một sổ khác để đột biến không cần đụng file thật.

Vùng: `_code`.

**đóng khi:** chạy `node tests/upgrade-smoke.mjs` trong khi một tiến trình khác đọc
`RELEASE-LEDGER.json` mỗi 50ms, và tiến trình đó **không lần nào** đọc được giá trị `1111111111111111`
— đo bằng một ca dựng sẵn, không suy ra.


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

> `@Đức:bấm` — mở một phiên AI mới ở một repo đã migrate, KHÔNG nhắc gì, và xem nó có tự làm trọn một việc nhỏ tới lúc cổng xanh không. Chừng 15 phút. Không tự động hoá được: cả giá trị của phép thử nằm ở chỗ không ai mớm.

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

> `@Đức:chốt` — chọn một: (a) chỉ GHI RÕ giới hạn vào sổ tay, hay (b) siết thật bằng chữ ký. Hai lối khác hẳn nhau về quy mô.

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

> `@Đức:chốt` — chọn một: (a) gọt thật và chấp nhận mất nội dung, hay (b) đặt lại ngân sách theo SỐ ĐO hôm nay cộng biên. Nới ngân sách là nới một luật an toàn, mục 2 hàng 6 bắt hỏi.

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

### ~~KHUNG-17~~ · ĐÓNG 06/09 · Mục "đang chờ người chốt" của bản đồ việc CHỈ đọc sổ ý tưởng, không đọc sổ nợ

> **ĐÓNG 06/09 — đã vá từ trước, sổ chỉ chưa gạch mã.** Đo lại `scripts/what-next.mjs` hôm nay:
> `CHO_CHOT` (dòng 77) bắt chuỗi `**CHỜ NGƯỜI CHỐT:**` trong thân mục sổ nợ · `hienTai.choChot`
> (dòng 105) ghim nó vào mục · `tuSoNo` (dòng 333) lọc ra · và dòng 338 in riêng trạng thái
> **KHÔNG LỌC ĐƯỢC TRỌN VẸN** kèm con số từng nguồn, thay vì gộp im lặng.
>
> **Bài học đáng ghi hơn cả bản vá:** mục này nằm mở trong sổ suốt sau khi việc đã xong, nên nó
> vẫn chiếm một chỗ trong "12 mục còn mở" và mọi phiên đọc bảng đều tưởng còn nợ. **Vá xong mà
> không gạch mã thì sổ nợ nói dối theo chiều ngược lại** — báo thừa. Cùng ngày cũng tìm thấy
> `STATUS.md` đang trỏ `next_step` vào `KHUNG-13` đã đóng: cùng một hình dạng lỗi, hai chỗ.

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

> **CHỜ NGƯỜI CHỐT:** `@Đức:chốt` — nhánh đang lệch `origin/main` **5 sau / 48 trước**. Nâng bộ khung trên một
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

### ~~KHUNG-32~~ · ĐÓNG 06/09 · Bảng quyền không thấy được "khoá đang giữ mà repo chưa thấy dấu vết"

Đo 06/09 ở repo tiêu thụ: một lane giữ **ba** khoá **14 phút** với **0 commit, 0 file sửa** trong
cả ba vùng, và một phiên khác phải đứng chờ. Không cơ chế nào hiện chuyện đó ra — người điều phối
phải tự chạy `git` để đo rồi mới biết.

**Ca đó về sau hoá ra là DƯƠNG GIẢ:** lane ấy đang làm thật, ở một thư mục **ngoài repo**, và chỉ
định ghi vào repo ở bước cuối. Phiên điều phối tin con số, nhả khoá hộ, lane mất phần đã xong. Nên
tín hiệu phải mang đúng tên **"repo chưa thấy dấu vết"** — không được rút gọn thành "rảnh".

Việc: hiện tín hiệu ở ba chỗ (`claim.mjs --list` · khối "Đang làm gì" trên bảng · cổng đóng phiên),
**VÀNG không ĐỎ**, và **cấm máy tự nhả khoá của lane khác**. Kèm sửa luật nhận khoá: *nhận ngay
TRƯỚC lượt ghi đầu*, *một lane một khoá gói*. Nền cần trước: kéo `ageHours`/`ageLabel` từ repo tiêu
thụ về. Đây là **cơ chế đa phiên → đột biến kiểm bắt buộc**. Vùng: `_code` + `_root`.
Xem [bản đồ hoà giải](docs/HOA-GIAI-BO-KHUNG-VS-TIEU-THU.md) §2.

### ~~KHUNG-33~~ · ĐÓNG 07/09 · Trả khoá khi còn commit chưa đẩy để lại commit vô chủ

Repo tiêu thụ có `canDayTruocKhiTra` (từ chối trả khoá khi còn commit chưa đẩy) **cộng** cửa thoát
`--du-biet` (trả kèm lý do). Bộ khung không có vế nào.

Hai vế phải vào **cùng một lượt**: chỉ lấy vế chặn thì một lane bị cổng xuất bản chặn đẩy sẽ kẹt
khoá vĩnh viễn — đúng nguyên nhân ② mà bản giao việc dặn **đừng đụng**. Chỉ lấy cửa thoát thì
không chặn được gì. Vùng: `_code`.

### ~~KHUNG-34~~ · ĐÓNG 07/09 · Tám cái bẫy đo được 06/09 — đã phân loại

**Kết quả: nhận 2, bác 5, một cái đã có sẵn.** (Bẫy 2 suýt thành cái thứ ba được nhận — xem dòng của nó.) Mỗi dòng dưới đây trả lời câu hỏi của luật mục 8 —
*đã xảy ra thật ở repo NÀY chưa* — bằng một phép đo, không bằng cảm giác.

| # | Bẫy | Đo ở repo này | Quyết |
|---|---|---|---|
| 1 | mỏ neo khớp 0 chỗ mà báo như đã kiểm | **CÓ, ngay lượt này** — nhưng ở công cụ sửa file của phiên AI, không ở script của repo | **nhận, dạng nhẹ**: luật đã có sẵn ở mục 3 luật vàng 2 (*fixture phải dựng nổi ca hỏng*). Không thêm phép kiểm máy: không dựng nổi ca hỏng cho hành vi của một phiên AI |
| 2 | mỏ neo `
` gặp file CRLF | **CÓ, và tôi đo SAI hai lần trước khi đo đúng** — xem ghi chú dưới bảng | **NHẬN.** `*.cmd text eol=crlf` + ghim đọc byte thật ở `tests/bang-song.mjs` vế 11 |
| 3 | `git commit -o` không chặn cuốn sửa đổi cùng file | **chưa** — 0 chỗ dùng trong cả repo | **bác** |
| 4 | byte NUL làm diff biến mất | **chưa** — quét 133 file được track, **0 file** có byte NUL | **bác** |
| 5 | trạng thái ADR khai hai chỗ | **chưa** — cả 6 ADR khai đúng MỘT chỗ (frontmatter), thân bài 0 chỗ | **bác** |
| 6 | trả khoá kèm lý do để lại cổng đỏ | **vừa thành live lượt này** — `--du-biet` là của `KHUNG-33` | **nhận** → `KHUNG-38` |
| 7 | bộ đếm gộp mù khi nội dung dời sang lưu trữ | **đã giải sẵn** — `can-nang.mjs` có `THU_MUC_LUU_TRU`, `session-check.mjs` có `LA_LUU_TRU` | **không cần làm gì** |
| 8 | bộ sinh lấy tiêu đề từ tên thư mục nên sai trong worktree | **chưa** — 0 chỗ dùng `basename(ROOT)`; tên suy từ `.repo-structure.json` | **bác** |

**Bẫy số 2 — ba lượt đo, hai lượt sai, và lượt sai thứ hai nguy hiểm hơn lượt đầu.**

1. Thêm `*.cmd text eol=crlf` theo **linh cảm**. Không số đo. (Kết luận đúng, lý do rỗng.)
2. Viết một file `.cmd` **ngắn** thuần LF, chạy, thấy đúng → kết luận *"LF chạy được"* và **gỡ
   luật đi**, kèm một đoạn giải thích tự tin trong `.gitattributes`. **Fixture quá đơn giản để
   dựng nổi ca hỏng** — luật vàng 2, đúng chữ. Lượt này tệ hơn lượt 1: lượt 1 chỉ thiếu bằng
   chứng, lượt 2 **tạo ra bằng chứng giả** rồi viết nó vào repo cho phiên sau đọc.
3. Đức bảo *chạy file cmd đi*. Giao Codex chạy thật → `'tlocal' is not recognized`. Kiểm chứng
   độc lập bằng cách chạy CHÍNH `Bat-tu-chay.cmd` ở hai dạng, cùng nội dung:

   | | kết quả |
   |---|---|
   | LF | `'cp' is not recognized` · `'tlocal' is not recognized` · **mã thoát 1**, không tạo được gì |
   | CRLF | chạy đúng · **mã thoát 0** |

   `cmd.exe` nhảy theo **độ dời byte** và giả định CRLF, nên với LF nó rơi vào giữa một từ. **File
   càng dài càng lệch** — nên một file thử ngắn không bao giờ bắt được.

**Năm cái bị bác đều là bẫy THẬT ở repo tiêu thụ.** Bác không phải vì chúng vô lý, mà vì luật mục
8 hỏi *"đã xảy ra thật chưa"* — và ở đây câu trả lời đo được là chưa. Chép chúng sang là nhập năm
cơ chế mà không nhập lý do tồn tại của chúng, rồi phiên sau đọc không hiểu vì sao có và gỡ đi.

### ~~KHUNG-38~~ · ĐÓNG 07/09 · `--du-biet` để lại commit mồ côi — **giả thuyết ban đầu SAI, chỗ hỏng thật nằm chỗ khác**

**Điều mục này viết ra hôm trước là sai, và đó là phần đáng đọc nhất.**

Giả thuyết: sau `--release --du-biet`, cổng ĐÓNG PHIÊN của lane kế đỏ với *"vùng bị sửa nhưng chưa
ai đứng tên"*. Đo 07/09 trong một kho dựng riêng — lane A nhận `_docs`, commit, không đẩy, trả khoá
kèm `--du-biet`, rồi lane B chạy cổng:

| Phép kiểm | Đo được |
|---|---|
| Phạm vi trách nhiệm | **XANH** — nó đọc file sửa dở trên ĐĨA, không đọc commit chưa đẩy |
| hai chỗ đỏ khác | **nhiễu của kho thử** — đối chứng (lane A đẩy đàng hoàng rồi trả) ra **y hệt** |

Không có đối chứng thì hai chỗ đỏ kia đã bị đọc thành bằng chứng cho giả thuyết. Chúng xuất hiện
dù có `--du-biet` hay không.

**Chỗ hỏng THẬT nằm ở cổng XUẤT BẢN, và nặng hơn giả thuyết:** `safe-push` từ chối lane kế vì nó
cuốn theo commit của lane đã đi, và câu nó in ra là *"chờ phiên đó tự push"* — **bảo người ta chờ
một việc không bao giờ xảy ra**, vì lane đó trả khoá rồi. Không ai đi hỏi Đức, vì câu kia bảo chỉ
cần đợi. Repo kẹt im lặng, và kẹt với **mọi** lane sau, không chỉ lane kế.

**Vá:** đổi một câu SAI thành một câu ĐÚNG, ở cả hai đầu — `claim.mjs` nói ra cái giá **ngay lúc
trả khoá**, `safe-push` đọc `tra_khi_chua_day` và nói thẳng *"lane đó đã đi, đừng chờ"* kèm lý do
lane kia khai. **KHÔNG tự cho qua**: `--carry` vẫn phải hỏi Đức (mục 2 hàng 2). Ghim ở
`tests/khoa-dau-vet.mjs` vế 11, hai đột biến đã chạy — trong đó một vế ghim thẳng rằng lượt sửa
câu chữ này **không được biến thành tự cấp phép**.

**Bài học chung, và nó lặp lại lần thứ ba trong hai ngày:** *một giả thuyết chưa đo không đáng tin
hơn vì nó nghe hợp lý.* Nếu tôi vá theo giả thuyết ban đầu thì đã hạ mức một phép kiểm đang XANH,
và để nguyên chỗ hỏng thật.


Tám thứ cắn repo tiêu thụ trong MỘT ngày: mỏ neo khớp 0 chỗ mà báo như đã kiểm · mỏ neo `\n` gặp
file CRLF · `git commit -o` không chặn được cuốn sửa đổi cùng file · byte NUL làm diff biến mất (5
lần) · trạng thái ADR khai hai chỗ · trả khoá kèm lý do để lại cổng đỏ · bộ đếm gộp mù khi nội dung
dời sang lưu trữ · bộ sinh lấy tiêu đề từ tên thư mục nên sai trong worktree.

Chưa nhận cái nào. Luật mục 8 đòi từng cái phải trả lời: đã xảy ra thật ở **repo này** chưa, thay
chỗ cái nào, dựng nổi ca hỏng không. Vùng: `_docs` trước, `_code` sau.

### ~~KHUNG-35~~ · ĐÓNG 06/09 · Tab Migrate viết dài, không đọc ra được "đang ở bước nào"

Đức 06/09: *"mỗi khi tôi check status migrate, tôi sẽ thấy milestone lớn đang ở bước nào, các
feature đã migrate thế nào, đã go live thế nào, trải qua các bước audit ra sao. Nếu dừng lại bước
nào tôi sẽ continue"*. Tab hiện chiếu gần trọn thân hồ sơ — tốn usage của AI và tốn thời gian của
Đức mà vẫn không trả lời được câu trên.

Việc: tab Migrate thành **bảng mốc + danh sách kiểm**, thân hồ sơ gập lại sau `<details>`. Kèm bỏ
trang `SO-MIGRATE-*.html` đứng riêng (Đức chốt: chỉ nuôi tab). Vùng: `_code` + `_root`.

### ~~KHUNG-36~~ · ĐÓNG 07/09 · Ba hồ sơ migrate cũ không khai hai mốc sau — Đức chốt cho khai lại

Bảng mốc mới (1.3.21) chiếu ba mốc: *migrate · audit · AI onboard*. Chỉ mốc đầu suy được (từ
`muc_sau`); hai mốc sau **không có trường nào tương đương** trong ba hồ sơ đã ghi, nên hai cột
hiện `·` (chưa khai) cho cả ba lượt.

Bảng nói đúng — nhưng nó chỉ hữu ích khi có dữ liệu. Lối ra là **thêm** ba trường
(`viec_audit` · `viec_assistant` · `viec_ke`) vào frontmatter ba hồ sơ cũ, lấy từ chính thân bài
của chúng. Chưa tự làm: luật cấm sửa hồ sơ cũ, và dù đây chỉ là *khai lại điều hồ sơ đã viết*
thì ranh giới đó do Đức vạch, không do AI. Vùng: `_docs`.

### KHUNG-37 · Tiến trình nền của phiên đã kết thúc KHÔNG ai dọn — đo được 5 thế hệ còn sống @Đức:bấm

Đức thấy trước, 06/09: *"tôi thấy có task chạy ngầm đã 14 tiếng, phải có protocol tắt những fake
task ko còn tác dụng chứ nhỉ?"* Đo lại ngay lúc đó, đếm tiến trình `node.exe` theo tuổi:

| Tuổi | Là gì |
|---|---|
| **32.9h** | MCP server + npm bọc ngoài — phiên sinh ra chúng đã chết từ hôm kia |
| **15.9h** | thế hệ thứ hai — chính là "14 tiếng" Đức nhìn thấy |
| 2.2h · 1.9h · 0.9h | ba thế hệ nữa |

Mỗi lần mở phiên đẻ ra một bộ MCP server; phiên đóng thì **không ai giết chúng**. Chúng không
làm gì, nhưng chúng ăn RAM và — nặng hơn — chúng làm mọi bảng tiến trình **trông như đang bận**,
nên lần sau có một tiến trình treo THẬT thì không ai phân biệt nổi.

Đây **không phải nợ của repo này**: tiến trình nằm ở tầng máy, một trong số đó là cầu nối của
repo khác (`Chrome Extension Bridge`, 32.9h). Nên việc cần là một **protocol**, không phải một
bản vá: (a) một lệnh đo *"tiến trình nào thuộc phiên đã chết"*; (b) luật ai được giết, khi nào.

**Chưa tự giết cái nào** — giết tiến trình của phiên khác là việc không lùi lại được và chạm tới
việc người khác, đúng hai nhánh bắt phải hỏi. Lệnh đo đã ghi ở [docs/BAO-TRI-DINH-KY.md](docs/BAO-TRI-DINH-KY.md).
Vùng: `_docs`.

### KHUNG-39 · `.gitignore` và `.gitattributes` nằm trong bản trích mà KHÔNG tầng nào phát

**Đo 07/09** — quét bản trích rồi hỏi mỗi file thuộc tầng nào:

```
node -e "... buildTemplateFiles() vs fileMay() vs fileTaiLieu() ..."
→ KHÔNG THUỘC TẦNG NÀO: .gitignore  .gitattributes  (và 14 file repo đích tự sở hữu)
```

14 file kia **đúng** là của repo đích (`AGENTS.md` · `HANDOFF.md` · `.repo-structure.json`…).
Hai file này thì khác: chúng là **cấu hình repo mà bộ khung có lý do kỹ thuật để mang**.

| File | Thiếu nó thì hỏng ra sao |
|---|---|
| `.gitattributes` | máy Windows tự đổi xuống dòng lúc lấy file ra, một commit có hai dạng byte, và `git status` nói SẠCH ở cả hai — đo thật ở repo nhà: cùng một cây làm việc, 75 file LF và 21 file CRLF |
| `.gitignore` | repo nhận `bang-song/` sẽ **bẩn cây làm việc** ngay lần đầu ai nhấp đúp `Xem-bang.cmd`, và cổng đóng phiên của MỌI lane ở đó kêu về ba file không ai commit được |

**Luật đúng gần như chắc chắn là luật của tầng tài liệu:** THIẾU thì mang sang · **CÓ rồi thì
CHỈ kể tên**, không bao giờ trộn. Ghép hai `.gitignore` bằng máy là việc dễ hỏng im lặng — một
dòng `!` phủ định của repo đích gặp một dòng của bộ khung thì kết quả không ai đoán được.

**Vá tay 07/09 cho hai repo đã nhận `bang-song/`** (`ALL_SKILL_MANAGEMENT` ·
`nav_platform_main`): thêm ba dòng vào `.gitignore` của chính chúng. Đó là **vá điểm**, không
phải cơ chế — repo thứ ba nhận `bang-song/` sẽ vấp lại đúng chỗ này.

**ĐÃ ĐO 07/09, và số đo đổi hình việc:** cả **3/3** repo đã lắp **đều đã có** `.gitignore` và
`.gitattributes` của riêng chúng (`ALL_SKILL_MANAGEMENT` 11 dòng · `nav_platform_main` 78 dòng ·
`Project 3 AI Agent Unify` có cả hai). Nghĩa là vế `THIẾU thì mang` gần như **không bao giờ chạy**
ở thực tế, và toàn bộ việc nằm ở vế `KHÁC` — tức chỉ kể tên. Nên bản vá đúng có lẽ **nhỏ hơn**
dự tính: chỉ cần `--plan` **KỂ TÊN** hai file này khi chúng khác bản trích, kèm một câu nói rõ
điều gì hỏng nếu thiếu dòng nào (bảng dưới), rồi **để người quyết**. Ghép bằng máy thì đừng.


### KHUNG-40 · Bảy giới hạn Đức chốt 07/09 — cái nào phổ quát, cái nào riêng repo tiêu thụ @Đức:chốt

> **CHỜ NGƯỜI CHỐT:** con số của từng trần phải do Đức đặt, không do AI đặt cho vừa hiện trạng.
> `AGENTS.md` mục 2 hàng 6 bắt hỏi — đặt hay nới một ngân sách là đổi luật an toàn.

**Nguồn.** Repo tiêu thụ `Chrome_Extension_AI_Agentic` được đo 07/09, và Đức đọc số rồi nói
nguyên văn: *"thời gian để maintain dashboard và debug hệ thống chiếm phần lớn tài nguyên và
thời gian, không add value nào cả."* Bảy giới hạn là câu trả lời của Đức cho repo ĐÓ. Việc ở đây
là quyết cái nào phổ quát (vào bộ khung) và cái nào chỉ đúng ở đó.

**ĐO Ở BỘ KHUNG, 2026-09-07** — số dưới đây là của repo NÀY, không phải của repo tiêu thụ:

| # | Đo gì | Bộ khung | Ghi chú |
|---|---|---|---|
| ① | commit 7 ngày **chỉ chạm giấy tờ** | **194/280 = 69%** | 31% có chạm máy hoặc bản trích |
| ② | luật-là-chữ | **1.254 dòng** (2.097 kể cả bản trích) | `AGENTS.md` 235 + 4 protocol 1.019 |
| ③ | chốt máy cưỡng chế được | **26** (11 cổng đóng phiên + 15 cấu trúc) · 16 file test | |
| ④ | tài liệu | **8.672 dòng** (12.329 kể cả bản trích + lưu trữ) | trần đang khai 2.200 → **vượt 3,9×** |
| ⑤ | sổ nợ đang mở | **15** mục / 39 tổng | 62% quyển sổ là việc đã đóng |

**Tỉ lệ luật/chốt: 1.254 ÷ 26 = 48 dòng văn cho mỗi cơ chế thật.** Repo tiêu thụ là 71. Cùng một
hình dạng bệnh, nhẹ hơn — nhưng 69% commit chỉ chạm giấy tờ thì bộ khung **không được miễn**.

**Bảy giới hạn, và đánh giá phổ quát/riêng:**

| # | Giới hạn | Phổ quát? | Vì sao |
|---|---|---|---|
| ① | một đơn vị SỐNG một lúc | **chưa rõ** | bộ khung chỉ có 1 đơn vị nên nó không tự kiểm được vế này — đúng cái bẫy *"thứ gì repo nhà không dùng thì repo nhà không kiểm được"* |
| ② | cấm cài một tính năng hai lần | **có** | và đã cắn thật ở đây: bản đồ file vẽ **3 lần** trên một tab, xem ADR-0006 |
| ③ | tài liệu ≤ trần khai ở cấu hình | **ĐÃ CÓ** | `tongTaiLieu: 2200` — nhưng đang vượt 3,9× và **không cổng nào chặn** |
| ④ | sổ nợ hạ tầng ≤ 10 mục | **có** | ở đây 15 mục; trần này ép CHỌN, không ép dọn |
| ⑤ | test bắt 0 đột biến thì XOÁ | **có, và là phép cắt AN TOÀN NHẤT** | vì nó **đo được**. Chưa lượt nào chạy phép này trên 16 file test của bộ khung |
| ⑥ | tối đa 2 phiên song song | **riêng** | bộ khung có 4 khoá và chưa lần nào chạy quá 2 lane; trần này chưa nổ ở đây |
| ⑦ | một luật vào một luật ra | **KHÔNG thi hành được ở dạng này** | xem dưới |

**Vì sao ⑦ phải đổi hình dạng.** *"Một luật"* không đếm được — một gạch đầu dòng là một luật? một
câu? một đoạn? Không trả lời được thì không máy nào kiểm được, nên nó là **lời hứa**. Và
`AGENTS.md` mục 7 có đúng câu *"luật nào không kiểm được bằng máy thì sớm muộn cũng bị bỏ qua"* —
tức mục 8 hiện tại **tự vi phạm nguyên tắc gốc của chính nó**.

Đổi thành **TRẦN SỐ DÒNG cho file luật, cổng đóng phiên ĐỎ khi vượt**. Lúc file đã sát trần, muốn
thêm 10 dòng luật thì buộc phải xoá 10 dòng khác — *"một vào một ra"* thành **tự động**, không cần
ai tự nguyện. Và Đức kiểm được bằng một lệnh, một con số.

**Lỗ của cách này, ghi rõ chứ không giấu:** trần dòng đo **độ dày**, không đo **chất lượng**. Một
AI muốn lách sẽ cô đặc luật thành câu khó hiểu để vừa trần — mà luật khó hiểu thì **tệ hơn** luật
dài. Chưa có cách nào máy chặn chuyện đó.

**Cần Đức chốt đúng hai điều:**

1. Trần cho `AGENTS.md` + `docs/protocols/` là bao nhiêu. Đặt **bằng số đo sau khi cắt** thì cửa
   hẹp thật; đặt kèm biên rộng thì nó vô hại. Số hôm nay: **1.254**.
2. Có đưa trần đó vào **cổng đóng phiên** không. `can-nang` hiện **cố ý nằm ngoài** cổng (nhịp
   tháng), nên mọi trần hiện tại **chưa từng chặn được gì** — kể cả cái đang vượt 3,9×.

**Việc kế, KHÔNG cần Đức:** chạy phép ⑤ trên 16 file test — mỗi file, phá một chốt nó canh, xem nó
có đỏ. File bắt 0/n thì xoá kèm con số. Đây là phép cắt duy nhất trong bảy cái **tự chứng minh
được**, không cần ai chốt.

### KHUNG-41 · Bộ khung không có chỗ nào nói "DỪNG" — gốc bệnh, chưa vá

**Chẩn đoán từ repo tiêu thụ 07/09, và nó là chẩn đoán về CÔNG SUẤT, không về hành vi sai.**

Việc sản phẩm bị chặn ở tay người: bấm nút trên trình duyệt, chạy thử, chốt phạm vi. Công suất AI
thì gần như vô hạn. Nên khi hết việc-không-cần-người, AI **không dừng** — nó tìm việc, và việc
duy nhất còn lại là **sửa chính cái nhà máy**.

*Không phải AI làm sai việc. Là AI hết việc đúng rồi tự tìm việc.*

Số đo ở bộ khung: **69% commit 7 ngày chỉ chạm giấy tờ**. Ở repo tiêu thụ, tỉ lệ chạm mã sản phẩm
là **9%**, và **không ai thấy** cho tới khi Đức tự cảm nhận rồi hỏi.

**Cần một luật ngắn, đi ngược bản năng của mọi AI:** hết việc sản phẩm thì **DỪNG** và báo người
chủ cần làm gì. Không lấp chỗ trống bằng việc hạ tầng. Vùng trống ≠ phải dùng.

**Kèm một cách đo, để nó không thành một luật-là-chữ nữa:** tỉ lệ commit chạm sản phẩm; tụt dưới
ngưỡng thì **bảng phải nói ra**, không để người chủ tự đoán.

**Chỗ khó thật, phải giải TRƯỚC khi viết luật:** ở repo bộ khung, *"sản phẩm"* CHÍNH LÀ hạ tầng —
`scripts/` và `template/` là thứ nó bán. Nên phép đo 9%-vs-91% của repo tiêu thụ **không chuyển
thẳng sang được**. Phải định nghĩa lại "sản phẩm" theo từng repo, khai ở cấu hình; nếu không, luật
này sẽ nói sai ở đúng repo phát hành ra nó.

### KHUNG-42 · Khoá hết hạn khi CÓ NGƯỜI CHỜ, và vai điều phối không thể bị chặn @Đức:chốt

> **CHỜ NGƯỜI CHỐT:** đây là đổi một trong bốn cơ chế đa phiên. `MULTIFLOW.md` mục 5 bắt đổi cơ
> chế phải có **đột biến kiểm bắt buộc**, và `AGENTS.md` mục 2 hàng 6 bắt hỏi Đức.

**Phép đo bác giả thuyết hiển nhiên.** Ở repo tiêu thụ, 375 commit / 3 ngày: 43% chỉ chạm vùng
miễn khoá · 23% chỉ một gói · 7% chỉ docs · 6% chỉ scripts+tests. Trong 101 commit chạm một gói,
chỉ **2** cũng chạm vùng gốc và **0** chạm docs. Việc sản phẩm và việc quản trị **gần như không
ghi vào cùng chỗ** — phân vùng không sai.

**Chỗ nghẽn thật: một phiên cầm khoá 3 giờ trong khi làm việc ở chỗ khác.** Công cụ đã in ra đúng
điều đó — tín hiệu *"chưa thấy dấu vết trong repo"* — và mọi người bỏ qua nó.

*Chỗ nghẽn không phải hai người cùng muốn ghi một chỗ. Là một người cầm chìa khoá phòng mình
không vào.*

**Đề xuất ②a — hết hạn CHỈ KHI có người đang chờ:**

| Tình trạng khoá | Khi phiên khác xin |
|---|---|
| đang ghi (có commit trong 30 phút) | giữ, người xin chờ |
| chưa thấy dấu vết > 30 phút | nhường |
| có dấu vết nhưng > 2 giờ không commit | nhường, ghi lại một dòng |

**Vế "chỉ khi có người chờ" là BẮT BUỘC, không phải trang trí.** Chính `AGENTS.md` mục 1 cảnh báo
đúng chỗ đó: *"lane cẩn thận dựng nháp ngoài repo rồi mới ghi vào"* — nó không có dấu vết nhưng
đang làm. Hết hạn vô điều kiện sẽ **cướp khoá** của nó, và 06/09 chuyện đó đã xảy ra thật: một
khoá bị nhả hộ vì có người đọc dòng chẩn đoán ấy thành *"phiên kia đang rảnh"*, và phiên kia phải
hoàn nguyên việc đã xong. `tests/khoa-dau-vet.mjs` vế 7 ghim đúng chỗ này.

Không có ai chờ thì cầm bao lâu cũng vô hại. **Có người chờ thì mới có chuyện.**

**Đề xuất ②b — vai điều phối không thể bị chặn, bằng CẤU TRÚC chứ không bằng luật:**

(a) **Tạo file MỚI** trong `docs/adr/` và `docs/briefs/` thì **không cần khoá**. Nguyên lý: tạo
file không bao giờ đụng nhau, chỉ **SỬA** file mới đụng. Cái bẫy phải chặn cùng lúc: hai phiên
cùng tạo `0016-…` là **trùng số** — đúng loại lỗi đã xảy ra hai lần trong một ngày với mã sổ nợ ở
repo tiêu thụ. Chặn bằng hai vế: số do vai điều phối cấp, và **một phép kiểm ở cổng: hai file
cùng số thì ĐỎ**.

(b) **File luật gốc tách thành khoá riêng**, và chỉ vai điều phối nhận khoá đó. Phiên sản phẩm
**đọc** luật, không **viết** luật; cần đổi thì đề xuất qua một ADR — quy trình đã có.

Kết quả: vai điều phối không thể bị chặn — không phải vì ai nhường, mà vì **mọi đường ghi của nó
hoặc miễn khoá, hoặc nằm trên một khoá không ai khác nhận**.

### KHUNG-43 · Một trang cho người chủ đọc — 6 ADR mà Đức không biết ADR là gì

Repo tiêu thụ có **21 file ADR**, và Đức không biết ADR là gì. Bộ khung này có **6**.

Một cơ chế người chủ không hiểu là cơ chế **không phục vụ được người chủ** — nó chỉ phục vụ AI.

Bảng hiện chiếu ADR ra dưới dạng **bảng ba cột**: tiêu đề · trạng thái · ngày. Tiêu đề thì viết
cho AI đọc (*"Gói Assistant phát hành từ bộ khung; repo nào dùng thì là người tiêu thụ"*), trạng
thái là chữ tiếng Anh (`Accepted`), và **không cột nào nói đã chốt cái gì**.

**Cần:** mỗi quyết định **một dòng tiếng Việt** nói đã chốt gì — không mã, không đường dẫn, không
SHA. Giữ ADR (chúng cứu việc thật), nhưng **bổ sung cửa cho người**.

Nguồn có sẵn: `decisions.md` đã là sổ tra nhanh *"Đức đã chốt gì, ngày nào"*, và bảng **chưa đọc
file đó lần nào**. Nên đây có thể là một lượt **nối nguồn đã có**, không phải viết cơ chế mới.

### KHUNG-7 · `template/` phát bộ sinh bảng mà KHÔNG phát phép ghim của nó

Phát hiện 08/09 khi thêm khối **hai vai Assistant** vào `build-overview.mjs`. Bản trích phát
`template/scripts/build-overview.mjs` (bản 1.3.38) nhưng `template/tests/` **không có**
`overview-smoke.mjs` — nên repo đích nhận tính năng mà **không nhận lớp canh**. Ở nhà, khối đó
có 10 phép ghim và **6/6 đột biến bị bắt**; ở repo đích nó có **0**.

Vì sao có thể là cố ý, phải kiểm trước khi "vá": `overview-smoke.mjs` gọi `gomDuLieu()` ở tầng
module, tức nó **đọc `docs/` của repo nhà**. Ở một repo đích còn trống, phép kiểm đó có thể đỏ vì
lý do không liên quan gì tới bộ sinh — và một phép kiểm đỏ vô cớ ở repo đích thì tệ hơn không có.

Nhưng phần ghim khối hai vai **không** đọc repo: nó gọi `khoiMoHinh()` với đầu vào tự dựng. Nên
lối rẻ nhất có thể là **tách phần thuần hàm ra một file riêng rồi phát file đó**, chứ không phát
cả suite.

Vùng: `_template` + `_code`.

**đóng khi:** repo đích chạy được một phép kiểm canh khối hai vai (số suy từ đầu vào, không gõ
cứng), và một đột biến gõ cứng con số làm nó ĐỎ ở repo đích — đo trên một repo đích thật, không
suy ra. Hoặc: ghi vào `PLATFORM.md` rằng bộ sinh bảng phát **không kèm** phép ghim, kèm lý do.

### KHUNG-44 · Luật bàn giao hai vai chưa được cưỡng chế ở chính repo phát hành

> **Mục này từng mang số `KHUNG-8` — TRÙNG với một mục đã có.** Đổi sang 44 ngay trong cùng phiên.
> `ADR-0009` vẫn gọi nó là `KHUNG-8`: ADR đã `Accepted` là **bất biến**, không sửa được kể cả để
> chữa một con số — nên chỗ đối chiếu đặt ở đây, tức chỗ sửa được. Đọc `KHUNG-8` trong ADR-0009
> thì hiểu là mục này.

ADR-0008 khai rằng vế bàn giao (`② ghi BACKLOG kèm đóng khi: → ① biến thành bản vá`) là **vế duy
nhất máy kiểm được**. Ở repo Extension nó **được** cưỡng chế: `npm run test:backlog` chạy
`scripts/backlog-check.mjs`. Ở đây thì **không có lệnh đó**, nên câu trong hiến pháp đang mô tả một
năng lực repo này chưa có.

Đo 08/09: **43 trên 44 mục** của chính sổ này thiếu trường `đóng khi:` — chỉ `KHUNG-7` có.

**Vì sao KHÔNG port bộ kiểm ngay tối nay, và đây là phần đáng đọc:** bật nó lên là cổng đỏ 43 mục,
mà phần lớn là **chữ của phiên khác**. Sửa chúng là viết lại lời người khác — thứ mục 1 cấm. Và
một cổng đỏ 43 mục ngay lượt đầu thì phiên sau sẽ học cách bỏ qua nó, tức lớp bảo vệ chết ngay khi
sinh ra.

Lối rẻ: port bộ kiểm ở **chế độ đếm và cảnh báo** trước, chỉ CHẶN với mục tạo ra **sau** một ngày
mốc — y như cách `IDEAS.md` của repo Extension miễn trừ 14 mục ra đời trước luật.

Vùng: `_code` + `_root`.

**đóng khi:** `npm run test:backlog` tồn tại ở repo này VÀ chặn thật một mục MỚI thiếu `đóng khi:`
(dựng được ca hỏng, không chỉ chạy xanh), VÀ mục cũ không bị đỏ oan — đo bằng một lượt chạy trên
chính sổ này.

### ~~KHUNG-45~~ · Bản đồ vùng đến từ BÊN BỊ KIỂM — chặn được nhầm lẫn, không chặn được cố ý

**ĐÓNG 2026-09-08 vì thứ mang lỗi đã bị XOÁ, không phải vì đã vá.** `scripts/quyen.mjs` và
`tests/quyen-sau-ca.mjs` không còn trong repo — lý lẽ ở [ADR-0010](docs/adr/0010-xoa-so-quyen-va-tran-so-no.md).
Lỗ hổng dưới đây có thật và bài chấm chứng minh nó bằng cách chạy thật; nó chỉ hết là mối lo vì
không còn mã nào đọc `--ban-do`. **Dựng lại sổ quyền thì mở lại mục này TRƯỚC KHI viết dòng đầu.**

Vai SẢN PHẨM chấm chéo 08/09 và **chứng minh bằng cách chạy thật**, không bằng lập luận: viết một
bản đồ giả đúng hình dạng khai `vung-b/` thuộc `goi-a`, đưa vào bằng `--ban-do ban-do-gia.json` →
**mã 0**. Cùng commit đó với bản đồ thật → `AREA_MISMATCH`.

Nên `kiemDuongDan` cưỡng chế *"kết quả khớp với MỘT bản đồ nào đó"*, không phải *"khớp với bản đồ
CỦA REPO"*.

**Vì sao 97 ca xanh và 27/27 đột biến vẫn không thấy nó** — và đây là phần đáng đọc nhất: lỗ này
**không phải một dòng bảo vệ bị gỡ**. Mã chạy đúng thiết kế. Nó là một **giả định về lòng tin**,
nên **không có dòng nào để đột biến gỡ ra**. Thêm bao nhiêu con đột biến cũng không chạm tới.

Cùng họ với `--as`: một tham số tự khai đứng ở chỗ cần một sự thật kiểm được. Đã liệt kê cả họ đó
thành **bảng "AI NÓI ĐIỀU NÀY?"** ở đầu `scripts/quyen.mjs` — đó là thứ duy nhất bắt được lớp lỗi
này, vì nó hỏi *ai nói*, không hỏi *dòng nào bị gỡ*.

Lối đóng: đọc bản đồ **từ chính commit đang được kiểm** (`git show <sha>:.repo-structure.json`)
thay vì từ đĩa của bên đẩy. Lúc đó bản đồ là dữ liệu **trong phạm vi đang bị kiểm**, không phải
tham số. Chưa làm — lõi quyền chưa nối vào gì nên chưa gấp.

Vùng: `_code`.

**đóng khi:** có một ca dựng đúng phép thử của vai SẢN PHẨM — bản đồ giả đúng hình dạng, đường dẫn
do bên đẩy chọn — và cửa TỪ CHỐI nó; kèm một ca đối chứng cho thấy bản đồ thật vẫn đi qua.

### ~~KHUNG-46~~ · ĐÓNG 08/09 · Danh sách nhóm của bảng bị khẳng định ở HAI file, và tôi sửa lệch nhau

**Đóng bằng bản vá, không bằng cách bỏ luật.** Hợp đồng nay khai ở **một chỗ** —
khối `bang.nhom` của `.repo-structure.json` — và hai suite cùng đọc qua `nhomBangFrom()`.

**Vì sao KHÔNG khai bằng hằng số export từ `build-overview.mjs`** (một trong hai lối mục này
gợi ý): bộ sinh là bên **bị kiểm**. Hợp đồng nằm trong nó thì một lượt thêm tab sửa cả hai vế
của phép so sánh cùng lúc, nên phép kiểm xanh với **mọi** danh sách — tức nó thôi canh gì. Đo
được, không suy: mọi đột biến ở dưới đều dựa vào chỗ tách này.

**Ba đột biến đã chạy thật:**

⑴ thêm tab `gia-mao` vào bộ sinh → **CẢ HAI suite đỏ** ở đúng vế danh sách nhóm (điều kiện đóng
của mục này đòi đúng thế) · ⑵ chép lại danh sách vào `tests/overview-smoke.mjs` → vế cấm-chép
đỏ, chỉ tên đúng file và đúng số dòng · ⑶ đối chứng: bỏ cả hai đột biến → 17 vế xanh.

**Vế cấm-chép bắt oan ngay lượt chạy đầu, và đó là số đo đáng giữ:** nó khớp CHUỖI CON nên dòng
`assert.ok(!/id="so-migrate"/.test(T["cong-viec"]))` bị đếm là hai mã — "so-migrate" chứa
"migrate". Sửa thành khớp nguyên mã (hai bên không phải chữ thường hay gạch nối). Một vế mới
sinh mà xanh ngay lượt đầu thì chưa ai biết nó có răng không.

**Còn lại hai chỗ có chữ `tong-quan` trong `tests/`, cố ý:** `id="tab-tong-quan"` ở hai phép
kiểm khẳng định *một tab cụ thể phải còn* — đó là một sự thật khác với *danh sách gồm những
gì*, và quy nó về hợp đồng là buộc thứ tự phần tử vào một phép kiểm không nói gì về thứ tự.
Vế cấm-chép cho phép đúng một mã trên một dòng, chính vì ca này.

<details><summary>Nội dung gốc của mục</summary>



Đo 08/09 khi tách tab Migrate: danh sách nhóm (`tong-quan` · `cong-viec` · `migrate` · `he-thong`
· `lich-su`) bị `assert.deepEqual` ở **hai** chỗ — `tests/overview-smoke.mjs` và
`tests/overview-doc-smoke.mjs`. Tôi sửa bản đầu, tưởng xong, và **cổng đỏ thêm một vòng 9 phút**
chỉ để tìm ra bản thứ hai.

Cùng bệnh repo này đã gặp: `append_only_exempt` từng gõ cứng ở cả `session-check.mjs` lẫn
`safe-push.mjs`, và **hai bản sao của một luật đã trả hai câu khác nhau cho cùng một file**
(02/09). Bệnh không mới; chỗ mắc thì mới.

**Vì sao đáng sửa chứ không đáng bỏ qua:** hai bản không chỉ tốn công sửa hai lần — chúng **lệch
được**. Một bản nói năm nhóm, bản kia nói bốn, và cả hai đều "xanh" ở suite của riêng nó cho tới
khi có người chạy đủ cả hai.

Lối rẻ: khai danh sách nhóm **một chỗ** (hằng số export từ `build-overview.mjs`, hoặc một dòng
trong `.repo-structure.json`), hai suite cùng đọc. Lúc đó thêm/bớt một tab là sửa **một** chỗ.

Vùng: `_code`.

**đóng khi:** danh sách nhóm chỉ còn khai ở MỘT nơi — `grep -c 'tong-quan' tests/*.mjs` ra 0 ở
phần khẳng định — và một lượt thêm tab giả làm CẢ HAI suite đỏ cùng lúc (dựng được ca hỏng, không
chỉ chạy xanh).

</details>

### KHUNG-47 · Ba phép ghim của bộ khung KHOÁ VÀO chi tiết triển khai của repo nhà — đo 3 ca thật trong một lượt phát

**Cùng một bài học, lần thứ tư trong hai ngày.** 1.3.66 đã vá một ca (`runRootSuite()` → hỏi
HÀNH VI). Lượt phát 1.3.67 sang `n8n-orchestrator` hôm nay lộ ra **ba ca nữa**, cả ba đỏ **ngay
lúc file vừa tới**, trước khi ai kịp làm gì sai:

| Ca | Bộ khung đòi | Repo đích thật ra thế nào | Ai đúng |
|---|---|---|---|
| `handoff-smoke` | mọi file `…HANDOFF.md` phải có dòng **đúng chữ** `## Log` (`RE_MO_LOG` trong `handoff.mjs:33`) | n8n giữ nhật ký ở `log/YYYY-MM.md` (luật của nó, mục *Kết mỗi phiên* 3); `HANDOFF.md` ở đó là **tài liệu trạng thái**, không phải nhật ký | **repo đích** — nó CỐ Ý khác |
| `bang-song` vế 8 | 3 dòng `.gitignore` cho `bang-song/BANG.html` · `trang-thai.json` · `DUNG.txt` | không có dòng nào — `.gitignore` **không thuộc tầng nào** (KHUNG-39) | bộ khung thiếu đường phát |
| `dau-suite-smoke` vế 6 | dòng `.gitignore` cho `.ark-suite-stamp.json` | không có — cùng gốc bệnh | bộ khung thiếu đường phát |

**Và một chỗ thứ tư, không đỏ nên nguy hơn cả ba cái đỏ.** `--apply` thêm 4 tên lệnh, trong đó có
`test:tuan-tu`, **nhưng KHÔNG thêm tên nào trỏ vào `scripts/chay-test.mjs`**:

```
co alias chay-test?  []          ← đo sau khi --apply chay xong
```

Nên cơ chế nhanh nhất của bộ khung **tới rồi mà nằm không**: cổng gọi `npm test`, `npm test` là
chuỗi riêng của repo đích, không ghi dấu, và cổng chạy lại trọn chuỗi. Đúng ca `[~] MỘT PHẦN` mà
chính bộ khung cảnh báo, **và không phép kiểm nào đỏ**. Vá tay ở n8n: thêm `test:song-song`.

Luật mục 0b cũng góp phần: nó gọi tên `npm test` như thể đó là đường nhanh. Ở nơi phát hành thì
đúng; ở repo đích `npm test` là đường **chậm** — và lớp bảo vệ *"tài liệu dạy lệnh nào thì bản
trích phải khai lệnh đó"* chỉ hỏi lệnh **có tồn tại**, không hỏi nó **trỏ vào đâu**.

> Một phép ghim viết ở nơi phát hành mà soi **chi tiết triển khai** thì nó không phải hợp đồng,
> nó là bản sao. Hợp đồng phải nói về **hành vi**. — nguyên văn bài học 1.3.66, chưa được áp
> cho ba chỗ trên.

Vùng: `_code` (ba phép ghim) + `_root` (mục 0b) + `_template`.

**đóng khi:** ⑴ `handoff.mjs` cho repo đích **khai** dấu mở nhật ký (ví dụ `handoff.dau_mo_log`
trong `.repo-structure.json`), hoặc `handoff-smoke` chỉ đòi điều đó ở repo CÓ khai — và
`node tests/handoff-smoke.mjs` xanh ở n8n **mà không cần đổi `HANDOFF.md` của nó**; ⑵ `--plan`
kể tên mọi dòng `.gitignore` mà file máy nó sắp phát cần (bốn dòng đã biết), và một phép ghim dựng
repo đích thiếu dòng đó rồi đòi `--plan` **nói ra**; ⑶ `--apply` thêm một tên lệnh trỏ vào
`chay-test.mjs`, và một phép ghim đòi ĐỎ khi không tên lệnh nào trỏ vào nó; ⑷ mục 0b không còn
gọi tên một npm script cố định cho bước chạy suite.


### KHUNG-48 · `features.json` không có mục nào cho cơ chế suite song song — danh mục đo được một chiều

> **Đức chốt 2026-09-08:** *"Nếu chưa coi đó là 1 feature, thì ta cần pack nó lại trong feature list để có check list đầy đủ trong tab Migrate."*
> Nên mục này **đã được duyệt để làm**, không còn chờ ai quyết. Việc thuộc Vai ① — sửa `features.json` là sửa **tầng máy**
> (`TEP_MAY_THEM`), nên nó đòi tăng `version` + sinh lại bản trích, không phải một lượt sửa JSON.

**Đo 08/09.** Danh mục khai `1.3.66`, **9 khối · 42 mục**, và `grep -i "chay-test\|dấu xác
nhận\|song song"` trong `features.json` ra **0 kết quả ở phần mục**. Cơ chế đầu bảng của 1.3.60
(chạy suite song song + dấu xác nhận, cộng phép ghim `dau-suite-smoke.mjs` với 11 cửa từ chối)
**không có mục nào trong danh mục.**

**Hậu quả đo được ngay hôm nay.** Chạy `node scripts/features.mjs "…/Chrome_Extension_AI_Agentic"`
in ra `20 xong · 3 một phần · 12 thiếu · 7 ngoài phạm vi` — **không một dòng nào** nói repo đó đã
nhận hay chưa nhận cơ chế 1.3.65, dù nó vừa nhận xong hôm qua. Tức câu hỏi *"repo đích đã nhận đủ
tính năng chưa"* — đúng câu danh mục sinh ra để trả lời — nay trả lời **thiếu** cho tính năng mới
nhất, và trả lời thiếu trong **im lặng**.

**Vì sao phép ghim không bắt:** `tests/features-smoke.mjs` vế 5 đòi *"mọi thứ danh mục khai phải
CÓ THẬT ở repo phát hành"* — **một chiều**. Chiều ngược lại (*mọi thứ có thật và phát đi được thì
phải được khai*) không ai canh. Nên danh mục **không trôi khỏi thực tế** theo hướng nói thừa, mà
trôi tự do theo hướng **nói thiếu**. Mỗi tính năng thêm sau này lặng lẽ nới khoảng lệch đó thêm
một mục.

Và mục này phải đo cả **dây nối**, không chỉ file: đúng ca `[~]` mà chính danh mục cảnh báo —
`chay-test.mjs` có mặt mà không alias nào gọi được nó thì cơ chế có mặt mà không ai chạy.

Vùng: `_root` (`features.json`) + `_code` (phép ghim).

**đóng khi:** ⑴ `features.json` có một mục dưới F8 (hoặc F3) đo cơ chế này — cả `scripts/chay-test.mjs`,
`tests/dau-suite-smoke.mjs`, dòng `.gitignore` của dấu, **và** một alias npm trỏ vào bộ chạy — kèm
`tu_ban: "1.3.60"`; **và** ⑵ `tests/features-smoke.mjs` có một vế NGƯỢC: mọi tên trong
`PORTABLE_SCRIPTS` của `build-template.mjs` phải xuất hiện trong ít nhất một phép đo của danh mục,
và vế đó ĐỎ khi xoá thử mục vừa thêm.

### KHUNG-49 · `F4.7` XANH GIẢ ở mọi repo đã migrate — phép đo chỉ hỏi file có tồn tại

**Đo 08/09, bốn repo đã migrate cộng repo tiêu thụ.** `F4.7` khai phép đo là
`can.file = ["AGENTS.md", "BACKLOG.md"]` — **chỉ hỏi hai file có tồn tại**. Cả hai có ở mọi repo
đã lắp từ lâu, nên mục đó báo `[x]` **ở khắp nơi**. Đo lại bằng cách tìm câu chữ của chính luật:

```
grep -cE "giữ lõi|phát & thu|không tự nghiệm thu" <repo>/AGENTS.md
ALL_SKILL_MANAGEMENT 0 · nav_platform_main 0 · n8n-orchestrator 0 · Project 3 AI Agent Unify 0
Chrome_Extension_AI_Agentic 1   ← và repo này nhận bằng TAY, không qua upgrade
```

**0 trong 4 repo đã migrate có luật hai vai**, trong khi danh mục nói 2 trong 4 là `[x]` và 1 là
`[~]` *(và `[~]` đó đỏ vì thiếu `BACKLOG.md`, tức vẫn không phải vì thiếu luật)*. Đây là tính năng
Đức gọi là **quan trọng nhất để đưa AI assistant vào việc**, và bộ đo của bộ khung đang **báo
ĐẠT cho nó ở nơi nó không tồn tại**.

Gốc bệnh chung với `[~]`: phép đo `can.file` hỏi **sự có mặt**, mà mục này là một **đoạn luật nằm
TRONG một file repo đích tự sở hữu**. `upgrade.mjs` không bao giờ ghi `AGENTS.md` của repo đích —
đúng, vì đó là file của họ — nên với loại mục này *"file có tồn tại"* và *"nội dung đã tới"* là
hai câu hỏi khác nhau, và danh mục chỉ hỏi câu dễ.

Đã vá tay ở `ALL_SKILL_MANAGEMENT` 08/09 (mục B6). Đó là **vá điểm**, không phải cơ chế — ba repo
còn lại vấp y hệt, và repo thứ năm nhận migrate cũng sẽ vấp.

Vùng: `_root` (`features.json`) + `_code` (`features.mjs` nếu cần kiểu đo mới).

**đóng khi:** ⑴ `features.json` có kiểu đo *"nội dung phải có mặt trong file"* (ví dụ `can.trong_file`:
file + chuỗi/regex phải khớp), và `F4.7` dùng kiểu đó thay cho `can.file`; ⑵ chạy
`node scripts/features.mjs <một repo chưa nhận luật>` báo `F4.7` là `[ ]` hoặc `[~]` chứ không phải
`[x]` — dựng nổi ca hỏng; **và** ⑶ một vế trong `tests/features-smoke.mjs` đòi mọi mục có
`pham_vi: "ca-hai"` mà đích là một file repo-đích-tự-sở-hữu thì **không được** chỉ đo bằng `can.file`.

### KHUNG-50 · Bộ trích băm CÂY LÀM VIỆC, nên một lane sửa dở là CHẶN toàn bộ đường phát — và ledger bị đọc lúc đang ghi

**Đo 08/09, hai lane chạy song song đúng luật, khác vùng, mà vẫn đụng nhau.** Tôi giữ `_root` +
`_docs`, lane ① giữ `_code` + `_template`. Hai vùng rời nhau, không file nào chung. Vậy mà:

**⑴ Không phát được sang repo nào, ba lượt liên tiếp.** `upgrade.mjs --plan` từ chối:

```
SO_PHAT_HANH_LECH: bản 1.3.67 đã ghi dấu vân tay 1633c1812bb87973,
                   nội dung tầng máy hiện tại là b5823f889730c00f
```

Vì `bamBanTrich()` băm **cây làm việc**, không băm HEAD. Nên **bất kỳ** lane nào sửa dở một file
`.mjs` là Vai ② mất cửa ra ngoài. Cái giá đo được: `nav_platform_main` **không nhận được** cơ chế
suite song song trong lượt 08/09 — phải hoãn thành `NAV-1` ở repo đó.

**Đối chiếu đáng chú ý, trong CÙNG repo này:** bộ sinh bảng **cố ý suy hoàn toàn từ HEAD**, và lý
lẽ ghi ngay trong Bản đồ file — *"bộ sinh nhìn đồng hồ thì sang ngày là mọi phiên bị chặn đẩy dù
không dữ liệu nào đổi"*. Cùng một loại vấn đề, hai lựa chọn trái nhau. Bộ trích chưa hưởng bài học đó.

**⑵ `RELEASE-LEDGER.json` bị đọc lúc đang ghi — HAI lần, cách nhau ~30 phút, hai triệu chứng:**

| Lượt | Thông báo | Sự thật trên đĩa sau đó |
|---|---|---|
| ~17:20 | `1.3.9: c985e395… → ffffffffffffffff` | `c985e395…`, nguyên |
| ~17:55 | `1.2.10: 946065fa… → (đã bị xoá)` | có mặt, 87 bản, khớp HEAD |

Cả hai lần file **hoàn toàn lành** khi tôi đọc lại. Nguyên nhân: bộ trích ghi lại **cả file**
(`writeFileSync` một cục), nên lane khác đọc trúng khoảng giữa thấy một sổ **thiếu dòng**.

**Đây là ca nguy hiểm nhất trong hai ca, vì thông báo nó phát ra là thông báo ĐÁNG SỢ NHẤT của bộ
khung:** `SO_PHAT_HANH_SUA_LICH_SU` — *"nói dối về một bản đã đi ra ngoài"*. Một lane đọc trúng
lúc đó có mọi lý do để tin sổ đã bị phá, và **cách chữa hiển nhiên là sửa sổ** — tức phá một sổ
đang lành. Lớp fail-closed đúng, nhưng nó đang đổ lỗi cho người vô can.

Vùng: `_code` (`build-template.mjs`) + `_template`.

**đóng khi:** ⑴ `bamBanTrich()` (và đường `--plan`/`--apply` gọi nó) băm nội dung tại **HEAD** chứ
không phải cây làm việc — hoặc `--plan` nói rõ *"cây làm việc đang bẩn, đây là số của cây bẩn"* thay
vì kết luận sổ lệch; kèm một phép ghim dựng repo có file `.mjs` sửa dở rồi đòi `--plan` **vẫn phát
được** (hoặc từ chối với đúng lý do); **và** ⑵ lượt ghi sổ phát hành là **nguyên tử** (ghi file tạm
rồi `renameSync`), kèm một phép ghim đọc sổ giữa hai bước và đòi **không bao giờ** thấy trạng thái
thiếu dòng.
