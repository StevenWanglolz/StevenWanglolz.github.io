// User Logs - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
  console.log('User logs page loaded');
  
  // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
  const dateFilter = document.getElementById('dateFilter');
  const logsBody = document.getElementById('logsBody');
  const pagination = document.getElementById('pagination');
  const tableInfo = document.getElementById('tableInfo');
  
  // Modal Elements
  const textModalOverlay = document.getElementById('textModalOverlay');
  const textModal = document.getElementById('textModal');
  const textModalClose = document.getElementById('textModalClose');
  const closeTextModalBtn = document.getElementById('closeTextModalBtn');
  const generatedTextContent = document.getElementById('generatedTextContent');
  const copyTextBtn = document.getElementById('copyTextBtn');
  
  // Constants
  const ROWS_PER_PAGE = 10;
  let currentPage = 1;
  let filteredRows = [];
  
  // Initialize page
  initializePage();
  
  // Event Listeners
  searchInput.addEventListener('input', filterLogs);
  typeFilter.addEventListener('click', filterLogs);
  dateFilter.addEventListener('click', filterLogs);
  
  // Modal event listeners
  textModalClose.addEventListener('click', closeTextModal);
  closeTextModalBtn.addEventListener('click', closeTextModal);
  copyTextBtn.addEventListener('click', copyGeneratedText);
  
  // Close modal when clicking outside
  textModalOverlay.addEventListener('click', function(event) {
    if (event.target === textModalOverlay) {
      closeTextModal();
    }
  });
  
  // Event delegation for text generation buttons
  logsBody.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('btn-text')) {
      event.preventDefault();
      showTextModal(target.dataset.text);
    }
  });
  
  // Initialize page
  function initializePage() {
    console.log('Initializing user logs page...');
    
    // Get all rows
    const allRows = logsBody.querySelectorAll('tr');
    filteredRows = Array.from(allRows);
    
    // Display first page
    displayCurrentPage();
    updatePagination();
    updateTableInfo();
  }
  
  // Filter logs based on search and filters
  function filterLogs() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeValue = typeFilter.value;
    const dateValue = dateFilter.value;
    
    const allRows = logsBody.querySelectorAll('tr');
    
    filteredRows = Array.from(allRows).filter(row => {
      const action = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
      const actor = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || '';
      const type = row.dataset.type || '';
      const time = row.querySelector('td:nth-child(1)')?.textContent || '';
      
      // Search filter
      const matchesSearch = !searchTerm || 
        action.includes(searchTerm) || 
        actor.includes(searchTerm);
      
      // Type filter
      const matchesType = !typeValue || type === typeValue;
      
      // Date filter (simplified)
      const matchesDate = !dateValue || matchesDateFilter(time, dateValue);
      
      return matchesSearch && matchesType && matchesDate;
    });
    
    // Reset to first page
    currentPage = 1;
    displayCurrentPage();
    updatePagination();
    updateTableInfo();
  }
  
  // Simple date filtering
  function matchesDateFilter(timeStr, filterType) {
    const today = new Date();
    const timeDate = new Date(timeStr.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3'));
    
    switch (filterType) {
      case 'today':
        return timeDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return timeDate >= weekAgo;
      case 'month':
        return timeDate.getMonth() === today.getMonth() && 
               timeDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }
  
  // Display current page
  function displayCurrentPage() {
    const allRows = logsBody.querySelectorAll('tr');
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    
    // Hide all rows
    allRows.forEach(row => row.style.display = 'none');
    
    // Show filtered rows for current page
    filteredRows.slice(startIndex, endIndex).forEach(row => {
      row.style.display = '';
    });
  }
  
  // Update pagination
  function updatePagination() {
    const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
    
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">上一頁</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        paginationHTML += `<span>...</span>`;
      }
    }
    
    // Next button
    paginationHTML += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">下一頁</button>`;
    
    pagination.innerHTML = paginationHTML;
  }
  
  // Go to specific page
  window.goToPage = function(page) {
    currentPage = page;
    displayCurrentPage();
    updatePagination();
    updateTableInfo();
  };
  
  // Update table info
  function updateTableInfo() {
    const totalRows = logsBody.querySelectorAll('tr').length;
    const filteredCount = filteredRows.length;
    const startRow = (currentPage - 1) * ROWS_PER_PAGE + 1;
    const endRow = Math.min(currentPage * ROWS_PER_PAGE, filteredCount);
    
    tableInfo.innerHTML = `
      顯示第 ${startRow}-${endRow} 筆，共 ${filteredCount} 筆記錄（總計 ${totalRows} 筆）
    `;
  }
  
  // Show text generation modal
  function showTextModal(text) {
    // Decode HTML entities
    const decodedText = text.replace(/&#10;/g, '\n');
    generatedTextContent.textContent = decodedText;
    textModalOverlay.style.display = 'flex';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  // Close text modal
  function closeTextModal() {
    textModalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  // Copy generated text to clipboard
  function copyGeneratedText() {
    const text = generatedTextContent.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback
      const originalText = copyTextBtn.textContent;
      copyTextBtn.textContent = '已複製！';
      copyTextBtn.style.background = '#28a745';
      copyTextBtn.style.color = 'white';
      
      setTimeout(() => {
        copyTextBtn.textContent = originalText;
        copyTextBtn.style.background = '';
        copyTextBtn.style.color = '';
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Show success feedback
      const originalText = copyTextBtn.textContent;
      copyTextBtn.textContent = '已複製！';
      copyTextBtn.style.background = '#28a745';
      copyTextBtn.style.color = 'white';
      
      setTimeout(() => {
        copyTextBtn.textContent = originalText;
        copyTextBtn.style.background = '';
        copyTextBtn.style.color = '';
      }, 2000);
    });
  }
  
  console.log('User logs initialization complete');
});