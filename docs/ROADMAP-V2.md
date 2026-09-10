---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP V2 — đường ĐÓNG GÓI, bản 10/09

> **Mục tiêu: ĐÓNG GÓI XONG HÔM NAY** một bộ lõi *đủ dùng, vừa phải*. Đức: *"một tuần rồi không
> đóng gói xong… lean, không over engineer, không kiểm quá nhiều."*
>
> Lớp ĐIỀU PHỐI: thứ tự · chỗ cần người chốt. Nội dung ở [BACKLOG](../BACKLOG.md) ·
> [IDEAS](../IDEAS.md); bản đồ sống `npm run what-next`. Bản trước: [V1](archive/ROADMAP-V1.md).

## R0 · VẠCH ĐÍCH — Đức chốt 10/09, và nó CHẶN mọi đợt dưới

**Vế A — LÀM ĐƯỢC.** Một repo mới, sau migrate, làm được **bốn việc**: nhận khoá · commit không
cuốn việc lane khác · cổng xanh · đẩy an toàn. Khác đi là tuỳ chọn.

**Vế B — CÂN NẶNG.** Chưa đủ bảng này thì chưa xong; **đủ rồi thì DỪNG**, không gọn thêm.

| Đo | Đầu ngày 10/09 | Nay | Vạch |
|---|---|---|---|
| `scripts/` · phần lõi | 16.533 dòng · lõi **22%** | — | **≤ 6.000** · lõi **≥ 60%** |
| Suite · thời gian · cổng | 24 · **14,2 phút** · 12 mục | **7,5 phút** (cổng 3,0s) | ≤ 12 · **≤ 3 phút** · ≤ 8 mục |
| `AGENTS.md` · `docs/` | 9 mục · 23 file | **6 mục** ✔ · 23 file | **≤ 6 mục** · ≤ 30 file |
| Trần token nạp | 4.195 / 4.200 | **4.099** — gọn 2%, vì thêm ~200 token nói chỗ máy KHÔNG canh | hạ trần **3.000** · chưa đạt |
| Luật không có máy canh | **7/9** — đếm từ `mien`, *sai câu hỏi* | **6/6** còn phần hở · **1** mục cố ý không máy (mục 2) | phần hở **đo được** = 0 |
| Hook | **1** (`commit-msg`) | **2** · bật thật ở **5/5** repo đích | **2** (+ `post-commit`), mỗi cái 1 test ghim |
| Bộ sinh BẢNG | 3 bộ · **37% commit** | **0 commit** | **1** bộ · 0 commit |
| Một vòng sửa → đẩy | **14,2 phút** | **7,4 phút** | **≤ 5 phút** |
| Migrate một repo | chưa đo | **7s** lệnh + **~3 phút** ba bước tay · 5/5 tại `1.9.29` | đo rồi — **đạt** |

**Đã xong 10/09:** `R1` bảng thôi bị cổng đòi khớp HEAD — bỏ **37% commit**, qua **6 vòng audit
độc lập, 20 lỗi** · `R2` một bản cho một ĐỢT VIỆC đã đóng · `R3` **ĐÓNG BĂNG**: cấm THÊM tính
năng · phép kiểm · luật · tài liệu; được **BỎ** và **GỘP**. Lý do ở [decisions](../decisions.md).

## HÔM NAY — ba việc đã XONG cả ba. Việc kế: `R6` (Đức chốt thứ tự 10/09)

| # | Việc | Vì sao đúng thứ tự đó | Xong khi |
|---|---|---|---|
| `T1` | **Cắt suite còn ≤ 3 phút** (`R7`) | mọi việc dưới trả thuế này TỪNG LƯỢT — riêng `R1` hôm nay tiêu 6 lượt suite ≈ **75 phút chờ** | `npm test` ≤ **180s**, 24/24 xanh, **không bỏ vế kiểm nào** |
| `T2` | **Hook: trả khoá + ĐO hiệu quả** (`R9`) | Đức đòi hai lần *"khoá nhả ngay khi hết sửa, hook tốt vào"*; và `commit-msg` **chưa ai đo nó chặn thật ở repo đích** | `post-commit` tự trả khoá file · **một ca thật ở repo đích** chứng minh cửa index chặn · 2 test ghim |
| ~~`T3`~~ | ~~**Đóng gói** (`R11`)~~ | **ĐÓNG** | 5/5 tại `1.9.29`, hook sống 5/5, cổng **2/5 XANH**. Ba repo còn lại chặn bởi **nợ sấn của chính chúng** (lịch sử không nhãn · file lane khác đang sửa · 7 mục ở `Chrome_Extension`), không phải lượt nâng. **Lôi ra 9 lỗi lõi** — xem `CHANGELOG` 1.9.20→1.9.29 |

**`T1` có số đo sẵn, không phải đi tìm.** Bốn suite nặng dựng lại CÙNG MỘT fixture:
`cong-do-that` 462s · `init-repo-smoke` 251s · `harness-smoke` 237s · `upgrade-smoke` 216s (riêng
nó **26 tiến trình con**). Dựng một lần rồi dùng chung — **cắt thời gian, giữ răng**. Nhát đầu đã
làm: `template-null-repo` 505s → 179s bằng cách bỏ một lượt **suite lồng** không vế nào đọc.

## `R6` ĐÓNG cả hai nhát — Đức uỷ quyền AI chốt (10/09)

**Nhát ĐO:** `luat_nha.canh` + vế `5e` — **9 máy khai · 6/6 mục còn phần KHÔNG máy nào canh**. Số
`7/9` cũ lấy từ `mien`, thứ đo *luật có tới repo đích hay không*. Lôi ra **2 lỗ máy thật**
(`KHUNG-56`: `--carry` gõ tay và lượt đẩy phần của mình đều KHÔNG đọc dấu cổng — nên điều CẤM ở
`AGENTS.md` mục 2 hiện chỉ có phiên tự cưỡng chế).

**Nhát CẮT:** bản rà **111 mục** của Đức+GPT → giữ **43** ở Tầng 1, `AGENTS.md` **9 mục → 6**.
Quyết định từng mục và cái MẤT: [ADR-0018](adr/0018-ra-lai-111-muc-luat.md); sáu chỗ lượt thi
hành dạy lại: [ADR-0019](adr/0019-sua-bay-cho-cua-adr-0018.md). **CHƯA ĐẨY** — `codex exec` hỏng
sandbox trên máy này, nên commit mang `Audit: chua-co` và `safe-push` từ chối, đúng thiết kế.

## HOÃN CÓ TÊN — không làm hôm nay, và đây là lý do

`R4` bảng LUẬT đánh số · `R5` bảng SỔ NỢ giữ·gộp·bỏ → **dụng cụ để Đức rà**, không phải điều kiện
đóng gói. `R8` gộp
ba bộ sinh còn một → `R1` đã cắt phần lớn cái giá của chúng. `R10` `--as` là lời tự khai → là
**thiết kế danh tính thật, đừng vá vội**.

**KHÔNG ĐỘNG — chờ Đức chốt:** `KHUNG-40` · `KHUNG-37` · `Y-03` · `Y-04` · `Y-07` · `Y-08`.

## Nợ mới sinh trong ngày

`KHUNG-64` **[FAIL-OPEN]** miễn suite cho file không bộ sinh nào kiểm — kiểm toán **bác** cách tôi
xếp loại nhẹ · `KHUNG-65` mục `###` lách trần byte, **và chặn oan lane khác**.

## Bốn luật làm việc, rút từ 10/09 — áp cho MỌI mục trên

1. **Một phép ghim chỉ đúng nhờ nền đang hỏng thì nó đang ghim SỐ 0.** Bốn cái thuộc loại đó trong
   một ngày; cái thứ ba chỉ lộ ra vì `R1` **tình cờ** làm nền xanh lên.
2. **Đừng tin mình đã phá.** Gọi thẳng hàm hoặc `grep` xác nhận ĐÃ hỏng, rồi mới chạy phép ghim.
3. **Bỏ cơ chế, đừng vá từng lần.** `new RegExp("…")` mất một dấu gạch chéo là cả một lớp lỗi.
4. **Audit TRƯỚC, cổng SAU, đúng một lượt.** Audit đổi mã; cổng chỉ có nghĩa trên mã cuối.
