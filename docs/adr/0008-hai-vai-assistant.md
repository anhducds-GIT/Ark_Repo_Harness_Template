---
status: Accepted — ba khẳng định bên trong bị ADR-0009 sửa; quyết định gốc vẫn hiệu lực
adr: 0008
date: 2026-09-08
deciders: Đức (chốt 08/09 — "apply hệ thống assistant này ở 2 repo ta đang làm chính thức, sau đó Template repo AI sẽ đồng bộ đến các Repo khác")
---

# ADR-0008 — Vai chia theo VIỆC, không chia theo hãng

## Bối cảnh — bảng cũ phân việc cho những bên chưa từng ghi gì

Mục 5 của hiến pháp từng chia việc theo tên hãng: Claude / Codex / Antigravity, mỗi hãng một dòng
*"việc chính"* và *"không được"*. Đếm nhãn `Lane:` của **mọi commit 14 ngày**:

```bash
git log --since=2026-08-25 --format=%B | grep -oE "^Lane: \S+" | sort | uniq -c | sort -rn
```

| Repo | Tổng commit có nhãn | Antigravity | Codex | Ghi chú |
|---|---|---|---|---|
| Bộ khung | **306** | **0** | **1** (0,33%) | lane lớn nhất `harness-vong2` **112 commit** |
| Extension | ~500 | **0** | **0** | `claude-codex-*` là phiên Claude *làm việc với* Codex |

Hai điều bảng cũ không làm được:

⑴ Nó phân việc cho **Antigravity và Codex**, hai bên gộp lại viết **1 trên 306 commit**.

⑵ Nó **không xếp nổi người làm nhiều nhất vào đâu**: lane lớn nhất mang tên `harness-vong2`, một
cái tên nói về *việc*, không nói về *hãng*. Bảng chia theo hãng không có ô nào cho nó.

Nói cách khác: trục phân loại sai. Việc thật chia theo **hướng đi** — ở nhà, hay ra ngoài — chứ
không chia theo ai đang gõ.

## Quyết định

⑴ **Hai vai, và vai là của PHIÊN chứ không của hãng.** Hãng nào cũng đóng được vai nào; một phiên
đóng **đúng một vai** cho tới khi đóng phiên.

- **① Giữ lõi** — luật · bộ máy · trạng thái. Việc ở nhà. Mỗi bản vá kèm **một phép kiểm ghim**.
- **② Phát & thu** — cửa duy nhất ra ngoài: phát bản, đo repo đích, ghép đề bài, rồi **mang chỗ
  vấp về** thành mục sổ nợ của lõi, và tối ưu chính quy trình đó.

⑵ **Ranh giới chịu tải, một câu: Vai ② được *phát hiện*, Vai ① được *sửa*.** Gộp hai vai lại thì
người tìm ra lỗi cũng là người tự chấm bản sửa của mình — và một tờ nghiệm thu do bên bị kiểm ký
là **lời tự khai, không phải hàng rào**. Đây đúng là luật mà `SELF_ATTESTATION` cưỡng chế trong lõi
quyền (ADR-0019 của repo Extension ⑵d), nên nó không phải một phép ẩn dụ.

⑶ **HAI vai chứ không ba, dù bảng có ba khối.** Khối 1 (dữ liệu lõi) là việc ở nhà; hai mũi *phát
bản* → *thi hành* cộng **vòng ngược** là **cùng một việc** — đi ra rồi mang về. Chia theo khối thì
vai giữa không có gì làm; chia theo hướng đi thì đủ.

⑷ **Bàn giao chỉ có một hình dạng:** Vai ② ghi chỗ vấp vào `BACKLOG.md` kèm trường `đóng khi:`,
Vai ① biến nó thành bản vá cộng một phép ghim. Nhắn thẳng *"sửa hộ tôi"* là mất dấu vết — người
đến sau không đọc được tin nhắn, chỉ đọc được sổ.

⑸ **Luật CHUNG, phát cho mọi repo tiêu thụ.** Đức duyệt tường minh, và bộ phát hành có dấu vân tay
riêng cho phần luật chung nên lượt phát này **bị chặn cho tới khi có câu duyệt đó**.

## Điều KHÔNG được đọc rộng hơn

**Chỉ vế bàn giao là máy kiểm được** — trường `đóng khi:` trong `BACKLOG.md`. Vế *"② phát hiện ·
① sửa"* **không dựng nổi ca hỏng**, nên theo đúng câu ③ của mục 8 nó là **chữ, không phải luật**.
Câu này được ghi thẳng vào hiến pháp thay vì giấu đi, để không ai tin nó đang được cưỡng chế.

Và **cố ý không thêm** một quy ước đặt tên `--as` theo vai: không máy nào kiểm được nó, mà mục 8
nói luật máy không kiểm được thì sớm muộn cũng bị bỏ qua — thêm vào chỉ để có thêm một dòng.

## Cái MẤT

- **Mất lời dặn riêng cho từng hãng.** Dòng *"Antigravity không được sửa lớp an toàn / runner /
  bridge"* biến mất. Nếu Antigravity quay lại và ghi thật, chỗ đó phải dựng lại — nhưng lúc ấy sẽ
  có số đo để dựng cho đúng, thay vì dựng theo phỏng đoán như bảng cũ.
- **Hiến pháp không còn chỗ trống.** `template/AGENTS.md` nay **đúng 200/200 dòng**, sát trần B9.
  Luật sau muốn vào thì **phải có luật ra** — không còn khe nào để lách.

## Một chỗ tôi làm sai ba lượt liền, ghi để lượt sau khỏi lặp

Bản đầu tôi viết cả **số đo và lý lẽ vào hiến pháp**. `template/AGENTS.md` phình 200 → **218** dòng
và **B9 đỏ**. Tôi nén hai lượt (218 → 210 → 204) mà vẫn đỏ, vì tôi đang nén **văn** trong khi vấn
đề là **thứ đó không thuộc về đây**. Chỉ khi chuyển hẳn số đo và lý lẽ sang chính file ADR này thì
nó mới vừa.

**Hiến pháp chứa LUẬT; ADR chứa VÌ SAO.** B9 là thứ bắt được nhầm lẫn đó — không phải tôi tự nhận ra.
