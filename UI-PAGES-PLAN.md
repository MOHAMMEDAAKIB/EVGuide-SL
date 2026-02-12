# 🎨 EVGuide SL - Pages & UI Architecture Plan

## 📐 Design System

### Color Palette
```css
/* Primary - Electric Green */
--primary-50: #f0fdf4
--primary-500: #22c55e  /* Main green */
--primary-600: #16a34a
--primary-700: #15803d

/* Accent - Electric Blue */
--accent-400: #60a5fa
--accent-500: #3b82f6
--accent-600: #2563eb

/* Neutral */
--slate-50: #f8fafc
--slate-100: #f1f5f9
--slate-600: #475569
--slate-900: #0f172a

/* Status Colors */
--success: #10b981 (green)
--warning: #f59e0b (amber)
--error: #ef4444 (red)
--info: #3b82f6 (blue)
```

### Typography
- **Headings**: Inter (system font fallback)
- **Body**: Inter
- **Monospace**: JetBrains Mono (for specs/numbers)

### Design Principles
1. **Mobile-First**: Design for 360px width minimum
2. **Bold Typography**: Large headlines, clear hierarchy
3. **Green Energy Theme**: Eco-friendly colors, sustainability messaging
4. **Data-Driven**: Numbers are heroes, specs front and center
5. **Touch-Friendly**: 44px minimum tap targets

---

## 🗺️ Site Architecture

```
evguide-sl/
├── / (Home)
├── /vehicles
│   ├── /vehicles (Browse Grid)
│   └── /vehicles/[id] (Detail Page)
├── /compare
│   └── ?ids=1,2,3 (Comparison Table)
├── /tools
│   ├── /tools/tco-calculator
│   └── /tools/route-planner
├── /map (Charging Stations)
└── /assistant (AI Chat - Phase 2)
```

---

## 📄 Page-by-Page Breakdown

### 1. Homepage `/`
**Purpose**: Landing page, value proposition, quick vehicle discovery

#### Sections:
**A. Hero Section**
```
┌─────────────────────────────────────────┐
│  [EVGuide SL Logo]    [Switch | Dark]   │
│                                          │
│  Find Your Perfect Electric Vehicle     │
│  Compare EVs with real Sri Lankan data  │
│                                          │
│  [Browse EVs →]  [Calculate Savings]    │
│                                          │
│  📊 20+ Models | 🗺️ 50+ Chargers        │
└─────────────────────────────────────────┘
```

**B. Quick Search Bar**
- Search by make/model
- Price range slider (0-20M LKR)
- Range filter (>200km, >300km, >400km)

**C. Featured EVs** (3-4 cards)
- Most popular
- Best value
- Longest range
- Recently added

**D. Value Propositions** (3 columns)
```
🔋 Real Range Estimates     💰 True Cost Analysis     🗺️ Charging Network
Sri Lankan conditions       TCO vs Petrol            50+ stations mapped
```

**E. How It Works** (3 steps)
1. Browse & Compare → 2. Calculate Savings → 3. Find Chargers

**F. CTA Section**
- "Ready to go electric?"
- [Start Browsing] button

---

### 2. Vehicle Browse Page `/vehicles`
**Purpose**: Filterable grid of all EVs

#### Layout:
```
┌─────────────────────────────────────────────────────────┐
│ [< Back]  All Electric Vehicles (20)                    │
│                                                          │
│ ┌─ Filters ──────────────────┐  ┌─ Sort ─────────┐    │
│ │ 🔍 Search...                │  │ Price: Low-High │    │
│ │ Price: Rs. 5M - 15M         │  └─────────────────┘    │
│ │ Range: 200km - 500km        │                         │
│ │ Body: [SUV][Sedan][All]     │  [🔀 Compare (0/3)]    │
│ │ [Apply Filters]             │                         │
│ └─────────────────────────────┘                         │
│                                                          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │
│ │ BYD  │ │Nissan│ │ MG   │ │ BYD  │                   │
│ │Atto 3│ │ Leaf │ │ZS EV │ │Dolpn │                   │
│ │Rs.10M│ │Rs.7M │ │Rs.9M │ │Rs.6M │                   │
│ │357km │ │230km │ │272km │ │289km │                   │
│ │☐ Cmp │ │☐ Cmp │ │☐ Cmp │ │☐ Cmp │                   │
│ └──────┘ └──────┘ └──────┘ └──────┘                   │
└─────────────────────────────────────────────────────────┘
```

#### Components:
- **FilterSidebar.tsx**: Price, Range, Body Type, Drive Type filters
- **VehicleCard.tsx**: Image, Make/Model, Price, Range, Compare checkbox
- **CompareBar.tsx**: Sticky bottom bar showing selected vehicles
- **SortDropdown.tsx**: Sort options (Price, Range, Battery, Name)

#### Features:
- ✅ Real-time filter updates (no page reload)
- ✅ Compare checkbox (max 3)
- ✅ Pagination or infinite scroll
- ✅ URL state preservation (?price_min=5000000)
- ✅ "No results" state with suggestions

---

### 3. Vehicle Detail Page `/vehicles/[id]`
**Purpose**: Complete specifications, images, features

#### Layout (Desktop/Mobile):
```
┌──────────────────────────────────────────────────────────┐
│ [< Back to Browse]              [❤️ Save] [🔀 Compare]   │
│                                                           │
│ ┌───────────────┐  BYD Atto 3 (2024)                    │
│ │               │  Rs. 10.5M (Unregistered)              │
│ │  [Hero Image] │  Rs. 11.5M (Registered)                │
│ │               │                                         │
│ │ [●][○][○][○]  │  SUV • FWD • 5 Seats                   │
│ └───────────────┘                                         │
│                                                           │
│ ┌── Key Specs (4 cards) ─────────────────────────────┐  │
│ │ 🔋 Battery      ⚡ Range (SL)   🏎️ Power   ⏱️ 0-100│  │
│ │ 60.48 kWh      357 km          150 kW    7.3s     │  │
│ └───────────────────────────────────────────────────┘  │
│                                                           │
│ [Specs] [Charging] [Features] [Compare]                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Specifications                                       │ │
│ │ • Battery: 60.48 kWh                                │ │
│ │ • Range (WLTP): 420 km                              │ │
│ │ • Range (SL Estimate): 357 km (85% adjustment)      │ │
│ │ • Motor Power: 150 kW (204 HP)                      │ │
│ │ • Top Speed: 160 km/h                               │ │
│ │ • Acceleration: 7.3s (0-100 km/h)                   │ │
│ │ • Drive Type: Front-Wheel Drive                     │ │
│ │ • Cargo Space: 440 liters                           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Charging Times                                       │ │
│ │ 🏠 Home (AC Type 2): 9.5 hours (0-100%)             │ │
│ │ ⚡ Fast (DC CCS2): 30 mins (20-80%)                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✨ Features                                          │ │
│ │ • Panoramic Sunroof     • 360° Camera               │ │
│ │ • Wireless Charging     • Adaptive Cruise Control   │ │
│ │ • LED Headlights        • Keyless Entry             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ [💰 Calculate TCO for This Vehicle]                      │
│ [🗺️ Find Charging Stations]                             │
│                                                           │
│ Similar Vehicles                                         │
│ [MG ZS EV] [Nissan Leaf] [BYD Dolphin]                  │
└──────────────────────────────────────────────────────────┘
```

#### Components:
- **ImageGallery.tsx**: Swipeable image carousel
- **SpecsTable.tsx**: All technical specifications
- **ChargingInfo.tsx**: AC/DC charging times
- **FeaturesList.tsx**: Feature chips/tags
- **SimilarVehicles.tsx**: Recommendation cards
- **CTAButtons.tsx**: Calculate TCO, Find Chargers

---

### 4. Comparison Page `/compare?ids=1,2,3`
**Purpose**: Side-by-side vehicle comparison

#### Layout:
```
┌──────────────────────────────────────────────────────────┐
│ [< Back]  Compare Vehicles (3 selected)    [🔀 Change]   │
│                                                           │
│ ┌─────────┬─────────┬─────────┬─────────┐              │
│ │         │ BYD     │ Nissan  │ MG      │              │
│ │         │ Atto 3  │ Leaf    │ ZS EV   │              │
│ ├─────────┼─────────┼─────────┼─────────┤              │
│ │ Image   │ [img]   │ [img]   │ [img]   │              │
│ ├─────────┼─────────┼─────────┼─────────┤              │
│ │ Price   │ 10.5M ✓ │ 7.5M ✓✓ │ 9.2M ✓  │ ← Winner    │
│ │ Range   │ 357km✓✓ │ 230km   │ 272km ✓ │              │
│ │ Battery │ 60kWh✓✓ │ 40kWh   │ 50kWh ✓ │              │
│ │ Power   │ 150kW✓✓ │ 110kW   │ 130kW ✓ │              │
│ │ 0-100   │ 7.3s ✓✓ │ 7.9s ✓  │ 8.5s    │              │
│ │ Seats   │ 5       │ 5       │ 5       │              │
│ │ Cargo   │ 440L ✓  │ 405L    │ 448L ✓✓ │              │
│ │ DC Chrg │ 30min✓✓ │ 35min ✓ │ 40min   │              │
│ ├─────────┼─────────┼─────────┼─────────┤              │
│ │ Winner  │ 🏆 5/8  │ 1/8     │ 2/8     │              │
│ └─────────┴─────────┴─────────┴─────────┘              │
│                                                           │
│ [View Full Details] [Calculate TCO for Winners]          │
└──────────────────────────────────────────────────────────┘
```

#### Features:
- ✅ Highlight best value in each row (green background)
- ✅ Toggle categories (show/hide sections)
- ✅ Add/remove vehicles from comparison
- ✅ Export as PDF
- ✅ Share comparison link

#### Components:
- **ComparisonTable.tsx**: Sticky header table
- **ComparisonRow.tsx**: Individual spec row with highlighting
- **VehicleSelector.tsx**: Modal to change vehicles

---

### 5. TCO Calculator `/tools/tco-calculator`
**Purpose**: Calculate Total Cost of Ownership vs Petrol

#### Layout:
```
┌──────────────────────────────────────────────────────────┐
│ 💰 Total Cost of Ownership Calculator                    │
│                                                           │
│ ┌─ Your Current Vehicle ──────────────────────┐         │
│ │ Vehicle Type: [Petrol Car ▼]                │         │
│ │ Fuel Efficiency: [15] km/L                  │         │
│ │ Monthly Distance: [1000] km                 │         │
│ └─────────────────────────────────────────────┘         │
│                                                           │
│ ┌─ Electric Vehicle ──────────────────────────┐         │
│ │ Select EV: [BYD Atto 3 ▼]                   │         │
│ │ Electricity Tariff: [Rs. 50 ▼] per kWh      │         │
│ │   ○ Domestic (<90 units): Rs. 30            │         │
│ │   ● Domestic (>90 units): Rs. 50            │         │
│ │   ○ Off-Peak: Rs. 35                        │         │
│ └─────────────────────────────────────────────┘         │
│                                                           │
│ [Calculate Savings 💰]                                    │
│                                                           │
│ ┌─ Results ────────────────────────────────────┐        │
│ │                                               │        │
│ │  Monthly Fuel Cost                            │        │
│ │  Petrol: Rs. 23,333    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │        │
│ │  Electric: Rs. 8,333   ▓▓▓▓▓▓                │        │
│ │                                               │        │
│ │  💰 You Save: Rs. 15,000/month                │        │
│ │               Rs. 180,000/year                │        │
│ │                                               │        │
│ │  Break-Even: 3.2 years                        │        │
│ │  5-Year Savings: Rs. 900,000                  │        │
│ │                                               │        │
│ │  ┌─ Detailed Breakdown ─────────────────┐   │        │
│ │  │ Item           Petrol      Electric   │   │        │
│ │  ├────────────────────────────────────────┤   │        │
│ │  │ Monthly Fuel   Rs. 23,333  Rs. 8,333  │   │        │
│ │  │ Maintenance    Rs. 5,000   Rs. 2,000  │   │        │
│ │  │ Insurance      Rs. 8,000   Rs. 10,000 │   │        │
│ │  │ Total/Month    Rs. 36,333  Rs. 20,333 │   │        │
│ │  └────────────────────────────────────────┘   │        │
│ └───────────────────────────────────────────────┘        │
│                                                           │
│ [📊 See Full Comparison] [🚗 View This Vehicle]          │
└──────────────────────────────────────────────────────────┘
```

#### Input Fields:
**Current Vehicle:**
- Fuel type (Petrol/Diesel)
- Fuel efficiency (km/L)
- Monthly distance (km)
- Current fuel price (auto-filled from latest data)

**Electric Vehicle:**
- Select from dropdown or auto-populate from vehicle detail page
- Home charging tariff bracket
- Charging location (Home/Public)

**Advanced Options (collapsible):**
- Maintenance costs (custom input)
- Insurance rates
- Resale value depreciation
- Government incentives

#### Components:
- **TCOForm.tsx**: Input form with validation
- **TCOResults.tsx**: Visual results display
- **CostBreakdown.tsx**: Detailed table
- **SavingsChart.tsx**: 5-year projection chart

---

### 6. Route Planner `/tools/route-planner`
**Purpose**: Check if EV can complete a journey

#### Layout:
```
┌──────────────────────────────────────────────────────────┐
│ 🗺️ EV Route Feasibility Checker                          │
│                                                           │
│ ┌─ Your Journey ──────────────────────────────┐         │
│ │ From: [Colombo, Fort            ] 📍        │         │
│ │ To:   [Kandy, City Centre       ] 📍        │         │
│ │                                              │         │
│ │ Distance: 115 km (via A1)                    │         │
│ │ Estimated Time: 2h 30min                     │         │
│ └──────────────────────────────────────────────┘         │
│                                                           │
│ ┌─ Select Vehicle ────────────────────────────┐         │
│ │ [BYD Atto 3 (357 km range) ▼]               │         │
│ │                                              │         │
│ │ Starting Charge: [●●●●●●●○○○] 80%            │         │
│ └──────────────────────────────────────────────┘         │
│                                                           │
│ [Check Route ⚡]                                          │
│                                                           │
│ ┌─ Results ────────────────────────────────────┐        │
│ │ ✅ YES! You can make this trip                │        │
│ │                                               │        │
│ │ Energy Required: ~98 km of range              │        │
│ │ Remaining Charge: 259 km (73%)                │        │
│ │                                               │        │
│ │ [Map showing route]                           │        │
│ │  • Start: Colombo (80% charge)                │        │
│ │  ────────────────────────────────► Kandy      │        │
│ │  • Arrival: Kandy (73% charge)                │        │
│ │                                               │        │
│ │ ⚡ Charging Stations Along Route (3):         │        │
│ │ • Kaduwela (ChargeNET) - 15 km                │        │
│ │ • Kegalle (ChargeNET) - 60 km                 │        │
│ │ • Peradeniya (Private) - 105 km               │        │
│ └───────────────────────────────────────────────┘        │
│                                                           │
│ [View Charging Stations on Map]                          │
└──────────────────────────────────────────────────────────┘
```

#### Features:
- ✅ Google Maps/OpenStreetMap route calculation
- ✅ Elevation profile (hills affect range)
- ✅ Weather consideration (AC usage)
- ✅ Charging stop recommendations
- ✅ Alternative route suggestions

---

### 7. Charging Map `/map`
**Purpose**: Interactive map of charging stations

#### Layout:
```
┌──────────────────────────────────────────────────────────┐
│ ⚡ EV Charging Stations in Sri Lanka                      │
│                                                           │
│ ┌─ Filters ──────────────────────────────────┐          │
│ │ Connector: [All ▼]  Operator: [All ▼]      │          │
│ │ ☑ CCS2  ☑ CHAdeMO  ☑ Type 2                │          │
│ │ ☑ Available  ☐ Maintenance  ☐ Private      │          │
│ └─────────────────────────────────────────────┘          │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │              [Interactive Map]                       │ │
│ │                                                      │ │
│ │    📍 Colombo     🔌 🔌 🔌 🔌 🔌                     │ │
│ │                                                      │ │
│ │                🔌                                    │ │
│ │         🔌              🔌                           │ │
│ │                                                      │ │
│ │              📍 Kandy   🔌 🔌                        │ │
│ │                                                      │ │
│ │  [Zoom In] [Zoom Out] [My Location]                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─ Station Info (on marker click) ──────────────────┐   │
│ │ ChargeNET - One Galle Face                         │   │
│ │ ⚡ DC Fast Charging • 50 kW                        │   │
│ │ 📍 1 One Galle Face, Colombo 02                    │   │
│ │                                                     │   │
│ │ Connectors:                                         │   │
│ │ • CCS2 (50 kW) - ✅ Available                      │   │
│ │ • CHAdeMO (50 kW) - ✅ Available                   │   │
│ │ • Type 2 (22 kW) - 🔴 In Use                       │   │
│ │                                                     │   │
│ │ Amenities: ☕ Cafe • 🅿️ Parking • 📶 WiFi         │   │
│ │ Cost: Rs. 45/kWh                                    │   │
│ │                                                     │   │
│ │ [Get Directions] [Report Issue]                    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                           │
│ 📊 50 stations • 28 available • 5 in use • 2 maintenance │
└──────────────────────────────────────────────────────────┘
```

#### Map Features:
- ✅ Leaflet.js with OpenStreetMap tiles
- ✅ Custom markers (color-coded by status)
- ✅ Marker clustering for dense areas
- ✅ "Near Me" location detection
- ✅ Search by city/address
- ✅ Route from current location

#### Components:
- **MapView.tsx**: Leaflet map wrapper
- **StationMarker.tsx**: Custom map markers
- **StationInfoCard.tsx**: Popup details
- **MapFilters.tsx**: Filter sidebar
- **StationList.tsx**: List view option

---

### 8. AI Assistant `/assistant` (Phase 2)
**Purpose**: Natural language Q&A about EVs

#### Layout:
```
┌──────────────────────────────────────────────────────────┐
│ 🤖 EVGuide Assistant                      [Minimize] [×] │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Assistant:                                          │ │
│ │ Hi! I'm your EV guide for Sri Lanka. Ask me        │ │
│ │ anything about electric vehicles, pricing, range,  │ │
│ │ or charging.                                        │ │
│ │                                                     │ │
│ │ You:                                                │ │
│ │ Which EV is best for climbing Nuwara Eliya hills?  │ │
│ │                                                     │ │
│ │ Assistant:                                          │ │
│ │ For hilly terrain like Nuwara Eliya, I recommend:  │ │
│ │                                                     │ │
│ │ 1. BYD Atto 3 (150kW motor, AWD available)         │ │
│ │    • Strong motor for hills                        │ │
│ │    • 357km range (enough for round trip)           │ │
│ │    • Rs. 10.5M                                     │ │
│ │    [View Details]                                  │ │
│ │                                                     │ │
│ │ 2. MG ZS EV (130kW motor)                          │ │
│ │    • Good hill climbing capability                 │ │
│ │    • Rs. 9.2M                                      │ │
│ │    [View Details]                                  │ │
│ │                                                     │ │
│ │ Note: Regenerative braking on downhill saves      │ │
│ │ energy!                                            │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ [Type your question...]                          [Send] │
│                                                           │
│ Quick Questions:                                          │
│ • What's the cheapest EV?                                │
│ • Show me SUVs under Rs. 10M                             │
│ • How long does charging take?                           │
└──────────────────────────────────────────────────────────┘
```

#### Features:
- ✅ Context-aware responses (uses vehicle database)
- ✅ Quick action buttons (View Details, Calculate TCO)
- ✅ Suggestion chips for common questions
- ✅ Conversation history
- ✅ "Was this helpful?" feedback

---

## 🧩 Shared Components

### Navigation Components

**1. Navbar.tsx** (Desktop)
```
[EVGuide SL Logo]  [Vehicles] [Compare] [Tools ▼] [Map]  [🌙] [Search]
```

**2. MobileNav.tsx** (Bottom Navigation)
```
[🏠 Home] [🚗 Browse] [🔀 Compare] [🗺️ Map] [✨ More]
```

**3. SearchBar.tsx**
- Global search (vehicles, stations)
- Recent searches
- Autocomplete suggestions

### Card Components

**4. VehicleCard.tsx**
- Used in: Homepage, Browse, Search Results
- Variants: Grid, List, Compact

**5. StationCard.tsx**
- Used in: Map, Station List
- Shows availability status

**6. ComparisonCard.tsx**
- Compact vehicle info for comparison bar

### Form Components

**7. FilterPanel.tsx**
- Price range slider
- Multi-select checkboxes
- Radio buttons for exclusive options

**8. CalculatorForm.tsx**
- Reusable for TCO and Route Planner
- Input validation
- Step-by-step wizard option

### Utility Components

**9. LoadingSpinner.tsx**
- Used everywhere for async data

**10. ErrorMessage.tsx**
- Friendly error states

**11. EmptyState.tsx**
- No results found
- No saved vehicles
- No comparison selected

**12. Modal.tsx**
- Vehicle quick view
- Filter modal (mobile)
- Confirmation dialogs

**13. Toast.tsx**
- Success/error notifications
- "Added to comparison"
- "Station reported"

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
xs: 0px      /* Phones */
sm: 640px    /* Large phones */
md: 768px    /* Tablets */
lg: 1024px   /* Small laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large screens */
```

### Layout Adjustments:
- **Mobile (< 768px)**:
  - Bottom navigation
  - Single column grid
  - Hamburger menu
  - Simplified comparison (scroll horizontally)
  
- **Tablet (768px - 1024px)**:
  - Side navigation option
  - 2-column grid
  - Expanded filters in sidebar
  
- **Desktop (> 1024px)**:
  - Top navigation
  - 3-4 column grid
  - Split screen (filters left, content right)
  - Persistent comparison bar

---

## 🎭 User Flows

### Flow 1: First-Time Buyer
```
1. Land on Homepage
2. See hero + featured EVs
3. Click "Browse EVs"
4. Apply filters (Budget: <10M, Range: >300km)
5. View 3 vehicles
6. Click "Compare" on 2 vehicles
7. View comparison
8. Select winner (BYD Atto 3)
9. Open detail page
10. Click "Calculate TCO"
11. See savings (Rs. 15,000/month)
12. Click "Find Charging Stations"
13. See 50 stations on map
14. Decision to buy!
```

### Flow 2: Current Owner Looking for Chargers
```
1. Open /map directly (bookmarked)
2. Click "Near Me"
3. Filter by "CCS2 + Available"
4. See 3 nearby stations
5. Click marker
6. View station details
7. Click "Get Directions"
8. Opens Google Maps
```

### Flow 3: Research & Compare
```
1. Homepage → Search "SUV"
2. See 4 SUVs
3. Select all 3 for comparison
4. Comparison page
5. Identify winner (MG ZS EV)
6. Open detail page
7. Read full specs
8. Save to favorites
9. Calculate TCO
10. Share comparison link with family
```

---

## 🚀 Implementation Priority

### Week 2-3: Core Pages (Epic 1)
- [x] Homepage
- [ ] Browse page with filters
- [ ] Vehicle detail page
- [ ] Basic navigation

### Week 4: Comparison (Epic 2)
- [ ] Comparison page
- [ ] Compare bar component
- [ ] Share comparison feature

### Week 5: Calculators (Epic 3)
- [ ] TCO Calculator
- [ ] Route Planner (basic)

### Week 6-7: Map (Epic 4)
- [ ] Charging station map
- [ ] Station details
- [ ] Filters and search

### Week 8+: Polish & AI (Epic 5)
- [ ] AI Assistant
- [ ] User accounts
- [ ] Saved vehicles
- [ ] Personalized recommendations

---

## ✨ Interactions & Animations

### Micro-Interactions:
1. **Card Hover**: Lift effect (shadow increase)
2. **Button Click**: Scale down (0.95) on press
3. **Filter Apply**: Smooth fade-in of results
4. **Comparison Add**: Slide up animation for compare bar
5. **Range Slider**: Instant visual feedback

### Page Transitions:
- Fade in on route change (200ms)
- Preserve scroll position on back navigation

### Loading States:
- Skeleton screens for cards
- Spinner for calculations
- Progress bar for map loading

---

## 🎨 Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        accent: {
          500: '#3b82f6',
        },
      },
      fontSize: {
        'display': ['3rem', '1.1'],
        'hero': ['2.5rem', '1.2'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
};
```

---

## 📊 Analytics Events to Track

1. **Vehicle Views**: Which models are most viewed?
2. **Filter Usage**: What filters do users apply?
3. **Comparison Selections**: Which vehicles are compared?
4. **TCO Calculations**: How many complete the calculator?
5. **Map Interactions**: Which stations get the most clicks?
6. **Search Queries**: What are users searching for?

---

## 🔒 Accessibility Checklist

- [ ] All images have alt text
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Color contrast ratio > 4.5:1
- [ ] Form validation messages announced
- [ ] Skip to main content link
- [ ] Screen reader tested

---

**This plan covers all 5 Epics and provides a complete UI blueprint for EVGuide SL! Ready to build? Let's start with the Browse page next! 🚀**
