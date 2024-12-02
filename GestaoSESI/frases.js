// Array de frases motivacionais
const frases = [
    "A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar em movimento.",
    "A única maneira de fazer um excelente trabalho é amar o que você faz.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Acredite em si mesmo e todo o resto virá naturalmente.",
    "Cada dia é uma nova oportunidade para mudar sua vida.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "Não espere por oportunidades extraordinárias. Agarre as ocasiões comuns e as faça grandes.",
    "A única limitação que você tem é aquela que você impõe a si mesmo.",
    "Se você quer algo que nunca teve, precisa fazer algo que nunca fez.",
    "O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
    "Desafios são o que tornam a vida interessante; superá-los é o que dá sentido à vida.",
    "Não importa o quão devagar você vá, desde que você não pare.",
    "Você não precisa ser grande para começar, mas precisa começar para ser grande.",
    "Os únicos limites que temos são aqueles que nós mesmos colocamos.",
    "Mantenha seus olhos nas estrelas e os pés no chão.",
    "A vida é 10% do que acontece com você e 90% de como você reage a isso.",
    "Acredite que você pode e você já está no meio do caminho.",
    "Não conte os dias, faça os dias contarem.",
    "A felicidade não é algo pronto. Ela vem de suas próprias ações.",
    "Sonhe grande e ouse falhar.",
    "A persistência é o caminho do êxito.",
    "Você não pode mudar sua situação. A única coisa que você pode mudar é a sua atitude.",
    "A única maneira de alcançar o impossível é acreditar que é possível.",
    "A vida é uma aventura ousada ou não é nada.",
    "Cair sete vezes, levantar-se oito.",
    "A única coisa que impede você de realizar seus sonhos é o medo do fracasso.",
    "As dificuldades geralmente preparam as pessoas comuns para um destino extraordinário.",
    "O segredo do sucesso é a constância do propósito.",
    "Felicidade é quando o que você pensa, o que você diz e o que você faz estão em harmonia.",
    "A gratidão é não só a maior das virtudes, mas a mãe de todas as outras.",
    "A vida é uma série de escolhas, e o que você escolher moldará seu destino.",
    "O verdadeiro fracasso não é cair, mas recusar-se a levantar."
];

// Função para selecionar uma frase aleatória e exibi-la
function exibirFraseAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    const fraseSelecionada = frases[indiceAleatorio];
    const fraseElemento = document.getElementById('frase');
    fraseElemento.textContent = `"${fraseSelecionada}"`;
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', exibirFraseAleatoria);
