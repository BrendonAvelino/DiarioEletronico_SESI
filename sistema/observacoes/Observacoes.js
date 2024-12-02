function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
  
  window.onclick = function (event) {
    if (!event.target.matches('.custom-input')) {
      const dropdown = document.getElementById("dropdown");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      }
    }
  }
  
  // Adicionando o evento de clique nas opções do dropdown
  document.querySelectorAll('.dropdown li').forEach(item => {
    item.addEventListener('click', function() {
      const selectedText = this.textContent;
      document.getElementById("dropdownButton").firstChild.textContent = selectedText;
      toggleDropdown();  // Fecha o dropdown após a seleção
    });
  });
  
  // Ajuste da altura do container ( rolagem )
  function adjustdropdownHeight() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.maxHeight = '100px';
    dropdown.style.overflowY = 'auto';
  }
  adjustdropdownHeight();
  window.addEventListener('resize', adjustdropdownHeight);






  // TextData
  function formatarDataAtual() {
    const hoje = new Date();

    // Arrays de dias da semana e meses
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", 
                   "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    // Pegar dia da semana, dia do mês, mês e ano
    const diaSemana = diasSemana[hoje.getDay()];
    const diaMes = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();

    // Formatar como "Sexta, 13 de setembro, 2024"
    return `${diaSemana}, ${diaMes} de ${mes}, ${ano}`;
}

  // Exibe a data no elemento com id "TextData"
  document.getElementById('TextData').textContent = formatarDataAtual();  