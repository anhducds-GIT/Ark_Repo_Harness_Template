---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: active
last_verified: 2026-09-09
last_verified_commit: d6da6a0290bbb58c1837be86f2dfaf6e0982a852
last_verified_how: "22 suite · cổng đóng phiên XANH TOÀN BỘ · bản 1.8.0 đã phát và đã đẩy (bản 1.8.7 xem CHANGELOG)"
evidence_ref: HANDOFF.md
owner: harness-loi-02
priority_rank: 1
next_step: "Đọc `docs/ROADMAP-V2.md` mục *Thứ tự việc — bản 10/09* TRƯỚC. Việc kế: `KHUNG-59` (hai lane chung INDEX — `git add` của người này bị `git commit` của người kia cuốn theo, đã xảy ra 2 lần trong một ngày). Hỏi trước khi vá: một `git worktree` riêng cho suite + bộ sinh có đóng được mấy trong bốn mục `KHUNG-59/50/55/51` không — chúng là MỘT bệnh."
version_source: package.json
current_focus: "Bốn mục đắt nhất (`KHUNG-59/50/55/51`) là MỘT bệnh: nhiều lane chung một cây làm việc git — chung đĩa, chung index, chung HEAD. Đừng vá bốn lần. Thứ tự ở docs/ROADMAP-V2.md; bản đồ sống là `npm run what-next`."
human_action: "CÓ — bảng tự đếm, xem nhóm \"Công việc\". Trường này cố ý không giữ số: bản gõ tay là nguồn sự thật thứ hai, và 07/09 nó đã lệch thật."
ref_readme: README.md
ref_handoff: HANDOFF.md
---

# Trạng thái — Ark Repo Harness

> **Khai bằng tay, và là thứ MỌI PHIÊN ĐỌC LÚC MỞ. Giữ nó một trang.** Đừng gõ số nào mà máy đo
> được — bảng đọc frontmatter phía trên. Lịch sử từng lượt việc ở [HANDOFF.md](HANDOFF.md), từng
> bản ở [CHANGELOG.md](CHANGELOG.md), cách lắp vào repo mới ở [README.md](README.md).

**Đây là nhà riêng của bộ khung.** Nó tự dựng bằng chính bộ khung của mình và tự sinh lại được
bản trích trong `template/`.

**Đang ở đâu:** đã chạy thật trên hai repo khác nghề — `nav_platform_main` (Node, chứng khoán) và
`Project 3 AI Agent Unify` (Python). Cả hai ghim cùng một bản khung và nhận bản vá bằng lệnh,
không chép tay.

**Còn mở:** `next_step` ở đầu file này, và [BACKLOG.md](BACKLOG.md).
