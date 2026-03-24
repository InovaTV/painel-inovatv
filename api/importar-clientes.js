export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  try {

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const clientes = body.clientes || [];

    for (const c of clientes) {

      const telefone = "55" + (c.telefone || "").replace(/\D/g, "");

      await fetch(`${process.env.SUPABASE_URL}/rest/v1/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_KEY}`
        },
        body: JSON.stringify({
          nome: c.nome || "Cliente",
          telefone,
          usuario: c.usuario || null,
          senha: c.senha || null,
          plano: c.plano || null,
          valor: c.valor ? Number(c.valor) : null,
          vencimento: c.vencimento || null,
          status: "ativo",
          servidor: c.servidor || "UNITV",
          aplicativo: c.aplicativo || "UNITV"
        })
      });

    }

    return res.status(200).json({ ok: true });

  } catch (e) {
    console.log("ERRO:", e);
    return res.status(500).json({ error: e.message });
  }
}
