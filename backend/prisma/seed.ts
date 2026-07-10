import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_DATA = [
  {
    name: "Healthcare",
    slug: "healthcare",
    subs: [
      { name: "Nurse",          slug: "nurse" },
      { name: "Home Nurse",     slug: "home-nurse" },
      { name: "Patient Care",   slug: "patient-care" },
      { name: "Elder Care",     slug: "elder-care" },
      { name: "Baby Care",      slug: "baby-care" },
      { name: "Physiotherapist", slug: "physiotherapist" },
    ],
  },
  {
    name: "Domestic",
    slug: "domestic",
    subs: [
      { name: "Maid",         slug: "maid" },
      { name: "Cook",         slug: "cook" },
      { name: "Housekeeping", slug: "housekeeping" },
      { name: "Cleaner",      slug: "cleaner" },
    ],
  },
  {
    name: "Driver",
    slug: "driver",
    subs: [
      { name: "Personal Driver", slug: "personal-driver" },
      { name: "Office Driver",   slug: "office-driver" },
      { name: "Delivery Driver", slug: "delivery-driver" },
    ],
  },
  {
    name: "Security",
    slug: "security",
    subs: [
      { name: "Security Guard", slug: "security-guard" },
      { name: "Watchman",       slug: "watchman" },
    ],
  },
  {
    name: "Office",
    slug: "office",
    subs: [
      { name: "Receptionist",    slug: "receptionist" },
      { name: "Data Entry",      slug: "data-entry" },
      { name: "Computer Operator", slug: "computer-operator" },
    ],
  },
  {
    name: "IT",
    slug: "it",
    subs: [
      { name: "Software Engineer",   slug: "software-engineer" },
      { name: "Web Developer",       slug: "web-developer" },
      { name: "Full Stack Developer", slug: "full-stack-developer" },
      { name: "AI Engineer",         slug: "ai-engineer" },
    ],
  },
  {
    name: "Technical",
    slug: "technical",
    subs: [
      { name: "Electrician",   slug: "electrician" },
      { name: "Plumber",       slug: "plumber" },
      { name: "Carpenter",     slug: "carpenter" },
      { name: "Painter",       slug: "painter" },
      { name: "AC Technician", slug: "ac-technician" },
    ],
  },
];

async function main() {
  console.log("Seeding categories and subcategories...");

  for (const cat of SEED_DATA) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });

    for (const sub of cat.subs) {
      await prisma.subCategory.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, categoryId: category.id },
        create: { name: sub.name, slug: sub.slug, categoryId: category.id },
      });
    }

    console.log(`✓ ${cat.name} (${cat.subs.length} subcategories)`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });