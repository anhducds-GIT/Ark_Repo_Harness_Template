---
kind: brief
status: active
ttl_days: 30
---

# ĐỀ BÀI BRAINSTORM CHO GPT — đưa harness này tới v1.0

> **Cách dùng:** Đức dán trọn file này cho GPT. GPT đọc repo qua GitHub connector.
> Repo: `https://github.com/anhducds-GIT/Ark_Repo_Harness_Template`
>
> **Đừng tóm tắt hộ nó.** Và đừng bảo nó "đánh giá xem tốt chưa" — câu đó luôn nhận về lời khen.

---

## Bối cảnh trong năm câu

Đây là một **harness** — bộ khung repo dùng lại được: luật cho AI đọc, hai gate chặn việc dở
dang, generator sinh bảng trạng thái từ lịch sử git, và công cụ đưa repo khác lên chuẩn.

Nó vừa tách khỏi repo sinh ra nó và **tự dựng bằng chính bộ khung của mình**.

Mục tiêu của chủ dự án: dùng nó làm gốc để chuẩn hoá **khoảng 21 repo** khác, nhiều nghề khác
nhau — extension trình duyệt, tài liệu, hạ tầng, điều phối.

Nó **chưa** là v1.0. Audit độc lập vòng một trả về **REJECT** với 6 phát hiện mức NẶNG.

Lộ trình hiện tại nằm ở `docs/ROADMAP-V1.md`.

## Việc của bạn — brainstorm, KHÔNG phải audit

Codex đã audit và tìm ra lỗi *trong code hiện có*. **Đừng lặp lại việc đó.** Việc của bạn khó
hơn: tìm những thứ **không có trong repo mà lẽ ra phải có**, và những giả định nền mà chưa ai
chất vấn.

### Bốn câu hỏi tôi muốn bạn tấn công

**① Cái gì sẽ hỏng khi chạy trên 21 repo mà một repo không lộ ra?**

Mọi thứ ở đây được kiểm bằng: một repo trống, một repo giả, và chính nó. Chưa lần nào chạm một
repo thật khác nghề. Hãy nghĩ về những thứ chỉ xuất hiện ở quy mô: repo có lịch sử 5 năm, repo
có submodule, repo dùng monorepo tool, repo mà hai người đang làm cùng lúc, repo mà nghề của nó
làm luật chung ở đây trở nên vô nghĩa.

**② Luật ba tầng (luật chung · phụ lục nghề · bản đồ địa phương) có đủ không?**

Nó dựng trên một giả định chưa được thử: rằng mọi luật đều rơi gọn vào một trong ba tầng. Hãy
tìm luật KHÔNG rơi gọn. Ví dụ để bạn công phá: luật đúng với **hai** nghề nhưng không đúng với
nghề thứ ba thì để đâu? Luật đúng với mọi repo của **một tổ chức** nhưng không đúng phổ quát?

**③ Mô hình "một vùng, một chủ, một lúc" có sống nổi ở quy mô không?**

Số đo thật từ repo cũ: **127 commit/ngày, 77% chạm gốc repo, 64 lượt nhận quyền/ngày**, và
**9% số lượt là phiên giữ quyền chỉ vì chưa đẩy được**. Hãy nghĩ xem mô hình này gãy ở đâu, và
liệu có mô hình nào rẻ hơn mà vẫn chặn được đúng thứ nó đang chặn.

**④ Cái gì trong harness này là THÓI QUEN của một repo, bị nhầm thành LUẬT chung?**

Đây là câu tôi ngại nhất, vì tôi là người viết nó và tôi không nhìn ra được. Harness sinh ra từ
một repo làm extension trình duyệt, do một chủ dự án không đọc code điều phối, với ba AI làm
việc song song. Bao nhiêu phần của nó chỉ đúng trong đúng hoàn cảnh đó?

## Ba thứ ĐỪNG đề xuất

1. **Thêm gate mới.** Bốn gate mà chặn thật thì tốt hơn tám gate mà hai cái báo xanh sai — và
   vòng audit vừa rồi tìm ra đúng bốn cái báo xanh sai.
2. **Kéo thư viện ngoài.** Trang sinh ra là HTML tĩnh đem publish; phụ thuộc mạng để hiện chữ là
   sẽ có ngày trắng trang. Đề xuất nào cần `npm install` phải nêu rõ nó mua được gì.
3. **Giao diện web, CI, registry.** Không thuộc v1.0. v1.0 chỉ cần: đúng, chặn thật, và đã chạy
   thật một lần ở ngoài.

## Cách trả lời

Với mỗi ý, cho tôi **ba dòng**:

```
Ý       — một câu, cụ thể, làm được
Vì sao  — nó chặn được kiểu hỏng nào; nếu có số đo thì càng tốt
Giá     — mất gì, đổi lấy gì, và cái gì tệ đi
```

**Xếp theo đòn bẩy**, không xếp theo dễ làm. Năm ý sắc hơn hai mươi ý an toàn.

**Nếu bạn nghĩ một phần của kế hoạch hiện tại là SAI, hãy nói thẳng.** Tôi cần phản biện, không
cần xác nhận. Câu trả lời hữu ích nhất bạn có thể đưa là *"thứ tự khối A→D sai, và đây là lý do"*.

## Chỗ để đọc, theo thứ tự

| Đọc cái này | Để hiểu |
|---|---|
| `README.md` | harness gồm gì |
| `AGENTS.md` | luật — hiến pháp một trang |
| `docs/ROADMAP-V1.md` | còn thiếu gì để tới v1.0, và vì sao chưa gọi là v1.0 |
| `docs/LEGEND.md` | thuật ngữ, nếu có từ nào lạ |
| `docs/workflows/` | ba workflow, có lưu đồ |
| `docs/adr/` | quyết định đã chốt và lý do |
| `scripts/assess.mjs` · `scripts/init-repo.mjs` | hai công cụ đối mặt người dùng |
| `CHANGELOG.md` | vừa đổi gì |

## Một điều về cách repo này làm việc, để bạn hiểu vì sao nó khó tính

Trong ba ngày, **bảy phép kiểm** đã bị phát hiện là **rỗng nghĩa** — chúng xanh mà không phân
biệt được hai nhánh. Sáu do tự bắt, một do audit bắt.

Nên luật ở đây là: mỗi lớp bảo vệ phải có một **fixture dựng được ca hỏng**, và phải qua
**mutation test** — cố ý phá code, xem test có đỏ không. Test không đỏ nghĩa là nó chưa từng
bảo vệ gì.

Đề xuất nào của bạn mà không kiểm được bằng máy thì xin nói rõ điều đó ngay trong ý.
