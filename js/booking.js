/**
 * DriveEase - Premium Car Rental Marketplace
 * Booking & Realtime Checkout Engine
 */

let currentBookingCar = null;
let appliedPromoDiscount = 0;
let appliedPromoCode = "";

function initBookingPage() {
  const carId = Number(getQueryParam("id")) || 1;
  currentBookingCar = CARS_DATABASE.find(c => c.id === carId) || CARS_DATABASE[0];

  if (!currentBookingCar) {
    showToast("Invalid car selection. Redirecting...", "error");
    setTimeout(() => (window.location.href = "cars.html"), 1500);
    return;
  }

  // Populate Car Summary
  populateBookingCarSummary();

  // Populate Driver details if user logged in
  populateUserData();

  // Initialize Dates
  initBookingDates();

  // Setup Payment Tabs
  setupPaymentTabs();

  // Setup Add-ons and Promo listeners
  setupAddonsAndPromo();

  // Setup Form Submission
  const bookingForm = document.getElementById("checkoutForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }

  // Initial Calculation
  recalculateBookingPricing();
}

// Populate Vehicle Summary on Right Column
function populateBookingCarSummary() {
  const imgEl = document.getElementById("summaryCarImg");
  const brandEl = document.getElementById("summaryCarBrand");
  const nameEl = document.getElementById("summaryCarName");
  const rateEl = document.getElementById("summaryCarRate");

  if (imgEl) {
    imgEl.src = currentBookingCar.image;
    imgEl.alt = currentBookingCar.name;
    imgEl.onerror = () => handleImageError(imgEl, currentBookingCar.fallbackImage);
  }
  if (brandEl) brandEl.textContent = currentBookingCar.brand;
  if (nameEl) nameEl.textContent = currentBookingCar.name;
  if (rateEl) rateEl.textContent = `${formatINR(currentBookingCar.pricePerDay)} / day`;
}

// Pre-fill logged-in customer info
function populateUserData() {
  const user = getCurrentUser();
  if (!user) return;

  const nameInput = document.getElementById("custFullName");
  const emailInput = document.getElementById("custEmail");
  const phoneInput = document.getElementById("custPhone");

  if (nameInput && !nameInput.value) nameInput.value = user.name || "";
  if (emailInput && !emailInput.value) emailInput.value = user.email || "";
  if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || "";
}

// Setup Date pickers & duration computation
function initBookingDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defReturn = new Date(today);
  defReturn.setDate(defReturn.getDate() + 4);

  const pickupInput = document.getElementById("bookingPickupDate");
  const returnInput = document.getElementById("bookingReturnDate");

  const urlPickup = getQueryParam("pickup");
  const urlReturn = getQueryParam("return");

  if (pickupInput && returnInput) {
    pickupInput.min = today.toISOString().split("T")[0];
    pickupInput.value = urlPickup || tomorrow.toISOString().split("T")[0];

    returnInput.min = pickupInput.value;
    returnInput.value = urlReturn || defReturn.toISOString().split("T")[0];

    pickupInput.addEventListener("change", () => {
      returnInput.min = pickupInput.value;
      if (new Date(returnInput.value) <= new Date(pickupInput.value)) {
        const next = new Date(pickupInput.value);
        next.setDate(next.getDate() + 1);
        returnInput.value = next.toISOString().split("T")[0];
      }
      recalculateBookingPricing();
    });

    returnInput.addEventListener("change", recalculateBookingPricing);
  }
}

// Setup Demo Payment Tabs
function setupPaymentTabs() {
  const tabBtns = document.querySelectorAll(".payment-tab-btn");
  const tabPanes = document.querySelectorAll(".payment-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add("active");
    });
  });
}

// Setup Add-on checkboxes & Promo Code Engine
function setupAddonsAndPromo() {
  const addonChecks = document.querySelectorAll(".addon-item-box input[type='checkbox']");
  addonChecks.forEach(cb => {
    cb.addEventListener("change", (e) => {
      const parent = cb.closest(".addon-item-box");
      if (cb.checked) {
        parent.classList.add("selected");
      } else {
        parent.classList.remove("selected");
      }
      recalculateBookingPricing();
    });
  });

  const applyPromoBtn = document.getElementById("btnApplyPromo");
  const promoInput = document.getElementById("promoCodeInput");

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        showToast("Please enter a promo code.", "info");
        return;
      }

      if (code === "DRIVE15") {
        appliedPromoCode = "DRIVE15";
        showToast("Promo DRIVE15 applied: 15% discount!", "success");
      } else if (code === "WELCOME") {
        appliedPromoCode = "WELCOME";
        showToast("Promo WELCOME applied: ₹500 discount!", "success");
      } else {
        showToast("Invalid coupon code. Try DRIVE15 for 15% off.", "error");
        appliedPromoCode = "";
      }
      recalculateBookingPricing();
    });
  }
}

// Real-Time Pricing Calculation Engine
function recalculateBookingPricing() {
  if (!currentBookingCar) return;

  const pickupInput = document.getElementById("bookingPickupDate");
  const returnInput = document.getElementById("bookingReturnDate");

  if (!pickupInput || !returnInput) return;

  const pDate = new Date(pickupInput.value);
  const rDate = new Date(returnInput.value);

  const diffTime = rDate - pDate;
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (isNaN(days) || days < 1) days = 1;

  // Update Duration Badge
  const durationBadge = document.getElementById("durationDaysBadge");
  if (durationBadge) durationBadge.textContent = `${days} Day${days > 1 ? "s" : ""}`;

  // 1. Base Fare
  const dailyRate = currentBookingCar.pricePerDay;
  const baseRental = dailyRate * days;

  // 2. Add-ons
  const insuranceCb = document.getElementById("addonInsurance");
  const roadsideCb = document.getElementById("addonRoadside");
  const driverCb = document.getElementById("addonDriver");

  let insuranceFee = (insuranceCb && insuranceCb.checked) ? (499 * days) : 0;
  let roadsideFee = (roadsideCb && roadsideCb.checked) ? 299 : 0;
  let extraDriverFee = (driverCb && driverCb.checked) ? 399 : 0;
  let totalAddons = insuranceFee + roadsideFee + extraDriverFee;

  // 3. Service Fee / GST (5%)
  const serviceFee = Math.round(baseRental * 0.05);

  // 4. Promo Discount
  let discount = 0;
  if (appliedPromoCode === "DRIVE15") {
    discount = Math.round(baseRental * 0.15);
  } else if (appliedPromoCode === "WELCOME") {
    discount = 500;
  }
  appliedPromoDiscount = discount;

  // 5. Refundable Security Deposit
  const deposit = currentBookingCar.deposit || 3500;

  // 6. Total Amount
  const totalPayable = baseRental + totalAddons + serviceFee - discount;

  // Update DOM Summary
  const baseDisplay = document.getElementById("summaryBaseRental");
  const daysDisplay = document.getElementById("summaryDaysCount");
  const insuranceDisplay = document.getElementById("summaryInsuranceFee");
  const serviceDisplay = document.getElementById("summaryServiceFee");
  const discountRow = document.getElementById("summaryDiscountRow");
  const discountDisplay = document.getElementById("summaryDiscountAmount");
  const depositDisplay = document.getElementById("summaryDepositAmount");
  const totalDisplay = document.getElementById("summaryTotalAmount");

  if (baseDisplay) baseDisplay.textContent = formatINR(baseRental);
  if (daysDisplay) daysDisplay.textContent = `${days} × ${formatINR(dailyRate)}`;
  if (insuranceDisplay) insuranceDisplay.textContent = formatINR(totalAddons);
  if (serviceDisplay) serviceDisplay.textContent = formatINR(serviceFee);

  if (discountRow) {
    if (discount > 0) {
      discountRow.style.display = "flex";
      if (discountDisplay) discountDisplay.textContent = `-${formatINR(discount)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  if (depositDisplay) depositDisplay.textContent = formatINR(deposit);
  if (totalDisplay) totalDisplay.textContent = formatINR(totalPayable);

  // Return calculation bundle
  return {
    days,
    dailyRate,
    baseRental,
    insuranceFee: totalAddons,
    serviceFee,
    discount,
    deposit,
    totalPayable
  };
}

// Handle Booking Form Submit
function handleBookingSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("custFullName");
  const emailInput = document.getElementById("custEmail");
  const phoneInput = document.getElementById("custPhone");
  const pickupLoc = document.getElementById("bookingPickupLocation").value;
  const returnLoc = document.getElementById("bookingReturnLocation").value;
  const pickupDate = document.getElementById("bookingPickupDate").value;
  const pickupTime = document.getElementById("bookingPickupTime").value;
  const returnDate = document.getElementById("bookingReturnDate").value;
  const returnTime = document.getElementById("bookingReturnTime").value;

  if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
    showToast("Please fill in all driver details.", "error");
    return;
  }

  // Get selected payment tab
  const activePaymentBtn = document.querySelector(".payment-tab-btn.active");
  const paymentMethod = activePaymentBtn ? activePaymentBtn.textContent.trim() : "Pay on Pickup";

  const calc = recalculateBookingPricing();

  // Generate Booking ID
  const bookingId = "DE-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);

  const newBooking = {
    id: bookingId,
    carId: currentBookingCar.id,
    carName: currentBookingCar.name,
    carBrand: currentBookingCar.brand,
    category: currentBookingCar.category,
    image: currentBookingCar.image,
    customerName: nameInput.value.trim(),
    customerEmail: emailInput.value.trim(),
    customerPhone: phoneInput.value.trim(),
    pickupLocation: pickupLoc,
    returnLocation: returnLoc,
    pickupDate: pickupDate,
    pickupTime: pickupTime,
    returnDate: returnDate,
    returnTime: returnTime,
    days: calc.days,
    rate: calc.dailyRate,
    baseAmount: calc.baseRental,
    insurance: calc.insuranceFee,
    tax: calc.serviceFee,
    discount: calc.discount,
    totalAmount: calc.totalPayable,
    deposit: calc.deposit,
    paymentMethod: paymentMethod + " (Demo)",
    status: "Confirmed",
    bookedAt: new Date().toISOString()
  };

  // Save to LocalStorage
  const bookings = JSON.parse(localStorage.getItem("driveease_bookings")) || [];
  bookings.unshift(newBooking);
  localStorage.setItem("driveease_bookings", JSON.stringify(bookings));

  // Show Success Modal
  showBookingSuccessModal(newBooking);
}

// Display Booking Confirmation Voucher Modal
function showBookingSuccessModal(booking) {
  const modalEl = document.getElementById("bookingSuccessModal");
  if (!modalEl) return;

  document.getElementById("voucherBookingId").textContent = booking.id;
  document.getElementById("voucherCarName").textContent = booking.carName;
  document.getElementById("voucherDates").textContent = `${booking.pickupDate} to ${booking.returnDate} (${booking.days} Days)`;
  document.getElementById("voucherPickup").textContent = booking.pickupLocation;
  document.getElementById("voucherTotal").textContent = formatINR(booking.totalAmount);
  document.getElementById("voucherPayment").textContent = booking.paymentMethod;

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

document.addEventListener("DOMContentLoaded", initBookingPage);
