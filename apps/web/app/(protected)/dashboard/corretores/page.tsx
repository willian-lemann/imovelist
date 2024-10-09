import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Phone, UserCheck, UserX } from "lucide-react";
import { getAgents } from "@/data-access/user/get-agents";
import { Pagination } from "@/components/pagination";
import { userAgent } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { SearchAgents } from "./search-agents";

const agentTypes = {
  1: "Pessoa Física",
  2: "Pessoa Jurídica",
};

function getFirstLetters(name: string) {
  const [firstname] = name.split(" ");
  const [lastname] = name.split(" ").reverse();
  return `${firstname!.charAt(0)}${lastname!.charAt(0)}`;
}

type AgentsListPageParams = {
  searchParams: { page: number; query: string };
};

const pageSize = 12;

export default async function AgentsList({
  searchParams,
}: AgentsListPageParams) {
  const { userId } = auth();
  const agent = userAgent({ headers: headers() });

  const isLogged = !!userId;
  const isMobile = agent.device.type === "mobile";

  const page = +searchParams.page || 1;

  const { data: agents, count } = await getAgents({
    page,
    query: searchParams.query,
    pageSize,
  });

  const numberOfPages = Math.ceil(Number(count) / 10);
  const shouldShowPagination = isLogged && count! > 0;

  return (
    <div className="px-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold">
              Agentes Imobiliários em Santa Catarina
            </CardTitle>
            <SearchAgents />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents?.map((agent) => (
              <Card key={agent.id} className="flex flex-col">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4">
                    {getFirstLetters(agent.name)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>

                  <div className="space-x-2">
                    <Badge
                      variant={agent.isActive ? "success" : "secondary"}
                      className="mb-2"
                    >
                      {agent.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge
                      variant={agent.isRegular ? "success" : "destructive"}
                      className="mb-4"
                    >
                      {agent.isRegular ? "Regular" : "Irregular"}
                    </Badge>
                  </div>

                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-2">
                      ID do Agente: {agent.agentId}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tipo: {agentTypes[agent.type as keyof typeof agentTypes]}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      CPF/CNPJ: {agent.cpf}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Phone className="h-4 w-4 mr-2" />
                      {agent.phones.join(", ")}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {agent.isRegular ? (
                        <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <UserX className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {agent.isRegular
                        ? "Documentação em dia"
                        : "Pendências na documentação"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        {shouldShowPagination ? (
          <Pagination
            isMobile={isMobile}
            numberOfPages={numberOfPages}
            page={page}
          />
        ) : null}
      </Card>
    </div>
  );
}
