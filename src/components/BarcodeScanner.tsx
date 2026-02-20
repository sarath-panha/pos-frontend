"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { X, Camera, AlertCircle } from "lucide-react";

interface Props {
    onScan: (barcode: string) => void;
    onClose: () => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window { BarcodeDetector: any; }
}

export function BarcodeScanner({ onScan, onClose }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafRef = useRef<number>(0);
    const scannedRef = useRef(false);
    const [error, setError] = useState("");
    const [supported] = useState(() =>
        typeof window !== "undefined" && "BarcodeDetector" in window
    );

    const stopCamera = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }, []);

    const handleClose = useCallback(() => {
        stopCamera();
        onClose();
    }, [stopCamera, onClose]);

    useEffect(() => {
        if (!supported) return;

        const run = async () => {
            try {
                const formats = (await window.BarcodeDetector.getSupportedFormats?.()) ??
                    ["qr_code", "ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "data_matrix"];
                const detector = new window.BarcodeDetector({ formats });

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }

                const tick = async () => {
                    if (!videoRef.current || scannedRef.current) return;
                    try {
                        const barcodes = await detector.detect(videoRef.current);
                        if (barcodes.length > 0) {
                            scannedRef.current = true;
                            stopCamera();
                            onScan(barcodes[0].rawValue as string);
                            onClose();
                            return;
                        }
                    } catch (_) { /* frame not ready */ }
                    rafRef.current = requestAnimationFrame(tick);
                };
                rafRef.current = requestAnimationFrame(tick);
            } catch (e: any) {
                setError(e?.message ?? "Camera access denied");
            }
        };

        run();
        return () => stopCamera();
    }, [supported, onScan, onClose, stopCamera]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
            <div className="relative bg-surface rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh]">

                {/* Sheet handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-outline-variant" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-4">
                    <div className="flex items-center gap-2">
                        <Camera size={17} className="text-primary" />
                        <h2 className="font-bold text-base text-on-surface">Scan Barcode / QR Code</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:opacity-70"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 pb-8">
                    {!supported || error ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-error-container flex items-center justify-center">
                                <AlertCircle size={26} className="text-on-error-container" />
                            </div>
                            <p className="text-sm font-bold text-on-surface">
                                {!supported ? "Scanner not supported" : "Camera error"}
                            </p>
                            <p className="text-xs text-on-surface-variant max-w-[240px]">
                                {!supported
                                    ? "Use Chrome or Edge on Android / desktop. You can also type the barcode manually."
                                    : `${error} — please allow camera access and try again.`}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                                <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
                                {/* Guide frame */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-3/4 h-28 border-2 border-primary/80 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                                </div>
                            </div>
                            <p className="text-xs text-center text-on-surface-variant mt-3">
                                Align the barcode or QR code within the frame
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
