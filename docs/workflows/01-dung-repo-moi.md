---
kind: workflow
ten: Dựng một repo mới
ai_chay: người, hoặc AI có quyền ghi thư mục đích
mat: khoảng 2 phút
---

# Dựng một repo mới từ harness

Dùng khi thư mục đích **trống**. Repo đang có việc thì xem
[đưa repo cũ lên chuẩn](02-dua-repo-cu-len-chuan.md).

```mermaid
flowchart TD
    A["init-repo &lt;thư-mục&gt; --ten '...'"] --> B{Thư mục trống?}
    B -- không --> X["TỪ CHỐI<br/>không bao giờ ghi đè"]
    B -- có --> C["Thả 20 file harness<br/>bỏ annex nghề không liên quan"]
    C --> D["git init + commit nguồn"]
    D --> E["Chạy generator<br/>ĐỌC TỪ HEAD nên phải commit trước"]
    E --> F["commit artifact"]
    F --> G["structure gate"]
    G --> H{0 đỏ?}
    H -- không --> I["In rõ chỗ sai + cách sửa"]
    H -- có --> J["Xong — repo đã có gate<br/>và suite chạy được ngay"]
```

## Lệnh

```bash
node scripts/init-repo.mjs <thư-mục-đích> --ten "Tên repo của bạn"
```

Thêm `--kho-nghe` nếu repo bạn **cũng** làm nghề tự động hoá trình duyệt và muốn giữ annex mẫu.

## Ba việc phải làm ngay sau đó

| | Vì sao |
|---|---|
| Sửa mục 6 của `AGENTS.md` | Đó là bản đồ file của **riêng repo bạn**. Bỏ trống thì phiên AI sau không biết mở file nào |
| Khai `units` và `areas` trong `.repo-structure.json` | Gate đọc chỗ này thay vì đoán hình dạng repo |
| Thêm test của bạn vào `tests/` | Suite seed chỉ kiểm chính harness, không kiểm code của bạn |

## Cạm bẫy

**Đừng bật `bootstrap.blocking` ngay.** Bật chặn khi repo đang đỏ là tự khoá repo ở phiên đầu
tiên. Chạy vài phiên cho sạch rồi mới bật dần.
