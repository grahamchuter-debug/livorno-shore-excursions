# La Spezia Shore Excursions

**The Gateway to Tuscany & Cinque Terre** — the definitive Tuscany cruise planning guide for passengers arriving into La Spezia.

Domain: [laspeziashoreexcursions.com](https://laspeziashoreexcursions.com)

## Development

```bash
npm install
npm run optimize:images   # Generate AVIF/WebP variants in public/images/opt/
npm run dev
npm run build
npm run check-links
npm run seo-qa
```

## Deploy

Static export to Cloudflare Pages:

```bash
npm run pages:deploy
```

## Site structure

- **Homepage** — Gateway hero, Choose Your Tuscany, Wow Collection, Signature Experience, Editor's Collection
- **Planning guides** — Florence, Cinque Terre, Pisa, Portovenere, Lucca, food & passenger-type advice
- **Shore excursions** — Florence, Cinque Terre, Pisa, family and food tours
- **Comparison pages** — Florence vs Cinque Terre, Pisa worth visiting, small group vs coach, best for families/couples
- **Tuscany Cruise Planner** — Interactive itinerary builder with PDF export
- **Ship schedules** — La Spezia port schedule by year and month
