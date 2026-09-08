#!/usr/bin/env node
// quyen.mjs — nguồn quyền có thẩm quyền cho hai vai Assistant.
//
// Vì sao có file này, ngắn gọn:
//   `claim.mjs` đọc–sửa–ghi một file JSON trên đĩa. Nó chữa được sửa tay, KHÔNG chữa được cuộc
//   đua: hai phiên cùng đọc thấy trống rồi cùng ghi tên mình, cả hai đều nhận "thành công"
//   (ADR-0018 bối cảnh). File này đổi CHỖ phân xử từ "đĩa của tôi" sang "remote", và dùng đúng
//   phép so-và-đổi mà `git push` vốn có.
//
// Ba chốt thiết kế, mỗi cái trả lời một chỗ đã bác được thiết kế trước:
//
//   ⑴ Sổ quyền nằm trên MỘT REF RIÊNG (`refs/ark/quyen`), ngoài lịch sử `main`.
//      Nên rebase `main` không chạm được sổ quyền. Ca "quyền cũ sau fetch + rebase" — ca duy nhất
//      đã bác được ADR-0018 — trở thành KHÔNG THỂ XẢY RA, không phải "bắt được bằng cách soi
//      khoảng lịch sử" như ADR-0019 ⑵ dự tính.
//
//   ⑵ LƯỢT TÍCH HỢP CŨNG LÀ MỘT SỰ KIỆN trên chính ref đó. Nên lượt kiểm quyền và lượt ghi kết
//      quả là MỘT lượt đẩy — không có khe giữa hai bước để một lượt thu hồi chen vào.
//
//      ĐỌC HẸP CÂU TRÊN. Nó đóng khe **trong phạm vi sổ quyền**, không đóng khe giữa sổ và
//      `main`. Phiên Codex chạy đúng chuỗi này ngày 07/09 và cả ba lượt đều thành công:
//      A được ghi nhận kết quả → B thu hồi quyền A → A đẩy mã vào `main`. Bản đầu của tôi viết
//      "đóng lỗ TOCTOU" không kèm giới hạn, và câu đó rộng hơn bằng chứng.
//      **Được ghi nhận KHÁC đã tích hợp.** Ghi nhận là chữ trong sổ; `main` là mã chạy thật.
//
//   ⑶ Đẩy TRẦN, không `--force`. Phép phân xử do git làm, không do mã ở đây làm — nhưng nó là
//      HAI lớp khác nhau, và đo 07/09 mới tách được:
//        · Trong MỘT kết nối đẩy: git gửi kèm giá-trị-cũ lấy từ lượt quảng bá ref, nên remote
//          đổi giữa lúc quảng bá và lúc ghi thì server từ chối — `--force` KHÔNG tắt được vế này.
//        · Sau lượt `fetch` mà TRƯỚC lúc mở kết nối: bản cục bộ hoá cũ. Ở đây đẩy trần bị từ
//          chối vì không fast-forward, còn `--force` thì GHI ĐÈ và xoá mất sự kiện của bên kia.
//      Nên "không `--force`" là lớp bảo vệ duy nhất ở cửa sổ thứ hai, và nó có phép kiểm riêng
//      (ca ③c). Đừng thêm `--force` để chữa một lượt `LOST_RACE` khó chịu.
//
// Ranh giới — khai thẳng, đừng để lượt sau tin sai chỗ:
//   CHẶN ĐƯỢC:            nhận quyền · thu hồi · ghi nhận tích hợp (git phân xử trên một ref).
//   DỰA VÀO TUÂN THỦ:     đẩy `main` mà KHÔNG ghi sự kiện tích hợp. File này không thấy được.
//                         Muốn chặn cả chỗ đó thì cần MỘT BÊN THỨ BA đọc sổ quyền — và bên thứ
//                         ba phải không phải bên đang bị kiểm. Chưa làm, cố ý.
// ── AI NÓI ĐIỀU NÀY? — bảng kiểm lòng tin, đọc trước khi tin bất kỳ vế nào bên dưới ───────────
//
// Vai SẢN PHẨM chấm chéo 08/09 và chỉ ra một lớp lỗ mà **đột biến không bao giờ tìm được**: nó
// không phải một dòng bảo vệ bị gỡ — mã chạy ĐÚNG THIẾT KẾ — mà là một **giả định về lòng tin**.
// Không có dòng nào để gỡ, nên 97 ca xanh và 27/27 đột biến bị bắt vẫn không chạm tới nó.
// Thứ bắt được lớp này là câu hỏi **"ai nói điều này?"**, nên bảng dưới trả lời đúng câu đó.
//
//   Tham số     | Ai cấp        | Kiểm được bằng gì
//   ------------|---------------|--------------------------------------------------------------
//   --sha       | bên bị kiểm   | GIT: `cat-file -e` — commit phải có thật ở đây
//   --co-so     | bên bị kiểm   | GIT: phải là tổ tiên của `--sha`, và phải chứa lượt tích hợp cuối
//   --the-he    | bên bị kiểm   | SỔ: so với thế hệ đang hiệu lực trong sổ quyền
//   --as        | bên bị kiểm   | KHÔNG KIỂM ĐƯỢC — chuỗi tự khai
//   --ban-do    | bên bị kiểm   | KHÔNG KIỂM ĐƯỢC — đường dẫn tự chọn
//   --con-lai   | bên bị kiểm   | KHÔNG KIỂM ĐƯỢC — chuỗi tự khai
//
//   CHƯA LÀM, ĐÃ BIẾT — ba dòng cuối bảng trên, và cả ba cùng MỘT họ: một tham số tự khai đứng
//   ở chỗ đáng lẽ phải là một sự thật kiểm được.
//
//     ⓐ `--as` là TÊN, không phải danh tính. Vế "bên xác nhận không được là bên bị kiểm" so hai
//        chuỗi, nên cùng một Assistant gọi lại bằng tên khác là đi qua.
//     ⓑ `--ban-do` là ĐƯỜNG DẪN DO BÊN ĐẨY CHỌN. Vai SẢN PHẨM chứng minh bằng cách chạy thật:
//        viết một bản đồ giả đúng hình dạng khai `vung-b/` thuộc `goi-a`, đưa vào bằng
//        `--ban-do ban-do-gia.json` → **mã 0**; cùng commit đó với bản đồ thật → `AREA_MISMATCH`.
//        Nên phép kiểm cưỡng chế "khớp với MỘT bản đồ nào đó", KHÔNG phải "khớp với bản đồ CỦA
//        REPO". Nó chặn được **nhầm lẫn**; nó không chặn được **cố ý**.
//
//   Cả hai đóng được bằng cùng một thứ: dữ liệu đến từ nguồn được xác thực, không từ tham số —
//   danh tính từ token workflow, bản đồ đọc từ commit đang được kiểm chứ không từ đĩa của bên đẩy.
//
// Tên vùng: từ 08/09 `kiemDuongDan` buộc mọi đường dẫn trong khoảng `coSo..sha` quy về đúng vùng
// đã khai — **theo bản đồ bên đẩy đưa vào**. Đọc hẹp đúng câu đó. Lỗ cũ (phiên Codex khai
// `wrong-area` cho một thay đổi ở `product.txt`) thì đã bịt thật.
//
// Bản đầu của khối này viết *"Tên vùng thì ĐÃ KIỂM từ 08/09"* — **rộng hơn bằng chứng**, và vai
// SẢN PHẨM bác đúng. Cùng hình dạng lỗi với câu *"đóng lỗ TOCTOU"* tôi đã tự bắt một lần trước đó.
//
// Fail-closed: không tới được remote thì KHÔNG cấp quyền. Một quyền cấp bằng phỏng đoán tệ hơn
// không có quyền.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const REF = 'refs/ark/quyen';
const TEP = 'su-kien.jsonl';

const MA = { OK: 0, DUNG_SAI: 2, TU_CHOI: 3, MAT_REMOTE: 4, SO_HONG: 5 };

const MOI_TRUONG = {
  ...process.env,
  GIT_AUTHOR_NAME: 'ark-quyen',
  GIT_AUTHOR_EMAIL: 'quyen@ark.local',
  GIT_COMMITTER_NAME: 'ark-quyen',
  GIT_COMMITTER_EMAIL: 'quyen@ark.local',
};

function git(args, input) {
  return execFileSync('git', args, { encoding: 'utf8', env: MOI_TRUONG, input }).trim();
}

function thu(args, input) {
  try {
    return { ok: true, ra: git(args, input) };
  } catch (e) {
    return { ok: false, ra: `${e.stdout || ''}${e.stderr || ''}`.trim() };
  }
}

// ── Đồng bộ sổ quyền từ remote ─────────────────────────────────────────────────────────────────
//
// Phân biệt HAI chuyện mà nếu gộp lại là mở đúng lỗ fail-open:
//   "remote tới được, ref chưa có"  → sổ trống, cấp quyền đầu tiên được.
//   "remote KHÔNG tới được"          → dừng, không cấp gì.
// `git fetch` một ref chưa tồn tại cũng báo lỗi, nên không dùng nó để phân biệt được.
// `git ls-remote` thành công với đầu ra rỗng thì mới chứng minh được "tới được mà chưa có ref".
function dongBo(remote) {
  const ls = thu(['ls-remote', remote, REF]);
  if (!ls.ok) return { ok: false, ma: MA.MAT_REMOTE, ly_do: 'REMOTE_UNREACHABLE', chi_tiet: ls.ra };

  if (!ls.ra) {
    thu(['update-ref', '-d', REF]);
    return { ok: true, co_ref: false };
  }

  const f = thu(['fetch', '--quiet', remote, `+${REF}:${REF}`]);
  if (!f.ok) return { ok: false, ma: MA.MAT_REMOTE, ly_do: 'REMOTE_UNREACHABLE', chi_tiet: f.ra };
  return { ok: true, co_ref: true };
}

// SỔ HỎNG KHÁC SỔ TRỐNG — và gộp hai chuyện đó lại là fail-open.
//
// Bản đầu viết `if (!r.ok) return []`, nên một ref quyền tồn tại mà thiếu file sổ bị hiểu thành
// "chưa ai giữ gì": phiên Codex dựng đúng ca đó ngày 07/09 và công cụ vừa in lỗi đọc file vừa
// CẤP QUYỀN ở thế hệ 1. Trạng thái không đọc được phải làm hệ thống DỪNG và giữ nguyên bản cuối
// còn đọc được — chỉ quyền THẬT SỰ chưa khởi tạo mới được bắt đầu từ trống.
function docSo(coRef) {
  if (!coRef) return { ok: true, so: [] };

  const r = thu(['show', `${REF}:${TEP}`]);
  if (!r.ok) {
    return {
      ok: false,
      ma: MA.SO_HONG,
      ly_do: 'LEDGER_UNREADABLE',
      chi_tiet: `Ref ${REF} có tồn tại nhưng không đọc được ${TEP}. Đây KHÔNG phải sổ trống.\n${r.ra}`,
    };
  }

  const so = [];
  const dong = r.ra.split('\n').filter(Boolean);
  for (let i = 0; i < dong.length; i += 1) {
    let sk;
    try {
      sk = JSON.parse(dong[i]);
    } catch {
      return {
        ok: false,
        ma: MA.SO_HONG,
        ly_do: 'LEDGER_UNREADABLE',
        chi_tiet: `Dòng ${i + 1} của ${TEP} không phải JSON đọc được.`,
      };
    }
    if (!sk || typeof sk.viec !== 'string' || typeof sk.vung !== 'string') {
      return {
        ok: false,
        ma: MA.SO_HONG,
        ly_do: 'LEDGER_UNREADABLE',
        chi_tiet: `Dòng ${i + 1} của ${TEP} thiếu trường bắt buộc (viec · vung).`,
      };
    }
    so.push(sk);
  }
  return { ok: true, so };
}

// Commit có thật hay không. Không có vế này thì cửa nhận cả một SHA bịa ra —
// phiên Codex đẩy `deadbeef…` qua được ngày 07/09.
function laCommit(s) {
  return /^[0-9a-f]{7,40}$/i.test(s) && thu(['cat-file', '-e', `${s}^{commit}`]).ok;
}

// Trạng thái = phát lại sổ. Sổ là sự thật; trạng thái là bản tính ra, không lưu ở đâu cả.
function trangThai(so) {
  const chu = new Map();
  const theHe = new Map();
  const tichHopCuoi = new Map();

  for (const sk of so) {
    if (sk.viec === 'nhan') {
      theHe.set(sk.vung, sk.the_he);
      chu.set(sk.vung, sk);
    } else if (sk.viec === 'tra' || sk.viec === 'thu-hoi') {
      chu.delete(sk.vung);
    } else if (sk.viec === 'tich-hop') {
      tichHopCuoi.set(sk.vung, sk);
    }
  }
  return { chu, theHe, tichHopCuoi };
}

// Sự kiện cuối cùng làm một lane mất quyền ở một vùng — để câu từ chối nói được LÚC NÀO và AI.
function suKienMatQuyen(so, vung, lane) {
  let doi = null;
  for (const sk of so) {
    if (sk.vung !== vung) continue;
    if (sk.viec === 'nhan' && sk.lane === lane) doi = null;
    else if (doi === null && (sk.viec === 'thu-hoi' || (sk.viec === 'nhan' && sk.lane !== lane))) doi = sk;
  }
  return doi;
}

function laToTien(a, b) {
  if (a === b) return true;
  return thu(['merge-base', '--is-ancestor', a, b]).ok;
}

// ── Ghi một sự kiện: dựng commit bằng plumbing, không chạm cây làm việc ───────────────────────
function daySuKien(so, suKien, moTa, remote, coRef) {
  const noiDung = `${[...so, suKien].map((e) => JSON.stringify(e)).join('\n')}\n`;
  const blob = git(['hash-object', '-w', '--stdin'], noiDung);
  const tree = git(['mktree'], `100644 blob ${blob}\t${TEP}\n`);

  const args = ['commit-tree', tree, '-m', moTa];
  if (coRef) args.push('-p', git(['rev-parse', REF]));
  const commit = git(args);

  // Đẩy TRẦN. KHÔNG thêm `--force` — xem chốt ⑶ ở đầu file và ca ③c của bộ kiểm.
  const p = thu(['push', '--quiet', remote, `${commit}:${REF}`]);
  if (!p.ok) return { ok: false, ma: MA.TU_CHOI, ly_do: 'LOST_RACE', chi_tiet: p.ra };

  git(['update-ref', REF, commit]);
  return { ok: true, commit };
}

function moc() {
  return new Date().toISOString();
}

// ── Các lệnh ───────────────────────────────────────────────────────────────────────────────────

function lenhXem(remote) {
  const db = dongBo(remote);
  if (!db.ok) return bao(db);
  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);
  const so = ds.so;
  const { chu, theHe } = trangThai(so);

  if (chu.size === 0) console.log('(không vùng nào có chủ)');
  for (const [vung, sk] of chu) {
    console.log(`GIỮ  ${vung}  →  ${sk.lane}  (thế hệ ${sk.the_he})  ${sk.mo_ta || ''}`);
  }
  for (const [vung, g] of theHe) if (!chu.has(vung)) console.log(`TRỐNG ${vung}  (thế hệ đã dùng: ${g})`);
  console.log(`\n${so.length} sự kiện trong sổ.`);
  return MA.OK;
}

function lenhNhan({ vung, lane, moTa, remote }) {
  const db = dongBo(remote);
  if (!db.ok) return bao(db);

  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);
  const so = ds.so;
  const { chu, theHe } = trangThai(so);

  const dangGiu = chu.get(vung);
  if (dangGiu && dangGiu.lane !== lane) {
    console.error(`TỪ CHỐI [AREA_HELD] — ${vung} đang do ${dangGiu.lane} giữ từ ${dangGiu.luc}.`);
    console.error(`Việc họ khai: ${dangGiu.mo_ta || '(không khai)'}`);
    console.error('Muốn giành thì HỎI ĐỨC, rồi dùng --thu-hoi kèm --duc "<câu chốt>".');
    return MA.TU_CHOI;
  }
  if (dangGiu && dangGiu.lane === lane) {
    console.log(`đã giữ sẵn: ${vung} → ${lane} (thế hệ ${dangGiu.the_he})`);
    console.log(`THE_HE=${dangGiu.the_he}`);
    return MA.OK;
  }

  const g = (theHe.get(vung) || 0) + 1;
  const sk = { viec: 'nhan', vung, lane, the_he: g, luc: moc(), mo_ta: moTa };
  const d = daySuKien(so, sk, `quyen: ${lane} nhan ${vung} (the he ${g})`, remote, db.co_ref);
  if (!d.ok) {
    console.error(`TỪ CHỐI [LOST_RACE] — phiên khác vào trước ở ${vung}. Chạy lại lệnh này để đọc lại.`);
    return MA.TU_CHOI;
  }
  console.log(`đã nhận: ${vung} → ${lane} (thế hệ ${g})`);
  console.log(`THE_HE=${g}`);
  return MA.OK;
}

function lenhTra({ vung, lane, remote }) {
  const db = dongBo(remote);
  if (!db.ok) return bao(db);

  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);
  const so = ds.so;
  const { chu } = trangThai(so);
  const dangGiu = chu.get(vung);

  if (!dangGiu) {
    console.error(`TỪ CHỐI [NOT_HELD] — ${vung} không có chủ, không có gì để trả.`);
    return MA.TU_CHOI;
  }
  if (dangGiu.lane !== lane) {
    console.error(`TỪ CHỐI [NOT_YOURS] — ${vung} do ${dangGiu.lane} giữ, không phải ${lane}.`);
    console.error('Trả quyền hộ người khác là một trong ba đường KHÔNG hợp lệ. Xem AGENTS.md mục 1.');
    return MA.TU_CHOI;
  }

  const sk = { viec: 'tra', vung, lane, the_he: dangGiu.the_he, luc: moc() };
  const d = daySuKien(so, sk, `quyen: ${lane} tra ${vung}`, remote, db.co_ref);
  if (!d.ok) {
    console.error('TỪ CHỐI [LOST_RACE] — sổ đã đổi giữa lúc đọc và lúc ghi. Chạy lại.');
    return MA.TU_CHOI;
  }
  console.log(`đã trả: ${vung}`);
  return MA.OK;
}

function lenhThuHoi({ vung, lane, duc, remote }) {
  if (!duc) {
    console.error('TỪ CHỐI [NO_DUC_DECISION] — thu hồi quyền của người khác cần --duc "<câu chốt của Đức>".');
    console.error('Câu đó được ghi VÀO SỔ, không phải in ra màn hình: người cần đọc nó là phiên vừa mất quyền.');
    return MA.TU_CHOI;
  }

  const db = dongBo(remote);
  if (!db.ok) return bao(db);

  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);
  const so = ds.so;
  const { chu } = trangThai(so);
  const dangGiu = chu.get(vung);
  if (!dangGiu) {
    console.error(`TỪ CHỐI [NOT_HELD] — ${vung} không có chủ.`);
    return MA.TU_CHOI;
  }

  const sk = {
    viec: 'thu-hoi', vung, lane, luc: moc(),
    lay_tu: dangGiu.lane, the_he_bi_thu: dangGiu.the_he, duc_chot: duc,
  };
  const d = daySuKien(so, sk, `quyen: ${lane} thu hoi ${vung} tu ${dangGiu.lane}`, remote, db.co_ref);
  if (!d.ok) {
    console.error('TỪ CHỐI [LOST_RACE] — sổ đã đổi. Chạy lại.');
    return MA.TU_CHOI;
  }
  console.log(`đã thu hồi: ${vung} (từ ${dangGiu.lane}) — Đức chốt: ${duc}`);
  return MA.OK;
}

/* SIÊU DỮ LIỆU CỦA MỘT KẾT QUẢ — kiểm ở MỘT CHỖ cho cả `--xac-nhan` lẫn `--tich-hop`.
 *
 * Bản đầu cài ba phép kiểm này HAI LẦN, một bản trong mỗi lệnh. Bộ đột biến bắt được: năm lượt
 * đột biến báo *"neo khớp 2 chỗ, không xác định"* thay vì đo được gì — tức nếu chỉ gỡ MỘT bản thì
 * lệnh kia vẫn chặn và test vẫn xanh, và cái xanh đó không nói gì về bản bị gỡ. Đúng hình dạng
 * "hai bản của một luật sớm muộn nói hai câu khác nhau" (giới hạn ② Đức chốt 07/09).
 *
 * Trả về `null` khi mọi thứ ổn, hoặc mã lỗi để chỗ gọi in ra. */
/* THẾ HỆ khai có khớp thế hệ đang hiệu lực không — cũng MỘT bản cho cả hai lệnh, cùng lý do
 * như `kiemSieuDuLieu`: bộ đột biến không đo được một luật cài hai chỗ. */
function kiemTheHe(dangGiu, theHe, danh) {
  if (String(dangGiu.the_he) === String(theHe)) return null;
  console.error(`TỪ CHỐI [STALE_GENERATION] — ${danh} thế hệ ${theHe}, quyền hiện tại là thế hệ ${dangGiu.the_he}.`);
  console.error('Quyền đã bị thu hồi rồi cấp lại giữa lúc bạn làm. Kiểm lại rồi dựng lại.');
  return MA.TU_CHOI;
}

/* ── VÙNG ↔ ĐƯỜNG DẪN ─────────────────────────────────────────────────────────────────────────
 *
 * Chỗ hở phiên Codex đo được 07/09: lõi nhận BẤT KỲ tên vùng nào. Nó đẩy một kết quả sửa
 * `product.txt` qua cửa dưới tên vùng `wrong-area`, và cửa nói ĐẠT. Tên vùng khi ấy chỉ là một
 * lời khai — cùng loại với `--as`, và cùng loại với mọi thứ chưa ai kiểm.
 *
 * Bản đồ nằm ở khối `areas` của `.repo-structure.json` thuộc repo tiêu thụ, và được TRUYỀN VÀO
 * bằng `--ban-do`. Lõi cố ý không biết nó đang chạy trong repo nào: bản đồ vùng là chuyện của
 * từng repo, còn phép kiểm là chuyện của lõi.
 *
 * MỘT KẾT QUẢ, MỘT VÙNG — và đây là câu trả lời cho *"kết quả chạm NHIỀU vùng thì ai duyệt"*:
 * **không ai.** Tách ra, mỗi vùng một lượt. Lý do, không phải sở thích: một tờ xác nhận ký cho
 * MỘT vùng, và một lượt thu hồi cũng thu hồi MỘT vùng. Cho một kết quả trải hai vùng đi qua bằng
 * một tờ xác nhận là để bên kiểm của vùng A ký thay cho vùng B — mà nó không đọc, và không bị
 * thu hồi cùng. Luật này chặt hơn bảng khoá (bảng cho một lane giữ hai khoá cùng lúc); cố ý,
 * vì giữ hai khoá là chuyện điều phối, còn ký nhận một kết quả là chuyện thẩm quyền. */

function docBanDo(duong) {
  if (!duong) {
    console.error('TỪ CHỐI [MISSING_MAP] — cần --ban-do <đường dẫn .repo-structure.json>.');
    console.error('Không có bản đồ thì tên vùng chỉ là lời khai, và cửa này đã đi qua một lời');
    console.error('khai sai ngày 07/09. Cửa không chạy ở chế độ không kiểm.');
    return { ok: false, ma: MA.DUNG_SAI };
  }
  let tho;
  try {
    tho = JSON.parse(fs.readFileSync(duong, 'utf8'));
  } catch (e) {
    console.error(`TỪ CHỐI [MAP_UNREADABLE] — không đọc được bản đồ vùng ở ${duong}.`);
    console.error(String(e.message).split('\n')[0]);
    return { ok: false, ma: MA.DUNG_SAI };
  }
  const areas = tho && tho.areas;
  if (!areas || typeof areas !== 'object') {
    console.error(`TỪ CHỐI [MAP_UNREADABLE] — ${duong} không có khối "areas".`);
    return { ok: false, ma: MA.DUNG_SAI };
  }
  // Chỉ giữ khoá là đường dẫn (kết thúc bằng "/"); các khoá `_doc*` là văn xuôi cho người đọc.
  // Sắp theo độ dài GIẢM để khớp tiền tố dài nhất trước — nhờ đó `workers/_shared/` thắng
  // `workers/`, và luật đó không cần một vế riêng.
  const muc = Object.entries(areas)
    .filter(([k, v]) => k.endsWith('/') && v && typeof v === 'object')
    .sort((a, b) => b[0].length - a[0].length);
  if (!muc.length) {
    console.error(`TỪ CHỐI [MAP_UNREADABLE] — khối "areas" ở ${duong} không có mục đường dẫn nào.`);
    return { ok: false, ma: MA.DUNG_SAI };
  }
  return { ok: true, muc };
}

/* Một đường dẫn quy về khoá quyền nào. `null` = bản đồ không phủ tới. */
function quyVung(duongDan, muc, conLai) {
  for (const [tienTo, khai] of muc) {
    if (!duongDan.startsWith(tienTo)) continue;
    if (khai.ownership_mode === 'per-package') {
      const conLaiDuong = duongDan.slice(tienTo.length);
      const goi = conLaiDuong.split('/')[0];
      if (!goi) return null;
      return `${khai.claim_prefix || tienTo}${goi}`;
    }
    return khai.steward || null;
  }
  return conLai || null;
}

/* Mọi đường dẫn trong khoảng `coSo..sha` có nằm trong vùng đã khai không.
 * `--no-renames` cố ý: mặc định git chỉ in tên MỚI của một file bị đổi tên, nên một lượt chuyển
 * file từ vùng A sang vùng B sẽ chỉ hiện phía B và phía A biến mất khỏi phép kiểm. */
function kiemDuongDan({ vung, sha, coSo, banDo, conLai }) {
  const bd = docBanDo(banDo);
  if (!bd.ok) return bd.ma;

  const d = thu(['diff', '--name-only', '--no-renames', coSo, sha]);
  if (!d.ok) {
    console.error('TỪ CHỐI [DIFF_FAILED] — không đọc được khoảng thay đổi giữa nền và kết quả.');
    console.error(String(d.ra).split('\n').slice(0, 3).join('\n'));
    return MA.TU_CHOI;
  }
  const duongDan = d.ra.split('\n').map((s) => s.trim()).filter(Boolean);

  const laVungKhac = [];
  const khongPhu = [];
  for (const p of duongDan) {
    const khoa = quyVung(p, bd.muc, conLai);
    if (khoa === null) khongPhu.push(p);
    else if (khoa !== vung) laVungKhac.push([p, khoa]);
  }

  if (khongPhu.length) {
    console.error(`TỪ CHỐI [UNMAPPED_PATH] — ${khongPhu.length} đường dẫn không nằm trong vùng nào của bản đồ:`);
    for (const p of khongPhu.slice(0, 5)) console.error(`  ${p}`);
    console.error('Khai nó vào khối "areas", hoặc đưa --con-lai <khoá> cho phần còn lại của repo.');
    return MA.TU_CHOI;
  }
  if (laVungKhac.length) {
    console.error(`TỪ CHỐI [AREA_MISMATCH] — kết quả khai vùng ${vung} nhưng chạm ${laVungKhac.length} đường dẫn của vùng khác:`);
    for (const [p, k] of laVungKhac.slice(0, 5)) console.error(`  ${p} → ${k}`);
    console.error('Một kết quả, một vùng. Tách thành từng lượt riêng, mỗi vùng một tờ xác nhận —');
    console.error('bên kiểm của vùng này không ký thay cho vùng kia được.');
    return MA.TU_CHOI;
  }
  return null;
}

function kiemSieuDuLieu({ theHe, sha, coSo }) {
  if (!theHe || !sha || !coSo) {
    console.error('TỪ CHỐI [MISSING_DATA] — cần cả --the-he, --sha và --co-so.');
    console.error('`--co-so` là SHA mà kết quả được dựng trên. Không có nó thì không kiểm được');
    console.error('kết quả có tính tới trạng thái tích hợp mới nhất hay không.');
    return MA.TU_CHOI;
  }
  for (const [ten, gt] of [['--sha', sha], ['--co-so', coSo]]) {
    if (!laCommit(gt)) {
      console.error(`TỪ CHỐI [UNKNOWN_COMMIT] — ${ten}=${gt} không phải một commit có thật ở đây.`);
      console.error('Cửa không nhận một SHA nó không kiểm được. Fetch về rồi khai lại.');
      return MA.TU_CHOI;
    }
  }
  if (!laToTien(coSo, sha)) {
    console.error(`TỪ CHỐI [BASE_NOT_IN_RESULT] — nền khai là ${coSo.slice(0, 8)} nhưng commit kết quả`);
    console.error(`${sha.slice(0, 8)} KHÔNG chứa nó. Nền khai phải là tổ tiên của chính kết quả.`);
    console.error('Không có vế này thì khai nền nào cũng đi qua được lượt so "đích đã đổi".');
    return MA.TU_CHOI;
  }
  return null;
}

/* BÊN THỨ BA XÁC NHẬN MỘT KẾT QUẢ. Lệnh này KHÔNG cấp quyền và KHÔNG tích hợp gì.
 *
 * Nó tồn tại vì một câu tôi tự nêu rồi tự quên: *"một status check chỉ là hàng rào thật nếu thứ
 * GỬI trạng thái không phải thứ ĐANG BỊ kiểm."* Nên `--as` ở đây là **bên kiểm**, và nó bị TỪ CHỐI
 * nếu trùng với lane đang giữ vùng.
 *
 * Tờ xác nhận vào chính sổ quyền, nên nó thừa hưởng thứ tự và phép so-và-đổi của sổ. Đó là thứ cho
 * cửa tích hợp hỏi được câu *"đây có phải điều cuối cùng xảy ra với vùng này không"* — xem chốt ở
 * `lenhTichHop`. Trong bản thật, bên kiểm là workflow `cong-kiem` chạy trên máy GitHub. */
function lenhXacNhan({ vung, lane, theHe, sha, coSo, remote, banDo, conLai }) {
  const hong = kiemSieuDuLieu({ theHe, sha, coSo });
  if (hong !== null) return hong;

  // Bên kiểm cũng không được ký cho một kết quả nằm ngoài vùng nó đang kiểm. Cùng một hàm với
  // cửa tích hợp — luật cài hai chỗ là luật bộ đột biến không đo được (đã vấp 07/09).
  const lechVung = kiemDuongDan({ vung, sha, coSo, banDo, conLai });
  if (lechVung !== null) return lechVung;

  const db = dongBo(remote);
  if (!db.ok) return bao(db);
  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);
  const so = ds.so;
  const { chu } = trangThai(so);
  const dangGiu = chu.get(vung);

  if (!dangGiu) {
    console.error(`TỪ CHỐI [NOT_HELD] — ${vung} không có chủ, không có kết quả nào để xác nhận.`);
    return MA.TU_CHOI;
  }
  /* CHỖ NÀY SO MỘT THAM SỐ TỰ KHAI, KHÔNG SO DANH TÍNH. Phiên Codex (#21) chỉ đúng, và đây là
   * giới hạn nặng nhất của bản hiện tại — ghi vào mã để lượt sau đọc mã là thấy, không phải đi
   * tìm trong ADR:
   *
   *   Cùng một Assistant gọi lại lệnh này bằng một cái tên `--as` khác là qua được.
   *
   * Nên vế dưới cưỡng chế được **hình dạng** của luật (tờ xác nhận phải mang tên một bên khác),
   * chứ KHÔNG chứng minh *"đã có bên thứ ba thật"*. Lúc nối vào Actions, danh tính bên xác nhận
   * phải đến từ **nguồn được xác thực** — token của workflow chạy trên máy GitHub — không từ tham
   * số này. Đó là điều kiện TRƯỚC KHI dùng thật, và nó chưa được thoả. */
  if (dangGiu.lane === lane) {
    console.error(`TỪ CHỐI [SELF_ATTESTATION] — ${lane} đang giữ ${vung}, nên nó không được tự xác nhận`);
    console.error('kết quả của chính mình. Một tờ xác nhận do bên bị kiểm ký là lời tự khai,');
    console.error('không phải hàng rào. Bên kiểm phải là một bên khác.');
    console.error('(Lưu ý: chỗ này so TÊN tự khai, chưa so danh tính được xác thực — xem chú thích mã.)');
    return MA.TU_CHOI;
  }
  const lechTheHe = kiemTheHe(dangGiu, theHe, 'xác nhận cho');
  if (lechTheHe !== null) return lechTheHe;

  const sk = {
    viec: 'xac-nhan', vung, boi: lane, cho: dangGiu.lane,
    the_he: Number(theHe), sha, co_so: coSo, luc: moc()
  };
  const d = daySuKien(so, sk, `quyen: ${lane} xac nhan ${vung} @ ${sha.slice(0, 8)}`, remote, db.co_ref);
  if (!d.ok) {
    console.error('TỪ CHỐI [LOST_RACE] — sổ đổi đúng lúc ghi tờ xác nhận. Chạy lại.');
    return MA.TU_CHOI;
  }
  console.log(`đã xác nhận: ${vung} @ ${sha.slice(0, 8)} cho ${dangGiu.lane} (bởi ${lane})`);
  return MA.OK;
}

// Cửa tích hợp. Lượt KIỂM và lượt GHI là cùng một lượt đẩy — đó là cả điểm của lệnh này.
function lenhTichHop({ vung, lane, theHe, sha, coSo, remote, banDo, conLai }) {
  // Bắt buộc điền là CHƯA ĐỦ — phải kiểm điều đã điền có khớp commit thật.
  // Phiên Codex đẩy được ba thứ qua cửa này ngày 07/09: kết quả cũ bỏ trống `--co-so` ·
  // kết quả cũ khai một nền mà chính nó không chứa · một SHA bịa ra hoàn toàn.
  // Ba phép kiểm đó ở `kiemSieuDuLieu` — MỘT bản dùng cho cả lệnh này lẫn `--xac-nhan`.
  const hong = kiemSieuDuLieu({ theHe, sha, coSo });
  if (hong !== null) return hong;

  const db = dongBo(remote);
  if (!db.ok) return bao(db);

  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);
  const so = ds.so;
  const { chu, tichHopCuoi } = trangThai(so);
  const dangGiu = chu.get(vung);

  if (!dangGiu || dangGiu.lane !== lane) {
    const doi = suKienMatQuyen(so, vung, lane);
    console.error(`TỪ CHỐI [AUTHORITY_REVOKED] — ${lane} không còn quyền ở ${vung}.`);
    if (doi) {
      console.error(`Mất lúc ${doi.luc}, bằng lượt "${doi.viec}"${doi.lane ? ` của ${doi.lane}` : ''}.`);
      if (doi.duc_chot) console.error(`Đức chốt: ${doi.duc_chot}`);
    }
    console.error('Kết quả này KHÔNG được nhận. Xin lại quyền rồi dựng lại trên trạng thái mới.');
    return MA.TU_CHOI;
  }

  const lechTheHe = kiemTheHe(dangGiu, theHe, 'kết quả mang');
  if (lechTheHe !== null) return lechTheHe;

  // Đích đã đổi? So với lượt TÍCH HỢP gần nhất của cùng vùng — không so với cây làm việc của ai.
  // Cố ý: một checkout khác đang làm dở KHÔNG phải cơ sở để chặn ai (ADR-0019 ⑶).
  const truoc = tichHopCuoi.get(vung);
  if (truoc && !laToTien(truoc.sha, coSo)) {
    console.error(`TỪ CHỐI [STALE_BASE] — ${vung} đã tích hợp tới ${truoc.sha.slice(0, 8)} lúc ${truoc.luc},`);
    console.error(`mà kết quả này dựng trên ${coSo.slice(0, 8)} — không chứa lượt đó.`);
    console.error('Lấy về, dựng lại, rồi kiểm lại. Mỗi lượt rebase phải kiểm lại.');
    return MA.TU_CHOI;
  }

  /* TÊN VÙNG PHẢI KHỚP ĐƯỜNG DẪN THẬT — và thứ tự ở đây là chuyện đã đo, không phải chuyện gu.
   *
   * Bản đầu đặt phép kiểm này lên TRÊN CÙNG, với lý lẽ "sai vùng thì chẳng cần hỏi remote". Lý lẽ
   * đó sai, và ca ⑤ chỉ ra: phép kiểm đo khoảng `coSo..sha`, nên một NỀN KHAI SAI làm khoảng đó
   * phình ra và cuốn theo commit của lane khác — cửa từ chối đúng, nhưng nói sai lý do
   * (`AREA_MISMATCH` thay vì `STALE_BASE`), và `STALE_BASE` thành mã không bao giờ chạy.
   *
   * Đặt sau `STALE_BASE` thì khoảng đo mới tin được: vế đó buộc `coSo` phải CHỨA lượt tích hợp
   * gần nhất của vùng, nên `coSo..sha` chính là "những gì vùng này đổi kể từ lần nhận trước".
   * Khai một nền SỚM hơn chỉ làm khoảng rộng ra — hướng an toàn, và vẫn bị từ chối. */
  const lechVung = kiemDuongDan({ vung, sha, coSo, banDo, conLai });
  if (lechVung !== null) return lechVung;

  /* XÁC NHẬN CỦA BÊN THỨ BA PHẢI LÀ SỰ KIỆN LIỀN TRƯỚC — chốt trả lời phiên Codex (#14, #19).
   *
   * Chuỗi Codex dựng ra và cả ba lượt đều thành công:
   *   A được ghi nhận kết quả → B thu hồi quyền A → A đẩy mã vào `main`.
   * Và câu tôi kết luận sớm: *"bật `enforce_admins` cộng một bước Actions là bịt được khe"*.
   * SAI, và Codex chỉ đúng lý do: **một required status check gắn vào COMMIT.** Nó xanh cho C thì
   * nó xanh mãi cho C, còn nguồn quyền thì đổi ĐỘC LẬP sau đó. Không gì chấm lại lúc tích hợp.
   *
   * Chốt ở đây không cần GitHub chấm lại, vì nó đổi cách hỏi: thay vì hỏi *"có tờ xác nhận nào
   * không"*, cửa hỏi **"tờ xác nhận có phải là điều CUỐI CÙNG xảy ra với vùng này không"**.
   *
   * Vì sao vế đó đủ: sổ quyền là một hàng đợi có thứ tự, và mọi lượt ghi đi qua đúng một phép
   * so-và-đổi. Nên một lượt thu hồi chen vào giữa xác nhận và tích hợp **buộc phải** nằm sau tờ
   * xác nhận trong sổ — và lúc đó tờ xác nhận không còn là sự kiện liền trước nữa. Cửa từ chối
   * mà không cần biết lượt thu hồi ấy nói gì.
   *
   * Vế thứ hai, và nó là vế làm cho tờ xác nhận có nghĩa: **bên xác nhận không được là bên đang
   * bị kiểm.** Hai vai tự gửi "đạt" cho chính mình là tự khai, không phải hàng rào. Cưỡng chế ở
   * `--xac-nhan`, không ở đây. */
  const cuoiCuaVung = [...so].reverse().find((e) => e.vung === vung);
  if (!cuoiCuaVung || cuoiCuaVung.viec !== 'xac-nhan') {
    console.error(`TỪ CHỐI [NO_CHECK] — chưa có xác nhận của bên thứ ba cho ${vung}, hoặc đã có việc`);
    console.error(`khác xảy ra sau nó (việc cuối: "${cuoiCuaVung?.viec ?? 'không có'}").`);
    console.error('Xin xác nhận lại: node scripts/quyen.mjs --xac-nhan <vùng> --as <bên-kiểm> ...');
    return MA.TU_CHOI;
  }
  if (cuoiCuaVung.sha !== sha || String(cuoiCuaVung.the_he) !== String(theHe) || cuoiCuaVung.cho !== lane) {
    console.error('TỪ CHỐI [CHECK_MISMATCH] — tờ xác nhận cuối không ứng với kết quả này.');
    console.error(`Nó xác nhận ${String(cuoiCuaVung.sha).slice(0, 8)} thế hệ ${cuoiCuaVung.the_he} cho ${cuoiCuaVung.cho};`);
    console.error(`bạn đang đưa ${sha.slice(0, 8)} thế hệ ${theHe} cho ${lane}.`);
    return MA.TU_CHOI;
  }

  const sk = {
    viec: 'tich-hop', vung, lane, the_he: Number(theHe), sha, co_so: coSo,
    xac_nhan_boi: cuoiCuaVung.boi, luc: moc()
  };
  const d = daySuKien(so, sk, `quyen: ${lane} tich hop ${vung} @ ${sha.slice(0, 8)}`, remote, db.co_ref);
  if (!d.ok) {
    // Thu hồi chen vào ĐÚNG giữa lượt kiểm và lượt ghi. Git từ chối, nên không lọt.
    console.error('TỪ CHỐI [RACE_AT_GATE] — sổ quyền đổi đúng lúc ghi kết quả. Không có gì được nhận.');
    console.error('Chạy lại: nếu quyền đã bị thu hồi thì lượt sau sẽ nói rõ.');
    return MA.TU_CHOI;
  }
  console.log(`đã nhận kết quả: ${vung} @ ${sha.slice(0, 8)} (thế hệ ${theHe})`);
  return MA.OK;
}

/* CỬA CHO ĐƯỜNG CẬP NHẬT `main` — trả lời đúng một câu: SHA này đã được phép công bố chưa?
 *
 * Phiên Codex (#21) chỉ đúng chỗ mọi ca trước còn thiếu: chúng kiểm **việc ghi sổ**, không kiểm
 * **việc cập nhật `main`**. *"Được ghi nhận"* và *"đã vào `main`"* là hai chuyện, và bản trước để
 * chúng rời nhau hoàn toàn.
 *
 * Điều kiện: sự kiện CUỐI CÙNG của vùng phải là một lượt `tich-hop` cho đúng SHA này. Cùng lý lẽ
 * như ở cửa tích hợp — sổ có thứ tự, nên một lượt thu hồi chen vào sau lượt ghi nhận sẽ đẩy lượt
 * ghi nhận ra khỏi vị trí cuối, và câu trả lời thành KHÔNG.
 *
 * RANH GIỚI, tuyệt đối không đọc rộng hơn: lệnh này là **thứ mà bên đẩy phải GỌI**. Nó KHÔNG chặn
 * được một lượt `git push` không gọi nó. Bộ kiểm có một ca đo đúng chỗ đó — đẩy bỏ qua cửa thì mã
 * VẪN vào `main` — và ca ấy tồn tại để con số đó nằm trên giấy, chứ không để chứng minh điều ta
 * muốn tin. Chặn thật vẫn cần cờ `enforce_admins` cộng một bước đọc sổ quyền chạy trên máy GitHub. */
function lenhChoDay({ vung, lane, sha, remote }) {
  if (!sha) {
    console.error('TỪ CHỐI [MISSING_DATA] — cần --sha là commit sắp đưa vào `main`.');
    return MA.TU_CHOI;
  }

  const db = dongBo(remote);
  if (!db.ok) return bao(db);
  const ds = docSo(db.co_ref);
  if (!ds.ok) return bao(ds);

  const cuoi = [...ds.so].reverse().find((e) => e.vung === vung);
  if (!cuoi || cuoi.viec !== 'tich-hop') {
    console.error(`TỪ CHỐI [NOT_CLEARED] — ${vung}: việc cuối cùng trong sổ là "${cuoi?.viec ?? 'không có'}",`);
    console.error('không phải một lượt ghi nhận tích hợp. Chưa được phép công bố.');
    if (cuoi?.viec === 'thu-hoi') {
      console.error(`Quyền đã bị thu hồi lúc ${cuoi.luc}${cuoi.lane ? ` bởi ${cuoi.lane}` : ''}.`);
      if (cuoi.duc_chot) console.error(`Đức chốt: ${cuoi.duc_chot}`);
    }
    return MA.TU_CHOI;
  }
  if (cuoi.sha !== sha) {
    console.error(`TỪ CHỐI [SHA_MISMATCH] — sổ ghi nhận ${String(cuoi.sha).slice(0, 8)}, bạn đang đẩy ${sha.slice(0, 8)}.`);
    return MA.TU_CHOI;
  }
  if (cuoi.lane !== lane) {
    console.error(`TỪ CHỐI [NOT_YOURS] — lượt ghi nhận đó của ${cuoi.lane}, không phải ${lane}.`);
    return MA.TU_CHOI;
  }

  console.log(`được phép công bố: ${vung} @ ${sha.slice(0, 8)} (ghi nhận lúc ${cuoi.luc}, xác nhận bởi ${cuoi.xac_nhan_boi})`);
  return MA.OK;
}

function bao(db) {
  console.error(`DỪNG [${db.ly_do}] — không đọc được nguồn quyền, nên KHÔNG cấp và KHÔNG nhận gì.`);
  if (db.chi_tiet) console.error(db.chi_tiet.split('\n').slice(0, 3).join('\n'));
  return db.ma;
}

// ── Đọc đối số ─────────────────────────────────────────────────────────────────────────────────

function docDoiSo(argv) {
  const o = { remote: 'origin' };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const ke = () => argv[i + 1];
    if (a === '--nhan') { o.lenh = 'nhan'; o.vung = ke(); i += 1; }
    else if (a === '--tra') { o.lenh = 'tra'; o.vung = ke(); i += 1; }
    else if (a === '--thu-hoi') { o.lenh = 'thu-hoi'; o.vung = ke(); i += 1; }
    else if (a === '--tich-hop') { o.lenh = 'tich-hop'; o.vung = ke(); i += 1; }
    else if (a === '--xac-nhan') { o.lenh = 'xac-nhan'; o.vung = ke(); i += 1; }
    else if (a === '--cho-day') { o.lenh = 'cho-day'; o.vung = ke(); i += 1; }
    else if (a === '--xem') o.lenh = 'xem';
    else if (a === '--as') { o.lane = ke(); i += 1; }
    else if (a === '--viec') { o.moTa = ke(); i += 1; }
    else if (a === '--duc') { o.duc = ke(); i += 1; }
    else if (a === '--the-he') { o.theHe = ke(); i += 1; }
    else if (a === '--sha') { o.sha = ke(); i += 1; }
    else if (a === '--co-so') { o.coSo = ke(); i += 1; }
    else if (a === '--remote') { o.remote = ke(); i += 1; }
    else if (a === '--ban-do') { o.banDo = ke(); i += 1; }
    else if (a === '--con-lai') { o.conLai = ke(); i += 1; }
  }
  return o;
}

function huongDan() {
  console.log(`quyen.mjs — nguồn quyền có thẩm quyền, phân xử bằng một ref git.

  node scripts/quyen.mjs --xem
  node scripts/quyen.mjs --nhan <vùng> --as <lane> --viec "một câu"
  node scripts/quyen.mjs --tra <vùng> --as <lane>
  node scripts/quyen.mjs --thu-hoi <vùng> --as <lane> --duc "<câu chốt của Đức>"
  node scripts/quyen.mjs --xac-nhan <vùng> --as <bên-kiểm> --the-he <n> --sha <sha> --co-so <sha> \\
                         --ban-do .repo-structure.json --con-lai _root
  node scripts/quyen.mjs --tich-hop <vùng> --as <lane> --the-he <n> --sha <sha> --co-so <sha> \\
                         --ban-do .repo-structure.json --con-lai _root
  node scripts/quyen.mjs --cho-day <vùng> --as <lane> --sha <sha>

Cửa tích hợp đòi tờ xác nhận của BÊN KHÁC, và đòi nó là điều CUỐI CÙNG xảy ra với vùng đó.

--ban-do là bản đồ vùng → đường dẫn (khối "areas" của .repo-structure.json). Bắt buộc: không
có nó thì tên vùng chỉ là lời khai. --con-lai là khoá cho các đường dẫn bản đồ không phủ tới
(thường là _root); không khai thì đường dẫn đó bị TỪ CHỐI, không được cho qua.
MỘT KẾT QUẢ, MỘT VÙNG — kết quả chạm hai vùng thì tách thành hai lượt, không ai duyệt gộp.

Mã thoát: 0 xong · 2 gọi sai · 3 TỪ CHỐI · 4 không tới được remote · 5 sổ quyền hỏng.
Ba mã cuối đều là fail-closed: không chắc thì KHÔNG cấp và KHÔNG nhận.`);
}

const o = docDoiSo(process.argv.slice(2));

if (!o.lenh) { huongDan(); process.exit(MA.DUNG_SAI); }
if (o.lenh !== 'xem' && (!o.vung || !o.lane)) {
  console.error('Gọi sai: cần cả tên vùng và --as <lane>.');
  process.exit(MA.DUNG_SAI);
}

const chay = {
  xem: () => lenhXem(o.remote),
  nhan: () => lenhNhan(o),
  tra: () => lenhTra(o),
  'thu-hoi': () => lenhThuHoi(o),
  'tich-hop': () => lenhTichHop(o),
  'xac-nhan': () => lenhXacNhan(o),
  'cho-day': () => lenhChoDay(o),
};

process.exit(chay[o.lenh]());
