---
kind: workflow
ten: Đưa một repo đang sống lên chuẩn
ai_chay: AI, chủ dự án duyệt từng bước lớn
mat: chưa đo được — chưa từng chạy thật
---

# Migrate một repo đang sống

**Trạng thái: chưa từng chạy trên repo thật khác nghề.** Vài bước dưới đây sẽ sai, và lần chạy
đầu tiên là để tìm ra chúng — không phải để nghiệm thu.

```mermaid
flowchart TD
    A["assess &lt;repo&gt;"] --> B{Mức mấy?}
    B -- "0 · chưa có gì" --> C["Cân nhắc dựng mới<br/>thay vì migrate"]
    B -- "1 · có luật, chưa có máy" --> D["Thả nhóm MÁY<br/>chép, KHÔNG sửa gì"]
    B -- "2 · có máy, chưa có lưới đỡ" --> E["Thêm suite seed<br/>khai scripts.test"]
    B -- "3 · đủ bộ" --> F["Chạy gate, sửa theo lời nó nói"]
    D --> G["Khai .repo-structure.json<br/>BƯỚC DUY NHẤT PHẢI NGHĨ"]
    E --> G
    G --> H["commit nguồn"]
    H --> I["chạy generator — SAU khi commit"]
    I --> J["session gate"]
    J --> K{XANH?}
    K -- không --> L["Sửa bug.<br/>KHÔNG nới gate cho nó xanh"]
    K -- có --> M["assess lại:<br/>mức 3, chi phí 0/0/0"]
```

## Bốn cạm bẫy — cả bốn đều đã xảy ra thật

| Bẫy | Hậu quả |
|---|---|
| Bật `bootstrap.blocking` ngay từ đầu | Repo bị khoá ở phiên đầu tiên, không ai vào được |
| Chia `areas` quá nhỏ khi chưa biết ai làm gì | Tự tạo tranh chấp claim cho việc không hề chồng nhau |
| Chạy generator trước khi commit nguồn | Artifact dựng từ HEAD cũ — **hỏng im lặng**, trang vẫn đẹp |
| Sửa harness trong lúc chép sang | Hai nhánh của cùng một công cụ, rồi chúng trôi khỏi nhau |

## Việc KHÔNG thuộc workflow này

- **Dọn nợ cũ của repo đích.** Migrate là thêm một lớp, không phải viết lại repo.
- **Đổi luật repo đích cho giống repo nhà.** Annex sinh ra đúng để chỗ đó khác nhau.

Chi tiết từng bước: [docs/protocols/CHUYEN-REPO-LEN-CHUAN.md](../protocols/CHUYEN-REPO-LEN-CHUAN.md)
