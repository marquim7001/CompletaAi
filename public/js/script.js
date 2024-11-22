// console.log("Script carregado!");
// const deleteBtn = document.querySelector("#delete-btn");
// deleteBtn.addEventListener("click", () => {
//   criarFormularioDelecao(deleteBtn.dataset.id);
// });

// function criarFormularioDelecao(id) {
//   console.log("Criando formulário de deleção para o id:", id);
//   const formularioDelecao = document.createElement("form");
//   formularioDelecao.setAttribute("action", "/excluir_evento/" + id);
//   formularioDelecao.setAttribute("method", "POST");

//   const inputId = document.createElement("input");
//   inputId.setAttribute("type", "hidden");
//   inputId.setAttribute("name", "id");
//   inputId.setAttribute("value", id);

//   formularioDelecao.appendChild(inputId);
//   document.body.appendChild(formularioDelecao);
//   formularioDelecao.submit();
// }
document.addEventListener('DOMContentLoaded', function () {
  function aplicarFormatacaoHora() {
    const listaHoraEventos = document.querySelectorAll('.hora-evento-item');
    listaHoraEventos.forEach(horaEvento => {
      const stringHora = horaEvento.textContent;
      const [horas, minutos] = stringHora.split(':');
      const horaFormatada = `${horas}h${minutos}`;
      horaEvento.textContent = horaFormatada;
      console.log('horaFormatada: ', horaFormatada);
    });
  }

  function aplicarFormatacaoData() {
    const listaDataEventos = document.querySelectorAll('.data-evento-item');
    const meses = new Map([
      ['01', 'JAN'], ['02', 'FEV'], ['03', 'MAR'], ['04', 'ABR'],
      ['05', 'MAI'], ['06', 'JUN'], ['07', 'JUL'], ['08', 'AGO'],
      ['09', 'SET'], ['10', 'OUT'], ['11', 'NOV'], ['12', 'DEZ']
    ]);

    listaDataEventos.forEach(dataEvento => {
      const stringData = dataEvento.textContent;
      const [, mes, dia] = stringData.split('-');
      const mesAbreviado = meses.get(mes);
      const dataFormatada = `${dia} ${mesAbreviado}`;
      dataEvento.textContent = dataFormatada;
      console.log('dataFormatada: ', dataFormatada);
    });
  }

  aplicarFormatacaoHora();
  aplicarFormatacaoData();
});

