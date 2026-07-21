import os, re

base = r'c:\Users\Rubab Hayat Khan\Downloads\Haute Files\fightgear-site - Copy - Copy (2)'

def fix_file(path, fixes):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    original = content
    for old, new in fixes:
        content = content.replace(old, new)
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {path.replace(base+os.sep,"")}')
        return True
    return False

# ── 1. index.html — fix broken <span <svg> tags and button text spacing ──────
idx = os.path.join(base, 'index.html')
with open(idx, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Fix broken <span <svg> tags (leftover from bad icon replacement)
content = re.sub(r'<span\s+<svg', '<svg', content)
# Fix orphaned </svg></span> if any
# Fix " View Products" and " Send Inquiry" (leading space from icon removal)
content = re.sub(r'>\s{2,}View Products', '> View Products', content)
content = re.sub(r'>\s{2,}Send Inquiry', '> Send Inquiry', content)
content = re.sub(r'>\s{2,}Contact Us', '> Contact Us', content)
# Standardize button padding — py-4 is the standard CTA size
# Hero buttons already have px-8 py-4 — good
# Remove double preconnect for fonts
content = content.replace(
    '''    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet" />''',
    '''    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet" />'''
)
# Remove duplicate preconnect pair
content = content.replace(
    '    <link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
    '    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
)

with open(idx, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed: index.html')

# ── 2. contact/index.html — add eyebrow label before H1, standardize ─────────
contact = os.path.join(base, 'contact', 'index.html')
fix_file(contact, [
    # Add eyebrow label before H1 (consistent with other pages)
    ('<h1 class="font-display-md text-display-md uppercase leading-none mb-4">CONTACT US</h1>',
     '<p class="font-label-bold text-accent-red uppercase mb-4 tracking-widest">Get In Touch</p>\n                <h1 class="font-display-md text-display-md uppercase leading-none mb-4">CONTACT US</h1>'),
    # Fix &mdash; to proper dash
    ('reach out via WhatsApp, email, or the form below &mdash; we typically',
     'reach out via WhatsApp, email, or the form below — we typically'),
    # Standardize submit button padding to py-4 (was py-5)
    ('class="w-full bg-accent-red text-on-primary py-5 font-label-bold uppercase flex items-center justify-center gap-2 hover:bg-primary transition-colors"',
     'class="w-full bg-accent-red text-on-primary py-4 font-label-bold uppercase flex items-center justify-center gap-2 hover:bg-primary transition-colors"'),
])

# ── 3. product/index.html — fix spacing inconsistency, trust badge SVGs ──────
product = os.path.join(base, 'product', 'index.html')
fix_file(product, [
    # Fix section padding consistency
    ('class="px-5 md:px-[64px] py-[60px]"\n                style="background:#f3f3f3;border-top:1px solid #e5e5e5"',
     'class="px-5 md:px-[64px] py-[80px]"\n                style="background:#f3f3f3;border-top:1px solid #e5e5e5"'),
    ('class="bg-primary border-t-4 border-accent-red px-5 md:px-[64px] py-[60px]"',
     'class="bg-primary border-t-4 border-accent-red px-5 md:px-[64px] py-[80px]"'),
    # Standardize CTA button padding
    ('class="inline-flex items-center justify-center gap-2 bg-accent-red text-on-primary px-10 py-5 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"',
     'class="inline-flex items-center justify-center gap-2 bg-accent-red text-on-primary px-10 py-4 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"'),
    ('class="inline-flex items-center justify-center gap-2 border-2 border-on-primary text-on-primary px-8 py-4 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"',
     'class="inline-flex items-center justify-center gap-2 border-2 border-on-primary text-on-primary px-8 py-4 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"'),
])

# ── 4. about/index.html — standardize button padding ─────────────────────────
about = os.path.join(base, 'about', 'index.html')
fix_file(about, [
    ('class="inline-flex items-center gap-2 bg-accent-red text-on-primary px-10 py-5 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"',
     'class="inline-flex items-center gap-2 bg-accent-red text-on-primary px-10 py-4 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"'),
])

# ── 5. products/index.html — standardize CTA button padding ──────────────────
products = os.path.join(base, 'products', 'index.html')
fix_file(products, [
    ('class="shrink-0 inline-flex items-center gap-2 bg-accent-red text-on-primary px-10 py-5 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"',
     'class="shrink-0 inline-flex items-center gap-2 bg-accent-red text-on-primary px-10 py-4 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors"'),
])

# ── 6. inquiry/index.html — fix button padding, add eyebrow to success state ──
inquiry = os.path.join(base, 'inquiry', 'index.html')
fix_file(inquiry, [
    # Success state buttons
    ('class="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 font-label-bold uppercase hover:bg-accent-red transition-colors"',
     'class="inline-flex items-center gap-2 bg-accent-red text-on-primary px-8 py-4 font-label-bold uppercase hover:bg-primary transition-colors"'),
    # Submit button
    ('class="w-full bg-accent-red text-on-primary py-6 font-label-bold uppercase flex items-center justify-center gap-3 hover:bg-primary transition-colors tracking-widest"',
     'class="w-full bg-accent-red text-on-primary py-4 font-label-bold uppercase flex items-center justify-center gap-3 hover:bg-primary transition-colors tracking-widest"'),
])

# ── 7. All pages — remove Clarity placeholder + GSC placeholder comments ──────
placeholder_fixes = [
    ('(window, document, "clarity", "script", "REPLACE_WITH_CLARITY_ID");', ''),
    ('<!-- Microsoft Clarity — replace REPLACE_WITH_CLARITY_ID with your project ID -->\n  <script type="text/javascript">\n      (function (c, l, a, r, i, t, y) {\n        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };\n        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;\n        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);\n      })(window, document, "clarity", "script", "REPLACE_WITH_CLARITY_ID");\n  </script>', ''),
]

pages = ['about/index.html', 'contact/index.html', 'inquiry/index.html',
         'product/index.html', 'products/index.html', 'shipping/index.html',
         'terms/index.html', 'privacy-policy/index.html']

for page in pages:
    fpath = os.path.join(base, page.replace('/', os.sep))
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
            c = f.read()
        original = c
        for old, new in placeholder_fixes:
            c = c.replace(old, new)
        # Also standardize section spacing for consistency
        c = c.replace('py-[60px] max-w-[1440px]', 'py-[80px] max-w-[1440px]')
        if c != original:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f'Cleaned: {page}')

print('\nAll UI polish fixes applied.')
