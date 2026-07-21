#!/usr/bin/env python3
"""
SEO Image Optimization — Haute Fighting Gears
Renames image files with descriptive SEO names and updates all references.
"""
import os, shutil, re

BASE = r"c:\Users\Rubab Hayat Khan\Downloads\Haute Files\fightgear-site - Copy - Copy (2)"

# ============================================================
# RENAME MAP: old_path -> new_path (all relative to BASE)
# Keys use forward slashes for easy regex replacement
# ============================================================
RENAME_MAP = {
    # ── assets/images ──────────────────────────────────────
    "assets/images/home-thumb.webp":   "assets/images/haute-fighting-gears-custom-boxing-gloves-manufacturer.webp",
    "assets/images/bulk-thumb.webp":   "assets/images/haute-fighting-gears-bulk-order-oem-fight-gear.webp",
    "assets/images/sample-thumb.webp": "assets/images/haute-fighting-gears-fight-gear-product-catalogue.webp",
    "assets/images/factory1.webp":     "assets/images/haute-fighting-gears-manufacturing-facility-sialkot.webp",
    "assets/images/factory2.webp":     "assets/images/haute-fighting-gears-craftsmen-production-sialkot.webp",
    "assets/images/logo.webp":         "assets/images/logo.webp",  # keep — referenced by name in brand recognition

    # ── assets/products/Bag Mitt ────────────────────────────
    "assets/products/Bag Mitt/1.webp": "assets/products/bag-mitt/bag-mitt-custom-boxing-training.webp",
    "assets/products/Bag Mitt/2.webp": "assets/products/bag-mitt/bag-mitt-leather-heavy-bag-gloves.webp",
    "assets/products/Bag Mitt/3.webp": "assets/products/bag-mitt/bag-mitt-oem-private-label.webp",
    "assets/products/Bag Mitt/4.webp": "assets/products/bag-mitt/bag-mitt-wrist-support-padding.webp",
    "assets/products/Bag Mitt/5.webp": "assets/products/bag-mitt/bag-mitt-wholesale-manufacturer-sialkot.webp",

    # ── assets/products/belly-pad ───────────────────────────
    "assets/products/belly-pad/1.webp": "assets/products/belly-pad/belly-pad-custom-boxing-muay-thai.webp",
    "assets/products/belly-pad/2.webp": "assets/products/belly-pad/belly-pad-foam-padding-trainer.webp",
    "assets/products/belly-pad/3.webp": "assets/products/belly-pad/belly-pad-oem-manufacturer-sialkot.webp",

    # ── assets/products/bjj-belt ───────────────────────────
    "assets/products/bjj-belt/1.webp": "assets/products/bjj-belt/bjj-belt-custom-brazilian-jiu-jitsu.webp",
    "assets/products/bjj-belt/2.webp": "assets/products/bjj-belt/bjj-belt-all-ranks-custom-embroidery.webp",
    "assets/products/bjj-belt/3.webp": "assets/products/bjj-belt/bjj-belt-ibjjf-standard-wholesale.webp",
}

RENAME_MAP.update({
    # ── assets/products/boxing gloves keychain ──────────────
    "assets/products/boxing gloves keychain/1.webp": "assets/products/boxing-gloves-keychain/boxing-gloves-keychain-custom-mini.webp",
    "assets/products/boxing gloves keychain/2.webp": "assets/products/boxing-gloves-keychain/boxing-gloves-keychain-pu-leather.webp",
    "assets/products/boxing gloves keychain/3.webp": "assets/products/boxing-gloves-keychain/boxing-gloves-keychain-wholesale-branded.webp",

    # ── assets/products/boxing shoe ─────────────────────────
    "assets/products/boxing shoe/1.webp": "assets/products/boxing-shoe/boxing-shoes-custom-professional.webp",
    "assets/products/boxing shoe/2.webp": "assets/products/boxing-shoe/boxing-shoes-high-top-training.webp",
    "assets/products/boxing shoe/3.webp": "assets/products/boxing-shoe/boxing-shoes-low-top-lightweight.webp",
    "assets/products/boxing shoe/4.webp": "assets/products/boxing-shoe/boxing-shoes-sole-grip-detail.webp",
    "assets/products/boxing shoe/5.webp": "assets/products/boxing-shoe/boxing-shoes-oem-manufacturer.webp",
    "assets/products/boxing shoe/6.webp": "assets/products/boxing-shoe/boxing-shoes-private-label-sialkot.webp",

    # ── assets/products/boxing-gloves ───────────────────────
    "assets/products/boxing-gloves/1.webp": "assets/products/boxing-gloves/custom-boxing-gloves-cowhide-leather.webp",
    "assets/products/boxing-gloves/2.webp": "assets/products/boxing-gloves/custom-boxing-gloves-pu-synthetic.webp",
    "assets/products/boxing-gloves/3.webp": "assets/products/boxing-gloves/custom-boxing-gloves-oem-manufacturer-sialkot.webp",

    # ── assets/products/boxing-ring ─────────────────────────
    "assets/products/boxing-ring/1.webp": "assets/products/boxing-ring/professional-boxing-ring-custom-manufacturer.webp",
    "assets/products/boxing-ring/2.webp": "assets/products/boxing-ring/boxing-ring-rope-corner-pads-custom.webp",
    "assets/products/boxing-ring/3.webp": "assets/products/boxing-ring/boxing-ring-oem-wholesale-sialkot.webp",

    # ── assets/products/boxing-robe ─────────────────────────
    "assets/products/boxing-robe/1.webp": "assets/products/boxing-robe/boxing-robe-custom-satin-ringwalk.webp",
    "assets/products/boxing-robe/2.webp": "assets/products/boxing-robe/boxing-robe-embroidery-sublimation.webp",
    "assets/products/boxing-robe/3.webp": "assets/products/boxing-robe/boxing-robe-hooded-custom-brand.webp",
    "assets/products/boxing-robe/4.webp": "assets/products/boxing-robe/boxing-robe-full-length-private-label.webp",
    "assets/products/boxing-robe/5.webp": "assets/products/boxing-robe/boxing-robe-wholesale-manufacturer-sialkot.webp",

    # ── assets/products/chest-guard ─────────────────────────
    "assets/products/chest-guard/1.webp": "assets/products/chest-guard/chest-guard-custom-mma-muay-thai.webp",
    "assets/products/chest-guard/2.webp": "assets/products/chest-guard/chest-guard-foam-padding-protection.webp",
    "assets/products/chest-guard/3.webp": "assets/products/chest-guard/chest-guard-taekwondo-kickboxing.webp",
    "assets/products/chest-guard/4.webp": "assets/products/chest-guard/chest-guard-adult-youth-sizes.webp",
    "assets/products/chest-guard/5.webp": "assets/products/chest-guard/chest-guard-oem-manufacturer-sialkot.webp",

    # ── assets/products/double end ball ─────────────────────
    "assets/products/double end ball/1.webp": "assets/products/double-end-ball/double-end-ball-custom-boxing-speed.webp",
    "assets/products/double end ball/2.webp": "assets/products/double-end-ball/double-end-ball-leather-training.webp",
    "assets/products/double end ball/3.webp": "assets/products/double-end-ball/double-end-ball-pu-synthetic.webp",
    "assets/products/double end ball/4.webp": "assets/products/double-end-ball/double-end-ball-timing-rhythm-drill.webp",
    "assets/products/double end ball/5.webp": "assets/products/double-end-ball/double-end-ball-oem-private-label.webp",
    "assets/products/double end ball/6.webp": "assets/products/double-end-ball/double-end-ball-wholesale-manufacturer.webp",

    # ── assets/products/ear guard ───────────────────────────
    "assets/products/ear guard/1.webp": "assets/products/ear-guard/ear-guard-wrestling-grappling-mma.webp",
    "assets/products/ear guard/2.webp": "assets/products/ear-guard/ear-guard-adjustable-custom-brand.webp",
    "assets/products/ear guard/3.webp": "assets/products/ear-guard/ear-guard-oem-manufacturer-sialkot.webp",

    # ── assets/products/focus mitt ──────────────────────────
    "assets/products/focus mitt/1.webp": "assets/products/focus-mitt/focus-mitt-custom-boxing-coaching.webp",
    "assets/products/focus mitt/2.webp": "assets/products/focus-mitt/focus-mitt-curved-leather-training.webp",
    "assets/products/focus mitt/3.webp": "assets/products/focus-mitt/focus-mitt-mma-muay-thai-kickboxing.webp",
    "assets/products/focus mitt/4.webp": "assets/products/focus-mitt/focus-mitt-high-density-foam-padding.webp",
    "assets/products/focus mitt/5.webp": "assets/products/focus-mitt/focus-mitt-pu-synthetic-oem.webp",
    "assets/products/focus mitt/6.webp": "assets/products/focus-mitt/focus-mitt-wholesale-private-label.webp",
})

RENAME_MAP.update({
    # ── assets2/products/groin-guard ────────────────────────
    "assets2/products/groin-guard/1.webp": "assets2/products/groin-guard/groin-guard-custom-boxing-mma.webp",
    "assets2/products/groin-guard/2.webp": "assets2/products/groin-guard/groin-guard-cup-style-protection.webp",
    "assets2/products/groin-guard/3.webp": "assets2/products/groin-guard/groin-guard-foam-padding-manufacturer.webp",
    "assets2/products/groin-guard/4.webp": "assets2/products/groin-guard/groin-guard-oem-private-label-sialkot.webp",

    # ── assets2/products/hand-wrap ──────────────────────────
    "assets2/products/hand-wrap/1.webp": "assets2/products/hand-wrap/hand-wrap-custom-boxing-muay-thai.webp",
    "assets2/products/hand-wrap/2.webp": "assets2/products/hand-wrap/hand-wrap-elastic-cotton-training.webp",
    "assets2/products/hand-wrap/3.webp": "assets2/products/hand-wrap/hand-wrap-quick-wrap-gel-style.webp",
    "assets2/products/hand-wrap/4.webp": "assets2/products/hand-wrap/hand-wrap-oem-wholesale-manufacturer.webp",

    # ── assets2/products/hand-wrap-gloves ───────────────────
    "assets2/products/hand-wrap-gloves/1.webp": "assets2/products/hand-wrap-gloves/hand-wraps-inner-gloves-boxing.webp",
    "assets2/products/hand-wrap-gloves/2.webp": "assets2/products/hand-wrap-gloves/hand-wraps-wrist-knuckle-protection.webp",

    # ── assets2/products/head-guard ─────────────────────────
    "assets2/products/head-guard/1.webp": "assets2/products/head-guard/boxing-head-guard-custom-sparring.webp",
    "assets2/products/head-guard/2.webp": "assets2/products/head-guard/boxing-head-guard-open-face-leather.webp",
    "assets2/products/head-guard/3.webp": "assets2/products/head-guard/boxing-head-guard-oem-manufacturer.webp",

    # ── assets2/products/mma gloves ─────────────────────────
    "assets2/products/mma gloves/1.webp": "assets2/products/mma-gloves/mma-gloves-custom-training-sparring.webp",
    "assets2/products/mma gloves/2.webp": "assets2/products/mma-gloves/mma-gloves-cowhide-leather-competition.webp",
    "assets2/products/mma gloves/3.webp": "assets2/products/mma-gloves/mma-gloves-pu-synthetic-grappling.webp",
    "assets2/products/mma gloves/4.webp": "assets2/products/mma-gloves/mma-gloves-oem-private-label-sialkot.webp",

    # ── assets2/products/mma-grappling-glove ────────────────
    "assets2/products/mma-grappling-glove/1.webp": "assets2/products/mma-grappling-glove/mma-grappling-gloves-open-finger-custom.webp",
    "assets2/products/mma-grappling-glove/2.webp": "assets2/products/mma-grappling-glove/mma-grappling-gloves-quick-hand-wrap.webp",

    # ── assets2/products/Muaythai shorts ────────────────────
    "assets2/products/Muaythai shorts/1.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-custom-satin.webp",
    "assets2/products/Muaythai shorts/2.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-sublimation-print.webp",
    "assets2/products/Muaythai shorts/3.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-polyester-lightweight.webp",
    "assets2/products/Muaythai shorts/4.webp": "assets2/products/muay-thai-shorts/muay-thai-shorts-oem-wholesale-sialkot.webp",

    # ── assets2/products/ring-canvas ────────────────────────
    "assets2/products/ring-canvas/1.webp": "assets2/products/ring-canvas/boxing-ring-canvas-custom-sublimation.webp",
    "assets2/products/ring-canvas/2.webp": "assets2/products/ring-canvas/boxing-ring-canvas-vinyl-non-slip.webp",
    "assets2/products/ring-canvas/3.webp": "assets2/products/ring-canvas/boxing-ring-canvas-logo-branding.webp",
    "assets2/products/ring-canvas/4.webp": "assets2/products/ring-canvas/boxing-ring-canvas-reinforced-eyelets.webp",
    "assets2/products/ring-canvas/5.webp": "assets2/products/ring-canvas/boxing-ring-canvas-oem-manufacturer.webp",

    # ── assets2/products/round punching mitt ────────────────
    "assets2/products/round punching mitt/1.webp": "assets2/products/round-punching-mitt/round-punching-mitt-custom-boxing.webp",
    "assets2/products/round punching mitt/2.webp": "assets2/products/round-punching-mitt/round-punching-mitt-cowhide-leather.webp",
    "assets2/products/round punching mitt/3.webp": "assets2/products/round-punching-mitt/round-punching-mitt-foam-padding.webp",
    "assets2/products/round punching mitt/4.webp": "assets2/products/round-punching-mitt/round-punching-mitt-coaching-training.webp",
    "assets2/products/round punching mitt/5.webp": "assets2/products/round-punching-mitt/round-punching-mitt-speed-combination.webp",
    "assets2/products/round punching mitt/6.webp": "assets2/products/round-punching-mitt/round-punching-mitt-pu-synthetic.webp",
    "assets2/products/round punching mitt/7.webp": "assets2/products/round-punching-mitt/round-punching-mitt-wholesale-sialkot.webp",

    # ── assets2/products/ufc gloves keychain ────────────────
    "assets2/products/ufc gloves keychain/1.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-custom-mini.webp",
    "assets2/products/ufc gloves keychain/2.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-pu-leather.webp",
    "assets2/products/ufc gloves keychain/3.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-branded-promotional.webp",
    "assets2/products/ufc gloves keychain/4.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-sports-merchandise.webp",
    "assets2/products/ufc gloves keychain/5.webp": "assets2/products/ufc-gloves-keychain/ufc-gloves-keychain-wholesale-oem.webp",
})


# ============================================================
# ALT TEXT MAP: new image path -> alt text
# ============================================================
ALT_MAP = {
    # site images
    "haute-fighting-gears-custom-boxing-gloves-manufacturer.webp": "Custom boxing gloves and MMA gear manufacturer — Haute Fighting Gears, Sialkot Pakistan",
    "haute-fighting-gears-bulk-order-oem-fight-gear.webp": "Bulk OEM fight gear manufacturing inquiry — Haute Fighting Gears",
    "haute-fighting-gears-fight-gear-product-catalogue.webp": "Custom fight gear product catalogue — boxing gloves, MMA gear, Muay Thai equipment",
    "haute-fighting-gears-manufacturing-facility-sialkot.webp": "Haute Fighting Gears manufacturing facility in Sialkot, Pakistan",
    "haute-fighting-gears-craftsmen-production-sialkot.webp": "Skilled craftsmen producing premium custom fight gear in Sialkot",
    "logo.webp": "Haute Fighting Gears — Custom Boxing Gloves & MMA Gear Manufacturer",
    # bag mitt
    "bag-mitt-custom-boxing-training.webp": "Custom bag mitt for boxing and heavy bag training",
    "bag-mitt-leather-heavy-bag-gloves.webp": "Leather bag mitts for intense heavy bag workouts",
    "bag-mitt-oem-private-label.webp": "OEM private label bag mitts manufactured in Sialkot",
    "bag-mitt-wrist-support-padding.webp": "Bag mitts with wrist support and shock-absorbing padding",
    "bag-mitt-wholesale-manufacturer-sialkot.webp": "Wholesale bag mitts manufactured by Haute Fighting Gears",
    # belly pad
    "belly-pad-custom-boxing-muay-thai.webp": "Custom belly pad for boxing and Muay Thai coaching",
    "belly-pad-foam-padding-trainer.webp": "Belly pad with multi-layer foam padding for trainers",
    "belly-pad-oem-manufacturer-sialkot.webp": "OEM belly pad manufacturer in Sialkot Pakistan",
    # bjj belt
    "bjj-belt-custom-brazilian-jiu-jitsu.webp": "Custom Brazilian Jiu-Jitsu belt with embroidery — all ranks available",
    "bjj-belt-all-ranks-custom-embroidery.webp": "BJJ belts for all ranks with custom woven labels and embroidery",
    "bjj-belt-ibjjf-standard-wholesale.webp": "IBJJF standard BJJ belts wholesale manufacturer Sialkot",
    # boxing gloves keychain
    "boxing-gloves-keychain-custom-mini.webp": "Custom mini boxing gloves keychain for gyms and promotions",
    "boxing-gloves-keychain-pu-leather.webp": "PU leather boxing gloves keychain with custom logo",
    "boxing-gloves-keychain-wholesale-branded.webp": "Wholesale branded boxing gloves keychains manufacturer",
    # boxing shoe
    "boxing-shoes-custom-professional.webp": "Custom professional boxing shoes manufactured to order",
    "boxing-shoes-high-top-training.webp": "High top boxing shoes for ankle support and training",
    "boxing-shoes-low-top-lightweight.webp": "Lightweight low top boxing shoes for agility and speed",
    "boxing-shoes-sole-grip-detail.webp": "Boxing shoes with durable grip sole — close-up detail",
    "boxing-shoes-oem-manufacturer.webp": "OEM boxing shoes manufacturer Sialkot Pakistan",
    "boxing-shoes-private-label-sialkot.webp": "Private label boxing shoes manufactured in Sialkot",
    # boxing gloves
    "custom-boxing-gloves-cowhide-leather.webp": "Custom boxing gloves in premium cowhide leather — Haute Fighting Gears",
    "custom-boxing-gloves-pu-synthetic.webp": "Custom boxing gloves in PU synthetic leather for training",
    "custom-boxing-gloves-oem-manufacturer-sialkot.webp": "OEM custom boxing gloves manufacturer in Sialkot Pakistan",
    # boxing ring
    "professional-boxing-ring-custom-manufacturer.webp": "Professional custom boxing ring manufactured for gyms and events",
    "boxing-ring-rope-corner-pads-custom.webp": "Boxing ring with custom rope colors and corner pad branding",
    "boxing-ring-oem-wholesale-sialkot.webp": "Wholesale boxing ring OEM manufacturer Sialkot Pakistan",
    # boxing robe
    "boxing-robe-custom-satin-ringwalk.webp": "Custom satin boxing robe for ring walk and competition",
    "boxing-robe-embroidery-sublimation.webp": "Boxing robe with custom embroidery and sublimation printing",
    "boxing-robe-hooded-custom-brand.webp": "Hooded boxing robe with custom brand logo",
    "boxing-robe-full-length-private-label.webp": "Full length private label boxing robe manufacturer",
    "boxing-robe-wholesale-manufacturer-sialkot.webp": "Wholesale boxing robes manufactured in Sialkot Pakistan",
    # chest guard
    "chest-guard-custom-mma-muay-thai.webp": "Custom chest guard for MMA and Muay Thai training",
    "chest-guard-foam-padding-protection.webp": "Chest guard with high-impact foam padding for protection",
    "chest-guard-taekwondo-kickboxing.webp": "Chest guard for Taekwondo and kickboxing competition",
    "chest-guard-adult-youth-sizes.webp": "Chest guard available in adult and youth sizes — custom branded",
    "chest-guard-oem-manufacturer-sialkot.webp": "OEM chest guard manufacturer in Sialkot Pakistan",
    # double end ball
    "double-end-ball-custom-boxing-speed.webp": "Custom double end ball for boxing speed and timing training",
    "double-end-ball-leather-training.webp": "Leather double end ball for professional boxing training",
    "double-end-ball-pu-synthetic.webp": "PU synthetic double end ball manufacturer",
    "double-end-ball-timing-rhythm-drill.webp": "Double end ball for rhythm and defensive movement drills",
    "double-end-ball-oem-private-label.webp": "OEM private label double end ball manufacturer",
    "double-end-ball-wholesale-manufacturer.webp": "Wholesale double end balls manufactured in Sialkot",
    # ear guard
    "ear-guard-wrestling-grappling-mma.webp": "Custom ear guard for wrestling, grappling, and MMA",
    "ear-guard-adjustable-custom-brand.webp": "Adjustable ear guard with custom brand logo",
    "ear-guard-oem-manufacturer-sialkot.webp": "OEM ear guard manufacturer Sialkot Pakistan",
    # focus mitt
    "focus-mitt-custom-boxing-coaching.webp": "Custom focus mitts for professional boxing coaching",
    "focus-mitt-curved-leather-training.webp": "Curved leather focus mitts for precision training",
    "focus-mitt-mma-muay-thai-kickboxing.webp": "Focus mitts for MMA, Muay Thai, and kickboxing coaching",
    "focus-mitt-high-density-foam-padding.webp": "Focus mitts with high-density foam for shock absorption",
    "focus-mitt-pu-synthetic-oem.webp": "PU synthetic focus mitts OEM manufacturer",
    "focus-mitt-wholesale-private-label.webp": "Wholesale private label focus mitts manufacturer Sialkot",
    # groin guard
    "groin-guard-custom-boxing-mma.webp": "Custom groin guard for boxing and MMA protection",
    "groin-guard-cup-style-protection.webp": "Cup style groin guard with high-density foam protection",
    "groin-guard-foam-padding-manufacturer.webp": "Groin guard with multi-layer EVA foam padding",
    "groin-guard-oem-private-label-sialkot.webp": "OEM groin guard private label manufacturer Sialkot",
    # hand wrap
    "hand-wrap-custom-boxing-muay-thai.webp": "Custom hand wraps for boxing and Muay Thai training",
    "hand-wrap-elastic-cotton-training.webp": "Elastic cotton hand wraps for wrist and knuckle support",
    "hand-wrap-quick-wrap-gel-style.webp": "Quick wrap gel-style hand wraps for fast application",
    "hand-wrap-oem-wholesale-manufacturer.webp": "OEM wholesale hand wraps manufacturer Sialkot Pakistan",
    # hand wrap gloves
    "hand-wraps-inner-gloves-boxing.webp": "Inner gloves hand wraps for boxing wrist protection",
    "hand-wraps-wrist-knuckle-protection.webp": "Hand wraps providing wrist stability and knuckle protection",
    # head guard
    "boxing-head-guard-custom-sparring.webp": "Custom boxing head guard for sparring and competition",
    "boxing-head-guard-open-face-leather.webp": "Open face boxing head guard in cowhide leather",
    "boxing-head-guard-oem-manufacturer.webp": "OEM boxing head guard manufacturer Sialkot Pakistan",
    # mma gloves
    "mma-gloves-custom-training-sparring.webp": "Custom MMA gloves for training and sparring",
    "mma-gloves-cowhide-leather-competition.webp": "Cowhide leather MMA gloves for competition",
    "mma-gloves-pu-synthetic-grappling.webp": "PU synthetic MMA gloves for grappling and striking",
    "mma-gloves-oem-private-label-sialkot.webp": "OEM MMA gloves private label manufacturer Sialkot",
    # mma grappling glove
    "mma-grappling-gloves-open-finger-custom.webp": "Custom open-finger MMA grappling gloves manufacturer",
    "mma-grappling-gloves-quick-hand-wrap.webp": "MMA grappling gloves with quick hand wrap design",
    # muay thai shorts
    "muay-thai-shorts-custom-satin.webp": "Custom satin Muay Thai shorts manufacturer",
    "muay-thai-shorts-sublimation-print.webp": "Muay Thai shorts with full sublimation printing",
    "muay-thai-shorts-polyester-lightweight.webp": "Lightweight polyester Muay Thai shorts for training",
    "muay-thai-shorts-oem-wholesale-sialkot.webp": "OEM Muay Thai shorts wholesale manufacturer Sialkot",
    # ring canvas
    "boxing-ring-canvas-custom-sublimation.webp": "Custom sublimated boxing ring canvas for events",
    "boxing-ring-canvas-vinyl-non-slip.webp": "Non-slip vinyl boxing ring canvas manufacturer",
    "boxing-ring-canvas-logo-branding.webp": "Boxing ring canvas with custom logo and gym branding",
    "boxing-ring-canvas-reinforced-eyelets.webp": "Boxing ring canvas with reinforced heavy-duty eyelets",
    "boxing-ring-canvas-oem-manufacturer.webp": "OEM boxing ring canvas manufacturer Sialkot Pakistan",
    # round punching mitt
    "round-punching-mitt-custom-boxing.webp": "Custom round punching mitts for boxing coaching",
    "round-punching-mitt-cowhide-leather.webp": "Cowhide leather round punching mitts manufacturer",
    "round-punching-mitt-foam-padding.webp": "Round punching mitts with multi-layer foam padding",
    "round-punching-mitt-coaching-training.webp": "Round punching mitts for coach and trainer use",
    "round-punching-mitt-speed-combination.webp": "Round punching mitts for speed and combination drills",
    "round-punching-mitt-pu-synthetic.webp": "PU synthetic round punching mitts OEM manufacturer",
    "round-punching-mitt-wholesale-sialkot.webp": "Wholesale round punching mitts manufacturer Sialkot",
    # ufc gloves keychain
    "ufc-gloves-keychain-custom-mini.webp": "Custom mini UFC-style gloves keychain manufacturer",
    "ufc-gloves-keychain-pu-leather.webp": "PU leather UFC gloves keychain with custom logo",
    "ufc-gloves-keychain-branded-promotional.webp": "Branded UFC gloves keychain for promotional events",
    "ufc-gloves-keychain-sports-merchandise.webp": "UFC gloves keychain for sports merchandise and retail",
    "ufc-gloves-keychain-wholesale-oem.webp": "Wholesale OEM UFC gloves keychain manufacturer Sialkot",
}


# ============================================================
# EXECUTE: rename files + update all references
# ============================================================

def normalize(path):
    """Normalize path separators to forward slash."""
    return path.replace("\\", "/")

def run():
    moved = []
    skipped = []

    # Step 1: Create new folders and copy/rename files
    for old_rel, new_rel in RENAME_MAP.items():
        old_abs = os.path.join(BASE, old_rel.replace("/", os.sep))
        new_abs = os.path.join(BASE, new_rel.replace("/", os.sep))

        if old_rel == new_rel:
            continue  # nothing to do (logo.webp kept as-is)

        if not os.path.exists(old_abs):
            skipped.append(f"MISSING: {old_rel}")
            continue

        # Create target directory
        os.makedirs(os.path.dirname(new_abs), exist_ok=True)

        # Copy file to new name/location
        shutil.copy2(old_abs, new_abs)
        moved.append((old_rel, new_rel))

    print(f"\nRenamed {len(moved)} files, skipped {len(skipped)}")
    for s in skipped:
        print(f"  {s}")

    # Step 2: Update all references in HTML, JS, JSON files
    code_files = []
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in files:
            if fname.endswith(('.html', '.js', '.json')):
                code_files.append(os.path.join(root, fname))

    updated_files = 0
    for fpath in code_files:
        try:
            content = open(fpath, encoding='utf-8').read()
        except Exception:
            continue
        original = content

        for old_rel, new_rel in RENAME_MAP.items():
            if old_rel == new_rel:
                continue
            # Replace both /path and path variants, handle URL-encoded spaces (%20)
            old_encoded = old_rel.replace(" ", "%20")
            new_clean = new_rel

            # Build patterns to replace (forward slash paths)
            patterns = [
                ("/" + old_rel, "/" + new_rel),
                ("/" + old_encoded, "/" + new_rel),
                (old_rel, new_rel),
                (old_encoded, new_rel),
            ]
            for old_p, new_p in patterns:
                if old_p in content:
                    content = content.replace(old_p, new_p)

        if content != original:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            rel = fpath.replace(BASE + os.sep, "")
            print(f"  Updated refs: {rel}")
            updated_files += 1

    print(f"\nUpdated references in {updated_files} files")

    # Step 3: Update alt text in HTML files
    alt_updated = 0
    for fpath in code_files:
        if not fpath.endswith('.html'):
            continue
        try:
            content = open(fpath, encoding='utf-8').read()
        except Exception:
            continue
        original = content

        # For each image, find <img src="...newpath..." and set alt if missing/generic
        for old_rel, new_rel in RENAME_MAP.items():
            if old_rel == new_rel:
                continue
            fname = os.path.basename(new_rel)
            alt_text = ALT_MAP.get(fname, "")
            if not alt_text:
                continue

            # Find img tags referencing this file and fix blank/generic alt
            # Pattern: <img ... src="...new_rel..." ... alt="" ...>  or alt not present
            # Replace alt="" or alt="image" with proper alt
            escaped_path = re.escape("/" + new_rel)
            content = re.sub(
                r'(<img\b[^>]*\bsrc="[^"]*' + escaped_path.replace("/", r'[/\\]?') + r'[^"]*"[^>]*\balt=")(\s*|image\s*|img\s*)',
                r'\g<1>' + alt_text,
                content
            )

        if content != original:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            alt_updated += 1

    print(f"Updated alt text in {alt_updated} HTML files")

    # Step 4: Update app.js inline product data alt text (it uses p.name for alt)
    # The product images in JS are loaded dynamically — alt comes from product name, which is good.
    # No change needed there.

    # Step 5: Remove old files (after confirming new ones exist)
    removed = 0
    for old_rel, new_rel in RENAME_MAP.items():
        if old_rel == new_rel:
            continue
        old_abs = os.path.join(BASE, old_rel.replace("/", os.sep))
        new_abs = os.path.join(BASE, new_rel.replace("/", os.sep))
        if os.path.exists(new_abs) and os.path.exists(old_abs):
            # Only remove if it's a different file (not same path)
            if os.path.abspath(old_abs) != os.path.abspath(new_abs):
                os.remove(old_abs)
                removed += 1

    # Clean up empty old directories
    for old_rel in RENAME_MAP.keys():
        old_dir = os.path.dirname(os.path.join(BASE, old_rel.replace("/", os.sep)))
        try:
            if os.path.exists(old_dir) and not os.listdir(old_dir):
                os.rmdir(old_dir)
        except Exception:
            pass

    print(f"Removed {removed} old files")
    print("\nDone! All images renamed, references updated, alt text improved.")

if __name__ == "__main__":
    run()
