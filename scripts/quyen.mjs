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
//   CHƯA LÀM, ĐÃ BIẾT:    file này KHÔNG kiểm đường dẫn. Nó nhận bất kỳ tên vùng nào, kể cả khi
//                         commit kết quả sửa file thuộc vùng khác — phiên Codex khai `wrong-area`
//                         cho một thay đổi ở `product.txt` và đi qua được. Bịt chỗ này cần bản đồ
//                         vùng → đường dẫn, mà bản đồ đó nằm ở `.repo-structure.json` của TỪNG
//                         repo, còn file này thì cố ý không biết repo nào. Nên nó là mục việc kế
//                         tiếp, không phải một dòng thêm vào đây. Cho tới lúc đó: tên vùng ở đây
//                         là LỜI KHAI, không phải điều đã kiểm.
//
// Fail-closed: không tới được remote thì KHÔNG cấp quyền. Một quyền cấp bằng phỏng đoán tệ hơn
// không có quyền.

import { execFileSync } from 'node:child_process';

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

// Cửa tích hợp. Lượt KIỂM và lượt GHI là cùng một lượt đẩy — đó là cả điểm của lệnh này.
function lenhTichHop({ vung, lane, theHe, sha, coSo, remote }) {
  // Bắt buộc điền là CHƯA ĐỦ — phải kiểm điều đã điền có khớp commit thật.
  // Phiên Codex đẩy được ba thứ qua cửa này ngày 07/09: kết quả cũ bỏ trống `--co-so` ·
  // kết quả cũ khai một nền mà chính nó không chứa · một SHA bịa ra hoàn toàn.
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

  if (String(dangGiu.the_he) !== String(theHe)) {
    console.error(`TỪ CHỐI [STALE_GENERATION] — kết quả mang thế hệ ${theHe}, quyền hiện tại là thế hệ ${dangGiu.the_he}.`);
    console.error('Quyền đã bị thu hồi rồi cấp lại giữa lúc bạn làm. Kiểm lại rồi dựng lại.');
    return MA.TU_CHOI;
  }

  // Đích đã đổi? So với lượt TÍCH HỢP gần nhất của cùng vùng — không so với cây làm việc của ai.
  // Cố ý: một checkout khác đang làm dở KHÔNG phải cơ sở để chặn ai (ADR-0019 ⑶).
  const truoc = tichHopCuoi.get(vung);
  if (truoc && !laToTien(truoc.sha, coSo)) {
    console.error(`TỪ CHỐI [STALE_BASE] — ${vung} đã tích hợp tới ${truoc.sha.slice(0, 8)} lúc ${truoc.luc},`);
    console.error(`mà kết quả này dựng trên ${coSo.slice(0, 8)} — không chứa lượt đó.`);
    console.error('Lấy về, dựng lại, rồi kiểm lại. Mỗi lượt rebase phải kiểm lại.');
    return MA.TU_CHOI;
  }

  const sk = { viec: 'tich-hop', vung, lane, the_he: Number(theHe), sha, co_so: coSo, luc: moc() };
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
    else if (a === '--xem') o.lenh = 'xem';
    else if (a === '--as') { o.lane = ke(); i += 1; }
    else if (a === '--viec') { o.moTa = ke(); i += 1; }
    else if (a === '--duc') { o.duc = ke(); i += 1; }
    else if (a === '--the-he') { o.theHe = ke(); i += 1; }
    else if (a === '--sha') { o.sha = ke(); i += 1; }
    else if (a === '--co-so') { o.coSo = ke(); i += 1; }
    else if (a === '--remote') { o.remote = ke(); i += 1; }
  }
  return o;
}

function huongDan() {
  console.log(`quyen.mjs — nguồn quyền có thẩm quyền, phân xử bằng một ref git.

  node scripts/quyen.mjs --xem
  node scripts/quyen.mjs --nhan <vùng> --as <lane> --viec "một câu"
  node scripts/quyen.mjs --tra <vùng> --as <lane>
  node scripts/quyen.mjs --thu-hoi <vùng> --as <lane> --duc "<câu chốt của Đức>"
  node scripts/quyen.mjs --tich-hop <vùng> --as <lane> --the-he <n> --sha <sha> --co-so <sha>

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
};

process.exit(chay[o.lenh]());
