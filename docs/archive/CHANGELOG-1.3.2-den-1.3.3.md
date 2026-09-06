# CHANGELOG — LƯU TRỮ, bản 1.3.2-den-1.3.3

> **CHỮ GIỮ NGUYÊN, chỉ ĐỔI CHỖ.** Cắt từ `CHANGELOG.md` bằng `npm run don`.
> Sổ phát hành là file CHỈ-THÊM nên phình vô hạn — 326 dòng / ngân sách 300.
> Không dòng nào bị sửa, không dòng nào bị bỏ. Bản mới nhất vẫn ở [CHANGELOG.md](../../CHANGELOG.md).

## 1.3.3 — 2026-09-05 — Ba lỗi mà bảy phiên ở repo nhà không tìm ra, một lượt migrate thật lôi ra hết

Bản này không sửa gì do đọc lại code mà thấy. **Cả ba lỗi đều do lắp bộ khung vào một repo thật
khác nghề** — `n8n-orchestrator`, Control Plane bằng Python + YAML. Repo nhà không dính lỗi nào
trong ba, và đó chính là lý do chúng sống sót qua bảy phiên.

**(A) `units.behaviour_globs` bị validator TỪ CHỐI, trong khi chú thích trong code dạy đúng trường
đó.** Khai vào là lệnh nổ: `CAU_TRUC_HONG: units.behaviour_globs — không phải trường hợp lệ`.
Nhưng `build-dashboard.mjs` viết nguyên văn *"repo tự khai `units.behaviour_globs`"*. Chú thích
dạy một trường, bộ kiểm cấm trường ấy, không ai đối chiếu hai chỗ.
Đo tiếp thì lỗi còn sâu hơn: lớp đó **chưa từng được truyền vào luồng thật** — bộ đếm gọi
`isBehaviourFile` không kèm tham số nào. Tức repo Python bị đo là *"code không đổi"* dù
`tools/*.py` sửa cả ngày, và **không ai biết cột đó đang mù**.
Nay trường hợp lệ, có hàm đọc riêng (`behaviourGlobsFrom`), và **đã nối vào luồng**.

**(B) `claim.mjs` NỔ khi bảng quyền có mục `null`.** Viết `{"_root": null}` — cách viết tự nhiên
cho *"chưa ai giữ"* — làm `--list` ném `TypeError: Cannot read properties of null (reading
'owner')`, rơi stack trace vào mặt người dùng. Nay nói rõ mã lỗi `CLAIMS_MUC_HONG` **kèm khuôn
đúng để sửa**. Không nhận `null` là "trống", cố ý: hai cách biểu diễn cùng một trạng thái làm
phép đối chiếu bảng-trên-máy ↔ bảng-trên-remote có hai kết quả cho cùng một sự thật.

**(C) Cổng đóng cứng vị trí "Bản đồ file" ở `AGENTS.md`.** Repo đích để bản đồ ở
`design_brief.md` mục 8 — hợp lệ theo luật của chính nó, và luật đó **có trước** bộ khung. Cổng
đỏ cho tới khi phải thêm một mục thứ hai vào `AGENTS.md`, nên repo đó nay có **hai** bản đồ ở hai
file: hai nguồn cho một khái niệm, đúng bệnh mà cả bộ khung sinh ra để chữa — và lần này **bộ
khung là thủ phạm**. Nay repo khai `docs.file_map` trong `.repo-structure.json`; không khai thì
vẫn là `AGENTS.md`, repo cũ không phải đổi gì.

**Đột biến kiểm — và một ca KHÔNG đỏ, ghi lại thay vì giấu.** Ba đột biến: bỏ `behaviour_globs`
khỏi danh sách trường hợp lệ → đỏ · bỏ hàng kiểm mục bảng quyền → đỏ · **gỡ dòng truyền opts
trong `collectModel` → VẪN XANH**. Ca thứ ba lộ ra rằng phép ghim mới chỉ canh được *hàm dựng
opts*, không canh được *bộ sinh có gọi hàm đó không* — đúng hình dạng lỗi vừa vá. Đã ghi thành
mục nợ riêng và **nói thẳng giới hạn ngay trong chú thích của phép kiểm**, để người sau không
tưởng nó đã phủ.

`1.3.2` → `1.3.3`. Bốn mục nợ đóng: lớp nghề chưa nối · cổng đóng cứng bản đồ · trường bị từ
chối · bảng quyền nổ vì `null`.

## 1.3.2 — 2026-09-05 — Bảng việc thôi nói "không có gì phải quyết" khi thực ra có

**Ca hỏng đo được:** `npm run what-next` in ra `C · ĐANG CHỜ NGƯỜI CHỐT — 0 mục, không ai làm
thay được`, trong khi sổ nợ đang có **hai** mục cần người chốt. Người chốt đọc bảng rồi tin mình
không phải quyết gì.

**Nguyên nhân:** mục C chỉ đọc **sổ ý tưởng** (`IDEAS.md`). Repo không có sổ đó thì mục C luôn
rỗng. Nặng hơn một mục hiển thị thiếu, vì dòng in ra **khẳng định đã kiểm và không có gì** — mà
chính công cụ này ở chỗ khác phân biệt rất kỹ giữa *"0 vì đã kiểm"* và *"KHÔNG LỌC ĐƯỢC"*.

**Vá hai vế:**
- Mục C nay đọc **cả sổ nợ**, và khi một nguồn không lọc được thì **không in con số tổng** — con
  số tổng hàm ý "đã kiểm hết", ở đó mới kiểm được một nửa. In số kèm cảnh báo vẫn khiến người
  đọc nhớ con số.
- Nhận diện bằng **cờ khai tường minh** `> **CHỜ NGƯỜI CHỐT:** …` trong thân mục, **không dò tên
  người chốt trong văn xuôi** như bản cũ. Dò chữ là phép đo bằng chuỗi: đổi cách xưng hô một chữ
  là mục biến mất khỏi bảng, và không ai biết.

**Đột biến kiểm — hai chiều, cả hai đỏ đúng chỗ:** bỏ hàng dò cờ → mục khai tường minh không còn
được nhận; nới cờ thành dò văn xuôi → mục chỉ có văn xuôi bị nhận nhầm. Vế đối chứng là phần
khiến phép ghim này không thể xanh giả.

**Bản trích cũng nhận:** hạt giống sổ nợ nay **dạy luôn quy ước cờ**, nên repo dựng từ khuôn
không phải phát minh lại. `1.3.1` → `1.3.2`, dấu vân tay `f2344159c4e3c28e`.

---

**Bản cũ hơn đã dời sang** [docs/archive/CHANGELOG-1.3.1.md](docs/archive/CHANGELOG-1.3.1.md) — chữ giữ nguyên từng dòng.
