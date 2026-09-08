# HANDOFF — bàn giao giữa các phiên

> **Chỉ THÊM dòng, không sửa dòng cũ.** Phiên sau đọc **phần CUỐI** file này trước tiên.
> Mỗi phiên ghi đúng ba thứ: làm gì · kết quả bằng số · còn gì mở.

## Trạng thái hiện tại

Repo này là **nhà riêng của bộ khung**. Nó vừa được tách ra khỏi repo sinh ra nó
(`Chrome_Extension_AI_Agentic`) theo quyết định ADR-0001.

Nó **tự dựng bằng chính bộ khung của mình** — không phải một thư mục chép tay. Và nó tự sinh lại
được bản trích trong `template/`: `npm run template -- --check` phải luôn khớp.

## Log
**Phần CŨ hơn đã dời sang kho lưu trữ** — [`docs/archive/`](docs/archive/) · chữ giữ nguyên từng dòng, cắt bằng `npm run don`.


> **Lượt CŨ hơn đã dời sang** [docs/archive/HANDOFF-202609.md](docs/archive/HANDOFF-202609.md) — chữ giữ nguyên từng dòng.


## 2026-09-07 · claude-k7-tangmay · bản 1.3.34 — danh mục tính năng đo được, và đề bài onboard

**Dựng danh mục: 9 khối · 41 mục · mỗi mục một phép đo.** `features.json` + `npm run features`,
chạy được ở bất kỳ repo nào. Ba trạng thái, và `MỘT PHẦN` đếm riêng vì nó nguy hiểm hơn `THIẾU`.

**Đo ngay lượt đầu đã ra kết quả dùng được:** một repo đã lắp có `scripts/session-check.mjs` mà
**thiếu `npm run gate`** — cổng có mặt mà không ai gọi được bằng tên chuẩn, nên trên thực tế nó
không tồn tại. Ba mục như thế. Lượt migrate trước chép file mà không chép lệnh, và **không có gì
bắt được** cho tới khi có bộ đo này.

**Đề bài `onboard`** — việc thứ tư của lệnh giao việc, và là việc duy nhất giao cho phiên AI
**thường trú** của repo đích. Nó mang theo checklist tính năng đã đo tại repo đó.

### Hai lỗ vá TRƯỚC khi ghi vào repo nào — cả hai lộ ra lúc đọc bản `--plan`

- Định nghĩa "tầng máy" là hai tên thư mục, nên `bang-song/` bị bỏ quên: repo đích sẽ nhận phép
  ghim mà không nhận thứ nó kiểm. Dấu vân tay bản phát cũng bỏ quên nó — sổ phát hành nói dối về
  nội dung một bản đã phát.
- Định mang phụ lục nghề **lái trình duyệt** sang một repo **chứng khoán**, trong khi dòng đầu file
  đó tự viết *"repo bạn không lái trình duyệt thì xoá file này"*.

### Một lỗi tôi lặp BA LẦN trong cùng một file, và luật rút ra

`tests/features-smoke.mjs` đi theo bản trích nên chạy ở HAI loại repo. Ba vế của nó đặt câu hỏi chỉ
đúng ở nơi phát hành rồi đỏ trong repo hạt giống. Luật ghi thẳng vào đầu file: **mỗi vế phải trả
lời được "câu này có nghĩa gì ở repo đã lắp?"** — không trả lời được thì rẽ nhánh và đặt câu tương
đương, **đừng bỏ trắng, vì một vế bỏ trắng đọc y hệt một vế đã đạt.**

Và bug tương ứng trong bộ đo: nó suy "đây là nơi phát hành" bằng **so đường dẫn với chính mình** —
sai ở mọi repo đích, vì file đi theo bản trích. Nay suy bằng hai dấu hiệu đo được.

**Còn mở:** ghi checklist vào tab Migrate của bảng · `Y-09` phát sang hai repo (Đức đang xem bản kế
hoạch) · `KHUNG-37` `@Đức:bấm`.

## 2026-09-07 · claude-bang-gon · bản 1.3.35 + 1.3.36 — bảng gọn lại (đo được), checklist vào tab Migrate, và lỗ thứ ba của tầng máy

**Làm gì:** năm phản hồi bố cục của Đức, checklist tính năng lên tab Migrate, `Y-09` phát bảng
sang repo đã lắp, và hướng dẫn kiểm tra đầy đủ.

**Số đo bố cục, trên màn 1440×900, đo bằng chính trình duyệt trước và sau:**

| | Trước | Sau |
|---|---|---|
| đầu trang (header + lề + thanh tab) | 270px | **105px** |
| tab Vận hành | **16,0 màn hình** | **3,7** |
| tab Cấu trúc | **10,1 màn hình** | **3,5** |
| tab Ý tưởng | 1,9 | 1,4 |
| khung nội dung | 1080px / màn 1440 | 1280px |

**Số đo chỉ ra chỗ khác hẳn chỗ đang nghi** — và đây là phần đáng giữ lại: tab Vận hành cao 16
màn hình vì **ba tài liệu đổ thẳng ra không gập** (11.223px trong 14.442px), tab Cấu trúc cao 10
màn hình vì **bản đồ file in HAI LẦN trên cùng một tab**. Không phải vì CSS thưa. Sửa CSS mà
không đo thì đã gọt chỗ không đau và để nguyên chỗ đau.

**Ô "Làm mới bảng"** ở tab AI điều phối: hai câu trả lời **cạnh nhau** cho cùng một cú F5 — bảng
sống đọc bảng quyền từ đĩa (F5 là thấy), bảng đã commit suy từ HEAD (F5 không đổi số). Cổng đọc
từ mã nguồn, đọc không ra thì nói thẳng. Mỗi thứ copy được có một nút COPY.

**Checklist tính năng lên tab Migrate**, kèm ngày đo và bản danh mục. Ba hồ sơ đã đo lại và
**thêm khối** (chỉ thêm, không sửa dòng cũ): `17/34` · `19/34` · `24/34`.

**LỖ THỨ BA của tầng máy, cùng một hình dạng:**

| Lần | Lỗ | Vì sao lọt |
|---|---|---|
| 1.3.26 | `bang-song/` không được phát | tầng máy định nghĩa theo **tên thư mục** |
| 1.3.35 | **tên lệnh** không được phát | **không tầng nào** nhận `package.json` |
| 1.3.36 | `features.json` không được phát | phép "theo đuôi file" chỉ nhận thứ **chạy được** |

**Y-09 — phát thật, và số đo trả lời được nó:** `ALL_SKILL_MANAGEMENT` nhận `1.3.19 → 1.3.36`.
Đo tại chính repo đó: **24 xong · 3 một phần · 7 thiếu → 30 xong · 0 MỘT PHẦN · 4 thiếu**. Ba mục
`[~]` là cùng một bệnh — file có mà `npm run gate` không có. `npm test` ở đó exit 0, sáu suite
xanh (đã **nối** ba suite mới vào chuỗi `test` của chính repo đó, không ghi đè). Chạy thật một
cửa `.cmd`: nó né cổng 4747 sang 4748 và **tự dừng sinh** vì `_code` đang bị giữ.

**Một lỗi lộ ra lúc đo:** bảng của repo đích **tự gọi mình là "bộ khung"** — câu tự giới thiệu gõ
cứng vào bộ sinh, mà bộ sinh đi theo bản trích. Nay đọc từ `repo.tagline`.

**Và phát hiện đáng giá nhất:** lượt đo đột biến **đầu tiên không dùng được**. Bốn đột biến đều
"chết", nhưng chết vì **cổng dấu vân tay nổ trước** — vế đang đo chưa hề chạy. Chạy riêng ra mới
thấy, và lúc đó lộ ra một phép trong bốn đang **hỏng**: nó ném `SyntaxError` chứ không assert, và
không lộ ra ở lần chạy xanh vì nhánh đó chỉ vào khi có ca hỏng thật. Luật rút ra đã ghi vào
`decisions.md`: **một đột biến chết vì lý do khác thì nó chứng minh KHÔNG GÌ CẢ.**

**Phép kiểm:** `overview-doc-smoke` 10→**12 vế** · `upgrade-smoke` 22→**24 vế**. **Mười sáu đột
biến đã chạy thật**, không cái nào sống sót. `npm test` exit 0.

**Còn mở:** `nav_platform_main` chưa nâng (đang làm) · `Project 3 AI Agent Unify` **KHÔNG nâng** —
luật 8A *Cloud Sync Hold* của chính repo đó chặn, và Đức đã hoãn `KHUNG-30`; luật chủ nhà thắng
trên đất của nó · `KHUNG-39` mới: `.gitignore`/`.gitattributes` nằm trong bản trích mà không tầng
nào phát, đã vá tay cho hai repo · cân nặng vượt ngân sách 3 chỗ (`npm run don` là nhịp riêng).

## 2026-09-07 · claude-bang-gon · bản 1.3.37 — bảng gom BỐN nhóm, và nhật ký thôi sinh ra việc

**Làm gì:** audit UX nói bảng *fragment* và *tự mâu thuẫn*. Đo cả hai, tìm ra gốc, sửa gốc.

**Bằng chứng, đếm trên bản ĐÃ COMMIT — không đọc cảm giác:** bản đồ file vẽ **3 lần**; Cần Đức ·
Sức khoẻ · Ý tưởng · Giao việc · Làm mới bảng vẽ **2 lần** mỗi thứ. Không lần nào là tóm tắt.

**Mâu thuẫn "4 vs 13" có HAI gốc, không phải một lỗi:**

| Con số | Gốc |
|---|---|
| **13** | `HANDOFF.md` bị quét tìm dấu `@Đức:` — **8/13 dấu là ảo** |
| **4** | một câu **gõ tay** trong `STATUS.md`, đã lệch: 2/4 mã nó nêu đã đóng |

`HANDOFF.md` là nhật ký **chỉ thêm dòng**. Nên mỗi lần một phiên *kể lại* rằng có việc chờ Đức
thì lần kể đó thành **một việc mới, vĩnh viễn** — con số tăng theo **số phiên**, không theo số
việc. Một dấu ảo còn nằm trong chính câu **giải thích quy ước dấu**: bảng biến sách hướng dẫn của
nó thành việc phải làm. **13 → 5** sau khi sửa.

Cùng trường gõ tay đó còn ghi *"Bản 1.3.14 · bảng nay có chín tab"* trong khi repo ở 1.3.36 với
10 tab — và câu ấy chảy vào `DASHBOARD.md` + `repo-map.json`, tức **một câu cũ làm ba artifact máy
sinh nói sai cùng lúc**. `docs/HUONG-DAN.md` cũng còn ghi *"tám tab"*.

**IA: 10 tab ngang hàng → BỐN nhóm có thứ bậc** — Tổng quan (đúng ba câu) · Công việc (hành động
được) · Hệ thống (chạy thế nào) · Lịch sử (không hành động được nữa). Ranh **Lịch sử** là luật
thứ nhất phát biểu thành cấu trúc: thứ trong đó **không được sinh ra việc**.

**Số đo, màn 1440×900:**

| | Trước | Sau |
|---|---|---|
| đầu trang | 270px | **124px** |
| Tổng quan | 3,4 màn hình (6 khối) | **0,4** (ba câu) |
| tab Vận hành / Cấu trúc | 16,0 / 10,1 | gộp vào Hệ thống: **5,4** |
| tổng cả bảng | 10 tab ~30 màn hình | **4 nhóm, 14,9** |

**Xoá là thắng:** `khoiNowNext` · `khoiSucKhoe` · `khoiYTuongGon` · `mucLuc` · hai hàm
`sach()`/`gon()` (chỉ tồn tại để cắt câu cho bản đồ file **bản kém**) · 7 dòng CSS · đoạn JS mục
lục. Bộ sinh **−49 dòng thực**.

**Một bug cùng họ, lộ ra lúc đo:** bộ đếm *"code đã đổi sau kiểm chứng"* thấy trang HTML máy sinh
là file `.html` bình thường, nên ở `nav_platform_main` mỗi lượt sinh lại là **+1** và cổng *"Sự
thật máy sinh còn tươi"* **ĐỎ vĩnh viễn** — sinh lại không thoát được. Đúng con bệnh đã ghi trên
`MAY_SINH` cho `repo-map.json`, lặp lần thứ hai. Vá bằng cách **bỏ danh sách**: `tenTrangFrom` dời
sang `repo-structure.mjs`, suy một lần, hai cổng dùng chung.

**Phép kiểm:** `overview-doc-smoke` 12 → **15 vế**. **Tám đột biến, cả tám chết ở ĐÚNG vế nó đo.**

**Bốn phép ghim CŨ đỏ, và cả bốn đỏ ĐÚNG** — chúng ghim đúng cái IA vừa bị đổi: `>= 5 tab` ·
`class="den xanh"` · nhãn `"đang ở đâu"` · `data-tab="migrate"`. Mỗi cái đổi **chỗ nhìn**, giữ
nguyên **điều nó canh**, và ba trong bốn nay neo vào **khoá máy đọc** (`data-cau` · `data-den`)
thay vì tên lớp CSS hay nhãn tiếng Việt — neo vào chữ hiển thị thì đổi cách viết nhãn là phép ghim
mù, và nó mù IM LẶNG.

**Đây là lượt CẮT — số đo cả bộ khung, để lượt sau có mốc:** 69% commit 7 ngày chỉ chạm giấy tờ ·
luật-là-chữ **1.254 dòng** · chốt máy **26** · tài liệu **8.672 dòng** (trần 2.200, vượt 3,9×) ·
sổ nợ mở **15**/39. **48 dòng văn cho mỗi cơ chế thật.**

**Còn mở — việc cắt tiếp, `BACKLOG.md` `KHUNG-40`…`KHUNG-43`:** bảy giới hạn Đức chốt (hai chỗ
cần Đức chốt: **trần dòng luật**, và **có đưa trần vào cổng đóng phiên hay không** — hiện
`can-nang` cố ý nằm ngoài cổng nên **mọi trần chưa từng chặn được gì**) · luật **DỪNG** khi hết
việc sản phẩm · khoá hết hạn khi có người chờ · một trang ADR cho người chủ đọc.

**Một slip của chính lượt này, ghi lại vì nó đúng cái bẫy prompt cảnh báo:** phép ghim mới đếm câu
bằng chuỗi `<div class="bc">`, rồi cùng ngày tôi thêm `data-cau` vào đúng thẻ đó → **mỏ neo khớp 0
chỗ**, và phép kiểm báo *"đang 0 câu"* trong khi trang có đủ ba. Con số 0 ở đây nghĩa là **dụng cụ
đo hỏng**, không phải "trang hỏng" — hai ca đọc y hệt nhau. Tin con số thì lượt sau đi sửa thứ
đang đúng. Nay mỏ neo neo vào **khoá máy đọc** (`data-cau` · `data-den` · `data-tab`), không neo
vào hình dạng thẻ HTML hay chữ hiển thị.

## 2026-09-07 · claude-loi-hai-vai — lõi cấp quyền nguyên tử bằng ref git riêng

**Làm gì.** Dựng `scripts/quyen.mjs` + `tests/quyen-sau-ca.mjs` cho kiến trúc hai vai Assistant
(brief `LAT-CAT-HAI-VAI-01` ở repo Extension). Sổ quyền nằm trên `refs/ark/quyen`, **ngoài lịch
sử `main`** — nên rebase `main` không chạm được nó, và lượt tích hợp cũng là một sự kiện trên
chính ref đó nên lượt kiểm quyền và lượt ghi kết quả hợp thành **một lượt đẩy**.

**Kết quả số.** 41 phép kiểm xanh · **10/10 đột biến bị bắt** · `npm test` xanh toàn bộ.
Chín ca: xin đồng thời · mất quyền quay lại · chen giữa kiểm và ghi · chen sau `fetch` · quyền cũ
sau `rebase` · thế hệ cũ cùng lane · đích đã đổi · đường hợp lệ · fail-closed.

**Đột biến bắt được một chỗ tôi viết SAI**, đáng ghi lại vì nó dễ vấp lại: tôi viết *"đẩy trần
chính là phép so-và-đổi"*. Sai — đó là **hai** lớp của git. Trong một kết nối đẩy, git gửi kèm
giá-trị-cũ lấy từ lượt quảng bá ref, và `--force` **không** tắt được vế đó; nên đột biến `--force`
xanh cả 37 phép kiểm. Cửa sổ thật nằm **sau `fetch`, trước lúc mở kết nối**: ở đó bản cục bộ đã
cũ, đẩy trần bị từ chối còn `--force` **ghi đè và xoá mất sự kiện thu hồi của bên kia**. Ca ③c
chen vào đúng khe đó bằng hook `reference-transaction`.

**Còn mở.** Chưa nối vào `claim.mjs`, chưa vào `template/`, **chưa chuyển quy trình đang dùng** —
đúng mục 6 của brief: chuyển trước khi lõi vượt sáu ca là để hai mô hình cùng sống.
Ranh giới còn hở, khai thẳng: đẩy `main` mà **không** ghi sự kiện tích hợp thì lõi này không thấy.
Chặn được chỗ đó cần **một bên thứ ba** đọc sổ quyền, và bên thứ ba phải không phải bên đang bị
kiểm — chưa làm, và **không** tự bật branch protection.

## 2026-09-07 · claude-loi-hai-vai — vá ba lỗi P1 từ audit độc lập của Codex

**Làm gì.** Phiên Codex audit `quyen.mjs` trên `44f0680` và tìm được ba lỗi thật. Tôi viết phép
kiểm **trước** khi vá: 6 phép kiểm mới **đỏ trên mã cũ**, nên cả ba được xác nhận bằng đo, không
bằng đọc báo cáo.

**Kết quả số.** 41 → **52 phép kiểm xanh** · 10/10 → **14/14 đột biến bị bắt** · cổng XANH.

**Ba lỗi, và cái chung của chúng.** ⑴ Cửa tích hợp chỉ kiểm *có điền không*, không kiểm *điền có
đúng không*: `--co-so` là tuỳ chọn nên bỏ trống là hết kiểm; nền khai được so với lượt tích hợp
trước chứ chưa bao giờ so với **chính commit kết quả**; và một SHA bịa ra (`deadbeef…`) đi qua
trọn vẹn. ⑵ Sổ quyền **hỏng** bị hiểu thành sổ **trống** — `docSo` trả `[]` khi không đọc được,
nên một ref tồn tại mà thiếu file sổ làm công cụ vừa in lỗi vừa **cấp quyền** ở thế hệ 1.
⑶ Kết luận của tôi rộng hơn bằng chứng: tôi viết *"đóng lỗ TOCTOU"* không kèm giới hạn, mà nó chỉ
đóng trong phạm vi **sổ**. Codex chạy được chuỗi A-ghi-nhận → B-thu-hồi → A-đẩy-`main`, cả ba
thành công. **Được ghi nhận KHÁC đã tích hợp.**

**Một chỗ tôi tự dán nhãn sai.** Ca ① tên là *"xin đồng thời"* nhưng gọi A rồi mới gọi B. Cơ chế
vốn đúng — phép kiểm mới là thứ chưa chứng minh được điều nó nói. Ca ⑨ nay cho hai lượt nhận
quyền chen nhau thật bằng hook `reference-transaction`.

**Còn hở, khai thẳng.** `quyen.mjs` **không kiểm đường dẫn**: Codex khai `wrong-area` cho một thay
đổi ở `product.txt` và đi qua được. Nên tên vùng ở đó là **lời khai**, không phải điều đã kiểm.
Bản đồ vùng → đường dẫn nằm ở `.repo-structure.json` của từng repo, còn `quyen.mjs` cố ý không
biết repo nào — nên đó là việc kế tiếp, không phải một dòng thêm vào.

**Đo được lúc dọn cổng:** bảng máy sinh cần **hai lượt** sinh–commit mới hội tụ, vì nó suy từ HEAD
mà chính lượt commit lại đổi HEAD. Cổng của phiên Codex đỏ `TRANG_CU` đúng vì thế.

## 2026-09-08 · claude-cua-kiem — cửa cho đường đẩy `main`, và ứng viên ra ref riêng

**Số đo.** 52 → **79 phép kiểm xanh** · 14/14 → **21/21 đột biến bị bắt** · 9 → **13 ca**.
Chạy lại: `node tests/quyen-sau-ca.mjs`.

**Trả lời chuỗi Codex.** Tôi kết luận sớm rằng *"bật `enforce_admins` cộng một bước Actions là bịt
được khe quyền/main"*. Codex chỉ đúng lý do chưa được: **required status check gắn vào COMMIT** —
xanh cho `C` thì xanh mãi cho `C`, còn nguồn quyền đổi **độc lập** sau đó.

Chốt **không đòi GitHub chấm lại**, nó đổi **câu hỏi**: cửa không hỏi *"có tờ xác nhận nào không"*
mà hỏi *"tờ xác nhận có phải điều CUỐI CÙNG xảy ra với vùng này không"*. Sổ có thứ tự và mọi lượt
ghi qua một phép so-và-đổi, nên lượt thu hồi chen vào **buộc phải** nằm sau tờ xác nhận.

**Ca ⑪ quan sát SHA THẬT của `main`, và đo CẢ HAI đường** — vế thứ hai là chỗ tôi cố ý không che:

| Đường | `main` |
|---|---|
| Đi qua cửa `--cho-day` | **không đổi** |
| **Bỏ qua cửa** | **mã VẪN vào** |

Nên chỗ này **phát hiện được, chưa ngăn được**. Sổ quyền vẫn nói *"không được phép"* dù mã đã nằm
trong `main` — đó chính là hình dạng của khoảng trống.

**Một phát hiện khi dựng ca ⑪:** bên kiểm **không thấy được ứng viên** nếu nó chỉ nằm trong
checkout của A (`UNKNOWN_COMMIT`, và cửa đúng). Nên luồng cần một chỗ **công bố ứng viên KHÔNG phải
`main`** — nay là `refs/ark/ung-vien/<lane>`, có phép kiểm ghim rằng công bố ứng viên **không làm
`main` nhích một byte**.

**Bộ đột biến dạy lại tôi một lần nữa:** 5 lượt báo *"neo khớp 2 chỗ"* thay vì đo được gì — tức tôi
cài một luật **hai lần** (giới hạn ② của Đức). Gỡ một bản thì bản kia vẫn chặn, test vẫn xanh, và
cái xanh đó **không nói gì** về bản bị gỡ. Gộp thành `kiemSieuDuLieu` + `kiemTheHe`.

**Còn hở, ghi vào MÃ chứ không chỉ vào ADR:** `--as` là **tên tự khai** — cùng một Assistant gọi
lại bằng tên khác là qua được `SELF_ATTESTATION`. Nó cưỡng chế **hình dạng** của luật, không chứng
minh có bên thứ ba thật. Cần danh tính từ nguồn được xác thực trước khi dùng thật.

**Việc kế:** ràng vùng → đường dẫn (lõi hiện nhận bất kỳ tên vùng nào) · dựng bản xem được cho cờ
`enforce_admins` mà **không tự bật**.

## 2026-09-08 · claude-cua-kiem — bản đồ vùng↔đường dẫn, và khối hai vai trên bảng

**Số đo.** 79 → **97 phép kiểm xanh** · 21/21 → **27/27 đột biến bị bắt** · 13 → **15 ca**.
Bảng: `overview-smoke` 9 → **10 ghim**, đột biến khối hai vai **6/6 bị bắt**.
Chạy lại: `node tests/quyen-sau-ca.mjs` · `node tests/overview-smoke.mjs`.

**Chỗ hở số 3 đã bịt.** `--tich-hop` và `--xac-nhan` bắt buộc `--ban-do` + `--con-lai`; lõi quy
mọi đường dẫn trong khoảng `coSo..sha` về một khoá theo khối `areas` và từ chối nếu có đường dẫn
thuộc vùng khác. Bản đồ **truyền vào**, lõi vẫn không biết nó chạy ở repo nào. Lý do và ranh giới
đầy đủ: ADR-0019 ⑵c. **Chạm nhiều vùng thì ai duyệt: KHÔNG AI** — tách hai lượt.

**HAI CHỖ CA CỦA TÔI ĐO SAI THỨ NÓ KHAI**, cả hai do đột biến tìm ra. Nguyên văn ở commit
`c7a3a9c`; đây là cái phải nhớ:

⑴ Phép kiểm quyền bắt TRƯỚC phép kiểm đường dẫn, nên ca *"khai sai vùng"* chỉ đo được lớp mới khi
lane **giữ CẢ HAI** vùng. Không thế thì ca đo lại lớp cũ mà vẫn trông như đang đo lớp mới.

⑵ Đột biến *"bật dò-đổi-tên"* **LỌT** lượt đầu. Ca dựng **chiều RA** không phân biệt được — chiều
nguy hiểm là **CHIỀU VÀO**, hút file TỪ vùng khác VỀ vùng mình: phía NGUỒN là thứ duy nhất tố giác,
đúng phía dò-đổi-tên xoá. Sửa chiều rồi đo lại: bắt, 96 đạt · 1 sai.

**Thứ tự phép kiểm.** `kiemDuongDan` phải nằm SAU `STALE_BASE`: đặt trên cùng thì một nền khai sai
làm khoảng đo phình ra và cuốn theo commit lane khác, `STALE_BASE` thành mã không bao giờ chạy.

**Khối hai vai trên bảng** (Đức giao 08/09) — gộp vào tab mô hình vận hành, không tab mới: Vai ①
giữ Khối 1, Vai ② giữ hai mũi + vòng ngược, ranh giới **Vai ② phát hiện · Vai ① sửa**. Chữ là
quyết định nên gõ tay, **số suy từ repo** — ghim đúng chỗ đó. Phát ra `template/` ở bản **1.3.38**.

**Còn mở.** `--as` vẫn là tên tự khai · đẩy `main` bỏ qua cửa thì mã VẪN vào · chưa bật cờ GitHub
nào · `template/` phát bộ sinh mà **chưa phát phép ghim** của nó (đã vào `BACKLOG.md`).
Khuyến nghị việc kế tiếp: `_run-qua-dem-20260907/TRANG-THAI-HE-THONG.md`.

## 2026-09-08 · claude-cua-kiem — tab Hệ thống: khối gập được, xếp lưới

**Đức nêu.** Tab Hệ thống scroll quá dài, nhiều không gian thừa, muốn co block để tự arrange.

**MỘT LƯỢT ĐO SAI CỦA TÔI — bài học đắt nhất của lượt này.** Tôi đếm **byte markup** từng mục và
kết luận mục *"Bảo trì định kỳ"* chiếm **50% cả tab**. Sai metric: mục đó **đã nằm trong
`<details>`** nên nó chiếm **một dòng** scroll. Đi theo con số đó là đi gập những thứ đã gập sẵn
rồi báo *"đã tối ưu 82%"*.

| | trước | sau |
|---|---|---|
| Khối xếp dọc ở tầng ngoài | **21** | 20 (banner làm mới ra ngoài lưới) |
| Khối mở cứng | **9** | **1** |
| Xếp lưới | không | **có**, 3 cột → **~7 hàng thay vì 21** |

Nguyên nhân thật **không phải** nội dung chưa gập (95% đã gập) mà là 21 khối xếp một hàng một:
padding 12–17px hai bên cộng margin 9px mỗi khối ≈ **1.150px** chỉ riêng viền, đệm, khoảng cách.

**Cách làm.** Bộ chuyển `gapKhoi()` đặt ở **chỗ ghép tab**, không sửa hàm sinh nào — bốn hàm liên
quan dùng chung nhiều tab. Đo lại: ba tab kia **khớp từng byte** trước/sau. Lưới là CSS thuần,
`<details>` là thẻ gốc trình duyệt — **không thêm thư viện**.

**Một lỗi thật của bộ chuyển, đã sửa:** bản đầu dò ở **bất kỳ đâu** nên lặn vào `<details>` đã có
và chuyển cả khối con — khối *"Mô hình vận hành"* hiện **HAI nhãn**. Trang **không vỡ, chỉ nói
lặp**, nên nó đi qua được mắt. Lý lẽ đầy đủ (kể cả vì sao chỗ này **cố ý fail-open**) ở commit của
lượt này và chú thích ngay trên `gapKhoi`.

**Số đo.** `overview-smoke` 10 → **11 ghim** · đột biến **8/8 bị bắt**. Chạy lại:
`node tests/overview-smoke.mjs`. Phát ra `template/` bản **1.3.39**.

**Đức chốt hai câu:** không thêm block mục lục riêng (lưới đã là mục lục — thêm nữa là in cùng một
danh sách hai lần) · giữ khối *"Bắt đầu ở đâu"* mở sẵn để trang còn nói được câu đầu tiên.

## 2026-09-08 · claude-cua-kiem — hai vai thành luật, tab Migrate tách, Codex bác đúng hai chỗ

**Số đo.** `overview-smoke` 11 → **12 ghim** · đột biến khối gập+lưới **8/8** · bản phát hành
1.3.39 → **1.3.41** · `features.mjs` **41 xong · 0 thiếu** (thêm F4.7). Tab `cong-viec`
131.532 → **32.743 byte**; tab `migrate` mới **102.333**. Chi tiết: ADR-0007 · ADR-0008.

**BA CỔNG CHẶN TÔI, cả ba chặn đúng — phần đáng đọc nhất của mục này:**

⑴ **B9 (trần 200 dòng cho hiến pháp).** Tôi nhét số đo và lý lẽ vào `AGENTS.md`; bản trích phồng
200 → **218**. Tôi nén **hai lượt** (218 → 210 → 204) mà vẫn đỏ, vì đang nén **văn** trong khi vấn
đề là **thứ đó không thuộc về đây**. Chuyển sang ADR-0008 thì vừa: nay **đúng 200/200**.
**Hiến pháp chứa LUẬT; ADR chứa VÌ SAO.**

⑵ **Dấu vân tay luật chung.** Bộ phát hành từ chối vì tôi đổi phần **lan sang mọi repo**. Không tự
mở — Đức duyệt rồi mới cập nhật, kèm **một sổ đổi vân tay** ngay cạnh hằng số: một chuỗi 64 ký tự
đổi lặng lẽ trông y hệt một lượt đổi được duyệt.

⑶ **Sổ phát hành đòi một-số-một-nội-dung** — mỗi lượt sửa tầng máy là một lượt tăng bản.

**MỘT CÂU SAI TÔI TỰ ĐƯA VÀO HIẾN PHÁP rồi tự bắt được:** viết `npm run test:backlog` đếm
`đóng khi:` — **bộ khung không có lệnh đó**. Sửa thành nói thật, kèm `KHUNG-8`. **Không port bộ
kiểm ngay**: **43/44 mục** sổ này thiếu `đóng khi:`, phần lớn là chữ phiên khác; bật lên là đỏ 43
mục và phiên sau sẽ học cách bỏ qua nó.

**Codex chấm chéo — KHÔNG chạy được lệnh nào** (`deny-read ACLs`), bốn câu CHƯA THỬ. Nhưng bác
đúng hai chỗ **về phương pháp**, không cần chạy: ⓐ số đo của tôi đếm **dòng** `Lane:` chứ không
đếm commit, và **không gì ánh xạ lane → hãng** — tôi suy hãng từ chuỗi trong tên lane, tức tin
đúng loại **lời tự khai** repo này cấm; ⓑ *"chưa cưỡng chế"* **khác** *"không thể kiểm bằng máy"*,
tôi gộp hai chuyện theo hướng **tự bào chữa**. Đã sửa cả hai; chỗ ⓐ hoá ra làm lập luận **mạnh lên**.

**Còn mở:** `KHUNG-8` · `KHUNG-7` · sổ nợ bộ khung **45 mục**, không ai đặt trần.

## 2026-09-08 · claude-cua-kiem · Hai chốt treo được đóng, và một trong hai đi ngược khuyến nghị của chính tôi

**Đức uỷ quyền:** *"hai chốt đó bạn chủ động chọn cho phù hợp cho tôi."* Biên bản: ADR-0010.

**⓵ Sổ quyền: XOÁ, không nối.** Bản giao việc đêm trước khuyến nghị **nối**, Đức cũng nghiêng
về nối. Đo lại trước khi gõ thì bốn số lật ngược: `quyen.mjs` **không được gọi từ đâu cả** ·
`refs/ark/quyen` **chưa từng tồn tại trên remote** · **không có trong `template/`** · và cái nó
định chặn thì `claim.mjs:400` **đã chặn rồi** bằng mutex `mkdir` thật.

Số thứ tư là số quyết định, và tôi chỉ thấy nó vì **mở file ra đọc trước khi sửa**: tôi đã sắp
cài một khoá độc quyền **thứ hai** vào đúng đường ghi đã có một cái chạy tốt.

Xoá **1.716 dòng**. `KHUNG-45` đóng theo — **vì thứ mang lỗi đã đi, không phải vì đã vá**.

**Mất, ghi thẳng:** vế cưỡng chế bằng máy của bất biến *"người sửa không tự nghiệm thu"*
(ADR-0008) nay là **chữ**. Đổi lại: hàng rào ấy chưa từng cắm xuống đất, và nó nhận bản đồ vùng
từ chính bên bị kiểm (`KHUNG-45`). Dựng lại khi có phiên chạy `claim.mjs` từ **máy thứ hai**.

**⓶ Trần sổ nợ = 25, có máy canh.** Phép kiểm thứ **12** của cổng. Trần khai ở `backlog.tran`
(`.repo-structure.json`); repo không khai thì **xanh** — bản khung không đặt trần hộ ai. Bộ đếm
dùng lại `parseBacklog`, không viết bộ thứ hai. Ghim `cong-do-that.mjs` khối 10 chứng minh **ba
chiều**; 2/2 đột biến bị bắt. Đang mở **23/25**.

**Vấp, và cùng một kiểu vấp của đêm trước:** phát bản **1.3.48 → 1.3.49 → 1.3.50** vì tôi phát
trước rồi mới chạy test. Luật một-số-một-nội-dung bắt đúng cả hai lần. Thứ tự đúng: **test xanh
trước, phát bản một lượt sau.**

**Cái giá của lượt dùng lại `parseBacklog`:** cổng nay phụ thuộc `what-next.mjs`, nên **sáu** kho
thử phải chép thêm file đó. Vá hết trong một lượt, và ghi chú ngay trên phép kiểm.

**Còn mở:** `KHUNG-7` · `KHUNG-44` · `KHUNG-46` · sổ nợ **23/25**. Repo Extension chưa khai
`backlog.tran` nên phép kiểm mới sẽ xanh ở đó mà không canh gì — **hỏi Đức con số trước**.

<!-- HANDOFF-THANG: 2026-09 -->

## 2026-09-08 (chiều) · claude-cua-kiem · Cắm răng cho kho chữ; bản 1.3.58

**Việc lớn ⓶ của roadmap** (*dọn kho chữ*), làm phần **không cần chủ dự án**. ADR-0011.

**Số đo mở đầu:** `docs/` **5.915 → 6.654 dòng trong MỘT ngày**, phần tăng phần lớn là chữ do
chính AI viết. Không con số nào canh. Cùng bệnh với hai trần sổ nợ vá sáng nay: luật có, răng
không.

**⑴ Cơ chế nhật ký mang LÊN nơi phát hành.** `handoff.mjs` + phép ghim + `handoffCapFrom` trước
nay chỉ có ở repo tiêu thụ. Nay ở bộ khung, **vào bản trích**, khai `tran_byte_moi_muc: 2600` —
giữ nguyên con số cũ để một số chỉ có một nghĩa. Cổng có phép kiểm thứ **13**.

**⑵ `docs/` canh bằng THƯỚC CÓC** (phép kiểm thứ **14**): trần đặt ở **đúng con số hôm nay**
(5.744), chỉ đỏ khi **tăng**. Không đòi ai dọn — đặt trần thật là đỏ ngay với mọi lane, và cổng
đỏ vì việc người khác thì bị tháo trong một ngày. **Trừ `docs/adr/`**: ADR bất biến nên chỉ có
thể to lên; tính vào thì mỗi quyết định mới làm cổng đỏ.

**⑶ Bản đồ việc đọc cờ đóng băng.** Trước đó cổng đọc cờ mà `what-next.mjs` không, nên nó xếp
một gói ĐÃ ĐÓNG BĂNG vào *"chạy song song được ngay, ưu tiên #2, 22 việc mở"*. Nay có mục riêng
**B2 · ĐÃ ĐÓNG BĂNG** — loại khỏi mục A nhưng **không giấu đi**.

**MỘT LỜI TÔI NÓI SAI, ĐÃ SỬA:** roadmap viết *"xoay là 1.537 → dưới trần ngay"*. Công cụ **từ
chối xoay ở lượt đầu**, nó chỉ đóng dấu tháng — vì đoán tháng từ tiêu đề là câu máy không xác
định được. Nhật ký co ở **mốc sang tháng**, không phải hôm nay.

**Bảy bản phát 1.3.52→58, và tất cả là lỗi thứ tự của tôi.** Mỗi lượt lộ một chỗ bản trích chưa
mang đủ: thiếu file · thiếu lời gọi trong chuỗi test · thiếu con số trong cấu hình · rồi **ba vế
của phép ghim chỉ đúng với repo ĐÃ CHẠY LÂU** (đòi mọi quyển nhật ký có mục · đòi khai tháng ·
đòi trần chặn được mục dài nhất) — repo vừa dựng có quyển TRẮNG và cả ba đều đỏ oan. Neo lại vào
**phép đếm thô**: `0 == 0` là đúng, `0` trên file có 37 tiêu đề mới là hỏng.

**Còn mở:** xoá thật trong `docs/` — cần chủ dự án duyệt.

## 2026-09-08 (tối) · claude-cua-kiem · Một vòng làm việc: 18 phút → dưới 5

**Đức yêu cầu tăng tốc ≥50%.** Đo trước khi sửa, không đoán: chuỗi suite bộ khung **535s/19
bước** (5 bước đầu chiếm **84%**), repo kia **242s/16 bước**. Và cổng đóng phiên **chạy lại toàn
bộ chuỗi đó** — nên một vòng bình thường tốn **535+535 ≈ 18 phút**, mà nửa sau không kiểm thêm
được gì.

**⑴ Chạy song song** (`scripts/chay-test.mjs`). Suite nặng nào cũng tự dựng repo riêng trong thư
mục tạm nên chúng độc lập; chạy tuần tự là tự nguyện xếp hàng. **535s → 256s.** Suite đọc git của
cây làm việc CHÍNH khai ở `test.serial`. Khai sót không nguy hiểm: suite nào đỏ thì bộ chạy **tự
chạy lại MỘT MÌNH** trước khi kết luận — tranh chấp thôi bị báo nhầm thành lỗi thật.

**⑵ Dấu xác nhận** — cổng thôi chạy lại một chuỗi vừa chạy xong. **560s → 22s.**

**Không phải cửa sau**, và chỗ này đáng đọc kỹ: dấu buộc vào **HEAD** + **băm
`git status --porcelain -uall`** + **danh sách suite** + **hạn 30 phút**. Sửa một byte ở bất kỳ
file nào, kể cả file chưa track, là dấu hết hiệu lực. Suite đỏ thì **xoá dấu**, không ghi dấu đỏ.
Dấu nằm trong `.gitignore` nên không mượn được của máy khác. Cổng vẫn giữ nguyên đường chạy đầy đủ.

Ghim `tests/dau-suite-smoke.mjs`: **1 vế NHẬN + 9 cửa TỪ CHỐI** (chưa có · rỗng · đỏ · đổi HEAD ·
đổi cây · đổi danh sách · quá hạn · mốc rác · mốc tương lai) + soi rằng cổng **thật sự gọi** và
rẽ nhánh theo kết quả.

**Đo lại cả vòng: 1.095s → 278s, nhanh 75%.**

**Thứ tự mới, và nó là điều kiện để dấu có tác dụng:** sửa → **commit** → sinh lại artifact →
commit → **chạy suite** → **chạy cổng** → đẩy. Chạy suite trước khi commit thì lượt commit làm
đổi cây và dấu hết hiệu lực ngay.

**Lỗi cũ lặp lần thứ 5:** `chay-test.mjs` sinh ra có **một byte NUL** trong mã nguồn, nên git coi
nó là nhị phân và bộ quét secret bỏ qua nó. Bắt được vì một phép ghim đếm "bỏ qua 2 file nhị
phân" thay vì 1. Sửa bằng `String.fromCharCode(31)`.

## 2026-09-08 (tối, tiếp) · claude-cua-kiem · Luật tốc độ vào hiến pháp, và B9 bắt tôi trả giá

**Codex chấm chéo bắt được một lỗ thật trong dấu xác nhận:** *"đừng tin một cache chỉ dựa vào
HEAD — HEAD bỏ sót file bẩn, phụ thuộc, môi trường."* File bẩn tôi đã che bằng
`git status --porcelain -uall`. **Môi trường thì chưa** — đổi bản Node rồi chạy cổng là suite
chưa từng chạy trên bản đó mà dấu vẫn hợp lệ. Nay dấu ghi cả `version platform arch`; ghim lên
**11 cửa từ chối**.

**Một khe CỐ Ý để ngỏ, ghi ra để không ai tưởng nó kín:** thư mục bị `.gitignore`
(`node_modules/`) không nằm trong băm. Khai báo phụ thuộc thì có — `package-lock.json` được track
nên HEAD ghim nội dung và porcelain bắt sai lệch. Chỉ lượt **sửa tay** trong `node_modules` là
lọt, và hạn 30 phút là thứ chặn nó.

**Mục 0b vào hiến pháp** — ba luật tốc độ, mỗi luật có số đo đứng sau. Nó là **luật CHUNG** nên
lan sang mọi repo tiêu thụ, và **cổng dấu vân tay chặn đúng như thiết kế**. Đã ghi nguyên văn câu
duyệt của Đức vào sổ đổi vân tay ngay cạnh hằng số.

**Ba lần bị chặn liên tiếp, và cả ba đều đúng:**

⑴ Luật chung của tôi gọi thẳng `npm run template` — **repo tiêu thụ không có lệnh đó**. Phép kiểm
*"tài liệu dạy lệnh nào thì bản trích phải khai lệnh đó"* bắt. Sửa: nói về *"bộ sinh ghi vào một
sổ có ràng buộc"*, không nêu tên lệnh.

⑵ **B9: bản trích 228/200 dòng.** Đây là *"một luật vào thì một luật ra"* được cưỡng chế bằng máy,
không phải lời hứa. Chỗ trả lại: **sơ đồ mermaid ở mục 2** — nó nói lại đúng điều bảng sáu việc và
câu nguyên tắc ngay dưới đã nói, tức **bản thứ BA của một luật**. Bỏ sơ đồ (10 dòng) + nén 0b
(29 → 12) → **200/200 khít**, không mất một luật nào.

⑶ Nén xong vẫn 204 → 202 → 201 dòng. Phải cắt thêm bốn lượt nữa mới khít. Ghi ra vì nó là số đo
thật của việc *thêm luật*: một mục 12 dòng đòi trả lại đúng 12 dòng, không có chỗ nào rẻ hơn.

**Còn mở:** mang cơ chế này sang repo Extension; viết prompt khởi tạo hai phiên AI cho bộ khung.

## 2026-09-08 (khuya) · claude-cua-kiem · Cơ chế tăng tốc đã sang repo tiêu thụ; bản 1.3.66

**Repo `Chrome_Extension_AI_Agentic` nhận xong** (N-43 đóng ở sổ nợ bên đó). Số đo bên ấy:
chuỗi suite **241,7s → 93s**, cổng **~280s → 33s**, cả vòng **521s → 126s — nhanh 76%**.

**Bản trích phải sửa MỘT chỗ vì repo đích khác bộ khung.** Phép ghim của tôi soi **tên biến**
(`runRootSuite()`), mà repo tiêu thụ gọi nhánh chạy đầy đủ là `rootSuiteParts()` — điều phải ghim
thì y hệt, chỉ tên khác. Nó **đỏ oan ngay ở repo đầu tiên nhận**. Nay phép ghim hỏi **hành vi**:
kết quả xét phải được rẽ nhánh, và đường chạy đầy đủ phải còn — chấp nhận cả hai tên.

> Bài học mang đi: một phép ghim viết ở nơi phát hành mà soi **chi tiết triển khai** thì nó không
> phải hợp đồng, nó là bản sao. Hợp đồng phải nói về **hành vi**.

**Chỗ repo đích cố ý làm khác, và nó đúng:** ở đó `npm test` **giữ nguyên chuỗi tuần tự**, đường
nhanh mang tên riêng `npm run test:song-song`. Lý do: một phép ghim **trong gói ĐÃ ĐÓNG BĂNG** đọc
thẳng `scripts.test` để bắt "xanh giả", mà gói đóng băng thì **chỉ-đọc**. Đổi `test` là làm đỏ một
phép kiểm mình không có quyền sửa — nên đường nhanh nhường chỗ.

**Byte điều khiển thô, lần thứ SÁU trong một ngày.** Sáng nay là byte NUL trong `chay-test.mjs`
(git coi file là nhị phân, bộ quét secret bỏ qua nó). Tối nay là byte **BACKSPACE** lọt vào phép
ghim khi tôi dựng regex bằng chuỗi Python — `\b` thành ký tự thật, và phép khẳng định **im lặng
mất hiệu lực**. Cả hai lần đều chỉ lộ ra vì một phép kiểm khác đếm sai một đơn vị.

**Còn mở:** không có gì của phiên này ở repo này.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · KHUNG-46 đóng: hợp đồng nhóm bảng về MỘT chỗ

**Trước:** danh sách năm nhóm của bảng bị `assert.deepEqual` gõ cứng ở **2 file test**
(`overview-smoke.mjs`, `overview-doc-smoke.mjs`). Hai bản sao lệch được, và 08/09 đã lệch thật —
sửa một bản, cổng đỏ thêm một vòng 9 phút để tìm bản kia.

**Sau:** khai **1 chỗ** — khối `bang.nhom` của `.repo-structure.json`, đọc qua
`nhomBangFrom()` trong `repo-structure.mjs`. Hai suite cùng đọc. `grep -c 'tong-quan'
tests/*.mjs` ở **phần khẳng định danh sách: 0** (còn 2 dòng `id="tab-tong-quan"` khẳng định
*một tab cụ thể phải còn* — sự thật khác, cố ý giữ).

**Vì sao KHÔNG khai bằng hằng số export từ `build-overview.mjs`** — mục nợ gợi ý lối đó, và nó
hỏng: bộ sinh là bên **bị kiểm**, hợp đồng nằm trong nó thì thêm một tab sửa cả hai vế của phép
so sánh cùng lúc, nên phép kiểm xanh với **mọi** danh sách.

**Ba đột biến chạy thật:** ⑴ thêm tab `gia-mao` vào bộ sinh → **cả hai suite ĐỎ** ở đúng vế danh
sách · ⑵ chép lại danh sách vào một file `tests/` → vế cấm-chép ĐỎ, chỉ đúng file + số dòng ·
⑶ đối chứng bỏ đột biến → xanh.

**Vế cấm-chép bắt oan ngay lượt đầu** — nó khớp chuỗi con nên `"so-migrate"` bị đếm là mã
`migrate`. Sửa thành khớp nguyên mã. Một vế mới sinh mà xanh ngay thì chưa ai biết nó có răng.

**Số:** sổ nợ 22 → **21** mục mở · `overview-doc-smoke` 15 → **17** vế · suite đủ bộ
**16/19 xanh** trước khi tăng bản (3 đỏ đều cùng một gốc: chưa tăng `version`) · bản **1.3.67**.

**Còn mở:** không có gì của phiên này. Mục `KHUNG-44` (port `npm run test:backlog`) vẫn mở —
điều kiện đóng của nó cũng là một lệnh chạy được, phiên sau nhặt được ngay.

## 2026-09-08 (khuya, tiếp) · harness-phat-01 · Hai repo nhận gói assistant + tốc độ

**Đo trước, không đọc hồ sơ cũ.** Quét `.ark/harness.lock.json` khắp `C:\WORKING ZONE`: **4 repo**
có sổ ghim, **3** có hồ sơ — `n8n-orchestrator` migrate từ 05/09 mà **không hồ sơ nào**, nên tab
Migrate nói *"3 repo"* suốt từ đó. Đã viết hồ sơ kèm checklist đo 08/09.

**`ALL_SKILL_MANAGEMENT`** — luật hai vai (mục B6). Cổng XANH TOÀN BỘ, đã đẩy, đã trả khoá.

**`n8n-orchestrator`** — 1.3.19 → **1.3.67**, 27 file máy. Luật hai vai thêm làm **tầng thứ hai**,
không thay ma trận theo hãng của nó (`tools/validate.py` đọc `state/roles.yaml`; đụng vào là làm
đỏ cổng chủ nhà). Đo tại đó: chuỗi **145s → 60,4s**, cổng **~145s → 11s**, cả vòng **290 → 72s**.
Cổng 14/14 XANH, đã đẩy 7 commit, đã trả khoá.

**BỐN CHỖ BẢN TRÍCH KHÔNG MANG ĐƯỢC — ba đỏ ngay lúc file tới, một KHÔNG đỏ** (`KHUNG-47`):
`bang-song` + `dau-suite-smoke` đòi 4 dòng `.gitignore`, mà file đó không thuộc tầng nào ·
`handoff-smoke` đòi dòng **đúng chữ** `## Log`, mà n8n giữ nhật ký ở `log/YYYY-MM.md` — **cố ý
khác, không phải sai** · và `--apply` thêm `test:tuan-tu` mà **không tên lệnh nào trỏ vào
`chay-test.mjs`**, nên tính năng nhanh nhất **tới rồi mà nằm không**. Con số 60,4s chỉ có sau khi
tôi vá tay. Bài học 1.3.66 — *hợp đồng nói HÀNH VI, đừng soi chi tiết triển khai* — chưa được áp
cho ba phép ghim này.

**`F4.7` XANH GIẢ ở mọi nơi** (`KHUNG-49`): phép đo chỉ hỏi hai file **có tồn tại**. Đo bằng câu
chữ thì **0/4 repo** có luật hai vai, trong khi danh mục báo 2 `[x]`.

**Đức chốt 08/09:** pack suite song song thành một mục danh mục — `decisions.md` + `KHUNG-48`.
Việc của Vai ①, vì `features.json` là tầng máy nên đòi tăng `version`.

**Nhịp DỌN:** `HANDOFF.md` 1692 → 557 dòng · `CHANGELOG.md` 1294 → 235.

**Còn mở — ba repo, cả ba chặn vì người khác giữ khoá hoặc chờ Đức:** `nav_platform_main`
(`claude-bang-gon` giữ 1 ngày, quá hạn) · `Chrome_Extension_AI_Agentic` (`claude-ext-cum5` giữ ba
khoá; repo đó **chưa có sổ ghim**) · `Project 3` (KHUNG-30, luật 8A của chính nó; F4 **2/7**).

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Lưu đồ trên bảng: 0/7 ra hình → 7/7

**Đức nhìn bảng và nói: *"flow chart này toàn chữ, tôi cần hình ảnh trực quan."* Đúng.** Bảng in
`<pre class="mermaid">` từ **v0.3.0**, kèm chú thích trong `md-mini.mjs` nói *"để trang tự vẽ"* —
mà không thư viện nào được nạp. Bảy lưu đồ hiện ra là **mã nguồn**, cả `<br/>` lẫn `&lt;repo&gt;`.

**Vì sao 5 tháng không ai đỏ:** không phép kiểm nào hỏi *"cái này có ra HÌNH không"* — chúng chỉ
hỏi trang sinh ra được không. Trang sinh được, nên bảng luôn xanh.

**Không nạp mermaid từ CDN** — luật đã có sẵn ngay trong `build-overview.mjs`: *"trang này là file
tĩnh đem gửi cho người khác mở, nên nó không được phụ thuộc vào một CDN còn sống hay không."* Nên
`scripts/luu-do.mjs` vẽ **SVG nội tuyến lúc sinh trang**. Tập con hẹp, cố ý; ngoài tập con thì trả
`null` và in lại mã nguồn **kèm một dòng báo** — lùi im lặng chính là cách lỗi cũ sống lâu thế.

**Số đo:** lưu đồ ra hình **0/7 → 7/7** · chữ tràn ra ngoài hộp **1 → 0** · cặp nhãn đè nhau
**1 chùm 4 nhãn → 0**. Ba con số sau đo trong trình duyệt thật, không suy.

**8 đột biến, và BA CÁI SỐNG SÓT lượt đầu — phần đáng đọc nhất.** Bộ vẽ có ba cơ chế giữ nhãn khỏi
đè nhau (nới khe · neo-ở-nguồn · dồn chỗ) và chúng **che cho nhau**: gỡ một cái thì hai cái kia đỡ
lấy, nên vế *"không cặp nào đè nhau"* vẫn xanh trong khi lưu đồ đã xấu đi thật. Phải thêm vế 7b,
7c và nửa sau của vế 4 mới bịt. Bài học mang đi: **một vế đo KẾT QUẢ CHUNG của nhiều cơ chế thì
không ghim được cơ chế nào** — mỗi cơ chế cần một ca mà chỉ nó cứu được.

**Một giả thuyết của tôi SAI:** tưởng gỡ lớp nhận diện cạnh quay lại thì bộ xếp đệ quy vô hạn.
Nó **không treo** — nó vẽ lưu đồ NGƯỢC, nút đầu rơi xuống đáy. Hỏng im lặng, tệ hơn treo.

**Đa phiên, ca thật:** hai lane chung một cây làm việc, nên bản vá nằm dở của tôi làm
`build-template --check` ĐỎ cho **cả hai**. Nhắn lane kia không hồi đáp; **Đức chốt chuyển `_root`**.

**Còn mở:** Đức sẽ trả lời 7 mục đang chờ chốt — đó là việc kế của phiên sau.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Suite đột biến làm HỎNG một commit thật

**Bắt được trong lúc đóng phiên trên — và nó đã xảy ra, không phải lo xa.**
`tests/upgrade-smoke.mjs` khối 14 kiểm luật *"sổ phát hành chỉ được THÊM"* bằng cách ghi đè một
dòng của `RELEASE-LEDGER.json` **thật ở gốc repo**, rồi khôi phục trong `finally`. Ở repo một lane
thì đúng. Chạy song song thì hai kiểu hỏng, cả hai đo được hôm nay:

⑴ **Đỏ oan** — `build-template.mjs --check` đọc sổ ĐÚNG LÚC nó đang hỏng, ba lệnh đỏ với thông báo
trông y hệt lỗi thật. ⑵ **Hỏng dữ liệu** — hai lượt chồng nhau thì `finally` khôi phục **một ảnh
chụp ĐÃ HỎNG**, sổ mất hẳn dòng `1.2.10`. Trước đó commit `c385f4c` đã mang theo
`"1.2.10": "1111111111111111"` — đúng thứ khối 14 sinh ra để chặn, lọt vào lịch sử qua cửa sau.
Đã trả lại `946065fa2778e0e4`.

**Vì sao im lặng:** ca thường thì `finally` kịp, cây làm việc sạch lại, mọi phép kiểm sau đó xanh.
Chỉ lộ vì `git status` báo sổ *"sửa dở"* — mà nội dung "sửa dở" chính là bản ĐÚNG. Nhìn ngược.

**Vá:** `test.serial` khai thêm ba suite, kèm `_ghi_de_file_that` nói rõ tiêu chí thứ hai để khai
vào đó — **suite GHI ĐÈ một file đã commit ở gốc repo**, không chỉ suite đọc git. Ghim `tests/dau-suite-smoke.mjs`: quét NGUỒN mọi file `tests/`, ai chạm sổ mà quên khai thì ĐỎ.

**Phép ghim ĐỎ OAN ngay lượt đầu — đúng cái bẫy nhật ký hôm nay vừa ghi.** Bản đầu gõ thẳng tên
`build-template.mjs`, mà đó là công cụ của NƠI PHÁT HÀNH; repo tiêu thụ không có nó nên
`template-null-repo.mjs` đỏ ở một repo vừa dựng. Sửa thành hỏi **hành vi**: bước công cụ nào
trong chuỗi có đọc sổ. **Hai lần trong một ngày cùng một bài học.**

**Lỗ đã biết, ghi ra để không ai tưởng kín:** vế chỉ bắt người chạm sổ TRỰC TIẾP.
`core-contract.mjs` gọi `upgrade.mjs --apply`, và lệnh đó mới đọc sổ — gỡ nó khỏi `test.serial`
thì vế VẪN XANH (đã thử, sống sót). Nó nằm trong danh sách vì đo được nó đỏ oan, không vì vế bắt.

**Còn mở:** `KHUNG-51` — vá này chỉ đóng ca trong MỘT lượt chạy. Hai LANE cùng chạy `npm test`
trên chung một cây làm việc thì vẫn hỏng như cũ.
## 2026-09-08 (khuya) · harness-phat-01 · BÀN GIAO cho lane ① — hai mục đỏ của cổng là việc của ①

SendMessage tắt ở phiên tôi, nên bàn giao **qua sổ** — đúng luật mục 5. Đức approve ① lấy `_root`.

**Tôi KHÔNG chạm `package.json`, KHÔNG chạm `AGENTS.md`.** Bốn commit của tôi chỉ ở `HANDOFF.md` ·
`BACKLOG.md` · `decisions.md` · `CHANGELOG.md` · `docs/archive/*` · `docs/migrations/*`. Ba chỗ ①
cần ở `_root` đều trống đường.

**`DASHBOARD-Ark-Repo-Harness.html` tôi CỐ Ý không commit — ① phải sinh lại.** Tôi sinh một lượt
thì nó hút theo việc chưa phát hành của ①: `git diff` ra **25 dấu vết** `luu-do`/mermaid/svg và
**xoá 441 dòng**. Commit nó là tôi công bố việc chưa ai duyệt của lane khác, dưới tên lane tôi —
nên đã `git checkout --` trả lại. Hệ quả: artifact đã commit **cũ so với HEAD** vì 4 commit của
tôi. ① sinh lại **một lượt** là phủ cả hai phần.

**Cổng của tôi còn 3 đỏ, và 2 trong 3 là việc của ①:** `Test xanh` đỏ 1/20 suite
(`SO_PHAT_HANH_SUA_LICH_SU` — đọc trúng lúc bộ trích đang ghi sổ, xem `KHUNG-50`) · `Sự thật máy
sinh còn tươi` đỏ (đúng cái artifact ở trên). Mục thứ ba `Kho chữ không phình` là của tôi, chưa xử.

**Nên 4 commit của tôi CHƯA ĐẨY, cố ý.** Đẩy khi cổng đỏ là làm đúng điều luật cấm. Chúng chỉ là
chữ, không chạm tầng máy, nên ① cắt bản không cần đợi tôi. Tôi đẩy sau khi ① xong.

**Bốn mục chờ ① trong `BACKLOG.md`, một mục có câu chốt của Đức:** `KHUNG-48` (Đức chốt 08/09:
pack cơ chế suite song song vào `features.json`) · `KHUNG-47` (bốn chỗ bản trích không mang được;
ca dính ① nhất là `handoff-smoke` đòi dòng đúng chữ `## Log`) · `KHUNG-49` (`F4.7` xanh giả) ·
`KHUNG-50` (bộ trích băm cây làm việc → chặn cả đường phát; và ledger ghi không nguyên tử).

**Gợi ý về số bản, tuỳ ①:** `features.json` nằm trong `TEP_MAY_THEM` nên `KHUNG-48` cũng đòi tăng
bản. Gộp vào **cùng 1.3.68** thì tiết kiệm một số — sổ cưỡng chế *một số một nội dung*, và 08/09
đã đốt bảy số vì làm ngược thứ tự.

**Đã trả `_root` + `_docs`.**

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Ba chốt của Đức: thước docs · KHUNG-48 · Y-08

**⑴ Thước kho chữ đếm SAI thứ nó định đo — và nó phạt đúng người làm đúng.** `AGENTS.md` viết rõ
*"lưu trữ KHÔNG tính vào ngân sách tài liệu"*, `can-nang.mjs` đã miễn `docs/archive/` từ 06/09 vì
đúng lý do đó — **chỉ cổng đóng phiên là còn đếm**. Một luật hai chỗ, và hôm nay chúng lệch THẬT:
lane kia chạy **đúng nhịp DỌN mà repo BẮT làm**, dời 1.135 dòng sang lưu trữ, và cổng ĐỎ vì chính
việc dọn. Cùng họ `KHUNG-25`.

**Đức chốt: sửa CỔNG cho khớp LUẬT.** Hằng số `THU_MUC_LUU_TRU` về `repo-structure.mjs` — một chỗ
khai, hai chỗ đọc. Thước **5.744 → 4.001**, tức **CHẶT HƠN**: chữa mâu thuẫn, không phải nới.
Ghim `cong-do-that.mjs` vế 11: `git mv` file đang vượt thước sang `docs/archive/`, không xoá chữ
nào, cổng phải XANH lại. Đột biến bỏ lại phép loại → ĐỎ.

**⑵ `KHUNG-48` đóng** (Đức đã chốt 08/09). `F8.5` đo cơ chế suite song song; và vế **`5b` chiều
ngược**: mọi script trong `PORTABLE_SCRIPTS` phải nằm trong một **phép ĐO** của danh mục.

**Vế ngược bắt BA chỗ ngay lượt đầu** — ngoài `chay-test.mjs` còn `repo-structure.mjs` và
`handoff.mjs`, phát đi đã lâu mà danh mục chưa từng đo. Danh mục không trôi một mục, nó trôi ba.

**Thêm phép đo thứ ba `chuoi` — đo DÂY NỐI**, vì tên alias khác nhau ở mỗi repo (`test` ở đây,
`test:song-song` ở repo tiêu thụ). **Hỏi tên là hỏi chi tiết triển khai** — lần thứ BA trong ngày.

**4 đột biến, cả 4 bị bắt, HAI cái sống sót lượt đầu:** vế ngược quét cả JSON nên **văn xuôi
được tính là "đã khai"** (nay chỉ đọc khối `can`); và phép đo `chuoi` LUÔN ĐẠT vẫn xanh vì chưa
vế nào đòi nó biết ĐỎ.

**⑶ `Y-08` — hết đoán, có bằng chứng.** Lượt đẩy hôm nay in nguyên văn từ remote:
`Bypassed rule violations for refs/heads/main: Required status check "cong-kiem" is expected`.
Tức cổng GitHub **có khai** mà tài khoản đang đẩy **đi qua được**. Tần suất CAO (mọi lượt đẩy),
tác hại THẤP (ba lớp trước nó còn răng). Đức chốt: ghi bằng chứng, chưa đổi gì.

**Còn mở:** `KHUNG-47` · `KHUNG-49` · `KHUNG-50` (lane ② bàn giao) · `KHUNG-51` · `KHUNG-52`.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Cổng báo "suite ĐỎ" mà giấu tên suite đỏ

**Lần thứ BA trong một phiên tôi vấp đúng một bẫy, và lần này nó GIẾT CẢ SUITE** chứ không đỏ một
vế. Vế `5b` vừa thêm đọc `scripts/build-template.mjs` — công cụ của NƠI PHÁT HÀNH — mà không kiểm
nó có tồn tại. Ở repo hạt giống `readFileSync` ném ENOENT, `features-smoke` **chết ngang**, không
phải đỏ. Đã kiểm-rồi-mới-đọc, bỏ qua CÓ TÊN.

**Nhưng phần đắt hơn là CHẨN ĐOÁN, và nó là một lỗ của chính cổng.** Cổng in:

```
[ĐỎ  ] Test xanh
       suite gốc repo ĐỎ →  6.7s node tests/khoa-dau-vet.mjs | 2.3s node tests/assistant-smoke.mjs | …
```

Ba tên đó **KHÔNG phải suite đỏ** — chúng là ba suite CHẬM NHẤT. `session-check.mjs:838` lấy
`.slice(-3)` của stdout, mà ba dòng cuối của bộ chạy là bảng xếp hạng thời gian. Tên suite đỏ nằm
ngay phía trên, bị cắt mất.

**Giá phải trả, đo được:** tôi đuổi theo ba cái tên sai trong **bốn lượt** — chạy từng suite riêng
(cả ba XANH), dựng một repo mới bằng `init-repo` (XANH), dựng một worktree ở bản trước để so
(XANH), rồi mới phải chép suite ra bản gỡ lỗi để in nội dung thật. Suite đỏ thật là
`features-smoke`, chưa lần nào xuất hiện trên màn hình.

**Đây là kiểu hỏng tệ nhất của một cổng:** nó không im lặng — nó **nói sai một cách tự tin**, và
người đọc tin nó vì nó có tên file và có số giây. Ghi `KHUNG-52`, điều kiện đóng là một lệnh chạy
được: dựng một repo có đúng MỘT suite đỏ và MỘT suite chậm khác nhau, rồi đòi câu cổng in ra chứa
tên suite ĐỎ.

**Còn mở:** `KHUNG-52` — chưa vá, vì `session-check.mjs` đang là vùng tôi vừa sửa cho ba việc
khác và một lượt sửa nữa lúc này là trộn bốn việc vào một bản vá.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · KHUNG-49 đóng: bộ đo thôi hỏi câu dễ

**Bệnh:** `F4.7` — luật hai vai, thứ Đức gọi là quan trọng nhất để đưa AI assistant vào việc —
khai phép đo là `can.file = ["AGENTS.md","BACKLOG.md"]`. Hai file đó có ở MỌI repo đã lắp từ lâu,
nên mục báo `[x]` **khắp nơi**, trong khi `grep -cE "giữ lõi|phát & thu"` ra **0 trên 4 repo đã
migrate**. Bộ đo báo ĐẠT cho một tính năng ở nơi nó **không tồn tại**.

**Gốc bệnh:** có tính năng là một ĐOẠN LUẬT nằm trong file repo đích TỰ SỞ HỮU. `upgrade.mjs`
không bao giờ ghi `AGENTS.md` của họ — đúng, đó là file của họ — nên *"file có tồn tại"* và
*"nội dung đã tới"* là hai câu khác nhau, và danh mục chỉ hỏi câu dễ.

**Vá:** kiểu đo thứ tư `trong_file` (file + các chuỗi phải khớp). `F4.7` đo ba chuỗi của chính
luật. **Ca hỏng dựng được và đã chạy:** chép một repo dựng từ bản trích, xoá đúng ba dòng luật,
giữ nguyên mọi thứ khác → `[x]` thành `[~]` **kèm tên ba chuỗi thiếu**.

**Vế `5c`:** `AGENTS.md` và `CLAUDE.md` **cấm đo bằng sự có mặt**. Nó bắt thêm một chỗ ngay lượt
đầu — `F4.5` cũng đang đo `AGENTS.md` kiểu đó. Sửa đúng chỗ chứ không nới vế: `F4.5` khẳng định
**cánh cửa**, nên nó đo nội dung `CLAUDE.md`; `AGENTS.md` có luật hay không là việc của `F5.1`.
Hai mục thôi đo trùng một thứ.

**3 đột biến, cả 3 bị bắt** — kể cả cửa ngã về phía dễ nhất: *đọc không được thì coi như CÓ*.

**Và vế 1 đỏ oan ngay lượt đầu:** nó đếm phép đo bằng `file + lenh`, nên một mục chỉ có
`trong_file` bị coi là *"không đo được"*. Danh sách kiểu đo phải theo kịp `xetMuc` — nay bốn kiểu.

**Số của lượt này:** sổ nợ **26 → 25** · `features-smoke` **8 → 11 vế** · danh mục **42 → 43 mục**
· bản **1.3.73**.

**Còn mở:** `KHUNG-47` · `KHUNG-50` (lane ② bàn giao) · `KHUNG-51` · `KHUNG-52`.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Thước kho chữ: ba thư mục CHỈ-THÊM, một luật

**Đỏ lần thứ HAI trong cùng một ngày, cùng một hình dạng.** Sáng vá cho `docs/archive/` (nhịp DỌN
làm cổng đỏ); vài giờ sau lane kia commit **351 dòng hồ sơ migrate** và cổng đỏ lại — vì một lượt
migrate cũng là việc ĐÚNG mà repo BẮT làm.

**Đức chốt: miễn `docs/migrations/` như đã miễn ADR và lưu trữ.** Không phải ngoại lệ thứ ba, mà
là **một luật nhìn ra được sau hai ca**: cả ba thư mục là **bản ghi việc ĐÃ XẢY RA** — chỉ đọc khi
đi tra, và **chỉ có thể to lên**. Ngân sách này đo *thứ MỌI PHIÊN PHẢI NẠP*; tính chúng vào là đo
sai thứ mình định đo, và một cổng đỏ vì việc đúng thì bị nới số cho xong.

Nay khai MỘT chỗ: `THU_MUC_DOCS_KHONG_TINH` trong `repo-structure.mjs`.

**Thước: 5.744 → 4.001 → 3.248.** Hai lượt "miễn" làm thước **chặt hơn gần một nửa**, không lỏng
hơn — vì nó thôi đếm thứ nó không định đếm. Đó là cách phân biệt *chữa mâu thuẫn* với *nới lớp
bảo vệ*: nới thì con số đi lên.

**Ghim:** `cong-do-that.mjs` vế 11 nay có sáu bước — phình ĐỎ · xoá XANH lại · ADR không tính ·
**DỜI sang lưu trữ XANH lại** · **hồ sơ migrate không tính** · không khai thước XANH. Đột biến bỏ
`migrations` khỏi danh sách miễn → ĐỎ.

**Một điều đáng ghi về ĐA PHIÊN:** cổng của tôi đỏ vì **chữ của lane khác**, hai lần. Thước cóc
đặt ở "con số hôm nay" giả định một lane; hai lane thì ai chạy cổng sau sẽ thừa hưởng phần tăng
của người kia và phải đi hỏi người chốt. Chưa vá — ghi ra vì nó sẽ lặp mỗi lần hai lane cùng chạy.

**Còn mở:** `KHUNG-47` · `KHUNG-50` (lane ② bàn giao) · `KHUNG-51` · `KHUNG-52`.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Khoá mức FILE lên nơi phát hành · bảng chảy thành cột

**⑴ BẢNG: tab Migrate phải cuộn 10.607px.** Gốc bệnh KHÔNG phải danh sách một cột — là **cái ô
chứa nó**: `.xep` là lưới thẻ `minmax(268px,1fr)`, nên bốn hồ sơ migrate thành bốn cột rộng
**296px** giữa trang rộng **1.213px**. Vá hai vế: khung hồ sơ span trọn bề ngang · danh sách khai
`column-width` (không `column-count` — số cột phải suy từ màn hình). Kèm **tay kéo** nhớ trong
trình duyệt. Đo: khối checklist **1.943 → 1.023px** (3 cột). **8 đột biến, cả 8 bị bắt** — hai cái
sống sót lượt đầu vì cửa sổ dò `try` rộng 90 ký tự nên `try` BAO NGOÀI lọt vào; siết còn 24.

**⑵ KHOÁ MỨC FILE — mang từ repo tiêu thụ lên đây rồi phát lại.** Đo LẠI ở repo này: **620** cặp
commit khác lane trong 1h cùng vùng, **57% khác file hoàn toàn** (họ: 70%), file/commit p90 **12**
(họ: 7). Hơn nửa số lượt chặn hôm nay là **chặn oan** — và p90 12 là lý do `--sua` phải nhận cả mẻ.

Khối riêng `tam` · trả thì XOÁ HÀNG · chứa nhau HAI CHIỀU · cổng ĐỎ khi còn treo (mốc là HẾT PHIÊN,
không phải ĐÃ ĐẨY) · quá 30 phút NÊU TÊN, **không tự nhả**. Ghim 6 vế, **6+2 đột biến đều bị bắt**.

**BA CHỐT AN TOÀN CHẶN TÔI, cả ba đúng:** ⓐ `EXPECTED_CHECKS` — thêm phép kiểm thứ 15 mà không
khai là cổng DỪNG. ⓑ vân tay luật chung — đổi `AGENTS.md` thì bộ trích **từ chối phát** cho tới khi
ghi câu duyệt của Đức vào sổ. ⓒ "luật chung trỏ tới file bản trích KHÔNG mang" — bản đầu để liên
kết ADR ngay trong luật chung; **lần thứ ba trong ngày** cùng bẫy đó.

**B9 cưỡng chế "một luật vào một luật ra":** khối mới đẩy bản trích **200 → 222 dòng**. Trả lại
bốn chỗ, cả bốn là **gộp thật** chứ không gọt chữ (chi tiết ở ADR-0012) → **200/200 khít**.

**Đức yêu cầu giữa chừng: "tạm nhả khóa, bao giờ ghi file hãy lấy lại"** — đã làm, và lượt còn
lại của phiên chạy **đúng cơ chế vừa port**: trả cả 4 khoá vùng, rồi mỗi lượt ghi mới `--sua` đúng
file đang sửa và `--xong --het` ngay sau. Đây là lượt chạy thật đầu tiên của nó ở repo này.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-52`.

## 2026-09-08 (khuya, tiep) · harness-phat-01 · Duc chot dong KHUNG-42, giu dong VANG

**Duc chot:** *"ok dong KHUNG-42 di, giu dong vang."* — co che khoa **tu het han** bo han, vi
ADR-0012 ⑸ noi nguoc no. Giu lai **dung mot** viec: dong VANG cuoi cong, chi **neu ten**, khong
doi ma thoat. Muc moi la **`KHUNG-54`** (51/52/53 lane ① da dung).

**BAN VA DA SOAN SAN, chua ghi duoc vi khoa `_root` dang o lane ①** (16:35, dong ban 1.3.76).
Ba viec, tu-kiem truoc khi ghi, khong doan:
`node "…/scratchpad/ap-khung42.mjs"` — gach ma KHUNG-42 + chen khoi ly do · them KHUNG-54 ·
them muc quyet dinh vao `decisions.md`. Duong day day du o Log phien nay.

**Va mot canh bao cho ①, dung cho chuong dang lam:** dong VANG nay roi vao `scripts/session-check.mjs`
— dung file lane ① dang giu khoa muc file luc 16:36. Neu ① lam luon thi khoi trung; neu khong,
`KHUNG-54` cho o so.

**Toi SUA lai mot chan doan cua chinh minh:** hai lan `RELEASE-LEDGER.json` hong hom nay toi ghi vao
`KHUNG-50` la "dua ghi khong nguyen tu". SAI. Nguon that la `tests/upgrade-smoke.mjs` doi but sổ
THAT o goc repo roi khoi phuc trong `finally`; mot luot bi cat giua duong de lai `1.2.10 →
1111111111111111` trong cay lam viec. Lane ① tim ra doc lap va da ghi thanh `KHUNG-51`.
Toi da khoi phuc file tu HEAD (ban sao dot bien luu o scratchpad truoc khi khoi phuc).

**Con mo:** `KHUNG-54` (chua ghi vao so) · 3 commit chua day, trong do `b399d2a` la cua toi nam
TREN hai commit cua ①, nen day rieng se phai `--carry` — de ① day cung luot 1.3.76 thi khong can.

## 2026-09-08 (khuya, tiếp) · harness-loi-01 · Chạy thật khoá file → lộ hai lỗ, vá cả hai

**Đức yêu cầu giữa chừng: *"tạm nhả khóa, bao giờ ghi file hãy lấy lại"*.** Làm ngay, và phần còn
lại của phiên chạy **đúng cơ chế vừa port**. Lượt dùng thật đầu tiên lộ ra hai chỗ:

**⑴ `--sua` chặn OAN artifact máy sinh — chính thứ nó sinh ra để bỏ.** Lane kia giữ `_root`, và
`--sua DASHBOARD-*.html` bị từ chối vì bảng nằm trong `_root` — trong khi luật của repo khai nó ở
khối `generated` với câu *"nội dung tất định từ HEAD nên không ai sở hữu chúng theo nghĩa nào"*.
`--soat` miễn nhóm đó từ đầu, `--sua` thì quên: **hai cửa của một cơ chế nói hai điều khác nhau**.
Vá + vế 5b + 2 đột biến. Tổng khoá file: **7 vế · 8 đột biến, tất cả bị bắt**.

**⑵ Cổng đóng phiên CHƯA BIẾT tới khoá file** — vẫn đòi khoá VÙNG cho mọi commit, nên cơ chế mới
chỉ dùng được TRONG LÚC LÀM, không dùng được để ĐÓNG PHIÊN. Đây là mâu thuẫn thật giữa luật mới và
cổng cũ: cổng hỏi *"ai chịu trách nhiệm"* và tìm câu trả lời trong bảng khoá vùng, trong khi
ADR-0012 nói rõ khoá file **không mang** trách nhiệm truy nguồn — nhãn `Lane:` mang. **KHÔNG vá
bằng cách nới cổng.** Ghi `KHUNG-53`, hai lối đề xuất, điều kiện đóng là một lệnh chạy được.

**⑶ Nhân đó đóng `KHUNG-52`** (cổng in tên ba suite CHẬM thay vì suite ĐỎ — sáng nay nó tốn của
tôi bốn lượt đo). Ca hỏng: repo có một suite ĐỎ-nhưng-NHANH và một suite XANH-nhưng-CHẬM; vế đòi
cả hai chiều. **Nhánh thành thật tự chứng minh mình có ích ngay trong lượt vá**: bản đầu chỉ đọc
`stdout` nên in *"không đọc được TÊN suite đỏ"* — và chính câu đó chỉ ra tên nằm ở `stderr`. Lùi
im lặng thì lỗi sống thêm một vòng. 3 đột biến, cả 3 bị bắt.

**Đức chốt chuyển `_root`** lần hai để đóng bản — đã ghi vào bảng quyền, trả ngay sau khi đẩy.

**Số:** bản **1.3.76** · sổ nợ **25/25** · suite **22 suite** · `cong-do-that` **11 → 12 vế** ·
`khoa-file` **7 vế**.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53`.

## 2026-09-09 · harness-loi-01 · Bảng: liệt kê sổ nợ + ô tìm — và một byte BACKSPACE nữa

**Đức nêu:** *"tôi tìm khung 30, 40, 53 trong dashboard nhưng rất mơ hồ? ta có thể thêm tính năng
search không?"* — **gốc bệnh không phải thiếu search.** Đo trước khi gõ: `KHUNG-53` xuất hiện
**0 lần** trên cả trang dù đang mở; `KHUNG-30` chỉ hiện như một chữ nhắc trong thân mục khác.
Bảng có hai CON SỐ sổ nợ và một đoạn giải thích cách đếm, **không liệt kê mục nào**. Tìm kiếm
trên một trang không chứa thứ cần tìm cũng không ra.

**⑴ Bảng liệt kê đủ 25 mục** — mã · mức ưu tiên · tiêu đề · cờ chờ-chốt, chảy thành cột. Dữ liệu
vốn đã có; bảng chỉ đếm rồi vứt đi. Đó là kiểu thiếu tệ nhất của một bảng trạng thái: nó KHẲNG
ĐỊNH có 25 việc rồi không cho tra 25 việc đó là gì.

**⑵ Ô tìm quét CẢ NHÓM ĐANG ẨN.** Ctrl+F không đủ vì bốn trong năm nhóm đang `hidden` — thứ người
xem cần *"không có trên trang"* trong khi nó có. Kết quả nói rõ nhóm nào; bấm là nhảy.

**BYTE BACKSPACE, LẦN THỨ HAI** (rồi lần thứ BA ngay trong lượt viết nhật ký này). Regex dựng
bằng chuỗi Python, mà `\b` là escape HỢP LỆ của Python → **byte 0x08 thật** lọt vào mã nguồn:
regex không khớp gì, cả 25 mục mang `P?`, **không phép kiểm nào đỏ**. Nay có vế đếm **byte điều
khiển thô = 0**.

**Và `--take` chặn OAN artifact máy sinh — LẦN THỨ HAI trong một ngày.** Đức chốt chuyển `_root`,
lệnh TỪ CHỐI vì `DASHBOARD-*.html` "đang sửa dở" — file mà chính lệnh sinh lại mỗi lượt, và luật
khai rõ **không ai sở hữu**. Vá + vế `5c` đo **sự ĐỒNG Ý giữa ba cửa**, không đo từng cửa.

**8 đột biến, cả 8 bị bắt** — trong đó một cái nhét lại byte BACKSPACE vào regex → đỏ.

**Ghi `decisions.md` 7 quyết định của Đức** (08–09/09) — trước đó chỉ nằm trong nhật ký và ADR,
không ở chỗ người ta đi tra.

**B12 chặn tôi, và đúng:** Đức chốt *"ghép `KHUNG-55` vào ADR-0012"*; tôi làm đúng thế và ADR đã
`Accepted` là **BẤT BIẾN**. Lối đúng: **ADR-0013 bổ sung**, tiền lệ ADR-0009. Trần sổ nợ vẫn 25.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

## 2026-09-09 · harness-loi-01 · `--carry` thôi phải hỏi khi cổng đã xanh — nới có ghi giá

**Ba lượt trong hai ngày, cùng một hình dạng, Đức duyệt cả ba:** commit của lane khác nằm dưới
commit của mình; git xếp theo thứ tự nên đẩy cái trên là buộc đẩy cái dưới. **Một cửa mà lần nào
cũng mở thì nó không còn là cửa** — nó là thủ tục, và thủ tục lặp lại bị bỏ qua trước khi bị gỡ.

**Đức chốt:** *"Đẩy đi, và từ nay khỏi hỏi nếu cổng đã xanh."* `AGENTS.md` mục 2 hàng 2 nay chỉ
cấm `--carry` khi **cổng CHƯA xanh toàn bộ** hoặc có commit **không quy thuộc được**.

**GHI RÕ ĐÂY LÀ NỚI, không phải chữa mâu thuẫn.** Hai lượt miễn thước kho chữ hôm qua làm thước
**chặt hơn** (chúng sửa phép đo cho khớp luật đã có). Lượt này đổi **chính luật**, và cái mất có
thật: Đức thôi được báo từng lượt việc của lane khác lên GitHub. Đổi lại, commit chưa push là
**vô hình** với vòng audit chéo — đẩy sớm là được soi sớm.

**B9 lại cưỡng chế "một luật vào một luật ra":** bản trích 200 → 204 dòng. Trả lại bằng cách
**gộp** đoạn *"commit và push tự làm"* (26/08) với đoạn mới — sau lượt này hai đoạn nói cùng một
điều về cùng một câu hỏi *"khi nào AI được tự công bố"*. Về **200/200 khít**.

**Đã ghi ba chỗ:** vân tay luật chung + lý do trong sổ đổi vân tay · `decisions.md` · luật ở
`AGENTS.md`. Đổi luật an toàn mà chỉ nhớ miệng thì lượt sau không ai biết vì sao nó khác.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

## 2026-09-09 · harness-phat-01 · Phat 1.3.76 ra 3 repo — 1 xanh, 2 BI CHINH LUAT CUA BO KHUNG CHAN

**Ket qua:** `n8n-orchestrator` 1.3.67 -> 1.3.76 xong tron, cong XANH TOAN BO, da day, da tra khoa.
`nav_platform_main` va `ALL_SKILL_MANAGEMENT` da nang xong o may nhung **KHONG DAY DUOC**.

### ⑴ Ca thu SAU ho KHUNG-47 — nay dung o tinh nang dau bang

`upgrade` mang FILE `tests/khoa-file.mjs` sang, nhung cho duy nhat goi duoc no la `test:tuan-tu`
— dung cai lenh `upgrade` BI CAM ghi de (va cam la dung: no giu 3 suite san pham cua nav_platform).
Nen tinh nang khoa file toi repo dich voi **0 phep ghim**, cong van XANH.

**Lo chi can repo DA CO `test:tuan-tu` tu truoc.** `ALL_SKILL` chua co nen `upgrade` duoc phep TAO
MOI, va ban moi da gom `khoa-file.mjs` — do lai 10 file no goi: deu co that, khong bo sot suite nao.
Da noi tay o nav_platform va n8n; chay thu ca hai: 7/7 ve xanh.

### ⑵ HAI LUAT CUA BO KHUNG KHOA LAN NHAU — do duoc o ALL_SKILL

`handoff-smoke` doi dong tieu de dung `## Log` (`RE_MO_LOG`, va no la moc `--rotate` tim cho cat).
Repo viet `## Log (append-only)` -> `laNhatKy` FALSE, `docMucTuFile` thay **0 muc** trong khi co **7**.
Nhung `session-check` **cam xoa dong** cua `HANDOFF.md, chi cho DOI CHO.

Doi tieu de = xoa mot dong => do. Khong doi => `handoff-smoke` do. **Khong co nuoc di nao o phia repo.**
Da do ba duong, ca ba tac: them lai duoi dang tieu de thi no thanh mot MUC bao tron phan Log cu ->
vuot tran; them lai dang chu thuong thi khong CUNG BYTE nen van tinh la xoa; tu nhet vao
`docs/archive/` thi lam hong chinh phep doi chieu tung byte cua cong.

**Va mot he qua thu hai:** khi bo do sang lai thi moc so la `origin/main` — noi no van thay 0 muc
— nen **ca 7 muc cu deu thanh "muc MOI"** va 3 muc vuot tran. Bai toan CHUYEN TIEP MOT LAN,
khong phai loi cua muc nao. Da hoan nguyen ban va, ghi thanh `SKILL-1` voi 6 dieu kien dong.

### ⑶ Phat hien nang nhat: 2/3 repo da migrate CHUA BAO GIO co cong xanh

`origin/main` cua `ALL_SKILL` **chua tung khai** `handoff.tran_byte_moi_muc` -> muc do luon [BO],
cong luon thoat **2**. `nav_platform` co 12 file van ban >2MB -> bo do secret luon [BO], cong luon
thoat **2**. Nghia la dieu kien "day khi cong XANH TOAN BO" o hai repo nay **chua tung dat duoc**,
nhung ca hai da tung duoc day. Luat da bi di qua ma khong ai thay.

Toi tu doc thay cong o nav_platform: 12 file, 89,3 MB, **du 8 mau cat thang tu `session-check.mjs`**
-> **0 khop, sach**. **Cho Duc chot 3 cau**, da neu trong bao cao phien.

## 2026-09-09 · harness-loi-01 · Luật mới không có máy cưỡng chế thì vẫn là chữ

**Ngay sau khi đổi luật `--carry`, tôi chạy `safe-push` — và nó VẪN TỪ CHỐI.** Tôi đổi `AGENTS.md`
nhưng chưa dạy công cụ. Đó đúng cái repo gọi là *"luật là chữ"*, và nó lộ ra trong vòng một phút.

**Vá thay vì ghi nợ.** `safe-push.mjs` nay tự cho qua khi đủ **HAI** điều kiện, cả hai do MÁY xét:

- ⑴ **mọi commit sắp đẩy đều quy thuộc được** (có nhãn `Lane:`) — đó là thứ `--carry` thực sự mua;
- ⑵ **dấu xác nhận suite còn hiệu lực trên ĐÚNG cây làm việc này** — dấu buộc vào HEAD + băm cây,
  nên không mượn được của lượt trước.

**Vế ⑵ là chỗ dễ bỏ nhất, và bỏ nó là hỏng cả luật:** còn lại sẽ là *"có nhãn Lane thì đẩy được"*,
tức một lane đẩy việc của lane khác đi **trong lúc cổng đang ĐỎ** — đúng thứ mục 2 hàng 2 sinh ra
để chặn. Đọc dấu thất bại thì coi là CHƯA xanh (fail-closed).

**Tự chứng minh ngay lượt đầu:** lệnh từ chối với lý do *"cây làm việc đã đổi kể từ lượt chạy đó"*
— vì tôi vừa sửa chính `safe-push.mjs`. Thứ tự đúng vẫn là commit → suite → cổng → đẩy.

**3 đột biến, cả 3 bị bắt** (bỏ vế dấu · nối bằng HOẶC · fail-open khi đọc dấu hỏng).

**Vế ghim này YẾU HƠN một ca chạy thật, và ghi rõ thế:** nó đọc mã nguồn, vì `safe-push.mjs` chạy
phần chính ngay lúc nạp module nên không suite nào `import` nổi. Ca thật cần một remote giả —
đáng làm, chưa làm.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

## 2026-09-09 (tiep) · harness-phat-01 · Co che khoa khong co nuoc di cho "xong ma cong chan"

Duc hoi: *"vi sao ban ko tu nha? luat la sua xong file thi nha chu nhi?"* — hoi dung, va cau tra
loi lo ra mot lo cua chinh co che.

**Toi giu khoa vi ly do SAI.** Toi ap luat *"qua 30 phut thi neu ten, tuyet doi khong tu nha"* cho
khoa CUA CHINH TOI. Luat do noi ve khoa cua **lane khac** (AGENTS.md muc 1, ADR-0012 ⑸).

**Nhung tra khoa cung bi chan, boi mot luat khac.** `claim.mjs --release` tu choi khi con commit
chua day: *"de lai commit chua cong bo ma khong ai dung ten"* — ban va cua `KHUNG-33`.

### Trang thai thu ba khong ai luong

| Trang thai | Tra khoa? |
|---|---|
| Sua xong, DA DAY | tra ngay — luat Duc chot 08/09 |
| Dang sua | giu |
| **Sua xong, cong TU CHOI nen chua day duoc** | **ca hai duong deu sai** |

O trang thai thu ba: **giu** = khoa vo thua nhan, dung thu Duc phan doi; **tra** = commit vo chu,
va cong cu canh bao *"Lane TIEP THEO se KHONG day duoc: safe-push tu choi vi no cuon theo commit
cua ban. Chi Duc go duoc."*

Da tra bang `--du-biet` theo lenh Duc, o ca ba khoa (nav_platform `_root`; ALL_SKILL `_root`+`_code`),
ly do ghi vao bang. **Cai gia da tao ra:** hai repo do gio chan duong day cua moi phien sau —
3 va 7 commit. Go bang: Duc duyet `--carry`, HOAC Duc chot 2 cau de toi day not (re hon).

**Goc benh:** co che khoa gia dinh **moi viec xong deu day duoc**. Khi cong chan hop le — o day la
nguong 2MB cua bo do secret, va deadlock hai luat nhat ky — thi khong co nuoc di nao dung ca.
Can mot trang thai thu ba tuong minh: *"da xong phan minh, dang cho nguoi chot"* — khoa duoc tra,
commit khong bi coi la vo chu, va lane sau doc duoc ly do ma khong phai xin `--carry`.

## 2026-09-09 · harness-loi-01 · Thêm một `import` là thêm một ràng buộc "đi cùng nhau"

**Ba suite đỏ ngay sau lượt vá trên**, cùng một gốc: `safe-push.mjs` nay `import` `chay-test.mjs`
(để đọc dấu xác nhận), mà **fixture của ba suite chỉ chép sang `safe-push.mjs` + `repo-structure.mjs`**.
Thiếu một file thì lệnh chết **ngay lúc nạp module** — không phải đỏ một vế, mà không chạy dòng nào.

**Cùng hình dạng bản 1.3.26 đã vấp:** thêm `bang-song/` rồi `upgrade.mjs` đẩy `tests/bang-song.mjs`
sang repo đích mà không đẩy thứ nó kiểm. Bài học cũ, chỗ mắc mới: lần đó là **danh sách phát**,
lần này là **danh sách fixture**.

**Vá:** ba chỗ chép fixture nay mang cả `chay-test.mjs`, kèm một dòng nói vì sao. Bản trích không
phải sửa — `chay-test.mjs` vốn đã nằm trong `PORTABLE_SCRIPTS`.

**Chỗ này chưa có máy canh, ghi ra để không ai tưởng nó kín:** không phép kiểm nào đối chiếu *"file
X import gì"* với *"fixture chép gì"*. Lần sau ai thêm một import vào một script được fixture chép
thì lại vấp y hệt — và triệu chứng là `MODULE_NOT_FOUND` ở một suite trông không liên quan.

**Còn mở:** `KHUNG-47` · `KHUNG-50` · `KHUNG-51` · `KHUNG-53` · `KHUNG-54`.

### 2026-09-09 · harness-loi-01 · Dọn luật trùng + trả nợ rổ D

**Làm gì:** ⑴ phân loại 25 mục nợ thành 4 rổ, Đức duyệt gộp/xoá; ⑵ xoá `KHUNG-24` (ca hỏng không
dựng nổi — `units.root_dir = null`), gộp `KHUNG-31`→`KHUNG-6` và `KHUNG-3`→`KHUNG-14` (cả hai tự
khai trùng hình dạng); ⑶ đóng `KHUNG-8` và `KHUNG-10`; ⑷ sửa mâu thuẫn trong luật chung mục 1.

**Số:** sổ nợ **25 → 20 mục mở** (trần 25). Luật chung mục 1 trước đây nói **BA mốc trả khoá khác
nhau** cùng lúc → nay **MỘT mốc mỗi loại khoá**. Câu *"quá 30 phút … KHÔNG tự nhả"* thiếu chủ ngữ
→ nay có chủ ngữ (MÁY), và dời xuống cạnh luật về khoá lane khác. Bảng tra mục 6 nói *"6 trên 11
mục cổng có ca đỏ"* — số của 05/09; đo lại 09/09 là **11 trên 15**, nay ghi đúng và nêu tên 4 mục
chưa có. Bản trích **220 → 200/200 dòng** (B9): 20 dòng gọt đều là chữ, **không luật nào mất**.

**Ghim:** `tests/core-contract.mjs` F12 nhận vế thứ ba — F12 cũ chỉ đọc **link markdown**, nên tên
file trong **dấu nháy ngược** lọt hết. Lượt này bản chữ đầu suýt phát đi luật gọi tên
`docs/SO-TAY-AGENT.md` và `IDEAS.md` — bản trích không mang cả hai, F12 vẫn XANH, tôi phải bắt bằng
tay. **4 đột biến đã chạy, 2 cái SỐNG SÓT lượt đầu** (bảng miễn trừ chưa từng chặn gì → đã gỡ;
và vế chính không thể đỏ ở repo sạch → thêm đoạn giả lập chạy qua đúng phép lọc).

**Còn mở:** 20 mục, trong đó **6 chờ Đức** (`KHUNG-6` · `KHUNG-11` · `KHUNG-14` · `KHUNG-30` ·
`KHUNG-37` · `KHUNG-40` mang dấu `@Đức`). Rổ A còn `KHUNG-9` · `KHUNG-15` · `KHUNG-39` · `KHUNG-50`
· `KHUNG-51` chưa đóng. Hướng dịch luật sang tiếng Anh **đã đóng** — Đức chốt giữ tiếng Việt.

### 2026-09-09 (2) · harness-loi-01 · Gộp luật KHOÁ, và lắp răng cho sổ quyết định

**Làm gì:** ⑴ gộp **3 quyết định về khoá** (06/09 · 08/09 ×2) thành MỘT mục trạng-thái-cuối, dời
ba mục cũ nguyên văn sang `docs/archive/DECISIONS-khoa-2026-09.md`; ⑵ phát hiện `decisions.md`
khai *"chỉ thêm"* trong luật mà **không phép kiểm máy nào canh** — cơ chế *dời-chỗ-chứ-không-xoá*
trước nay chỉ chạy cho `HANDOFF.md`. Lắp răng bằng đúng cỗ máy đó.

**Số:** `decisions.md` **30 → 28 quyết định**, 640 → 628 dòng, 6.828 → 6.693 từ. Dời **37 dòng**,
đối chiếu độc lập bằng `git diff`: 0 dòng mất. Cổng **15 → 16 phép kiểm** (khai ở `EXPECTED_CHECKS`).
`cong-do-that.mjs` **12 vế → 13**, và độ phủ cổng **11/15 → 12/16** — bảng tra mục 6 đã cập nhật.
Bản **1.3.81**. Bản trích vẫn **200/200** (vân tay luật chung KHÔNG đổi — sửa nằm ở bảng tra riêng
của repo, không nằm trong luật chung).

**Ghim:** `tests/cong-do-that.mjs` vế 13 — bốn nhánh: chỉ thêm XANH · xoá mất hẳn ĐỎ · **bản lưu
trữ lệch MỘT ký tự vẫn ĐỎ** · dời khớp byte XANH lại. Vế thứ ba là vế chống lách bằng file rỗng;
vế thứ tư giữ cho cổng không chặn oan lượt dọn đúng luật.

**Hai chỗ tự vấp, ghi lại vì cả hai sẽ tái phát:** ⑴ viết `*` `/archive/` `*` vào khối chú thích
`/* */` là **đóng luôn khối chú thích**, cả file chết lúc nạp; ⑵ fixture đặt `decisions.md` là file
MỚI TINH thì mọi dòng đều là dòng THÊM, nên xoá bao nhiêu cũng không hiện ra — phải đẩy sổ lên
**mốc so** trước. Ca ⑵ làm vế đỏ báo XANH, tức suýt ghim một phép kiểm không thể đỏ.

**Còn mở:** sổ nợ **20 mục** (6 chờ Đức). Rà luật mới xong `AGENTS.md` + cụm KHOÁ của
`decisions.md`; **chưa rà** 14 ADR (11.150 từ) · `ORCHESTRATOR.md` (5.160) · `SO-TAY-AGENT.md` ·
`MULTIFLOW.md` · `LEGEND.md`. Cụm **BẢNG** (6 quyết định) và mục #2 *"Push dù cổng còn đỏ"* là hai
cụm nhiễu kế tiếp đã khoanh được.

### 2026-09-09 (3) · harness-loi-01 · BỘ BIÊN DỊCH LUẬT + B16

**Làm gì:** Đức chốt cơ chế *append → merge → supersede → trim → compile*. Dựng
`scripts/rule-compiler.mjs` (6 bước, tất định) + phép kiểm **B16** (nhóm CHẶN) + ghim
`tests/rule-compiler.mjs`. **Không gộp file ADR** như repo Extension làm — B12 khai ADR `Accepted`
bất biến; ta gộp **câu trả lời** bằng `chu_de`/`dau_moi` trong frontmatter, thứ B12 cho phép sửa.

**Số:** **15 ADR → 6 chủ đề**, mỗi chủ đề đúng một đầu mối, 0 vi phạm. Cổng cấu trúc **15 → 16**
phép kiểm. Suite **21 → 22**. Bản **1.3.82**. Bản trích **200/200** dòng, nay mang thêm
`scripts/rule-compiler.mjs` + khai sẵn `luat.chu_de` + hạt giống ADR có `chu_de`.

**Bốn con số gõ tay đã sai, sửa bằng cách cho máy ĐẾM:** bộ kiểm cấu trúc tự xưng *"15 phép kiểm
B1…B15"* (nay đếm) · cổng phiên gọi nó *"B1–B14"* (nay bỏ số khỏi tên mục) · bảng tra nói *"6 trên
11"* (đã sửa lượt trước) · bảng lệnh trong bản trích cũng ghi *"B1–B14"*.

**Ghim:** 8 vế · **5 đột biến chạy thật, 1 SỐNG SÓT lượt đầu** — fixture đặt đầu mối trùng luôn là
mã nhỏ nhất, nên xếp-theo-mã và xếp-theo-đầu-mối cho CÙNG kết quả; vế đó chỉ đang xác nhận một sự
trùng hợp. Đảo fixture là đột biến chết. Mọi lượt đột biến đều kiểm `diff` để chắc nó ĐÃ áp dụng.

**Hai bẫy cũ lại suýt cắn, cả hai bị phép ghim CŨ bắt:** ⑴ `check-bootstrap.mjs` `import`
`rule-compiler.mjs` mà bản trích không mang → `MODULE_NOT_FOUND` ở mọi repo tiêu thụ; ⑵ luật trong
bản trích gọi `npm run luat` mà bản trích chưa khai lệnh đó — `template-null-repo` bắt đúng chỗ.

**Còn mở:** sổ nợ 20 mục. Rà luật: xong `AGENTS.md` · cụm KHOÁ · **14 ADR đã phân nhóm**. Chưa rà
`ORCHESTRATOR.md` (5.160 từ) · `SO-TAY-AGENT.md` · `MULTIFLOW.md` · `LEGEND.md`, và cụm **BẢNG**
(6 quyết định) + mục *"Push dù cổng còn đỏ"* trong `decisions.md`.

### 2026-09-09 (4) · harness-loi-01 · Tài liệu dạy mặc định CŨ — đo, sửa, ghim

**Làm gì:** rà kho tài liệu tìm chỗ chép lại luật đã bị thay thế.

**Số:** lệnh khoá MỚI `--sua` có ở **1 file**, lệnh CŨ `--take` ở **4 file**. Nặng nhất:
`docs/briefs/GIAO-VIEC-CHUNG.md` — đề bài giao cho AI khác, nên **mọi phiên được giao việc** đều
học mặc định đã bị thay thế. Đã sửa 4 file (`SO-TAY-AGENT` · `TINH-NANG` · `MULTIFLOW` ·
`GIAO-VIEC-CHUNG`) trỏ về `AGENTS.md` mục 1 thay vì chép luật. Sổ quyết định **29 → 28**: dời mục
06/09 *"Bảng phải tự tươi — chưa làm"* sang kho (nó sai sự thật: 07/09 đã cài, `Y-10` bậc *đã
chứng minh*), đối chiếu byte 0 dòng mất.

**Ghim:** `core-contract` **F20** — file nào nhắc `--take` phải nhắc cả `--sua`. Một đột biến đã
chạy: trả `GIAO-VIEC-CHUNG.md` về bản cũ → F20 nêu đúng tên file.

**Bản đầu của F20 tự nó là ca hỏng:** dò chuỗi đầy đủ `claim.mjs --take` nên chỉ thấy 1 file và
**bỏ sót đúng file nặng nhất**. Phép đo hẹp hơn thực tế thì nó báo xanh ở chỗ đang hỏng.

**Chỗ khoanh SAI, sửa lại:** lượt trước tôi khoanh quyết định 05/09 *"Push dù cổng còn đỏ"* là
nhiễu. Đọc kỹ thì nó **tự giới hạn tường minh** (*"KHÔNG mở ra luật"*, kèm ba điều kiện viện dẫn)
— giữ nguyên.

**Memory của phiên:** trước nay TRỐNG. Đã dựng theo đúng luật vừa viết — `MEMORY.md` nói rõ
**luật của repo KHÔNG ghi vào memory** (luật có nhà riêng); memory chỉ giữ thứ repo không ghi
được. Hai mục: Đức uỷ quyền chuỗi dài · Đức đọc SỐ không đọc tính từ.

**Còn mở:** sổ nợ 20 mục. Chưa rà: `ORCHESTRATOR.md` (ba luật lớn chưa có phép kiểm máy = `KHUNG-4`,
đã có mục nợ nên không mở mục mới) · `LEGEND.md` · `HUONG-DAN.md`.

### 2026-09-09 (5) · harness-loi-01 · Trả giá cho phần vừa thêm — thước cóc SIẾT xuống

**Vì sao có mục này:** cổng ĐỎ ở *Kho chữ không phình* sau lượt sửa tài liệu (+12 dòng). Ba cửa
ra là gọt · chuyển sang ADR · **nới thước**. Nới thước là nới một lớp bảo vệ nên không dùng.

**Làm gì:** ⑴ nén lại chính phần mình vừa thêm ở ba file (−5 dòng); ⑵ tìm được chỗ nhiễu thật —
`docs/ROADMAP-V2.md` chứa **kế hoạch sáu đợt** đã bị hai khối *Cập nhật* phía trên phủ lên, và
chính file đó ghi *"mục này thay phần xếp đợt bên dưới ở những chỗ mâu thuẫn"*. Một file nói hai
thứ tự rồi dặn đọc cái nào trước — đúng hình dạng `ADR-0014` sinh ra để cắt.

**Số:** đo trước khi dời: **7 trong 13** mã việc kế hoạch cũ nhắc tới **đã đóng**. Dời **71 dòng**
sang `docs/archive/ROADMAP-V2-dot-0-den-5.md`, đối chiếu byte 0 dòng mất. `ROADMAP-V2.md`
**179 → 120 dòng**. Kho chữ **3.260 → 3.196**. **Thước cóc 3.248 → 3.196** — SIẾT, không nới.
Bản **1.3.86**.

**Chỗ thay vào:** một mục ngắn nói thứ tự hiện hành nằm ở đâu (`npm run what-next`), và giữ lại
luật còn hiệu lực *GOM BẢN PHÁT*.
