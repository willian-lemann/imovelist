"use client";

import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import { Label } from "../ui/label";

import { Check } from "lucide-react";
import { PropsWithChildren } from "react";

export function AnnounceButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Anunciar</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl py-10">
        <DialogTitle className="text-center">
          <Label className="text-2xl font-bold text-center mb-8">
            Para anunciar você precisa ter o plano corretor
          </Label>
        </DialogTitle>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Plano Corretor</CardTitle>
            <CardDescription>
              Ideal para corretores imobiliários independentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">
              R$99,90<span className="text-xl font-normal">/mês</span>
            </div>
            <ul className="space-y-2">
              <ListItem>Listagem ilimitada de propriedades</ListItem>
              <ListItem>Ferramentas de marketing digital</ListItem>
              <ListItem>Gestão de clientes (CRM)</ListItem>
              <ListItem>Análise de mercado em tempo real</ListItem>
              <ListItem>Agendamento de visitas online</ListItem>
              <ListItem>Suporte ao cliente 24/7</ListItem>
              <ListItem>Integração com portais imobiliários</ListItem>
              <ListItem>Aplicativo móvel incluído</ListItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-lg">Anunciar Agora</Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function ListItem({ children }: PropsWithChildren) {
  return (
    <li className="flex items-center">
      <Check className="text-green-500 mr-2" />
      <span>{children}</span>
    </li>
  );
}
