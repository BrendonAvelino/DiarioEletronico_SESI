    // TextData
    const dataAtual = new Date();

    // Extrai o dia, mês e ano
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona '0' se for necessário
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona 1 ao mês (começa em 0)
    const ano = dataAtual.getFullYear();

    // Formata a data como DD/MM/YYYY
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Exibe a data no elemento com id "TextData"
    document.getElementById('TextData').textContent = dataFormatada;