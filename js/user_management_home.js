// User Management Home - Clean Implementation
document.addEventListener('DOMContentLoaded', function() {
  console.log('User management page loaded');
  
  // DOM Elements
  const searchInput = document.getElementById('searchInput');
  const roleFilter = document.getElementById('roleFilter');
  const statusFilter = document.getElementById('statusFilter');
  const btnCreate = document.getElementById('btnCreate');
  const userTableBody = document.getElementById('userTableBody');
  const tableInfo = document.getElementById('tableInfo');
  
  // Modal Elements
  const modalOverlay = document.getElementById('modalOverlay');
  const userModal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const btnClose = document.getElementById('btnClose');
    const btnCancel = document.getElementById('btnCancel');
    const btnSave = document.getElementById('btnSave');
  const userForm = document.getElementById('userForm');
  const formMessage = document.getElementById('formMessage');
  
  // Form Elements
  const nameInput = document.getElementById('nameInput');
  const accountInput = document.getElementById('accountInput');
  const passwordInput = document.getElementById('passwordInput');
  const roleSelect = document.getElementById('roleSelect');
  const statusSelect = document.getElementById('statusSelect');
  const forceChangeCheckbox = document.getElementById('forceChange');
  
  // State
  let currentMode = 'create'; // 'create' or 'edit'
  let currentEditData = null;
  
  // Initialize
  initializePage();
  
  // Event Listeners
  searchInput.addEventListener('input', filterUsers);
  roleFilter.addEventListener('change', filterUsers);
  statusFilter.addEventListener('change', filterUsers);
  btnCreate.addEventListener('click', openCreateModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  btnSave.addEventListener('click', handleSave);
  
  // Add password validation
  passwordInput.addEventListener('input', validatePassword);
  
  // Event delegation for edit buttons and checkboxes
  userTableBody.addEventListener('click', function(event) {
    const target = event.target;

    // Handle edit button clicks (support clicks on child elements inside the button)
    const editBtn = target.closest('.btn-edit');
    if (editBtn) {
      event.preventDefault();
      console.log('Edit button clicked via delegation!');
      handleEdit(editBtn);
      return;
    }
  });
  
  // Initialize page
  function initializePage() {
    console.log('Initializing page...');
    console.log('Modal elements found:', { modalOverlay, userModal, modalTitle });
    
    // Update table info
    updateTableInfo();
    
  }
  
  // Filter users based on search and filters
  function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedRole = roleFilter.value;
    const selectedStatus = statusFilter.value;
    
    const rows = userTableBody.querySelectorAll('.table-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
      let shouldShow = true;
      
      // Filter by search term
      if (searchTerm) {
        const name = row.querySelector('[data-col="name"]').textContent.toLowerCase();
        const account = row.querySelector('[data-col="account"]').textContent.toLowerCase();
        
        if (!name.includes(searchTerm) && !account.includes(searchTerm)) {
          shouldShow = false;
        }
      }
      
      // Filter by role
      if (selectedRole && row.dataset.role !== selectedRole) {
        shouldShow = false;
      }
      
      // Filter by status
      if (selectedStatus && row.dataset.status !== selectedStatus) {
        shouldShow = false;
      }
      
      // Show/hide row
      row.style.display = shouldShow ? '' : 'none';
      
      if (shouldShow) {
        visibleCount++;
      }
    });
    
    // Update table info
    updateTableInfo(visibleCount);
  }
  
  // Update table information
  function updateTableInfo(visibleCount = null) {
    const totalCount = userTableBody.querySelectorAll('.table-row').length;
    const count = visibleCount !== null ? visibleCount : totalCount;
    
    if (count === totalCount) {
      tableInfo.textContent = `共 ${totalCount} 筆資料`;
    } else {
      tableInfo.textContent = `顯示 ${count} 筆，共 ${totalCount} 筆資料`;
    }
  }
  
  // Open create user modal
  function openCreateModal() {
    console.log('Opening create modal...');
    currentMode = 'create';
    modalTitle.textContent = '新增使用者';
    
    // Reset form
    userForm.reset();
    
    // Clear password field and set proper placeholder for new users
    passwordInput.value = '';
    passwordInput.placeholder = '請輸入密碼';
    
    // Show modal
    showModal();
  }
  
  // Handle edit button click
  function handleEdit(btnOrElement) {
    console.log('Edit button clicked!');

    // Resolve the actual .btn-edit element
    const btn = btnOrElement && btnOrElement.closest ? btnOrElement.closest('.btn-edit') : null;
    if (!btn) {
      console.warn('Edit handler invoked without a valid .btn-edit element');
      return;
    }
    console.log('Button element:', btn);
    console.log('Button dataset:', btn.dataset);

    currentMode = 'edit';
    modalTitle.textContent = '編輯使用者';

    // Prefer data-* on button; gracefully fall back to table row cells
    const row = btn.closest('.table-row');
    const getText = (sel) => row?.querySelector(sel)?.textContent?.trim() || '';
    const getData = (key, fallbackSel) => (btn.dataset[key] ?? '').trim() || getText(fallbackSel);

    currentEditData = {
      name:    getData('name',    '[data-col="name"]'),
      account: getData('account', '[data-col="account"]'),
      role:    (btn.dataset.role    ?? '').trim() || row?.dataset.role    || getText('[data-col="role"]'),
      status:  (btn.dataset.status  ?? '').trim() || row?.dataset.status  || getText('[data-col="status"]'),
      forceChange: (btn.dataset.forceChange ?? '').toLowerCase() === 'true'
    };

    console.log('Resolved edit data:', currentEditData);

    // Populate form with user data
    populateForm(currentEditData);

    // Show modal
    console.log('About to show modal...');
    showModal();
  }
  
  // Populate form with user data
  function populateForm(userData) {
    console.log('Populating form with data:', userData);
    
    nameInput.value = userData.name;
    accountInput.value = userData.account;
    passwordInput.value = '••••••••'; // Show password placeholder in edit mode
    passwordInput.placeholder = '••••••••'; // Set placeholder for edit mode
    roleSelect.value = userData.role;
    statusSelect.value = userData.status;
    forceChangeCheckbox.checked = userData.forceChange;
    
    console.log('Form populated. Current values:');
    console.log('- Name:', nameInput.value);
    console.log('- Account:', accountInput.value);
    console.log('- Role:', roleSelect.value);
    console.log('- Status:', statusSelect.value);
  }
  
  // Show modal
  function showModal() {
    console.log('showModal called');
    console.log('Modal overlay before:', modalOverlay);
    console.log('User modal before:', userModal);
    
    modalOverlay.hidden = false;
    userModal.hidden = false;
    
    console.log('Modal overlay after:', modalOverlay);
    console.log('User modal after:', userModal);
    
    // Focus first input
    setTimeout(() => {
      nameInput.focus();
    }, 100);
    
    console.log('Modal should now be visible');
  }
  
  // Close modal
  function closeModal() {
    console.log('Closing modal...');
    modalOverlay.hidden = true;
    userModal.hidden = true;
    
    // Reset form
    userForm.reset();
    
    // Clear current edit data
    currentEditData = null;
    
    // Hide any messages
    formMessage.hidden = true;
  }
  
  // Handle save button click
  function handleSave() {
    console.log('Save button clicked. Mode:', currentMode);
    
    // Basic validation
    if (!nameInput.value.trim() || !accountInput.value.trim() || !passwordInput.value.trim() || !roleSelect.value || !statusSelect.value) {
      showFormMessage('請填寫所有必填欄位', 'error');
      return;
    }
    
    // Password validation
    const password = passwordInput.value;
    if (password.length < 8) {
      showFormMessage('密碼長度至少需要 8 個字元', 'error');
      return;
    }
    
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      showFormMessage('密碼需要包含英文字母和數字', 'error');
      return;
    }
    
    // Show loading state
    btnSave.disabled = true;
    btnSave.textContent = '儲存中...';
    
    // Simulate save operation
    setTimeout(() => {
      if (currentMode === 'create') {
        // Simulate creating new user
        console.log('Creating new user:', {
          name: nameInput.value,
          account: accountInput.value,
          password: passwordInput.value, // Include password in log
          role: roleSelect.value,
          status: statusSelect.value,
          forceChange: forceChangeCheckbox.checked
        });
        
        showFormMessage('使用者建立成功！', 'success');
      } else {
        // Simulate updating user
        console.log('Updating user:', {
          name: nameInput.value,
          account: accountInput.value,
          password: passwordInput.value, // Include password in log
          role: roleSelect.value,
          status: statusSelect.value,
          forceChange: forceChangeCheckbox.checked
        });
        
        showFormMessage('使用者更新成功！', 'success');
      }
      
      // Reset button state
      btnSave.disabled = false;
      btnSave.textContent = '儲存';
      
      // Close modal after success
      setTimeout(() => {
        closeModal();
      }, 1500);
    }, 1000);
  }
  
  // Show form message
  function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message message-${type}`;
    formMessage.hidden = false;
  }
  
  // Add password validation functions
  function validatePassword() {
    const password = passwordInput.value;
    
    // Update requirement indicators
    updateRequirement('length', password.length >= 8);
    updateRequirement('alphanumeric', /[a-zA-Z]/.test(password) && /[0-9]/.test(password));
  }
  
  function updateRequirement(requirement, isValid) {
    const reqElement = document.querySelector(`[data-requirement="${requirement}"]`);
    if (reqElement) {
      reqElement.style.color = isValid ? '#28a745' : '#dc3545';
      reqElement.style.fontWeight = isValid ? 'bold' : 'normal';
    }
  }
  

  
  console.log('User management initialization complete');
});