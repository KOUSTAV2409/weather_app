# Demo Video Guide for Landing Page

The landing page has a video slot on the right side that showcases the app. Add your recorded demo video to see it in action.

## Video Requirements

- **Format:** MP4 (primary) and/or WebM (better compression, smaller file)
- **Duration:** 15–30 seconds (short loop)
- **Resolution:** 720p or 1080p recommended
- **File:** Place in `public/` folder

## What to Record

1. **SearchBar** – Show the search input clearly
2. **Search locations** – Type and search 2–3 different cities (e.g., New York, London, Tokyo)
3. **Results** – Let weather cards, outfit suggestions, and other results load and be visible

### Suggested Flow (15–20 sec)

```
0–3s   → Show search bar, type "New York"
3–6s   → Results load (weather card, maybe outfit suggestion)
6–9s   → Search "London"
9–12s  → Results load
12–15s → Search "Tokyo" (optional) or quick scroll through features
```

## Recording Tools

| Tool | Use Case |
|------|----------|
| **OBS Studio** | Free, full screen recording |
| **Loom** | Quick browser recording |
| **macOS QuickTime** | Built-in screen recording |
| **Windows Game Bar** | Win + G for screen capture |

## Steps

1. Run the app: `pnpm run dev`
2. Go to http://localhost:5173/app
3. Record your screen (search bar + 2–3 city searches)
4. Export as MP4 or WebM
5. Save as `public/demo.mp4` and/or `public/demo.webm`

## File Naming

Place your video files in the `public` folder:

- `public/demo.mp4` – main format (fallback)
- `public/demo.webm` – preferred for Web (smaller, good quality)

The browser will use WebM if available, otherwise MP4.

## Fallback

If no video file exists, the video will show a black area. To avoid that, you can add a placeholder poster image or use a fallback div. For now, add the video file to see the demo.

## Optimization

- Keep file size under 5 MB for fast loading
- Use WebM for smaller size (e.g., HandBrake or FFmpeg)
- Compress: `ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 demo.webm`
