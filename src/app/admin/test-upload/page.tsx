"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Upload failed.");
      return;
    }

    setMessage(`Upload successful: ${data.key}`);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold text-green-950">
        S3 Upload Test
      </h1>

      <div className="mt-6">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setMessage("");
          }}
        />
      </div>

      <button
        onClick={handleUpload}
        className="mt-5 rounded-full bg-green-900 px-5 py-3 text-sm font-medium text-white"
      >
        Upload Image
      </button>

      {message && (
        <p className="mt-4 text-sm text-stone-600">
          {message}
        </p>
      )}
    </div>
  );
}