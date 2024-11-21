
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



let notes = [];

// Exibe o modal para criar anotação
function showCreateNote() {
  document.getElementById('criarmodal').style.display = 'flex';
}

// Esconde o modal
function hideCreateNote() {
  document.getElementById('criarmodal').style.display = 'none';
}

// Função para salvar a anotação
function saveNote() {
  const title = document.getElementById('tituloDescricao').value;
  const description = document.getElementById('descricao').value;

  if (!title || !description) {
    alert("Preencha o título e a descrição.");
    return;
  }

  const note = { title, description };
  notes.push(note);

  // Limpa os campos
  document.getElementById('tituloDescricao').value = '';
  document.getElementById('descricao').value = '';

  hideCreateNote();
  renderNotes();
}

// Função para renderizar as anotações na tela
function renderNotes() {
  const main = document.getElementById('mainSesi');
  main.innerHTML = ''; // Limpa o conteúdo atual

  notes.forEach((note, index) => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <button onclick="abrirModal(${index})">Abrir</button>
      <button onclick="deleteNote(${index})">Excluir</button>
    `;

    main.appendChild(noteElement);
  });
}


// Função para excluir a anotação
function deleteNote(index) {
  notes.splice(index, 1); // Remove a anotação da lista
  renderNotes(); // Atualiza a exibição
}




function abrirModal(){
  const modal = document.getElementById('janela-modal')
  modal.classList.add('abrir')

  modal.addEventListener('click',(e) => {
    if(e.target.id == 'salvar' || e.target.id == 'janela-modal'){
      modal.classList.remove('abrir')
    }
  })
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}


function menuShow() {
  let menuMobile = document.querySelector('.mobile-menu');
  if (menuMobile.classList.contains('open')) {
    menuMobile.classList.remove('open');
    document.querySelector('.icon').src = "menu.png";
  } else {
    menuMobile.classList.add('open');
    document.querySelector('.icon').src = "img/xxx.png";
  }
}