//Importar módulo express e express-session
const express = require('express');
const session =  require('express-session');
const fileupload = require('express-fileupload')

//Importar módulo express-handlebars
const {engine} = require('express-handlebars');

//Importar modulo mysql
const mysql =  require('mysql2');

//App
const app = express();

app.use(fileupload());

//Adicionando bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//Adicionando css
app.use('/css', express.static('./css'));

//Adicionando Imagens 
app.use('/Aleatorios', express.static('./Aleatorios'));
app.use('/imagens', express.static('./imagens'));


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
        app.get('/', (req, res) => {
            let sqlFemininos = `SELECT * FROM produtos WHERE generoProd = 'Feminino' OR generoProd = 'Feminina'`;
            let sqlMasculinos = `SELECT * FROM produtos WHERE generoProd = 'Masculino' OR generoProd = 'Masculina'`;
            let sqlMochilas = `SELECT * FROM produtos WHERE name LIKE '%Mochila%'`;
            let sqlJaquetas = `SELECT * FROM produtos WHERE name LIKE '%Jaqueta%' OR name LIKE '%Casaco%' OR name LIKE '%Sobretudo%'`;
            let sqlNovidades = `SELECT * FROM produtos WHERE id = 2 OR id = 3 OR id = 8`;

            conexao.query(sqlFemininos, (erroFemininos, resultadosFemininos) => {
                if (erroFemininos) {
                    console.error(erroFemininos);
                    res.status(500).send('Erro ao buscar produtos femininos');
                    return;
                }

                const groupedResultadosFemininos = [];
                for (let i = 0; i < resultadosFemininos.length; i += 3) {
                    groupedResultadosFemininos.push(resultadosFemininos.slice(i, i + 3));
                }

                conexao.query(sqlMasculinos, (erroMasculinos, resultadosMasculinos) => {
                    if (erroMasculinos) {
                        console.error(erroMasculinos);
                        res.status(500).send('Erro ao buscar produtos masculinos');
                        return;
                    }

                    const groupedResultadosMasculinos = [];
                    for (let i = 0; i < resultadosMasculinos.length; i += 3) {
                        groupedResultadosMasculinos.push(resultadosMasculinos.slice(i, i + 3));
                    }

                    conexao.query(sqlMochilas, (erroMochilas, resultadosMochilas) => {
                        if (erroMochilas) {
                            console.error(erroMochilas);
                            res.status(500).send('Erro ao buscar mochilas');
                            return;
                        }

                        const groupedResultadosMochilas = [];
                        for (let i = 0; i < resultadosMochilas.length; i += 3) {
                            groupedResultadosMochilas.push(resultadosMochilas.slice(i, i + 3));
                        }

                        // Adicione suas consultas adicionais aqui
                        // Consulta 1
                        conexao.query(sqlJaquetas, (erroJaquetas, resultadosJaquetas) => {
                            if (erroJaquetas) {
                                console.error(erroJaquetas);
                                res.status(500).send('Erro ao buscar Jaquetas');
                                return;
                            }

                            const groupedResultadosJaquetas = [];
                            for (let i = 0; i < resultadosJaquetas.length; i += 3) {
                                groupedResultadosJaquetas.push(resultadosJaquetas.slice(i, i + 3));
                            }

                            // Consulta 2
                            conexao.query(sqlNovidades, (erroNovidades, resultadosNovidades) => {
                                if (erroNovidades) {
                                    console.error(erroNovidades);
                                    res.status(500).send('Erro ao buscar Novidades');
                                    return;
                                }

                                const groupedResultadosNovidades = [];
                                for (let i = 0; i < resultadosNovidades.length; i += 3) {
                                    groupedResultadosNovidades.push(resultadosNovidades.slice(i, i + 3));
                                }

                                res.render('index', {
                                    title: 'Home - Pesadão',
                                    groupedResultadosFemininos: groupedResultadosFemininos,
                                    groupedResultadosMasculinos: groupedResultadosMasculinos,
                                    groupedResultadosMochilas: groupedResultadosMochilas,
                                    groupedResultadosJaquetas: groupedResultadosJaquetas,
                                    groupedResultadosNovidades: groupedResultadosNovidades
                                });
                            });
                        });
                    });
                });
            });
        });


        //Rota Cadastro
        app.get('/cadastro', function(req, res){
            res.render('cadastro', { title: 'Cadastro - Pesadão' });
        });

        //Rota Cadastro Produto
        app.get('/cadastroProduto', function(req,res){
            res.render('cadastroProduto', {title: 'Cadastrar Produtos'});
        });

        //Rota Login
        app.get('/login', function(req, res){
            res.render('login', { title: 'Login - Pesadão' });
        });

        //Rota para Resposta Bem sucedida de Login
        app.get('/resLogin', function(req, res){
            res.render('resLogin',  { title: 'Welcome - Pesadão', nomeCliente: req.session.nomeCliente });
        });

        //Rota para Produtos
        app.get('/produto/:id', function(req, res){
            let productId = req.params.id;
            let sql = "SELECT * FROM produtos WHERE id = ?";
            conexao.query(sql, [productId], function(erro, resultados){
                if(erro){
                    console.error(erro);
                    res.status(500).send('Erro ao buscar o produto');
                } else {
                    console.log(resultados)
                    res.render('produto', {
                        title: 'Produto - Pesadão',
                        produto: resultados[0] // Assumindo que você espera apenas um resultado
                    });
                }
            });
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

        //Rota para Cadastrar Produto
        app.post('/cadastroProduto', function(req, res) {
            // Verificar se req.files e req.files.imagemProduto são definidos
            if (req.files && req.files.imagemProduto) {
                let nome = req.body.nomeProduto;
                let genero = req.body.generoProduto;
                let preco = req.body.precoProduto;
                let imagem = req.files.imagemProduto.name;
        
                // SQL
                let sql = `INSERT INTO produtos (name, generoProd, preco, imagem) VALUES ('${nome}', '${genero}', '${preco}', '${imagem}')`;
                // EXECUÇÃO SQL
                conexao.query(sql, function(erro, retorno) {
                    if (erro) {
                        console.error(erro);
                        res.status(500).send('Erro ao cadastrar produto');
                    } else {
                        // Salvar a imagem
                        req.files.imagemProduto.mv(__dirname + '/imagens/' + req.files.imagemProduto.name, function(err) {
                            if (err) {
                                console.error(err);
                                res.status(500).send('Erro ao salvar imagem');
                            } else {
                                console.log(retorno);
                                res.redirect('/cadastroProduto');
                            }
                        });
                    }
                });
            } else {
                res.status(400).send('Nenhuma imagem fornecida');
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