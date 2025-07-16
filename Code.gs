var folderId = "1du2PNAl04Q3pSG8RfajSFE730Vvu5G9B"; // 👈 Your Google Drive folder ID
var sheetName = "Sheet1";

function doPost(e) {
  try {
    const { parameter, files } = e;
    const fileBlob = e?.files?.screenshot;

    let uploadedFileUrl = "";

    if (fileBlob) {
      const blob = fileBlob;
      const folder = DriveApp.getFolderById(folderId);
      const file = folder.createFile(blob);
      uploadedFileUrl = file.getUrl();
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const row = headers.map((header) => {
      if (header === "timestamp") return new Date();
      if (header === "screenshot") return uploadedFileUrl;
      return parameter[header] || "";
    });

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
