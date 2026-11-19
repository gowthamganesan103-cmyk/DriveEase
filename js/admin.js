/**
 * DriveEase - Professional Admin Dashboard Engine
 * Full CRUD for Vehicles, Bookings, Users, Payments, Reviews & Interactive Charts
 */

// Global Chart Instances
let bookingTrendsChartInstance = null;
let revenueChartInstance = null;

// Auth Guard - Ensure only authenticated admins access
function checkAdminAuth() {
  const token = localStorage.getItem("driveease_admin_token");
  if (!token) {
    window.location.href = "admin-login.html";
    return false;
  }
  return true;
}

// Admin Logout
function logoutAdmin() {
  localStorage.removeItem("driveease_admin_token");
  localStorage.removeItem("driveease_admin_user");
  showToast("Logged out of Admin Portal.", "info");
  setTimeout(() => (window.location.href = "admin-login.html"), 800);
}

// ==========================================================================
// Central Admin Data Helpers (LocalStorage + Mock Sync)
// ==========================================================================

function getAdminCars() {
  let cars = JSON.parse(localStorage.getItem("driveease_admin_cars"));
  if (!cars || cars.length === 0) {
    // Bootstrap from CARS_DATABASE
    cars = CARS_DATABASE.map(c => ({
      ...c,
      regNumber: `TN-${String(c.id).padStart(2, '0')}-DE-${1000 + c.id * 147}`,
      status: c.isAvailable ? "Available" : "Rented",
      approvalStatus: "Approved"
    }));
    localStorage.setItem("driveease_admin_cars", JSON.stringify(cars));
  }
  return cars;
}

function saveAdminCars(cars) {
  localStorage.setItem("driveease_admin_cars", JSON.stringify(cars));
}

function getAdminBookings() {
  let bookings = JSON.parse(localStorage.getItem("driveease_bookings"));
  if (!bookings || bookings.length === 0) {
    bookings = [
      {
        id: "DE-2026-74910",
        carId: 1,
        carName: "Hyundai Creta SX(O)",
        carBrand: "Hyundai",
        category: "SUV",
        customerName: "Alex Morgan",
        customerEmail: "alex.morgan@driveease.com",
        customerPhone: "+91 98765 43210",
        pickupLocation: "Chennai Airport (MAA)",
        returnLocation: "Chennai Airport (MAA)",
        pickupDate: "2026-11-20",
        returnDate: "2026-11-23",
        days: 3,
        totalAmount: 9444,
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        status: "Confirmed",
        bookedAt: "2026-11-15T10:30:00Z"
      },
      {
        id: "DE-2026-88124",
        carId: 9,
        carName: "BMW 3 Series Gran Limousine",
        carBrand: "BMW",
        category: "Luxury",
        customerName: "Vikram Malhotra",
        customerEmail: "vikram.m@techventures.in",
        customerPhone: "+91 98840 55219",
        pickupLocation: "Bangalore Indiranagar Hub",
        returnLocation: "Bangalore Airport (BLR)",
        pickupDate: "2026-11-12",
        returnDate: "2026-11-15",
        days: 3,
        totalAmount: 22490,
        paymentMethod: "UPI / NetBanking",
        paymentStatus: "Paid",
        status: "Completed",
        bookedAt: "2026-11-10T14:20:00Z"
      },
      {
        id: "DE-2026-91304",
        carId: 8,
        carName: "Mahindra Thar LX 4x4",
        carBrand: "Mahindra",
        category: "SUV",
        customerName: "Karthik Rajan",
        customerEmail: "karthik.rajan@photos.in",
        customerPhone: "+91 98401 77652",
        pickupLocation: "Coimbatore Avinashi Road",
        returnLocation: "Coimbatore Avinashi Road",
        pickupDate: "2026-11-18",
        returnDate: "2026-11-22",
        days: 4,
        totalAmount: 15490,
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        status: "Active",
        bookedAt: "2026-11-16T09:15:00Z"
      },
      {
        id: "DE-2026-62198",
        carId: 5,
        carName: "Maruti Swift ZXi+",
        carBrand: "Maruti",
        category: "Hatchback",
        customerName: "Priya Sundaram",
        customerEmail: "priya.s@gmail.com",
        customerPhone: "+91 94432 10987",
        pickupLocation: "Salem Junction Hub",
        returnLocation: "Salem Junction Hub",
        pickupDate: "2026-11-05",
        returnDate: "2026-11-07",
        days: 2,
        totalAmount: 3498,
        paymentMethod: "Pay on Pickup",
        paymentStatus: "Paid",
        status: "Completed",
        bookedAt: "2026-11-03T11:00:00Z"
      }
    ];
    localStorage.setItem("driveease_bookings", JSON.stringify(bookings));
  }
  return bookings;
}

function saveAdminBookings(bookings) {
  localStorage.setItem("driveease_bookings", JSON.stringify(bookings));
}

function getAdminUsers() {
  let users = JSON.parse(localStorage.getItem("driveease_admin_users"));
  if (!users || users.length === 0) {
    users = [
      { id: "usr_101", name: "Alex Morgan", email: "alex.morgan@driveease.com", phone: "+91 98765 43210", city: "Bangalore", status: "Active", joined: "2025-11-10", totalBookings: 3 },
      { id: "usr_102", name: "Priya Sundaram", email: "priya.s@gmail.com", phone: "+91 94432 10987", city: "Chennai", status: "Active", joined: "2026-01-15", totalBookings: 2 },
      { id: "usr_103", name: "Vikram Malhotra", email: "vikram.m@techventures.in", phone: "+91 98840 55219", city: "Mumbai", status: "Active", joined: "2026-02-04", totalBookings: 4 },
      { id: "usr_104", name: "Ananya Sharma", email: "ananya.sharma@design.co", phone: "+91 97910 88321", city: "Chennai", status: "Active", joined: "2026-03-12", totalBookings: 1 },
      { id: "usr_105", name: "Karthik Rajan", email: "karthik.rajan@photos.in", phone: "+91 98401 77652", city: "Coimbatore", status: "Active", joined: "2026-04-20", totalBookings: 2 },
      { id: "usr_106", name: "Rohan Verma", email: "rohan.verma@corp.com", phone: "+91 98112 33445", city: "Hyderabad", status: "Blocked", joined: "2026-05-08", totalBookings: 0 }
    ];
    localStorage.setItem("driveease_admin_users", JSON.stringify(users));
  }
  return users;
}

function saveAdminUsers(users) {
  localStorage.setItem("driveease_admin_users", JSON.stringify(users));
}

function getAdminReviews() {
  let reviews = JSON.parse(localStorage.getItem("driveease_admin_reviews"));
  if (!reviews || reviews.length === 0) {
    reviews = [
      { id: "rev_1", customerName: "Ananya Sharma", carName: "Hyundai Creta SX(O)", rating: 5, date: "2026-11-10", comment: "Spotless car, timely airport handover, and very smooth drive.", status: "Approved" },
      { id: "rev_2", customerName: "Vikram Malhotra", carName: "BMW 3 Series Gran Limousine", rating: 5, date: "2026-11-12", comment: "Effortless executive rental in Bangalore. Pristine vehicle condition.", status: "Approved" },
      { id: "rev_3", customerName: "Karthik Rajan", carName: "Mahindra Thar LX 4x4", rating: 5, date: "2026-11-14", comment: "Took the Thar up the Western Ghats. Rugged beast performed flawlessly.", status: "Approved" },
      { id: "rev_4", customerName: "Priya Sundaram", carName: "Honda City 5th Gen ZX", rating: 4, date: "2026-11-16", comment: "Great comfortable sedan for family road trip to Salem.", status: "Approved" }
    ];
    localStorage.setItem("driveease_admin_reviews", JSON.stringify(reviews));
  }
  return reviews;
}

function saveAdminReviews(reviews) {
  localStorage.setItem("driveease_admin_reviews", JSON.stringify(reviews));
}

// ==========================================================================
// Dashboard App Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAdminAuth()) return;

  setupSidebarNavigation();
  loadAdminUserProfile();
  renderOverviewDashboard();
  renderCarsTable();
  renderBookingsTable();
  renderUsersTable();
  renderPaymentsTable();
  renderReviewsSection();
  setupCarModalHandlers();
  setupSettingsForm();
});

// Setup Tab / Sidebar Navigation
function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll(".admin-nav-link");
  const panes = document.querySelectorAll(".admin-section-pane");
  const heading = document.getElementById("adminPageTitle");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");

      navLinks.forEach(l => l.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      link.classList.add("active");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");

      // Update Topbar Title
      const titles = {
        "sec-overview": "Command Center Overview",
        "sec-cars": "Fleet & Vehicle Inventory",
        "sec-bookings": "Reservations & Booking Operations",
        "sec-users": "Registered User Directory",
        "sec-payments": "Payment & Transaction Ledger",
        "sec-reviews": "Customer Feedback & Ratings",
        "sec-settings": "Administrator Settings"
      };
      if (heading) heading.textContent = titles[targetId] || "Admin Portal";

      // Re-render relevant tables
      if (targetId === "sec-overview") renderOverviewDashboard();
      if (targetId === "sec-cars") renderCarsTable();
      if (targetId === "sec-bookings") renderBookingsTable();
      if (targetId === "sec-users") renderUsersTable();
      if (targetId === "sec-payments") renderPaymentsTable();
      if (targetId === "sec-reviews") renderReviewsSection();

      // Mobile close sidebar
      document.querySelector(".admin-sidebar")?.classList.remove("mobile-open");
    });
  });

  // Mobile toggle
  const toggleBtn = document.getElementById("btnMobileSidebarToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.querySelector(".admin-sidebar")?.classList.toggle("mobile-open");
    });
  }
}

// Load Admin Profile Details
function loadAdminUserProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("driveease_admin_user")) || {
      name: "Chief Fleet Admin",
      email: "admin@driveease.com",
      role: "Super Admin",
      avatar: "AD"
    };

    const nameEls = document.querySelectorAll(".admin-display-name");
    const roleEls = document.querySelectorAll(".admin-display-role");
    const emailEls = document.querySelectorAll(".admin-display-email");
    const avatarEls = document.querySelectorAll(".admin-display-avatar");

    nameEls.forEach(el => (el.textContent = user.name));
    roleEls.forEach(el => (el.textContent = user.role));
    emailEls.forEach(el => (el.textContent = user.email));
    avatarEls.forEach(el => (el.textContent = user.avatar || "AD"));
  } catch (e) {}
}

// ==========================================================================
// 1. Overview Dashboard & Chart.js Visualizations
// ==========================================================================

function renderOverviewDashboard() {
  const cars = getAdminCars();
  const bookings = getAdminBookings();
  const users = getAdminUsers();

  const totalUsers = users.length;
  const totalCars = cars.length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === "Active" || b.status === "Confirmed").length;
  const completedBookings = bookings.filter(b => b.status === "Completed").length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  // Update KPI Cards
  const elUsers = document.getElementById("statTotalUsers");
  const elCars = document.getElementById("statTotalCars");
  const elBookings = document.getElementById("statTotalBookings");
  const elActive = document.getElementById("statActiveBookings");
  const elCompleted = document.getElementById("statCompletedBookings");
  const elRevenue = document.getElementById("statTotalRevenue");

  if (elUsers) elUsers.textContent = totalUsers;
  if (elCars) elCars.textContent = totalCars;
  if (elBookings) elBookings.textContent = totalBookings;
  if (elActive) elActive.textContent = activeBookings;
  if (elCompleted) elCompleted.textContent = completedBookings;
  if (elRevenue) elRevenue.textContent = formatINR(totalRevenue);

  // Update Badge in sidebar
  const carsBadge = document.getElementById("badgeSidebarCars");
  const bookingsBadge = document.getElementById("badgeSidebarBookings");
  if (carsBadge) carsBadge.textContent = totalCars;
  if (bookingsBadge) bookingsBadge.textContent = activeBookings;

  // Render Charts
  initBookingTrendsChart();
  initRevenueChart();

  // Render Recent Tables
  renderRecentBookingsMini(bookings.slice(0, 5));
  renderRecentUsersMini(users.slice(0, 4));
}

function initBookingTrendsChart() {
  const ctx = document.getElementById("bookingTrendsChartCanvas");
  if (!ctx) return;

  if (bookingTrendsChartInstance) {
    bookingTrendsChartInstance.destroy();
  }

  bookingTrendsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Confirmed Bookings",
          data: [4, 7, 5, 9, 14, 18, 12],
          borderColor: "#10e575",
          backgroundColor: "rgba(16, 229, 117, 0.12)",
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: "#10e575",
          pointRadius: 4
        },
        {
          label: "Completed Trips",
          data: [3, 4, 6, 7, 10, 15, 11],
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          tension: 0.35,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { font: { family: "Plus Jakarta Sans", weight: "600", size: 12 }, boxWidth: 12 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#f1f5f9" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function initRevenueChart() {
  const ctx = document.getElementById("revenueChartCanvas");
  if (!ctx) return;

  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      datasets: [
        {
          label: "Monthly Revenue (₹ in Thousands)",
          data: [142, 185, 210, 248, 290, 342],
          backgroundColor: "#0f172a",
          borderRadius: 8,
          hoverBackgroundColor: "#10e575"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#f1f5f9" },
          ticks: {
            callback: value => "₹" + value + "k"
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function renderRecentBookingsMini(recentBookings) {
  const tbody = document.getElementById("recentBookingsTbody");
  if (!tbody) return;

  tbody.innerHTML = recentBookings
    .map(b => {
      let badgeClass = "success";
      if (b.status === "Cancelled") badgeClass = "danger";
      if (b.status === "Active") badgeClass = "warning";

      return `
        <tr>
          <td><span class="fw-bold font-monospace text-primary">${b.id}</span></td>
          <td><div class="fw-bold">${b.customerName}</div></td>
          <td>${b.carName}</td>
          <td>${b.pickupDate}</td>
          <td><span class="fw-bold">${formatINR(b.totalAmount)}</span></td>
          <td><span class="status-pill ${badgeClass}">${b.status}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderRecentUsersMini(recentUsers) {
  const tbody = document.getElementById("recentUsersTbody");
  if (!tbody) return;

  tbody.innerHTML = recentUsers
    .map(u => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="user-avatar-sm" style="background:#0f172a; width:30px; height:30px; font-size:0.75rem;">${u.name.substring(0,2).toUpperCase()}</div>
            <span class="fw-bold">${u.name}</span>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.city}</td>
        <td><span class="status-pill ${u.status === 'Active' ? 'success' : 'danger'}">${u.status}</span></td>
      </tr>
    `)
    .join("");
}

// ==========================================================================
// 2. Car Fleet Management (Full CRUD)
// ==========================================================================

function renderCarsTable(searchTerm = "", categoryFilter = "All") {
  const tbody = document.getElementById("adminCarsTableBody");
  if (!tbody) return;

  let cars = getAdminCars();

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    cars = cars.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.brand.toLowerCase().includes(q) ||
      (c.regNumber && c.regNumber.toLowerCase().includes(q))
    );
  }

  if (categoryFilter !== "All") {
    cars = cars.filter(c => c.category === categoryFilter);
  }

  tbody.innerHTML = cars
    .map(car => {
      let availBadge = "success";
      if (car.status === "Rented" || car.status === "Booked") availBadge = "warning";
      if (car.status === "Maintenance") availBadge = "danger";

      return `
        <tr>
          <td>
            <img src="${car.image}" alt="${car.name}" class="table-car-thumb" onerror="handleImageError(this, '${car.fallbackImage}')" />
          </td>
          <td>
            <div class="fw-bold text-dark">${car.name}</div>
            <small class="text-muted text-uppercase">${car.brand} &bull; ${car.category}</small>
          </td>
          <td><span class="font-monospace text-xs bg-light p-1 rounded border">${car.regNumber || 'TN-01-DE-2024'}</span></td>
          <td><span class="fw-bold text-dark">${formatINR(car.pricePerDay)}</span><span class="text-xs text-muted">/day</span></td>
          <td>${car.location}</td>
          <td>${car.transmission} &bull; ${car.fuel}</td>
          <td>
            <span class="status-pill ${availBadge}">${car.status || 'Available'}</span>
          </td>
          <td>
            <div class="dropdown">
              <button class="btn btn-sm btn-light border rounded-pill px-2 py-1 dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Actions
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 text-xs">
                <li><a class="dropdown-item" href="#" onclick="openEditCarModal(${car.id}); return false;"><i class="bi bi-pencil-square me-2 text-primary"></i> Edit Details</a></li>
                <li><a class="dropdown-item" href="#" onclick="toggleCarAvailability(${car.id}); return false;"><i class="bi bi-arrow-repeat me-2 text-warning"></i> Toggle Availability</a></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="deleteCar(${car.id}); return false;"><i class="bi bi-trash3 me-2"></i> Delete Car</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Car Management Handlers
function setupCarModalHandlers() {
  const form = document.getElementById("carAddEditForm");
  const searchInput = document.getElementById("adminCarsSearchInput");
  const catSelect = document.getElementById("adminCarsCategorySelect");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCarsTable(e.target.value.trim(), catSelect ? catSelect.value : "All");
    });
  }

  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      renderCarsTable(searchInput ? searchInput.value.trim() : "", e.target.value);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveCarFromModal();
    });
  }
}

function openAddCarModal() {
  const modalEl = document.getElementById("carAddEditModal");
  if (!modalEl) return;

  document.getElementById("carModalTitle").textContent = "Add New Fleet Vehicle";
  document.getElementById("carEditId").value = "";
  document.getElementById("carFormName").value = "";
  document.getElementById("carFormBrand").value = "Hyundai";
  document.getElementById("carFormCategory").value = "SUV";
  document.getElementById("carFormReg").value = `TN-01-DE-${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById("carFormPrice").value = "2500";
  document.getElementById("carFormFuel").value = "Petrol";
  document.getElementById("carFormTransmission").value = "Automatic";
  document.getElementById("carFormSeats").value = "5";
  document.getElementById("carFormLocation").value = "Chennai";
  document.getElementById("carFormImage").value = "assets/images/hyundai-creta.jpg";
  document.getElementById("carFormStatus").value = "Available";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function openEditCarModal(carId) {
  const cars = getAdminCars();
  const car = cars.find(c => c.id === carId);
  if (!car) return;

  document.getElementById("carModalTitle").textContent = `Edit Vehicle: ${car.name}`;
  document.getElementById("carEditId").value = car.id;
  document.getElementById("carFormName").value = car.name;
  document.getElementById("carFormBrand").value = car.brand;
  document.getElementById("carFormCategory").value = car.category;
  document.getElementById("carFormReg").value = car.regNumber || "TN-01-DE-2024";
  document.getElementById("carFormPrice").value = car.pricePerDay;
  document.getElementById("carFormFuel").value = car.fuel;
  document.getElementById("carFormTransmission").value = car.transmission;
  document.getElementById("carFormSeats").value = car.seats;
  document.getElementById("carFormLocation").value = car.location;
  document.getElementById("carFormImage").value = car.image;
  document.getElementById("carFormStatus").value = car.status || "Available";

  const modal = new bootstrap.Modal(document.getElementById("carAddEditModal"));
  modal.show();
}

function saveCarFromModal() {
  const editId = document.getElementById("carEditId").value;
  let cars = getAdminCars();

  const name = document.getElementById("carFormName").value.trim();
  const brand = document.getElementById("carFormBrand").value;
  const category = document.getElementById("carFormCategory").value;
  const regNumber = document.getElementById("carFormReg").value.trim();
  const price = Number(document.getElementById("carFormPrice").value) || 2000;
  const fuel = document.getElementById("carFormFuel").value;
  const transmission = document.getElementById("carFormTransmission").value;
  const seats = Number(document.getElementById("carFormSeats").value) || 5;
  const location = document.getElementById("carFormLocation").value;
  const image = document.getElementById("carFormImage").value.trim() || "assets/images/placeholder-car.jpg";
  const status = document.getElementById("carFormStatus").value;

  if (editId) {
    // Update existing
    const id = Number(editId);
    cars = cars.map(c => {
      if (c.id === id) {
        return {
          ...c,
          name,
          brand,
          category,
          regNumber,
          pricePerDay: price,
          fuel,
          transmission,
          seats,
          location,
          image,
          status,
          isAvailable: status === "Available"
        };
      }
      return c;
    });
    showToast(`Vehicle '${name}' updated successfully!`, "success");
  } else {
    // Add new
    const newId = Math.max(...cars.map(c => c.id), 0) + 1;
    const newCar = {
      id: newId,
      name,
      brand,
      category,
      regNumber,
      pricePerDay: price,
      rating: 5.0,
      reviewsCount: 1,
      seats,
      transmission,
      fuel,
      mileage: "18.0 km/l",
      engine: "1.5L Turbocharged Engine",
      power: "120 PS",
      luggage: "3 Large Bags",
      airbags: "6 Airbags",
      airConditioning: true,
      location,
      availableLocations: [location, "Chennai", "Bangalore"],
      isAvailable: status === "Available",
      status,
      image,
      fallbackImage: "assets/images/placeholder-car.jpg",
      gallery: [image, "assets/images/hero-car.jpg"],
      description: `Premium certified ${name} ready for immediate rental.`,
      features: ["Power Windows", "Bluetooth", "Air Conditioning", "ABS with EBD"],
      deposit: 3500
    };
    cars.unshift(newCar);
    showToast(`New vehicle '${name}' added to fleet!`, "success");
  }

  saveAdminCars(cars);
  bootstrap.Modal.getInstance(document.getElementById("carAddEditModal")).hide();
  renderCarsTable();
  renderOverviewDashboard();
}

function toggleCarAvailability(carId) {
  let cars = getAdminCars();
  cars = cars.map(c => {
    if (c.id === carId) {
      const nextStatus = c.status === "Available" ? "Maintenance" : "Available";
      return { ...c, status: nextStatus, isAvailable: nextStatus === "Available" };
    }
    return c;
  });
  saveAdminCars(cars);
  showToast("Vehicle status updated.", "info");
  renderCarsTable();
  renderOverviewDashboard();
}

function deleteCar(carId) {
  if (!confirm("Are you sure you want to remove this vehicle from the fleet?")) return;
  let cars = getAdminCars();
  cars = cars.filter(c => c.id !== carId);
  saveAdminCars(cars);
  showToast("Vehicle deleted from fleet.", "info");
  renderCarsTable();
  renderOverviewDashboard();
}

// ==========================================================================
// 3. Booking Management
// ==========================================================================

function renderBookingsTable(filterStatus = "All") {
  const tbody = document.getElementById("adminBookingsTableBody");
  if (!tbody) return;

  let bookings = getAdminBookings();

  if (filterStatus !== "All") {
    bookings = bookings.filter(b => b.status === filterStatus);
  }

  tbody.innerHTML = bookings
    .map(b => {
      let badge = "success";
      if (b.status === "Cancelled" || b.status === "Rejected") badge = "danger";
      if (b.status === "Active") badge = "warning";
      if (b.status === "Completed") badge = "info";

      return `
        <tr>
          <td><span class="font-monospace fw-bold text-primary">${b.id}</span></td>
          <td>
            <div class="fw-bold">${b.customerName}</div>
            <small class="text-muted">${b.customerEmail}</small>
          </td>
          <td>${b.carName}</td>
          <td>${b.pickupDate} &rarr; ${b.returnDate}</td>
          <td><span class="fw-bold">${formatINR(b.totalAmount)}</span></td>
          <td><span class="status-pill ${badge}">${b.status}</span></td>
          <td>
            <div class="dropdown">
              <button class="btn btn-sm btn-light border rounded-pill px-2 py-1 dropdown-toggle text-xs" type="button" data-bs-toggle="dropdown">
                Status
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 text-xs">
                <li><a class="dropdown-item text-success" href="#" onclick="updateBookingStatus('${b.id}', 'Confirmed'); return false;"><i class="bi bi-check-circle me-1"></i> Approve / Confirm</a></li>
                <li><a class="dropdown-item text-primary" href="#" onclick="updateBookingStatus('${b.id}', 'Completed'); return false;"><i class="bi bi-flag me-1"></i> Mark Completed</a></li>
                <li><a class="dropdown-item text-warning" href="#" onclick="updateBookingStatus('${b.id}', 'Active'); return false;"><i class="bi bi-clock me-1"></i> Set Active</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="updateBookingStatus('${b.id}', 'Cancelled'); return false;"><i class="bi bi-x-circle me-1"></i> Cancel / Reject</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function updateBookingStatus(bookingId, newStatus) {
  let bookings = getAdminBookings();
  bookings = bookings.map(b => {
    if (b.id === bookingId) {
      return { ...b, status: newStatus };
    }
    return b;
  });
  saveAdminBookings(bookings);
  showToast(`Booking ${bookingId} status changed to '${newStatus}'`, "success");
  renderBookingsTable();
  renderOverviewDashboard();
}

// ==========================================================================
// 4. User Directory Management
// ==========================================================================

function renderUsersTable(searchTerm = "") {
  const tbody = document.getElementById("adminUsersTableBody");
  if (!tbody) return;

  let users = getAdminUsers();

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
  }

  tbody.innerHTML = users
    .map(u => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="user-avatar-sm" style="background:#0f172a; width:34px; height:34px; font-size:0.8rem;">${u.name.substring(0, 2).toUpperCase()}</div>
            <div>
              <div class="fw-bold">${u.name}</div>
              <small class="text-muted">ID: ${u.id}</small>
            </div>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>${u.city}</td>
        <td><span class="badge bg-light text-dark border">${u.totalBookings || 0} Bookings</span></td>
        <td><span class="status-pill ${u.status === 'Active' ? 'success' : 'danger'}">${u.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-secondary rounded-pill me-1 text-xs" onclick="toggleUserStatus('${u.id}')">
            ${u.status === 'Active' ? '<i class="bi bi-slash-circle"></i> Block' : '<i class="bi bi-check-circle"></i> Unblock'}
          </button>
          <button class="btn btn-sm btn-outline-danger rounded-pill text-xs" onclick="deleteUser('${u.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `)
    .join("");
}

function toggleUserStatus(userId) {
  let users = getAdminUsers();
  users = users.map(u => {
    if (u.id === userId) {
      const next = u.status === "Active" ? "Blocked" : "Active";
      return { ...u, status: next };
    }
    return u;
  });
  saveAdminUsers(users);
  showToast("User account status updated.", "info");
  renderUsersTable();
  renderOverviewDashboard();
}

function deleteUser(userId) {
  if (!confirm("Are you sure you want to permanently delete this user?")) return;
  let users = getAdminUsers();
  users = users.filter(u => u.id !== userId);
  saveAdminUsers(users);
  showToast("User deleted from directory.", "info");
  renderUsersTable();
  renderOverviewDashboard();
}

// ==========================================================================
// 5. Payment Ledger & Reviews
// ==========================================================================

function renderPaymentsTable() {
  const tbody = document.getElementById("adminPaymentsTableBody");
  if (!tbody) return;

  const bookings = getAdminBookings();

  tbody.innerHTML = bookings
    .map((b, idx) => `
      <tr>
        <td><span class="font-monospace text-xs fw-bold">TXN-2026-${89000 + idx * 431}</span></td>
        <td><span class="font-monospace text-xs text-primary">${b.id}</span></td>
        <td>${b.customerName}</td>
        <td>${b.bookedAt ? b.bookedAt.split("T")[0] : b.pickupDate}</td>
        <td><span class="fw-bold">${formatINR(b.totalAmount)}</span></td>
        <td><span class="badge bg-light text-secondary border">${b.paymentMethod || 'Credit Card'}</span></td>
        <td><span class="status-pill ${b.status === 'Cancelled' ? 'danger' : 'success'}">${b.status === 'Cancelled' ? 'Refunded' : 'Settled'}</span></td>
      </tr>
    `)
    .join("");
}

function renderReviewsSection() {
  const container = document.getElementById("adminReviewsContainer");
  if (!container) return;

  const reviews = getAdminReviews();

  container.innerHTML = reviews
    .map(rev => `
      <div class="col-md-6 mb-3">
        <div class="card border rounded-4 p-3 shadow-sm h-100">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="fw-bold mb-0">${rev.customerName}</h6>
              <small class="text-muted text-uppercase text-xs">${rev.carName} &bull; ${rev.date}</small>
            </div>
            <div class="text-warning small">
              ${'<i class="bi bi-star-fill"></i>'.repeat(rev.rating)}
            </div>
          </div>
          <p class="text-secondary small fst-italic mb-3 flex-grow-1">"${rev.comment}"</p>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="status-pill success">Verified Customer</span>
            <button class="btn btn-outline-danger btn-sm rounded-pill text-xs px-3" onclick="deleteReview('${rev.id}')">
              <i class="bi bi-trash3 me-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `)
    .join("");
}

function deleteReview(revId) {
  if (!confirm("Are you sure you want to remove this review?")) return;
  let reviews = getAdminReviews();
  reviews = reviews.filter(r => r.id !== revId);
  saveAdminReviews(reviews);
  showToast("Customer review deleted.", "info");
  renderReviewsSection();
}

// ==========================================================================
// 6. Settings Handlers
// ==========================================================================

function setupSettingsForm() {
  const form = document.getElementById("adminSettingsForm");
  if (!form) return;

  const adminUser = JSON.parse(localStorage.getItem("driveease_admin_user")) || {
    name: "Chief Fleet Admin",
    email: "admin@driveease.com",
    role: "Super Admin"
  };

  const nameInput = document.getElementById("settingsAdminName");
  const emailInput = document.getElementById("settingsAdminEmail");

  if (nameInput) nameInput.value = adminUser.name;
  if (emailInput) emailInput.value = adminUser.email;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    adminUser.name = nameInput.value.trim();
    adminUser.email = emailInput.value.trim();
    localStorage.setItem("driveease_admin_user", JSON.stringify(adminUser));
    loadAdminUserProfile();
    showToast("Admin profile details updated successfully!", "success");
  });

  const passForm = document.getElementById("adminPasswordChangeForm");
  if (passForm) {
    passForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Administrator password updated successfully!", "success");
      passForm.reset();
    });
  }
}
