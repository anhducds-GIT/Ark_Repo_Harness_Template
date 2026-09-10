---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — đường ĐÓNG GÓI, bản 10/09

> **Mục tiêu đổi ngày 10/09: ĐÓNG GÓI, không phải hoàn thiện.** Đức: *"một tuần rồi không đóng
> gói xong… ta cần hệ thống lean, đủ dùng, không over engineer, không kiểm quá nhiều."*
>
> Đây là lớp ĐIỀU PHỐI: thứ tự · chỗ cần người chốt. Nội dung từng mục ở [BACKLOG](../BACKLOG.md)
> · [IDEAS](../IDEAS.md); bản đồ sống `npm run what-next`. Bản trước: [V1](archive/ROADMAP-V1.md).

## R0 · VẠCH ĐÍCH — Đức chốt 10/09, và nó CHẶN mọi đợt dưới

**Vế A — LÀM ĐƯỢC.** Một repo mới, sau migrate, làm được **bốn việc**: nhận khoá · commit không
cuốn việc lane khác · cổng xanh · đẩy an toàn. Cả bốn **đã chạy thật**. Khác đi là tuỳ chọn.

**Vế B — CÂN NẶNG.** Chưa đủ bảng này thì chưa xong; **đủ rồi thì DỪNG**, không gọn thêm.

| Đo | Hôm nay 10/09 | Vạch |
|---|---|---|
| `scripts/` · phần lõi | 16.533 dòng · lõi 3.557 = **22%** | **≤ 6.000** dòng · lõi **≥ 60%** |
| Suite · cổng | **24** suite · **14,2 phút** · **12** mục cổng | **≤ 12** suite · **≤ 3 phút** · **≤ 8** mục |
| `AGENTS.md` · `docs/` | 9 mục · 23 file (3.115 dòng) | **≤ 6 mục** · **≤ 30 file** |
| Trần token nạp | 4.195 / **4.200** | hạ trần xuống **3.000** |
| Luật không có máy canh | **7/9 mục** được MIỄN khỏi phép dò | **0** — không ca thật + không máy canh thì BỎ |
| Hook | **1** (`commit-msg`) | **2** (thêm `post-commit` trả khoá), mỗi cái một test ghim |
| Bộ sinh BẢNG | **3** bộ · 5.733 dòng = **35%** `scripts/` · **37% commit** chỉ để sinh lại bảng | **1** bộ · **0 commit** — host tự chạy, F5 là tươi |
| Một vòng sửa → đẩy | suite **14,2 phút**, và MỖI commit làm hỏng dấu nên phải chạy lại | **≤ 5 phút** |
| Migrate một repo | **chưa đo** | bấm giờ ở `R11`, số đo đó thành vạch |

**Gốc không phải "AI thêm nhiều tính năng" — gốc là repo KHÔNG CÓ VẠCH ĐÍCH**, nên mọi thứ đều là
"còn thiếu". Bảng trên là cái phanh: mỗi ô một CON SỐ, không phải một tính từ.

## Đợt 1 · BỎ BỚT — không viết thêm dòng mã nào

| Mã | Việc | Cái được, đo được |
|---|---|---|
| `R1` | **Thôi commit bảng** — Đức đã chốt 06/09 *"bảng tự tươi, F5 là thấy"*, chưa ai làm | bỏ **37% commit**; mỗi commit đó còn kéo theo một lượt suite ~14 phút |
| `R2` | **Cắt bản theo NGÀY**, mục tiêu ≤ 7/tuần, chỉ cắt khi thật có repo nhận | 78 → 7 |
| `R3` | **ĐÓNG BĂNG** tính năng và phép kiểm tới khi xong Đợt 5 | việc ngoài phạm vi → ghi sổ, không tự làm |

`R1` gỡ luôn cái vòng `KHUNG-63` sinh ra. `R3` áp cho **cả AI lẫn người**.

## Đợt 2 · DỤNG CỤ ĐỂ ĐỨC TỰ RÀ — chuyển việc phân loại về đúng người

| Mã | Việc | Vì sao |
|---|---|---|
| `R4` | **Bảng LUẬT**: số `L<mục>.<n>` **suy từ `AGENTS.md`**, kèm hai cột *máy nào canh* · *ca thật nào sinh ra* | Đức rà và gọi tên luật; số **không được gõ tay** — repo đã bị "bốn bản chép trôi lệch trong một ngày" |
| `R5` | **Bảng SỔ NỢ**: mỗi mục một ô **giữ · gộp · bỏ** | AI mở `BACKLOG.md` tốn **20.300 token**; `what-next` chỉ **1.000**. Đức rà offline thì AI tốn **0** |

Đo sẵn cho `R4`: **7/9 mục luật** đang MIỄN khỏi phép dò; **§3 "Năm luật vàng" không luật nào có
máy canh** — trong khi nó là mục được trích dẫn nhiều nhất.

## Đợt 3 · CẮT MỠ theo đúng thứ Đức vừa rà

Một phép đo cho cả ba: **thứ chưa từng đổi hành vi của ai thì không đáng giữ.**

`R6` bỏ luật không có ca thật (bằng chứng ở [VI-SAO-LUAT](VI-SAO-LUAT.md)) · `R7` bỏ phép kiểm
chưa từng bắt lỗi thật (24 suite; `can-nang` TREO >15 phút — BỎ, đừng sửa) · `R8` gộp 3 bộ sinh còn 1.

**`R6` chạm luật chung** → phải đi qua `COMMON_LAW_SHA256` **và** một vòng audit độc lập. Nén tay
đã làm rụng mệnh lệnh phụ **sáu lần**, lần gần nhất là 10/09.

## Đợt 4 · SIẾT HAI CHỖ CÒN HỞ THẬT

`R9` **`post-commit` tự trả khoá file** — đã đo: hook thấy đúng nhãn và đúng mẻ, mã thoát của nó
không ảnh hưởng `git commit`. Trả khoá thôi là kỷ luật, thành hệ quả của việc commit.
`R10` **`--as` là lời tự khai** — dựng lại được 10/09: ai cũng trả được khoá của người khác chỉ
bằng cách gõ tên họ, dấu niêm phong vẫn nguyên. Ba câu luật mục 1 hiện là chữ. **Thiết kế thật,
đừng vá vội.**

## Đợt 5 · ĐÓNG GÓI

`R11` — **5 repo đích cùng một bản, cùng xanh**: `ALL_SKILL_MANAGEMENT` · `Project 3 AI Agent
Unify` (đang 1.3.7x) · `Chrome_Extension_AI_Agentic` · `n8n-orchestrator` · `n8n_Local host`
(1.8.0). Xong `R11` là xong.

## Còn treo, đừng quên

`KHUNG-63` **đã vá (1.8.12), CHƯA chạy suite, CHƯA đẩy** — việc đầu tiên sau compact.
`KHUNG-59` chờ một vòng audit sạch rồi gạch mã · `KHUNG-60` (repo kia có `commit-msg` riêng, cùng
đường dẫn — cần Đức quyết) · `KHUNG-50/55/51` là MỘT bệnh (nhiều lane chung một cây git), `R1`
bớt được phần lớn cái giá của chúng.

**KHÔNG ĐỘNG VÀO — chờ Đức chốt:** `KHUNG-40` · `KHUNG-37` · `Y-03` · `Y-04` · `Y-07` · `Y-08`.

## Ba luật làm việc, rút từ 10/09 — áp cho MỌI mục trên

1. **Vá ba lần cùng một chỗ = đang vá SAI TẦNG.** Gốc là *ai được quyền định nghĩa*.
2. **Đừng dựng nguồn sự thật thứ hai.** Ba trong bốn fail-open ngày 10/09 là *tự viết bản thứ hai
   của một thứ đã có*: bộ đọc nhãn · cách đọc tên file · cách hỏi "cửa có đó không".
3. **Phép ghim chỉ gồm phủ định thì chưa ghim gì.** Vế thành công đòi mã thoát 0 **cộng** một
   chuỗi dương; vế từ chối đòi đúng thông báo của cửa đó.
