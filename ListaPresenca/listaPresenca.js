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




// rezize table
function adjustTableContainerHeight() {
  const tableContainer = document.getElementById("table-container");
  tableContainer.style.maxHeight = '520px';
  tableContainer.style.overflowY = 'auto';
}

adjustTableContainerHeight();
window.addEventListener('resize', adjustTableContainerHeight);  




// calendario
const calendario = document.getElementById("calendario");

const createCalendario = (month, year) => {
    calendario.innerHTML = ""; // Limpa o calendário antes de preenchê-lo

    const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    let daysInMonth = new Date(year, month + 1, 0).getDate(); // Dias no mês atual
    let firstDay = new Date(year, month, 1).getDay(); // Primeiro dia da semana

    // Cabeçalhos dos dias da semana
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day', 'day-header');
        dayHeader.innerText = day;
        calendario.appendChild(dayHeader);
    });

    // Adiciona dias em branco para alinhar o primeiro dia do mês corretamente
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day');
        calendario.appendChild(emptyDay);
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.innerText = day;
        calendario.appendChild(dayElement);
    }
};

// Inicializa o calendário para o mês atual
let today = new Date();
createCalendario(today.getMonth(), today.getFullYear());
