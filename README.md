# GrowthX

Marketing site for GrowthX, AI automation for dental clinics. Built with [Astro](https://astro.build).

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the build
```

## Booking link

Every "Book a discovery call" button and the contact form send visitors to Cal.com.
Change the link in `src/config.ts`. The contact form passes the visitor's name, email
and notes to Cal.com so they arrive prefilled.

## Structure

- `src/pages/index.astro`: the page, assembled from sections
- `src/components/`: one file per section (Header, Hero, Services, Contact, Footer, ...)
- `src/styles/global.css`: all styles
- `src/scripts/main.js`: nav, scroll and GSAP animations, contact form
