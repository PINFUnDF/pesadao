//Importar módulo express e express-session
const express = require('express');
const session =  require('express-session');
const fileupload = require('express-fileupload')
const handlebars = require('handlebars');
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

handlebars.registerHelper('carrinho', function(index, options) {
    // Verifica se o índice está dentro dos limites do carrinho
    if (index < this.length) {
        // Retorna o ID do produto no índice especificado
        return this[index];
    } else {
        // Se o índice estiver fora dos limites, retorna vazio
        return '';
    }
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

        //Rota para finalizar compra
        app.get('/final', function(req,res){
            res.render('final', {title: 'Compra Feita'})
        });

        //Rota Login
        app.get('/login', function(req, res){
            res.render('login', { title: 'Login - Pesadão' });
        });

        //Rota para Resposta Bem sucedida de Login
        app.get('/resLogin', function(req, res){
            res.render('resLogin',  { title: 'Welcome - Pesadão', nomeCliente: req.session.nomeCliente });
        });
        
        //Rota para carrinho
        // Rota para carrinho
                        // Rota GET para a página carrinho
app.get('/carrinho', function(req, res){
    // Rota para visualizar o carrinho
    const cart = req.session.cart || [];
    if (!Array.isArray(cart)) {
        console.error('O carrinho não é um array:', cart);
        res.status(500).send('Erro ao processar o carrinho');
        return;
    }

    if (cart.length === 0) {
        res.render('carrinho', { title: 'Carrinho - Pesadão', produtos: [], totalItens: 0, precoTotal: 0 });
        return;
    }

    // Consulta os detalhes dos produtos no carrinho
    const placeholders = cart.map(() => '?').join(',');
    const sql = `SELECT * FROM produtos WHERE id IN (${placeholders})`;

    conexao.query(sql, cart, function(erro, resultados) {
        if (erro) {
            console.error(erro);
            res.status(500).send('Erro ao buscar produtos do carrinho');
        } else {
            // Calcula a quantidade específica de cada produto e o preço total multiplicado pela quantidade
            const cartCount = cart.reduce((acc, productId) => {
                acc[productId] = (acc[productId] || 0) + 1;
                return acc;
            }, {});

            // Calcula o preço total de cada produto multiplicado pela quantidade
            resultados.forEach(produto => {
                produto.quantidade = cartCount[produto.id];
    
                // Substituir vírgula por ponto no preço e converter para número
                produto.preco = parseFloat(produto.preco.replace(',', '.'));
            
                // Calcular o preço total
                produto.precoTotal = produto.preco * produto.quantidade;
            
                produto.precoTotalFormatted = produto.precoTotal.toFixed(2); 
            });
            

            // Calcula o número total de itens e o preço total do carrinho
            const totalItens = Object.values(cartCount).reduce((acc, count) => acc + count, 0);
            const precoTotal = resultados.reduce((acc, produto) => acc + parseFloat(produto.precoTotal), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            res.render('carrinho', { title: 'Carrinho - Pesadão', produtos: resultados, totalItens, precoTotal });
        }
    });
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

        //Rota pra Buscar Produtos
        app.get('/resultadoPesquisa', function(req, res) {
            let productName = req.query.name;
        
            if (!productName) {
                return res.status(400).send('Nome do produto não fornecido');
            }
        
            console.log(`Buscando por: ${productName}`);
        
            let sql = `SELECT * FROM produtos WHERE name LIKE ?`;
            let query = '%' + productName + '%';
        
            console.log(`Executando SQL: ${sql} com query: ${query}`);
        
            conexao.query(sql, [query], function(erro, resultadosBusca) {
                if (erro) {
                    console.error('Erro ao executar a consulta:', erro);
                    res.status(500).send('Erro ao buscar!');
                } else {
                    
                    const groupedResultadosBusca = [];
                    for (let i = 0; i < resultadosBusca.length; i += 3) {
                        groupedResultadosBusca.push(resultadosBusca.slice(i, i + 3));
                    }
                    console.log(groupedResultadosBusca)
                    res.render('resultadoPesquisa', {
                        title: 'Pesadão',
                        groupedResultadosBusca: groupedResultadosBusca
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
        app.post('/add-to-cart', function(req, res){
            const productId = req.body.productId;
            console.log(`Adicionando produto com ID: ${productId} ao carrinho`);
        
            // Verifica se a sessão do carrinho já existe, senão inicializa
            if (!req.session.cart) {
                req.session.cart = [];
            }
        
            // Adiciona o ID do produto ao carrinho
            req.session.cart.push(productId);
            console.log('Carrinho atual:', req.session.cart);
            
            // Converte o carrinho em um objeto contendo a contagem de cada produto
            const cartCount = req.session.cart.reduce((acc, productId) => {
                acc[productId] = (acc[productId] || 0) + 1;
                return acc;
            }, {});
        
            // Envia uma resposta de sucesso com o carrinho atualizado
            res.json({ success: true, cart: cartCount });
        });
        
        app.post('/remove-from-cart', function(req, res){
            const productId = req.body.productId;
            console.log(`Removendo produto com ID: ${productId} do carrinho`);
        
            // Verifica se a sessão do carrinho existe e se é um array
            if (!req.session.cart || !Array.isArray(req.session.cart)) {
                console.error('Carrinho não encontrado ou não é um array:', req.session.cart);
                res.status(500).send('Erro ao processar o carrinho');
                return;
            }
        
            // Encontra o índice do produto no carrinho
            const index = req.session.cart.findIndex(item => item === productId);
        
            // Remove o produto do carrinho se encontrado
            if (index !== -1) {
                req.session.cart.splice(index, 1);
                console.log('Produto removido com sucesso do carrinho:', productId);
                res.json({ success: true });
            } else {
                console.error('Produto não encontrado no carrinho:', productId);
                res.status(404).json({ success: false, message: 'Produto não encontrado no carrinho' });
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