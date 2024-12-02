const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function verificarAutenticacao() {
    const { data: sessionData, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao obter a sessão:', error.message);
    } else if (!sessionData?.session) {
        window.location.href = './../index.html';
    }
}
document.addEventListener('DOMContentLoaded', verificarAutenticacao);



let formattedDate = ''
let prettyData = ''

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

document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendario');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const container = document.getElementById('Roteiro'); // Container dos tópicos

    let selectedDate = null;
    let currentDate = new Date();

    // async function fetchRoteiro(data, turma) {
    //     try {
    //         const response = await fetch(`http://localhost:3000/fetch_roteiro?data=${data}&turma=${turma}`);
    //         if (!response.ok) {
    //             return null; // Roteiro não encontrado
    //         }
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Erro ao buscar roteiro:', error);
    //         return null;
    //     }
    // }

    async function handleDayClick(year, month, day) {
        formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        prettyData = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`;
        const turmaID = localStorage.getItem('professorTurmaMatEscolhida');
        // console.log(formattedDate, prettyData)
        const tdsData = document.querySelectorAll('.dateTD')

        if (!turmaID) {
            alert('Turma não selecionada!');
            return;
        }

        tdsData.forEach(td => {
            td.textContent = prettyData
        });

        // // Atualiza o display da data
        // document.getElementById('TextData').textContent = prettyData;
        // dataRoteiro = formattedDate;

        // Fetch roteiro
        // const roteiro = await fetchRoteiro(formattedDate, turmaID);

        // Se houver roteiro, exibe os tópicos
        // if (roteiro) {
        //     const conteudo = roteiro.conteudo
        //         .trim() // Remove espaços em branco e quebras no início e no fim
        //         .replace(/^\n+/, '') // Remove quebras de linha no início
        //         .split('\n \n'); // Divide em tópicos

        //     // Limpa textareas existentes antes de adicionar novas
        //     document.querySelectorAll('.textarea').forEach((el) => el.parentElement.remove());

        //     document.getElementById('input_Titulo').value = roteiro.titulo

        //     let indexo = 0
        //     conteudo.forEach((topico, index) => {
        //         const topicoDiv = document.createElement('div');
        //         topicoDiv.id = `topico${index + 1}`;

        //         const textArea = document.createElement('textarea');
        //         textArea.className = 'textarea';
        //         textArea.name = `topico${index + 1}`;
        //         textArea.id = `textareaTopico${index + 1}`;
        //         textArea.placeholder = `Tópico ${index + 1}`;
        //         textArea.value = topico.trim(); // Remove espaços em excesso

        //         topicoDiv.appendChild(textArea);
        //         container.appendChild(topicoDiv);

        //         indexo = index + 1
        //     });
        //     const topicoDiv = document.createElement('div');
        //     topicoDiv.id = `topico${indexo + 1}`;

        //     const textArea = document.createElement('textarea');
        //     textArea.className = 'textarea';
        //     textArea.name = `topico${indexo + 1}`;
        //     textArea.id = `textareaTopico${indexo + 1}`;
        //     textArea.placeholder = `Tópico ${indexo + 1}`;

        //     topicoDiv.appendChild(textArea);
        //     container.appendChild(topicoDiv);

        //     // const firstTextarea = document.querySelector('.textarea');    
        //     textArea.addEventListener('input', handleInput);

        //     // Caso o roteiro tenha sido encontrado, o título não será alterado (permanece como estava)
        // } else {
        //     // Se não houver roteiro, limpa o título e as textareas
        //     document.getElementById('input_Titulo').value = ''; // Limpa o título

        //     // Limpa as textareas anteriores, se houver
        //     document.querySelectorAll('.textarea').forEach((el) => el.parentElement.remove());

        //     // Cria uma única textarea para o novo roteiro
        //     const defaultTextAreaDiv = document.createElement('div');
        //     defaultTextAreaDiv.id = 'topico1';

        //     const defaultTextArea = document.createElement('textarea');
        //     defaultTextArea.className = 'textarea';
        //     defaultTextArea.name = 'topico1';
        //     defaultTextArea.id = 'textareaTopico1';
        //     defaultTextArea.placeholder = 'Primeiro Tópico';

        //     defaultTextAreaDiv.appendChild(defaultTextArea);
        //     container.appendChild(defaultTextAreaDiv);
        //     defaultTextAreaDiv.addEventListener('input', handleInput);
        // }
    }


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
            dayElement.addEventListener('click', function () {
                if (selectedDate) {
                    selectedDate.classList.remove('selected');
                }
                dayElement.classList.add('selected');
                selectedDate = dayElement;

                // Chama a função para verificar e carregar roteiro
                handleDayClick(year, month, day);
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

function abreviarNome(nomeCompleto) {
    // Divide o nome completo em partes
    const partes = nomeCompleto.split(" ");

    // Se o nome tiver apenas duas partes, retorna o nome completo sem alterações
    if (partes.length <= 2) return nomeCompleto;

    // Mantém o primeiro e o último nome completos
    const primeiroNome = partes[0];
    const ultimoNome = partes[partes.length - 1];

    // Abrevia os nomes intermediários, ignorando os que começam com letra minúscula
    const intermediarios = partes.slice(1, -1).filter(nome => nome[0] === nome[0].toUpperCase())
        .map(nome => nome[0] + ".");

    // Junta tudo: primeiro nome + intermediários abreviados + último nome
    return [primeiroNome, ...intermediarios, ultimoNome].join(" ");
}

async function populateTable() {
    const tbody = document.getElementById('tbody')
    tbody.innerHTML = ''
    const turmaID = localStorage.getItem('professorTurmaEscolhida')

    const { data: alunos, error: turmaError } = await supabaseClient
        .from('alunos')
        .select('id, nome')
        .eq('turma_id', turmaID)

    const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome));

    const { data: turma, error: turmatError } = await supabaseClient
        .from('turmas')
        .select('nome_turma')
        .eq('id', turmaID)

    const nomeTurma = `${turma[0].nome_turma[0]}° Ano ${turma[0].nome_turma[1]}`

    alunosOrdenados.forEach(aluno => {


        tbody.innerHTML += `      <tr class="trAluno" data-alunoId="${aluno.id}">
                            <td>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </td>
                            <td>${nomeTurma}</td>
                            <td>${abreviarNome(aluno.nome)}</td>
                            <td class="dateTD">${prettyData}</td>
                        </tr>`
    });
}

populateTable()

document.getElementById('btnSave').addEventListener('click', async () => {
    // const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    const professorTurmaMatEscolhida = localStorage.getItem('professorTurmaMatEscolhida');
    const trAlunos = document.querySelectorAll('.trAluno')
    const etapaSelecionada = localStorage.getItem('etapaSelecionada');
    // console.log(switches)

    for (const trAluno of trAlunos) {
        const idAluno = trAluno.getAttribute('data-alunoId');
        const swtc = trAluno.querySelector('.switch input[type="checkbox"]').checked


        try {
            const response = await fetch('http://localhost:3000/mandar_faltas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aluno_id: idAluno,
                    etapa_id: etapaSelecionada,
                    falta: swtc
                }),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Erro ao enviar faltas', errorResponse.error);
                alert('Erro ao enviar faltas: ' + errorResponse.error);
                return;
            }
    
            const successMessage = await response.json();
            console.log(successMessage.message);
            // alert('faltas foram enviadas!');
        } catch (error) {
            console.error('Erro ao realizar update:', error.message);
            // alert('Erro ao realizar update: ' + error.message);
        }
    }
    alert('As faltas foram enviadas')
})