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

⑵ **Bất biến chịu tải: người SỬA không tự NGHIỆM THU bản sửa của mình.** Một tờ nghiệm thu do bên
bị kiểm ký là **lời tự khai, không phải hàng rào** — đúng luật mà `SELF_ATTESTATION` cưỡng chế
trong lõi quyền (ADR-0019 của repo Extension ⑵d), nên không phải một phép ẩn dụ.

> **PHẢN BIỆN CODEX 08/09 lượt hai, và nó bác đúng CHÍNH CÂU NÀY ở bản đầu.** Bản đầu viết
> *"Vai ② được phát hiện, Vai ① được sửa"*. Codex: câu đó **dễ bị đọc thành "người sửa không được
> tìm lỗi"** — một ràng buộc vô lý, nó cấm Vai ① soi chính lõi nó đang giữ. *"Ranh giới cần bảo vệ
> là **người sửa không tự nghiệm thu**, không phải tách người phát hiện khỏi người sửa."*
>
> Đúng, và đây là lỗi nặng nhất của lượt này: tôi đã viết một **ràng buộc sai** rồi ghim nó bằng
> một phép kiểm canh **đúng cái sai đó**. Nay cả ba chỗ (hiến pháp hai repo · bảng · phép ghim) nói
> bất biến đúng, và bảng có thêm một câu **chống đọc nhầm** — vì chính tôi đã đọc nhầm khi viết,
> nên một câu luật đọc nhầm được thì sẽ bị đọc nhầm.

⑶ **HAI vai chứ không ba, dù bảng có ba khối.** Khối 1 (dữ liệu lõi) là việc ở nhà; hai mũi *phát
bản* → *thi hành* cộng **vòng ngược** là **cùng một việc** — đi ra rồi mang về. Chia theo khối thì
vai giữa không có gì làm; chia theo hướng đi thì đủ.

⑷ **Bàn giao chỉ có một hình dạng:** Vai ② ghi chỗ vấp vào `BACKLOG.md` kèm trường `đóng khi:`,
Vai ① biến nó thành bản vá cộng một phép ghim. Nhắn thẳng *"sửa hộ tôi"* là mất dấu vết — người
đến sau không đọc được tin nhắn, chỉ đọc được sổ.

⑸ **Luật CHUNG, phát cho mọi repo tiêu thụ.** Đức duyệt tường minh, và bộ phát hành có dấu vân tay
riêng cho phần luật chung nên lượt phát này **bị chặn cho tới khi có câu duyệt đó**.

## Điều KHÔNG được đọc rộng hơn

**Hôm nay chỉ vế bàn giao có đường cưỡng chế bằng máy** — trường `đóng khi:` trong `BACKLOG.md` —
và repo NÀY chưa bật nó (`KHUNG-8`).

**PHẢN BIỆN CODEX ⓑ, cũng đúng:** bản đầu tôi viết *"chưa repo nào cưỡng chế đủ, nên luật này chưa
có răng"*. Hai chỗ hỏng trong một câu. ⓐ *"chưa repo nào"* là khẳng định trên **toàn bộ tập repo**
mà tôi chỉ kiểm hai. ⓑ **thiếu kiểm máy không đồng nghĩa không có răng** — một người có quyền từ
chối nghiệm thu là răng thật. Hiến pháp giữ **nghĩa vụ**; **trạng thái triển khai** thuộc về
`BACKLOG.md`, và đó là chỗ `KHUNG-8` đang nằm.

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

## Chỗ mục 8 CHƯA được thoả trọn — phản biện Codex ⓐ, và tôi không cãi

Mục 8 hỏi ba câu. Lượt này trả lời được **hai**:

- *"Nó thay chỗ cái nào?"* — bảng chia theo hãng, đã xoá, không giữ song song. **ĐẠT.**
- *"Đã có chuyện gì xảy ra thật chưa?"* — **KHÔNG có sự cố nào** do bảng cũ gây ra. Cái đo được
  chỉ là bảng cũ **không đo được**: repo không ghi hãng ở đâu cả. Đó là một khiếm khuyết về
  *khả năng kiểm*, không phải một vụ hỏng. **Yếu hơn mục 8 đòi**, và ghi ra thay vì tô hồng.
- *"Dựng nổi ca hỏng cho nó không?"* — dựng được cho vế **bàn giao** và vế **không tự nghiệm thu**;
  **không** dựng được cho việc một phiên có đóng đúng vai nó khai hay không.

Codex nói thẳng: *"'một vào một ra' chỉ trả lời câu thứ hai"*. Đúng. Luật này vào với **một câu
rưỡi trên ba**, và nếu ba tháng nữa không có sự cố nào nó ngăn được thì nó là ứng viên để **xoá**.

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
