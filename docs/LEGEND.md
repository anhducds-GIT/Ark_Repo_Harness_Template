---
kind: legend
status: active
ttl_days: 365
---

# LEGEND — tra cứu từ

> **Luật dùng từ của repo này:** thuật ngữ kỹ thuật **giữ nguyên tiếng Anh**, và giải nghĩa ở đây.
> Dịch sang tiếng Việt nghe thì gần gũi nhưng tra cứu thì mất — "cổng kiểm" không tìm được trong
> tài liệu nào khác, còn `gate` thì có. Chữ nào chủ dự án đọc trên bảng (trạng thái, việc kế,
> việc cần người làm) thì tiếng Việt, đủ dấu.
>
> Máy đọc bảng này để dựng mục Tra cứu — thêm dòng vào đây là bảng tự có.

| Từ | Nghĩa trong repo này | Vì sao không dịch |
|---|---|---|
| **harness** | Bộ khung: luật + gate + generator + công cụ, thả vào repo nào cũng chạy | "bộ khung" mơ hồ; harness là từ chuẩn cho lớp hạ tầng quanh code |
| **gate** | Cửa chặn tự động. Đỏ thì việc chưa xong, không có đường vòng | Dịch "cổng kiểm" thì lẫn với mọi loại kiểm tra khác |
| **session gate** | Gate chạy lúc đóng phiên: test · quyền · artifact tươi · cấu trúc | |
| **structure gate** | Gate soi hình dạng repo: file nào phải có, khai ở đâu | |
| **generator** | Script sinh ra file từ dữ liệu có sẵn. Sinh ra thì **không sửa tay** | |
| **artifact** | File do generator sinh. Ở đây: `DASHBOARD.md`, `llms.txt`, `repo-map.json` | Trùng tên với "artifact" của CI nhưng cùng nghĩa gốc: sản phẩm phụ được tạo ra |
| **claim** | Quyền ghi một vùng repo. Một vùng, một phiên, một lúc | "quyền" quá chung; claim là hành vi *nhận* quyền |
| **area** | Vùng sở hữu. `_root` `_docs` `_code`… mỗi vùng một chủ | |
| **steward** | Vùng nào chịu trách nhiệm cho thư mục nào — khai trong cấu hình | |
| **lane** | Nhãn phiên gắn vào commit, để biết commit đó của ai làm | |
| **fail-closed** | Không chắc thì DỪNG. Ngược với fail-open: không chắc thì đi tiếp | Khái niệm an toàn có tên chuẩn, dịch ra là mất |
| **fail-loud** | Bỏ qua cũng được, nhưng phải NÓI TO là đã bỏ qua | |
| **mutation test** | Cố ý phá code để xem test có đỏ không. Test không đỏ = test trang trí | |
| **fixture** | Dữ liệu giả dựng riêng cho một phép kiểm | |
| **đối chứng dương** | Vế thứ hai của một phép kiểm: chứng minh nó **bắt được** khi lỗi có thật | Đây là chữ tiếng Việt cố ý — nó là thói quen, không phải thuật ngữ |
| **suite** | Toàn bộ test của một repo, chạy bằng `npm test` | |
| **seed** | Nội dung mẫu bộ khung phát kèm, để repo mới có cái mà bắt đầu | |
| **annex** | Phụ lục nghề: luật chỉ đúng với một loại repo, bật khi cần | |
| **assess** | Đo một repo cách chuẩn bao xa, trước khi quyết định migrate | |
| **migrate** | Đưa một repo **đang sống** lên chuẩn (khác với dựng mới) | |
| **idempotent** | Chạy một lần hay mười lần cho cùng kết quả | |
| **ADR** | Architecture Decision Record — mỗi quyết định một file, không sửa lại | Tên chuẩn ngành, có tài liệu ở ngoài |
| **HANDOFF** | Bàn giao giữa các phiên. Chỉ thêm dòng, không sửa dòng cũ | |
| **P1…P5** | Hồ sơ repo: P1 nhiều gói · P2 ứng dụng đơn · P3 tài liệu · P4 hạ tầng · P5 điều phối | |
