const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const shopMenu = document.querySelector(".shop-menu");
const shopTrigger = document.querySelector(".shop-trigger");
const shopClose = document.querySelector(".shop-close");
const shopSectionTriggers = document.querySelectorAll(".shop-section-trigger");
const shopCategoryLists = document.querySelectorAll("[data-shop-category-list]");

function setShopSection(section) {
  shopSectionTriggers.forEach((trigger) => {
    const isActive = trigger.getAttribute("data-shop-section") === section;
    trigger.classList.toggle("is-active", isActive);
    trigger.setAttribute("aria-selected", String(isActive));
  });

  shopCategoryLists.forEach((list) => {
    const isActive = list.getAttribute("data-shop-category-list") === section;
    list.classList.toggle("is-active", isActive);
    list.hidden = !isActive;
  });
}

function closeShopMenu() {
  shopMenu?.classList.remove("is-open");
  shopTrigger?.setAttribute("aria-expanded", "false");
}

if (header && menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close" : "Menu";

    if (!isOpen) {
      closeShopMenu();
    }
  });

  header.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
      closeShopMenu();
    });
  });
}

if (shopMenu && shopTrigger) {
  shopTrigger.addEventListener("click", () => {
    const isOpen = shopMenu.classList.toggle("is-open");
    shopTrigger.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      setShopSection("men");
    }
  });

  shopClose?.addEventListener("click", closeShopMenu);

  shopSectionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setShopSection(trigger.getAttribute("data-shop-section"));
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".shop-menu")) return;
    closeShopMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeShopMenu();
    }
  });
}

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach((card) => {
  const trigger = card.querySelector(".category-trigger");

  if (!trigger) return;

  trigger.addEventListener("click", () => {
    const willOpen = !card.classList.contains("options-open");

    categoryCards.forEach((item) => {
      item.classList.remove("options-open");
      item.querySelector(".category-trigger")?.setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      card.classList.add("options-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".category-card")) return;

  categoryCards.forEach((card) => {
    card.classList.remove("options-open");
    card.querySelector(".category-trigger")?.setAttribute("aria-expanded", "false");
  });
});

function setupProductGalleries(root = document) {
  const productGalleries = root.querySelectorAll("[data-product-gallery]");

  productGalleries.forEach((gallery) => {
  const mainImage = gallery.querySelector("[data-gallery-main]");
  const thumbs = gallery.querySelectorAll("[data-gallery-image]");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      if (!mainImage) return;

      const nextImage = thumb.getAttribute("data-gallery-image");
      const nextAlt = thumb.querySelector("img")?.getAttribute("alt") || "";

      if (nextImage && mainImage.tagName === "IMG") {
        mainImage.setAttribute("src", nextImage);
        mainImage.setAttribute("alt", nextAlt);
      }

      thumbs.forEach((item) => item.classList.remove("is-active"));
      thumb.classList.add("is-active");
    });
  });
  });
}

setupProductGalleries();

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function loadProducts() {
  const response = await fetch("data/products.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("Could not load products");
  const data = await response.json();
  return Array.isArray(data.products) ? data.products : [];
}

function productHref(product) {
  return `product.html?slug=${encodeURIComponent(product.slug)}`;
}

function productImageMarkup(image, title) {
  if (!image?.src) {
    return `<div class="product-image-placeholder" aria-hidden="true">${escapeHtml(title || "Shoppuno")}</div>`;
  }

  return `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || title)}">`;
}

function renderCatalogProducts(products) {
  const sections = document.querySelectorAll("[data-category-products]");

  sections.forEach((section) => {
    const category = section.getAttribute("data-category-products");
    const matches = products
      .filter((product) => product.category === category)
      .toReversed();

    if (!matches.length) return;

    section.innerHTML = `
      <div class="catalog-product-grid">
        ${matches.map((product) => {
          const image = product.images?.[0] || {};
          return `
            <a class="catalog-product-card" href="${productHref(product)}">
              ${productImageMarkup(image, product.title)}
              <div>
                <span class="tag">${escapeHtml(product.tag || product.categoryLabel || "Product")}</span>
                <h2>${escapeHtml(product.title)}</h2>
                <p>Open product page</p>
              </div>
            </a>
          `;
        }).join("")}
      </div>
    `;
  });
}

function renderProductDetail(products) {
  const mount = document.querySelector("[data-product-detail]");
  if (!mount) return;

  const slug = new URLSearchParams(window.location.search).get("slug");
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    mount.innerHTML = `
      <section class="catalog-hero">
        <p class="eyebrow">Product not found</p>
        <h1>Product details</h1>
        <p>This product is not available yet.</p>
        <a class="button secondary" href="index.html#categories">Back to categories</a>
      </section>
    `;
    return;
  }

  document.title = `${product.title} | Shoppuno`;
  const images = product.images || [];
  const primary = images[0] || {};
  const sizes = product.sizes || [];
  const categoryLabel = product.categoryLabel || "Product";
  const group = product.group || "Shop";
  const affiliateUrl = product.affiliateUrl || "";
  const shopButton = affiliateUrl
    ? `<a class="button primary" href="${escapeHtml(affiliateUrl)}" rel="nofollow sponsored">Shop this style</a>`
    : `<span class="button primary is-disabled" aria-disabled="true">Shop link coming soon</span>`;

  mount.innerHTML = `
    <section class="section product-showcase">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span>/</span>
        <a href="${escapeHtml(product.category)}.html">${escapeHtml(group)} ${escapeHtml(categoryLabel)}</a>
        <span>/</span>
        <strong>${escapeHtml(product.title)}</strong>
      </nav>
      <div class="product-layout" data-product-gallery>
        <div class="product-thumbs" aria-label="${escapeHtml(product.title)} photos">
          ${images.map((image, index) => `
            <button class="product-thumb ${index === 0 ? "is-active" : ""}" type="button" aria-label="View product photo ${index + 1}" data-gallery-image="${escapeHtml(image.src)}">
              <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || product.title)}">
            </button>
          `).join("")}
        </div>
        <div class="product-main-image">
          ${primary.src
            ? `<img src="${escapeHtml(primary.src)}" alt="${escapeHtml(primary.alt || product.title)}" data-gallery-main>`
            : `<div class="product-image-placeholder product-image-placeholder-large" data-gallery-main>${escapeHtml(product.title)}</div>`}
        </div>
        <article class="product-details-panel">
          <p class="eyebrow">${escapeHtml(product.tag || categoryLabel)}</p>
          <h1>${escapeHtml(product.title)}</h1>
          <p>${escapeHtml(product.description || "Product details are being updated.")}</p>
          <dl class="product-meta">
            <div>
              <dt>Colour</dt>
              <dd>${escapeHtml(product.color || "See product page")}</dd>
            </div>
            <div>
              <dt>Fit</dt>
              <dd>${escapeHtml(product.fit || "See product page")}</dd>
            </div>
          </dl>
          <div class="size-row" aria-label="Available sizes">
            ${sizes.length ? sizes.map((size) => `<span>${escapeHtml(size)}</span>`).join("") : "<span>See seller page</span>"}
          </div>
          <div class="product-actions">
            ${shopButton}
            <a class="product-back-link" href="${escapeHtml(product.category)}.html">Back to ${escapeHtml(group)} ${escapeHtml(categoryLabel)}</a>
          </div>
          <div class="detail-list">
            <details>
              <summary>Editor's Note</summary>
              <p>${escapeHtml(product.editorNote || product.description)}</p>
            </details>
            <details>
              <summary>Product Details & Care Instructions</summary>
              <p>${escapeHtml(product.care || "Check the final seller page for exact product details before buying.")}</p>
            </details>
            <details>
              <summary>Promotions</summary>
              <p>${escapeHtml(product.promotions || "Any discount or promotion will appear on the final shopping page.")}</p>
            </details>
            <details>
              <summary>Shipping & Returns</summary>
              <p>${escapeHtml(product.shipping || "Shipping and return rules depend on the final seller.")}</p>
            </details>
          </div>
        </article>
      </div>
    </section>
  `;

  setupProductGalleries(mount);
}

if (document.querySelector("[data-category-products]") || document.querySelector("[data-product-detail]")) {
  loadProducts()
    .then((products) => {
      renderCatalogProducts(products);
      renderProductDetail(products);
    })
    .catch(() => {
      const mount = document.querySelector("[data-product-detail]");
      if (mount) {
        mount.innerHTML = `
          <section class="catalog-hero">
            <p class="eyebrow">Product unavailable</p>
            <h1>Product details</h1>
            <p>The product data could not be loaded.</p>
          </section>
        `;
      }
    });
}
