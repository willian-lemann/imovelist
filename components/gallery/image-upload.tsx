"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  value,
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [newUrl, setNewUrl] = useState("");

  function addUrl() {
    if (newUrl && value.length < maxImages) {
      onChange([...value, newUrl]);
      setNewUrl("");
    }
  }

  function removeUrl(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <Label>
        Image URLs ({value.length}/{maxImages})
      </Label>
      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addUrl}
          disabled={value.length >= maxImages}
        >
          <Upload className="w-4 h-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden bg-muted aspect-video"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
