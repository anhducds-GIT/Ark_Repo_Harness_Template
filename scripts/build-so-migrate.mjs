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
 * KHÔNG COMMIT FILE HTML SINH RA. Nó là ảnh chụp một lúc; hồ sơ mới là tài liệu.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { md, esc, tachFrontmatter } from "./md-mini.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);
const THU_MUC = "docs/migrations";

/* Ngày theo đồng hồ MÁY NÀY, không phải UTC — sinh lúc 0h30 giờ Việt Nam thì `toISOString()`
   trả ngày HÔM QUA, và trang tự khai sai tuổi ngay dòng đầu. Lỗi này đã xảy ra thật hai lần. */
function homNay() {
  const x = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${z(x.getMonth() + 1)}-${z(x.getDate())}`;
}

export function docHoSo(root = ROOT) {
  const thuMuc = path.join(root, ...THU_MUC.split("/"));
  let ten;
  try { ten = fs.readdirSync(thuMuc).filter((f) => f.endsWith(".md")); } catch { return []; }
  const ra = [];
  for (const f of ten) {
    const raw = fs.readFileSync(path.join(thuMuc, f), "utf8");
    // `tachFrontmatter` tra ve `than`, khong phai `body`. Destructure sai ten thi `body` la
    // undefined, roi `body ?? raw` nga ve CA FILE — nen frontmatter bi in lai trong than bai.
    const { fm, than } = tachFrontmatter(raw);
    // Hồ sơ thiếu `repo` hoặc `ngay` thì KHÔNG bỏ qua im lặng — nó vẫn hiện, và tự khai là
    // thiếu. Bỏ qua im lặng nghĩa là một lần migrate biến mất khỏi lịch sử, đúng thứ sổ này
    // sinh ra để chặn.
    ra.push({ file: `${THU_MUC}/${f}`, fm: fm ?? {}, body: than ?? raw });
  }
  // Mới nhất lên đầu: người mở sổ gần như luôn hỏi "lần gần nhất thế nào".
  return ra.sort((a, b) => String(b.fm.ngay ?? "").localeCompare(String(a.fm.ngay ?? "")));
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

export function trangSo(hoSo, ngay = homNay()) {
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
    <div class="nhan-hang"><span>sinh ngày ${esc(ngay)}</span></div>
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

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const ra = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!ra) {
    console.error("Dùng: node scripts/build-so-migrate.mjs <file-ra.html>");
    process.exit(2);
  }
  const hoSo = docHoSo();
  fs.writeFileSync(path.resolve(ra), trangSo(hoSo), "utf8");
  console.log(`Đã sinh ${ra} — ${hoSo.length} hồ sơ migrate.`);
}
