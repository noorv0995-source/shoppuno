# Shoppuno CMS Setup

The editor is prepared at `/admin/` using Decap CMS.

Before login and publishing will work:

1. Put this site in a GitHub repository.
2. The CMS is configured for `noorv0995-source/shoppuno` in `admin/config.yml`.
3. Connect the repository to Cloudflare Pages.
4. Configure Decap/GitHub authentication for the `/admin/` editor.

Products are stored in `data/products.json`. Category pages and `product.html?slug=...` read that file in the browser.
