/* SỔ MIGRATE — mỗi lần đưa một repo lên chuẩn để lại đúng một hồ sơ, và đây là chỗ đọc lại.
 *
 *   node scripts/build-so-migrate.mjs <file-ra.html>
 *
 * VÌ SAO CÓ FILE NÀY. Việc migrate xảy ra thưa — vài tuần một lần, đôi khi vài tháng. Đúng loại
 * việc mà **cả người lẫn AI đều quên sạch**: quên đã migrate repo nào, ngày nào, bằng bản khung
 * nào, còn treo câu hỏi gì. Lần sau lại dò lại từ đầu, và lại vấp đúng chỗ cũ.
 *
 * Nguồn là `docs/migrations/*.md` — mỗi lần migrate MỘT file, chỉ thêm, không sửa file cũ. Trang
 * này chỉ đọc và xếp lại; nó KHÔNG giữ sự thật nào của riêng nó.
 *
 * MỖI HỒ SƠ IN RA CÙNG MỘT KHUÔN, và đó là điểm chính: cùng khuôn thì so sánh được giữa các lần,
 * và thiếu phần nào thì lộ ra ngay thay vì lẫn vào văn xuôi. Bốn phần cố định:
 *   trạng thái mới nhất · số đo trước→sau · báo cáo · câu hỏi mở
 *
 * BẢN RA CÓ COMMIT — `SO-MIGRATE-Ark-Repo-Harness.html` ở gốc repo, đứng cạnh bảng mẹ
 * `DASHBOARD-Ark-Repo-Harness.html`. Đức chốt 04/09: bảng ở dạng file HTML trong repo thì MỌI AI
 * đọc được và theo dõi được, không phải nhờ một phiên Claude đăng hộ lên claude.ai. Trước đó sổ
 * này chỉ tồn tại dạng artifact — và không ai kiểm được một artifact có còn khớp với hồ sơ hay không.
 *
 * ĐỔI LẠI, NỘI DUNG PHẢI SUY HOÀN TOÀN TỪ HEAD. Từ lúc được commit, file này nằm trong khối
 * `generators` của `.repo-structure.json`, nên cổng đóng phiên chạy `--check-head` MỖI PHIÊN.
 * Bộ sinh nhìn ĐỒNG HỒ thì sang ngày mới là bản sinh lại lệch bản đã commit **dù không một dữ
 * liệu nào đổi**, và MỌI phiên bị chặn đẩy. Bộ sinh đọc THƯ MỤC LÀM VIỆC thì file sửa dở của bất
 * kỳ phiên nào cũng làm trang lệch, và phiên bị chặn không hiểu vì sao — cái làm lệch không nằm
 * trong commit của họ. Nên: đọc HEAD (`nguonHEAD`), và mốc ngày lấy `mocHEAD()` của bảng mẹ.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Mượn của bảng mẹ, KHÔNG chép lại. `mocHEAD` fail-closed: không hỏi được git thì KHÔNG sinh,
// thay vì lùi về `new Date()` — mà cái lùi-về ấy đúng là cửa hậu đoạn trên vừa đóng. `TRANG_FILE`
// lấy về làm link "về bảng tổng quan": một nguồn duy nhất cho tên file bảng mẹ, nên đổi tên bên
// đó thì link bên này không chết âm thầm.
import { mocHEAD, TRANG_FILE as BANG_ME } from "./build-overview.mjs";
import { md, esc, tachFrontmatter } from "./md-mini.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
import { readHoSo, THU_MUC_MIGRATE } from "./overview-doc.mjs";

const THU_MUC = THU_MUC_MIGRATE;

/* HAI NGUỒN HỒ SƠ — và chỉ một trong hai được dùng cho bản đem commit.
 *
 * `nguonHEAD` là nguồn thật: "sinh" và "kiểm" phải hỏi CÙNG MỘT CÂU, nếu không hai bên trả lời
 * khác nhau và cổng đỏ mà không ai lần ra nguyên nhân. `nguonDia` chỉ để phép kiểm dựng kho giả
 * trong thư mục tạm — chỗ đó chưa có commit nào nên không có HEAD mà đọc. */
function nguonDia(root) {
  const thuMuc = path.join(root, ...THU_MUC.split("/"));
  return {
    liet: () => { try { return fs.readdirSync(thuMuc).filter((f) => f.endsWith(".md")).sort(); } catch { return []; } },
    doc: (f) => fs.readFileSync(path.join(thuMuc, f), "utf8")
  };
}

export function nguonHEAD(root = ROOT) {
  const gitRa = (...args) => execFileSync("git", ["-c", "core.quotepath=false", ...args],
    { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return {
    liet: () => {
      try {
        return gitRa("ls-tree", "-z", "--name-only", `HEAD:${THU_MUC}`)
          .split(String.fromCharCode(0)).filter((f) => f.endsWith(".md")).sort();
      } catch { return []; }
    },
    doc: (f) => gitRa("show", `HEAD:${THU_MUC}/${f}`)
  };
}

/* MỘT BỘ ĐỌC, HAI TRANG ĐỌC. Bộ đọc thật nằm ở `overview-doc.mjs` vì file đó **đi theo bản
 * trích** còn trang này thì ở lại — chiều phụ thuộc phải chảy từ thứ ở lại sang thứ đi theo.
 * Giữ tên cũ ở đây để mọi chỗ gọi cũ và phép kiểm cũ không phải đổi.
 *
 * Hai bộ đọc cùng một thư mục là hai bộ sẽ trôi khỏi nhau, và lúc chúng nói khác nhau thì
 * không ai biết tin bản nào — đúng cái bệnh cả bộ khung này sinh ra để chữa. */
export function docHoSo(root = ROOT, nguon = nguonDia(root)) {
  return readHoSo(nguon);
}

const DEN = { "xanh": "xanh", "đỏ": "do", "chưa chạy": "vang" };

export function khoiHoSo(h) {
  const fm = h.fm;
  const thieu = (k) => `<em class="thieu">chưa khai (${k})</em>`;
  const v = (k) => (fm[k] === undefined || fm[k] === "" ? thieu(k) : esc(String(fm[k])));
  const denClass = DEN[String(fm.cong_dong_phien ?? "").trim()] ?? "vang";
  const muc = fm.muc_truoc !== undefined && fm.muc_sau !== undefined
    ? `${esc(String(fm.muc_truoc))} → <strong>${esc(String(fm.muc_sau))}</strong>`
    : thieu("muc_truoc/muc_sau");

  return `<article class="ho-so">
  <header class="hs-dau">
    <div>
      <h2>${v("repo")}</h2>
      <div class="hs-meta">${v("ngay")} · bản khung <code>${v("ban_khung")}</code> · ${v("nghe")}</div>
    </div>
    <span class="den ${denClass}" title="cổng đóng phiên"></span>
  </header>
  <div class="hs-o">
    <div class="o"><b>${muc}</b><span>mức đạt chuẩn</span></div>
    <div class="o"><b>${v("loi_tim_ra")}</b><span>lỗi bộ khung tìm ra</span></div>
    <div class="o"><b>${v("cong_dong_phien")}</b><span>cổng đóng phiên</span></div>
    <div class="o"><b>${v("trang_thai")}</b><span>kết quả</span></div>
  </div>
  <div class="hs-do"><span>trước:</span> ${v("chi_phi_truoc")} &nbsp;·&nbsp; <span>sau:</span> ${v("chi_phi_sau")}</div>
  <div class="hs-than">${md(h.body)}</div>
  <div class="hs-chan">hồ sơ: <code>${esc(h.file)}</code> &nbsp;·&nbsp; repo: <code>${v("duong_dan")}</code></div>
</article>`;
}

export function trangSo(hoSo, ngay) {
  /* MỐC NGÀY LÀ THAM SỐ BẮT BUỘC, không có mặc định nhìn đồng hồ. Một mặc định `homNay()` vô
     hại đúng tới lúc trang được commit: từ lúc đó, sang ngày là bản sinh lại lệch bản đã commit
     **dù không dữ liệu nào đổi**, cổng đỏ, và mọi phiên bị chặn đẩy vì một ngày đã trôi qua.
     Chết ngay tại chỗ kèm tên nguyên nhân thì rẻ hơn một cổng đỏ không ai giải thích được. */
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(ngay))) {
    throw new Error(`NGAY_THIEU: trangSo() cần mốc ngày dạng YYYY-MM-DD, nhận "${ngay}". Trang này được commit nên mốc phải suy từ HEAD (mocHEAD()), không lấy từ đồng hồ.`);
  }
  const dem = hoSo.length;
  const chuaDong = hoSo.filter((h) => String(h.fm.cong_dong_phien ?? "").trim() !== "xanh").length;
  const than = dem
    ? hoSo.map(khoiHoSo).join(NL)
    : `<p class="trong">Chưa có lần migrate nào được ghi. Lần tới, làm theo bước 7 của
       <code>docs/protocols/CHUYEN-REPO-LEN-CHUAN.md</code>: thêm một file vào
       <code>${THU_MUC}/</code> rồi sinh lại trang này.</p>`;

  return `<title>Sổ Migrate</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
:root{
  --nen:#F7F5F0; --mat:#FFFFFF; --mat2:#EFEBE3; --vien:#DED8CC; --vien2:#C6BDAC;
  --chu:#1C1A16; --chu2:#4E483E; --mo:#7C7466;
  --nhan:#8A5A2B; --nhan-nen:#F3E7D6;
  --xanh:#2F6B4F; --vang:#8A6A12; --do:#8C3A34;
  --bong:0 1px 2px rgba(28,26,22,.05), 0 10px 28px -18px rgba(28,26,22,.28);
  --sans:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --disp:"Bricolage Grotesque","IBM Plex Sans",-apple-system,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --nen:#15130F; --mat:#1E1B16; --mat2:#282419; --vien:#38322A; --vien2:#4B4438;
  --chu:#F2EDE4; --chu2:#C7BFB2; --mo:#948B7C;
  --nhan:#D9A56B; --nhan-nen:#33261A;
  --xanh:#7EC49E; --vang:#D9BE6B; --do:#E0928A;
  --bong:0 1px 2px rgba(0,0,0,.5), 0 10px 28px -18px rgba(0,0,0,.8);
}}
:root[data-theme="dark"]{
  --nen:#15130F; --mat:#1E1B16; --mat2:#282419; --vien:#38322A; --vien2:#4B4438;
  --chu:#F2EDE4; --chu2:#C7BFB2; --mo:#948B7C;
  --nhan:#D9A56B; --nhan-nen:#33261A;
  --xanh:#7EC49E; --vang:#D9BE6B; --do:#E0928A;
  --bong:0 1px 2px rgba(0,0,0,.5), 0 10px 28px -18px rgba(0,0,0,.8);
}
*{box-sizing:border-box}
body{background:var(--nen);color:var(--chu);font-family:var(--sans);font-size:15px;
  line-height:1.62;margin:0;padding:clamp(18px,3vw,40px) clamp(14px,3vw,32px) 80px}
.wrap{max-width:980px;margin:0 auto}
h1,h2,h3,h4{font-family:var(--disp);margin:0;letter-spacing:-.018em;text-wrap:balance;color:var(--chu)}
h1{font-size:clamp(26px,4.2vw,40px);font-weight:800;line-height:1.05}
h2{font-size:clamp(18px,2.2vw,23px);font-weight:700}
h3{font-size:15.5px;font-weight:700;margin-top:18px}
p{margin:9px 0;max-width:70ch} ul,ol{margin:9px 0;padding-left:22px} li{margin:3px 0;max-width:70ch}
a{color:var(--nhan)}
code{font-family:var(--mono);font-size:.87em;background:var(--mat2);padding:.1em .34em;border-radius:3px;color:var(--chu2)}
blockquote{border-left:3px solid var(--nhan);background:var(--nhan-nen);margin:12px 0;
  padding:11px 15px;border-radius:0 8px 8px 0;color:var(--chu2)}
.tw{overflow-x:auto;border:1px solid var(--vien);border-radius:9px;margin:12px 0;background:var(--mat)}
table{border-collapse:collapse;width:100%;min-width:480px;font-size:13.4px}
th,td{text-align:left;padding:9px 14px;border-bottom:1px solid var(--vien);vertical-align:top}
th{font-family:var(--mono);font-size:10.4px;letter-spacing:.09em;text-transform:uppercase;
  color:var(--mo);background:var(--mat2);white-space:nowrap;font-weight:600}
header.dau{border-bottom:2px solid var(--chu);padding-bottom:16px;margin-bottom:18px}
.nhan-hang{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px;
  font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mo)}
.tong{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1px;
  background:var(--vien);border:1px solid var(--vien);border-radius:11px;overflow:hidden;margin:0 0 22px}
.tong .m{background:var(--mat);padding:14px 16px;display:flex;flex-direction:column;gap:4px}
.tong .nhan{font-family:var(--mono);font-size:10.2px;letter-spacing:.11em;text-transform:uppercase;color:var(--mo)}
.tong .gt{font-family:var(--disp);font-size:24px;font-weight:800;color:var(--nhan);font-variant-numeric:tabular-nums}
.ho-so{background:var(--mat);border:1px solid var(--vien);border-radius:12px;
  padding:clamp(15px,2.2vw,24px);margin:16px 0;box-shadow:var(--bong)}
.hs-dau{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;
  border-bottom:1px solid var(--vien);padding-bottom:12px;margin-bottom:14px}
.hs-meta{font-family:var(--mono);font-size:11.6px;color:var(--mo);margin-top:5px}
.den{width:16px;height:16px;border-radius:50%;flex:0 0 auto;margin-top:6px}
.den.xanh{background:var(--xanh)} .den.vang{background:var(--vang)} .den.do{background:var(--do)}
.hs-o{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:1px;
  background:var(--vien);border:1px solid var(--vien);border-radius:9px;overflow:hidden;margin-bottom:12px}
.hs-o .o{background:var(--mat2);padding:11px 13px;display:flex;flex-direction:column;gap:2px}
.hs-o .o b{font-family:var(--disp);font-size:17px;font-weight:800;color:var(--chu);line-height:1.2}
.hs-o .o span{font-size:11.6px;color:var(--mo)}
.hs-do{font-family:var(--mono);font-size:11.8px;color:var(--chu2);background:var(--mat2);
  border-radius:7px;padding:8px 12px;margin-bottom:6px}
.hs-do span{color:var(--mo);text-transform:uppercase;letter-spacing:.08em;font-size:10.2px}
.hs-chan{margin-top:14px;padding-top:11px;border-top:1px solid var(--vien);
  font-family:var(--mono);font-size:11px;color:var(--mo);word-break:break-all}
.thieu{color:var(--do);font-style:normal;font-family:var(--mono);font-size:.86em}
.trong{background:var(--mat);border:1px dashed var(--vien2);border-radius:11px;padding:22px;color:var(--mo)}
footer{border-top:1px solid var(--vien);margin-top:34px;padding-top:15px;
  display:flex;flex-wrap:wrap;gap:6px 20px;font-family:var(--mono);font-size:11.6px;color:var(--mo)}
</style>
<div class="wrap">
  <header class="dau">
    <div class="nhan-hang"><span>sinh ngày ${esc(ngay)}</span><span aria-hidden="true">·</span><a href="${esc(BANG_ME)}">← bảng tổng quan</a></div>
    <h1>Sổ Migrate</h1>
    <p style="color:var(--chu2);font-size:16.5px;max-width:66ch">
      Mỗi lần đưa một repo lên chuẩn để lại đúng một hồ sơ ở đây, cùng một khuôn. Việc này xảy ra
      thưa, nên nếu không ghi thì <strong>cả người lẫn AI đều quên sạch</strong> — quên đã làm repo
      nào, ngày nào, bằng bản khung nào, và còn treo câu hỏi gì.
    </p>
  </header>
  <div class="tong">
    <div class="m"><span class="nhan">đã migrate</span><span class="gt">${dem}</span></div>
    <div class="m"><span class="nhan">còn treo</span><span class="gt">${chuaDong}</span></div>
    <div class="m"><span class="nhan">hồ sơ mới nhất</span><span class="gt" style="font-size:16px">${esc(String(hoSo[0]?.fm?.ngay ?? "—"))}</span></div>
  </div>
  ${than}
  <footer>
    <span>sinh ngày ${esc(ngay)} — không gõ tay</span>
    <span>nguồn: ${THU_MUC}/</span>
  </footer>
</div>`;
}

/* ---- chạy ------------------------------------------------------------------ */

/* TÊN FILE MANG TÊN DỰ ÁN, cùng lý do bảng mẹ mang tên dự án (Đức chốt 04/09): mỗi repo sinh ra
   một sổ, cả đống cùng rơi vào một thư mục Tải về, và ba file tên `SO-MIGRATE.html` thì mở cái
   nào cũng phải đoán. Viết cứng chứ không suy từ `.repo-structure.json`: file này không nằm
   trong bộ khung đem phát, nên suy tự động chỉ thêm một đường hỏng. */
export const TRANG_FILE = "SO-MIGRATE-Ark-Repo-Harness.html";

/* MỘT chỗ duy nhất dựng ra trang, dùng cho CẢ sinh lẫn kiểm. Hai đường dựng riêng thì sớm muộn
   lệch nhau, và bên lệch sẽ là bên chỉ chạy ở cổng — tức bên không ai đọc kết quả. */
export function sinh() {
  const hoSo = docHoSo(ROOT, nguonHEAD());
  return { hoSo, html: trangSo(hoSo, mocHEAD()) };
}

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const args = process.argv.slice(2);

  if (args.includes("--check-head")) {
    // Cổng đóng phiên gọi đúng nhánh này. Nó hỏi MỘT câu: bản đã commit có còn đúng với HEAD
    // không. Cả hai vế đều dựng từ HEAD, nên việc sửa dở của bất kỳ phiên nào cũng không lọt vào.
    let dangCo = null;
    try {
      dangCo = execFileSync("git", ["-c", "core.quotepath=false", "show", `HEAD:${TRANG_FILE}`],
        { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (_) { dangCo = null; }
    if (dangCo === null) {
      console.error(`THIEU_TRANG: ${TRANG_FILE} chưa có trong HEAD. Sinh rồi commit: node scripts/build-so-migrate.mjs`);
      process.exit(1);
    }
    if (sinh().html !== dangCo) {
      console.error(`TRANG_CU: ${TRANG_FILE} đã commit không khớp với HEAD. Sinh lại rồi commit: node scripts/build-so-migrate.mjs`);
      process.exit(1);
    }
    console.log(`${TRANG_FILE} khớp với HEAD.`);
    process.exit(0);
  }

  /* PHẢI ĐƯA ĐƯỜNG DẪN, từ bản 1.3.20. Trước đây không đưa thì nó ghi vào gốc repo — nhưng
   * Đức chốt 06/09 *"chỉ maintain tab Migrate"*, nên trang này **không còn là artifact repo phải
   * giữ tươi**: nó đã rời khỏi `generators` và `generated` của `.repo-structure.json`.
   *
   * Giữ mặc định cũ là gài bẫy: một phiên chạy quen tay sẽ đẻ ra một file KHÔNG AI KHAI ở gốc
   * repo, và cổng đóng phiên đỏ với câu "file mới chưa khai vào Bản đồ file" — đúng, nhưng không
   * nói gì về nguyên nhân thật. Bắt đưa đường dẫn thì lỗi xảy ra ở chỗ người ta hiểu được. */
  const ra = args.find((a) => !a.startsWith("--"));
  if (!ra) {
    console.error("THIEU_DUONG_DAN: trang này không còn là artifact của repo (Đức chốt 06/09 — sổ migrate nay là TAB của bảng).");
    console.error("Cần một bản in riêng để gửi cho ai đó thì nói rõ ghi vào đâu:");
    console.error("  node scripts/build-so-migrate.mjs <đường-dẫn-file.html>");
    console.error(`Bản cuối từng có commit nằm ở docs/archive/${TRANG_FILE}.`);
    process.exit(2);
  }
  const { hoSo, html } = sinh();
  fs.writeFileSync(path.resolve(ra), html, "utf8");
  console.log(`Đã sinh ${ra} — ${hoSo.length} hồ sơ migrate · mốc HEAD ${mocHEAD()}.`);
}
