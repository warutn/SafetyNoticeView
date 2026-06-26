/**
 * Thai AirAsia Data Table Web App
 * Frontend Logic
 */

let allData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    filterData(e.target.value);
  });
});

/**
 * Load data from GAS Backend
 */
function loadData() {
  google.script.run
    .withSuccessHandler(data => {
      if (data.error) {
        showError(data.error);
        return;
      }
      allData = data;
      renderTable(data);
    })
    .withFailureHandler(err => {
      showError(err.message);
    })
    .getSheetData();
}

/**
 * Render Table
 */
function renderTable(data) {
  const container = document.getElementById('table-body');
  const loader = document.getElementById('loader');
  
  if (loader) loader.style.display = 'none';
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<tr><td colspan="100%" style="text-align:center; padding: 40px;">No data found</td></tr>';
    return;
  }

  data.forEach(row => {
    const tr = document.createElement('tr');
    
    // Find PDF link field (heuristics: contains 'http' and '.pdf' or drive link)
    let pdfUrl = '';
    let pdfKey = '';
    
    for (const key in row) {
      const val = String(row[key]);
      if (val.includes('http') && (val.toLowerCase().includes('pdf') || val.includes('drive.google.com'))) {
        pdfUrl = val;
        pdfKey = key;
        break;
      }
    }

    // Build columns
    Object.keys(row).forEach(key => {
      const td = document.createElement('td');
      let content = row[key];

      if (key === pdfKey && pdfUrl) {
        td.innerHTML = `
          <a href="${pdfUrl}" target="_blank" class="pdf-link" 
             onmouseover="showPreview(event, '${pdfUrl}')" 
             onmouseout="hidePreview()">
            <svg class="pdf-icon" viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM14 11h1v-2.5h-1V11zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>
            View PDF
          </a>
        `;
      } else {
        td.textContent = content;
      }
      tr.appendChild(td);
    });
    
    container.appendChild(tr);
  });
}

/**
 * Filter Data
 */
function filterData(query) {
  const filtered = allData.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(query.toLowerCase())
    );
  });
  renderTable(filtered);
}

/**
 * PDF Preview Logic
 */
function showPreview(event, url) {
  const preview = document.getElementById('pdf-preview');
  const iframe = preview.querySelector('iframe');
  
  // Transform Drive URL for preview if needed
  let previewUrl = url;
  if (url.includes('drive.google.com')) {
    previewUrl = url.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');
  }

  iframe.src = previewUrl;
  preview.style.display = 'block';
  
  updatePreviewPosition(event);
}

function updatePreviewPosition(event) {
  const preview = document.getElementById('pdf-preview');
  const x = event.clientX + 20;
  const y = event.clientY - 250;
  
  // Keep within viewport
  const maxX = window.innerWidth - preview.offsetWidth - 20;
  const maxY = window.innerHeight - preview.offsetHeight - 20;
  
  preview.style.left = Math.min(x, maxX) + 'px';
  preview.style.top = Math.max(20, Math.min(y, maxY)) + 'px';
}

function hidePreview() {
  const preview = document.getElementById('pdf-preview');
  preview.style.display = 'none';
  preview.querySelector('iframe').src = '';
}

function showError(msg) {
  const container = document.getElementById('table-body');
  container.innerHTML = `<tr><td colspan="100%" style="text-align:center; padding: 40px; color: var(--airasia-red);">Error: ${msg}</td></tr>`;
}
