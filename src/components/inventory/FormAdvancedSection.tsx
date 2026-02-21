"use client";

import { ChevronRight, ScanLine } from "lucide-react";
import { FormField, InputBox } from "@/components/ui/FormField";

const UNITS = ["pcs", "kg", "gram", "liter", "ml", "box", "pack", "bottle", "tube", "bag"];

interface AdvancedValues {
    cost: string;
    unit: string;
    sku: string;
    barcode: string;
    low_stock_level: string;
    supplier: string;
    expiry_date: string;
}

interface FormAdvancedSectionProps {
    visible: boolean;
    onToggle: () => void;
    values: AdvancedValues;
    onChange: (field: keyof AdvancedValues, value: string) => void;
    onScanBarcode: () => void;
}

export function FormAdvancedSection({
    visible,
    onToggle,
    values,
    onChange,
    onScanBarcode,
}: FormAdvancedSectionProps) {
    return (
        <>
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1 text-primary text-sm font-semibold active:opacity-70"
            >
                <ChevronRight
                    size={15}
                    className={`transition-transform duration-200 ${visible ? "rotate-90" : ""}`}
                />
                {visible ? "Hide advanced details" : "Advanced details"}
            </button>

            {visible && (
                <>
                    {/* Cost + Unit */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Cost Price">
                            <InputBox>
                                <span className="text-on-surface-variant text-sm mr-1">$</span>
                                <input
                                    type="number" step="0.01" min="0" placeholder="0.00"
                                    value={values.cost}
                                    onChange={e => onChange("cost", e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </InputBox>
                        </FormField>
                        <FormField label="Unit">
                            <InputBox>
                                <select
                                    value={values.unit}
                                    onChange={e => onChange("unit", e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-on-surface"
                                >
                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </InputBox>
                        </FormField>
                    </div>

                    {/* SKU */}
                    <FormField label="SKU">
                        <InputBox>
                            <input
                                type="text" placeholder="e.g. CAF-001"
                                value={values.sku}
                                onChange={e => onChange("sku", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                            />
                        </InputBox>
                    </FormField>

                    {/* Barcode */}
                    <FormField label="Barcode">
                        <InputBox className="!pr-1.5">
                            <input
                                type="text" placeholder="Scan or enter barcode"
                                value={values.barcode}
                                onChange={e => onChange("barcode", e.target.value)}
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                            />
                            <button
                                type="button" onClick={onScanBarcode}
                                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:opacity-70 transition-colors ml-1"
                            >
                                <ScanLine size={14} />
                            </button>
                        </InputBox>
                    </FormField>

                    {/* Low Stock + Supplier */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Low Stock Alert">
                            <InputBox>
                                <input
                                    type="number" min="0" placeholder="5"
                                    value={values.low_stock_level}
                                    onChange={e => onChange("low_stock_level", e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </InputBox>
                        </FormField>
                        <FormField label="Supplier">
                            <InputBox>
                                <input
                                    type="text" placeholder="Supplier name"
                                    value={values.supplier}
                                    onChange={e => onChange("supplier", e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </InputBox>
                        </FormField>
                    </div>

                    {/* Expiry Date */}
                    <FormField label="Expiry Date">
                        <InputBox>
                            <input
                                type="date"
                                value={values.expiry_date}
                                onChange={e => onChange("expiry_date", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface"
                            />
                        </InputBox>
                    </FormField>
                </>
            )}
        </>
    );
}
