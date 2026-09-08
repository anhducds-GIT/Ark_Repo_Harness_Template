---
status: Accepted
adr: 0008
date: 2026-09-08
deciders: Đức (chốt 08/09 — "apply hệ thống assistant này ở 2 repo ta đang làm chính thức, sau đó Template repo AI sẽ đồng bộ đến các Repo khác")
---

# ADR-0008 — Vai chia theo VIỆC, không chia theo hãng

## Bối cảnh — không đo được HÃNG từ repo, và đó chính là lý do

Mục 5 của hiến pháp từng chia việc theo tên hãng: Claude / Codex / Antigravity, mỗi hãng một dòng
*"việc chính"* và *"không được"*. Đếm nhãn `Lane:` trên 14 ngày, có chặn cả hai đầu:

```bash
git log --since=2026-08-25 --until=2026-09-08 --format=%B   | grep -oE "^Lane: \S+" | sort | uniq -c | sort -rn
```

| Đo được | Bộ khung |
|---|---|
| Dòng `Lane:` | **306** |
| Tên lane khác nhau | 39 |
| Lane lớn nhất | `harness-vong2` — **112 dòng** |
| Tên lane có chuỗi `antigravity` | **0** |
| Tên lane có chuỗi `codex` | **2** (`codex-khoi-a` 1 · `claude-codex` 1) |

**PHẢN BIỆN CỦA PHIÊN CODEX, 08/09, và nó ĐÚNG — bản đầu của ADR này sai ở đúng chỗ đó.** Bản
đầu viết *"Antigravity 0 · Codex 1 (0,33%)"* như một sự thật đã đo. Nó **không phải**: lệnh trên
đếm **dòng**, không đếm commit, và **không có gì ánh xạ tên lane sang hãng**. Một lane tên
`harness-vong2` có thể là bất kỳ hãng nào. Tôi suy hãng từ **chuỗi ký tự trong tên lane** — tức
tin đúng loại **lời tự khai** mà chính repo này cấm tin.

Và chỗ sai đó lại làm lập luận **mạnh lên**, không yếu đi:

> **Repo không ghi lại hãng ở bất kỳ đâu.** Nhãn `Lane:` ghi *việc*, không ghi *ai*. Nên một bảng
> luật chia theo hãng là bảng **không đo được, không kiểm được, và không ai biết nó có đúng
> không** — kể cả hôm nay. Đó là lý do đủ để bỏ nó, và nó không cần con số nào chống lưng.

Hai điều còn lại vẫn đứng, vì chúng không phụ thuộc việc biết hãng:

⑴ **Lane lớn nhất mang tên nói về VIỆC** (`harness-vong2`, 112 dòng — 37%), nên bảng chia theo
hãng **không có ô nào** cho chính người làm nhiều nhất.

⑵ Trục phân loại sai: việc thật chia theo **hướng đi** — ở nhà, hay ra ngoài — chứ không theo ai
đang gõ. Trục này thì **đo được** (vùng file bị chạm), còn trục hãng thì không.

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

**Hôm nay chỉ vế bàn giao được cưỡng chế** — trường `đóng khi:` trong `BACKLOG.md`, và ngay cả vế
đó thì repo NÀY cũng chưa bật (`KHUNG-8`). Nên tính tới 08/09, luật hai vai **chưa có răng**.

**PHẢN BIỆN CODEX 08/09, và nó ĐÚNG:** bản đầu của mục này viết *"không dựng nổi ca hỏng, nên nó
là chữ chứ không phải luật"*. Codex tách hai chuyện tôi gộp làm một — **"chưa cưỡng chế" KHÁC
"không thể kiểm bằng máy"** — và nó chỉ ra ba thứ máy kiểm được:

⑴ **vùng file bị chạm** so với vai đã khai (Vai ① chạm lõi · Vai ② chạm cửa ra);
⑵ **liên kết bàn giao** — mục sổ nợ có dẫn tới bản vá đóng nó không;
⑶ **người ký nghiệm thu phải khác người sửa.**

Vế ⑶ **đã tồn tại và đã chạy**: đó chính là `SELF_ATTESTATION` trong `scripts/quyen.mjs`, có phép
ghim và đã bị đột biến bắn thử. Nên câu *"không kiểm được"* của tôi **rộng hơn sự thật**, và rộng
theo hướng tự bào chữa — nó biến một việc chưa làm thành một việc không làm được.

**Giới hạn thật, hẹp hơn nhiều:** máy **không** chứng minh được **AI** thực sự phát hiện lỗi, vì
`--as` là tên tự khai. Máy chỉ chứng minh được **hai cái tên khác nhau**. Đó là giới hạn về danh
tính, không phải về khả năng kiểm — và nó biến mất khi danh tính đến từ nguồn được xác thực.

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
