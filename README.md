# Lagos Electronics Coupling Company Landing Page

A professional landing page for a local electronics coupling company based in Lagos, Nigeria. The page showcases the company's services, products, and contact information to attract potential customers and establish credibility in the local electronics market.

## Target Audience

This landing page is designed for B2B clients in the Nigerian electronics industry, including:
- Electronics manufacturers and distributors
- Industrial equipment suppliers
- Commercial electronics buyers
- Engineering and procurement teams

## Features

- Modern, professional design suitable for B2B context
- Responsive layout optimized for all devices
- Fast loading with optimized assets
- SEO-friendly structure with proper meta tags
- Accessible design following WCAG guidelines
- Scroll-triggered reveal animations
- Social proof elements with testimonials
- Mobile-first responsive design

## Technology Stack

- HTML5 with semantic markup
- CSS3 with modern features
- Vanilla JavaScript for interactions
- PostCSS for CSS optimization
- Prettier for code formatting
- Live Server for development

## Project Structure

```
.
├── src/
│   ├── index.html              # Main HTML file
│   ├── styles/
│   │   ├── base.css            # Foundation styles
│   │   ├── components.css      # Component styles
│   │   └── animations.css      # Animation styles
│   └── scripts/
│       ├── main.js             # Core functionality
│       ├── animations.js       # Scroll triggers
│       ├── interactions.js     # Button interactions
│       ├── form-validation.js  # Form handling
│       └── performance.js      # Performance optimizations
├── dist/                       # Production build output
├── package.json
├── .prettierrc.json
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Development

### Starting the Development Server

Run the development server with live reload:

```bash
npm run dev
```

or

```bash
npm start
```

The landing page will open automatically at `http://localhost:3000`

### Code Formatting

Format all code files using Prettier:

```bash
npm run format
```

Check if code is properly formatted:

```bash
npm run format:check
```

## Build Process

### Production Build

Build the project for production deployment:

```bash
npm run build
```

This command will:
1. Process and minify CSS files with PostCSS
2. Copy HTML files to the dist directory
3. Copy JavaScript files to the dist directory

The production-ready files will be in the `dist/` directory.

### Individual Build Commands

You can also run individual build steps:

```bash
npm run build:css    # Build CSS only
npm run build:html   # Build HTML only
npm run build:js     # Build JS only
```

## Deployment

The `dist/` directory contains production-ready files that can be deployed to any static hosting service:

### Recommended Hosting Options

- **Vercel**: Deploy with zero configuration
- **Netlify**: Continuous deployment from Git
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable cloud hosting
- **Azure Static Web Apps**: Microsoft cloud hosting

### Deployment Steps

1. Build the project: `npm run build`
2. Upload the contents of the `dist/` directory to your hosting provider
3. Configure your domain (if applicable)
4. Set up SSL/HTTPS (most providers do this automatically)

## Design Patterns

This landing page implements the following design patterns:

- **Split Screen Hero**: Content and visual/form divided for clear messaging
- **Scroll-Triggered Reveals**: Elements fade in as users scroll
- **Minimalist Typography**: Clean, professional appearance with ample whitespace
- **Social Proof Heavy**: Testimonials and trust indicators throughout
- **Morphing Button Interactions**: Premium feel on CTAs with state feedback
- **Skeleton Loading**: Placeholder states for async content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Performance Targets

- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Total page weight: < 3MB

## Accessibility

This landing page follows WCAG 2.1 Level AA guidelines:

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Reduced motion support

## Contributing

When contributing to this project:

1. Follow the existing code style
2. Run `npm run format` before committing
3. Test on multiple devices and browsers
4. Ensure accessibility standards are maintained
5. Keep performance metrics within targets

## License

MIT

## Contact

For questions or support regarding this landing page, please contact the development team.
