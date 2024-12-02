document.addEventListener("DOMContentLoaded", function() {
    const dataElement = document.getElementById("data");

    // Array de dias da semana e meses
    const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const mesesDoAno = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    // Obtenção da data atual
    const hoje = new Date();
    const diaSemana = diasDaSemana[hoje.getDay()];
    const dia = hoje.getDate();
    const mes = mesesDoAno[hoje.getMonth()];
    const ano = hoje.getFullYear();

    // Formatação da data
    const dataFormatada = `${diaSemana}, ${dia} de ${mes}, ${ano}`;
    dataElement.textContent = dataFormatada;

    // Rolar automaticamente até o <p> com id="data"
    dataElement.scrollIntoView({ behavior: "smooth" });
});

