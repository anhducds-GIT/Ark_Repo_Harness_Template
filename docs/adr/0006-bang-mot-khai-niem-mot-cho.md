---
status: Accepted
adr: 0006
chu_de: bang
dau_moi: true
date: 2026-09-07
deciders: Đức (chốt 07/09 sau audit UX — "dashboard đang fragment và có dữ liệu tự mâu thuẫn")
---

# ADR-0006 — Bảng trạng thái: một khái niệm một chỗ, và nhật ký KHÔNG bao giờ thành việc

## Bối cảnh — số đo, không phải cảm giác

Audit UX 07/09 nói bảng **fragment** và **tự mâu thuẫn**. Đo lại trên bản đã commit
(`git show HEAD:DASHBOARD-Ark-Repo-Harness.html`), đếm số lần mỗi khái niệm được vẽ ra:

| Khái niệm | Số lần vẽ | Vẽ ở đâu |
|---|---|---|
| **Bản đồ file** | **3** | tab Cấu trúc, ba dạng của cùng một nguồn |
| Cần Đức | 2 | tab Tổng quan · tab AI điều phối (khối ĐẦY ĐỦ, không phải tóm tắt) |
| Sức khoẻ | 2 | tab Tổng quan · tab Sức khoẻ & nợ |
| Ý tưởng | 2 | tab Tổng quan · tab Ý tưởng |
| Giao việc — ba lệnh | 2 | tab AI điều phối · tab Mô hình (hai bản chép, cùng nội dung) |
| Làm mới bảng | 2 | tab AI điều phối · tab Vận hành |

Trang: **10 tab**, 1.936 dòng, 415.673 byte.

### Mâu thuẫn "4 vs 13" — tìm ra nguyên nhân, không đoán

Bảng nói **hai con số khác nhau** cho cùng một câu hỏi *"Đức cần làm gì"*:

```
Tổng quan  →  "CÓ — bốn mục đang mang dấu chờ …"
AI điều phối →  "Cần Đức — 13 việc · 9 bấm · 4 chốt"
```

Đo từng nguồn:

| Nguồn | Số dấu | Thật hay ảo |
|---|---|---|
| `BACKLOG.md` | 5 | **thật** — mục nợ đang mở |
| `IDEAS.md` | 0 | — |
| `STATUS.md` | 0 | — |
| **`HANDOFF.md`** | **8** | **ẢO — nhật ký lịch sử** |
| | **13** | |

Con **4** thì đến từ chỗ khác hẳn: một câu **gõ tay** trong `STATUS.md` → `human_action:`.
Câu đó nêu `KHUNG-11` · `KHUNG-6` · `KHUNG-30` · `KHUNG-14`, mà hai trong bốn đã đóng.

**Hai lỗi, hai gốc khác nhau:**

**⑴ `HANDOFF.md` bị quét tìm dấu việc.** `HANDOFF.md` là **nhật ký, chỉ thêm dòng**. Mọi lần
một phiên *kể lại* rằng có việc chờ Đức thì lần kể đó thành một việc mới, **vĩnh viễn**. Con số
chỉ có một chiều là tăng, và nó tăng theo **số phiên**, không theo số việc thật.

Ba trong tám dấu ảo còn tệ hơn: một dấu nằm trong câu **giải thích chính quy ước dấu**
(*"Dấu `@Đức:bấm` / `@Đức:chốt` đặt ngay trên dòng của mục…"*). Bảng biến **sách hướng dẫn của
chính nó** thành một việc phải làm.

**⑵ `STATUS.md` giữ một bản đếm gõ tay.** Đó là nguồn sự thật thứ hai cho một con số máy đếm
được. Nguồn thứ hai thì lệch — và nó đã lệch: câu đó còn ghi *"Bản 1.3.14 · bảng nay có chín
tab"* trong khi repo đang ở **1.3.36 với 10 tab**. Câu ấy chảy tiếp vào `DASHBOARD.md` và
`repo-map.json`, nên **một câu cũ gõ tay làm ba artifact máy sinh nói sai cùng lúc.**

`docs/HUONG-DAN.md` cũng còn ghi *"Trang có tám tab"*.

## Quyết định

### IA — BEFORE

```
10 tab, ngang hàng nhau:
  Tổng quan  ← trộn 6 khối: now/next · Cần Đức · Ý tưởng · Bắt đầu · Vòng đời · Sức khoẻ
  AI điều phối  ← Đang làm gì · Cần Đức (LẶP) · Khoá · Giao việc
  Ý tưởng       ← Ý tưởng (LẶP bản đầy)
  Mô hình       ← Mô hình · Giao việc (LẶP) · Tính năng
  Vận hành      ← Làm mới (LẶP) · cơ chế · bất biến · 3 tài liệu · 3 workflow · protocol
  Sức khoẻ & nợ ← Sức khoẻ (LẶP) · sổ nợ
  Cấu trúc      ← vùng · file gốc · bản đồ file ×3 (LẶP) · bốn tầng · lệnh
  Migrate       ← sổ migrate
  Nhật ký       ← ADR · changelog · việc đã xong
  Tra cứu       ← từ điển
```

### IA — AFTER

```
4 nhóm, có thứ bậc:

TỔNG QUAN  — ĐÚNG BA CÂU, không gì khác
   ① Đang làm gì      ② Cần Đức làm gì      ③ Blocker / rủi ro
   Mỗi câu là một dòng + một liên kết sang chỗ canonical. Không bảng, không đếm phụ.

CÔNG VIỆC  — mọi thứ có thể HÀNH ĐỘNG
   canonical: Cần Đức · khoá vùng · sổ nợ · sổ ý tưởng · migrate

HỆ THỐNG   — repo này CHẠY thế nào
   canonical: làm mới bảng · cơ chế đa phiên · bất biến · cấu trúc · bản đồ file · lệnh · tra cứu

LỊCH SỬ    — thứ KHÔNG hành động được nữa
   canonical: ADR · changelog · việc đã xong · sổ bàn giao
   Vùng này KHÔNG BAO GIỜ được sinh ra việc. Xem luật dưới.
```

**Luật một-chỗ:** mỗi khái niệm có **đúng một** chỗ vẽ đầy đủ (canonical). Chỗ khác chỉ được
in **một câu tóm tắt + một liên kết**. Ba câu ở Tổng quan là *duy nhất* ngoại lệ, và chúng là
tóm tắt chứ không phải bản sao.

**Luật lịch sử-không-thành-việc:** nguồn quét dấu chờ người chốt bỏ `HANDOFF.md`. Chỉ quét sổ
còn sống: `BACKLOG.md` · `IDEAS.md` · `STATUS.md`. Khai thành hằng số có phép ghim, không phải
một mảng gõ trong hàm.

**Bỏ bản đếm gõ tay:** `STATUS.md` → `human_action` thôi giữ danh sách. Máy đếm được thì máy đếm.

## Cái MẤT — ghi rõ, không giấu

**⑴ Bấm nhiều hơn.** Trước: mở tab Tổng quan là thấy sáu khối. Sau: thấy ba câu, muốn chi tiết
thì bấm. Đổi *đọc-một-lần* lấy *tin-được*. Đáng, vì một bảng nói hai con số thì cả hai đều vô giá trị.

**⑵ Dấu chờ trong nhật ký thành vô hình.** Ai viết `@Đức:bấm` trong `HANDOFF.md` từ nay sẽ
không thấy nó ở đâu. Đó là **cố ý** — nhật ký là chỗ *kể lại*, không phải chỗ *giao việc* — nhưng
nó là một cái bẫy im lặng cho người không đọc ADR này. Đã ghi vào chính `HANDOFF.md` và vào
`docs/LEGEND.md`.

**⑶ Bốn nhóm vẫn là một lựa chọn chưa được đo.** Con số bốn do Đức chốt, không do đo tần suất
dùng — repo chưa có số liệu ai mở tab nào. Nếu sau vài tuần thấy một nhóm không ai mở, gộp tiếp.

**⑷ Luật một-chỗ hiện chỉ có MỘT phép kiểm mỏng.** Nó đếm số lần một tiêu đề khối xuất hiện.
Đổi tên tiêu đề là lách được. Chưa có cách nào máy chặn việc ai đó vẽ lại cùng nội dung dưới một
cái tên khác.

## Kèm theo — một bug lộ ra lúc đo, cùng họ

`behaviourOptsFrom` đếm *"code đã đổi sau kiểm chứng"*, và nó thấy trang HTML máy sinh là một
file `.html` bình thường. Ở repo `nav_platform_main`: mỗi lượt sinh lại trang là bộ đếm **+1**,
nên cổng *"Sự thật máy sinh còn tươi"* **ĐỎ vĩnh viễn** — sinh lại không thoát được, vì chính
việc sinh lại làm nó tăng.

Đây **đúng con bệnh đã ghi ngay trên `MAY_SINH`** cho `repo-map.json`, lặp lại lần thứ hai với
một file mới. Lần trước vá bằng cách **thêm một tên** vào danh sách; lần này vá bằng cách **bỏ
danh sách**: tên trang suy từ cấu hình (`tenTrangFrom` ở `repo-structure.mjs`), nên không repo
nào phải nhớ khai gì. Phép suy trước đây nằm trong `build-overview.mjs` và chỉ bộ sinh trang biết
nó — hai chỗ cần cùng một cái tên mà chỉ một chỗ có phép suy.
