---
schema: extension-status/v2
id: ark-repo-harness
name: Ark Repo Harness
lifecycle: active
last_verified: 2026-09-05
last_verified_commit: b4a08b262cc64e2cc16a85d5629a0e6e10f07ae2
last_verified_how: "npm test 143/143 xanh · repo dựng mới từ bản 1.3.0 chạy được cả hai lệnh điều phối ngay, 65 phép xanh, cả hai dạng xuống dòng"
evidence_ref: HANDOFF.md
owner: harness-vong2
priority_rank: 1
next_step: "Ghi lại ở repo đã sinh ra gói điều phối rằng bộ khung nay là nơi phát hành nó — cần quyền bên đó, một lượt riêng"
version_source: package.json
current_focus: "Bản 1.3.0: repo dựng mới nhận luôn hai lệnh của vai điều phối, sổ tay và 52 phép ghim — chạy được ngay, không phải sửa gì"
human_action: "Không có việc nào cần bạn"
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

**Bản 1.3.0 (05/09):** bộ khung nay **phát hành gói điều phối** — hai lệnh (kiểm trạng thái
trước khi báo cáo, và bản đồ việc), sổ tay vai điều phối, và 52 phép ghim đi kèm. Repo dựng mới
chạy được cả hai **ngay, không sửa gì**. Vì sao mở ngoại lệ giữa chế độ bảo trì:
[ADR-0005](docs/adr/0005-goi-assistant-phat-hanh-tu-bo-khung.md).

**Việc kế:** đọc `next_step` ở đầu file này. Lộ trình cũ tới v1.0 — [ROADMAP-V1.md](docs/ROADMAP-V1.md) — **đã xong**, giữ lại làm lịch sử.
