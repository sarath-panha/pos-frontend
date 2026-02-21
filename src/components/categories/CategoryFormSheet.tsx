"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Category } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import { FormField, InputBox } from "@/components/ui/FormField";

interface CategoryFormSheetProps {
    mode: "add" | "edit";
    initial?: Category;
    existingSlugs: Array<{ id: string; slug: string }>;
    onSave: (data: { name: string; slug: string; description: string }) => Promise<void>;
    onClose: () => void;
}

export function CategoryFormSheet({ mode, initial, existingSlugs, onSave, onClose }: CategoryFormSheetProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
    const nameRef = useRef<HTMLInputElement>(null);

    // Auto-focus on open
    useEffect(() => { nameRef.current?.focus(); }, []);

    // Auto-generate slug from name unless user manually edited it
    useEffect(() => {
        if (!slugManuallyEdited) {
            setSlug(slugify(name));
        }
    }, [name, slugManuallyEdited]);

    const isSlugDuplicate = (s: string) => {
        const others = existingSlugs.filter(e => e.id !== initial?.id);
        return others.some(e => e.slug === s);
    };

    const validate = () => {
        const e: typeof errors = {};
        if (!name.trim()) e.name = "Name is required";
        if (!slug.trim()) e.slug = "Slug is required";
        else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) e.slug = "Only lowercase letters, numbers, and hyphens";
        else if (isSlugDuplicate(slug)) e.slug = "This slug is already taken";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        await onSave({ name: name.trim(), slug: slug.trim(), description: description.trim() });
        setSaving(false);
    };

    const slugStatus = !slug
        ? null
        : isSlugDuplicate(slug)
            ? "duplicate"
            : /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
                ? "ok"
                : "invalid";

    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30" onClick={() => !saving && onClose()} />

            <div className="relative w-full max-w-lg mx-auto bg-surface rounded-t-3xl border-t border-outline-variant animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-outline-variant" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-3 border-b border-outline-variant">
                    <h2 className="text-base font-bold text-on-surface">
                        {mode === "add" ? "New Category" : "Edit Category"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container m3-press"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="px-5 py-4 space-y-4">
                    {/* Name */}
                    <FormField label="Name" required error={errors.name}>
                        <InputBox error={errors.name}>
                            <input
                                ref={nameRef}
                                type="text"
                                placeholder="e.g. Food & Beverage"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors(p => ({ ...p, name: undefined }));
                                }}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                            />
                        </InputBox>
                    </FormField>

                    {/* Slug */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Slug <span className="text-error">*</span>
                        </label>
                        <div className={`flex items-center h-11 bg-surface-container-lowest border rounded-xl px-3.5 transition-colors ${errors.slug ? "border-error" : "border-outline-variant focus-within:border-primary"
                            }`}>
                            <span className="text-on-surface-variant text-sm select-none">/</span>
                            <input
                                type="text"
                                placeholder="auto-generated"
                                value={slug}
                                onChange={e => {
                                    setSlug(e.target.value);
                                    setSlugManuallyEdited(true);
                                    if (errors.slug) setErrors(p => ({ ...p, slug: undefined }));
                                }}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface font-mono placeholder:text-on-surface-variant"
                            />
                            {/* Live status indicator */}
                            {slug && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${slugStatus === "ok"
                                    ? "bg-primary-container text-on-primary-container"
                                    : "bg-error-container text-on-error-container"
                                    }`}>
                                    {slugStatus === "ok" ? "available" : slugStatus === "duplicate" ? "taken" : "invalid"}
                                </span>
                            )}
                        </div>
                        {errors.slug
                            ? <p className="text-xs text-error">{errors.slug}</p>
                            : <p className="text-xs text-on-surface-variant">Lowercase letters, numbers, and hyphens only. Auto-generated from name.</p>
                        }
                    </div>

                    {/* Description */}
                    <FormField label="Description">
                        <textarea
                            rows={2}
                            placeholder="Short description (optional)"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none resize-none focus:border-primary transition-colors"
                        />
                    </FormField>
                </div>

                {/* Actions */}
                <div className="px-5 pb-6 pt-1 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors m3-press disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3 rounded-xl bg-primary text-on-primary border border-primary/20 text-sm font-bold flex items-center justify-center m3-press disabled:opacity-60"
                    >
                        {saving
                            ? <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                            : mode === "add" ? "Add Category" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
