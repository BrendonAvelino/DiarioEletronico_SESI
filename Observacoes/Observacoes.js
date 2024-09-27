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
  const dataAtual = new Date();

  // Extrai o dia, mês e ano
  const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona '0' se for necessário
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona 1 ao mês (começa em 0)
  const ano = dataAtual.getFullYear();

  // Formata a data como DD/MM/YYYY
  const dataFormatada = `${dia}/${mes}/${ano}`;

  // Exibe a data no elemento com id "TextData"
  document.getElementById('TextData').textContent = dataFormatada;  