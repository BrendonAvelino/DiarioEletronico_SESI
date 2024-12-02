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


function setarAtributos() {
    document.querySelectorAll('.aluno').forEach(aluno => {
        // Evento quando o drag começa
        aluno.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', aluno.id);
        });
    });

    document.querySelectorAll('.cadeira').forEach(cadeira => {
        // Permitir drop
        cadeira.addEventListener('dragover', e => {
            e.preventDefault(); // Necessário para permitir o drop
        });

        // Evento quando o item é solto
        cadeira.addEventListener('drop', e => {
            e.preventDefault();
            const alunoId = e.dataTransfer.getData('text/plain'); // Obtém o ID do aluno
            const aluno = document.getElementById(alunoId);
            const alunoAtual = cadeira.querySelector('.aluno'); // Verifica se a cadeira já tem um aluno

            if (alunoAtual) {
                // Se a cadeira já possui um aluno, troca os dois de lugar
                const origem = aluno.parentElement; // Cadeira ou lista de origem do aluno arrastado

                if (origem.classList.contains('cadeira')) {
                    // Troca entre cadeiras
                    origem.appendChild(alunoAtual); // Coloca o aluno atual da cadeira de destino na cadeira de origem
                } else {
                    // Troca entre lista e cadeira
                    const listaUl = document.querySelector('#ulAlunos'); // Referência à lista de alunos
                    listaUl.appendChild(alunoAtual); // Retorna o aluno atual da cadeira para a lista
                }
            }

            // Adiciona o novo aluno à cadeira
            cadeira.appendChild(aluno);
        });
    });

    const listaUl = document.querySelector('#ulAlunos');
    listaUl.addEventListener('dragover', e => {
        e.preventDefault(); // Necessário para permitir o drop
    });

    listaUl.addEventListener('drop', e => {
        e.preventDefault();
        const alunoId = e.dataTransfer.getData('text/plain'); // Obtém o ID do aluno
        const aluno = document.getElementById(alunoId);
        listaUl.appendChild(aluno); // Adiciona o aluno de volta à lista
    });
}

const btnSalvar = document.getElementById('salvar')

btnSalvar.addEventListener('click', async () => {

    mostrarLoading(); // Exibe o indicador

    try {
        const cadeiras = document.querySelectorAll('.cadeira');
        let turmaEscolha = localStorage.getItem('turmaPick');

        const { data: turmaID, error: turmaIDError } = await supabaseClient
            .from('turmas')
            .select('*')
            .eq('nome_turma', turmaEscolha);

        if (turmaIDError) {
            console.error('Erro ao buscar turma:', turmaIDError);
            return;
        }

        for (const cadeira of cadeiras) {
            const numeroCadeira = cadeira.getAttribute('data-numeroCadeira');
            const aluno = cadeira.querySelector('.aluno');

            if (aluno) {
                const alunoID = aluno.getAttribute('data-idAluno');
                // console.log(`Aluno ${alunoID} na cadeira ${numeroCadeira} na sala da turma ${turmaID[0].id} `);

                try {
                    // Envia a requisição POST para o servidor com o professorId
                    const response = await fetch('http://localhost:3000/send_alunoCarteira', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            cadeira: numeroCadeira,
                            aluno: alunoID,
                            turma: turmaID[0].id
                        }),
                    });

                    // Verifica se a resposta foi bem-sucedida
                    // if (!response.ok) {
                    //     const errorResponse = await response.json();
                    //     console.error('Erro ao inserir usuário e dados associados:', errorResponse.error);
                    //     alert('Erro ao inserir: ' + errorResponse.error);
                    //     return;
                    // }

                    // const successMessage = await response.json();
                    // console.log(successMessage.message);
                    // alert('Usuário e dados associados foram inseridos com sucesso!');
                } catch (error) {
                    console.error('Erro ao realizar inserção:', error.message);
                    alert('Erro ao realizar inserção: ' + error.message);
                }

            }
        }
    } catch (error) {

    }finally {
        esconderLoading(); // Esconde o indicador
    }
    location.reload();

});

document.addEventListener('DOMContentLoaded', async () => {

    mostrarLoading(); // Exibe o indicador

    try {
        const cadeiras = document.querySelectorAll('.cadeira');

        let turmaEscolha = localStorage.getItem('turmaPick')

        const { data: turmaID, error: turmaIDError } = await supabaseClient
            .from('turmas')
            .select('*')
            .eq('nome_turma', turmaEscolha);

        // console.log(turmaID)     

        const { data: alunos, error: turmaError } = await supabaseClient
            .from('alunos')
            .select('id, nome')
            .eq('turma_id', turmaID[0].id)

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

        setarAtributos()
    } catch (error) {

    } finally {
        esconderLoading(); // Esconde o indicador
    }



})