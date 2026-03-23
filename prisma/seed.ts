// ============================================================
// prisma/seed.ts
// Seeds 8 realistic PPE products across 6 categories.
// Images are placeholder URLs — replace via admin panel (Phase 8).
// ============================================================

import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Converts a product name to a URL-safe slug */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Placeholder image from Unsplash Source (no API key needed) */
function placeholder(id: number): string {
  return `https://placehold.co/800x800/e2e8f0/64748b?text=Product+${id}`;
}

// ─────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────

const products = [
  // ── Gloves ──────────────────────────────────────────────
  {
    name: "NitriGuard Pro Examination Gloves (Box of 100)",
    description:
      "Medical-grade nitrile examination gloves offering superior puncture resistance and chemical protection. Powder-free, latex-free, and textured fingertips for enhanced grip. Compliant with ASTM D6319 and EN 455 standards. Available in sizes S–XL.",
    price: "249.99",
    stock: 850,
    category: "Gloves",
    images: [placeholder(1), placeholder(2)],
  },
  {
    name: "CryoShield Heavy-Duty Chemical Resistant Gloves",
    description:
      "Extra-thick neoprene gloves rated for prolonged contact with acids, bases, and solvents. 32 cm cuff for forearm protection. CE Category III certified. Reusable and autoclavable up to 121 °C. Sold per pair.",
    price: "189.50",
    stock: 420,
    category: "Gloves",
    images: [placeholder(3)],
  },

  // ── Masks ────────────────────────────────────────────────
  {
    name: "AeroShield N95 Respirator Mask (Pack of 20)",
    description:
      "NIOSH-approved N95 particulate respirator filtering ≥95 % of airborne particles. Adjustable nose clip, dual elastic headbands, and low-profile cup design ensure a secure fit. Suitable for industrial and healthcare environments. SABS approved.",
    price: "399.00",
    stock: 1200,
    category: "Masks",
    images: [placeholder(4), placeholder(5)],
  },
  {
    name: "FlexBreath Surgical Face Mask Level 3 (Box of 50)",
    description:
      "ASTM F2100 Level 3 surgical masks with tri-layer melt-blown filtration (BFE ≥98 %). Fluid-resistant outer layer, soft inner layer, adjustable nose wire. Individually packaged for sterile single-use applications.",
    price: "149.95",
    stock: 3000,
    category: "Masks",
    images: [placeholder(6)],
  },

  // ── Gowns ────────────────────────────────────────────────
  {
    name: "SafeWrap Disposable Isolation Gown Level 2 (Pack of 10)",
    description:
      "ANSI/AAMI PB70 Level 2 disposable gowns made from breathable SMS non-woven fabric. Knit collar, elastic cuffs, and tie-back closure. Fluid resistant for low-to-moderate splash environments. Universal size fits most adults.",
    price: "320.00",
    stock: 600,
    category: "Gowns",
    images: [placeholder(7), placeholder(8)],
  },

  // ── Eye Protection ────────────────────────────────────────
  {
    name: "ClearVue Anti-Fog Safety Goggles",
    description:
      "Indirect-vent chemical splash goggles with polycarbonate lens offering UV400 protection. Dual anti-fog and anti-scratch coating. Soft PVC frame with adjustable elastic strap fits over prescription eyewear. EN 166 / ANSI Z87.1 certified.",
    price: "85.00",
    stock: 750,
    category: "Eye Protection",
    images: [placeholder(9), placeholder(10)],
  },

  // ── Shoe Covers ───────────────────────────────────────────
  {
    name: "StepSafe Non-Slip Disposable Shoe Covers (Pack of 100)",
    description:
      "Heavy-duty polypropylene shoe covers with slip-resistant PE sole. Elastic opening accommodates shoe sizes up to UK 13. Ideal for cleanrooms, laboratories, and food-processing environments. Single-use, lightweight, and easy to don.",
    price: "99.00",
    stock: 2000,
    category: "Shoe Covers",
    images: [placeholder(11)],
  },

  // ── Face Shields ──────────────────────────────────────────
  {
    name: "VistaGuard Full-Face Reusable Face Shield",
    description:
      "Wrap-around polycarbonate face shield with 180° panoramic clarity. Anti-fog, anti-scratch coating on inner and outer surfaces. Foam-padded adjustable headband for all-day comfort. Meets EN 166 and ANSI Z87.1+. Includes reusable storage pouch.",
    price: "215.00",
    stock: 380,
    category: "Face Shields",
    images: [placeholder(12), placeholder(13)],
  },
];

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting database seed…");

  // Wipe existing products so the seed is idempotent
  const deleted = await prisma.product.deleteMany();
  if (deleted.count > 0) {
    console.log(`   ↳ Cleared ${deleted.count} existing product(s).`);
  }

  for (const data of products) {
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: slugify(data.name),
        price: data.price,
        isActive: true,
      },
    });
    console.log(`   ✔ Created: ${product.name} [${product.id}]`);
  }

  console.log(`\n✅  Seeded ${products.length} products successfully.`);
}

// main()
//   .catch((err) => {
//     console.error("❌  Seed failed:", err);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

  main()
    .then(async () => {
      await prisma.$disconnect();
      await pool.end();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      await pool.end();
      process.exit(1);
    });
