/**
 * DriveEase - Premium Car Rental Marketplace
 * User Profile, My Bookings & Wishlist Management
 */

function initProfilePage() {
  const user = getCurrentUser();

  // If user is not logged in, prompt or redirect to login
  if (!user) {
    showToast("Please log in to access your profile.", "info");
    setTimeout(() => {
      window.location.href = "login.html?redirect=profile.html";
    }, 1200);
    return;
  }

  // 1. Populate Profile Header
  populateProfileHeader(user);

  // 2. Setup Profile Navigation Tabs
  setupProfileTabs();

  // 3. Render Bookings
  renderProfileBookings();

  // 4. Render Saved Favorites
  renderProfileFavorites();

  // 5. Setup Edit Profile Form
  setupEditProfileForm(user);
}

// Populate Header Information
function populateProfileHeader(user) {
  const nameEl = document.getElementById("profileUserName");
  const emailEl = document.getElementById("profileUserEmail");
  const phoneEl = document.getElementById("profileUserPhone");
  const avatarEl = document.getElementById("profileUserAvatar");
  const memberSinceEl = document.getElementById("profileMemberSince");
  const totalBookingsBadge = document.getElementById("profileTotalBookingsCount");
  const totalFavsBadge = document.getElementById("profileTotalFavsCount");

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (phoneEl) phoneEl.textContent = user.phone || "+91 98765 43210";
  if (memberSinceEl) memberSinceEl.textContent = `Member since ${user.memberSince || "2025"}`;

  if (avatarEl) {
    const initials = user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    avatarEl.textContent = initials;
  }

  // Count badges
  const bookings = JSON.parse(localStorage.getItem("driveease_bookings")) || [];
  const favs = getFavorites();

  if (totalBookingsBadge) totalBookingsBadge.textContent = bookings.length;
  if (totalFavsBadge) totalFavsBadge.textContent = favs.length;
}

// Handle Profile Tab Switching & URL deep linking
function setupProfileTabs() {
  const tabButtons = document.querySelectorAll(".profile-nav-link");
  const tabPanes = document.querySelectorAll(".profile-tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab-target");
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add("active");
    });
  });

  // Check URL param ?tab=bookings or ?tab=favorites
  const tabParam = getQueryParam("tab");
  if (tabParam) {
    const targetBtn = document.querySelector(`[data-tab-target="tab-${tabParam}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }
}

// Render "My Bookings" List
function renderProfileBookings() {
  const container = document.getElementById("profileBookingsContainer");
  if (!container) return;

  const bookings = JSON.parse(localStorage.getItem("driveease_bookings")) || [];

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-results-box my-3">
        <div class="empty-icon-circle"><i class="bi bi-calendar2-x"></i></div>
        <h3>No bookings yet</h3>
        <p>You haven't made any car reservations yet. Explore our premier fleet and book your first journey!</p>
        <a href="cars.html" class="btn-drive-lime"><i class="bi bi-compass"></i> Explore Cars</a>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings
    .map(
      (b, idx) => `
      <div class="booking-history-card">
        <div class="booking-card-top">
          <div class="d-flex align-items-center gap-3 flex-wrap">
            <span class="booking-ref-badge">${b.id}</span>
            <span class="badge-soft-success py-1 px-3 rounded-pill text-xs fw-bold">
              <i class="bi bi-patch-check-fill me-1"></i> ${b.status}
            </span>
          </div>
          <div class="text-muted small">
            Booked on: ${new Date(b.bookedAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        <div class="booking-card-main">
          <img 
            src="${b.image || 'assets/images/placeholder-car.jpg'}" 
            alt="${b.carName}" 
            class="booking-vehicle-thumb"
            onerror="handleImageError(this, 'assets/images/placeholder-car.jpg')" 
          />
          <div class="booking-vehicle-meta">
            <span class="badge bg-light text-dark text-uppercase fw-bold text-xs mb-1">${b.category || 'SUV'}</span>
            <h4 class="mb-1 fw-bold">${b.carName}</h4>
            <div class="booking-dates-summary">
              <i class="bi bi-calendar3 text-success"></i>
              <span>${b.pickupDate} &rarr; ${b.returnDate} (${b.days} Days)</span>
            </div>
            <div class="booking-loc-summary">
              <i class="bi bi-geo-alt-fill text-muted"></i>
              <span>Pickup: ${b.pickupLocation}</span>
            </div>
          </div>
          <div class="booking-price-col ms-md-auto text-md-end mt-3 mt-md-0">
            <span class="text-muted text-xs d-block">Total Paid (Demo)</span>
            <h3 class="fw-bold mb-1 text-primary">${formatINR(b.totalAmount)}</h3>
            <span class="badge bg-light text-secondary border">${b.paymentMethod}</span>
          </div>
        </div>

        <div class="booking-card-actions">
          <button class="btn-drive-outline btn-sm-custom" onclick="openVoucherModal('${b.id}')">
            <i class="bi bi-receipt"></i> View Voucher
          </button>
          <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="cancelDemoBooking('${b.id}')">
            <i class="bi bi-x-circle"></i> Cancel
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

// Render "Saved Favorites" Grid
function renderProfileFavorites() {
  const container = document.getElementById("profileFavoritesContainer");
  if (!container) return;

  const favIds = getFavorites();
  const favoriteCars = CARS_DATABASE.filter(c => favIds.includes(c.id));

  // Update counter badge
  const favBadge = document.getElementById("profileTotalFavsCount");
  if (favBadge) favBadge.textContent = favoriteCars.length;

  if (favoriteCars.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-results-box my-3">
          <div class="empty-icon-circle"><i class="bi bi-heartbreak"></i></div>
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite luxury, SUV, or daily driver vehicles to review or book them anytime.</p>
          <a href="cars.html" class="btn-drive-lime"><i class="bi bi-search"></i> Discover Cars</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = favoriteCars
    .map(car => generateCarCardHtml(car, "col-md-6 col-lg-4 mb-4"))
    .join("");
}

// Open Voucher Modal from Booking History
function openVoucherModal(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("driveease_bookings")) || [];
  const b = bookings.find(item => item.id === bookingId);
  if (!b) return;

  const modalEl = document.getElementById("bookingSuccessModal");
  if (!modalEl) return;

  document.getElementById("voucherBookingId").textContent = b.id;
  document.getElementById("voucherCarName").textContent = b.carName;
  document.getElementById("voucherDates").textContent = `${b.pickupDate} to ${b.returnDate} (${b.days} Days)`;
  document.getElementById("voucherPickup").textContent = b.pickupLocation;
  document.getElementById("voucherTotal").textContent = formatINR(b.totalAmount);
  document.getElementById("voucherPayment").textContent = b.paymentMethod;

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// Cancel Booking
function cancelDemoBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  let bookings = JSON.parse(localStorage.getItem("driveease_bookings")) || [];
  bookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem("driveease_bookings", JSON.stringify(bookings));

  showToast("Booking cancelled successfully.", "info");
  renderProfileBookings();

  const totalBadge = document.getElementById("profileTotalBookingsCount");
  if (totalBadge) totalBadge.textContent = bookings.length;
}

// Setup Profile Edit Form
function setupEditProfileForm(user) {
  const form = document.getElementById("profileEditForm");
  if (!form) return;

  const nameInput = document.getElementById("editFullName");
  const emailInput = document.getElementById("editEmail");
  const phoneInput = document.getElementById("editPhone");
  const cityInput = document.getElementById("editCity");

  if (nameInput) nameInput.value = user.name || "";
  if (emailInput) emailInput.value = user.email || "";
  if (phoneInput) phoneInput.value = user.phone || "";
  if (cityInput) cityInput.value = user.city || "Bangalore";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    user.name = nameInput.value.trim();
    user.email = emailInput.value.trim();
    user.phone = phoneInput.value.trim();
    user.city = cityInput.value.trim();

    setCurrentUser(user);
    populateProfileHeader(user);
    showToast("Profile details updated successfully!", "success");
  });
}

document.addEventListener("DOMContentLoaded", initProfilePage);
