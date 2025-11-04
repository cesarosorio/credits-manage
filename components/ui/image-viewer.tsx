import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageAlt?: string;
  title?: string;
}

export default function ImageViewer({
  open,
  onOpenChange,
  imageUrl,
  imageAlt = "Imagen adjunta",
  title = "Vista de imagen"
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageAlt || 'imagen-pago';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetScale = () => {
    setScale(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="h-8 w-8 p-0 cursor-pointer hover:bg-muted transition-colors duration-200"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetScale}
                className="h-8 px-2 text-xs cursor-pointer hover:bg-muted transition-colors duration-200"
              >
                {Math.round(scale * 100)}%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 3}
                className="h-8 w-8 p-0 cursor-pointer hover:bg-muted transition-colors duration-200"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0 cursor-pointer hover:bg-muted transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.2s ease-in-out',
              }}
              className="relative"
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={800}
                height={600}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                className="rounded-lg shadow-lg"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}