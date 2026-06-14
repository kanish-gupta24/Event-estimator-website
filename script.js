// State Variables
let currentGuests = 250;
let currentTypeMultiplier = 1.2;
let currentVenueMultiplier = 1.0; // NEW
let currentFoodMultiplier = 1.0; // NEW
let currentTierMultiplier = 1.5;
let currentTotal = 0;

// Base Rates
const baseVenueRate = 50000;
const baseCateringPerPerson = 500;
const baseDecorRate = 30000;

// DOM Elements
const venueCostEl = document.getElementById("venueCost");
const cateringCostEl = document.getElementById("cateringCost");
const decorCostEl = document.getElementById("decorCost");
const totalCostEl = document.getElementById("totalCost");

const formatCurrency = (amount) => amount.toLocaleString("en-IN");

const calculateCosts = () => {
  // Math updated with the new multipliers!
  const venue =
    baseVenueRate *
    currentTierMultiplier *
    currentTypeMultiplier *
    currentVenueMultiplier;
  const catering =
    currentGuests *
    baseCateringPerPerson *
    currentTierMultiplier *
    currentFoodMultiplier;
  const decor = baseDecorRate * currentTierMultiplier * currentTypeMultiplier;
  const newTotal = venue + catering + decor;

  venueCostEl.innerText = `₹ ${formatCurrency(Math.floor(venue))}`;
  cateringCostEl.innerText = `₹ ${formatCurrency(Math.floor(catering))}`;
  decorCostEl.innerText = `₹ ${formatCurrency(Math.floor(decor))}`;

  // Animate Number
  let start = currentTotal;
  let end = newTotal;
  let startTime = null;
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    let progress = Math.min((timestamp - startTime) / 500, 1);
    totalCostEl.innerText = formatCurrency(
      Math.floor(progress * (end - start) + start)
    );
    if (progress < 1) window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);
  currentTotal = newTotal;
};

// Event Listeners
document.getElementById("guestSlider").addEventListener("input", (e) => {
  currentGuests = e.target.value;
  document.getElementById("guestCount").innerText = currentGuests;
  calculateCosts();
});

// Event Type Buttons
document.querySelectorAll(".type-btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".type-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentTypeMultiplier = parseFloat(e.target.dataset.type);
    calculateCosts();
  })
);

// NEW: Venue Style Buttons
document.querySelectorAll(".venue-btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".venue-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentVenueMultiplier = parseFloat(e.target.dataset.venue);
    calculateCosts();
  })
);

// NEW: Catering Preference Buttons
document.querySelectorAll(".food-btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".food-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFoodMultiplier = parseFloat(e.target.dataset.food);
    calculateCosts();
  })
);

// Tier Cards
document.querySelectorAll(".tier-card").forEach((card) =>
  card.addEventListener("click", (e) => {
    document
      .querySelectorAll(".tier-card")
      .forEach((c) => c.classList.remove("active"));
    e.target.closest(".tier-card").classList.add("active");
    currentTierMultiplier = parseFloat(
      e.target.closest(".tier-card").dataset.tier
    );
    calculateCosts();
  })
);

// PDF Generation
document.getElementById("downloadBtn").addEventListener("click", () => {
  document.getElementById("pdfDate").innerText = new Date().toLocaleDateString(
    "en-IN"
  );

  // Grab text from active buttons
  document.getElementById("pdfType").innerText =
    document.querySelector(".type-btn.active").innerText;
  document.getElementById("pdfVenueName").innerText =
    document.querySelector(".venue-btn.active").innerText; // NEW
  document.getElementById("pdfFoodName").innerText =
    document.querySelector(".food-btn.active").innerText; // NEW

  document.getElementById("pdfGuests").innerText = currentGuests;
  document.getElementById("pdfTier").innerText = document.querySelector(
    ".tier-card.active h3"
  ).innerText;

  // Set Prices
  document.getElementById("pdfVenue").innerText = venueCostEl.innerText;
  document.getElementById("pdfCatering").innerText = cateringCostEl.innerText;
  document.getElementById("pdfDecor").innerText = decorCostEl.innerText;
  document.getElementById("pdfTotal").innerText = `₹ ${totalCostEl.innerText}`;

  // Update Formulas
  document.getElementById(
    "pdfVenueFormula"
  ).innerText = `Base: ${formatCurrency( baseVenueRate )} × ${currentTierMultiplier} (Tier) × ${currentTypeMultiplier} (Event) × ${currentVenueMultiplier} (Venue)`;
  document.getElementById(
    "pdfCateringFormula"
  ).innerText = `Guests: ${currentGuests} × ₹${baseCateringPerPerson} × ${currentTierMultiplier} (Tier) × ${currentFoodMultiplier} (Food)`;
  document.getElementById(
    "pdfDecorFormula"
  ).innerText = `Base: ${formatCurrency( baseDecorRate )} × ${currentTierMultiplier} (Tier) × ${currentTypeMultiplier} (Event)`;

  window.print();
});

// Run on load
calculateCosts();