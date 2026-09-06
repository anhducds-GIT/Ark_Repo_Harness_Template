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
 * BẢN RA CÓ COMMIT (đổi 04/09, Đức chốt) — `DASHBOARD-Ark-Repo-Harness.html` ở gốc repo.
 * Trước đó bảng chỉ tồn tại dạng artifact trên claude.ai, tức là muốn xem trạng thái repo thì
 * phải có một phiên Claude đăng hộ: điểm phụ thuộc một AI duy nhất của cả hệ. File trong repo
 * xoá bỏ chỗ đó — mở bằng trình duyệt là xong, không nhờ ai. Đổi lại, nội dung phải suy HOÀN
 * TOÀN TỪ HEAD (xem `doc`/`liet` và `mocHEAD` bên dưới): nó nằm trong khối `generators` nên
 * cổng kiểm nó mỗi phiên, và một bộ sinh nhìn đồng hồ hay nhìn đĩa sẽ chặn push của MỌI phiên.
 */

import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { esc, md, tachFrontmatter } from "./md-mini.mjs";

/* CHỈ NHẬP TỪ BA FILE, và cả ba ĐỀU ĐI THEO BẢN TRÍCH.
 *
 * Đây là điều kiện để trang này phát đi được. Bản 1.3.16 nhập từ `giao-viec.mjs` và
 * `build-so-migrate.mjs` — hai lệnh **ở lại repo nhà** — nên phát đi là repo đích nạp trang
 * chết ngay dòng import, với một câu lỗi không nói gì về nguyên nhân thật. Hằng số và bộ đọc
 * đã dời sang `overview-doc.mjs`; chiều phụ thuộc nay chảy từ thứ ở lại sang thứ đi theo. */
import { ageHours, ageLabel, DAU_VET, dangNhac, doDauVet, GIO_NHAC as GIO_NHAC_BANG, mocCoGio, noiDauVet } from "./claim.mjs";
import {
  BAC, khoangNgay, noiTuoi, quetDauDuc, readBatBien, readCoChe, readHoSo, readIdeas, readKhoa,
  readNo, THU_MUC_MIGRATE, VIEC
} from "./overview-doc.mjs";

const NL = String.fromCharCode(10);

/* Bật bằng `--khoa-song` hoặc biến môi trường `ARK_KHOA_SONG=1`. Biến môi trường có vì cửa
 * nhấp đúp gọi lệnh qua nhiều lớp và một cờ dòng lệnh dễ rơi mất giữa đường. */
const KHOA_SONG = process.argv.includes("--khoa-song") || process.env.ARK_KHOA_SONG === "1";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ĐỌC TỪ HEAD, KHÔNG ĐỌC TỪ ĐĨA — và đây là chỗ dễ làm tê cả repo nhất, nên nói to.
 *
 * Từ khi trang này được commit, nó nằm trong khối `generators`: cổng đóng phiên chạy
 * `--check-head` mỗi lượt và `safe-push` từ chối đẩy khi bản đã commit lệch HEAD. Nếu bộ sinh
 * đọc THƯ MỤC LÀM VIỆC thì bất kỳ file sửa dở nào của bất kỳ phiên nào cũng làm trang lệch —
 * và phiên bị chặn sẽ không hiểu vì sao, vì cái làm lệch không nằm trong commit của họ.
 * Đọc từ HEAD thì "sinh" và "kiểm" hỏi cùng một câu, nên hai bên không thể trả lời khác nhau. */
const gitRa = (...args) => execFileSync("git", ["-c", "core.quotepath=false", ...args],
  { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const doc = (rel) => { try { return gitRa("show", `HEAD:${rel}`); } catch (_) { return null; } };
/* Trang .html ở GỐC repo, theo HEAD. Dùng để "Trang liên quan" chỉ trỏ tới trang có thật. */
const lietHTML = () => {
  try {
    return gitRa("ls-tree", "-z", "--name-only", "HEAD")
      .split(String.fromCharCode(0)).filter((f) => f.endsWith(".html"));
  } catch (_) { return []; }
};
const liet = (rel) => {
  try {
    return gitRa("ls-tree", "-z", "--name-only", `HEAD:${rel}`)
      .split("\0").filter((f) => f.endsWith(".md")).sort();
  } catch (_) { return []; }
};
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Mốc ngày của HEAD — thứ thay thế cho đồng hồ ở MỌI phép tính trong file này.
 *
 * FAIL-CLOSED, không fail-open. Lùi về `new Date()` khi không hỏi được git thì đúng một chỗ
 * này mở lại cửa hậu mà cả đoạn ghi chú ở `ngay:` vừa đóng: sang ngày là lệch HEAD, cổng đỏ
 * với mọi phiên, và không ai lần ra vì sao. Chết ngay tại chỗ kèm tên nguyên nhân thì rẻ hơn. */
export function mocHEAD() {
  let ra;
  try { ra = gitRa("log", "-1", "--format=%cd", "--date=format:%Y-%m-%d").trim(); }
  catch (e) { throw new Error(`MOC_HEAD_HONG: không hỏi được git về ngày của HEAD (${String(e.message).split(NL)[0]}). Trang này phải suy mốc từ HEAD chứ không từ đồng hồ — không suy được thì KHÔNG sinh.`); }
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(ra)) {
    throw new Error(`MOC_HEAD_HONG: ngày của HEAD đọc ra "${ra}", không phải dạng YYYY-MM-DD. Trang này phải suy mốc từ HEAD — đọc không ra thì KHÔNG sinh.`);
  }
  return ra;
}

/* NGÀY SINH CỦA MỘT DÒNG — dùng để nói một việc chờ người chốt đã treo bao lâu.
 *
 * `git log -L n,n:file` chứ không phải đồng hồ. Cùng lý do với `mocHEAD`: bảng nằm trong khối
 * `generators`, nên một con số nhìn đồng hồ là sang ngày mọi phiên bị chặn đẩy.
 *
 * `null` = KHÔNG ĐO ĐƯỢC, và null khác 0. Dòng vừa thêm mà chưa commit thì git không biết nó,
 * và bảng phải nói "chưa đo được tuổi" chứ không phải "treo 0 ngày" — hai câu đó khác nhau. */
function ngaySinhDong(rel, soDong) {
  try {
    const ra = gitRa("log", "-1", "--format=%cs", `-L${soDong},${soDong}:${rel}`).split(NL)[0].trim();
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(ra) ? ra : null;
  } catch (_) { return null; }
}

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
/* VIỆC ĐÃ XONG 100% — đọc từ sổ nợ, mục có mã BỊ GẠCH (`### ~~MÃ~~ · …`).
 *
 * Vì sao tab này đáng có: bảng vốn chỉ chiếu thứ ĐANG mở — việc còn lại, nợ còn treo, chỗ chờ
 * người chốt. Người chốt nhìn mãi một danh sách việc chưa xong thì không thấy repo đang tiến,
 * chỉ thấy nó đang nợ. Việc đã đóng là bằng chứng ngược lại, và nó vốn đã nằm sẵn trong sổ —
 * chỉ là không ai chiếu ra.
 *
 * ĐỌC ĐÚNG QUY ƯỚC SỔ, không dò từ khoá trong văn xuôi: gạch mã là cách sổ khai "đã đóng", và
 * `what-next.mjs` cũng đọc đúng dấu đó. Hai chỗ đọc cùng một dấu thì không trôi khỏi nhau. */
export function tachDaXong(text) {
  if (!text) return [];
  const ra = [];
  let uuTien = "";
  for (const dong of String(text).replaceAll(CR, "").split(NL)) {
    const p = /^##\s+(P[1-9])\b/.exec(dong);
    if (p) { uuTien = p[1]; continue; }
    const m = /^###\s+~~([A-Za-z0-9]+-\d+)~~\s*[·:]?\s*(.*)$/.exec(dong);
    if (m) ra.push({ ma: m[1], tieuDe: m[2].trim(), uuTien });
  }
  return ra;
}

function tachNhatKy(text) {
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

/* MÔ HÌNH BA KHỐI — Đức mô tả 06/09: một khối DỮ LIỆU LÕI, một khối PROTOCOL, một khối
   REPO ĐÍCH, và luồng chạy cả BÊN TRONG từng khối lẫn GIỮA các khối.

   Vẽ bằng lưới CSS chứ không bằng thư viện vẽ sơ đồ: trang này là file tĩnh đem gửi cho
   người khác mở, nên nó không được phụ thuộc vào một CDN còn sống hay không. */
.mh{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:0;align-items:stretch;margin:14px 0 6px}
.mh-cot{background:var(--mat);border:1px solid var(--vien);border-radius:11px;padding:14px 15px;
  display:flex;flex-direction:column;gap:9px;min-width:0}
.mh-cot.loi{border-color:var(--nhan)}
.mh-so{font-family:var(--mono);font-size:10.2px;letter-spacing:.11em;text-transform:uppercase;color:var(--mo)}
.mh-ten{font-family:var(--disp);font-size:16.5px;font-weight:800;letter-spacing:-.01em;line-height:1.2;color:var(--chu)}
.mh-mota{font-size:13px;color:var(--chu2);line-height:1.45;margin:-3px 0 2px}
.mh-hop{background:var(--nen);border:1px solid var(--vien);border-radius:8px;padding:9px 11px}
.mh-hop h4{margin:0 0 5px;font-family:var(--mono);font-size:10.2px;letter-spacing:.09em;
  text-transform:uppercase;color:var(--mo);font-weight:600}
.mh-hop ul{margin:0;padding-left:16px}
.mh-hop li{font-size:13.2px;line-height:1.5;color:var(--chu)}
.mh-hop li code{font-size:12px}
.mh-mui{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:0 9px;gap:4px;min-width:56px}
.mh-mui .ky{font-size:20px;color:var(--nhan);line-height:1}
.mh-mui .nh{font-family:var(--mono);font-size:9.6px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--mo);text-align:center;line-height:1.3}
.mh-vong{margin:8px 0 0;background:var(--nhan-nen);border:1px dashed var(--nhan);border-radius:9px;
  padding:10px 13px;font-size:13px;line-height:1.5;color:var(--chu)}
.mh-vong b{color:var(--nhan)}
@media (max-width:860px){
  .mh{grid-template-columns:1fr}
  .mh-mui{flex-direction:row;padding:7px 0;min-width:0}
  .mh-mui .ky{transform:rotate(90deg)}
}

/* ---- NĂM TAB MỚI (06/09) — mượn hình từ bảng repo Chrome Extension -------------------
   Không dựng bảng token thứ hai: chúng dùng lại đúng biến màu khai ở khối :root phía trên. Một bảng
   màu thứ hai là hai bảng sẽ lệch nhau, và lúc đó không ai biết màu nào là đúng. */

/* Ô đếm KÈM MẪU SỐ. Một số 0 đứng một mình trông giống hệt nhau ở hai ca ngược nhau:
   "đã dò hết, sạch" và "chưa dò gì cả". Mẫu số là thứ tách được hai ca đó. */
.sk{display:grid;grid-template-columns:repeat(auto-fit,minmax(178px,1fr));gap:1px;
  background:var(--vien);border:1px solid var(--vien);border-radius:11px;overflow:hidden}
.sk .o{background:var(--mat);padding:13px 15px;display:flex;flex-direction:column;gap:3px}
.sk .n{font-family:var(--disp);font-size:27px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
.sk .o.sach .n{color:var(--xanh)}
.sk .o.ban .n{color:var(--vang)}
.sk .l{font-size:13.4px;font-weight:600;color:var(--chu)}
.sk .m{font-size:11.8px;color:var(--mo);line-height:1.4}

/* Hàng "số rồi tới chữ" — nợ theo nhóm, khoá, mốc. */
.hs{display:grid;grid-template-columns:46px 1fr;gap:8px;align-items:baseline;
  padding:7px 0;border-top:1px solid var(--vien)}
.hs:first-child{border-top:0}
.hs .n{font-family:var(--mono);font-size:16px;font-weight:600;color:var(--vang);text-align:right}
.hs .t{font-size:14px;color:var(--chu)}

/* Dòng CẦN NGƯỜI CHỐT: nhãn loại việc + câu + tuổi. */
.cd{display:grid;grid-template-columns:56px 1fr;gap:9px;padding:8px 0;border-top:1px solid var(--vien)}
.cd:first-of-type{border-top:0}
.cd .lo{font-family:var(--mono);font-size:10px;letter-spacing:.08em;font-weight:600;
  padding:3px 0;text-align:center;border-radius:5px;height:fit-content}
.cd .lo.bam{background:var(--nhan-nen);color:var(--nhan)}
.cd .lo.chot{background:var(--vang-nen);color:var(--vang)}
.cd .c{font-size:14px;line-height:1.45;color:var(--chu)}
.cd .tu{font-family:var(--mono);font-size:11.4px;color:var(--mo);display:block;margin-top:2px}

/* Một khoá vùng: tên + MỞ/BẬN + ai giữ. */
.kh{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;
  padding:8px 0;border-top:1px solid var(--vien)}
.kh:first-of-type{border-top:0}
.kh .t{font-family:var(--mono);font-size:13.4px;color:var(--chu)}
.kh .t small{font-family:var(--sans);color:var(--mo);font-size:12px;display:block;margin-top:1px}
.hieu{font-family:var(--mono);font-size:10px;letter-spacing:.09em;font-weight:600;
  padding:3px 8px;border-radius:20px;white-space:nowrap}
.hieu.mo{background:var(--xanh-nen);color:var(--xanh)}
.hieu.ban{background:var(--vang-nen);color:var(--vang)}
.hieu.tt{background:var(--mat2);color:var(--chu2)}
/* CHƯA THẤY DẤU VẾT — vàng viền, không vàng đặc: nó là câu hỏi, không phải phán quyết. */
.hieu.cho{background:transparent;color:var(--vang);box-shadow:inset 0 0 0 1px var(--vang)}
/* Ô mốc của sổ migrate. Chữ to, màu theo trạng thái — bảng này để LIẾC, không để đọc. */
.mc{font-size:15px;font-weight:700;text-align:center}
.mc sup{font-size:9px;font-weight:400;opacity:.7}
.mc-xong{color:var(--xanh)}.mc-chua{color:var(--do)}.mc-dang{color:var(--vang)}.mc-trong{color:var(--chu2);opacity:.45}
details.gap>summary{cursor:pointer;font-weight:600;font-size:13px;color:var(--chu2);list-style:none}
details.gap>summary::before{content:'▸ ';color:var(--vang)}
details.gap[open]>summary::before{content:'▾ '}
details.gap[open]>summary{margin-bottom:12px;color:var(--chu)}

/* Thanh ba bậc của một ý tưởng. Bậc "nghỉ" KHÔNG phải bậc thứ tư: nó vẽ thành chấm rỗng có
   gạch ngang, để không ai đọc nhầm một ý tưởng đã bỏ là "gần xong". */
.yt{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:12px;align-items:center;
  padding:9px 0;border-top:1px solid var(--vien)}
.yt:first-of-type{border-top:0}
.yt .ten{font-size:14px;font-weight:600;color:var(--chu)}
.yt .ke{font-size:12.6px;color:var(--chu2);margin-top:2px;line-height:1.4}
.bac{display:flex;align-items:center;gap:0;position:relative}
.bac .b{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0}
.bac .d{width:11px;height:11px;border-radius:50%;background:var(--vien2);border:2px solid var(--mat)}
.bac .b.qua .d{background:var(--xanh)}
.bac .b.nay .d{background:var(--mat);border-color:var(--nhan);box-shadow:0 0 0 3px var(--nhan-nen)}
.bac .nh{font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;
  color:var(--mo);white-space:nowrap}
.bac .b.nay .nh{color:var(--nhan);font-weight:600}
.bac .l{height:2px;background:var(--vien);flex:1;margin-bottom:15px;min-width:8px}
.bac .l.qua{background:var(--xanh)}
.bac.nghi .d{background:transparent;border-color:var(--vien2)}
.bac.nghi::after{content:"";position:absolute;left:6%;right:6%;top:5px;height:2px;
  background:var(--vien2)}

/* Cấu trúc: thư mục / file gốc / bản đồ file. Tab DUY NHẤT được in đường dẫn. */
.cay{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:9px;align-items:center;
  padding:7px 0;border-top:1px solid var(--vien)}
.cay:first-of-type{border-top:0}
.cay .p{font-family:var(--mono);font-size:13px;color:var(--chu)}
.cay .st{font-family:var(--mono);font-size:11.4px;color:var(--nhan)}
.cay .sl{font-family:var(--mono);font-size:11.4px;color:var(--mo);white-space:nowrap}
.tep{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}
.tep span{font-family:var(--mono);font-size:11.6px;padding:3px 7px;border-radius:5px;
  background:var(--mat2);color:var(--chu2)}
.tep span.may{background:var(--xanh-nen);color:var(--xanh)}
@media (max-width:600px){ .yt{grid-template-columns:1fr} .cay{grid-template-columns:1fr auto} }

/* TAB CON — dùng cho tab Migrate, và dùng lại được cho bất kỳ tab nào có nhiều hồ sơ.
   Đức nêu 06/09: "tách riêng các job thành các tab riêng, sẽ dễ theo dõi hơn so với để tràn
   lan". Đúng: sổ migrate xếp ba hồ sơ nối đuôi nhau, và hồ sơ nào cũng dài — người mở ra phải
   cuộn qua hai lượt cũ mới tới lượt mình cần. */
.tabs2{display:flex;gap:4px;flex-wrap:wrap;margin:0 0 12px;padding:4px;
  background:var(--mat2);border:1px solid var(--vien);border-radius:10px}
.tabs2 button{font:inherit;font-size:13.2px;font-weight:600;cursor:pointer;
  padding:7px 13px;border:1px solid transparent;border-radius:7px;background:transparent;
  color:var(--chu2);display:flex;align-items:center;gap:7px}
.tabs2 button:hover{color:var(--chu)}
.tabs2 button[aria-selected="true"]{background:var(--mat);border-color:var(--vien);
  color:var(--chu);box-shadow:var(--bong)}
.tabs2 button .cham{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
.tabs2 button .cham.xanh{background:var(--xanh)}
.tabs2 button .cham.vang{background:var(--vang)}
.tabs2 button .cham.do{background:var(--do)}
.tabs2 button small{font-weight:400;color:var(--mo);font-size:11.4px}
.tab2[hidden]{display:none}

/* Bảng đối chiếu mọi lượt migrate — cái nhìn đầu tiên, trước khi mở từng hồ sơ. */
.mgt{width:100%;border-collapse:collapse;font-size:13.6px}
.mgt th,.mgt td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--vien)}
.mgt th{font-family:var(--mono);font-size:10.6px;letter-spacing:.07em;text-transform:uppercase;
  color:var(--mo);font-weight:600}
.mgt td.so{font-family:var(--mono);white-space:nowrap}
.mgt tr:last-child td{border-bottom:0}

.batdau pre.code{margin:6px 0 4px}
.lienquan{margin:6px 0 0;padding-left:20px}
.lienquan li{margin:5px 0;font-size:14.4px}
details.the summary{font-family:var(--disp);font-size:clamp(18px,2.2vw,22px);font-weight:700}
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
  // TAB CON — dùng ở tab Migrate. Chọn theo \`data-tab2\`, khung là \`.tab2\`.
  // Tên thuộc tính KHÁC hẳn tab lớn, cố ý: dùng chung tên thì một cú bấm tab con sẽ quét luôn
  // cả tab lớn, và người xem bị đá về trang đầu mà không hiểu vì sao.
  function chon2(id){
    [].slice.call(document.querySelectorAll('.tabs2 button')).forEach(function(b){
      b.setAttribute('aria-selected', String(b.dataset.tab2 === id));
    });
    [].slice.call(document.querySelectorAll('.tab2')).forEach(function(d){ d.hidden = (d.id !== id); });
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.tabs2 button');
    if (b) { chon2(b.dataset.tab2); return; }

    // Bảng đối chiếu nhảy thẳng vào tab con của một lượt.
    var g2 = e.target.closest && e.target.closest('[data-goto2]');
    if (g2) {
      e.preventDefault();
      chon2(g2.dataset.goto2);
      var el2 = document.getElementById(g2.dataset.goto2);
      if (el2) el2.scrollIntoView({ behavior:'smooth', block:'start' });
      return;
    }

    // NHẢY CHÉO TAB. Không có đoạn này thì mọi liên kết \`data-goto\` là chữ chết: trình duyệt
    // nhảy tới một id đang nằm trong tab BỊ ẨN, nên không có gì xảy ra cả — và hỏng IM LẶNG,
    // người bấm chỉ thấy trang không nhúc nhích. Đã để lọt đúng lỗi này ở bản trước.
    var g = e.target.closest && e.target.closest('[data-goto]');
    if (g) {
      e.preventDefault();
      chon(g.dataset.goto, true);
      var el = document.getElementById((g.getAttribute('href') || '').slice(1));
      if (el) {
        if (el.tagName === 'DETAILS') el.open = true;
        el.scrollIntoView({ behavior:'smooth', block:'start' });
      }
      return;
    }

    // Mục lục nhảy trong cùng tab
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
    // LỌC TÊN FILE MÃ NGUỒN. Ba ô này in thẳng chữ do phiên trước gõ vào hồ sơ trạng thái, và
    // phiên trước là một AI — nó gõ tên file rất tự nhiên. Nhưng đây là ô đầu tiên của tab đầu
    // tiên, tức chỗ người KHÔNG đọc code nhìn trước hết. Lọc ở đây thay vì bắt mọi phiên nhớ
    // viết khác: bắt người nhớ là sẽ có ngày quên, và lúc quên thì không ai thấy.
    ? `<div class="m ${lop || ""}"><span class="nhan">${esc(nhan)}</span><span class="gt${to ? " to" : ""}">${esc(boTenFile(String(gt).replace(/^"|"$/g, "")))}</span></div>`
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
  // Dùng CHUNG bảng giá trị với validator (`LIFECYCLES` của build-dashboard). Bản đầu dùng
  // "proven"/"retired" — hai giá trị mà validator TỪ CHỐI, nên không repo hợp luật nào chạm
  // tới được; còn bốn giá trị hợp lệ thì không có chặng nào trên vòng đời. Hai bảng, một sự thật.
  return DA_XONG.has(lifecycle) ? 0 : 1;
}

/* Bốn chặng, và MỌI giá trị validator chấp nhận đều phải rơi vào một chặng. Phép kiểm
   `tests/core-contract.mjs` khối F3 cưỡng chế hai chiều: không chặng nào dùng giá trị lạ, và
   không giá trị hợp lệ nào rơi ra ngoài bảng. */
export const DA_XONG = new Set(["active", "archived", "superseded"]);
export const VONG_DOI = {
  idea: { ten: "Ý TƯỞNG", i: 0 },
  building: { ten: "ĐANG DỰNG", i: 1 },
  experimental: { ten: "THỬ NGHIỆM", i: 1 },
  active: { ten: "ĐANG CHẠY", i: 2 },
  paused: { ten: "TẠM DỪNG", i: 2 },
  archived: { ten: "ĐÃ NGHỈ", i: 3 },
  superseded: { ten: "ĐÃ THAY THẾ", i: 3 }
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


/* BẮT ĐẦU Ở ĐÂU — ba câu hỏi, ba lệnh. Đặt NGAY dưới NOW/NEXT vì đây là thứ người mở trang
   cần nhiều nhất, và trước đây nó nằm tận tab thứ ba. Cuộn để tìm việc hay làm nhất là lỗi bày
   trang, không phải lỗi người đọc. */
export function khoiBatDau(dl) {
  return `<div class="the batdau">
    <h2>Bắt đầu ở đâu</h2>
    <div class="cols">
      <div><h3>Repo này đang thế nào?</h3><pre class="code"><code>npm run gate -- --as duc</code></pre>
        <p>XANH TOÀN BỘ = xong. ĐỎ = chưa xong, mỗi dòng nói luôn cách sửa.</p></div>
      <div><h3>Repo kia còn cách chuẩn bao xa?</h3><pre class="code"><code>npm run assess -- &lt;đường-dẫn&gt;</code></pre>
        <p>Ra mức 0–3 và ba con số chi phí: thả · viết · soi.</p></div>
      <div><h3>Xem lại trang này</h3><pre class="code"><code>npm run overview -- bang.html</code></pre>
        <p>Rồi mở <code>bang.html</code> bằng trình duyệt.</p></div>
    </div>
    <p style="color:var(--mo);font-size:13.2px;margin-bottom:0">Không cần cài gì thêm — không thư viện ngoài, không gọi mạng, không tài khoản. Chỉ cần Node và git.</p>
  </div>`;
}

/* TRANG LIÊN QUAN — đọc thẳng từ bản đồ mục 6, không khai lần thứ hai.
   Trang vệ tinh (sổ migrate…) trước đây không có đường nào dẫn tới từ trang mẹ, nên coi như
   không tồn tại với người chỉ mở một link.

   ĐỔI 04/09, và đây là chỗ dễ hỏng ÂM THẦM nhất của cả bản vá này. Bản trước tìm chuỗi
   `https://claude.ai/code/artifact/`, tức trang vệ tinh CHỈ hiện ra khi nó là artifact trên
   claude.ai. Đức chốt bảng ở dạng file HTML trong repo — nên với phép tìm cũ, bỏ artifact đi
   là khối này rỗng VĨNH VIỄN và đường dẫn tới sổ migrate mất hẳn khỏi trang mẹ, mà trang vẫn
   sinh ra bình thường nên không ai thấy.

   Nay tìm LIÊN KẾT MARKDOWN `[chữ](file.html)`, và chỉ nhận khi file đó CÓ THẬT trong HEAD —
   một link chết trên trang mẹ còn tệ hơn không có link. Đòi dạng ngoặc đầy đủ là để
   `<file-tạm.html>` và `bang.html` viết trong câu văn không lọt vào. */
/* MÔ HÌNH VẬN HÀNH — ba khối, Đức mô tả 06/09.
 *
 * Vì sao khối này đáng có: mọi tab khác của trang trả lời "repo đang thế nào". Không tab nào
 * trả lời "cái này VẬN HÀNH ra sao" — mà đó lại là câu đầu tiên của bất kỳ ai mới nhìn thấy
 * nó, kể cả một phiên AI mới mở. Trước khi có khối này, câu trả lời nằm rải ở bốn file
 * protocol, và muốn hiểu phải đọc hết cả bốn.
 *
 * SUY TỪ DỮ LIỆU, KHÔNG GÕ TAY. Danh sách protocol đọc từ `docs/protocols`, đề bài đọc từ
 * `docs/briefs`, repo đích đọc từ `docs/migrations`. Gõ tay thì ba tháng nữa nó nói về một bộ
 * khung không còn tồn tại — đúng bệnh mà cả repo này sinh ra để chữa. */
export function khoiMoHinh({ lenh = [], protocols = [], briefs = [], dichDen = [], soPhepKiem = null }) {
  const muc = (x) => `<li>${x}</li>`;
  const hop = (ten, items) => items.length
    ? `<div class="mh-hop"><h4>${esc(ten)}</h4><ul>${items.join("")}</ul></div>` : "";
  const mui = (nhan) => `<div class="mh-mui"><span class="ky">&#9654;</span><span class="nh">${esc(nhan)}</span></div>`;

  /* Khối 1 — DỮ LIỆU LÕI. Ba tầng của repo nhà, đúng ba tầng mà cổng đóng phiên canh. */
  const loi = [
    hop("Luật", [muc("<code>AGENTS.md</code> — hiến pháp, một trang"),
      muc("<code>decisions.md</code> + <code>docs/adr/</code> — đã chốt gì, vì sao")]),
    hop("Máy", [muc(`<b>${lenh.length}</b> lệnh chạy được`),
      muc(soPhepKiem === null ? "suite phép kiểm ghim hành vi" : `<b>${soPhepKiem}</b> suite phép kiểm ghim hành vi`),
      muc("cổng đóng phiên · cổng xuất bản · bảng chủ sở hữu")]),
    hop("Trạng thái", [muc("<code>STATUS.md</code> · <code>HANDOFF.md</code> · <code>BACKLOG.md</code>"),
      muc("<code>.agents/claims.json</code> — ai đang giữ vùng nào")])
  ].join("");

  /* Khối 2 — PROTOCOL. Đây là thứ ĐI RA NGOÀI: việc lặp lại, có checklist, giao được cho AI khác. */
  /* Tên ba việc lấy THẲNG từ bảng `VIEC` của `giao-viec.mjs`, không suy từ tên file. Suy từ
   * tên file thì `BRAINSTORM-GPT-V1.md` hoá ra một `--viec brainstorm` không tồn tại, và trang
   * dạy người ta gõ một lệnh chạy không được. */
  const tenFile = new Map(briefs.map((b) => [b.file, b.tieuDe]));
  const dsBrief = Object.entries(VIEC).map(([khoa, cf]) => {
    const tieuDe = tenFile.get(String(cf.doc).split("/").pop()) || cf.nhan;
    return muc(`<code>--viec ${esc(khoa)}</code> — ${esc(tieuDe.replace(/^PHẦN VIỆC — /, ""))}`);
  });
  const proto = [
    hop("Ba việc giao được", dsBrief.length ? dsBrief : [muc("chưa khai đề bài nào")]),
    hop("Quy trình đầy đủ", protocols.map((p) => muc(esc(p.tieuDe.replace(/^QUY TRÌNH — /, "")))) ),
    hop("Ai thực thi", [muc("Claude Code · Codex CLI · GPT — cùng một đề bài"),
      muc("<code>npm run giao-viec</code> đo repo đích rồi mới ghép đề bài")])
  ].join("");

  /* Khối 3 — REPO ĐÍCH. Đọc từ hồ sơ migrate: đó là bằng chứng, không phải trí nhớ. */
  const dsDich = dichDen.length
    ? dichDen.map((d) => muc(`${esc(d.ten)} <span class="ref">${esc(d.trangThai || "—")}</span>`))
    : [muc("chưa repo nào")];
  const dich = [
    hop(`${dichDen.length} repo đã lắp`, dsDich),
    hop("Ở repo đích có gì", [muc("cùng bộ luật, cùng cổng kiểm, cùng bảng chủ sở hữu"),
      muc("<code>.ark/harness.lock.json</code> — ghim đang dùng bản khung nào")])
  ].join("");

  return `<div class="the">
  <h2>Mô hình vận hành — ba khối</h2>
  <p>Bộ khung không phải một thư mục file đem chép. Nó là <strong>một khối dữ liệu lõi</strong>
  tự cải tiến, <strong>một lớp protocol</strong> biến việc lặp lại thành đề bài giao được, và
  <strong>các repo đích</strong> nhận bản phát rồi gửi ngược chỗ vấp về lõi.</p>
  <div class="mh">
    <div class="mh-cot loi">
      <span class="mh-so">Khối 1</span>
      <span class="mh-ten">Dữ liệu lõi</span>
      <p class="mh-mota">Repo nhà. Một nguồn sự thật cho luật, bộ máy và trạng thái.</p>
      ${loi}
    </div>
    ${mui("phát bản")}
    <div class="mh-cot">
      <span class="mh-so">Khối 2</span>
      <span class="mh-ten">Protocol</span>
      <p class="mh-mota">Việc lặp lại, có checklist, đo được bằng máy — nên giao được cho AI khác.</p>
      ${proto}
    </div>
    ${mui("thi hành")}
    <div class="mh-cot">
      <span class="mh-so">Khối 3</span>
      <span class="mh-ten">Repo đích</span>
      <p class="mh-mota">Repo đang sống, có việc và người dùng riêng. Bộ khung là khách.</p>
      ${dich}
    </div>
  </div>
  <div class="mh-vong">
    <b>Vòng ngược — đây mới là chỗ bộ khung lớn lên.</b> Repo đích vấp ở đâu thì chỗ đó thành
    một mục trong sổ nợ của lõi, rồi thành một bản vá, rồi thành một phép kiểm ghim để nó không
    tái diễn. Ba lượt migrate đầu tìm ra <b>9 · 8 · và một loạt</b> lỗi <em>của chính bộ khung</em>
    — không phải của repo đích. Không có vòng ngược thì lõi chỉ đúng trên giấy.
  </div>
</div>`;
}

/* ---- KHỐI CỦA NĂM TAB MỚI ------------------------------------------------------------
 *
 * Mỗi khối dưới đây trả lời ĐÚNG MỘT câu, và câu đó viết ngay trên đầu hàm. Khối nào không nói
 * được nó trả lời câu gì thì nó là trang trí — và trang trí trên một bảng trạng thái là thứ làm
 * người ta thôi đọc cả bảng.
 */

/* "Còn việc nào đang chờ chính tôi?" — quét dấu đặt ngay trên dòng của mục, ở bốn sổ. */
export function khoiCanDuc(canDuc, tenNguoi) {
  if (!canDuc.length) {
    return '<div class="the"><h2>Cần ' + esc(tenNguoi) + '</h2>'
      + '<p>Không mục nào đang mang dấu chờ. <strong>Đọc đúng chữ:</strong> nghĩa là chưa ai '
      + '<em>đánh dấu</em> việc nào cần ' + esc(tenNguoi) + ' — không phải là không có việc nào. '
      + 'Muốn một mục hiện ở đây thì đặt <code>@Đức:bấm</code> hoặc <code>@Đức:chốt</code> ngay '
      + 'trên dòng của mục đó trong sổ nợ, sổ ý tưởng hay hồ sơ trạng thái.</p></div>';
  }
  const bam = canDuc.filter((c) => c.loai === "bam").length;
  const chot = canDuc.length - bam;
  const dong = canDuc.map((c) => '<div class="cd">'
    + '<span class="lo ' + c.loai + '">' + (c.loai === "bam" ? "BẤM" : "CHỐT") + '</span>'
    + '<span class="c">' + esc(boTenFile(c.cau))
    + '<span class="tu">' + esc(c.tuoi) + ' · nêu trong ' + esc(c.file) + '</span></span></div>').join("");
  return '<div class="the"><h2>Cần ' + esc(tenNguoi) + ' — ' + canDuc.length + ' việc · '
    + bam + ' bấm · ' + chot + ' chốt</h2>' + dong
    + '<p class="ghi"><strong>BẤM</strong> là việc tay vài phút, gom được thành một buổi. '
    + '<strong>CHỐT</strong> là việc cần nghĩ, mỗi cái một lượt. Số ngày treo <strong>đo bằng '
    + 'lịch sử kho mã</strong>, không đọc đồng hồ. Bảng <strong>không giữ danh sách này</strong>: '
    + 'nó quét dấu ngay trên dòng của mục, nên mục đóng thì dấu mất theo — không ai phải nhớ đi '
    + 'xoá ở một chỗ thứ hai.</p></div>';
}

/* "Ngay lúc này có mấy luồng đang chạy, và chúng đang làm gì?" */
export function khoiDangLamGi(khoa, ngay, vet = new Map()) {
  const giu = khoa.filter((k) => k.owner);
  /* CÂU IN RA LẤY TỪ `noiDauVet`, không viết lại ở đây.
   *
   * Ba chỗ hiển thị tín hiệu này (`claim.mjs --list` · khối này · cổng đóng phiên) phải nói ĐÚNG
   * MỘT câu. Chỗ nào tự viết lại là chỗ đó sẽ rút gọn thành "rảnh" — và "rảnh" chính là cách đọc
   * đã làm một lane mất việc ngày 06/09. Tên của tín hiệu là phần của hợp đồng. */
  const noi = (k) => {
    // Tuổi thay cho mốc thô: "giữ 40 phút" đọc được ngay, "2026-09-06T09:40:00Z" thì phải tự trừ.
    // Không tính được tuổi thì mới in mốc — thà xấu còn hơn giấu.
    const gio = ageHours(k.tu);
    const coGio = mocCoGio(k.tu);
    // Mốc chỉ có ngày thì KHÔNG nói giờ — xem `mocCoGio` ở `claim.mjs`, con số ma đã bật ⚠ thật.
    const phan = [gio != null ? (coGio ? "giữ " + ageLabel(gio, true) : ageLabel(gio, false)) : k.tu ? "từ " + k.tu : null];
    if (dangNhac(gio, coGio)) phan.push(coGio ? "⚠ quá " + GIO_NHAC_BANG + "h" : "⚠ quá một ngày");
    phan.push(noiDauVet(vet.get(k.khoa)));
    const co = phan.filter(Boolean);
    return co.length ? " · " + esc(co.join(" · ")) : "";
  };
  const than = giu.length
    ? giu.map((k) => NHAN_KHOA + '<div class="kh"><span class="t">' + esc(k.owner)
        + '<small>' + esc(k.task || "chưa khai đang làm gì") + ' · giữ khoá <code>' + esc(k.khoa)
        + '</code>' + noi(k) + '</small></span>'
        + '<span class="hieu ' + (vet.get(k.khoa) === DAU_VET.CHUA ? "cho" : "ban") + '">'
        + (vet.get(k.khoa) === DAU_VET.CHUA ? "CHƯA THẤY DẤU VẾT" : "ĐANG GIỮ") + '</span></div>').join(NL)
    : NHAN_KHOA + '<p>Không luồng nào đang giữ vùng trong repo này.</p>';
  /* MỖI DÒNG MỘT KHOÁ, và mỗi dòng mang nhãn. Nối chúng bằng xuống dòng chứ không nối liền:
   * bộ lọc làm việc theo DÒNG, nên hai khoá nằm chung một dòng thì hoặc lọt cả hai hoặc lọc
   * cả hai — không có cách nào đúng. */
  return NHAN_KHOA + '<div class="the"><h2>Đang làm gì — ảnh chụp lúc sinh bảng · ' + giu.length + ' luồng</h2>' + NL
    + than + NL
    + '<p class="ghi"><strong>Khối này không thấy hai thứ.</strong> Một: <em>luồng đang chạy ở '
    + 'repo khác</em> — bảng của repo này chỉ thấy repo của nó. Hai: <em>luồng vừa được giao mà '
    + 'chưa kịp nhận vùng</em> — lúc đó nó chưa để lại dấu vết nào trong repo. Nên dòng "không '
    + 'luồng nào đang chạy" đọc đúng là <strong>"không luồng nào đang giữ vùng trong repo '
    + 'này"</strong>. Đây là ảnh chụp theo lần ghi gần nhất vào repo (' + esc(ngay)
    + '), không phải số liệu thời gian thực.</p>' + NL
    + NHAN_KHOA + '<p class="ghi"><strong>"Repo chưa thấy dấu vết" KHÔNG có nghĩa là luồng đó rảnh.</strong> '
    + 'Repo chỉ thấy được thứ đã chạm repo, mà một luồng cẩn thận thì dựng nháp ở ngoài rồi mới ghi vào. '
    + 'Ngày 06/09 một luồng bị đọc nhầm đúng như vậy và bị nhả khoá hộ, phải hoàn nguyên phần đã xong. '
    + '<strong>Đừng nhả khoá của luồng khác vì con số này</strong> — hỏi luồng đó, hoặc hỏi Đức.</p></div>';
}

/* "Còn mấy chỗ trống để giao việc song song?" — cố ý KHÔNG kể ai giữ, khối trên đã kể rồi. */
export function khoiKhoa(khoa) {
  const mo = khoa.filter((k) => !k.owner).length;
  const dong = khoa.map((k) => NHAN_KHOA + '<div class="kh"><span class="t">' + esc(k.khoa) + '</span>'
    + '<span class="hieu ' + (k.owner ? "ban" : "mo") + '">' + (k.owner ? "BẬN" : "MỞ")
    + '</span></div>').join(NL);
  return NHAN_KHOA + '<details class="the"><summary>Khoá làm việc — ' + khoa.length + ' khoá, ' + mo
    + ' đang mở<span class="tt">mở ra khi cần giao việc song song</span></summary>' + NL
    + '<div class="in">' + NL + dong + NL
    + '<p class="ghi">Bảng này trả lời đúng một câu: <strong>còn mấy chỗ trống để giao việc song '
    + 'song</strong>. Hai việc chạy song song được <strong>khi và chỉ khi</strong> chúng thuộc hai '
    + 'khoá khác nhau và cả hai đang MỞ. Khoá BẬN thì chỉ đọc, đừng giao thêm.</p></div></details>';
}

/* Thanh ba bậc của một ý tưởng.
 *
 * Bậc "nghỉ" KHÔNG phải bậc thứ tư trên đường đi — nó là nhánh rẽ ra. Vẽ nó thành chấm rỗng có
 * gạch ngang, chứ vẽ nó ở cuối thanh là báo cáo sai chiều: một ý tưởng đã bỏ trông y hệt một ý
 * tưởng gần xong. */
const BAC_HIEN = [["ý tưởng", "Ý TƯỞNG"], ["đang xây", "ĐANG XÂY"], ["đã chứng minh", "ĐÃ CHỨNG MINH"]];
function thanhBac(bac) {
  const nghi = bac === "nghỉ";
  const i = nghi ? -1 : BAC_HIEN.findIndex((x) => x[0] === bac);
  const o = [];
  BAC_HIEN.forEach((x, n) => {
    if (n) o.push('<span class="l' + (!nghi && n <= i ? " qua" : "") + '"></span>');
    const lop = nghi ? "" : (n < i ? " qua" : (n === i ? " nay" : ""));
    o.push('<span class="b' + lop + '"><span class="d"></span><span class="nh">' + esc(x[1]) + '</span></span>');
  });
  return '<span class="bac' + (nghi ? " nghi" : "") + '">' + o.join("") + '</span>';
}

/* BỎ TÊN FILE MÃ NGUỒN khỏi chữ hiện ở tab đầu.
 *
 * Tab đầu viết cho người KHÔNG đọc code — một phép kiểm cũ ghim đúng chỗ đó, và nó bắt được
 * bản đầu của khối này: sổ ý tưởng có mục nhắc tên một file `.mjs` ngay trong dòng "việc kế",
 * và dòng đó chảy thẳng ra trang đầu. Lọc ở ĐÂY chứ không sửa sổ: sổ là chữ của người viết,
 * và ở tab Ý tưởng thì tên file lại đúng chỗ. Cùng một câu, hai nơi đọc, hai mức chi tiết. */
export function boTenFile(t) {
  return String(t)
    .replace(/`?[\w./-]+\.(mjs|js|json|ts|py|sh)`?/g, "một file mã nguồn")
    .replace(/\s+/g, " ").trim();
}

/* "Những hướng đang mở của repo đang ở bước nào?" — bản rút gọn, cho tab Tổng quan. */
export function khoiYTuongGon(ideas) {
  if (!ideas.length) return "";
  const dong = ideas.map((y) => '<div class="yt"><span>'
    + '<a href="#y-' + esc(slug(y.ma)) + '" data-goto="y-tuong">' + esc(y.ma) + ' · ' + esc(boTenFile(y.ten)) + '</a>'
    + (y.viecKe ? '<span class="ke">' + esc(boTenFile(y.viecKe)) + '</span>' : "")
    + '</span>' + thanhBac(y.bac) + '</div>').join("");
  return '<div class="the"><h2>Ý tưởng đang ở bước nào — ' + ideas.length + ' hướng</h2>' + dong
    + '<p class="ghi">Ba bước là đường đi thật của một ý tưởng. <strong>Nghỉ</strong> không phải '
    + 'bước thứ tư — ý tưởng đã nghỉ hiện thanh rỗng có gạch ngang, để không ai đọc nhầm là gần '
    + 'xong. Bấm tên để xem chi tiết ở tab <strong>Ý tưởng</strong>.</p></div>';
}

/* Tab Ý tưởng — mỗi ý tưởng một thẻ gập.
 *
 * GIỮ NGUYÊN mọi trường lạ (`extra`). Ai viết thêm `- **rủi ro:** …` vào sổ thì dòng đó vẫn hiện
 * lên bảng. Bảng không được im lặng nuốt chữ của người viết. */
export function khoiYTuongDay(ideas) {
  if (!ideas.length) {
    return '<div class="the"><h2>Sổ ý tưởng</h2><p>Repo này chưa có <code>IDEAS.md</code>. '
      + 'Sổ ý tưởng là <em>phòng chờ</em>: chỗ để một hướng nằm lại trước khi có người bắt tay '
      + 'làm — để nó không phải rơi vào sổ nợ (nơi mọi thứ trông như lỗi) mà cũng không bốc hơi.</p></div>';
  }
  return ideas.map((y) => {
    const kv = [["Việc kế", y.viecKe], ["Ai đang làm", y.chu || "chưa ai nhận"],
      ["Phạm vi", y.phamVi || "chưa khai"]].concat(y.extra).filter((x) => x[1]);
    const than = y.khoi.map((k) => '<h4>' + esc(k.ten) + '</h4><p>' + esc(k.than.join(" ")) + '</p>').join("");
    return '<details class="the" id="y-' + esc(slug(y.ma)) + '">'
      + '<summary>' + esc(y.ma) + ' · ' + esc(y.ten)
      + '<span class="tt">' + esc(y.viecKe || "chưa khai việc kế") + '</span></summary>'
      + '<div class="in">' + thanhBac(y.bac)
      + '<dl class="kv">' + kv.map((x) => '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>').join("") + '</dl>'
      + than + '</div></details>';
  }).join("");
}

/* "Repo chia vùng thế nào, ai được ghi vào đâu?" — tab DUY NHẤT được in đường dẫn. */
export function khoiCauTruc(vung, fileGoc, banDo) {
  const hangVung = vung.map((v) => '<div class="cay"><span class="p">' + esc(v.duong) + '</span>'
    + '<span class="st">' + esc(v.chu || "từng gói tự giữ") + '</span>'
    + '<span class="sl">' + v.soFile + ' file</span></div>').join("");
  const oFile = fileGoc.map((f) => '<span' + (f.may ? ' class="may"' : "") + '>' + esc(f.ten) + '</span>').join("");
  const sach = (t) => String(t).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");
  /* CẮT Ở RANH GIỚI CÂU, không cắt giữa chữ. Cắt giữa chữ rồi thêm ba chấm là câu đọc lên có
   * thể mang nghĩa khác hẳn nghĩa gốc — trên một bảng trạng thái thì đó là nói sai, không phải
   * là gọn. Không tìm được ranh giới nào thì thà để dài. */
  const gon = (t, max) => {
    const x = String(t).trim();
    if (x.length <= max) return x;
    const cat = x.slice(0, max);
    const i = Math.max(cat.lastIndexOf(" — "), cat.lastIndexOf(". "), cat.lastIndexOf(", "), cat.lastIndexOf(" · "));
    return (i > max * 0.4 ? cat.slice(0, i) : cat.slice(0, cat.lastIndexOf(" "))) + "…";
  };
  const hangBanDo = banDo.map((c) => '<div class="cay">'
    + '<span class="p">' + esc(sach(String(c[0]))) + '</span>'
    + '<span class="st">' + esc(gon(sach(String(c[1])), 78)) + '</span>'
    + '<span class="sl"></span></div>').join("");
  return '<div class="the"><h2>Thư mục ở tầng ngoài cùng — ' + vung.length + ' vùng</h2>' + hangVung
    + '<p class="ghi">Cột giữa là <strong>ai được ghi vào đó</strong>. Một vùng chỉ một AI được ghi '
    + 'tại một thời điểm; vùng của người khác thì chỉ được đọc.</p></div>'
    + '<div class="the"><h2>File ở gốc repo — ' + fileGoc.length + ' file</h2>'
    + '<div class="tep">' + oFile + '</div>'
    + '<p class="ghi">Ô tô xanh là file <strong>máy sinh</strong> — đừng sửa tay, sửa là mất ở lần '
    + 'sinh sau. Số còn lại là chữ của người.</p></div>'
    + '<div class="the"><h2>Khi cần gì thì mở file nào — ' + banDo.length + ' lối</h2>' + hangBanDo
    + '<p class="ghi">Bảng này <strong>đọc lại từ luật gốc</strong>, không phải bản chép — nên nó '
    + 'không thể nói khác luật.</p></div>';
}

/* "Repo đang nợ gì, và những con số 0 kia là sạch hay là chưa dò?" */
export function khoiSucKhoeNo(so, noMo, noMuc) {
  const o = so.map((x) => {
    const lop = x.so === null ? "" : (x.so === 0 ? " sach" : " ban");
    return '<div class="o' + lop + '"><span class="n">' + (x.so === null ? "?" : x.so) + '</span>'
      + '<span class="l">' + esc(x.nhan) + '</span>'
      + '<span class="m">' + esc(x.mau || "chưa khai đã dò bao nhiêu") + '</span></div>';
  }).join("");
  const daDong = noMuc.length - noMo.length;
  return '<div class="the"><h2>Sức khoẻ — mỗi phép dò kèm nó đã dò bao nhiêu</h2>'
    + '<div class="sk">' + o + '</div>'
    + '<p class="ghi">Một số <strong>0</strong> đứng một mình trông giống hệt nhau ở hai ca ngược '
    + 'nhau: <em>đã dò hết, sạch</em> và <em>chưa dò gì cả</em>. Dòng nhỏ dưới mỗi ô là thứ tách '
    + 'được hai ca đó. Dấu <strong>?</strong> nghĩa là KHÔNG ĐO ĐƯỢC — và nó khác 0.</p></div>'
    + '<div class="the"><h2>Việc còn nợ — ' + noMo.length + ' mục đang mở</h2>'
    + '<div class="hs"><span class="n">' + noMo.length + '</span><span class="t">đang mở trong sổ nợ</span></div>'
    + '<div class="hs"><span class="n">' + daDong + '</span><span class="t">đã đóng, giữ lại để tra</span></div>'
    + '<details><summary>Con số này đếm thế nào, và vì sao nó thà đếm thừa hơn đếm thiếu</summary>'
    + '<p>Đếm mục trong sổ nợ, và một mục tính là đã đóng <strong>chỉ khi mã của nó bị gạch</strong>. '
    + 'Không dò từ khoá "xong" trong văn xuôi — có mục viết <em>"gỡ khoá sau khi việc kia xong"</em>, '
    + 'và chữ "xong" ở đó là một điều kiện chứ không phải trạng thái. Dò giữa câu là <strong>đóng '
    + 'oan</strong> một việc đang mở, tức bảng báo <em>thiếu</em> nợ. Cố ý lệch về phía báo thừa: '
    + 'một việc bị đếm thừa thì có người mở ra xem rồi bỏ qua; một việc bị đếm thiếu thì biến mất '
    + 'và không ai đi tìm.</p></details></div>';
}

/* "Bảng này chạy thế nào, và nhiều AI cùng làm thì cái gì giữ cho không giẫm chân?" */
export function khoiVanHanh(coChe, batBien, soKhoa) {
  const cc = coChe.map((c) => '<li><strong>' + esc(c.ten) + '</strong> — '
    + esc(String(c.cau).replace(/\*/g, "")) + '</li>').join("");
  const bb = batBien.map((b) => '<li><strong>' + esc(b.so) + '</strong> ' + esc(b.cau) + '</li>').join("");
  return '<div class="the"><h2>Làm mới bảng này</h2>'
    + '<p>Bảng là <strong>ảnh chụp, không tự cập nhật</strong>. Dải đỏ ở đầu trang tự bật khi bạn '
    + 'mở nó vào một ngày khác ngày sinh — nó tính lúc <em>xem</em>, không lúc sinh, nên không cần '
    + 'sinh lại mới biết là cũ.</p>'
    + '<pre class="code">npm run overview</pre>'
    + '<p class="ghi">Bảng <strong>được commit vào repo</strong>, có chủ đích: nhờ vậy bất kỳ AI nào '
    + 'cũng sinh lại rồi commit được, không phải nhờ riêng một AI đăng hộ. Cổng đóng phiên so bảng '
    + 'đã commit với trạng thái repo mỗi phiên, nên bảng <strong>không thể âm thầm cũ</strong>. Nội '
    + 'dung suy hoàn toàn từ lần commit gần nhất, không nhìn đồng hồ — nhìn đồng hồ thì sang ngày là '
    + 'mọi phiên bị chặn đẩy dù không dữ liệu nào đổi.</p></div>'
    + (coChe.length
      ? '<div class="the"><h2>' + coChe.length + ' cơ chế giữ cho không giẫm chân</h2>'
        + '<p>Hiện có <strong>' + soKhoa + ' vùng</strong>, nên tối đa <strong>' + soKhoa
        + ' việc</strong> chạy song song được — việc thứ ' + (soKhoa + 1)
        + ' phải chờ một vùng được trả.</p><ul>' + cc + '</ul></div>'
      : "")
    + (batBien.length
      ? '<div class="the"><h2>' + batBien.length + ' điều không được phá</h2>'
        + '<p>Mỗi cái sinh ra từ một lần hỏng thật.</p><ul>' + bb + '</ul>'
        + '<p class="ghi">Các mục trên <strong>đọc lại từ luật</strong>, không phải bản chép — nên '
        + 'bảng không thể nói khác luật.</p></div>'
      : "");
}

/* "Đã đưa repo nào lên chuẩn, ngày nào, bản nào, còn treo gì?"
 *
 * VÌ SAO NÓ THÀNH MỘT TAB, chứ vẫn để là một trang riêng. Đức nêu 06/09: mở bảng mẹ mà **không
 * thấy đường nào dẫn sang sổ migrate**. Đường đó có thật — nó nằm trong khối "Trang liên quan"
 * ở tab đầu — nhưng nằm dưới bốn khối khác, nên trên thực tế nó không tồn tại. Một liên kết
 * người dùng không tìm ra thì bằng không có, và câu trả lời đúng không phải là bôi đậm nó lên.
 *
 * Trang riêng VẪN GIỮ: cả hai đọc chung một thư mục hồ sơ, nên chúng không thể nói khác nhau —
 * một nguồn, hai cách chiếu. Trang riêng có ích khi cần gửi riêng sổ migrate cho ai đó.
 *
 * TÁCH TỪNG LƯỢT THÀNH TAB CON, cũng theo Đức: ba hồ sơ nối đuôi nhau thì người mở ra phải
 * cuộn qua hai lượt cũ mới tới lượt mình cần, và mỗi hồ sơ đều dài. */
/* ---- Tab Migrate: BẢNG MỐC trước, chữ sau ---------------------------------
 *
 * Đức chốt 06/09, nguyên văn: *"mỗi khi tôi check status migrate, tôi sẽ thấy milestone lớn đang
 * ở bước nào, các feature đã được migrate thế nào, đã go live thế nào, trải qua các bước audit ra
 * sao. Nếu mà dừng lại bước nào tôi sẽ continue và chạy bước đó chứ tôi sẽ không đi sâu vào đọc
 * từng chữ."*
 *
 * Bản trước chiếu gần trọn thân hồ sơ ra màn hình. Chữ thì hay, nhưng nó trả lời sai câu hỏi:
 * người mở sổ hỏi *"đang ở đâu, làm gì tiếp"*, không hỏi *"lượt thứ hai viết gì"*. Nên bố cục đảo
 * lại: bảng mốc → việc kế → rồi mới tới chữ, và chữ **gập lại**.
 *
 * BA MỐC LỚN lấy từ `docs/protocols/CHUYEN-REPO-LEN-CHUAN.md` — *"migrate là BA việc trong một"*
 * (Đức chốt 05/09): **migrate** · **audit** · **assistant onboard**. Không tự đặt mốc mới ở đây;
 * bảng chỉ chiếu lại mốc mà quy trình đã khai, nếu không thì hai chỗ sẽ nói hai kiểu.
 *
 * "CHƯA KHAI" KHÔNG ĐƯỢC LÀM TRÒN THÀNH "CHƯA XONG". Ba hồ sơ đang có được ghi TRƯỚC khi bảng này
 * tồn tại, nên chúng không khai hai mốc sau. Suy bừa ra "chưa xong" là bịa một con số nợ; suy bừa
 * ra "xong" thì tệ hơn. Ô nào không có nguồn thì nói thẳng là chưa khai — và chính chỗ trống đó
 * là thông tin: nó chỉ ra hồ sơ đang thiếu gì. */

/** Ba mốc lớn của một lượt migrate. Thứ tự là thứ tự thật: không audit nổi thứ chưa nằm trong repo. */
export const MOC_MIGRATE = Object.freeze([
  { khoa: "viec_migrate", nhan: "Migrate", y: "bộ khung nằm trong repo đích, hình dạng đã khai, cổng chạy được" },
  { khoa: "viec_audit", nhan: "Audit", y: "đã quét repo đích, nợ tìm được đã nằm trong sổ nợ của nó" },
  { khoa: "viec_assistant", nhan: "AI onboard", y: "một phiên AI ở repo đích chạy được trọn vòng làm việc" }
]);

/**
 * Trạng thái một mốc, và **nguồn** của nó. Thuần, nên đột biến kiểm được.
 *
 * `nguon` là phần quan trọng: `"khai"` = hồ sơ tự nói · `"suy"` = bảng suy ra từ trường khác, và
 * phải nói rõ suy từ đâu · `null` = không có nguồn nào, ô để trống.
 */
export function xetMoc(fm, moc) {
  const raw = fm?.[moc.khoa];
  if (raw !== undefined && String(raw).trim() !== "") {
    const t = String(raw).trim().toLowerCase();
    const den = /^(xong|đã xong|có|xanh|đạt)$/.test(t) ? "xong" : /^(đang|dở|một phần)$/.test(t) ? "dang" : "chua";
    return { den, chu: String(raw).trim(), nguon: "khai" };
  }
  /* SUY, và chỉ suy ĐÚNG MỘT ô. Mức 3 là định nghĩa "đã lên chuẩn" của quy trình, nên `muc_sau`
   * trả lời được mốc 1 — và chỉ mốc 1. Hai mốc sau không có trường nào tương đương, nên chúng
   * để trống chứ không được mượn tạm con số của mốc 1. */
  if (moc.khoa === "viec_migrate") {
    const m = Number(fm?.muc_sau);
    if (Number.isFinite(m)) return { den: m >= 3 ? "xong" : "chua", chu: `mức ${m}`, nguon: "suy" };
  }
  return { den: "trong", chu: "chưa khai", nguon: null };
}

/** Một câu: lượt này dừng ở đâu, chạy gì để đi tiếp. Không có thì im, đừng bịa. */
export function viecKe(fm) {
  const khai = fm?.viec_ke;
  if (typeof khai === "string" && khai.trim()) return khai.trim();
  const cong = String(fm?.cong_dong_phien || "").trim().toLowerCase();
  if (cong && !/xanh/.test(cong)) return "cổng đóng phiên chưa xanh — chạy lại `node scripts/session-check.mjs --as <phiên>` ở repo đó";
  for (const moc of MOC_MIGRATE) {
    const x = xetMoc(fm, moc);
    if (x.den === "chua" || x.den === "dang") return `mốc "${moc.nhan}" chưa xong — ${moc.y}`;
  }
  return null;
}

export function khoiMigrate(hoSo) {
  if (!hoSo.length) {
    return '<div class="the"><h2>Sổ migrate</h2><p>Chưa lượt migrate nào được ghi hồ sơ. '
      + 'Mỗi lần đưa một repo lên chuẩn thì thêm <strong>một</strong> hồ sơ, chỉ thêm — migrate '
      + 'xảy ra thưa, vài tuần có khi vài tháng một lần, nên không ghi là lần sau dò lại từ đầu '
      + 'và vấp đúng chỗ cũ.</p></div>';
  }
  const den = { "xanh": "xanh", "đỏ": "do", "chưa chạy": "vang" };
  const v = (h, k) => (h.fm[k] === undefined || h.fm[k] === "" ? null : String(h.fm[k]));
  const id = (h) => "mg-" + slug(v(h, "repo") || h.file);
  const O = { xong: "✓", chua: "✗", dang: "◐", trong: "·" };

  /* ---- 1. BẢNG MỐC. Ô đầu tiên người mở sổ nhìn vào. ---------------------- */
  const hangMoc = hoSo.map((h) => {
    const o = MOC_MIGRATE.map((m) => {
      const x = xetMoc(h.fm, m);
      return '<td class="so mc mc-' + x.den + '" title="' + esc(m.nhan + ": " + x.chu + (x.nguon === "suy" ? " (suy ra)" : "")) + '">'
        + O[x.den] + (x.nguon === "suy" ? '<sup>?</sup>' : "") + '</td>';
    }).join("");
    const cong = v(h, "cong_dong_phien") || "chưa khai";
    return '<tr><td><a href="#' + esc(id(h)) + '" data-goto2="' + esc(id(h)) + '">'
      + esc(v(h, "repo") || h.file) + '</a><small>' + esc(v(h, "ngay") || "—") + '</small></td>'
      + o
      + '<td class="so"><span class="cham ' + (den[cong.trim()] || (/xanh/i.test(cong) ? "xanh" : "vang")) + '"></span>' + esc(cong) + '</td>'
      + '<td class="so">' + esc(v(h, "ban_khung") || "—") + '</td>'
      + '<td>' + esc(v(h, "trang_thai") || "chưa khai") + '</td></tr>';
  }).join("");

  /* ---- 2. VIỆC KẾ. Chỉ hiện repo còn dở — repo xong rồi thì không có gì để nói. */
  const ke = hoSo.map((h) => [h, viecKe(h.fm)]).filter(([, k]) => k);
  const khoiKe = ke.length
    ? '<div class="the"><h2>Dừng ở đâu — ' + ke.length + ' lượt còn việc</h2>'
      + ke.map(([h, k]) => '<div class="kh"><span class="t">' + esc(v(h, "repo") || h.file)
        + '<small>' + esc(k) + '</small></span>'
        + '<a class="hieu ban" href="#' + esc(id(h)) + '" data-goto2="' + esc(id(h)) + '">MỞ HỒ SƠ</a></div>').join("")
      + '</div>'
    : '<div class="the"><h2>Dừng ở đâu</h2><p>Không lượt nào đang dở — cả ' + hoSo.length
      + ' hồ sơ đều khai xong và cổng đóng phiên xanh.</p></div>';

  /* ---- 3. Tab con từng repo: SỐ trước, chữ GẬP LẠI ---------------------- */
  const nut = hoSo.map((h, i) => '<button role="tab" data-tab2="' + esc(id(h)) + '"'
    + ' aria-selected="' + (i === 0 ? "true" : "false") + '">'
    + '<span class="cham ' + (den[String(v(h, "cong_dong_phien") || "").trim()] || "vang") + '"></span>'
    + esc(v(h, "repo") || h.file)
    + '<small>' + esc(v(h, "ngay") || "chưa khai ngày") + '</small></button>').join("");

  const oSo = (h) => [["mức đạt chuẩn", (v(h, "muc_truoc") || "?") + " → " + (v(h, "muc_sau") || "?")],
    ["lỗi bộ khung tìm ra", v(h, "loi_tim_ra") || "chưa khai"],
    ["cổng đóng phiên", v(h, "cong_dong_phien") || "chưa khai"],
    ["kết quả", v(h, "trang_thai") || "chưa khai"]]
    .map((x) => '<div class="o"><span class="n">' + esc(x[1]) + '</span><span class="l">' + esc(x[0]) + '</span></div>')
    .join("");

  const mocCon = (h) => MOC_MIGRATE.map((m) => {
    const x = xetMoc(h.fm, m);
    return '<div class="kh"><span class="t">' + O[x.den] + " " + esc(m.nhan)
      + '<small>' + esc(m.y) + '</small></span>'
      + '<span class="hieu ' + (x.den === "xong" ? "mo" : x.den === "trong" ? "tt" : "ban") + '">'
      + esc(x.chu) + (x.nguon === "suy" ? " (suy ra)" : "") + '</span></div>';
  }).join("");

  const khung = hoSo.map((h, i) => '<div class="tab2" id="' + esc(id(h)) + '"' + (i === 0 ? "" : " hidden") + '>'
    + '<div class="the"><h2>' + esc(v(h, "repo") || h.file) + '</h2>'
    + '<p class="ghi">' + esc(v(h, "ngay") || "chưa khai ngày") + ' · bản khung <code>'
    + esc(v(h, "ban_khung") || "?") + '</code> · ' + esc(v(h, "nghe") || "chưa khai nghề") + '</p>'
    + '<div class="sk">' + oSo(h) + '</div>'
    + mocCon(h)
    + '<div class="hs-do">chi phí trước: ' + esc(v(h, "chi_phi_truoc") || "chưa khai")
    + ' &nbsp;·&nbsp; sau: ' + esc(v(h, "chi_phi_sau") || "chưa khai") + '</div>'
    + '</div>'
    /* CHỮ GẬP LẠI, và mặc định ĐÓNG. Toàn văn hồ sơ là thứ đáng giữ — chỗ vấp thật nằm trong đó —
     * nhưng nó là thứ đọc KHI CẦN, không phải thứ đập vào mắt mỗi lần mở sổ. */
    + '<details class="the gap"><summary>Toàn văn hồ sơ — chỗ vấp, cách chữa, số đo từng bước</summary>'
    + md(h.body) + '</details></div>').join("");

  return '<div class="the"><h2>Sổ migrate — ' + hoSo.length + ' lượt · ba mốc mỗi lượt</h2>'
    + '<div class="tw"><table class="mgt"><thead><tr><th>Repo</th>'
    + MOC_MIGRATE.map((m) => '<th class="so" title="' + esc(m.y) + '">' + esc(m.nhan) + '</th>').join("")
    + '<th class="so">Cổng</th><th class="so">Bản khung</th><th>Kết quả</th></tr></thead><tbody>'
    + hangMoc + '</tbody></table></div>'
    + '<p class="ghi"><strong>✓ xong · ◐ đang · ✗ chưa · · chưa khai.</strong> Dấu <sup>?</sup> nghĩa là '
    + 'bảng <em>suy ra</em> từ trường khác, không phải hồ sơ tự khai — chỉ mốc <em>Migrate</em> suy được '
    + '(từ <code>muc_sau</code>). Ô trống <strong>không</strong> có nghĩa là chưa làm: ba hồ sơ đang có '
    + 'được ghi trước khi bảng này tồn tại nên chúng không khai hai mốc sau. Hồ sơ từ nay khai thêm '
    + '<code>viec_audit</code> · <code>viec_assistant</code> · <code>viec_ke</code> thì ô tự đầy.</p>'
    + '<p class="ghi">Hồ sơ <strong>chỉ thêm, không sửa cái cũ</strong>. Cột <em>lỗi tìm ra</em> ở tab con '
    + 'đếm lỗi <strong>của chính bộ khung</strong> mà lượt ấy lôi ra, không phải lỗi của repo đích: '
    + 'đó là chỗ bộ khung lớn lên.</p></div>'
    + khoiKe
    + '<nav class="tabs2" role="tablist">' + nut + '</nav>'
    + khung;
}

export function khoiLienQuan(banDo, trangCo) {
  const co = trangCo instanceof Set ? trangCo : new Set(trangCo || []);
  const item = [];
  for (const c of banDo || []) {
    for (const m of String(c[1] || "").matchAll(/\]\(([^()\s]+\.html)\)/g)) {
      const url = m[1];
      // Bỏ chính trang mẹ: một trang tự trỏ về mình trong mục "trang liên quan" là nhiễu.
      if (url === TRANG_FILE || !co.has(url)) continue;
      const ten = String(c[0]).split("**").join("");
      item.push(`<li><a href="${esc(url)}">${esc(ten)}</a></li>`);
    }
  }
  if (!item.length) return "";
  return `<div class="the"><h2>Trang liên quan</h2><ul class="lienquan">${item.join("")}</ul></div>`;
}

export function trang(dl) {
  const { ten, ban, ngay, so, lenh, banDo, workflows, protocols, adrs, legend, nhatKy, daXong = [], huongDan, st,
    briefs = [], dichDen = [], soPhepKiem = null,
    ideas = [], canDuc = [], khoa = [], vetKhoa = new Map(), noMo = [], noMuc = [], coChe = [], batBien = [], vung = [], fileGoc = [], hoSo = [], laRepoNha = false } = dl;
  const tenNguoi = dl.tenNguoiChot || "người chốt";

  const tabs = [
    // Thứ tự = tần suất dùng, không phải thứ tự viết ra. "Cách vận hành" và "Sổ tay" là hai
    // tab mở hằng ngày; "Làm được gì" chỉ đọc một lần lúc mới vào.
    // CHÍN TAB, và con số chín là có chủ đích.
    //
    // Bản trước có mười tab và vẫn thiếu năm thứ Đức hỏi tới (AI điều phối · Ý tưởng · Vận hành
    // · Sức khoẻ & nợ · Cấu trúc). Thêm thẳng vào là mười lăm tab — và một bảng mười lăm tab thì
    // không ai tìm nổi mục mình cần, tức bảng chết theo kiểu khác. Nên bốn tab cũ được GỘP vào
    // chỗ đúng của chúng thay vì đứng riêng: "Sổ tay" + "Bảo trì" + "Cách vận hành" → **Vận
    // hành**; "Làm được gì" → **Mô hình** (nó vốn là danh sách tính năng của khối dữ liệu lõi);
    // "Đã xong" → **Nhật ký**; "Bên trong" → **Cấu trúc**.
    //
    // Thứ tự = tần suất dùng, không phải thứ tự viết ra.
    ["tong-quan", "Tổng quan"],
    ["ai-dieu-phoi", "AI điều phối"],
    ["y-tuong", "Ý tưởng"],
    ["mo-hinh", "Mô hình"],
    ["van-hanh", "Vận hành"],
    ["suc-khoe", "Sức khoẻ & nợ"],
    ["cau-truc", "Cấu trúc"],
    ["migrate", "Migrate"],
    ["nhat-ky", "Nhật ký"],
    ["tra-cuu", "Tra cứu"]
  ].filter(([id]) => {
    // Tab nào không có nguồn thì BIẾN MẤT ÊM, không hiện ra rỗng. Một tab rỗng dạy người mở nó
    // rằng bảng này có chỗ không dùng được, và lần sau họ thôi mở cả những tab có dữ liệu.
    if (id === "y-tuong") return ideas.length > 0;
    if (id === "tra-cuu") return Boolean(legend);
    if (id === "mo-hinh") return laRepoNha;
    if (id === "migrate") return hoSo.length > 0;
    if (id === "nhat-ky") return nhatKy.length > 0 || daXong.length > 0 || adrs.length > 0;
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
    ${khoiCanDuc(canDuc, tenNguoi)}
    ${khoiYTuongGon(ideas)}
    ${khoiBatDau(dl)}
    ${khoiLienQuan(dl.banDo, dl.trangCo)}
    ${khoiVongDoi(st)}
    ${khoiSucKhoe(so)}
    <details class="the">
      <summary>Ba việc nó làm mà một repo trống không làm được</summary>
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
    </details>
  </section>

  <section class="tab" id="tab-ai-dieu-phoi" hidden>
    ${khoiDangLamGi(khoa, ngay, vetKhoa)}
    ${khoiCanDuc(canDuc, tenNguoi)}
    ${khoiKhoa(khoa)}
    ${laRepoNha ? `<div class="the">
      <h2>Giao một việc cho AI khác — ba lệnh</h2>
      <p>Đề bài <strong>không viết tay</strong>. Lệnh dưới đo repo đích trước — nhánh · cây làm
      việc · bảng quyền · bản khung đang ghim — rồi mới ghép đề bài quanh những con số đó. Đo
      không được thì nó <strong>không in gì cả</strong>.</p>
      <pre class="code">cd "&lt;REPO ĐÍCH&gt;" &amp;&amp; git fetch
npm run giao-viec -- --viec nang --repo "&lt;REPO ĐÍCH&gt;" --as codex-nang &gt; de-bai.txt
cd "&lt;REPO ĐÍCH&gt;" &amp;&amp; codex exec -s workspace-write - &lt; de-bai.txt</pre>
      <p class="ghi">Ba loại việc giao được: <code>nang</code> · <code>migrate</code> ·
      <code>audit</code>. Phiên nhận việc trả về <strong>năm dòng</strong> — và năm dòng đó vẫn
      là <strong>lời tự khai</strong>, chưa lệnh nào đo lại. Kiểm chứng độc lập trước khi tin.</p>
    </div>` : ""}
  </section>

  ${ideas.length ? `<section class="tab" id="tab-y-tuong" hidden>
    <div class="the"><h2>Sổ ý tưởng — phòng chờ của cả repo</h2>
      <p>Đây <strong>không phải</strong> sổ nợ. Sổ nợ ghi thứ đang <em>hỏng</em>; sổ này ghi
      <em>hướng đi</em>. Trộn hai thứ là mọi hướng đi trông như một lỗi cần vá gấp.</p></div>
    ${khoiYTuongDay(ideas)}
  </section>` : ""}

  ${laRepoNha ? `<section class="tab" id="tab-mo-hinh" hidden>
    ${khoiMoHinh({ lenh, protocols, briefs, dichDen, soPhepKiem })}
    <div class="the">
      <h2>Một lượt giao việc, ba lệnh</h2>
      <p>Đề bài <strong>không viết tay</strong>. Lệnh dưới đây đo repo đích trước — nhánh, cây
      làm việc, bảng quyền, bản khung đang ghim — rồi mới ghép đề bài quanh những con số đó.
      Đo không được thì nó <strong>không in gì cả</strong>.</p>
      <pre class="code">cd "&lt;REPO ĐÍCH&gt;" &amp;&amp; git fetch
npm run giao-viec -- --viec nang --repo "&lt;REPO ĐÍCH&gt;" --as codex-nang &gt; de-bai.txt
cd "&lt;REPO ĐÍCH&gt;" &amp;&amp; codex exec -s workspace-write - &lt; de-bai.txt</pre>
      <p><strong>Vì sao phải đo trước:</strong> lượt giao đầu tiên (06/09) dùng một đề bài viết
      trước khi ai đo repo đích. Nó dạy <code>git add -A</code> trong khi repo đó đang có ba file
      sửa dở của phiên khác — tức dạy phiên nhận việc cuốn việc của người khác vào commit của
      mình rồi đẩy đi. Lỗi đó không phải của phiên nhận việc.</p>
    </div>
    ${dl.tinhNang ? `<div class="the">${md(dl.tinhNang)}</div>` : ""}
  </section>` : ""}

  <section class="tab" id="tab-van-hanh" hidden>
    ${khoiVanHanh(coChe, batBien, khoa.length)}
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
    ${dl.soTay ? `<div class="the">${md(dl.soTay)}</div>` : ""}
    ${protocols.length ? `<div class="the"><h2>Quy trình đầy đủ</h2>
      ${protocols.map((p2) => `<details><summary>${esc(p2.tieuDe)}</summary>${md(p2.than.split(NL).filter((l) => !l.startsWith("# ")).join(NL))}</details>`).join("")}
    </div>` : ""}
    ${dl.baoTri ? `<div class="the">${md(dl.baoTri)}</div>` : ""}
  </section>

  <section class="tab" id="tab-suc-khoe" hidden>
    ${khoiSucKhoeNo(so, noMo, noMuc)}
  </section>

  <section class="tab" id="tab-cau-truc" hidden>
    ${khoiCauTruc(vung, fileGoc, banDo)}
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
      <p>Dành cho ai gõ lệnh. Người không gõ lệnh thì xem tab <strong>Mô hình</strong> — cùng
      một thứ, kể bằng tiếng người.</p>
      <div class="tw"><table><thead><tr><th>Lệnh</th><th>Chạy gì</th></tr></thead><tbody>
      ${lenh.map(([k, v]) => `<tr><td><code>npm run ${esc(k)}</code></td><td><code>${esc(v)}</code></td></tr>`).join("")}
      </tbody></table></div>
    </div>
    <div class="the"><h2>Khi bạn sắp… thì mở file nào</h2>
      <div class="tw"><table><thead><tr><th>Khi bạn sắp…</th><th>Mở cái gì</th></tr></thead><tbody>
      ${banDo.map((r) => `<tr><td>${md(r[0]).replace(/^<p>|<\/p>$/g, "")}</td><td>${md(r.slice(1).join(" · ")).replace(/^<p>|<\/p>$/g, "")}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
  </section>

  ${legend ? `<section class="tab" id="tab-tra-cuu" hidden><details class="the" open><summary>Bảng tra cứu thuật ngữ</summary><div>${md(legend)}</div></section>` : ""}

  ${hoSo.length ? `<section class="tab" id="tab-migrate" hidden>
    ${khoiMigrate(hoSo)}
  </section>` : ""}

  <section class="tab" id="tab-nhat-ky" hidden>
    ${adrs.length ? `<div class="the"><h2>Quyết định đã chốt — ${adrs.length} bản ghi</h2>
      <p>Mỗi quyết định là một file <strong>bất biến</strong>: đã chốt thì không sửa được, chỉ
      thay bằng bản mới. Bản bị thay vẫn giữ nguyên để tra lại được.</p>
      <div class="tw"><table><thead><tr><th>Quyết định</th><th>Trạng thái</th><th>Ngày</th></tr></thead><tbody>
      ${adrs.map((a) => `<tr><td>${esc(a.tieuDe)}</td><td>${esc(a.fm.status || "—")}</td><td>${esc(a.fm.date || "—")}</td></tr>`).join("")}
      </tbody></table></div></div>` : ""}
    ${nhatKy.map((k, idx) => `<details${idx === 0 ? " open" : ""}>
      <summary><strong>v${esc(k.ban)}</strong><span class="ngay">${esc(k.ngay)}</span><span class="tt">${esc(k.tomTat)}</span></summary>
      ${md(k.than)}
    </details>`).join("")}
    ${daXong.length ? `<div class="the">
      <h2>Đã xong 100% — ${daXong.length} việc</h2>
      <p>Việc đã <strong>đóng hẳn</strong> trong sổ nợ, không phải việc đang làm dở. Nguồn là
      <span class="ref">BACKLOG.md</span>: mục nào có mã bị gạch thì nó nằm ở đây.</p>
      <p><strong>Sổ giữ lại mục đã đóng chứ không xoá</strong> — để tra được việc gì đã làm, làm
      lúc nào, và vì sao. Bảng này chỉ chiếu lại phần đó cho dễ nhìn; nó không phải nguồn sự thật
      thứ hai.</p>
      <div class="tw"><table><thead><tr><th>Mã</th><th>Việc</th><th>Ưu tiên lúc mở</th></tr></thead><tbody>
      ${daXong.map((v) => `<tr><td><code>${esc(v.ma)}</code></td><td>${md(v.tieuDe).replace(/^<p>|<\/p>$/g, "")}</td><td>${esc(v.uuTien || "—")}</td></tr>`).join("")}
      </tbody></table></div>
    </div>` : ""}
  </section>

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

/* ASYNC từ bản 1.3.20: nó đo dấu vết khoá, và phép đo đó nạp `repo-structure.mjs` theo kiểu
 * động (`claim.mjs` cố ý không nạp tĩnh file đó — mọi lượt `--take` sẽ phải trả tiền nạp).
 * Ba chỗ gọi đều ở tầng ngoài cùng của module nên `await` ở đó không tốn gì. */
export async function gomDuLieu() {
  /* MỘT mốc cho cả hàm. Gọi `mocHEAD()` ở ba chỗ thì ba chỗ đó về lý thuyết đọc được ba giá
   * trị khác nhau (HEAD đổi giữa chừng), và bảng sẽ tự mâu thuẫn với chính nó. */
  const headDate = mocHEAD();
  const pkg = JSON.parse(doc("package.json") || "{}");
  // Tên NGƯỜI ĐỌC lấy từ `.repo-structure.json`, không lấy `package.json.name`. Cái sau là tên
  // gói npm — chữ thường, gạch nối — và in nó lên đầu một trang cho người xem thì vừa xấu vừa
  // sai đối tượng. Không khai thì lùi về tên gói, còn hơn để trống.
  // FAIL-CLOSED. Bản đầu nuốt lỗi parse rồi lùi về tên gói npm, nên một `.repo-structure.json`
  // hỏng cú pháp vẫn sinh ra một trang trông hoàn toàn bình thường — trong khi cổng kiểm của
  // chính repo đó đang chết. Trang là thứ Đức nhìn; nó không được đẹp hơn sự thật.
  let tenNguoi = null;
  let tenNguoiChot = null;
  const cauHinhRaw = doc(".repo-structure.json");
  if (cauHinhRaw !== null) {
    let j;
    try {
      j = JSON.parse(cauHinhRaw);
    } catch (e) {
      throw new Error(`.repo-structure.json hỏng cú pháp (${String(e.message).split(NL)[0]}) — KHÔNG sinh trang. Một trang dựng từ cấu hình hỏng sẽ trông bình thường trong khi repo đang hỏng.`);
    }
    tenNguoi = j?.repo?.name || null;
    /* TÊN NGƯỜI CHỐT lấy từ cấu hình, không đóng cứng "Đức" vào bộ sinh: bộ khung này chạy ở
     * repo của người khác, và một bảng gọi sai tên chủ dự án là bảng nói về một repo khác. */
    tenNguoiChot = j?.repo?.owner || null;
  }
  const nhatKy = tachNhatKy(doc("CHANGELOG.md"));

  /* REPO NÀY CÓ PHẢI REPO NHÀ CỦA BỘ KHUNG KHÔNG.
   *
   * Từ 1.3.17 trang này đi theo bản trích, nên hai khối chỉ đúng ở repo nhà phải tự biết ẩn đi:
   * khối MÔ HÌNH (nó mô tả bộ khung phát bản ra sao — repo đích là NGƯỜI NHẬN, không phải nơi
   * phát) và khối GIAO VIỆC (lệnh `giao-viec` ở lại repo nhà). Vẽ chúng ở repo đích là bảng dạy
   * người ta gõ một lệnh không tồn tại, và tự nhận một vai không phải của mình.
   *
   * Dấu nhận biết là bộ sinh bản trích: chỉ repo nhà mới có nó. */
  const laRepoNha = doc("scripts/build-template.mjs") !== null;

  /* ---- NĂM NGUỒN MỚI (06/09) — xem `overview-doc.mjs` để biết vì sao có chúng ----------- */

  /* Sổ ý tưởng. Repo chưa có sổ thì tab biến mất ÊM — đó là trạng thái hợp lệ của một repo
   * mới dựng, khác hẳn với "sổ có mà đọc không ra" (readIdeas sẽ NÉM ở ca đó). */
  const rawY = doc("IDEAS.md");
  const ideas = rawY ? readIdeas(rawY) : [];

  /* Việc chờ người chốt. Quét dấu `@Đức:bấm` / `@Đức:chốt` ngay trên dòng của mục, ở BA sổ.
   * Bảng KHÔNG giữ danh sách này: đóng mục thì dấu mất theo, không ai phải nhớ đi xoá. */
  const canDuc = [];
  for (const f of ["BACKLOG.md", "IDEAS.md", "STATUS.md", "HANDOFF.md"]) {
    const t = doc(f);
    if (t === null) continue;
    for (const d of quetDauDuc(t, f)) {
      const sinh = ngaySinhDong(f, d.soDong);
      canDuc.push({ ...d, ngay: sinh === null ? null : khoangNgay(headDate, sinh), tuoi: noiTuoi(sinh === null ? null : khoangNgay(headDate, sinh)) });
    }
  }
  canDuc.sort((a, b) => (b.ngay ?? -1) - (a.ngay ?? -1));

  /* Bảng chủ sở hữu. NÉM nếu hỏng — xem ghi chú ở `readKhoa`.
   *
   * MẶC ĐỊNH ĐỌC TỪ HEAD, và mặc định đó cấm đổi: bản đang commit ở gốc repo phải tất định từ
   * HEAD, không thì cổng "Sự thật máy sinh còn tươi" đỏ với mọi phiên mỗi lượt ai đó nhận khoá.
   *
   * `--khoa-song` đọc từ ĐĨA thay vì HEAD, và CHỈ dùng cho bản ra nằm ngoài git (`bang-song/`).
   * Vì sao cần: đo 06/09 trên chính lịch sử repo này — bốn khoá một phiên giữ suốt lượt làm việc
   * nằm trong **0/6 commit**, nên bảng suy từ HEAD nói "không có luồng nào chạy" trong khi có
   * bốn. Với bảng sống thì câu duy nhất đáng hỏi là câu về BÂY GIỜ. */
  const rawKhoa = (KHOA_SONG
    ? (() => { try { return fs.readFileSync(path.join(ROOT, ".agents/claims.json"), "utf8"); } catch (_) { return doc(".agents/claims.json") || "{}"; } })()
    : doc(".agents/claims.json")) || "{}";
  const khoa = readKhoa(rawKhoa);

  /* Dấu vết đo LÚC SINH BẢNG, không đọc từ HEAD như mọi con số khác trên trang.
   *
   * Cố ý phá lệ, và lệ đó có lý do thật (một bộ sinh nhìn đồng hồ thì sang ngày mới là mọi phiên
   * bị chặn đẩy). Ở đây không sao: cả khối này đã mang `NHAN_KHOA`, nên phép so trang-với-HEAD
   * bỏ qua từng dòng của nó. Không có ngoại lệ này thì tín hiệu vô nghĩa — "chưa thấy dấu vết"
   * đọc từ HEAD là câu về quá khứ, mà câu duy nhất đáng hỏi là câu về BÂY GIỜ.
   *
   * Hỏng thì trả bản đồ rỗng: mọi khoá về "ĐANG GIỮ", tức về đúng hành vi trước bản 1.3.20. */
  let vetKhoa = new Map();
  try { vetKhoa = await doDauVet(JSON.parse(rawKhoa)?.claims || {}, ROOT); } catch (_) { vetKhoa = new Map(); }

  /* Sổ nợ: mục còn mở. `tachDaXong` phía trên đã lo phần đã đóng, hai bên đọc CÙNG một dấu
   * (gạch mã) nên chúng không thể nói khác nhau về cùng một mục. */
  const noMuc = readNo(doc("BACKLOG.md") || "");
  const noMo = noMuc.filter((n) => !n.dong);

  /* Cây thư mục tầng ngoài cùng, và ai được ghi vào đâu. Số file đếm từ HEAD, không đếm đĩa —
   * cùng lý do với mọi con số khác trên trang này. */
  const vung = [];
  const fileGoc = [];
  {
    let cauHinh = {};
    try { cauHinh = JSON.parse(doc(".repo-structure.json") || "{}"); } catch (_) { cauHinh = {}; }
    const areas = cauHinh.areas && typeof cauHinh.areas === "object" ? cauHinh.areas : {};
    const maySinh = new Set([].concat(cauHinh.generated || [], Object.values(cauHinh.generated_names || {})));
    let tatCa = [];
    try {
      tatCa = gitRa("ls-tree", "-r", "-z", "--name-only", "HEAD").split("\0").filter(Boolean);
    } catch (_) { tatCa = []; }
    const dem = new Map();
    for (const f of tatCa) {
      const i = f.indexOf("/");
      if (i < 0) { fileGoc.push({ ten: f, may: maySinh.has(f) }); continue; }
      const d = f.slice(0, i + 1);
      dem.set(d, (dem.get(d) || 0) + 1);
    }
    for (const [duong, soFile] of [...dem.entries()].sort((a, b) => b[1] - a[1])) {
      const khai = areas[duong];
      vung.push({
        duong,
        chu: khai && typeof khai === "object" ? (khai.steward || null) : (typeof khai === "string" ? khai : null),
        soFile
      });
    }
    /* VÙNG ĐÃ KHAI MÀ CHƯA CÓ FILE NÀO vẫn phải hiện, với số 0.
     *
     * git không theo dõi thư mục rỗng, nên một vùng đã khai trong bảng phân vùng mà chưa có
     * file sẽ biến mất khỏi danh sách nếu chỉ đếm từ cây HEAD — trong khi nó VẪN là một khoá
     * nhận được, vẫn chặn được phiên khác. Bảng giấu nó đi là giấu một chỗ giao việc. */
    for (const duong of Object.keys(areas)) {
      if (!duong.endsWith("/") || dem.has(duong)) continue;
      const khai = areas[duong];
      vung.push({
        duong,
        chu: khai && typeof khai === "object" ? (khai.steward || null) : (typeof khai === "string" ? khai : null),
        soFile: 0
      });
    }
    fileGoc.sort((a, b) => a.ten.localeCompare(b.ten));
  }

  /* Hồ sơ migrate — đọc TỪ HEAD như mọi thứ khác trên trang này.
   *
   * Repo đích không có thư mục này (hồ sơ migrate nằm ở repo nhà của bộ khung), nên `liet()`
   * trả rỗng và tab Migrate biến mất ÊM. Đó là trạng thái hợp lệ, không phải lỗi. */
  const hoSo = readHoSo({
    liet: () => {
      try {
        return gitRa("ls-tree", "-z", "--name-only", `HEAD:${THU_MUC_MIGRATE}`)
          .split(String.fromCharCode(0)).filter((f) => f.endsWith(".md")).sort();
      } catch (_) { return []; }
    },
    doc: (f) => doc(`${THU_MUC_MIGRATE}/${f}`) || ""
  });

  /* Bốn cơ chế + năm bất biến: đọc lại từ luật, không chép. */
  const rawMF = doc("docs/protocols/MULTIFLOW.md") || "";
  const coChe = readCoChe(rawMF);
  const batBien = readBatBien(rawMF);
  const daXong = tachDaXong(doc("BACKLOG.md"));
  const workflows = docTaiLieu("docs/workflows");
  const protocols = docTaiLieu("docs/protocols");
  const briefs = docTaiLieu("docs/briefs");
  /* REPO ĐÍCH đọc từ hồ sơ migrate — bằng chứng, không phải trí nhớ. Mỗi lượt migrate một hồ
   * sơ, chỉ thêm; nên danh sách này không thể cũ hơn thực tế mà không ai biết. */
  const dichDen = docTaiLieu("docs/migrations")
    .map((m) => ({ ten: m.fm.repo || m.file, trangThai: m.fm.trang_thai || null, ngay: m.fm.ngay || null }))
    .sort((a, b) => String(b.ngay || "").localeCompare(String(a.ngay || "")));
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
  let soTaiLieu = 0;
  // "Hôm nay" ở đây cũng là mốc HEAD, cùng lý do ghi ở `ngay:` bên dưới: lấy `Date.now()` thì
  // con số này tự tăng theo lịch, và sang ngày là bản sinh lại lệch bản đã commit.
  const homNay = Date.parse(`${headDate}T00:00:00Z`);
  for (const thuMuc of ["docs", "docs/workflows", "docs/protocols", "docs/briefs"]) {
    for (const f of liet(thuMuc)) {
      const fm = tachFrontmatter(doc(`${thuMuc}/${f}`) || "").fm;
      soTaiLieu += 1;
      const ttl = Number(fm.ttl_days);
      if (!Number.isFinite(ttl) || ttl <= 0) continue;
      let sua = null;
      try {
        // TÊN FILE ĐI THÀNH THAM SỐ, KHÔNG GHÉP VÀO CHUỖI SHELL.
        //
        // Bản đầu nhét `${thuMuc}/${f}` vào một chuỗi rồi đưa cho shell. Một tên file có dấu
        // nháy là hỏng lệnh; một tên có `$(...)` hoặc dấu chấm phẩy là shell CHẠY thứ nằm trong
        // đó. Repo này còn cấm cả `.innerHTML` vì lý do y hệt — thì không có cớ gì để ghép chuỗi
        // ở đây. Và đây không phải mối lo lý thuyết: bộ khung được thiết kế để chạy trên repo
        // NGƯỜI KHÁC, nơi tên file không do mình đặt. Audit độc lập bắt được 03/09.
        const ra = execFileSync("git", ["log", "-1", "--format=%cI", "--", `${thuMuc}/${f}`],
          { cwd: ROOT, encoding: "utf8" }).trim();
        sua = ra ? new Date(ra) : null;
      } catch (_) { sua = null; }
      if (!sua) continue;
      if ((homNay - sua.getTime()) / 86400000 > ttl) taiLieuQuaHan.push(`${thuMuc}/${f}`);
    }
  }
  // `null` = KHÔNG ĐO ĐƯỢC, và nó khác hẳn 0. Cổng cấu trúc thoát khác 0 là chuyện BÌNH THƯỜNG
  // (có phép kiểm thuộc nhóm CHẶN đang đỏ) và nó vẫn in dòng TỔNG — nên vẫn đọc được. Chỉ khi
  // KHÔNG có dòng TỔNG mới là không đo được: script chết trước khi in, hoặc node/git không chạy.
  let canhBaoVang = null;
  let choDo = null;
  let soPhepCauTruc = null;
  {
    let ra = "";
    try {
      ra = execSync("node scripts/check-bootstrap.mjs", { cwd: ROOT, encoding: "utf8" });
    } catch (e) {
      ra = String(e.stdout || "");
    }
    // ĐỌC CẢ ĐỎ LẪN VÀNG. Bản đầu chỉ bắt "chỗ VÀNG", nên một repo có 10 chỗ ĐỎ và 0 chỗ VÀNG
    // hiện ra "0" và đèn có thể XANH — bảng giấu đúng thứ nặng nhất và giữ lại thứ nhẹ.
    const dong = ra.split(NL).find((l) => l.startsWith("TỔNG:")) || "";
    const mv = dong.match(/([0-9]+)\s*chỗ\s*VÀNG/);
    const mdo = dong.match(/([0-9]+)\s*chỗ\s*ĐỎ/);
    canhBaoVang = mv ? Number(mv[1]) : null;
    choDo = mdo ? Number(mdo[1]) : null;
    const mb = /B1.*?B([0-9]+)/.exec(ra);
    soPhepCauTruc = mb ? Number(mb[1]) : null;
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
  // `null` (không đọc được) KHÔNG được cộng thành 0 — không đo được thì để null, và đèn không xanh.
  const noCauTruc = (choDo === null || canhBaoVang === null) ? null : choDo + canhBaoVang;
  return {
    ten: tenNguoi || pkg.name || "Repo",
    tenNguoiChot,
    ban: pkg.version || "0.0.0",
    // NGÀY CỦA HEAD, KHÔNG PHẢI NGÀY TRÊN ĐỒNG HỒ. Trước khi trang được commit, đây là
    // `new Date()` — và cái đó vô hại đúng tới lúc trang vào repo. Từ lúc vào, đồng hồ sang
    // ngày là bản sinh lại lệch bản đã commit **dù không một dữ liệu nào đổi**, cổng đỏ, và
    // MỌI phiên bị chặn đẩy vì một ngày đã trôi qua. Việc BÁO CŨ không mất đi: đoạn JS cuối
    // trang tự tính lúc người ta MỞ trang, từ `data-sinh` — đúng chỗ hơn, vì một trang tĩnh
    // không biết trước bao giờ có người mở nó.
    ngay: headDate,
    lenh: Object.entries(pkg.scripts || {}),
    banDo: docBanDo(doc("AGENTS.md")),
    trangCo: new Set(lietHTML()),
    workflows, protocols, adrs, nhatKy, daXong, briefs, dichDen,
    ideas, canDuc, khoa, noMo, noMuc, coChe, batBien, vung, fileGoc, hoSo, laRepoNha,
    // Số suite phép kiểm = số lần `node tests/...` trong lệnh `test`. Đếm từ đó chứ không đếm
    // file trong `tests/`: một file không được lệnh `test` gọi thì nó không canh gì cả.
    soPhepKiem: (String((pkg.scripts || {}).test || "").match(/node tests\//g) || []).length || null,
    legend: legendRaw ? tachFrontmatter(legendRaw).than : null,
    st,
    tinhNang: tinhNangRaw ? tachFrontmatter(tinhNangRaw).than : null,
    soTay: soTayRaw ? tachFrontmatter(soTayRaw).than : null,
    baoTri: baoTriRaw ? tachFrontmatter(baoTriRaw).than : null,
    huongDan: huongDanRaw ? tachFrontmatter(huongDanRaw).than : null,
    // BA CON SỐ ĐẾM NỢ, không đếm tài sản. Đếm tài sản ("3 workflow, 9 lệnh") chỉ làm người
    // xem thấy nhiều mà không biết có phải lo không. Đèn xanh chỉ khi cả ba bằng 0.
    //
    // Con số cấu trúc GỘP CẢ ĐỎ LẪN VÀNG. Bản đầu chỉ bắt chữ "chỗ VÀNG", nên một repo có
    // 10 chỗ ĐỎ và 0 chỗ VÀNG hiện ra "0" và đèn có thể XANH — bảng giấu đúng thứ nặng nhất
    // và giữ lại thứ nhẹ. Không đọc được một trong hai thì để `null`, và `null` không phải 0:
    // đèn sẽ không xanh. Audit độc lập bắt được 03/09.
    // MẪU SỐ ĐI KÈM TỪNG SỐ, không tách ra chỗ khác.
    //
    // Một số 0 đứng một mình trông giống hệt nhau ở hai ca ngược nhau: "đã dò hết, sạch" và
    // "chưa dò gì cả". Trước 06/09 bảng chỉ in con số, nên nó không phân biệt được hai ca đó —
    // và ca thứ hai là ca nguy hiểm, vì nó hiện ra màu xanh.
    vetKhoa,
    so: [
      { so: taiLieuQuaHan.length, nhan: "tài liệu quá hạn", mau: `đã tính tuổi ${soTaiLieu} tài liệu theo hạn rà mỗi file tự khai` },
      { so: noCauTruc, nhan: "nợ cấu trúc (đỏ + vàng)", mau: noCauTruc === null ? "KHÔNG đọc được cổng cấu trúc — chưa dò được" : `đã chạy trọn ${soPhepCauTruc} phép kiểm cấu trúc` },
      { so: viecChuaChungMinh, nhan: "việc lớn chưa chứng minh", mau: "đọc từ vòng đời khai trong STATUS.md" }
    ]
    /* ĐÚNG BA con số, và một phép kiểm cũ ghim con số ba đó. Tôi đã thử thêm ô thứ tư "vùng
     * đang bận" và phép kiểm ĐỎ — đúng. Ba ô này đếm NỢ, và đèn chỉ xanh khi cả ba bằng 0;
     * một vùng đang bận thì hoàn toàn bình thường, nhét nó vào đây là đèn không bao giờ xanh
     * được nữa và con số mất nghĩa. Số khoá bận đã có chỗ của nó ở tab AI điều phối. */
  };
}

/* TÊN FILE MANG TÊN DỰ ÁN, KHÔNG PHẢI "DASHBOARD.html" trơn.
 *
 * Đức chốt 04/09. Lý do rất đời: mỗi repo sinh ra một bảng, và cả đống bảng cùng rơi vào một
 * thư mục Tải về. Ba file tên `DASHBOARD.html`, `DASHBOARD(1).html`, `DASHBOARD(2).html` thì
 * mở cái nào cũng phải đoán. Tên mang tên dự án là biết ngay, không phải mở ra xem.
 *
 * SUY TỪ CẤU HÌNH, từ bản 1.3.17 — vì từ bản này trang ĐI THEO BẢN TRÍCH, nên tên đóng cứng
 * là mọi repo đích cùng sinh ra một file mang tên repo NHÀ. Đó chính là đống file trùng tên mà
 * Đức muốn tránh, chỉ tệ hơn: chúng còn nói sai tên chủ.
 *
 * Ghi chú cũ ở đây lo rằng suy tự động sẽ mở một đường hỏng — đổi `repo.name` là tên file đổi
 * theo trong khi `generated` vẫn khai tên cũ. Nỗi lo đó có thật, nên có `--check-head`: cổng
 * hỏi đúng câu "tên đang sinh có nằm trong `generated` không" và đỏ kèm tên nguyên nhân. Còn
 * muốn khoá cứng một tên thì khai `generated_names.overview`, không phải sửa mã. */
export function tenTrang(cauHinhRaw) {
  let j = null;
  try { j = JSON.parse(cauHinhRaw || "{}"); } catch (_) { j = null; }
  const khai = j?.generated_names?.overview;
  if (typeof khai === "string" && khai.trim() && !khai.includes("/") && !khai.includes("\\")) {
    return khai.trim();
  }
  const ten = String(j?.repo?.name || "").trim();
  if (!ten) return "DASHBOARD.html";
  // Giữ chữ cái và số, gộp mọi thứ khác thành một gạch nối. Dấu tiếng Việt rụng — đúng ý:
  // tên file có dấu là chỗ hỏng kinh điển khi đem qua máy khác.
  // `\u0110`/`\u0111` KH\u00d4NG t\u00e1ch \u0111\u01b0\u1ee3c b\u1eb1ng NFD \u2014 n\u00f3 l\u00e0 m\u1ed9t ch\u1eef c\u00e1i ri\u00eang, kh\u00f4ng ph\u1ea3i D c\u00f3 d\u1ea5u. B\u1ecf qua
  // ch\u1ed7 n\u00e0y th\u00ec "\u0110\u1ea7u t\u01b0" ra "au-tu", m\u1ea5t lu\u00f4n ch\u1eef \u0111\u1ea7u c\u1ee7a t\u00ean repo.
  const gon = ten.split("\u0110").join("D").split("\u0111").join("d")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return gon ? `DASHBOARD-${gon}.html` : "DASHBOARD.html";
}

export const TRANG_FILE = tenTrang(doc(".repo-structure.json"));

/* DÒNG BIẾN ĐỘNG — và vì sao phải có khối này, đo được ngay lượt đầu.
 *
 * Bảng chủ sở hữu đổi **mỗi lần một phiên nhận hoặc trả khoá**, tức nhiều lần một ngày. Từ lúc
 * bảng chiếu nó ra, trang máy sinh đổi theo — mà trang nằm trong khối `generators`, nên cổng
 * so nó với HEAD mỗi phiên. Hệ quả đo được ngay lượt đầu: **trả khoá xong là trang lệch HEAD**,
 * và phiên tiếp theo bị chặn đẩy vì một thứ nó không hề đụng tới.
 *
 * Lối ra KHÔNG phải bỏ khối bảng quyền khỏi trang — đó là khối Đức hỏi tới đầu tiên. Lối ra là
 * đánh dấu những dòng ấy rồi **bỏ qua chúng ở phép SO**, chứ không bỏ qua ở phép GHI.
 *
 * Bộ lọc chỉ nằm ở vế SO, cố ý. Ghi thì ghi vô điều kiện, nên trang luôn hiện trạng thái mới
 * nhất; chỉ có câu hỏi *"trang này có cũ không"* là không tính mấy dòng đó. Lọc cả hai vế thì
 * trang sẽ đứng yên ở một quá khứ nào đó mà cổng vẫn báo xanh — tệ hơn hẳn. */
export const NHAN_KHOA = "<!--khoa-->";

export function soSanhTrang(mongDoi, dangCo) {
  const loc = (t) => String(t).split(/\r\n?/).join("\n").split("\n")
    .filter((d) => !d.trimStart().startsWith(NHAN_KHOA));
  const a = loc(mongDoi);
  const b = loc(dangCo);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const args = process.argv.slice(2);

  if (args.includes("--check-head")) {
    // Cổng đóng phiên gọi đúng nhánh này. Nó hỏi MỘT câu: bản đã commit có còn đúng với HEAD
    // không. Cả hai vế đều dựng từ HEAD, nên việc đang làm dở của bất kỳ ai không lọt vào.
    const dangCo = doc(TRANG_FILE);
    if (dangCo === null) {
      console.error(`THIEU_TRANG: ${TRANG_FILE} chưa có trong HEAD. Sinh rồi commit: node scripts/build-overview.mjs`);
      process.exit(1);
    }
    if (!soSanhTrang(trang(await gomDuLieu()), dangCo)) {
      console.error(`TRANG_CU: ${TRANG_FILE} đã commit không khớp với HEAD. Sinh lại rồi commit: node scripts/build-overview.mjs`);
      process.exit(1);
    }
    console.log(`${TRANG_FILE} khớp với HEAD.`);
    process.exit(0);
  }

  // Không đưa đường dẫn thì ghi vào bản chuẩn của repo. Có đưa thì ghi ra đó — để xem thử mà
  // không chạm file trong repo.
  const ra = args.find((a) => !a.startsWith("--")) || path.join(ROOT, TRANG_FILE);
  const dl = await gomDuLieu();
  fs.mkdirSync(path.dirname(path.resolve(ra)), { recursive: true });
  fs.writeFileSync(path.resolve(ra), trang(dl), "utf8");
  console.log(`Đã sinh ${ra} — v${dl.ban} · ${dl.workflows.length} workflow · ${dl.protocols.length} protocol · ${dl.adrs.length} quyết định · ${dl.lenh.length} lệnh.`);
  console.log(`  mốc HEAD ${dl.ngay} — việc báo cũ do trang tự tính lúc mở`);
}
