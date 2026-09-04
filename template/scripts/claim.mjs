/* NHẬN / TRẢ QUYỀN GÓI — một lệnh, và nó TỪ CHỐI khi không được phép.
 *
 * Vì sao có file này (đo thật 2026-09-02): quyền được nhận bằng `node -e "…"` thủ công, tức
 * đọc → sửa → ghi. Hai phiên cùng đọc thấy "trống" rồi cùng ghi tên mình thì **người ghi sau
 * thắng, người ghi trước không hề biết**. Hôm đó ghi được 63 lần trong một ngày, 21 nhãn phiên
 * khác nhau, và một lần quyền bị ghi đè thật.
 *
 * Nghịch lý mà file này chữa: `claims.json` sinh ra để chống tranh chấp, mà chính nó là tài
 * nguyên bị tranh chấp và không được bảo vệ.
 *
 * KHÔNG hứa chống đua tuyệt đối — Node không có khoá file khả chuyển. Nó làm hai việc:
 *   1. thu cửa sổ đua từ "vài phút giữa lúc đọc và lúc ghi" xuống "vài mili-giây";
 *   2. GHI RỒI ĐỌC LẠI để KIỂM — nếu vẫn bị ghi đè thì nó **nói to**, thay vì im lặng.
 * Khác biệt giữa "thỉnh thoảng xảy ra" và "thực tế không xảy ra", cộng với "không bao giờ âm
 * thầm".
 *
 * Dùng:
 *   node scripts/claim.mjs --list
 *   node scripts/claim.mjs --take <khoá> --as <phiên> --task "một câu" [--ai Codex]
 *   node scripts/claim.mjs --release <khoá> --as <phiên> [--task "một câu"]
 *   node scripts/claim.mjs --take <khoá> --as <phiên> --task "…" --duc-duyet "<câu chốt của Đức>"
 *       ↑ giành vùng người khác đang giữ. Đòi câu chốt, và TỪ CHỐI nếu vùng đó còn file sửa dở.
 *
 * Mã thoát:  0 xong · 2 dùng sai · 3 TỪ CHỐI (đã có chủ khác / không phải chủ) · 4 bị ghi đè
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MODULE_FILE = path.resolve(fileURLToPath(import.meta.url));
const ROOT = path.resolve(path.dirname(MODULE_FILE), "..");
export const CLAIMS_FILE = path.join(ROOT, ".agents", "claims.json");

export const EXIT = Object.freeze({ OK: 0, MISUSE: 2, REFUSED: 3, CLOBBERED: 4 });

export function readClaims(file = CLAIMS_FILE) {
  let raw;
  try { raw = fs.readFileSync(file, "utf8"); }
  catch (error) { throw new Error(`CLAIMS_KHONG_DOC_DUOC: ${error.message}`); }
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (error) { throw new Error(`CLAIMS_HONG: không phải JSON đọc được (${error.message}). Sửa tay rồi chạy lại.`); }
  if (!parsed || typeof parsed.claims !== "object" || Array.isArray(parsed.claims)) {
    throw new Error("CLAIMS_HONG: thiếu khối `claims` dạng object.");
  }
  return parsed;
}

/* Quyết định THUẦN — tách khỏi việc đọc/ghi để kiểm được mọi nhánh mà không cần đĩa. */
export function decide(claims, { action, key, as, today, ai, ducDuyet, dirty }) {
  if (!Object.prototype.hasOwnProperty.call(claims, key)) {
    return {
      code: EXIT.MISUSE,
      message: `KHOA_LA: "${key}" không có trong claims.json. Khoá hợp lệ: ${Object.keys(claims).join(" · ")}.`
        + "\nKhông tự thêm khoá mới ở đây — thêm một vùng sở hữu là chuyện cấu trúc, khai ở `.repo-structure.json` trước."
    };
  }
  const cur = claims[key];
  const owner = cur.owner || null;

  if (action === "take") {
    if (owner && owner !== as) {
      /* GIÀNH VÙNG NGƯỜI KHÁC: có đường máy, và đường đó ĐÒI CÂU CHỐT CỦA ĐỨC.
       *
       * Trước đây lệnh chỉ biết từ chối, nên khi Đức đã chốt thì cách duy nhất là **sửa tay**
       * `claims.json` — và sửa tay thì câu chốt không đi vào bảng, chỉ nằm trong đầu người sửa.
       * Người cần đọc câu đó là phiên vừa BỊ mất vùng, mà họ chỉ đọc bảng chứ không đọc lịch sử
       * chat. Đo thật 04/09: một lượt giành vùng phải làm bằng tay đúng vì thiếu đường này. */
      if (typeof ducDuyet !== "string" || ducDuyet.trim().length < 10) {
        return {
          code: EXIT.REFUSED,
          message: `TU_CHOI: "${key}" đang do "${owner}" giữ, không phải bạn.`
            + `\nGhi chú của họ: ${String(cur.task || "(không có)").slice(0, 160)}`
            + "\nLuật mục 1: gói có chủ mà chủ không phải bạn thì CHỈ ĐƯỢC ĐỌC. Muốn giành thì hỏi Đức."
            + "\nĐức chốt rồi thì chạy lại kèm:  --duc-duyet \"<câu chốt của Đức>\""
            + "\nCâu đó được ghi VÀO BẢNG, không phải in ra màn hình — người cần đọc nó là phiên vừa mất vùng."
        };
      }
      /* VÙNG CÒN VIỆC DỞ CỦA CHỦ CŨ THÌ KHÔNG GIÀNH ĐƯỢC, kể cả khi Đức đã chốt.
       *
       * Câu chốt của Đức nói "vùng này chuyển tay", nó KHÔNG nói "được đè lên file người ta đang
       * sửa". Đo thật 04/09, và cái giá đã trả: sau một lượt giành vùng, `git add <file>` cuốn
       * theo hai dòng `AGENTS.md` của phiên khác đang sửa dở — nội dung không mất, nhưng nhãn
       * lane ghi sai người làm, mà nhãn lane là thứ cả cơ chế này dựa vào.
       *
       * Chặn ở đây, không phải ở lúc commit: lúc commit thì người ta đã tin mình có quyền rồi. */
      if (Array.isArray(dirty) && dirty.length) {
        return {
          code: EXIT.REFUSED,
          message: `TU_CHOI: "${key}" đang do "${owner}" giữ, và vùng đó CÒN ${dirty.length} file sửa dở:`
            + `\n  ${dirty.slice(0, 8).join("\n  ")}${dirty.length > 8 ? `\n  … và ${dirty.length - 8} file nữa` : ""}`
            + "\nĐức chốt việc CHUYỂN VÙNG, không chốt việc đè lên file người ta đang sửa."
            + "\nCách xử lý: nhờ phiên đó commit (hoặc stash) phần của họ trước, rồi chạy lại."
        };
      }
      return {
        code: EXIT.OK,
        giành: owner,
        next: { ...cur, owner: as, ai: ai ?? null, claimed_at: today, released_at: null,
          taken_from: owner, taken_by: as, duc_decision: ducDuyet.trim() }
      };
    }
    // Đã là của mình rồi thì không phải lỗi — chạy lại lệnh cùng nội dung phải an toàn.
    // TRƯỜNG `ai` KHÔNG ĐƯỢC ĐÓNG CỨNG LÀ "Claude". Bảng quyền này là của cả ba AI — Codex và
    // Antigravity cũng nhận vùng bằng đúng lệnh này, và trước đây mọi lượt nhận đều bị ghi là
    // "Claude". Một bảng ghi sai ai đang giữ thì nó không còn là bảng quyền, nó là chuyện kể.
    // Không khai thì để null: thiếu thông tin còn hơn thông tin sai. NHƯNG nếu đang là quyền của
    // chính mình và lần trước đã khai rồi thì GIỮ LẠI — chạy lại lệnh để đổi mỗi câu `--task` mà
    // xoá mất tên AI là biến một lệnh vô hại thành lệnh làm mất dữ liệu.
    const aiGiu = ai ?? (owner === as ? cur.ai ?? null : null);
    return { code: EXIT.OK, already: owner === as, next: { ...cur, owner: as, ai: aiGiu, claimed_at: today, released_at: null } };
  }

  if (action === "release") {
    if (!owner) return { code: EXIT.OK, already: true, next: cur };
    if (owner !== as) {
      return {
        code: EXIT.REFUSED,
        message: `TU_CHOI: "${key}" đang do "${owner}" giữ — KHÔNG trả quyền hộ người khác.`
          + "\nTrả hộ là xoá dấu vết một phiên đang làm dở, và phiên đó sẽ không biết mình vừa mất quyền."
      };
    }
    return { code: EXIT.OK, next: { ...cur, owner: null, ai: null, released_at: today } };
  }

  return { code: EXIT.MISUSE, message: `HANH_DONG_LA: "${action}"` };
}

async function main() {
  const argv = process.argv.slice(2);
  const flag = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? (argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true) : null;
  };

  let parsed;
  try { parsed = readClaims(); }
  catch (error) { console.error(error.message); process.exit(EXIT.MISUSE); }

  if (flag("list") || argv.length === 0) {
    for (const [key, value] of Object.entries(parsed.claims)) {
      const owner = value.owner || "";
      console.log(`${owner ? "GIU  " : "TRỐNG"} ${key.padEnd(34)}${owner}`);
    }
    process.exit(EXIT.OK);
  }

  const take = flag("take");
  const release = flag("release");
  const as = flag("as");
  const task = flag("task");
  const key = typeof take === "string" ? take : typeof release === "string" ? release : null;
  const action = typeof take === "string" ? "take" : typeof release === "string" ? "release" : null;

  if (!action || !key || typeof as !== "string") {
    console.error("Dùng: node scripts/claim.mjs --take|--release <khoá> --as <phiên> [--task \"một câu\"]");
    console.error("      node scripts/claim.mjs --list");
    process.exit(EXIT.MISUSE);
  }
  // Nhận quyền mà không nói làm gì là để lại một dòng vô nghĩa cho phiên sau đọc.
  if (action === "take" && typeof task !== "string") {
    console.error("THIEU_TASK: nhận quyền thì phải nói làm gì — `--task \"một câu\"`. Phiên sau đọc dòng đó để biết bạn đang đụng gì.");
    process.exit(EXIT.MISUSE);
  }

  /* KHOÁ THẬT, KHÔNG PHẢI ĐỌC-LẠI-KIỂM.
   *
   * Đọc → sửa → ghi → đọc lại KHÔNG đóng được cửa sổ đua: A và B cùng đọc thấy trống, A ghi rồi
   * đọc lại thấy A, B ghi rồi đọc lại thấy B — cả hai cùng thoát 0, cả hai cùng tin mình có
   * quyền, và người ghi trước mất việc mà không hề biết. Đọc-lại chỉ bắt được ca A đọc SAU khi
   * B đã ghi; nó bỏ lọt đúng ca hai bên xen kẽ khít nhau.
   *
   * `mkdir` là thao tác NGUYÊN TỬ trên mọi hệ điều hành: hai tiến trình cùng gọi thì đúng một
   * cái thành công. Đó là toàn bộ mẹo ở đây — không cần thư viện khoá.
   *
   * `ponytail: khoá cả file bảng quyền, không khoá từng vùng. Đủ cho vài phiên; tách khoá theo
   * vùng nếu sau này có hàng chục phiên cùng lúc.` */
  const KHOA = `${CLAIMS_FILE}.lock`;
  let daKhoa = false;
  for (let i = 0; i < 50 && !daKhoa; i += 1) {
    try { fs.mkdirSync(KHOA); daKhoa = true; }
    catch (e) {
      if (e?.code !== "EEXIST") throw e;
      // Khoá mồ côi: tiến trình giữ nó đã chết. Quá 30 giây thì dọn — không dọn thì một lần
      // Ctrl+C khoá vĩnh viễn bảng quyền của cả repo.
      try {
        if (Date.now() - fs.statSync(KHOA).mtimeMs > 30000) { fs.rmSync(KHOA, { recursive: true, force: true }); continue; }
      } catch { /* khoá vừa được nhả giữa chừng — vòng sau thử lại */ }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  if (!daKhoa) {
    console.error(`DANG_BI_KHOA: một phiên khác đang ghi bảng quyền (${KHOA}). Thử lại sau vài giây.`);
    process.exit(EXIT.MISUSE);
  }
  // Đọc LẠI SAU KHI có khoá — bản đọc lúc chưa khoá có thể đã cũ.
  parsed = readClaims();

  // Nhả khoá trên MỌI đường ra, kể cả đường thoát sớm và đường ném. Quên nhả thì lần chạy sau
  // phải chờ hết 30 giây hạn khoá mồ côi — một cái khoá bỏ quên còn phiền hơn không có khoá.
  const nhaKhoa = () => { try { fs.rmSync(KHOA, { recursive: true, force: true }); } catch { /* đã nhả rồi */ } };
  process.on("exit", nhaKhoa);

  const today = new Date().toISOString().slice(0, 10);

  /* File sửa dở NẰM TRONG vùng sắp giành. Chỉ tính khi thật sự đi giành vùng người khác —
     `git status` trên repo lớn không rẻ, và nhận một vùng trống thì không có gì để canh. */
  const dangGianh = action === "take" && parsed.claims[key]?.owner && parsed.claims[key].owner !== as;
  let dirty = [];
  if (dangGianh) {
    try {
      const { stewardOf, claimPrefixesFrom, readStructureFromDisk } = await import("./repo-structure.mjs");
      const cauTruc = readStructureFromDisk(ROOT);
      const tienTo = claimPrefixesFrom(cauTruc);
      dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: ROOT, encoding: "utf8" })
        .split(String.fromCharCode(10)).filter(Boolean)
        .map((d) => d.slice(3).replace(/^"|"$/g, ""))
        // File bảng quyền là thứ lệnh này SẮP ghi — nó luôn "dở" trong lúc chạy, và tính nó vào
        // là tự chặn chính mình mãi mãi.
        .filter((f) => f !== ".agents/claims.json")
        .filter((f) => stewardOf(f, cauTruc, tienTo) === key);
    } catch (e) {
      // Không đo được thì KHÔNG ĐƯỢC coi là "vùng sạch" — đó là fail-open, và giành vùng là
      // thao tác không lùi lại được.
      console.error(`KHONG_DO_DUOC_VIEC_DO: ${String(e.message).split(String.fromCharCode(10))[0]}`);
      console.error("Không biết vùng đó có file sửa dở hay không thì không được giành. Sửa lỗi trên rồi chạy lại.");
      process.exit(EXIT.REFUSED);
    }
  }

  const verdict = decide(parsed.claims, { action, key, as, today, ai: flag("ai"), ducDuyet: flag("duc-duyet"), dirty });
  if (verdict.code !== EXIT.OK) { console.error(verdict.message); process.exit(verdict.code); }

  parsed.claims[key] = typeof task === "string" ? { ...verdict.next, task } : verdict.next;
  fs.writeFileSync(CLAIMS_FILE, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");

  // GHI RỒI ĐỌC LẠI. Không chặn được đua, nhưng không để nó âm thầm.
  const after = readClaims().claims[key];
  const muon = action === "take" ? as : null;
  if ((after.owner || null) !== muon) {
    console.error(`BI_GHI_DE: vừa ghi "${muon ?? "trống"}" cho "${key}", đọc lại thấy "${after.owner || "trống"}".`
      + "\nMột phiên khác ghi chen vào giữa. ĐỪNG chạy lại một cách máy móc — xem họ đang làm gì trước.");
    process.exit(EXIT.CLOBBERED);
  }

  const verb = action === "take" ? (verdict.giành ? `đã GIÀNH từ "${verdict.giành}"` : verdict.already ? "vẫn đang giữ" : "đã nhận") : "đã trả";
  console.log(`${verb}: ${key}${action === "take" ? ` → ${as}` : ""}`);
  process.exit(EXIT.OK);
}

if (process.argv[1] && path.resolve(process.argv[1]) === MODULE_FILE) main();
