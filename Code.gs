function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('RAMP SAFETY NOTICE')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheetData() {
  const ssId = '1qnBfG1gN7kXDb3B0PhDJqN-hzGz_MKzW7exlu-eHD8o'; // ID จาก Sheet ของคุณ
  const sheet = SpreadsheetApp.openById(ssId).getSheetByName('RAMP SAFETY NOTICE!!');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
