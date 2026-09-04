import { connectDB } from "../config/db.js";
import BusinessCategory from "../models/BusinessCategory.js";

const categories = [
  {
    name: "Dairy Farming",
    slug: "dairy-farming",
    description: "Small-scale dairy farming and milk production",
    sector: "Agriculture & Livestock",
    active: true,
  },
  {
    name: "Poultry Farming",
    slug: "poultry-farming",
    description: "Small-scale poultry and egg production",
    sector: "Agriculture & Livestock",
    active: true,
  },
  {
    name: "Goat Farming",
    slug: "goat-farming",
    description: "Small-scale goat rearing and livestock production",
    sector: "Agriculture & Livestock",
    active: true,
  },
  {
    name: "Fish Farming",
    slug: "fish-farming",
    description: "Fish cultivation and aquaculture",
    sector: "Agriculture & Livestock",
    active: true,
  },
  {
    name: "Beekeeping",
    slug: "beekeeping",
    description: "Honey bee rearing and honey production",
    sector: "Agriculture & Livestock",
    active: true,
  },
  {
    name: "Mushroom Farming",
    slug: "mushroom-farming",
    description: "Small-scale mushroom cultivation",
    sector: "Agriculture",
    active: true,
  },
  {
    name: "Organic Farming",
    slug: "organic-farming",
    description: "Cultivation using organic farming practices",
    sector: "Agriculture",
    active: true,
  },
  {
    name: "Vegetable Farming",
    slug: "vegetable-farming",
    description: "Cultivation and sale of vegetables",
    sector: "Agriculture",
    active: true,
  },
  {
    name: "Nursery & Plant Business",
    slug: "nursery-plant-business",
    description: "Plant nursery and sale of plants and saplings",
    sector: "Agriculture",
    active: true,
  },
  {
    name: "Farm Equipment Rental",
    slug: "farm-equipment-rental",
    description: "Rental of agricultural tools and equipment",
    sector: "Agriculture Services",
    active: true,
  },
  {
    name: "Flour Mill",
    slug: "flour-mill",
    description: "Small-scale grain and flour processing",
    sector: "Food Processing",
    active: true,
  },
  {
    name: "Dal Mill",
    slug: "dal-mill",
    description: "Pulse processing and dal production",
    sector: "Food Processing",
    active: true,
  },
  {
    name: "Spice Grinding & Packaging",
    slug: "spice-grinding-packaging",
    description: "Grinding, processing and packaging of spices",
    sector: "Food Processing",
    active: true,
  },
  {
    name: "Pickle & Papad Making",
    slug: "pickle-papad-making",
    description: "Production of pickles, papad and similar food products",
    sector: "Food Processing",
    active: true,
  },
  {
    name: "Bakery",
    slug: "bakery",
    description: "Small-scale bakery and baked food products",
    sector: "Food Processing",
    active: true,
  },
  {
    name: "Food Processing Unit",
    slug: "food-processing-unit",
    description: "Small-scale processing and packaging of food products",
    sector: "Food Processing",
    active: true,
  },
  {
    name: "Grocery / Kirana Store",
    slug: "grocery-kirana-store",
    description: "Local store selling groceries and daily-use products",
    sector: "Retail",
    active: true,
  },
  {
    name: "Vegetable & Fruit Shop",
    slug: "vegetable-fruit-shop",
    description: "Retail sale of fresh vegetables and fruits",
    sector: "Retail",
    active: true,
  },
  {
    name: "Agri-Input Store",
    slug: "agri-input-store",
    description: "Sale of agricultural inputs and farming supplies",
    sector: "Retail",
    active: true,
  },
  {
    name: "Clothing Store",
    slug: "clothing-store",
    description: "Retail clothing and garments business",
    sector: "Retail",
    active: true,
  },
  {
    name: "Hardware & Building Material Store",
    slug: "hardware-building-material-store",
    description: "Sale of hardware, tools and construction materials",
    sector: "Retail",
    active: true,
  },
  {
    name: "Tailoring & Stitching",
    slug: "tailoring-stitching",
    description: "Tailoring, stitching and clothing alteration services",
    sector: "Textile",
    active: true,
  },
  {
    name: "Handloom & Weaving",
    slug: "handloom-weaving",
    description: "Production of handloom and woven textile products",
    sector: "Textile",
    active: true,
  },
  {
    name: "Handicrafts",
    slug: "handicrafts",
    description: "Production and sale of handmade craft products",
    sector: "Handicrafts",
    active: true,
  },
  {
    name: "Pottery & Terracotta",
    slug: "pottery-terracotta",
    description: "Production of pottery and terracotta products",
    sector: "Handicrafts",
    active: true,
  },
  {
    name: "Bamboo / Cane Products",
    slug: "bamboo-cane-products",
    description: "Production of bamboo and cane-based products",
    sector: "Handicrafts",
    active: true,
  },
  {
    name: "Mobile Repair Shop",
    slug: "mobile-repair-shop",
    description: "Mobile phone repair and related services",
    sector: "Repair & Services",
    active: true,
  },
  {
    name: "Two-Wheeler Repair",
    slug: "two-wheeler-repair",
    description: "Repair and maintenance of motorcycles and scooters",
    sector: "Repair & Services",
    active: true,
  },
  {
    name: "Tractor & Farm Machinery Repair",
    slug: "tractor-farm-machinery-repair",
    description: "Repair and maintenance of tractors and agricultural machinery",
    sector: "Repair & Services",
    active: true,
  },
  {
    name: "Electrical & Electronics Repair",
    slug: "electrical-electronics-repair",
    description: "Repair of electrical and electronic appliances",
    sector: "Repair & Services",
    active: true,
  },
  {
    name: "Carpentry & Furniture",
    slug: "carpentry-furniture",
    description: "Furniture making and carpentry services",
    sector: "Manufacturing",
    active: true,
  },
  {
    name: "Welding & Metal Fabrication",
    slug: "welding-metal-fabrication",
    description: "Metal welding, fabrication and related services",
    sector: "Manufacturing",
    active: true,
  },
  {
    name: "Beauty Parlour / Salon",
    slug: "beauty-parlour-salon",
    description: "Beauty, grooming and personal care services",
    sector: "Personal Services",
    active: true,
  },
  {
    name: "Laundry & Dry Cleaning",
    slug: "laundry-dry-cleaning",
    description: "Laundry, washing and garment care services",
    sector: "Personal Services",
    active: true,
  },
  {
    name: "Photography & Videography",
    slug: "photography-videography",
    description: "Photography and videography services for local events",
    sector: "Services",
    active: true,
  },
  {
    name: "Printing & Photocopy Center",
    slug: "printing-photocopy-center",
    description: "Printing, photocopying and document services",
    sector: "Digital Services",
    active: true,
  },
  {
    name: "Digital Service / CSC Center",
    slug: "digital-service-csc-center",
    description: "Local digital and citizen service center",
    sector: "Digital Services",
    active: true,
  },
  {
    name: "Tuition / Skill Training Center",
    slug: "tuition-skill-training-center",
    description: "Local tuition and skill development services",
    sector: "Education",
    active: true,
  },
  {
    name: "Restaurant / Dhaba / Food Stall",
    slug: "restaurant-dhaba-food-stall",
    description: "Small local food service business",
    sector: "Food & Hospitality",
    active: true,
  },
  {
    name: "Solar Installation & Services",
    slug: "solar-installation-services",
    description: "Solar equipment installation and maintenance services",
    sector: "Renewable Energy",
    active: true,
  },
];

async function seedBusinessCategories() {
  try {
    await connectDB();

    for (const category of categories) {
      await BusinessCategory.updateOne(
        { slug: category.slug },
        { $set: category },
        { upsert: true }
      );
    }

    console.log(
      `Business categories seeded successfully: ${categories.length} categories`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error seeding business categories:", error);
    process.exit(1);
  }
}

seedBusinessCategories();