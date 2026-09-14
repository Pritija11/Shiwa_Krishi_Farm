"use client";

import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type ImageCropperProps = {
  image: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  onConfirm,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-green-950">
            Crop Product Image
          </h2>

          <p className="mt-1 text-xs text-stone-500">
            Adjust the image so the important part fits inside the 4:3 frame.
          </p>
        </div>

        {/* Crop Area */}
        <div className="relative h-[55vh] min-h-80 w-full bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            objectFit="contain"
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-5">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="zoom"
                className="text-sm font-medium text-green-950"
              >
                Zoom
              </label>

              <span className="text-xs text-stone-500">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <input
              id="zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) =>
                setZoom(Number(event.target.value))
              }
              className="mt-3 w-full accent-green-900"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              Crop & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}