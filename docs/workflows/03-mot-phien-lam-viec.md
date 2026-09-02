---
kind: workflow
ten: Một phiên AI làm việc, từ mở tới đóng
ai_chay: mọi phiên AI
mat: cả phiên
---

# Một phiên làm việc

Đây là workflow chạy nhiều nhất — mỗi phiên AI đều đi qua nó. Thứ tự ở cuối **không đổi được**.

```mermaid
flowchart TD
    A["Đọc AGENTS.md → mục 6 → HANDOFF cuối file"] --> B["claim vùng mình sắp sửa"]
    B --> C{Vùng có chủ khác?}
    C -- có --> D["CHỈ ĐỌC.<br/>Muốn giành thì hỏi chủ dự án"]
    C -- trống --> E["Làm việc — một việc một lúc"]
    E --> F["Mỗi fix một test ghim<br/>+ mutation test"]
    F --> G["git add TỪNG FILE<br/>không -A, không -u"]
    G --> H["commit nguồn — dòng CUỐI của<br/>lời commit là: Lane: tên-phiên"]
    H --> I["chạy generator<br/>giờ HEAD đã có dữ liệu mới"]
    I --> J["commit artifact riêng"]
    J --> K["session gate"]
    K --> L{XANH TOÀN BỘ?}
    L -- không --> M["Sửa. KHÔNG báo xong."]
    L -- có --> N["safe-push"]
    N --> O["Kiểm bằng ls-remote,<br/>KHÔNG tin git status"]
    O --> P["ghi HANDOFF"]
    P --> Q["release claim — SAU khi push"]
```

## Bốn chỗ dễ sai nhất, đều đã trả giá

**`git add -A` hoặc `-u`** cuốn theo việc chưa commit của phiên khác. Chỉ khác nhau một chữ cái,
và cả hai đều cuốn. Liệt kê từng file.

**Chạy generator trước khi commit** thì nó dựng lại từ HEAD cũ. Artifact vẫn sinh ra, chỉ là nói
về một quá khứ khác — hỏng im lặng.

**Release claim trước khi push** thì commit chưa push của bạn rơi vào vùng không chủ, và gate của
phiên sau đỏ oan. Giữ tới khi push xong.

**Tin `git status -sb`** sau khi push. Nó đọc ref remote-tracking **cục bộ** — đúng thứ có thể
sai. Hỏi thẳng máy chủ:

```bash
git ls-remote origin refs/heads/main
git merge-base --is-ancestor <sha-của-bạn> <sha-vừa-lấy>
```

Mã thoát 0 = commit đã thật sự lên.
