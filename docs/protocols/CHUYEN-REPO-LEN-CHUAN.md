---
kind: protocol
status: active
ttl_days: 180
---

# QUY TRÌNH — đưa một repo đang sống lên chuẩn

> **Dùng khi nào:** đã chạy [KIEM-MOT-REPO.md](KIEM-MOT-REPO.md) và quyết định làm.
> **Khác với khởi tạo mới:** repo này **đã có việc, đã có lịch sử, đã có người dùng**. Nên luật
> nền của cả quy trình là: *thêm vào, đừng thay thế; và không bao giờ bật chặn khi đang đỏ.*

## Trạng thái của chính quy trình này

**Đã chạy thật 2 lần, cùng ngày 2026-09-03, trên hai repo khác nghề** — bản khung lúc đó là
`0.3.0`. Hồ sơ từng lượt ở [../migrations/](../migrations/), và **đọc hồ sơ trước khi đọc sáu
bước dưới đây**: chỗ vấp thật nằm trong hồ sơ, không nằm trong quy trình.

| Repo | Nghề | Mức | Cổng | Lỗi tìm ra |
|---|---|---|---|---|
| NAV Platform V1 | Node + Python · chứng khoán | 1 → 3 | xanh toàn bộ | 9 |
| Project 3 AI Agent Unify | Python · điều phối nhiều AI | 1 → 3 | 9 xanh 1 bỏ | 8 |

**Bốn chỗ quy trình này tự mâu thuẫn, cả bốn do hai lượt đó lôi ra:**

1. **Bước 4 bảo để `bootstrap.blocking` rỗng vì repo mới migrate sẽ đỏ — suite hạt giống lại
   khẳng định cứng "0 đỏ".** Hai cửa đo cùng một thứ, hai kết quả.
2. **`units.marker` bắt buộc phải là JSON, mà không dòng nào ở đây nói.** Khai một file `.md`
   thì bộ sinh bảng **chết**, còn cổng cấu trúc thì không — hai công cụ nói hai đằng.
3. **Cổng đóng phiên cứng `origin/main`.** Repo làm việc theo nhánh tính năng thì phép kiểm nhãn
   lane không có mốc để so, nên nó **BỎ** chứ không xanh. Đúng thiết kế, nhưng quy trình không
   báo trước, nên người chạy tưởng mình làm sai.
4. **Quy trình đòi cổng xanh nhưng cấm dọn thứ làm cổng đỏ.** Lối ra đã dùng thật ở NAV: danh
   sách **miễn trừ CÓ HẠN** — lý do · người chốt · ngày hết hạn. Không xoá (mất ý định), không
   để đỏ triền miên (người ta thôi đọc suite).

**Chưa đo lại ở bản khung hiện tại.** Hai lượt trên chạy ở `0.3.0`; bộ khung nay đã khác nhiều.
Lượt migrate thứ ba nên coi bốn điểm trên là *đã biết*, và mọi thứ khác là *chưa kiểm lại*.

Ai chạy lượt sau: ghi chỗ vấp **ngay tại đây**, đừng chỉ ghi vào hồ sơ lượt. Hồ sơ kể một lượt;
mục này là thứ người sau đọc. Hai lượt đầu ghi hồ sơ đầy đủ nhưng **không ghi ngược lại vào đây**
— nên suốt từ 03/09 tới 05/09 file này vẫn nói "chưa từng chạy" trong khi `AGENTS.md` ở gốc nói
"đã chạy thật 2 lần". Đó chính là cái bẫy mục này tồn tại để chặn, và nó đã sập một lần rồi.

## Migrate là BA việc trong một — Đức chốt 2026-09-05

Xem [decisions.md](../../decisions.md). Một lượt migrate gồm:

| # | Việc | Xong nghĩa là gì |
|---|---|---|
| 1 | **Migrate** | bộ khung nằm trong repo đích, hình dạng repo đã khai, cổng chạy được |
| 2 | **Audit** | đã **quét và rà soát** repo đích, nợ tìm được đã nằm trong sổ nợ của nó |
| 3 | **Bring AI assistant onboard** | một phiên AI ở repo đích **chạy được vòng làm việc của nó ngay** |

**Lượt migrate KHÔNG xong khi cổng xanh.** Xong là khi việc 3 đạt — vì Đức làm việc với từng repo
*qua assistant của repo đó*. Cấu trúc đúng mà không ai vận hành được thì migrate chưa tạo ra giá
trị nào.

**Trách nhiệm cho việc 3 thuộc bộ khung này**, không đẩy sang repo đích.

## Checklist tính năng mang sang — 28 file, bốn nhóm

Sinh bằng `npm run template`. Đối chiếu sau khi thả: `npm run template -- --check`.

| Nhóm | Mang gì | Thiếu thì hỏng ra sao |
|---|---|---|
| **Luật** | `AGENTS.md` · `CLAUDE.md` · `.repo-structure.json` | Không có bảng `areas` thì mọi đường dẫn quy về một khoá, và lớp chống giẫm chân thành hình nền |
| **Máy** (8 lệnh) | `claim` · `repo-structure` · `session-check` · `safe-push` · `check-bootstrap` · `build-dashboard` · `state-check` · `what-next` | Thiếu `claim` thì luật mục 1 trỏ vào khoảng không — đã xảy ra thật 03/09 |
| **Trạng thái** | `STATUS.md` · `HANDOFF.md` · `.agents/claims.json` · `STATUS.template.md` | Không khai `scripts.test` thì cổng **báo xanh mà không chạy dòng nào** |
| **Sổ tay + ghim** | `MULTIFLOW` · `ORCHESTRATOR` · 4 bản mẫu · ADR-0000 · `.gitattributes` · 2 suite ghim | Công cụ không kèm hàng rào thì hàng rào là thứ đầu tiên mất |

### HAI FILE LUẬT BẮT DÙNG MÀ BẢN TRÍCH KHÔNG MANG — đo 05/09, chưa vá

`template/AGENTS.md` dòng 11 bắt ghi việc ngoài phạm vi vào **`BACKLOG.md`**; dòng 175 bắt ghi
quyết định vào **`decisions.md`**. Bản trích **không mang file nào trong hai**.

Nên **mọi repo dựng từ khuôn sinh ra đã mang sẵn** đúng bệnh mà repo nhà vừa vá cùng ngày: luật
trỏ tới thứ không tồn tại, `npm run what-next` báo *"0 việc mở"* vĩnh viễn, và quyết định của
người chốt không có chỗ hạ cánh.

**Ai chạy lượt migrate trước khi chỗ này được vá: thả tay hai file đó vào repo đích**, mỗi file
một dòng tiêu đề là đủ. Đừng chờ bản vá. Ghi ở đây thay vì chỉ ghi vào sổ nợ, vì người cần biết
là người đang migrate, và họ đọc file này chứ không đọc sổ nợ của bộ khung.

### Việc 3 — bring assistant onboard, ba phép thử

Làm xong ba phép này ở repo đích thì việc 3 đạt. Chưa làm thì **chưa xong lượt migrate**:

1. `npm run what-next` chạy được, và **kể đúng** việc đang mở của repo đó — không phải in ra bảng
   rỗng vì chưa có sổ nợ.
2. `npm run state-check` trả một trong ba mã thoát thật (`OK` / `MISMATCH` / `UNKNOWN`), không nổ.
3. Một phiên AI mở ở repo đích, đọc `AGENTS.md` → `HANDOFF.md`, **nhận được một khoá và làm được
   một việc nhỏ trọn vẹn tới lúc cổng xanh** — không cần ai ở bộ khung giải thích thêm.

Phép 3 là phép duy nhất chứng minh được việc 3, và nó **phải chạy thật**, không suy từ hai phép
trên. Hai lượt migrate 03/09 đều dừng ở mức cổng xanh, tức chưa lượt nào đi qua phép này.

## BƯỚC 0 — AUDIT ĐỘC LẬP TRƯỚC KHI THẢ FILE NÀO

> **Thêm 2026-09-05, sau lượt trial trên `ALL_SKILL_MANAGEMENT`.** Bước này đứng TRƯỚC cả bước
> đo, và nó tồn tại vì một lý do đo được: repo đích thường **đã có sẵn file trùng tên** với thứ
> bộ khung sắp thả vào.

**Đo thật ở `ALL_SKILL_MANAGEMENT`:** bốn file trùng tên đang giữ **1824 dòng nội dung riêng** —
`AGENTS.md` (26 luật riêng), `DASHBOARD.md` (viết tay, có bản mirror sang Google Sheet),
`decisions.md` (sổ quyết định chỉ-thêm), `handoff.md` (**1225 dòng** nhật ký vận hành). Thả đè
là mất sạch, và mất theo cách không ai nhận ra ngay.

### Giao audit cho một AI KHÁC, không tự audit

```bash
codex exec -s workspace-write -m <model> -c windows.sandbox='"unelevated"' - < brief-audit.txt
```

**Chạy trên một bản clone trong thư mục tạm, không chạy trên repo thật.** Tác nhân ngoài không có
lý do gì được quyền ghi vào repo đang sống.

Brief phải hỏi đủ sáu câu, và câu 6 là câu đắt nhất:
1. Repo này là gì — một đoạn cho người không đọc code.
2. Chia mấy **khoá vùng**, gồm thư mục nào, vì sao. Chỗ nào **bắt buộc chung khoá**.
3. File nào **máy sinh**, sinh bằng lệnh gì.
4. **Xung đột luật** — repo đã có cơ chế phân quyền riêng chưa, nó chọi với khoá vùng ở đâu.
5. Một phiên AI mới **sẽ vấp ở đâu**.
6. **File nào trùng tên với thứ bộ khung sắp ghi vào, và trùng thì mất gì.**

### Luật cứng: BỐN FILE KHÔNG ĐƯỢC ĐÈ

`AGENTS.md` · `DASHBOARD.md` · `decisions.md` · `handoff.md`/`HANDOFF.md`.

Repo đích có sẵn thì **THÊM VÀO, không thay thế** — thêm một mục mới ở cuối, giữ nguyên phần cũ.
Đo trước và sau bằng số dòng, **không chỉ kiểm "file còn tồn tại"**:

```bash
wc -l AGENTS.md DASHBOARD.md decisions.md handoff.md    # trước, ghi lại
wc -l AGENTS.md DASHBOARD.md decisions.md handoff.md    # sau, phải >= trước
```

Số dòng **giảm** ở bất kỳ file nào trong bốn = đã đè mất nội dung. Dừng, hoàn nguyên.

### Repo đích ĐÃ CÓ cơ chế hiệp đồng riêng — bộ khung là chuẩn, Đức chốt 2026-09-06

Ca này đã gặp ở **cả hai** repo chạm tới: `n8n-orchestrator` đặt `lock` ngay trong từng task,
`ALL_SKILL_MANAGEMENT` có `authority_matrix.md` + `discussion_protocol.md` + `rounds/`. Tức
không phải một bộ luật gặp một repo trống, mà **hai bộ luật chồng nhau**.

**Luật:** sau khi lắp bộ khung, **khoá vùng + cổng đóng phiên là chuẩn**. Cơ chế cũ thôi hiệu lực.

**Vì sao phải chốt một cái thắng, chứ không "giữ cả hai":** hai hệ song song thì một AI có thể
**hợp lệ theo hệ này mà vi phạm hệ kia**, và không ai sai cả. Đo thật ở `n8n-orchestrator`:
`npm run what-next` chỉ đọc khoá vùng, nên khoá nằm trong task **bị che khuất hoàn toàn** —
người điều phối nhìn bảng và không thấy nửa số khoá đang giữ. Một bảng thiếu nửa dữ liệu tệ hơn
không có bảng, vì nó tạo lòng tin.

**KHAI TỬ luật cũ, GIỮ văn bản cũ — hai việc khác nhau, đừng gộp.**

| Được làm | Không được làm |
|---|---|
| Thêm dòng *"KHÔNG CÒN HIỆU LỰC từ &lt;ngày&gt; — xem `AGENTS.md`"* ở đầu file luật cũ | Xoá file luật cũ |
| Trỏ từ file cũ sang luật mới | Ghi đè nội dung cũ bằng nội dung bộ khung |
| Ghi một dòng vào `decisions.md` của repo đích | Coi quyết định này là giấy phép xoá |

Quyết định của Đức chốt **cơ chế nào là chuẩn** — nó KHÔNG lật `AGENTS.md` mục 2 hàng 1 (xoá
file / sửa dữ liệu gốc phải hỏi), cũng không lật luật bốn file ở trên. Lý do rất cụ thể: riêng
`ALL_SKILL_MANAGEMENT`, bốn file trùng tên đang giữ **1824 dòng** nội dung không có ở đâu khác.
Một luật hết hiệu lực vẫn là **bằng chứng vì sao repo từng chạy như thế** — và bộ khung này
sống bằng bằng chứng.

**Mỗi lượt thi hành ở từng repo vẫn phải hỏi người chốt riêng.** Luật ở đây nói *đi hướng nào*,
không nói *được đi mà không xin phép*.

### Repo đích ĐÃ CÓ `DASHBOARD.md` viết tay — khai tên khác, đừng đổi tên file của họ

Từ bản **1.3.11**, ba artifact máy sinh khai tên được. Repo đích đã có file trùng tên thì
**bộ khung nhường**, không phải ngược lại:

```json
"generated_names": { "dashboard": "BANG-MAY-SINH.md", "llms": "cong-vao.txt", "repo_map": "ban-do.json" }
```

Khai thiếu khoá nào thì khoá đó dùng mặc định — vướng một tên không phải khai cả ba.

**Vì sao quan trọng:** vấp thật 06/09 ở `ALL_SKILL_MANAGEMENT` — repo đó có một bảng theo dõi
**viết tay 123 dòng**, có mirror sang Google Sheet, được ba file khác trỏ tới. Chạy bộ sinh MỘT
LẦN là đè mất, và đè **im lặng**. Trước 1.3.11 cách duy nhất là đổi tên file của repo đích, tức
bộ khung là khách mà bắt chủ nhà dọn phòng.

**Kiểm trước khi chạy bộ sinh lần đầu, ba tên:**

```bash
ls DASHBOARD.md llms.txt repo-map.json 2>/dev/null   # có file nào là phải khai tên khác
```


### Kiểm chứng lại audit, đừng tin thẳng

Luật vàng số 4 áp cho cả audit của AI khác. Trial 05/09: Codex báo ba lệnh thoát mã `2/1/1` ở
repo `n8n-orchestrator` — đo lại thì **cả ba exit 0**. Nếu tin thẳng thì đã đi sửa ba thứ không
hỏng. Mỗi phát hiện phải tự chạy lại trước khi đưa vào kế hoạch migrate.

## Tám bước, theo đúng thứ tự

> Tiêu đề này nói **Sáu** suốt từ lúc viết, trong khi bên dưới có tám bước đánh số — hai bước
> cuối (hồ sơ migrate · ghim phiên bản) thêm vào sau mà không ai sửa tiêu đề. Bắt được 06/09
> lúc rà lại quy trình để giao cho AI khác: một phiên đọc "sáu bước" rồi dừng ở bước 6 là
> **bỏ đúng hai bước không được bỏ**. Đây là hình dạng lỗi quen thuộc của repo này — luật trỏ
> tới một thứ không khớp thực tế — nay đếm được **lần thứ sáu**.

### 1. Đo trước, và ghi lại con số

```bash
node scripts/assess.mjs <đường-dẫn-repo>
```

Chưa đo mà đã thả file vào là mất mốc so sánh — sau này không ai chứng minh được việc này có
đổi gì không.

### 2. Nhận quyền, hoặc dựng bảng quyền nếu chưa có

Repo đích chưa có `.agents/claims.json` thì thả bản hạt giống vào **trước tiên**. Bắt đầu sửa
khi chưa có bảng quyền là mở đường cho đúng lỗi mà cả cơ chế này sinh ra để chặn.

### 3. Thả nhóm MÁY — chép, không nghĩ

Năm công cụ cộng suite hạt giống. Không sửa gì trong lúc chép: sửa lúc này là tạo ngay một
nhánh thứ hai của bộ máy, và hai bản thì trôi khỏi nhau.

### 4. Khai hình dạng repo — đây là bước duy nhất phải NGHĨ

Trong `.repo-structure.json`:

- `repo.name` · `units.ten` — tên repo và **gọi một đơn vị công việc là gì** (Extension · Gói ·
  Dịch vụ · Tài liệu). Bỏ qua `units.ten` thì bảng gọi mọi thứ là "Đơn vị" — đúng nhưng vô hồn.
- `units` — đơn vị nằm ở đâu, sâu mấy tầng, file nào đánh dấu. Repo không có đơn vị con thì
  `root_dir: null`.
- `areas` — mỗi thư mục tầng ngoài cùng một dòng. **Chia ít thôi lúc đầu.** Chia nhỏ khi chưa
  biết ai làm gì là tự tạo tranh chấp; gộp lại sau dễ hơn tách ra.
- `bootstrap.blocking` — **để RỖNG.** Bật chặn khi repo đang đỏ là tự khoá repo ngay ở phiên
  đầu tiên. Chạy vài phiên cho sạch rồi mới bật dần.

### 5. Khai `scripts.test`, kể cả khi chưa có test của riêng repo

Suite hạt giống đi kèm bộ khung đã chạy được ngay. Không khai thì cổng đóng phiên **báo xanh mà
không chạy một dòng nào** — và nó sẽ im như thế mãi mãi.

### 6. Sinh trang, rồi mới chạy cổng

```bash
node scripts/build-dashboard.mjs   # SAU khi đã commit nguồn
node scripts/check-bootstrap.mjs
node scripts/session-check.mjs --as <nhãn-phiên>
```

**Thứ tự này không đổi được:** bộ sinh đọc hoàn toàn từ HEAD, nên sinh trước khi commit là dựng
lại từ một HEAD chưa có gì. Lỗi này đã xảy ra thật, và nó im lặng — trang vẫn sinh ra, chỉ là
nói về một quá khứ khác.

### 7. Ghi một hồ sơ vào sổ migrate — BƯỚC NÀY KHÔNG ĐƯỢC BỎ

Thêm đúng một file `docs/migrations/<ngày>-<tên-repo>.md` ở **repo nhà của bộ khung**, theo
khuôn của các hồ sơ đã có: khai `repo` · `ngay` · `ban_khung` · `muc_truoc` · `muc_sau` ·
`chi_phi_truoc` · `chi_phi_sau` · `cong_dong_phien` · `trang_thai` · `loi_tim_ra`, rồi bốn phần
thân bài: **trạng thái mới nhất · vì sao chưa đóng được (nếu có) · báo cáo · câu hỏi mở**.

```bash
npm run overview      # tab "Migrate" của bảng đọc thẳng docs/migrations/ — RỒI COMMIT
```

Vì sao bắt buộc: migrate xảy ra **thưa** — vài tuần, có khi vài tháng một lần. Đúng loại việc
mà cả người lẫn AI đều quên sạch. Không có hồ sơ thì lần sau dò lại từ đầu và vấp đúng chỗ cũ.
Hồ sơ **chỉ thêm, không sửa cái cũ** — sửa hồ sơ cũ là viết lại lịch sử của lần migrate đó.

### 8. Ghim phiên bản — để lần vá sau không phải chép tay

```bash
node scripts/upgrade.mjs --apply <đường-dẫn-repo>
```

Ghi `.ark/harness.lock.json` vào repo đích: bản khung đang dùng, và dấu vân tay từng file máy.
Từ đó về sau, vá bộ khung xong chỉ cần `--plan` để xem repo nào cũ, `--apply` để đẩy sang.

**Đừng bỏ bước này.** Không ghim thì lần vá sau lại là chép tay, và chép tay là cách một bộ
khung biến thành N bộ khung khác nhau — đúng thứ cả chương trình này sinh ra để chữa.

## Bốn cạm bẫy, cả bốn đều đã xảy ra thật

| Bẫy | Hậu quả |
|---|---|
| Bật `bootstrap.blocking` ngay từ đầu | Repo bị khoá ở phiên đầu tiên, không ai vào được |
| Chia `areas` quá nhỏ khi chưa biết ai làm gì | Tự tạo tranh chấp quyền cho một việc không hề chồng nhau |
| Sinh trang trước khi commit nguồn | Trang dựng từ HEAD cũ — **hỏng im lặng**, trang vẫn đẹp |
| Sửa bộ máy trong lúc chép sang | Hai nhánh của cùng một công cụ, và chúng sẽ trôi khỏi nhau |

## Nghiệm thu — bằng máy, không bằng lời

```bash
node scripts/assess.mjs <đường-dẫn-repo>     # mức 3 · chi phí 0/0/0
node scripts/session-check.mjs --as <nhãn>   # XANH TOÀN BỘ
```

Không đạt cả hai thì chưa xong. **Đừng nới cổng cho nó xanh** — sửa bug thì được, gỡ bảo vệ thì
không. Đó là luật vàng số 3, và nó áp cho cả người đang migrate.

## Việc KHÔNG thuộc quy trình này

- **Dọn nợ cũ của repo đích.** Đưa lên chuẩn là thêm một lớp, không phải viết lại repo. Thấy nợ
  thì ghi vào sổ việc-mở của repo đó rồi đi tiếp.
- **Đổi luật của repo đích cho giống repo nhà.** Mỗi repo có nghề riêng; phụ lục nghề sinh ra
  đúng để chỗ đó khác nhau mà vẫn chung một bộ luật gốc.
