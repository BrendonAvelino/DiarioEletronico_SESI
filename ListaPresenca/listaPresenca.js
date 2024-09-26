// Função que alterna a visibilidade do dropdown
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Fechar o dropdown ao clicar fora
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

// Ajuste da altura do container
function adjustTableContainerHeight() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.maxHeight = '100px';
  dropdown.style.overflowY = 'auto';
}

adjustTableContainerHeight();
window.addEventListener('resize', adjustTableContainerHeight);
