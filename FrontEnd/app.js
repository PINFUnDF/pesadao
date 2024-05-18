//Importar módulo express e express-session
const express = require('express');
const session =  require('express-session')
//Importar módulo express-handlebars
const {engine} = require('express-handlebars');

//Importar modulo mysql
const mysql =  require('mysql2');

//App
const app = express();

//Adicionando bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//Adicionando css
app.use('/css', express.static('./css'));
//Adicionando Imagens 
app.use('/Aleatorios', express.static('./Aleatorios'));
app.use('/Feminino', express.static('./Feminino'));
app.use('/Masculino', express.static('./Masculino'));

//Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Manipulação de Dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Configurando a sessão
app.use(session({
    secret: 'admin90',
    resave: false,
    saveUninitialized: true
}));

//Conexão
const conexao =  mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'pesadao'
});

//Teste de Conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log("conexão efetuada com sucesso");
});
//ROTAS GET
        //Rota Home
        app.get('/', function(req, res){
            res.render('index', { title: 'Home - Pesadão' });
        });

        //Rota Cadastro
        app.get('/cadastro', function(req, res){
            res.render('cadastro', { title: 'Cadastro - Pesadão' });
        });

        //Rota Login
        app.get('/login', function(req, res){
            res.render('login', { title: 'Login - Pesadão' });
        });

        //Rota para Resposta Bem sucedida de Login
        app.get('/resLogin', function(req, res){
            res.render('resLogin',  { title: 'Welcome - Pesadão', nomeCliente: req.session.nomeCliente });
        });

//ROTAS POST
        //Rota Cadastrar
        app.post('/cadastrar', function(req,res){
            let nome = req.body.nome;
            let dataNasc = req.body.data;
            let email = req.body.email;
            let telefone = req.body.phone;
            let senha = req.body.password;
            let confirmSenha = req.body.confirmPassword;

            // Formatar a data para o formato YYYY-MM-DD
            let parts = dataNasc.split('/');
            let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

            if(senha === confirmSenha){
                //SQL
                let sql = `INSERT INTO cliente (nome, email, telefone, senha, dataNasc) VALUES ('${nome}', '${email}', '${telefone}', '${senha}', '${formattedDate}')`;
                //EXECUÇÃO SQL
                conexao.query(sql, function(erro, retorno){
                    if(erro){
                        console.error(erro);
                        res.status(500).send('Erro ao cadastrar usuário');
                    }else{

                        console.log(retorno);
                        res.redirect('/resLogin');
                    }
                });
            }else{
                res.status(400).send("As senhas não coincidem!");
            }
        });

        // Rota para verificar o login
        app.post('/login', function(req, res) {
        let email = req.body.email;
        let senha = req.body.password;

        // SQL para verificar se o email existe no banco de dados
        let sql = `SELECT * FROM cliente WHERE email = '${email}'`;

        // Executar a consulta SQL
        conexao.query(sql, function(erro, resultados) {
            if (erro) {
                console.error(erro);
                res.status(500).send('Erro ao tentar fazer login');
            } else {
                // Verificar se encontrou algum resultado
                if (resultados.length > 0) {
                    // Comparar a senha fornecida com a senha armazenada no banco de dados
                    if (senha === resultados[0].senha) {
                        let nomeCliente = resultados[0].nome;
                        req.session.nomeCliente = nomeCliente;
                        res.redirect('/resLogin');
                    } else {
                        // Senha incorreta, mostrar mensagem de erro
                        res.status(400).send('Senha incorreta');
                    }
                } else {
                    // Email não encontrado, mostrar mensagem de erro
                    res.status(404).send('Email não encontrado');
                }
            }
        });
        });




app.listen(8080);