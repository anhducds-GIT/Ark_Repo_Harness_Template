---
status: Accepted
adr: 0003
date: 2026-09-04
deciders: Đức (chốt 04/09 — "làm tiếp P4 đi", sau khi audit độc lập đồng ý đóng gói)
---

# ADR-0003 — Đóng băng một mốc Stable Baseline, và chuyển sang chế độ bảo trì

## Bối cảnh

Ngày 03–04/09 bộ khung đi từ `1.0.0` tới `1.2.17` trong khoảng một ngày rưỡi. Mỗi bản là một
vòng: audit độc lập chỉ một chỗ → dựng lại ca hỏng → vá → đột biến ngược → đẩy → phát sang hai
repo đích. Vòng nào cũng tìm ra thứ thật, nên vòng nào cũng đáng.

Nhưng nhịp đó có một cái giá không hiện trên bảng: **không có mốc nào để trỏ tới.** Một repo thứ
ba muốn lắp bộ khung sẽ hỏi "lấy bản nào", và câu trả lời "bản mới nhất" là câu trả lời của một
thứ đang chạy, không phải của một thứ dùng được. Auditor vòng một đã trả `REJECT — STALE_EVIDENCE`
đúng vì lý do họ hàng: **HEAD đổi ba lần trong lúc họ đang chạy.**

Và ngay trước quyết định này, một mâu thuẫn sống nhiều ngày mới bị bắt: `STATUS.md` vẫn ghi
*"chưa từng chạy trên repo thật khác nghề · nhãn `unproven` vẫn đúng"* trong khi bộ khung đã chạy
thật ở hai repo và đã gỡ nhãn đó từ `1.0.0`. Bảng đọc frontmatter, người đọc thân bài — nên hai
bên nói ngược nhau mà không ai thấy. **Một trạng thái tự mâu thuẫn thì không đóng băng được:
đóng băng nó chỉ là đóng băng lời nói dối.**

## Quyết định

**`v1.2.17` là mốc Stable Baseline.** Từ mốc này, bộ khung chuyển sang **chế độ bảo trì**.

Chế độ bảo trì nghĩa là ba điều, và chỉ ba điều:

1. **Vá thì vẫn vá** — lỗi thật, có ca hỏng dựng được, thì sửa và tăng số bản như cũ. Không có
   chuyện "đóng băng rồi nên để đó".
2. **Không mở thêm hệ thống con mới** nếu chưa có một lỗi thật đòi nó. Mười bảy bản vừa rồi đều
   sinh ra từ một phát hiện cụ thể; đó là ngưỡng, không phải sự tình cờ.
3. **Repo thứ ba trở đi lắp từ mốc này**, không lắp từ HEAD đang chạy.

## Mốc này đứng được vì đâu — số đo, không phải lời khen

| Đo cái gì | Số |
|---|---|
| Bộ phép kiểm | **86** phép kiểm, 9 file |
| Bản đã phát, mỗi bản một dấu vân tay bất biến | **14** dòng trong `RELEASE-LEDGER.json` |
| Repo thật đã lắp và đang nhận bản vá bằng lệnh | **2** (`nav_platform_main` · `Project 3 AI Agent Unify`) |
| Hồ sơ migrate, kèm chỗ vấp thật | **2** file trong `docs/migrations/` |
| Cổng kiểm cấu trúc | **0 đỏ** (3 vàng: B6, B9) |
| CI trên GitHub | xanh |

Và một số đo quan trọng hơn cả sáu dòng trên: **sáu phép kiểm từng chưa-từng-đỏ nay đều có ca
hỏng dựng sẵn** (`tests/cong-do-that.mjs`). Trước đó không ai biết chúng có chặn được gì không —
một phép kiểm chưa từng đỏ và một phép kiểm *không thể* đỏ trông giống hệt nhau trên bảng.

## Hệ quả

- **Điều gì KHÔNG đổi:** luật vẫn là luật. Cổng vẫn phải xanh mới được báo xong; `safe-push` vẫn
  là đường đẩy duy nhất; ba việc phải hỏi Đức vẫn phải hỏi.
- **Điều gì đổi:** ngưỡng để mở một hệ thống con mới cao hơn. Trước đây "thấy thiếu thì thêm";
  từ nay là "có lỗi thật, dựng được ca hỏng, thì thêm".
- **Điều gì vẫn hở, và cố ý ghi ra:** CI **báo** chứ chưa **chặn** — gói GitHub hiện tại (free +
  repo private) không cho bật required status check hay secret scanning. Ba đường ra đã trình
  Đức (nâng Pro · để public · chấp nhận), chưa chốt. Đây là chỗ hở duy nhất còn lại mà bộ khung
  không tự đóng được bằng code.

## Vì sao không chọn cách khác

- **Không đóng băng, cứ chạy tiếp:** đó là trạng thái hôm nay, và nó đã trả giá một lần bằng
  `STALE_EVIDENCE`. Không có mốc thì mọi câu "bản nào" đều phải trả lời bằng một SHA gõ tay, và
  SHA gõ tay là thứ hết hạn ngay khi gõ xong.
- **Đóng băng bằng một nhánh `stable`:** thêm một thứ phải đồng bộ, mà `RELEASE-LEDGER.json` đã
  làm đúng việc đó rồi — mỗi số bản trỏ tới đúng một nội dung, và máy cưỡng chế điều đó.
- **Đóng băng sớm hơn (ví dụ 1.2.8):** lúc đó `safe-push` còn chưa biết nhánh, cổng còn nổ trên
  nhánh tính năng, và sáu phép kiểm còn chưa ai chứng minh. Đóng băng một bộ khung chỉ chạy được
  ở repo có đúng một hình dạng thì cái mốc đó vô dụng với repo thứ ba.
