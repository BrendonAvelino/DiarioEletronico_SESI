window.addEventListener('load', () => {
    const tableContainer = document.getElementById('table-container');
    const modal3 = document.getElementById('modal3');
    const modal2 = document.getElementById('modal2');
    const closeBtn3 = document.querySelector('.close3');
    const closeBtn2 = document.querySelector('.close2');

    function adjustTableContainerHeight() {
        tableContainer.style.maxHeight = '480px';
        tableContainer.style.overflowY = 'auto';
    }

    adjustTableContainerHeight();
    window.addEventListener('resize', adjustTableContainerHeight);

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
        'Educação Física': '#273283'
    };

    function applyDynamicColors() {
        const rows = document.querySelectorAll('#table-container tbody tr');

        rows.forEach(row => {
            const subjectCell = row.cells[3];
            const statusIndicator = row.querySelector('.status-indicator');

            if (subjectCell && statusIndicator) {
                const subject = subjectCell.textContent.trim();
                const color = subjectColors[subject] || '#FF0000';
                statusIndicator.style.backgroundColor = color;
                statusIndicator.style.borderColor = color;
            }
        });
    }

    applyDynamicColors();

    function showModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    document.querySelectorAll('#table-container tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const year = row.cells[0].textContent.trim();
            if (year === '2ºAno' || year === '3ºAno') {
                showModal(modal2);
            } else if (year === '6ºAno' || year === '7ºAno' || year === '8ºAno' || year === '9ºAno' || year === '1ºAno') {
                showModal(modal3);
            }
        });
    });

    closeBtn3.addEventListener('click', () => closeModal(modal3));
    closeBtn2.addEventListener('click', () => closeModal(modal2));

    window.addEventListener('click', (event) => {
        if (event.target === modal3) {
            closeModal(modal3);
        } else if (event.target === modal2) {
            closeModal(modal2);
        }
    });

    // TextData
    const dataAtual = new Date();

    // Extrai o dia, mês e ano
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona '0' se for necessário
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona 1 ao mês (começa em 0)
    const ano = dataAtual.getFullYear();

    // Formata a data como DD/MM/YYYY
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Exibe a data no elemento com id "TextData"
    document.getElementById('TextData').textContent = dataFormatada;
});