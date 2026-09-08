---
status: Accepted
adr: 0011
chu_de: tran-ngan-sach
thuoc: 0010
date: 2026-09-08
deciders: Đức — "Bạn hay quy về các roadmap & big task ấy nhé", rồi "Tôi Ok" cho kế hoạch bốn bước
---

# ADR-0011 — Cắm răng cho kho chữ: xoay nhật ký theo tháng, và thước cóc cho `docs/`

## Bối cảnh

Roadmap 08/09 xếp *"dọn kho chữ"* là một trong bốn việc lớn. Đo lại chiều 08/09:

| Kho chữ | Nay | Trần đã viết ra | Có máy canh? |
|---|---|---|---|
| `docs/` bộ khung | 6.654 dòng (ADR 910 · tuỳ ý 5.744) | 2.200 | **không** |
| `HANDOFF.md` bộ khung | 1.537 dòng | 600 | **không** |

Con số đáng lo không phải độ vượt, mà là **chiều**: `docs/` tăng **5.915 → 6.654 trong một ngày**,
và phần tăng phần lớn là chữ do chính phiên AI viết ra. Luật chốt 07/09 nói *"xoá là thắng, thêm
là thua"*, mà không con số nào canh — nên nó phình trong im lặng cho tới lúc có người đo tay.

Đây là **cùng một bệnh** với hai trần sổ nợ vừa vá sáng nay (ADR-0010): luật đã chốt, không có
máy cưỡng chế. Đếm được năm chỗ; sáng nay đóng hai, ADR này đóng thêm hai.

Cơ chế xoay nhật ký theo tháng **đã tồn tại** — nhưng ở repo tiêu thụ
`Chrome_Extension_AI_Agentic` (ADR-0011 của repo đó, Đức chốt 06/09), tức ở **người dùng** chứ
không ở **nơi phát hành**. Bộ khung không có `handoff.mjs`, không có `handoffCapFrom`, không khai
trần nào.

## Quyết định

**⑴ Mang cơ chế nhật ký LÊN nơi phát hành.** `scripts/handoff.mjs` + `tests/handoff-smoke.mjs` +
`handoffCapFrom` nay ở bộ khung và đi vào bản trích, nên **mọi repo** nhận được. Khai
`handoff.tran_byte_moi_muc: 2600` — **giữ nguyên con số của repo tiêu thụ**, để một con số chỉ có
một nghĩa ở mọi repo. Cổng đóng phiên có phép kiểm *"HANDOFF: mục mới trong trần, file đúng
tháng"*, chỉ chặn **mục vừa thêm trong phiên này**.

**⑵ `docs/` canh bằng THƯỚC CÓC, không bằng trần lý tưởng.** Khai
`docs.tran_dong_khong_ke_adr` ở **đúng con số hôm nay** (5.744). Cổng đỏ khi **vượt**, không đòi
ai dọn. Mỗi lượt xoá thì hạ con số xuống, và chỗ đã hạ không quay lại được.

**⑶ Thước cóc TRỪ `docs/adr/`.** ADR đã `Accepted` là bất biến (ADR-0000), nên thư mục đó chỉ có
thể to lên.

**⑷ Bản đồ việc đọc cờ đóng băng.** `what-next.mjs` nay nhận `frozen` và loại gói đóng băng khỏi
mục *"chạy song song được ngay"*, đưa sang mục riêng **B2 · ĐÃ ĐÓNG BĂNG**.

## Hệ quả

**Được:** `HANDOFF.md` tự co ở mỗi mốc sang tháng, không cần ai nhớ. `docs/` không phình thêm
được trong im lặng. Bản đồ việc thôi mời AI vào gói chủ dự án đã dừng. Bốn phép ghim mới:
`handoff-smoke` (10 khối) · `cong-do-that` khối 11 (phình ĐỎ · xoá XANH lại · **ADR không tính** ·
không khai thước XANH) · `assistant-smoke` ca đóng băng (ra khỏi mục A · vào mục riêng · **không
biến mất** · không kéo theo gói cùng tiền tố).

**Mất — nói thẳng:**

- **Lượt xoay đầu tiên KHÔNG giảm dòng nào.** Công cụ cố ý từ chối xoay ở lượt đầu: nó chỉ đóng
  dấu tháng, vì xoay theo một tháng **đoán ra từ ngày trong tiêu đề** là câu máy không xác định
  được (các mục Log không xếp theo thứ tự thời gian). `HANDOFF.md` đứng nguyên 1.537 dòng tới mốc
  sang tháng. Roadmap trước đó viết *"1.537 → dưới trần ngay"* — **sai**, đã sửa.
- **Thước cóc không phải trần.** Nó chặn phình, **không** đưa `docs/` về 2.200. Việc đó cần xoá
  thật, và xoá file phải hỏi chủ dự án — nằm ngoài ADR này.
- **Ai cũng nâng được con số.** Thước cóc chỉ đắt bằng một dòng sửa cấu hình. Răng của nó là
  **nhìn thấy được**, không phải không vượt qua được. Nâng mà không nói lý do trong nhật ký thì
  phiên sau không có cách nào biết.
- **Cổng nay phụ thuộc thêm `handoff.mjs`,** nên bảy kho thử phải chép thêm file đó. Đã vá hết và
  ghi chú ngay trên phép kiểm. Đây là lần **thứ ba** trong một ngày cùng một cái bẫy — mỗi lần cổng
  nhận một phụ thuộc mới, mọi kho thử dựng sẵn phải biết.

## Trạng thái

Accepted
