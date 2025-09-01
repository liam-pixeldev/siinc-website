# Production Deployment Checklist for Siinc Website

## ✅ SEO & Metadata
- [x] Meta titles and descriptions for all pages
- [x] Open Graph tags configured
- [x] Twitter Card tags configured
- [x] Structured data (JSON-LD) for organization and software
- [x] robots.txt file created
- [x] sitemap.xml file created
- [x] Canonical URLs set
- [ ] Google Site Verification code added (update in layout.tsx)
- [ ] Bing Site Verification code added (update in layout.tsx)

## ✅ Performance & Assets
- [x] Static export configured (`output: 'export'`)
- [ ] Favicon files created and placed in /public:
  - [ ] favicon.ico
  - [ ] favicon-16x16.png
  - [ ] favicon-32x32.png
  - [ ] apple-touch-icon.png (180x180)
  - [ ] android-chrome-192x192.png
  - [ ] android-chrome-512x512.png
- [ ] Open Graph image created (1200x630px) - og-image.png
- [x] Site manifest (PWA) configured

## ✅ Security
- [x] Security headers configured (_headers file for Netlify/Vercel)
- [x] Content Security Policy defined
- [x] HTTPS enforced (HSTS header)
- [x] X-Frame-Options set to DENY
- [x] Environment variables properly configured (.env.example provided)

## ✅ Functionality
- [x] Contact form configured with proper email settings
- [x] All internal links working correctly
- [x] External links opening in app.siinc.io
- [x] 404 page exists and styled
- [x] Privacy Policy updated and complete
- [ ] Terms of Service updated and complete

## ✅ Analytics & Monitoring
- [x] Google Analytics 4 configured (G-MGZZ2FMSBX)
- [ ] Google Tag Manager configured (optional)
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Uptime monitoring configured

## ✅ Deployment Configuration
- [x] vercel.json configured with redirects and headers
- [x] Build command: `pnpm build`
- [x] Output directory: `out`
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] CDN configured (Cloudflare/Vercel)

## ✅ Testing
- [ ] All pages load correctly
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed
- [ ] Contact form tested with real email
- [ ] Social media preview cards tested
- [ ] Lighthouse audit score > 90
- [ ] Accessibility audit passed

## ✅ Legal & Compliance
- [x] Privacy Policy compliant with GDPR/CCPA
- [ ] Cookie consent banner (if using analytics)
- [x] Terms of Service link in footer
- [x] Copyright notice current

## ✅ Environment Variables Needed

```env
POSTMARK_SERVER_TOKEN=<your-token>
NEXT_PUBLIC_GA_TRACKING_ID=<optional>
NEXT_PUBLIC_GTM_ID=<optional>
NEXT_PUBLIC_SITE_URL=https://siinc.io
NEXT_PUBLIC_APP_URL=https://app.siinc.io
```

## ✅ Pre-Launch Tasks
1. [ ] Create all favicon files
2. [ ] Create og-image.png (1200x630)
3. [ ] Set up Postmark account and verify sender email (website@siinc.io)
4. [ ] Configure DNS records
5. [ ] Set up Google Analytics
6. [ ] Update verification codes in metadata
7. [ ] Test contact form with production email
8. [ ] Review and update Terms of Service

## ✅ Post-Launch Tasks
1. [ ] Submit sitemap to Google Search Console
2. [ ] Submit sitemap to Bing Webmaster Tools
3. [ ] Monitor Core Web Vitals
4. [ ] Set up uptime monitoring
5. [ ] Configure automated backups
6. [ ] Monitor error logs
7. [ ] Set up email alerts for form submissions

## 🚀 Deployment Commands

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Test production build locally
pnpm start

# Deploy to Vercel
vercel --prod
```

## 📝 Notes

- The site uses static export, so API routes won't work in production
- Contact form requires external email service (Postmark configured)
- Redirects configured for /login and /signup to app.siinc.io
- All prices displayed in USD
- Offices listed: Sydney, New York, London, Singapore

## 🔗 Important URLs

- Production: https://siinc.io
- App: https://app.siinc.io
- Support Email: support@siinc.io
- Privacy Email: privacy@siinc.io
- Contact Form Sends To: Info@nexsysit.com.au
- Contact Form Sends From: website@siinc.io