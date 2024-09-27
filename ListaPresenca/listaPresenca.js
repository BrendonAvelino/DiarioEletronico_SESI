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
document.addEventListener('DOMContentLoaded', function() {
  const calendarElement = document.getElementById('calendario');
  const currentMonthElement = document.getElementById('current-month');
  const prevMonthButton = document.getElementById('prev-month');
  const nextMonthButton = document.getElementById('next-month');

  let selectedDate = null;
  let currentDate = new Date();

  function generateCalendar(date) {
    calendarElement.innerHTML = `
      <div class="day-header">D</div>
      <div class="day-header">S</div>
      <div class="day-header">T</div>
      <div class="day-header">Q</div>
      <div class="day-header">Q</div>
      <div class="day-header">S</div>
      <div class="day-header">S</div>
    `;

    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthElement.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Preenche os dias anteriores ao primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      calendarElement.innerHTML += `<div class="day"></div>`;
    }

    // Preenche os dias do mês
    for (let day = 1; day <= lastDate; day++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = day;

      // Adiciona o evento de clique para selecionar o dia
      dayElement.addEventListener('click', function() {
        if (selectedDate) {
          selectedDate.classList.remove('selected');
        }
        dayElement.classList.add('selected');
        selectedDate = dayElement;
      });

      calendarElement.appendChild(dayElement);
    }
  }

  // Função para navegar para o mês anterior
  function goToPreviousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
  }

  // Função para navegar para o próximo mês
  function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
  }

  prevMonthButton.addEventListener('click', goToPreviousMonth);
  nextMonthButton.addEventListener('click', goToNextMonth);

  // Gera o calendário inicial
  generateCalendar(currentDate);
});


// Ativar/desativar checkbox ao clicar no botão "Selecionar Tudo"
document.getElementById('btnSelectionAll').addEventListener('click', function() {
  const checkbox = document.getElementById('selectAllCheckbox');
  const switches = document.querySelectorAll('.switch input[type="checkbox"]'); 
  
  const selectAll = !checkbox.checked; 
  checkbox.checked = selectAll; 

  // Atualiza o estado de todos os switches
  switches.forEach(switchCheckbox => {
    switchCheckbox.checked = selectAll; 
  });
});
