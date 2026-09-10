---
kind: brief
status: active
ttl_days: 180
---

# PHẦN VIỆC — nâng bộ khung cho một repo đã lắp

> **Nửa dưới của một đề bài.** Nửa trên là [GIAO-VIEC-CHUNG.md](GIAO-VIEC-CHUNG.md) — luật chung
> cho mọi phiên nhận việc. Ghép hai nửa bằng:
> `node scripts/giao-viec.mjs --viec nang --repo "<REPO ĐÍCH>" --as <tên-phiên>`
>
> **Vì sao có file này:** Đức chốt 2026-09-06 — *"Claude Code không thể làm hết một mình, sẽ hết
> usage"*. Nâng bộ khung là việc **lặp lại, có checklist, đo được bằng máy** — đúng loại việc
> giao cho AI khác. Đọc file này mà vẫn không làm nổi thì **đó là lỗi của file này**: ghi chỗ vấp
> vào `BACKLOG.md` của repo bộ khung.

## Bốn luật của một lượt nâng — chỗ mất mát thật sự xảy ra

1. **`--plan` trước, LUÔN LUÔN.** `--apply` tự từ chối khi có `SỬA TAY`. Gặp từ chối thì đọc
   `git diff` ở repo đích rồi quyết **từng file**. `--force` nghĩa là *"tôi biết repo bị sửa
   tay, cứ đè"* — nó là cách mất việc của người ta, không phải cách đi nhanh. Đo được rằng
   không ai sửa tay: `git log --oneline -- scripts/` ở repo đích chỉ có đúng commit lắp đặt.
2. **Nâng là lượt RIÊNG.** Không trộn với migrate, không trộn với việc tính năng — một lượt
   cổng chỉ quy thuộc được một loại thay đổi.
3. **Cổng XANH TRƯỚC rồi mới nâng.** Xanh-trước là thứ làm cho đỏ-sau quy được về bản nâng;
   thiếu nó thì mọi cái đỏ đều mồ côi.
4. **Một repo một lượt, repo đầu là chim báo mỏ.** Đo 10/09: năm repo đã lắp lệch **giống hệt
   nhau**, nên chỗ vấp ở repo đầu lặp y nguyên ở bốn repo sau — trả tiền học một lần.

Không biết repo nào đang cần nâng thì **đừng cố nhớ, đi đo**: `npm run doi-hinh` ở repo bộ khung
in ra repo nào ghim bản nào, lệch mấy file, và bỏ lỡ bản nào đáng.

## Việc này chạm những vùng nào

Chạm `scripts/` + `tests/` + `docs/` + gốc repo — thường ba tới bốn khoá (`_code` · `_docs` ·
`_root`), nhận bằng `claim.mjs --take`. Tên khoá repo đích có thể khác: khối **ĐO ĐƯỢC** ở đầu
đề bài đã in bảng quyền thật.

## 1. Xem trước, rồi mới ghi

Lệnh nâng cấp **chạy ở repo bộ khung**, trỏ vào repo đích. Đừng chạy ngược lại.

```bash
cd "<REPO BỘ KHUNG>"
node scripts/upgrade.mjs --plan "<REPO ĐÍCH>"
```

Đọc kỹ bảng. Sáu trạng thái tầng **máy**, và **hai trạng thái làm bạn phải DỪNG**:

| Trạng thái | Nghĩa | Làm gì |
|---|---|---|
| `ĐÃ MỚI` | khớp bản khung | không làm gì |
| `CŨ` | bản cũ hợp lệ | `--apply` vá |
| `THIẾU` | repo đích chưa có | `--apply` mang sang |
| `ĐÃ BỎ` | bộ khung không phát nữa | **chỉ kể tên** — người quyết xoá hay giữ |
| **`SỬA TAY`** | **có người sửa file của bộ khung** | **DỪNG.** Đọc `git diff` ở repo đích, hỏi người chốt |
| **`CHƯA GHIM`** | file đã khác mà repo chưa có sổ ghim | **DỪNG.** Không đủ căn cứ nói đó là bản cũ hay bản vá tại chỗ |

Khối **TÀI LIỆU** in ra sau, ba trạng thái, luật **khác hẳn** tầng máy:

| | Làm gì |
|---|---|
| `THIẾU` | `--apply` mang sang |
| `KHÁC` | **KHÔNG BAO GIỜ ghi đè** — chỉ kể tên, người tự trộn |
| `ĐÃ MỚI` | không làm gì |

**Vì sao khác:** tài liệu là chữ repo đích **được phép sửa** cho nghề của mình. Ghi đè là xoá
việc của người ta.

Không có `SỬA TAY` và `CHƯA GHIM` thì ghi:

```bash
node scripts/upgrade.mjs --apply "<REPO ĐÍCH>"
```

## 2. Khai lệnh mới vào `package.json` của repo đích

Bản nâng có thể mang script mới mà repo đích chưa khai lệnh:

Đối chiếu `ls scripts/*.mjs` với `scripts` trong `package.json` của repo đích; script có mà lệnh
chưa khai thì thêm. Hay thiếu nhất: `can-nang` và `don`.

## 3. Khai file mới vào Bản đồ file — **cổng sẽ bắt nếu quên**

Bản đồ file nằm ở file mà `.repo-structure.json` khai trong `docs.file_map` (mặc định
`AGENTS.md`). **Mỗi file mới phải có một dòng.** Không khai = không tồn tại.

Một dòng gồm: *khi nào cần mở nó* → *liên kết bấm được* → *một câu nói nó giải quyết chuyện gì*.

## 4. Rồi làm tiếp theo PHẦN CHUNG

Mục F (chạy máy) → G (ghi Log, cổng) → H (hai lượt đẩy, trả quyền) → J (báo cáo năm dòng).

Dòng `VIỆC` của báo cáo ghi: `nâng · <bản cũ> → <bản mới>`.
