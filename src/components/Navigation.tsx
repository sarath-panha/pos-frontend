"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Package,
    ShoppingCart,
    BarChart2,
    User,
} from "lucide-react";

const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/inventory", label: "Stock", icon: Package },
    { href: "/pos", label: "POS", icon: ShoppingCart },
    { href: "/report", label: "Report", icon: BarChart2 },
    { href: "/profile", label: "Profile", icon: User },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant pb-[env(safe-area-inset-bottom)] z-50">
            <div className="flex justify-evenly items-center h-[72px] w-full max-w-lg mx-auto px-1">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        pathname === href ||
                        (href !== "/" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center justify-center w-full h-full rounded-xl m3-press gap-1"
                        >
                            <div
                                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${isActive
                                        ? "bg-primary-container text-on-primary-container"
                                        : "text-on-surface-variant"
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 1.75}
                                />
                            </div>
                            <span
                                className={`text-[10px] font-semibold tracking-wide transition-colors ${isActive ? "text-primary" : "text-on-surface-variant"
                                    }`}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
