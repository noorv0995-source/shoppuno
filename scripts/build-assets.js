const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "public");

const topLevelFiles = [
  "affiliate-disclosure.html",
  "CMS-SETUP.md",
  "index.html",
  "men-accessories.html",
  "men-activewear.html",
  "men-cardigans.html",
  "men-coats.html",
  "men-hoodie.html",
  "men-jackets.html",
  "men-jeans.html",
  "men-knitwear.html",
  "men-shirts.html",
  "men-shoes.html",
  "men-t-shirts.html",
  "privacy.html",
  "product-dark-wide-leg-denim-jeans.html",
  "product.html",
  "README.md",
  "script.js",
  "styles.css",
  "terms.html",
  "wide-calf-boot-guide.html",
  "woman-activewear.html",
  "woman-accessories.html",
  "woman-bags.html",
  "woman-cardigans.html",
  "woman-coats.html",
  "woman-dresses.html",
  "woman-hoodie.html",
  "woman-jackets.html",
  "woman-jeans.html",
  "woman-knitwear.html",
  "woman-shirts.html",
  "woman-shoes.html",
  "woman-skirts.html",
  "woman-t-shirts.html"
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of topLevelFiles) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}

for (const directory of ["admin", "assets", "data"]) {
  fs.cpSync(path.join(root, directory), path.join(out, directory), { recursive: true });
}

console.log(`Built static assets in ${out}`);
