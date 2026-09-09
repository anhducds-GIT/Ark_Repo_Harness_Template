---
status: Accepted
adr: 0016
chu_de: ghi-quyet-dinh
sua: 0015
date: 2026-09-09
deciders: Đức
---

# ADR-0016 — Hiến pháp mỏng: luật ở Tầng 1, lý lẽ ở Tầng 2, và mở phiên đọc `STATUS.md`

**Sửa [ADR-0015](0015-context-compiler.md)** ở đúng một điểm: tầng **TRẠNG THÁI** của Context
Compiler không còn là *phần cuối `HANDOFF.md`* mà là **`STATUS.md`**. Phần còn lại của ADR-0015
giữ nguyên hiệu lực.

## Vấn đề

Đức đo bằng tokenizer thật: mọi phiên AI, ở mọi repo, nạp **~9.300 token** chỉ để biết luật —
và phiên đụng gói nặng nhất là **29.200**. Yêu cầu: xuống 4.000–6.000, và *"mục tiêu không phải
đạt ngưỡng, mà phải nhỏ hơn ngưỡng margin là 30-40%, vì sau này sẽ tiếp tục phình ra"*.

Đo tại repo này trước khi động: `AGENTS.md` **13.799 token**, trong đó bảng tra mục 6 một mình
**10.029 — 73%**. Sau lượt tách bảng: còn **5.804 token** nạp mỗi phiên. Vẫn quá cao, và phần
thừa lần này **không phải bảng tra** mà là **lý lẽ**: mỗi luật mang theo sự cố sinh ra nó.

## Quyết định

**Tầng 1 chỉ giữ thứ MÁY KHÔNG KỊP NÓI CHO BẠN.** Ba loại nội dung rời khỏi đường nạp, mỗi loại
có một nhà đã khai trong bản đồ file:

| Rời đi | Về đâu | Vì sao ở đó là đúng |
|---|---|---|
| Lý lẽ · số đo · sự cố lịch sử | `docs/VI-SAO-LUAT.md` | đọc **một lần trong đời**, lúc có người muốn đổi luật |
| Ba luật cơ chế khoá (chứa nhau hai chiều · chia gốc repo · hai file được miễn) | `docs/protocols/MULTIFLOW.md` | `claim.mjs` **tự chặn và tự nêu tên khoá còn thiếu** |
| Cách lắp bộ khung vào repo mới | `README.md` | việc của người LẮP, không của phiên đang làm |

Và **mở phiên đọc `STATUS.md`**, không đọc 40 dòng cuối `HANDOFF.md`. Đuôi `HANDOFF.md` là **một
lượt việc**, không phải **trạng thái**: nó kể phiên trước vấp gì, dài bao nhiêu tuỳ người viết, và
cắt theo số dòng thì rơi vào giữa đoạn. `STATUS.md` vốn đã là một trang khai bằng tay và đã là
nguồn cho bảng trạng thái — nó đúng là thứ một phiên cần lúc mở.

## Số đo

| | Trước lượt này | Sau |
|---|---:|---:|
| `AGENTS.md` | 4.907 | 3.386 |
| Tầng TRẠNG THÁI | 897 (`HANDOFF.md`, 40 dòng cuối) | 557 (`STATUS.md`) |
| **Tổng NẠP mỗi phiên** | **5.804** | **3.943** |

So với điểm xuất phát 13.799: **giảm 71%**. Trần thật giữ ở 6.000 token; `budget.tokenNap` siết
xuống **4.200** — tức **vạch biên 30%** — để cổng ĐỎ **sớm**, trước khi chạm trần thật.

## Cái MẤT — nói thẳng, vì nó có thật

⑴ **Phiên mới không còn tự động thấy phiên trước vấp gì.** Bài học của hôm qua nay phải mở
`HANDOFF.md` mới thấy. Đổi lại: `STATUS.md` bắt buộc mang `next_step`, nên cái *cần làm* thì vẫn
tới, chỉ cái *đã vấp* là phải hỏi tới.

⑵ **Một luật giờ nằm cách chỗ cưỡng chế nó một cú nhấp.** Rủi ro: phiên lười không mở. Chốt chặn:
những luật rời đi đều là luật **máy tự cưỡng chế** — không đọc thì cổng chặn, chứ không phải
không đọc thì làm sai mà không ai biết. Luật nào máy KHÔNG chặn được thì **ở lại Tầng 1**, đó là
tiêu chí chia, không phải độ dài.

⑶ **Thêm một chỗ phải giữ đồng bộ.** `docs/VI-SAO-LUAT.md` là file thứ ba có thể trôi lệch khỏi
luật. Giảm nhẹ: nó **không được phát biểu luật** (trừ năm câu thêm-luật, vốn là nhà duy nhất của
chúng), và mọi con số chỉ được nằm **một chỗ**.

## Kiểm chứng độc lập

Audit Codex 09/09 (đọc bản diff, không đọc repo) nêu **bốn chỗ luật bị làm yếu** trong bản nén
đầu; kiểm lại thì **cả bốn đúng**, và đã trả lại nguyên văn: ⑴ mất lệnh đọc luật của vùng sắp
đụng · ⑵ năm câu thu hẹp còn "thêm một luật", mất "phép kiểm hay tài liệu" · ⑶ mất quyền *"vai
nào cũng được tìm lỗi ở bất kỳ đâu"* · ⑷ mất mệnh lệnh *"viết lại đơn giản hơn"*. Bài học: **nén
văn xuôi làm rụng mệnh lệnh phụ**, và người nén không nhìn ra vì họ vẫn nhớ câu gốc.
