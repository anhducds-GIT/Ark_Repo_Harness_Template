---
kind: guide
status: active
ttl_days: 120
---

# ROADMAP — đường ĐÓNG GÓI, bản 11/09

> **File này TỰ CHỨA.** Phiên sau đọc đúng nó là đi được, không cần lịch sử chat.
> Lớp ĐIỀU PHỐI: còn gì phải làm · chỗ nào cần Đức. Nội dung ở [BACKLOG](../BACKLOG.md) ·
> [IDEAS](../IDEAS.md). Bản trước: [V1](archive/ROADMAP-V1.md).

## Đang đứng ở đâu — số đo, không phải cảm tính

| | |
|---|---|
| Repo nhà | bản **1.9.41** · hiến pháp **6 mục** (từ 9) · **43** mục luật Tầng 1 (từ 111) |
| Máy canh được ĐO | **9** đường dẫn · **6/6** mục luật còn phần KHÔNG máy nào canh, đã nói ra |
| Suite · cổng | **24/24 xanh** ≈ **406s** · cổng đóng phiên **12 mục** |
| 5 repo đích | **4 ghim 1.9.41** — 3 ĐÃ ĐẨY · 1 commit-rồi-chưa-đẩy · 1 chưa chạm (`1.9.29`) |
| Ngân sách | nạp **4196/4200** · nợ **30/30** — **sát trần** |

## ĐÓNG GÓI: 4/5 ghim `1.9.41` (3 đã đẩy), hai chỗ còn lại cần ĐỨC

Đ1 · Đ2 · Đ3 của bản trước **đã làm**, 11/09. Bảng kết quả thật: `HANDOFF.md`, mục
*"ĐÓNG GÓI: 3/5 repo đích ĐÃ ĐẨY"*. Lượt nâng còn tìm ra **một cửa CHẾT ở cả 5 repo** —
`safe-push` đọc `audit.nguoi_duyet` từ đĩa mà bản trích chưa từng phát khối đó, nên nhãn `Audit:`
ở repo đích **chỉ có thể làm HẠI**. Vá gốc ở `1.9.40` · `1.9.41` sửa chữ máy in ra ([ADR-0020](adr/0020-cua-audit-o-repo-dich.md)).

**Việc còn lại — cả hai đều là ĐÁNH ĐỔI của Đức, KHÔNG phải việc AI tự quyết:**

| Repo | Đang ở đâu | Đức cần chốt gì |
|---|---|---|
| `ALL_SKILL_MANAGEMENT` | `1.9.41` đã commit tại chỗ, **19 commit chưa đẩy** | Đẩy sẽ cuốn theo **6 commit của `harness-phat-01`** và `b742625` (không nhãn `Lane:`). Duyệt `--carry` (luật ở [AGENTS.md](../AGENTS.md) mục 2), hoặc vá nhãn (= **sửa lịch sử**) |
| `Chrome_Extension_AI_Agentic` | vẫn `1.9.29`, **chưa chạm** | `HANDOFF.md` đang bị lane `harness-loi-01` khoá **>27 giờ**, và lane `claude-gpt-chay-het-job` đang làm việc ở đó. Chỉ ba đường gỡ khoá: lane đó trả · lane đó kết thúc · **Đức chốt** |

Cách chạy lại một lượt nâng, nếu cần: `node scripts/upgrade.mjs --plan "<đường-dẫn>"` rồi `--apply`,
sau đó **tại repo đích** sinh lại artifact + ghi một dòng Log (`upgrade` in ra đúng các bước) —
nhưng **artifact phải sinh SAU commit** vì nó mang dấu ngày của HEAD, nên thực tế là **HAI** commit,
không phải một như `upgrade` đang in.

## BA thứ chặn "5/5 xanh" — HAI trong ba đã GỠ, và lý do cũ ghi SAI

| Repo | Bản trước ROADMAP nói | Đo thật 11/09 |
|---|---|---|
| `Project 3 AI Agent Unify` | chặn bởi `dashboard/dashboard_state.js` của lane khác | **SAI** — `git commit --only <đường dẫn>` không cuốn nó theo. Cổng XANH TOÀN BỘ, đã đẩy 8 commit |
| `ALL_SKILL_MANAGEMENT` | chặn bởi `b742625` không nhãn, cần sửa lịch sử | **THIẾU** — chặn chính là **6 commit của `harness-phat-01`**; nhãn thiếu chỉ làm một mục cổng *KHÔNG KIỂM ĐƯỢC*, không đỏ |
| `Chrome_Extension_AI_Agentic` | 7 mục đỏ, nghi token thật | **KHÁC** — chưa tới được đó: `HANDOFF.md` bị lane khác khoá nên bước ③ không làm được. Nợ token vẫn còn, nhưng nó không phải thứ chặn lượt nâng |

**Đừng "sửa" hai thứ còn lại để cổng xanh.** Cả hai là chỗ luật cố ý bắt người quyết.

## Chờ Đức chốt — không tự làm

- **Đẩy `ALL_SKILL_MANAGEMENT`:** duyệt `--carry` — luật của nó ở [AGENTS.md](../AGENTS.md) mục 2,
  đây chỉ trỏ sang (cuốn theo 6 commit `harness-phat-01`) — hoặc vá
  nhãn `Lane:` cho `b742625` — vá nhãn là **sửa lịch sử**, mục 2 bắt hỏi.
- **Gỡ khoá `HANDOFF.md` ở `Chrome_Extension_AI_Agentic`** (lane `harness-loi-01` giữ >27 giờ) để
  lượt nâng ở đó làm được bước ③.
- Token bị nghi trong `Chrome_Extension_AI_Agentic` (`workers/duc-auto-chatgpt/v0.1.0/tests/`).
- Ngưỡng kho chữ của repo đó: đang **9830/9340**.
- `KHUNG-40` · `KHUNG-37` · `Y-03` · `Y-04` · `Y-07` · `Y-08` — vẫn KHÔNG ĐỘNG.

## Ngân sách: sát trần cả ba, và `R6` KHÔNG lấy lại dư

Kỳ vọng là `R6` bỏ luật sẽ trả lại chỗ. **Đo thật: không.** Hiến pháp còn 6 mục và 43 mục luật,
nhưng token **+0,5%** — vì 68 mục bị cắt phần lớn là *mệnh đề trong câu*, và lượt đó **thêm ~200
token** nói thẳng chỗ máy KHÔNG canh. Đánh đổi cố ý: **trung thực về chỗ hở đắt hơn gọn**.

**Hệ quả cho phiên sau:** muốn thêm bất cứ gì thì phải **BỎ** trước. Muốn nạp xuống 3.000 thì phải
cắt **LUẬT**, không cắt lời thú nhận — và đó là đánh đổi của Đức.

## NẾP BẮT BUỘC — phiên sau không tự biết, và mỗi cái đây đã cắn thật

1. **Sinh bản trích SAU CÙNG.** Sửa tầng máy sau khi `build-template.mjs` chạy là `SO_PHAT_HANH_LECH`.
2. **Không sửa cây làm việc khi `npm test` đang chạy** — dấu vân tay lệch giữa lượt, cả lượt suite bỏ.
3. **Đột biến phải TỚI ĐƯỢC phép kiểm mình đang thử.** Đỏ ở cửa khác **không phải bằng chứng** —
   dấu vân tay luật chung và sổ phát hành chặn trước; phải hoà giải chúng rồi mới đo. Vấp 2 lần.
4. **Gọi Codex CLI qua `stdin`, KHÔNG dùng `-C`:**
   `cd <bản-copy> && cat <đề-bài> | codex exec -s workspace-write -`. Cờ `-C` tạo hai gốc ghi và
   sandbox từ chối. Đề bài **phải mang theo danh sách luật CỐ Ý bỏ**, không thì auditor báo dương
   tính giả.
5. **Một sự thật viết hai chỗ sẽ trôi.** Hằng số dùng chung thì `export` một nhà
   (`MOC_BAN_DO`/`MOC_SAU_BAN_DO`); số đo thì để máy in, đừng gõ vào sổ.
6. **Máy bắt con trỏ ĐỨT, không bắt câu SAI.** Câu sai nặng nhất 10/09 nằm trong **output của
   cổng**, và thứ tìm ra nó là **Đức đọc cái máy in ra**.
