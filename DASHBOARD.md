# Bảng điều hành Đơn vị

> **SINH TỰ ĐỘNG — ĐỪNG SỬA TAY.** Sinh lại bằng `node scripts/build-dashboard.mjs`.

Trang được sinh tại commit `37a6c20` (2026-09-05). Đây là lúc sinh trang, **KHÔNG phải lúc bất kỳ extension nào được kiểm chứng**.

## A · Bắt đầu từ đâu

1. **Việc ưu tiên #1** — **_root** — Ghi lại ở repo đã sinh ra gói điều phối rằng bộ khung nay là nơi phát hành nó — cần quyền bên đó, một lượt riêng · [STATUS](STATUS.md)
2. **Phiên gần nhất** — 2026-09-05 @ `37a6c20` · [HANDOFF.md](HANDOFF.md)
3. **Luật phải đọc trước khi sửa gì** — [AGENTS.md](AGENTS.md) · cổng vào cho AI: [llms.txt](llms.txt)
4. **Ai đang giữ package nào** — `.agents/claims.json` (trạng thái sống, cố tình KHÔNG chép vào trang này để trang không mục theo từng lần nhận/trả quyền)

## B · Có gì trong repo

| Đơn vị | Version [ĐO] | Lifecycle [KHAI] | Method Bridge [ĐO] | File test [ĐO] | Kiểm chứng cuối (ngày @ commit 7 ký tự, cách kiểm) [KHAI + bằng chứng] | Code đã commit đổi sau kiểm chứng? [ĐO] | Việc đang mở | Đọc sâu (link STATUS) |
|---|---:|---|---:|---:|---|---|---|---|
| ark-repo-harness | 1.3.0 | active | 0 | 10 | 2026-09-05 @ `b4a08b2` — npm test 143/143 xanh · repo dựng mới từ bản 1.3.0 chạy được cả hai lệnh điều phối ngay, 65 phép xanh, cả hai dạng xuống dòng ([bằng chứng](HANDOFF.md)) | CÓ (7 commit) | Bản 1.3.0: repo dựng mới nhận luôn hai lệnh của vai điều phối, sổ tay và 52 phép ghim — chạy được ngay, không phải sửa gì | [STATUS](STATUS.md) |

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
