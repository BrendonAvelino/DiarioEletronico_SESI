// input container
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
  
  function adjustTableContainerHeight() {
    dropdown.style.maxHeight = '100px';
    dropdown.style.overflowY = 'auto';
  }
  
  adjustTableContainerHeight();
  window.addEventListener('resize', adjustTableContainerHeight);
  
  
  // Função para calcular a média
function calcularMedia(notas) {
  const soma = notas.reduce((acc, nota) => acc + parseFloat(nota || 0), 0);
  return (soma / notas.length).toFixed(2);
}

// Função para atualizar a média ao preencher as notas
function atualizarMedia() {
  // Seleciona todas as divs de alunos
  const alunos = document.querySelectorAll('[id^="alunoNota"]');

  alunos.forEach((aluno) => {
      // Seleciona os inputs de nota e a div da média para cada aluno
      const inputsNotas = aluno.querySelectorAll('.notas');
      const mediaDiv = aluno.querySelector('.media p');

      // Adiciona um listener a cada input para recalcular a média quando mudar
      inputsNotas.forEach(input => {
          input.addEventListener('input', () => {
              const notas = Array.from(inputsNotas).map(input => input.value);
              
              // Verifica se todas as 3 notas foram preenchidas
              if (notas.every(nota => nota !== '')) {
                  const media = calcularMedia(notas);
                  mediaDiv.textContent = media;
              }
          });
      });
  });
}

// Chama a função para atualizar as médias assim que o DOM estiver carregado
document.addEventListener('DOMContentLoaded', atualizarMedia);
