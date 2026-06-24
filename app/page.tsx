"use client";

import { useState } from "react";
import Link from "next/link";
import { startScan } from "@/lib/barcode";
import { saveScan } from "@/lib/storage";

export default function Home() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scan = async () => {
    try {
      setLoading(true);
      setError("");
      
      const codes = await startScan();

      if (codes.length > 0) {
        const scannedCode = codes[0];
        const rawValue = scannedCode.rawValue ?? "";
        
        setResult(rawValue);

        // Save to history
        await saveScan({
          id: Date.now().toString(),
          rawValue,
          format: scannedCode.format || "UNKNOWN",
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      alert("Copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ZeScan Barcode
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Scan barcodes and QR codes instantly
          </p>
          <Link
            href="/history"
            className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View History →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <button
            onClick={scan}
            disabled={loading}
            className="w-full rounded-lg bg-black dark:bg-indigo-600 px-6 py-4 text-white font-semibold text-lg hover:bg-gray-800 dark:hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Scanning..." : "📷 Scan Barcode"}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">❌ {error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Scanned Result:
                </h2>
                <p className="text-2xl font-mono text-gray-900 dark:text-white break-all">
                  {result}
                </p>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with Next.js + Capacitor + ML Kit
          </p>
        </div>
      </div>
    </main>
  );
}
