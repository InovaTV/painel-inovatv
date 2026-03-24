import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function formatarTelefone(tel) {
  if (!tel) return null;

  let numero = tel.toString().replace(/\D/g, "");

  if (numero.startsWith("55")) {
    numero = numero.slice(2);
  }

  return "55" + numero;
}

function definirStatus(vencimento) {
  if (!vencimento) return "inativo";

  const hoje = new Date();
  const venc = new Date(vencimento);

  return venc >= hoje ? "ativo" : "inativo";
}

export default async function handler(req, res) {
  try {

    const clientes = req.body.clientes;

    for (const c of clientes) {

      const telefone = formatarTelefone(c.telefone);
      if (!telefone) continue;

      const status = definirStatus(c.vencimento);

      const { data: existente } = await supabase
        .from("clientes")
        .select("id")
        .eq("telefone", telefone)
        .maybeSingle();

      if (!existente) {
        await supabase.from("clientes").insert({
          nome: c.nome,
          telefone,
          usuario: c.usuario || null,
          senha: c.senha || null,
          plano: c.plano || null,
          valor: c.valor ? Number(c.valor) : null,
          vencimento: c.vencimento || null,
          status,
          servidor: c.servidor || "UNITV",
          aplicativo: c.aplicativo || "UNITV",
          dispositivo: c.dispositivo || null,
          telas: c.telas ? Number(c.telas) : 1,
          forma_pagamento: c.forma_pagamento || "PIX",
          mac: c.mac || null,
          observacao: c.observacao || "Importado automático",
          criado_em: new Date()
        });
      }

      await supabase.from("contatos").upsert({
        telefone,
        nome: c.nome,
        cliente: true
      }, { onConflict: "telefone" });

    }

    res.status(200).json({ ok: true });

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}
