# Icons Report - EVGuide SL Project

This document provides a comprehensive list of all icons used throughout the EVGuide SL project.

## Overview

The EVGuide SL project primarily uses **emoji icons** for visual elements throughout the application, providing a lightweight and accessible approach to iconography without requiring external icon libraries.

---

## Icon Usage by Component

### 1. **ValuePropositions Component**
**File:** `components/ValuePropositions.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 🔋 | Battery/Power | Real Range Estimates indicator |
| 💰 | Money/Cost | True Cost Analysis indicator |
| 🗺️ | Map | Charging Network indicator |

---

### 2. **SpecsTable Component**
**File:** `components/SpecsTable.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 🔋 | Battery | Battery Capacity specification |
| 📊 | Chart/Stats | Range (WLTP) specification |
| ⚡ | Lightning/Power | Range (SL Estimate) specification |
| 💪 | Strength | Motor Power specification |
| 🚀 | Speed | Top Speed specification |
| ⏱️ | Timer | Acceleration (0-100 km/h) specification |
| 🛣️ | Road | Drive Type specification |
| 👥 | People | Seating Capacity specification |
| 📦 | Box/Storage | Cargo Space specification |
| 🚗 | Car | Body Type specification |
| 📅 | Calendar | Year specification |
| 💰 | Money | Tax Bracket specification |
| 💡 | Lightbulb | Key Information callout |

---

### 3. **MobileNav Component**
**File:** `components/MobileNav.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 🏠 | Home | Home page navigation |
| 🚗 | Car | Browse vehicles navigation |
| 🔀 | Compare | Compare vehicles navigation |
| 🗺️ | Map | Map view navigation |
| ✨ | Sparkles | More options button |

---

### 4. **FeaturesList Component**
**File:** `components/FeaturesList.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| ✨ | Sparkles | Features section header |
| 🛡️ | Shield | Safety & Assistance category |
| 🌟 | Star | Comfort & Convenience category |
| 🌞 | Sun | Panoramic Sunroof / Sunroof feature |
| 📹 | Camera | 360 Camera / Camera feature |
| ⚡ | Lightning | Wireless Charging / Fast Charging feature |
| 🚗 | Car | Adaptive Cruise Control feature |
| 🎯 | Target | ProPilot Assist feature |
| 🛑 | Stop Sign | e-Pedal feature |
| 🍎 | Apple | Apple CarPlay feature |
| 💡 | Light | LED Headlights feature |
| 🪑 | Chair | Leather Seats feature |
| 🌧️ | Rain | Rain Sensing Wipers feature |
| 🔄 | Rotate | Rotating Screen feature |
| 🎤 | Microphone | Voice Control feature |
| 💫 | Dizzy | LED Ambient Lighting feature |
| 🔑 | Key | Keyless Entry feature |
| 🤖 | Robot | Autopilot feature |
| 🔊 | Speaker | Premium Audio feature |
| 🪟 | Window | Glass Roof feature |
| 📲 | Phone | OTA Updates feature |
| ✓ | Checkmark | Default/generic feature icon |

---

### 5. **EmptyState Component**
**File:** `components/EmptyState.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 📭 | Empty Mailbox | Default empty state |
| 🔍 | Magnifying Glass | No results found |
| 💚 | Green Heart | No saved vehicles |
| 🔀 | Shuffle | No comparison selected |
| 📍 | Location Pin | No stations nearby |

---

### 6. **ChargingInfo Component**
**File:** `components/ChargingInfo.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 🏠 | Home | Home AC Charging indicator |
| ⚡ | Lightning | Fast DC Charging indicator |
| 💡 | Lightbulb | Charging tips/information |
| 🌙 | Moon | Overnight charging scenario |

---

### 7. **StationCard Component**
**File:** `components/StationCard.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| ⚡ | Lightning | Charging station indicator |

---

### 8. **VehicleCard Component**
**File:** `components/VehicleCard.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 🚗 | Car | Placeholder when no vehicle image |

---

### 9. **ComparisonTable Component**
**File:** `components/comparison/ComparisonTable.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 🔀 | Shuffle | Change vehicle button |
| ✕ | X Mark | Remove vehicle button |
| 🚗 | Car | Vehicle image placeholder |
| ▼ | Down Arrow | Collapsed category indicator |
| ▲ | Up Arrow | Expanded category indicator |

---

### 10. **ComparisonRow Component**
**File:** `components/comparison/ComparisonRow.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| ✓✓ | Double Check | Winner indicator |

Uses the same spec icons as **SpecsTable** component.

---

### 11. **Navbar Component**
**File:** `components/Navbar.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 💰 | Money | TCO Calculator tool link |
| 🗺️ | Map | Route Planner tool link |

---

### 12. **CompareBar Component**
**File:** `components/CompareBar.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| ✕ | X Mark | Remove vehicle from comparison |

---

### 13. **TCOResults Component**
**File:** `components/tco/TCOResults.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 💰 | Money | Savings section header |

---

### 14. **CostBreakdown Component**
**File:** `components/tco/CostBreakdown.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| 📊 | Chart | Detailed Cost Breakdown header |

---

### 15. **RouteResults Component**
**File:** `components/route-planner/RouteResults.tsx`

| Icon | Purpose | Description |
|------|---------|-------------|
| ✅ | Green Check | Trip is feasible |
| ❌ | Red X | Trip is not feasible |

---

## SVG Icon Components

### Toast Component
**File:** `components/Toast.tsx`

The Toast component uses **SVG path-based icons** with different paths for different notification types:

| Type | Icon Path | Description |
|------|-----------|-------------|
| Success | `M5 13l4 4L19 7` | Checkmark icon |
| Error | `M6 18L18 6M6 6l12 12` | X mark icon |
| Warning | `M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z` | Warning triangle icon |
| Info | `M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z` | Info circle icon |

### ThemeToggle Component
**File:** `components/ThemeToggle.tsx`

Uses **animated SVG icons** for theme switching:
- **Sun Icon** - Light mode indicator
- **Moon Icon** - Dark mode indicator

### ErrorMessage Component
**File:** `components/ErrorMessage.tsx`

Uses **SVG error icon** for error state display.

---

## Icon Categories Summary

### By Functional Category

#### **Navigation & UI** (11 icons)
- 🏠 Home
- 🚗 Browse/Car
- 🔀 Compare/Shuffle
- 🗺️ Map
- ✨ More/Sparkles
- ▼ Collapse
- ▲ Expand
- ✕ Close/Remove
- 💰 Money/Tools
- 🔍 Search
- 📍 Location

#### **Vehicle Specifications** (12 icons)
- 🔋 Battery
- 📊 Statistics
- ⚡ Power/Charging
- 💪 Motor Power
- 🚀 Speed
- ⏱️ Time/Acceleration
- 🛣️ Road/Drive Type
- 👥 Capacity
- 📦 Cargo
- 📅 Year
- 🚗 Body Type
- 💡 Information

#### **Features & Amenities** (22 icons)
- 🌞 Sunroof
- 📹 Camera
- ⚡ Charging
- 🎯 Assistance
- 🛑 e-Pedal
- 🍎 CarPlay
- 💡 Lights
- 🪑 Seats
- 🌧️ Wipers
- 🔄 Screen
- 🎤 Voice
- 💫 Lighting
- 🔑 Keyless
- 🤖 Autopilot
- 🔊 Audio
- 🪟 Roof
- 📲 Updates
- ✓ Checkmark
- 🛡️ Safety
- 🌟 Comfort
- 🏠 Home Charging
- 🌙 Overnight

#### **Status & Feedback** (8 icons)
- ✅ Success/Feasible
- ❌ Error/Not Feasible
- ✓✓ Winner
- 💚 Favorites
- 📭 Empty
- 📊 Data/Charts

---

## Icon Library Used

**None** - The project uses:
1. **Unicode Emoji** as the primary icon system
2. **Inline SVG** for specific UI elements (Toast notifications, ThemeToggle, etc.)
3. **SVG path data** for notification states

---

## Benefits of Current Approach

1. **Zero Dependencies** - No icon library needed
2. **Lightweight** - Emojis are part of Unicode standard
3. **Accessible** - Native screen reader support
4. **Cross-platform** - Works on all modern browsers
5. **Easy to Update** - Simple string replacement

---

## Icon Usage Statistics

- **Total Unique Emoji Icons:** ~60
- **SVG Path Icons:** 4 (Toast notification types)
- **Animated SVG Icons:** 2 (Theme toggle)
- **Components Using Icons:** 15+

---

## Recommendations

### Current Strengths
✅ Consistent emoji usage across components  
✅ Well-organized icon-to-feature mapping  
✅ Lightweight approach without external dependencies  

### Potential Improvements
💡 Consider documenting icon accessibility alternatives  
💡 Maintain a centralized icon constant file for easier updates  
💡 Consider fallback strategy for platforms with limited emoji support  

---

**Generated:** February 20, 2026  
**Project:** EVGuide SL  
**Report Type:** Icon Usage Audit
