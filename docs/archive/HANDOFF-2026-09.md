# Nhật ký bàn giao — LƯU TRỮ

> **CHỮ GIỮ NGUYÊN, chỉ ĐỔI CHỖ.** Cắt từ `HANDOFF.md` bằng `npm run don`.
> Nhật ký gốc đã 654 dòng / ngân sách 600 — mà nhật ký là thứ MỌI phiên AI phải nạp mỗi lần mở.
> Không dòng nào bị sửa, không dòng nào bị bỏ. Bản mới nhất vẫn ở [HANDOFF.md](../../HANDOFF.md).

## Lượt · Đẩy hộ 12 commit của bốn lane — phiên điều phối, duyệt thường trực

**Phiên:** `claude-dieu-phoi` · 2026-09-05 · vai điều phối

Đức duyệt **thường trực** cho `safe-push` kể cả `--carry` (quyết định ghi ở repo Extension,
`ADR-0005`). Đổi lại, luật buộc **kể tên lane bị cuốn theo**. Lượt này cuốn theo:

- `claude-exec-crlf` — vá phép ghim phụ thuộc kiểu xuống dòng
- `claude-exec-harness-wire` — cắm suite Assistant vào cổng kiểm, thêm hai lệnh chạy được
- `claude-exec-promoteA2` — port sổ tay vai điều phối, bản portable

**Đã kiểm chứng độc lập trước khi đẩy, không tin báo cáo:** `git checkout` ba file về đúng dạng
mà người clone nhận được, rồi chạy suite → **52 xanh, 0 đỏ**. Trước lượt vá, cùng phép đo đó cho
**28 xanh rồi chết**.

**Còn mở, đã ghi để không mất:**

- **`.gitattributes`** chưa có. Bản vá lượt này chặn bệnh ở suite Assistant, không chặn ở toàn
  repo. Thêm nó đổi cách lấy file ra của mọi file nên chưa tự làm — cần một lượt riêng.
- **Hai bản sao của một luật:** danh sách file máy sinh gõ cứng trong bộ sinh khai **3** file,
  còn khối `generated` của `.repo-structure.json` khai **5**. Hệ quả đo được: hai trang HTML bị
  tính là file hành vi, và mỗi lượt sinh lại tự làm bảng lệch thêm một nhịp — phải commit
  sinh-lại **ba lần** mới hội tụ. Cùng họ với lỗi đã ghi ở lượt `claude-so-migrate`.

 - **2026-09-05 · `claude-exec-changB` · Bản 1.3.0 — repo mới nhận luôn gói Assistant, và lần
   đầu phép thử cuối chạy được thật** — Chặng B của đề bài đưa gói Assistant vào bộ khung, Đức
   duyệt 05/09. Bốn thứ vào **đúng MỘT bản phát hành**, không tách ba: hai lệnh của vai điều
   phối (`scripts/state-check.mjs`, `scripts/what-next.mjs`), suite ghim đi kèm
   (`tests/assistant-smoke.mjs`, 52 phép), và sổ tay vai điều phối bản portable
   (`docs/protocols/ORCHESTRATOR.md`).
   **Không sửa một cổng nào để cho vừa.** `session-check.mjs` · `safe-push.mjs` · `claim.mjs` ·
   `repo-structure.mjs` không đụng một dòng. Đường vào bản phát là đường có sẵn của bộ trích:
   thêm tên vào danh sách script đi theo, thêm hai cặp vào khối chép nguyên văn, khai hai lệnh
   mới và nối suite vào `test` của `package.json` mà bản trích sinh ra.
   **HAI LẦN BỊ CHÍNH CỔNG CHẶN, và đó là phần đáng giá nhất của lượt này.** `leakedNames()` từ
   chối mọi file mang tên dự án gốc, và nó bắt được đúng hai chỗ mà mắt người vừa đọc qua:
   (a) danh sách cấm trong phép ghim viết thẳng ba cái tên đó ra; (b) khối chú thích cho người
   bảo trì trong sổ tay kể thẳng ba tên gói cũ. **Sửa nguồn chứ không sửa phép kiểm** — danh
   sách cấm nay GHÉP TÊN TỪ MẢNH (mẫu khớp giữ nguyên từng chữ, đã chứng minh bằng đột biến),
   và sổ tay thôi kể tên, chỉ nói "ba tên gói sản phẩm của repo gốc". Cả hai chỗ đều có chú
   thích nói rõ **đừng dọn cho gọn**, kèm lý do — vì "dọn cho gọn" chính là cách làm bản sau
   không phát hành được.
   **Số phiên bản 1.2.20 → 1.3.0.** Dấu vân tay tầng máy đổi (thêm ba file dưới `scripts/` +
   `tests/`), nên sổ phát hành **tự chặn** lượt sinh đầu tiên với `SO_PHAT_HANH_LECH` — cổng
   chạy đúng như thiết kế, ghi lại ở đây như một ca đột biến quan sát được miễn phí. Nấc `minor`
   vì đây là bản **thêm tính năng**, không phá tương thích: repo đang ở bản cũ nâng lên chỉ nhận
   thêm file, không mất file nào.
   **PHÉP THỬ CUỐI — lần đầu chạy được thật, và nó ĐẠT.** Dựng một repo mới bằng `init-repo.mjs`
   từ bản vừa phát: 26 file, cổng cấu trúc **0 đỏ 0 vàng** ngay lúc dựng. Ở repo mới đó, **không
   sửa một dòng nào**: `npm run state-check` ra **`STATE UNKNOWN`, mã thoát 2** (repo mới chưa có
   nơi đối chiếu từ xa) — **không** ra `OK`, và nó nêu đủ cả năm chỗ không đối chiếu được;
   `npm run what-next` chạy sạch, mã thoát 0, in đủ bốn mục. `npm test` ở repo mới: **13 + 52 =
   65 phép, 0 đỏ**. Vòng trước chỉ dựng được một repo nhận 6 script và **không có** gói này —
   đó là lỗ hổng lượt này lấp.
   **Kiểm cả hai dạng xuống dòng, ở repo mới.** Xoá bảy file rồi `git checkout` để chúng trở về
   đúng dạng byte mà **người clone** nhận được (đã kiểm bằng `file`: dạng Windows), rồi chạy lại
   suite: **52 xanh cả hai lượt, cùng con số**. Bản vá của lượt `claude-exec-crlf` sống sót qua
   khuôn.
   **THỬ PHÁ — 5 ca, và có MỘT LƯỢT THOÁT ở vòng đầu, nói thẳng.** Bốn ca đỏ đúng chỗ ngay lượt
   đầu: tên gói repo gốc lọt vào một trong hai lệnh · tên dự án gốc trong sổ tay · viết liền lại
   danh sách cấm · bỏ một lệnh khỏi danh sách đi theo bản trích. **Ca thứ năm thoát lượt đầu**:
   phá bằng cách thay MỌI chỗ nhắc `UNKNOWN` trong bản đã phát — suite ĐỎ, nhưng đỏ ở **một
   khẳng định khác** (bảng mã thoát) chứ không ở khẳng định "vắng nơi đối chiếu phải ra không-
   biết". Đỏ nhầm chỗ thì ca đó không chứng minh gì. Sửa thành phá **đúng một dòng quyết định**;
   sau sửa **5/5 đỏ đúng chỗ**. Hoàn nguyên bằng ghi lại byte gốc, **không** bằng `git checkout`
   — chính lệnh đó là cái bẫy đã ghi ở lượt trước.
   **Số ở chính bộ khung:** `npm test` **143 phép kiểm, 0 đỏ** — đúng bằng con số trước lượt này,
   không mất phép nào và không thêm phép nào (lượt này không viết phép ghim mới; nó phát hành
   phép ghim đã có).
   **ADR-0005** ghi lại quyết định: bộ khung là **nơi phát hành** gói này, repo đã sinh ra nó
   thành người tiêu thụ. ADR nói rõ đây là **ngoại lệ có tên** của ADR-0003 (chế độ bảo trì),
   kèm cái giá phải trả, và ghim hai bất biến cấm đổi.
   **CÒN MỞ — ghi lại, KHÔNG tự làm:**
   - **Phía repo kia chưa được ghi gì.** Mục 4 của đề bài gốc cần một dòng trong luật của repo
     đó, cần quyền bên đó, và là một lượt riêng. Người điều phối phân việc đó.
   - **Phép ghim tầng mã nguồn canh sổ tay vai điều phối vẫn CHƯA cắm vào suite.** Nguyên mẫu
     có từ lượt `claude-exec-promoteA2`, đã qua 8 ca đột biến, vẫn chỉ còn dán vào. Nay có thêm
     một lý do: cổng bộ trích chỉ canh **bốn** tên dự án gốc, không canh mã việc, không canh tên
     khoá vùng, không canh tên người. Sổ tay đã đi theo bản phát rồi, nên chỗ hở đó nay ra tới
     repo khác.
   - **Không có gì canh việc bản trích còn khai đủ lệnh hay không.** Nếu ai bỏ suite Assistant
     khỏi chuỗi `test` mà bản trích sinh ra, bản trích vẫn khớp và mọi cổng vẫn xanh — chỉ có
     repo mới là im lặng thôi chạy 52 phép đó. Đo được: bỏ một **script** thì cổng đỏ (đã thử),
     bỏ một **dòng khai lệnh** thì không.
   - **`.gitattributes` vẫn chưa có** — nợ cũ từ lượt `claude-exec-crlf`, chưa động tới.

 - **2026-09-05 · `claude-exec-harness-no` · Ba lỗ hổng ghi ở lượt trước nay đã có răng —
   không tăng số phiên bản, không cắt bản mới** — Bản 1.3.0 vừa ra tới repo khác, nên ba chỗ
   hở mà lượt `claude-exec-changB` đo được đã nguy hơn lúc nó được ghi. Lượt này vá cả ba,
   mỗi việc một commit riêng.
   **(a) Bỏ một dòng khai lệnh thì không cổng nào đỏ — DỰNG ĐƯỢC CA HỎNG TRƯỚC KHI VÁ.** Bỏ
   dòng khai lệnh `what-next` trong `package.json` mà bản trích sinh ra, rồi sinh lại: bộ trích
   nói *khớp bản gốc, 27 file, bản 1.3.0 khớp sổ phát hành*, và `npm test` **xanh toàn bộ, mã
   thoát 0**. Tức repo mới dựng từ khuôn im lặng mất một lệnh, không dấu vết. Vá bằng ba vế,
   **cả ba suy từ chính bản trích chứ không gõ sẵn danh sách** — gõ sẵn là thêm một chỗ phải
   nhớ, mà chỗ nào phải nhớ thì chỗ đó sẽ quên: (1) suite nào bản trích mang theo thì chuỗi
   `test` phải gọi nó; (2) lệnh trỏ tới file nào thì file đó phải có mặt; (3) tài liệu đi theo
   dạy chạy lệnh nào thì lệnh đó phải được khai.
   **Vế (3) bắt được một lỗi CÓ THẬT ngay lượt chạy đầu, không phải lo xa:** mục 8 của luật
   trong khuôn dạy đo cân nặng bằng một lệnh mà bản trích **không mang theo** — repo mới chạy
   câu đó sẽ nhận *Missing script*. **Sửa nguồn, không sửa phép kiểm:** mục 8 trong khuôn nay
   nói thẳng rằng bộ khung không mang công cụ đo và ngân sách là con số của riêng repo đó. Bộ
   trích **ném** nếu phép thay trượt, chứ không im lặng phát đi bản cũ.
   **(b) Sổ tay vai điều phối nay có phép ghim canh định danh.** Cổng bộ trích chỉ canh bốn
   tên dự án gốc; nó không canh mã việc, không canh tên khoá vùng, không canh tên riêng người
   chốt. Phép ghim mới canh đúng bốn chỗ đó, trên **CẢ HAI bản** — bản trong khuôn (bản thật
   sự đi ra ngoài, vì nó qua một lượt thay chuỗi nên "bản nhà sạch" không kéo theo "bản phát
   đi sạch") và bản ở repo nhà.
   **ĐẶT Ở REPO NHÀ, KHÔNG ĐI THEO BẢN TRÍCH — đây là quyết định, ghi ra để đừng ai "sửa lại
   cho đúng chỗ".** Hai lý do. Một: luật "không được nhắc tên khoá vùng" là luật của NGƯỜI
   PHÁT HÀNH; ở một repo dựng từ khuôn, viết `_root` vào sổ tay của chính nó là việc ĐÚNG,
   nên bê phép kiểm xuống đó là phát đi một luật sai chỗ và việc đầu tiên repo mới làm sẽ là
   xoá nó. Hai, đo được: đặt vào suite đi theo bản trích thì dấu vân tay tầng máy đổi và sổ
   phát hành **chặn ngay** (`SO_PHAT_HANH_LECH`) — tức buộc phải cắt bản mới, mà đề bài lượt
   này cấm.
   **Cắt bớt ngay khi vừa viết:** ba mẫu dò tên dự án lúc đầu chép sang từ nguyên mẫu đã bị
   **bỏ đi**, vì đo thật cho thấy cổng cũ chạy trước và đỏ trước — ba dòng đó không bao giờ đỏ
   được, tức chỉ tốn công đọc ở mọi lượt sau.
   **(c) Bộ khung nay có `.gitattributes`.** Đo ngay trước khi thêm: cùng một cây làm việc,
   cùng một commit, **75 file LF và 21 file CRLF**, mà `git status` nói sạch. Đó là bệnh gốc
   của defect vá ở lượt `claude-exec-crlf` — bản vá hồi đó chặn ở một suite, file này chặn ở
   toàn repo.
   **THỬ PHÁ — 12 ca, 0 lượt thoát ở vòng đầu.** Bốn ca cho (a): bỏ suite khỏi chuỗi `test` ·
   khai lệnh trỏ tới file không mang theo · bỏ dòng khai lệnh (chính ca hỏng đo được lúc đầu)
   · tài liệu dạy một lệnh chưa khai. Tám ca cho (b): mã việc · tên khoá vùng · tên người chốt
   · mã defect · tên gói repo gốc · xoá hẳn khối chú thích · dọn sạch chuỗi cấm KHỎI khối chú
   thích · **làm bẩn RIÊNG bản trong khuôn trong khi bản nhà sạch nguyên**. Ca cuối là ca đáng
   giá nhất: nó chứng minh vế "canh cả bản trong khuôn" có răng thật, chứ không ăn theo vế kia.
   Ca "tên gói repo gốc" đỏ ở **cổng cũ** chứ không ở phép ghim mới — nói thẳng, vì đó chính là
   bằng chứng cho việc cắt ba mẫu thừa nói ở trên. Hoàn nguyên bằng **ghi lại byte gốc**, không
   bằng `git checkout` — chính lệnh đó là cái bẫy mà (c) đang vá.
   **KHÔNG chạm bản phát:** số phiên bản giữ nguyên **1.3.0**, sổ phát hành không đụng, bộ trích
   vẫn nói *khớp sổ phát hành*. Bốn cổng `session-check.mjs` · `safe-push.mjs` · `claim.mjs` ·
   `repo-structure.mjs` không sửa một dòng.
   **Số thật:** `npm test` **145 phép kiểm, 0 đỏ** — trước lượt này 143, thêm đúng hai phép
   (một cho (a), một cho (b)). Cổng cấu trúc: **0 đỏ, 6 vàng** — y hệt trước lượt này.
   **CÒN MỞ — ghi lại, KHÔNG tự làm:**
   - **Bản trích chưa mang `.gitattributes` đi theo.** Repo mới dựng từ khuôn vẫn dính đúng
     bệnh này. Đo được là **thêm nó KHÔNG buộc phải cắt bản mới**: dấu vân tay chỉ băm file
     dưới `scripts/` và `tests/`, mà `.gitattributes` không nằm ở đó. Lượt này cố ý không làm
     vì nó kéo theo khai báo cấu trúc và bảng tra của luật trong khuôn — một lượt riêng.
   - **Bảng máy sinh không thể hội tụ bằng cách sinh lại.** Nó nhúng mã commit của HEAD, mà
     mỗi lượt commit bảng lại đổi HEAD — nên sinh-lại rồi commit thì lượt sinh sau vẫn khác
     đúng một mã. Không phải lỗi mới của lượt này; ghi ra để phiên sau đừng đuổi theo nó.
