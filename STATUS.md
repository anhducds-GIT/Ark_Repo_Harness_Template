---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: active
last_verified: 2026-09-05
last_verified_commit: b4a08b262cc64e2cc16a85d5629a0e6e10f07ae2
last_verified_how: "npm test 145/145 xanh · bản trích nay mang .gitattributes đi theo (28 file) · audit độc lập Codex 05/09 ra 14 phát hiện, đã kiểm chứng lại từng cái"
evidence_ref: HANDOFF.md
owner: harness-vong2
priority_rank: 1
next_step: "KHUNG-13 trong BACKLOG.md — bản trích phát đi luật bắt dùng BACKLOG.md và decisions.md mà không mang theo file nào trong hai, nên mọi repo dựng từ khuôn sinh ra đã mang sẵn bệnh repo nhà vừa vá cùng ngày. Đây là lần thứ TƯ cùng hình dạng lỗi, và lần này nó nhân bản sang mọi repo đích. Đã đo: không buộc cắt bản mới."
version_source: package.json
current_focus: "Bản 1.3.1 · migrate nay là BA việc trong một (migrate + audit + bring AI assistant onboard), Đức chốt 05/09 — xong không còn nghĩa là cổng xanh"
human_action: "CÓ — KHUNG-11: bớt cái gì trong 998 dòng tài liệu vượt ngân sách. Mọi việc còn lại đều THÊM chữ, nên chốt càng muộn càng vượt xa. Xem BACKLOG.md."
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

**Việc kế:** đọc `next_step` ở đầu file này. Lộ trình cũ tới v1.0 — [ROADMAP-V1.md](docs/ROADMAP-V1.md) — **đã xong**, giữ lại làm lịch sử.
