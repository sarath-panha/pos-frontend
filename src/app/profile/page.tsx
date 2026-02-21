"use client";

import { User, Store, Bell, Shield, Globe, HelpCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { AppearanceSection } from "@/components/profile/AppearanceSection";
import { MenuSection } from "@/components/profile/MenuSection";
import { SignOutButton } from "@/components/profile/SignOutButton";

const INFO_SECTIONS = [
    {
        title: "Business",
        items: [
            { label: "Store Name", value: "My Shop", icon: Store },
            { label: "Notifications", icon: Bell },
        ],
    },
    {
        title: "Preferences",
        items: [
            { label: "Language", value: "English", icon: Globe },
        ],
    },
    {
        title: "Support",
        items: [
            { label: "Privacy & Security", icon: Shield },
            { label: "Help & Support", icon: HelpCircle },
        ],
    },
];

export default function ProfilePage() {
    const { isDark, toggleDark } = useTheme();

    return (
        <div className="bg-surface">
            <div className="max-w-lg mx-auto px-4 py-5 pb-8 space-y-5 animate-in fade-in duration-300">

                <ProfileCard />

                <AppearanceSection isDark={isDark} onToggle={toggleDark} />

                {INFO_SECTIONS.map(section => (
                    <MenuSection key={section.title} title={section.title} items={section.items} />
                ))}

                <SignOutButton />

                <p className="text-center text-[11px] text-on-surface-variant pb-2">
                    SMEApp v1.0.0
                </p>
            </div>
        </div>
    );
}
