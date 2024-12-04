const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

function mostrarLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
}

function esconderLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}


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



async function verificarAutenticacao() {
    const { data: sessionData, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao obter a sessão:', error.message);
    } else if (!sessionData?.session) {
        window.location.href = './../index.html';
    }
}

document.addEventListener('DOMContentLoaded', verificarAutenticacao);


// function setarAtributos() {
//     document.querySelectorAll('.aluno').forEach(aluno => {
//         // Evento quando o drag começa
//         aluno.addEventListener('dragstart', e => {
//             e.dataTransfer.setData('text/plain', aluno.id);
//         });
//     });

//     document.querySelectorAll('.cadeira').forEach(cadeira => {
//         // Permitir drop
//         cadeira.addEventListener('dragover', e => {
//             e.preventDefault(); // Necessário para permitir o drop
//         });

//         // Evento quando o item é solto
//         cadeira.addEventListener('drop', e => {
//             e.preventDefault();
//             const alunoId = e.dataTransfer.getData('text/plain'); // Obtém o ID do aluno
//             const aluno = document.getElementById(alunoId);
//             const alunoAtual = cadeira.querySelector('.aluno'); // Verifica se a cadeira já tem um aluno

//             if (alunoAtual) {
//                 // Se a cadeira já possui um aluno, troca os dois de lugar
//                 const origem = aluno.parentElement; // Cadeira ou lista de origem do aluno arrastado

//                 if (origem.classList.contains('cadeira')) {
//                     // Troca entre cadeiras
//                     origem.appendChild(alunoAtual); // Coloca o aluno atual da cadeira de destino na cadeira de origem
//                 } else {
//                     // Troca entre lista e cadeira
//                     const listaUl = document.querySelector('#ulAlunos'); // Referência à lista de alunos
//                     listaUl.appendChild(alunoAtual); // Retorna o aluno atual da cadeira para a lista
//                 }
//             }

//             // Adiciona o novo aluno à cadeira
//             cadeira.appendChild(aluno);
//         });
//     });

//     const listaUl = document.querySelector('#ulAlunos');
//     listaUl.addEventListener('dragover', e => {
//         e.preventDefault(); // Necessário para permitir o drop
//     });

//     listaUl.addEventListener('drop', e => {
//         e.preventDefault();
//         const alunoId = e.dataTransfer.getData('text/plain'); // Obtém o ID do aluno
//         const aluno = document.getElementById(alunoId);
//         listaUl.appendChild(aluno); // Adiciona o aluno de volta à lista
//     });
// }

// const btnSalvar = document.getElementById('salvar')

// btnSalvar.addEventListener('click', async () => {
//     const cadeiras = document.querySelectorAll('.cadeira');
//     let turmaEscolha = localStorage.getItem('turmaPick');

//     const { data: turmaID, error: turmaIDError } = await supabaseClient
//         .from('turmas')
//         .select('*')
//         .eq('nome_turma', turmaEscolha);

//     if (turmaIDError) {
//         console.error('Erro ao buscar turma:', turmaIDError);
//         return;
//     }

//     for (const cadeira of cadeiras) {
//         const numeroCadeira = cadeira.getAttribute('data-numeroCadeira');
//         const aluno = cadeira.querySelector('.aluno');

//         if (aluno) {
//             const alunoID = aluno.getAttribute('data-idAluno');
//             // console.log(`Aluno ${alunoID} na cadeira ${numeroCadeira} na sala da turma ${turmaID[0].id} `);

//             try {
//                 // Envia a requisição POST para o servidor com o professorId
//                 const response = await fetch('http://localhost:3000/send_alunoCarteira', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         cadeira: numeroCadeira,
//                         aluno: alunoID,
//                         turma: turmaID[0].id
//                     }),
//                 });

//                 // Verifica se a resposta foi bem-sucedida
//                 // if (!response.ok) {
//                 //     const errorResponse = await response.json();
//                 //     console.error('Erro ao inserir usuário e dados associados:', errorResponse.error);
//                 //     alert('Erro ao inserir: ' + errorResponse.error);
//                 //     return;
//                 // }

//                 // const successMessage = await response.json();
//                 // console.log(successMessage.message);
//                 // alert('Usuário e dados associados foram inseridos com sucesso!');
//             } catch (error) {
//                 console.error('Erro ao realizar inserção:', error.message);
//                 alert('Erro ao realizar inserção: ' + error.message);
//             }

//         }
//     }
//     location.reload();
// });

document.addEventListener('DOMContentLoaded', async () => {

    try {
        const cadeiras = document.querySelectorAll('.cadeira');

        let turmaEscolha = localStorage.getItem('professorTurmaEscolhida')

        // const { data: turmaID, error: turmaIDError } = await supabaseClient
        //     .from('turmas')
        //     .select('*')
        //     .eq('nome_turma', turmaEscolha);

        // console.log(turmaID)     

        const { data: alunos, error: turmaError } = await supabaseClient
            .from('alunos')
            .select('id, nome')
            .eq('turma_id', turmaEscolha)

        // console.log(alunos)

        const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome));
        // console.log(alunosOrdenados) 

        const ulAlunos = document.getElementById('ulAlunos')
        const h1Aluno = document.getElementById('h1Aluno')
        for (const aluno of alunosOrdenados) {
            try {
                // Obter turma pelo nome
                const { data: conflito, error: turmaIDError } = await supabaseClient
                    .from('salas')
                    .select('*')
                    .eq('aluno_id', aluno.id)
                    .single();

                if (!conflito) {
                    const liAluno = document.createElement('li');
                    const divAlunoLi = document.createElement('div');
                    divAlunoLi.setAttribute('draggable', 'true');
                    divAlunoLi.setAttribute('data-idAluno', aluno.id);
                    divAlunoLi.appendChild(liAluno);
                    divAlunoLi.classList.add('aluno');
                    divAlunoLi.id = `aluno${aluno.id}`;
                    liAluno.textContent = abreviarNome(aluno.nome);
                    ulAlunos.appendChild(divAlunoLi);

                    // Adicionar evento ao elemento
                    liAluno.addEventListener('click', () => {
                        h1Aluno.textContent = abreviarNome(aluno.nome);
                        alunoEscolhido = aluno.id;
                    });
                }


            } catch (error) {
                console.error('Erro inesperado ao processar aluno:', error);
            }
        }

        for (const cadeira of cadeiras) {

            const numeroCadeira = cadeira.getAttribute('data-numeroCadeira');
    
            const { data: conflito, error: turmaIDError } = await supabaseClient
                .from('salas')
                .select('*')
                .eq('cadeira_numero', numeroCadeira)
                .single();
    
    
            if (conflito) {
                const divAluno = document.createElement('div')
                divAluno.classList.add('aluno')
                divAluno.id = `aluno${conflito.aluno_id}`
                divAluno.setAttribute('data-idAluno', conflito.aluno_id);
    
                divAluno.setAttribute('draggable', 'true');
                const liAluno = document.createElement('li')
    
                const { data: aluno, error: turmaIDError } = await supabaseClient
                    .from('alunos')
                    .select('*')
                    .eq('id', conflito.aluno_id)
                    .single();
    
                liAluno.textContent = abreviarNome(aluno.nome)
                divAluno.appendChild(liAluno)
                cadeira.appendChild(divAluno)
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    } finally {
        esconderLoading(); // Esconde o indicador
    }
    // console.log('oi')


   

    // setarAtributos()

})

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

    // const spanProfessor = document.getElementById('nomeProfessor');
    // spanProfessor.textContent = `Prof. ${professor[0].nome}`;

    // Busca turmas e matérias associadas ao professor
    const { data: turmasMaterias, error: turmasError } = await supabaseClient
        .from('turmas_materias')
        .select('*')
        .eq('professor_id', professorId);

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

                location.reload()
            })
        }
    }
})