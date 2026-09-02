---
kind: roadmap
status: active
ttl_days: 90
---

# Lộ trình tới v1.0

> **v1.0 nghĩa là gì:** harness này dựng được một repo mới, đưa được một repo cũ lên chuẩn, và
> **mọi lớp bảo vệ nó quảng cáo đều đã được chứng minh là chặn thật**. Không phải "chạy được" —
> mà "chặn được khi bị phá".
>
> Nhãn hiện tại `0.2.0`. Nó **chưa** là v1.0, và lý do rất cụ thể: audit độc lập vòng một trả về
> **REJECT** với 6 phát hiện mức NẶNG, trong đó **bốn cái là lớp bảo vệ báo xanh trong khi không
> chặn gì**.

## Vì sao chưa gọi là v1.0

Bốn lỗ dưới đây đều có cùng hình dạng, và đó là hình dạng nguy hiểm nhất trong cả hệ thống này:

> **Gate in ra màu xanh, trong khi thứ nó hứa canh gác đã bị phá.**

Một gate hỏng-ồn-ào thì ai cũng thấy. Một gate **báo xanh sai** thì không ai thấy, và nó còn tệ
hơn không có gate — vì người ta ngừng tự kiểm khi đã có nó.

## Bốn khối, theo đúng thứ tự

### Khối A — Bịt bốn lỗ "xanh mà không chặn" · *chặn v1.0*

| # | Lỗ | Chứng minh nó thật |
|---|---|---|
| A1 | **Bảo vệ evidence chỉ soi cây làm việc, không soi commit** | Sửa rồi commit một file evidence → gate vẫn in `[XANH] Bằng chứng cũ nguyên vẹn`. Mà quy trình lại bắt chạy gate **sau** khi commit — nên đây là đường lọt chính, không phải ca hiếm |
| A2 | **`mutability: "append-only"` trong cấu hình bị bỏ qua** | Code dò tên thư mục bằng regex cứng (`evidence`/`pilot`/`batch`). Khai `records/` là append-only rồi sửa file cũ → gate xanh. Cấu hình nói một đằng, code làm một nẻo |
| A3 | **Phép "file mới đã khai vào bản đồ"** chỉ tìm tên thư mục ở bất kỳ đâu trong luật | Thêm `scripts/cong-cu-la.mjs` mà bản đồ không hề nhắc → vẫn báo "Mọi thứ mới đều đã khai". Đây là **phép kiểm rỗng nghĩa thứ bảy** tìm được trong ba ngày |
| A4 | **`stripNghe` phân biệt "đã chung" với "đổi lời" bằng một danh sách từ hữu hạn** | Thêm một luật nghề dùng từ ngoài danh sách → hàm không ném, và câu luật nghề đó đi thẳng sang mọi repo |

**Luật chung của khối A:** mỗi bản vá phải kèm một fixture **dựng được ca hỏng**, và phải qua
mutation test. Vá mà không dựng nổi ca hỏng thì không biết đã vá gì.

### Khối B — Bịt ba lỗ "công cụ ghi sai chỗ" · *chặn v1.0*

| # | Lỗ | Trạng thái |
|---|---|---|
| B1 | `init-repo --ten "X" <đích>` dựng repo ở thư mục tên `X`, bỏ qua `<đích>` | **ĐÃ VÁ 03/09** + ghim hai thứ tự tham số |
| B2 | Luật bắt dùng `claim.mjs` mà file đó **không tồn tại** trong repo | **ĐÃ VÁ 03/09** — nay đi theo bản trích, và bốn khoá vùng khai đủ |
| B3 | `init-repo` kiểm "thư mục trống" rồi mới ghi — hai pha, có khe đua | Còn mở. Ghi bằng chế độ tạo-độc-quyền, hoặc chấp nhận và ghi rõ giới hạn |

### Khối C — Làm `assess` thôi trả lời dễ chịu · *chặn v1.0*

`assess` là công cụ để **quyết định có bỏ công migrate hay không**. Một bộ đo luôn nói "gần đạt"
thì vô hại về kỹ thuật và tai hại về quyết định.

- **C1** — mọi lỗi đọc khác `ENOENT` đang bị gom thành "thiếu file". `.repo-structure.json` là
  một **thư mục** → chấm mức 3. Phải phân biệt *không có* với *có mà đọc không nổi*.
- **C2** — `scripts/` là junction trỏ ra ngoài repo → vẫn chấm mức 3, chi phí 0/0/0.
- **C3** — target là một **file** thay vì thư mục → trả nguyên stack của Node thay vì `TU_CHOI`.
- **C4** — `grandfathered` khai dạng mảng nhưng bộ đọc tìm `block.paths`. Miễn trừ mục nát bị bỏ
  qua **im lặng**. Schema và reader không khớp nhau.

### Khối D — Chứng minh ở ngoài đời · *điều kiện cuối của v1.0*

Ba khối trên làm harness **đúng**. Khối này làm nó **được chứng minh**.

- **D1** — migrate **một** repo thật, đang sống, khác nghề. Quy trình
  `CHUYEN-REPO-LEN-CHUAN.md` hiện là **giả thuyết**; vài bước sẽ sai, và lần chạy đầu là để tìm
  ra chúng.
- **D2** — sửa quy trình theo đúng chỗ vấp, ngay tại file đó.
- **D3** — audit vòng hai trên **một SHA đóng băng**.
- **D4** — gỡ nhãn `unproven`, đóng v1.0.

## Kỷ luật audit — một bài học từ vòng một

Vòng một trả về `REJECT — STALE_EVIDENCE`, và **một phần lỗi là của tôi**: HEAD đổi **ba lần**
trong lúc auditor đang chạy, rồi một thay đổi chưa commit lọt vào bản trích giữa chừng. Auditor
không nghiệm thu nổi một mục tiêu đang di chuyển.

**Từ vòng hai:** đóng băng một SHA, gửi đúng SHA đó, và **không đụng repo** cho tới khi có báo cáo.

## Cái KHÔNG thuộc v1.0

- Giao diện web, CI tự chạy, phát hành lên registry.
- Migrate hàng loạt. v1.0 chỉ cần chứng minh **một** lần migrate thật.
- Thêm gate mới. Bốn gate hiện có mà chặn thật thì tốt hơn tám gate mà hai cái báo xanh sai.

## Đo bằng gì để biết đã tới v1.0

```bash
npm test                       # mọi phép kiểm xanh, và mỗi lớp bảo vệ có một fixture dựng được ca hỏng
npm run bootstrap              # 0 đỏ
npm run assess -- <repo-thật>  # chạy được trên một repo KHÔNG phải harness
```

Cộng thêm một điều không đo bằng lệnh được: **một repo thật khác nghề đã chạy trên harness này,
và người vận hành nó không phải hỏi lại gì.**
