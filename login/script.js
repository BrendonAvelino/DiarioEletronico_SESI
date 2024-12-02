const supabaseUrl = 'https://pfdjgsjbmhisqjxbzmjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGpnc2pibWhpc3FqeGJ6bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNjY3NzEsImV4cCI6MjA0NDc0Mjc3MX0.qYuDBWNU8F6qzcAaksDeXc_CITjHAMAagFgFq-miLfE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Faz o login
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('Erro ao tentar fazer login: ' + error.message);
        return;
    }

    // Verifique se a sessão foi criada
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !sessionData?.session) {
        alert('Erro ao obter a sessão. Por favor, tente novamente.');
        return;
    }

    const userId = sessionData.session.user.id;

    if (!userId) {
        alert('Usuário não encontrado. Por favor, tente novamente.');
        return;
    }

    // Busca o perfil do usuário
    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId);

    if (profileError) {
        alert('Erro ao buscar o perfil do usuário: ' + profileError.message);
        return;
    }

    if (!profile || profile.length === 0) {
        alert('Perfil do usuário não encontrado.');
        return;
    }

    const userProfile = profile[0];

    // Checa o tipo de usuário e redireciona conforme necessário
    if (userProfile.tipo_usuario === 'coordenador') {
        // alert('Login bem-sucedido! Redirecionando para a página do coordenador...');
        window.location.href = './GestaoSESI/index.html';
    } else if (userProfile.tipo_usuario === 'professor') {
        // alert('Login bem-sucedido! Redirecionando para a página do professor...');
        window.location.href = './sistema/index.html';
    } else {
        alert('Tipo de usuário não reconhecido. Entre em contato com o suporte.');
    }

    localStorage.setItem('authUuid', userId);
});
