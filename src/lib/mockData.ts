import { Product, Sale } from "./types";

export let products: Product[] = [
    {
        id: "p1",
        name: "Coffee Beans 1kg",
        price: 15.00,
        stock: 45,
        category: "Café",
        imageUrl: "https://picsum.photos/seed/coffee/400/400",
    },
    {
        id: "p2",
        name: "Paper Cups (100)",
        price: 5.50,
        stock: 12,
        category: "Café",
        imageUrl: "https://picsum.photos/seed/cups/400/400",
    },
    {
        id: "p3",
        name: "Croissant",
        price: 3.00,
        stock: 0,
        category: "Café",
        imageUrl: "https://picsum.photos/seed/croissant/400/400",
    },
    {
        id: "p4",
        name: "Paracetamol",
        price: 2.50,
        stock: 150,
        category: "Pharmacy",
        imageUrl: "https://picsum.photos/seed/paracetamol/400/400",
    },
    {
        id: "p5",
        name: "Vitamin C",
        price: 8.00,
        stock: 30,
        category: "Pharmacy",
        imageUrl: "https://picsum.photos/seed/vitaminc/400/400",
    },
    {
        id: "p6",
        name: "Shampoo 500ml",
        price: 6.00,
        stock: 25,
        category: "Retail",
        imageUrl: "https://picsum.photos/seed/shampoo/400/400",
    },
    {
        id: "p7",
        name: "Toothpaste",
        price: 3.50,
        stock: 60,
        category: "Retail",
        imageUrl: "https://picsum.photos/seed/toothpaste/400/400",
    },
    {
        id: "p8",
        name: "Hand Sanitizer",
        price: 4.00,
        stock: 5,
        category: "Pharmacy",
        imageUrl: "https://picsum.photos/seed/sanitizer/400/400",
    },
];

export let sales: Sale[] = [
    {
        id: "s1",
        items: [{ id: "p1", name: "Coffee Beans 1kg", price: 15.00, stock: 45, category: "Café", imageUrl: "https://picsum.photos/seed/coffee/400/400", quantity: 2 }],
        totalAmount: 30.00,
        paymentMethod: "card",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: "s2",
        items: [{ id: "p3", name: "Croissant", price: 3.00, stock: 0, category: "Café", imageUrl: "https://picsum.photos/seed/croissant/400/400", quantity: 3 }],
        totalAmount: 9.00,
        paymentMethod: "cash",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
];

export const updateProducts = (newProducts: Product[]) => { products = newProducts; };
export const updateSales = (newSales: Sale[]) => { sales = newSales; };
