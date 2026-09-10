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
| Repo nhà | bản **1.9.39** · hiến pháp **6 mục** (từ 9) · **43** mục luật Tầng 1 (từ 111) |
| Máy canh được ĐO | **9** đường dẫn · **6/6** mục luật còn phần KHÔNG máy nào canh, đã nói ra |
| Suite · cổng | **24/24 xanh** ≈ **445s** · cổng đóng phiên **12 mục**, 3,0s |
| 5 repo đích | ghim bản **1.9.29** — chậm **10 bản** so với nhà, mỗi repo **7 file** tầng máy đã cũ |
| Ngân sách | nạp **4195/4200** · kho chữ **3103/3117** · nợ **30/30** — **sát trần cả ba** |

## Việc còn lại để ĐÓNG GÓI XONG — ba bước, đúng thứ tự

**Đ1 · Nâng 5 repo đích lên `1.9.39`.** Mỗi repo, chạy TỪ repo nhà:

```bash
node scripts/upgrade.mjs --plan  "<đường-dẫn-repo-đích>"   # xem trước, không ghi gì
node scripts/upgrade.mjs --apply "<đường-dẫn-repo-đích>"
```

Năm đường dẫn: `C:\WORKING ZONE\n8n-orchestrator` · `C:\WORKING ZONE\n8n_Local host` ·
`C:\WORKING ZONE\ALL_SKILL_MANAGEMENT` · `C:\WORKING ZONE\Project 3 AI Agent Unify` ·
`C:\WORKING ZONE\Chrome_Extension_AI_Agentic`.

Rồi **BA BƯỚC TAY ở repo đích** — chính `--apply` in ra tên ba bước, làm đúng chúng, và **gộp cả
ba vào MỘT commit**: ① khai đường dẫn mới vào Bản đồ file của repo đó (đọc `docs.file_map` của
CHÍNH nó, mỗi repo một chỗ khác nhau) · ② sinh lại artifact · ③ ghi một dòng Log vào `HANDOFF.md`.
Sau đó tại repo đích: `npm test` → cổng đóng phiên → `safe-push`.

Đo được 10/09: **7 giây** lệnh + **~3 phút** tay mỗi repo. Đức chốt ba bước này **làm TAY**, không
tự động hoá ([decisions](../decisions.md)).

**Đ2 · Ghi kết quả THẬT.** Một mục `HANDOFF.md` ở repo nhà, bảng từng repo: bản · cổng xanh/đỏ ·
đỏ vì gì. Không làm tròn. Cập nhật hồ sơ tương ứng ở `docs/migrations/`.

**Đ3 · Chốt.** `STATUS.md` → `next_step` nói ĐÓNG GÓI xong; mục "Việc còn lại" của file này gạch bỏ.

## BA thứ chặn "5/5 cổng xanh" — và chúng KHÔNG phải việc của lượt nâng

Đo 10/09 ở bản `1.9.29`: **2/5 xanh toàn bộ**. Ba repo còn lại đỏ vì **nợ sẵn của chính chúng**:

| Repo | Chặn bởi | Ai gỡ được |
|---|---|---|
| `ALL_SKILL_MANAGEMENT` | commit `b742625` (revert 09/09) không nhãn `Lane:` | **Đức** — sửa là **sửa lịch sử**, mục 2 bắt hỏi |
| `Project 3 AI Agent Unify` | `dashboard/dashboard_state.js` đang sửa dở **của lane khác** | lane đó, hoặc Đức chốt — cả hệ khoá tồn tại để ngăn việc commit hộ |
| `Chrome_Extension_AI_Agentic` | 7 mục: **nghi token thật** · dãy B 44 chỗ · kho chữ 9830/9340 · `KHUNG-66` | **Đức** phán token thật/giả; phần còn lại là nợ repo đó |

**Đừng "sửa" ba thứ này để cổng xanh.** Cả ba là chỗ luật cố ý bắt người quyết.

## Chờ Đức chốt — không tự làm

- Sửa lịch sử `ALL_SKILL_MANAGEMENT` để vá nhãn lane cho `b742625`.
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
