# Bảng điều hành Đơn vị

> **SINH TỰ ĐỘNG — ĐỪNG SỬA TAY.** Sinh lại bằng `node scripts/build-dashboard.mjs`.

Trang được sinh ngày 2026-09-09. Đây là lúc sinh trang, **KHÔNG phải lúc bất kỳ extension nào được kiểm chứng**.

## A · Bắt đầu từ đâu

1. **Việc ưu tiên #1** — **_root** — Gọt bộ khung theo bài học của repo tiêu thụ: bảy giới hạn Đức chốt 07/09, quan trọng nhất là NGÂN SÁCH DÒNG cho file luật và luật DỪNG khi hết việc sản phẩm. Xem BACKLOG.md nhóm P0. · [STATUS](STATUS.md)
2. **Phiên gần nhất** — 2026-09-09 · [HANDOFF.md](HANDOFF.md)
3. **Luật phải đọc trước khi sửa gì** — [AGENTS.md](AGENTS.md) · cổng vào cho AI: [llms.txt](llms.txt)
4. **Ai đang giữ package nào** — `.agents/claims.json` (trạng thái sống, cố tình KHÔNG chép vào trang này để trang không mục theo từng lần nhận/trả quyền)

## B · Có gì trong repo

| Đơn vị | Version [ĐO] | Lifecycle [KHAI] | Method Bridge [ĐO] | File test [ĐO] | Kiểm chứng cuối (ngày @ commit 7 ký tự, cách kiểm) [KHAI + bằng chứng] | Code đã commit đổi sau kiểm chứng? [ĐO] | Việc đang mở | Đọc sâu (link STATUS) |
|---|---:|---|---:|---:|---|---|---|---|
| ark-repo-harness | 1.3.78 | active | 0 | 20 | 2026-09-06 @ `baebd07` — npm test 145/145 xanh · cổng đóng phiên XANH TOÀN BỘ 11/11 · bản 1.3.1 đã phát, dấu vân tay 5b2b74c0eee8e3b6 trong sổ phát hành · audit độc lập Codex 05/09 ra 14 phát hiện, đã kiểm chứng lại từng cái ([bằng chứng](HANDOFF.md)) | CÓ (71 commit) | Bảng gom 10 tab thành BỐN nhóm, mỗi khái niệm một chỗ canonical — xem ADR-0006. Đây là lượt CẮT: thước đo của lượt là số dòng luật GIẢM, không phải số tính năng tăng. | [STATUS](STATUS.md) |

## D · Sức khoẻ điều hướng [ĐO]

| Nợ | Số | Nghĩa là gì |
|---|---:|---|
| Đơn vị chưa khai STATUS | 0 | mỗi dòng là một câu hỏi AI sẽ phải hỏi Đức |
| Link chết trong file cổng | 0 | kiểm 5 link ở llms.txt và bảng B |
| Thư mục top-level chưa khai chủ | 0 | chưa khai trong khối `areas` của `.repo-structure.json` |
| Tài liệu quá hạn chưa rà | 0 | `status: active` mà quá `ttl_days` tính từ commit cuối chạm vào |

## Chú giải

- **[ĐO]**: Máy đếm trực tiếp từ repo, không qua tay người; đây là mức chắc chắn.
- **[KHAI]**: Do con người khai trong STATUS; lời khai kiểm chứng chỉ hợp lệ khi có liên kết bằng chứng.
