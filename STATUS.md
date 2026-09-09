---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: active
last_verified: 2026-09-10
last_verified_commit: d6da6a0290bbb58c1837be86f2dfaf6e0982a852
last_verified_how: "23 suite · cổng đóng phiên XANH TOÀN BỘ · bản 1.8.9 (xem CHANGELOG)"
evidence_ref: HANDOFF.md
owner: harness-loi-02
priority_rank: 1
next_step: "`KHUNG-50` — dấu xác nhận suite không ghi được vì HEAD đổi giữa lượt. Hỏi trước khi vá: một `git worktree` riêng cho suite + bộ sinh đóng được mấy trong ba mục còn lại?"
version_source: package.json
current_focus: "`KHUNG-50/55/51` là MỘT bệnh — nhiều lane chung một cây làm việc git (chung đĩa, chung HEAD). Đừng vá ba lần. `KHUNG-59` (chung INDEX) đã đóng 10/09 bằng cửa `.githooks/commit-msg`. Thứ tự ở docs/ROADMAP-V2.md; bản đồ sống `npm run what-next`."
human_action: "CÓ — bảng tự đếm, xem nhóm \"Công việc\". Cố ý không giữ số ở đây: 07/09 bản gõ tay đã lệch thật."
ref_readme: README.md
ref_handoff: HANDOFF.md
---

# Trạng thái — Ark Repo Harness

> **Khai bằng tay, và là thứ MỌI PHIÊN ĐỌC LÚC MỞ. Giữ nó một trang.** Đừng gõ số nào mà máy đo
> được — bảng đọc frontmatter phía trên. Lịch sử từng lượt việc ở [HANDOFF.md](HANDOFF.md), từng
> bản ở [CHANGELOG.md](CHANGELOG.md), cách lắp vào repo mới ở [README.md](README.md).

**Đây là nhà riêng của bộ khung** — nó tự dựng bằng chính mình, và tự sinh lại `template/`.

**Đang ở đâu:** đã chạy thật trên hai repo khác nghề — `nav_platform_main` (Node, chứng khoán) và
`Project 3 AI Agent Unify` (Python). Cả hai ghim cùng một bản khung và nhận bản vá bằng lệnh,
không chép tay.

**Còn mở:** `next_step` ở đầu file này, và [BACKLOG.md](BACKLOG.md).
