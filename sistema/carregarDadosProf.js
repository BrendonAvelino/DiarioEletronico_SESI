const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Função para buscar dados do professor
async function fetchProfessorData() {
    const userId = localStorage.getItem('authUuid');

    // Busca o ID do professor relacionado ao perfil do usuário
    const { data: profileID, error: profileError } = await supabaseClient
        .from('profiles')
        .select('professor_id')
        .eq('id', userId);

    if (profileError || !profileID?.length) {
        console.error('Erro ao buscar perfil:', profileError || 'Nenhum perfil encontrado');
        return;
    }

    const professorId = profileID[0].professor_id;

    // Busca os dados do professor usando o ID encontrado
    const { data: professor, error: professorError } = await supabaseClient
        .from('professores')
        .select('*')
        .eq('id', professorId);

    if (professorError || !professor?.length) {
        console.error('Erro ao buscar dados do professor:', professorError || 'Professor não encontrado');
        return;
    }

    const spanProfessor = document.getElementById('nomeProfessor');
    spanProfessor.textContent = `Prof. ${professor[0].nome}`;

    // Busca turmas e matérias associadas ao professor
    const { data: turmasMaterias, error: turmasError } = await supabaseClient
        .from('turmas_materias')
        .select('*')
        .eq('professor_id', professorId);

    if (turmasError) {
        console.error('Erro ao buscar turmas:', turmasError.message);
        return;
    }

    // Atualiza a tabela de turmas na página
    populateTable(turmasMaterias);
}

// Popula a tabela com turmas e matérias
async function populateTable(turmasMaterias) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    for (const turmaMateria of turmasMaterias) {
        const { data: materia, error: materiaError } = await supabaseClient
            .from('materias')
            .select('nome_materia')
            .eq('id', turmaMateria.materia_id)
            .single();

        if (materiaError) {
            console.error('Erro ao carregar matéria:', materiaError);
            continue;
        }

        const { data: turma, error: turmaError } = await supabaseClient
            .from('turmas')
            .select('nome_turma, grau, Etapas')
            .eq('id', turmaMateria.turma_id)
            .single();

        if (turmaError) {
            console.error('Erro ao carregar turma:', turmaError);
            continue;
        }

        const tr = document.createElement('tr');
        tr.setAttribute('data-turma-id', turmaMateria.turma_id); // Armazena o ID da turma
        tr.innerHTML = `
            <td>${turma.nome_turma[0]}º Ano</td>
            <td>${turma.nome_turma[1]}</td>
            <td>${turma.grau}</td>
            <td>${materia.nome_materia}</td>
            <td><div class="status-indicator"></div></td>
        `;
        tbody.appendChild(tr);
        tr.addEventListener('click', ()=>{
            localStorage.setItem('professorTurmaEscolhida', turmaMateria.turma_id)
            localStorage.setItem('professorTurmaMatEscolhida', turmaMateria.id)
        })
    }

    applyDynamicColors();
    setupModalEvents();
}

// Mapeia as cores das matérias
const subjectColors = {
    'Biologia': '#94ac0c',
    'Ciências da Natureza': '#94ac0c',
    'Língua Inglesa': '#5771AD',
    'Matemática': '#E67900',
    'Química': '#047F3E',
    'Geografia': '#DB506E',
    'Língua Portuguesa': '#3A7AB6',
    'Física': '#449282',
    'História': '#E15256',
    'Sociologia': '#CC1137',
    'Filosofia': '#AD1880',
    'Educação Física': '#273283',
    'Trilha de Produção Textual': '#5b06b6'
};

// Aplica cores nas células de status com base na matéria
function applyDynamicColors() {
    document.querySelectorAll('#table-container tbody tr').forEach(row => {
        const subject = row.cells[3]?.textContent.trim();
        const statusIndicator = row.querySelector('.status-indicator');
        const color = subjectColors[subject] || '#FF0000';
        if (statusIndicator) {
            statusIndicator.style.backgroundColor = color;
            statusIndicator.style.borderColor = color;
        }
    });
}

// Configura o modal e exibe com um número específico de botões
function showModal(modal, etapas) {
    modal.style.display = 'block';

    const modalContent = modal.querySelector('.modal-content');

    // Preserva o título e botão de fechar e apenas limpa os botões de etapa
    modalContent.querySelectorAll('.modal-button').forEach(button => button.remove());

    // Cria os botões dinamicamente com base no número de etapas
    for (let i = 1; i <= etapas; i++) {
        const button = document.createElement('button');
        button.textContent = `Etapa ${i}`;
        button.classList.add('modal-button');
        
        // Adiciona o evento de clique para armazenar a etapa no localStorage
        button.addEventListener('click', () => {
            localStorage.setItem('etapaSelecionada', i);
            console.log(`Etapa ${i} selecionada e armazenada no localStorage`);
            window.location.href='./ListaPresenca'
        });
        
        modalContent.appendChild(button);
    }
}

// Ajusta o evento do clique das turmas para considerar `turma.Etapas`
async function setupModalEvents() {
    const modal3 = document.getElementById('modal3');
    const modal2 = document.getElementById('modal2');
    const closeBtn3 = document.querySelector('.close3');
    const closeBtn2 = document.querySelector('.close2');

    document.querySelectorAll('#table-container tbody tr').forEach(row => {
        row.addEventListener('click', async () => {
            const year = row.cells[0].textContent.trim();
            const turmaId = row.getAttribute('data-turma-id');

            const { data: turma, error } = await supabaseClient
                .from('turmas')
                .select('Etapas')
                .eq('id', turmaId)
                .single();

            if (error || !turma) {
                console.error('Erro ao buscar etapas da turma:', error);
                return;
            }

            const selectedModal = (year === '2ºAno' || year === '3ºAno') ? modal2 : modal3;
            showModal(selectedModal, turma.Etapas);
        });
    });

    closeBtn3.addEventListener('click', () => closeModal(modal3));
    closeBtn2.addEventListener('click', () => closeModal(modal2));

    window.addEventListener('click', (event) => {
        if (event.target === modal3) closeModal(modal3);
        if (event.target === modal2) closeModal(modal2);
    });
}

// Fecha um modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Verifica autenticação do usuário
async function verificarAutenticacao() {
    const { data: sessionData, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao obter a sessão:', error.message);
    } else if (!sessionData?.session) {
        window.location.href = './../index.html';
    }
}

// Desloga o usuário
async function deslogar() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error('Erro ao deslogar:', error.message);
        alert('Erro ao deslogar. Tente novamente.');
    } else {
        window.location.href = './../index.html';
        localStorage.setItem('authUuid', '');
    }
}

// Configurações iniciais ao carregar a página
document.addEventListener('DOMContentLoaded', verificarAutenticacao);
document.getElementById('botaoDeslog').addEventListener('click', deslogar);
fetchProfessorData();
