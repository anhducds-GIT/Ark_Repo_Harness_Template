---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: building
owner: harness-vong2
priority_rank: 1
next_step: "Chốt hướng versioning: repo đích phải ghim được bản khung nào, và nâng cấp bằng lệnh — không chép tay"
version_source: package.json
current_focus: "Hai repo thật đã lên chuẩn và đóng được cổng. Audit GPT chỉ đúng chỗ đau: chưa có cơ chế ghim phiên bản nên chép tay sẽ đẻ ra N bản khung"
human_action: "Chốt: dừng migrate thêm cho tới khi có ghim phiên bản + lệnh nâng cấp, hay cứ migrate tiếp và chấp nhận vá tay?"
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
