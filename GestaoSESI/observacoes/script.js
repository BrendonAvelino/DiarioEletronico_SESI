const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let alunoEscolhido

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

async function fetchAlunosData() {
    const turmaID = localStorage.getItem('professorTurmaEscolhida')

    const { data: alunos, error: turmaError } = await supabaseClient
        .from('alunos')
        .select('id, nome')
        .eq('turma_id', turmaID)

    const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome));
    // console.log(alunosOrdenados) 

    const ulAlunos = document.getElementById('ulAlunos')
    const h1Aluno = document.getElementById('h1Aluno')
    alunosOrdenados.forEach(aluno => {
        const liAluno = document.createElement('li')
        // console.log(abreviarNome(aluno.nome))
        liAluno.textContent = abreviarNome(aluno.nome)
        ulAlunos.appendChild(liAluno)

        liAluno.addEventListener('click', () => {
            h1Aluno.textContent = abreviarNome(aluno.nome)
            alunoEscolhido = aluno.id
        })
    });
}





const btnSalvar = document.getElementById('salvar')
const textArea = document.getElementById('textareaObservacoes')
btnSalvar.addEventListener('click', async () => {


    if (textArea.value == '') {
        alert('é necessario uma observação')
        return
    }
    if (!alunoEscolhido) {
        alert('é necessaria a seleção de um aluno')
        return
    }

    // const userId = localStorage.getItem('authUuid');

    // // Busca o ID do professor relacionado ao perfil do usuário
    // const { data: profileID, error: profileError } = await supabaseClient
    //     .from('profiles')
    //     .select('professor_id')
    //     .eq('id', userId);

    // if (profileError || !profileID?.length) {
    //     console.error('Erro ao buscar perfil:', profileError || 'Nenhum perfil encontrado');
    //     return;
    // }

    const professorId = localStorage.getItem('professorTurmaMatProfEscolhido');


    const dataAtual = new Date().toISOString().split('T')[0];
    const professorReca = professorId
    const alunoReca = alunoEscolhido
    const recado = textArea.value

    // console.log(dataAtual, professorReca, alunoReca, recado)

    try {
        const response = await fetch('http://localhost:3000/send_recado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recado: recado,
                alunoRecadado: alunoReca,
                professorRecadiante: professorReca,
                data: dataAtual
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
        alert('sua observação foi enviada!');
    } catch (error) {
        console.error('Erro ao realizar update:', error.message);
        alert('Erro ao realizar update: ' + error.message);
    }

    location.reload();

})


fetchAlunosData()


async function verificarAutenticacao() {
    const { data: sessionData, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao obter a sessão:', error.message);
    } else if (!sessionData?.session) {
        window.location.href = './../index.html';
    }
}
document.addEventListener('DOMContentLoaded', verificarAutenticacao);

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


