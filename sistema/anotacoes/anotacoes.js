const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

function getFormattedDates() {
    const now = new Date();

    // Formato YYYY-MM-DD
    const yyyyMMdd = now.toISOString().split('T')[0];

    // Formato DD/MM/YYYY
    const ddMMyyyy = [
        String(now.getDate()).padStart(2, '0'),
        String(now.getMonth() + 1).padStart(2, '0'), // Mês começa em 0
        now.getFullYear()
    ].join('/');

    return { yyyyMMdd, ddMMyyyy };
}
const dates = getFormattedDates();

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


// Seleciona os elementos
const fileTrigger = document.getElementById('fileTrigger');
const fileInput = document.getElementById('fileInput');

// Redireciona o clique da div para o input
fileTrigger.addEventListener('click', () => {
    fileInput.click();
});

// Opcional: captura o evento de seleção de arquivos
fileInput.addEventListener('change', (event) => {
    const files = event.target.files; // Obtem os arquivos selecionados
    if (files.length > 0) {
        console.log('Arquivo selecionado:', files[0].name);
    }
});

let upsert = ''
//   let notes = [];

// Exibe o modal para criar anotação
function showCreateNote(upserte) {
    upsert = upserte
    if (upserte == 'insert') {
        document.getElementById('janelaModalDatas').textContent = dates.ddMMyyyy
        document.getElementById('input_Titulo').value = ''
        document.getElementById('textareaTopico1').value = ''
    }
    document.getElementById('janela-modal').style.display = 'flex';
}

// Esconde o modal
function hideCreateNote() {
    document.getElementById('janela-modal').style.display = 'none';
}

// Função para salvar a anotação
//   function saveNote() {
//     const title = document.getElementById('tituloDescricao').value;
//     const description = document.getElementById('descricao').value;

//     if (!title || !description) {
//       alert("Preencha o título e a descrição.");
//       return;
//     }

//     const note = { title, description };
//     notes.push(note);

//     // Limpa os campos
//     document.getElementById('tituloDescricao').value = '';
//     document.getElementById('descricao').value = '';

//     hideCreateNote();
//     renderNotes();
//   }

// Função para renderizar as anotações na tela
//   function renderNotes() {
//     const main = document.getElementById('mainSesi');
//     main.innerHTML = ''; // Limpa o conteúdo atual

//     notes.forEach((note, index) => {
//       const noteElement = document.createElement('div');
//       noteElement.className = 'note';
//       noteElement.innerHTML = `
//         <h3>${note.title}</h3>
//         <p>${note.description}</p>
//         <button onclick="abrirModal(${index})">Abrir</button>
//         <button onclick="deleteNote(${index})">Excluir</button>
//       `;

//       main.appendChild(noteElement);
//     });
//   }


//   // Função para excluir a anotação
//   function deleteNote(index) {
//     notes.splice(index, 1); // Remove a anotação da lista
//     renderNotes(); // Atualiza a exibição
//   }




//   function abrirModal(){
//     const modal = document.getElementById('janela-modal')
//     modal.classList.add('abrir')

//     modal.addEventListener('click',(e) => {
//       if(e.target.id == 'salvar' || e.target.id == 'janela-modal'){
//         modal.classList.remove('abrir')
//       }
//     })
//   }

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
        document.querySelector('.icon').src = "../img/xxx.png";
    }
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



// Exemplo de uso
let dataId = ''

document.getElementById('janelaModalDatas').textContent = dates.ddMMyyyy

document.getElementById('salvar').addEventListener('click', async () => {
    const turmaID = localStorage.getItem('professorTurmaMatEscolhida')
    const titulo = document.getElementById('input_Titulo').value
    const conteudo = document.getElementById('textareaTopico1').value
    const data = dates.yyyyMMdd
    const upserte = upsert

    // console.log(upserte)

    if (titulo == '') {
        alert('é necessário um titulo')
        return
    }
    if (conteudo == '') {
        alert('é necessário uma anotação')
        return
    }

    // console.log(turmaID, titulo, conteudo, data, upsert)

    if (upserte == 'insert') {
        try {
            const response = await fetch('http://localhost:3000/mandar_anotacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conteudo: conteudo,
                    data: data,
                    titulo: titulo,
                    turma_materia_id: turmaID,
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Erro ao enviar anotaçao', errorResponse.error);
                alert('Erro ao enviar anotação: ' + errorResponse.error);
                return;
            }

            const successMessage = await response.json();
            console.log(successMessage.message);
            alert('sua anotação foi enviada!');
        } catch (error) {
            console.error('Erro ao realizar insert:', error.message);
            alert('Erro ao realizar insert: ' + error.message);
        }

        location.reload();
    } else if (upserte == 'update') {


        try {
            const response = await fetch('http://localhost:3000/update_anotacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conteudo: conteudo,
                    data: data,
                    titulo: titulo,
                    turma_materia_id: turmaID,
                    id: dataId
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Erro ao enviar anotaçao', errorResponse.error);
                alert('Erro ao enviar anotação: ' + errorResponse.error);
                return;
            }

            const successMessage = await response.json();
            console.log(successMessage.message);
            alert('sua anotação foi enviada!');
        } catch (error) {
            console.error('Erro ao realizar insert:', error.message);
            alert('Erro ao realizar insert: ' + error.message);
        }

        location.reload();
    }


})
document.addEventListener('DOMContentLoaded', async () => {
    const turmaID = localStorage.getItem('professorTurmaMatEscolhida')


    const { data: anotacoes, error: profileError } = await supabaseClient
        .from('anotacoes_pessoais')
        .select('*')
        .eq('turma_materia_id', turmaID);

    if (profileError || !anotacoes?.length) {
        console.error('Erro ao buscar anotacoes:', profileError || 'Nenhuma anotação encontrada');
        return;
    }

    const anotacoesDiv = document.getElementById('anotacoesDiv')
    // console.log(anotacoes)
    anotacoes.forEach(anotacao => {
        anotacoesDiv.innerHTML += `            <div  class="anotacaoDiv" data-id="${anotacao.id}">

                <div class="textos">
                <h4 class="titulo">${anotacao.titulo}</h4>
                <p class="texto">
                ${anotacao.conteudo}
                </p>
                </div>    
                <div class="botoes">
                    <div class="iconDiv">
                        <i class="fa-solid fa-trash fa-xl"></i>
                        <span class="tooltip">Apagar</span>
                    </div>
                    <div class="iconDiv eye">
                        <i class="fa-solid fa-eye fa-xl"></i>
                        <span class="tooltip">Vizualizar</span>
                    </div>
                </div>
            </div>`
    });

    // Adicionando evento de clique no ícone fa-eye
    document.querySelectorAll('.fa-eye').forEach(eyeIcon => {
        eyeIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Evita que eventos no pai sejam acionados
            const anotacaoDiv = this.closest('.anotacaoDiv'); // Encontra o elemento pai mais próximo com a classe .anotacaoDiv
            dataId = anotacaoDiv.dataset.id; // Captura o valor de data-idF


            // Encontrar a anotação correspondente pelo data-id
            const anotacaoSelecionada = anotacoes.find(anotacao => anotacao.id == dataId);
            if (anotacaoSelecionada) {
                // Substituir valores nos elementos correspondentes
                document.getElementById('janelaModalDatas').textContent = anotacaoSelecionada.data;
                document.getElementById('input_Titulo').value = anotacaoSelecionada.titulo;
                document.getElementById('textareaTopico1').value = anotacaoSelecionada.conteudo;
            }
            showCreateNote('update')

        });
    });
    const trashIcons = document.querySelectorAll('.fa-trash');
    for (const trashIcon of trashIcons) {
        trashIcon.addEventListener('click', async function (event) {
            event.stopPropagation(); // Evita que eventos no pai sejam acionados
            const anotacaoDiv = this.closest('.anotacaoDiv'); // Encontra o elemento pai mais próximo com a classe .anotacaoDiv
            const dataId = anotacaoDiv.dataset.id; // Captura o valor de data-id

            try {
                // Envia a requisição POST para o servidor com o id
                const response = await fetch('http://localhost:3000/del_anotacoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: dataId }),
                });

                // Verifica se a resposta foi bem-sucedida
                if (!response.ok) {
                    const errorResponse = await response.json();
                    console.error('Erro ao excluir anotação:', errorResponse.error);
                    alert('Erro ao excluir anotação: ' + errorResponse.error);
                    return;
                }

                const successMessage = await response.json();
                console.log(successMessage.message);
                // alert('Anotação excluída com sucesso!');
            } catch (error) {
                console.error('Erro ao realizar exclusão:', error.message);
                // alert('Erro ao realizar exclusão: ' + error.message);
            }

            location.reload()
        });
    }


})
