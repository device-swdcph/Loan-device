/**
 * บันทึกเวลาแก้ไขล่าสุดของเครื่องมือแต่ละประเภท ให้ Dashboard แสดง "อัปเดตล่าสุด"
 *
 * ทำงานอย่างไร
 * - เมื่อมีคนแก้ไขแท็บใดก็ได้ (ยกเว้น Summary และแท็บบันทึกเวลา)
 * - สคริปต์หาว่าคอลัมน์ไหนในแท็บ Summary มีสูตรอ้างถึงแท็บนั้น เช่น =COUNTIF('ชีต2'!E:E, ...)
 * - แล้วบันทึกเวลาปัจจุบันลงแท็บ "อัปเดตล่าสุด" ตามชื่อเครื่อง (แถว 1 ของ Summary)
 * ดังนั้นเพิ่ม/ลบเครื่องมือใน Summary ได้โดยไม่ต้องแก้สคริปต์นี้
 *
 * วิธีติดตั้ง: Google Sheet → ส่วนขยาย → Apps Script → วางโค้ดนี้ทั้งหมด → บันทึก
 */

const SUMMARY_SHEET = 'Summary';
const STAMP_SHEET = 'อัปเดตล่าสุด';

function onEdit(e) {
  if (!e || !e.range) return;
  const edited = e.range.getSheet().getName();
  if (edited === SUMMARY_SHEET || edited === STAMP_SHEET) return;
  stampSheet_(e.source, edited, new Date());
}

function stampSheet_(ss, sheetName, when) {
  const summary = ss.getSheetByName(SUMMARY_SHEET);
  if (!summary) return;
  const lastRow = summary.getLastRow();
  const lastCol = summary.getLastColumn();
  if (lastRow < 2 || lastCol < 2) return;

  const headers = summary.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  const formulas = summary.getRange(1, 1, lastRow, lastCol).getFormulas();
  const pattern = refPattern_(sheetName);

  const names = [];
  for (let c = 1; c < lastCol; c++) {
    const name = String(headers[c]).trim();
    if (!name) continue;
    if (formulas.some((row) => pattern.test(row[c]))) names.push(name);
  }
  if (names.length) writeStamps_(ss, names, when);
}

// ตรงกับ 'ชีต2'!  หรือ  ชีต2!  ที่ไม่ได้เป็นส่วนท้ายของชื่อแท็บอื่น
function refPattern_(sheetName) {
  const esc = sheetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const quoted = esc.replace(/'/g, "''");
  return new RegExp("'" + quoted + "'!|(^|[=(,+\\-*/&;:{\\s])" + esc + '!');
}

function writeStamps_(ss, names, when) {
  let log = ss.getSheetByName(STAMP_SHEET);
  if (!log) {
    log = ss.insertSheet(STAMP_SHEET);
    log.getRange(1, 1, 1, 2).setValues([['เครื่องมือ', 'อัปเดตล่าสุด']]).setFontWeight('bold');
    log.setColumnWidth(1, 180);
    log.setColumnWidth(2, 160);
  }
  const lastRow = Math.max(log.getLastRow(), 1);
  const existing = log.getRange(1, 1, lastRow, 1).getDisplayValues().map((r) => String(r[0]).trim());
  names.forEach((name) => {
    let row = existing.indexOf(name) + 1;
    if (!row) {
      row = existing.length + 1;
      existing.push(name);
      log.getRange(row, 1).setValue(name);
    }
    log.getRange(row, 2).setValue(when).setNumberFormat('d/m/yyyy HH:mm');
  });
}

/**
 * (ไม่บังคับ) กดรันฟังก์ชันนี้ครั้งเดียวหลังติดตั้ง เพื่อตั้งเวลาเริ่มต้นของทุกเครื่องเป็น "ตอนนี้"
 * ถ้าไม่รัน แต่ละเครื่องจะแสดงเวลาหลังจากมีคนแก้ไขแท็บนั้นครั้งแรก
 */
function stampAllNow() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();
  ss.getSheets()
    .map((sh) => sh.getName())
    .filter((n) => n !== SUMMARY_SHEET && n !== STAMP_SHEET)
    .forEach((n) => stampSheet_(ss, n, now));
}
