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