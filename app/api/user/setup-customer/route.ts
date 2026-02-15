import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { abacatePayClient } from "@/lib/abacatepay";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cellphone, taxId } = await req.json();

    // Criar customer na AbacatePay
    const abacateCustomer = await abacatePayClient.createCustomer({
      name: session.user.name,
      email: session.user.email,
      cellphone: cellphone || "",
      taxId: taxId || "",
    });

    // Atualizar o usuário com os dados adicionais
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        abacatepay_customer_id: abacateCustomer.id,
        cellphone: cellphone,
        taxId: taxId,
      },
    });

    console.log(
      `Customer AbacatePay criado: ${abacateCustomer.id} para usuário ${session.user.id}`,
    );

    return NextResponse.json({ success: true, customerId: abacateCustomer.id });
  } catch (error) {
    console.error("Erro ao criar customer AbacatePay:", error);
    return NextResponse.json(
      { error: "Falha ao configurar customer" },
      { status: 500 },
    );
  }
}
