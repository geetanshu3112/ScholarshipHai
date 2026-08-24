const AppState = {
    allScholarships: [],
    filteredScholarships: [],
    currentView: 'landing-view',
    previousView: 'landing-view',
    searchQuery: '',
    filters: {
        education: 'all',
        category: 'all',
        state: 'all',
        type: 'all',
        deadline: 'all',
        amount: 'all'
    },
    // Navigation history for backward/forward
    navigationHistory: ['landing-view'],
    historyIndex: 0
};

const DOM = {
    // Views
    views: document.querySelectorAll('.view-section'),

    // Landing & Nav
    startButton: document.getElementById('start-button'),
    heroSearch: document.getElementById('hero-search'),
    navHomeBtn: document.getElementById('nav-home-btn'),
    navCategoriesBtn: document.getElementById('nav-categories-btn'),
    navAboutBtn: document.getElementById('nav-about-btn'),

    // Results / Discovery
    resultsHeader: document.querySelector('.results-header'),
    resultCount: document.getElementById('result-count'),
    liveCount: document.getElementById('live-count'),
    closedCount: document.getElementById('closed-count'),
    searchInput: document.getElementById('scholarship-search'),
    filterEducation: document.getElementById('filter-education'),
    filterCategory: document.getElementById('filter-category'),
    filterState: document.getElementById('filter-state'),
    filterType: document.getElementById('filter-type'),
    filterDeadline: document.getElementById('filter-deadline'),
    filterAmount: document.getElementById('filter-amount'),
    grid: document.getElementById('scholarship-grid'),
    loadingState: document.getElementById('loading-state'),
    emptyState: document.getElementById('empty-state'),
    changeSearchBtn: document.getElementById('change-search-button'),

    // Details
    backToResultsBtn: document.getElementById('back-to-results'),
    detailLogo: document.getElementById('detail-logo'),
    detailName: document.getElementById('detail-name'),
    detailProvider: document.getElementById('detail-provider'),
    detailLiveStatus: document.getElementById('detail-live-status'),
    detailAmount: document.getElementById('detail-amount'),
    detailDeadline: document.getElementById('detail-deadline'),
    detailEducation: document.getElementById('detail-education'),
    detailType: document.getElementById('detail-type'),
    detailCategory: document.getElementById('detail-category'),
    detailAbout: document.getElementById('detail-about'),
    detailEligibility: document.getElementById('detail-eligibility'),
    detailDocuments: document.getElementById('detail-documents'),
    detailAppSteps: document.getElementById('detail-application-steps'),
    detailTips: document.getElementById('detail-tips'),
    detailVerifiedDate: document.getElementById('detail-verified-date'),
    applyButton: document.getElementById('official-apply-button'),

    // Footer & Info Pages
    aboutBtn: document.getElementById('about-button'),
    privacyBtn: document.getElementById('privacy-button'),
    termsBtn: document.getElementById('terms-button'),
    aboutBackBtn: document.getElementById('back-from-about'),
    privacyBackBtn: document.getElementById('back-from-privacy'),
    termsBackBtn: document.getElementById('back-from-terms'),

    // Templates
    cardTemplate: document.getElementById('scholarship-card-template')
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initSplashScreen();
});

function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Play cinematic intro sound
        playCinematicSound();

        // Auto-hide splash screen (drastically reduced for instant feel)
        setTimeout(() => {
            splashScreen.classList.add('hide');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 600);
        }, 400);
    }
}

/**
 * Generates a unique cinematic "ta-dum" style intro sound using Web Audio API.
 * 5-layer sound: sub-bass impact → rising whoosh → A-major chord → bright chime → sparkle.
 * Note: May be silenced by browser autoplay policies on first visit.
 */
function playCinematicSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        // Master compressor for cinematic punch
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-20, now);
        compressor.knee.setValueAtTime(10, now);
        compressor.ratio.setValueAtTime(4, now);
        compressor.connect(ctx.destination);

        const master = ctx.createGain();
        master.gain.setValueAtTime(0.35, now);
        master.connect(compressor);

        // Layer 1: Sub Bass Impact — the "boom"
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(80, now);
        bass.frequency.exponentialRampToValueAtTime(40, now + 0.6);
        bassGain.gain.setValueAtTime(0.5, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        bass.connect(bassGain);
        bassGain.connect(master);
        bass.start(now);
        bass.stop(now + 0.8);

        // Layer 2: Rising Sweep — the "whoosh"
        const sweep = ctx.createOscillator();
        const sweepGain = ctx.createGain();
        const sweepFilter = ctx.createBiquadFilter();
        sweep.type = 'sawtooth';
        sweep.frequency.setValueAtTime(100, now);
        sweep.frequency.exponentialRampToValueAtTime(800, now + 0.4);
        sweepGain.gain.setValueAtTime(0, now);
        sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        sweepFilter.type = 'lowpass';
        sweepFilter.frequency.setValueAtTime(1200, now);
        sweep.connect(sweepFilter);
        sweepFilter.connect(sweepGain);
        sweepGain.connect(master);
        sweep.start(now + 0.05);
        sweep.stop(now + 0.5);

        // Layer 3: Chord Tones — the "dum" (A3 + E4 + A4 = A major)
        [220, 330, 440].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2 - (i * 0.05), now + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now + 0.15);
            osc.stop(now + 1.8);
        });

        // Layer 4: Bright Chime — E6
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(1320, now);
        chimeGain.gain.setValueAtTime(0, now);
        chimeGain.gain.linearRampToValueAtTime(0.06, now + 0.35);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        chime.connect(chimeGain);
        chimeGain.connect(master);
        chime.start(now + 0.3);
        chime.stop(now + 1.2);

        // Layer 5: High Sparkle — E7
        const spark = ctx.createOscillator();
        const sparkGain = ctx.createGain();
        spark.type = 'sine';
        spark.frequency.setValueAtTime(2640, now);
        sparkGain.gain.setValueAtTime(0, now);
        sparkGain.gain.linearRampToValueAtTime(0.02, now + 0.4);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        spark.connect(sparkGain);
        sparkGain.connect(master);
        spark.start(now + 0.35);
        spark.stop(now + 0.9);

    } catch (e) {
        // Web Audio API not supported or autoplay blocked — visual animation continues
    }
}

async function initApp() {
    setupEventListeners();
    await loadScholarshipData();
    setupBrowserNavigation();
    
    updateHeroLivePills();

    // Ensure we start on landing view
    switchView('landing-view');
}

function updateHeroLivePills() {
    const liveScholarships = AppState.allScholarships.filter(s => isScholarshipLive(s.deadline));
    if (liveScholarships.length >= 2) {
        // Shuffle the array
        const shuffled = liveScholarships.sort(() => 0.5 - Math.random());
        const leftEl = document.getElementById('hero-live-left');
        const rightEl = document.getElementById('hero-live-right');
        
        if (leftEl && rightEl) {
            leftEl.textContent = shuffled[0].name;
            rightEl.textContent = shuffled[1].name;
            
            // Add tooltip for full name since it's truncated
            leftEl.title = shuffled[0].name;
            rightEl.title = shuffled[1].name;
        }
    }
}

function setupEventListeners() {
    // Primary Navigation
    if (DOM.startButton) {
        DOM.startButton.addEventListener('click', () => {
            switchView('results-view');
            applyFilters();
        });
    }

    // Top Nav Links
    if (DOM.navHomeBtn) {
        DOM.navHomeBtn.addEventListener('click', () => {
            switchView('landing-view');
        });
    }

    if (DOM.navCategoriesBtn) {
        DOM.navCategoriesBtn.addEventListener('click', () => {
            switchView('results-view');
            applyFilters();
        });
    }

    if (DOM.navAboutBtn) {
        DOM.navAboutBtn.addEventListener('click', () => navigateToInfoPage('about-view'));
    }

    if (DOM.backToResultsBtn) {
        DOM.backToResultsBtn.addEventListener('click', () => switchView('results-view'));
    }

    // Hero Search logic (syncs with main search)
    if (DOM.heroSearch) {
        DOM.heroSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                AppState.searchQuery = DOM.heroSearch.value;
                if (DOM.searchInput) DOM.searchInput.value = AppState.searchQuery;
                switchView('results-view');
                applyFilters();
            }
        });
    }

    // Results Filters & Search
    if (DOM.searchInput) DOM.searchInput.addEventListener('input', debounce(handleSearch, 300));
    if (DOM.filterEducation) DOM.filterEducation.addEventListener('change', handleFilterChange);
    if (DOM.filterCategory) DOM.filterCategory.addEventListener('change', handleFilterChange);
    if (DOM.filterState) DOM.filterState.addEventListener('change', handleFilterChange);
    if (DOM.filterType) DOM.filterType.addEventListener('change', handleFilterChange);
    if (DOM.filterDeadline) DOM.filterDeadline.addEventListener('change', handleFilterChange);
    if (DOM.filterAmount) DOM.filterAmount.addEventListener('change', handleFilterChange);

    // Empty state "Change Search" button resets filters
    if (DOM.changeSearchBtn) {
        DOM.changeSearchBtn.addEventListener('click', resetFilters);
    }

    // Footer Info Page Navigation
    if (DOM.aboutBtn) DOM.aboutBtn.addEventListener('click', () => navigateToInfoPage('about-view'));
    if (DOM.privacyBtn) DOM.privacyBtn.addEventListener('click', () => navigateToInfoPage('privacy-view'));
    if (DOM.termsBtn) DOM.termsBtn.addEventListener('click', () => navigateToInfoPage('terms-view'));

    // Info Page Back Buttons
    if (DOM.aboutBackBtn) DOM.aboutBackBtn.addEventListener('click', navigateBackFromInfoPage);
    if (DOM.privacyBackBtn) DOM.privacyBackBtn.addEventListener('click', navigateBackFromInfoPage);
    if (DOM.termsBackBtn) DOM.termsBackBtn.addEventListener('click', navigateBackFromInfoPage);
}

// Helper function to handle routing to info pages without losing context
function navigateToInfoPage(targetViewId) {
    if (!['about-view', 'privacy-view', 'terms-view'].includes(AppState.currentView)) {
        AppState.previousView = AppState.currentView;
    }
    switchView(targetViewId);
}

// Helper function to return from info pages
function navigateBackFromInfoPage() {
    switchView(AppState.previousView);
}

async function loadScholarshipData() {
    try {
        const response = await fetch('./data/scholarships.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        AppState.allScholarships = data.scholarships || data; // Handle wrapper object or raw array

        console.log(`Loaded ${AppState.allScholarships.length} scholarships.`);
    } catch (error) {
        console.error("Failed to load scholarship data:", error);
        AppState.allScholarships = [];
    }
}

function switchView(viewId, skipHistory = false) {
    // Refresh DOM.views in case elements were missed during init
    const allViews = document.querySelectorAll('.view-section');

    allViews.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove('hidden');
            view.classList.add('active');
        } else {
            view.classList.add('hidden');
            view.classList.remove('active');
        }
    });

    // Update active state on nav links if they exist
    if (DOM.navHomeBtn) DOM.navHomeBtn.classList.toggle('active', viewId === 'landing-view');
    if (DOM.navCategoriesBtn) DOM.navCategoriesBtn.classList.toggle('active', viewId === 'results-view');
    if (DOM.navAboutBtn) DOM.navAboutBtn.classList.toggle('active', viewId === 'about-view');

    AppState.previousView = AppState.currentView;
    AppState.currentView = viewId;

    // Track navigation history (only if not coming from back/forward)
    if (!skipHistory) {
        // Remove any forward history if user navigates to a new view
        AppState.navigationHistory = AppState.navigationHistory.slice(0, AppState.historyIndex + 1);
        // Add new view to history
        AppState.navigationHistory.push(viewId);
        AppState.historyIndex = AppState.navigationHistory.length - 1;
    }

    // Update browser history
    window.history.pushState({ viewId: viewId }, '', window.location.href);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate backward in history
function navigateBackward() {
    if (AppState.historyIndex > 0) {
        AppState.historyIndex--;
        const prevViewId = AppState.navigationHistory[AppState.historyIndex];
        switchView(prevViewId, true);
    }
}

// Navigate forward in history
function navigateForward() {
    if (AppState.historyIndex < AppState.navigationHistory.length - 1) {
        AppState.historyIndex++;
        const nextViewId = AppState.navigationHistory[AppState.historyIndex];
        switchView(nextViewId, true);
    }
}

// Check if backward/forward is possible
function canGoBackward() {
    return AppState.historyIndex > 0;
}

function canGoForward() {
    return AppState.historyIndex < AppState.navigationHistory.length - 1;
}

// Setup browser back/forward button handling
function setupBrowserNavigation() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.viewId) {
            switchView(event.state.viewId, true);
        }
    });
}

function handleSearch(e) {
    AppState.searchQuery = e.target.value;
    applyFilters();
}

function handleFilterChange() {
    if (DOM.filterEducation) AppState.filters.education = DOM.filterEducation.value;
    if (DOM.filterCategory) AppState.filters.category = DOM.filterCategory.value;
    if (DOM.filterState) AppState.filters.state = DOM.filterState.value;
    if (DOM.filterType) AppState.filters.type = DOM.filterType.value;
    if (DOM.filterDeadline) AppState.filters.deadline = DOM.filterDeadline.value;
    if (DOM.filterAmount) AppState.filters.amount = DOM.filterAmount.value;
    applyFilters();
}

function resetFilters() {
    AppState.searchQuery = '';
    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.heroSearch) DOM.heroSearch.value = '';

    AppState.filters = {
        education: 'all',
        category: 'all',
        state: 'all',
        type: 'all',
        deadline: 'all',
        amount: 'all'
    };

    if (DOM.filterEducation) DOM.filterEducation.value = 'all';
    if (DOM.filterCategory) DOM.filterCategory.value = 'all';
    if (DOM.filterState) DOM.filterState.value = 'all';
    if (DOM.filterType) DOM.filterType.value = 'all';
    if (DOM.filterDeadline) DOM.filterDeadline.value = 'all';
    if (DOM.filterAmount) DOM.filterAmount.value = 'all';

    applyFilters();
}

function applyFilters() {
    if (DOM.loadingState) DOM.loadingState.classList.remove('hidden');
    if (DOM.emptyState) DOM.emptyState.classList.add('hidden');
    if (DOM.grid) DOM.grid.innerHTML = '';

    setTimeout(() => {
        const query = AppState.searchQuery.toLowerCase();

        AppState.filteredScholarships = AppState.allScholarships.filter(scholarship => {
            // 1. Text Search Match (Name, Provider, Description)
            const sName = scholarship.name ? scholarship.name.toLowerCase() : '';
            const sProvider = scholarship.provider ? scholarship.provider.toLowerCase() : '';
            const sDesc = scholarship.description ? scholarship.description.toLowerCase() : '';

            const matchesSearch = !query ||
                sName.includes(query) ||
                sProvider.includes(query) ||
                sDesc.includes(query);

            // 2. Education Match
            const fEdu = AppState.filters.education;
            let matchesEducation = true;

            if (fEdu !== 'all') {
                if (!scholarship.educationLevel) {
                    matchesEducation = false;
                } else if (Array.isArray(scholarship.educationLevel)) {
                    matchesEducation = scholarship.educationLevel.some(lvl =>
                        lvl.toLowerCase() === fEdu.toLowerCase() || lvl.toLowerCase() === 'all'
                    );
                } else if (typeof scholarship.educationLevel === 'string') {
                    matchesEducation = scholarship.educationLevel.toLowerCase().includes(fEdu.toLowerCase()) ||
                        scholarship.educationLevel.toLowerCase() === 'all';
                }
            }

            // 3. Category Match
            const fCat = AppState.filters.category;
            let matchesCategory = true;

            if (fCat !== 'all') {
                if (!scholarship.category) {
                    matchesCategory = false; // Exclude if missing and filter is active
                } else if (Array.isArray(scholarship.category)) {
                    matchesCategory = scholarship.category.some(cat =>
                        cat.toLowerCase().trim() === fCat.toLowerCase().trim() ||
                        cat.toLowerCase().trim() === 'all' ||
                        cat.toLowerCase().trim() === 'all categories'
                    );
                } else if (typeof scholarship.category === 'string') {
                    const sCatString = scholarship.category.toLowerCase().trim();
                    matchesCategory = sCatString.includes(fCat.toLowerCase().trim()) ||
                        sCatString === 'all' ||
                        sCatString === 'all categories';
                }
            }

            // 4. State Match (Location field)
            const fState = AppState.filters.state;
            let matchesState = true;

            if (fState !== 'all') {
                const sLoc = scholarship.location || scholarship.state; // Fallback to state if location is missing

                if (!sLoc) {
                    matchesState = false;
                } else if (Array.isArray(sLoc)) {
                    matchesState = sLoc.some(loc =>
                        loc.toLowerCase() === fState.toLowerCase() ||
                        loc.toLowerCase() === 'all india'
                    );
                } else if (typeof sLoc === 'string') {
                    matchesState = sLoc.toLowerCase().includes(fState.toLowerCase()) ||
                        sLoc.toLowerCase().includes('all india');
                }
            }

            // 5. Type Match (Govt/Private)
            const fType = AppState.filters.type;
            const matchesType = (fType === 'all') ||
                (scholarship.type && scholarship.type.toLowerCase() === fType.toLowerCase());

            // 6. Amount Match
            const fAmount = AppState.filters.amount;
            let matchesAmount = true;

            if (fAmount !== 'all') {
                const amountVal = scholarship.numericAmount || 0;
                if (fAmount === 'under_50k') matchesAmount = amountVal < 50000;
                if (fAmount === 'above_50k') matchesAmount = amountVal >= 50000;
            }

            // 7. Deadline Match
            const fDeadline = AppState.filters.deadline;
            let matchesDeadline = true;
            if (fDeadline !== 'all' && scholarship.deadline) {
                matchesDeadline = checkDeadline(scholarship.deadline, fDeadline);
            }

            return matchesSearch && matchesEducation && matchesCategory && matchesState && matchesType && matchesAmount && matchesDeadline;
        });

        // Sort: LIVE scholarships first, CLOSED ones at the bottom
        AppState.filteredScholarships.sort((a, b) => {
            const aLive = isScholarshipLive(a.deadline);
            const bLive = isScholarshipLive(b.deadline);
            if (aLive === bLive) return 0;
            return aLive ? -1 : 1;
        });

        renderScholarships();
    }, 300); // Artificial delay for smooth glass loading effect
}

function checkDeadline(deadlineStr, filterType) {
    const deadlineDate = new Date(deadlineStr);
    if (isNaN(deadlineDate)) return true; // Keep invalid/text deadlines visible if filtering is applied

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (filterType === 'this_month') {
        return deadlineDate.getMonth() === currentMonth && deadlineDate.getFullYear() === currentYear;
    } else if (filterType === 'next_month') {
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }
        return deadlineDate.getMonth() === nextMonth && deadlineDate.getFullYear() === nextYear;
    }
    return true;
}

function renderScholarships() {
    if (DOM.loadingState) DOM.loadingState.classList.add('hidden');
    if (DOM.grid) DOM.grid.innerHTML = '';

    const count = AppState.filteredScholarships.length;
    let liveCount = 0;
    let closedCount = 0;
    AppState.filteredScholarships.forEach(s => {
        if (isScholarshipLive(s.deadline)) liveCount++;
        else closedCount++;
    });

    if (DOM.liveCount) DOM.liveCount.textContent = `Live: ${liveCount}`;
    if (DOM.closedCount) DOM.closedCount.textContent = `Closed: ${closedCount}`;
    if (DOM.resultCount) DOM.resultCount.textContent = `Total Scholarships: ${count}`;

    if (count === 0) {
        if (DOM.emptyState) DOM.emptyState.classList.remove('hidden');
        return;
    }

    if (!DOM.cardTemplate || !DOM.grid) return;

    const fragment = document.createDocumentFragment();

    AppState.filteredScholarships.forEach(scholarship => {
        const clone = DOM.cardTemplate.content.cloneNode(true);

        // LIVE / CLOSED Status Badge
        const live = isScholarshipLive(scholarship.deadline);
        const statusBadge = clone.querySelector('.card-status-badge');
        if (statusBadge) {
            if (live) {
                statusBadge.classList.add('status-live');
                statusBadge.textContent = 'Live';
            } else {
                statusBadge.classList.add('status-closed');
                statusBadge.textContent = 'Currently Closed';
            }
        }

        // Add card-closed class for dimming closed scholarships
        const cardArticle = clone.querySelector('.scholarship-card');
        if (cardArticle && !live) {
            cardArticle.classList.add('card-closed');
        }

        // Standard fields
        clone.querySelector('.card-title').textContent = scholarship.name || 'Unknown Scholarship';
        clone.querySelector('.card-provider').textContent = scholarship.provider || 'Various';
        clone.querySelector('.card-amount').textContent = scholarship.amount || 'Variable';

        // Date
        let deadlineText = 'Varies';
        if (!live) {
            deadlineText = 'Coming Soon';
        } else if (scholarship.deadline) {
            const d = new Date(scholarship.deadline);
            deadlineText = isNaN(d.getTime()) ? scholarship.deadline : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        clone.querySelector('.card-deadline').textContent = deadlineText;

        // Badges
        const eduBadge = clone.querySelector('.card-education');
        if (eduBadge) eduBadge.textContent = formatEducationLevel(scholarship.educationLevel);

        const typeBadge = clone.querySelector('.card-type');
        if (typeBadge) typeBadge.textContent = scholarship.type ? (scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)) : 'General';

        const catBadge = clone.querySelector('.card-category');
        if (catBadge) {
            catBadge.textContent = formatCategory(scholarship.category);
        }

        // Description
        const descElem = clone.querySelector('.card-description');
        if (descElem) descElem.textContent = scholarship.description || 'Click view details to learn more about this scholarship opportunity.';

        // Logo
        const logoImg = clone.querySelector('.card-logo');
        if (logoImg) {
            if (scholarship.logo) {
                logoImg.src = scholarship.logo;
                logoImg.alt = `${scholarship.name} Logo`;
            } else {
                logoImg.style.display = 'none';
            }
        }

        // Button
        const btn = clone.querySelector('.view-details-btn');
        if (btn) {
            btn.addEventListener('click', () => loadDetailsView(scholarship.id));
        }

        fragment.appendChild(clone);
    });

    DOM.grid.appendChild(fragment);
}

function formatEducationLevel(levels) {
    if (!levels) return 'All Levels';
    if (typeof levels === 'string') return levels;
    if (levels.length === 0) return 'All Levels';

    const map = { 'school': 'School', 'ug': 'UG', 'pg': 'PG', 'all': 'All Levels' };
    return levels.map(l => map[l.toLowerCase()] || l).join(' / ');
}

function formatCategory(categories) {
    if (!categories) return 'All Categories';

    let catArray = [];
    if (typeof categories === 'string') {
        catArray = [categories];
    } else if (Array.isArray(categories)) {
        catArray = categories;
    } else {
        return 'All Categories';
    }

    if (catArray.length === 0) return 'All Categories';

    const normalized = catArray.map(c => {
        const cLower = c.toLowerCase().trim();
        if (cLower === 'all' || cLower === 'all categories') return 'All Categories';

        // Basic capitalization for General, OBC, SC, ST
        if (cLower === 'general') return 'General';
        if (cLower === 'obc') return 'OBC';
        if (cLower === 'sc') return 'SC';
        if (cLower === 'st') return 'ST';

        // Fallback for unexpected categories
        return c.charAt(0).toUpperCase() + c.slice(1);
    });

    // Deduplicate in case "All" and "All Categories" were both present
    const unique = [...new Set(normalized)];

    if (unique.includes('All Categories')) {
        return 'All Categories';
    }

    return unique.join(' / ');
}

function loadDetailsView(scholarshipId) {
    const scholarship = AppState.allScholarships.find(s => s.id === scholarshipId);
    if (!scholarship) return;

    // Header
    if (DOM.detailName) DOM.detailName.textContent = scholarship.name || 'Scholarship Details';
    if (DOM.detailProvider) DOM.detailProvider.textContent = scholarship.provider || '';

    if (DOM.detailLogo) {
        if (scholarship.logo) {
            DOM.detailLogo.src = scholarship.logo;
            DOM.detailLogo.hidden = false;
        } else {
            DOM.detailLogo.hidden = true;
        }
    }

    if (DOM.detailLiveStatus) {
        if (isScholarshipLive(scholarship.deadline)) {
            let daysLeftText = '';
            const deadlineDate = new Date(scholarship.deadline);
            if (!isNaN(deadlineDate.getTime())) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                deadlineDate.setHours(0, 0, 0, 0);
                const diffTime = deadlineDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0) {
                    daysLeftText = ` &bull; ${diffDays} days left`;
                }
            }
            DOM.detailLiveStatus.innerHTML = `<span class="card-status-badge status-live" style="display: inline-flex; align-items: center; padding: 6px 14px; font-size: 0.95rem;">Live${daysLeftText}</span>`;
            DOM.detailLiveStatus.style.display = 'block';
        } else {
            DOM.detailLiveStatus.style.display = 'none';
        }
    }

    // Quick Info
    if (DOM.detailAmount) autoAdjustFontSize(DOM.detailAmount, scholarship.amount || 'Variable');
    if (DOM.detailDeadline) {
        let text = 'Varies / Ongoing';
        if (!isScholarshipLive(scholarship.deadline)) {
            text = 'Coming Soon';
        } else if (scholarship.deadline) {
            const d = new Date(scholarship.deadline);
            text = isNaN(d.getTime()) ? scholarship.deadline : d.toLocaleDateString('en-IN');
        }
        autoAdjustFontSize(DOM.detailDeadline, text);
    }
    if (DOM.detailEducation) autoAdjustFontSize(DOM.detailEducation, formatEducationLevel(scholarship.educationLevel));
    if (DOM.detailType) autoAdjustFontSize(DOM.detailType, scholarship.type ? (scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)) : 'General');
    if (DOM.detailCategory) autoAdjustFontSize(DOM.detailCategory, formatCategory(scholarship.category));

    // Body Sections
    const aboutText = scholarship.about || scholarship.description || '<p>Details coming soon.</p>';
    if (DOM.detailAbout) DOM.detailAbout.innerHTML = aboutText;

    if (DOM.detailEligibility) renderListToContainer(DOM.detailEligibility, scholarship.eligibility, '<p>Standard eligibility applies.</p>');
    if (DOM.detailDocuments) renderListToContainer(DOM.detailDocuments, scholarship.documents, '<li>Check official website for specific document requirements.</li>');
    if (DOM.detailAppSteps) renderListToContainer(DOM.detailAppSteps, scholarship.applicationSteps, '<li>Click the Apply Now button below to proceed to the official portal.</li>');
    if (DOM.detailTips) renderListToContainer(DOM.detailTips, scholarship.tips, '<p>Apply well before the deadline and double-check your documents.</p>');

    // Footer
    if (DOM.detailVerifiedDate) DOM.detailVerifiedDate.textContent = scholarship.verifiedAt ? new Date(scholarship.verifiedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently';

    if (DOM.applyButton) {
        if (scholarship.officialApplyUrl) {
            DOM.applyButton.href = scholarship.officialApplyUrl;
            DOM.applyButton.target = "_blank";
            DOM.applyButton.rel = "noopener noreferrer";
            DOM.applyButton.textContent = "Apply Now →";
            DOM.applyButton.classList.remove('disabled-style');
        } else {
            DOM.applyButton.href = "#";
            DOM.applyButton.removeAttribute('target');
            DOM.applyButton.textContent = "Website Unavailable";
        }
    }

    // Switch View
    switchView('details-view');
}

// Helper to safely render arrays into UL/OL or general containers
function renderListToContainer(container, data, fallbackHTML) {
    container.innerHTML = '';

    if (!data || (Array.isArray(data) && data.length === 0)) {
        container.innerHTML = fallbackHTML;
        return;
    }

    if (Array.isArray(data)) {
        // If it's meant to be a list (UL/OL)
        if (container.tagName === 'UL' || container.tagName === 'OL') {
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                container.appendChild(li);
            });
        } else {
            // If it's a div, wrap items in paragraphs
            data.forEach(item => {
                const p = document.createElement('p');
                p.textContent = item;
                container.appendChild(p);
            });
        }
    } else if (typeof data === 'string') {
        container.innerHTML = `<p>${data}</p>`;
    } else {
        container.innerHTML = fallbackHTML;
    }
}

/**
 * Checks if a scholarship is currently LIVE based on its deadline.
 * A scholarship is LIVE if its deadline is today or in the future.
 * Scholarships with unparseable deadlines (e.g. "Currently Closed", "Check official portal")
 * are treated as CLOSED.
 * This check uses the current system date so it auto-updates daily.
 */
function isScholarshipLive(deadlineStr) {
    if (!deadlineStr) return false;

    const lower = deadlineStr.toLowerCase().trim();

    // Explicitly treat "always open" as LIVE
    if (lower.includes('always open')) {
        return true;
    }

    // Treat common non-date strings as closed
    if (lower.includes('closed') || lower.includes('check') || lower.includes('varies') || lower.includes('ongoing')) {
        return false;
    }

    const deadlineDate = new Date(deadlineStr);
    if (isNaN(deadlineDate.getTime())) return false;

    // Compare with start of today (midnight) so deadline day itself counts as LIVE
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate >= today;
}

// Simple debounce
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function autoAdjustFontSize(element, text) {
    if (!element) return;
    element.textContent = text;
    const len = text.length;
    if (len > 35) {
        element.style.fontSize = '0.85rem';
    } else if (len > 20) {
        element.style.fontSize = '1rem';
    } else {
        element.style.fontSize = '1.25rem';
    }
}