# Sổ nợ — MỤC ĐÃ ĐÓNG, lưu trữ

**Dời 09/09 bằng nhịp dọn.** Sổ nợ là thứ vai điều phối đọc MỖI LƯỢT; đo được trước khi dời:
**35 trên 55 mục** trong sổ là việc đã xong, tức mỗi lượt đọc trả tiền cho phần
không còn dùng. Chữ giữ nguyên từng byte, chỉ đổi chỗ — thẻ *Đã xong* của bảng nay đọc CẢ file
này lẫn sổ sống, nên không mất một mục nào.

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

### ~~KHUNG-52~~ · ĐÓNG 08/09 · Cổng báo "suite ĐỎ" rồi in ra tên ba suite CHẬM NHẤT

**Vá:** cổng bắt theo mẫu `── <lệnh> (mã N) ──` mà bộ chạy in cho từng suite đỏ, thay cho
`.slice(-3)`. Đọc **cả hai luồng** — bảng thời gian ra `stdout`, khối "SUITE ĐỎ" ra `stderr`; đọc
mỗi `stdout` là bỏ đúng thứ cần. Không bắt được tên nào thì **nói thẳng là không đọc được**, kèm
đuôi bản ghi — không đưa ra một câu trả lời trông giống thật.

**Ca hỏng dựng được** (`cong-do-that.mjs` vế 12): một repo có **một suite ĐỎ nhưng NHANH** và
**một suite XANH nhưng CHẬM**. Bản cũ nêu tên cái chậm; bản mới nêu tên cái đỏ, và vế đòi cả hai
chiều — có tên đỏ, KHÔNG có tên chậm.

**Và nhánh thành thật tự chứng minh mình có ích ngay trong lượt vá:** bản đầu chỉ đọc `stdout` nên
không bắt được tên nào — nó in *"không đọc được TÊN suite đỏ"* thay vì lùi về đuôi trong im lặng,
và chính câu đó chỉ ra rằng tên nằm ở `stderr`. Lùi im lặng thì lỗi sống thêm một vòng nữa.

**3 đột biến, cả 3 bị bắt:** quay về `.slice(-3)` · chỉ đọc `stdout` · đối chứng.

<details><summary>Nội dung gốc của mục</summary>


**Đo 08/09, và giá phải trả đã tính được.** Khi chuỗi suite đỏ, `session-check.mjs:838` lấy
`String(error.stdout).split(NL).slice(-3)` làm phần giải thích. Ba dòng cuối của
`chay-test.mjs` là **bảng xếp hạng thời gian** (top-5 chậm nhất), không phải danh sách đỏ. Nên
cổng in ra:

```
suite gốc repo ĐỎ →  6.7s node tests/khoa-dau-vet.mjs | 2.3s node tests/assistant-smoke.mjs | …
```

trong khi suite đỏ thật là `features-smoke.mjs` — **chưa lần nào xuất hiện trên màn hình**.

**Vì sao đây là kiểu hỏng tệ nhất của một cổng:** nó không im lặng, nó **nói sai một cách tự
tin**. Câu in ra có tên file thật, có số giây thật, nên người đọc tin. Một cổng im lặng thì người
ta đi tìm; một cổng nói sai thì người ta đi sai hướng.

**Giá đo được ở chính phiên phát hiện:** bốn lượt đuổi theo ba cái tên sai — chạy riêng từng suite
(cả ba XANH) · dựng repo mới bằng `init-repo` (XANH) · dựng worktree ở bản trước để so (XANH) ·
rồi mới phải chép suite ra một bản gỡ lỗi để in nội dung thật.

**Vì sao chưa vá ngay:** `session-check.mjs` là vùng vừa bị sửa cho ba việc khác trong cùng phiên;
một lượt sửa nữa lúc này là trộn bốn việc vào một bản vá. Lối rẻ: `chay-test.mjs` đã BIẾT suite
nào đỏ (`doThat`) — cho nó in danh sách đó ở dòng CUỐI, hoặc cho cổng bắt theo mẫu `── node … (mã`
thay vì `slice(-3)`.

Vùng: `_code`.

**đóng khi:** dựng một repo có ĐÚNG MỘT suite đỏ và một suite khác CHẬM HƠN hẳn, chạy cổng, và
đòi câu nó in ra chứa tên suite ĐỎ — kèm đối chứng: đổi suite nào đỏ thì tên trong câu đổi theo.


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

### ~~KHUNG-3~~ · GỘP 09/09 vào KHUNG-14 · Hai pilot migrate chưa đo lại ở bản khung hiện tại

**Gộp theo chốt của Đức 09/09.** Chính KHUNG-14 đã tự khai: *"Gắn với KHUNG-3 … làm cùng lượt
thì rẻ hơn hai lượt."* Hai mục cùng một lượt mở máy, cùng hai repo đích, cùng một người. Lệnh đo
đã dời sang KHUNG-14.

## P3

### ~~KHUNG-7~~ · ĐÓNG 06/09 · Luật đóng phiên bắt ghi vào `decisions.md` — file không tồn tại

> **ĐÓNG 06/09 — đo lại thì không còn đúng.** `decisions.md` đã có ở repo này từ 05/09 và đang được ghi đều; bản trích cũng mang nó. Mục này để mở thêm một ngày sau khi đã được vá — **sổ nợ cũng mục được**, và đó là lý do `npm run what-next` phải được đọc cùng số đo chứ không đọc một mình.

`AGENTS.md` mục 7 bước 2: *"Quyết định mới của Đức → `decisions.md`"*. Repo **không có file này**,
và Bản đồ file cũng không khai nó. Nên khi Đức chốt một việc thật, phiên AI không có đích hợp lệ
để tuân luật — và quyết định rơi vào `HANDOFF.md` hoặc bốc hơi.

**Đây là lần thứ BA cùng một hình dạng lỗi trong repo này:** `claim.mjs` (audit 03/09) ·
`BACKLOG.md` (05/09) · `decisions.md` (05/09). Ba lần, ba file khác nhau, cùng một bệnh: luật
trỏ tới thứ không tồn tại. Đáng cân nhắc một phép kiểm máy quét chính điều này, thay vì chờ lần
thứ tư. Vùng: `_root` + `_code`.

### ~~KHUNG-8~~ · ĐÓNG 09/09 · Luật bắt ghi vào "bảng lỗi của sổ tay" — không chỉ ra bảng nào

`AGENTS.md` mục 7 bước 3 bắt thêm một dòng vào *"bảng lỗi của sổ tay"*. Repo không có bảng nào tên
là bảng lỗi, nên mỗi phiên ghi một chỗ, hoặc bỏ qua.

**Đóng bằng cách bỏ hẳn cái tên không tồn tại, không phải bằng cách đặt tên cho nó.** Mục 7 bước 3
nay trỏ sang **mục 8 câu 4** — bảng phân nhóm vừa thêm cùng lượt — nên câu trả lời là một LUẬT
chung ("lỗi sẽ gặp lại → sổ tay agent · thứ đang hỏng → `BACKLOG.md`"), không phải một tên file mà
repo tiêu thụ có thể không có. Đây đúng là hình dạng KHUNG-7 và bốn ca trước nó: **luật chung gọi
tên thứ chỉ nơi phát hành mới có**.

### ~~KHUNG-10~~ · ĐÓNG 09/09 · `cong-do-that.mjs` dựng ca đỏ cho 6 trong 11 mục cổng, nhưng bảng tra nói như thể cả cổng

**Đóng bằng cách rẻ nhất mà chính mục này đề xuất: sửa câu trong bảng tra cho khớp bằng chứng.**
Đo lại 09/09 — cổng nay có **15** mục (không phải 11), và `cong-do-that.mjs` dựng ca đỏ cho **11**
trong số đó. Bảng tra mục 6 nay ghi đúng số **11/15** và **nêu tên bốn mục chưa có ca đỏ**: *Khoá
file đã trả hết* · *Sự thật máy sinh còn tươi* · *Cổng kiểm cấu trúc B1–B14* · *HANDOFF: mục mới
trong trần*. Bốn mục đó vẫn có phép ghim ở suite khác; điều bảng tra thôi khẳng định là *"file này
phủ cả cổng"*.

**Số đo, không phải lời hứa** — câu trong bảng tra nói rõ: sửa cổng thì cập nhật lại con số. Con số
cũ (6/11) sống được bốn ngày vì không ai buộc nó phải đúng.

Bảng tra `AGENTS.md` mục 6 giới thiệu file này là chỗ *"biết cổng đóng phiên có ĐỎ THẬT được
không"*. Thực tế nó dựng ca hỏng cho **sáu** mục; cổng có **mười một**. Bốn mục chưa có ca kho
thật độc lập trong file đó: file mới đã khai vào Bản đồ · HANDOFF đã ghi Log · **Sự thật máy
sinh còn tươi** · cổng cấu trúc được gọi và truyền đúng kết quả.

Chú ý mục thứ ba: đó chính là mục đang đỏ vĩnh viễn (KHUNG-1). Một mục vừa chưa chứng minh được
là đỏ-thật-được, vừa đang đỏ thật — và không ai bắt được sự trớ trêu đó cho tới khi audit ngoài
vào đọc. Việc rẻ nhất: sửa câu trong bảng tra cho khớp bằng chứng. Vùng: `_docs`.

### ~~KHUNG-12~~ · Lớp "nghề nào đếm file nghề ấy" chưa từng chạy ở luồng thật

Phát hiện khi vá KHUNG-1. `isBehaviourFile()` nhận `opts.behaviourGlobs` để repo Python khai
`**/*.py` mà đếm cho đúng — nhưng trước bản 1.3.1, `changedCommitCount()` gọi nó **không kèm
tham số nào**. Tức lớp đó chưa bao giờ chạy ở luồng thật: repo Python vẫn bị đo là "code không
đổi", đúng cái mà chú thích của chính lớp đó nói là đã chữa. Và repo 3AI migrate 03/09 **chính
là Python**.

Bản 1.3.1 đã nối đường truyền tham số (`behaviourOpts`), nên chỗ vá sẵn sàng. Còn thiếu hai vế:
**khai `behaviour_globs`** ở nơi cần, và **một phép ghim dựng nổi ca hỏng** cho nó — không thì
lại đúng bệnh KHUNG-5. Vùng: `_code`.

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


### ~~KHUNG-31~~ · GỘP 09/09 vào KHUNG-6 · Báo cáo năm dòng của phiên nhận việc là LỜI TỰ KHAI

**Gộp theo chốt của Đức 09/09.** Chính mục này tự khai ngay dòng đầu: *"cùng hình dạng với
KHUNG-6"*. Hai mục hỏi **một câu**: *repo có gì kiểm được lời một phiên tự khai không?* Giữ hai
mục cho một câu là hai người cùng đọc, cùng nghĩ, và mỗi người sửa một nửa. Bằng chứng và lối đi
đã dời sang KHUNG-6.

### ~~KHUNG-24~~ · XOÁ 09/09 · Bảng có tab "Đã xong", nhưng chỉ đọc sổ nợ của repo NHÀ

**Xoá theo luật mục 8 câu 1 — Đức chốt 09/09.** Chính mục này tự khai *"chưa đau ở repo nhà …
**sẽ** đau ở repo dùng `units.root_dir`"*, tức nó ghi một chuyện **chưa xảy ra**. Đo 09/09:
`units.root_dir = null` ở repo này → **không có đơn vị con nào**, nên ca hỏng **không dựng nổi**,
nên luật vàng số 2 không cho viết phép ghim cho nó. Mục nợ chưa dựng nổi ca hỏng là **dự đoán**,
không phải nợ — và sổ nợ giữ dự đoán thì trần 25 mục bị chiếm bởi thứ không ai đóng được.

Gặp lại thật ở một repo có `units.root_dir` thì mở mục mới, kèm số đo của repo đó.

*(Nội dung cũ: tab "Đã xong" chỉ đọc `BACKLOG.md` ở gốc, nên mục đã đóng ở đơn vị con không hiện.)*

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

### ~~KHUNG-42~~ · ĐÓNG 08/09 · Khoá hết hạn khi CÓ NGƯỜI CHỜ, và vai điều phối không thể bị chặn

> **ĐÓNG 08/09 — Đức chốt:** *"ok đóng KHUNG-42 đi, giữ dòng vàng."* Cơ chế khoá **tự hết hạn**
> bị bỏ hẳn — [ADR-0012](docs/adr/0012-khoa-muc-file.md) ⑸ nói ngược nó, và hai luật ngược nhau về
> cùng một khoá thì lane nào cũng có cớ chọn bên có lợi cho mình. Giữ lại **đúng một** việc: dòng
> **VÀNG** ở cuối cổng — nay là `KHUNG-54`. Phân tích bên dưới **giữ nguyên**, nó là lý do của quyết định.

> **08/09 — MỤC NÀY GẦN NHƯ ĐÃ BỊ VƯỢT QUA, đọc trước khi làm.** `harness-phat-01` đối chiếu với
> **ADR-0012 (Accepted 08/09, người chốt Đức)** — khoá mức FILE: giữ ngắn, trả ngay, chỉ đọc thì
> không khoá. ADR đó chữa **gốc** của cùng vấn đề, và số đo của nó: 7 ngày · 384 commit · 41 lane
> · **620 cặp** commit khác lane ≤1 giờ cùng vùng, trong đó **355 (57%) khác file hoàn toàn** —
> hơn một nửa số lượt chặn là **chặn oan**.
>
> **Và ADR-0012 ⑸ nói NGƯỢC đề xuất ②a dưới đây:** *"Quá 30 phút thì NÊU TÊN, tuyệt đối không tự
> nhả"* — lý do: tự nhả là tự động hoá đúng vụ nhả-khoá-hộ 06/09, lần đó một người làm và một lane
> mất phần đã xong; nếu máy làm thì không ai kịp thấy. **Thi hành ②a là phá một ADR đã Accepted.**
>
> | Vế của mục này | Trạng thái sau ADR-0012 |
> |---|---|
> | ②a — bảng ba dòng hết hạn khoá | **bị ⑸ bác**; nửa "nêu tên" thì ⑸ đã làm |
> | ②b — vai điều phối không bị chặn | **giải phần lớn**: khoá mức file thì tạo file mới không đụng ai |
> | dòng **VÀNG** ở cuối cổng (đề xuất 08/09) | **còn sống và tương thích** — nó chỉ nêu tên, không nhả |
>
> **Chỗ hở còn lại, đo được 08/09:** khoá **VÙNG** của một phiên ĐÃ CHẾT. Ca thật: `claude-bang-gon`
> giữ hai khoá ở `nav_platform_main` **một ngày** sau khi phiên tắt. ADR-0012 ⑷ cho cổng ĐỎ khi còn
> treo khoá **file**, nhưng phiên đã chết thì **không bao giờ chạy cổng** — nên không lớp nào bắt.
> Và ⑸ cấm tự nhả. Nên nó phải là quyết định của người; **chi phí thật đo được: một câu hỏi cho Đức,
> một lượt trả lời.** Đổi lấy rủi ro máy cướp khoá của lane đang dựng nháp ngoài repo — không đáng.
>
> **ĐỀ NGHỊ:** ĐÓNG mục này vì đã bị ADR-0012 vượt qua, **giữ lại đúng một việc**: thêm dòng VÀNG ở
> cuối cổng đóng phiên — *"bạn còn giữ N khoá vùng, cây sạch, mọi commit đã đẩy — cân nhắc trả khoá"*.
> Ba dữ kiện đó cổng đã biết cả ba, chỉ chưa nói thành một câu. Đây là **bớt một cơ chế, không thêm**.
>
> **CHỜ ĐỨC:** đồng ý đóng, hay vẫn muốn cơ chế hết hạn tự động? Nếu muốn thì **phải sửa hoặc thay
> ADR-0012 ⑸ trước** — hai luật ngược nhau về cùng một khoá thì lane nào cũng có cớ làm theo bên có
> lợi cho mình. Đức đã nói *"chốt đi, làm luôn"* 08/09, nhưng lúc đó chưa biết ADR-0012 tồn tại.

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

### ~~KHUNG-48~~ · ĐÓNG 08/09 · `features.json` không có mục nào cho cơ chế suite song song — danh mục đo được một chiều

**Đóng đủ cả hai vế của điều kiện.**

⑴ **`F8.5`** đo cơ chế: `scripts/chay-test.mjs` · `tests/dau-suite-smoke.mjs` · và **dây nối**,
kèm `tu_ban: "1.3.60"`.

⑵ **`tests/features-smoke.mjs` vế `5b`** — chiều ngược: mọi script trong `PORTABLE_SCRIPTS` phải
nằm trong ít nhất một **phép ĐO** của danh mục.

**Và vế ngược bắt được BA chỗ ngay lượt chạy đầu, không phải một:** ngoài `chay-test.mjs` còn
`repo-structure.mjs` (bộ đọc hình dạng repo — khai file cấu hình mà không khai bộ đọc là khai một
nửa) và `handoff.mjs` (thước trần nhật ký). Cả ba đã phát đi từ lâu mà danh mục chưa từng đo.
Đó là số đo của việc *"danh mục trôi tự do theo hướng nói THIẾU"* — nó không trôi một mục, nó
trôi ba.

**Phép đo thứ BA — `chuoi` — và vì sao phải thêm nó:** điều kiện đóng đòi đo cả *"một alias npm
trỏ vào bộ chạy"*. Đo bằng `lenh` thì hỏng: TÊN alias khác nhau ở mỗi repo — ở đây bộ chạy nằm
dưới `test`, ở repo tiêu thụ nó là `test:song-song`. **Hỏi tên là hỏi chi tiết triển khai.** Nên
`chuoi` hỏi *"có alias nào TRỎ VÀO nó không"*, tên gì cũng được.

**Bốn đột biến đã chạy, cả bốn bị bắt** — và **hai cái SỐNG SÓT lượt đầu**: ⑵ gỡ `luu-do.mjs`
khỏi `can.file` của `F1.1` vẫn xanh, vì vế ngược quét cả JSON nên **văn xuôi `khong_co_thi` được
tính là "đã khai"** — trong khi văn xuôi không đo được gì; nay chỉ đọc khối `can`. ⑶ làm phép đo
`chuoi` LUÔN ĐẠT vẫn xanh, vì chưa vế nào đòi nó biết ĐỎ.

<details><summary>Nội dung gốc của mục</summary>


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

</details>

### ~~KHUNG-49~~ · ĐÓNG 08/09 · `F4.7` XANH GIẢ ở mọi repo đã migrate — phép đo chỉ hỏi file có tồn tại

**Đóng đủ ba vế.**

⑴ **Kiểu đo `trong_file`** (file + các chuỗi phải khớp) trong `features.mjs`; `F4.7` dùng nó với
ba chuỗi của chính luật: `① Giữ lõi` · `② Phát & thu` · `tự ký nghiệm thu`.

⑵ **Ca hỏng dựng được, đã chạy thật:** chép một repo dựng từ bản trích, xoá đúng ba dòng luật hai
vai khỏi `AGENTS.md`, giữ nguyên mọi thứ khác. Trước: `[x]`. Sau khi vá: `[~]` **và kể tên đúng
ba chuỗi thiếu**. Đối chứng: bản chưa xoá vẫn `[x]`.

⑶ **Vế `5c` trong `features-smoke.mjs`:** `AGENTS.md` và `CLAUDE.md` — hai file repo đích TỰ SỞ
HỮU, `upgrade.mjs` không bao giờ ghi — **chỉ được đo bằng `trong_file`, cấm đo bằng `can.file`**.
Cộng vế `5d` đòi chính kiểu đo đó biết ĐỎ.

**Vế `5c` bắt thêm MỘT chỗ ngay lượt đầu:** `F4.5` cũng đang đo `AGENTS.md` bằng sự có mặt. Sửa
đúng chỗ chứ không nới vế: điều `F4.5` khẳng định là **cánh cửa** — `CLAUDE.md` phải TRỎ SANG một
bản luật duy nhất — nên nó đo nội dung `CLAUDE.md`, còn `AGENTS.md` có luật hay không là việc của
`F5.1`. Hai mục thôi đo trùng một thứ.

**3 đột biến đã chạy, cả 3 bị bắt:** đưa `F4.7` về `can.file` → vế 5c đỏ · `trong_file` luôn ĐẠT
→ vế 5d đỏ · đọc-không-được-thì-coi-như-CÓ → vế 5d đỏ (đây là cửa ngã về phía dễ nhất).

**Và vế 1 đỏ oan ngay lượt đầu:** nó đếm phép đo bằng `file + lenh` nên một mục chỉ có
`trong_file` bị coi là *"không đo được"*. Danh sách kiểu đo phải theo kịp `xetMuc` — nay có bốn.

<details><summary>Nội dung gốc của mục</summary>


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

</details>

