---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — thứ tự việc đang mở

> **Đây là lớp ĐIỀU PHỐI: thứ tự · phân luồng · phụ thuộc · chỗ cần người chốt.** Nội dung từng
> mục ở [BACKLOG.md](../BACKLOG.md) và [IDEAS.md](../IDEAS.md) — file này **không chép lại**. Bản
> đồ việc **sống**: `npm run what-next`. Lịch sử: [ROADMAP-V1](archive/ROADMAP-V1.md).
>
> Luật song song ([ORCHESTRATOR](protocols/ORCHESTRATOR.md) mục 2): **hai việc chạy song song được
> khi và chỉ khi thuộc hai khoá khác nhau và cả hai khoá đang trống.**

## Bốn luật chi phối THỨ TỰ — vì sao đợt nào đứng trước

> Lịch sử từng bản ở [CHANGELOG.md](../CHANGELOG.md), từng lượt việc ở
> [docs/archive/HANDOFF-2026-09-2.md](archive/HANDOFF-2026-09-2.md). Cả bốn sinh từ ca hỏng thật.

1. **Một mục nợ chỉ đóng được khi đã chạy trên DỮ LIỆU THẬT và qua ĐỘT BIẾN KIỂM** — 06/09, năm
   thứ *"viết xong, test xanh"* đều hỏng. *"Test xanh"* không phải điều kiện đủ.
2. **`npm test` xanh không chứng minh gì về lớp bảo vệ vừa bị NỚI** (1.3.5 là cửa hậu do 1.3.3 mở).
   Mọi lượt nới một cấu hình phải kèm một khối trong `tests/cong-do-that.mjs`.
3. **Migrate đứng SỚM** — bốn lỗi nặng nhất 05/09 đều do migrate thật lôi ra, không do đọc code.
4. **Phép đo NÓI DỐI đứng trước phép đo còn THIẾU** — một phép kiểm luôn xanh làm mọi số đo khác
   mất giá đúng lúc ta cần tin chúng. Đây là lý do đợt 3 đứng sau đợt 1.

Bộ phép kiểm chạy vượt trần từ 06/09, **chưa ai xử** — nhà của nó là `Y-06` ([IDEAS](../IDEAS.md)).

## Thứ tự việc — bản 10/09, xếp theo THỨ ĐANG THU THUẾ MỖI PHIÊN

> Xếp theo **thuế mỗi phiên phải trả**, không theo số mã việc. Nội dung từng mục ở
> [BACKLOG.md](../BACKLOG.md) và [IDEAS.md](../IDEAS.md) — ở đây **chỉ có thứ tự và vì sao**.

### Bốn mục đắt nhất là MỘT bệnh — phát hiện 10/09

`KHUNG-59` · `KHUNG-50` · `KHUNG-55` · `KHUNG-51` trông như bốn việc rời. Chúng là **một**: nhiều
lane dùng **chung một cây làm việc git**, nên chung luôn đĩa, chung index, chung HEAD.

| Mã | Cái giá ĐO ĐƯỢC |
|---|---|
| `KHUNG-59` | chung **index**: `git add` của lane A bị `git commit` của lane B cuốn theo — **2 lần/ngày**, hai chiều |
| `KHUNG-50` | chung **đĩa + HEAD**: dấu xác nhận không ghi được → 3 lượt đủ bộ **29 phút**, 0 dấu |
| `KHUNG-55` | chung **đĩa**: lane khác sửa dở một file `docs/` là cổng bạn ĐỎ, và lời nhắn **nói sai tên người** |
| `KHUNG-51` | chung **đĩa**: suite đột biến ghi đè file thật đúng lúc lane khác `git add` |

**Đừng vá bốn lần.** Hỏi trước: *một `git worktree` riêng cho suite + bộ sinh đóng được mấy mục
trong bốn?* Đo rồi mới quyết — vá từng mục là cách một bệnh sinh ra bốn bản vá không chữa gốc.

### Đợt 1 · TRẢ THUẾ — làm trước, hiệu quả đo được ngay

| Mã | Vì sao đứng đây |
|---|---|
| `KHUNG-59` | **Đắt và nguy nhất** — nó **quy sai người**, có thể công bố việc dở của lane khác. Ứng viên rẻ: mọi chỗ commit đổi sang `git commit --only <đường dẫn>` |
| `KHUNG-50` | Nửa còn lại của bài toán tốc độ. 1.8.2 đã bỏ `claims.json` khỏi băm; còn lại là **HEAD đổi giữa lượt** — hợp lệ, nên chữa bằng worktree riêng, không phải nới băm |
| `KHUNG-57` | `can-nang` **603 giây**, đắt hơn cả `npm test` |
| `KHUNG-55` | Thước kho chữ đọc **ĐĨA** thay vì HEAD |

### Đợt 2 · CHỜ MỘT VÒNG AUDIT SẠCH — việc RẺ nhất, dọn được nhiều nhất

`KHUNG-53` · `KHUNG-15` · `KHUNG-56` · `KHUNG-58` **đã có bản vá trong HEAD** và đã qua audit, nhưng
chưa mục nào đóng — người sửa không tự ký nghiệm thu (mục 5). Còn lại: **một vòng audit không tìm
thêm lỗi**, rồi gạch mã. Đọc `CHANGELOG.md` bản 1.8.1→1.8.7 trước — bốn vòng audit 10/09 để lại lý
lẽ mà đọc code không thấy.

### Đợt 3 · CHỐNG TỰ DỐI — phép kiểm không phân biệt được hai nhánh là đồ trang trí

`KHUNG-9` → `KHUNG-47` → `KHUNG-44` → `KHUNG-4`. Độc lập nhau, song song được nếu khác khoá.

### Đợt 4 · ĐƯỜNG PHÁT HÀNH — `KHUNG-7` → `KHUNG-39`

(`KHUNG-51` đã dời lên đợt 1 vì nó thuộc họ cây-làm-việc-chung.)

### Đợt 5 · `Y-12` ONE LOADING LAW

Bản đề xuất **619 dòng đã qua hai lượt review** ở repo `Chrome_Extension_AI_Agentic`.
**ĐỌC TRƯỚC KHI THIẾT KẾ LẠI.**

### KHÔNG ĐỘNG VÀO — đang chờ Đức chốt: `KHUNG-40` · `KHUNG-37` · `Y-03` · `Y-04` · `Y-07` · `Y-08`

### BỐN LUẬT LÀM VIỆC rút ra 10/09 — áp cho MỌI mục ở trên

1. **Vá ba lần cùng một chỗ = đang vá SAI TẦNG.** Gốc là *ai được quyền định nghĩa*, không phải
   regex nào còn thiếu.
2. **Đề bài cho audit phải có THÂN HÀM, không chỉ `git diff`** — sandbox Codex không đọc được repo.
3. **Đặt một câu bắt người audit soi chính QUYẾT ĐỊNH của mình**, không chỉ soi code.
4. **Phép ghim chỉ gồm phủ định thì chưa ghim gì.** Vế thành công đòi **mã thoát 0 + một chuỗi
   dương**; vế từ chối đòi **đúng thông báo của cửa đó**.

**GOM BẢN PHÁT** còn nguyên hiệu lực: mỗi lượt cắt bản là một lần mọi repo đích phải nâng.

## Ba thứ roadmap này CỐ Ý không chứa

**Không gán HẠN** (repo chạy theo phiên, không theo lịch — ngày ở đây là *đã đo lúc nào*) ·
**không có bản vá kỹ thuật cho từng mục** (việc của brief giao executor, `ORCHESTRATOR` mục 4b) ·
**không nhắc lại nội dung từng mục nợ** (ở [BACKLOG.md](../BACKLOG.md); ở đây chỉ thứ tự).
