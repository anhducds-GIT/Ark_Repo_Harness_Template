---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: active
last_verified: 2026-09-06
last_verified_commit: baebd07fafa3a5e1435977894372a2ba76a76599
last_verified_how: "npm test 145/145 xanh · cổng đóng phiên XANH TOÀN BỘ 11/11 · bản 1.3.1 đã phát, dấu vân tay 5b2b74c0eee8e3b6 trong sổ phát hành · audit độc lập Codex 05/09 ra 14 phát hiện, đã kiểm chứng lại từng cái"
evidence_ref: HANDOFF.md
owner: claude-bang9tab
priority_rank: 1
next_step: "Gọt bộ khung theo bài học của repo tiêu thụ: bảy giới hạn Đức chốt 07/09, quan trọng nhất là NGÂN SÁCH DÒNG cho file luật và luật DỪNG khi hết việc sản phẩm. Xem BACKLOG.md nhóm P0."
version_source: package.json
current_focus: "Bảng gom 10 tab thành BỐN nhóm, mỗi khái niệm một chỗ canonical — xem ADR-0006. Đây là lượt CẮT: thước đo của lượt là số dòng luật GIẢM, không phải số tính năng tăng."
human_action: "CÓ — bảng tự đếm, xem nhóm \"Công việc\". Trường này CỐ Ý không giữ danh sách và không giữ con số: máy đếm được thì máy đếm, còn một bản gõ tay là nguồn sự thật thứ hai, và ngày 07/09 nó đã lệch thật — nó nói bốn mục trong khi máy đếm mười ba, và hai trong bốn mục nó nêu đã đóng. Xem ADR-0006."
ref_readme: README.md
ref_handoff: HANDOFF.md
---

# Trạng thái — Ark Repo Harness

> **File KHAI BẰNG TAY.** Bảng đọc phần đầu file này. Đừng gõ số nào mà máy đo được.

Đây là **nhà riêng của bộ khung**. Nó tự dựng bằng chính bộ khung của mình, và tự sinh lại được
bản trích trong `template/`.

**Đang ở đâu:** đã chạy thật trên **hai repo khác nghề** — `nav_platform_main` (Node, chứng
khoán) và `Project 3 AI Agent Unify` (Python). Cả hai đang ghim cùng một bản khung và nhận bản vá
bằng lệnh, không chép tay. Nhãn `unproven` **đã gỡ từ v1.0.0**; câu cũ ở đây nói ngược lại và đã
sai suốt từ đó — chính nó là thứ khiến bảng và thân bài mâu thuẫn nhau.

**Mốc Stable Baseline:** `v1.2.17` — xem [ADR-0003](docs/adr/0003-dong-bang-stable-baseline.md).
Repo thứ ba trở đi lắp từ mốc này, không lắp từ HEAD đang chạy. Lấy về bằng:

```bash
git clone --branch v1.2.17 https://github.com/anhducds-GIT/Ark_Repo_Harness_Template.git
```

**Đừng thêm `--depth 1`.** Sổ phát hành đối chiếu với lịch sử git, mà clone nông thì lịch sử bị
cắt — bộ khung sẽ **từ chối phát** (`NHAN_CHUNG_HONG`). Đã thử thật 04/09, và nó từ chối đúng.
Clone xong bạn đứng ở `detached HEAD`; không sao, vì từ bản sao này bạn chỉ **phát đi**, không
đẩy lên.

**Bản 1.3.1 (05/09):** cổng đóng phiên **hết mục đỏ vĩnh viễn**. Bộ đếm "code đã đổi sau lần
kiểm chứng" từng đếm luôn hai trang HTML do chính bộ sinh viết ra, nên artifact vừa commit là
lập tức cũ — không thứ tự commit nào hội tụ. Nay repo tự khai `generated_files` trong
`.repo-structure.json`. Chi tiết và bài học ở [CHANGELOG](CHANGELOG.md).

**Bản 1.3.0 (05/09):** bộ khung nay **phát hành gói điều phối** — hai lệnh (kiểm trạng thái
trước khi báo cáo, và bản đồ việc), sổ tay vai điều phối, và 52 phép ghim đi kèm. Repo dựng mới
chạy được cả hai **ngay, không sửa gì**. Vì sao mở ngoại lệ giữa chế độ bảo trì:
[ADR-0005](docs/adr/0005-goi-assistant-phat-hanh-tu-bo-khung.md).

**Bản trích nay mang `.gitattributes`** (05/09) — repo mới dựng từ khuôn không còn dính bệnh
kiểu xuống dòng. Việc này từng là `next_step`; đã xong, không phải việc kế nữa.

**Repo nay có `BACKLOG.md`** — trước đó luật bắt ghi nợ vào một file không tồn tại, nên bản đồ
việc báo "0 việc mở" suốt. Nay 6 mục nợ có thật, xem [BACKLOG.md](BACKLOG.md).

**Việc kế:** đọc `next_step` ở đầu file này. Lộ trình cũ tới v1.0 — [ROADMAP-V1.md](docs/archive/ROADMAP-V1.md) — **đã xong**, giữ lại làm lịch sử.
