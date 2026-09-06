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

## Việc này chạm những vùng nào

Nâng bộ khung chạm `scripts/` + `tests/` + `docs/` + gốc repo — thường là ba tới bốn khoá:

```bash
node scripts/claim.mjs --take _code --as <tên-phiên> --task "nang bo khung"
node scripts/claim.mjs --take _docs --as <tên-phiên> --task "so tay moi"
node scripts/claim.mjs --take _root --as <tên-phiên> --task "ban do file + nhat ky"
```

Tên khoá của repo đích có thể khác — khối **ĐO ĐƯỢC** ở đầu đề bài đã in bảng quyền thật.

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

**Đừng dùng `--force` nếu bạn không tự đo được rằng file khác chỉ vì nó là bản cũ.** Cách đo: ở
repo đích chạy `git log --oneline -- scripts/` — chỉ có đúng commit lắp đặt thì không ai sửa
tay, `--force` an toàn. Có commit khác thì **hỏi người chốt**.

## 2. Khai lệnh mới vào `package.json` của repo đích

Bản nâng có thể mang script mới mà repo đích chưa khai lệnh:

```bash
cd "<REPO ĐÍCH>"
ls scripts/*.mjs
node -e "console.log(Object.keys(require('./package.json').scripts))"
```

Script có mà lệnh chưa khai thì thêm vào. Hai lệnh hay thiếu nhất:
`"can-nang": "node scripts/can-nang.mjs"` và `"don": "node scripts/don.mjs"`.

## 3. Khai file mới vào Bản đồ file — **cổng sẽ bắt nếu quên**

Bản đồ file nằm ở file mà `.repo-structure.json` khai trong `docs.file_map` (mặc định
`AGENTS.md`). **Mỗi file mới phải có một dòng.** Không khai = không tồn tại.

Một dòng gồm: *khi nào cần mở nó* → *liên kết bấm được* → *một câu nói nó giải quyết chuyện gì*.

## 4. Rồi làm tiếp theo PHẦN CHUNG

Mục F (chạy máy) → G (ghi Log, cổng) → H (hai lượt đẩy, trả quyền) → J (báo cáo năm dòng).

Dòng `VIỆC` của báo cáo ghi: `nâng · <bản cũ> → <bản mới>`.
