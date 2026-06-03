// Google Apps Script — FEST Merch Orders webhook
//
// Setup:
// 1. Create a Google Sheet named "FEST Merch Orders"
// 2. Go to Extensions → Apps Script
// 3. Paste this entire file
// 4. Click Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the deployment URL into MERCH_SHEETS_URL in .env.local

const SHEET_NAME = 'Orders'

const HEADERS = [
  'Order ID', 'Timestamp', 'Meno', 'Priezvisko', 'Email', 'Telefón',
  'Farba', 'Veľkosť', 'Množstvo', 'Doručenie',
  'Ulica', 'Mesto', 'PSČ',
  'Celkom (€)', 'Zaplatené', 'Odoslané',
]

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#080708')
      .setFontColor('#FDCA40')
    sheet.setFrozenRows(1)
    sheet.setColumnWidth(1, 120)
    sheet.setColumnWidth(2, 160)
    sheet.setColumnWidth(5, 200)
  }

  return sheet
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    const row = [
      data.orderId ?? '',
      data.timestamp ?? new Date().toISOString(),
      data.firstName ?? '',
      data.lastName ?? '',
      data.email ?? '',
      data.phone ?? '',
      data.color ?? '',
      data.size ?? '',
      data.qty ?? '',
      data.delivery === 'shipping' ? 'Doručenie na adresu' : 'Vyzdvihnutie na tábore',
      data.street ?? '',
      data.city ?? '',
      data.zip ?? '',
      data.total ?? '',
      data.paid ?? 'NIE',
      data.shipped ?? 'NIE',
    ]

    sheet.appendRow(row)

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Allow GET for health check
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', sheet: SHEET_NAME }))
    .setMimeType(ContentService.MimeType.JSON)
}
