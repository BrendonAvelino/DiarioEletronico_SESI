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
  item.addEventListener('click', function () {
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



document.getElementById('sair').addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error('Erro ao deslogar:', error.message);
    alert('Erro ao deslogar. Tente novamente.');
  } else {
    window.location.href = './../index.html';
    localStorage.setItem('authUuid', '');
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const botaoDropdown = document.getElementById('dropdownButton')
  const dropdown = document.getElementById('dropdown')

  const turmaId = localStorage.getItem('professorTurmaEscolhida');
  // const professorId = localStorage.getItem('professorTurmaMatProfEscolhido');

  // // Busca o ID do professor relacionado ao perfil do usuário


  // // Busca os dados do professor usando o ID encontrado
  // const { data: professor, error: professorError } = await supabaseClient
  //     .from('professores')
  //     .select('*')
  //     .eq('id', professorId);

  // if (professorError || !professor?.length) {
  //     console.error('Erro ao buscar dados do professor:', professorError || 'Professor não encontrado');
  //     return;
  // }

  // const spanProfessor = document.getElementById('nomeProfessor');
  // spanProfessor.textContent = `Prof. ${professor[0].nome}`;

  // Busca turmas e matérias associadas ao professor
  const { data: turmasMaterias, error: turmasError } = await supabaseClient
    .from('turmas_materias')
    .select('*')
    .eq('turma_id', turmaId);

  if (turmasError) {
    console.error('Erro ao buscar turmas:', turmasError.message);
    return;
  }

  const turmaID = localStorage.getItem('professorTurmaMatEscolhida')

  const { data: turmaMateria, error: turmaError } = await supabaseClient
    .from('turmas_materias')
    .select('*')
    .eq('id', turmaID)
    .single();

  // console.log(turmaID, turmasMaterias)
  const { data: turma, error: turmaTError } = await supabaseClient
    .from('turmas')
    .select('*')
    .eq('id', turmaMateria.turma_id)
    .single();

  const { data: materia, error: matError } = await supabaseClient
    .from('materias')
    .select('*')
    .eq('id', turmaMateria.materia_id)
    .single();

  const nomeTurma = turma.nome_turma[0] == 1 || turma.nome_turma[0] == 2 || turma.nome_turma[0] == 3
    ? `${turma.nome_turma[0]}°${turma.nome_turma[1]} EM`
    : `${turma.nome_turma[0]}°${turma.nome_turma[1]}`;

  const nomeMateria = materia.nome_materia == 'Mundo do Trabalho e Empreendedorismo' ? `M.T.E` : `${materia.nome_materia}`

  botaoDropdown.innerHTML = `${nomeTurma} - ${nomeMateria} <span class="arrow">&#x25BC;</span>`

  for (const TM of turmasMaterias) {
    if (TM.id != turmaID) {
      const { data: turmaMateria, error: turmaError } = await supabaseClient
        .from('turmas_materias')
        .select('*')
        .eq('id', TM.id)
        .single();

      // console.log(turmaID, turmasMaterias)
      const { data: turma, error: turmaTError } = await supabaseClient
        .from('turmas')
        .select('*')
        .eq('id', turmaMateria.turma_id)
        .single();

      const { data: materia, error: matError } = await supabaseClient
        .from('materias')
        .select('*')
        .eq('id', turmaMateria.materia_id)
        .single();

      const nomeTurma = turma.nome_turma[0] == 1 || turma.nome_turma[0] == 2 || turma.nome_turma[0] == 3
        ? `${turma.nome_turma[0]}°${turma.nome_turma[1]} EM`
        : `${turma.nome_turma[0]}°${turma.nome_turma[1]}`;

      const nomeMateria = materia.nome_materia == 'Mundo do Trabalho e Empreendedorismo' ? `M.T.E` : `${materia.nome_materia}`
      const liTurma = document.createElement('li')

      liTurma.textContent = `${nomeTurma} - ${nomeMateria}`
      dropdown.appendChild(liTurma)


      liTurma.addEventListener('click', () => {
        localStorage.setItem('professorTurmaEscolhida', turmaMateria.turma_id)
        localStorage.setItem('professorTurmaMatEscolhida', TM.id)
        localStorage.setItem('professorTurmaMatProfEscolhido', turmaMateria.professor_id)


        location.reload()
      })
    }
  }
})