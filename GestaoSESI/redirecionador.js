turmas = document.querySelectorAll('.turma')

function redirecionarGerMat(){
    window.location.href="gerMaterias.html"
}


turmas.forEach(turma => {
    turma.addEventListener('click', redirecionarGerMat);
});

