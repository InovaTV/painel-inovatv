async function importarCSV(){

  const file = document.getElementById("inputCSV").files[0];

  if (!file){
    alert("Selecione um CSV");
    return;
  }

  let text = await file.text();

  // 🔥 normaliza quebra de linha (corrige Windows)
  text = text.replace(/\r/g, "");

  // 🔥 detecta separador
  const separador = text.includes(";") ? ";" : ",";

  const linhas = text.split("\n").filter(l => l.trim() !== "");

  if (linhas.length < 2){
    alert("CSV vazio ou inválido");
    return;
  }

  const cab = linhas[0].split(separador).map(c => c.trim().toLowerCase());

  const clientes = [];

  for (let i = 1; i < linhas.length; i++){

    const dados = linhas[i].split(separador);

    let obj = {};

    cab.forEach((c, index)=>{
      obj[c] = dados[index]?.trim();
    });

    // 🔥 valida telefone
    if (!obj.telefone || obj.telefone.length < 8) continue;

    clientes.push({
      nome: obj.nome || "Cliente",
      telefone: obj.telefone,
      usuario: obj.usuario,
      senha: obj.senha,
      plano: obj.plano,
      valor: obj.valor,
      vencimento: obj.vencimento,
      servidor: obj.servidor,
      aplicativo: obj.aplicativo,
      dispositivo: obj.dispositivo,
      telas: obj.telas,
      forma_pagamento: obj.forma_pagamento
    });
  }

  console.log("CLIENTES LIDOS:", clientes);

  if (clientes.length === 0){
    alert("Nenhum cliente válido encontrado");
    return;
  }

  const res = await fetch("/api/importar-clientes", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ clientes })
  });

  const result = await res.json();

  console.log("RESPOSTA API:", result);

  alert("Importação concluída 🚀");
  location.reload();
}
