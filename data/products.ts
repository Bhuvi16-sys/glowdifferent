export type SkinType = "Oily" | "Dry" | "Combo" | "Sensitive";
export type Category = "Serums" | "Moisturizers" | "SPF" | "Cleansers" | "Masks";
export type Badge = "Bestseller" | "New Drop" | "Trending";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  skinType: SkinType[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: Badge;
  description: string;
  ingredients: string;
  howToUse: string;
  images: string[];
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cloud Dew Hydrating Serum",
    price: 38,
    category: "Serums",
    skinType: ["Dry", "Combo", "Sensitive"],
    rating: 4.9,
    reviewCount: 2847,
    stock: 4,
    badge: "Bestseller",
    description:
      "A weightless hyaluronic acid serum that floods skin with 72-hour hydration. Layer under moisturizer for that glass-skin glow everyone keeps asking about.",
    ingredients:
      "Aqua, Hyaluronic Acid, Niacinamide, Panthenol, Glycerin, Aloe Barbadensis Leaf Juice, Sodium PCA, Allantoin",
    howToUse:
      "Apply 2-3 drops to clean, damp skin morning and night. Pat gently until absorbed. Follow with moisturizer and SPF in AM.",
    images: [
      "/images/products/1.png",
    ],
    reviews: [
      { id: "r1", author: "Maya K.", rating: 5, date: "2026-05-12", comment: "My skin has never been this dewy. Obsessed!", verified: true, helpful: 42 },
      { id: "r2", author: "Jordan L.", rating: 5, date: "2026-04-28", comment: "Holy grail serum. Repurchasing forever.", verified: true, helpful: 31 },
    ],
  },
  {
    id: "2",
    name: "Pink Prism Vitamin C Drops",
    price: 45,
    category: "Serums",
    skinType: ["Oily", "Combo", "Dry"],
    rating: 4.8,
    reviewCount: 1923,
    stock: 12,
    badge: "Trending",
    description:
      "15% stabilized vitamin C meets pink algae extract for bright, even-toned skin. Fades dark spots without the sting.",
    ingredients:
      "Ascorbic Acid, Ferulic Acid, Vitamin E, Pink Algae Extract, Squalane, Rosehip Oil",
    howToUse: "Use in AM only. 4 drops after cleansing, before moisturizer. Always follow with SPF 30+.",
    images: [
      "/images/products/2.png",
    ],
    reviews: [
      { id: "r3", author: "Alex T.", rating: 5, date: "2026-05-01", comment: "Dark spots fading after 3 weeks!", verified: true, helpful: 28 },
    ],
  },
  {
    id: "3",
    name: "Midnight Reset Retinol Oil",
    price: 52,
    category: "Serums",
    skinType: ["Dry", "Combo"],
    rating: 4.7,
    reviewCount: 876,
    stock: 8,
    badge: "New Drop",
    description:
      "Encapsulated 0.3% retinol in a cushiony oil base. Smooths fine lines while you sleep — zero flaking drama.",
    ingredients: "Squalane, Retinol, Bakuchiol, Rosehip Seed Oil, Tocopherol, Chamomile Extract",
    howToUse: "PM only. Start 2x/week, build to nightly. Avoid eye area. Use SPF daily.",
    images: [
      "/images/products/3.png",
    ],
    reviews: [],
  },
  {
    id: "4",
    name: "Velvet Cloud Moisturizer",
    price: 34,
    category: "Moisturizers",
    skinType: ["Dry", "Sensitive"],
    rating: 4.9,
    reviewCount: 3421,
    stock: 15,
    badge: "Bestseller",
    description:
      "Rich but never greasy. Ceramides + shea butter rebuild your moisture barrier overnight. Wakeup skin hits different.",
    ingredients: "Ceramide NP, Shea Butter, Squalane, Centella Asiatica, Peptide Complex, Glycerin",
    howToUse: "Apply as last step in PM routine. Can also use as day cream for dry skin types.",
    images: [
      "/images/products/4.png",
    ],
    reviews: [
      { id: "r4", author: "Sam R.", rating: 5, date: "2026-05-08", comment: "Saved my winter skin. No more flaking!", verified: true, helpful: 55 },
    ],
  },
  {
    id: "5",
    name: "Gel Crush Oil-Free Gel",
    price: 28,
    category: "Moisturizers",
    skinType: ["Oily", "Combo"],
    rating: 4.6,
    reviewCount: 1543,
    stock: 22,
    description:
      "Oil-free gel-cream that mattifies without drying. Niacinamide keeps pores looking snatched all day.",
    ingredients: "Niacinamide, Hyaluronic Acid, Zinc PCA, Aloe Vera, Green Tea Extract",
    howToUse: "Apply to clean skin AM and PM. Perfect under makeup as a primer alternative.",
    images: [
      "/images/products/5.png",
    ],
    reviews: [],
  },
  {
    id: "6",
    name: "Sunbeam SPF 50 Glow Stick",
    price: 26,
    category: "SPF",
    skinType: ["Oily", "Dry", "Combo", "Sensitive"],
    rating: 4.8,
    reviewCount: 2109,
    stock: 18,
    badge: "Trending",
    description:
      "Broad-spectrum SPF 50 in a mess-free stick. Leaves a subtle luminous finish — reapply every 2 hours, no white cast.",
    ingredients: "Zinc Oxide, Titanium Dioxide, Vitamin E, Jojoba Oil, Raspberry Seed Oil",
    howToUse: "Glide directly onto face and neck. Reapply every 2 hours or after swimming/sweating.",
    images: [
      "/images/products/6.png",
    ],
    reviews: [],
  },
  {
    id: "7",
    name: "Daily Shield Fluid SPF 40",
    price: 32,
    category: "SPF",
    skinType: ["Oily", "Combo", "Sensitive"],
    rating: 4.7,
    reviewCount: 987,
    stock: 11,
    description:
      "Featherlight fluid sunscreen that doubles as a makeup base. Invisible finish, maximum protection.",
    ingredients: "Avobenzone, Homosalate, Octisalate, Niacinamide, Licorice Root Extract",
    howToUse: "Apply generously as last skincare step in AM. Wait 15 min before sun exposure.",
    images: [
      "/images/products/7.png",
    ],
    reviews: [],
  },
  {
    id: "8",
    name: "Bubble Pop Enzyme Cleanser",
    price: 24,
    category: "Cleansers",
    skinType: ["Oily", "Combo"],
    rating: 4.8,
    reviewCount: 2654,
    stock: 30,
    badge: "Bestseller",
    description:
      "Foaming gel cleanser with papaya enzymes that melts makeup and unclogs pores. Skin feels squeaky-clean, never tight.",
    ingredients: "Papaya Enzyme, Salicylic Acid, Coconut-derived Surfactants, Glycerin, Tea Tree Oil",
    howToUse: "Massage onto damp skin for 60 seconds. Rinse with lukewarm water. Use AM and PM.",
    images: [
      "/images/products/8.png",
    ],
    reviews: [],
  },
  {
    id: "9",
    name: "Milky Way Cream Cleanser",
    price: 22,
    category: "Cleansers",
    skinType: ["Dry", "Sensitive"],
    rating: 4.9,
    reviewCount: 1789,
    stock: 25,
    description:
      "Creamy, non-foaming cleanser that removes SPF and makeup while leaving skin soft and nourished.",
    ingredients: "Oat Kernel Extract, Colloidal Oatmeal, Squalane, Chamomile, Calendula",
    howToUse: "Massage onto dry or damp skin. Remove with warm cloth or rinse. AM and PM.",
    images: [
      "/images/products/9.png",
    ],
    reviews: [],
  },
  {
    id: "10",
    name: "Glow Getter Clay Mask",
    price: 29,
    category: "Masks",
    skinType: ["Oily", "Combo"],
    rating: 4.6,
    reviewCount: 1234,
    stock: 14,
    badge: "New Drop",
    description:
      "Kaolin clay mask with pink clay and witch hazel. Detoxes pores in 10 minutes without that cracked-earth feeling.",
    ingredients: "Kaolin Clay, Pink Clay, Witch Hazel, Aloe Vera, Peppermint Oil",
    howToUse: "Apply thin layer to clean skin. Leave 10 min. Rinse. Use 1-2x per week.",
    images: [
      "/images/products/10.png",
    ],
    reviews: [],
  },
  {
    id: "11",
    name: "Overnight Recovery Mask",
    price: 36,
    category: "Masks",
    skinType: ["Dry", "Combo", "Sensitive"],
    rating: 4.8,
    reviewCount: 892,
    stock: 9,
    description:
      "Sleep mask that works while you dream. Wake up to plump, bouncy skin with zero effort.",
    ingredients: "Peptides, Hyaluronic Acid, Shea Butter, Vitamin B5, Lavender Extract",
    howToUse: "Apply generous layer as last PM step 2-3x per week. No need to rinse.",
    images: [
      "/images/products/11.png",
    ],
    reviews: [],
  },
  {
    id: "12",
    name: "Niacinamide 10% Booster",
    price: 18,
    category: "Serums",
    skinType: ["Oily", "Combo"],
    rating: 4.7,
    reviewCount: 3210,
    stock: 40,
    badge: "Bestseller",
    description: "High-strength niacinamide that shrinks the look of pores and controls oil like a boss.",
    ingredients: "Niacinamide 10%, Zinc PCA 1%, Hyaluronic Acid, Allantoin",
    howToUse: "Apply after toner, before moisturizer. AM and PM.",
    images: [
      "/images/products/12.png",
    ],
    reviews: [],
  },
  {
    id: "13",
    name: "Barrier Repair Balm",
    price: 42,
    category: "Moisturizers",
    skinType: ["Dry", "Sensitive"],
    rating: 4.9,
    reviewCount: 567,
    stock: 7,
    badge: "Trending",
    description: "Intensive repair balm for compromised skin barriers. Dermatologist-loved, TikTok-approved.",
    ingredients: "Ceramides, Cholesterol, Fatty Acids, Panthenol, Madecassoside",
    howToUse: "Apply to irritated areas or all over as needed. Can layer over moisturizer.",
    images: [
      "/images/products/13.png",
    ],
    reviews: [],
  },
  {
    id: "14",
    name: "Pore Refining Toner",
    price: 20,
    category: "Cleansers",
    skinType: ["Oily", "Combo"],
    rating: 4.5,
    reviewCount: 1432,
    stock: 28,
    description: "AHA/BHA toner that gently exfoliates and preps skin for the rest of your routine.",
    ingredients: "Glycolic Acid, Salicylic Acid, Witch Hazel, Rose Water, Aloe",
    howToUse: "Swipe onto clean skin with cotton pad. Start 3x/week, increase as tolerated. PM preferred.",
    images: [
      "/images/products/14.png",
    ],
    reviews: [],
  },
  {
    id: "15",
    name: "Lip Glow Oil SPF 15",
    price: 16,
    category: "SPF",
    skinType: ["Dry", "Combo", "Sensitive"],
    rating: 4.8,
    reviewCount: 4521,
    stock: 50,
    badge: "Bestseller",
    description: "Tinted lip oil with SPF 15. Juicy, glossy lips that are actually protected from UV.",
    ingredients: "Castor Oil, Vitamin E, Octinoxate, Hibiscus Extract, Natural Pigments",
    howToUse: "Apply directly to lips throughout the day. Reapply after eating/drinking.",
    images: [
      "/images/products/15.png",
    ],
    reviews: [],
  },
  {
    id: "16",
    name: "Peptide Plump Eye Cream",
    price: 48,
    category: "Moisturizers",
    skinType: ["Dry", "Combo", "Sensitive"],
    rating: 4.7,
    reviewCount: 734,
    stock: 6,
    badge: "New Drop",
    description: "Peptide-powered eye cream that depuffs and brightens dark circles. No more looking tired on Zoom.",
    ingredients: "Peptide Complex, Caffeine, Vitamin K, Hyaluronic Acid, Cucumber Extract",
    howToUse: "Pat tiny amount around orbital bone AM and PM. Don't rub.",
    images: [
      "/images/products/16.png",
    ],
    reviews: [],
  },
  {
    id: "17",
    name: "Charcoal Detox Scrub",
    price: 26,
    category: "Cleansers",
    skinType: ["Oily", "Combo"],
    rating: 4.4,
    reviewCount: 876,
    stock: 19,
    description: "Activated charcoal scrub that buffs away dead skin for instant smoothness.",
    ingredients: "Activated Charcoal, Jojoba Beads, Coconut Oil, Tea Tree, Eucalyptus",
    howToUse: "Massage gently onto damp skin 2-3x per week. Avoid if using retinol same night.",
    images: [
      "/images/products/17.png",
    ],
    reviews: [],
  },
  {
    id: "18",
    name: "Hydrating Sheet Mask 5-Pack",
    price: 15,
    category: "Masks",
    skinType: ["Dry", "Combo", "Sensitive"],
    rating: 4.9,
    reviewCount: 5678,
    stock: 100,
    badge: "Trending",
    description: "Bio-cellulose sheet masks soaked in 30ml of essence. Self-care Sunday essential.",
    ingredients: "Hyaluronic Acid, Snail Mucin, Centella, Green Tea, Collagen",
    howToUse: "Apply to clean skin for 15-20 min. Pat remaining essence in. No rinse needed.",
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop",
    ],
    reviews: [],
  },
  {
    id: "19",
    name: "Salicylic Spot Treatment",
    price: 14,
    category: "Serums",
    skinType: ["Oily", "Combo"],
    rating: 4.6,
    reviewCount: 2341,
    stock: 35,
    description: "2% salicylic acid spot treatment that shrinks pimples overnight. No dry patches.",
    ingredients: "Salicylic Acid 2%, Tea Tree Oil, Zinc, Niacinamide, Witch Hazel",
    howToUse: "Dab onto blemish after cleansing. Use PM or under makeup with SPF.",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
    ],
    reviews: [],
  },
  {
    id: "20",
    name: "Mineral SPF 30 Tinted Moisturizer",
    price: 38,
    category: "SPF",
    skinType: ["Sensitive", "Dry", "Combo"],
    rating: 4.8,
    reviewCount: 1567,
    stock: 13,
    badge: "Bestseller",
    description: "Sheer-tint mineral SPF that evens skin tone while protecting. Your no-makeup makeup base.",
    ingredients: "Zinc Oxide, Iron Oxides, Squalane, Vitamin E, Iron Oxide Pigments",
    howToUse: "Apply as final AM step. Blend with fingers or sponge for even coverage.",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    ],
    reviews: [],
  },
];

export const categories: Category[] = ["Serums", "Moisturizers", "SPF", "Cleansers", "Masks"];
export const skinTypes: SkinType[] = ["Oily", "Dry", "Combo", "Sensitive"];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.badge === "Trending" || p.badge === "New Drop").slice(0, 8);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.badge === "Bestseller").slice(0, 6);
}
