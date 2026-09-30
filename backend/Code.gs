const SHEET_NAME = 'Responses';
const DATE_HEADER = 'التاريخ';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

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

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
