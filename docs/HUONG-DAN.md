---
kind: guide
status: active
ttl_days: 365
---

# Hướng dẫn

Hai người dùng, hai nhu cầu khác nhau. Đọc phần của mình.

## Cho người — chủ dự án

Bạn không cần đọc code. Bạn cần biết **ba câu trả lời**, và cả ba đều lấy được bằng một lệnh.

### "Repo này đang thế nào?"

```bash
npm run gate -- --as <tên-phiên-của-bạn>
```

XANH TOÀN BỘ thì việc đã xong. Có dòng ĐỎ thì **chưa xong** — và mỗi dòng đỏ đều nói luôn cách sửa.

### "Repo kia còn cách chuẩn bao xa?"

```bash
npm run assess -- <đường-dẫn-repo>
```

Ba con số quan trọng hơn một phần trăm:

| | Nghĩa | Ai làm |
|---|---|---|
| **thả** | chép file vào là xong | máy |
| **viết** | phải ngồi viết nội dung riêng của repo đó | người |
| **soi** | có sẵn nhưng lệch bản chuẩn, phải mở ra đọc | người |

*"72% đạt chuẩn"* nghe gọn mà không dùng được: 72% có thể là nửa giờ, cũng có thể là một buổi.

### "Tôi cần duyệt những gì?"

Ba việc **luôn** phải hỏi bạn, và AI không được tự làm:

1. Xoá file, hoặc sửa dữ liệu gốc
2. Đẩy commit của phiên khác lên (`--carry`)
3. Giành claim của một phiên đang làm việc

Ngoài ra: gửi gì ra ngoài · tạo automation tự chạy · đổi luật an toàn.

### Ba dấu hiệu repo đang xuống cấp

- **Số chỗ VÀNG tăng dần mà không ai sửa.** Cảnh báo bị ngó lơ đủ lâu thì thành hình nền.
- **HANDOFF không được ghi.** Phiên sau sẽ làm lại việc phiên trước vừa làm.
- **Ai đó nới gate cho nó xanh.** Sửa bug thì được; gỡ bảo vệ thì không.

---

## Cho AI — phiên làm việc

### Mở phiên, đúng thứ tự

1. Đọc `AGENTS.md` → mục 6 (bản đồ file) → `HANDOFF.md` **phần cuối**
2. `claim` vùng mình sắp sửa. Vùng có chủ khác thì **chỉ đọc**
3. Chạy gate trước khi làm gì. Đỏ sẵn thì **dừng và báo**, đừng tự sửa cho nó xanh

### Trong lúc làm

**Một việc một lúc.** Việc phát sinh ngoài phạm vi thì ghi vào sổ, không tự làm.

**Mỗi fix một test ghim, và test phải dựng nổi ca hỏng.** Cách tự kiểm: với mỗi assert dạng
*"không có X"*, hỏi *fixture này có dựng nổi ca CÓ X không?* Không thì phép kiểm đó là trang trí.

**Chạy mutation test trước khi báo xong** — cố ý phá code, xem test có đỏ không. Test không đỏ
nghĩa là nó chưa từng bảo vệ gì.

**Commit TRƯỚC khi chạy mutation test.** Bước khôi phục thường là `git checkout`, và nó xoá sạch
việc chưa commit đang được thử.

### Đóng phiên, thứ tự không đổi được

```
git add <từng file>   →   commit nguồn   →   chạy generator   →   commit artifact
   →   gate XANH   →   push   →   ghi HANDOFF   →   release claim
```

**Ba chỗ đã trả giá thật:**

- `git add -A` hoặc `-u` cuốn theo việc chưa commit của phiên khác. Chỉ khác một chữ cái.
- Chạy generator **trước** khi commit thì nó dựng lại từ HEAD cũ — hỏng im lặng, trang vẫn đẹp.
- `release` claim **trước** khi push thì commit của bạn thành "việc mồ côi", và gate của phiên sau
  đỏ oan.

### Không bao giờ

- Báo xong khi gate chưa xanh
- Nới gate cho nó xanh
- `git push` trần — luôn dùng `npm run push`
- Tin `git status -sb` sau khi push. Hỏi thẳng máy chủ:

```bash
git ls-remote origin refs/heads/main
git merge-base --is-ancestor <sha-của-bạn> <sha-vừa-lấy>
```
