---
status: Accepted
adr: 0019
chu_de: ghi-quyet-dinh
sua: 0018
date: 2026-09-10
deciders: AI (Đức uỷ quyền)
---

# ADR-0019 — Sửa SÁU chỗ của ADR-0018, phát hiện lúc THI HÀNH

**Sửa [ADR-0018](0018-ra-lai-111-muc-luat.md).** ADR-0018 là *quyết định*; file này là những gì
lượt **thi hành** dạy lại, và cả sáu chỗ chỉ lộ ra khi thật sự viết lại `AGENTS.md`. Giữ đúng nếp
[ADR-0009](0009-sua-ba-khang-dinh-cua-adr-0008.md) đã lập: quyết định sai thì ghi mục mới, không
sửa mục cũ.

## ⑴ BẢY mục `HẠ THÀNH HƯỚNG DẪN` không có nhà Tầng 2 nào — hạ chúng là XOÁ

Đo bằng `grep` trên `docs/SO-TAY-AGENT.md` · `docs/HUONG-DAN.md` · `docs/protocols/MULTIFLOW.md` ·
`docs/BAN-DO-CHI-TIET.md`: bảy mục **không** có nội dung ở bất cứ nhà nào — `R-015` (`--chi` khi
đang sửa) · `R-016` (đủ bộ một lần ở cuối) · `R-017` (bộ sinh chạy một lần) · `R-028` (chỉ đọc thì
không cần khoá) · `R-037` (cổng đỏ là lưới đỡ) · `R-081` (hợp đồng `đóng khi:` giữa hai vai) ·
`R-096` (cân nhắc thêm một phép kiểm).

**Sửa:** sáu mục đầu **không phải luật độc lập** — chúng là mệnh đề của một luật đang được GIỮ
cùng chủ đề, nên chúng thành `GỘP`, nằm trong câu của luật kia. `R-096` thành `BỎ`: nó khuyên
*"cân nhắc thêm một phép kiểm"* trong khi `R3` đang **đóng băng** việc thêm phép kiểm — một luật
tự mâu thuẫn với chính sách hiện hành thì không phải luật.

| Số phận | ADR-0018 | **Nay** |
|---|---:|---:|
| `GIỮ` | 43 | **43** |
| `GỘP` | 31 | **37** |
| `HẠ THÀNH HƯỚNG DẪN` | 21 | **14** |
| `CHUYỂN SANG MÁY` | 15 | **15** |
| `BỎ` | 1 | **2** |

## ⑵ KHÔNG đánh số lại các mục — giữ 0 · 1 · 2 · 3 · 6 · 8, có chỗ trống

Ý định ban đầu là 9 mục → 6 mục đánh số 1–6. Đo trước khi làm: **~250 chỗ** trong mã và tài liệu
trỏ vào các mục **theo SỐ** (`grep -c "mục [0-9]"`). Đánh số lại là tạo hàng trăm con trỏ chết —
đúng thứ mục 8 gọi là *hai câu trả lời cho một câu hỏi*.

**Giữ số, gộp nội dung:** mục 4 → 2 · mục 5 → 3 · mục 7 → 0. Chỉ **17** chỗ phải sửa, và đã sửa
hết (`scripts/` ×7 · `tests/` ×1 · `docs/` ×2 · `BACKLOG.md` ×5, cùng hai chỗ trong văn bản mà
bản trích PHÁT ĐI). Lịch sử — `CHANGELOG` · `HANDOFF` · `docs/adr/` · `archive/` · `migrations/` —
**cố ý không sửa**: nó nói về bộ luật lúc đó, và nói đúng.

## ⑶ Một phép dò MẤT MỤC TIÊU mà không ai đỏ — ca thật của `CÓ MẶT ≠ ĐANG BẬT`

`F4.7` đo tầng luật ở repo đích bằng **ba chuỗi**: `① Giữ lõi` · `② Phát & thu` ·
`tự ký nghiệm thu`. Lượt gộp bỏ bảng vai (nơi duy nhất chứa chuỗi thứ ba), nên phép dò khớp **0
mục** — và `5e` **vẫn xanh**, vì mục 3 lúc đó còn một lời miễn.

Đây đúng là bệnh cả ngày hôm nay: **máy còn nguyên, mục tiêu của nó biến mất, và biểu hiện giống
hệt lúc đang chạy.** Sửa: trả lại chuỗi `tự ký nghiệm thu` vào mục 3 dưới dạng một mệnh lệnh thật
(*Vai ① KHÔNG tự ký nghiệm thu việc của mình*), rồi ghim bằng đột biến — bỏ chuỗi đó ra thì
`features-smoke` **ĐỎ**; làm tương tự với `BẢN DUY NHẤT` của `F5.1` cũng **ĐỎ**.

## ⑷ Phép so CÂU: đúng MỘT câu rời Tầng 1, và máy đang tự nói nó

So từng câu bản cũ với bản mới (77 câu → 69 câu, đối chiếu theo từ vựng): chỉ **một** câu không
còn dấu vết — *"Khoá file không mang trách nhiệm truy nguồn — nhãn `Lane:` mang."* Nó là `R-038`,
đã chuyển sang máy. Và máy **in ra nguyên văn câu đó**: `scripts/session-check.mjs:382`, trong
thông điệp `KHOA_FILE_CON_TREO`. Đúng tiêu chí ADR-0016 — máy tự chặn và tự giải thích.

So với lượt nén 09/09 (**rụng 4 mệnh lệnh phụ**, ADR-0016 ghi lại): lần này 1, và nó không rụng.

## ⑸ AUDIT ĐỘC LẬP CHƯA CHẠY ĐƯỢC — Codex CLI hỏng sandbox trên máy này

Đức chỉ định: *"cần audit độc lập bạn gọi Codex CLI"*. Đã gọi `codex exec` (bản `0.153.4`) và nó
**không đọc được file nào** — mọi lệnh chết ở cùng một chỗ:

```text
Failed to create unified exec process:
helper_unknown_error: apply deny-read ACLs
```

Thử ba cấu hình, hỏng cả ba: `-s workspace-write` · `-s read-only` ·
`-s read-only -c 'sandbox_permissions=["disk-full-read-access"]'`; và hỏng ở cả bản copy trong
thư mục tạm lẫn repo thật. Codex **tự báo đúng**: *"chưa thể audit, không có kết luận"* — nó không
đoán, đó là hành vi đúng của một auditor.

**Hệ quả, và nó là hệ quả CỐ Ý:** lượt này commit kèm nhãn `Audit: chua-co`, nên `safe-push`
**TỪ CHỐI đẩy**. Máy đang làm đúng việc: `AGENTS.md` mục 2 đòi *"code thì đã qua audit độc lập"*,
và điều kiện đó **chưa** đủ. Không dùng `--dangerously-bypass-approvals-and-sandbox` để đi tiếp:
nó chạy một agent bên thứ ba **không sandbox** trên máy của chủ repo, và đó là một phơi nhiễm mà
người sở hữu máy phải tự chọn — không phải đánh đổi của AI.

## ⑹ Số đo — và chỗ KHÔNG đạt

| | Trước | Sau | Vạch `R0` |
|---|---:|---:|---|
| Mục trong `AGENTS.md` | 9 | **6** | ≤ 6 · **ĐẠT** |
| Mục luật (bản rà) | 111 | **43** ở Tầng 1 | — |
| Câu trong hiến pháp | 77 | **69** | — |
| Token nạp mỗi phiên | 4.196 | **4.099** | hạ trần 3.000 · **KHÔNG ĐẠT** |
| Mục luật còn phần không máy canh | 8/9 *(đo sai)* | **6/6** | 0 · không đạt được bằng đếm |

**GỌN CHỈ 2%, và nói thẳng lý do:** bộ luật đã được ADR-0016 nén một lượt rồi, nên 68 mục bị cắt
phần lớn là **mệnh đề trong câu**, không phải dòng. Đồng thời lượt này **THÊM** khoảng 200 token
nói thẳng những chỗ máy KHÔNG canh (`git push` trần · `--carry` gõ tay · khoá vùng treo · cả năm
luật vàng · phụ lục ANNEX). Đó là đánh đổi cố ý: **trung thực về chỗ hở đắt hơn gọn**, vì một
hiến pháp gọn mà nói mình được canh kín là thứ đã dẫn tới 9 lỗi lõi hôm nay.

Vạch `hạ trần 3.000` **không đạt và không nên đạt bằng cách xoá những câu đó**. Nếu Đức muốn
xuống 3.000 thì đường đi là cắt tiếp **luật**, không phải cắt **lời thú nhận**.

## Cái MẤT — thêm vào danh sách của ADR-0018

⑺ **Sáu mệnh đề nay nằm chung câu với luật cha.** Ai muốn sửa riêng một mệnh đề sẽ phải sửa cả
câu, và một lượt nén sau này dễ làm rụng chúng — đúng cái đã xảy ra với `tự ký nghiệm thu` ở ⑶.
Giảm nhẹ: `F4.7`/`F5.1` nay có đột biến ghim, nên chuỗi mất là ĐỎ.

⑻ **Số mục không liền nhau.** Người mới đọc sẽ hỏi *"mục 4 đâu"*. Trả giá bằng một dòng ở đầu
`AGENTS.md` nói rõ chỗ trống là cố ý và nội dung đi đâu.
