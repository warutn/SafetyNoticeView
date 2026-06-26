/**
 * Thai AirAsia Data Table - GitHub Pages Version
 */

// 1. นำลิงก์ CSV จาก Google Sheets มาใส่ตรงนี้ (เดี๋ยวผมสอนวิธีเอาลิงก์ครับ)
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS731D6A7mY8L1E6fS2z6_z79Z3N5_Kx1Hj0p_v-oY4k/pub?output=csv';

let allData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterData(e.target.value));
  }
});

async function fetchData() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();
    allData = parseCSV(csvText);
    renderTable(allData);
  } catch (error) {
    console.error('Error:', error);
    showError('Cannot fetch data. Please check "Publish to Web" settings.');
  }
}

// ฟังก์ชันแปลง CSV เป็น JSON แบบง่าย
function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return lines.slice(1).map(line => {
    const values = line.split(',');
    let obj = {};
    headers.forEach((header, i) => obj[header] = values[i]);
    return obj;
  });
}

// ... ส่วนที่เหลือ (renderTable, showPreview, hidePreview) ใช้ของเดิมได้เลยครับ ...
