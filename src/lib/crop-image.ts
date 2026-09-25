import type { Area } from "react-easy-crop";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;

export async function createCroppedImage(
  imageSrc: string,
  crop: Area
): Promise<File> {
  const image = await loadImage(imageSrc);

  // Keep the exact 4:3 ratio while limiting the output size.
  const scale = Math.min(
    MAX_WIDTH / crop.width,
    MAX_HEIGHT / crop.height,
    1
  );

  const outputWidth = Math.round(crop.width * scale);
  const outputHeight = Math.round(crop.height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create image canvas.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  const blob = await canvasToBlob(canvas);

  return new File(
    [blob],
    `product-image-${Date.now()}.jpg`,
    {
      type: "image/jpeg",
    }
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to load image."));

    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error("Failed to create cropped image.")
          );
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
}