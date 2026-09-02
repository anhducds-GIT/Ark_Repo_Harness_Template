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

import { execSync } from "node:child_process";
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

/* Banner "trang có thể đã cũ" — đỏ, chiếm trọn dòng đầu, chỉ hiện khi quá 7 ngày.
   Trang là file tĩnh đem publish, nên nó PHẢI tự biết mình bao nhiêu tuổi ở lúc XEM,
   không phải lúc sinh. Ngày sinh thì luôn hiện, kể cả khi còn mới. */
.cu{display:none;background:#FBE3E0;color:#8C3A34;border:1px solid #E7B8B2;border-radius:9px;
  padding:11px 16px;margin:0 0 16px;font-weight:600;font-size:14px;text-align:center}
.cu[data-hien="1"]{display:block}
:root:not([data-theme="light"]) .cu{background:#3A1D1A;color:#E8A29A;border-color:#5C302A}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .cu{background:#FBE3E0;color:#8C3A34;border-color:#E7B8B2}}

.nn{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1px;
  background:var(--vien);border:1px solid var(--vien);border-radius:11px;overflow:hidden;margin:0 0 16px}
.nn .m{background:var(--mat);padding:15px 17px;display:flex;flex-direction:column;gap:5px}
.nn .m.viec{background:var(--vang-nen)}
.nn .nhan{font-family:var(--mono);font-size:10.2px;letter-spacing:.11em;text-transform:uppercase;color:var(--mo)}
.nn .m.viec .nhan{color:var(--vang)}
.nn .gt{font-size:15px;font-weight:600;line-height:1.35;color:var(--chu)}
.nn .gt.to{font-family:var(--disp);font-size:21px;font-weight:800;letter-spacing:-.02em}

.vong{display:flex;align-items:center;gap:0;margin:6px 0 2px;overflow-x:auto;padding:6px 0}
.vong .b{display:flex;flex-direction:column;align-items:center;gap:7px;flex:1;min-width:82px}
.vong .cham{width:15px;height:15px;border-radius:50%;background:var(--vien2);border:3px solid var(--mat)}
.vong .b.qua .cham{background:var(--xanh)}
.vong .b.nay .cham{background:var(--mat);border-color:var(--nhan);box-shadow:0 0 0 4px var(--nhan-nen)}
.vong .ten{font-family:var(--mono);font-size:10.4px;letter-spacing:.08em;text-transform:uppercase;color:var(--mo);white-space:nowrap}
.vong .b.nay .ten{color:var(--nhan);font-weight:600}
.vong .noi{height:2px;background:var(--vien);flex:1;margin-bottom:19px;min-width:14px}
.vong .noi.qua{background:var(--xanh)}

.den{width:18px;height:18px;border-radius:50%;display:inline-block;vertical-align:-3px}
.den.xanh{background:var(--xanh)} .den.vang{background:var(--vang)} .den.do{background:var(--do)}
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
  // Trang là file tĩnh đem publish — nó phải tự biết mình bao nhiêu tuổi ở lúc XEM, không phải
  // lúc sinh. Bảy ngày là mốc: quá đó thì mọi con số ở đây đáng ngờ, và người xem phải biết
  // điều đó TRƯỚC khi đọc, không phải sau.
  try {
    var el = document.querySelector('.cu');
    if (el && el.dataset.sinh) {
      var ngay = Math.floor((Date.now() - new Date(el.dataset.sinh).getTime()) / 86400000);
      if (ngay > 7) {
        el.dataset.hien = '1';
        el.textContent = 'TRANG NÀY CÓ THỂ ĐÃ CŨ — sinh ngày ' + el.dataset.sinh + ', ' + ngay + ' ngày trước. Sinh lại trước khi tin số.';
      }
    }
  } catch (e) {}

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

/* NOW/NEXT — bốn ô, đọc từ frontmatter của STATUS.md. Ô cuối là **việc cần NGƯỜI làm**, tô khác
   màu, vì đó là thứ duy nhất trên trang mà AI không tự làm được. Chủ dự án mở trang ra chỉ cần
   nhìn đúng ô đó. */
function khoiNowNext(st) {
  if (!st || !Object.keys(st).length) return "";
  const o = (nhan, gt, to, lop) => gt
    ? `<div class="m ${lop || ""}"><span class="nhan">${esc(nhan)}</span><span class="gt${to ? " to" : ""}">${esc(String(gt).replace(/^"|"$/g, ""))}</span></div>`
    : "";
  return `<div class="nn">
    ${o("đang ở đâu", VONG_DOI[st.lifecycle]?.ten || st.lifecycle, true)}
    ${o("đang làm gì", st.current_focus)}
    ${o("kế tiếp", st.next_step)}
    ${o("cần bạn làm", st.human_action, false, "viec")}
  </div>`;
}

/* Tách thành hàm RIÊNG và XUẤT RA để phép kiểm gọi thẳng được.
 *
 * Nó từng nằm inline trong `gomDuLieu()`, và `gomDuLieu()` chỉ chạy được trên đĩa thật — nên
 * phép kiểm không với tới, và một hằng số `1` nằm đó sống sót qua cả một vòng đột biến. Thử phá
 * mà không đỏ nghĩa là phép kiểm chưa từng canh chỗ đó; chỗ nào không gọi được thì không kiểm
 * được. Đây là lý do nó ở đây chứ không phải trong thân hàm kia. */
export function noChuaChungMinh(lifecycle) {
  if (!lifecycle) return null;                                  // không khai = không đo được
  return new Set(["proven", "retired"]).has(lifecycle) ? 0 : 1;
}

const VONG_DOI = {
  idea: { ten: "Ý TƯỞNG", i: 0 },
  building: { ten: "ĐANG DỰNG", i: 1 },
  proven: { ten: "ĐÃ CHỨNG MINH", i: 2 },
  paused: { ten: "TẠM DỪNG", i: 3 },
  retired: { ten: "ĐÃ NGHỈ", i: 3 }
};

/* Vòng đời — bốn chặng, chấm sáng ở chặng hiện tại. Cố ý KHÔNG hiện phần trăm: một dự án không
   chạy được đo bằng phần trăm, và một con số như thế chỉ tạo cảm giác chính xác giả. */
function khoiVongDoi(st) {
  const nay = VONG_DOI[st?.lifecycle]?.i;
  if (nay === undefined) return "";
  const chang = [["Ý tưởng", 0], ["Đang dựng", 1], ["Đã chứng minh", 2], ["Dừng / nghỉ", 3]];
  return `<div class="the"><h2>Vòng đời</h2><div class="vong">${
    chang.map(([ten, i], k) => {
      const lop = i < nay ? "qua" : (i === nay ? "nay" : "");
      const noi = k < chang.length - 1 ? `<div class="noi${i < nay ? " qua" : ""}"></div>` : "";
      return `<div class="b ${lop}"><div class="cham"></div><div class="ten">${esc(ten)}</div></div>${noi}`;
    }).join("")}</div></div>`;
}

/* Sức khoẻ — ba con số đếm và MỘT đèn. Đèn xanh chỉ khi cả ba bằng 0. Không phần trăm, không
   lời máy tự khen: một dòng "đạt 94%" là thứ không ai hành động được. */
/* PHÉP ĐO HỎNG PHẢI HIỆN RA LÀ HỎNG, KHÔNG ĐƯỢC THÀNH SỐ 0.
 *
 * `so: null` nghĩa là KHÔNG ĐO ĐƯỢC (git không chạy, cổng cấu trúc chết giữa chừng). Bản đầu
 * biến mọi ca đó thành `0` — tức là thành "sạch". Một trang tự khen mình sạch vì nó không đo
 * được gì là thứ nguy hiểm nhất ở đây: người xem trang này KHÔNG mở repo ra kiểm lại. */
function khoiSucKhoe(sk) {
  const coHong = sk.some((s) => s.so === null);
  const tong = sk.reduce((a, b) => a + (b.so ?? 0), 0);
  const den = coHong ? "do" : (tong === 0 ? "xanh" : (tong <= 3 ? "vang" : "do"));
  return `<div class="the"><h2>Sức khoẻ</h2>
    <div class="luoi">
      ${sk.map((s) => {
        if (s.so === null) return `<div class="o canh"><b>?</b><span>${esc(s.nhan)} — không đo được</span></div>`;
        return `<div class="o ${s.so === 0 ? "ok" : "canh"}"><b>${s.so}</b><span>${esc(s.nhan)}</span></div>`;
      }).join("")}
      <div class="o"><b><span class="den ${den}"></span></b><span>tổng thể</span></div>
    </div>
    <p style="font-size:13.2px;color:var(--mo)">Đèn xanh chỉ khi cả ba đều bằng 0. Dấu <b>?</b> nghĩa là phép đo không chạy được — đó không phải điểm 0, và đèn không xanh. Không có phần trăm ở đây — một con số như "đạt 94%" thì không ai hành động được.</p>
  </div>`;
}


export function trang(dl) {
  const { ten, ban, ngay, so, lenh, banDo, workflows, protocols, adrs, legend, nhatKy, huongDan, st } = dl;

  const tabs = [
    ["tong-quan", "Tổng quan"],
    ["lam-duoc-gi", "Làm được gì"],
    ["cach-van-hanh", "Cách vận hành"],
    ["so-tay", "Sổ tay"],
    ["bao-tri", "Bảo trì"],
    ["kien-truc", "Bên trong"],
    ["tra-cuu", "Tra cứu"],
    ["nhat-ky", "Nhật ký"]
  ].filter(([id]) => {
    if (id === "lam-duoc-gi") return Boolean(dl.tinhNang);
    if (id === "cach-van-hanh") return workflows.length > 0 || Boolean(huongDan);
    if (id === "so-tay") return Boolean(dl.soTay) || protocols.length > 0;
    if (id === "bao-tri") return Boolean(dl.baoTri);
    if (id === "tra-cuu") return Boolean(legend);
    if (id === "nhat-ky") return nhatKy.length > 0;
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
  <div class="cu" data-sinh="${esc(ngay)}"></div>
  <header>
    <div class="nhan-hang">
      <span class="chip">v${esc(ban)}</span>
      <span>sinh ngày ${esc(ngay)}</span>
    </div>
    <h1>${esc(ten)}</h1>
    <p style="color:var(--chu2);font-size:16.5px">
      Bộ khung để một repo tự trông coi lấy mình: có cửa kiểm chặn việc dở dang, có luật cho AI
      đọc, và có lịch bảo trì. Sau khi dựng xong, <strong>AI là người ở lại trông nhà</strong>.
    </p>
  </header>

  <nav class="tabs" role="tablist">
    ${tabs.map(([id, ten2]) => `<button role="tab" data-tab="${id}" aria-selected="false">${esc(ten2)}</button>`).join("")}
  </nav>

  <section class="tab" id="tab-tong-quan" hidden>
    ${khoiNowNext(st)}
    ${khoiVongDoi(st)}
    ${khoiSucKhoe(so)}
    <div class="the">
      <h2>Ba việc nó làm mà một repo trống không làm được</h2>
      <div class="cols">
        <div>
          <h3>Chặn việc dở dang</h3>
          <p>Trước khi ai đó được phép nói "xong", một cửa kiểm chạy toàn bộ bài kiểm tra và đối
          chiếu mọi trang tự sinh với lịch sử thật. Đỏ thì chưa xong.</p>
        </div>
        <div>
          <h3>Không cho hai người giẫm chân</h3>
          <p>Repo chia vùng, mỗi vùng một chủ tại một thời điểm. Lệnh đẩy từ chối cuốn theo việc
          của người khác.</p>
        </div>
        <div>
          <h3>Bảng không nói dối</h3>
          <p>Mọi con số sinh từ lịch sử thật, không gõ tay. Trang cũ quá bảy ngày thì tự treo cờ
          đỏ ở đầu — bạn đang thấy chỗ đó ở trên cùng.</p>
        </div>
      </div>
    </div>
  </section>

  ${dl.tinhNang ? `<section class="tab" id="tab-lam-duoc-gi" hidden>
    <div class="the">${md(dl.tinhNang)}</div>
  </section>` : ""}

  ${(workflows.length || huongDan) ? `<section class="tab" id="tab-cach-van-hanh" hidden>
    ${huongDan ? `<div class="the" id="huong-dan">${md(huongDan)}</div>` : ""}
    ${mucLuc(workflows.map((w) => ({ id: `wf-${slug(w.file)}`, ten: w.fm.ten || w.tieuDe })))}
    ${workflows.map((w) => {
      const than2 = w.than.split(NL).filter((l) => !l.startsWith("# "));
      const iMer = than2.findIndex((l) => l.trim().startsWith("```mermaid"));
      const jMer = iMer >= 0 ? than2.findIndex((l, k) => k > iMer && l.trim().startsWith("```")) : -1;
      const luuDo = iMer >= 0 ? than2.slice(iMer, jMer + 1).join(NL) : "";
      const conLai = iMer >= 0 ? [...than2.slice(0, iMer), ...than2.slice(jMer + 1)].join(NL) : than2.join(NL);
      return `<div class="the" id="wf-${slug(w.file)}">
        <h2>${esc(w.fm.ten || w.tieuDe)}</h2>
        <div class="nhan-hang">
          ${w.fm.ai_chay ? `<span class="chip">ai chạy: ${esc(w.fm.ai_chay)}</span>` : ""}
          ${w.fm.mat ? `<span class="chip">mất: ${esc(w.fm.mat)}</span>` : ""}
        </div>
        ${md(luuDo)}
        <details><summary>Chi tiết từng bước và các chỗ dễ sai</summary>${md(conLai)}</details>
      </div>`;
    }).join("")}
  </section>` : ""}

  ${(dl.soTay || protocols.length) ? `<section class="tab" id="tab-so-tay" hidden>
    ${dl.soTay ? `<div class="the">${md(dl.soTay)}</div>` : ""}
    ${protocols.length ? `<div class="the"><h2>Quy trình đầy đủ</h2>
      ${protocols.map((p2) => `<details><summary>${esc(p2.tieuDe)}</summary>${md(p2.than.split(NL).filter((l) => !l.startsWith("# ")).join(NL))}</details>`).join("")}
    </div>` : ""}
  </section>` : ""}

  ${dl.baoTri ? `<section class="tab" id="tab-bao-tri" hidden>
    <div class="the">${md(dl.baoTri)}</div>
  </section>` : ""}

  <section class="tab" id="tab-kien-truc" hidden>
    <div class="the">
      <h2>Bốn tầng, và chúng được đối xử khác nhau</h2>
      ${md(["```mermaid", "flowchart LR", '  L["LUẬT<br/>người viết<br/>đổi vài tháng một lần"] --> S["TRẠNG THÁI<br/>người viết<br/>đổi mỗi phiên"]',
        '  S --> G["MÁY SINH<br/>máy viết<br/>không sửa tay"]', '  E["BẰNG CHỨNG<br/>bất biến<br/>chỉ thêm"]',
        "  L -.- E", "```"].join(NL))}
      <p>Sửa nhầm tầng là kiểu hỏng im lặng: sửa tay một trang máy sinh thì mất trắng ở lần sinh
      sau, và không ai hiểu vì sao chữ mình vừa viết biến mất.</p>
    </div>
    <div class="the">
      <h2>Lệnh chạy được</h2>
      <p>Dành cho ai gõ lệnh. Người không gõ lệnh thì xem tab <strong>Làm được gì</strong> —
      cùng một thứ, kể bằng tiếng người.</p>
      <div class="tw"><table><thead><tr><th>Lệnh</th><th>Chạy gì</th></tr></thead><tbody>
      ${lenh.map(([k, v]) => `<tr><td><code>npm run ${esc(k)}</code></td><td><code>${esc(v)}</code></td></tr>`).join("")}
      </tbody></table></div>
    </div>
    ${adrs.length ? `<div class="the"><h2>Quyết định đã chốt</h2>
      <p>Mỗi quyết định một file, <strong>không sửa lại</strong>. Đổi ý thì viết quyết định mới
      thay thế cái cũ, để sau này còn đọc được vì sao lúc đó chọn thế.</p>
      <div class="tw"><table><thead><tr><th>Quyết định</th><th>Trạng thái</th><th>Ngày</th></tr></thead><tbody>
      ${adrs.map((a) => `<tr><td>${esc(a.tieuDe)}</td><td>${esc(a.fm.status || "—")}</td><td>${esc(a.fm.date || "—")}</td></tr>`).join("")}
      </tbody></table></div></div>` : ""}
    <div class="the"><h2>Khi bạn sắp… thì mở file nào</h2>
      <div class="tw"><table><thead><tr><th>Khi bạn sắp…</th><th>Mở cái gì</th></tr></thead><tbody>
      ${banDo.map((r) => `<tr><td>${md(r[0]).replace(/^<p>|<\/p>$/g, "")}</td><td>${md(r.slice(1).join(" · ")).replace(/^<p>|<\/p>$/g, "")}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
  </section>

  ${legend ? `<section class="tab" id="tab-tra-cuu" hidden><div class="the">${md(legend)}</div></section>` : ""}

  ${nhatKy.length ? `<section class="tab" id="tab-nhat-ky" hidden>
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
  // FAIL-CLOSED. Bản đầu nuốt lỗi parse rồi lùi về tên gói npm, nên một `.repo-structure.json`
  // hỏng cú pháp vẫn sinh ra một trang trông hoàn toàn bình thường — trong khi cổng kiểm của
  // chính repo đó đang chết. Trang là thứ Đức nhìn; nó không được đẹp hơn sự thật.
  let tenNguoi = null;
  const cauHinhRaw = doc(".repo-structure.json");
  if (cauHinhRaw !== null) {
    let j;
    try {
      j = JSON.parse(cauHinhRaw);
    } catch (e) {
      throw new Error(`.repo-structure.json hỏng cú pháp (${String(e.message).split(NL)[0]}) — KHÔNG sinh trang. Một trang dựng từ cấu hình hỏng sẽ trông bình thường trong khi repo đang hỏng.`);
    }
    tenNguoi = j?.repo?.name || null;
  }
  const nhatKy = tachNhatKy(doc("CHANGELOG.md"));
  const workflows = docTaiLieu("docs/workflows");
  const protocols = docTaiLieu("docs/protocols");
  const adrs = docTaiLieu("docs/adr");
  const legendRaw = doc("docs/LEGEND.md");
  const st = tachFrontmatter(doc("STATUS.md") || "").fm;
  const tinhNangRaw = doc("docs/TINH-NANG.md");
  const soTayRaw = doc("docs/SO-TAY-AGENT.md");
  const baoTriRaw = doc("docs/BAO-TRI-DINH-KY.md");
  const huongDanRaw = doc("docs/HUONG-DAN.md");
  // Tài liệu quá hạn: mỗi file khai `ttl_days`, so với lần commit gần nhất của chính nó. Không
  // đo được (chưa commit, không có git) thì KHÔNG tính là nợ — thà bỏ sót còn hơn báo động sai.
  const taiLieuQuaHan = [];
  for (const thuMuc of ["docs", "docs/workflows", "docs/protocols", "docs/briefs"]) {
    for (const f of liet(thuMuc)) {
      const fm = tachFrontmatter(doc(`${thuMuc}/${f}`) || "").fm;
      const ttl = Number(fm.ttl_days);
      if (!Number.isFinite(ttl) || ttl <= 0) continue;
      let sua = null;
      try {
        const ra = execSync(`git log -1 --format=%cI -- "${thuMuc}/${f}"`, { cwd: ROOT, encoding: "utf8" }).trim();
        sua = ra ? new Date(ra) : null;
      } catch (_) { sua = null; }
      if (!sua) continue;
      if ((Date.now() - sua.getTime()) / 86400000 > ttl) taiLieuQuaHan.push(`${thuMuc}/${f}`);
    }
  }
  // `null` = KHÔNG ĐO ĐƯỢC, và nó khác hẳn 0. Cổng cấu trúc thoát khác 0 là chuyện BÌNH THƯỜNG
  // (có phép kiểm thuộc nhóm CHẶN đang đỏ) và nó vẫn in dòng TỔNG — nên vẫn đọc được. Chỉ khi
  // KHÔNG có dòng TỔNG mới là không đo được: script chết trước khi in, hoặc node/git không chạy.
  let canhBaoVang = null;
  {
    let ra = "";
    try {
      ra = execSync("node scripts/check-bootstrap.mjs", { cwd: ROOT, encoding: "utf8" });
    } catch (e) {
      ra = String(e.stdout || "");
    }
    const m = (ra.split(NL).find((l) => l.startsWith("TỔNG:")) || "").match(/([0-9]+)\s*chỗ\s*VÀNG/);
    canhBaoVang = m ? Number(m[1]) : null;
  }

  /* "Việc lớn chưa chứng minh" — ĐỌC TỪ STATUS, ĐỪNG GÕ TAY.
   *
   * Bản đầu đóng cứng số `1`. Nghĩa là đèn sức khoẻ **không bao giờ xanh được**, kể cả khi repo
   * đã sạch hết mọi thứ khác — trong khi ngay dưới nó trang lại viết "Đèn xanh chỉ khi cả ba
   * bằng 0". Trang tự mâu thuẫn với chính nó, và con số đó không bao giờ đổi dù việc có xong.
   *
   * Nguồn thật: `lifecycle` trong `STATUS.md`, đúng trường mà khối Vòng đời phía trên đã dùng.
   * Một nguồn, hai chỗ đọc — thay vì hai con số tự sống. */
  const viecChuaChungMinh = noChuaChungMinh(st?.lifecycle);
  return {
    ten: tenNguoi || pkg.name || "Repo",
    ban: pkg.version || "0.0.0",
    // Ngày THEO ĐỒNG HỒ CỦA NGƯỜI XEM, không theo UTC. Sinh trang lúc 00:30 giờ Việt Nam thì
    // `toISOString()` vẫn trả ngày HÔM QUA — và banner "trang này bao nhiêu ngày tuổi" đếm sai
    // ngay từ giây đầu tiên. Sai một ngày thì nhỏ, nhưng nó nằm đúng ở con số Đức dùng để quyết
    // định có tin trang này hay không.
    ngay: (() => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    })(),
    lenh: Object.entries(pkg.scripts || {}),
    banDo: docBanDo(doc("AGENTS.md")),
    workflows, protocols, adrs, nhatKy,
    legend: legendRaw ? tachFrontmatter(legendRaw).than : null,
    st,
    tinhNang: tinhNangRaw ? tachFrontmatter(tinhNangRaw).than : null,
    soTay: soTayRaw ? tachFrontmatter(soTayRaw).than : null,
    baoTri: baoTriRaw ? tachFrontmatter(baoTriRaw).than : null,
    huongDan: huongDanRaw ? tachFrontmatter(huongDanRaw).than : null,
    // BA CON SỐ ĐẾM NỢ, không đếm tài sản. Đếm tài sản ("3 workflow, 9 lệnh") chỉ làm người
    // xem thấy nhiều mà không biết có phải lo không. Đèn xanh chỉ khi cả ba bằng 0.
    so: [
      { so: taiLieuQuaHan.length, nhan: "tài liệu quá hạn" },
      { so: canhBaoVang, nhan: "cảnh báo cấu trúc tồn" },
      { so: viecChuaChungMinh, nhan: "việc lớn chưa chứng minh" }
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
