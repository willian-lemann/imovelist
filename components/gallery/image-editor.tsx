"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditImage } from "@/lib/queries/use-gallery";

export function ImageEditor() {
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{
    originalImage: string;
    editedImage: string;
  } | null>(null);
  const editImage = useEditImage();

  async function handleEdit() {
    if (!imageUrl || !prompt) return;

    try {
      const data = await editImage.mutateAsync({ imageUrl, prompt });
      setResult(data);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Imagem Original
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/property-photo.jpg"
            />
          </div>

          {imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={imageUrl}
                alt="Source"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="prompt">Instruções de Edição</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Melhorar a iluminação, adicionar móveis decorativos, deixar o céu azul..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleEdit}
            disabled={!imageUrl || !prompt || editImage.isPending}
            className="w-full"
          >
            {editImage.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" /> Aplicar Edição IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Resultado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={result.editedImage}
                  alt="Edited"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Baixar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Salvar na Galeria
                </Button>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Imagem editada por IA aparecerá aqui</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
