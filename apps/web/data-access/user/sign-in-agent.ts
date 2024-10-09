import { supabaseDB } from "@/lib/supabase";
import axios from "axios";

type CheckAgentResponse = {
  cadastros: Array<{
    id: number;
    creci: number;
    nome: string;
    situacao: boolean;
    cpf: string;
    tipo: 1 | 2;
    foto: boolean;
    regular: boolean;
    telefones: string[];
  }>;
};

type Input = {
  agentId: string;
  user: {
    id: string;
    name: string;
  };
};

type Output = {
  error: string | null;
  success: boolean;
};

export async function signInAgent({ agentId, user }: Input): Promise<Output> {
  const response = await axios.post<CheckAgentResponse>(
    "https://www.crecisc.conselho.net.br/form_pesquisa_cadastro_geral_site.php",
    {
      inscricao: agentId,
    }
  );

  if (response.status === 500) {
    return {
      error: "Ocorreu um erro ao tentar checar o corretor",
      success: false,
    };
  }

  const { cadastros } = response.data;

  if (cadastros.length === 0) {
    return {
      error: "Nenhum registro encontrado com esse CRECI",
      success: false,
    };
  }

  const [agent] = response.data.cadastros;

  if (!agent) {
    return {
      error: "Nenhum registro encontrado com esse CRECI",
      success: false,
    };
  }

  const foundAgentWithAgentId = await supabaseDB
    .from("agents")
    .select("*")
    .filter("agentId", "eq", agent.creci)
    .single();

  if (foundAgentWithAgentId.data) {
    return {
      error:
        "Não é possível logar com um CRECI de outro corretor já cadastrado.",
      success: false,
    };
  }

  const namekey = agent.nome.split(" ").join("").toLowerCase();
  const loggedUserNameKey = user.name.split(" ").join("").toLowerCase();

  if (namekey.includes(loggedUserNameKey) || namekey !== loggedUserNameKey) {
    return {
      error:
        "Não foi possível logar com esse CRECI. Parece que suas credenciais não batem com as credenciais desse CRECI",
      success: false,
    };
  }

  const { error } = await supabaseDB.from("agents").insert({
    id: agent.id,
    agentId: agent.creci,
    name: agent.nome,
    cpf: agent.cpf,
    type: agent.tipo,
    hasPhoto: agent.foto,
    isRegular: agent.regular,
    isActive: agent.situacao,
    phones: agent.telefones,
    user_id: user.id,
  });

  if (error) {
    return {
      error: "Ocorreu um erro ao tentar checar o corretor",
      success: false,
    };
  }

  await supabaseDB.from("users").update({ role: "agent" }).eq("id", user.id);

  return { error: null, success: true };
}
