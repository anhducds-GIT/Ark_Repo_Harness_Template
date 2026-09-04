---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: active
last_verified: 2026-09-03
last_verified_commit: 45501714a967d90e9026bdedcf616d50e7996f59
last_verified_how: "npm test 50/50 xanh · session-check 11/11 XANH · migrate thật 2 repo khác nghề"
evidence_ref: docs/migrations/2026-09-03-nav-platform.md
owner: harness-vong2
priority_rank: 1
next_step: "Dọn trạng thái đang tự mâu thuẫn (bảng nói đã chạy thật 2 repo, thân bài vẫn nói chưa)"
version_source: package.json
current_focus: "v1.2.17: sáu phép kiểm chưa từng đỏ nay đã chứng minh được là đỏ được thật"
human_action: "Chọn một: nâng GitHub Pro, hoặc để repo public, hoặc chấp nhận CI chỉ báo chứ không chặn. Gói free + repo private thì GitHub không cho chặn merge"
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
