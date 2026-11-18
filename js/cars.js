/**
 * DriveEase - Premium Car Rental Marketplace
 * Car Listing, Search, Filter & Sorting System
 */

// Global Filter State
const carFilterState = {
  searchQuery: "",
  location: "All",
  categories: [],
  brands: [],
  fuelTypes: [],
  transmissions: [],
  seats: [],
  minPrice: 1000,
  maxPrice: 12000,
  minRating: 0,
  sortBy: "popular",
  viewMode: "grid"
};

// Initialize Listing Page
function initCarsListing() {
  const container = document.getElementById("carsGridContainer");
  if (!container) return; // Not on cars.html

  // 1. Read URL Query Parameters
  const paramCategory = getQueryParam("category");
  const paramLocation = getQueryParam("location");
  const paramSearch = getQueryParam("search");
  const paramBrand = getQueryParam("brand");

  if (paramCategory && paramCategory !== "All") {
    carFilterState.categories = [paramCategory];
    const catCheck = document.querySelector(`input[name="filterCategory"][value="${paramCategory}"]`);
    if (catCheck) catCheck.checked = true;
  }

  if (paramLocation && paramLocation !== "All") {
    carFilterState.location = paramLocation;
    const locSelect = document.getElementById("locationFilterSelect");
    if (locSelect) locSelect.value = paramLocation;
  }

  if (paramSearch) {
    carFilterState.searchQuery = paramSearch;
    const searchInput = document.getElementById("carSearchInput");
    if (searchInput) {
      searchInput.value = paramSearch;
      document.querySelector(".search-input-wrapper")?.classList.add("has-text");
    }
  }

  if (paramBrand) {
    carFilterState.brands = [paramBrand];
    const brandCheck = document.querySelector(`input[name="filterBrand"][value="${paramBrand}"]`);
    if (brandCheck) brandCheck.checked = true;
  }

  // 2. Setup All Listeners
  setupFilterListeners();

  // 3. Initial Render
  renderCarsList();
}

// Setup Event Listeners for Filters
function setupFilterListeners() {
  // Search Input
  const searchInput = document.getElementById("carSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchWrapper = document.querySelector(".search-input-wrapper");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      carFilterState.searchQuery = e.target.value.trim();
      if (searchWrapper) {
        if (carFilterState.searchQuery) {
          searchWrapper.classList.add("has-text");
        } else {
          searchWrapper.classList.remove("has-text");
        }
      }
      renderCarsList();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      carFilterState.searchQuery = "";
      searchWrapper?.classList.remove("has-text");
      renderCarsList();
    });
  }

  // Location Dropdown
  const locSelect = document.getElementById("locationFilterSelect");
  if (locSelect) {
    locSelect.addEventListener("change", (e) => {
      carFilterState.location = e.target.value;
      renderCarsList();
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      carFilterState.sortBy = e.target.value;
      renderCarsList();
    });
  }

  // Price Slider
  const priceRange = document.getElementById("priceRangeInput");
  const maxPriceDisplay = document.getElementById("maxPriceDisplay");
  if (priceRange && maxPriceDisplay) {
    priceRange.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      carFilterState.maxPrice = val;
      maxPriceDisplay.textContent = formatINR(val);
      renderCarsList();
    });
  }

  // Category Checkboxes
  const categoryBoxes = document.querySelectorAll('input[name="filterCategory"]');
  categoryBoxes.forEach(box => {
    box.addEventListener("change", () => {
      carFilterState.categories = Array.from(categoryBoxes)
        .filter(b => b.checked)
        .map(b => b.value);
      renderCarsList();
    });
  });

  // Brand Checkboxes
  const brandBoxes = document.querySelectorAll('input[name="filterBrand"]');
  brandBoxes.forEach(box => {
    box.addEventListener("change", () => {
      carFilterState.brands = Array.from(brandBoxes)
        .filter(b => b.checked)
        .map(b => b.value);
      renderCarsList();
    });
  });

  // Fuel Type Checkboxes
  const fuelBoxes = document.querySelectorAll('input[name="filterFuel"]');
  fuelBoxes.forEach(box => {
    box.addEventListener("change", () => {
      carFilterState.fuelTypes = Array.from(fuelBoxes)
        .filter(b => b.checked)
        .map(b => b.value);
      renderCarsList();
    });
  });

  // Transmission Checkboxes
  const transBoxes = document.querySelectorAll('input[name="filterTransmission"]');
  transBoxes.forEach(box => {
    box.addEventListener("change", () => {
      carFilterState.transmissions = Array.from(transBoxes)
        .filter(b => b.checked)
        .map(b => b.value);
      renderCarsList();
    });
  });

  // Seats Checkboxes
  const seatBoxes = document.querySelectorAll('input[name="filterSeats"]');
  seatBoxes.forEach(box => {
    box.addEventListener("change", () => {
      carFilterState.seats = Array.from(seatBoxes)
        .filter(b => b.checked)
        .map(b => Number(b.value));
      renderCarsList();
    });
  });

  // Rating Radio / Checkbox
  const ratingRadios = document.querySelectorAll('input[name="filterRating"]');
  ratingRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      const checked = document.querySelector('input[name="filterRating"]:checked');
      carFilterState.minRating = checked ? Number(checked.value) : 0;
      renderCarsList();
    });
  });

  // Layout View Toggles (Grid / List)
  const btnGridView = document.getElementById("btnGridView");
  const btnListView = document.getElementById("btnListView");
  const carsContainer = document.getElementById("carsGridContainer");

  if (btnGridView && btnListView && carsContainer) {
    btnGridView.addEventListener("click", () => {
      carFilterState.viewMode = "grid";
      btnGridView.classList.add("active");
      btnListView.classList.remove("active");
      carsContainer.classList.remove("list-view");
      renderCarsList();
    });

    btnListView.addEventListener("click", () => {
      carFilterState.viewMode = "list";
      btnListView.classList.add("active");
      btnGridView.classList.remove("active");
      carsContainer.classList.add("list-view");
      renderCarsList();
    });
  }

  // Reset Filters Button
  const resetBtns = document.querySelectorAll(".btn-reset-filters, #resetAllFiltersBtn");
  resetBtns.forEach(btn => {
    btn.addEventListener("click", resetAllFilters);
  });
}

// Reset All Filters to Defaults
function resetAllFilters() {
  carFilterState.searchQuery = "";
  carFilterState.location = "All";
  carFilterState.categories = [];
  carFilterState.brands = [];
  carFilterState.fuelTypes = [];
  carFilterState.transmissions = [];
  carFilterState.seats = [];
  carFilterState.maxPrice = 12000;
  carFilterState.minRating = 0;
  carFilterState.sortBy = "popular";

  // Reset HTML Inputs
  const searchInput = document.getElementById("carSearchInput");
  if (searchInput) searchInput.value = "";
  document.querySelector(".search-input-wrapper")?.classList.remove("has-text");

  const locSelect = document.getElementById("locationFilterSelect");
  if (locSelect) locSelect.value = "All";

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "popular";

  const priceRange = document.getElementById("priceRangeInput");
  const maxPriceDisplay = document.getElementById("maxPriceDisplay");
  if (priceRange && maxPriceDisplay) {
    priceRange.value = 12000;
    maxPriceDisplay.textContent = formatINR(12000);
  }

  const allCheckboxes = document.querySelectorAll('.filter-sidebar-card input[type="checkbox"], .filter-sidebar-card input[type="radio"]');
  allCheckboxes.forEach(cb => (cb.checked = false));

  renderCarsList();
  showToast("All filters have been reset.", "info");
}

// Filter and Render Logic
function renderCarsList() {
  const container = document.getElementById("carsGridContainer");
  const countEl = document.getElementById("carsCountDisplay");
  const chipsContainer = document.getElementById("activeFilterChips");
  if (!container) return;

  // 1. Filter CARS_DATABASE
  let filtered = CARS_DATABASE.filter(car => {
    // Search query matches name, brand, or category
    if (carFilterState.searchQuery) {
      const q = carFilterState.searchQuery.toLowerCase();
      const match =
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Location filter
    if (carFilterState.location !== "All") {
      if (!car.availableLocations.includes(carFilterState.location)) {
        return false;
      }
    }

    // Categories filter
    if (carFilterState.categories.length > 0) {
      if (!carFilterState.categories.includes(car.category)) {
        return false;
      }
    }

    // Brands filter
    if (carFilterState.brands.length > 0) {
      if (!carFilterState.brands.includes(car.brand)) {
        return false;
      }
    }

    // Fuel filter
    if (carFilterState.fuelTypes.length > 0) {
      if (!carFilterState.fuelTypes.includes(car.fuel)) {
        return false;
      }
    }

    // Transmission filter
    if (carFilterState.transmissions.length > 0) {
      if (!carFilterState.transmissions.includes(car.transmission)) {
        return false;
      }
    }

    // Seats filter
    if (carFilterState.seats.length > 0) {
      if (!carFilterState.seats.includes(car.seats)) {
        return false;
      }
    }

    // Price Max filter
    if (car.pricePerDay > carFilterState.maxPrice) {
      return false;
    }

    // Rating Min filter
    if (carFilterState.minRating > 0 && car.rating < carFilterState.minRating) {
      return false;
    }

    return true;
  });

  // 2. Sort Filtered Results
  if (carFilterState.sortBy === "price-asc") {
    filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (carFilterState.sortBy === "price-desc") {
    filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (carFilterState.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // "popular"
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  // 3. Update Result Counts
  if (countEl) {
    countEl.innerHTML = `Showing <span>${filtered.length}</span> ${
      filtered.length === 1 ? "vehicle" : "vehicles"
    }`;
  }

  // 4. Update Active Chips
  renderActiveChips(chipsContainer);

  // 5. Render Car Cards or Empty State
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-results-box">
          <div class="empty-icon-circle">
            <i class="bi bi-car-front"></i>
          </div>
          <h3>No matching vehicles found</h3>
          <p>We couldn't find any cars matching your current search and filter criteria. Try expanding your price range or clearing some filters.</p>
          <button class="btn-drive-lime" onclick="resetAllFilters()">
            <i class="bi bi-arrow-counterclockwise"></i> Reset All Filters
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Generate cards
  const isListView = carFilterState.viewMode === "list";
  const colClass = isListView ? "col-12 mb-4" : "col-md-6 col-lg-4 mb-4";

  container.innerHTML = filtered
    .map(car => generateCarCardHtml(car, colClass))
    .join("");
}

// Generate Individual Vehicle Card HTML
function generateCarCardHtml(car, colClass = "col-md-6 col-lg-4 mb-4") {
  const isFav = isCarFavorite(car.id);
  const favActiveClass = isFav ? "active" : "";

  return `
    <div class="${colClass}">
      <div class="de-car-card">
        <div class="card-img-wrapper">
          <span class="card-badge-category">${car.category}</span>
          <button class="card-btn-favorite ${favActiveClass}" data-fav-id="${car.id}" title="Save to favorites" onclick="toggleFavorite(${car.id}, event)">
            <i class="bi bi-heart"></i>
          </button>
          <img 
            src="${car.image}" 
            alt="${car.name}" 
            loading="lazy" 
            onerror="handleImageError(this, '${car.fallbackImage}')" 
          />
        </div>

        <div class="card-body-content">
          <div class="card-header-info">
            <div>
              <div class="card-car-brand">${car.brand}</div>
              <h3 class="card-car-title">${car.name}</h3>
            </div>
            <div class="card-car-rating">
              <i class="bi bi-star-fill text-warning"></i>
              <span>${car.rating.toFixed(1)}</span>
            </div>
          </div>

          <div class="card-location-info">
            <i class="bi bi-geo-alt-fill text-muted"></i>
            <span>${car.location} &bull; Instant Confirmation</span>
          </div>

          <div class="card-spec-grid">
            <div class="card-spec-item">
              <i class="bi bi-people-fill"></i>
              <span>${car.seats} Seats</span>
            </div>
            <div class="card-spec-item">
              <i class="bi bi-gear-fill"></i>
              <span>${car.transmission}</span>
            </div>
            <div class="card-spec-item">
              <i class="bi bi-fuel-pump-fill"></i>
              <span>${car.fuel}</span>
            </div>
          </div>

          <div class="card-footer-action">
            <div class="card-price-block">
              <span class="card-price-value">${formatINR(car.pricePerDay)}</span>
              <span class="card-price-period">per day</span>
            </div>
            <div class="card-actions-group">
              <a href="car-details.html?id=${car.id}" class="btn-card-details">Details</a>
              <a href="booking.html?id=${car.id}" class="btn-card-book">Book Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Active Filter Chips
function renderActiveChips(container) {
  if (!container) return;

  const chips = [];

  if (carFilterState.searchQuery) {
    chips.push({
      label: `"${carFilterState.searchQuery}"`,
      remove: () => {
        carFilterState.searchQuery = "";
        const searchInput = document.getElementById("carSearchInput");
        if (searchInput) searchInput.value = "";
        document.querySelector(".search-input-wrapper")?.classList.remove("has-text");
        renderCarsList();
      }
    });
  }

  if (carFilterState.location !== "All") {
    chips.push({
      label: `Location: ${carFilterState.location}`,
      remove: () => {
        carFilterState.location = "All";
        const locSelect = document.getElementById("locationFilterSelect");
        if (locSelect) locSelect.value = "All";
        renderCarsList();
      }
    });
  }

  carFilterState.categories.forEach(cat => {
    chips.push({
      label: cat,
      remove: () => {
        carFilterState.categories = carFilterState.categories.filter(c => c !== cat);
        const cb = document.querySelector(`input[name="filterCategory"][value="${cat}"]`);
        if (cb) cb.checked = false;
        renderCarsList();
      }
    });
  });

  carFilterState.brands.forEach(brand => {
    chips.push({
      label: brand,
      remove: () => {
        carFilterState.brands = carFilterState.brands.filter(b => b !== brand);
        const cb = document.querySelector(`input[name="filterBrand"][value="${brand}"]`);
        if (cb) cb.checked = false;
        renderCarsList();
      }
    });
  });

  carFilterState.fuelTypes.forEach(fuel => {
    chips.push({
      label: fuel,
      remove: () => {
        carFilterState.fuelTypes = carFilterState.fuelTypes.filter(f => f !== fuel);
        const cb = document.querySelector(`input[name="filterFuel"][value="${fuel}"]`);
        if (cb) cb.checked = false;
        renderCarsList();
      }
    });
  });

  carFilterState.transmissions.forEach(trans => {
    chips.push({
      label: trans,
      remove: () => {
        carFilterState.transmissions = carFilterState.transmissions.filter(t => t !== trans);
        const cb = document.querySelector(`input[name="filterTransmission"][value="${trans}"]`);
        if (cb) cb.checked = false;
        renderCarsList();
      }
    });
  });

  if (carFilterState.maxPrice < 12000) {
    chips.push({
      label: `Max: ${formatINR(carFilterState.maxPrice)}`,
      remove: () => {
        carFilterState.maxPrice = 12000;
        const priceRange = document.getElementById("priceRangeInput");
        const maxPriceDisplay = document.getElementById("maxPriceDisplay");
        if (priceRange && maxPriceDisplay) {
          priceRange.value = 12000;
          maxPriceDisplay.textContent = formatINR(12000);
        }
        renderCarsList();
      }
    });
  }

  if (chips.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="active-filter-chips">
      ${chips
        .map(
          (chip, idx) => `
        <span class="filter-chip">
          ${chip.label}
          <button class="filter-chip-remove" onclick="removeChipByIndex(${idx})" aria-label="Remove filter">&times;</button>
        </span>
      `
        )
        .join("")}
      <button class="btn-clear-all-chips" onclick="resetAllFilters()">Clear All</button>
    </div>
  `;

  // Attach chip actions
  window.activeChipActions = chips.map(c => c.remove);
}

function removeChipByIndex(index) {
  if (window.activeChipActions && window.activeChipActions[index]) {
    window.activeChipActions[index]();
  }
}

// Auto-run on page load
document.addEventListener("DOMContentLoaded", () => {
  // Sync desktop filters into mobile offcanvas drawer if empty
  const desktopFilterBody = document.querySelector(".filter-sidebar-card");
  const mobileDrawerBody = document.querySelector("#mobileFilterDrawer .offcanvas-body");
  if (desktopFilterBody && mobileDrawerBody) {
    mobileDrawerBody.innerHTML = `
      <div class="p-1">
        ${desktopFilterBody.innerHTML}
      </div>
      <div class="mt-4 pt-3 border-top sticky-bottom bg-white">
        <button class="btn-drive-lime w-100" data-bs-dismiss="offcanvas">
          <i class="bi bi-check-lg"></i> Apply & View Results
        </button>
      </div>
    `;
  }

  initCarsListing();
});
