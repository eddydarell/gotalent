# Landing Page

This directory contains the static landing page for the Go Talent event platform.

## Description

The landing page serves as the main entry point and information hub for the Go Talent event. It provides:

- Event information and details
- Navigation to other platform services
- Event agenda and schedule
- Sponsor information
- Contact details

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Mining Theme**: Industrial mining-themed design with gold accents
- **Smooth Animations**: Animated text ribbons and scroll effects
- **Navigation Bar**: Fixed navigation bar for easy access to sections

## Design Tokens

The landing page establishes the design system used across all services:

### Colors

- **Background**: `#1c1c1c` (Dark charcoal)
- **Primary Gold**: `#daa520` (Goldenrod)
- **Text**: `#f3e5ab` (Wheat/Cream)
- **Secondary Browns**: Various shades (`#8b7355`, `#9b8365`, `#ab9375`, `#7b6345`, `#6b5335`)
- **Dark Brown**: `#2c1810`

### Typography

- **Primary Font**: Inter (with system fallbacks: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Monospace Font**: JetBrains Mono, Fira Code, Monaco, Cascadia Code, SF Mono
- **Letter Spacing**: Wide spacing for mining-themed headings (1.5px)

## Structure

```
landing/
├── index.html          # Main landing page
├── assets/             # Images, logos, and other assets
└── README.md           # This file
```

## Technology Stack

- **Pure HTML/CSS/JS**: No build process required
- **Google Fonts**: Inter, JetBrains Mono, Fira Code
- **Responsive Design**: CSS Grid and Flexbox
- **Animations**: CSS animations and transitions

## Running Locally

### Using Python (Simple)

```bash
cd landing
python3 -m http.server 8000
```

Visit: <http://localhost:8000>

### Using Bun

```bash
cd landing
bunx serve .
```

### Using Node.js

```bash
cd landing
npx serve .
```

### Using Caddy (from root)

See main project README for full Docker Compose setup.

## Sections

1. **Hero Section**: Event branding and call-to-action buttons
2. **About Section**: Information about the Go Talent event
3. **Agenda Section**: Event schedule and timeline
4. **Sponsors Section**: Event sponsors and partners
5. **Contact Section**: Contact information and social media links

## Integration with Platform

When deployed as part of the full GoTalent platform, this landing page is:

- Served via Caddy reverse proxy on port 80/443
- Accessible at the root path `/`
- Integrated with other services (form, badge, scanner) through navigation links

## Customization

To customize the landing page:

1. **Update Event Details**: Edit the content in `index.html`
2. **Change Colors**: Modify CSS custom properties in the `<style>` section
3. **Add Assets**: Place images in the `assets/` directory
4. **Update Links**: Modify navigation links to point to your services

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile

## Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards

## Performance

- No external dependencies (except fonts)
- Minimal CSS and JS
- Optimized animations for performance
- Fast page load times

## License

Part of the GoTalent platform - see main project LICENSE for details.
