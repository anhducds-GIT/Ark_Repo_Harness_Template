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
 *   node scripts/claim.mjs --release <khoá> --as <phiên> [--task "một câu"] [--du-biet "vì sao"]
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

const KHUON_MUC = '"owner": null, "ai": null, "claimed_at": null, "task": null, "released_at": null }';

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
  /* MỖI MỤC PHẢI LÀ OBJECT, và nói ra ngay tại cửa nếu không.
   * VẤP THẬT 05/09, lượt migrate `n8n-orchestrator`: bảng quyền khai `{"_root": null}` — cách
   * viết tự nhiên cho "chưa ai giữ" — và `--list` NỔ với `TypeError: Cannot read properties of
   * null (reading 'owner')`, rơi stack trace vào mặt người dùng ở dòng 143.
   * Không nhận `null` là "trống", cố ý: hai cách biểu diễn cùng một trạng thái thì phép so sánh
   * bảng-trên-máy ↔ bảng-trên-remote có hai kết quả cho cùng một sự thật. Một cách viết, và
   * khi sai thì NÓI RÕ SAI Ở ĐÂU — đó là điều bộ khung này làm ở mọi cửa vào khác. */
  for (const [key, value] of Object.entries(parsed.claims)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(
        "CLAIMS_MUC_HONG: khoa " + '`' + key + '`' + " phai la object, dang la "
          + (value === null ? "null" : typeof value) + ".\n"
          + "  Khuon dung: " + JSON.stringify(key) + ": { " + KHUON_MUC + "\n"
          + "  Viet null cho ca muc la cach viet tu nhien cho chua-ai-giu, nhung KHONG hop le:\n"
          + "  hai cach bieu dien cung mot trang thai lam phep doi chieu bang quyen co hai ket qua."
      );
    }
  }
  return parsed;
}

/* Quyết định THUẦN — tách khỏi việc đọc/ghi để kiểm được mọi nhánh mà không cần đĩa. */
export function decide(claims, { action, key, as, today, ai, ducDuyet, dirty, chuaDay, duBiet }) {
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
    /* COMMIT CHƯA ĐẨY THÌ CHƯA TRẢ ĐƯỢC — trừ khi nói rõ là mình biết.
     *
     * Trả khoá xong mà commit còn nằm trên máy thì vùng đó **không ai đứng tên** trong khi vẫn
     * có thay đổi chưa công bố. Cổng đóng phiên của phiên SAU sẽ đỏ với câu *"vùng bị sửa nhưng
     * chưa ai đứng tên"* — và cổng đúng: một commit chưa công bố mà không quy được chủ là một
     * commit không ai chịu trách nhiệm.
     *
     * HAI VẾ PHẢI ĐI CÙNG NHAU, và đây là chỗ dễ làm hỏng nhất. Chỉ lấy vế chặn thì một lane bị
     * cổng xuất bản từ chối đẩy sẽ **kẹt khoá vĩnh viễn**: nó không đẩy được, nên không trả được,
     * nên vùng đó chết theo nó. Cửa thoát `--du-biet` không phải chỗ hở — nó là điều kiện để vế
     * chặn kia được phép tồn tại. Cửa thoát GHI LẠI lý do vào bảng, nên nó là một câu khai chứ
     * không phải một cái tặc lưỡi.
     *
     * Không đo được (`chuaDay == null`) thì KHÔNG chặn: trả khoá là thao tác gỡ bí, và một lệnh
     * gỡ bí mà tự chặn vì git hỏng thì nó biến sự cố nhỏ thành sự cố kẹt cả vùng. Khác hẳn nhánh
     * `--take` ở trên, nơi fail-closed là đúng vì giành vùng không lùi lại được. */
    if (Array.isArray(chuaDay) && chuaDay.length && !duBiet) {
      const NL2 = String.fromCharCode(10);
      return {
        code: EXIT.REFUSED,
        message: [
          `TU_CHOI: "${key}" còn ${chuaDay.length} commit CHƯA ĐẨY chạm vùng này:`,
          ...chuaDay.slice(0, 8).map((c) => `  ${c}`),
          ...(chuaDay.length > 8 ? [`  … và ${chuaDay.length - 8} commit nữa`] : []),
          "Trả khoá bây giờ là để lại commit chưa công bố mà không ai đứng tên — cổng của phiên sau sẽ đỏ,",
          "và người đọc GitHub thì không thấy việc đó tồn tại.",
          `Cách xử lý: đẩy trước, rồi trả — node scripts/safe-push.mjs --as ${as}`,
          "Thật sự muốn trả kèm commit chưa đẩy thì nói rõ là mình biết:",
          `  node scripts/claim.mjs --release ${key} --as ${as} --du-biet "vì sao"`
        ].join(NL2)
      };
    }
    /* NÓI RA CÁI GIÁ, ngay lúc trả. Đo 07/09: sau một lượt `--du-biet`, lane KẾ TIẾP không đẩy
     * được — `safe-push` từ chối vì nó cuốn theo commit của lane đã đi. Gỡ được, nhưng chỉ Đức
     * gỡ được (`--carry`). Cửa thoát này vẫn đúng là cần; im lặng về cái giá của nó thì không. */
    const khai = duBiet && Array.isArray(chuaDay) && chuaDay.length
      ? { tra_khi_chua_day: `${chuaDay.length} commit · ${typeof duBiet === "string" ? duBiet : "không nêu lý do"}` }
      : {};
    return { code: EXIT.OK, next: { ...cur, owner: null, ai: null, released_at: today, ...khai } };
  }

  return { code: EXIT.MISUSE, message: `HANH_DONG_LA: "${action}"` };
}

/* ---- TUỔI MỘT LƯỢT GIỮ KHOÁ ---------------------------------------------
 *
 * Ba thứ này trước ở `what-next.mjs`, với lý do ghi rõ: *"đặt vào `claim.mjs` là buộc phải sửa
 * một script đang đi theo bản trích, tức buộc cắt một phiên bản bộ khung mới — trả giá lớn cho
 * hai hàm bốn dòng."* Lý do đó đúng lúc viết. Nay `claim.mjs` phải sửa vì việc khác (tín hiệu
 * dấu vết bên dưới) nên cái giá ấy đã trả rồi, và chỗ đúng của chúng là ĐÂY — file này là file
 * GHI `claimed_at`, nên nó là file duy nhất biết con số ấy nghĩa là gì.
 *
 * CỐ Ý KHÔNG tự đòi lại khoá quá hạn. Một phiên chạy dài là chuyện bình thường, và `claimed_at`
 * không được chạm lại trong lúc làm — nên "cũ" KHÔNG đồng nghĩa "chết". Đây là số liệu để HỎI,
 * không phải một phán quyết. */
export const GIO_NHAC = 6;

export function ageHours(stamp, now = new Date()) {
  const t = Date.parse(String(stamp || ""));
  if (!Number.isFinite(t)) return null;
  return Math.max(0, (now.getTime() - t) / 3600000);
}

/* MỐC CHỈ CÓ NGÀY THÌ KHÔNG BIẾT GIỜ — và không được giả vờ là biết.
 *
 * ĐO ĐƯỢC 06/09, và Đức là người nhìn thấy trước: bảng quyền báo ba khoá "giữ 16h ⚠ quá 6h",
 * trong khi cả ba vừa được nhận **hai tiếng trước**. Nguyên nhân: mốc cũ là `"2026-09-06"` —
 * chỉ ngày — nên `Date.parse` đọc thành nửa đêm UTC, và tới chiều thì phép trừ ra 16 tiếng.
 *
 * Con số ma đó nguy hiểm hơn không có con số: nó **bật ⚠**, và một cái ⚠ sai vài lần thì lần
 * thứ ba không ai nhìn nữa — lúc đó một khoá kẹt thật cũng trôi qua. Từ bản 1.3.21 mốc mới luôn
 * có giờ; mốc cũ thì nói ĐÚNG ĐỘ CHÍNH XÁC nó có: "nhận trong hôm nay", không phải "16h". */
export function mocCoGio(stamp) {
  return /\d{1,2}:\d{2}/.test(String(stamp || ""));
}

export function ageLabel(hours, coGio = true) {
  if (hours == null) return "không rõ từ khi nào";
  if (!coGio) {
    // Độ phân giải của mốc là NGÀY, nên câu trả lời cũng phải ở mức ngày.
    return hours < 24 ? "nhận trong hôm nay" : `${Math.round(hours / 24)} ngày`;
  }
  // Phút, không phải "dưới 1h": cả lỗ mà tín hiệu bên dưới chữa đều xảy ra trong vòng 20 phút
  // đầu của một lượt giữ. Gộp hết vào "dưới 1h" là làm mù đúng khoảng thời gian đáng nhìn.
  if (hours < 1) return `${Math.round(hours * 60)} phút`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)} ngày`;
}

/** ⚠ chỉ khi con số ĐỦ CHÍNH XÁC để đáng tin: mốc có giờ thì theo `GIO_NHAC`, mốc chỉ-ngày thì
 *  phải qua hẳn một ngày. Không có luật này thì mọi mốc cũ đều kêu ⚠ ngay từ trưa. */
export function dangNhac(hours, coGio) {
  if (hours == null) return false;
  return coGio ? hours >= GIO_NHAC : hours >= 24;
}

/* ---- REPO CHƯA THẤY DẤU VẾT ----------------------------------------------
 *
 * TÊN CỦA TÍN HIỆU LÀ PHẦN CỦA HỢP ĐỒNG, không phải chuyện chữ nghĩa.
 *
 * Bản đầu của đề bài gọi nó là "vùng chưa bị chạm", và mọi người đọc — kể cả chính phiên viết ra
 * nó — đọc thành "lane đang rảnh". Hai câu đó KHÁC NHAU, và khoảng cách giữa chúng đã trả giá
 * thật ngày 06/09: một lane bị đo thấy "0 commit 0 sửa đổi" suốt 14 phút, phiên điều phối tin
 * con số và nhả khoá hộ — trong khi lane ấy **đang làm thật**, dựng bản nháp ở một thư mục
 * NGOÀI repo và chỉ định ghi vào ở bước cuối. Lane đó phải hoàn nguyên phần đã xong.
 *
 * Nên câu đúng, và là câu duy nhất được in ra:
 *
 *     Tín hiệu này nói REPO CHƯA THẤY GÌ. Nó KHÔNG nói lane đang rảnh, và nó KHÔNG BAO GIỜ đủ
 *     để nhả khoá của lane khác.
 *
 * Con số này về NGUYÊN TẮC không thấy được việc làm ngoài repo — nên đo kỹ hơn cũng không đóng
 * được lỗ đó. Ba đường hợp lệ để một khoá được trả, và chỉ ba: chính lane đó trả · lane đó đã
 * kết thúc · Đức chốt chuyển khoá. Xem `AGENTS.md` mục 1. */
export const DAU_VET = Object.freeze({ THAY: "thay", CHUA: "chua", KHONG_DO: "khong-do-duoc" });

/**
 * Quyết định THUẦN — không chạm git, không chạm đĩa, nên đột biến kiểm được từng nhánh.
 *
 * @param {string}  claimedAt  mốc nhận khoá, dạng ISO. Đọc không ra thì trả `KHONG_DO`.
 * @param {Array<{key:string,khi:string}>|null} chamCommit  file đã commit, đã quy về khoá, kèm
 *        mốc commit. `null` = không đo được (git hỏng) — KHÔNG được coi là "chưa thấy".
 * @param {Array<{key:string}>|null} chamDia  file sửa dở trên đĩa, đã quy về khoá.
 */
export function xetDauVet(key, claimedAt, chamCommit, chamDia) {
  /* KHÔNG ĐO ĐƯỢC ≠ CHƯA THẤY. Đây là chiều fail-closed của tín hiệu này, và nó quan trọng
   * hơn bình thường: nhánh "chưa thấy" là nhánh khiến người ta nghĩ tới việc nhả khoá. Một lần
   * git hỏng mà im lặng ngã về "chưa thấy" là dựng đúng tai nạn 06/09 thành hành vi mặc định. */
  if (chamCommit === null || chamDia === null) return DAU_VET.KHONG_DO;
  const moc = Date.parse(String(claimedAt || ""));
  if (!Number.isFinite(moc)) return DAU_VET.KHONG_DO;
  if (chamDia.some((f) => f.key === key)) return DAU_VET.THAY;
  const coCommit = chamCommit.some((f) => {
    if (f.key !== key) return false;
    const t = Date.parse(String(f.khi || ""));
    // Commit không đọc được mốc thì TÍNH LÀ CÓ — nhầm về phía "lane đang làm" là nhầm an toàn.
    return !Number.isFinite(t) || t >= moc;
  });
  return coCommit ? DAU_VET.THAY : DAU_VET.CHUA;
}

/** Câu in ra. Một chỗ duy nhất, để ba nơi hiển thị không thể nói ba kiểu. */
export function noiDauVet(trangThai) {
  if (trangThai === DAU_VET.CHUA) return "repo chưa thấy dấu vết";
  if (trangThai === DAU_VET.KHONG_DO) return "không đo được dấu vết";
  return "";
}

/**
 * Đo dấu vết cho MỌI khoá đang có chủ, bằng ĐÚNG HAI lệnh git cho cả bảng.
 *
 * Không đo khi bảng trống: `git status` trên repo lớn không rẻ, và `--list` là lệnh chạy nhiều
 * nhất trong cả bộ. Không có khoá nào bị giữ thì không có gì để nói.
 */
export async function doDauVet(claims, root = ROOT) {
  const dangGiu = Object.entries(claims).filter(([, v]) => v?.owner);
  if (!dangGiu.length) return new Map();

  const som = dangGiu
    .map(([, v]) => Date.parse(String(v.claimed_at || "")))
    .filter((t) => Number.isFinite(t));
  const tuKhi = som.length ? new Date(Math.min(...som)).toISOString() : null;

  let chamCommit = null;
  let chamDia = null;
  try {
    const { stewardOf, claimPrefixesFrom, readStructureFromDisk } = await import("./repo-structure.mjs");
    const cauTruc = readStructureFromDisk(root);
    const tienTo = claimPrefixesFrom(cauTruc);
    const chay = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

    chamDia = chay(["status", "--porcelain", "--untracked-files=all"])
      .split(String.fromCharCode(10)).filter(Boolean)
      .map((d) => d.slice(3).replace(/^"|"$/g, ""))
      // File bảng quyền được MIỄN khoá (luật mục 1) nên nó không phải dấu vết của ai cả.
      .filter((f) => f !== ".agents/claims.json")
      .map((f) => ({ key: stewardOf(f, cauTruc, tienTo) }));

    chamCommit = [];
    if (tuKhi) {
      // `%x00` giữa mốc và danh sách file: tên file có thể chứa mọi thứ trừ NUL.
      const ra = chay(["log", `--since=${tuKhi}`, "--name-only", "--pretty=format:%x01%cI"]);
      for (const khoi of ra.split(String.fromCharCode(1)).filter((x) => x.trim())) {
        const dong = khoi.split(String.fromCharCode(10));
        const khi = dong[0].trim();
        for (const f of dong.slice(1).filter(Boolean)) {
          chamCommit.push({ key: stewardOf(f, cauTruc, tienTo), khi });
        }
      }
    }
  } catch (_) {
    chamCommit = null;
    chamDia = null;
  }

  const ra = new Map();
  for (const [k, v] of dangGiu) ra.set(k, xetDauVet(k, v.claimed_at, chamCommit, chamDia));
  return ra;
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
    const dauVet = await doDauVet(parsed.claims);
    let coChua = false;
    for (const [key, value] of Object.entries(parsed.claims)) {
      const owner = value.owner || "";
      let duoi = "";
      if (owner) {
        const coGio = mocCoGio(value.claimed_at);
        const gio = ageHours(value.claimed_at);
        const cot = [coGio ? `giữ ${ageLabel(gio, true)}` : ageLabel(gio, false)];
        const noi = noiDauVet(dauVet.get(key));
        if (noi) cot.push(noi);
        if (dauVet.get(key) === DAU_VET.CHUA) coChua = true;
        if (dangNhac(gio, coGio)) cot.push(coGio ? "⚠ quá " + GIO_NHAC + "h" : "⚠ quá một ngày");
        duoi = `  (${cot.join(" · ")})`;
      }
      console.log(`${owner ? "GIU  " : "TRỐNG"} ${key.padEnd(34)}${owner}${duoi}`);
    }
    if (coChua) {
      console.log("");
      console.log('"repo chưa thấy dấu vết" = không commit nào chạm vùng đó kể từ lúc nhận khoá,');
      console.log("và không file nào trong vùng đang sửa dở. Nó KHÔNG nói lane đó rảnh — một lane");
      console.log("cẩn thận dựng nháp ở ngoài repo rồi mới ghi vào, và repo không thấy được việc đó.");
      console.log("KHÔNG nhả khoá hộ lane khác vì con số này. Hỏi lane đó, hoặc hỏi Đức — AGENTS.md mục 1.");
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

  /* MỐC CÓ GIỜ, không chỉ có ngày.
   *
   * Trước bản 1.3.20 đây là `.slice(0, 10)` — chỉ ngày. Với thứ duy nhất đọc nó lúc đó (bản đồ
   * việc, in "giữ N ngày") thì đủ. Với tín hiệu dấu vết thì KHÔNG: cả hai ca thật xảy ra trong
   * vòng 20 phút đầu của một lượt giữ, mà mốc chỉ-ngày làm mọi lượt trong ngày trông như nhận
   * lúc nửa đêm. `ageHours` vẫn đọc được mốc chỉ-ngày cũ, nên bảng đang có không phải sửa. */
  const today = new Date().toISOString();

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

  /* Commit CHƯA ĐẨY chạm vùng sắp trả. `null` = không đo được, và không đo được thì KHÔNG chặn
     (xem lý lẽ ở `decide`). Chỉ đo lúc `--release`: `git log` trên repo lớn không rẻ. */
  let chuaDay = null;
  if (action === "release" && parsed.claims[key]?.owner === as) {
    try {
      const { stewardOf, claimPrefixesFrom, readStructureFromDisk } = await import("./repo-structure.mjs");
      const cauTruc = readStructureFromDisk(ROOT);
      const tienTo = claimPrefixesFrom(cauTruc);
      const xa = execFileSync("git", ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], { cwd: ROOT, encoding: "utf8" }).trim();
      const ds = execFileSync("git", ["log", `${xa}..HEAD`, "--format=%x01%h %s", "--name-only"], { cwd: ROOT, encoding: "utf8" })
        .split(String.fromCharCode(1)).filter(Boolean);
      chuaDay = ds.filter((khoi) => {
        const [, ...file] = khoi.split(String.fromCharCode(10));
        return file.filter(Boolean).some((f) => f !== ".agents/claims.json" && stewardOf(f, cauTruc, tienTo) === key);
      }).map((khoi) => khoi.split(String.fromCharCode(10))[0].trim());
    } catch (_) {
      // Không có nhánh xa, git hỏng, repo mới clone — trả `null`, tức không chặn.
      chuaDay = null;
    }
  }

  const verdict = decide(parsed.claims, { action, key, as, today, ai: flag("ai"), ducDuyet: flag("duc-duyet"), dirty, chuaDay, duBiet: flag("du-biet") });
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
  if (verdict.next?.tra_khi_chua_day) {
    console.log(`⚠ Bạn vừa để lại ${verdict.next.tra_khi_chua_day.split(" · ")[0]} chưa đẩy ở vùng này, và đã trả khoá.`);
    console.log("  Lane TIẾP THEO sẽ KHÔNG đẩy được: safe-push từ chối vì nó cuốn theo commit của bạn.");
    console.log("  Chỉ Đức gỡ được (duyệt `--carry`). Nên báo Đức ngay, đừng để phiên sau tự đâm vào.");
  }
  process.exit(EXIT.OK);
}

if (process.argv[1] && path.resolve(process.argv[1]) === MODULE_FILE) main();
