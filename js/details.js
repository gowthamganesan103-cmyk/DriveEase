/**
 * DriveEase - Premium Car Rental Marketplace
 * Car Details Page Logic (Gallery, Specs, Features, Sticky Booking & Related Vehicles)
 */

function initCarDetails() {
  const carId = Number(getQueryParam("id")) || 1;
  const car = CARS_DATABASE.find(c => c.id === carId) || CARS_DATABASE[0];

  if (!car) {
    showToast("Vehicle not found. Redirecting to fleet...", "error");
    setTimeout(() => (window.location.href = "cars.html"), 1500);
    return;
  }

  // Update Page Title
  document.title = `${car.name} Rental | DriveEase Premium Fleet`;

  // 1. Breadcrumbs
  const breadcrumbCar = document.getElementById("breadcrumbCarName");
  if (breadcrumbCar) breadcrumbCar.textContent = car.name;

  // 2. Gallery Setup
  const mainImage = document.getElementById("mainDetailsImage");
  const thumbnailsStrip = document.getElementById("galleryThumbnails");
  const galleryCategoryBadge = document.getElementById("galleryCategoryBadge");

  if (galleryCategoryBadge) galleryCategoryBadge.textContent = car.category;

  if (mainImage) {
    mainImage.src = car.image;
    mainImage.alt = car.name;
    mainImage.onerror = () => handleImageError(mainImage, car.fallbackImage);
  }

  if (thumbnailsStrip) {
    const galleryList = (car.gallery && car.gallery.length > 0) ? car.gallery : [car.image];
    thumbnailsStrip.innerHTML = galleryList
      .map(
        (imgUrl, idx) => `
        <div class="gallery-thumb-item ${idx === 0 ? "active" : ""}" onclick="switchDetailsGalleryImage('${imgUrl}', this)">
          <img src="${imgUrl}" alt="${car.name} angle ${idx + 1}" onerror="handleImageError(this, '${car.fallbackImage}')" />
        </div>
      `
      )
      .join("");
  }

  // 3. Header & Meta Info
  const brandEl = document.getElementById("detailsCarBrand");
  const titleEl = document.getElementById("detailsCarTitle");
  const ratingEl = document.getElementById("detailsRatingVal");
  const reviewsCountEl = document.getElementById("detailsReviewsCount");
  const locationEl = document.getElementById("detailsLocationText");

  if (brandEl) brandEl.textContent = car.brand;
  if (titleEl) titleEl.textContent = car.name;
  if (ratingEl) ratingEl.textContent = car.rating.toFixed(1);
  if (reviewsCountEl) reviewsCountEl.textContent = `(${car.reviewsCount} verified reviews)`;
  if (locationEl) locationEl.textContent = `${car.location} &bull; Available across 6 Hubs`;

  // 4. Specifications Grid (8 Key Specs)
  const specsGrid = document.getElementById("specsGridContainer");
  if (specsGrid) {
    specsGrid.innerHTML = `
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-people-fill"></i></div>
        <div class="spec-tile-label">Capacity</div>
        <div class="spec-tile-value">${car.seats} Passenger Seats</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-gear-fill"></i></div>
        <div class="spec-tile-label">Transmission</div>
        <div class="spec-tile-value">${car.transmission}</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-fuel-pump-fill"></i></div>
        <div class="spec-tile-label">Fuel Type</div>
        <div class="spec-tile-value">${car.fuel}</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-speedometer2"></i></div>
        <div class="spec-tile-label">Efficiency / Mileage</div>
        <div class="spec-tile-value">${car.mileage}</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-cpu-fill"></i></div>
        <div class="spec-tile-label">Engine / Power</div>
        <div class="spec-tile-value">${car.power || car.engine}</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-snow"></i></div>
        <div class="spec-tile-label">Climate Control</div>
        <div class="spec-tile-value">${car.airConditioning ? "Dual Auto AC" : "Standard"}</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-luggage-fill"></i></div>
        <div class="spec-tile-label">Luggage Space</div>
        <div class="spec-tile-value">${car.luggage}</div>
      </div>
      <div class="spec-tile">
        <div class="spec-tile-icon"><i class="bi bi-shield-check"></i></div>
        <div class="spec-tile-label">Safety</div>
        <div class="spec-tile-value">${car.airbags}</div>
      </div>
    `;
  }

  // 5. Vehicle Description
  const descEl = document.getElementById("detailsCarDescription");
  if (descEl) descEl.textContent = car.description;

  // 6. Features Checklist
  const featuresList = document.getElementById("featuresChecklist");
  if (featuresList && car.features) {
    featuresList.innerHTML = car.features
      .map(
        f => `
        <div class="feature-check-item">
          <i class="bi bi-check-circle-fill"></i>
          <span>${f}</span>
        </div>
      `
      )
      .join("");
  }

  // 7. Sticky Booking Card
  const priceDisplay = document.getElementById("bookingCardDailyRate");
  const depositNote = document.getElementById("bookingDepositNote");
  const proceedBtn = document.getElementById("proceedToBookingBtn");
  const favBtn = document.getElementById("detailsFavoriteBtn");

  if (priceDisplay) priceDisplay.textContent = formatINR(car.pricePerDay);
  if (depositNote) depositNote.textContent = `Refundable Security Deposit: ${formatINR(car.deposit || 3000)}`;

  // Default dates for quick booking calculator
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const returnDate = new Date(today);
  returnDate.setDate(returnDate.getDate() + 4);

  const pickupInput = document.getElementById("quickPickupDate");
  const returnInput = document.getElementById("quickReturnDate");
  const daysDisplay = document.getElementById("quickDaysDisplay");
  const estimatedTotalDisplay = document.getElementById("quickEstimatedTotal");

  if (pickupInput && returnInput) {
    pickupInput.value = tomorrow.toISOString().split("T")[0];
    returnInput.value = returnDate.toISOString().split("T")[0];

    // Restrict minimum date
    pickupInput.min = today.toISOString().split("T")[0];
    returnInput.min = tomorrow.toISOString().split("T")[0];

    const updateQuickCalc = () => {
      const pDate = new Date(pickupInput.value);
      const rDate = new Date(returnInput.value);
      const diffTime = rDate - pDate;
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(diffDays) || diffDays < 1) diffDays = 1;

      if (daysDisplay) daysDisplay.textContent = `${diffDays} Day${diffDays > 1 ? "s" : ""}`;
      const estTotal = car.pricePerDay * diffDays + 500; // base + basic insurance
      if (estimatedTotalDisplay) estimatedTotalDisplay.textContent = formatINR(estTotal);

      if (proceedBtn) {
        proceedBtn.href = `booking.html?id=${car.id}&pickup=${pickupInput.value}&return=${returnInput.value}`;
      }
    };

    pickupInput.addEventListener("change", () => {
      returnInput.min = pickupInput.value;
      if (new Date(returnInput.value) <= new Date(pickupInput.value)) {
        const next = new Date(pickupInput.value);
        next.setDate(next.getDate() + 1);
        returnInput.value = next.toISOString().split("T")[0];
      }
      updateQuickCalc();
    });

    returnInput.addEventListener("change", updateQuickCalc);
    updateQuickCalc();
  }

  // Favorite button in details page
  if (favBtn) {
    favBtn.setAttribute("data-fav-id", car.id);
    if (isCarFavorite(car.id)) favBtn.classList.add("active");
    favBtn.onclick = () => {
      toggleFavorite(car.id);
      if (isCarFavorite(car.id)) {
        favBtn.classList.add("active");
      } else {
        favBtn.classList.remove("active");
      }
    };
  }

  // 8. Related Cars
  renderRelatedCars(car);
}

// Switch Image in Main Viewport
function switchDetailsGalleryImage(imgSrc, thumbEl) {
  const mainImage = document.getElementById("mainDetailsImage");
  if (mainImage) {
    mainImage.style.opacity = "0.4";
    setTimeout(() => {
      mainImage.src = imgSrc;
      mainImage.style.opacity = "1";
    }, 150);
  }

  const allThumbs = document.querySelectorAll(".gallery-thumb-item");
  allThumbs.forEach(t => t.classList.remove("active"));
  if (thumbEl) thumbEl.classList.add("active");
}

// Render 3 Related Vehicles
function renderRelatedCars(currentCar) {
  const container = document.getElementById("relatedCarsContainer");
  if (!container) return;

  const related = CARS_DATABASE
    .filter(c => c.id !== currentCar.id && (c.category === currentCar.category || c.brand === currentCar.brand))
    .slice(0, 3);

  // If fewer than 3, grab other vehicles
  if (related.length < 3) {
    const extras = CARS_DATABASE.filter(c => c.id !== currentCar.id && !related.includes(c)).slice(0, 3 - related.length);
    related.push(...extras);
  }

  container.innerHTML = related
    .map(car => generateCarCardHtml(car, "col-md-6 col-lg-4 mb-4"))
    .join("");
}

document.addEventListener("DOMContentLoaded", initCarDetails);
