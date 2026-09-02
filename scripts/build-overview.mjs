/* BẢNG TỔNG QUAN — một layout dùng chung cho MỌI repo dựng từ harness.
 *
 *   node scripts/build-overview.mjs <file-ra.html>
 *
 * Vì sao layout này ở trong harness chứ không viết lại mỗi lần: mỗi repo tự nghĩ ra một cách bày
 * là 21 repo có 21 cách đọc, và người xem phải học lại từ đầu ở mỗi chỗ. Cùng một khung tab thì
 * nhìn repo nào cũng biết mục nào ở đâu.
 *
 * MỌI PHẦN ĐỌC TỪ FILE, không gõ vào đây:
 *   package.json            -> tên · phiên bản · danh sách lệnh (tức FEATURE LIST)
 *   AGENTS.md mục 6         -> bảng "khi bạn sắp… thì mở file nào"
 *   docs/workflows/*.md     -> workflow, kèm lưu đồ mermaid
 *   docs/protocols/*.md     -> protocol
 *   docs/adr/*.md           -> quyết định đã chốt
 *   docs/LEGEND.md          -> tra cứu từ
 *   CHANGELOG.md            -> nhật ký, gập được
 * Thiếu file nào thì mục đó **biến mất êm**, không vỡ trang — repo khác sẽ không có đủ cả bảy.
 *
 * BẢN RA KHÔNG COMMIT: nó để publish và tự in ngày sinh.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { esc, md, tachFrontmatter } from "./md-mini.mjs";

const NL = String.fromCharCode(10);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const doc = (rel) => { try { return fs.readFileSync(path.join(ROOT, ...rel.split("/")), "utf8"); } catch (_) { return null; } };
const liet = (rel) => { try { return fs.readdirSync(path.join(ROOT, ...rel.split("/"))).filter((f) => f.endsWith(".md")).sort(); } catch (_) { return []; } };
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ---- gom dữ liệu ----------------------------------------------------------- */

export function docTaiLieu(thuMuc) {
  return liet(thuMuc).map((f) => {
    const { fm, than } = tachFrontmatter(doc(`${thuMuc}/${f}`) || "");
    const tieuDe = (than.split(CR).join("").split(NL).find((l) => l.startsWith("# ")) || `# ${f}`).slice(2).trim();
    return { file: f, fm, than, tieuDe };
  });
}
const CR = String.fromCharCode(13);

/* Bảng mục 6 của AGENTS.md = danh sách "làm được gì". Đọc từ đó thay vì gõ lại: bảng ấy vốn đã
   là hợp đồng giữa repo và mọi phiên AI, nên nó không bao giờ cũ hơn thực tế. */
export function docBanDo(luat) {
  if (!luat) return [];
  const dong = luat.split(CR).join("").split(NL);
  const dau = dong.findIndex((l) => l.startsWith("## 6."));
  if (dau < 0) return [];
  const het = dong.findIndex((l, i) => i > dau && l.startsWith("## 7."));
  return dong.slice(dau, het < 0 ? dong.length : het)
    .filter((l) => l.startsWith("|") && !/^\|[\s:|-]+\|?\s*$/.test(l) && !/^\|\s*Khi bạn sắp/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .filter((c) => c.length >= 2 && c[0]);
}

/* Nhật ký: mỗi khối `## <bản> — <ngày> — <một câu>`. Bản đầu mở sẵn, các bản cũ gập lại — người
   xem quan tâm "vừa đổi gì", không phải toàn bộ lịch sử. */
export function tachNhatKy(text) {
  if (!text) return [];
  const dong = text.split(CR).join("").split(NL);
  const ra = [];
  let hien = null;
  for (const l of dong) {
    const m = l.match(/^##\s+(\S+)\s+—\s+(\S+)\s+—\s+(.*)$/);
    if (m) { hien = { ban: m[1], ngay: m[2], tomTat: m[3], than: [] }; ra.push(hien); continue; }
    if (hien) hien.than.push(l);
  }
  return ra.map((k) => ({ ...k, than: k.than.join(NL).trim() }));
}

/* ---- trang ----------------------------------------------------------------- */

const CSS = `
:root{
  --nen:#F7F5F0; --mat:#FFFFFF; --mat2:#EFEBE3; --vien:#DED8CC; --vien2:#C6BDAC;
  --chu:#1C1A16; --chu2:#4E483E; --mo:#7C7466;
  --nhan:#8A5A2B; --nhan-nen:#F3E7D6;
  --xanh:#2F6B4F; --xanh-nen:#DFEDE4;
  --vang:#8A6A12; --vang-nen:#F6EBCE;
  --do:#8C3A34; --do-nen:#F6E0DC;
  --bong:0 1px 2px rgba(28,26,22,.05), 0 10px 28px -18px rgba(28,26,22,.28);
  --sans:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --disp:"Bricolage Grotesque","IBM Plex Sans",-apple-system,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --nen:#15130F; --mat:#1E1B16; --mat2:#282419; --vien:#38322A; --vien2:#4B4438;
  --chu:#F2EDE4; --chu2:#C7BFB2; --mo:#948B7C;
  --nhan:#D9A56B; --nhan-nen:#33261A;
  --xanh:#7EC49E; --xanh-nen:#18291F;
  --vang:#D9BE6B; --vang-nen:#2C2515;
  --do:#E0928A; --do-nen:#331D1A;
  --bong:0 1px 2px rgba(0,0,0,.5), 0 10px 28px -18px rgba(0,0,0,.8);
}}
:root[data-theme="dark"]{
  --nen:#15130F; --mat:#1E1B16; --mat2:#282419; --vien:#38322A; --vien2:#4B4438;
  --chu:#F2EDE4; --chu2:#C7BFB2; --mo:#948B7C;
  --nhan:#D9A56B; --nhan-nen:#33261A;
  --xanh:#7EC49E; --xanh-nen:#18291F;
  --vang:#D9BE6B; --vang-nen:#2C2515;
  --do:#E0928A; --do-nen:#331D1A;
  --bong:0 1px 2px rgba(0,0,0,.5), 0 10px 28px -18px rgba(0,0,0,.8);
}
*{box-sizing:border-box}
body{background:var(--nen);color:var(--chu);font-family:var(--sans);font-size:15px;
  line-height:1.62;margin:0;padding:clamp(18px,3vw,40px) clamp(14px,3vw,32px) 80px}
.wrap{max-width:1080px;margin:0 auto}
h1,h2,h3,h4,h5{font-family:var(--disp);margin:0;letter-spacing:-.018em;text-wrap:balance;color:var(--chu)}
h1{font-size:clamp(27px,4.4vw,42px);font-weight:800;line-height:1.05}
h2{font-size:clamp(18px,2.2vw,22px);font-weight:700;margin-top:26px}
h3{font-size:16px;font-weight:700;margin-top:20px}
h4,h5{font-size:14px;font-weight:600;margin-top:16px;color:var(--chu2)}
p{margin:9px 0;max-width:70ch}
ul,ol{margin:9px 0;padding-left:22px}
li{margin:3px 0;max-width:70ch}
a{color:var(--nhan)}
code{font-family:var(--mono);font-size:.87em;background:var(--mat2);padding:.1em .34em;border-radius:3px;color:var(--chu2)}
.ref{font-family:var(--mono);font-size:.87em;color:var(--nhan)}
pre.code{background:var(--mat2);border:1px solid var(--vien);border-radius:8px;padding:13px 15px;
  overflow-x:auto;margin:11px 0}
pre.code code{background:none;padding:0;font-size:12.8px;color:var(--chu)}
pre.mermaid{background:var(--mat);border:1px solid var(--vien);border-radius:10px;padding:16px;
  overflow-x:auto;margin:14px 0;text-align:center}
blockquote{border-left:3px solid var(--nhan);background:var(--nhan-nen);margin:12px 0;
  padding:11px 15px;border-radius:0 8px 8px 0;color:var(--chu2)}
blockquote code{background:rgba(0,0,0,.06)}
.tw{overflow-x:auto;border:1px solid var(--vien);border-radius:9px;margin:12px 0;background:var(--mat)}
table{border-collapse:collapse;width:100%;min-width:520px;font-size:13.4px}
th,td{text-align:left;padding:9px 14px;border-bottom:1px solid var(--vien);vertical-align:top}
th{font-family:var(--mono);font-size:10.4px;letter-spacing:.09em;text-transform:uppercase;
  color:var(--mo);background:var(--mat2);white-space:nowrap;font-weight:600}
tr:last-child td{border-bottom:none}

header{border-bottom:2px solid var(--chu);padding-bottom:18px;margin-bottom:6px;
  display:flex;flex-direction:column;gap:10px}
.nhan-hang{display:flex;flex-wrap:wrap;gap:8px;align-items:center;
  font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mo)}
.chip{font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.04em;
  padding:3px 9px;border-radius:20px;background:var(--nhan-nen);color:var(--nhan);text-transform:none}
.chip.ok{background:var(--xanh-nen);color:var(--xanh)}
.chip.canh{background:var(--vang-nen);color:var(--vang)}

nav.tabs{display:flex;flex-wrap:wrap;gap:5px;margin:20px 0 4px;position:sticky;top:0;z-index:5;
  background:var(--nen);padding:8px 0;border-bottom:1px solid var(--vien)}
nav.tabs button{font-family:var(--sans);font-size:13.4px;font-weight:600;cursor:pointer;
  border:1px solid transparent;background:none;color:var(--mo);padding:7px 13px;border-radius:8px}
nav.tabs button:hover{color:var(--chu);background:var(--mat2)}
nav.tabs button[aria-selected="true"]{background:var(--mat);color:var(--chu);
  border-color:var(--vien);box-shadow:var(--bong)}
nav.tabs button:focus-visible{outline:2px solid var(--nhan);outline-offset:2px}

section.tab{padding-top:14px}
.the{background:var(--mat);border:1px solid var(--vien);border-radius:11px;
  padding:clamp(15px,2.2vw,22px);margin:14px 0;box-shadow:var(--bong)}
.the > h2:first-child, .the > h3:first-child{margin-top:0}
.luoi{display:grid;grid-template-columns:repeat(auto-fit,minmax(146px,1fr));gap:1px;
  background:var(--vien);border:1px solid var(--vien);border-radius:9px;overflow:hidden;margin:14px 0}
.o{background:var(--mat);padding:13px 15px;display:flex;flex-direction:column;gap:3px}
.o b{font-family:var(--disp);font-size:27px;font-weight:800;line-height:1;color:var(--nhan);
  font-variant-numeric:tabular-nums}
.o span{font-size:12.2px;color:var(--mo);line-height:1.34}
.o.ok b{color:var(--xanh)} .o.canh b{color:var(--vang)} .o.thieu b{color:var(--do)}

.muc-luc{background:var(--mat2);border:1px solid var(--vien);border-radius:9px;padding:12px 16px;margin:12px 0}
.muc-luc div{font-family:var(--mono);font-size:10.4px;letter-spacing:.09em;text-transform:uppercase;
  color:var(--mo);margin-bottom:6px}
.muc-luc ul{margin:0;padding-left:18px;columns:2;column-gap:26px}
.muc-luc li{font-size:13px;break-inside:avoid}
.muc-luc a{color:var(--chu2);text-decoration:none;border-bottom:1px solid var(--vien2)}
.muc-luc a:hover{color:var(--nhan);border-color:var(--nhan)}

details{background:var(--mat);border:1px solid var(--vien);border-radius:10px;margin:10px 0;
  padding:0 16px;box-shadow:var(--bong)}
details[open]{padding-bottom:12px}
summary{cursor:pointer;padding:13px 0;font-weight:600;font-family:var(--disp);font-size:15px;
  display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
summary:hover{color:var(--nhan)}
summary::marker{color:var(--mo)}
summary .ngay{font-family:var(--mono);font-size:11.5px;color:var(--mo);font-weight:400}
summary .tt{font-size:13.2px;color:var(--chu2);font-weight:400}

footer{border-top:1px solid var(--vien);margin-top:34px;padding-top:15px;
  display:flex;flex-wrap:wrap;gap:6px 20px;font-family:var(--mono);font-size:11.6px;color:var(--mo)}
@media (max-width:640px){ .muc-luc ul{columns:1} nav.tabs{position:static} }
@media (prefers-reduced-motion:no-preference){ section.tab{animation:hien .18s ease-out} }
@keyframes hien{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
`;

const JS = `
(function(){
  var nut = [].slice.call(document.querySelectorAll('nav.tabs button'));
  var mucs = [].slice.call(document.querySelectorAll('section.tab'));
  function chon(id, luu){
    nut.forEach(function(b){ b.setAttribute('aria-selected', String(b.dataset.tab === id)); });
    mucs.forEach(function(s){ s.hidden = (s.id !== 'tab-' + id); });
    if (luu) { try { location.hash = id; } catch(e){} }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  nut.forEach(function(b){ b.addEventListener('click', function(){ chon(b.dataset.tab, true); }); });
  var dau = (location.hash || '').replace('#','');
  chon(nut.some(function(b){ return b.dataset.tab === dau; }) ? dau : nut[0].dataset.tab, false);
  // Mục lục nhảy trong cùng tab
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('.muc-luc a');
    if (!a) return;
    var d = document.getElementById(a.getAttribute('href').slice(1));
    if (d) { e.preventDefault(); d.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
})();
`;

function mucLuc(muc) {
  if (muc.length < 3) return "";
  return `<div class="muc-luc"><div>Mục lục</div><ul>${
    muc.map((m) => `<li><a href="#${m.id}">${esc(m.ten)}</a></li>`).join("")}</ul></div>`;
}

export function trang(dl) {
  const { ten, ban, ngay, so, lenh, banDo, workflows, protocols, adrs, legend, nhatKy, huongDan } = dl;

  const tabs = [
    ["tong-quan", "Tổng quan"],
    ["kien-truc", "Kiến trúc"],
    ["tinh-nang", "Tính năng"],
    ["workflow", "Workflow"],
    ["protocol", "Protocol"],
    ["huong-dan", "Hướng dẫn"],
    ["tra-cuu", "Tra cứu"],
    ["nhat-ky", "Nhật ký"]
  ].filter(([id]) => {
    if (id === "workflow") return workflows.length > 0;
    if (id === "protocol") return protocols.length > 0 || adrs.length > 0;
    if (id === "tra-cuu") return Boolean(legend);
    if (id === "nhat-ky") return nhatKy.length > 0;
    if (id === "huong-dan") return Boolean(huongDan);
    return true;
  });

  const oSo = so.map((s) => `<div class="o ${s.mau || ""}"><b>${esc(s.so)}</b><span>${s.nhan}</span></div>`).join("");

  const tabWorkflow = workflows.map((w) => `
      <div class="the" id="wf-${slug(w.file)}">
        <h2>${esc(w.tieuDe)}</h2>
        <div class="nhan-hang">
          ${w.fm.ai_chay ? `<span class="chip">ai chạy: ${esc(w.fm.ai_chay)}</span>` : ""}
          ${w.fm.mat ? `<span class="chip">mất: ${esc(w.fm.mat)}</span>` : ""}
        </div>
        ${md(w.than.split(NL).filter((l) => !l.startsWith("# ")).join(NL))}
      </div>`).join("");

  const tabProtocol = `
      ${protocols.length ? `<div class="the"><h2>Protocol</h2>
        <p>Quy trình có các bước cụ thể và phép nghiệm thu bằng máy. Khác với workflow ở chỗ nó
        nói <em>làm thế nào cho đúng</em>, còn workflow nói <em>đi qua những bước nào</em>.</p>
        ${protocols.map((p) => `<h3 id="pr-${slug(p.file)}">${esc(p.tieuDe)}</h3>${md(p.than.split(NL).filter((l) => !l.startsWith("# ")).slice(0, 14).join(NL))}<p><span class="ref">docs/protocols/${esc(p.file)}</span></p>`).join("")}
      </div>` : ""}
      ${adrs.length ? `<div class="the"><h2>Quyết định đã chốt</h2>
        <p>Mỗi quyết định một file, <strong>không sửa lại</strong>. Đổi ý thì viết quyết định mới
        thay thế cái cũ, để sáu tháng sau còn đọc được vì sao lúc đó chọn thế.</p>
        <div class="tw"><table><thead><tr><th>Quyết định</th><th>Trạng thái</th><th>Ngày</th></tr></thead><tbody>
        ${adrs.map((a) => `<tr><td>${esc(a.tieuDe)}</td><td>${esc(a.fm.status || "—")}</td><td>${esc(a.fm.date || "—")}</td></tr>`).join("")}
        </tbody></table></div>
      </div>` : ""}`;

  return `<title>${esc(ten)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>${CSS}</style>
<div class="wrap">
  <header>
    <div class="nhan-hang">
      <span class="chip">v${esc(ban)}</span>
      <span>sinh ngày ${esc(ngay)}</span>
      <span class="chip canh">chưa migrate repo thật nào</span>
    </div>
    <h1>${esc(ten)}</h1>
    <p style="color:var(--chu2);font-size:16.5px">
      Một bộ khung repo dùng lại được: luật, gate, generator, và công cụ đưa repo khác lên chuẩn.
      Trang này <strong>sinh từ chính repo</strong> — không gõ tay, nên không thể nói khác thực tế.
    </p>
  </header>

  <nav class="tabs" role="tablist">
    ${tabs.map(([id, ten2]) => `<button role="tab" data-tab="${id}" aria-selected="false">${esc(ten2)}</button>`).join("")}
  </nav>

  <section class="tab" id="tab-tong-quan" hidden>
    <div class="luoi">${oSo}</div>
    <div class="the">
      <h2>Nó làm được gì mà một repo trống không làm được</h2>
      <h3>Chặn việc dở dang</h3>
      <p>Session gate chạy suite, đối chiếu artifact với lịch sử git, và kiểm ai được ghi vùng nào.
      Đỏ thì chưa xong — không có đường vòng, và không được nới gate cho nó xanh.</p>
      <h3>Nhiều AI, một repo</h3>
      <p>Một area, một claim, một lúc. Công cụ push từ chối cuốn theo commit của phiên khác, và mỗi
      commit mang lane của phiên đã làm ra nó.</p>
      <h3>Bảng không nói dối</h3>
      <p>Artifact sinh hoàn toàn từ lịch sử git. Gate đối chiếu lại mỗi phiên, nên một trang cũ
      không thể lặng lẽ cũ.</p>
    </div>
    <div class="the">
      <h2>Bắt đầu trong hai lệnh</h2>
      ${md("```bash" + NL + "node scripts/init-repo.mjs <thư-mục> --ten \"Tên repo\"   # repo mới" + NL + "node scripts/assess.mjs <thư-mục>                       # repo đang sống" + NL + "```")}
      <blockquote>Repo đang có việc thì <strong>đo trước, đừng thả bừa</strong>. Kiểm thì rẻ, chuyển thì đắt.</blockquote>
    </div>
  </section>

  <section class="tab" id="tab-kien-truc" hidden>
    <div class="the">
      <h2>Bốn tầng, và chúng được đối xử khác nhau</h2>
      ${md(["```mermaid", "flowchart LR", '  L["LAW<br/>luật · vai · kiến trúc"] --> S["STATE<br/>trạng thái · bàn giao"]',
        '  S --> G["GENERATED<br/>bảng · bản đồ máy đọc"]', '  E["EVIDENCE<br/>bằng chứng · quyết định"]',
        "  L -.- E", "```"].join(NL))}
      ${md(["| Tầng | Ai ghi | Đổi khi nào | Luật |", "|---|---|---|---|",
        "| **LAW** | người | vài tháng | sửa thì phải nêu lý do |",
        "| **STATE** | người | mỗi phiên | chỉ thêm dòng vào HANDOFF |",
        "| **GENERATED** | **máy** | mỗi lần sinh | **không sửa tay**, sửa là mất ở lần sinh sau |",
        "| **EVIDENCE** | bất biến | không bao giờ | **chỉ thêm**, không sửa, không xoá |"].join(NL))}
    </div>
    <div class="the">
      <h2>Cái gì đi theo bản trích, cái gì ở lại repo nhà</h2>
      <p>Câu hỏi duy nhất để phân loại: <em>repo đích có cần thứ này để TỰ SỐNG không?</em>
      Repo đích cần <strong>sống theo</strong> chuẩn, không cần <strong>phát hành</strong> chuẩn.</p>
      ${md(["| Ở repo nhà | Đi theo bản trích |", "|---|---|",
        "| `build-template` — nguồn của chuẩn | 5 công cụ vận hành |",
        "| `assess` — đo repo khác | luật ba tầng + bản mẫu |",
        "| `init-repo` — dựng repo mới | suite seed |",
        "| protocol kiểm & migrate | cấu hình hình dạng repo |"].join(NL))}
    </div>
  </section>

  <section class="tab" id="tab-tinh-nang" hidden>
    ${mucLuc([{ id: "tn-lenh", ten: "Lệnh chạy được" }, { id: "tn-bando", ten: "Khi bạn sắp… mở file nào" }])}
    <div class="the" id="tn-lenh">
      <h2>Lệnh chạy được</h2>
      <p>Đọc thẳng từ <code>package.json</code>, nên danh sách này không bao giờ cũ hơn thực tế.</p>
      <div class="tw"><table><thead><tr><th>Lệnh</th><th>Chạy gì</th></tr></thead><tbody>
      ${lenh.map(([k, v]) => `<tr><td><code>npm run ${esc(k)}</code></td><td><code>${esc(v)}</code></td></tr>`).join("")}
      </tbody></table></div>
    </div>
    <div class="the" id="tn-bando">
      <h2>Khi bạn sắp… thì mở file nào</h2>
      <p>Đây là bản đồ điều hướng của repo, đọc từ mục 6 của <code>AGENTS.md</code> — cùng một bảng
      mà mọi phiên AI đọc lúc mở phiên.</p>
      <div class="tw"><table><thead><tr><th>Khi bạn sắp…</th><th>Mở cái gì</th></tr></thead><tbody>
      ${banDo.map((r) => `<tr><td>${md(r[0]).replace(/^<p>|<\/p>$/g, "")}</td><td>${md(r.slice(1).join(" · ")).replace(/^<p>|<\/p>$/g, "")}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
  </section>

  ${workflows.length ? `<section class="tab" id="tab-workflow" hidden>
    ${mucLuc(workflows.map((w) => ({ id: `wf-${slug(w.file)}`, ten: w.fm.ten || w.tieuDe })))}
    ${tabWorkflow}
  </section>` : ""}

  ${(protocols.length || adrs.length) ? `<section class="tab" id="tab-protocol" hidden>${tabProtocol}</section>` : ""}

  ${huongDan ? `<section class="tab" id="tab-huong-dan" hidden><div class="the">${md(huongDan)}</div></section>` : ""}

  ${legend ? `<section class="tab" id="tab-tra-cuu" hidden><div class="the">${md(legend)}</div></section>` : ""}

  ${nhatKy.length ? `<section class="tab" id="tab-nhat-ky" hidden>
    <div class="the"><h2>Nhật ký</h2>
    <p>Bản mới nhất mở sẵn. Bấm để xem các bản cũ.</p></div>
    ${nhatKy.map((k, idx) => `<details${idx === 0 ? " open" : ""}>
      <summary><strong>v${esc(k.ban)}</strong><span class="ngay">${esc(k.ngay)}</span><span class="tt">${esc(k.tomTat)}</span></summary>
      ${md(k.than)}
    </details>`).join("")}
  </section>` : ""}

  <footer>
    <span>${esc(ten)} v${esc(ban)}</span>
    <span>sinh ngày ${esc(ngay)} — không gõ tay</span>
    <span>mọi con số đọc từ repo</span>
  </footer>
</div>
<script>${JS}</script>
`;
}

/* ---- chạy ------------------------------------------------------------------ */

export function gomDuLieu() {
  const pkg = JSON.parse(doc("package.json") || "{}");
  // Tên NGƯỜI ĐỌC lấy từ `.repo-structure.json`, không lấy `package.json.name`. Cái sau là tên
  // gói npm — chữ thường, gạch nối — và in nó lên đầu một trang cho người xem thì vừa xấu vừa
  // sai đối tượng. Không khai thì lùi về tên gói, còn hơn để trống.
  let tenNguoi = null;
  try { tenNguoi = JSON.parse(doc(".repo-structure.json") || "{}")?.repo?.name || null; } catch (_) { tenNguoi = null; }
  const nhatKy = tachNhatKy(doc("CHANGELOG.md"));
  const workflows = docTaiLieu("docs/workflows");
  const protocols = docTaiLieu("docs/protocols");
  const adrs = docTaiLieu("docs/adr");
  const legendRaw = doc("docs/LEGEND.md");
  const huongDanRaw = doc("docs/HUONG-DAN.md");
  const soTest = (doc("package.json") ? Object.keys(pkg.scripts || {}).filter((k) => k.startsWith("test")).length : 0);
  return {
    ten: tenNguoi || pkg.name || "Repo",
    ban: pkg.version || "0.0.0",
    ngay: new Date().toISOString().slice(0, 10),
    lenh: Object.entries(pkg.scripts || {}),
    banDo: docBanDo(doc("AGENTS.md")),
    workflows, protocols, adrs, nhatKy,
    legend: legendRaw ? tachFrontmatter(legendRaw).than : null,
    huongDan: huongDanRaw ? tachFrontmatter(huongDanRaw).than : null,
    so: [
      { so: workflows.length, nhan: "workflow có lưu đồ", mau: "ok" },
      { so: protocols.length, nhan: "protocol", mau: "ok" },
      { so: adrs.length, nhan: "quyết định đã chốt", mau: "ok" },
      { so: Object.keys(pkg.scripts || {}).length, nhan: "lệnh chạy được", mau: "ok" },
      { so: soTest, nhan: "nhóm test", mau: "ok" },
      { so: 0, nhan: "repo khác nghề đã thử", mau: "thieu" }
    ]
  };
}

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const ra = process.argv[2];
  if (!ra) { console.error("Dùng: node scripts/build-overview.mjs <file-ra.html>"); process.exit(2); }
  const dl = gomDuLieu();
  fs.mkdirSync(path.dirname(path.resolve(ra)), { recursive: true });
  fs.writeFileSync(path.resolve(ra), trang(dl), "utf8");
  console.log(`Đã sinh ${ra} — v${dl.ban} · ${dl.workflows.length} workflow · ${dl.protocols.length} protocol · ${dl.adrs.length} quyết định · ${dl.lenh.length} lệnh.`);
}
