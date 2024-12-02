const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
//Declarando supabase

const userId = localStorage.getItem('authUuid'); //pegando userID

let materiasData = [];  // Array global para armazenar o estado das linhas
let numeroMateriasTemp = 1
let pagAtual = 0; // Inicializa a página atual como 0
// Seleciona os elementos do modal e overlay
const overlay = document.getElementById('overlay');
const modalProfessores = document.getElementById('modalProfessores');
const modalRecados = document.getElementById('modalRecados');
// Seleciona todos os professores e recados
const professores = document.querySelectorAll('.professor');
const recados = document.querySelectorAll('.recado');
const trashIcon = document.getElementById('exclu')
let formRows = 0

function fecharModal() {
    modalProfessores.style.display = 'none';
    modalRecados.style.display = 'none';
    overlay.style.display = 'none';
    pagAtual = 0
    formRows = 0

    localStorage.setItem('nome', '')
    localStorage.setItem('sobrenome', '')
    localStorage.setItem('emailPessoal', '')
    localStorage.setItem('numero', '')
    localStorage.setItem('cpf', '')
    localStorage.setItem('senha', '')
    localStorage.setItem('emailEducacional', '')
}
async function finalizar(professorCadastro) {
    if (professorCadastro) {
        const turmasCadastro = Array.from(document.querySelectorAll('.turmasOptions')).map(select => select.value);
        const materiasCadastro = Array.from(document.querySelectorAll('.materia')).map(select => select.value);


        const email_educacional = localStorage.getItem( 'emailEducacional');
        const senha = localStorage.getItem('senha');
        const emailPessoal = localStorage.getItem('emailPessoal');
        const nome = localStorage.getItem('nome');
        const sobrenome = localStorage.getItem('sobrenome');
        const numero = localStorage.getItem('numero');
        const cpf = localStorage.getItem('cpf');

        try {
            const response = await fetch('http://localhost:3000/sigin_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    professorEmail: email_educacional,
                    professorSenha: senha,
                    professorEmailPessoal: emailPessoal,
                    professorNome: nome,
                    professorSobrenome: sobrenome,
                    professorNumero: numero,
                    professorCpf: cpf,
                    arrayTurmas: turmasCadastro,
                    arrayMaterias: materiasCadastro
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Erro ao cadastrar usuário e dados associados:', errorResponse.error);
                alert('Erro ao cadastrar o professor: ' + errorResponse.error);
                return;
            }

            const successMessage = await response.json();
            console.log(successMessage.message);
            alert('Usuário e dados associados foram cadastrados com sucesso!');
        } catch (error) {
            console.error('Erro ao realizar cadastro:', error.message);
            alert('Erro ao realizar cadastro: ' + error.message);
        }
        fecharModal();
        location.reload();
    } else {
        const turmasCadastro = Array.from(document.querySelectorAll('.turmasOptions')).map(select => select.value);
        const materiasCadastro = Array.from(document.querySelectorAll('.materia')).map(select => select.value);

        const turmasIDOption = document.querySelectorAll('.formRow')

        let turmasID = []

        turmasIDOption.forEach(turma => {
            let atrp = turma.getAttribute('data-id')
            turmasID.push(atrp)

        });

        console.log(turmasID)

        

        const emailPessoal = localStorage.getItem('emailPessoal');
        const nome = localStorage.getItem('nome');
        const sobrenome = localStorage.getItem('sobrenome');
        const numero = localStorage.getItem('numero');
        const cpf = localStorage.getItem('cpf');
        const professorClicado = localStorage.getItem('professorClicado');
        
        console.log(professorClicado)

        try {
            const response = await fetch('http://localhost:3000/update_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    professorID: professorClicado,
                    professorEmailUpd: emailPessoal,
                    professorNomeUpd: nome,
                    professorSobrenomeUpd: sobrenome,
                    professorNumeroUpd: numero,
                    professorCpfUpd: cpf,
                    arrayTurmasUpd: turmasCadastro,
                    arrayMateriasUpd: materiasCadastro,
                    arrayIds: turmasID
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Erro ao cadastrar usuário e dados associados:', errorResponse.error);
                alert('Erro ao cadastrar o professor: ' + errorResponse.error);
                return;
            }

            const successMessage = await response.json();
            console.log(successMessage.message);
            alert('Usuário e dados associados foram atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao realizar update:', error.message);
            alert('Erro ao realizar update: ' + error.message);
        }
    }

    fecharModal();
    location.reload();

}

// Função para excluir o usuário e os dados relacionados
trashIcon.addEventListener('click', async () => {
    const professorClicadoApagar = localStorage.getItem('professorClicado');

    if (!professorClicadoApagar) {
        alert('ID do professor não encontrado.');
        return;
    }

    try {
        // Envia a requisição POST para o servidor com o professorId
        const response = await fetch('http://localhost:3000/delete-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ professorId: professorClicadoApagar }), // Certifique-se de que a chave seja professorId
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Erro ao excluir usuário e dados associados:', errorResponse.error);
            alert('Erro ao excluir o professor: ' + errorResponse.error);
            return;
        }

        const successMessage = await response.json();
        console.log(successMessage.message);
        alert('Usuário e dados associados foram excluídos com sucesso!');
    } catch (error) {
        console.error('Erro ao realizar exclusão:', error.message);
        alert('Erro ao realizar exclusão: ' + error.message);
    }

    fecharModal();
    location.reload();
});





async function carregarPaginaModal(atual, professorCadastro) {

    // const botaoPassar = document.getElementById('buttonNext');
    // const divFormularioContainer = document.getElementById('formularioInfos');
    const divFormulario = document.getElementById('formulario');
    const tituloFormulario = document.getElementById('titulo');
    const { data: turmas, error: turmasError } = await supabaseClient
        .from('turmas')
        .select('*');

    if (turmasError || !turmas?.length) {
        console.error('Erro ao buscar dados das turmas:', turmasError || 'Nenhuma turma encontrada');
        return;
    }
    const { data: materias, error: materiasError } = await supabaseClient
        .from('materias')
        .select('*');

    if (materiasError || !materias?.length) {
        console.error('Erro ao buscar dados das materias:', materiasError || 'Nenhuma materia encontrada');
        return;
    }



    // console.log(turma_materias)



    if (professorCadastro) {
        trashIcon.style = 'display: none;'
        if (atual == 1) {
            tituloFormulario.innerHTML = 'DADOS DE LOGIN';
            let nomeInfo = localStorage.getItem('nome').toLowerCase().replace(/\s+/g, "");
            let sobrenomeInfo = localStorage.getItem('sobrenome').toLowerCase().replace(/\s+/g, "");
            let emailEducacionalInfo = `${nomeInfo}.${sobrenomeInfo}@portalsesisp.org.br`
            divFormulario.innerHTML = `
                <div class="scrollAulas">
                
                    <div class="formRow">
                        <div class="formGroup">
                            <label for="EmailEducacional">Email Educacional</label>
                            <input class="disabled" id="EmailEducacional" type="text" value="${emailEducacionalInfo}" disabled>
                        </div>
                    </div>
                    <div class="formRow row2">
                        <div class="formGroup">
                            <label for="Senha">Senha</label>
                            <input id="Senha" placeholder="Escreva aqui" type="text" >
                        </div>
                        <div class="formGroup">
                            <label for="ConfirmarSenha">Confirmar Senha</label>
                            <input id="ConfirmarSenha" placeholder="Escreva aqui" type="text" >
                        </div>
                    </div>
                </div>
                <div class="botoes maisdeum">
                    <button id="buttonPreview" onclick="apagarInfosTemporarias(2, ${professorCadastro})" type="button">Anterior</button>
                    <button id="buttonNext" onclick="salvarInfosTemporariamente(2, ${professorCadastro})" type="button">Próximo</button>
                </div>
            `;
        } else if (atual == 0) {
            tituloFormulario.innerHTML = 'DADOS PESSOAIS';
            divFormulario.innerHTML = `
                <div class="formRow row2">
                    <div class="formGroup">
                        <label for="Nome">Nome</label>
                        <input id="Nome" placeholder="Escreva aqui" type="text">
                    </div>
                    <div class="formGroup">
                        <label for="Sobrenome">Sobrenome</label>
                        <input id="Sobrenome" placeholder="Escreva aqui" type="text">
                    </div>
                </div>
                <div class="formRow">
                    <div class="formGroup">
                        <label for="EmailPessoal">Email Pessoal</label>
                        <input id="EmailPessoal" placeholder="Escreva aqui" type="email">
                    </div>
                </div>
                <div class="formRow">
                    <div class="formGroup">
                        <label for="Numero">Número de celular (com DDD)</label>
                        <input id="Numero" placeholder="11912345678" type="number">
                    </div>
                </div>
                <div class="formRow">
                    <div class="formGroup">
                        <label for="CPF">CPF</label>
                        <input id="CPF" placeholder="Escreva sem pontuação" type="number">
                    </div>
                </div>
                <div class="botoes">
                    <button id="buttonNext" onclick="salvarInfosTemporariamente(1, ${professorCadastro})" type="button">Próximo</button>
                </div>
            `;
        } else if (atual === 2) {

            // Salva os valores atuais das seleções (turmas e matérias) no array global
            document.querySelectorAll('.formRow.row2').forEach((row, index) => {
                const turmaSelect = row.querySelector('.turmasOptions');
                const materiaSelect = row.querySelector('.materia');
                if (turmaSelect && materiaSelect) {
                    materiasData[index] = {
                        turma: turmaSelect.value,
                        materia: materiaSelect.value
                    };
                }
            });



            tituloFormulario.innerHTML = 'AULAS';
            divFormulario.innerHTML = `
                <div class="scrollAulas">
                    <div class="divReverse" style="display: flex; flex-direction: column; width: 100%; gap: 15px">
                        
                            </div>
                            <div onclick="aMateria()" class="professor" id="naoCadastradoM">
                                <i class="fa-solid fa-circle-plus fa-xl"></i>
                            </div>
                </div>
                <div class="botoes maisdeum">
                    <button id="buttonPreview" onclick="apagarInfosTemporarias(3, ${professorCadastro})" type="button">Anterior</button>
                    <button id="buttonFinish" onclick="finalizar(${professorCadastro})" type="button">Finalizar</button>
                </div>
            `;

            // for (let i = 0; i < numeroMateriasTemp; i++) {
            //     let scrollDiv = document.querySelector('.divReverse');

            //     const formRow = `<div class="formRow row2">
            //                         <div class="formGroup turmaGroup">
            //                             <label for="Turma">Turma</label>
            //                             <select name="Turma" class="turmasOptions"></select>
            //                         </div>
            //                         <div class="formGroup materiaGroup">
            //                             <label for="Materia">Matéria</label>
            //                             <select name="Materia" class="materia">

            //                             </select>
            //                         </div>                      
            //                         <i onclick="dMateria(${formRows})" id="botaoMenosMateria" style="align-self: center; cursor: pointer;" class="fa-solid fa-circle-minus fa-xl"></i>
            //                     </div>`;
            //     scrollDiv.innerHTML += formRow;
            // }

            let selectTurmas = document.querySelectorAll('.turmasOptions');
            let selectMaterias = document.querySelectorAll('.materia');
            selectTurmas.forEach(turmaSelect => {
                turmas.forEach(turma => {
                    const option = document.createElement('option');
                    option.value = turma.nome_turma;
                    option.textContent = turma.nome_turma[0] == 1 || turma.nome_turma[0] == 2 || turma.nome_turma[0] == 3
                        ? `${turma.nome_turma[0]}°${turma.nome_turma[1]} EM`
                        : `${turma.nome_turma[0]}°${turma.nome_turma[1]}`;
                    turmaSelect.appendChild(option);
                });
            });
            selectMaterias.forEach(materiaSelect => {
                materias.forEach(materia => {
                    const option = document.createElement('option');
                    option.value = materia.nome_materia;
                    option.textContent = materia.nome_materia;
                    materiaSelect.appendChild(option);
                })
            })

            // Restaurar os valores das seleções usando o array global `materiasData`
            document.querySelectorAll('.formRow.row2').forEach((row, index) => {
                if (materiasData[index]) {
                    const turmaSelect = row.querySelector('.turmasOptions');
                    const materiaSelect = row.querySelector('.materia');
                    if (turmaSelect) turmaSelect.value = materiasData[index].turma;
                    if (materiaSelect) materiaSelect.value = materiasData[index].materia;
                }
            });
        }
    } else {
        const professorClicado = localStorage.getItem('professorClicado')

        const { data: professor, error: professorError } = await supabaseClient
            .from('professores')
            .select('*')
            .eq('id', professorClicado)

        if (professorError || !professor?.length) {
            console.error('Erro ao buscar dados do professor:', professorError || 'Professor não encontrado');
            return;
        }

        const { data: turma_materias, error: tmError } = await supabaseClient
            .from('turmas_materias')
            .select('*')
            .eq('professor_id', professorClicado)

        if (tmError || !turma_materias?.length) {
            console.error('Erro ao buscar dados do professor:', tmError || 'Professor não encontrado');
            return;
        }

        turma_materias.sort((a, b) => a.turma_id - b.turma_id);
        trashIcon.style = 'display: block;'


        if (atual == 1) {
            tituloFormulario.innerHTML = 'DADOS DE LOGIN';
            let nomeInfo = localStorage.getItem('nome').toLowerCase().replace(/\s+/g, "");
            let sobrenomeInfo = localStorage.getItem('sobrenome').toLowerCase().replace(/\s+/g, "");
            let emailEducacionalInfo = `${nomeInfo}.${sobrenomeInfo}@portalsesisp.org.br`
            divFormulario.innerHTML = `
                <div class="scrollAulas">
               
                    <div class="formRow">
                        <div class="formGroup">
                            <label for="EmailEducacional">Email Educacional</label>
                            <input class="disabled" id="EmailEducacional" type="text" value="${professor[0].email_educacional}" disabled>
                        </div>
                    </div>
                    <div class="formRow row2">
                        <div class="formGroup">
                            <label for="Senha">Senha</label>
                            <input class="disabled" value="${professor[0].senha}" id="Senha" placeholder="Escreva aqui" type="text" disabled>
                        </div>
                        <div class="formGroup">
                            <label for="ConfirmarSenha">Confirmar Senha</label>
                            <input class="disabled" value="${professor[0].senha}" id="ConfirmarSenha" placeholder="Escreva aqui" type="text" disabled>
                        </div>
                    </div>
                </div>
                <div class="botoes maisdeum">
                    <button id="buttonPreview" onclick="apagarInfosTemporarias(2, ${professorCadastro})" type="button">Anterior</button>
                    <button id="buttonNext" onclick="salvarInfosTemporariamente(2, ${professorCadastro})" type="button">Próximo</button>
                </div>
            `;
        } else if (atual == 0) {
            tituloFormulario.innerHTML = 'DADOS PESSOAIS';
            divFormulario.innerHTML = `
                <div class="formRow row2">
                    <div class="formGroup">
                        <label for="Nome">Nome</label>
                        <input value="${professor[0].nome}" id="Nome" placeholder="Escreva aqui" type="text">
                    </div>
                    <div class="formGroup">
                        <label for="Sobrenome">Sobrenome</label>
                        <input value="${professor[0].sobrenome}" id="Sobrenome" placeholder="Escreva aqui" type="text">
                    </div>
                </div>
                <div class="formRow">
                    <div class="formGroup">
                        <label for="EmailPessoal">Email Pessoal</label>
                        <input value="${professor[0].email_pessoal}" id="EmailPessoal" placeholder="Escreva aqui" type="email">
                    </div>
                </div>
                <div class="formRow">
                    <div class="formGroup">
                        <label for="Numero">Número de celular (com DDD)</label>
                        <input value="${professor[0].numero_celular}" id="Numero" placeholder="11912345678" type="number">
                    </div>
                </div>
                <div class="formRow">
                    <div class="formGroup">
                        <label for="CPF">CPF</label>
                        <input value="${professor[0].cpf}" id="CPF" placeholder="Escreva sem pontuação" type="number">
                    </div>
                </div>
                <div class="botoes">
                    <button id="buttonNext" onclick="salvarInfosTemporariamente(1, ${professorCadastro})" type="button">Próximo</button>
                </div>
            `;
        } else if (atual === 2) {

            // Salva os valores atuais das seleções (turmas e matérias) no array global


            // console.log(turma_materias)

            tituloFormulario.innerHTML = 'AULAS';
            divFormulario.innerHTML = `
                <div class="scrollAulas">
                    <div class="divReverse" style="display: flex; flex-direction: column; width: 100%; gap: 15px">

                            </div>
                            <div onclick="aMateria()" class="professor" id="naoCadastradoM">
                                <i class="fa-solid fa-circle-plus fa-xl"></i>
                            </div>
                </div>
                <div class="botoes maisdeum">
                    <button id="buttonPreview" onclick="apagarInfosTemporarias(3, ${professorCadastro})" type="button">Anterior</button>
                    <button id="buttonFinish" onclick="finalizar(${professorCadastro})" type="button">Finalizar</button>
                </div>
            `;


            for (const turmaMateria of turma_materias) {
                let scrollDiv = document.querySelector('.divReverse');

                const { data: turmaOption, error: tmoError } = await supabaseClient
                    .from('turmas')
                    .select('*')
                    .eq('id', turmaMateria.turma_id)

                if (tmoError || !turmaOption?.length) {
                    console.error('Erro ao buscar dados');
                    return;
                }

                const { data: materiaOption, error: mtoError } = await supabaseClient
                    .from('materias')
                    .select('*')
                    .eq('id', turmaMateria.materia_id)

                if (mtoError || !materiaOption?.length) {
                    console.error('Erro ao buscar dados ');
                    return;
                }

                // console.log(turmaOption)


                const formRow = `<div class="formRow row2 formRow${formRows}" data-id="${turmaOption[0].id}">
                                    <div class="formGroup turmaGroup">
                                        <label for="Turma">Turma</label>
                                        <select name="Turma" class="turmasOptions">
                                            <option value="${turmaOption[0].nome_turma}">${turmaOption[0].nome_turma[0] == 1 || turmaOption[0].nome_turma[0] == 2 || turmaOption[0].nome_turma[0] == 3
                        ? `${turmaOption[0].nome_turma[0]}°${turmaOption[0].nome_turma[1]} EM`
                        : `${turmaOption[0].nome_turma[0]}°${turmaOption[0].nome_turma[1]}`}</option>
                                        </select>
                                    </div>
                                    <div class="formGroup materiaGroup">
                                        <label for="Materia">Matéria</label>
                                        <select name="Materia" class="materia">
                                            <option value="${materiaOption[0].nome_materia}">
                                                ${materiaOption[0].nome_materia}    
                                            </option>
                                        </select>
                                    </div>                      
                                    <i onclick="dMateria(${formRows})" id="botaoMenosMateria" style="align-self: center; cursor: pointer;" class="fa-solid fa-circle-minus fa-xl"></i>
                                </div>`;
                scrollDiv.innerHTML += formRow;
                formRows++;
            };


            let selectTurmas = document.querySelectorAll('.turmasOptions');
            let selectMaterias = document.querySelectorAll('.materia');
            selectTurmas.forEach(turmaSelect => {
                turmas.forEach(turma => {
                    if (!turmaSelect.querySelector(`option[value="${turma.nome_turma}"]`)) {
                        const option = document.createElement('option');
                        option.value = turma.nome_turma;
                        option.textContent = turma.nome_turma[0] == 1 || turma.nome_turma[0] == 2 || turma.nome_turma[0] == 3
                            ? `${turma.nome_turma[0]}°${turma.nome_turma[1]} EM`
                            : `${turma.nome_turma[0]}°${turma.nome_turma[1]}`;
                        turmaSelect.appendChild(option);
                    }

                });
            });
            selectMaterias.forEach(materiaSelect => {
                materias.forEach(materia => {
                    if (!materiaSelect.querySelector(`option[value="${materia.nome_materia}"]`)) {
                        const option = document.createElement('option');
                        option.value = materia.nome_materia;
                        option.textContent = materia.nome_materia;
                        materiaSelect.appendChild(option);
                    }

                })
            })

            // Restaurar os valores das seleções usando o array global `materiasData`
            document.querySelectorAll('.formRow.row2').forEach((row, index) => {
                if (materiasData[index]) {
                    const turmaSelect = row.querySelector('.turmasOptions');
                    const materiaSelect = row.querySelector('.materia');
                    if (turmaSelect) turmaSelect.value = materiasData[index].turma;
                    if (materiaSelect) materiaSelect.value = materiasData[index].materia;
                }
            });
        }
    }


}

function diminuirMateria(atual) {
    if (numeroMateriasTemp > 1) {
        numeroMateriasTemp--;
        materiasData.pop();  // Remove o último item do array `materiasData`
        carregarPaginaModal(atual);
    }
}

function aumentarMateria(atual) {
    numeroMateriasTemp++;
    materiasData.push({ turma: "", materia: "" });  // Adiciona um item vazio ao array `materiasData`
    carregarPaginaModal(atual);
}

async function aMateria() {
    const { data: turmas, error: turmasError } = await supabaseClient
        .from('turmas')
        .select('*');

    if (turmasError || !turmas?.length) {
        console.error('Erro ao buscar dados das turmas:', turmasError || 'Nenhuma turma encontrada');
        return;
    }
    const { data: materias, error: materiasError } = await supabaseClient
        .from('materias')
        .select('*');

    if (materiasError || !materias?.length) {
        console.error('Erro ao buscar dados das materias:', materiasError || 'Nenhuma materia encontrada');
        return;
    }


    let scrollDiv = document.querySelector('.divReverse');
    const formRow = `<div class="formRow row2 formRow${formRows}" data-id="0">
                        <div class="formGroup turmaGroup">
                            <label for="Turma">Turma</label>
                            <select name="Turma" class="turmasOptions">
                            </select>
                        </div>
                        <div class="formGroup materiaGroup">
                            <label for="Materia">Matéria</label>
                            <select name="Materia" class="materia">
                            </select>
                        </div>                      
                        <i onclick="dMateria(${formRows})" id="botaoMenosMateria" style="align-self: center; cursor: pointer;" class="fa-solid fa-circle-minus fa-xl"></i>
                    </div>`;
    scrollDiv.innerHTML += formRow;
    formRows++;


    let selectTurmas = document.querySelectorAll('.turmasOptions');
    let selectMaterias = document.querySelectorAll('.materia');
    selectTurmas.forEach(turmaSelect => {
        turmas.forEach(turma => {
            if (!turmaSelect.querySelector(`option[value="${turma.nome_turma}"]`)) {
                const option = document.createElement('option');
                option.value = turma.nome_turma;
                option.textContent = turma.nome_turma[0] == 1 || turma.nome_turma[0] == 2 || turma.nome_turma[0] == 3
                    ? `${turma.nome_turma[0]}°${turma.nome_turma[1]} EM`
                    : `${turma.nome_turma[0]}°${turma.nome_turma[1]}`;
                turmaSelect.appendChild(option);
            }

        });
        ;
    });
    selectMaterias.forEach(materiaSelect => {
        materias.forEach(materia => {
            if (!materiaSelect.querySelector(`option[value="${materia.nome_materia}"]`)) {
                const option = document.createElement('option');
                option.value = materia.nome_materia;
                option.textContent = materia.nome_materia;
                materiaSelect.appendChild(option);
            }

        })

    })
    addChangeEvent()
}
function dMateria(f) {
    const formRow = document.querySelector(`.formRow${f}`);
    if (formRow) {
        formRow.remove();
    }
    addChangeEvent()
}

async function fetchCordenadorData() {

    // Busca o ID do professor relacionado ao perfil do usuário
    const { data: profileID, error: profileError } = await supabaseClient
        .from('profiles')
        .select('coordenador_id')
        .eq('id', userId);

    if (profileError || !profileID?.length) {
        console.error('Erro ao buscar perfil:', profileError || 'Nenhum perfil encontrado');
        return;
    }

    const cordenadorId = profileID[0].coordenador_id;

    // Busca os dados do professor usando o ID encontrado
    const { data: cordenador, error: cordenadorError } = await supabaseClient
        .from('coordenadores')
        .select('*')
        .eq('id', cordenadorId);

    if (cordenadorError || !cordenador?.length) {
        console.error('Erro ao buscar dados do cordenador:', cordenadorError || 'Professor não encontrado');
        return;
    }

    const spanCord = document.getElementById('nomeCordenador');
    spanCord.textContent = `${cordenador[0].nome}`;

}

async function fetchProfessoresData() {
    // Busca os dados do professor usando o ID encontrado
    const { data: professores, error: professoresError } = await supabaseClient
        .from('professores')
        .select('*');

    if (professoresError || !professores?.length) {
        console.error('Erro ao buscar dados do coordenador:', professoresError || 'Professor não encontrado');
        return;
    }

    // Ordena os professores em ordem alfabética pelo nome
    professores.sort((a, b) => a.nome.localeCompare(b.nome));

    // Seleciona o contêiner onde as divs serão inseridas
    const listaProfessores = document.getElementById('listaProfessores');
    listaProfessores.innerHTML = ''; // Limpa a lista antes de adicionar novos professores

    // Adiciona cada professor à lista
    professores.forEach(professor => {
        const professorDiv = document.createElement('div');
        professorDiv.className = 'professor';

        // Cria um elemento de título para o nome do professor
        const title = document.createElement('h3');
        title.className = 'title';
        title.textContent = `${professor.nome} ${professor.sobrenome[0]}.`; // Define o nome do professor
        professorDiv.setAttribute('data-professorID', professor.id);

        // Anexa o título à div do professor
        professorDiv.appendChild(title);

        // Adiciona o evento de clique para abrir o modal e passar o professorID
        professorDiv.addEventListener('click', abrirModalProfessores);

        // Anexa a div do professor à lista
        listaProfessores.appendChild(professorDiv);
    });

    // Adiciona a div #naoCadastrado ao final da lista
    const naoCadastradoDiv = document.createElement('div');
    naoCadastradoDiv.id = 'naoCadastrado';
    naoCadastradoDiv.innerHTML = '<i class="fa-solid fa-circle-plus fa-xl"></i>'; // Ícone para adicionar um novo professor
    naoCadastradoDiv.className = 'professor'
    naoCadastradoDiv.addEventListener('click', abrirModalCadastroProfessores);


    // Anexa a div #naoCadastrado à lista
    listaProfessores.appendChild(naoCadastradoDiv);
}

async function fetchTurmasData() {
    const { data: turmas, error: turmasError } = await supabaseClient
        .from('turmas')
        .select('*');

    if (turmasError || !turmas?.length) {
        console.error('Erro ao buscar dados das turmas:', turmasError || 'Nenhuma turma encontrada');
        return;
    }

    // Seleciona o elemento onde as turmas serão adicionadas
    const lista = document.getElementById('lista');

    // Limpa a lista antes de adicionar novos elementos
    lista.innerHTML = '';

    turmas.forEach(turma => {
        const nomeTurma = turma.nome_turma; // Supondo que a coluna se chama 'nome_turma'
        const grau = turma.grau; // Supondo que a coluna se chama 'grau'

        nomeCompostoTurma = `${nomeTurma[0]}° Ano ${nomeTurma[1]}`

        // Determina o horário com base no grau
        const horario = grau === 'Fundamental' ? 'manha ' : 'tarde';
        const ensino = grau === 'Fundamental' ? 'fund' : 'EM';

        // Cria o elemento da turma
        const turmaDiv = document.createElement('div');
        turmaDiv.addEventListener('click', ()=>{
            localStorage.setItem('turmaPick', nomeTurma)
        })
        turmaDiv.classList.add('turma');

        turmaDiv.innerHTML = `
            <h4 class="title">${nomeCompostoTurma}</h4>
            <div class="turmaInfos">
                <div class="turmaInfo grau ${ensino}">${grau.charAt(0).toUpperCase() + grau.slice(1)}</div>
                <div class="turmaInfo horario ${horario}">${horario.charAt(0).toUpperCase() + horario.slice(1)}</div>
            </div>
        `;


        function redirect() {
            window.location.href = "gerMaterias.html"
        }
        turmaDiv.addEventListener('click', redirect);

        // Adiciona a turma à lista
        lista.appendChild(turmaDiv);
    });
}


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

async function verificarAutenticacao() {
    const { data: sessionData, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao obter a sessão:', error.message);
    } else if (!sessionData?.session) {
        window.location.href = './../index.html';
    }
}

function abrirModalCadastroProfessores() {
    modalProfessores.style.display = 'flex';
    overlay.style.display = 'block';
    pagAtual = 0
    numeroMateriasTemp = 1
    carregarPaginaModal(pagAtual, true); // Carrega a primeira página ao abrir o modal
}

function abrirModalProfessores(event) {

    const professorID = event.currentTarget.getAttribute('data-professorID');
    console.log('Professor ID clicado:', professorID);
    localStorage.setItem('professorClicado', professorID)
    modalProfessores.style.display = 'flex';
    overlay.style.display = 'block';
    pagAtual = 0
    numeroMateriasTemp = 1
    carregarPaginaModal(pagAtual); // Carrega a primeira página ao abrir o modal
}

// Função para fechar o modal


// Função para abrir o modal de recados
function abrirModalRecados() {
    modalRecados.style.display = 'flex';
    overlay.style.display = 'block';
}

professores.forEach(professor => {
    professor.addEventListener('click', abrirModalProfessores);
});
recados.forEach(recado => {
    recado.addEventListener('click', abrirModalRecados);
});

// Fecha o modal ao clicar fora dele (no overlay)
overlay.addEventListener('click', fecharModal);

function voltarPagina(pc) {
    if (pagAtual == 0) {
        return;
    } else {
        pagAtual--;
    }
    carregarPaginaModal(pagAtual, pc);
}

function passarPagina(pc) {
    if (pagAtual == 2) {
        return;
    } else {
        pagAtual++;
    }
    carregarPaginaModal(pagAtual, pc);
}

function salvarInfosTemporariamente(form, pc) {
    if (form == 1) {
        let nome = document.getElementById('Nome').value
        let sobrenome = document.getElementById('Sobrenome').value
        let emailPessoal = document.getElementById('EmailPessoal').value
        let numero = document.getElementById('Numero').value
        let cpf = document.getElementById('CPF').value

        if (!nome || !sobrenome || !emailPessoal || !numero || !cpf) {
            alert('todos os campos precisam ser preenchidos')
            return;
        }

        localStorage.setItem('nome', nome)
        localStorage.setItem('sobrenome', sobrenome)
        localStorage.setItem('emailPessoal', emailPessoal)
        localStorage.setItem('numero', numero)
        localStorage.setItem('cpf', cpf)
    } else if (form == 2) {
        let senha = document.getElementById('Senha').value
        let confirmarSenha = document.getElementById('ConfirmarSenha').value
        let emailEducacional = document.getElementById('EmailEducacional').value

        if (!senha || !confirmarSenha || !emailEducacional) {
            alert('todos os campos precisam ser preenchidos')
            return;
        }

        if (senha == confirmarSenha) {
            localStorage.setItem('senha', senha)
            localStorage.setItem('emailEducacional', emailEducacional)
        } else {
            alert('as duas senhas devem ser iguais')
            return;
        }
    }
    passarPagina(pc)
}
function apagarInfosTemporarias(form, pc) {
    if (form === 2) {
        localStorage.setItem('nome', '')
        localStorage.setItem('sobrenome', '')
        localStorage.setItem('emailPessoal', '')
        localStorage.setItem('numero', '')
        localStorage.setItem('cpf', '')
    }
    localStorage.setItem('senha', '')
    localStorage.setItem('emailEducacional', '')

    voltarPagina(pc)
}


async function addChangeEvent() {
    const { data: turmas, error: turmasError } = await supabaseClient
        .from('turmas')
        .select('*');

    if (turmasError || !turmas?.length) {
        console.error('Erro ao buscar dados das turmas:', turmasError || 'Nenhuma turma encontrada');
        return;
    }
    const { data: materias, error: materiasError } = await supabaseClient
        .from('materias')
        .select('*');

    if (materiasError || !materias?.length) {
        console.error('Erro ao buscar dados das materias:', materiasError || 'Nenhuma materia encontrada');
        return;
    }

    let selectTurmas = document.querySelectorAll('.turmasOptions');
    let selectMaterias = document.querySelectorAll('.materia');
    selectTurmas.forEach(turmaSelect => {
        turmaSelect.addEventListener('change', (event) => {
            const materiaSel = event.target.value
            // console.log("Turma selecionada:", materiaSel);
            turmaSelect.innerHTML = `<option value="${materiaSel}">${materiaSel[0] == 1 || materiaSel[0] == 2 || materiaSel[0] == 3
                ? `${materiaSel[0]}°${materiaSel[1]} EM`
                : `${materiaSel[0]}°${materiaSel[1]}`}</option>`

            turmas.forEach(turma => {
                if (!turmaSelect.querySelector(`option[value="${turma.nome_turma}"]`)) {
                    const option = document.createElement('option');
                    option.value = turma.nome_turma;
                    option.textContent = turma.nome_turma[0] == 1 || turma.nome_turma[0] == 2 || turma.nome_turma[0] == 3
                        ? `${turma.nome_turma[0]}°${turma.nome_turma[1]} EM`
                        : `${turma.nome_turma[0]}°${turma.nome_turma[1]}`;
                    turmaSelect.appendChild(option);
                }

            });
        });

    });
    selectMaterias.forEach(materiaSelect => {
        materiaSelect.addEventListener('change', (event) => {
            const materiaSel = event.target.value
            // console.log("materia selecionada:", materiaSel);
            materiaSelect.innerHTML = `<option value="${materiaSel}">
                ${materiaSel}    
                </option>`

            materias.forEach(materia => {
                if (!materiaSelect.querySelector(`option[value="${materia.nome_materia}"]`)) {
                    const option = document.createElement('option');
                    option.value = materia.nome_materia;
                    option.textContent = materia.nome_materia;
                    materiaSelect.appendChild(option);
                }

            })
        });
    })
}

fetchProfessoresData()
fetchCordenadorData()
fetchTurmasData();
document.getElementById('botaoDeslog').addEventListener('click', deslogar);
document.addEventListener('DOMContentLoaded', verificarAutenticacao);

