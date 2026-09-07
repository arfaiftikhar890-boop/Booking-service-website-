import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


 const firebaseConfig = {
    apiKey: "AIzaSyArDCvu1a692lmwB6vJb7UXFJ9d3Jny-ew",
    authDomain: "service-booking-app-55580.firebaseapp.com",
    databaseURL: "https://service-booking-app-55580-default-rtdb.firebaseio.com",
    projectId: "service-booking-app-55580",
    storageBucket: "service-booking-app-55580.firebasestorage.app",
    messagingSenderId: "883668704888",
    appId: "1:883668704888:web:cfe1f2eab71ea4bb63978d",
    measurementId: "G-JVZZ70LRXG"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function isFirebaseConfigured() {
  return !Object.values(firebaseConfig).some((value) => typeof value === "string" && value.startsWith("YOUR_"));
}

const ADMIN_EMAIL = "adminservicehub@gmail.com";
const ADMIN_PASSWORD = "arfaahsan";




const PROVIDERS = [
 
  { providerId: "provider_1", name: "Ali Plumbing", category: "Plumbing", location: "Gulshan-e-Iqbal, Karachi", experience: "8 years", price: "Rs. 1,500", rating: 4.8, about: "Professional plumber specializing in pipe repair, leakage problems, bathroom fittings, and home plumbing services.", icon: "fa-wrench" },
  { providerId: "provider_2", name: "Karachi Pipe Works", category: "Plumbing", location: "DHA, Karachi", experience: "12 years", price: "Rs. 1,800", rating: 4.6, about: "Full-service plumbing team handling leak detection, drain cleaning, and bathroom renovations.", icon: "fa-wrench" },
  { providerId: "provider_3", name: "FastFix Plumbers", category: "Plumbing", location: "North Nazimabad, Karachi", experience: "5 years", price: "Rs. 1,200", rating: 4.5, about: "Quick-response plumbers for urgent leaks, blocked drains, and tap or fitting replacements.", icon: "fa-wrench" },
  { providerId: "provider_4", name: "Al-Madina Plumbing", category: "Plumbing", location: "Malir, Karachi", experience: "10 years", price: "Rs. 1,600", rating: 4.7, about: "Trusted neighborhood plumbers known for tidy work and fair pricing on repairs big and small.", icon: "fa-wrench" },
  { providerId: "provider_5", name: "Metro Plumbing Co.", category: "Plumbing", location: "Saddar, Karachi", experience: "6 years", price: "Rs. 1,400", rating: 4.4, about: "Modern plumbing solutions for apartments and offices, including water heater installs.", icon: "fa-wrench" },

 
  { providerId: "provider_6", name: "Ahmed Electric", category: "Electrical", location: "Gulshan-e-Iqbal, Karachi", experience: "5 years", price: "Rs. 2,000", rating: 4.7, about: "Experienced electrician providing safe home electrical repairs, wiring, installations, and troubleshooting.", icon: "fa-bolt" },
  { providerId: "provider_7", name: "BrightSpark Electricians", category: "Electrical", location: "Clifton, Karachi", experience: "9 years", price: "Rs. 2,400", rating: 4.8, about: "Licensed electricians for rewiring, panel upgrades, and lighting installation projects.", icon: "fa-bolt" },
  { providerId: "provider_8", name: "SafeWire Electric", category: "Electrical", location: "PECHS, Karachi", experience: "7 years", price: "Rs. 2,100", rating: 4.6, about: "Safety-first electrical repairs with a focus on fixing faulty wiring and tripping breakers.", icon: "fa-bolt" },
  { providerId: "provider_9", name: "PowerLine Electric", category: "Electrical", location: "Korangi, Karachi", experience: "4 years", price: "Rs. 1,800", rating: 4.4, about: "Affordable electrical services for switches, sockets, fans, and small home installations.", icon: "fa-bolt" },
  { providerId: "provider_10", name: "Al-Falah Electric", category: "Electrical", location: "North Nazimabad, Karachi", experience: "11 years", price: "Rs. 2,500", rating: 4.9, about: "Senior electrician team handling commercial and residential wiring with a strong track record.", icon: "fa-bolt" },

 
  { providerId: "provider_11", name: "CleanPro Services", category: "Home Cleaning", location: "Gulshan-e-Iqbal, Karachi", experience: "4 years", price: "Rs. 1,200", rating: 4.6, about: "Professional home cleaning services for apartments, houses, kitchens, and deep cleaning.", icon: "fa-broom" },
  { providerId: "provider_12", name: "SparkleHome Cleaning", category: "Home Cleaning", location: "DHA, Karachi", experience: "6 years", price: "Rs. 1,500", rating: 4.7, about: "Detail-oriented cleaning crew offering weekly, monthly, and one-time deep clean packages.", icon: "fa-broom" },
  { providerId: "provider_13", name: "FreshStart Cleaners", category: "Home Cleaning", location: "Clifton, Karachi", experience: "3 years", price: "Rs. 1,000", rating: 4.3, about: "Budget-friendly cleaning for small apartments and studios, done quickly and reliably.", icon: "fa-broom" },
  { providerId: "provider_14", name: "Karachi Maid Services", category: "Home Cleaning", location: "Malir, Karachi", experience: "8 years", price: "Rs. 1,400", rating: 4.8, about: "Trained cleaning staff for homes and offices, including move-in/move-out deep cleans.", icon: "fa-broom" },
  { providerId: "provider_15", name: "ShineRight Cleaning", category: "Home Cleaning", location: "Saddar, Karachi", experience: "5 years", price: "Rs. 1,300", rating: 4.5, about: "Eco-friendly cleaning products used for kitchens, bathrooms, and full-house cleans.", icon: "fa-broom" },

 
  { providerId: "provider_16", name: "Paint Masters", category: "Painting", location: "Gulshan-e-Iqbal, Karachi", experience: "10 years", price: "Rs. 3,000", rating: 4.9, about: "Experienced painting professionals providing interior and exterior painting services.", icon: "fa-paint-roller" },
  { providerId: "provider_17", name: "ColorCraft Painters", category: "Painting", location: "DHA, Karachi", experience: "7 years", price: "Rs. 2,600", rating: 4.6, about: "Skilled painters offering texture work, accent walls, and full-home repainting.", icon: "fa-paint-roller" },
  { providerId: "provider_18", name: "Karachi Wall Art", category: "Painting", location: "PECHS, Karachi", experience: "5 years", price: "Rs. 2,200", rating: 4.5, about: "Creative painting team for homes and offices, from single rooms to full buildings.", icon: "fa-paint-roller" },
  { providerId: "provider_19", name: "PrimeCoat Painting", category: "Painting", location: "North Nazimabad, Karachi", experience: "9 years", price: "Rs. 2,800", rating: 4.7, about: "Premium paint finishes with proper surface prep and waterproofing options.", icon: "fa-paint-roller" },
  { providerId: "provider_20", name: "UrbanBrush Painters", category: "Painting", location: "Korangi, Karachi", experience: "4 years", price: "Rs. 2,000", rating: 4.4, about: "Affordable, fast painting crews for apartments, offices, and rental properties.", icon: "fa-paint-roller" },

  
  { providerId: "provider_21", name: "TechFix", category: "Computer Repair", location: "Gulshan-e-Iqbal, Karachi", experience: "6 years", price: "Rs. 2,500", rating: 4.7, about: "Professional laptop and computer repair services including hardware and software troubleshooting.", icon: "fa-laptop" },
  { providerId: "provider_22", name: "ByteRescue Computers", category: "Computer Repair", location: "Clifton, Karachi", experience: "8 years", price: "Rs. 2,800", rating: 4.8, about: "Data recovery, virus removal, and hardware upgrades for laptops and desktops.", icon: "fa-laptop" },
  { providerId: "provider_23", name: "QuickFix IT", category: "Computer Repair", location: "Saddar, Karachi", experience: "3 years", price: "Rs. 1,800", rating: 4.3, about: "Same-day computer repair for screen replacements, slow PCs, and software issues.", icon: "fa-laptop" },
  { providerId: "provider_24", name: "Karachi PC Doctor", category: "Computer Repair", location: "North Nazimabad, Karachi", experience: "10 years", price: "Rs. 3,000", rating: 4.9, about: "Veteran technicians handling everything from motherboard repair to network setup.", icon: "fa-laptop" },
  { providerId: "provider_25", name: "DataSafe Repairs", category: "Computer Repair", location: "Malir, Karachi", experience: "5 years", price: "Rs. 2,200", rating: 4.5, about: "Specialists in data backup, recovery, and secure computer servicing.", icon: "fa-laptop" },

  
  { providerId: "provider_26", name: "Cool Air Services", category: "AC Repair", location: "Gulshan-e-Iqbal, Karachi", experience: "7 years", price: "Rs. 2,000", rating: 4.8, about: "Reliable AC installation, repair, servicing, and cooling system troubleshooting.", icon: "fa-wind" },
  { providerId: "provider_27", name: "ChillTech AC", category: "AC Repair", location: "DHA, Karachi", experience: "9 years", price: "Rs. 2,300", rating: 4.7, about: "Split and window AC repair, gas refilling, and annual maintenance contracts.", icon: "fa-wind" },
  { providerId: "provider_28", name: "Karachi Cooling Experts", category: "AC Repair", location: "PECHS, Karachi", experience: "12 years", price: "Rs. 2,600", rating: 4.9, about: "Senior AC technicians serving homes and offices with fast, guaranteed repairs.", icon: "fa-wind" },
  { providerId: "provider_29", name: "ArcticFix AC Repair", category: "AC Repair", location: "Korangi, Karachi", experience: "4 years", price: "Rs. 1,700", rating: 4.4, about: "Affordable AC repair and servicing for households across Karachi.", icon: "fa-wind" },
  { providerId: "provider_30", name: "BreezeCare AC", category: "AC Repair", location: "Malir, Karachi", experience: "6 years", price: "Rs. 1,900", rating: 4.6, about: "Friendly, on-time AC technicians for installation, repair, and gas top-ups.", icon: "fa-wind" },
];

const CATEGORIES = ["All", "Plumbing", "Electrical", "Home Cleaning", "Painting", "Computer Repair", "AC Repair"];


const PROVIDER_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Home Cleaning",
  "AC Repair",
  "Painting",
  "Computer Repair",
  "Appliance Repair",
  "Carpentry",
  "Moving Help",
  "Other",
];
const CATEGORY_ICONS = {
  Plumbing: "fa-wrench",
  Electrical: "fa-bolt",
  "Home Cleaning": "fa-broom",
  "AC Repair": "fa-wind",
  Painting: "fa-paint-roller",
  "Computer Repair": "fa-laptop",
  "Appliance Repair": "fa-blender",
  Carpentry: "fa-hammer",
  "Moving Help": "fa-truck-fast",
  Other: "fa-toolbox",
};

const SERVICES_BY_CATEGORY = {
  Plumbing: ["Pipe Repair", "Leakage Repair", "Bathroom Fittings", "Drain Cleaning", "Water Tank Services", "Tap Repair"],
  Electrical: ["Wiring", "Switch Repair", "Fan Installation", "Light Installation", "Circuit Repair", "Electrical Troubleshooting"],
  "Home Cleaning": ["Home Cleaning", "Deep Cleaning", "Kitchen Cleaning", "Bathroom Cleaning", "Office Cleaning"],
  "AC Repair": ["AC Installation", "Gas Refilling", "AC Servicing", "Cooling Troubleshooting"],
  Painting: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing"],
  "Computer Repair": ["Hardware Repair", "Software Troubleshooting", "Data Recovery", "Virus Removal", "Network Setup"],
  "Appliance Repair": ["Washing Machine Repair", "Fridge Repair", "Microwave Repair", "Oven Repair"],
  Carpentry: ["Furniture Repair", "Custom Furniture", "Door/Window Fixing", "Wood Polishing"],
  "Moving Help": ["Packing", "Loading/Unloading", "Local Moving", "Furniture Assembly"],
  Other: ["General Help"],
};

async function seedProvidersInRealtimeDB() {
  if (!isFirebaseConfigured()) return; 
  try {
    const firstProviderSnap = await get(ref(db, "providers/provider_1"));
    if (firstProviderSnap.exists()) return; 

  
    const providersById = {};
    PROVIDERS.forEach((p) => {
      providersById[p.providerId] = {
        ...p,
        professionalTitle: `Professional ${p.category}`,
        startingPrice: parsePriceToNumber(p.price),
        services: SERVICES_BY_CATEGORY[p.category] ? SERVICES_BY_CATEGORY[p.category].slice(0, 3) : [],
        availability: "available",
        totalReviews: 0,
        status: "approved", 
        active: true,
        profileCompletion: 100,
        createdAt: Date.now(),
      };
    });

    await update(ref(db, "providers"), providersById);
    console.log("Providers seeded into the Realtime Database.");
  } catch (err) {
 
    console.warn("Could not seed providers (is Firebase configured yet?):", err.message);
  }
}


async function seedCommissionSettingsIfMissing() {
  if (!isFirebaseConfigured()) return;
  try {
    const snap = await get(ref(db, "adminSettings/commission"));
    if (snap.exists()) return;
    await set(ref(db, "adminSettings/commission"), { type: "fixed", amount: 200, updatedAt: Date.now() });
  } catch (err) {
    console.warn("Could not seed commission settings:", err.message);
  }
}


let unsubscribeCommissionSettings = null;
function subscribeToCommissionSettings() {
  if (!isFirebaseConfigured()) return;
  unsubscribeCommissionSettings = onValue(ref(db, "adminSettings/commission"), (snapshot) => {
    if (snapshot.exists()) state.commissionSettings = snapshot.val();
    render();
  });
}



const state = {
  currentPage: "welcome", 
  mobileMenuOpen: false,

  authTab: "login", 

  currentUser: null, 
  authChecked: false, 

  selectedProviderId: null, 

  searchQuery: "",
  filterCategory: "All",

  
  providers: PROVIDERS.slice(),

  
  commissionSettings: { type: "fixed", amount: 200 },
  bookings: [], 
  bookingsLoading: false,
  providerTab: "All", 

  reviewModalBookingId: null, 
  reviewStars: 0,

  
  myProviderProfile: null, 
  myReviews: [], 
  profileFormCategory: null, 
  profileFormMode: "create", 


  adminTab: "dashboard", 
  adminSidebarOpen: false, 
  allProviders: [], 
  allBookingsAdmin: [], 
  allUsers: [], 
  allCommissions: [],
  adminSearch: "",
  adminStatusFilter: "All",
  adminCategoryFilter: "All",
  adminBookingStatusFilter: "All",
  adminPaymentFilter: "All", 
  reasonModal: null, 
  deactivateModalOpen: false, 
  reviewProfileProviderId: null, 

  
  chatModalBookingId: null, 
  chatMessages: [], 

 
  paymentModalConfig: null, 
  paymentReceiptDataUrl: null, 
  allPayments: [], 
  myPaymentsAsProvider: [], 
  myPaymentsAsCustomer: [], 
  incomingCustomerPayments: [], 

  loadingMessage: null, 
  errorMessage: null,
  successMessage: null,
  toasts: [], 
};




function generateBookingId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 8; i++) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BOOK-${randomPart}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function findProviderById(providerId) {
 
  return state.providers.find((p) => p.providerId === providerId) || PROVIDERS.find((p) => p.providerId === providerId) || null;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


const ALLOWED_TRANSITIONS = {
  Pending: ["Accepted", "Rejected"],
  Accepted: ["In Progress"],
  "In Progress": ["Completed"],
  Completed: [],
  Rejected: [],
};

function starsHtml(rating, opts = {}) {
  const clickable = !!opts.clickable;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    html += `<i class="fa-solid fa-star star ${filled ? "filled" : ""} ${clickable ? "clickable" : ""}"
                ${clickable ? `data-action="set-review-star" data-star="${i}"` : ""}></i>`;
  }
  return html;
}

function statusBadgeHtml(status) {
  const map = {
    Pending: "badge-pending",
    Accepted: "badge-accepted",
    "In Progress": "badge-inprogress",
    Completed: "badge-completed",
    Rejected: "badge-rejected",
  };
  return `<span class="badge ${map[status] || ""}">${status}</span>`;
}

function clearMessages() {
  state.errorMessage = null;
  state.successMessage = null;
}

function messageBannerHtml() {
  if (state.errorMessage) {
    return `<div class="alert alert-error fade-up"><i class="fa-solid fa-circle-exclamation"></i> ${state.errorMessage}</div>`;
  }
  if (state.successMessage) {
    return `<div class="alert alert-success fade-up"><i class="fa-solid fa-circle-check"></i> ${state.successMessage}</div>`;
  }
  return "";
}


function parsePriceToNumber(priceLike) {
  if (typeof priceLike === "number") return priceLike;
  if (!priceLike) return 0;
  const digitsOnly = String(priceLike).replace(/[^0-9]/g, "");
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

function formatRupees(amount) {
  return "Rs. " + Math.round(amount || 0).toLocaleString("en-PK");
}


function isAdmin() {
  return state.currentUser?.role === "admin";
}


function calculateProfileCompletion(p) {
  if (!p) return 0;
  let score = 0;
  if (p.name && p.phone) score += 20; 
  if (p.category && p.professionalTitle) score += 25; 
  if (Array.isArray(p.services) && p.services.length > 0) score += 20; 
  if (p.experience && p.startingPrice) score += 15; 
  if (p.city && p.serviceLocation) score += 10; 
  if (p.about && p.about.trim().length > 0) score += 10;
  return score;
}


function calculateCommission(price, commissionSettings) {
  const amount = commissionSettings?.amount ?? 200; 
  const adminCommission = Math.min(amount, price); 
  const providerEarning = price - adminCommission;
  return { adminCommission, providerEarning };
}


let toastCounter = 0;
function showToast(message, kind = "success") {
  const id = ++toastCounter;
  state.toasts.push({ id, message, kind });
  render();
  setTimeout(() => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
    render();
  }, 3500);
}

function toastContainerHtml() {
  if (state.toasts.length === 0) return "";
  return `<div class="toast-stack">
    ${state.toasts
      .map(
        (t) => `<div class="toast toast-${t.kind}">
          <i class="fa-solid ${t.kind === "success" ? "fa-circle-check" : t.kind === "error" ? "fa-circle-exclamation" : "fa-info-circle"}"></i>
          ${t.message}
        </div>`
      )
      .join("")}
  </div>`;
}



function verifiedSealSvg() {
  return `
  <svg class="verified-badge" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#f5a524"/>
    <circle cx="20" cy="20" r="18" fill="none" stroke="#c9820f" stroke-width="1.5"/>
    <path d="M13 20.5l4.2 4.2L27 15" fill="none" stroke="#2a1500" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function neighborhoodIllustrationSvg() {
  
  return `
  <svg viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <defs>
      <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f6a63"/>
        <stop offset="100%" stop-color="#0b4f4a"/>
      </linearGradient>
    </defs>
    <rect width="460" height="300" fill="url(#skyFade)" rx="0"/>
    <!-- rooftops -->
    <g opacity="0.9">
      <path d="M20 210 L90 150 L160 210 Z" fill="#0d5f58"/>
      <rect x="35" y="210" width="120" height="55" fill="#0e6a62"/>
      <path d="M140 220 L230 130 L320 220 Z" fill="#127a70"/>
      <rect x="155" y="220" width="150" height="60" fill="#147d73"/>
      <path d="M280 215 L350 160 L420 215 Z" fill="#0d5f58"/>
      <rect x="295" y="215" width="110" height="55" fill="#0e6a62"/>
    </g>
    <!-- windows -->
    <g fill="#f5a524" opacity="0.85">
      <rect x="55" y="225" width="14" height="14" rx="2"/>
      <rect x="120" y="225" width="14" height="14" rx="2"/>
      <rect x="190" y="240" width="16" height="16" rx="2"/>
      <rect x="250" y="240" width="16" height="16" rx="2"/>
      <rect x="315" y="228" width="14" height="14" rx="2"/>
      <rect x="375" y="228" width="14" height="14" rx="2"/>
    </g>
    <!-- floating shield / trust mark -->
    <g transform="translate(230,95)">
      <path d="M0 -38 L34 -22 L34 8 C34 34 17 50 0 58 C-17 50 -34 34 -34 8 L-34 -22 Z" fill="#ffffff" opacity="0.97"/>
      <path d="M-14 4 L-3 15 L18 -10" fill="none" stroke="#0b4f4a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;
}



function navigateTo(page, extra = {}) {
  clearMessages();
  state.currentPage = page;
  state.mobileMenuOpen = false;
  if (extra.providerId !== undefined) state.selectedProviderId = extra.providerId;

  if (page === "providerProfileForm") state.profileFormCategory = null;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });

}


let unsubscribeBookings = null; 

function subscribeToBookingsForCurrentUser() {
 
  if (unsubscribeBookings) {
    unsubscribeBookings();
    unsubscribeBookings = null;
  }

  if (!state.currentUser) return;

  if (!isFirebaseConfigured()) {
    state.errorMessage = "Firebase isn't configured yet, so bookings can't be loaded. See script.js SECTION 1.";
    state.bookingsLoading = false;
    render();
    return;
  }

  state.bookingsLoading = true;
  render();

  const field = state.currentUser.role === "provider" ? "providerId" : "customerId";
  const idValue = state.currentUser.role === "provider" ? state.currentUser.providerId : state.currentUser.uid;
  const bookingsQuery = query(ref(db, "bookings"), orderByChild(field), equalTo(idValue));

 
  unsubscribeBookings = onValue(
    bookingsQuery,
    (snapshot) => {
      const bookings = [];
      const value = snapshot.val() || {};
      Object.keys(value).forEach((key) => bookings.push({ docId: key, ...value[key] }));
      bookings.sort((a, b) => (b.createdAtMillis || 0) - (a.createdAtMillis || 0)); 

      state.bookings = bookings;
      state.bookingsLoading = false;
      render();
    },
    (err) => {
  
      state.errorMessage = "Could not load bookings: " + err.message;
      state.bookingsLoading = false;
      render();
    }
  );
}

function unsubscribeFromBookings() {
  if (unsubscribeBookings) {
    unsubscribeBookings();
    unsubscribeBookings = null;
  }
}



let unsubscribeApprovedProviders = null;


function subscribeToApprovedProviders() {
  if (!isFirebaseConfigured()) return;
  const approvedQuery = query(ref(db, "providers"), orderByChild("status"), equalTo("approved"));
  unsubscribeApprovedProviders = onValue(approvedQuery, (snapshot) => {
    const value = snapshot.val() || {};
    const list = Object.keys(value)
      .map((key) => ({ ...value[key], providerId: value[key].providerId || key }))
      .filter((p) => p.active !== false); // extra safety net alongside the status filter
    state.providers = list.length > 0 ? list : PROVIDERS.slice();
    render();
  });
}

let unsubscribeMyProviderProfile = null;


function subscribeToMyProviderProfile() {
  if (unsubscribeMyProviderProfile) {
    unsubscribeMyProviderProfile();
    unsubscribeMyProviderProfile = null;
  }
  if (!state.currentUser || state.currentUser.role !== "provider" || !isFirebaseConfigured()) return;

  unsubscribeMyProviderProfile = onValue(ref(db, `providers/${state.currentUser.providerId}`), (snapshot) => {
    state.myProviderProfile = snapshot.exists() ? { ...snapshot.val(), providerId: state.currentUser.providerId } : null;

    
    if (state.myProviderProfile?.status === "blocked" && state.currentPage !== "blocked") {
      state.currentPage = "blocked";
    }
    render();
  });
}

let unsubscribeMyReviews = null;


function subscribeToMyReviews() {
  if (unsubscribeMyReviews) {
    unsubscribeMyReviews();
    unsubscribeMyReviews = null;
  }
  if (!state.currentUser || state.currentUser.role !== "provider" || !isFirebaseConfigured()) return;

  const reviewsQuery = query(ref(db, "reviews"), orderByChild("providerId"), equalTo(state.currentUser.providerId));
  unsubscribeMyReviews = onValue(reviewsQuery, (snapshot) => {
    const value = snapshot.val() || {};
    const list = Object.keys(value).map((key) => ({ reviewId: key, ...value[key] }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    state.myReviews = list;
    render();
  });
}

let unsubscribeAdminProviders = null;
let unsubscribeAdminBookings = null;
let unsubscribeAdminUsers = null;
let unsubscribeAdminCommissions = null;


function subscribeToAdminData() {
  if (!isAdmin() || !isFirebaseConfigured()) return;

  unsubscribeAdminProviders = onValue(ref(db, "providers"), (snapshot) => {
    const value = snapshot.val() || {};
    state.allProviders = Object.keys(value).map((key) => ({ ...value[key], providerId: value[key].providerId || key }));
    render();
  });

  unsubscribeAdminBookings = onValue(ref(db, "bookings"), (snapshot) => {
    const value = snapshot.val() || {};
    state.allBookingsAdmin = Object.keys(value).map((key) => ({ docId: key, ...value[key] }));
    state.allBookingsAdmin.sort((a, b) => (b.createdAtMillis || 0) - (a.createdAtMillis || 0));
    render();
  });

  unsubscribeAdminUsers = onValue(ref(db, "users"), (snapshot) => {
    const value = snapshot.val() || {};
    state.allUsers = Object.keys(value).map((key) => ({ uid: key, ...value[key] }));
    render();
  });

  unsubscribeAdminCommissions = onValue(ref(db, "commissions"), (snapshot) => {
    const value = snapshot.val() || {};
    state.allCommissions = Object.keys(value).map((key) => ({ commissionId: key, ...value[key] }));
    state.allCommissions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    render();
  });
}

function unsubscribeFromAdminData() {
  [unsubscribeAdminProviders, unsubscribeAdminBookings, unsubscribeAdminUsers, unsubscribeAdminCommissions].forEach(
    (unsub) => unsub && unsub()
  );
  unsubscribeAdminProviders = unsubscribeAdminBookings = unsubscribeAdminUsers = unsubscribeAdminCommissions = null;
}

function unsubscribeFromMyProviderData() {
  if (unsubscribeMyProviderProfile) {
    unsubscribeMyProviderProfile();
    unsubscribeMyProviderProfile = null;
  }
  if (unsubscribeMyReviews) {
    unsubscribeMyReviews();
    unsubscribeMyReviews = null;
  }
}



let unsubscribeChat = null;

function openChat(bookingId) {
  state.chatModalBookingId = bookingId;
  state.chatMessages = [];
  clearMessages();
  render();
  subscribeToChatMessages(bookingId);
}

function subscribeToChatMessages(bookingId) {
  if (unsubscribeChat) {
    unsubscribeChat();
    unsubscribeChat = null;
  }
  if (!isFirebaseConfigured()) return;

  unsubscribeChat = onValue(ref(db, `chats/${bookingId}/messages`), (snapshot) => {
    const value = snapshot.val() || {};
    const list = Object.keys(value).map((key) => ({ messageId: key, ...value[key] }));
    list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); 
    state.chatMessages = list;
    render();

    const box = document.getElementById("chat-messages-box");
    if (box) box.scrollTop = box.scrollHeight;
  });
}

function closeChat() {
  if (unsubscribeChat) {
    unsubscribeChat();
    unsubscribeChat = null;
  }
  state.chatModalBookingId = null;
  state.chatMessages = [];
}

async function sendChatMessage(bookingId, text) {
  if (!text.trim()) return;
  try {
    await push(ref(db, `chats/${bookingId}/messages`), {
      senderId: state.currentUser.uid,
      senderName: state.currentUser.name,
      senderRole: state.currentUser.role,
      text: text.trim(),
      createdAt: Date.now(),
    });
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
    render();
  }
}


function compressImageToBase64(file, maxWidth = 700, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load that image file."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

let unsubscribeIncomingPayments = null;
let unsubscribeMyProviderPayments = null;
let unsubscribeMyCustomerPayments = null;
let unsubscribeAllPayments = null;


function subscribeToIncomingPayments() {
  if (!isFirebaseConfigured() || !state.currentUser?.providerId) return;
  const q = query(ref(db, "payments"), orderByChild("providerId"), equalTo(state.currentUser.providerId));
  unsubscribeIncomingPayments = onValue(q, (snapshot) => {
    const value = snapshot.val() || {};
    state.incomingCustomerPayments = Object.keys(value)
      .map((key) => ({ paymentId: key, ...value[key] }))
      .filter((p) => p.type === "customerToProvider");
    render();
  });
}


function subscribeToMyProviderPayments() {
  if (!isFirebaseConfigured() || !state.currentUser?.providerId) return;
  const q = query(ref(db, "payments"), orderByChild("providerId"), equalTo(state.currentUser.providerId));
  unsubscribeMyProviderPayments = onValue(q, (snapshot) => {
    const value = snapshot.val() || {};
    state.myPaymentsAsProvider = Object.keys(value)
      .map((key) => ({ paymentId: key, ...value[key] }))
      .filter((p) => p.type === "providerToAdmin");
    render();
  });
}


function subscribeToMyCustomerPayments() {
  if (!isFirebaseConfigured() || !state.currentUser) return;
  const q = query(ref(db, "payments"), orderByChild("customerId"), equalTo(state.currentUser.uid));
  unsubscribeMyCustomerPayments = onValue(q, (snapshot) => {
    const value = snapshot.val() || {};
    state.myPaymentsAsCustomer = Object.keys(value).map((key) => ({ paymentId: key, ...value[key] }));
    render();
  });
}


function subscribeToAllPayments() {
  if (!isAdmin() || !isFirebaseConfigured()) return;
  unsubscribeAllPayments = onValue(ref(db, "payments"), (snapshot) => {
    const value = snapshot.val() || {};
    state.allPayments = Object.keys(value).map((key) => ({ paymentId: key, ...value[key] }));
    state.allPayments.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
    render();
  });
}

function unsubscribeFromPayments() {
  [unsubscribeIncomingPayments, unsubscribeMyProviderPayments, unsubscribeMyCustomerPayments, unsubscribeAllPayments].forEach(
    (unsub) => unsub && unsub()
  );
  unsubscribeIncomingPayments = unsubscribeMyProviderPayments = unsubscribeMyCustomerPayments = unsubscribeAllPayments = null;
}

async function submitPaymentProof(formData) {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;
  const config = state.paymentModalConfig;
  if (!config) return;

  const method = formData.get("method");
  const reference = formData.get("reference")?.trim();
  const amount = parseInt(formData.get("amount"), 10);

  if (!method) return (state.errorMessage = "Please choose a payment method.");
  if (!reference) return (state.errorMessage = "Please enter a transaction reference or sender number.");
  if (!amount) return (state.errorMessage = "Please enter the amount.");
  if (!state.paymentReceiptDataUrl) return (state.errorMessage = "Please attach a photo of the payment receipt.");

  state.loadingMessage = "Submitting payment proof...";
  render();

  try {
    const booking = config.booking;
    const record = {
      type: config.type,
      bookingId: booking.docId,
      bookingCode: booking.bookingId,
      providerId: booking.providerId,
      providerName: booking.providerName,
      customerId: booking.customerId,
      customerName: booking.customerName,
      service: booking.service,
      amount,
      method,
      reference,
      receiptImage: state.paymentReceiptDataUrl,
      submittedBy: state.currentUser.uid,
      submittedByName: state.currentUser.name,
      status: "pending",
      submittedAt: Date.now(),
    };

    await push(ref(db, "payments"), record);
    await logActivity(
      `${config.type === "providerToAdmin" ? "Platform charges payment" : "Customer payment"} submitted via ${method} for booking ${booking.bookingId}`
    );

    state.successMessage = "Payment proof submitted!";
    state.paymentModalConfig = null;
    state.paymentReceiptDataUrl = null;
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}

async function verifyPayment(paymentId) {
  try {
    await update(ref(db, `payments/${paymentId}`), { status: "verified", verifiedAt: Date.now(), verifiedBy: state.currentUser.uid });
    showToast("Payment marked as verified.", "success");
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
    render();
  }
}


async function createOrUpdateProviderProfile(providerId, profileData, { isResubmission = false } = {}) {
  const completion = calculateProfileCompletion(profileData);
  const dataToSave = {
    ...profileData,
    providerId,
    profileCompletion: completion,
    updatedAt: Date.now(),
  };

  if (isResubmission) {
    dataToSave.status = "pending";
    dataToSave.rejectionReason = null;
  }

  await update(ref(db, `providers/${providerId}`), dataToSave);
}


async function submitProviderProfileForm(formData) {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;

  const name = formData.get("name")?.trim();
  const phone = formData.get("phone")?.trim();
  const cnic = formData.get("cnic")?.trim();
  const city = formData.get("city")?.trim();
  const area = formData.get("area")?.trim();
  const serviceLocation = formData.get("serviceLocation")?.trim();
  const category = formData.get("category");
  const professionalTitle = formData.get("professionalTitle")?.trim();
  const experience = parseInt(formData.get("experience"), 10);
  const startingPrice = parseInt(formData.get("startingPrice"), 10);
  const services = formData.getAll("services");
  const workingHours = formData.get("workingHours")?.trim();
  const availability = formData.get("availability") || "available";
  const about = formData.get("about")?.trim();
  const description = formData.get("description")?.trim();
  const agreeCommission = formData.get("agreeCommission") === "on";

  
  if (!name) return (state.errorMessage = "Please enter your name.");
  if (!phone) return (state.errorMessage = "Please enter your phone number.");
  if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic || "")) return (state.errorMessage = "Please enter a valid CNIC in the format XXXXX-XXXXXXX-X.");
  if (!category) return (state.errorMessage = "Please select a service category.");
  if (!professionalTitle) return (state.errorMessage = "Please enter a professional title.");
  if (!experience && experience !== 0) return (state.errorMessage = "Please enter your years of experience.");
  if (!startingPrice) return (state.errorMessage = "Please enter your starting price.");
  if (services.length === 0) return (state.errorMessage = "Please select at least one service.");
  if (!serviceLocation) return (state.errorMessage = "Please enter your service location.");
  if (!workingHours) return (state.errorMessage = "Please enter your working hours.");
  if (!about) return (state.errorMessage = "Please write a short bio (About Me).");
  if (!description) return (state.errorMessage = "Please describe why customers should choose you.");
  
  if (!agreeCommission) return (state.errorMessage = "You must agree to the platform charges terms before your profile can be submitted.");

  state.loadingMessage = "Submitting...";
  render();

  try {
    const providerId = state.currentUser.providerId;
    const wasAlreadySaved = !!state.myProviderProfile;

    await createOrUpdateProviderProfile(
      providerId,
      {
        name,
        phone,
        cnic,
        email: state.currentUser.email,
        city,
        area,
        serviceLocation,
        category,
        professionalTitle,
        experience,
        startingPrice,
        services,
        workingHours,
        availability,
        about,
        description,
        icon: CATEGORY_ICONS[category] || "fa-toolbox",
        agreedToCommission: true,
        agreedCommissionAmount: state.commissionSettings.amount,
      },
      { isResubmission: wasAlreadySaved }
    );

    await logActivity(`Provider profile ${wasAlreadySaved ? "resubmitted" : "submitted"} for approval: ${name}`);

    state.successMessage = "Profile submitted for approval! We'll notify you once it's reviewed.";
    navigateTo("providerDashboard");
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}

async function approveProvider(providerId) {
  await update(ref(db, `providers/${providerId}`), {
    status: "approved",
    active: true,
    approvedAt: Date.now(),
    approvedBy: state.currentUser.uid,
    rejectionReason: null,
    blockReason: null,
  });
  await logActivity(`Provider approved: ${providerId}`);
  showToast("Provider approved successfully.", "success");
}

async function rejectProvider(providerId, reason) {
  await update(ref(db, `providers/${providerId}`), {
    status: "rejected",
    active: false,
    rejectionReason: reason,
    rejectedAt: Date.now(),
    rejectedBy: state.currentUser.uid,
  });
  await logActivity(`Provider rejected: ${providerId}`);
  showToast("Provider rejected.", "info");
}

async function blockProvider(providerId, reason) {
  await update(ref(db, `providers/${providerId}`), {
    status: "blocked",
    active: false,
    blockReason: reason,
    blockedAt: Date.now(),
    blockedBy: state.currentUser.uid,
  });
  await logActivity(`Provider blocked: ${providerId}`);
  showToast("Provider blocked.", "info");
}

async function suspendProvider(providerId, reason) {
  await update(ref(db, `providers/${providerId}`), {
    status: "suspended",
    active: false,
    suspensionReason: reason,
    suspendedAt: Date.now(),
    suspendedBy: state.currentUser.uid,
  });
  await logActivity(`Provider suspended: ${providerId}`);
  showToast("Provider suspended.", "info");
}


async function restoreProvider(providerId) {
  await update(ref(db, `providers/${providerId}`), {
    status: "approved",
    active: true,
    suspensionReason: null,
    blockReason: null,
  });
  await logActivity(`Provider restored: ${providerId}`);
  showToast("Provider restored.", "success");
}


async function deleteProviderProfile(providerId, { removedByAdmin = false, reason = null } = {}) {
  const updates = {
    status: "deleted",
    active: false,
    deletedAt: Date.now(),
  };
  if (removedByAdmin) {
    updates.removedBy = state.currentUser.uid;
    updates.removedReason = reason || "Removed by admin";
  }
  await update(ref(db, `providers/${providerId}`), updates);
  await logActivity(`Provider ${removedByAdmin ? "removed by admin" : "deactivated their own profile"}: ${providerId}`);
  showToast(removedByAdmin ? "Provider removed." : "Your profile has been deactivated.", "info");
}


async function logActivity(message) {
  try {
    await push(ref(db, "activityLogs"), { message, at: Date.now() });
  } catch (err) {
    console.warn("Could not write activity log:", err.message);
  }
}


async function updateBookingStatus(docId, currentStatus, newStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    state.errorMessage = `Cannot change a booking from "${currentStatus}" to "${newStatus}".`;
    render();
    return;
  }

  state.loadingMessage = "Updating booking status...";
  render();

  try {
    const updates = { status: newStatus };
    if (newStatus === "Completed") updates.completedAt = Date.now();
    if (newStatus === "Accepted") updates.acceptedAt = Date.now();
    if (newStatus === "In Progress") updates.startedAt = Date.now();
    if (newStatus === "Rejected") updates.rejectedAt = Date.now();

    await update(ref(db, `bookings/${docId}`), updates);

   
    if (newStatus === "Completed") {
      const booking = state.bookings.find((b) => b.docId === docId);
      if (booking) await createCommissionRecord({ ...booking, docId });
    }

    state.successMessage = `Booking status updated to ${newStatus}.`;

  } catch (err) {
    state.errorMessage = "Failed to update booking: " + err.message;
  } finally {
    state.loadingMessage = null;
    render();
  }
}


async function createCommissionRecord(booking) {
  try {
    await push(ref(db, "commissions"), {
      bookingId: booking.docId,
      providerId: booking.providerId,
      providerName: booking.providerName,
      customerId: booking.customerId,
      customerName: booking.customerName,
      service: booking.service,
      bookingPrice: booking.price || 0,
      commissionAmount: booking.adminCommission || 0,
      providerEarning: booking.providerEarning || 0,
      status: "earned",
      createdAt: booking.createdAtMillis || Date.now(),
      completedAt: Date.now(),
    });
    await update(ref(db, `bookings/${booking.docId}`), { commissionStatus: "earned" });
    await logActivity(`Commission earned: ${formatRupees(booking.adminCommission)} from booking ${booking.bookingId}`);
  } catch (err) {
    console.warn("Could not create commission record:", err.message);
  }
}



function renderNavbar() {
  const loggedIn = !!state.currentUser;

  const desktopLinksLoggedOut = `
    <span class="nav-link ${state.currentPage === "home" ? "active" : ""}" data-action="nav" data-page="home">Home</span>
    <span class="nav-link ${state.currentPage === "services" ? "active" : ""}" data-action="nav" data-page="services">Services</span>
    <span class="nav-link" data-action="scroll-how-it-works">How It Works</span>
  `;

  const rightLoggedOut = `
    <button class="btn btn-outline btn-sm" data-action="auth-nav" data-tab="login">Login</button>
    <button class="btn btn-signal btn-sm" data-action="auth-nav" data-tab="register">Get Started</button>
  `;

  const dashboardPage = state.currentUser?.role === "provider" ? "providerDashboard" : "customerDashboard";
  const rightLoggedIn = `
    ${
      isAdmin()
        ? `<span class="nav-link ${state.currentPage === "admin" ? "active" : ""}" data-action="nav" data-page="admin">
             <i class="fa-solid fa-shield-halved"></i> Admin Panel
           </span>`
        : `<span class="nav-link ${state.currentPage === dashboardPage ? "active" : ""}" data-action="nav" data-page="${dashboardPage}">
             <i class="fa-solid fa-gauge"></i> Dashboard
           </span>`
    }
    <div class="flex items-center gap-2">
      <div class="avatar" style="width:36px;height:36px;font-size:0.85rem;">${getInitials(state.currentUser?.name)}</div>
      <span class="text-sm font-semibold hide-mobile" style="color:var(--ink);">${state.currentUser?.name || ""}${isAdmin() ? ` <span class="badge badge-completed" style="vertical-align:middle;">Admin</span>` : ""}</span>
    </div>
    <button class="btn btn-logout btn-sm" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
  `;

  return `
  <nav class="navbar">
    <div class="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
      <div class="flex items-center gap-2 cursor-pointer" data-action="nav" data-page="home">
        <div class="gradient-brand" style="width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <span class="font-display font-bold text-lg">ServiceHub</span>
      </div>

      <div class="hide-mobile items-center gap-1 md:flex">
        ${desktopLinksLoggedOut}
      </div>

      <div class="hide-mobile items-center gap-3 md:flex">
        ${loggedIn ? rightLoggedIn : rightLoggedOut}
      </div>

      <button class="show-mobile text-xl" data-action="toggle-mobile-menu"><i class="fa-solid fa-bars"></i></button>
    </div>

    <div class="mobile-menu ${state.mobileMenuOpen ? "open" : ""} show-mobile px-5 pb-4 flex flex-col gap-2">
      <span class="nav-link" data-action="nav" data-page="home">Home</span>
      <span class="nav-link" data-action="nav" data-page="services">Services</span>
      <span class="nav-link" data-action="scroll-how-it-works">How It Works</span>
      ${
        loggedIn
          ? `<span class="nav-link" data-action="nav" data-page="${isAdmin() ? "admin" : dashboardPage}">${isAdmin() ? "Admin Panel" : "Dashboard"}</span>
             <button class="btn btn-logout btn-sm w-full" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>`
          : `<button class="btn btn-outline btn-sm w-full" data-action="auth-nav" data-tab="login">Login</button>
             <button class="btn btn-signal btn-sm w-full" data-action="auth-nav" data-tab="register">Get Started</button>`
      }
    </div>
  </nav>`;
}

function renderFooter() {
  return `
  <footer class="mt-20 border-t border-gray-100 bg-white">
    <div class="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <div class="gradient-brand" style="width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;">
          <i class="fa-solid fa-bolt text-sm"></i>
        </div>
        <span class="font-display font-bold">ServiceHub</span>
      </div>
      <p class="text-sm text-gray-500">&copy; 2026 ServiceHub. Built for the local services hackathon.</p>
    </div>
  </footer>`;
}



const SERVICE_CATEGORY_CARDS = [
  { category: "Plumbing", icon: "fa-wrench", desc: "Leak repairs, fittings & pipe work." },
  { category: "Electrical", icon: "fa-bolt", desc: "Wiring, installs & troubleshooting." },
  { category: "Home Cleaning", icon: "fa-broom", desc: "Deep cleans for home & office." },
  { category: "Painting", icon: "fa-paint-roller", desc: "Interior & exterior painting." },
  { category: "Computer Repair", icon: "fa-laptop", desc: "Hardware & software fixes." },
  { category: "AC Repair", icon: "fa-wind", desc: "Installation, service & repair." },
];

const HOW_IT_WORKS_STEPS = [
  { title: "Browse Services", desc: "Explore trusted local professionals by category." },
  { title: "Choose a Professional", desc: "Compare experience, price, and ratings." },
  { title: "Book Your Service", desc: "Pick a date, time, and describe the job." },
  { title: "Track Your Booking", desc: "Watch your request move through each stage." },
  { title: "Get the Job Done", desc: "Your provider completes the work." },
  { title: "Leave a Review", desc: "Rate your experience to help others choose." },
];

function renderHome() {
  return `
  <section class="relative overflow-hidden pt-16 pb-20 px-5 md:px-8">
    <div class="hero-shape gradient-brand" style="width:420px;height:420px;top:-120px;right:-120px;"></div>
    <div class="hero-shape gradient-brand" style="width:280px;height:280px;bottom:-80px;left:-80px;"></div>
    <div class="max-w-7xl mx-auto relative fade-up">
      <div class="max-w-2xl">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold gradient-brand text-white mb-5">
          <i class="fa-solid fa-shield-heart"></i> Trusted by local customers
        </span>
        <h1 class="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-5">
          Find Trusted Local Services, <span class="gradient-text">Anytime.</span>
        </h1>
        <p class="text-gray-600 text-lg mb-8">
          Discover reliable professionals near you, book services in minutes, and manage everything from one simple platform.
        </p>
        <div class="flex flex-wrap gap-3">
          <button class="btn btn-primary" data-action="nav" data-page="services"><i class="fa-solid fa-magnifying-glass"></i> Explore Services</button>
          <button class="btn btn-outline" data-action="nav" data-page="register"><i class="fa-solid fa-user-tie"></i> Become a Provider</button>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-5 md:px-8 py-10">
    <h2 class="font-display text-2xl md:text-3xl font-bold mb-1">Popular Services</h2>
    <p class="text-gray-500 mb-8">Tap a category to see providers who specialize in it.</p>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
      ${SERVICE_CATEGORY_CARDS.map(
        (c, i) => `
        <div class="card card-hover p-6 reveal" style="transition-delay:${i * 60}ms;">
          <div class="gradient-brand" style="width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;margin-bottom:14px;">
            <i class="fa-solid ${c.icon}"></i>
          </div>
          <h3 class="font-semibold text-lg mb-1">${c.category}</h3>
          <p class="text-sm text-gray-500 mb-4">${c.desc}</p>
          <button class="text-sm font-semibold" style="color:var(--harbor);" data-action="filter-category-from-home" data-category="${c.category}">
            Explore <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>`
      ).join("")}
    </div>
  </section>

  <section id="how-it-works-section" class="max-w-7xl mx-auto px-5 md:px-8 py-14">
    <h2 class="font-display text-2xl md:text-3xl font-bold mb-1">How It Works</h2>
    <p class="text-gray-500 mb-8">Six simple steps from browsing to a finished job.</p>
    <div class="grid md:grid-cols-3 gap-6">
      ${HOW_IT_WORKS_STEPS.map(
        (s, i) => `
        <div class="card p-6 flex gap-4 items-start reveal" style="transition-delay:${i * 70}ms;">
          <div class="step-num">${i + 1}</div>
          <div>
            <h3 class="font-semibold mb-1">${s.title}</h3>
            <p class="text-sm text-gray-500">${s.desc}</p>
          </div>
        </div>`
      ).join("")}
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-5 md:px-8 py-14">
    <div class="flex items-end justify-between mb-8 flex-wrap gap-3">
      <div>
        <h2 class="font-display text-2xl md:text-3xl font-bold mb-1">Featured Providers</h2>
        <p class="text-gray-500">Top-rated professionals ready to help.</p>
      </div>
      <button class="btn btn-outline btn-sm" data-action="nav" data-page="services">View All <i class="fa-solid fa-arrow-right text-xs"></i></button>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${getFeaturedProviders().map(renderProviderCard).join("")}
    </div>
  </section>
  `;
}


function getFeaturedProviders() {
  return CATEGORIES.filter((c) => c !== "All").map((category) => {
    const inCategory = state.providers.filter((p) => p.category === category);
    if (inCategory.length === 0) return null;
    return inCategory.reduce((best, p) => (p.rating > best.rating ? p : best), inCategory[0]);
  }).filter(Boolean);
}



function renderProviderCard(p) {

  const icon = p.icon || CATEGORY_ICONS[p.category] || "fa-toolbox";
  const priceDisplay = p.price || formatRupees(p.startingPrice);
  return `
  <div class="card card-hover p-6 flex flex-col reveal">
    <div class="flex items-center gap-3 mb-4">
      <div class="relative" style="width:52px;height:52px;">
        <div class="avatar" style="width:52px;height:52px;font-size:1.05rem;"><i class="fa-solid ${icon}"></i></div>
        ${verifiedSealSvg()}
      </div>
      <div>
        <h3 class="font-semibold">${p.name}</h3>
        <span class="text-xs text-gray-500">${p.category} &middot; ${p.location || p.city || ""}</span>
      </div>
    </div>
    <div class="flex items-center gap-1 mb-3">${starsHtml(p.rating || 0)}<span class="text-sm text-gray-500 ml-1">${(p.rating || 0).toFixed ? p.rating.toFixed(1) : p.rating}</span></div>
    <div class="flex items-center justify-between text-sm text-gray-600 mb-5">
      <span><i class="fa-regular fa-clock"></i> ${p.experience} ${typeof p.experience === "number" ? "years" : ""}</span>
      <span class="font-semibold text-signal">${priceDisplay}</span>
    </div>
    <button class="btn btn-primary btn-sm mt-auto" data-action="view-profile" data-provider-id="${p.providerId}">View Profile</button>
  </div>`;
}



function getFilteredProviders() {
  const query = state.searchQuery.trim().toLowerCase();
  return state.providers.filter((p) => {
    const matchesCategory = state.filterCategory === "All" || p.category === state.filterCategory;
    const matchesQuery =
      query === "" || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

function renderServices() {
  const filtered = getFilteredProviders();
  return `
  <section class="max-w-7xl mx-auto px-5 md:px-8 py-12">
    <h1 class="font-display text-3xl md:text-4xl font-extrabold mb-2">Find the Right Professional</h1>
    <p class="text-gray-500 mb-8">Search by name or category, or filter below.</p>

    <div class="relative mb-6 max-w-xl">
      <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      <input
        type="text"
        id="search-input"
        data-action-input="search"
        placeholder="Search providers or services..."
        value="${state.searchQuery}"
        class="field-input"
        style="padding-left:42px;"
      />
    </div>

    <div class="flex flex-wrap gap-2 mb-10">
      ${CATEGORIES.map(
        (c) => `
        <button
          class="btn btn-sm ${state.filterCategory === c ? "btn-primary" : "btn-outline"}"
          data-action="filter-category" data-category="${c}">
          ${c.toUpperCase()}
        </button>`
      ).join("")}
    </div>

    ${
      filtered.length === 0
        ? `<div class="card p-10 text-center text-gray-500"><i class="fa-solid fa-magnifying-glass text-3xl mb-3"></i><p>No providers match your search.</p></div>`
        : `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${filtered.map(renderProviderCard).join("")}</div>`
    }
  </section>`;
}



function renderProviderDetails() {
  const provider = findProviderById(state.selectedProviderId);
  if (!provider) {
    return `<section class="max-w-3xl mx-auto px-5 py-20 text-center">
      <p class="text-gray-500 mb-4">Provider not found.</p>
      <button class="btn btn-primary" data-action="nav" data-page="services">Back to Services</button>
    </section>`;
  }

  const icon = provider.icon || CATEGORY_ICONS[provider.category] || "fa-toolbox";
  const priceDisplay = provider.price || formatRupees(provider.startingPrice);
  const servicesList = Array.isArray(provider.services) && provider.services.length > 0
    ? `<div class="flex flex-wrap gap-2 mb-6">${provider.services.map((s) => `<span class="badge badge-accepted">${s}</span>`).join("")}</div>`
    : "";

  return `
  <section class="max-w-4xl mx-auto px-5 md:px-8 py-12">
    <button class="text-sm text-gray-500 mb-6" data-action="nav" data-page="services"><i class="fa-solid fa-arrow-left"></i> Back to Services</button>
    <div class="card p-8">
      <div class="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
        <div class="relative" style="width:84px;height:84px;">
          <div class="avatar" style="width:84px;height:84px;font-size:1.8rem;"><i class="fa-solid ${icon}"></i></div>
          <div style="transform:scale(1.15);transform-origin:top right;">${verifiedSealSvg()}</div>
        </div>
        <div>
          <h1 class="font-display text-2xl font-bold">${provider.name}</h1>
          <p class="text-gray-500">${provider.professionalTitle || provider.category} &middot; <i class="fa-solid fa-location-dot"></i> ${provider.location || provider.city || ""}</p>
          <div class="flex items-center gap-1 mt-2">${starsHtml(provider.rating || 0)}<span class="text-sm text-gray-500 ml-1">${provider.rating || "New"} rating &middot; ${provider.availability === "busy" ? "Busy" : provider.availability === "offline" ? "Offline" : "Available now"}</span></div>
        </div>
      </div>

      <div class="grid sm:grid-cols-3 gap-4 mb-6">
        <div class="card p-4 text-center"><p class="text-xs text-gray-500 mb-1">Experience</p><p class="font-semibold">${provider.experience}${typeof provider.experience === "number" ? " years" : ""}</p></div>
        <div class="card p-4 text-center"><p class="text-xs text-gray-500 mb-1">Starting Price</p><p class="font-semibold text-signal">${priceDisplay}</p></div>
        <div class="card p-4 text-center"><p class="text-xs text-gray-500 mb-1">Category</p><p class="font-semibold">${provider.category}</p></div>
      </div>

      ${servicesList}

      <h3 class="font-semibold mb-2">About</h3>
      <p class="text-gray-600 mb-8">${provider.about}</p>

      ${messageBannerHtml()}

      <button class="btn btn-primary w-full sm:w-auto mt-4" data-action="book-service" data-provider-id="${provider.providerId}">
        <i class="fa-solid fa-calendar-check"></i> Book This Service
      </button>
    </div>
  </section>`;
}



function renderWelcome() {
  const isLogin = state.authTab === "login";

  return `
  <section class="auth-shell">
    <div class="auth-visual reveal in-view">
      <div class="hero-shape blob" style="width:260px;height:260px;top:-60px;left:-60px;background:radial-gradient(circle,#f5a524 0%,transparent 70%);opacity:0.35;"></div>
      <div class="hero-shape blob" style="width:220px;height:220px;bottom:-40px;right:-40px;background:radial-gradient(circle,#ff6b5b 0%,transparent 70%);opacity:0.3;"></div>

      <div class="relative">
        <div class="flex items-center gap-2 mb-10">
          <div style="width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;">
            <i class="fa-solid fa-bolt text-signal" style="color:#f5a524;"></i>
          </div>
          <span class="font-display font-semibold text-lg">ServiceHub</span>
        </div>

        <h1 class="font-display text-3xl md:text-4xl font-semibold leading-tight mb-4">
          Local help you can <span class="underline-swash" style="color:#f5a524;">actually trust.</span>
        </h1>
        <p class="text-white/75 mb-8 max-w-sm">
          Every professional on ServiceHub is identity-checked and rated by real customers —
          so you know exactly who's walking through your door.
        </p>

        <div class="relative mb-10 float-anim" style="max-width:340px;">
          ${neighborhoodIllustrationSvg()}
        </div>
      </div>

      <div class="relative flex gap-8">
        <div class="trust-stat"><span class="num">4.8<i class="fa-solid fa-star text-signal" style="font-size:0.9rem;color:#f5a524;"></i></span></div>
        <div class="trust-stat"><span class="num">1,200+</span><span class="text-xs text-white/70">Jobs completed</span></div>
        <div class="trust-stat"><span class="num">6</span><span class="text-xs text-white/70">Service categories</span></div>
      </div>
    </div>

    <div class="flex items-center justify-center px-6 py-14 bg-white">
      <div class="w-full" style="max-width:400px;">
        <div class="flex mb-7 border-b border-gray-100">
          <div class="auth-tab ${isLogin ? "active" : ""}" data-action="auth-tab" data-tab="login">Login</div>
          <div class="auth-tab ${!isLogin ? "active" : ""}" data-action="auth-tab" data-tab="register">Sign Up</div>
        </div>

        ${messageBannerHtml()}

        ${isLogin ? welcomeLoginForm() : welcomeRegisterForm()}

        <div class="text-center mt-6">
          <span class="text-sm text-gray-400 cursor-pointer hover:text-gray-600" data-action="nav" data-page="home">
            Browse without an account <i class="fa-solid fa-arrow-right text-xs"></i>
          </span>
        </div>
      </div>
    </div>
  </section>`;
}

function welcomeLoginForm() {
  return `
  <form data-form="login" class="flex flex-col gap-4 fade-up">
    <div>
      <label class="field-label">Email</label>
      <input type="email" name="email" class="field-input" placeholder="you@example.com" required />
    </div>
    <div>
      <label class="field-label">Password</label>
      <input type="password" name="password" class="field-input" placeholder="••••••••" required />
    </div>
    <button type="submit" class="btn btn-primary mt-2" ${state.loadingMessage ? "disabled" : ""}>
      ${state.loadingMessage ? `<span class="spinner"></span> Logging in...` : "Login"}
    </button>
  </form>
  ${googleSignInDivider()}`;
}

function welcomeRegisterForm() {
  return `
  <form data-form="register" class="flex flex-col gap-4 fade-up">
    <div>
      <label class="field-label">Full Name</label>
      <input type="text" name="name" class="field-input" placeholder="Your name" required />
    </div>
    <div>
      <label class="field-label">Email</label>
      <input type="email" name="email" class="field-input" placeholder="you@example.com" required />
    </div>
    <div>
      <label class="field-label">Password</label>
      <input type="password" name="password" class="field-input" placeholder="At least 6 characters" required />
    </div>
    <div>
      <label class="field-label">I am a...</label>
      <select name="role" id="register-role-select" class="field-input">
        <option value="customer">Customer</option>
        <option value="provider">Service Provider</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div id="provider-id-field" style="display:none;">
      <div class="alert alert-info">
        <i class="fa-solid fa-clipboard-list"></i>
        After signing up, you'll fill in a short professional profile and submit it for admin approval before you can receive bookings.
      </div>
    </div>

    <div id="admin-id-field" style="display:none;">
      <div class="alert alert-info">
        <i class="fa-solid fa-shield-halved"></i>
        Admin registration is restricted to ServiceHub's authorized admin email — anyone else selecting this will be rejected.
      </div>
    </div>

    <button type="submit" class="btn btn-signal mt-2" ${state.loadingMessage ? "disabled" : ""}>
      ${state.loadingMessage ? `<span class="spinner"></span> Creating account...` : "Create Account"}
    </button>
  </form>
  ${googleSignInDivider()}
  <p class="text-xs text-gray-400 text-center mt-3">Signing up with Google always creates a Customer account. Providers should use the form above.</p>`;
}


function googleSignInDivider() {
  return `
  <div class="flex items-center gap-3 my-5">
    <div class="flex-1 h-px bg-gray-100"></div>
    <span class="text-xs text-gray-400 font-semibold">OR</span>
    <div class="flex-1 h-px bg-gray-100"></div>
  </div>
  <button type="button" class="btn btn-outline w-full" data-action="google-signin" ${state.loadingMessage ? "disabled" : ""}>
    <i class="fa-brands fa-google"></i> Continue with Google
  </button>`;
}



const ASSISTANT_KEYWORDS = {
  Plumbing: ["leak", "pipe", "water", "tap", "drain"],
  Electrical: ["wire", "electricity", "power", "switch"],
  "Computer Repair": ["computer", "laptop", "screen", "software"],
  "AC Repair": ["ac", "air conditioner", "cooling"],
  "Home Cleaning": ["clean", "dirty", "dust"],
  Painting: ["paint", "wall", "color"],
};
const URGENCY_KEYWORDS = ["urgent", "emergency", "danger", "immediately"];

function analyzeProblem(text) {
  const lower = text.toLowerCase();
  let bestCategory = null;
  for (const [category, keywords] of Object.entries(ASSISTANT_KEYWORDS)) {
    if (keywords.some((word) => lower.includes(word))) {
      bestCategory = category;
      break;
    }
  }
  const urgent = URGENCY_KEYWORDS.some((word) => lower.includes(word));
  return { category: bestCategory, urgency: urgent ? "High" : "Normal" };
}

function renderBooking() {
  const provider = findProviderById(state.selectedProviderId);
  if (!provider) {
    return `<section class="max-w-3xl mx-auto px-5 py-20 text-center">
      <p class="text-gray-500 mb-4">Please choose a provider first.</p>
      <button class="btn btn-primary" data-action="nav" data-page="services">Browse Services</button>
    </section>`;
  }

  
  const price = provider.startingPrice || parsePriceToNumber(provider.price);
  const { adminCommission, providerEarning } = calculateCommission(price, state.commissionSettings);

  return `
  <section class="max-w-2xl mx-auto px-5 md:px-8 py-12">
    <button class="text-sm text-gray-500 mb-6" data-action="nav" data-page="providerDetails"><i class="fa-solid fa-arrow-left"></i> Back to Profile</button>

    <div class="card p-8 mb-6">
      <h1 class="font-display text-2xl font-bold mb-1">Book a Service</h1>
      <p class="text-gray-500 mb-6">You're booking with <strong>${provider.name}</strong> (${provider.category})</p>

      ${messageBannerHtml()}

      <!-- Price / commission breakdown — required by the spec: never
           silently change the provider's price, always show the split. -->
      <div class="card p-5 mb-6" style="background:var(--harbor-light);">
        <div class="grid grid-cols-3 gap-3 text-center">
          <div>
            <p class="text-xs text-gray-500 mb-1">Customer Price</p>
            <p class="font-semibold">${formatRupees(price)}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Platform Charges</p>
            <p class="font-semibold text-signal">${formatRupees(adminCommission)}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Provider Earns</p>
            <p class="font-semibold" style="color:var(--success);">${formatRupees(providerEarning)}</p>
          </div>
        </div>
      </div>

      <!-- Bonus feature: Service Assistant -->
      <div class="card p-5 mb-6" style="background:#f8f8ff;">
        <h3 class="font-semibold text-sm mb-2"><i class="fa-solid fa-wand-magic-sparkles text-signal"></i> Service Assistant (optional)</h3>
        <p class="text-xs text-gray-500 mb-3">Describe your problem and we'll suggest a service category and urgency.</p>
        <div class="flex gap-2">
          <input id="assistant-input" type="text" class="field-input" placeholder="e.g. My kitchen pipe is leaking and water is everywhere" />
          <button class="btn btn-outline btn-sm" data-action="run-assistant" type="button">Analyze</button>
        </div>
        <div id="assistant-result" class="mt-3 text-sm"></div>
      </div>

      <form data-form="booking" class="flex flex-col gap-4">
        <div>
          <label class="field-label">Provider</label>
          <input type="text" class="field-input" value="${provider.name}" disabled />
        </div>
        <div>
          <label class="field-label">Service</label>
          <input type="text" class="field-input" value="${provider.category}" disabled />
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="field-label">Date</label>
            <input type="date" name="date" class="field-input" required />
          </div>
          <div>
            <label class="field-label">Time</label>
            <input type="time" name="time" class="field-input" required />
          </div>
        </div>
        <div>
          <label class="field-label">Location</label>
          <input type="text" name="location" class="field-input" placeholder="Your address" required />
        </div>
        <div>
          <label class="field-label">Description</label>
          <textarea name="description" rows="4" class="field-input" placeholder="Describe the job..." required></textarea>
        </div>

        <button type="submit" class="btn btn-primary mt-2" ${state.loadingMessage ? "disabled" : ""}>
          ${state.loadingMessage ? `<span class="spinner"></span> Creating your booking...` : "Confirm Booking"}
        </button>
      </form>
    </div>
  </section>`;
}



function renderProviderProfileForm() {
  const existing = state.myProviderProfile || {};
  const isEdit = !!state.myProviderProfile;
  
  const category = state.profileFormCategory || existing.category || "";
  const existingServices = Array.isArray(existing.services) ? existing.services : [];

  return `
  <section class="max-w-3xl mx-auto px-5 md:px-8 py-12">
    <h1 class="font-display text-2xl md:text-3xl font-bold mb-1">${isEdit ? "Edit Your Professional Profile" : "Complete Your Professional Profile"}</h1>
    <p class="text-gray-500 mb-2">This information is shown to customers once your profile is approved.</p>
    ${
      isEdit
        ? `<div class="alert alert-info mb-6"><i class="fa-solid fa-circle-info"></i> Saving changes here sends your profile back for admin re-approval before it's visible to customers again.</div>`
        : ""
    }

    ${messageBannerHtml()}

    <form data-form="provider-profile" class="flex flex-col gap-8">

      <!-- STEP 1: Basic Information -->
      <div class="card p-6">
        <h3 class="font-semibold mb-4"><span class="step-num" style="width:28px;height:28px;font-size:0.8rem;display:inline-flex;">1</span> Basic Information</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="field-label">Full Name</label>
            <input type="text" name="name" class="field-input" value="${existing.name || state.currentUser?.name || ""}" required />
          </div>
          <div>
            <label class="field-label">Phone Number</label>
            <input type="tel" name="phone" class="field-input" placeholder="03xx-xxxxxxx" value="${existing.phone || ""}" required />
          </div>
          <div>
            <label class="field-label">CNIC Number</label>
            <input type="text" name="cnic" id="cnic-input" class="field-input" placeholder="XXXXX-XXXXXXX-X" maxlength="15"
              value="${existing.cnic || ""}" data-action-input="cnic-format" required />
            <p class="text-xs text-gray-400 mt-1">Dashes are added automatically as you type.</p>
          </div>
          <div>
            <label class="field-label">City</label>
            <input type="text" name="city" class="field-input" value="${existing.city || "Karachi"}" required />
          </div>
          <div>
            <label class="field-label">Area</label>
            <input type="text" name="area" class="field-input" placeholder="e.g. Gulshan-e-Iqbal" value="${existing.area || ""}" required />
          </div>
        </div>
        <div class="mt-4">
          <label class="field-label">Full Service Location</label>
          <input type="text" name="serviceLocation" class="field-input" placeholder="Areas you can travel to" value="${existing.serviceLocation || ""}" required />
        </div>
      </div>

      <!-- STEP 2: Professional Information -->
      <div class="card p-6">
        <h3 class="font-semibold mb-4"><span class="step-num" style="width:28px;height:28px;font-size:0.8rem;display:inline-flex;">2</span> Professional Information</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="field-label">Service Category</label>
            <select name="category" id="profile-category-select" class="field-input" required>
              <option value="">Select a category</option>
              ${PROVIDER_CATEGORIES.map((c) => `<option value="${c}" ${category === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="field-label">Professional Title</label>
            <input type="text" name="professionalTitle" class="field-input" placeholder="e.g. Professional Plumber" value="${existing.professionalTitle || ""}" required />
          </div>
          <div>
            <label class="field-label">Years of Experience</label>
            <input type="number" name="experience" min="0" class="field-input" value="${existing.experience || ""}" required />
          </div>
          <div>
            <label class="field-label">Starting Price (Rs.)</label>
            <input type="number" name="startingPrice" min="0" class="field-input" value="${existing.startingPrice || ""}" required />
          </div>
        </div>
      </div>

      <!-- STEP 3: Services (dynamic checklist based on chosen category) -->
      <div class="card p-6">
        <h3 class="font-semibold mb-4"><span class="step-num" style="width:28px;height:28px;font-size:0.8rem;display:inline-flex;">3</span> Services You Offer</h3>
        <div id="services-checklist-container">
          ${renderServicesChecklist(category, existingServices)}
        </div>
      </div>

      <!-- STEP 4: Professional Details -->
      <div class="card p-6">
        <h3 class="font-semibold mb-4"><span class="step-num" style="width:28px;height:28px;font-size:0.8rem;display:inline-flex;">4</span> Professional Details</h3>
        <div class="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="field-label">Working Hours</label>
            <input type="text" name="workingHours" class="field-input" placeholder="e.g. 9 AM - 7 PM" value="${existing.workingHours || ""}" required />
          </div>
          <div>
            <label class="field-label">Availability</label>
            <select name="availability" class="field-input">
              <option value="available" ${existing.availability === "available" || !existing.availability ? "selected" : ""}>Available</option>
              <option value="busy" ${existing.availability === "busy" ? "selected" : ""}>Busy</option>
              <option value="offline" ${existing.availability === "offline" ? "selected" : ""}>Offline</option>
            </select>
          </div>
        </div>
        <div class="mb-4">
          <label class="field-label">About Me / Professional Bio</label>
          <textarea name="about" rows="3" class="field-input" placeholder="Your experience and specialties..." required>${existing.about || ""}</textarea>
        </div>
        <div>
          <label class="field-label">Why Customers Should Choose Me</label>
          <textarea name="description" rows="3" class="field-input" placeholder="What makes your service stand out..." required>${existing.description || ""}</textarea>
        </div>
      </div>

      <!-- STEP 5: Platform Charges Agreement — provider must actively agree to the
           fixed ServiceHub platform charges before their profile can be submitted. -->
      <div class="card p-6" style="border:1.5px solid var(--signal);">
        <h3 class="font-semibold mb-3"><span class="step-num" style="width:28px;height:28px;font-size:0.8rem;display:inline-flex;">5</span> Platform Charges Agreement</h3>
        <div class="alert alert-info mb-4">
          <i class="fa-solid fa-sack-dollar"></i>
          ServiceHub charges a fixed platform charge of <strong>${formatRupees(state.commissionSettings.amount)}</strong> on every completed booking. This amount is deducted from what the customer pays before the rest is sent to you.
        </div>
        <label class="flex items-start gap-3 text-sm p-3 rounded-lg" style="border:1.5px solid var(--line); cursor:pointer;">
          <input type="checkbox" name="agreeCommission" ${existing.agreedToCommission ? "checked" : ""} required style="margin-top:3px;" />
          <span>I agree to pay ServiceHub a fixed platform charge of ${formatRupees(state.commissionSettings.amount)} for every completed booking, and understand that ServiceHub will not accept my profile without this agreement.</span>
        </label>
      </div>

      <button type="submit" class="btn btn-signal" ${state.loadingMessage ? "disabled" : ""}>
        ${state.loadingMessage ? `<span class="spinner"></span> Submitting...` : isEdit ? "Save & Resubmit for Approval" : "Submit for Approval"}
      </button>
    </form>
  </section>`;
}


function renderServicesChecklist(category, selectedServices) {
  if (!category) return `<p class="text-sm text-gray-400">Choose a service category above to see specific services.</p>`;
  const options = SERVICES_BY_CATEGORY[category] || [];
  return `
  <div class="grid sm:grid-cols-2 gap-2">
    ${options
      .map(
        (service) => `
      <label class="flex items-center gap-2 text-sm p-2 rounded-lg" style="border:1.5px solid var(--line);">
        <input type="checkbox" name="services" value="${service}" ${selectedServices.includes(service) ? "checked" : ""} />
        ${service}
      </label>`
      )
      .join("")}
  </div>`;
}


function renderCustomerDashboard() {
  const bookings = state.bookings;
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    inProgress: bookings.filter((b) => b.status === "In Progress").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
  };

  return `
  <section class="max-w-6xl mx-auto px-5 md:px-8 py-12">
    <h1 class="font-display text-2xl md:text-3xl font-bold mb-1">Welcome back, ${state.currentUser.name}</h1>
    <p class="text-gray-500 mb-8">Here's what's happening with your bookings.</p>

    ${messageBannerHtml()}

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      ${statCard("Total Bookings", stats.total, "fa-list-check", "#eef0ff", "#4338ca")}
      ${statCard("Pending", stats.pending, "fa-hourglass-half", "#fef3c7", "#b45309")}
      ${statCard("In Progress", stats.inProgress, "fa-gear", "#ede9fe", "#6d28d9")}
      ${statCard("Completed", stats.completed, "fa-circle-check", "#dcfce7", "#15803d")}
    </div>

    <h2 class="font-semibold text-lg mb-4">My Bookings</h2>
    ${
      state.bookingsLoading
        ? `<div class="card p-10 text-center text-gray-500"><span class="spinner spinner-dark"></span> Loading your bookings...</div>`
        : bookings.length === 0
        ? `<div class="card p-10 text-center text-gray-500">You have no bookings yet. <span class="text-signal font-semibold cursor-pointer" data-action="nav" data-page="services">Browse services</span></div>`
        : `<div class="flex flex-col gap-4">${bookings.map(customerBookingCard).join("")}</div>`
    }
  </section>`;
}

function statCard(label, value, icon, bg, fg) {
  return `
  <div class="card p-5">
    <div style="width:38px;height:38px;border-radius:10px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
      <i class="fa-solid ${icon}"></i>
    </div>
    <p class="text-2xl font-bold font-display">${value}</p>
    <p class="text-xs text-gray-500">${label}</p>
  </div>`;
}

function customerBookingCard(b) {
  const reviewButton =
    b.status === "Completed"
      ? b.hasReviewed
        ? `<span class="text-sm text-green-600 font-semibold"><i class="fa-solid fa-check"></i> Review Submitted</span>`
        : `<button class="btn btn-outline btn-sm" data-action="open-review" data-booking-doc-id="${b.docId}">Leave a Review</button>`
      : "";

  
  const canPayDigitally = b.status !== "Rejected";

  return `
  <div class="card p-6">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
      <div>
        <p class="text-xs text-gray-400 mb-1">${b.bookingId}</p>
        <h3 class="font-semibold">${b.providerName} &middot; ${b.service}</h3>
      </div>
      ${statusBadgeHtml(b.status)}
    </div>
    <div class="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
      <p><i class="fa-regular fa-calendar"></i> ${b.date} at ${b.time}</p>
      <p><i class="fa-solid fa-location-dot"></i> ${b.location}</p>
    </div>
    <p class="text-sm text-gray-500 mb-4">${b.description}</p>
    ${customerPaymentStatusHtml(b)}
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-outline btn-sm" data-action="open-chat" data-booking-doc-id="${b.docId}"><i class="fa-regular fa-comment-dots"></i> Chat</button>
      ${canPayDigitally ? `<button class="btn btn-outline btn-sm" data-action="open-payment-modal" data-type="customerToProvider" data-booking-doc-id="${b.docId}"><i class="fa-solid fa-mobile-screen-button"></i> Pay via JazzCash/EasyPesa</button>` : ""}
      ${reviewButton}
    </div>
  </div>`;
}


function customerPaymentStatusHtml(b) {
  const payment = state.myPaymentsAsCustomer.find((p) => p.bookingId === b.docId);
  if (!payment) return "";
  return `<div class="alert alert-info mb-4"><i class="fa-solid fa-receipt"></i> Payment proof sent via ${payment.method === "jazzcash" ? "JazzCash" : payment.method === "easypesa" ? "EasyPesa" : "Bank"} — ${payment.status === "verified" ? "verified" : "pending review"}.</div>`;
}



const PROVIDER_TABS = ["All", "Pending", "Accepted", "In Progress", "Completed", "Rejected"];

function renderProviderDashboard() {
  const bookings = state.bookings;
  const stats = {
    incoming: bookings.filter((b) => b.status === "Pending").length,
    accepted: bookings.filter((b) => b.status === "Accepted").length,
    inProgress: bookings.filter((b) => b.status === "In Progress").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
  };
  const totalEarnings = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + (b.providerEarning || 0), 0);

  const filtered = state.providerTab === "All" ? bookings : bookings.filter((b) => b.status === state.providerTab);

  return `
  <section class="max-w-6xl mx-auto px-5 md:px-8 py-12">
    <h1 class="font-display text-2xl md:text-3xl font-bold mb-1">Provider Dashboard</h1>
    <p class="text-gray-500 mb-8">Manage your incoming service requests.</p>

    ${messageBannerHtml()}

    ${renderMyProfileStatusCard()}

    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      ${statCard("Incoming Requests", stats.incoming, "fa-inbox", "#fef3c7", "#b45309")}
      ${statCard("Accepted Jobs", stats.accepted, "fa-thumbs-up", "#dbeafe", "#1d4ed8")}
      ${statCard("In Progress", stats.inProgress, "fa-gear", "#ede9fe", "#6d28d9")}
      ${statCard("Completed Jobs", stats.completed, "fa-circle-check", "#dcfce7", "#15803d")}
      ${statCard("Total Earnings", formatRupees(totalEarnings), "fa-sack-dollar", "#e4f6ea", "#1f9d55")}
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      ${PROVIDER_TABS.map(
        (tab) => `
        <button class="btn btn-sm ${state.providerTab === tab ? "btn-primary" : "btn-outline"}" data-action="provider-tab" data-tab="${tab}">
          ${tab.toUpperCase()}
        </button>`
      ).join("")}
    </div>

    ${
      state.bookingsLoading
        ? `<div class="card p-10 text-center text-gray-500"><span class="spinner spinner-dark"></span> Loading bookings...</div>`
        : filtered.length === 0
        ? `<div class="card p-10 text-center text-gray-500">No bookings in this category.</div>`
        : `<div class="flex flex-col gap-4 mb-10">${filtered.map(providerBookingCard).join("")}</div>`
    }

    ${renderMyReviewsSection()}
  </section>`;
}


function renderMyProfileStatusCard() {
  const profile = state.myProviderProfile;

  if (!profile) {
    return `
    <div class="card p-6 mb-8" style="border-left:4px solid var(--signal);">
      <h3 class="font-semibold mb-1"><i class="fa-solid fa-id-card text-signal"></i> Complete Your Professional Profile</h3>
      <p class="text-sm text-gray-500 mb-4">You need a professional profile before you can receive bookings. It only takes a few minutes.</p>
      <button class="btn btn-signal btn-sm" data-action="nav" data-page="providerProfileForm">Complete Profile</button>
    </div>`;
  }

  const statusCopy = {
    pending: { text: "Your profile is currently being reviewed by our admin team.", color: "var(--warning)", icon: "fa-hourglass-half" },
    approved: { text: "Your profile is live and visible to customers.", color: "var(--success)", icon: "fa-circle-check" },
    rejected: { text: "Your profile needs changes before it can be approved.", color: "var(--error)", icon: "fa-circle-xmark" },
    suspended: { text: "Your profile is temporarily suspended and not visible to customers.", color: "var(--warning)", icon: "fa-pause" },
    blocked: { text: "Your profile has been blocked.", color: "var(--error)", icon: "fa-ban" },
    deleted: { text: "Your profile is deactivated and not visible to customers.", color: "var(--text-muted)", icon: "fa-eye-slash" },
  }[profile.status] || { text: "", color: "var(--text-muted)", icon: "fa-circle-info" };

  return `
  <div class="card p-6 mb-8" style="border-left:4px solid ${statusCopy.color};">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
      <div>
        <h3 class="font-semibold mb-1"><i class="fa-solid ${statusCopy.icon}" style="color:${statusCopy.color};"></i> My Professional Profile</h3>
        <p class="text-sm text-gray-500">${statusCopy.text}</p>
        ${profile.status === "rejected" && profile.rejectionReason ? `<p class="text-sm mt-2"><strong>Admin's reason:</strong> ${profile.rejectionReason}</p>` : ""}
      </div>
      <span class="badge ${profile.status === "approved" ? "badge-completed" : profile.status === "pending" ? "badge-pending" : "badge-rejected"}">${profile.status}</span>
    </div>

    <div class="mb-3">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Profile Completion</span>
        <span>${profile.profileCompletion || 0}%</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${profile.profileCompletion || 0}%;"></div></div>
    </div>

    <div class="flex flex-wrap gap-2 mt-4">
      ${profile.status !== "deleted" ? `<button class="btn btn-outline btn-sm" data-action="nav" data-page="providerProfileForm">Edit Profile</button>` : ""}
      ${
        profile.status === "approved"
          ? `<button class="btn btn-outline btn-sm" data-action="cycle-availability" data-current="${profile.availability || "available"}">
               Availability: ${profile.availability === "busy" ? "Busy" : profile.availability === "offline" ? "Offline" : "Available"} (tap to change)
             </button>`
          : ""
      }
      ${profile.status !== "deleted" ? `<button class="btn btn-danger btn-sm" data-action="open-deactivate-modal">Deactivate Profile</button>` : ""}
    </div>
  </div>`;
}


function renderMyReviewsSection() {
  if (state.currentUser?.role !== "provider") return "";
  return `
  <div>
    <h2 class="font-semibold text-lg mb-4">Customer Reviews ${state.myReviews.length > 0 ? `(${state.myReviews.length})` : ""}</h2>
    ${
      state.myReviews.length === 0
        ? `<div class="card p-8 text-center text-gray-500">No reviews yet — they'll show up here as soon as customers leave one.</div>`
        : `<div class="flex flex-col gap-3">
            ${state.myReviews
              .map(
                (r) => `
              <div class="card p-5">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-sm">${r.customerName || "Customer"}</span>
                  <div class="flex gap-0.5">${starsHtml(r.rating)}</div>
                </div>
                <p class="text-sm text-gray-600">${r.comment}</p>
              </div>`
              )
              .join("")}
          </div>`
    }
  </div>`;
}


function providerPaymentStatusHtml(b, commissionPayment) {
  let html = "";
  const customerPayment = state.incomingCustomerPayments.find((p) => p.bookingId === b.docId);
  if (customerPayment) {
    html += `<div class="alert alert-info mb-2"><i class="fa-solid fa-receipt"></i> Customer sent payment via ${customerPayment.method === "jazzcash" ? "JazzCash" : customerPayment.method === "easypesa" ? "EasyPesa" : "Bank"}${customerPayment.receiptImage ? ` — <span class="cursor-pointer text-signal underline" data-action="view-receipt" data-receipt="receipt-${customerPayment.paymentId}">view receipt</span>` : ""}</div>
    <img id="receipt-${customerPayment.paymentId}" src="${customerPayment.receiptImage || ""}" style="display:none; max-width:200px; border-radius:8px; margin-bottom:8px;" />`;
  }
  if (commissionPayment) {
    html += `<div class="alert alert-info mb-2"><i class="fa-solid fa-receipt"></i> Platform charges sent via ${commissionPayment.method === "jazzcash" ? "JazzCash" : commissionPayment.method === "easypesa" ? "EasyPesa" : "Bank"} — ${commissionPayment.status === "verified" ? "verified by admin" : "pending admin review"}.</div>`;
  }
  return html;
}

function providerBookingCard(b) {
  let actions = "";
  if (b.status === "Pending") {
    actions = `
      <button class="btn btn-success btn-sm" data-action="update-status" data-booking-doc-id="${b.docId}" data-current="${b.status}" data-next="Accepted">Accept</button>
      <button class="btn btn-danger btn-sm" data-action="update-status" data-booking-doc-id="${b.docId}" data-current="${b.status}" data-next="Rejected">Reject</button>`;
  } else if (b.status === "Accepted") {
    actions = `<button class="btn btn-primary btn-sm" data-action="update-status" data-booking-doc-id="${b.docId}" data-current="${b.status}" data-next="In Progress">Start Work</button>`;
  } else if (b.status === "In Progress") {
    actions = `<button class="btn btn-primary btn-sm" data-action="update-status" data-booking-doc-id="${b.docId}" data-current="${b.status}" data-next="Completed">Mark Completed</button>`;
  }

  
  const commissionPayment = state.myPaymentsAsProvider.find((p) => p.bookingId === b.docId);
  const showSendCommission = b.status === "Completed" && b.commissionStatus === "earned" && !commissionPayment;

  return `
  <div class="card p-6">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
      <div>
        <p class="text-xs text-gray-400 mb-1">${b.bookingId}</p>
        <h3 class="font-semibold">${b.customerName} &middot; ${b.service}</h3>
      </div>
      ${statusBadgeHtml(b.status)}
    </div>
    <div class="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
      <p><i class="fa-regular fa-calendar"></i> ${b.date} at ${b.time}</p>
      <p><i class="fa-solid fa-location-dot"></i> ${b.location}</p>
    </div>
    <p class="text-sm text-gray-500 mb-4">${b.description}</p>
    ${providerPaymentStatusHtml(b, commissionPayment)}
    <div class="flex flex-wrap gap-2">
      ${actions}
      <button class="btn btn-outline btn-sm" data-action="open-chat" data-booking-doc-id="${b.docId}"><i class="fa-regular fa-comment-dots"></i> Chat</button>
      ${showSendCommission ? `<button class="btn btn-signal btn-sm" data-action="open-payment-modal" data-type="providerToAdmin" data-booking-doc-id="${b.docId}"><i class="fa-solid fa-money-bill-transfer"></i> Send Platform Charges</button>` : ""}
  </div>`;
}




function renderChatModal() {
  if (!state.chatModalBookingId) return "";
  
  const booking = state.bookings.find((b) => b.docId === state.chatModalBookingId);
  if (!booking) return "";
  const otherPartyName = state.currentUser?.role === "provider" ? booking.customerName : booking.providerName;

  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box" style="max-width:440px; display:flex; flex-direction:column; height:min(600px, 80vh);">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h2 class="font-display text-lg font-bold">Chat</h2>
          <p class="text-xs text-gray-500">${otherPartyName} &middot; ${booking.bookingId}</p>
        </div>
        <button data-action="close-modal" class="text-gray-400 text-xl leading-none">&times;</button>
      </div>

      <div id="chat-messages-box" class="flex-1 overflow-y-auto flex flex-col gap-2 mb-3 p-2" style="background:var(--bg); border-radius:var(--radius-sm);">
        ${
          state.chatMessages.length === 0
            ? `<p class="text-center text-gray-400 text-sm mt-8">No messages yet — say hello!</p>`
            : state.chatMessages
                .map((m) => {
                  const isMine = m.senderId === state.currentUser.uid;
                  return `
              <div class="chat-bubble-row ${isMine ? "mine" : ""}">
                <div class="chat-bubble ${isMine ? "mine" : ""}">
                  ${!isMine ? `<p class="chat-bubble-sender">${m.senderName}</p>` : ""}
                  <p>${m.text}</p>
                </div>
              </div>`;
                })
                .join("")
        }
      </div>

      <form data-form="chat-message" class="flex gap-2">
        <input type="text" name="text" class="field-input" placeholder="Type a message..." autocomplete="off" required />
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
  </div>`;
}


function renderPaymentModal() {
  if (!state.paymentModalConfig) return "";
  const { type, booking } = state.paymentModalConfig;
  const isCommission = type === "providerToAdmin";
  const defaultAmount = isCommission ? booking.adminCommission : booking.price;

  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box">
      <h2 class="font-display text-xl font-bold mb-1">${isCommission ? "Send Platform Charges" : "Pay via JazzCash / EasyPesa"}</h2>
      <p class="text-gray-500 text-sm mb-5">
        ${isCommission ? `Send ServiceHub its platform charges for booking ${booking.bookingId}.` : `Send ${booking.providerName} your payment for booking ${booking.bookingId}.`}
      </p>

      ${messageBannerHtml()}

      <form data-form="payment-proof" class="flex flex-col gap-4">
        <div>
          <label class="field-label">Payment Method</label>
          <select name="method" class="field-input">
            ${isCommission ? `<option value="bank">Bank Transfer</option>` : ""}
            <option value="jazzcash">JazzCash</option>
            <option value="easypesa">EasyPesa</option>
          </select>
        </div>
        <div>
          <label class="field-label">Amount (Rs.)</label>
          <input type="number" name="amount" class="field-input" value="${defaultAmount}" required />
          <p class="text-xs text-gray-400 mt-1">${isCommission ? "This should match the platform charges owed for this booking." : "The amount you're sending the provider."}</p>
        </div>
        <div>
          <label class="field-label">Transaction Reference / Sender Number</label>
          <input type="text" name="reference" class="field-input" placeholder="e.g. JazzCash TID or your mobile number" required />
        </div>
        <div>
          <label class="field-label">Receipt Photo</label>
          <input type="file" accept="image/*" id="receipt-file-input" class="field-input" required />
          <p class="text-xs text-gray-400 mt-1">A screenshot of the payment confirmation.</p>
          <div id="receipt-preview" class="mt-2"></div>
        </div>
        <div class="flex gap-3">
          <button type="button" class="btn btn-outline flex-1" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn btn-primary flex-1" ${state.loadingMessage ? "disabled" : ""}>
            ${state.loadingMessage ? `<span class="spinner"></span> Submitting...` : "Submit Payment Proof"}
          </button>
        </div>
      </form>
    </div>
  </div>`;
}

function renderReviewModal() {
  if (!state.reviewModalBookingId) return "";
  const booking = state.bookings.find((b) => b.docId === state.reviewModalBookingId);
  if (!booking) return "";

  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box">
      <h2 class="font-display text-xl font-bold mb-1">Leave a Review</h2>
      <p class="text-gray-500 text-sm mb-5">How was your experience with ${booking.providerName}?</p>

      ${messageBannerHtml()}

      <div class="flex gap-2 text-2xl mb-5" id="review-stars">${starsHtml(state.reviewStars, { clickable: true })}</div>

      <form data-form="review">
        <label class="field-label">Comment</label>
        <textarea name="comment" rows="4" class="field-input mb-5" placeholder="Tell us more..." required></textarea>
        <div class="flex gap-3">
          <button type="button" class="btn btn-outline flex-1" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn btn-primary flex-1" ${state.loadingMessage ? "disabled" : ""}>
            ${state.loadingMessage ? `<span class="spinner"></span> Submitting...` : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  </div>`;
}


function renderDeactivateModal() {
  if (!state.deactivateModalOpen) return "";
  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box">
      <h2 class="font-display text-xl font-bold mb-1">Deactivate Your Profile?</h2>
      <p class="text-gray-500 text-sm mb-5">Are you sure you want to stop providing services through ServiceHub?</p>
      <div class="alert alert-error mb-5"><i class="fa-solid fa-triangle-exclamation"></i> Your profile will no longer appear to customers. Your booking history stays intact.</div>
      <div class="flex gap-3">
        <button type="button" class="btn btn-outline flex-1" data-action="close-modal">Cancel</button>
        <button type="button" class="btn btn-danger flex-1" data-action="confirm-deactivate">Deactivate Profile</button>
      </div>
    </div>
  </div>`;
}


function renderReasonModal() {
  if (!state.reasonModal) return "";
  const { type, providerId } = state.reasonModal;
  const titleByType = { reject: "Reject Provider", block: "Block Provider", suspend: "Suspend Provider" };
  const promptByType = {
    reject: "Why are you rejecting this profile?",
    block: "Why are you blocking this provider?",
    suspend: "Why are you suspending this provider?",
  };
  const buttonByType = { reject: "Reject Profile", block: "Block Provider", suspend: "Suspend Provider" };

  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box">
      <h2 class="font-display text-xl font-bold mb-1">${titleByType[type]}</h2>
      <p class="text-gray-500 text-sm mb-5">${promptByType[type]}</p>
      ${messageBannerHtml()}
      <form data-form="reason-modal">
        <input type="hidden" name="providerId" value="${providerId}" />
        <input type="hidden" name="type" value="${type}" />
        <textarea name="reason" rows="4" class="field-input mb-5" placeholder="Explain your decision..." required></textarea>
        <div class="flex gap-3">
          <button type="button" class="btn btn-outline flex-1" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn btn-danger flex-1" ${state.loadingMessage ? "disabled" : ""}>
            ${state.loadingMessage ? `<span class="spinner"></span>` : buttonByType[type]}
          </button>
        </div>
      </form>
    </div>
  </div>`;
}


function renderProviderReviewModal() {
  if (!state.reviewProfileProviderId) return "";
  const p = state.allProviders.find((pr) => pr.providerId === state.reviewProfileProviderId);
  if (!p) return "";
  const icon = p.icon || CATEGORY_ICONS[p.category] || "fa-toolbox";

  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box" style="max-width:560px;">
      <div class="flex items-center gap-4 mb-5">
        <div class="avatar" style="width:64px;height:64px;font-size:1.4rem;"><i class="fa-solid ${icon}"></i></div>
        <div>
          <h2 class="font-display text-xl font-bold">${p.name}</h2>
          <p class="text-gray-500 text-sm">${p.professionalTitle || ""}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div><span class="text-gray-400">Category:</span> <strong>${p.category}</strong></div>
        <div><span class="text-gray-400">Experience:</span> <strong>${p.experience} years</strong></div>
        <div><span class="text-gray-400">Starting Price:</span> <strong>${formatRupees(p.startingPrice)}</strong></div>
        <div><span class="text-gray-400">Location:</span> <strong>${p.city || ""}, ${p.area || ""}</strong></div>
        <div><span class="text-gray-400">Phone:</span> <strong>${p.phone || "—"}</strong></div>
        <div><span class="text-gray-400">Email:</span> <strong>${p.email || "—"}</strong></div>
        <div><span class="text-gray-400">Working Hours:</span> <strong>${p.workingHours || "—"}</strong></div>
        <div><span class="text-gray-400">Registered:</span> <strong>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</strong></div>
      </div>

      ${
        Array.isArray(p.services) && p.services.length > 0
          ? `<div class="mb-4"><p class="text-xs text-gray-400 mb-1">Services</p><div class="flex flex-wrap gap-2">${p.services.map((s) => `<span class="badge badge-accepted">${s}</span>`).join("")}</div></div>`
          : ""
      }

      <div class="mb-4"><p class="text-xs text-gray-400 mb-1">About</p><p class="text-sm">${p.about || "—"}</p></div>
      <div class="mb-5"><p class="text-xs text-gray-400 mb-1">Why choose them</p><p class="text-sm">${p.description || "—"}</p></div>

      <div class="mb-5">
        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Profile Completion</span><span>${p.profileCompletion || 0}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${p.profileCompletion || 0}%;"></div></div>
      </div>

      <div class="flex gap-3">
        <button type="button" class="btn btn-outline flex-1" data-action="close-modal">Close</button>
        ${
          p.status === "pending"
            ? `<button type="button" class="btn btn-danger flex-1" data-action="open-reason-modal" data-type="reject" data-provider-id="${p.providerId}">Reject</button>
               <button type="button" class="btn btn-success flex-1" data-action="approve-provider" data-provider-id="${p.providerId}">Approve</button>`
            : ""
        }
      </div>
    </div>
  </div>`;
}



function calculateAdminStats() {
  const users = state.allUsers;
  const providers = state.allProviders;
  const bookings = state.allBookingsAdmin;

  const categoryCounts = {};
  PROVIDER_CATEGORIES.forEach((c) => (categoryCounts[c] = 0));
  providers.forEach((p) => {
    if (p.status === "approved" && categoryCounts[p.category] !== undefined) categoryCounts[p.category]++;
  });

  return {
    totalUsers: users.length,
    totalCustomers: users.filter((u) => u.role === "customer").length,
    totalProviders: users.filter((u) => u.role === "provider").length,
    approvedProviders: providers.filter((p) => p.status === "approved").length,
    pendingProviders: providers.filter((p) => p.status === "pending").length,
    blockedProviders: providers.filter((p) => p.status === "blocked").length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter((b) => b.status === "Completed").length,
    totalCommission: state.allCommissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0),
    categoryCounts,
  };
}

function providerStatusBadgeClass(status) {
  return (
    {
      approved: "badge-completed",
      pending: "badge-pending",
      rejected: "badge-rejected",
      blocked: "badge-rejected",
      suspended: "badge-pending",
      deleted: "badge-rejected",
    }[status] || "badge-pending"
  );
}

function renderAdminPanel() {
  return `
  <div class="admin-shell">
    ${renderAdminSidebar()}
    <div class="admin-content">
      <button class="btn btn-outline btn-sm show-mobile mb-4" data-action="toggle-admin-sidebar"><i class="fa-solid fa-bars"></i> Menu</button>
      ${messageBannerHtml()}
      ${
        {
          dashboard: renderAdminDashboardTab,
          approvals: renderAdminApprovalsTab,
          providers: renderAdminAllProvidersTab,
          customers: renderAdminCustomersTab,
          bookings: renderAdminBookingsTab,
          commission: renderAdminCommissionTab,
          payments: renderAdminPaymentsTab,
        }[state.adminTab]?.() || renderAdminDashboardTab()
      }
    </div>
  </div>`;
}

function renderAdminSidebar() {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "fa-gauge" },
    { id: "approvals", label: "Provider Approvals", icon: "fa-user-check" },
    { id: "providers", label: "All Providers", icon: "fa-users-gear" },
    { id: "customers", label: "Customers", icon: "fa-users" },
    { id: "bookings", label: "Bookings", icon: "fa-calendar-check" },
    { id: "commission", label: "Platform Charges", icon: "fa-sack-dollar" },
    { id: "payments", label: "Payments", icon: "fa-receipt" },
  ];
  const pendingCount = state.allProviders.filter((p) => p.status === "pending").length;

  return `
  <div class="admin-sidebar ${state.adminSidebarOpen ? "open" : ""}">
    <h2 class="font-display font-bold text-lg mb-1" style="color:white;">ServiceHub Admin</h2>
    <p class="text-xs mb-6" style="color:rgba(255,255,255,0.6);">Manage your marketplace.</p>
    ${items
      .map(
        (item) => `
      <div class="admin-sidebar-link ${state.adminTab === item.id ? "active" : ""}" data-action="admin-tab" data-tab="${item.id}">
        <i class="fa-solid ${item.icon}"></i> ${item.label}
        ${item.id === "approvals" && pendingCount > 0 ? `<span class="admin-pending-pill">${pendingCount}</span>` : ""}
      </div>`
      )
      .join("")}
    <div class="admin-sidebar-link" data-action="nav" data-page="home" style="margin-top:20px;">
      <i class="fa-solid fa-arrow-left"></i> Back to Site
    </div>
    <div class="admin-sidebar-link" data-action="logout">
      <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
    </div>
  </div>`;
}

function renderAdminDashboardTab() {
  const stats = calculateAdminStats();
  return `
  <h1 class="font-display text-2xl font-bold mb-1">Dashboard</h1>
  <p class="text-gray-500 mb-6">Live overview of your marketplace.</p>

  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    ${statCard("Total Users", stats.totalUsers, "fa-users", "#e4f3ee", "#0b4f4a")}
    ${statCard("Customers", stats.totalCustomers, "fa-user", "#dcecfa", "#16679e")}
    ${statCard("Providers", stats.totalProviders, "fa-user-tie", "#eae0fa", "#6b30b5")}
    ${statCard("Approved Providers", stats.approvedProviders, "fa-circle-check", "#dbf3e3", "#15803d")}
    ${statCard("Pending Approval", stats.pendingProviders, "fa-hourglass-half", "#fef1dc", "#a3620a")}
    ${statCard("Blocked Providers", stats.blockedProviders, "fa-ban", "#fbe0df", "#b91c1c")}
    ${statCard("Total Bookings", stats.totalBookings, "fa-calendar-check", "#e4f3ee", "#0b4f4a")}
    ${statCard("Completed Bookings", stats.completedBookings, "fa-flag-checkered", "#dbf3e3", "#15803d")}
    ${statCard("Total Platform Charges", formatRupees(stats.totalCommission), "fa-sack-dollar", "#fef1dc", "#a3620a")}
  </div>

  <h2 class="font-semibold text-lg mb-3">Service Marketplace</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    ${Object.entries(stats.categoryCounts)
      .filter(([, count]) => count > 0)
      .map(
        ([category, count]) => `
      <div class="card p-5 text-center">
        <div class="gradient-brand" style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;margin:0 auto 10px;">
          <i class="fa-solid ${CATEGORY_ICONS[category] || "fa-toolbox"}"></i>
        </div>
        <p class="text-2xl font-bold font-display">${count}</p>
        <p class="text-xs text-gray-500">${category}</p>
      </div>`
      )
      .join("") || `<p class="text-gray-400 text-sm">No approved providers yet.</p>`}
  </div>`;
}

function renderAdminApprovalsTab() {
  const pending = state.allProviders.filter((p) => p.status === "pending");
  return `
  <h1 class="font-display text-2xl font-bold mb-1">Provider Approvals</h1>
  <p class="text-gray-500 mb-6">${pending.length} profile${pending.length === 1 ? "" : "s"} waiting for review.</p>

  ${
    pending.length === 0
      ? `<div class="card p-10 text-center text-gray-500">No pending providers right now.</div>`
      : `<div class="flex flex-col gap-4">${pending.map(adminApprovalCard).join("")}</div>`
  }`;
}

function adminApprovalCard(p) {
  const icon = p.icon || CATEGORY_ICONS[p.category] || "fa-toolbox";
  return `
  <div class="card p-6">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
      <div class="flex items-center gap-3">
        <div class="avatar" style="width:52px;height:52px;"><i class="fa-solid ${icon}"></i></div>
        <div>
          <h3 class="font-semibold">${p.name}</h3>
          <p class="text-xs text-gray-500">${p.professionalTitle || ""} &middot; ${p.category}</p>
        </div>
      </div>
      <span class="text-xs text-gray-400">Profile ${p.profileCompletion || 0}% complete</span>
    </div>
    <div class="grid sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
      <p><i class="fa-solid fa-location-dot"></i> ${p.city || ""}, ${p.area || ""}</p>
      <p><i class="fa-regular fa-clock"></i> ${p.experience || 0} years</p>
      <p><i class="fa-solid fa-tag"></i> ${formatRupees(p.startingPrice)}</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-outline btn-sm" data-action="open-review-profile" data-provider-id="${p.providerId}">Review Profile</button>
      <button class="btn btn-success btn-sm" data-action="approve-provider" data-provider-id="${p.providerId}">Approve</button>
      <button class="btn btn-danger btn-sm" data-action="open-reason-modal" data-type="reject" data-provider-id="${p.providerId}">Reject</button>
    </div>
  </div>`;
}

function renderAdminAllProvidersTab() {
  const search = state.adminSearch.trim().toLowerCase();
  const filtered = state.allProviders.filter((p) => {
    const matchesStatus = state.adminStatusFilter === "All" || p.status === state.adminStatusFilter;
    const matchesSearch =
      search === "" ||
      (p.name || "").toLowerCase().includes(search) ||
      (p.email || "").toLowerCase().includes(search) ||
      (p.category || "").toLowerCase().includes(search) ||
      (p.providerId || "").toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  const statusTabs = ["All", "pending", "approved", "rejected", "blocked", "suspended", "deleted"];

  return `
  <h1 class="font-display text-2xl font-bold mb-1">All Providers</h1>
  <p class="text-gray-500 mb-6">${state.allProviders.length} total providers.</p>

  <input type="text" class="field-input mb-4" style="max-width:340px;" placeholder="Search name, email, category, ID..."
    value="${state.adminSearch}" data-action-input="admin-search" />

  <div class="flex flex-wrap gap-2 mb-6">
    ${statusTabs
      .map(
        (s) => `<button class="btn btn-sm ${state.adminStatusFilter === s ? "btn-primary" : "btn-outline"}" data-action="admin-status-filter" data-status="${s}">${s.toUpperCase()}</button>`
      )
      .join("")}
  </div>

  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead><tr><th>Provider</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${filtered
          .map(
            (p) => `
          <tr>
            <td><strong>${p.name}</strong><br/><span class="text-xs text-gray-400">${p.email || ""}</span></td>
            <td>${p.category || "—"}</td>
            <td>${formatRupees(p.startingPrice)}</td>
            <td>${p.rating ? p.rating.toFixed(1) : "New"}</td>
            <td><span class="badge ${providerStatusBadgeClass(p.status)}">${p.status}</span></td>
            <td>
              <div class="flex flex-wrap gap-1">
                <button class="btn btn-outline btn-sm" data-action="open-review-profile" data-provider-id="${p.providerId}">View</button>
                ${
                  p.status === "approved"
                    ? `<button class="btn btn-outline btn-sm" data-action="open-reason-modal" data-type="suspend" data-provider-id="${p.providerId}">Suspend</button>
                       <button class="btn btn-danger btn-sm" data-action="open-reason-modal" data-type="block" data-provider-id="${p.providerId}">Block</button>`
                    : ""
                }
                ${
                  p.status === "suspended" || p.status === "blocked"
                    ? `<button class="btn btn-success btn-sm" data-action="restore-provider" data-provider-id="${p.providerId}">Restore</button>`
                    : ""
                }
                ${
                  p.status !== "deleted"
                    ? `<button class="btn btn-danger btn-sm" data-action="admin-remove-provider" data-provider-id="${p.providerId}">Remove</button>`
                    : ""
                }
              </div>
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
    ${filtered.length === 0 ? `<div class="p-8 text-center text-gray-500">No providers match your search/filter.</div>` : ""}
  </div>`;
}

function renderAdminCustomersTab() {
  const customers = state.allUsers.filter((u) => u.role === "customer");
  const search = state.adminSearch.trim().toLowerCase();
  const filtered = customers.filter(
    (c) => search === "" || (c.name || "").toLowerCase().includes(search) || (c.email || "").toLowerCase().includes(search)
  );

  return `
  <h1 class="font-display text-2xl font-bold mb-1">Customers</h1>
  <p class="text-gray-500 mb-6">${customers.length} registered customers.</p>

  <input type="text" class="field-input mb-4" style="max-width:340px;" placeholder="Search name or email..."
    value="${state.adminSearch}" data-action-input="admin-search" />

  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead><tr><th>Name</th><th>Email</th><th>Registered</th><th>Total Bookings</th><th>Completed</th></tr></thead>
      <tbody>
        ${filtered
          .map((c) => {
            const theirBookings = state.allBookingsAdmin.filter((b) => b.customerId === c.uid);
            return `<tr>
              <td>${c.name}</td>
              <td>${c.email}</td>
              <td>${c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
              <td>${theirBookings.length}</td>
              <td>${theirBookings.filter((b) => b.status === "Completed").length}</td>
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>
    ${filtered.length === 0 ? `<div class="p-8 text-center text-gray-500">No customers match your search.</div>` : ""}
  </div>`;
}

function renderAdminBookingsTab() {
  const statusTabs = ["All", "Pending", "Accepted", "In Progress", "Completed", "Rejected"];
  const filtered =
    state.adminBookingStatusFilter === "All"
      ? state.allBookingsAdmin
      : state.allBookingsAdmin.filter((b) => b.status === state.adminBookingStatusFilter);

  return `
  <h1 class="font-display text-2xl font-bold mb-1">All Bookings</h1>
  <p class="text-gray-500 mb-6">${state.allBookingsAdmin.length} total bookings across the marketplace.</p>

  <div class="flex flex-wrap gap-2 mb-6">
    ${statusTabs
      .map(
        (s) => `<button class="btn btn-sm ${state.adminBookingStatusFilter === s ? "btn-primary" : "btn-outline"}" data-action="admin-booking-filter" data-status="${s}">${s.toUpperCase()}</button>`
      )
      .join("")}
  </div>

  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead><tr><th>Booking ID</th><th>Customer</th><th>Provider</th><th>Service</th><th>Price</th><th>Platform Charges</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        ${filtered
          .map(
            (b) => `<tr>
          <td class="font-mono text-xs">${b.bookingId}</td>
          <td>${b.customerName}</td>
          <td>${b.providerName}</td>
          <td>${b.service}</td>
          <td>${formatRupees(b.price)}</td>
          <td>${formatRupees(b.adminCommission)}</td>
          <td><span class="badge ${statusBadgeClass(b.status)}">${b.status}</span></td>
          <td>${b.date}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
    ${filtered.length === 0 ? `<div class="p-8 text-center text-gray-500">No bookings match this filter.</div>` : ""}
  </div>`;
}

function statusBadgeClass(status) {
  return (
    { Pending: "badge-pending", Accepted: "badge-accepted", "In Progress": "badge-inprogress", Completed: "badge-completed", Rejected: "badge-rejected" }[
      status
    ] || "badge-pending"
  );
}

function renderAdminCommissionTab() {
  const commissions = state.allCommissions;
  const totalCommission = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayCommission = commissions
    .filter((c) => c.createdAt >= startOfToday.getTime())
    .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthCommission = commissions
    .filter((c) => c.createdAt >= startOfMonth.getTime())
    .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

  // Commission source by category — spec: "WHERE MY COMMISSION CAME FROM"
  const byCategory = {};
  commissions.forEach((c) => {
    const provider = state.allProviders.find((p) => p.providerId === c.providerId);
    const category = provider?.category || "Other";
    byCategory[category] = (byCategory[category] || 0) + (c.commissionAmount || 0);
  });

  return `
  <h1 class="font-display text-2xl font-bold mb-1">Platform Charges</h1>
  <p class="text-gray-500 mb-6">Where your ServiceHub revenue comes from.</p>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    ${statCard("Total Platform Charges", formatRupees(totalCommission), "fa-sack-dollar", "#fef1dc", "#a3620a")}
    ${statCard("Today", formatRupees(todayCommission), "fa-calendar-day", "#e4f3ee", "#0b4f4a")}
    ${statCard("This Month", formatRupees(monthCommission), "fa-calendar", "#dcecfa", "#16679e")}
    ${statCard("Completed Bookings", commissions.length, "fa-flag-checkered", "#dbf3e3", "#15803d")}
  </div>

  <div class="card p-6 mb-6">
    <h3 class="font-semibold mb-4">Platform Charges Settings</h3>
    <form data-form="commission-settings" class="flex flex-wrap items-end gap-4">
      <div>
        <label class="field-label">Default Platform Charges (Rs.)</label>
        <input type="number" name="amount" min="0" class="field-input" style="width:160px;" value="${state.commissionSettings.amount}" />
      </div>
      <button type="submit" class="btn btn-primary" ${state.loadingMessage ? "disabled" : ""}>Save Settings</button>
    </form>
    <p class="text-xs text-gray-400 mt-2">Only affects NEW bookings — bookings already created keep the commission that was locked in at the time.</p>
  </div>

  <h3 class="font-semibold mb-3">Platform Charges by Category</h3>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    ${Object.entries(byCategory)
      .map(([category, amount]) => `<div class="card p-4 text-center"><p class="font-semibold">${formatRupees(amount)}</p><p class="text-xs text-gray-500">${category}</p></div>`)
      .join("") || `<p class="text-gray-400 text-sm">No commission earned yet.</p>`}
  </div>

  <h3 class="font-semibold mb-3">Transactions</h3>
  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead><tr><th>Charge ID</th><th>Booking</th><th>Provider</th><th>Customer</th><th>Amount</th><th>Provider Earning</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        ${commissions
          .map(
            (c) => `<tr>
          <td class="font-mono text-xs">${c.commissionId.slice(0, 8)}</td>
          <td class="font-mono text-xs">${c.bookingId}</td>
          <td>${c.providerName}</td>
          <td>${c.customerName}</td>
          <td>${formatRupees(c.commissionAmount)}</td>
          <td>${formatRupees(c.providerEarning)}</td>
          <td><span class="badge badge-completed">${c.status}</span></td>
          <td>${new Date(c.createdAt).toLocaleDateString()}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
    ${commissions.length === 0 ? `<div class="p-8 text-center text-gray-500">No commission transactions yet.</div>` : ""}
  </div>`;
}

function renderAdminPaymentsTab() {
  const filterTabs = [
    { id: "All", label: "All" },
    { id: "customerToProvider", label: "Customer → Provider" },
    { id: "providerToAdmin", label: "Provider → Admin (Platform Charges)" },
  ];
  const filtered =
    state.adminPaymentFilter === "All" ? state.allPayments : state.allPayments.filter((p) => p.type === state.adminPaymentFilter);

  return `
  <h1 class="font-display text-2xl font-bold mb-1">Payments</h1>
  <p class="text-gray-500 mb-6">Every digital payment proof submitted, from both customers and providers.</p>

  <div class="flex flex-wrap gap-2 mb-6">
    ${filterTabs
      .map(
        (t) => `<button class="btn btn-sm ${state.adminPaymentFilter === t.id ? "btn-primary" : "btn-outline"}" data-action="admin-payment-filter" data-type="${t.id}">${t.label}</button>`
      )
      .join("")}
  </div>

  ${
    filtered.length === 0
      ? `<div class="card p-10 text-center text-gray-500">No payment proofs submitted yet.</div>`
      : `<div class="flex flex-col gap-4">
          ${filtered
            .map(
              (p) => `
            <div class="card p-6">
              <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p class="text-xs text-gray-400 mb-1">${p.bookingCode || p.bookingId}</p>
                  <h3 class="font-semibold">
                    ${p.type === "providerToAdmin" ? `${p.providerName} → ServiceHub` : `${p.customerName} → ${p.providerName}`}
                  </h3>
                  <p class="text-xs text-gray-500">${p.service || ""}</p>
                </div>
                <span class="badge ${p.status === "verified" ? "badge-completed" : "badge-pending"}">${p.status}</span>
              </div>
              <div class="grid sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                <p><i class="fa-solid fa-money-bill"></i> ${formatRupees(p.amount)}</p>
                <p><i class="fa-solid fa-mobile-screen"></i> ${p.method === "jazzcash" ? "JazzCash" : p.method === "easypesa" ? "EasyPesa" : "Bank Transfer"}</p>
                <p><i class="fa-solid fa-hashtag"></i> ${p.reference}</p>
              </div>
              ${p.receiptImage ? `<img src="${p.receiptImage}" style="max-width:220px; border-radius:10px; margin-bottom:12px;" />` : ""}
              <div class="flex gap-2">
                ${p.status !== "verified" ? `<button class="btn btn-success btn-sm" data-action="verify-payment" data-payment-id="${p.paymentId}">Mark Verified</button>` : ""}
              </div>
            </div>`
            )
            .join("")}
        </div>`
  }`;
}

function renderBlockedScreen() {
  const profile = state.myProviderProfile;
  return `
  <section class="max-w-lg mx-auto px-5 py-24 text-center">
    <div class="card p-10">
      <div style="width:64px;height:64px;border-radius:999px;background:#fbe0df;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <i class="fa-solid fa-ban text-2xl" style="color:var(--error);"></i>
      </div>
      <h1 class="font-display text-2xl font-bold mb-2">Your ServiceHub provider account has been blocked.</h1>
      <p class="text-gray-500 mb-1"><strong>Reason:</strong></p>
      <p class="text-gray-600 mb-6">${profile?.blockReason || "No reason provided."}</p>
      <p class="text-sm text-gray-400 mb-6">If you believe this was a mistake, please contact ServiceHub support.</p>
      <button class="btn btn-outline" data-action="logout">Logout</button>
    </div>
  </section>`;
}

function renderAccessDeniedScreen() {
  return `
  <section class="max-w-lg mx-auto px-5 py-24 text-center">
    <div class="card p-10">
      <i class="fa-solid fa-lock text-3xl mb-4" style="color:var(--error);"></i>
      <h1 class="font-display text-2xl font-bold mb-2">Access Denied</h1>
      <p class="text-gray-500 mb-6">You don't have permission to view this page.</p>
      <button class="btn btn-primary" data-action="nav" data-page="home">Go Home</button>
    </div>
  </section>`;
}

const PAGE_RENDERERS = {
  welcome: renderWelcome,
  home: renderHome,
  services: renderServices,
  providerDetails: renderProviderDetails,
  login: renderWelcome, 
  register: renderWelcome,
  booking: renderBooking,
  customerDashboard: renderCustomerDashboard,
  providerDashboard: renderProviderDashboard,
  providerProfileForm: renderProviderProfileForm,
  admin: renderAdminPanel,
  blocked: renderBlockedScreen,
  accessDenied: renderAccessDeniedScreen,
};

function render() {
  const root = document.getElementById("root");


  const page = guardPage(state.currentPage);
  state.currentPage = page;

  const pageRenderer = PAGE_RENDERERS[page] || renderHome;

  
  const isAdminPage = page === "admin";

  root.innerHTML = `
    ${page === "blocked" ? "" : renderNavbar()}
    <main${isAdminPage ? ' class="admin-main"' : ""}>${state.authChecked ? pageRenderer() : loadingScreenHtml()}</main>
    ${page === "blocked" || isAdminPage ? "" : renderFooter()}
    ${renderReviewModal()}
    ${renderDeactivateModal()}
    ${renderReasonModal()}
    ${renderProviderReviewModal()}
    ${renderChatModal()}
    ${renderPaymentModal()}
    ${toastContainerHtml()}
  `;

 
  syncRegisterRoleField();
  initScrollReveal();


  if (state.chatModalBookingId) {
    const chatBox = document.getElementById("chat-messages-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }
}


let scrollRevealObserver = null;
function initScrollReveal() {
  if (!scrollRevealObserver) {
    scrollRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            scrollRevealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }
  document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => scrollRevealObserver.observe(el));
}

function loadingScreenHtml() {
  return `<div class="flex flex-col items-center justify-center py-32 gap-3 text-gray-400">
    <span class="spinner spinner-dark" style="width:28px;height:28px;"></span>
    <p>Loading ServiceHub...</p>
  </div>`;
}


function guardPage(page) {
  const protectedCustomerPages = ["booking", "customerDashboard"];
  const protectedProviderPages = ["providerDashboard", "providerProfileForm"];

  
  if (state.myProviderProfile?.status === "blocked" && state.currentUser?.role === "provider") {
    return "blocked";
  }

  
  if (page === "admin") {
    if (!isAdmin()) {
      state.errorMessage = "Access Denied — admin accounts only.";
      return state.currentUser ? "accessDenied" : "welcome";
    }
    return page;
  }

  if (protectedCustomerPages.includes(page) || protectedProviderPages.includes(page)) {
    if (!state.currentUser) {
      state.errorMessage = "Please login to continue.";
      state.authTab = "login";
      return "welcome";
    }
  }
  if (page === "customerDashboard" && state.currentUser?.role !== "customer") {
    return isAdmin() ? "admin" : "providerDashboard";
  }
  if ((page === "providerDashboard" || page === "providerProfileForm") && state.currentUser?.role !== "provider") {
    return isAdmin() ? "admin" : "customerDashboard";
  }
  if (page === "booking" && state.currentUser?.role === "provider") {
    state.errorMessage = "Service providers cannot book services. Please use a customer account.";
    return "providerDetails";
  }
  return page;
}

function syncRegisterRoleField() {
  const select = document.getElementById("register-role-select");
  const providerField = document.getElementById("provider-id-field");
  const adminField = document.getElementById("admin-id-field");
  if (select && providerField) {
    providerField.style.display = select.value === "provider" ? "block" : "none";
  }
  if (select && adminField) {
    adminField.style.display = select.value === "admin" ? "block" : "none";
  }
}


function blockIfFirebaseNotConfigured() {
  if (isFirebaseConfigured()) return false;
  state.errorMessage = "Firebase isn't configured yet — open script.js and paste your real firebaseConfig (SECTION 1).";
  render();
  return true;
}

async function registerUser(name, email, password, role, providerId) {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;

 
  if (!name.trim()) return (state.errorMessage = "Please enter your name.");
  if (!isValidEmail(email)) return (state.errorMessage = "Please enter a valid email.");
  if (password.length < 6) return (state.errorMessage = "Password must be at least 6 characters.");
  if (!role) return (state.errorMessage = "Please select your role.");

  
  if (role === "admin") {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      state.errorMessage = "This email/password is not authorized to register as an admin.";
      render();
      return;
    }
  }

  state.loadingMessage = "Creating your account...";
  render();

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    const userDoc = {
      name: name.trim(),
      email,
      role,
      createdAt: Date.now(),
    };

    
    if (role === "provider") {
      userDoc.providerId = uid;
      await set(ref(db, `providers/${uid}`), {
        providerId: uid,
        uid,
        name: name.trim(),
        email,
        status: "pending",
        active: false,
        profileCompletion: 0,
        totalReviews: 0,
        rating: 0,
        createdAt: Date.now(),
      });
      await logActivity(`New provider registered: ${name.trim()}`);
    } else if (role === "admin") {
      await logActivity(`Admin account created: ${name.trim()}`);
    } else {
      await logActivity(`New customer registered: ${name.trim()}`);
    }

    await set(ref(db, `users/${uid}`), userDoc);

    state.currentUser = { uid, ...userDoc };
    state.successMessage = role === "admin" ? "Admin account created! Welcome, " + name.trim() + "." : "Account created! Welcome to ServiceHub.";
  
    navigateTo(role === "provider" ? "providerProfileForm" : role === "admin" ? "admin" : "home");
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}

async function loginUser(email, password) {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;
  if (!isValidEmail(email)) return (state.errorMessage = "Please enter a valid email.");
  if (!password) return (state.errorMessage = "Please enter your password.");

  state.loadingMessage = "Logging in...";
  render();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
    state.loadingMessage = null;
    render();
  }
}


async function loginWithGoogle() {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;

  state.loadingMessage = "Connecting to Google...";
  render();

  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const uid = credential.user.uid;

    const userSnap = await get(ref(db, `users/${uid}`));
    if (!userSnap.exists()) {
      
      const newUserDoc = {
        name: credential.user.displayName || "New Customer",
        email: credential.user.email,
        role: "customer",
        createdAt: Date.now(),
      };
      await set(ref(db, `users/${uid}`), newUserDoc);
    }
  
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
    state.loadingMessage = null;
    render();
  }
}

async function logoutUser() {
  unsubscribeFromBookings();
  unsubscribeFromMyProviderData();
  unsubscribeFromAdminData();
  unsubscribeFromPayments();
  closeChat();
  await signOut(auth);
  state.currentUser = null;
  state.bookings = [];
  state.myProviderProfile = null;
  state.myReviews = [];
  state.incomingCustomerPayments = [];
  state.myPaymentsAsProvider = [];
  state.myPaymentsAsCustomer = [];
  state.allPayments = [];
  state.authTab = "login";
  navigateTo("welcome");
}

function friendlyFirebaseError(err) {
  const code = err.code || "";
  const message = (err.message || "").toLowerCase();
  if (code.includes("email-already-in-use")) return "That email is already registered. Try logging in instead.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Incorrect email or password.";
  if (code.includes("weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("popup-closed-by-user")) return "Google sign-in was closed before finishing. Please try again.";
  if (code.includes("popup-blocked")) return "Your browser blocked the Google sign-in popup. Please allow popups and try again.";
  if (code.includes("unauthorized-domain"))
    return "This domain isn't authorized for Google sign-in yet — add it under Firebase Console → Authentication → Settings → Authorized domains.";
  if (code.includes("api-key") || code.includes("configuration")) {
    return "Firebase isn't configured yet — paste your firebaseConfig into script.js.";
  }
  
  if (code.toUpperCase().includes("PERMISSION_DENIED") || message.includes("permission_denied") || message.includes("permission denied")) {
    return "Permission denied by the database. Double-check your Realtime Database security rules include a rule allowing this action (see setup instructions) and that they've been Published, not just saved as a draft.";
  }
  return err.message || "Something went wrong. Please try again.";
}


if (!isFirebaseConfigured()) {
  state.authChecked = true;
  state.errorMessage =
    "Firebase isn't configured yet — open script.js and paste your real firebaseConfig near the top (SECTION 1). Until then, login/signup, bookings, and dashboards can't reach a database.";
} else {
  onAuthStateChanged(auth, async (firebaseUser) => {
  const wasLoggedOut = !state.currentUser;

  if (firebaseUser) {
    try {
      const userSnap = await get(ref(db, `users/${firebaseUser.uid}`));
      if (userSnap.exists()) {
        state.currentUser = { uid: firebaseUser.uid, ...userSnap.val() };
      }
    } catch (err) {
      console.warn("Could not load user profile:", err.message);
    }

    if (state.currentUser && (state.currentPage === "welcome" || !state.authChecked)) {
      if (state.currentUser.role === "provider") {
        state.currentPage = "providerDashboard"; 
      } else if (state.currentUser.role === "admin") {
        state.currentPage = "admin";
      } else {
        state.currentPage = "home";
      }
    }

    
    if (state.currentUser) {
      subscribeToBookingsForCurrentUser();
      if (state.currentUser.role === "provider") {
        subscribeToMyProviderProfile();
        subscribeToMyReviews();
        subscribeToIncomingPayments();
        subscribeToMyProviderPayments();
      }
      if (state.currentUser.role === "customer") {
        subscribeToMyCustomerPayments();
      }
      if (state.currentUser.role === "admin") {
        subscribeToAdminData();
        subscribeToAllPayments();
      }
    }
  } else {
    unsubscribeFromBookings();
    unsubscribeFromMyProviderData();
    unsubscribeFromAdminData();
    unsubscribeFromPayments();
    closeChat();
    state.currentUser = null;
    state.myProviderProfile = null;
    state.myReviews = [];
    state.incomingCustomerPayments = [];
    state.myPaymentsAsProvider = [];
    state.myPaymentsAsCustomer = [];
    state.allPayments = [];
    
    if (!wasLoggedOut) {
      state.currentPage = "welcome";
    }
  }

  state.authChecked = true;
  render();
  });
}



async function createBooking(formData) {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;
  const provider = findProviderById(state.selectedProviderId);

  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location").trim();
  const description = formData.get("description").trim();

  
  if (!date) return (state.errorMessage = "Please select a date.");
  if (!time) return (state.errorMessage = "Please select a time.");
  if (!location) return (state.errorMessage = "Please enter your location.");
  if (!description) return (state.errorMessage = "Please describe your service problem.");

  state.loadingMessage = "Creating your booking...";
  render();

  try {
    const bookingId = generateBookingId();
    const price = provider.startingPrice || parsePriceToNumber(provider.price);
    const { adminCommission, providerEarning } = calculateCommission(price, state.commissionSettings);

    const newBooking = {
      bookingId,
      customerId: state.currentUser.uid,
      customerName: state.currentUser.name,
      providerId: provider.providerId,
      providerName: provider.name,
      service: provider.category,
      date,
      time,
      location,
      description,
      status: "Pending",
      hasReviewed: false,
      
      price,
      adminCommission,
      providerEarning,
      commissionStatus: "pending",
      createdAt: Date.now(),
      createdAtMillis: Date.now(),
    };

    
    await push(ref(db, "bookings"), newBooking);
    await logActivity(`New booking: ${bookingId} (${provider.category})`);

    state.successMessage = `Booking ${bookingId} created! Track it from your dashboard.`;
    navigateTo("customerDashboard");
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}

async function submitReview(docId, comment) {
  clearMessages();
  if (blockIfFirebaseNotConfigured()) return;

 
  if (!docId) {
    state.errorMessage = "Something went wrong opening this review — please close and try again.";
    render();
    return;
  }

  const booking = state.bookings.find((b) => b.docId === docId);
  if (!booking) {
    state.errorMessage = "Couldn't find that booking anymore — please refresh and try again.";
    render();
    return;
  }

  if (state.reviewStars < 1) {
    state.errorMessage = "Please select a star rating.";
    render();
    return;
  }
  if (!comment.trim()) {
    state.errorMessage = "Please write a short comment.";
    render();
    return;
  }

  state.loadingMessage = "Submitting review...";
  render();

  
  const withTimeout = (promise, ms, timeoutMessage) =>
    Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), ms))]);

  try {
   
    const freshSnap = await withTimeout(
      get(ref(db, `bookings/${docId}`)),
      15000,
      "The database didn't respond in time. Check your Realtime Database security rules (see setup instructions) and your internet connection."
    );
    const freshData = freshSnap.val();

    if (!freshData || freshData.status !== "Completed") {
      state.errorMessage = "This booking is not completed yet.";
      return;
    }
    if (freshData.hasReviewed) {
      state.errorMessage = "You have already reviewed this booking.";
      return;
    }

    await withTimeout(
      push(ref(db, "reviews"), {
        bookingId: booking.bookingId,
        customerId: state.currentUser.uid,
        customerName: state.currentUser.name, 
        providerId: booking.providerId,
        rating: state.reviewStars,
        comment: comment.trim(),
        createdAt: Date.now(),
      }),
      15000,
      "Submitting the review timed out. Check your Realtime Database security rules and try again."
    );

    await update(ref(db, `bookings/${docId}`), { hasReviewed: true });

  
    await updateProviderRatingAfterReview(booking.providerId, state.reviewStars);

    await logActivity(`New review (${state.reviewStars}★) for booking ${booking.bookingId}`);

    state.successMessage = "Thanks for your review!";
    state.reviewModalBookingId = null;
    state.reviewStars = 0;
    
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}


async function updateProviderRatingAfterReview(providerId, newRating) {
  try {
    const snap = await get(ref(db, `providers/${providerId}`));
    const provider = snap.val();
    if (!provider) return;

    const oldCount = provider.totalReviews || 0;
    const oldAverage = provider.rating || 0;
    const newCount = oldCount + 1;
    const newAverage = (oldAverage * oldCount + newRating) / newCount;

    await update(ref(db, `providers/${providerId}`), {
      totalReviews: newCount,
      rating: Math.round(newAverage * 10) / 10, 
    });
  } catch (err) {
    console.warn("Could not update provider rating:", err.message);
  }
}



document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  
  if (action === "close-modal-backdrop" && !e.target.classList.contains("modal-backdrop")) {
    return;
  }

  switch (action) {
    case "nav":
      navigateTo(target.dataset.page);
      break;

    case "toggle-mobile-menu":
      state.mobileMenuOpen = !state.mobileMenuOpen;
      render();
      break;

    case "scroll-how-it-works":
      if (state.currentPage !== "home") {
        navigateTo("home");
        setTimeout(() => document.getElementById("how-it-works-section")?.scrollIntoView({ behavior: "smooth" }), 150);
      } else {
        document.getElementById("how-it-works-section")?.scrollIntoView({ behavior: "smooth" });
      }
      break;

    case "logout":
      logoutUser();
      break;

    case "google-signin":
      loginWithGoogle();
      break;

    case "auth-nav":
      state.authTab = target.dataset.tab;
      navigateTo("welcome");
      break;

    case "auth-tab":
      state.authTab = target.dataset.tab;
      clearMessages();
      render();
      break;

    case "view-profile":
      navigateTo("providerDetails", { providerId: target.dataset.providerId });
      break;

    case "book-service":
      if (!state.currentUser) {
        state.errorMessage = "Please login to book a service.";
        state.authTab = "login";
        navigateTo("welcome");
        break;
      }
      if (state.currentUser.role === "provider") {
        state.errorMessage = "Service providers cannot book services. Please use a customer account.";
        render();
        break;
      }
      navigateTo("booking", { providerId: target.dataset.providerId });
      break;

    case "filter-category":
      state.filterCategory = target.dataset.category;
      render();
      break;

    case "filter-category-from-home":
      state.filterCategory = target.dataset.category;
      navigateTo("services");
      break;

    case "provider-tab":
      state.providerTab = target.dataset.tab;
      render();
      break;

    case "update-status":
      updateBookingStatus(target.dataset.bookingDocId, target.dataset.current, target.dataset.next);
      break;

    case "open-review":
      state.reviewModalBookingId = target.dataset.bookingDocId;
      state.reviewStars = 0;
      clearMessages();
      render();
      break;

    case "set-review-star":
      state.reviewStars = parseInt(target.dataset.star, 10);
      render();
      break;

    case "run-assistant": {
      const input = document.getElementById("assistant-input");
      const resultBox = document.getElementById("assistant-result");
      if (input && resultBox) {
        const { category, urgency } = analyzeProblem(input.value);
        resultBox.innerHTML = category
          ? `<div class="alert alert-info">
               <div>
                 <p><strong>Suggested Service:</strong> ${category}</p>
                 <p><strong>Urgency:</strong> ${urgency}</p>
               </div>
             </div>`
          : `<div class="alert alert-info">We couldn't detect a specific category — feel free to fill the form manually.</div>`;
      }
      break;
    }

    
    case "cycle-availability": {
      const order = ["available", "busy", "offline"];
      const next = order[(order.indexOf(target.dataset.current) + 1) % order.length];
      update(ref(db, `providers/${state.currentUser.providerId}`), { availability: next })
        .then(() => showToast(`Availability set to ${next}.`, "success"))
        .catch((err) => {
          state.errorMessage = err.message;
          render();
        });
      break;
    }

    case "open-deactivate-modal":
      state.deactivateModalOpen = true;
      clearMessages();
      render();
      break;

    case "confirm-deactivate":
      state.deactivateModalOpen = false;
      deleteProviderProfile(state.currentUser.providerId, { removedByAdmin: false }).then(() => render());
      render();
      break;

   
    case "admin-tab":
      state.adminTab = target.dataset.tab;
      state.adminSidebarOpen = false;
      state.adminSearch = "";
      render();
      break;

    case "toggle-admin-sidebar":
      state.adminSidebarOpen = !state.adminSidebarOpen;
      render();
      break;

    case "admin-status-filter":
      state.adminStatusFilter = target.dataset.status;
      render();
      break;

    case "admin-booking-filter":
      state.adminBookingStatusFilter = target.dataset.status;
      render();
      break;

    
    case "approve-provider":
      approveProvider(target.dataset.providerId).then(() => render());
      break;

    case "restore-provider":
      restoreProvider(target.dataset.providerId).then(() => render());
      break;

    case "admin-remove-provider":
      if (confirm("Remove this provider? Their booking history will be kept, but they'll disappear from Services.")) {
        deleteProviderProfile(target.dataset.providerId, { removedByAdmin: true }).then(() => render());
      }
      break;

    case "open-reason-modal":
      state.reasonModal = { type: target.dataset.type, providerId: target.dataset.providerId };
      clearMessages();
      render();
      break;

    case "open-review-profile":
      state.reviewProfileProviderId = target.dataset.providerId;
      clearMessages();
      render();
      break;

   
    case "open-chat":
      openChat(target.dataset.bookingDocId);
      break;

    
    case "open-payment-modal": {
      const type = target.dataset.type;
      const booking = state.bookings.find((b) => b.docId === target.dataset.bookingDocId);
      if (!booking) break;
      state.paymentModalConfig = { type, booking };
      state.paymentReceiptDataUrl = null;
      clearMessages();
      render();
      break;
    }

    case "view-receipt": {
      const img = document.getElementById(target.dataset.receipt);
      if (img) img.style.display = img.style.display === "none" ? "block" : "none";
      break;
    }

    case "verify-payment":
      verifyPayment(target.dataset.paymentId);
      break;

    case "admin-payment-filter":
      state.adminPaymentFilter = target.dataset.type;
      render();
      break;

    case "close-modal":
    case "close-modal-backdrop":
      state.reviewModalBookingId = null;
      state.reviewStars = 0;
      state.deactivateModalOpen = false;
      state.reasonModal = null;
      state.reviewProfileProviderId = null;
      state.paymentModalConfig = null;
      state.paymentReceiptDataUrl = null;
      closeChat();
      clearMessages();
      render();
      break;
  }
});


document.addEventListener("input", (e) => {
  if (e.target.dataset.actionInput === "search") {
    state.searchQuery = e.target.value;
    render();
   
    const newInput = document.getElementById("search-input");
    if (newInput) {
      newInput.focus();
      newInput.setSelectionRange(newInput.value.length, newInput.value.length);
    }
  }
  if (e.target.dataset.actionInput === "admin-search") {
    state.adminSearch = e.target.value;
    render();
    const newInput = document.querySelector('[data-action-input="admin-search"]');
    if (newInput) {
      newInput.focus();
      newInput.setSelectionRange(newInput.value.length, newInput.value.length);
    }
  }
  if (e.target.id === "register-role-select") {
    syncRegisterRoleField();
  }
 
  if (e.target.dataset.actionInput === "cnic-format") {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 13);
    let formatted = digitsOnly;
    if (digitsOnly.length > 5 && digitsOnly.length <= 12) {
      formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    } else if (digitsOnly.length > 12) {
      formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 12)}-${digitsOnly.slice(12)}`;
    }
    e.target.value = formatted;
  }
});


document.addEventListener("change", (e) => {
  if (e.target.id === "profile-category-select") {
    state.profileFormCategory = e.target.value;
    const container = document.getElementById("services-checklist-container");
    if (container) container.innerHTML = renderServicesChecklist(e.target.value, []);
  }
});


document.addEventListener("submit", (e) => {
  const formType = e.target.dataset.form;
  if (!formType) return;
  e.preventDefault();

  const formData = new FormData(e.target);

  if (formType === "login") {
    loginUser(formData.get("email").trim(), formData.get("password"));
  }

  if (formType === "register") {
    registerUser(formData.get("name"), formData.get("email").trim(), formData.get("password"), formData.get("role"));
  }

  if (formType === "booking") {
    createBooking(formData);
  }

  if (formType === "review") {
    submitReview(state.reviewModalBookingId, formData.get("comment"));
  }

  if (formType === "provider-profile") {
    submitProviderProfileForm(formData);
  }

  if (formType === "reason-modal") {
    const providerId = formData.get("providerId");
    const type = formData.get("type");
    const reason = formData.get("reason").trim();
    if (!reason) {
      state.errorMessage = "Please provide a reason.";
      render();
      return;
    }
    const actionByType = { reject: rejectProvider, block: blockProvider, suspend: suspendProvider };
    state.loadingMessage = "Saving...";
    render();
    actionByType[type](providerId, reason)
      .then(() => {
        state.reasonModal = null;
        clearMessages();
      })
      .catch((err) => (state.errorMessage = err.message))
      .finally(() => {
        state.loadingMessage = null;
        render();
      });
  }

  if (formType === "commission-settings") {
    const amount = parseInt(formData.get("amount"), 10);
    if (!amount || amount < 0) {
      state.errorMessage = "Please enter a valid commission amount.";
      render();
      return;
    }
    set(ref(db, "adminSettings/commission"), { type: "fixed", amount, updatedAt: Date.now() })
      .then(() => showToast("Platform charges settings saved.", "success"))
      .catch((err) => {
        state.errorMessage = err.message;
        render();
      });
  }

  if (formType === "chat-message") {
    const text = formData.get("text");
    sendChatMessage(state.chatModalBookingId, text);
    e.target.reset(); 
  }

  if (formType === "payment-proof") {
    submitPaymentProof(formData);
  }
});


document.addEventListener("change", (e) => {
  if (e.target.id === "receipt-file-input" && e.target.files[0]) {
    const preview = document.getElementById("receipt-preview");
    if (preview) preview.innerHTML = `<span class="text-xs text-gray-400"><span class="spinner spinner-dark"></span> Processing image...</span>`;
    compressImageToBase64(e.target.files[0])
      .then((dataUrl) => {
        state.paymentReceiptDataUrl = dataUrl;
        if (preview) preview.innerHTML = `<img src="${dataUrl}" style="max-width:160px; border-radius:8px;" />`;
      })
      .catch((err) => {
        state.errorMessage = err.message;
        render();
      });
  }
});



seedProvidersInRealtimeDB();
seedCommissionSettingsIfMissing();
subscribeToApprovedProviders(); 
subscribeToCommissionSettings(); 
render(); 
