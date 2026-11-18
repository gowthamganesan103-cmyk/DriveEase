/**
 * DriveEase - Premium Car Rental Marketplace
 * Authentication Engine (Login, Registration, Password Toggle, Validation & Demo Google UI)
 */

function initAuth() {
  // Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll(".btn-toggle-password");
  togglePassBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = btn.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
      }
    });
  });

  // Demo Google Login Buttons
  const googleBtns = document.querySelectorAll(".btn-google-auth");
  googleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const demoGoogleUser = {
        id: "usr_google_99",
        name: "Devon Lane",
        email: "devon.lane@gmail.com",
        phone: "+91 94432 10987",
        city: "Chennai",
        memberSince: "November 2026",
        isLoggedIn: true,
        authProvider: "Google (Demo)"
      };
      setCurrentUser(demoGoogleUser);
      showToast("Signed in via Google Demo successfully!", "success");
      setTimeout(() => {
        const redirect = getQueryParam("redirect") || "cars.html";
        window.location.href = redirect;
      }, 1200);
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Registration Form Submission
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }
}

// Handle Login
function handleLoginSubmit(e) {
  e.preventDefault();

  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  const emailVal = emailInput.value.trim();
  const passVal = passInput.value.trim();

  let isValid = true;

  // Clear previous errors
  clearAuthErrors();

  if (!emailVal || !validateEmail(emailVal)) {
    showAuthError("loginEmailError", "Please enter a valid email address.");
    emailInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!passVal || passVal.length < 6) {
    showAuthError("loginPasswordError", "Password must be at least 6 characters.");
    passInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!isValid) return;

  // Check against stored accounts or authenticate as demo user
  const storedUser = JSON.parse(localStorage.getItem("driveease_user")) || {};

  // For frontend demo purposes: accept existing registered user or authenticate smoothly
  const userObj = {
    id: storedUser.id || "usr_demo_" + Math.floor(Math.random() * 9000 + 1000),
    name: storedUser.name && storedUser.email === emailVal ? storedUser.name : (emailVal.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase())),
    email: emailVal,
    phone: storedUser.phone || "+91 98765 43210",
    city: storedUser.city || "Bangalore",
    memberSince: storedUser.memberSince || "November 2026",
    isLoggedIn: true
  };

  setCurrentUser(userObj);
  showToast(`Welcome back, ${userObj.name}!`, "success");

  setTimeout(() => {
    const redirect = getQueryParam("redirect") || "cars.html";
    window.location.href = redirect;
  }, 1200);
}

// Handle Registration
function handleRegisterSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const phoneInput = document.getElementById("regPhone");
  const passInput = document.getElementById("regPassword");
  const confirmPassInput = document.getElementById("regConfirmPassword");
  const termsCheckbox = document.getElementById("regTerms");

  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const phoneVal = phoneInput.value.trim();
  const passVal = passInput.value.trim();
  const confirmPassVal = confirmPassInput.value.trim();

  let isValid = true;
  clearAuthErrors();

  if (!nameVal || nameVal.length < 2) {
    showAuthError("regNameError", "Please enter your full name.");
    nameInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!emailVal || !validateEmail(emailVal)) {
    showAuthError("regEmailError", "Please enter a valid email address.");
    emailInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!phoneVal || phoneVal.replace(/[^0-9]/g, "").length < 10) {
    showAuthError("regPhoneError", "Please enter a valid 10-digit phone number.");
    phoneInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!passVal || passVal.length < 6) {
    showAuthError("regPasswordError", "Password must be at least 6 characters.");
    passInput.classList.add("is-invalid");
    isValid = false;
  }

  if (passVal !== confirmPassVal) {
    showAuthError("regConfirmPasswordError", "Passwords do not match. Please re-enter.");
    confirmPassInput.classList.add("is-invalid");
    isValid = false;
  }

  if (!termsCheckbox.checked) {
    showAuthError("regTermsError", "You must agree to the Terms & Conditions.");
    isValid = false;
  }

  if (!isValid) return;

  // Create new user profile in LocalStorage
  const newUser = {
    id: "usr_" + Date.now(),
    name: nameVal,
    email: emailVal,
    phone: phoneVal,
    city: "Bangalore",
    memberSince: "November 2026",
    isLoggedIn: true
  };

  setCurrentUser(newUser);
  showToast("Account created successfully! Welcome to DriveEase.", "success");

  setTimeout(() => {
    window.location.href = "cars.html";
  }, 1200);
}

// Helper validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showAuthError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.classList.add("visible");
  }
}

function clearAuthErrors() {
  const errorEls = document.querySelectorAll(".auth-error-feedback");
  errorEls.forEach(el => {
    el.textContent = "";
    el.classList.remove("visible");
  });

  const inputs = document.querySelectorAll(".auth-input-control");
  inputs.forEach(input => input.classList.remove("is-invalid"));
}

document.addEventListener("DOMContentLoaded", initAuth);
