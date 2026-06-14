// ============================================================
// PRODUCTS-ENGINE.JS — Haute Fighting Gears
// Loads from products/products.json
// Works from ANY page depth (root, /pages/, etc.)
// Requires a local server (Live Server / localhost) — NOT file://
// ============================================================

// ── Note about file:// protocol ──────────────────────────────
// Products will attempt to fetch from JSON, and fall back to
// inline data if the fetch fails (e.g. file:// or server issues).
if (window.location.protocol === 'file:') {
    console.info(
        '[products-engine] ℹ️  Running on file://. JSON fetch will fail, but\n' +
        'products will still load from inline fallback data.\n' +
        'For best results, use VS Code Live Server or run: npx serve .'
    );
}

// ── Category display name map — clean ecommerce labels ───────
// Defined early so loadProducts() can reference it
const _categoryDisplayNames = {
    'street-fashion': 'Streetwear',
    'gym-fitness': 'Gym Wear',
    'mma': 'MMA',
    'boxing': 'Boxing',
    'sports': 'Sports Gear'
};

function _getCategoryLabel(cat) {
    return _categoryDisplayNames[cat.id] || cat.name;
}

// ── Resolve relative path prefix from current page to site root ──
function _getRelativeRootPrefix() {
    const path = window.location.pathname;
    const cleaned = path.replace(/^\//, '').replace(/\/$/, '');
    const parts = cleaned.split('/').filter(Boolean);
    const depth = parts.length > 0 && parts[parts.length - 1].includes('.') ? parts.length - 1 : parts.length;
    return depth === 0 ? './' : '../'.repeat(depth);
}

// ── Resolve correct path to products.json from any page ──────
function _getJsonPath() {
    // Try absolute path first (works on a proper server).
    // _fetchProductData() falls back to relative path on failure.
    return '/products/products.json';
}

// ── Relative fallback path (for file:// or sub-path deployments) ──
function _getJsonPathRelative() {
    const root = _getRelativeRootPrefix();
    return root + 'products/products.json';
}

// ── Resolve correct path prefix for product page links ───────
function _getPagePrefix() {
    return '/pages/';
}

// ── Resolve correct path prefix for root-level links ─────────
function _getRootPrefix() {
    return '/';
}

// Cache so we only fetch once per page load
let _productsCache = null;
let _categoriesCache = null;
let _rawDataCache = null;

// ── Inline product data — used as fallback when fetch fails ──
// This guarantees products always show regardless of server setup.
const _INLINE_PRODUCT_DATA = { "categories": [{ "id": "boxing", "name": "Boxing", "products": [{ "id": "boxing-gloves", "name": "Boxing Gloves", "category": "Boxing", "image": "../Product/Boxing Gloves/1.webp", "images": ["../Product/Boxing Gloves/1.webp", "../Product/Boxing Gloves/2.webp", "../Product/Boxing Gloves/3.webp"], "description": "Professional-grade boxing gloves built for training, sparring, and competition. Choose your material and weight for the perfect fit.", "variants": [{ "id": "cowhide", "label": "Cowhide Leather" }, { "id": "cowhide-enhanced", "label": "Cowhide Enhanced Padding" }, { "id": "pu", "label": "PU Synthetic" }, { "id": "pu-molded", "label": "PU Hand Molded" }], "specs": { "Weight (oz)": ["8oz", "10oz", "12oz", "14oz", "16oz"], "Closure": ["Velcro", "Lace-Up"], "Color": ["Black", "Red", "Blue", "White", "Custom"] } }, { "id": "boxing-head-guard", "name": "Boxing Head Guard", "category": "Boxing", "image": "../Product/HeadGuard/1.webp", "images": ["../Product/HeadGuard/1.webp", "../Product/HeadGuard/2.webp", "../Product/HeadGuard/3.webp"], "description": "Protective headgear designed for sparring with maximum safety, visibility, and comfort. Made from cowhide leather with high-density foam padding.", "variants": [{ "id": "open-face", "label": "Open Face" }, { "id": "nose-bar", "label": "Nose Bar" }], "specs": { "Size": ["S", "M", "L", "XL"], "Color": ["Black", "Red", "Blue", "White", "Custom"] } }] }, { "id": "mma", "name": "MMA", "products": [{ "id": "mma-grappling-gloves", "name": "MMA Grappling Gloves", "category": "MMA", "image": "../Product/MMA Grappling Glove/1.webp", "images": ["../Product/MMA Grappling Glove/1.webp", "../Product/MMA Grappling Glove/2.webp"], "description": "Open-finger gloves designed for grappling and striking, offering flexibility and protection. Available in PU Sparring or Cowhide Competition grade.", "variants": [{ "id": "pu-sparring", "label": "PU Sparring" }, { "id": "cowhide-competition", "label": "Cowhide Competition" }], "specs": { "Size": ["S", "M", "L", "XL"], "Finger Style": ["Open Finger", "Pre-Curved"], "Color": ["Black", "Red", "Blue", "White", "Custom"] } }] }, { "id": "gym-fitness", "name": "Gym & Fitness", "products": [{ "id": "inner-gloves", "name": "Hand Wraps", "category": "Gym & Fitness", "image": "../Product/hand wrap gloves/1.webp", "images": ["../Product/hand wrap gloves/1.webp", "../Product/hand wrap gloves/2.webp"], "description": "Durable hand wraps providing wrist stability and knuckle protection for training and fights. Available in Cotton/Nylon, Gel, or Quick Wrap styles.", "variants": [{ "id": "cotton", "label": "Cotton / Nylon" }, { "id": "gel", "label": "Gel Wrap" }, { "id": "quick-wrap", "label": "Quick Wrap" }], "specs": { "Length": ["1.5m", "3m", "4m", "4.5m"], "Color": ["Black", "Red", "Blue", "White", "Pink", "Custom"] } }] }] };

// ── Core fetch — shared by loadProducts and loadCategories ───
async function _fetchProductData() {
    if (_rawDataCache) return _rawDataCache;

    // Try absolute path first (works on any proper server / GitHub Pages root)
    const urlAbsolute = _getJsonPath();
    // Try relative path second (works when site is in a subdirectory)
    const urlRelative = _getJsonPathRelative();

    const urlsToTry = [urlAbsolute];
    // Only add relative if it differs from absolute
    if (urlRelative !== urlAbsolute) urlsToTry.push(urlRelative);

    for (const url of urlsToTry) {
        try {
            console.log('[products-engine] Fetching:', url);
            const res = await fetch(url);
            if (!res.ok) {
                console.warn('[products-engine] HTTP ' + res.status + ' for ' + url);
                continue;
            }
            const data = await res.json();
            console.log('[products-engine] ✅ Loaded from:', url);
            _rawDataCache = data;
            return _rawDataCache;
        } catch (e) {
            console.warn('[products-engine] Failed to fetch ' + url + ':', e.message);
        }
    }

    // All fetches failed — use inline fallback data so products always show
    console.warn('[products-engine] ⚠️  All fetch attempts failed. Using inline fallback data.');
    console.warn('[products-engine] To fix: open this site with VS Code Live Server or run: npx serve .');
    _rawDataCache = _INLINE_PRODUCT_DATA;
    return _rawDataCache;
}

// ── Load all products (flattened array) ───────────────────────
async function loadProducts() {
    if (_productsCache) return _productsCache;
    try {
        const data = await _fetchProductData();
        _productsCache = [];
        (data.categories || []).forEach(cat => {
            (cat.products || []).forEach(p => {
                _productsCache.push({
                    ...p,
                    categoryId: cat.id,
                    categoryName: _categoryDisplayNames[cat.id] || cat.name
                });
            });
        });
        console.log('[products-engine] Loaded ' + _productsCache.length + ' products.');
        return _productsCache;
    } catch (e) {
        console.error('[products-engine] Failed to load products:', e.message);
        // Do NOT cache on error — allow retry
        _rawDataCache = null;
        return [];
    }
}

// ── Load ONLY the 4 real sample products (have local images + specs) ──
// Used by Samples page and Featured sections — NOT by Bulk/Custom dropdowns
const _REAL_PRODUCT_IDS = ['boxing-gloves', 'boxing-head-guard', 'inner-gloves', 'mma-grappling-gloves'];

async function loadSampleProducts() {
    const all = await loadProducts();
    return all.filter(p => _REAL_PRODUCT_IDS.includes(p.id));
}

// ── Get tiered price for a product based on variant + quantity ─
// variant: variant object from product.variants[], or null for legacy pricing
// qty: number
function getPrice(product, qty, variant) {
    qty = parseInt(qty) || 1;
    // Use variant pricing if provided
    const pricing = (variant && variant.pricing) ? variant.pricing
        : (product && product.pricing) ? product.pricing
            : null;
    if (!pricing) return null;
    if (qty >= 50) return pricing['50'];
    if (qty >= 25) return pricing['25'];
    return pricing['1'];
}

function getStartingPrice(product) {
    if (!product) return null;
    // Use first variant's pricing if variants exist
    if (product.variants && product.variants.length > 0) {
        return product.variants[0].pricing['1'];
    }
    if (product.pricing) return product.pricing['1'];
    return null;
}

function formatPrice(price) {
    if (price == null) return '';
    return '$' + parseFloat(price).toFixed(2);
}

// ── Load categories ───────────────────────────────────────────
async function loadCategories() {
    if (_categoriesCache) return _categoriesCache;
    try {
        const data = await _fetchProductData();
        _categoriesCache = data.categories;
        return _categoriesCache;
    } catch (e) {
        console.error('[products-engine] Failed to load categories:', e.message);
        return [];
    }
}

// ── Get single product by id ──────────────────────────────────
async function getProductById(id) {
    const products = await loadProducts();
    return products.find(p => p.id === id) || null;
}

// ── Resolve image URL — always returns a valid image ─────────
function _resolveImage(p, index) {
    index = index || 0;

    // If product has a local images array, use it
    if (p.images && p.images.length > index) {
        return _toAbsoluteProductPath(p.images[index]);
    }

    // If product has a single local image path (starts with ../ or ./)
    if (p.image && (p.image.startsWith('../') || p.image.startsWith('./'))) {
        return _toAbsoluteProductPath(p.image);
    }

    // Use the product's own image if it's a real external URL
    if (
        p.image &&
        p.image.startsWith('http') &&
        !p.image.includes('via.placeholder.com') &&
        !p.image.includes('data:image/svg')
    ) {
        return p.image;
    }

    // Category-level fallback images (Unsplash)
    const categoryImages = {
        'street-fashion': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop&auto=format',
        'gym-fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'mma': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=400&fit=crop&auto=format',
        'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=400&fit=crop&auto=format',
        'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop&auto=format'
    };

    return categoryImages[p.categoryId] ||
        'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%231b1b1b%22%2F%3E%3C%2Fsvg%3E';
}

// Convert a relative product image path (../Product/...) to correct URL
function _toAbsoluteProductPath(relativePath) {
    // Strip leading ../ or ./
    const clean = relativePath.replace(/^(\.\.\/|\.\/)+/, '');

    // Always use absolute path — works from any folder depth
    return '/' + clean;
}

// ── Build product dropdown options HTML ───────────────────────
async function buildProductOptions(selectedId) {
    const categories = await loadCategories();
    if (!categories || categories.length === 0) {
        return '<option value="">— No products found —</option>';
    }
    let html = '<option value="">— Select a product —</option>';
    categories.forEach(cat => {
        html += `<optgroup label="${cat.name}">`;
        cat.products.forEach(p => {
            if (!p.id || !p.name) return; // skip malformed entries
            const sel = p.id === selectedId ? ' selected' : '';
            html += `<option value="${p.id}"${sel}>${p.name}</option>`;
        });
        html += '</optgroup>';
    });
    return html;
}

// ── Render product grid ───────────────────────────────────────
// filter: category id string, or 'all'
async function renderProductGrid(container, filter) {
    filter = filter || 'all';
    const products = await loadProducts();
    const list = filter === 'all' ? products : products.filter(p => p.categoryId === filter);

    if (list.length === 0) {
        container.innerHTML = '<div class="col-span-4 text-center py-20 font-label-bold uppercase opacity-40">No products found</div>';
        return;
    }

    const pagePrefix = _getPagePrefix();
    const rootPrefix = _getRootPrefix();

    container.innerHTML = list.map(p => {
        const img = _resolveImage(p, 0);

        const target = `/pages/product.html?id=${encodeURIComponent(p.id)}`;
        return `
        <a href="${target}" class="group border border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col" data-reveal style="text-decoration:none;color:inherit;display:flex">
            <div style="width:100%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;aspect-ratio:1/1;border-bottom:1px solid #eee">
                <img
                    src="${img}"
                    alt="${p.name}"
                    loading="lazy"
                    class="transition-transform duration-500 group-hover:scale-105"
                    style="display:block;width:100%;height:auto;object-fit:contain;padding:8px"
                    onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%23eeeeee%22%2F%3E%3C%2Fsvg%3E'"
                />
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-headline-md text-headline-md uppercase mb-1 leading-tight" style="font-size:17px">${p.name}</h3>
                <p class="font-body-md text-neutral-gray mb-4" style="font-size:12px;font-weight:400;letter-spacing:0.04em">${p.categoryName || p.category || ''}</p>
                <div class="mt-auto">
                    <span class="w-full bg-accent-red text-on-primary py-3 font-label-bold uppercase flex items-center justify-center gap-2 text-center text-sm" style="pointer-events:none">
                        <span class="material-symbols-outlined text-[16px]">send</span> Send Inquiry
                    </span>
                </div>
            </div>
        </a>`;
    }).join('');

    if (typeof initScrollReveal === 'function') initScrollReveal();
}

// ── Build category filter buttons ─────────────────────────────
async function buildCategoryFilters(container, activeId, onFilter) {
    const categories = await loadCategories();
    const allActive = (!activeId || activeId === 'all') ? 'bg-primary text-on-primary' : '';
    let html = `<button data-filter="all" class="filter-btn ${allActive} px-5 py-2 font-label-bold uppercase border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">All Products</button>`;
    categories.forEach(cat => {
        const active = cat.id === activeId ? 'bg-primary text-on-primary' : '';
        html += `<button data-filter="${cat.id}" class="filter-btn ${active} px-5 py-2 font-label-bold uppercase border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">${_getCategoryLabel(cat)}</button>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
            btn.classList.add('bg-primary', 'text-on-primary');
            if (typeof onFilter === 'function') onFilter(btn.dataset.filter);
        });
    });
}


