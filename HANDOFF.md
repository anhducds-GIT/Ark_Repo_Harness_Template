# HANDOFF — bàn giao giữa các phiên

> **Chỉ THÊM dòng, không sửa dòng cũ.** Phiên sau đọc **phần CUỐI** file này trước tiên.
> Mỗi phiên ghi đúng ba thứ: làm gì · kết quả bằng số · còn gì mở.

## Trạng thái hiện tại

Repo này là **nhà riêng của bộ khung**. Nó vừa được tách ra khỏi repo sinh ra nó
(`Chrome_Extension_AI_Agentic`) theo quyết định ADR-0001.

Nó **tự dựng bằng chính bộ khung của mình** — không phải một thư mục chép tay. Và nó tự sinh lại
được bản trích trong `template/`: `npm run template -- --check` phải luôn khớp.

## Log

## 2026-09-03 — `claude-template-finish`: chuyển nhà

Bộ khung rời repo Chrome sang đây. Mang theo: 5 công cụ vận hành · luật ba tầng · 4 bản mẫu ·
suite hạt giống · và 4 công cụ chỉ dành cho nhà (bộ trích · đo độ lệch · khởi tạo repo mới ·
trang mô tả bộ khung) cùng hai quy trình.

**Bằng chứng chuyển nhà không mất gì:** bản trích sinh ra ở đây **giống hệt từng byte** bản sinh
ra ở repo cũ. Kiểm bằng `diff -r`.

**Một lỗi tìm ra đúng lúc chuyển nhà, và chỉ lộ ra vì chuyển nhà:** bộ trích **cộng thêm một dòng
trống mỗi lần chạy**. Nó lấy chỉ số đầu dòng tiêu đề nên ký tự xuống dòng phía trước bị giữ lại,
rồi bản thay lại thêm một cái nữa. Trích một lần thì không ai thấy. Trích lại **từ bản trích** —
đúng việc phải làm khi bộ khung có nhà riêng — thì lệch dần. Đã vá, và `--check` chạy hai lần
liên tiếp vẫn khớp.

**Một phép kiểm phải viết lại cho chạy được ở cả hai nhà:** đối chứng dương của phép dò từ vựng
nghề vốn mượn chính luật của repo. Ở đây luật vốn đã ở dạng chung, nên phép kiểm đó **đỏ ở đúng
cái repo làm mọi thứ đúng nhất**. Nay nó tự nhận biết: repo còn mùi nghề thì dùng luật thật làm
đối chứng, repo đã chung thì trồng đối chứng.

**Số:** 25 phép kiểm xanh · bản trích 21 file · cổng cấu trúc 0 đỏ 0 vàng.

**CÒN MỞ:**
1. **Chưa có remote.** Repo này mới chỉ ở máy. Cần một repo GitHub trống để đẩy lên.
2. **Repo cũ vẫn còn bản sao** của `template/` và 4 công cụ. Xoá bên đó cần chủ dự án duyệt —
   chưa làm. Tới lúc đó thì **có hai bản**, và đó đúng là thứ ADR-0002 nói phải tránh.
3. **Chưa từng migrate một repo thật khác nghề.** Nhãn `0.1.0-unproven` vẫn đúng.

---

## 2026-09-03 · phiên `sua-tai-lieu` — sửa tài liệu theo báo cáo soi

**Làm gì:** chỉ sửa file `.md`. Gộp **ba bản mâu thuẫn** của danh sách "việc phải hỏi Đức" thành
một bản duy nhất ở `AGENTS.md` mục 2 (`HUONG-DAN.md` và `BAO-TRI-DINH-KY.md` nay chỉ trỏ sang).
Viết lại `README.md` gốc cho repo nhà — trước đó nó là bản sao từng byte của `template/README.md`,
tức README của gói phát hành. Sửa hai lệnh trong tài liệu chạy ra lỗi (`npm run claim`,
`npm run template:overview`). Thêm mục "Trước khi bắt đầu — 30 giây" vào `HUONG-DAN.md`. Thêm 6
lưu đồ. Bỏ trùng lặp quy trình đóng phiên (giữ một bản ở `workflows/03`).

**Số:** liên kết chết trong tài liệu **2 → 0** · cổng cấu trúc **0 đỏ · 9 vàng (B6)**, y như
trước khi sửa · `AGENTS.md` 197 dòng (giới hạn 200).

**Lệnh đã chạy thử:** `node --version` (v24.18.0) · `git --version` (2.54.0) · `node
scripts/claim.mjs --list/--take/--release` · `npm run bootstrap` · `npm run assess` (cả hai dạng,
có và không có `--`) · `npm run overview` (cả hai dạng) · `npm run init -- --help` ·
`npm run template -- --check` · `npm run claim` và `npm run template:overview` (đều báo
`Missing script`, đúng như báo cáo). **Không** chạy `npm run gate` — phiên `harness-vong2` đang
sửa `session-check.mjs`.

**CÒN MỞ — cần phiên giữ `_code` và `_template` xử:**
1. **`npm run template -- --check` ném `TRICH_HONG`** vì sửa `AGENTS.md` mục 0–5 làm đổi dấu vân
   tay luật chung. Vân tay mới: `5fd62e98c32489e7efd24c286e62cf882b2fe4254f00891f66aad03cf20295ed`.
   Guard tự nói chỉ được cập nhật `COMMON_LAW_SHA256` **khi chủ repo đã duyệt đổi luật chung** —
   nên đây là việc phải hỏi Đức, không tự làm.
2. **`STATUS.template.md` vẫn là khuôn của repo Chrome Extension** (bảo đặt file "cạnh
   `manifest.json`"). Sửa nó sẽ làm `template/` lệch thêm, nên để lại cho phiên giữ `_template`.
3. **`.repo-structure.json` chú thích lạc hậu:** `_areas_doc2` viết "HAI CHỦ, CỐ Ý" trong khi
   thực tế đang có bốn chủ (`_root _docs _code _template`).

- **2026-09-03 · harness-vong2** — Vòng 2: vá 9 lỗ do hai lần migrate thật và audit độc lập vạch ra (cổng báo XANH khi không kiểm được gì · safe-push soi một đằng đẩy một nẻo · bản đồ file đóng cứng số mục · máy sinh tự đếm mình là code · gõ sai tên trường cấu hình làm mất lớp bảo vệ · đèn sức khoẻ không bao giờ xanh được · HUONG-DAN bị nuốt khỏi trang · Log chỉ đòi ở package · quét secret bỏ qua .env). Suite 30 → 36. Mở: 6 phát hiện Codex chưa vá (đếm [ĐO] bằng regex · verifyCommit chưa kiểm ancestor · archived lọt active_work · provenance artifact).
- **2026-09-03 · harness-vong2 (tiếp)** — Vá thêm: quét secret kêu oan một lời gọi hàm ở repo Project 3AI, và sau khi siết lại thì nó bắt chính suite của mình (fixture phải ghép chuỗi lúc chạy). Suite 36 → 37.
 - **2026-09-03 · phiên `harness-vong2`** — Vòng 2: migrate thật hai repo ngoài đời
   (Project 3AI, NAV chứng khoán) và vá những gì lần migrate đó phơi ra. Vá 6 lỗ, mỗi lỗ một
   phép kiểm ghim, mỗi phép kiểm đã thử phá: tên file sai hoa thường bị chấm là "có" (Windows
   không phân biệt, Linux thì có) · thư mục chiếm chỗ tên file bị kể là "thiếu" · phép kiểm
   miễn trừ đọc sai hình dạng nên chưa bao giờ chạy · `init-repo` ném stack khi đích là file ·
   cổng báo "mọi thứ đã khai" khi phiên không giữ vùng nào (xanh vì RỖNG).
   THÊM: `scripts/can-nang.mjs` + mục 8 của luật — đo **cân nặng** bộ khung (đọc bắt buộc ·
   tài liệu · số phép kiểm · thời gian) và trả lời được "luật nào chưa từng chặn được gì".
   Suite 30 → 37. Codex vòng 3 trả 16 phát hiện; **4 cái tôi kiểm lại đều là báo nhầm** —
   12 cái còn lại CHƯA kiểm, là việc mở lớn nhất.

 - **2026-09-03 · phiên `harness-vong2` (tiếp)** — Kiểm nốt 16 phát hiện của Codex vòng 3.
   Kết quả: **2 thật, 14 đã được vá hoặc báo nhầm** — phần lớn vì một phiên khác đang sửa cùng
   bản báo cáo đó song song, nên mốc đóng băng lạc hậu ngay trong lúc audit chạy.
   Hai cái thật: (a) `check-bootstrap.mjs` thoát 0 mà không in gì thì cổng vẫn báo XANH — dựng
   lại được bằng cách thay file đó bằng đúng một dòng `process.exit(0)`; **đã vá + ghim + thử phá**;
   (b) đơn vị khai `archived` vẫn lọt vào `active_work` của bảng — **đã vá**.
   Còn MỞ, cố ý chưa vá: phép kiểm bản đồ chỉ hỏi "đường dẫn có được NHẮC không", không hỏi
   "có một dòng khai không" — siết lại có thể làm đỏ oan repo dùng bản đồ dạng danh sách.
   THÊM: **sổ migrate** (`scripts/build-so-migrate.mjs` + `docs/migrations/`) — mỗi lần migrate
   một hồ sơ cùng khuôn, vì việc này xảy ra thưa và không ghi thì quên sạch. Suite 37 → 43.

 - **2026-09-03 · `harness-vong2` (đóng)** — Đức chốt hai việc: NAV dọn nợ QA (**cổng nay
   XANH TOÀN BỘ**), 3AI bỏ bộ chuẩn đời cũ (**gỡ 71 file**, khai 22 file bộ khung vào bản đồ,
   9 XANH 1 BỎ — BỎ vì repo đang ở nhánh tính năng nên không có mốc `origin/main` để so).
   Audit GPT: kiểm lại 4 tuyên bố **đều đúng** — không có CI nên `git push` đi vòng qua mọi
   cổng · bản trích tự nhận `0.1.0-unproven` trong khi repo `0.3.0` · `build-overview` ghép tên
   file vào chuỗi shell (**đã vá** sang `execFileSync`) · lưu đồ đóng phiên bảo ghi HANDOFF SAU
   khi push, còn cổng lại ĐÒI có nó TRƯỚC khi xanh (**đã sửa thứ tự**).
   CÒN MỞ, lớn nhất: **chưa có cơ chế ghim phiên bản**. Hôm nay phải chép tay `session-check.mjs`
   sang hai repo BA LẦN vì vá liên tục — đó chính là cách 21 repo biến thành 21 bản khung.

 - **2026-09-03 · `harness-vong2` (audit GPT vòng 2)** — Kiểm 3 tuyên bố về code, **cả 3 đúng**:
   (a) `build-so-migrate` destructure `{fm, body}` trong khi parser trả `{fm, than}` → `body`
   undefined → `body ?? raw` ngã về CẢ FILE, nên frontmatter bị in lại như văn xuôi. Lỗi của
   chính tôi hôm nay, và phép kiểm của tôi **chỉ soi cái khung nên không thấy cái trong khung**.
   (b) Bảng tổng quan chỉ bắt chữ "chỗ VÀNG", không bắt "chỗ ĐỎ" — repo 10 đỏ / 0 vàng hiện
   ra "0" và đèn có thể xanh. Bảng giấu đúng thứ nặng nhất.
   (c) Quét secret trả `ok:true` kèm ghi chú "73 file không đọc được" — badge vẫn XANH.
   Cả ba **đã vá**; (a) đã ghim + thử phá. Giữ đúng 3 con số theo đặc tả của Đức: gộp đỏ+vàng
   thành một con số, `null` không cộng thành 0.

 - **2026-09-03 · `harness-vong2` · CORE-CONTRACT-CORRECTION** — Kiểm nốt 16 tuyên bố
   còn lại của audit GPT: **15 đúng, 1 không tái hiện được**. Rồi vá theo đúng thứ tự GPT đặt:
   fixture ĐỎ trước, vá, XANH sau — `tests/core-contract.mjs`, bảy khối.
   F1 bộ đo dùng đúng validator runtime (trước: cấu hình `unitsFrom` NÉM vẫn được chấm mức 3 ·
   0/0/0) · F2 đo được code ngoài JS khi repo khai `behaviour_globs` · F3 vòng đời và validator
   dùng chung một bảng (trước: bảng vẽ hai chặng `proven`/`retired` mà validator TỪ CHỐI, còn
   bốn giá trị hợp lệ không có chặng nào) · F4 lệnh git hỏng không hoá thành số 0, thêm phép
   kiểm thứ 11 · F5 quy chủ theo tiền tố dài nhất (trước: đổi thứ tự khai là đổi chủ) ·
   F6 xoá một ADR đã Accepted bị bắt, và `--follow` để đổi tên không cắt lịch sử ·
   F7 khoá quyền nguyên tử bằng `mkdir`.
   **F7 vẫn là phép kiểm YẾU**: nó chỉ dựng được ca tuần tự, không dựng được ca đua thật.
   Suite 43 → 50. CHƯA làm: version pinning + upgrade — đúng thứ tự GPT đặt, sửa phép đo trước.

 - **2026-09-03 · `harness-vong2` · ĐÓNG v1.0** — Năm việc Đức hỏi:
   (1) `llms.txt` **vẫn còn và vẫn được sinh** — nó chỉ rơi khỏi bản đồ mục 6 và khỏi trang;
   đã đưa lại. (2) Link trang vệ tinh (sổ migrate) nay đọc thẳng từ bản đồ mục 6 — không khai
   lần thứ hai. (3) Bản 1.0.0, bỏ nhãn `unproven`, bản trích lấy phiên bản từ `package.json`
   thay vì tự khai `0.1.0-unproven`. (4) Trang xếp lại theo tần suất: thêm "Bắt đầu ở đâu" và
   "Trang liên quan" lên tab một, đẩy phần văn xuôi ít đọc vào toggle, đổi thứ tự tab.
   (5) Thêm mục "Đọc trang này thế nào — 60 giây" vào `HUONG-DAN.md`.
   Một phép kiểm cũ phải sửa: nó cấm MỌI lệnh ở tab một, trong khi luật đúng là **không MỞ ĐẦU**
   bằng lệnh. Đã đổi sang kiểm thứ tự thay vì kiểm sự vắng mặt.

 - **2026-09-03 · `harness-vong2` · v1.1 GHIM PHIÊN BẢN** — `scripts/upgrade.mjs` +
   `.ark/harness.lock.json`. Việc đáng giá nhất không phải chép file mà là **biết dừng lại**:
   sổ ghim tách được ba ca trước đây trông giống hệt nhau (CŨ · SỬA TAY · CHƯA GHIM) — so hai
   chiều thì cả ba đều "khác". Không có vế SỬA TAY thì `upgrade` chỉ là `cp -r` có nghi thức.
   Đã ghim cả hai repo thật ở bản 1.0.0. Suite 50 → 54.

 - **2026-09-03 · `harness-vong2` · v1.2 BỐN CỬA NÂNG CẤP** — Audit giữ v1.1 ở RC, chỉ
   đúng bốn chỗ; tôi kiểm lại **cả bốn đều đúng** rồi vá, fixture đỏ trước xanh sau (suite 54 → 58).
   Nặng nhất: **làm hỏng file sổ ghim là đường vòng qua lớp bảo vệ sửa tay** — `docSoGhim` bắt
   mọi lỗi rồi trả `null`, và `null` nghĩa là "chưa từng ghim", mà chưa ghim thì bị ghi đè.
   Ba cái còn lại: chưa-ghim-mà-khác bị ghi đè mặc định · file bản khung đã bỏ thành rác vô chủ ·
   cùng số phiên bản trỏ tới hai nội dung khác nhau (nay có `bundle_digest`).

 - **2026-09-03 · `harness-vong2` · VÒNG VÁ THẬT** — Chạy trọn một vòng qua cả hai repo,
   không phải vòng giả: vá thật `claim.mjs` (bỏ `ai: "Claude"` đóng cứng — Codex và Antigravity
   cũng dùng lệnh đó, nên bảng quyền ghi sai chủ ở mọi lượt nhận), bơm 1.2.0, rồi `--plan` →
   `--apply` → `npm test` → commit ở cả hai repo. Cả hai nay ghim **1.2.0**, plan sạch.
   Lần đầu chạy KHÔNG bắt được gì, và đó là câu trả lời đúng: v1.2 chỉ sửa `upgrade.mjs`, mà
   file đó **ở lại nhà** — không nằm trong tầng máy đi theo. Phải có một bản vá vào file
   PORTABLE thì vòng vá mới có nghĩa.

 - **2026-09-03 · `harness-vong2` · v1.2.1 + CI** — Audit độc lập đọc lại bốn cửa của v1.2 và
   thấy **ba cái không đóng**, cùng một hình dạng: thông báo có, hành động không. (a) cùng số bản
   khác nội dung chỉ in cảnh báo rồi VẪN nâng cấp và VẪN ghi lại sổ ghim; (b) sổ ghim thiếu
   `bundle_digest` thì cửa (a) **tự tắt** — xoá đúng một dòng là vượt qua, cùng kiểu đường vòng
   mà `SO_GHIM_HONG` sinh ra để chặn; (c) file `ĐÃ BỎ` kể tên đúng một lần rồi rơi khỏi sổ sau
   `--apply`. Thêm (d): `claim --take` chạy lại mà không khai `--ai` thì **xoá tên AI đã biết**.
   Cả bốn đã vá, đột biến ngược 4/4 đều bị bắt. Suite 61 (8 file).
   Phép kiểm cũ cho (a) mang đúng tiêu đề "→ DỪNG" nhưng chỉ soi thông báo trên `--plan`, nên nó
   xanh trong khi `--apply` vẫn đi tiếp — **một phép kiểm xanh không bảo vệ gì cả**. Nay kiểm cả
   ba vế: thoát khác 0 · file trên đĩa không đổi · sổ ghim không đổi.
   **CI** (`.github/workflows/cong-kiem.yml`): mọi lớp bảo vệ trước nay chạy trên máy người dùng
   nên `git push` trần đi qua hết. Còn hở, nói thẳng: đỏ trên CI **chưa tự chặn merge** (một nút
   trong Settings của GitHub, quyền của Đức), và phép kiểm secret chưa chạy trên CI — bật Secret
   scanning + Push protection của GitHub thì tốt hơn regex của mình, vì nó chặn ngay lúc push.

 - **2026-09-03 · `harness-vong2` · CI ĐỎ NGAY LƯỢT ĐẦU, VÀ ĐÓ LÀ LỖI THẬT** — `init-repo.mjs`
   tự commit hai lần, nên trên máy chưa khai `user.name`/`user.email` git từ chối ở đúng commit
   đầu — **sau khi** đã ghi cả bộ khung ra đĩa: repo dựng nửa chừng, thông báo duy nhất là của
   git và không nhắc gì tới bộ khung. Không máy phát triển nào bắt được (máy nào cũng khai danh
   tính từ lâu), mà người dùng thật thì đúng là ngồi trên máy sạch. Nay dừng sớm với
   `THIEU_DANH_TINH_GIT`, chỉ luôn hai lệnh sửa, **chưa ghi file nào**. Phép kiểm dựng lại máy
   sạch bằng `GIT_CONFIG_GLOBAL`/`GIT_CONFIG_SYSTEM` trỏ vào chỗ không tồn tại. v1.2.2, suite 62.
   Bài học: CI không kiểm giỏi hơn cổng đóng phiên — nó chỉ chạy ở **một chỗ khác**, và chỗ khác
   đó là chỗ duy nhất giống máy người dùng.

 - **2026-09-03 · `harness-vong2` · CỔNG CẤU TRÚC TRÊN CI CÓ RĂNG (v1.2.3)** — Audit chỉ đúng
   một chỗ vô hiệu hoá gần hết giá trị của CI: `bootstrap.blocking` **để rỗng**, mà
   `check-bootstrap` chỉ thoát khác 0 khi một mã trong danh sách đó đỏ. Nên B1–B15 in ĐỎ đầy
   màn hình mà CI vẫn xanh, và bật "required status check" cũng không sửa được — nút đó cưỡng
   chế một kết quả, mà kết quả đang là xanh. Đã bật tám mã `B1 B2 B3 B4 B5 B7 B10 B12` (repo
   đang 0 đỏ nên bật được ngay). **F9** giữ hai vế: cấu hình có bật đủ không, và cơ chế có răng
   không — dựng repo thật, làm đỏ B3, xem lệnh có thoát khác 0. Đột biến ngược cả hai vế đều bị
   bắt. Suite 63.
   Bẫy F9 tự dạy lại: sửa `.repo-structure.json` rồi chạy ngay là **không có tác dụng gì** — bộ
   kiểm đọc cấu hình từ HEAD. Phải commit trước.
   **`--plan` thôi nói sai:** câu cuối trước đây chỉ đếm file nên sai cả hai chiều — bảo chạy
   `--apply` cho ca `CHƯA GHIM` mà apply sẽ từ chối, và bảo "không có gì để nâng cấp" khi nội
   dung khớp nhưng số ghim ở đích còn cũ (apply lúc đó có việc thật: đóng lại dấu phiên bản).
   Vòng vá 1.2.2 sang hai repo: nội dung không đổi (bản vá nằm ở `init-repo.mjs`, file **ở lại
   nhà**), chỉ đóng lại dấu — cả hai nay ghim 1.2.2.

 - **2026-09-03 · `harness-vong2` · VÒNG VÁ 1.2.3 + CHẶN MERGE THÌ KHÔNG BẬT ĐƯỢC** — Vòng vá qua
   hai repo: nội dung tầng máy **không đổi** (bản vá 1.2.2/1.2.3 nằm ở `init-repo.mjs` và
   `upgrade.mjs` — hai file **ở lại nhà**), nên chỉ đóng lại dấu phiên bản. Cả hai nay ghim
   **1.2.3**. Đó cũng là ca mà `--plan` trước đây nói sai ("không có gì để nâng cấp") và nay nói
   đúng.
   **Phát hiện khi soi hai repo:** cả hai cũng để `bootstrap.blocking` RỖNG. NAV đang 0 chỗ đỏ →
   đã bật đủ tám mã. **3AI có 63 chỗ ĐỎ ở B10** (CLAUDE.md chứa dòng luật không có trong
   AGENTS.md) — bật vào là tự khoá repo, nên **chưa bật**, và `_root`/`_code` ở đó đang do phiên
   `migrate-3ai` giữ nên tôi chỉ đọc. Việc còn treo: dọn B10 rồi mới bật.
   **Hai nút GitHub thì KHÔNG bật được, và không phải vì làm sai.** Codex chạy thật, tôi kiểm lại
   bằng `gh api` của mình: tài khoản gói **free** + repo **private** → cả `branches/*/protection`
   lẫn `rulesets` đều trả `403 "Upgrade to GitHub Pro or make this repository public"`, và secret
   scanning trả `422 "not available for this repository"`. Ba đường ra, **và cả ba đều là quyết
   định của Đức**: (a) nâng lên GitHub Pro; (b) để repo public; (c) chấp nhận CI chỉ **báo** chứ
   không **chặn** — lúc đó `git push` trần vẫn đi qua được mọi cổng, đúng chỗ hở đã ghi từ đầu.

 - **2026-09-03 · `harness-vong2` · v1.2.4 RELEASE-INTEGRITY** — Audit độc lập chỉ hai lỗ, tôi
   kiểm lại **cả hai đều đúng**, và lỗ hạ cấp thì **dựng lại được nguyên vẹn**: repo ghim 1.3.0 bị
   bộ khung 1.2.3 ghi đè, sổ tụt về 1.2.3, thoát 0, không cảnh báo. Gốc chung: bản trích và số
   phiên bản đều dựng từ nguồn đang sống, nên không gì ghi lại "1.2.4 là nội dung nào".
   Thêm `RELEASE-LEDGER.json` (chỉ thêm) — ba chỗ cùng chặn: `npm test` · bộ sinh từ chối tự sửa
   dòng cũ · `upgrade.mjs` không phát đi được với MỌI repo đích kể cả `--force`. Thêm `HA_CAP`.
   Năm đột biến ngược, cả năm bị bắt. Suite 66.
   Cũng dọn nhà: `bam` · `fileMay` · `bamBanTrich` chuyển sang `build-template.mjs` (chúng mô tả
   BẢN TRÍCH, không mô tả việc nâng cấp), giữ lối vào cũ ở `upgrade.mjs` để không bẻ nơi gọi.
   **Đã đồng bộ NAV lên GitHub** (audit đọc qua connector nên commit chưa push là vô hình): nay
   `blocking` tám mã + sổ ghim 1.2.3. **3AI thì không push được** — nhánh đang 19 commit trước
   remote, phần lớn là của phiên `migrate-3ai`, và đẩy hộ việc người khác không nằm trong luật.
   Một lần suýt hỏng, ghi lại để phiên sau tránh: `git add -A` ở NAV cuốn theo **109 file
   `data/ta/**`** đang có thay đổi chưa commit của người khác. Đã `reset` và commit lại bằng
   đường dẫn tường minh. Ở repo dùng chung, `git add -A` là một cái bẫy.

 - **2026-09-03 · `harness-vong2` · v1.2.5 LEDGER-HARDENING** — Audit đọc lại chính sổ phát hành
   vừa dựng ở v1.2.4 và thấy **nó fail-open**: bắt lỗi rồi trả `{}`, nên "hỏng" và "không có" đổ
   chung một rổ, và rổ đó thì bộ sinh **tự ghi lại**. Tôi vừa dựng lại đúng cái bẫy `SO_GHIM_HONG`
   đã vá ở v1.2.1. Đã kiểm bằng tay: xoá sổ → chạy bộ sinh → sổ mọc lại y nguyên, thoát 0.
   **Bài học ghi vào code:** bất cứ chỗ nào `catch` rồi trả một giá trị "trống" đều là một cửa hậu.
   Vá: bốn trạng thái (`KHÔNG`/`CÓ`/`HỎNG` + `SUA_LICH_SU`); mọi khoá đã có **trong HEAD** phải y
   nguyên (sổ thôi tự làm chứng cho chính nó); preflight trước khi ghi `template/`.
   Sáu đột biến ngược: năm bị bắt. Cái thứ sáu không bắt được vì preflight đã chặn trước — **giữ
   nguyên và ghi `ponytail:` tại dòng đó**, thay vì viết một phép kiểm giả để tô xanh.
   Cũng sửa: repo canonical đã đổi tên thành `Ark_Repo_Harness_Template`; trường `source` trong
   sổ ghim và `git remote` ở máy này còn trỏ tên cũ (đang sống nhờ redirect của GitHub). Suite 69.

 - **2026-09-03 · `harness-vong2` · v1.2.6 HISTORY-WITNESS** — Nhân chứng của v1.2.5 là `HEAD`, mà
   **trên CI `HEAD` chính là commit đang kiểm**. Nên commit nào sửa một dòng cũ thì cả hai vế đều
   mang giá trị đã sửa — phép so **so một thứ với chính nó**. Fixture 14 cũng xanh vô nghĩa vì nó
   chỉ dựng ca sửa-mà-chưa-commit. Nay nhân chứng là **giá trị lần đầu một khoá xuất hiện trong
   lịch sử**: nằm ở một commit đã qua, muốn đổi phải viết lại lịch sử.
   Hai chỗ fail-open đi kèm, **cùng một hình dạng đã diệt hai lần trước**: `git show` lỗi → "chưa
   có lịch sử" → đi tiếp; và **kho git nông** (mặc định của nhiều CI) cho nhân chứng cụt mà vẫn
   báo NGUYÊN VẸN — tệ hơn không có. Cả hai nay dừng.
   Bốn đột biến, cả bốn bị bắt. **Hai cái lượt fixture đầu của tôi bỏ lọt**: không có ca kho nông,
   và `kiemSoPhatHanh` nuốt mất trạng thái HỎNG nên cổng kiểm không bao giờ thấy — tức phép kiểm
   kia chỉ là một hàm đẹp không ai hỏi. Đã thêm cả hai. Suite 72.

 - **2026-09-03 · `harness-vong2` · v1.2.7 WITNESS-READ-FAILCLOSED** — Trong chính vòng đọc nhân
   chứng của v1.2.6 còn `catch { continue }`: một commit nhân chứng đọc không nổi thì bị bỏ qua
   im lặng, và một commit **muộn hơn** thành "lần đầu" — nhân chứng bị thay mà vẫn báo NGUYÊN VẸN.
   **Lần thứ TƯ trong một ngày cùng một hình dạng** (`catch` → giá trị "trống"): v1.2.1 sổ ghim →
   v1.2.5 sổ phát hành → v1.2.6 git hỏng → v1.2.7 từng commit nhân chứng.
   Tách bằng `git cat-file -e`: file chưa có (hoặc commit đó xoá nó) → bỏ qua hợp lệ; file có mà
   đọc không nổi → dừng, nêu đúng commit. Có **đối chứng dương**: lịch sử sạch có commit xoá rồi
   tạo lại vẫn phải NGUYÊN VẸN — không thì một lần lỡ tay xoá là khoá vĩnh viễn cả bộ khung.
   **Fixture suýt xanh vì lý do sai:** lượt đầu tôi nhét hai kiểu hỏng vào cùng một lịch sử, mà
   vòng duyệt dừng ở commit hỏng ĐẦU TIÊN nên không bao giờ tới kiểu thứ hai — đột biến "bỏ phép
   kiểm schema" vẫn xanh. Nay mỗi kiểu một kho riêng, đột biến bắt được cả hai. Suite 73.

 - **2026-09-03 · `harness-vong2` · v1.2.8 EXISTENCE-PROBE-FAILCLOSED** — `cat-file -e` của v1.2.7
   trả khác 0 cho **cả hai** thứ: đường dẫn không có, và git hỏng. Bắt chung rồi `continue` là lại
   gọi ca thứ hai là "commit xoá file". **Lần thứ NĂM cùng một hình dạng trong một ngày**, và nó
   dịch xuống từng tầng: sổ ghim → sổ phát hành → git hỏng → từng commit nhân chứng → phép dò.
   `ls-tree` tách được vì trả lời bằng hai kênh: mã thoát = git chạy được không, output rỗng =
   đường dẫn có không.
   Ca "git hỏng GIỮA CHỪNG" không dựng nổi bằng kho thật, nên `soVoiLichSu` nay nhận bộ chạy git
   **tiêm được**. Nhánh không chạy tới được thì chưa bao giờ là lớp bảo vệ. Suite 74.
   **Sửa lại một câu tôi nói sai ở phiên trước:** tôi ngụ ý 164 giây là bộ phép kiểm quá to. Không
   phải — CI Linux chạy trọn bộ trong ~29 giây. Đó là chi phí spawn tiến trình của Windows. Ngân
   sách 180 giây **không cần nới**, và **không được gộp fixture cho nhanh**: chính lượt v1.2.7 đã
   chứng minh gộp ca làm nhánh sau không bao giờ chạy tới.

 - **2026-09-04 · `harness-vong2` · v1.2.9 SAFE-PUSH BIẾT NHÁNH** — `main` bị đóng cứng ở **mười
   chỗ** trong `safe-push.mjs`, nên công cụ chỉ phục vụ được một hình dạng repo. Đo thật ở 3AI:
   toàn bộ việc bộ khung nằm trên một nhánh tính năng, và đường duy nhất công cụ mở ra là
   `HEAD:main` — tức một cú **hợp nhất**, thứ luật bắt phải hỏi Đức. Nay nhánh đích bằng chính
   nhánh đang đứng; nhánh chưa có upstream thì từ chối.
   **Luật merge vào main không bị nới, nó chặt hơn:** trước là một câu `if` ở cuối file (một cửa
   có thể quên mở đúng chỗ), nay ca đó **không dựng nổi**.
   Bài học phép kiểm: fixture đầu chỉ chạy `--dry-run` nên đột biến "quay về `HEAD:main` ở câu
   đẩy" vẫn XANH — nó chứng minh BẢN BÁO CÁO, không chứng minh CÚ ĐẨY. Nay fixture đẩy thật vào
   một kho bare rồi đọc lại HAI ref: nhánh tính năng phải tiến, `main` phải y nguyên. 3/3. Suite 75.

 - **2026-09-04 · `harness-vong2` · v1.2.10** — Hai lỗ, cùng một gốc: **bộ khung mặc định mọi repo
   có hình dạng giống nó.** (a) `session-check.mjs` so với `origin/main` đóng cứng ở mười chỗ —
   cùng bệnh v1.2.9 ở tool anh em. Trên nhánh tính năng mà nhánh gốc chưa có `HANDOFF.md` thì
   `git show origin/main:HANDOFF.md` NỔ → `GIT_HONG` → theo đúng luật fail-closed của chính nó,
   **mọi con số phía trên thành "đoán"**. Cổng ở 3AI **không thể xanh** trên nhánh đó. (b) B10 quét
   cả file trong vùng `append-only`: **29/63** phát hiện ở 3AI nằm trong gói phát hành đã niêm
   phong, tức "dọn" chúng là phá niêm phong. **Một phép kiểm đòi sửa thứ repo cấm sửa thì không
   bao giờ thoả được, và luật không thoả được thì bị bỏ qua cả cụm.**
   Đối chứng dương cho (b): vùng `rw` vẫn soi — bỏ qua tuốt là làm yếu lớp bảo vệ. Đột biến 4/4.
   Suite 77.
   Ba lỗ (không phải hai): vá xong hai lỗ trên thì lộ lỗ thứ ba — `git show <mốc>:HANDOFF.md`
   thất bại vì **file do bộ khung thêm vào nên chưa có trên nhánh gốc**, và `git()` gộp nó thành
   `GIT_HONG`. Vòng luẩn quẩn: cổng đòi xanh mới được đẩy, mà đẩy xong nó mới hết đỏ. **Lần thứ
   sáu** cùng hình dạng; tách bằng `ls-tree` như v1.2.8.
   Hai bài học: (1) **hai bản vá che nhau** — sau khi vá lỗ ba, đột biến "đóng cứng lại
   `origin/main`" HẾT ĐỎ, vì nó không còn nổ, chỉ so mốc sai một cách **im lặng**; phải thêm một
   khẳng định về chính cái mốc mới bắt lại được. (2) Bản vá đầu có thêm một hàm `gitYen`; dựng thử
   ca hỏng cho nó thì **không dựng nổi**, nên đã **xoá hẳn** thay vì giữ một lớp không canh gì.
   Và cơ chế sổ phát hành của v1.2.4 **chặn chính tôi** giữa lượt này: đổi file tầng máy sau khi
   đã đóng dấu 1.2.11 → bộ sinh từ chối → phải lên 1.2.12.

 - **2026-09-04 · `harness-vong2` · v1.2.13** — Phép kiểm secret gộp **ba lý do** vào một rổ "không
   kiểm được": đọc lỗi · quá lớn · **nhị phân**. Nên **mọi repo có một cái ảnh** đều mang vĩnh viễn
   một mục `[BỎ]` — cổng **không bao giờ xanh được ở repo thật nào**. Đo ở 3AI: 33 file PNG/XLSX
   giữ cổng ở "chưa đủ bằng chứng" mãi mãi.
   **Không phải nới lỏng:** phép kiểm giải UTF-8 rồi dò mẫu CHỮ, nên nó chưa bao giờ soi được file
   nhị phân — gọi tên đúng thứ nó vốn không làm được thì không mất một phát hiện nào. Hai lý do kia
   **giữ nguyên là KHÔNG BIẾT** (đối chứng dương cho đúng vế đó), và vẫn phải **kể ra** số file đã
   bỏ qua. Đột biến 3/3. Suite 78.

 - **2026-09-04 · `harness-vong2` · v1.2.14** — Vá xong v1.2.13 mà ở 3AI **vẫn còn 4 file kẹt**, cả
   bốn là PNG/PPTX. Lý do: ngưỡng kích thước chạy **TRƯỚC** phép thử nhị phân, nên một tấm ảnh 3MB
   bị gọi là "quá lớn" — tức KHÔNG BIẾT — trong khi ta biết thừa nó là ảnh. "Có phải nhị phân
   không" **không phụ thuộc kích thước**; ngưỡng 2MB để tránh giải mã một file VĂN BẢN khổng lồ,
   nên nó thuộc về sau. Ở 3AI: **33 → 4 → 0**. Đột biến 4/4.
   Và cổng vừa bắt chính tôi: bản ghi v1.2.14 đầu tiên tôi **sửa dòng Log cũ** thay vì thêm dòng
   mới — Log chỉ được THÊM. Đã khôi phục dòng cũ và ghi thành một dòng riêng.

 - **2026-09-04 · `harness-vong2` · v1.2.15 (FINAL-CLOSURE P1+P2)** — Hai lỗ cùng một kiểu: **một
   mặc định "cho tiện" thay chỗ một câu từ chối.**
   **P1:** v1.2.9 viết `nhanhHienTai !== "HEAD" ? nhanhHienTai : "main"`, nên `detached HEAD` lặng
   lẽ hoá thành `main` rồi đẩy `HEAD:main` — đúng cú HỢP NHẤT mà luật mục 2 bắt hỏi Đức, tới bằng
   đường **tai nạn**. Và nó **tệ hơn bản trước v1.2.9**: hồi đó có câu `if` chặn mọi thứ không phải
   `main`; cái lùi-về-mặc-định xoá mất câu đó. Đã dựng lại được thật rồi vá: nay TỪ CHỐI.
   **P2:** giành vùng chỉ có đường tay, nên câu chốt của Đức **không đi vào bảng** — mà người cần
   đọc nó là phiên vừa MẤT vùng, và họ chỉ đọc bảng. Nay có `--duc-duyet`, ghi thẳng vào
   `taken_from`/`taken_by`/`duc_decision`.
   **Và cửa trả bằng tiền thật:** vùng còn **file sửa dở của chủ cũ** thì KHÔNG giành được, kể cả
   khi Đức đã chốt. Câu chốt nói "vùng này chuyển tay", nó không nói "được đè lên file người ta
   đang sửa". Đây chính là sự cố `AGENTS.md`/ClauCo hôm nay, nay thành luật máy. Chặn ở lúc GIÀNH,
   không phải lúc commit — tới lúc commit thì người ta đã tin mình có quyền rồi. Không đo được thì
   TỪ CHỐI, không coi là sạch.
   Đối chứng dương cho cả hai: vùng sạch vẫn giành được, file dở ở vùng KHÁC không bị chặn oan.
   Đột biến 5/5. Suite 80.

 - **2026-09-04 · `harness-vong2` · v1.2.16 (FINAL-CLOSURE P3)** — `can-nang.mjs` đếm ra: qua **46
   lượt chạy cổng**, sáu phép kiểm **chưa từng đỏ lần nào**. Đó không phải bằng chứng chúng tốt —
   nó là bằng chứng **chưa ai thử**. Và một phép kiểm chưa từng đỏ với một phép kiểm **không thể**
   đỏ trông giống hệt nhau trên bảng, mà bảng thì luôn xanh.
   `tests/cong-do-that.mjs`: mỗi khối dựng một kho git thật, phá **đúng một** thứ, đòi **đúng phép
   kiểm ấy** đỏ. Không thêm phép kiểm mới.
   Ba chỗ cố ý làm chặt vì đây đúng loại phép kiểm dễ xanh vì lý do sai: (a) **tách ra đúng một
   mục theo tên**, không chỉ đòi "cổng đỏ" — cổng có thể đỏ vì chuyện khác trong khi mục ta đang
   chứng minh chưa hề chạy tới; (b) **đối chứng dương ở mỗi khối** — nền phải XANH trước khi phá;
   (c) vùng bằng chứng có **đối chứng ngược**: *thêm* file vào vùng chỉ-thêm phải **vẫn xanh**,
   không thì một phép kiểm chặn tuốt cũng qua được.
   `Nhãn lane` phải phá đúng cách: **thiếu** nhãn chỉ nhắc (509 commit lịch sử không nhãn — đỏ vì
   thiếu là chặn oan), chỉ nhãn **hỏng** mới đỏ. Phép kiểm giữ cả hai vế.
   Đột biến: tắt từng phép kiểm trong sáu, **cả sáu** đều bị bắt. Suite 86.

 - **2026-09-04 · `harness-vong2` · v1.2.17** — Cái cân **thôi hỏi lại câu đã có đáp án**. "Chưa từng
   đỏ" đếm lượt chạy THẬT, nên ca hỏng dựng trong phép kiểm không bao giờ vào đó — danh sách sẽ lặp
   y nguyên sau mỗi phiên, kể cả sáu mục vừa được chứng minh ở v1.2.16. **Một lời nhắc đã được trả
   lời mà vẫn kêu là cách nhanh nhất khiến người ta bỏ qua cả danh sách.** Nay `can-nang.mjs` dò tên
   từng mục trong `tests/cong-do-that.mjs` và tách hai nhóm: còn phải hỏi · đã có ca hỏng dựng sẵn.

 - **2026-09-04 · `harness-vong2` · v1.2.18 (FINAL-CLOSURE P4)** — Dọn chỗ **tự mâu thuẫn** rồi
   đóng băng mốc.
   Mâu thuẫn thật, sống nhiều ngày: `STATUS.md` vẫn ghi *"chưa từng chạy trên repo thật khác nghề ·
   nhãn `unproven` vẫn đúng"* trong khi bộ khung đã chạy thật ở **hai** repo và gỡ nhãn đó từ
   `1.0.0`. **Bảng đọc frontmatter, người đọc thân bài** — nên hai bên nói ngược nhau mà không ai
   thấy. Cùng câu sai đó còn nằm ở `AGENTS.md` (dòng bản đồ quy trình migrate) và
   `docs/workflows/02-…` (cả frontmatter `mat:` lẫn câu trạng thái). Sửa cả bốn chỗ.
   `docs/ROADMAP-V1.md` mở đầu bằng *"Nó chưa là v1.0"* trong khi D1–D4 đều xong từ lâu → đánh dấu
   ✅ từng khối, `status: done`, và đổi hai đường link trỏ vào nó (AGENTS + STATUS) sang "đây là
   lịch sử". **Giữ file, không xoá:** phần *vì sao* vẫn đáng đọc.
   **KHÔNG sửa các dòng Log cũ** dù chúng cũng nói `unproven` — chúng **đúng lúc viết**, và Log chỉ
   được THÊM. Sửa lịch sử cho khớp hiện tại là xoá mất bằng chứng mình từng ở đâu.
   **Đóng băng:** [ADR-0003](docs/adr/0003-dong-bang-stable-baseline.md) chốt `v1.2.17` là mốc
   Stable Baseline, và chuyển sang chế độ bảo trì — vá thì vẫn vá, nhưng ngưỡng mở hệ thống con
   mới cao hơn: phải có lỗi thật và dựng được ca hỏng. Repo thứ ba trở đi lắp **từ mốc**, không
   lắp từ HEAD đang chạy. Chỗ hở duy nhất còn lại ghi thẳng trong ADR: CI **báo** chứ chưa
   **chặn**, và đó là quyết định gói GitHub của Đức, không phải thứ code tự đóng được.

