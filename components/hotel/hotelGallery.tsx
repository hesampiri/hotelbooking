"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface HotelGalleryProps {
  images: string[];
}

export default function HotelGallery({ images }: HotelGalleryProps) {
  const mainImage = images[0];
  const sideImages = images.slice(1, 5);
  const defaultImage = "/images/ChatGPT Image Jun 17, 2026, 08_58_02 AM.png";

  return (
    <Dialog>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-100 overflow-hidden rounded-2xl">
        {/* Main image */}
        <DialogTrigger asChild>
          <div className="relative lg:col-span-3 cursor-pointer">
            <Image
              src={defaultImage}
              alt="Hotel"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </DialogTrigger>

        {/* Side images */}
        <div className="hidden lg:grid grid-rows-3 gap-2">
          {sideImages.map((img, index) => (
            <DialogTrigger asChild key={index}>
              <div className="relative cursor-pointer overflow-hidden">
                <Image
                  src={defaultImage}
                  alt={`Hotel ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />

                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      +{images.length - 5} photos
                    </span>
                  </div>
                )}
              </div>
            </DialogTrigger>
          ))}
        </div>
      </div>

      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Hotel Gallery</DialogTitle>
        </VisuallyHidden>
        <div className="max-h-[85vh] overflow-auto">
          <div className="grid gap-2 p-2">
            {images.map((img, index) => (
              <div key={index} className="relative h-[300px]">
                <Image
                  src={defaultImage}
                  alt={`Hotel ${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
