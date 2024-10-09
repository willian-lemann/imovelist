import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadImages } from "./upload-images";
import { auth } from "@clerk/nextjs/server";

export default function Page() {
  auth().protect();

  return (
    <div className="container mx-auto py-4 max-w-4xl">
      <div className="grid grid-cols-2">
        <h1 className="text-2xl font-bold mb-4">Adicionar Novo Imóvel</h1>
        <Button type="submit" className="w-full max-w-40 ml-auto">
          Publicar Anúncio
        </Button>
      </div>

      <form className="space-y-4">
        <div>
          <Label htmlFor="title">Título do Anúncio</Label>
          <Input id="title" placeholder="Ex: Casa espaçosa com 3 quartos" />
        </div>
        <div>
          <Label htmlFor="type">Tipo de Imóvel</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            placeholder="Rua, Número, Bairro, Cidade - Estado"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bedrooms">Quartos</Label>
            <Input id="bedrooms" type="number" min="0" />
          </div>
          <div>
            <Label htmlFor="bathrooms">Banheiros</Label>
            <Input id="bathrooms" type="number" min="0" />
          </div>
          <div>
            <Label htmlFor="area">Área (m²)</Label>
            <Input id="area" type="number" min="0" />
          </div>
        </div>
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" type="number" min="0" step="0.01" />
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descreva o imóvel em detalhes"
          />
        </div>
        <UploadImages />
      </form>
    </div>
  );
}
