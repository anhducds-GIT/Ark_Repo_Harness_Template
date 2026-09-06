---
kind: guide
status: active
ttl_days: 365
---

# MULTIFLOW — nhiều phiên AI cùng làm trên một repo

> **Đọc file này khi:** bạn sắp làm việc trong repo này cùng lúc với AI khác, hoặc bạn sắp
> **sửa** một trong bốn cơ chế bên dưới.
>
> Luật ngắn nằm ở `AGENTS.md`. File này giải thích **vì sao** luật đó có hình dạng như vậy, và
> **phải làm gì khi muốn đổi nó** — phần thứ hai mới là phần khó.
>
> Viết cho hai loại người đọc: chủ dự án (không code) đọc mục 1–3; AI sắp sửa cơ chế đọc hết.

**Một luật về chính file này:** nó **không chứa số đo, không chứa danh sách chốt hiện có, không
chứa bảng mã lỗi.** Ba thứ đó mục nhanh hơn bất kỳ ai kịp cập nhật, và một tài liệu nói sai về
lớp bảo vệ còn tệ hơn không có tài liệu — vì có người sẽ tin nó. Muốn biết repo NÀY đang cắm
những chốt nào thì **chạy cổng và đọc nó nói gì**; mọi thông báo của cổng đều kèm cách sửa.

## 1. Vấn đề, nói bằng tiếng người

Nhiều phiên AI cùng mở trên **một thư mục**, **một nhánh git**. Không phải mỗi phiên một bản sao
— cùng một chỗ. Nên ba chuyện xảy ra mà không ai thấy:

1. **Hai phiên sửa cùng một file.** Người lưu sau ghi đè người lưu trước, người trước không biết.
2. **Một phiên đẩy lên remote thì cuốn theo việc của mọi phiên khác.** Git đẩy cả nhánh, không
   đẩy riêng phần của bạn.
3. **Một phiên lưu file dở làm test của phiên khác đỏ**, và phiên kia bị chặn không đóng được
   việc — dù họ không làm gì sai.

Cả ba đã xảy ra thật ở repo đầu tiên dùng bộ khung này. Cơ chế dưới đây là chốt cho ba chuyện đó.

## 2. Bốn cơ chế, mỗi cái trả lời một câu

| Cơ chế | Trả lời câu | Sống ở đâu |
|---|---|---|
| **Bảng chủ sở hữu** | *ai được sửa vùng nào?* | `.agents/claims.json` + `scripts/claim.mjs` |
| **Nhãn `Lane:` trên commit** | *commit này của ai?* | dòng cuối thông điệp commit |
| **Cổng đóng phiên** | *việc của tôi xong thật chưa?* | `scripts/session-check.mjs` |
| **Cổng xuất bản** | *thứ tôi sắp đẩy có sạch không?* | `scripts/safe-push.mjs` |

Hai cái đầu là **dữ liệu**. Hai cái sau là **người canh cửa** đọc dữ liệu đó.

Điều dễ nhầm nhất, và nó là gốc của nhiều lỗi: **bảng chủ sở hữu nói ai được GHI; nhãn `Lane:`
nói việc đó do AI nào LÀM.** Hai câu khác nhau. Quyền đổi chủ được *sau* lúc commit, nên quy
commit theo "ai đang giữ vùng lúc chạy" thì sai **cả hai chiều** — chặn oan việc bạn, hoặc im
lặng đẩy việc người khác lên remote. Đó là lý do nhãn phải nằm **trong** commit, chỗ không đổi được.

Vùng nào có những khoá gì thì khai ở `.repo-structure.json`, khối `areas`, trường `steward`.
Đừng gõ cứng tên khoá vào tài liệu hay script — mỗi repo chia vùng một kiểu.

## 3. Một ngày làm việc — năm bước

```bash
node scripts/claim.mjs --list                                    # 1. xem vùng nào còn trống
#    ... ĐỌC, đo, hiểu việc — bước này KHÔNG cần khoá ...        # 2.
node scripts/claim.mjs --take <khoá> --as <phiên> --task "..."    # 3. nhận NGAY TRƯỚC lượt ghi đầu
#    ... làm việc, commit với dòng cuối `Lane: <phiên>` ...       # 4.
node scripts/session-check.mjs --as <phiên>                      # 5. cổng đóng phiên, phải XANH
node scripts/safe-push.mjs --as <phiên>                          # 6. đẩy, rồi --release vùng
```

**Bước 2 tách khỏi bước 3 là cố ý.** Trước 06/09 hai bước này gộp làm một, và đo được: mọi bản
giao việc hôm đó mở đầu bằng *"nhận khoá trước"*, trong khi lane dành 5–20 phút đầu chỉ để đọc.
Khoá nằm rảnh **do cấu trúc bản giao việc**, không do lane lười. **Một lane, một khoá gói** —
cần khoá thứ hai giữa chừng thì nhận thêm lúc cần, đừng gom sẵn từ đầu.

Bốn điều **không** được làm, mỗi điều là một tai nạn thật:

- **Đừng sửa `.agents/claims.json` bằng tay.** Sửa tay là đọc–sửa–ghi, và hai phiên cùng đọc
  thấy "trống" sẽ cùng ghi tên mình. Dùng lệnh.
- **Đừng `git push` trần.** Nó cuốn theo commit của mọi phiên khác.
- **Đừng bỏ dòng `Lane:`.** Không có nhãn thì không quy thuộc được commit về ai.
- **Đừng nhả khoá hộ lane khác vì thấy "repo chưa thấy dấu vết".** Tín hiệu đó nói repo chưa
  thấy gì, **không** nói lane đó rảnh — nó không thấy được việc làm ngoài repo. 06/09: nhả hộ
  một lần, lane kia mất phần đã xong. Thấy tín hiệu thì **hỏi**, đừng quyết. `AGENTS.md` mục 1.

## 4. Năm bất biến — luật phải giữ, kèm lý do

Đây là **hợp đồng thiết kế**, không phải mô tả tính năng. Mỗi cái sinh ra từ một lần hỏng thật.
Nếu repo của bạn chưa cắm đủ chốt cho một điều nào, thì đó là **nợ**, không phải lựa chọn — ghi
vào `BACKLOG.md`, đừng ghi vào đây.

**① Một vùng, một chủ, tại một thời điểm.** Vùng có chủ mà chủ không phải bạn thì **chỉ đọc**.
Muốn giành thì hỏi người chủ dự án. Và khi họ chốt, câu chốt phải được **ghi vào bảng**, không
phải in ra màn hình — vì người cần đọc câu đó là phiên vừa **mất** khoá, mà họ không chạy lệnh;
họ chỉ đọc bảng.

**② Đóng dấu, đừng so hai ảnh chụp.** Cách bắt sửa-tay là băm nội dung bảng rồi ghi dấu vào chính
file: sửa tay làm dấu vỡ, và mọi phiên đều thấy. Vì sao **không** so trạng thái cũ với mới:
"trả rồi nhận" và "ghi đè" cho ra **cùng một diff**. Ảnh chụp không phân biệt được hai chuyện đó,
nên phép kiểm kiểu ấy chỉ báo oan. Ngoại lệ có chủ ý: lệnh *đóng lại dấu sau khi đã phân xử* thì
**có** so — nhưng nó chỉ chạy sau khi đã có sửa tay, tức không nằm trên đường đi thường ngày.

**③ Mốc so là bản niêm phong LÀNH gần nhất, không phải bản mới nhất.** Nếu lấy bản mới nhất thì
một lượt `git commit` biến trạng thái đã bị sửa tay thành mốc hợp lệ — cửa sau tốn đúng một lệnh.
Bản có dấu không khớp phải bị bỏ qua, và phép so lùi tiếp về mốc lành.

**④ "Không biết" phải là ĐỎ, không phải "không sao".** Bất biến bị vi phạm nhiều nhất, và luôn
cùng một hình dạng: một `catch` trả về giá trị rỗng, rồi chỗ khác đọc giá trị rỗng đó thành
"không có vấn đề". Cổng không đỏ — cổng **biến thành không làm gì**, và nó trông y hệt "đã đạt".
Mọi lỗi đọc git, mọi cấu hình không phân giải được, mọi ảnh chụp không dựng được: phải chặn.
Ngoại lệ duy nhất là **bootstrap thật** — repo chưa từng có trạng thái nào để mà mất. Và phải
phân biệt được "chưa có gì" với "không đọc được"; gộp hai thứ đó lại chính là cách sinh ra lỗ.

**⑤ Đỏ của phiên khác không được chặn bạn; đỏ của bạn thì phải chặn.** Suite chạy trên một cây
làm việc dùng chung, nên file sửa dở của người khác làm test của bạn đỏ. Cách phân biệt: chụp
HEAD ra một chỗ tạm rồi chạy lại đúng suite đó ở đó. Đỏ ở đó = thật. Xanh ở đó = nhiễm từ cây
làm việc. **Nhưng nếu vùng bạn đang giữ còn file sửa dở thì KHÔNG được dùng "HEAD xanh" để miễn**
— làm thế là tự miễn cho lỗi của chính mình bằng đúng cái chốt sinh ra để chặn nó.

Ba chi tiết của ảnh chụp, mỗi cái đã từng sai:
- nó phải **có `.git`**, không chỉ có file — bản chép trần làm suite nào gọi git chết vì thiếu
  git, rồi cái chết đó bị quy oan thành "regression đã commit";
- nó phải ghim **đúng commit đang xét**, đừng tin tên nhánh mặc định;
- nó phải đúng **cả hai mốc** — bản clone trần đặt mốc remote bằng HEAD, và cái sai đó **im lặng**:
  suite vẫn chạy, vẫn xanh, chỉ so với mốc sai.

## 5. Muốn ĐỔI cơ chế — đọc mục này trước

**Luật một dòng: một chốt không có test ghim thì nó chỉ là bình luận.**

Không phải khẩu hiệu. Ở repo đầu tiên dùng bộ khung này, trong **một** ngày làm việc đếm được
**bốn** lần một chốt vừa viết ra hoá ra không có tác dụng gì — và cả bốn lần test đều đang xanh.
Cách duy nhất phát hiện là **đột biến kiểm**: cố ý làm hỏng chốt rồi xem có test nào đỏ không.

Ba cái bẫy đã tự cắn, ghi ra để đừng ai đạp lại:

1. **Ghim hàm không thay được ghim đường đi.** Hàm trả về đúng, mà nơi gọi nó lờ đi thì cũng như
   không. Một đột biến gỡ chốt trong `main()` đã không làm đỏ test nào — vì test chỉ gọi hàm.
2. **Test có thể ghim NGƯỢC.** Một khối test đã khẳng định đúng cái lỗ là hành vi hợp lệ, trong
   khi chú thích ngay trên nó viết ngược lại. Tệ hơn không có test, vì nó làm lỗ trông như đã
   kiểm chứng.
3. **Ghim một chiều là chưa đủ.** Phải có cả vế "chặn đúng thứ cần chặn" và vế "KHÔNG chặn thứ
   hợp lệ". Thiếu vế hai thì một bản luôn-từ-chối vẫn qua sạch.

**Quy trình:**

1. Nhận đúng vùng chứa cơ chế đó.
2. Sửa. Thêm ca ghim **hành vi**, không ghim chuỗi nguồn.
3. **Đột biến:** làm hỏng chốt vừa viết → phải có test đỏ. Không đỏ nghĩa là chốt chưa tồn tại;
   quay lại bước 2.
4. Chạy cả bộ test **bằng tay**. Đừng chỉ tin dòng tổng kết của cổng: nếu commit của bạn đã được
   phiên khác đẩy đi thì bạn không "chịu trách nhiệm" vùng nào, và phép kiểm test **xanh rỗng**.
5. Thêm hoặc bớt một phép kiểm của cổng thì phải sửa con số chống-tự-tháo ở **cả hai** chỗ (script
   và test ghim nó), kèm một dòng lý do. Lớp đó tồn tại vì cách dễ nhất để "làm cổng xanh" là
   lặng lẽ xoá một phép kiểm.
6. Đổi **luật an toàn** — quy thuộc, chặn, retry, exact-once — thì **hỏi chủ dự án trước**.

## 6. Cổng báo lỗi thì làm gì

**Đọc thông báo của cổng.** Mọi phép kiểm ở bộ khung này đều in cả chỗ sai lẫn cách sửa, ngay
trên dòng đó. Tài liệu này **cố ý không** giữ một bản sao của danh sách mã lỗi: hai bản sao của
một luật sẽ lệch nhau, và bản trong tài liệu là bản không ai chạy nên nó lệch trước.

Bốn câu hỏi hay gặp, và chỗ trả lời:

| Bạn muốn biết | Chạy |
|---|---|
| ai đang giữ vùng nào, giữ bao lâu | `node scripts/claim.mjs --list` |
| việc của tôi còn thiếu gì | `node scripts/session-check.mjs --as <phiên>` |
| repo còn nợ gì về cấu trúc | `node scripts/check-bootstrap.mjs --all` |
| sắp đẩy những gì, của ai | `node scripts/safe-push.mjs --as <phiên> --dry-run` |

## 7. Cố ý KHÔNG làm

Ghi lại để đừng ai "cải tiến" vào đúng mấy chỗ này:

- **Không tự đòi lại khoá quá hạn.** Phiên chạy dài là bình thường, và mốc thời gian không được
  chạm lại trong lúc làm — nên "cũ" không đồng nghĩa "chết". Tuổi khoá là **số liệu để bạn hỏi**,
  không phải giấy phép để giành. Tự đòi lại là biến một tai nạn thành tính năng.
- **Không `git worktree add`.** Nó ghi vào state dùng chung của repo gốc, mà hai phiên chạy cùng
  lúc sẽ giẫm nhau. Ảnh chụp phải là bản tạm, sống vài giây rồi xoá.
- **Không để cổng xuất bản tự sinh rồi tự commit.** Làm thế là biến công cụ ĐẨY thành công cụ
  VIẾT, và một commit bạn không gõ là một commit bạn không đọc. Nó phải từ chối, và đưa đúng lệnh.
- **Không dựng hộp cát thường trú cho từng phiên.** Ảnh chụp tạm đã đủ cho nhu cầu chẩn đoán;
  chưa có số đo nào đòi hơn thế.
