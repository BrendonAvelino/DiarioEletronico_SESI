const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let dataRoteiro

async function verificarAutenticacao() {
    const { data: sessionData, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao obter a sessão:', error.message);
    } else if (!sessionData?.session) {
        window.location.href = './../../index.html';
    }
}

document.addEventListener('DOMContentLoaded', verificarAutenticacao);


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


const roteiroElement = document.getElementById('Roteiro');

// Função para criar uma nova div com uma textarea
function createTextarea(index) {
    const newDiv = document.createElement('div');
    newDiv.id = `topico${index}`;

    const newTextarea = document.createElement('textarea');
    newTextarea.className = 'textarea';
    newTextarea.placeholder = `Tópico ${index}`;
    newTextarea.id = `textareaTopico${index}`;
    newTextarea.name = `topico${index}`;
    newTextarea.addEventListener('input', handleInput);

    newDiv.appendChild(newTextarea);
    roteiroElement.appendChild(newDiv);
}

// Função para lidar com a entrada em textareas
function handleInput(event) {
    console.log('oi')
    const allTextareas = document.querySelectorAll('.textarea');
    const lastTextarea = allTextareas[allTextareas.length - 1];

    // Verifica se o textarea preenchido é o último
    if (event.target === lastTextarea && event.target.value.trim() !== '') {
        createTextarea(allTextareas.length + 1); // Cria uma nova div com textarea
    }
}

// Adiciona o evento de input ao primeiro textarea
const firstTextarea = document.querySelector('.textarea');
firstTextarea.addEventListener('input', handleInput);


// calendario
document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendario');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const container = document.getElementById('Roteiro'); // Container dos tópicos

    let selectedDate = null;
    let currentDate = new Date();

    async function fetchRoteiro(data, turma) {
        try {
            const response = await fetch(`http://localhost:3000/fetch_roteiro?data=${data}&turma=${turma}`);
            if (!response.ok) {
                return null; // Roteiro não encontrado
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar roteiro:', error);
            return null;
        }
    }

    async function handleDayClick(year, month, day) {
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const prettyData = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
        const turmaID = localStorage.getItem('professorTurmaMatEscolhida');
    
        if (!turmaID) {
            alert('Turma não selecionada!');
            return;
        }
    
        // Atualiza o display da data
        document.getElementById('TextData').textContent = prettyData;
        dataRoteiro = formattedDate;
    
        // Fetch roteiro
        const roteiro = await fetchRoteiro(formattedDate, turmaID);
    
        // Se houver roteiro, exibe os tópicos
        if (roteiro) {
            const conteudo = roteiro.conteudo
                .trim() // Remove espaços em branco e quebras no início e no fim
                .replace(/^\n+/, '') // Remove quebras de linha no início
                .split('\n \n'); // Divide em tópicos
    
            // Limpa textareas existentes antes de adicionar novas
            document.querySelectorAll('.textarea').forEach((el) => el.parentElement.remove());
            
            document.getElementById('input_Titulo').value = roteiro.titulo
            
            let indexo = 0
            conteudo.forEach((topico, index) => {
                const topicoDiv = document.createElement('div');
                topicoDiv.id = `topico${index + 1}`;
    
                const textArea = document.createElement('textarea');
                textArea.className = 'textarea';
                textArea.name = `topico${index + 1}`;
                textArea.id = `textareaTopico${index + 1}`;
                textArea.placeholder = `Tópico ${index + 1}`;
                textArea.value = topico.trim(); // Remove espaços em excesso
    
                topicoDiv.appendChild(textArea);
                container.appendChild(topicoDiv);

                indexo = index + 1
            });
            const topicoDiv = document.createElement('div');
            topicoDiv.id = `topico${indexo + 1}`;

            const textArea = document.createElement('textarea');
            textArea.className = 'textarea';
            textArea.name = `topico${indexo + 1}`;
            textArea.id = `textareaTopico${indexo + 1}`;
            textArea.placeholder = `Tópico ${indexo + 1}`;

            topicoDiv.appendChild(textArea);
            container.appendChild(topicoDiv);

            // const firstTextarea = document.querySelector('.textarea');    
            textArea.addEventListener('input', handleInput);
    
            // Caso o roteiro tenha sido encontrado, o título não será alterado (permanece como estava)
        } else {
            // Se não houver roteiro, limpa o título e as textareas
            document.getElementById('input_Titulo').value = ''; // Limpa o título
    
            // Limpa as textareas anteriores, se houver
            document.querySelectorAll('.textarea').forEach((el) => el.parentElement.remove());
    
            // Cria uma única textarea para o novo roteiro
            const defaultTextAreaDiv = document.createElement('div');
            defaultTextAreaDiv.id = 'topico1';
    
            const defaultTextArea = document.createElement('textarea');
            defaultTextArea.className = 'textarea';
            defaultTextArea.name = 'topico1';
            defaultTextArea.id = 'textareaTopico1';
            defaultTextArea.placeholder = 'Primeiro Tópico';
    
            defaultTextAreaDiv.appendChild(defaultTextArea);
            container.appendChild(defaultTextAreaDiv);
            defaultTextAreaDiv.addEventListener('input', handleInput);
        }
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








const btnSave = document.getElementById('btnSave')



btnSave.addEventListener('click', async () => {

    const tituloRoteiro = document.getElementById('input_Titulo')
    const textAreas = document.querySelectorAll('.textarea');
    let roteiro = ""; // Inicialize com uma string vazia

    textAreas.forEach(textArea => {
        if (textArea.value.trim() === "") {
            return; // Ignora textareas vazias
        } else {
            roteiro += `\n \n${textArea.value.trim()}`; // Concatena o valor ao roteiro
        }
    });

    if (roteiro == "") {
        alert('é preciso ter conteudo no roteiro')
        return
    }

    if (!dataRoteiro) {
        alert('é preciso selecionar uma data')
        return
    }
    if (!tituloRoteiro.value) {
        alert('é preciso escrever um titulo')
        return
    }

    const turmaID = localStorage.getItem('professorTurmaMatEscolhida')



    try {
        const response = await fetch('http://localhost:3000/send_roteiro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roteiro: roteiro,
                data: dataRoteiro,
                titulo: tituloRoteiro.value,
                turma: turmaID
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Erro ao enviar recado', errorResponse.error);
            alert('Erro ao enviar observacao: ' + errorResponse.error);
            return;
        }

        const successMessage = await response.json();
        console.log(successMessage.message);
        alert('seu roteiro foi enviada!');
    } catch (error) {
        console.error('Erro ao realizar update:', error.message);
        alert('Erro ao realizar update: ' + error.message);
    }

    location.reload();
});


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