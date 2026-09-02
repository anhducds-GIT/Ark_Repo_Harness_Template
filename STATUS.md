---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: building
owner: harness-vong2
priority_rank: 1
next_step: "Đóng nốt cổng kiểm ở hai repo vừa migrate, rồi mới bỏ được nhãn chưa-chứng-minh"
version_source: package.json
current_focus: "Vá các lỗ mà hai lần migrate thật và audit độc lập vạch ra — cổng từng báo xanh khi không kiểm được gì"
human_action: "Repo NAV có bộ test cũ đỏ sẵn từ trước khi migrate — quy trình cấm tôi tự dọn nợ cũ. Anh nói một câu: dọn hay để nguyên"
ref_readme: README.md
ref_handoff: HANDOFF.md
---

# Trạng thái — Ark Repo Harness

> **File KHAI BẰNG TAY.** Bảng đọc phần đầu file này. Đừng gõ số nào mà máy đo được.

Đây là **nhà riêng của bộ khung**. Nó tự dựng bằng chính bộ khung của mình, và tự sinh lại được
bản trích trong `template/`.

**Đang ở đâu:** bộ khung dùng được, nhưng **chưa từng chạy trên một repo thật khác nghề**. Nhãn
`unproven` vẫn đúng.

**Việc kế:** xem [ROADMAP-V1.md](docs/ROADMAP-V1.md) — bốn khối A→D.
