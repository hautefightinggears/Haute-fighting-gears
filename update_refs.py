#!/usr/bin/env python3
"""Update all image references to new SEO filenames."""
import os, re

BASE = r"c:\Users\Rubab Hayat Khan\Downloads\Haute Files\fightgear-site - Copy - Copy (2)"

# old path -> new path (forward slashes, no leading slash)
RENAMES = {
    # assets/images
    "assets/images/home-thumb.webp":   "assets/images/haute-fighting-gears-custom-boxing-gloves-manufacturer.webp",
    "assets/images/bulk-thumb.webp":   "assets/images/haute-fighting-gears-bulk-order-oem-fight-gear.webp",
    "assets/images/sample-thumb.webp": "assets/images/haute-fighting-gears-fight-gear-product-catalogue.webp",
    "assets/images/factory1.webp":     "assets/images/haute-fighting-gears-manufacturing-facility-sialkot.webp",
    "assets/images/factory2.webp":     "assets/images/haute-fighting-gears-craftsmen-production-sialkot.webp",
    # assets/products - folder renames + file renames
    "assets/products/Bag Mitt/1.webp": "assets/products/bag-mitt/bag-mitt-custom-boxing-training.webp",
    "assets/products/Bag Mitt/2.webp": "assets/products/bag-mitt/bag-mitt-leather-heavy-bag-gloves.webp",
    "assets/products/Bag Mitt/3.webp": "assets/products/bag-mitt/bag-mitt-oem-private-label.webp",
    "assets/products/Bag Mitt/4.webp": "assets/products/bag-mitt/bag-mitt-wrist-support-padding.webp",
    "assets/products/Bag Mitt/5.webp": "assets/products/bag-mitt/bag-mitt-wholesale-manufacturer-sialkot.webp",
    "assets/products/belly-pad/1.webp": "assets/products/belly-pad/belly-pad-custom-boxing-muay-thai.webp",
    "assets/products/belly-pad/2.webp": "assets/products/belly-pad/belly-pad-foam-padding-trainer.webp",
    "assets/products/belly-pad/3.webp": "assets/products/belly-pad/belly-pad-oem-manufacturer-sialkot.webp",
    "assets/products/bjj-belt/1.webp": "assets/products/bjj-belt/bjj-belt-custom-brazilian-jiu-jitsu.webp",
    "assets/products/bjj-belt/2.webp": "assets/products/bjj-belt/bjj-belt-all-ranks-custom-embroidery.webp",
    "assets/products/bjj-belt/3.webp": "assets/products/bjj-belt/bjj-belt-ibjjf-standard-wholesale.webp",
    "assets/products/boxing gloves keychain/1.webp": "assets/products/boxing-gloves-keychain/boxing-gloves-keychain-custom-mini.webp",
    "assets/products/boxing gloves keychain/2.webp": "assets/products/boxing-gloves-keychain/boxing-gloves-keychain-pu-leather.webp",
    "assets/products/boxing gloves keychain/3.webp": "assets/products/boxing-gloves-keychain/boxing-gloves-keychain-wholesale-branded.webp",
    "assets/products/boxing shoe/1.webp": "assets/products/boxing-shoe/boxing-shoes-custom-professional.webp",
    "assets/products/boxing shoe/2.webp": "assets/products/boxing-shoe/boxing-shoes-high-top-training.webp",
    "assets/products/boxing shoe/3.webp": "assets/products/boxing-shoe/boxing-shoes-low-top-lightweight.webp",
    "assets/products/boxing shoe/4.webp": "assets/products/boxing-shoe/boxing-shoes-sole-grip-detail.webp",
    "assets/products/boxing shoe/5.webp": "assets/products/boxing-shoe/boxing-shoes-oem-manufacturer.webp",
    "assets/products/boxing shoe/6.webp": "assets/products/boxing-shoe/boxing-shoes-private-label-sialkot.webp",
    "assets/products/boxing-gloves/1.webp": "assets/products/boxing-gloves/custom-boxing-gloves-cowhide-leather.webp",
    "assets/products/boxing-gloves/2.webp": "assets/products/boxing-gloves/custom-boxing-gloves-pu-synthetic.webp",
    "assets/products/boxing-gloves/3.webp": "assets/products/boxing-gloves/custom-boxing-gloves-oem-manufacturer-sialkot.webp",
    "assets/products/boxing-ring/1.webp": "assets/products/boxing-ring/professional-boxing-ring-custom-manufacturer.webp",
    "assets/products/boxing-ring/2.webp": "assets/products/boxing-ring/boxing-ring-rope-corner-pads-custom.webp",
    "assets/products/boxing-ring/3.webp": "assets/products/boxing-ring/boxing-ring-oem-wholesale-sialkot.webp",
    "assets/products/boxing-robe/1.webp": "assets/products/boxing-robe/boxing-robe-custom-satin-ringwalk.webp",
    "assets/products/boxing-robe/2.webp": "assets/products/boxing-robe/boxing-robe-embroidery-sublimation.webp",
    "assets/products/boxing-robe/3.webp": "assets/products/boxing-robe/boxing-robe-hooded-custom-brand.webp",
    "assets/products/boxing-robe/4.webp": "assets/products/boxing-robe/boxing-robe-full-length-private-label.webp",
    "assets/products/boxing-robe/5.webp": "assets/products/boxing-robe/boxing-robe-wholesale-manufacturer-sialkot.webp",
    "assets/products/chest-guard/1.webp": "assets/products/chest-guard/chest-guard-custom-mma-muay-thai.webp",
    "assets/products/chest-guard/2.webp": "assets/products/chest-guard/chest-guard-foam-padding-protection.webp",
    "assets/products/chest-guard/3.webp": "assets/products/chest-guard/chest-guard-taekwondo-kickboxing.webp",
    "assets/products/chest-guard/4.webp": "assets/products/chest-guard/chest-guard-adult-youth-sizes.webp",
    "assets/products/chest-guard/5.webp": "assets/products/chest-guard/chest-guard-oem-manufacturer-sialkot.webp",
    "assets/products/double end ball/1.webp": "assets/products/double-end-ball/double-end-ball-custom-boxing-speed.webp",
    "assets/products/double end ball/2.webp": "assets/products/double-end-ball/double-end-ball-leather-training.webp",
    "assets/products/double end ball/3.webp": "assets/products/double-end-ball/double-end-ball-pu-synthetic.webp",
    "assets/products/double end ball/4.webp": "assets/products/double-end-ball/double-end-ball-timing-rhythm-drill.webp",
    "assets/products/double end ball/5.webp": "assets/products/double-end-ball/double-end-ball-oem-private-label.webp",
    "assets/products/double end ball/6.webp": "assets/products/double-end-ball/double-end-ball-wholesale-manufacturer.webp",
    "assets/products/ear guard/1.webp": "assets/products/ear-guard/ear-guard-wrestling-grappling-mma.webp",
    "assets/products/ear guard/2.webp": "assets/products/ear-guard/ear-guard-adjustable-custom-brand.webp",
    "assets/products/ear guard/3.webp": "assets/products/ear-guard/ear-guard-oem-manufacturer-sialkot.webp",
    "assets/products/focus mitt/1.webp": "assets/products/focus-mitt/focus-mitt-custom-boxing-coaching.webp",
    "assets/products/focus mitt/2.webp": "assets/products/focus-mitt/focus-mitt-curved-leather-training.webp",
    "assets/products/focus mitt/3.webp": "assets/products/focus-mitt/focus-mitt-mma-muay-thai-kickboxing.webp",
    "assets/products/focus mitt/4.webp": "assets/products/focus-mitt/focus-mitt-high-density-foam-padding.webp",
    "assets/products/focus mitt/5.webp": "assets/products/focus-mitt/focus-mitt-pu-synthetic-oem.webp",
    "assets/products/focus mitt/6.webp": "assets/products/focus-mitt/focus-mitt-wholesale-private-label.webp",
    # assets2/products
    "assets2/products/groin-guard/1.webp": "assets2/products/groin-guard/groin-guard-custom-boxing-mma.webp",
    "assets2/products/groin-guard/2.webp": "assets2/products/groin-guard/groin-guard-cup-style-protection.webp",
    "assets2/products/groin-guard/3.webp": "assets2/products/groin-guard/groin-guard-foam-padding-manufacturer.webp",
    "assets2/products/groin-guard/4.webp": "assets2/products/groin-guard/groin-guard-oem-private-label-sialkot.webp",
    "assets2/products/hand-wrap/1.webp": "assets2/products/hand-wrap/hand-wrap-custom-boxing-muay-thai.webp",
    "assets2/products/hand-wrap/2.webp": "assets2/products/hand-wrap/hand-wrap-elastic-cotton-training.webp",
    "assets2/products/hand-wrap/3.webp": "assets2/products/hand-wrap/hand-wrap-quick-wrap-gel-style.webp",
    "assets2/products/hand-wrap/4.webp": "assets2/products/hand-wrap/hand-wrap-oem-wholesale-manufacturer.webp",
    "assets2/products/hand-wrap-gloves/1.webp": "assets2/products/hand-wrap-gloves/hand-wraps-inner-gloves-boxing.webp",
    "assets2/products/hand-wrap-gloves/2.webp": "assets2/products/hand-wrap-gloves/hand-wraps-wrist-knuckle-protection.webp",
    "assets2/products/head-guard/1.webp": "assets2/products/head-guard/boxing-head-guard-custom-sparring.webp",
    "assets2/products/head-guard/2.webp": "assets2/products/head-guard/boxing-head-guard-open-face-leather.webp",
    "assets2/products/head-guard/3.webp": "assets2/products/head-guard/boxing-head-guard-oem-manufacturer.webp",
    "assets2/products/mma gloves/1.webp": "assets2/products/mma-gloves/mma-gloves-custom-training-sparring.webp",
    "assets2/products/mma gloves/2.webp": "assets2/products/mma-gloves/mma-gloves-cowhide-leather-competition.webp",
    "assets2/products/mma gloves/3.webp": "assets2/products/mma-gloves/mma-gloves-pu-synthetic-grappling.webp",
    "assets2/products/mma gloves/4.webp": "assets2/products/mma-gloves/mma-gloves-oem-private-label-sialkot.webp",
    "assets2/products/mma-grappling-glove/1.webp": "assets2/products/mma-grappling-glove/mma-grappling-gloves-open-finger-custom.webp",
    "assets2/products/mma-grappling-glove/2.webp": "assets2/products/mma-grappling-glove/mma-grappling-gloves-quick-hand-wrap.webp",
    "assets2/products/Muaythai shorts/1.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-custom-satin.webp",
    "assets2/products/Muaythai shorts/2.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-sublimation-print.webp",
    "assets2/products/Muaythai shorts/3.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-polyester-lightweight.webp",
    "assets2/products/Muaythai shorts/4.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-oem-wholesale-sialkot.webp",
    "assets2/products/ring-canvas/1.webp": "assets2/products/ring-canvas/boxing-ring-canvas-custom-sublimation.webp",
    "assets2/products/ring-canvas/2.webp": "assets2/products/ring-canvas/boxing-ring-canvas-vinyl-non-slip.webp",
    "assets2/products/ring-canvas/3.webp": "assets2/products/ring-canvas/boxing-ring-canvas-logo-branding.webp",
    "assets2/products/ring-canvas/4.webp": "assets2/products/ring-canvas/boxing-ring-canvas-reinforced-eyelets.webp",
    "assets2/products/ring-canvas/5.webp": "assets2/products/ring-canvas/boxing-ring-canvas-oem-manufacturer.webp",
    "assets2/products/round punching mitt/1.webp": "assets2/products/round-punching-mitt/round-punching-mitt-custom-boxing.webp",
    "assets2/products/round punching mitt/2.webp": "assets2/products/round-punching-mitt/round-punching-mitt-cowhide-leather.webp",
    "assets2/products/round punching mitt/3.webp": "assets2/products/round-punching-mitt/round-punching-mitt-foam-padding.webp",
    "assets2/products/round punching mitt/4.webp": "assets2/products/round-punching-mitt/round-punching-mitt-coaching-training.webp",
    "assets2/products/round punching mitt/5.webp": "assets2/products/round-punching-mitt/round-punching-mitt-speed-combination.webp",
    "assets2/products/round punching mitt/6.webp": "assets2/products/round-punching-mitt/round-punching-mitt-pu-synthetic.webp",
    "assets2/products/round punching mitt/7.webp": "assets2/products/round-punching-mitt/round-punching-mitt-wholesale-sialkot.webp",
    "assets2/products/ufc gloves keychain/1.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-custom-mini.webp",
    "assets2/products/ufc gloves keychain/2.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-pu-leather.webp",
    "assets2/products/ufc gloves keychain/3.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-branded-promotional.webp",
    "assets2/products/ufc gloves keychain/4.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-sports-merchandise.webp",
    "assets2/products/ufc gloves keychain/5.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-wholesale-oem.webp",
}

def update_all_refs():
    exts = ('.html', '.js', '.json')
    total_changed = 0
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in files:
            if not fname.endswith(exts):
                continue
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except:
                continue
            original = content
            for old, new in RENAMES.items():
                # Replace with leading slash (URL form)
                content = content.replace('/' + old, '/' + new)
                # Replace URL-encoded spaces
                content = content.replace('/' + old.replace(' ', '%20'), '/' + new)
                # Replace backslash variants in JSON
                content = content.replace('\\/' + old.replace('/', '\\/'), '\\/' + new.replace('/', '\\/'))
            if content != original:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
                rel = fpath.replace(BASE + os.sep, '')
                print(f"  Updated: {rel}")
                total_changed += 1
    print(f"\nTotal files updated: {total_changed}")

def update_og_meta():
    """Update Open Graph image meta tags to use new descriptive filenames."""
    og_updates = {
        'about\\index.html': {
            'old': 'haute-fighting-gears-manufacturing-facility-sialkot.webp',
            'new_url': 'https://www.hautefightinggears.com/assets/images/haute-fighting-gears-manufacturing-facility-sialkot.webp',
            'alt': 'Haute Fighting Gears manufacturing facility in Sialkot, Pakistan'
        },
    }
    # Also fix all HTML files: update src/content referencing old names
    html_files = []
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in files:
            if fname.endswith('.html'):
                html_files.append(os.path.join(root, fname))
    
    for fpath in html_files:
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
        except:
            continue
        original = content
        # Fix about page factory image alt text
        content = content.replace(
            'alt="Haute Fighting Gears manufacturing facility in Sialkot, Pakistan"',
            'alt="Haute Fighting Gears manufacturing facility in Sialkot, Pakistan"'
        )
        # Fix home-thumb references in meta/og tags
        content = content.replace(
            'content="https://www.hautefightinggears.com/assets/images/home-thumb.webp"',
            'content="https://www.hautefightinggears.com/assets/images/haute-fighting-gears-custom-boxing-gloves-manufacturer.webp"'
        )
        content = content.replace(
            'content="https://www.hautefightinggears.com/assets/images/bulk-thumb.webp"',
            'content="https://www.hautefightinggears.com/assets/images/haute-fighting-gears-bulk-order-oem-fight-gear.webp"'
        )
        content = content.replace(
            'content="https://www.hautefightinggears.com/assets/images/sample-thumb.webp"',
            'content="https://www.hautefightinggears.com/assets/images/haute-fighting-gears-fight-gear-product-catalogue.webp"'
        )
        content = content.replace(
            'content="https://www.hautefightinggears.com/assets/images/factory1.webp"',
            'content="https://www.hautefightinggears.com/assets/images/haute-fighting-gears-manufacturing-facility-sialkot.webp"'
        )
        # Fix preload links
        content = content.replace(
            'href="/assets/images/home-thumb.webp"',
            'href="/assets/images/haute-fighting-gears-custom-boxing-gloves-manufacturer.webp"'
        )
        if content != original:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            rel = fpath.replace(BASE + os.sep, '')
            print(f"  Meta updated: {rel}")

def verify():
    """Check no old numeric filenames remain in code."""
    import re
    pattern = re.compile(r'/assets[^"\']*?/[1-9]\.webp')
    found = []
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in files:
            if not fname.endswith(('.html', '.js', '.json')):
                continue
            fpath = os.path.join(root, fname)
            try:
                content = open(fpath, encoding='utf-8').read()
            except:
                continue
            matches = pattern.findall(content)
            if matches:
                rel = fpath.replace(BASE + os.sep, '')
                for m in set(matches):
                    found.append(f"  OLD REF in {rel}: {m}")
    if found:
        print("\nSTILL OLD REFS:")
        for f in found:
            print(f)
    else:
        print("\nAll old numeric image refs replaced ✓")

print("=== Updating code references ===")
update_all_refs()
print("\n=== Updating OG meta tags ===")
update_og_meta()
print("\n=== Verifying ===")
verify()
print("\nDone.")
