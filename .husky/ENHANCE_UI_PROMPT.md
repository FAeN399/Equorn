# 🎨 Equorn UI Enhancement Prompt

## Project Context
**Equorn** is a generative myth-engine that turns structured narrative blueprints (YAML/JSON) into playable prototypes for game engines like Godot and Unity. It's currently a fully functional Next.js web application with a modern dark theme.

## Current Tech Stack
- **Frontend**: Next.js 14.2.29 + React + TypeScript
- **Styling**: Tailwind CSS with custom theme
- **API**: tRPC for type-safe API calls
- **Build**: PNPM workspace monorepo
- **Live URL**: http://localhost:3000

## Current UI Structure
```
📁 packages/web/src/
├── 📄 pages/index.tsx (261 lines) - MAIN UI FILE
├── 📄 styles/globals.css (82 lines) - Global styles & animations
├── 📄 tailwind.config.js (83 lines) - Theme configuration
└── 📄 server/routers/_app.ts (70 lines) - API endpoints
```

## Current Design Features
✅ **Working Well:**
- Modern dark theme with gradient accents
- Responsive layout (mobile-friendly)
- Smooth animations and transitions
- Clean typography with serif headers
- Professional landing page structure
- Tab-based navigation (Dashboard/Templates/Documentation)
- tRPC integration for dynamic content

## Areas for Enhancement

### 🎯 **Primary Enhancement Opportunities:**

1. **Interactive Elements**
   - Make "Get Started" and "Explore Templates" buttons functional
   - Add hover effects and micro-interactions
   - Create working template gallery with real seed files
   - Implement project creation flow

2. **Visual Sophistication**
   - Enhanced cosmic/mythical background effects
   - More dynamic animations (particle systems, floating elements)
   - Better use of gradients and lighting effects
   - Improved card layouts and visual hierarchy

3. **Content Enhancement**
   - Real template previews showing generated content
   - Code syntax highlighting in examples
   - Interactive demos or previews
   - Better visual representation of the "seed to world" concept

4. **User Experience**
   - Add loading states and feedback
   - Implement actual navigation between sections
   - Create onboarding flow
   - Add search/filter for templates

### 🎨 **Visual Style Direction:**
- **Theme**: Mystical/magical with modern tech aesthetics
- **Colors**: Deep purples, cosmic blues, gold accents
- **Mood**: Professional yet enchanting, like "magic meets code"
- **Inspiration**: Think Stripe's polish + magical/gaming themes

### 📱 **Technical Constraints:**
- Must use Tailwind CSS (avoid custom CSS where possible)
- Keep React components functional/hooks-based
- Maintain Next.js App Router structure
- Preserve tRPC API integration
- Support responsive design (mobile-first)

## Current Theme Configuration
```javascript
// From tailwind.config.js
colors: {
  primary: { 400: '#9333ea', 500: '#7c3aed', 600: '#6d28d9' },
  secondary: { 400: '#f59e0b', 500: '#d97706', 600: '#b45309' },
  dark: { 700: '#374151', 800: '#1f2937', 900: '#111827' }
}
```

## Key Files to Enhance

### 🎯 **Primary Target: packages/web/src/pages/index.tsx**
**Current sections to enhance:**
- **Lines 87-108**: Hero section - make more interactive/animated
- **Lines 118-146**: Code preview - add syntax highlighting, make interactive
- **Lines 158-202**: Feature cards - add animations, better icons
- **Lines 205-235**: Templates gallery - make functional with real data
- **Lines 238-261**: Footer - enhance with useful links

### 🎨 **Secondary Targets:**
- **packages/web/src/styles/globals.css**: Add new animations/effects
- **packages/web/tailwind.config.js**: Expand theme with new colors/utilities

## Real Data Integration
**Available seed files to showcase:**
- `seeds/forest-guardian.yaml` - Forest guardian with nature magic
- `seeds/ocean-depths.yaml` - Ocean environment (2.3KB)
- `seeds/mystic-tower.yaml` - Tower scenario (2.3KB)

**Generated output to display:**
- `output/godot/` contains real generated Godot projects
- Shows actual GDScript code, scenes, project files

## Success Metrics
- ✨ More engaging and interactive experience
- 🎯 Clear path from landing page to project creation
- 🚀 Showcase the actual power of the tool with real examples
- 💫 Memorable visual design that reflects the "mythic" brand
- 📱 Excellent experience across all devices

## Enhancement Request
Please enhance the Equorn UI to be more visually stunning, interactive, and engaging while maintaining its professional quality. Focus on creating a magical, immersive experience that showcases the power of turning "myth seeds" into playable game prototypes. Make the interface feel like a modern developer tool that happens to create mythical worlds.

**Priority: Make it feel magical yet professional - like the perfect tool for indie game developers and worldbuilders.** 