async function importarCSV(){

  const file = document.getElementById("inputCSV").files[0];

  if (!file){
    alert("Selecione um CSV");
    return;
  }

  const text = await file.text();

  // 🔥 detecta separador automaticamente
  const separador = text.includes(";") ? ";" : ",";

  const linhas = text.split("\n");
  const cab = linhas[0].split(separador);

  const clientes = [];

  for (let i=1;i<linhas.length;i++){

    const dados = linhas[i].split(separador);

    if (!dados[0]) continue;

    let obj = {};

    cab.forEach((c,i)=>{
      obj[c.trim().toLowerCase()] = dados[i]?.trim();
    });

    clientes.push({
      nome: obj.nome,
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

  console.log(clientes); // 👈 DEBUG (importante)

  await fetch("/api/importar-clientes", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ clientes })
  });

  alert("Importado corretamente 🚀");
  location.reload();
}
