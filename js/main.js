/**
 * DriveEase - Premium Car Rental Marketplace
 * Core Global Scripts (State, Auth Navbar, Favorites, Toast, Helpers)
 */

// Initialize Demo Data & User State if not present
(function initLocalStorage() {
  // Demo user bootstrap
  if (!localStorage.getItem("driveease_user")) {
    const demoUser = {
      id: "usr_101",
      name: "Alex Morgan",
      email: "alex.morgan@driveease.com",
      phone: "+91 98765 43210",
      city: "Bangalore",
      memberSince: "November 2025",
      isLoggedIn: true
    };
    localStorage.setItem("driveease_user", JSON.stringify(demoUser));
  }

  // Demo initial favorites
  if (!localStorage.getItem("driveease_favorites")) {
    const initialFavorites = [1, 8, 9]; // Creta, Thar, BMW 3 Series
    localStorage.setItem("driveease_favorites", JSON.stringify(initialFavorites));
  }

  // Demo initial bookings
  if (!localStorage.getItem("driveease_bookings")) {
    const initialBookings = [
      {
        id: "DE-2026-74910",
        carId: 1,
        carName: "Hyundai Creta SX(O)",
        carBrand: "Hyundai",
        category: "SUV",
        image: "assets/images/hyundai-creta.jpg",
        pickupLocation: "Chennai Airport (MAA)",
        returnLocation: "Chennai Airport (MAA)",
        pickupDate: "2026-11-20",
        pickupTime: "10:00 AM",
        returnDate: "2026-11-23",
        returnTime: "10:00 AM",
        days: 3,
        rate: 2499,
        baseAmount: 7497,
        insurance: 1497,
        tax: 450,
        discount: 0,
        totalAmount: 9444,
        paymentMethod: "Credit Card (Demo)",
        status: "Confirmed",
        bookedAt: "2026-11-15T10:30:00Z"
      }
    ];
    localStorage.setItem("driveease_bookings", JSON.stringify(initialBookings));
  }
})();

// Currency Formatter
function formatINR(amount) {
  if (isNaN(amount)) return "₹0";
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// URL Param Helper
function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

// User Helpers
function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("driveease_user"));
    return user && user.isLoggedIn ? user : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(userObj) {
  localStorage.setItem("driveease_user", JSON.stringify(userObj));
  renderNavbarAuthState();
}

function logoutUser() {
  const user = JSON.parse(localStorage.getItem("driveease_user")) || {};
  user.isLoggedIn = false;
  localStorage.setItem("driveease_user", JSON.stringify(user));
  showToast("Logged out successfully.", "info");
  renderNavbarAuthState();
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

// Favorites Wishlist Helpers
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("driveease_favorites")) || [];
  } catch (e) {
    return [];
  }
}

function isCarFavorite(carId) {
  const favs = getFavorites();
  return favs.includes(Number(carId));
}

function toggleFavorite(carId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const id = Number(carId);
  let favs = getFavorites();
  const index = favs.indexOf(id);
  let isNowFav = false;

  if (index > -1) {
    favs.splice(index, 1);
    showToast("Removed vehicle from your favorites.", "info");
  } else {
    favs.push(id);
    isNowFav = true;
    showToast("Saved vehicle to your favorites!", "success");
  }

  localStorage.setItem("driveease_favorites", JSON.stringify(favs));
  updateFavoriteBadges();

  // Update button UI if present on page
  const heartBtns = document.querySelectorAll(`[data-fav-id="${id}"]`);
  heartBtns.forEach(btn => {
    if (isNowFav) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // If on profile page and viewing favorites, trigger refresh
  if (typeof renderProfileFavorites === "function") {
    renderProfileFavorites();
  }
}

function updateFavoriteBadges() {
  const favs = getFavorites();
  const badges = document.querySelectorAll(".nav-wishlist-badge");
  badges.forEach(b => {
    b.textContent = favs.length;
    b.style.display = favs.length > 0 ? "flex" : "none";
  });
}

// Toast Notification Manager
function showToast(message, type = "success", duration = 3500) {
  let container = document.querySelector(".de-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "de-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `de-toast ${type}`;

  let iconClass = "bi-check-circle-fill";
  if (type === "error") iconClass = "bi-exclamation-triangle-fill";
  if (type === "info") iconClass = "bi-info-circle-fill";

  toast.innerHTML = `
    <i class="bi ${iconClass} de-toast-icon"></i>
    <div class="de-toast-message">${message}</div>
    <button class="de-toast-close" aria-label="Close">&times;</button>
  `;

  const closeBtn = toast.querySelector(".de-toast-close");
  closeBtn.addEventListener("click", () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// Image fallback handler
function handleImageError(imgEl, fallbackSrc) {
  imgEl.onerror = null;
  imgEl.src = fallbackSrc || "assets/images/placeholder-car.jpg";
}

// Global Navbar Render & Active Page Highlight
function renderNavbarAuthState() {
  const user = getCurrentUser();
  const authContainer = document.getElementById("navAuthContainer");
  if (!authContainer) return;

  if (user && user.isLoggedIn) {
    const initials = user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    authContainer.innerHTML = `
      <div class="dropdown">
        <button class="user-menu-btn dropdown-toggle" type="button" id="userMenuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <div class="user-avatar-sm">${initials}</div>
          <span>${user.name.split(" ")[0]}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2" aria-labelledby="userMenuDropdown" style="min-width: 210px; border-radius: 14px;">
          <li class="px-3 py-2 border-bottom mb-1">
            <p class="mb-0 fw-bold text-dark">${user.name}</p>
            <small class="text-muted">${user.email}</small>
          </li>
          <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="profile.html"><i class="bi bi-person-circle text-primary"></i> My Profile</a></li>
          <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="profile.html?tab=bookings"><i class="bi bi-calendar2-check text-success"></i> My Bookings</a></li>
          <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="profile.html?tab=favorites"><i class="bi bi-heart text-danger"></i> Saved Wishlist</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item py-2 text-danger d-flex align-items-center gap-2" href="#" onclick="logoutUser(); return false;"><i class="bi bi-box-arrow-right"></i> Log Out</a></li>
        </ul>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn-drive-outline btn-sm-custom">Log In</a>
      <a href="register.html" class="btn-drive-lime btn-sm-custom">Sign Up</a>
    `;
  }
}

// Highlight Current Page Nav Link
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const hrefLower = href.toLowerCase();

    if (
      (currentPath.endsWith("/") || currentPath.endsWith("index.html")) &&
      (hrefLower === "index.html" || hrefLower === "./" || hrefLower === "/")
    ) {
      link.classList.add("active");
    } else if (currentPath.includes(hrefLower) && hrefLower !== "index.html") {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Setup Scroll listener for Navbar
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".de-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  renderNavbarAuthState();
  highlightActiveNavLink();
  updateFavoriteBadges();
});
