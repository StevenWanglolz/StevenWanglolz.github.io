// Dashboard - Backend Authentication Version
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Dashboard loaded');
  
  // Security: Check authentication first
  if (!window.authService.isUserAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    window.location.href = '/index.html';
    return;
  }

  // Verify authentication
  const verification = await window.authService.verifyToken();
  if (!verification.success) {
    console.log('Authentication verification failed, redirecting to login');
    window.location.href = '/index.html';
    return;
  }

  console.log('User authenticated:', verification.user.username);
  
  // DOM Elements
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  const userName = document.getElementById('userName');
  
  // AI Generation elements
  const generationPrompt = document.getElementById('generationPrompt');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultContent = document.getElementById('resultContent');
  
  // AI Sampling elements
  const imageUpload = document.getElementById('imageUpload');
  const uploadBox = document.getElementById('uploadBox');
  const uploadedImages = document.getElementById('uploadedImages');
  const imageList = document.getElementById('imageList');
  const samplingPrompt = document.getElementById('samplingPrompt');
  const generateSamplingBtn = document.getElementById('generateSamplingBtn');
  const downloadSamplingBtn = document.getElementById('downloadSamplingBtn');
  const samplingResultPlaceholder = document.getElementById('samplingResultPlaceholder');
  const samplingResultContent = document.getElementById('samplingResultContent');

  // Generation Records elements
  const recordsSearch = document.getElementById('recordsSearch');
  const recordsTypeFilter = document.getElementById('recordsTypeFilter');
  const recordsDateFilter = document.getElementById('recordsDateFilter');
  const recordsList = document.getElementById('recordsList');
  const recordsPagination = document.getElementById('recordsPagination');

  // Generation Modal elements
  const generationModalOverlay = document.getElementById('generationModalOverlay');
  const generationModalClose = document.getElementById('generationModalClose');
  const closeGenerationModalBtn = document.getElementById('closeGenerationModalBtn');
  const copyGenerationBtn = document.getElementById('copyGenerationBtn');
  const modalPrompt = document.getElementById('modalPrompt');
  const modalResult = document.getElementById('modalResult');
  const modalType = document.getElementById('modalType');
  const modalTime = document.getElementById('modalTime');
  const modalStatus = document.getElementById('modalStatus');

  // Generation records storage
  let generationRecords = [];
  const RECORDS_PER_PAGE = 5;
  let currentRecordsPage = 1;

  // Initialize dashboard
  initializeDashboard();
  
  // Event Listeners
  navItems.forEach(item => {
    item.addEventListener('click', handleTabSwitch);
  });
  
  userMenuBtn.addEventListener('click', toggleUserMenu);
  
  // Close user menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!userMenuBtn.contains(event.target) && !userDropdown.contains(event.target)) {
      userDropdown.hidden = true;
    }
  });
  
  // AI Generation events
  generateBtn.addEventListener('click', handleGeneration);
  copyBtn.addEventListener('click', copyResult);
  downloadBtn.addEventListener('click', downloadResult);
  
  // AI Sampling events
  uploadBox.addEventListener('click', () => imageUpload.click());
  imageUpload.addEventListener('change', handleImageUpload);
  generateSamplingBtn.addEventListener('click', handleSamplingGeneration);
  downloadSamplingBtn.addEventListener('click', downloadSamplingResult);

  // Generation Records events
  recordsSearch.addEventListener('input', filterRecords);
  recordsTypeFilter.addEventListener('change', filterRecords);
  recordsDateFilter.addEventListener('change', filterRecords);

  // Generation Modal events
  generationModalClose.addEventListener('click', closeGenerationModal);
  closeGenerationModalBtn.addEventListener('click', closeGenerationModal);
  copyGenerationBtn.addEventListener('click', copyGenerationContent);

  // Close generation modal when clicking outside
  generationModalOverlay.addEventListener('click', function(event) {
    if (event.target === generationModalOverlay) {
      closeGenerationModal();
    }
  });
  
  // Initialize dashboard
  function initializeDashboard() {
    console.log('Initializing dashboard...');
    
    // Set user name from localStorage or default
    const storedUsername = localStorage.getItem('currentUser') || '管理員';
    userName.textContent = storedUsername;

    // Set active tab to AI generation by default
    switchTab('ai-generation');
    
    // Load existing generation records after a short delay
    setTimeout(() => {
      loadGenerationRecords();
    }, 100);
    
    console.log('Dashboard initialization complete');
  }
  
  // Handle tab switching
  function handleTabSwitch(event) {
    event.preventDefault();
    const targetTab = event.currentTarget.dataset.tab;
    switchTab(targetTab);
  }
  
  // Switch to specific tab
  function switchTab(tabName) {
    // Update navigation
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      }
    });
    
    // Update content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === `${tabName}-tab`) {
        content.classList.add('active');
      }
    });

    // If switching to generation records tab, refresh the display
    if (tabName === 'generation-records') {
      displayRecords();
    }
  }
  
  // Toggle user menu
  function toggleUserMenu() {
    userDropdown.hidden = !userDropdown.hidden;
  }
  
  // Show temporary message
  function showTempMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `temp-message temp-message-${type}`;
    messageEl.textContent = message;
    
    // Style the message
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 15px 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      font-size: 14px;
      color: #333;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      max-width: 300px;
    `;
    
    // Add type-specific styling
    if (type === 'error') {
      messageEl.style.borderColor = '#dc3545';
      messageEl.style.color = '#dc3545';
    } else if (type === 'success') {
      messageEl.style.borderColor = '#28a745';
      messageEl.style.color = '#28a745';
    }
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
      messageEl.style.opacity = '1';
      messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (messageEl.parentElement) {
          messageEl.parentElement.removeChild(messageEl);
        }
      }, 300);
    }, 3000);
  }
  
  // Detect if prompt is for image generation
  function isImagePrompt(prompt) {
    const imageKeywords = [
      '圖片', '圖像', '照片', '繪圖', '畫', '設計', '海報', '標誌', '圖標',
      'image', 'picture', 'photo', 'drawing', 'design', 'poster', 'logo', 'icon',
      '生成圖片', '創建圖片', '製作圖片', '產生圖片'
    ];
    
    return imageKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  // Handle AI Generation
  function handleGeneration() {
    const prompt = generationPrompt.value.trim();
    
    if (!prompt) {
      showTempMessage('請輸入提示詞', 'error');
      return;
    }
    
    // Show loading state
    generateBtn.textContent = '生成中...';
    generateBtn.disabled = true;
    
    // Simulate generation process
    setTimeout(() => {
      try {
        // Detect prompt type and generate accordingly
        const isImage = isImagePrompt(prompt);
        
        if (isImage) {
          // Generate image result
          const imageUrl = `https://via.placeholder.com/400x300/007bff/ffffff?text=AI+Generated+Image`;
          resultContent.innerHTML = `
            <img src="${imageUrl}" alt="AI Generated Image">
            <p><strong>圖片生成完成：</strong>基於您的提示詞「${prompt}」</p>
          `;
          copyBtn.style.display = 'none';
          downloadBtn.style.display = 'inline-block';
        } else {
          // Generate text result
          const generatedText = `基於您的提示詞「${prompt}」，AI 生成了以下內容：\n\n這是一個示例生成的文字內容。在實際應用中，這裡會顯示 AI 根據您的提示詞生成的具體內容。\n\n您可以複製這段文字到剪貼簿，或者根據需要進行編輯。`;
          
          resultContent.innerHTML = `<p style="white-space: pre-line;">${generatedText}</p>`;
          copyBtn.style.display = 'inline-block';
          downloadBtn.style.display = 'none';
        }
        
        // Show result
        resultPlaceholder.style.display = 'none';
        resultContent.style.display = 'block';

        // Save to generation records
        saveGenerationRecord({
          type: isImage ? 'image' : 'text',
          prompt: prompt,
          result: isImage ? resultContent.innerHTML : generatedText,
          timestamp: new Date().toISOString()
        });

        // Show success message
        showTempMessage(`已生成${isImage ? '圖片' : '文字'}內容`, 'success');
      } catch (error) {
        console.error('Generation error:', error);
        // showTempMessage('生成過程中發生錯誤', 'error');
      } finally {
        // Always reset button regardless of success or error
        generateBtn.textContent = '生成';
        generateBtn.disabled = false;
      }
    }, 2000);
  }
  
  // Copy result to clipboard
  function copyResult() {
    const text = resultContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showTempMessage('已複製到剪貼簿', 'success');
    }).catch(() => {
      showTempMessage('複製失敗，請手動選擇文字', 'error');
    });
  }
  
  // Download result
  function downloadResult() {
    const img = resultContent.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = 'ai-generated-image.png';
      link.click();
      showTempMessage('圖片下載已開始', 'success');
    }
  }
  
  // Handle image upload
  function handleImageUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
      uploadedImages.style.display = 'block';
      
      // Clear previous images
      imageList.innerHTML = '';
      
      // Display uploaded images
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageItem = document.createElement('div');
          imageItem.className = 'image-item';
          imageItem.innerHTML = `
            <img src="${e.target.result}" alt="Uploaded Image ${index + 1}">
            <div class="image-info">
              <p class="image-name">圖片 ${index + 1}</p>
              <p class="image-size">${formatFileSize(file.size)}</p>
            </div>
            <button class="remove-image" data-index="${index}" title="移除圖片">×</button>
          `;
          imageList.appendChild(imageItem);
          
          // Add remove functionality
          const removeBtn = imageItem.querySelector('.remove-image');
          removeBtn.addEventListener('click', function() {
            removeImage(index);
          });
        };
        reader.readAsDataURL(file);
      });
      
      showTempMessage(`已上傳 ${files.length} 張圖片`, 'success');
    }
  }
  
  // Remove specific image
  function removeImage(index) {
    const imageItems = imageList.querySelectorAll('.image-item');
    if (imageItems[index]) {
      imageItems[index].remove();
      
      // Update remaining image numbers
      const remainingItems = imageList.querySelectorAll('.image-item');
      remainingItems.forEach((item, newIndex) => {
        const nameEl = item.querySelector('.image-name');
        const removeBtn = item.querySelector('.remove-image');
        if (nameEl) nameEl.textContent = `圖片 ${newIndex + 1}`;
        if (removeBtn) removeBtn.dataset.index = newIndex;
      });
      
      // Hide uploaded images section if no images left
      if (remainingItems.length === 0) {
        uploadedImages.style.display = 'none';
      }
      
      showTempMessage('圖片已移除', 'info');
    }
  }
  
  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Handle sampling generation
  function handleSamplingGeneration() {
    const prompt = samplingPrompt.value.trim();
    const hasImages = imageList.children.length > 0;
    
    if (!prompt) {
      showTempMessage('請輸入打樣提示詞', 'error');
      return;
    }
    
    if (!hasImages) {
      showTempMessage('請先上傳圖片', 'error');
      return;
    }
    
    // Show loading state
    generateSamplingBtn.textContent = '生成中...';
    generateSamplingBtn.disabled = true;
    
    // Simulate generation process
    setTimeout(() => {
      try {
        // Generate sample result (placeholder image)
        const imageUrl = `https://via.placeholder.com/400x300/28a745/ffffff?text=Sampling+Result`;
        samplingResultContent.innerHTML = `
          <img src="${imageUrl}" alt="Sampling Result">
          <p><strong>打樣結果：</strong>基於您的提示詞「${prompt}」和上傳的圖片，AI 生成了打樣結果。</p>
        `;
        
        // Show result
        samplingResultPlaceholder.style.display = 'none';
        samplingResultContent.style.display = 'block';
        downloadSamplingBtn.style.display = 'inline-block';

        // Save to generation records
        saveGenerationRecord({
          type: 'sampling',
          prompt: prompt,
          result: samplingResultContent.innerHTML,
          timestamp: new Date().toISOString()
        });

        // Show success message
        showTempMessage('打樣結果生成完成', 'success');
      } catch (error) {
        console.error('Sampling generation error:', error);
        // showTempMessage('打樣生成過程中發生錯誤', 'error');
      } finally {
        // Always reset button regardless of success or error
        generateSamplingBtn.textContent = '生成打樣';
        generateSamplingBtn.disabled = false;
      }
    }, 2000);
  }
  
  // Download sampling result
  function downloadSamplingResult() {
    const img = samplingResultContent.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = 'sampling-result.png';
      link.click();
      showTempMessage('打樣結果下載已開始', 'success');
    }
  }

  // Generation Records Functions
  function loadGenerationRecords() {
    console.log('Loading generation records...');
    
    // Force refresh sample records to include sampling type
    const savedRecords = localStorage.getItem('generationRecords');
    if (savedRecords) {
      const existingRecords = JSON.parse(savedRecords);
      // Check if we have all three types (text, image, sampling)
      const hasText = existingRecords.some(record => record.type === 'text');
      const hasImage = existingRecords.some(record => record.type === 'image');
      const hasSampling = existingRecords.some(record => record.type === 'sampling');
      
      if (hasText && hasImage && hasSampling) {
        // All types present, use existing records
        generationRecords = existingRecords;
        console.log('Loaded saved records with all types:', generationRecords.length);
      } else {
        // Missing some types, create fresh sample records
        console.log('Missing some record types, creating fresh sample records');
        createSampleRecords();
      }
    } else {
      // No existing records, create sample records
      console.log('No existing records, creating sample records');
      createSampleRecords();
    }
    
    // Only display if we're on the records tab
    if (document.querySelector('#generation-records-tab').classList.contains('active')) {
      displayRecords();
    }
  }

  function createSampleRecords() {
    generationRecords = [
      {
        type: 'text',
        prompt: '寫一篇產品介紹文案',
        result: '基於您的需求，AI生成了以下產品介紹文案：\n\n產品特色：\n• 高品質材料製作\n• 精緻工藝設計\n• 多種顏色選擇\n• 環保無毒認證\n\n適用場景：\n適合各種室內裝飾需求，為您的空間增添美感。',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'image',
        prompt: '生成一張產品宣傳海報',
        result: '<img src="https://via.placeholder.com/400x300/007bff/ffffff?text=AI+Generated+Image" alt="AI Generated Image"><p><strong>圖片生成完成：</strong>基於您的提示詞「生成一張產品宣傳海報」</p>',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'sampling',
        prompt: '基於上傳的建材樣品圖片，生成多種不同風格的產品展示效果',
        result: '<img src="https://via.placeholder.com/400x300/28a745/ffffff?text=Sampling+Result" alt="Sampling Result"><p><strong>打樣結果：</strong>基於您的提示詞「基於上傳的建材樣品圖片，生成多種不同風格的產品展示效果」和上傳的圖片，AI 生成了打樣結果。</p>',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('generationRecords', JSON.stringify(generationRecords));
    console.log('Created fresh sample records with all types:', generationRecords.length);
  }

  function saveGenerationRecord(record) {
    generationRecords.unshift(record); // Add to beginning
    // Keep only last 50 records
    if (generationRecords.length > 50) {
      generationRecords = generationRecords.slice(0, 50);
    }
    localStorage.setItem('generationRecords', JSON.stringify(generationRecords));
    displayRecords();
  }

  function filterRecords() {
    const searchTerm = recordsSearch.value.toLowerCase();
    const typeFilter = recordsTypeFilter.value;
    const dateFilter = recordsDateFilter.value;

    let filteredRecords = generationRecords.filter(record => {
      const matchesSearch = !searchTerm ||
        record.prompt.toLowerCase().includes(searchTerm) ||
        record.result.toLowerCase().includes(searchTerm);

      const matchesType = !typeFilter || record.type === typeFilter;

      const matchesDate = !dateFilter || matchesDateFilter(record.timestamp, dateFilter);

      return matchesSearch && matchesType && matchesDate;
    });

    currentRecordsPage = 1;
    displayFilteredRecords(filteredRecords);
  }

  function matchesDateFilter(timestamp, filterType) {
    const recordDate = new Date(timestamp);
    const today = new Date();

    switch (filterType) {
      case 'today':
        return recordDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recordDate >= weekAgo;
      case 'month':
        return recordDate.getMonth() === today.getMonth() &&
               recordDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }

  function displayRecords() {
    console.log('Displaying records...', generationRecords.length);
    displayFilteredRecords(generationRecords);
  }

  function displayFilteredRecords(records) {
    console.log('Displaying filtered records...', records.length);
    console.log('Records list element:', recordsList);
    
    const startIndex = (currentRecordsPage - 1) * RECORDS_PER_PAGE;
    const endIndex = startIndex + RECORDS_PER_PAGE;
    const recordsToShow = records.slice(startIndex, endIndex);

    console.log('Records to show:', recordsToShow.length);

    if (!recordsList) {
      console.error('Records list element not found!');
      return;
    }

    recordsList.innerHTML = '';

    if (recordsToShow.length === 0) {
      recordsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">沒有找到相關記錄</div>';
      if (recordsPagination) {
        recordsPagination.innerHTML = '';
      }
      return;
    }

    recordsToShow.forEach((record, index) => {
      const recordItem = createRecordItem(record, startIndex + index);
      recordsList.appendChild(recordItem);
    });

    if (recordsPagination) {
      updateRecordsPagination(records.length);
    }
  }

  function createRecordItem(record, index) {
    const item = document.createElement('div');
    item.className = 'record-item';

    const timestamp = new Date(record.timestamp);
    const timeString = timestamp.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    let resultPreview = '';
    if (record.type === 'text') {
      resultPreview = `<div class="record-output text">${record.result}</div>`;
    } else if (record.type === 'image') {
      resultPreview = `<div class="record-output image"><img src="${record.result.match(/src="([^"]+)"/)?.[1]}" alt="Generated Image"></div>`;
    } else if (record.type === 'sampling') {
      resultPreview = `<div class="record-output image"><img src="${record.result.match(/src="([^"]+)"/)?.[1]}" alt="Sampling Result"></div>`;
    }

    item.innerHTML = `
      <div class="record-header">
        <span class="record-type ${record.type}">${
          record.type === 'text' ? '文字生成' :
          record.type === 'image' ? '圖片生成' :
          '打樣生成'
        }</span>
        <span class="record-time">${timeString}</span>
      </div>
      <div class="record-preview">
        <div class="record-prompt">${record.prompt}</div>
        ${resultPreview}
      </div>
      <div class="record-actions">
        <button class="btn btn-secondary" onclick="showRecordDetails(${index})">查看詳情</button>
      </div>
    `;

    return item;
  }

  function updateRecordsPagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);

    if (totalPages <= 1) {
      recordsPagination.innerHTML = '';
      return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `<button ${currentRecordsPage === 1 ? 'disabled' : ''} onclick="goToRecordsPage(${currentRecordsPage - 1})">上一頁</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentRecordsPage - 2 && i <= currentRecordsPage + 2)) {
        paginationHTML += `<button class="${i === currentRecordsPage ? 'active' : ''}" onclick="goToRecordsPage(${i})">${i}</button>`;
      } else if (i === currentRecordsPage - 3 || i === currentRecordsPage + 3) {
        paginationHTML += `<span>...</span>`;
      }
    }

    // Next button
    paginationHTML += `<button ${currentRecordsPage === totalPages ? 'disabled' : ''} onclick="goToRecordsPage(${currentRecordsPage + 1})">下一頁</button>`;

    recordsPagination.innerHTML = paginationHTML;
  }

  // Global functions for pagination buttons
  window.goToRecordsPage = function(page) {
    currentRecordsPage = page;
    filterRecords();
  };

  window.showRecordDetails = function(index) {
    const record = generationRecords[index];
    if (!record) return;

    modalPrompt.textContent = record.prompt;
    modalType.textContent = record.type === 'text' ? '文字生成' :
                           record.type === 'image' ? '圖片生成' : '打樣生成';
    modalTime.textContent = new Date(record.timestamp).toLocaleString('zh-TW');
    modalStatus.textContent = '完成';

    if (record.type === 'text') {
      modalResult.innerHTML = `<div class="result-content text">${record.result}</div>`;
      // For text content, show copy button
      copyGenerationBtn.textContent = '複製內容';
      copyGenerationBtn.onclick = copyGenerationContent;
      copyGenerationBtn.style.display = 'inline-block';
    } else {
      // For image content (image or sampling), show download button
      modalResult.innerHTML = record.result;
      copyGenerationBtn.textContent = '下載圖片';
      copyGenerationBtn.onclick = downloadGenerationImage;
      copyGenerationBtn.style.display = 'inline-block';
    }

    generationModalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };



  function closeGenerationModal() {
    generationModalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function copyGenerationContent() {
    const content = modalResult.textContent;
    navigator.clipboard.writeText(content).then(() => {
      copyGenerationBtn.textContent = '已複製！';
      copyGenerationBtn.style.background = '#28a745';
      copyGenerationBtn.style.color = 'white';

      setTimeout(() => {
        // Restore the original button text and functionality based on content type
        const recordType = modalType.textContent;
        if (recordType === '文字生成') {
          copyGenerationBtn.textContent = '複製內容';
          copyGenerationBtn.onclick = copyGenerationContent;
        } else {
          copyGenerationBtn.textContent = '下載圖片';
          copyGenerationBtn.onclick = downloadGenerationImage;
        }
        copyGenerationBtn.style.background = '';
        copyGenerationBtn.style.color = '';
      }, 2000);
    }).catch(() => {
      showTempMessage('複製失敗，請手動選擇文字', 'error');
    });
  }

  function downloadGenerationImage() {
    const img = modalResult.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.href = img.src;
      
      // Generate filename based on timestamp and type
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const type = modalType.textContent === '圖片生成' ? 'image' : 'sampling';
      link.download = `ai-generated-${type}-${timestamp}.png`;
      
      link.click();
      
      // Show success feedback on button
      copyGenerationBtn.textContent = '下載完成！';
      copyGenerationBtn.style.background = '#28a745';
      copyGenerationBtn.style.color = 'white';

      setTimeout(() => {
        // Restore the original button text and functionality
        const recordType = modalType.textContent;
        if (recordType === '文字生成') {
          copyGenerationBtn.textContent = '複製內容';
          copyGenerationBtn.onclick = copyGenerationContent;
        } else {
          copyGenerationBtn.textContent = '下載圖片';
          copyGenerationBtn.onclick = downloadGenerationImage;
        }
        copyGenerationBtn.style.background = '';
        copyGenerationBtn.style.color = '';
      }, 2000);
      
      showTempMessage('圖片下載已開始', 'success');
    } else {
      showTempMessage('找不到可下載的圖片', 'error');
    }
  }

  console.log('Dashboard initialization complete');
});

// Security Functions
function checkAuthentication() {
  try {
    const sessionData = sessionStorage.getItem('userSession');
    if (!sessionData) {
      console.log('No session data found');
      return false;
    }
    
    const session = JSON.parse(sessionData);
    
    // Check if session is valid
    if (!session.isAuthenticated || !session.sessionId) {
      console.log('Invalid session data');
      return false;
    }
    
    // Check session expiry (24 hours)
    const sessionAge = Date.now() - session.loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
      console.log('Session expired');
      sessionStorage.removeItem('userSession');
      return false;
    }
    
    console.log('User authenticated:', session.username);
    return true;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

async function logout() {
  // Logout from backend
  await window.authService.logout();
  
  // Redirect to login
  window.location.href = '/index.html';
}
