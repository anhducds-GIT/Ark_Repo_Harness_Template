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
