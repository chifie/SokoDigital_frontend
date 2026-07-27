export const PRODUCT_IMAGES = {
  electronics: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
  fashion: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
  agri: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
  furniture: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
};

export const CATEGORY_NAMES = [
  "Electronics", "Fashion", "Agriculture", "Phones", "Computers", "Furniture",
  "Beauty", "Food", "Automotive", "Books", "Sports", "Health",
];

export type Product = {
  img: string;
  title: string;
  seller: string;
  price: string;
  old: string;
  rating: number;
  discount: number;
  category: string;
};

export const PRODUCTS: Product[] = [
  {
    img: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Wireless Noise-Cancelling Over-Ear Headphones",
    seller: "AudioPro Global",
    price: "$129.99",
    old: "$189.00",
    rating: 4.8,
    discount: 31,
    category: "Electronics",
  },
  {
    img: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Premium Cotton Casual Shirt — Unisex Fit",
    seller: "Urban Threads Co.",
    price: "$34.50",
    old: "$59.00",
    rating: 4.7,
    discount: 42,
    category: "Fashion",
  },
  {
    img: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Organic Face Serum Set — Vitamin C + Retinol",
    seller: "PureGlow Cosmetics",
    price: "$28.00",
    old: "$45.00",
    rating: 4.9,
    discount: 37,
    category: "Beauty",
  },
  {
    img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Scandinavian Lounge Chair — Solid Oak Frame",
    seller: "NordicLiving",
    price: "$389.00",
    old: "$549.00",
    rating: 4.7,
    discount: 29,
    category: "Furniture",
  },
  {
    img: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Latest 5G Smartphone — 256GB, 108MP Camera",
    seller: "MobileWorld",
    price: "$549.00",
    old: "$799.00",
    rating: 4.8,
    discount: 31,
    category: "Phones",
  },
  {
    img: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Ultra-Slim 15\" Laptop — 16GB RAM, 512GB SSD",
    seller: "ComputeHub",
    price: "$899.00",
    old: "$1,199.00",
    rating: 4.6,
    discount: 25,
    category: "Computers",
  },
  {
    img: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Premium Arabica Coffee Beans — 1kg Whole Bean",
    seller: "Mountain Roasters",
    price: "$18.99",
    old: "$26.00",
    rating: 4.9,
    discount: 27,
    category: "Agriculture",
  },
  {
    img: "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1600&q=100",
    title: "Pro Running Shoes — Lightweight Mesh, Unisex",
    seller: "PeakSports",
    price: "$79.00",
    old: "$120.00",
    rating: 4.8,
    discount: 34,
    category: "Sports",
  },
];

export const SHOPS = [
  { name: "AudioPro Global", city: "Berlin", rating: 4.9, products: 320, hue: "from-primary to-accent", category: "Electronics" },
  { name: "Urban Threads Co.", city: "New York", rating: 4.8, products: 210, hue: "from-primary to-secondary", category: "Fashion" },
  { name: "Mountain Roasters", city: "São Paulo", rating: 5.0, products: 96, hue: "from-accent to-primary", category: "Agriculture" },
  { name: "NordicLiving", city: "Stockholm", rating: 4.7, products: 145, hue: "from-secondary to-primary", category: "Furniture" },
  { name: "PureGlow Cosmetics", city: "Seoul", rating: 4.9, products: 158, hue: "from-primary to-accent", category: "Beauty" },
  { name: "MobileWorld", city: "Shenzhen", rating: 4.6, products: 172, hue: "from-accent to-secondary", category: "Electronics" },
  { name: "PeakSports", city: "Portland", rating: 4.8, products: 189, hue: "from-secondary to-accent", category: "Sports" },
  { name: "ComputeHub", city: "Taipei", rating: 4.7, products: 134, hue: "from-primary to-secondary", category: "Computers" },
];

export const CATEGORIES = [
  { name: "Electronics", count: "12,400+" },
  { name: "Fashion", count: "9,320+" },
  { name: "Agriculture", count: "4,150+" },
  { name: "Phones", count: "6,800+" },
  { name: "Computers", count: "3,240+" },
  { name: "Furniture", count: "2,100+" },
  { name: "Beauty", count: "5,600+" },
  { name: "Food", count: "7,900+" },
  { name: "Automotive", count: "1,850+" },
  { name: "Books", count: "3,110+" },
  { name: "Sports", count: "2,300+" },
  { name: "Health", count: "4,700+" },
];
