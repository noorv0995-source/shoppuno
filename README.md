# Shoppuno Cloudflare Pages Site

This is a static affiliate website for `shoppuno.com`.

Connected to Cloudflare Git builds.

## Upload to Cloudflare Pages

1. Open Cloudflare.
2. Go to **Compute** > **Workers & Pages**.
3. Choose **Create** > **Pages**.
4. Choose **Upload assets** or **Direct Upload**.
5. Upload the contents of this folder, or upload `shoppuno-site.zip`.

## Before going live

- Replace `YOURTAG-20` in `index.html` with your real Amazon Associates tracking ID.
- Update `hello@shoppuno.com` after you set up domain email.
- Add your real product recommendations and affiliate links.
- Do not show Amazon prices unless you use Amazon's official Product Advertising API and follow Amazon Associates rules.

## Files

- `index.html` - main website
- `styles.css` - styling
- `script.js` - mobile menu
- `affiliate-disclosure.html` - affiliate disclosure page
- `privacy.html` - privacy policy
- `terms.html` - terms of use
- Connected to Cloudflare builds.
