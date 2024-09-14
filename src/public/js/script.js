console.log("Script carregado!");
const deleteBtn = document.querySelector("#delete-btn");
deleteBtn.addEventListener("click", () => {
  criarFormularioDelecao(deleteBtn.dataset.id);
});

function criarFormularioDelecao(id) {
  console.log("Criando formulário de deleção para o id:", id);
  const formularioDelecao = document.createElement("form");
  formularioDelecao.setAttribute("action", "/excluir_evento/" + id);
  formularioDelecao.setAttribute("method", "POST");

  const inputId = document.createElement("input");
  inputId.setAttribute("type", "hidden");
  inputId.setAttribute("name", "id");
  inputId.setAttribute("value", id);
    
  formularioDelecao.appendChild(inputId);
  document.body.appendChild(formularioDelecao);
  formularioDelecao.submit();
}