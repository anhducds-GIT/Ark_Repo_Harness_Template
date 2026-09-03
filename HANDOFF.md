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
