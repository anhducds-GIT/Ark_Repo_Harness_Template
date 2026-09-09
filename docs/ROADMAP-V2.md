---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — thứ tự việc đang mở

> **Đây là lớp ĐIỀU PHỐI: thứ tự · phân luồng · phụ thuộc · chỗ cần người chốt.** Nội dung từng
> mục ở [BACKLOG.md](../BACKLOG.md) và [IDEAS.md](../IDEAS.md) — file này **không chép lại**, chỉ
> nói *làm cái nào trước, cái nào chạy cùng lúc được, và vì sao*. Bản đồ việc **sống** thì chạy
> `npm run what-next`: nó giao bảng quyền × sổ nợ × sổ ý tưởng, nên không ôi được.
>
> [ROADMAP-V1](archive/ROADMAP-V1.md) là **lịch sử** (bốn khối A→D dẫn tới v1.0, đã xong). File này
> là việc **đang mở**, rà lại ở mốc 1.8.0.
>
> Luật song song cưỡng chế chỉ một câu ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 2): **hai
> việc chạy song song được khi và chỉ khi thuộc hai khoá khác nhau và cả hai khoá đang trống.**

## Bốn luật chi phối THỨ TỰ — vì sao đợt nào đứng trước

> Lịch sử từng bản ở [CHANGELOG.md](../CHANGELOG.md), từng lượt việc ở
> [docs/archive/HANDOFF-2026-09-2.md](archive/HANDOFF-2026-09-2.md). Ở đây **chỉ giữ luật còn
> hiệu lực** — bốn cái, cả bốn sinh ra từ một ca hỏng thật.

1. **Lỗi chỉ lộ khi chạm dữ liệu thật.** Đo 06/09: năm thứ *"đã viết xong, test xanh"* đều hỏng —
   ba cái lộ nhờ **đột biến kiểm**, hai cái lộ khi chạy nhịp dọn trên nhật ký thật.
   → **Một mục nợ chỉ đóng được khi đã chạy trên dữ liệu thật VÀ đã qua đột biến kiểm.**
   *"Viết xong, test xanh"* không phải điều kiện đủ.
2. **`npm test` xanh không chứng minh gì về một lớp bảo vệ vừa bị NỚI.** Bản 1.3.5 là cửa hậu do
   chính 1.3.3 mở ra; cách duy nhất bắt được là **tự tay dựng ca hỏng**. → Mọi lượt nới một cấu
   hình phải kèm một khối trong `tests/cong-do-that.mjs`.
3. **Migrate đứng SỚM, không đứng cuối.** Bốn lỗi nặng nhất ngày 05/09 đều do một lượt migrate
   thật lôi ra, không do đọc lại code — bảy phiên ở nhà trước đó không tìm ra cái nào.
4. **Phép đo nói dối thì đứng trước phép đo còn thiếu.** Một phép kiểm luôn xanh không làm ai chậm
   hôm nay, nó làm mọi số đo khác mất giá **đúng lúc ta cần tin chúng**. Đây là lý do đợt 2 đứng
   trước đợt 3.

Một số vượt trần từ 06/09 tới nay **chưa ai xử**: thời gian chạy trọn bộ phép kiểm. Nhà của nó là
`Y-06` trong [IDEAS.md](../IDEAS.md), không phải file này — đo bằng `npm run can-nang`.

## Thứ tự việc — bản 10/09, xếp theo THỨ ĐANG THU THUẾ MỖI PHIÊN

> Xếp theo **thuế mỗi phiên phải trả**, không theo số mã việc. Nội dung từng mục ở
> [BACKLOG.md](../BACKLOG.md) và [IDEAS.md](../IDEAS.md) — ở đây **chỉ có thứ tự và vì sao**.

### PHÁT HIỆN LỚN NHẤT của phiên 09→10/09: bốn mục đắt nhất là MỘT bệnh

`KHUNG-59` · `KHUNG-50` · `KHUNG-55` · `KHUNG-51` trông như bốn việc rời. Chúng là **một**:
nhiều lane dùng **chung một cây làm việc git**, nên chung luôn đĩa, chung index, chung HEAD.

| Mã | Chung cái gì | Cái giá đo được |
|---|---|---|
| `KHUNG-59` | **index** | `git add` của lane A bị `git commit` của lane B cuốn theo — **2 lần trong một ngày**, hai chiều ngược nhau |
| `KHUNG-50` | **đĩa + HEAD** | dấu xác nhận suite không ghi được → 3 lượt đủ bộ **29 phút**, 0 dấu |
| `KHUNG-55` | **đĩa** | lane khác sửa dở một file `docs/` là cổng của bạn ĐỎ, và lời nhắn **nói sai tên người** |
| `KHUNG-51` | **đĩa** | suite đột biến ghi đè file thật, một lane khác `git add` trúng lúc đó |

**Đừng vá bốn lần.** Một phiên nên hỏi trước: *chạy suite và bộ sinh trong một `git worktree`
riêng có đóng được mấy mục trong bốn?* Đo trước, rồi mới quyết — nhưng đừng đi vá từng mục như
bốn việc độc lập, vì đó đúng là cách một bệnh sinh ra bốn bản vá không cái nào chữa gốc.

### Đợt 1 · TRẢ THUẾ — làm trước, hiệu quả đo được ngay

| Mã | Vì sao đứng đây |
|---|---|
| `KHUNG-59` | **Đắt nhất và nguy nhất.** Không chỉ chậm — nó **quy sai người** và có thể công bố việc làm dở của lane khác. Ứng viên rẻ: mọi chỗ commit đổi sang `git commit --only <đường dẫn>` |
| `KHUNG-50` | Nửa còn lại của bài toán tốc độ. Vá 1.8.2 đã bỏ `claims.json` khỏi băm; cái còn lại là **HEAD đổi giữa lượt** — hợp lệ, nên chỗ chữa là worktree riêng, không phải nới băm |
| `KHUNG-57` | `can-nang` **603 giây**, đắt hơn cả `npm test`. Lane `harness-migrate-3repo` mở 09/09 |
| `KHUNG-55` | Thước kho chữ đọc **ĐĨA** thay vì HEAD |

### Đợt 2 · CHỜ MỘT VÒNG AUDIT SẠCH — không phải việc mới, là việc chưa đóng được

`KHUNG-53` · `KHUNG-15` · `KHUNG-56` · `KHUNG-58`.

Bốn mục này **đã có bản vá trong HEAD** và đã qua audit độc lập, nhưng **chưa mục nào đóng** —
người sửa không tự ký nghiệm thu (mục 5). Việc còn lại là **một vòng audit không tìm thêm lỗi**,
rồi gạch mã. Rẻ, và nó dọn sổ nợ khỏi bốn mục trông như đang hỏng mà thật ra đã vá.

**Đọc `docs/adr/` và `CHANGELOG.md` bản 1.8.1→1.8.7 trước khi động vào** — bốn vòng audit ngày
10/09 để lại lý lẽ mà đọc code không thấy được.

### Đợt 3 · CHỐNG TỰ DỐI — phép kiểm không phân biệt được hai nhánh là đồ trang trí

`KHUNG-9` → `KHUNG-47` → `KHUNG-44` → `KHUNG-4`. Bốn mục độc lập, chạy song song được nếu khác khoá.

### Đợt 4 · ĐƯỜNG PHÁT HÀNH

`KHUNG-7` → `KHUNG-39`. (`KHUNG-51` đã dời lên đợt 1 vì nó thuộc họ cây-làm-việc-chung.)

### Đợt 5 · Việc mới sinh 09/09

`Y-12` ONE LOADING LAW — có một bản đề xuất **619 dòng đã qua hai lượt review** ở repo
`Chrome_Extension_AI_Agentic`. **ĐỌC TRƯỚC KHI THIẾT KẾ LẠI.**

### KHÔNG ĐỘNG VÀO — đang chờ Đức chốt

`KHUNG-40` · `KHUNG-37` · `Y-03` · `Y-04` · `Y-07` · `Y-08`.

### BỐN LUẬT LÀM VIỆC rút ra ngày 10/09 — áp cho MỌI mục ở trên

1. **Vá ba lần cùng một chỗ = đang vá SAI TẦNG.** Cửa audit vá ba vòng, mỗi vòng bịt một chuỗi,
   vòng sau lòi ra chuỗi khác. Gốc là *ai được quyền định nghĩa*, không phải regex nào thiếu.
2. **Đề bài cho audit phải có THÂN HÀM, không chỉ `git diff`.** Sandbox Codex không đọc được repo;
   vòng 2 nó nói *"chưa đủ bằng chứng"* và nó đúng — lỗi ở cách tôi giao đề.
3. **Đặt một câu bắt người audit soi chính QUYẾT ĐỊNH của mình**, không chỉ soi code. Vòng 2 câu
   *"tôi tự bác kế hoạch đã hứa với Đức, đúng hay sai?"* trả về một lý do tôi chưa nghĩ tới.
4. **Phép ghim chỉ gồm phủ định thì chưa ghim gì.** Vế thành công đòi **mã thoát 0 + một chuỗi
   dương**; vế từ chối đòi **đúng thông báo của cửa đó** — mã 1 một mình không phân biệt được nó
   chết ở cửa nào. Đã dính đúng bẫy này một lần, trong chính lượt viết phép ghim.

**Luật cắt ngang còn nguyên hiệu lực: GOM BẢN PHÁT.** Mỗi lượt cắt bản là một lần mọi repo đích
phải nâng.

## Ba thứ roadmap này CỐ Ý không chứa

1. **Không gán HẠN.** Repo chạy theo phiên, không theo lịch. Gán hạn là tạo một con số sai ngay
   hôm sau. Ngày của một lượt rà thì ghi được — nó là **đã đo lúc nào**, không phải **phải xong lúc nào**.
2. **Không có bản vá kỹ thuật cho từng mục.** Đó là việc của brief giao executor
   ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 4b), và brief kèm sẵn bản vá là điều sổ tay đó cấm.
3. **Không nhắc lại nội dung từng mục nợ.** Hai nguồn sự thật cho cùng một việc là đúng bệnh mà
   cả bộ khung này sinh ra để chữa. Nội dung ở [BACKLOG.md](../BACKLOG.md); thứ tự ở đây.
