/**
 * Thai AirAsia Data Table Web App
 * Backend: Google Apps Script
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('RAMP SAFETY NOTICE - Thai AirAsia')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Get data from Google Sheet
 */
function getSheetData() {
  const ssId = '1qnBfG1gN7kXDb3B0PhDJqN-hzGz_MKzW7exlu-eHD8o';
  const sheetName = 'RAMP SAFETY NOTICE!!';
  
  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const jsonData = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        // Clean header name to use as key
        const key = header.toString().trim().toLowerCase().replace(/\s+/g, '_');
        obj[key] = row[index];
      });
      return obj;
    });
    
    return jsonData;
  } catch (e) {
    console.error('Error fetching data: ' + e.toString());
    return { error: e.toString() };
  }
}

/**
 * Include HTML/CSS/JS files
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
