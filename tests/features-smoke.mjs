/* DANH MỤC TÍNH NĂNG — phép ghim.
 *
 * File này canh một thứ dễ mục nhất trong cả repo: **một danh mục tính năng tự khai**. Nó nói
 * repo có gì lúc ai đó viết nó, rồi im lặng mãi về sau, và không ai phát hiện vì nó luôn "đúng".
 *
 * Nên bộ ghim hỏi hai câu, và câu thứ hai mới có răng:
 *   1. Bộ ĐO có phân biệt được ba trạng thái không?
 *   2. Danh mục có KHỚP VỚI REPO THẬT không — tức mọi thứ nó khai `can` có thật sự tồn tại?
 *
 * Câu 2 là chỗ một danh mục mục ruỗng bị bắt: khai một file đã bị xoá, hay gõ sai một tên lệnh,
 * thì mục đó sẽ báo THIẾU ngay tại repo phát hành — nơi nó chắc chắn phải đủ.
 *
 * ================== MỘT LỖI LẶP BA LẦN TRONG CHÍNH FILE NÀY ==================
 *
 * File này ĐI THEO BẢN TRÍCH, nên nó chạy ở HAI loại repo: nơi phát hành, và repo đã lắp. Ba vế
 * của nó (5 · 7 · 8) từng đặt câu hỏi **chỉ đúng ở nơi phát hành**, rồi đỏ trong repo hạt giống:
 *
 *   · vế 5 đòi mọi tính năng phải đủ — nhưng repo VỪA DỰNG thiếu `docs/migrations`, `CHANGELOG.md`,
 *     `.github/workflows`… một cách hợp lý: nó **chưa tới lúc** có, không phải thiếu.
 *   · vế 7 soi `template/` — repo dựng TỪ bản trích không có thư mục đó.
 *   · vế 8 cũng soi `template/`.
 *
 * Luật rút ra, cho bất cứ ai thêm vế mới vào đây: **mỗi vế phải trả lời được câu "câu này có nghĩa
 * gì ở repo đã lắp?"** Không có câu trả lời thì rẽ nhánh theo `laNoiPhatHanh(ROOT)` và đặt một câu
 * tương đương cho phía kia — đừng bỏ trắng, vì một vế bỏ trắng đọc y hệt một vế đã đạt.
 *
 * ĐỘT BIẾN ĐÃ CHẠY:
 *   1. cho `xetMuc` trả XONG khi thiếu một nửa            → vế 2 ĐỎ
 *   2. bỏ luật phạm vi (`chi-repo-nha` cũng bị đòi ở đích) → vế 3 ĐỎ
 *   3. `docLenh` trả `{}` thay vì `null` khi thiếu package.json → vế 4 ĐỎ
 *   4. xoá một file khỏi khối `can` của một mục            → vế 5 ĐỎ (đúng mục đó)
 *   5. `demTheoTrangThai` đếm "một phần" vào "xong"        → vế 2 ĐỎ
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DAU_HIEU_PHAT_HANH, demTheoTrangThai, do1Repo, docDanhMuc, docLenh, khoiMigrate,
  laNoiPhatHanh, TRANG_THAI, xetMuc
} from "../scripts/features.mjs";

let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ok  ${name}`); };
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const danhMuc = docDanhMuc(ROOT);

/* ---- 1. Danh mục đúng hình dạng, và mã không trùng ---------------------- */
{
  assert.ok(danhMuc.blocks.length >= 5, `phai co it nhat 5 khoi tinh nang, dang ${danhMuc.blocks.length}`);
  const ma = new Set();
  const PV = new Set(["ca-hai", "chi-repo-nha", "chi-repo-dich"]);
  for (const b of danhMuc.blocks) {
    assert.match(b.ma, /^F\d+$/, `ma khoi la: ${b.ma}`);
    assert.ok(b.vi_sao && b.vi_sao.length > 40, `${b.ma} phai noi VI SAO khoi nay ton tai, khong chi dat ten`);
    assert.ok(Array.isArray(b.muc) && b.muc.length, `${b.ma} rong`);
    for (const m of b.muc) {
      assert.ok(!ma.has(m.ma), `ma trung: ${m.ma} — hai muc cung ma thi checklist dem sai`);
      ma.add(m.ma);
      assert.ok(m.ma.startsWith(`${b.ma}.`), `${m.ma} khong thuoc khoi ${b.ma}`);
      assert.match(String(m.tu_ban), /^\d+\.\d+\.\d+$/, `${m.ma} phai khai tu_ban dang x.y.z — day la con so phien AI o repo dich doi chieu de biet minh thieu gi`);
      assert.ok(PV.has(m.pham_vi), `${m.ma} khai pham_vi la "${m.pham_vi}" — chi co ba gia tri`);
      assert.ok((m.can?.file?.length ?? 0) + (m.can?.lenh?.length ?? 0) > 0,
        `${m.ma} KHONG co phep do nao. Mot muc khong do duoc la mot dong quang cao, khong phai checklist`);
      assert.ok(m.khong_co_thi && m.khong_co_thi.length > 30,
        `${m.ma} phai noi KHONG CO NO THI HONG RA SAO — nguoi doc can biet cai gia, khong chi cai ten`);
    }
  }
  ok(`${ma.size} mục trong ${danhMuc.blocks.length} khối · mã không trùng · mục nào cũng có phép đo và có cái giá`);
}

/* ---- 2. BA trạng thái, và không gộp về hai ------------------------------
 *
 * MỘT PHẦN là ca nguy hiểm nhất: mục đó trông như đang chạy nhưng hỏng ở chỗ không ai nhìn. Ca
 * thật đã đo: một repo có `scripts/session-check.mjs` mà thiếu `npm run gate` — cổng có mặt mà
 * không ai gọi được bằng tên chuẩn, nên trên thực tế nó không tồn tại. */
{
  const muc = { ma: "T.1", pham_vi: "ca-hai", can: { file: ["a", "b"], lenh: ["x"] } };
  const co = (_r, f) => f === "a";                       // có `a`, thiếu `b`

  assert.equal(xetMuc(muc, "/r", false, { x: "..." }, co).trangThai, TRANG_THAI.MOT_PHAN,
    "co mot phan thi phai la MOT PHAN, khong duoc lam tron thanh XONG hay THIEU");
  assert.equal(xetMuc(muc, "/r", false, {}, () => true).trangThai, TRANG_THAI.MOT_PHAN,
    "du file nhung thieu LENH thi van la mot phan — file co ma khong ai goi duoc bang ten chuan");
  assert.equal(xetMuc(muc, "/r", false, { x: "..." }, () => true).trangThai, TRANG_THAI.XONG, "du het thi XONG");
  assert.equal(xetMuc(muc, "/r", false, {}, () => false).trangThai, TRANG_THAI.THIEU, "khong co gi thi THIEU");

  const r = xetMuc(muc, "/r", false, { x: "..." }, co);
  assert.deepEqual(r.thieu, ["b"], "phai KE TEN dung thu con thieu, khong chi noi 'thieu'");

  // Và bộ đếm không được nuốt MỘT PHẦN vào XONG.
  const dem = demTheoTrangThai([{ ma: "T", muc: [{ ket: { trangThai: TRANG_THAI.MOT_PHAN } }, { ket: { trangThai: TRANG_THAI.XONG } }] }]);
  assert.equal(dem.xong, 1, "chi mot muc xong");
  assert.equal(dem["mot-phan"], 1, "mot phan phai duoc dem RIENG — gop vao xong la che dung cho dang hong");
  ok("2 · ba trạng thái phân biệt được, và MỘT PHẦN không bị làm tròn về hai đầu");
}

/* ---- 3. LUẬT PHẠM VI — báo thiếu SAI thì người đọc thôi tin cả bản ------ */
{
  const nha = { ma: "T.2", pham_vi: "chi-repo-nha", can: { file: ["a"] } };
  const dich = { ma: "T.3", pham_vi: "chi-repo-dich", can: { file: ["a"] } };

  assert.equal(xetMuc(nha, "/r", false, {}, () => false).trangThai, TRANG_THAI.NGOAI_PHAM_VI,
    "muc chi-repo-nha KHONG duoc bao thieu o repo dich — no khong can no");
  assert.equal(xetMuc(nha, "/r", true, {}, () => false).trangThai, TRANG_THAI.THIEU,
    "nhung o CHINH repo phat hanh thi thieu la thieu that");
  assert.equal(xetMuc(dich, "/r", true, {}, () => false).trangThai, TRANG_THAI.NGOAI_PHAM_VI,
    "va chieu nguoc lai cung phai dung");
  assert.equal(xetMuc(dich, "/r", false, {}, () => false).trangThai, TRANG_THAI.THIEU,
    "muc chi-repo-dich thieu o repo dich thi la thieu that");
  ok("3 · phạm vi được tôn trọng cả hai chiều — không báo thiếu ở nơi không cần");
}

/* ---- 4. KHÔNG CÓ package.json ≠ THIẾU MỌI LỆNH ------------------------- */
{
  const muc = { ma: "T.4", pham_vi: "ca-hai", can: { file: ["a"], lenh: ["x", "y"] } };
  const r = xetMuc(muc, "/r", false, null, () => true);
  assert.equal(r.trangThai, TRANG_THAI.XONG,
    "repo khong co package.json (vi du repo Python) thi BO QUA ve lenh, khong bao thieu — bao sai la nguoi doc thoi tin ca ban");
  assert.deepEqual(r.thieu, [], "khong duoc ke ten lenh nao la thieu khi khong doc duoc package.json");
  assert.equal(docLenh(join(ROOT, "khong-co-thu-muc-nay")), null,
    "khong doc duoc package.json phai tra null (= KHONG BIET), khong tra {} (= khong co lenh nao)");
  assert.ok(docLenh(ROOT)?.gate, "doc duoc package.json cua repo nha thi phai thay lenh gate");
  ok("4 · không đọc được `package.json` → KHÔNG BIẾT, không phải THIẾU");
}

/* ---- 5. DANH MỤC PHẢI KHỚP VỚI REPO THẬT ------------------------------
 *
 * Vế có răng nhất, nhưng nó ĐÒI HAI THỨ KHÁC NHAU ở hai loại repo — và phân biệt được hai loại
 * đó là chỗ bản đầu của vế này làm sai.
 *
 * Ở NƠI PHÁT HÀNH: mọi mục `ca-hai` và `chi-repo-nha` chắc chắn phải đủ. Bất cứ mục nào báo
 * THIẾU ở đây nghĩa là danh mục đã mục — khai một file đã bị xoá, hay gõ sai một tên lệnh. Không
 * có vế này thì `features.json` trôi khỏi thực tế trong im lặng, và mọi bản báo cáo migrate dựng
 * trên nó sai theo.
 *
 * Ở REPO VỪA DỰNG TỪ BẢN TRÍCH: đòi y như vậy là SAI, và bản đầu đã sai đúng thế — nó đỏ ngay
 * trong repo hạt giống. Năm mục thiếu ở đó thiếu HỢP LÝ: `docs/migrations` chỉ mọc lên sau lượt
 * migrate đầu, `CHANGELOG.md` sau bản phát đầu, `.github/workflows` sau khi ai đó bật CI, sổ ghim
 * sau khi lắp. Một repo mới KHÔNG "thiếu" chúng — nó chưa tới lúc có.
 *
 * Nên ở đó vế này đòi thứ khác, và thứ đó vẫn thật: **KHÔNG mục nào được MỘT PHẦN.** Một mục một
 * phần ở repo vừa dựng nghĩa là bản trích phát ra một nửa — ca thật đã xảy ra: repo đích nhận
 * `tests/bang-song.mjs` mà không nhận `bang-song/`.
 */
{
  const laNha = laNoiPhatHanh(ROOT);
  const kq = do1Repo(danhMuc, ROOT, laNha);
  const loc = (...tt) => kq.flatMap((b) => b.muc.filter((m) => tt.includes(m.ket.trangThai))
    .map((m) => `${m.ma} (${m.ket.trangThai}) thiếu: ${m.ket.thieu.join(", ")}`));

  if (laNha) {
    assert.deepEqual(loc(TRANG_THAI.THIEU, TRANG_THAI.MOT_PHAN), [],
      `danh muc khai nhung NOI PHAT HANH khong co:${loc(TRANG_THAI.THIEU, TRANG_THAI.MOT_PHAN).map((h) => `\n    ${h}`).join("")}\n  → hoac sua features.json, hoac dung file/lenh do. Danh muc troi khoi thuc te la danh muc noi doi.`);
  } else {
    assert.deepEqual(loc(TRANG_THAI.MOT_PHAN), [],
      `repo nay co muc MOT PHAN:${loc(TRANG_THAI.MOT_PHAN).map((h) => `\n    ${h}`).join("")}\n  → mot phan o repo vua dung nghia la ban trich phat ra MOT NUA. Thieu thi con doi duoc; mot nua thi hong im lang.`);
  }
  ok(`5 · danh mục khớp repo thật (${demTheoTrangThai(kq).xong} mục xong · ${laNha ? "nơi phát hành: cấm THIẾU và MỘT PHẦN" : "repo đã lắp: cấm MỘT PHẦN"})`);
}

/* ---- 6. Khối markdown dán vào hồ sơ migrate ----------------------------- */
{
  const kq = do1Repo(danhMuc, ROOT, laNoiPhatHanh(ROOT));
  const md = khoiMigrate(danhMuc, kq, "2026-09-07");
  assert.match(md, /danh mục bản/, "phai ghi BAN danh muc — sau sau thang nguoi doc can biet luc do do bang gi");
  assert.match(md, /đo ngày 2026-09-07/, "phai ghi NGAY DO");
  assert.match(md, /Đo, không tự khai/, "phai noi ro day la so DO, khong phai loi tu khai");
  for (const b of danhMuc.blocks) assert.ok(md.includes(b.ten), `khoi ${b.ma} bi thieu khoi bang checklist`);
  ok("6 · khối migrate mang đủ ngày · bản danh mục · và cả 9 khối");
}

/* ---- 7. FILE NÀY PHẢI ĐI THEO BẢN TRÍCH -------------------------------
 *
 * Danh mục chỉ có nghĩa nếu repo đích CHẠY ĐƯỢC nó — cả điểm của nó là để phiên AI ở repo đích tự
 * đo mình. Phát bộ đo mà không phát danh mục (hay ngược lại) là phát một nửa.
 *
 * CHỈ HỎI ĐƯỢC Ở NƠI PHÁT HÀNH: repo dựng TỪ bản trích không có thư mục `template/`, nên hỏi ở
 * đó là hỏi một câu vô nghĩa rồi đỏ. Đây là lần thứ ba cùng một lỗi trong file này — xem ghi chú
 * ở đầu file. */
{
  if (laNoiPhatHanh(ROOT)) {
    for (const f of ["features.json", "scripts/features.mjs", "tests/features-smoke.mjs"]) {
      assert.ok(existsSync(join(ROOT, "template", f)),
        `template/${f} khong ton tai — danh muc phai di theo ban trich, khong thi repo dich khong tu do duoc minh`);
    }
    ok("7 · danh mục · bộ đo · phép ghim — cả ba đi theo bản trích");
  } else {
    /* Ở repo đã lắp, câu tương đương và VẪN THẬT: ba file đó phải có mặt NGAY TẠI ĐÂY. */
    for (const f of ["features.json", "scripts/features.mjs", "tests/features-smoke.mjs"]) {
      assert.ok(existsSync(join(ROOT, f)), `${f} khong ton tai o repo nay — ban trich phat thieu`);
    }
    ok("7 · danh mục · bộ đo · phép ghim — cả ba đã tới repo này");
  }
}

/* ---- 8. "NƠI PHÁT HÀNH" PHẢI SUY BẰNG DẤU HIỆU, KHÔNG BẰNG ĐƯỜNG DẪN ----
 *
 * Bản đầu của bộ đo so `path.resolve(repo) === path.resolve(NHA)`. Đúng ở repo phát hành, SAI ở
 * mọi repo khác: file này ĐI THEO BẢN TRÍCH, nên khi repo đích chạy `npm run features` thì `NHA`
 * chính là gốc repo đó — phép so trả `true` và repo đích bị đòi cả bộ máy phát hành.
 *
 * Bắt được vì phép ghim chạy TRONG một repo dựng từ bản trích và đỏ ngay ở đó. Vế này giữ cho nó
 * không quay lại: hỏi HÀNH VI với hai hình dạng repo giả, không đọc mã.
 *
 * Đột biến đã chạy: đòi MỘT dấu hiệu thay vì CẢ HAI → vế này ĐỎ. */
{
  const co = (danhSach) => (_r, f) => danhSach.includes(f);
  assert.equal(laNoiPhatHanh("/r", co([...DAU_HIEU_PHAT_HANH])), true, "co du dau hieu thi la noi phat hanh");
  assert.equal(laNoiPhatHanh("/r", co([])), false, "repo da lap KHONG duoc nhan la noi phat hanh");
  for (const mot of DAU_HIEU_PHAT_HANH) {
    assert.equal(laNoiPhatHanh("/r", co([mot])), false,
      `chi co "${mot}" thi CHUA du — mot file le co the ton tai vi ly do khac`);
  }
  assert.ok(DAU_HIEU_PHAT_HANH.length >= 2, "phai co it nhat hai dau hieu, khong tin mot file le");
  /* Và dấu hiệu phải KHÔNG đi theo bản trích — không thì mọi repo đích cũng trông như nơi phát
     hành. Chỉ kiểm được ở nơi phát hành, vì chỉ ở đó mới có `template/` để soi. */
  if (laNoiPhatHanh(ROOT)) {
    for (const f of DAU_HIEU_PHAT_HANH) {
      assert.ok(!existsSync(join(ROOT, "template", f)),
        `${f} dung lam dau hieu nhung no LAI di theo ban trich — luc do moi repo dich cung trong nhu noi phat hanh`);
    }
  }
  ok(`8 · nơi phát hành suy từ ${DAU_HIEU_PHAT_HANH.length} dấu hiệu, và cả ${DAU_HIEU_PHAT_HANH.length} đều KHÔNG đi theo bản trích`);
}

console.log(`features: ${passed} vế xanh`);
