import { Product, Sale } from "./types";

const now = () => new Date().toISOString();
const date = (d: string) => d;

export let products: Product[] = [
    {
        id: "p1", name: "Coffee Beans 1kg",
        description: "Premium arabica coffee beans, medium roast",
        category: "Café", sku: "CAF-001", price: 15.00, cost: 9.00,
        qty: 45, low_stock_level: 10, unit: "kg",
        supplier: "Bean Bros Co.", imageUrl: "https://picsum.photos/seed/coffee/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p2", name: "Paper Cups (100)",
        description: "Disposable paper cups, 8oz, pack of 100",
        category: "Café", sku: "CAF-002", price: 5.50, cost: 2.80,
        qty: 12, low_stock_level: 5, unit: "pack",
        supplier: "SupplyPlus", imageUrl: "https://picsum.photos/seed/cups/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p3", name: "Croissant",
        description: "Freshly baked butter croissant",
        category: "Café", sku: "CAF-003", price: 3.00, cost: 1.20,
        qty: 0, low_stock_level: 5, unit: "pcs",
        expiry_date: "2026-02-21", supplier: "Local Bakery",
        imageUrl: "https://picsum.photos/seed/croissant/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p4", name: "Paracetamol 500mg",
        description: "Paracetamol tablets 500mg, box of 10",
        category: "Pharmacy", sku: "PHA-001", price: 2.50, cost: 1.00,
        qty: 150, low_stock_level: 20, unit: "box",
        expiry_date: "2027-06-01", supplier: "MedStore",
        imageUrl: "https://picsum.photos/seed/paracetamol/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p5", name: "Vitamin C 1000mg",
        description: "Effervescent Vitamin C tablets, tube of 20",
        category: "Pharmacy", sku: "PHA-002", price: 8.00, cost: 4.50,
        qty: 30, low_stock_level: 10, unit: "tube",
        expiry_date: "2027-01-01", supplier: "MedStore",
        imageUrl: "https://picsum.photos/seed/vitaminc/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p6", name: "Shampoo 500ml",
        description: "Anti-dandruff shampoo, 500ml bottle",
        category: "Retail", sku: "RET-001", price: 6.00, cost: 3.20,
        qty: 25, low_stock_level: 5, unit: "bottle",
        supplier: "CleanCo", imageUrl: "https://picsum.photos/seed/shampoo/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p7", name: "Toothpaste 120g",
        description: "Whitening toothpaste with fluoride, 120g",
        category: "Retail", sku: "RET-002", price: 3.50, cost: 1.80,
        qty: 60, low_stock_level: 10, unit: "pcs",
        supplier: "CleanCo", imageUrl: "https://picsum.photos/seed/toothpaste/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
    {
        id: "p8", name: "Hand Sanitizer 100ml",
        description: "Alcohol-based hand sanitizer, 70% ethanol",
        category: "Pharmacy", sku: "PHA-003", price: 4.00, cost: 2.00,
        qty: 5, low_stock_level: 8, unit: "bottle",
        expiry_date: "2026-12-01", supplier: "MedStore",
        imageUrl: "https://picsum.photos/seed/sanitizer/400/400",
        is_active: true, created_at: date("2026-01-01T00:00:00Z"), updated_at: now(),
    },
];

export let sales: Sale[] = [
    {
        id: "s1",
        items: [{ ...products[0], quantity: 2 }],
        totalAmount: 30.00, paymentMethod: "card",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: "s2",
        items: [{ ...products[2], quantity: 3 }],
        totalAmount: 9.00, paymentMethod: "cash",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
];

export const updateProducts = (newProducts: Product[]) => { products = newProducts; };
export const updateSales = (newSales: Sale[]) => { sales = newSales; };
