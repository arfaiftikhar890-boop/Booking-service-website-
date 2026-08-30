
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyArDCvu1a692lmwB6vJb7UXFJ9d3Jny-ew",
    authDomain: "service-booking-app-55580.firebaseapp.com",
    projectId: "service-booking-app-55580",
    storageBucket: "service-booking-app-55580.firebasestorage.app",
    messagingSenderId: "883668704888",
    appId: "1:883668704888:web:cfe1f2eab71ea4bb63978d",
    measurementId: "G-JVZZ70LRXG"
  };


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);


const PROVIDERS = [
  {
    providerId: "provider_1",
    name: "Ali Plumbing",
    category: "Plumbing",
    location: "Karachi",
    experience: "8 years",
    price: "Rs. 1,500",
    rating: 4.8,
    about:
      "Professional plumber specializing in pipe repair, leakage problems, bathroom fittings, and home plumbing services.",
    icon: "fa-wrench",
  },
  {
    providerId: "provider_2",
    name: "Ahmed Electric",
    category: "Electrical",
    location: "Karachi",
    experience: "5 years",
    price: "Rs. 2,000",
    rating: 4.7,
    about:
      "Experienced electrician providing safe home electrical repairs, wiring, installations, and troubleshooting.",
    icon: "fa-bolt",
  },
  {
    providerId: "provider_3",
    name: "CleanPro Services",
    category: "Home Cleaning",
    location: "Karachi",
    experience: "4 years",
    price: "Rs. 1,200",
    rating: 4.6,
    about:
      "Professional home cleaning services for apartments, houses, kitchens, and deep cleaning.",
    icon: "fa-broom",
  },
  {
    providerId: "provider_4",
    name: "Paint Masters",
    category: "Painting",
    location: "Karachi",
    experience: "10 years",
    price: "Rs. 3,000",
    rating: 4.9,
    about: "Experienced painting professionals providing interior and exterior painting services.",
    icon: "fa-paint-roller",
  },
  {
    providerId: "provider_5",
    name: "TechFix",
    category: "Computer Repair",
    location: "Karachi",
    experience: "6 years",
    price: "Rs. 2,500",
    rating: 4.7,
    about:
      "Professional laptop and computer repair services including hardware and software troubleshooting.",
    icon: "fa-laptop",
  },
  {
    providerId: "provider_6",
    name: "Cool Air Services",
    category: "AC Repair",
    location: "Karachi",
    experience: "7 years",
    price: "Rs. 2,000",
    rating: 4.8,
    about: "Reliable AC installation, repair, servicing, and cooling system troubleshooting.",
    icon: "fa-wind",
  },
];

const CATEGORIES = ["All", "Plumbing", "Electrical", "Home Cleaning", "Painting", "Computer Repair", "AC Repair"];


async function seedProvidersInFirestore() {
  try {
    const firstProviderRef = doc(db, "providers", "provider_1");
    const firstProviderSnap = await getDoc(firstProviderRef);
    if (firstProviderSnap.exists()) return; 

    const writes = PROVIDERS.map((p) => setDoc(doc(db, "providers", p.providerId), p));
    await Promise.all(writes);
    console.log("Providers seeded into Firestore.");
  } catch (err) {
    
    console.warn("Could not seed providers (is Firebase configured yet?):", err.message);
  }
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

  bookings: [], 
  bookingsLoading: false,
  providerTab: "All", 
  reviewModalBookingId: null, 
  reviewStars: 0,

  loadingMessage: null, 
  errorMessage: null,
  successMessage: null,
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
  return PROVIDERS.find((p) => p.providerId === providerId) || null;
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
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });

  
  if (page === "customerDashboard" || page === "providerDashboard") {
    loadBookingsForCurrentUser();
  }
}



async function loadBookingsForCurrentUser() {
  if (!state.currentUser) return;
  state.bookingsLoading = true;
  render();

  try {
    const bookingsRef = collection(db, "bookings");
    const field = state.currentUser.role === "provider" ? "providerId" : "customerId";
    const idValue = state.currentUser.role === "provider" ? state.currentUser.providerId : state.currentUser.uid;

    const q = query(bookingsRef, where(field, "==", idValue));
    const snapshot = await getDocs(q);

    const bookings = [];
    snapshot.forEach((docSnap) => bookings.push({ docId: docSnap.id, ...docSnap.data() }));

    
    bookings.sort((a, b) => (b.createdAtMillis || 0) - (a.createdAtMillis || 0));

    state.bookings = bookings;
  } catch (err) {
    state.errorMessage = "Could not load bookings: " + err.message;
  } finally {
    state.bookingsLoading = false;
    render();
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
    await updateDoc(doc(db, "bookings", docId), { status: newStatus });
    state.successMessage = `Booking status updated to ${newStatus}.`;
    await loadBookingsForCurrentUser(); 
  } catch (err) {
    state.errorMessage = "Failed to update booking: " + err.message;
  } finally {
    state.loadingMessage = null;
    render();
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
    <span class="nav-link ${state.currentPage === dashboardPage ? "active" : ""}" data-action="nav" data-page="${dashboardPage}">
      <i class="fa-solid fa-gauge"></i> Dashboard
    </span>
    <div class="avatar" style="width:36px;height:36px;font-size:0.85rem;">${getInitials(state.currentUser?.name)}</div>
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
          ? `<span class="nav-link" data-action="nav" data-page="${dashboardPage}">Dashboard</span>
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
      ${PROVIDERS.map(renderProviderCard).join("")}
    </div>
  </section>
  `;
}



function renderProviderCard(p) {
  return `
  <div class="card card-hover p-6 flex flex-col reveal">
    <div class="flex items-center gap-3 mb-4">
      <div class="relative" style="width:52px;height:52px;">
        <div class="avatar" style="width:52px;height:52px;font-size:1.05rem;"><i class="fa-solid ${p.icon}"></i></div>
        ${verifiedSealSvg()}
      </div>
      <div>
        <h3 class="font-semibold">${p.name}</h3>
        <span class="text-xs text-gray-500">${p.category} &middot; ${p.location}</span>
      </div>
    </div>
    <div class="flex items-center gap-1 mb-3">${starsHtml(p.rating)}<span class="text-sm text-gray-500 ml-1">${p.rating}</span></div>
    <div class="flex items-center justify-between text-sm text-gray-600 mb-5">
      <span><i class="fa-regular fa-clock"></i> ${p.experience}</span>
      <span class="font-semibold text-signal">${p.price}</span>
    </div>
    <button class="btn btn-primary btn-sm mt-auto" data-action="view-profile" data-provider-id="${p.providerId}">View Profile</button>
  </div>`;
}


function getFilteredProviders() {
  const query = state.searchQuery.trim().toLowerCase();
  return PROVIDERS.filter((p) => {
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

  return `
  <section class="max-w-4xl mx-auto px-5 md:px-8 py-12">
    <button class="text-sm text-gray-500 mb-6" data-action="nav" data-page="services"><i class="fa-solid fa-arrow-left"></i> Back to Services</button>
    <div class="card p-8">
      <div class="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
        <div class="relative" style="width:84px;height:84px;">
          <div class="avatar" style="width:84px;height:84px;font-size:1.8rem;"><i class="fa-solid ${provider.icon}"></i></div>
          <div style="transform:scale(1.15);transform-origin:top right;">${verifiedSealSvg()}</div>
        </div>
        <div>
          <h1 class="font-display text-2xl font-bold">${provider.name}</h1>
          <p class="text-gray-500">${provider.category} &middot; <i class="fa-solid fa-location-dot"></i> ${provider.location}</p>
          <div class="flex items-center gap-1 mt-2">${starsHtml(provider.rating)}<span class="text-sm text-gray-500 ml-1">${provider.rating} rating</span></div>
        </div>
      </div>

      <div class="grid sm:grid-cols-3 gap-4 mb-6">
        <div class="card p-4 text-center"><p class="text-xs text-gray-500 mb-1">Experience</p><p class="font-semibold">${provider.experience}</p></div>
        <div class="card p-4 text-center"><p class="text-xs text-gray-500 mb-1">Price</p><p class="font-semibold text-signal">${provider.price}</p></div>
        <div class="card p-4 text-center"><p class="text-xs text-gray-500 mb-1">Category</p><p class="font-semibold">${provider.category}</p></div>
      </div>

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
  </form>`;
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
      </select>
    </div>

    <div id="provider-id-field" style="display:none;">
      <label class="field-label">Provider Profile (demo)</label>
      <select name="providerId" class="field-input">
        ${PROVIDERS.map((p) => `<option value="${p.providerId}">${p.name} (${p.providerId})</option>`).join("")}
      </select>
      <p class="text-xs text-gray-400 mt-1">For the hackathon demo, connect your provider account to one of the 6 sample profiles.</p>
    </div>

    <button type="submit" class="btn btn-signal mt-2" ${state.loadingMessage ? "disabled" : ""}>
      ${state.loadingMessage ? `<span class="spinner"></span> Creating account...` : "Create Account"}
    </button>
  </form>`;
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

  return `
  <section class="max-w-2xl mx-auto px-5 md:px-8 py-12">
    <button class="text-sm text-gray-500 mb-6" data-action="nav" data-page="providerDetails"><i class="fa-solid fa-arrow-left"></i> Back to Profile</button>

    <div class="card p-8 mb-6">
      <h1 class="font-display text-2xl font-bold mb-1">Book a Service</h1>
      <p class="text-gray-500 mb-6">You're booking with <strong>${provider.name}</strong> (${provider.category})</p>

      ${messageBannerHtml()}

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
    ${reviewButton}
  </div>`;
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

  const filtered = state.providerTab === "All" ? bookings : bookings.filter((b) => b.status === state.providerTab);

  return `
  <section class="max-w-6xl mx-auto px-5 md:px-8 py-12">
    <h1 class="font-display text-2xl md:text-3xl font-bold mb-1">Provider Dashboard</h1>
    <p class="text-gray-500 mb-8">Manage your incoming service requests.</p>

    ${messageBannerHtml()}

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      ${statCard("Incoming Requests", stats.incoming, "fa-inbox", "#fef3c7", "#b45309")}
      ${statCard("Accepted Jobs", stats.accepted, "fa-thumbs-up", "#dbeafe", "#1d4ed8")}
      ${statCard("In Progress", stats.inProgress, "fa-gear", "#ede9fe", "#6d28d9")}
      ${statCard("Completed Jobs", stats.completed, "fa-circle-check", "#dcfce7", "#15803d")}
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
        : `<div class="flex flex-col gap-4">${filtered.map(providerBookingCard).join("")}</div>`
    }
  </section>`;
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
    <div class="flex gap-2">${actions}</div>
  </div>`;
}



function renderReviewModal() {
  if (!state.reviewModalBookingId) return "";
  const booking = state.bookings.find((b) => b.docId === state.reviewModalBookingId);
  if (!booking) return "";

  return `
  <div class="modal-backdrop" data-action="close-modal-backdrop">
    <div class="modal-box" onclick="event.stopPropagation()">
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
};

function render() {
  const root = document.getElementById("root");

  
  const page = guardPage(state.currentPage);
  state.currentPage = page;

  const pageRenderer = PAGE_RENDERERS[page] || renderHome;

  root.innerHTML = `
    ${renderNavbar()}
    <main>${state.authChecked ? pageRenderer() : loadingScreenHtml()}</main>
    ${renderFooter()}
    ${renderReviewModal()}
  `;

  
  syncRegisterRoleField();
  initScrollReveal();
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
  const protectedProviderPages = ["providerDashboard"];

  if (protectedCustomerPages.includes(page) || protectedProviderPages.includes(page)) {
    if (!state.currentUser) {
      state.errorMessage = "Please login to continue.";
      state.authTab = "login";
      return "welcome";
    }
  }
  if (page === "customerDashboard" && state.currentUser?.role !== "customer") {
    return "providerDashboard";
  }
  if (page === "providerDashboard" && state.currentUser?.role !== "provider") {
    return "customerDashboard";
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
  if (select && providerField) {
    providerField.style.display = select.value === "provider" ? "block" : "none";
  }
}



async function registerUser(name, email, password, role, providerId) {
  clearMessages();

 
  if (!name.trim()) return (state.errorMessage = "Please enter your name.");
  if (!isValidEmail(email)) return (state.errorMessage = "Please enter a valid email.");
  if (password.length < 6) return (state.errorMessage = "Password must be at least 6 characters.");
  if (!role) return (state.errorMessage = "Please select your role.");

  state.loadingMessage = "Creating your account...";
  render();

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    const userDoc = {
      name: name.trim(),
      email,
      role,
      createdAt: serverTimestamp(),
    };
    if (role === "provider") userDoc.providerId = providerId;

    await setDoc(doc(db, "users", uid), userDoc);

    state.currentUser = { uid, ...userDoc, createdAt: Date.now() };
    state.successMessage = "Account created! Welcome to ServiceHub.";
    navigateTo(role === "provider" ? "providerDashboard" : "home");
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}

async function loginUser(email, password) {
  clearMessages();
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

async function logoutUser() {
  await signOut(auth);
  state.currentUser = null;
  state.bookings = [];
  state.authTab = "login";
  navigateTo("welcome");
}

function friendlyFirebaseError(err) {
  const code = err.code || "";
  if (code.includes("email-already-in-use")) return "That email is already registered. Try logging in instead.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Incorrect email or password.";
  if (code.includes("weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("api-key") || code.includes("configuration")) {
    return "Firebase isn't configured yet — paste your firebaseConfig into script.js.";
  }
  return err.message || "Something went wrong. Please try again.";
}


onAuthStateChanged(auth, async (firebaseUser) => {
  const wasLoggedOut = !state.currentUser;

  if (firebaseUser) {
    try {
      const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userSnap.exists()) {
        state.currentUser = { uid: firebaseUser.uid, ...userSnap.data() };
      }
    } catch (err) {
      console.warn("Could not load user profile:", err.message);
    }

    
    if (state.currentUser && (state.currentPage === "welcome" || !state.authChecked)) {
      state.currentPage = state.currentUser.role === "provider" ? "providerDashboard" : "home";
    }
  } else {
    state.currentUser = null;
    
    if (!wasLoggedOut) {
      state.currentPage = "welcome";
    }
  }

  state.authChecked = true;
  render();
});



async function createBooking(formData) {
  clearMessages();
  const provider = findProviderById(state.selectedProviderId);

  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location").trim();
  const description = formData.get("description").trim();

  // ---- Form validation ----
  if (!date) return (state.errorMessage = "Please select a date.");
  if (!time) return (state.errorMessage = "Please select a time.");
  if (!location) return (state.errorMessage = "Please enter your location.");
  if (!description) return (state.errorMessage = "Please describe your service problem.");

  state.loadingMessage = "Creating your booking...";
  render();

  try {
    const bookingId = generateBookingId();
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
      createdAt: serverTimestamp(),
      createdAtMillis: Date.now(),
    };

    await addDoc(collection(db, "bookings"), newBooking);

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
  const booking = state.bookings.find((b) => b.docId === docId);
  if (!booking) return;

  if (state.reviewStars < 1) return (state.errorMessage = "Please select a star rating.");
  if (!comment.trim()) return (state.errorMessage = "Please write a short comment.");

  state.loadingMessage = "Submitting review...";
  render();

  try {
    
    const freshSnap = await getDoc(doc(db, "bookings", docId));
    const freshData = freshSnap.data();

    if (freshData.status !== "Completed") {
      state.errorMessage = "This booking is not completed yet.";
      return;
    }
    if (freshData.hasReviewed) {
      state.errorMessage = "You have already reviewed this booking.";
      return;
    }

    await addDoc(collection(db, "reviews"), {
      bookingId: booking.bookingId,
      customerId: state.currentUser.uid,
      providerId: booking.providerId,
      rating: state.reviewStars,
      comment: comment.trim(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "bookings", docId), { hasReviewed: true });

    state.successMessage = "Thanks for your review!";
    state.reviewModalBookingId = null;
    state.reviewStars = 0;
    await loadBookingsForCurrentUser();
  } catch (err) {
    state.errorMessage = friendlyFirebaseError(err);
  } finally {
    state.loadingMessage = null;
    render();
  }
}



document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

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

    case "close-modal":
    case "close-modal-backdrop":
      state.reviewModalBookingId = null;
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
  if (e.target.id === "register-role-select") {
    syncRegisterRoleField();
  }
});

// Form submissions (login / register / booking / review)
document.addEventListener("submit", (e) => {
  const formType = e.target.dataset.form;
  if (!formType) return;
  e.preventDefault();

  const formData = new FormData(e.target);

  if (formType === "login") {
    loginUser(formData.get("email").trim(), formData.get("password"));
  }

  if (formType === "register") {
    registerUser(
      formData.get("name"),
      formData.get("email").trim(),
      formData.get("password"),
      formData.get("role"),
      formData.get("providerId")
    );
  }

  if (formType === "booking") {
    createBooking(formData);
  }

  if (formType === "review") {
    submitReview(state.reviewModalBookingId, formData.get("comment"));
  }
});



seedProvidersInFirestore();
render(); 