/* CỬA ② + ③ — MỘT TIẾN TRÌNH: vừa canh nền, vừa phục vụ bảng tại chỗ.
 *
 * Một tiến trình, một mục khởi động, một chỗ để tắt. Hai tiến trình cho hai cửa là hai chỗ để
 * quên tắt.
 *
 * CHỈ ĐỌC. Không có MỘT đường ghi nào, và đó là LUẬT chứ không phải "chưa làm":
 *   *"Tôi muốn là người ĐỌC thông tin AI báo cáo, chứ không phải người báo cáo cho AI."*
 * Thêm một đường ghi "cho tiện sau này" là cách một máy chủ chỉ-đọc thành một máy chủ sửa được
 * repo. Phép ghim đếm số đường và khoá phương thức ở GET/HEAD; thêm đường thứ tư, hay mở POST,
 * là ĐỎ.
 *
 * Nghe CHỈ ở 127.0.0.1 — không mở ra mạng.
 *
 * Dùng:  node bang-song/may-chu.mjs [--cong 4747]
 */
import fs from "node:fs";
import http from "node:http";

import { chenBang, docTrangThai, FILE_BANG, FILE_DUNG, ghiTrangThai, gioVN, NHIP_MS, sinhLai, themCharset, vanTay, canSinh } from "./loi.mjs";

export const CONG_MAC_DINH = 4747;
const DIA_CHI = "127.0.0.1";

/* BA ĐƯỜNG, TẤT CẢ CHỈ ĐỌC. Danh sách này là thứ phép ghim đếm. */
export const DUONG = Object.freeze(["/", "/lam-moi", "/trang-thai.json"]);
export const PHUONG_THUC = Object.freeze(["GET", "HEAD"]);

export function xuLy(req, res, boc) {
  if (!PHUONG_THUC.includes(req.method)) {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8", allow: PHUONG_THUC.join(", ") });
    res.end("Máy chủ này chỉ đọc. Không nhận lệnh ghi.\n");
    return;
  }
  const duong = (req.url || "/").split("?")[0];

  if (duong === "/lam-moi") {
    // Làm mới = chạy ĐÚNG cái lõi, chịu đủ bốn chốt. Không có đường tắt nào.
    boc.lamMoi();
    res.writeHead(303, { location: "/" });
    res.end();
    return;
  }

  if (duong === "/trang-thai.json") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(`${JSON.stringify(docTrangThai() ?? {}, null, 2)}\n`);
    return;
  }

  if (duong !== "/") {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Không có trang này. Bảng nằm ở /\n");
    return;
  }

  let html;
  try {
    // Đắp lại băng LÚC PHỤC VỤ: thêm nút Làm mới và lấy nhịp mới nhất. `chenBang` gỡ băng cũ
    // trước khi chèn, nên gọi bao nhiêu lần cũng ra đúng một băng.
    html = themCharset(chenBang(fs.readFileSync(FILE_BANG, "utf8"), { ...(docTrangThai() ?? {}), quaMayChu: true }));
  } catch (loi) {
    res.writeHead(503, { "content-type": "text/html; charset=utf-8" });
    res.end(`<meta charset="utf-8"><p style="font:14px system-ui">Chưa sinh được bảng: ${loi.message}</p>\n`);
    return;
  }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  res.end(html);
}

async function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf("--cong");
  const cong = i >= 0 ? Number(args[i + 1]) : CONG_MAC_DINH;

  let dangSinh = false;
  let vanTayCu;

  // Cờ dừng còn sót lại từ lượt tắt trước sẽ giết ngay bản vừa bật. Dọn lúc mở.
  try { fs.rmSync(FILE_DUNG); } catch (_) { /* không có cờ là chuyện thường */ }

  const nhipThoi = () => {
    const tt = docTrangThai();
    if (tt) ghiTrangThai({ ...tt, nhip: new Date().toISOString() });
  };

  const sinh = (batBuoc = false) => {
    if (dangSinh) return;                       // một lượt sinh ~15s, dài hơn nửa nhịp
    const vt = vanTay();
    if (!batBuoc && !canSinh(vanTayCu, vt)) { nhipThoi(); return; }
    dangSinh = true;
    try {
      const tt = sinhLai({ nhip: new Date().toISOString() });
      vanTayCu = vt;
      console.log(tt.ngung
        ? `${gioVN(new Date().toISOString())} — ngừng sinh: ${tt.ly_do}`
        : `${gioVN(new Date().toISOString())} — đã sinh lại bảng`);
    } catch (loi) {
      // Chết thì im lặng chết, không làm hỏng gì. Vòng canh KHÔNG được dừng vì một lượt sinh
      // hỏng — lần sau repo đổi thì thử lại.
      console.error(`lượt sinh hỏng: ${loi.message}`);
    } finally { dangSinh = false; }
  };

  const may = http.createServer((req, res) => xuLy(req, res, { lamMoi: () => sinh(true) }));
  may.on("error", (loi) => {
    // Cổng đã có người nghe = một bản khác đang chạy rồi. Thoát SẠCH, không cửa sổ lỗi lặp.
    console.error(`không mở được cổng ${cong}: ${loi.code || loi.message}`);
    process.exit(0);
  });

  may.listen(cong, DIA_CHI, () => {
    console.log(`Bảng sống đang phục vụ ở http://${DIA_CHI}:${cong}/`);
    sinh(true);
  });

  setInterval(() => {
    // Cửa tắt: `Tat-tu-chay.cmd` đặt một file cờ. KHÔNG giết theo tên tiến trình — giết theo tên
    // sẽ giết luôn tiến trình node của một phiên AI đang chạy.
    if (fs.existsSync(FILE_DUNG)) {
      try { fs.rmSync(FILE_DUNG); } catch (_) { /* xoá không được thì thôi, vẫn phải dừng */ }
      console.log("Nhận lệnh dừng. Thoát.");
      process.exit(0);
    }
    sinh(false);
  }, NHIP_MS);
}

if (process.argv[1] && process.argv[1].endsWith("may-chu.mjs")) main();
