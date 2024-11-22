document.addEventListener('DOMContentLoaded', function () {
    function formatarHora() {
        const listaHoraEventos = document.querySelectorAll('.hora-evento-item');
        listaHoraEventos.forEach(horaEvento => {
            const stringHora = horaEvento.textContent;
            const [horas, minutos] = stringHora.split(':');
            const horaFormatada = `${horas}h${minutos}`;
            horaEvento.textContent = horaFormatada;
            console.log('horaFormatada: ', horaFormatada);
        });
    }

    function formatarData() {
        const listaDataEventos = document.querySelectorAll('.data-evento-item');
        listaDataEventos.forEach(dataEvento => {
            const stringData = dataEvento.textContent;
            const [ano, mes, dia] = stringData.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            dataEvento.textContent = dataFormatada;
            console.log('dataFormatada: ', dataFormatada);
        });
    }

    formatarHora();
    formatarData();
});