# Video Background Setup

## 📹 How to Add Your Video

1. **Place your video file** in this directory (`public/videos/`)

2. **Rename it to** `hero-background.mp4` (or keep your filename and update the code)

3. **Recommended video specifications:**
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080 (Full HD) or higher
   - Duration: 10-30 seconds (for seamless loop)
   - File size: < 5MB (compress for web)
   - Aspect ratio: 16:9

## 🎬 Video Recommendations

### Best Video Types:
- ✅ Electric vehicles driving smoothly
- ✅ Charging station close-ups
- ✅ Aerial shots of Sri Lankan roads/landscapes
- ✅ Time-lapse of EV charging
- ✅ Abstract electric/energy animations
- ✅ Slow-motion EV details

### Avoid:
- ❌ Too much motion (distracting)
- ❌ Bright flashing colors
- ❌ Text or logos in the video
- ❌ Low resolution or pixelated footage
- ❌ Very large files (slow loading)

## 🔧 Custom Video Path

If you want to use a different filename, update the `videoUrl` prop:

```tsx
// In app/page.tsx
<HomePageClient 
  vehicles={vehicles}
  vehicleCount={vehicles.length}
  chargerCount={chargingStations.length}
  videoUrl="/videos/your-custom-name.mp4"
/>
```

## 🖼️ Optional: Add a Poster Image

Add a poster image (displayed while video loads):

1. Place image in `public/images/`
2. Update HeroSection.tsx:
   ```tsx
   poster="/images/hero-poster.jpg"
   ```

## 🎨 Premium Features Included:

- ✅ Auto-play, loop, muted
- ✅ Dark gradient overlay for readability
- ✅ Vignette effect
- ✅ Backdrop blur on buttons
- ✅ Drop shadows on text
- ✅ Smooth wave transition
- ✅ Responsive design
- ✅ Fallback to gradient if video fails

## 🌐 Where to Find Free EV Videos:

1. **Pexels** - https://www.pexels.com/search/videos/electric%20car/
2. **Pixabay** - https://pixabay.com/videos/search/electric%20vehicle/
3. **Coverr** - https://coverr.co/
4. **Videvo** - https://www.videvo.net/

## 🔥 Quick Start:

1. Download a video from the sites above
2. Compress it using: https://www.freeconvert.com/video-compressor
3. Rename to `hero-background.mp4`
4. Place in this folder
5. Refresh your browser!
