"use client";

import { UploadCloud, X, FileImage } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "components/ui/dialog";
import { startTransition, useActionState, useRef, useState } from "react";
import { uploadImageAction } from "./actions";

type UploadedFile = {
  file: File;
  preview: string;
  progress: number;
};

type UploadImagesProps = {
  galleryImages: Array<{
    id: number;
    imageUrl: string;
  }>;
};

export function UploadImages({ galleryImages }: UploadImagesProps) {
  // eslint-disable-next-line no-unused-vars
  const [state, action] = useActionState(uploadImageAction, {
    error: "",
    success: true,
  });

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...newFiles]);

      startTransition(async () => {
        action(e.target.files!);
      });

      simulateUpload(newFiles);
    }
  };

  const simulateUpload = (newFiles: UploadedFile[]) => {
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f, i) => {
            if (i === prev.length - newFiles.length + index) {
              return { ...f, progress: Math.min(f.progress + 10, 100) };
            }
            return f;
          })
        );
        if (file.progress >= 100) clearInterval(interval);
      }, 500);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      simulateUpload(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">Fotos do Imóvel</h2>
        <DialogTrigger asChild>
          <Button className="w-fit mt-4" type="button" variant="secondary">
            Adicionar Fotos
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-4xl">
        <DialogTitle hidden />

        <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
          <CardContent className="p-6">
            {files.length > 0 ? (
              <div className="mt-0 space-y-4">
                <h3 className="text-lg font-semibold">Arquivos carregados</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="w-[120px] h-[120px] rounded-lg overflow-hidden bg-secondary">
                        {file.file.type.startsWith("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mt-2">
                        <p className="text-sm truncate">{file.file.name}</p>
                        <Progress value={file.progress} className="h-1 mt-1" />
                      </div>
                    </div>
                  ))}

                  <div
                    className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <UploadCloud
                      onClick={() => inputRef.current?.click()}
                      className="h-12 w-12 text-muted-foreground cursor-pointer"
                    />

                    <Label
                      onClick={() => inputRef.current?.click()}
                      className="cursor-pointer text-muted-foreground font-semibold"
                    >
                      Upload
                    </Label>
                  </div>
                </div>
              </div>
            ) : null}

            {files.length === 0 ? (
              <div
                className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                  <Label
                    htmlFor="file-upload"
                    className="text-lg font-semibold cursor-pointer text-primary hover:underline"
                    onClick={() => inputRef.current?.click()}
                  >
                    Clique para fazer upload
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou arraste e solte
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF até 10MB
                </p>
              </div>
            ) : null}

            <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
              {galleryImages.map((galleryImage) => (
                <Button
                  key={galleryImage.id}
                  variant="outline"
                  className="w-[120px] h-[120px] rounded-lg overflow-hidden bg-secondary p-0 border-none hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    key={galleryImage.id}
                    src={galleryImage.imageUrl}
                    alt="Imagem de um imóvel"
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </ul>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button className="w-fit mt-4" type="button">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
