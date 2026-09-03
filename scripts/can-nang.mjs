/* CÂN NẶNG — bộ khung này đang nặng bao nhiêu, và nặng thế có còn dùng được không?
 *
 *   node scripts/can-nang.mjs            # báo cáo
 *   node scripts/can-nang.mjs --nhanh    # bỏ phép đo thời gian (chậm nhất)
 *
 * VÌ SAO CÓ FILE NÀY. Mọi cổng kiểm khác trong repo hỏi "có đúng không". File này hỏi câu ngược
 * lại: **"có đáng không"**. Không ai hỏi câu đó thì một bộ khung chỉ có thể phình ra — mỗi lần
 * gặp lỗi là thêm một luật, và không lần nào bớt. Sau vài tháng thì:
 *
 *   - AI mất nửa phiên chỉ để đọc luật, chưa làm gì đã hết chỗ nhớ;
 *   - luật nhiều tới mức mâu thuẫn nhau, và AI chọn nhánh nào cũng "đúng luật";
 *   - đóng phiên mất vài phút, nên người ta bắt đầu bỏ qua cổng.
 *
 * Cả ba đều làm hệ thống TỆ ĐI dù mỗi luật thêm vào đều hợp lý lúc thêm. Đó là lý do cân nặng
 * phải được ĐO, chứ không để cảm tính — cảm tính luôn nói "thêm một cái nữa thì có sao đâu".
 *
 * FILE NÀY CỐ Ý KHÔNG NẰM TRONG CỔNG ĐÓNG PHIÊN. Thêm một phép kiểm vào mỗi phiên để chống
 * "quá nhiều phép kiểm mỗi phiên" thì tự mâu thuẫn. Nó chạy theo nhịp tháng — xem
 * `docs/BAO-TRI-DINH-KY.md`.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NL = String.fromCharCode(10);

/* NGÂN SÁCH. Đây là những con số CÓ THỂ SAI, và sai thì sửa ở đây — nhưng phải sửa CÓ LÝ DO ghi
   lại, không phải nới ra cho vừa hiện trạng. Nới ngân sách để báo cáo đẹp lên là đúng cái bệnh
   file này sinh ra để bắt. */
export const NGAN_SACH = {
  docBatBuoc: 300,     // dòng một phiên AI phải đọc TRƯỚC KHI làm được gì
  tongTaiLieu: 2200,   // tổng dòng tài liệu (không tính bản trích)
  soPhepKiem: 30,      // tổng phép kiểm hai cổng
  giayDongPhien: 180   // giây để chạy trọn bộ kiểm khi đóng phiên
};

const dem = (rel) => {
  try { return fs.readFileSync(path.join(ROOT, rel), "utf8").split(NL).length; } catch { return 0; }
};

const liet = (thuMuc) => {
  const ra = [];
  const di = (d) => {
    let mucs;
    try { mucs = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }); } catch { return; }
    for (const m of mucs) {
      const p = `${d}/${m.name}`;
      if (m.isDirectory()) di(p);
      else if (m.name.endsWith(".md")) ra.push(p);
    }
  };
  di(thuMuc);
  return ra;
};

/* ĐỌC BẮT BUỘC — chỉ tính thứ luật bắt đọc TRƯỚC KHI gõ dòng đầu tiên (mục 0 của AGENTS.md).
   Tài liệu "mở khi cần" KHÔNG tính: nó không tốn gì của phiên không dùng tới. Phân biệt hai loại
   này là điểm mấu chốt — gộp lại thì mọi tài liệu đều thành nợ, và không ai dám viết gì nữa. */
export function docBatBuoc() {
  return [
    { file: "AGENTS.md", dong: dem("AGENTS.md") },
    { file: "HANDOFF.md", dong: dem("HANDOFF.md") }
  ];
}

export function demPhepKiem() {
  let b = 0;
  let s = 0;
  // ĐẾM THỨ THẬT SỰ CHẠY, đừng đếm tên hàm. Bản đầu dò tên hàm và ra 10, trong khi cổng chạy
  // 15 — năm phép kiểm sinh ra từ hàm dùng chung nên không có tên riêng. Một cái cân báo thiếu
  // một phần ba thì tệ hơn không có cân: nó cho phép phình thêm mà vẫn thấy còn dư ngân sách.
  // Cùng họ với mọi lỗi khác đã vá hôm nay — dò theo TÊN thay vì đo thứ có thật.
  {
    let ra = "";
    try {
      ra = execSync("node scripts/check-bootstrap.mjs --all", { cwd: ROOT, encoding: "utf8" });
    } catch (e) {
      ra = String(e.stdout || "");   // thoát khác 0 là chuyện thường: có phép kiểm đang đỏ
    }
    const ma = ra.split(NL).map((l) => (l.match(/\]\s+(B[0-9]+)\s/) || [])[1]).filter(Boolean);
    b = new Set(ma).size;
  }
  try {
    const t = fs.readFileSync(path.join(ROOT, "scripts", "session-check.mjs"), "utf8");
    const m = t.match(/EXPECTED_CHECKS = ([0-9]+)/);
    s = m ? Number(m[1]) : 0;
  } catch { /* nt */ }
  return { cauTruc: b, dongPhien: s, tong: b + s };
}

/* LUẬT NÀO CHƯA TỪNG CHẶN ĐƯỢC GÌ — phép đo NGƯỢC, và là phép đo khó có nhất.
 *
 * `docs/BAO-TRI-DINH-KY.md` đã hỏi câu này từ đầu, nhưng hỏi suông: không ai trả lời nổi "luật
 * này tháng qua chặn được mấy lần" khi không có gì ghi lại. Nên cổng đóng phiên nay ghi một dòng
 * mỗi lần chạy vào `.agents/gate-log.jsonl` (không commit, mỗi máy một bản).
 *
 * Một phép kiểm chưa từng đỏ KHÔNG tự động là đồ thừa — có thể nó đang làm tốt việc răn đe. Nên
 * đây là DANH SÁCH ĐỂ HỎI, không phải danh sách để xoá. Câu hỏi đúng là: *dựng nổi ca hỏng cho
 * nó không?* Không dựng nổi thì nó chưa bao giờ là một phép kiểm thật. */
export function luatChuaTungChan(dongLog) {
  const daDo = new Set();
  const daThay = new Set();
  for (const d of dongLog) {
    for (const t of d.ten ?? []) daThay.add(t);
    for (const t of d.do ?? []) daDo.add(t);
  }
  return { soLanChay: dongLog.length, chuaTungDo: [...daThay].filter((t) => !daDo.has(t)).sort() };
}

export function docLog() {
  try {
    return fs.readFileSync(path.join(ROOT, ".agents", "gate-log.jsonl"), "utf8")
      .split(NL).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
}

/* ---- chạy ------------------------------------------------------------------ */

const THIS = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS)) {
  const nhanh = process.argv.includes("--nhanh");
  const canh = [];
  const dong = (nhan, thuc, budget, donVi) => {
    const qua = thuc > budget;
    if (qua) canh.push(nhan);
    console.log(`  ${qua ? "✗" : "✓"} ${nhan.padEnd(34)} ${String(thuc).padStart(5)} / ${budget} ${donVi}`);
  };

  console.log(`${NL}CÂN NẶNG BỘ KHUNG — "có đáng không", không phải "có đúng không"${NL}`);

  const bb = docBatBuoc();
  const tongBB = bb.reduce((a, b) => a + b.dong, 0);
  dong("Đọc bắt buộc trước khi làm gì", tongBB, NGAN_SACH.docBatBuoc, "dòng");
  for (const f of bb) console.log(`      ${f.file.padEnd(30)} ${String(f.dong).padStart(5)}`);

  const taiLieu = [...liet("docs"), "README.md", "CHANGELOG.md", "STATUS.md"];
  const tongTL = taiLieu.reduce((a, f) => a + dem(f), 0);
  dong("Tổng tài liệu (không kể bản trích)", tongTL, NGAN_SACH.tongTaiLieu, "dòng");

  const pk = demPhepKiem();
  dong("Số phép kiểm", pk.tong, NGAN_SACH.soPhepKiem, `(${pk.cauTruc} cấu trúc + ${pk.dongPhien} đóng phiên)`);

  if (!nhanh) {
    const t0 = Date.now();
    try { execSync("npm test", { cwd: ROOT, stdio: "ignore" }); } catch { /* đỏ cũng vẫn tính giờ */ }
    dong("Thời gian chạy trọn bộ kiểm", Math.round((Date.now() - t0) / 1000), NGAN_SACH.giayDongPhien, "giây");
  } else {
    console.log("  · Thời gian chạy: BỎ QUA (--nhanh)");
  }

  const log = docLog();
  const kq = luatChuaTungChan(log);
  console.log(`${NL}  PHÉP KIỂM CHƯA TỪNG ĐỎ — qua ${kq.soLanChay} lần chạy cổng đã ghi lại:`);
  if (!kq.soLanChay) {
    console.log("      (chưa có dữ liệu — chạy cổng đóng phiên vài lần rồi quay lại)");
  } else if (!kq.chuaTungDo.length) {
    console.log("      (không có — mọi phép kiểm đều đã bắt được ít nhất một lần)");
  } else {
    for (const t of kq.chuaTungDo) console.log(`      · ${t}`);
    console.log(`${NL}      Đây là danh sách để HỎI, không phải để xoá. Với từng cái: dựng nổi ca`);
    console.log("      hỏng cho nó không? Không dựng nổi thì nó chưa bao giờ là phép kiểm thật.");
  }

  console.log(`${NL}${canh.length ? `QUÁ NGÂN SÁCH ${canh.length} chỗ: ${canh.join(", ")}.
Trước khi nới ngân sách, hãy thử BỚT — mỗi luật thêm vào nên thay chỗ một luật cũ.` : "TRONG NGÂN SÁCH — chưa cần cắt gì."}${NL}`);
  process.exit(canh.length ? 1 : 0);
}
