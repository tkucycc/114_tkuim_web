// 取得元素
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');

const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const interestGroup = document.getElementById('interest-group');
const termsInput = document.getElementById('terms');
const strengthBar = document.getElementById('strength-bar');

// --- localStorage key ----
const STORAGE_KEY = 'week07_signup_draft';

// 工具：顯示錯誤訊息 + 套 is-invalid
function setError(inputEl, msg) {
  // msg 顯示到 <p data-error-for="id">
  const id = inputEl.id;
  const errorP = document.querySelector(`[data-error-for="${id}"]`);
  if (errorP) {
    errorP.textContent = msg;
  }

  // Constraint Validation API
  inputEl.setCustomValidity(msg);

  // 外觀
  if (msg) {
    inputEl.classList.add('is-invalid');
  } else {
    inputEl.classList.remove('is-invalid');
  }
}

// 特殊一組(興趣 checkbox 群組 / terms 勾選) 沒有單一 inputEl
function setGroupError(groupName, msg) {
  const errorP = document.querySelector(`[data-error-for="${groupName}"]`);
  if (errorP) {
    errorP.textContent = msg;
  }
}

// ---------------- 驗證邏輯 ----------------

function validateFullname() {
  const v = fullnameInput.value.trim();
  if (!v) {
    setError(fullnameInput, '姓名為必填');
    return false;
  }
  setError(fullnameInput, '');
  return true;
}

function validateEmail() {
  const v = emailInput.value.trim();
  if (!v) {
    setError(emailInput, 'Email 為必填');
    return false;
  }

  // 粗略 email 格式檢查
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(v)) {
    setError(emailInput, 'Email 格式不正確');
    return false;
  }

  setError(emailInput, '');
  return true;
}

function validatePhone() {
  const v = phoneInput.value.trim();
  if (!v) {
    setError(phoneInput, '手機為必填');
    return false;
  }
  if (!/^[0-9]{10}$/.test(v)) {
    setError(phoneInput, '手機需為10碼數字');
    return false;
  }
  setError(phoneInput, '');
  return true;
}

function passwordStrengthLevel(pw) {
  // very naive: 長度 + 是否有數字 + 是否有英文
  const hasNum = /[0-9]/.test(pw);
  const hasAlpha = /[a-zA-Z]/.test(pw);
  if (pw.length >= 12 && hasNum && hasAlpha) return 'strong';
  if (pw.length >= 8 && hasNum && hasAlpha) return 'medium';
  if (pw.length > 0) return 'weak';
  return 'none';
}

function updateStrengthBar() {
  const pw = passwordInput.value;
  const level = passwordStrengthLevel(pw);

  strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

  switch (level) {
    case 'strong':
      strengthBar.textContent = '強度：強';
      strengthBar.classList.add('strength-strong');
      break;
    case 'medium':
      strengthBar.textContent = '強度：中';
      strengthBar.classList.add('strength-medium');
      break;
    case 'weak':
      strengthBar.textContent = '強度：弱';
      strengthBar.classList.add('strength-weak');
      break;
    default:
      strengthBar.textContent = '強度：尚未輸入';
      break;
  }
}

// 密碼規則：至少8碼，英數混合
function validatePassword() {
  const pw = passwordInput.value;
  if (!pw) {
    setError(passwordInput, '密碼為必填');
    return false;
  }
  if (pw.length < 8) {
    setError(passwordInput, '密碼至少需 8 碼');
    return false;
  }
  if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw)) {
    setError(passwordInput, '需英數混合');
    return false;
  }

  setError(passwordInput, '');
  return true;
}

function validateConfirm() {
  const pw = passwordInput.value;
  const c = confirmInput.value;
  if (!c) {
    setError(confirmInput, '請再次輸入密碼');
    return false;
  }
  if (pw !== c) {
    setError(confirmInput, '兩次密碼不一致');
    return false;
  }
  setError(confirmInput, '');
  return true;
}

// 至少勾 1 個興趣
function validateInterest() {
  const checked = interestGroup.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) {
    setGroupError('interest-group', '請至少選一個興趣');
    return false;
  }
  setGroupError('interest-group', '');
  return true;
}

// 條款必勾
function validateTerms() {
  if (!termsInput.checked) {
    setGroupError('terms', '必須同意服務條款');
    return false;
  }
  setGroupError('terms', '');
  return true;
}

// ---------------- 即時驗證事件 ----------------

// blur 後開始顯示錯誤
fullnameInput.addEventListener('blur', validateFullname);
emailInput.addEventListener('blur', validateEmail);
phoneInput.addEventListener('blur', validatePhone);
passwordInput.addEventListener('blur', () => { validatePassword(); updateStrengthBar(); });
confirmInput.addEventListener('blur', validateConfirm);

// input 期間如果本來有錯，立刻再檢查並更新錯誤訊息
fullnameInput.addEventListener('input', () => { if (fullnameInput.validationMessage) validateFullname(); saveDraft(); });
emailInput.addEventListener('input', () => { if (emailInput.validationMessage) validateEmail(); saveDraft(); });
phoneInput.addEventListener('input', () => { if (phoneInput.validationMessage) validatePhone(); saveDraft(); });

passwordInput.addEventListener('input', () => {
  if (passwordInput.validationMessage) validatePassword();
  updateStrengthBar();
  saveDraft();
});

confirmInput.addEventListener('input', () => {
  if (confirmInput.validationMessage) validateConfirm();
  saveDraft();
});

// 興趣群組用事件委派
interestGroup.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    validateInterest();
    saveDraft();
  }
});

// 條款
termsInput.addEventListener('change', () => {
  validateTerms();
  saveDraft();
});

// ---------------- 提交時整體檢查 ----------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let firstInvalid = null;

  const checks = [
    () => validateFullname() || (firstInvalid ??= fullnameInput),
    () => validateEmail()    || (firstInvalid ??= emailInput),
    () => validatePhone()    || (firstInvalid ??= phoneInput),
    () => validatePassword() || (firstInvalid ??= passwordInput),
    () => validateConfirm()  || (firstInvalid ??= confirmInput),
    () => validateInterest() || (firstInvalid ??= interestGroup.querySelector('input[type="checkbox"]')),
    () => validateTerms()    || (firstInvalid ??= termsInput),
  ];

  checks.forEach(fn => fn());

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // 模擬送出中 (防重送)
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  // 假裝送到伺服器
  await new Promise(res => setTimeout(res, 1000));

  alert('註冊成功！');

  // 清除 localStorage (資料已成功送出)
  localStorage.removeItem(STORAGE_KEY);

  // Reset form UI
  hardResetForm();
});

// ---------------- Reset 按鈕 ----------------
resetBtn.addEventListener('click', () => {
  hardResetForm();
  // 也清掉 localStorage
  localStorage.removeItem(STORAGE_KEY);
});

// 真正的重設：欄位、錯誤訊息、強度條、按鈕狀態
function hardResetForm() {
  form.reset();

  // 清錯誤訊息 & 樣式
  document.querySelectorAll('[data-error-for]').forEach(p => p.textContent = '');
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

  // 強度條回預設
  strengthBar.textContent = '強度：尚未輸入';
  strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

  // 按鈕恢復
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
}

// ---------------- localStorage 暫存/回填 (加分) ----------------
function saveDraft() {
  const data = {
    fullname: fullnameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    password: passwordInput.value,
    confirm: confirmInput.value,
    interests: Array.from(interestGroup.querySelectorAll('input[type="checkbox"]:checked')).map(
      c => c.value
    ),
    terms: termsInput.checked,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.fullname) fullnameInput.value = data.fullname;
    if (data.email) emailInput.value = data.email;
    if (data.phone) phoneInput.value = data.phone;
    if (data.password) passwordInput.value = data.password;
    if (data.confirm) confirmInput.value = data.confirm;

    if (Array.isArray(data.interests)) {
      data.interests.forEach((val) => {
        const box = interestGroup.querySelector(`input[value="${val}"]`);
        if (box) box.checked = true;
      });
    }

    termsInput.checked = !!data.terms;

    // 依照回填內容更新強度條
    updateStrengthBar();
  } catch (err) {
    console.warn('restoreDraft parse error', err);
  }
}

// 初始化：載入草稿
restoreDraft();
