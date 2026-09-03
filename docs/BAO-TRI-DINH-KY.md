---
kind: maintenance
status: active
ttl_days: 365
---

# Bảo trì định kỳ — AI là chủ nhà, không phải khách

> **Giả định nền của cả file này:** sau khi dựng xong, **chủ dự án là khách**. Người ở lại trông
> nhà là AI agent, với bộ nhớ là các file trong repo và luật là các protocol đã khai.
>
> Một repo không có lịch bảo trì thì nợ tích dần cho tới lúc không ai dám động vào. Và nợ ở đây
> không ồn ào: liên kết chết vẫn im, tài liệu quá hạn vẫn nằm đó trông như còn đúng, cảnh báo bị
> ngó lơ đủ lâu thì **thành hình nền**.

## Ba nhịp

```mermaid
flowchart LR
    A["MỖI PHIÊN<br/>tự động, không ai phải nhớ<br/>6 phép quét, đỏ thì chặn"]
    B["MỖI TUẦN<br/>AI mở phiên đầu tuần làm<br/>cảnh báo vàng · link chết · tài liệu quá hạn<br/>quyền mồ côi · commit chưa đẩy"]
    C["MỖI THÁNG<br/>soát lại luật<br/>luật nào chưa chặn được gì?<br/>luật nào bị vi phạm nhiều lần?"]
    A --> B --> C
    C -.-> A
```

### Mỗi phiên — quét nhanh, tự động, không ai phải nhớ

Cửa kiểm đã làm sẵn khi đóng phiên:

| Quét gì | Đỏ thì sao |
|---|---|
| Bài kiểm tra | chặn |
| Trang tự sinh còn khớp lịch sử không | chặn |
| Ai đụng vùng của ai | chặn |
| File mới đã khai vào bản đồ chưa | chặn |
| Bí mật lọt vào repo | chặn |
| Vùng chỉ-thêm có bị sửa không | chặn |

**Không phải nhớ gì.** Đóng phiên là nó chạy.

### Mỗi tuần — quét sâu, AI tự làm

Ai mở phiên đầu tiên trong tuần thì làm, ghi một dòng vào `HANDOFF.md`.

- [ ] `npm run bootstrap -- --all` — đọc **hết**, kể cả cảnh báo vàng
- [ ] **Cảnh báo vàng tồn quá hai tuần → phải xử.** Sửa, hoặc ghi rõ vì sao chấp nhận và hạn
      chấp nhận tới bao giờ. **Không được để im lặng** — đó là cách một cửa kiểm chết
- [ ] Liên kết chết trong tài liệu → sửa hoặc gỡ
- [ ] **Tài liệu quá hạn.** Mỗi tài liệu tự khai hạn dùng (`ttl_days`, tính bằng ngày) ở đầu
      file. Quá hạn thì hoặc gia hạn kèm lý do, hoặc chuyển vào thư mục lưu trữ. Để nguyên là
      để một tài liệu hết đúng nằm im trông như còn đúng
- [ ] Bảng quyền: có vùng nào bị giữ quá một ngày không? Phiên giữ nó còn sống không? **Quyền
      mồ côi chặn mọi người khác, và bảng quyền không tự biết ai còn sống**
- [ ] Có commit nào chưa đẩy nằm quá một ngày không? Việc chưa đẩy là việc **vô hình** với mọi
      vòng kiểm tra chéo bên ngoài

### Mỗi tháng — soát lại luật

- [ ] Đọc lại `AGENTS.md`. Luật nào **chưa từng chặn được gì** trong tháng qua? Nó là luật thật
      hay chỉ là chữ?
- [ ] Luật nào **bị vi phạm nhiều lần**? Hoặc nó sai, hoặc nó không kiểm được bằng máy — cả hai
      đều là việc phải sửa, không phải việc phải nhắc lại
- [ ] Sổ tay có mục nào lạc hậu so với việc đang làm thật không?
- [ ] Mỗi việc lặp lại đã có mục trong sổ tay chưa? Chưa có thì viết, kẻo lần sau lại tự nghĩ
- [ ] Nhật ký đã ghi bản mới chưa?
- [ ] `npm run can-nang` — **cân nặng, chứ không phải độ đúng.** Quá ngân sách thì phải BỚT
      trước khi nghĩ tới nới. Đọc kỹ danh sách *phép kiểm chưa từng đỏ*: với từng cái, hỏi
      "dựng nổi ca hỏng cho nó không?". Không dựng nổi thì nó là chữ, không phải luật —
      và một luật không chặn được gì vẫn tốn chỗ nhớ của mọi phiên sau

## Ba dấu hiệu repo đang xuống cấp

Cả ba đều **im lặng**, và đó là lý do phải chủ động đi tìm.

**① Số cảnh báo vàng tăng dần mà không ai sửa.** Đây là cách một cửa kiểm chết: không phải bị gỡ,
mà bị ngó lơ đủ lâu để thành hình nền. Đo được ở repo tiền thân: 19 chỗ vàng nằm im nhiều phiên.

**② `HANDOFF.md` có khoảng trống.** Phiên không ghi lại thì phiên sau làm lại việc vừa làm. Trống
hai phiên liên tiếp là kỷ luật đã lỏng.

**③ Cửa kiểm bị nới.** Ai đó sửa cửa cho việc của mình xanh. Đây là hỏng nặng nhất vì nó phá
chính thứ đang canh mọi thứ khác — và nó luôn được biện minh là "chỉ lần này thôi".

## Việc nào cần người, việc nào không

Danh sách việc **phải hỏi Đức** nằm ở
[AGENTS.md mục 2 — Sáu việc PHẢI hỏi Đức trước](../AGENTS.md#2-sáu-việc-phải-hỏi-đức-trước).
**Một bản duy nhất, đừng chép lại ở đây.**

Trong lịch bảo trì này, AI **tự làm hết** những việc sau mà không cần hỏi ai: quét và sửa liên
kết chết · gia hạn tài liệu quá hạn · viết lại tài liệu lạc hậu · thêm phép kiểm · ghi nợ vào
sổ · đẩy việc **của chính mình** khi cửa kiểm xanh.

## Nếu bạn là chủ dự án và một tháng nữa mới quay lại

Ba lệnh, không cần đọc code:

```bash
npm run gate -- --as duc          # repo có lành không
npm run bootstrap                 # nợ cấu trúc còn bao nhiêu
npm run overview -- bang.html     # rồi mở bang.html bằng trình duyệt
```

*(Đừng commit file HTML đó — nó là ảnh chụp một lúc, không phải tài liệu.)*

Nếu cả ba đều sạch mà bạn vẫn thấy repo im ắng bất thường, hãy đọc `HANDOFF.md` từ dưới lên —
**im ắng thường có nghĩa là không ai làm gì, chứ không phải mọi thứ đều ổn.**
