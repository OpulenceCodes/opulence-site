# Opulence Media Agency website

Static site for Vercel. No build step: Vercel serves the files as they are, plus one serverless function for the project form.

## What is in here

- `index.html` is the home page (landing page with every section).
- `case-studies/` has the three case studies.
- `journal/` has the three articles.
- `privacy.html` and `terms.html` are the legal pages.
- `assets/site.css` and `assets/site.js` hold the shared styles and interactions.
- `assets/img/` holds the images. Testimonial videos play from YouTube.
- `api/contact.js` receives the Start a project form and emails it to you.
- `vercel.json` turns on clean URLs (for example `/terms`, not `/terms.html`).
- `sitemap.xml` and `robots.txt` are for search engines.

## Deploy

The Vercel project is connected to this repository, so every push to `main` deploys automatically.

## Three things to switch on

1. **Form email.** Create a free account at resend.com, create an API key, and add it in Vercel under Settings, Environment Variables as `RESEND_API_KEY`. Redeploy. Until the key is set, the form shows a message asking the visitor to email you instead.
   - Optional `CONTACT_TO`: where enquiries go. Defaults to david@opulencemediaagency.com.
   - Optional `CONTACT_FROM`: sender address on a domain you have verified in Resend, for example `Opulence website <hello@opulencemediaagency.com>`. Without it, Resend's test sender is used, which only delivers to the email address on your Resend account. Verify your domain in Resend before launch.
2. **Vercel Web Analytics.** In the Vercel project open Analytics and click Enable. The script is already on every page.
3. **Google Analytics.** Measurement ID `G-G9040NR5YC` is set in `assets/site.js` (`GA_ID`, third line).

## If your domain is not opulencemediaagency.com

Search and replace `https://opulencemediaagency.com` across the HTML files, `sitemap.xml` and `robots.txt`.

## Adding things later

- **Testimonial video:** upload it to YouTube as Public or Unlisted, then copy one `op-vid` block in the Hear it from clients section of `index.html` and change the video ID (it appears three times in the block), the quote and the name.
- **AI video playback:** the three AI video tiles are still images. Each can become a player once the videos are on YouTube or sent as mp4 files.
- **New article:** copy a file in `journal/`, change the text and the tags in the head, add a card to the Journal section of `index.html` and a line to `sitemap.xml`.
