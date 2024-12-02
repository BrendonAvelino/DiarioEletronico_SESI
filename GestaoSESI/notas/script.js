const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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

async function populationTable() {
    const areaNotas = document.getElementById('areaNotas')
    const turmaID = localStorage.getItem('professorTurmaEscolhida')

    const { data: alunos, error: turmaError } = await supabaseClient
        .from('alunos')
        .select('id, nome')
        .eq('turma_id', turmaID)

    const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome));

    // console.log(alunosOrdenados)

    alunosOrdenados.forEach(aluno => {
        // console.log(aluno.nome, aluno.id)
        areaNotas.innerHTML += `            <div class="alunoNota" data-alunoId="${aluno.id}">
                <h3>${abreviarNome(aluno.nome)}</h3>
                <input class="notas" type="text" maxlength="3" placeholder="0,0">
                <input class="notas" type="text" maxlength="3" placeholder="0,0">
                <input class="notas" type="text" maxlength="3" placeholder="0,0">
                <div class="media"><p>0,0</p></div>
            </div>`

    });

    document.querySelectorAll('.notas').forEach(input => {
        input.addEventListener('input', (e) => {
            let currentValue = e.target.value.replace(',', '.'); // Substitui ',' por '.' (ajuste para decimal)
            currentValue = currentValue.replace(/[^0-9.]/g, ''); // Remove caracteres inválidos
    
            // Caso o campo seja limpo
            if (currentValue === "") {
                e.target.value = ""; // Permite que o campo fique vazio
                return;
            }
    
            // Caso apenas um dígito seja digitado
            if (currentValue.length === 1) {
                e.target.value = currentValue; // Mantém o valor como está
                return;
            }
    
            // Caso "10" seja digitado diretamente
            if (currentValue === "10") {
                e.target.value = "10"; // Mantém "10"
                return;
            }
    
            // Caso tenha mais de um caractere
            if (currentValue.length >= 2) {
                if (currentValue[0] === '1' && currentValue[1] === '0') {
                    e.target.value = "10"; // Garante que "1" seguido de "0" seja "10"
                } else {
                    e.target.value = `${currentValue[0]},${currentValue.slice(1, 3)}`; // Formata como "X,YY"
                }
            }
    
            // Limita o valor a 10
            if (parseFloat(e.target.value.replace(',', '.')) > 10) {
                e.target.value = "10";
            }
        });
    
        // Caso o usuário apague tudo, remove o formato inválido
        input.addEventListener('keydown', (e) => {
            if (e.key === "Backspace") {
                e.target.value = ""; // Permite apagar tudo
                atualizarMedia()
            }
        });
    });
    
    atualizarMedia()
    carregarNotas()

    
}

document.getElementById('botaoSalvar').addEventListener('click', () => {
    const notasDiv = document.querySelectorAll('.alunoNota');

    notasDiv.forEach(alunoNota => {
        // Pega informações necessárias
        const professorTurmaMatEscolhida = localStorage.getItem('professorTurmaMatEscolhida');
        const idAluno = alunoNota.getAttribute('data-alunoId');
        const etapaSelecionada = localStorage.getItem('etapaSelecionada');

        // Seleciona as notas
        const notasInputs = alunoNota.querySelectorAll('.notas');
        const nota1 = parseFloat(notasInputs[0].value.replace(',', '.')) || 0;
        const nota2 = parseFloat(notasInputs[1].value.replace(',', '.')) || 0;
        const nota3 = parseFloat(notasInputs[2].value.replace(',', '.')) || 0;

        // Pega a média diretamente do frontend
        const media = parseFloat(alunoNota.querySelector('.media p').textContent.replace(',', '.')) || 0;

        // Montar o objeto para envio
        const data = {
            aluno_id: idAluno,
            turma_materia_id: professorTurmaMatEscolhida,
            etapa_id: etapaSelecionada,
            nota1,
            nota2,
            nota3,
            media
        };

        // Enviar os dados para o backend usando fetch
        fetch('http://localhost:3000/mandar_notas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    console.log(`Notas enviadas para o aluno`);
                } else {
                    console.error(`Erro ao enviar notas para o aluno ${idAluno}:`, result.error);
                }
            })
            .catch(error => {
                console.error(`Erro de conexão para o aluno ${idAluno}:`, error);
            });

    });
    
    alert('As notas foram enviadas')
    carregarNotas()
});

async function carregarNotas() {
    const notasDiv = document.querySelectorAll('.alunoNota');
    const professorTurmaMatEscolhida = localStorage.getItem('professorTurmaMatEscolhida');
    const etapaSelecionada = localStorage.getItem('etapaSelecionada');

    for (const alunoNota of notasDiv) {
        const idAluno = alunoNota.getAttribute('data-alunoId');
        const { data: aluno, error: turmaError } = await supabaseClient
            .from('alunos')
            .select('nome')
            .eq('id', idAluno)
            .single();


        alunoNota.querySelector('h3').textContent = abreviarNome(aluno.nome)

        const { data: notas, error: notasError } = await supabaseClient
        .from('notas')
        .select('*')
        .eq('aluno_id', idAluno)
        .eq('etapa_id',etapaSelecionada)
        .eq('turma_materia_id', professorTurmaMatEscolhida)
        .single();


        const notasInputs = alunoNota.querySelectorAll('.notas');
        const mediaInput = alunoNota.querySelector('.media p')

        if(notas.nota1 != 0){
            notasInputs[0].value = notas.nota1
        }
        if(notas.nota2 != 0){
            notasInputs[1].value = notas.nota2
        }
        if(notas.nota3 != 0){
            notasInputs[2].value = notas.nota3
        }
        if(notas.media != 0){
            mediaInput.textContent = notas.media
        }


    }

}

function calcularMedia(notas) {
    let soma = 0
    let numeroNotas = 0

    notas.forEach(nota => {
        if (nota != '') {
            // Substitui vírgula por ponto para garantir a conversão correta
            let notaCorrigida = nota.replace(',', '.');
            soma += parseFloat(notaCorrigida);
            numeroNotas++
        }
    });

    // const soma = notas.reduce((acc, nota) => acc + parseFloat(nota || 0), 0);
    return (soma / numeroNotas).toFixed(2);
}

function atualizarMedia() {
    // Seleciona todas as divs de alunos
    const alunos = document.querySelectorAll('.alunoNota');
    
    alunos.forEach((aluno) => {
        // Seleciona os inputs de nota e a div da média para cada aluno
        const inputsNotas = aluno.querySelectorAll('.notas');
        const mediaDiv = aluno.querySelector('.media p');
        
        // Adiciona um listener a cada input para recalcular a média quando mudar
        inputsNotas.forEach(input => {
            const notas = Array.from(inputsNotas).map(input => input.value);
            const media = calcularMedia(notas);
            if(media == 'NaN'){
                mediaDiv.textContent = '0,0'
            }else{
                mediaDiv.textContent = media;
            }

            input.addEventListener('input', () => {
                const notas = Array.from(inputsNotas).map(input => input.value);
                const media = calcularMedia(notas);
                if(media == 'NaN'){
                    mediaDiv.textContent = '0,0'
                }else{
                    mediaDiv.textContent = media;
                }

            });
        });
    });
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

populationTable()