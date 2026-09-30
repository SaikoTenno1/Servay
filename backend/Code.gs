const SHEET_ID = '1wTsE-zsQDCtbHiA1DCMOo1Io7NtuacOuTC-3-L9Hgso';
const SHEET_NAME = 'Responses';
const DATE_HEADER = 'التاريخ';

function out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return out({ ok: true });
}

function targetSheet() {
  if (SHEET_ID) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('NO_SHEET_BOUND');
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sh = targetSheet();

    let headers = [];
    if (sh.getLastRow() > 0) {
      headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    }
    if (!headers.includes(DATE_HEADER)) headers.unshift(DATE_HEADER);
    Object.keys(data).forEach((k) => {
      if (!headers.includes(k)) headers.push(k);
    });
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);

    const row = headers.map((h) => (h === DATE_HEADER ? new Date() : (data[h] || '')));
    sh.appendRow(row);

    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err && err.message || err) });
  }
}
