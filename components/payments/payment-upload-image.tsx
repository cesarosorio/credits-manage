'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, ImageUpIcon, UploadIcon, XIcon } from 'lucide-react';

interface PaymentUploadImageProps {
  label: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  selectedFile?: File | null;
  previewUrl?: string | null;
  isUploadImageSide?: boolean;
}

export const PaymentUploadImage: React.FC<PaymentUploadImageProps> = ({
  label,
  onUpload,
  onRemove,
  selectedFile = null,
  previewUrl = null,
  isUploadImageSide = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);

  const maxSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Solo se permiten archivos de imagen';
    }

    if (file.size > maxSize) {
      return `El archivo no puede superar los ${maxSize / 1024 / 1024}MB`;
    }

    return null;
  };

  const processFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors([error]);
      return;
    }

    setErrors([]);
    setImageError(false); // Reset image error when uploading new file
    onUpload(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploadImageSide) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploadImageSide) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploadImageSide) {
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        processFile(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="relative">
        {/* Drop area */}
        <div
          role="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!selectedFile && !isUploadImageSide) {
              openFileDialog();
            }
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className={`border-2 border-dashed border-gray-300 hover:border-orange-400 data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl p-4 transition-colors ${
            selectedFile ? 'border-none' : ''
          } ${
            isUploadImageSide ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
            aria-label="Subir imagen"
          />
          {previewUrl && !imageError ? (
            <div className="absolute inset-0">
              <Image
                src={previewUrl}
                alt={selectedFile?.name || 'Uploaded image'}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Suelta tu imagen aquí</p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG, JPEG o GIF (máx. {maxSize / 1024 / 1024}MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                disabled={isUploadImageSide}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                <UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
                Seleccionar imagen
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={onRemove}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};
