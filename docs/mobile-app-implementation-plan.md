# Mobile App-Like Experience - Implementation Plan

## Overview
This document outlines the comprehensive plan to transform Echo from a responsive web application into a mobile app-like experience. The focus is on making the TV Shows (and other media types) feel native on mobile devices.

## Current State Analysis

### Existing Mobile Features ✅
- Responsive grid layout (2 cols mobile → 4 cols desktop)
- Hamburger menu navigation
- Touch-friendly button sizes (mostly)
- Responsive typography with clamp()
- Mobile menu overlay
- Basic active states on cards

### Key Problems ❌
1. Web-like hamburger menu instead of native tab bar
2. Header too large on mobile (wastes screen space)
3. No safe area insets for notched devices
4. Add button in header (should be FAB)
5. Page titles take up valuable space
6. Card text too small (10-12px)
7. No status bar theming
8. Tabs have minimal touch targets

---

## Implementation Phases

### Phase 1: Critical Mobile Fixes (1-2 days)
**Priority: HIGH | Impact: HIGH**

#### 1.1 Bottom Navigation Tab Bar
**File:** `/components/bottom-navigation.tsx` (new)

Create a new component replacing the hamburger menu:

```tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpenIcon,
  FilmIcon,
  TvIcon,
  GamepadIcon
} from '@phosphor-icons/react';

export function BottomNavigation() {
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type') || 'BOOK';

  const tabs = [
    { type: 'BOOK', label: 'Books', icon: BookOpenIcon },
    { type: 'MOVIE', label: 'Movies', icon: FilmIcon },
    { type: 'TV_SHOW', label: 'TV', icon: TvIcon },
    { type: 'VIDEO_GAME', label: 'Games', icon: GamepadIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ type, label, icon: Icon }) => (
          <Link
            key={type}
            href={`/?type=${type}&status=BACKLOG`}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              activeType === type ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Icon size={24} weight={activeType === type ? 'fill' : 'regular'} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

**Implementation:**
- Create new `bottom-navigation.tsx` component
- Add to `app/layout.tsx` or `components/client-layout.tsx`
- Hide on desktop with `md:hidden`
- Remove hamburger menu from `navigation-header.tsx`

**Testing:**
- Verify navigation works on mobile
- Check active state highlighting
- Test on iOS Safari and Android Chrome

---

#### 1.2 Reduce Header Size
**File:** `/components/navigation-header.tsx`

**Changes:**
```tsx
// Line 57: Reduce header padding
- <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-6">
+ <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-6">

// Line 77: Scale logo size
- <div className="w-12 h-12 bg-foreground rounded-lg...">
+ <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-lg...">

// Line 78: Scale drop icon
- <DropIcon size={28} weight="fill" className="text-background" />
+ <DropIcon size={24} weight="fill" className="text-background sm:[&]:size-[28px]" />

// Line 80: Scale text
- <span className="text-xl font-semibold tracking-tight lowercase">echo</span>
+ <span className="text-lg sm:text-xl font-semibold tracking-tight lowercase">echo</span>

// Lines 62-74: Remove hamburger menu button (replaced by bottom nav)
```

**Testing:**
- Verify header looks compact on mobile
- Check logo scales properly
- Ensure text remains readable

---

#### 1.3 Add Safe Area Insets
**File:** `/app/globals.css`

**Add after line 83:**
```css
/* Safe area insets for notched devices */
@supports (padding: env(safe-area-inset-bottom)) {
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }

  .px-safe {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

/* Bottom navigation safe area */
.bottom-nav-safe {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}

/* Main content padding to account for bottom nav on mobile */
@media (max-width: 768px) {
  .mobile-content {
    padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
  }
}
```

**File:** `/app/layout.tsx`

Update viewport meta tag:
```tsx
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
/>
<meta name="theme-color" content="#fcfcfc" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

**Testing:**
- Test on iPhone with notch/Dynamic Island
- Test on Android with gesture navigation
- Verify bottom nav doesn't overlap content
- Check safe areas in landscape mode

---

#### 1.4 Convert Add Button to FAB
**File:** `/app/page.tsx`

**Changes:**
```tsx
// Lines 101-108: Update add button positioning
<Button
  onClick={() => setIsAddDialogOpen(true)}
  variant="ghost"
  size="sm"
- className="shrink-0 text-foreground hover:text-foreground/80 [&_svg]:!size-auto h-11 w-11 p-0"
+ className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all md:static md:bottom-auto md:right-auto md:h-11 md:w-11 md:rounded-md md:bg-transparent md:text-foreground md:shadow-none [&_svg]:!size-auto p-0"
>
- <PlusIcon size={24} weight="bold" />
+ <PlusIcon size={28} weight="bold" className="md:[&]:size-[24px]" />
</Button>
```

**Additional CSS for FAB (globals.css):**
```css
/* Floating Action Button */
.fab {
  position: fixed;
  bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
  right: 1rem;
  z-index: 40;
}

@media (min-width: 768px) {
  .fab {
    position: static;
    bottom: auto;
    right: auto;
  }
}
```

**Testing:**
- Verify FAB floats above content on mobile
- Check it doesn't overlap bottom nav
- Ensure it returns to header on desktop
- Test touch target size (should be 56x56px minimum)

---

#### 1.5 Hide/Reduce Page Title on Mobile
**File:** `/app/page.tsx`

**Changes:**
```tsx
// Line 100: Make title smaller or hidden on mobile
- <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">{pageContent.title}</h1>
+ <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight md:block">{pageContent.title}</h1>

// Lines 110-112: Hide description on small mobile
- <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl font-light">
+ <p className="hidden sm:block text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl font-light">
```

**Alternative:** Keep title but make it much smaller
```tsx
<h1 className="text-xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
```

**Testing:**
- Verify mobile layout is cleaner
- Check title visibility on different screen sizes
- Ensure desktop experience unchanged

---

### Phase 2: Visual & Interaction Improvements (2-3 days)
**Priority: MEDIUM | Impact: HIGH**

#### 2.1 Increase Card Text & Button Sizes
**File:** `/components/media-card.tsx`

**Changes:**
```tsx
// Line 142-145: Larger badge text
- <p className="text-[10px] sm:text-xs font-medium text-foreground text-center">
+ <p className="text-xs sm:text-sm font-medium text-foreground text-center">

// Line 152: Larger progress badge
- <p className="text-[10px] sm:text-xs font-medium text-primary-foreground text-center">
+ <p className="text-xs sm:text-sm font-medium text-primary-foreground text-center">

// Line 161: Larger title text
- <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2...">
+ <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2...">

// Line 165: Larger episode info
- <p className="text-[10px] sm:text-xs text-primary font-medium line-clamp-1">
+ <p className="text-xs sm:text-sm text-primary font-medium line-clamp-1">

// Line 171: Larger creator text
- <p className="text-[10px] sm:text-xs text-muted-foreground font-light line-clamp-1">
+ <p className="text-xs sm:text-sm text-muted-foreground font-light line-clamp-1">

// Line 197: Larger buttons
- <Button variant="outline" size="sm" className="flex-1 h-8 text-xs"...>
+ <Button variant="outline" size="sm" className="flex-1 h-9 sm:h-10 text-sm"...>

// Line 205: Larger edit button
- <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
+ <Button variant="ghost" size="sm" className="h-9 sm:h-10 text-sm px-3">

// Line 216: Larger full-width button
- <Button variant="outline" size="sm" className="w-full h-8 text-xs"...>
+ <Button variant="outline" size="sm" className="w-full h-9 sm:h-10 text-sm"...>
```

**Testing:**
- Verify text is readable on mobile devices
- Check button sizes meet 44x44px minimum touch target
- Ensure layout doesn't break on desktop

---

#### 2.2 Improve Tab Touch Targets
**File:** `/components/bookshelf-tabs.tsx`

**Changes:**
```tsx
// Line 61: Larger tap targets
<button
  key={tab.value}
  onClick={() => onTabChange(tab.value)}
  className={`
-   py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm tracking-wide transition-all relative whitespace-nowrap flex-shrink-0
+   py-4 sm:py-4 px-6 sm:px-8 text-sm sm:text-base tracking-wide transition-all relative whitespace-nowrap flex-shrink-0 min-h-[48px]
    ${
      activeTab === tab.value
        ? 'text-foreground font-semibold'
        : 'text-muted-foreground font-medium hover:text-foreground'
    }
  `}
>
```

**Additional Enhancement:** Add scroll snap
```tsx
// Line 55
- <nav className="flex gap-1 sm:gap-2 -mb-px overflow-x-auto scrollbar-hide">
+ <nav className="flex gap-1 sm:gap-2 -mb-px overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
```

In each button:
```tsx
+ className="... snap-center"
```

**Testing:**
- Verify tabs are easy to tap on mobile
- Check scroll behavior with many tabs
- Test active state visibility

---

#### 2.3 Reduce Page Content Padding
**File:** `/app/page.tsx`

**Changes:**
```tsx
// Line 95: Tighter mobile padding
- <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-16 lg:py-20">
+ <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-12 lg:py-20 mobile-content">

// Line 97: Reduce header spacing
- <div className="mb-8 sm:mb-12 lg:mb-16">
+ <div className="mb-4 sm:mb-12 lg:mb-16">

// Line 98: Reduce space-y
- <div className="space-y-3 sm:space-y-4">
+ <div className="space-y-2 sm:space-y-4">
```

**Note:** Add `mobile-content` class for bottom nav spacing

**Testing:**
- Verify content doesn't feel cramped
- Check bottom nav doesn't overlap grid
- Test on various mobile screen sizes

---

#### 2.4 Optimize Grid Spacing
**File:** `/components/media-grid.tsx` (need to read this file)

**Expected changes:**
```tsx
// Reduce gap on mobile
- className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12"
+ className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-12"
```

**Testing:**
- Verify more content visible on screen
- Check cards don't feel squished
- Ensure desktop spacing unchanged

---

### Phase 3: Polish & Advanced Features (3-4 days)
**Priority: LOW | Impact: MEDIUM**

#### 3.1 Pull-to-Refresh
**File:** `/app/page.tsx`

Install dependency:
```bash
pnpm add react-use-gesture
```

**Implementation:**
```tsx
import { useGesture } from 'react-use-gesture';
import { useSpring, animated } from 'react-spring';

// Inside component
const [{ y }, set] = useSpring(() => ({ y: 0 }));
const bind = useGesture({
  onDrag: ({ down, movement: [, my] }) => {
    if (my > 0 && !loading) {
      set({ y: down ? my : 0 });
      if (!down && my > 80) {
        fetchItems(); // Trigger refresh
      }
    }
  },
});

return (
  <animated.main {...bind()} style={{ y }}>
    {/* Content */}
  </animated.main>
);
```

**Testing:**
- Test pull gesture on mobile
- Verify refresh triggers correctly
- Check doesn't interfere with scroll

---

#### 3.2 Loading Skeletons
**File:** `/components/media-grid.tsx`

Replace loading text with skeleton cards:

```tsx
function SkeletonCard() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="aspect-[2/3] bg-muted rounded-md" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  );
}

// In MediaGrid
{loading ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
) : (
  // Actual content
)}
```

**Testing:**
- Verify skeletons match card layout
- Check animation is smooth
- Test on slow connections

---

#### 3.3 Haptic Feedback (iOS)
**File:** `/lib/haptics.ts` (new)

```typescript
export const haptics = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },
};
```

Add to button clicks:
```tsx
onClick={() => {
  haptics.light();
  // ... existing logic
}}
```

**Testing:**
- Test on iOS Safari
- Test on Android Chrome
- Verify doesn't cause issues on desktop

---

#### 3.4 Improved Empty States
**File:** `/components/media-grid.tsx`

Add illustration or better empty state:

```tsx
{items.length === 0 && !loading && (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
      <TvIcon size={48} weight="thin" className="text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No TV shows yet</h3>
    <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
      Start building your library by adding some TV shows you want to watch
    </p>
    <Button onClick={() => setIsAddDialogOpen(true)}>
      Add Your First Show
    </Button>
  </div>
)}
```

**Testing:**
- Verify empty state appears correctly
- Check button action works
- Test on mobile and desktop

---

#### 3.5 Swipe Gestures for Navigation
**File:** `/components/client-layout.tsx`

Use `react-use-gesture` for swipe navigation:

```tsx
import { useGesture } from 'react-use-gesture';
import { useRouter } from 'next/navigation';

const mediaTypes = ['BOOK', 'MOVIE', 'TV_SHOW', 'VIDEO_GAME'];

const bind = useGesture({
  onSwipe: ({ direction: [xDir] }) => {
    const currentIndex = mediaTypes.indexOf(currentType);
    if (xDir < 0 && currentIndex < mediaTypes.length - 1) {
      // Swipe left - next type
      router.push(`/?type=${mediaTypes[currentIndex + 1]}&status=BACKLOG`);
    } else if (xDir > 0 && currentIndex > 0) {
      // Swipe right - previous type
      router.push(`/?type=${mediaTypes[currentIndex - 1]}&status=BACKLOG`);
    }
  },
});
```

**Testing:**
- Test swipe left/right on mobile
- Verify doesn't break card interactions
- Check works on iOS and Android

---

#### 3.6 Optimized Images
**File:** `/components/media-card.tsx`

Already using Next.js Image, but optimize further:

```tsx
// Line 125-132
<Image
  src={coverImage}
  alt={title}
  fill
  className="object-cover transition-all duration-500 group-hover:scale-[1.02]"
- sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
+ sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
  priority={false}
+ loading="lazy"
+ quality={85}
+ placeholder="blur"
+ blurDataURL="data:image/svg+xml;base64,..." // Add blur placeholder
/>
```

**Testing:**
- Verify images load smoothly
- Check blur placeholder works
- Test on slow connections

---

### Phase 4: Progressive Web App (PWA) (2-3 days)
**Priority: LOW | Impact: HIGH (long-term)**

#### 4.1 Add Web App Manifest
**File:** `/public/manifest.json` (new)

```json
{
  "name": "Echo - Media Tracker",
  "short_name": "Echo",
  "description": "Track your books, movies, TV shows, and games",
  "start_url": "/?type=TV_SHOW",
  "display": "standalone",
  "background_color": "#fcfcfc",
  "theme_color": "#fcfcfc",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**File:** `/app/layout.tsx`

Add manifest link:
```tsx
<link rel="manifest" href="/manifest.json" />
```

**Testing:**
- Test "Add to Home Screen" on iOS
- Test "Install App" on Android
- Verify icons appear correctly

---

#### 4.2 Service Worker for Offline Support
**File:** `/public/sw.js` (new)

```javascript
const CACHE_NAME = 'echo-v1';
const urlsToCache = [
  '/',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

**File:** `/app/layout.tsx`

Register service worker:
```tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

**Testing:**
- Test offline functionality
- Verify caching works
- Check updates propagate correctly

---

#### 4.3 App Icons
Create app icons in `/public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `favicon.ico`

Use the Drop icon from the logo as the app icon base.

**Testing:**
- Verify icons appear on home screen
- Check icon quality on both platforms
- Test splash screen appearance

---

## Testing Checklist

### Devices to Test
- [ ] iPhone 15 Pro (iOS Safari)
- [ ] iPhone SE (smaller screen)
- [ ] iPad (tablet view)
- [ ] Samsung Galaxy S23 (Android Chrome)
- [ ] Google Pixel (pure Android)
- [ ] Desktop Chrome
- [ ] Desktop Safari

### Test Scenarios
- [ ] Navigate between media types via bottom nav
- [ ] Add new media via FAB
- [ ] Update episode progress
- [ ] Switch status tabs
- [ ] Scroll through long lists
- [ ] Rotate device (portrait ↔ landscape)
- [ ] Test with notched/non-notched devices
- [ ] Test on slow network (3G)
- [ ] Test offline behavior (if PWA)
- [ ] Test pull-to-refresh
- [ ] Test swipe gestures

### Accessibility Testing
- [ ] Screen reader navigation
- [ ] Keyboard navigation (desktop)
- [ ] Color contrast ratios
- [ ] Touch target sizes (minimum 44x44px)
- [ ] Focus indicators visible

---

## File Reference

### Files to Modify
1. `/components/navigation-header.tsx` - Header optimization
2. `/components/bookshelf-tabs.tsx` - Tab improvements
3. `/components/media-card.tsx` - Card sizing
4. `/components/media-grid.tsx` - Grid spacing
5. `/app/page.tsx` - Layout and FAB
6. `/app/globals.css` - Safe areas and utilities
7. `/app/layout.tsx` - Meta tags and manifest

### Files to Create
1. `/components/bottom-navigation.tsx` - Bottom tab bar
2. `/lib/haptics.ts` - Haptic feedback utilities
3. `/public/manifest.json` - PWA manifest
4. `/public/sw.js` - Service worker
5. `/public/offline.html` - Offline fallback page
6. `/public/icon-*.png` - App icons

---

## Performance Targets

### Lighthouse Scores (Mobile)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100
- PWA: 100 (after Phase 4)

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## Rollout Strategy

### Development
1. Create feature branch: `feature/mobile-app-experience`
2. Implement Phase 1 (critical fixes)
3. Test on physical devices
4. Deploy to staging environment
5. Gather feedback from testers

### Staging
1. Complete Phase 2 (visual improvements)
2. Comprehensive device testing
3. Performance profiling
4. Accessibility audit
5. User testing session

### Production
1. Deploy Phase 1 + 2 to production
2. Monitor analytics for mobile usage
3. Collect user feedback
4. Implement Phase 3 (polish) based on feedback
5. Consider Phase 4 (PWA) if adoption is high

---

## Success Metrics

### Quantitative
- Mobile bounce rate decrease by 20%
- Mobile session duration increase by 30%
- "Add to Home Screen" installs (if PWA)
- Mobile page load time < 2s

### Qualitative
- Users report "feels like an app"
- Positive feedback on mobile experience
- Decreased complaints about mobile usability
- Increased mobile feature usage

---

## Dependencies

### PNPM Packages (Optional)
```bash
# For advanced gestures
pnpm add react-use-gesture @react-spring/web

# For PWA optimization
pnpm add next-pwa

# For better mobile detection
pnpm add react-device-detect
```

### External Services
- None required for core functionality
- TMDB API already integrated
- Consider image CDN for optimization (Cloudinary, Imgix)

---

## Timeline Estimate

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Critical Fixes | 1-2 days | High |
| Phase 2: Visual Polish | 2-3 days | Medium |
| Phase 3: Advanced Features | 3-4 days | Medium |
| Phase 4: PWA | 2-3 days | Low |
| Testing & QA | 2-3 days | High |
| **Total** | **10-15 days** | - |

---

## Notes

### Design Principles
1. **Mobile-first**: Design for mobile, scale up to desktop
2. **Touch-friendly**: Minimum 44x44px tap targets
3. **Performance**: Fast load times, smooth animations
4. **Native feel**: Bottom nav, FAB, gestures
5. **Accessibility**: Screen reader support, keyboard nav

### Technical Considerations
- Use CSS transforms for animations (GPU accelerated)
- Minimize JavaScript bundle size
- Lazy load images below the fold
- Use Next.js ISR for better performance
- Consider React Server Components where applicable

### Browser Support
- iOS Safari 14+
- Chrome for Android 90+
- Samsung Internet 14+
- Desktop: Chrome, Safari, Firefox, Edge (latest 2 versions)

---

## Contact & Questions

For questions about this implementation plan:
- Review the codebase structure
- Check existing component patterns
- Test changes incrementally
- Document any deviations from plan

**Last Updated:** 2025-11-11
**Version:** 1.0
