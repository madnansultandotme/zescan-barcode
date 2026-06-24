"use client";

import { useState, useEffect } from "react";
import { getHistory, clearHistory } from "@/lib/storage";
import { Scan } from "@/types/scan";
import Link from "next/link";

export default function History() {
  const [history, setHistory] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to clear all scan history?")) {
      await clearHistory();
      setHistory([]);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Scanner
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Scan History
          </h1>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="text-red-600 dark:text-red-400 hover:underline text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No scan history yet. Start scanning to see results here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((scan) => (
              <div
                key={scan.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mb-2">
                      {scan.format}
                    </span>
                    <p className="text-lg font-mono text-gray-900 dark:text-white break-all">
                      {scan.rawValue}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {formatDate(scan.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(scan.rawValue)}
                    className="ml-4 px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
