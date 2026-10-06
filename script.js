/* =====================================================
   ORTOPÉDICA ALTEROSA
   SISTEMA COMPLETO
===================================================== */


/* =====================================================
   CONFIGURAÇÃO DE USUÁRIOS
===================================================== */

const USUARIOS = [

    {
        usuario: "admin",
        senha: "admin123",
        nome: "Administrador",
        tipo: "admin"
    },

    {
        usuario: "funcionario",
        senha: "func123",
        nome: "Funcionário",
        tipo: "funcionario"
    }

];


/* =====================================================
   CHAVES DO SISTEMA
===================================================== */

const CHAVES = {

    produtos:
        "ortopedica_alterosa_produtos",

    vendas:
        "ortopedica_alterosa_vendas",

    produtosAluguel:
        "ortopedica_alterosa_produtos_aluguel",

    alugueis:
        "ortopedica_alterosa_alugueis"

};


/* =====================================================
   VARIÁVEIS
===================================================== */

let usuarioAtual = null;


/* =====================================================
   ELEMENTOS
===================================================== */

const telaLogin =
    document.getElementById("telaLogin");

const sistema =
    document.getElementById("sistema");

const formLogin =
    document.getElementById("formLogin");

const usuarioLogin =
    document.getElementById("usuarioLogin");

const senhaLogin =
    document.getElementById("senhaLogin");

const mensagemLogin =
    document.getElementById("mensagemLogin");

const mostrarSenha =
    document.getElementById("mostrarSenha");

const btnSair =
    document.getElementById("btnSair");


/* =====================================================
   FUNÇÕES DE LOCALSTORAGE
===================================================== */

function carregarDados(chave) {

    try {

        const dados =
            localStorage.getItem(chave);

        if (!dados) {
            return [];
        }

        const convertido =
            JSON.parse(dados);

        return Array.isArray(convertido)
            ? convertido
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        return [];

    }

}


function salvarDados(chave, dados) {

    try {

        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar dados:",
            erro
        );

        alert(
            "Não foi possível salvar os dados no navegador."
        );

        return false;

    }

}


/* =====================================================
   SALVAMENTO DE SEGURANÇA
===================================================== */

function salvarTodosOsDados() {

    const produtos =
        carregarDados(
            CHAVES.produtos
        );

    const vendas =
        carregarDados(
            CHAVES.vendas
        );

    const produtosAluguel =
        carregarDados(
            CHAVES.produtosAluguel
        );

    const alugueis =
        carregarDados(
            CHAVES.alugueis
        );


    salvarDados(
        CHAVES.produtos,
        produtos
    );

    salvarDados(
        CHAVES.vendas,
        vendas
    );

    salvarDados(
        CHAVES.produtosAluguel,
        produtosAluguel
    );

    salvarDados(
        CHAVES.alugueis,
        alugueis
    );

}


/* =====================================================
   LOGIN
===================================================== */

formLogin.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();

        const usuario =
            usuarioLogin.value.trim();

        const senha =
            senhaLogin.value;


        const encontrado =
            USUARIOS.find(
                item =>
                    item.usuario === usuario &&
                    item.senha === senha
            );


        if (!encontrado) {

            mensagemLogin.textContent =
                "Usuário ou senha incorretos.";

            senhaLogin.value = "";

            senhaLogin.focus();

            return;

        }


        usuarioAtual = encontrado;


        sessionStorage.setItem(
            "ortopedica_usuario",
            JSON.stringify(encontrado)
        );


        entrarNoSistema();

    }
);


/* =====================================================
   MOSTRAR / OCULTAR SENHA
===================================================== */

mostrarSenha.addEventListener(
    "click",
    function () {

        if (
            senhaLogin.type ===
            "password"
        ) {

            senhaLogin.type =
                "text";

            mostrarSenha.textContent =
                "🙈";

        } else {

            senhaLogin.type =
                "password";

            mostrarSenha.textContent =
                "👁";

        }

    }
);


/* =====================================================
   ENTRAR
===================================================== */

function entrarNoSistema() {

    telaLogin.classList.add(
        "escondido"
    );

    sistema.classList.remove(
        "escondido"
    );


    document.getElementById(
        "nomeUsuarioLogado"
    ).textContent =
        usuarioAtual.nome;


    document.getElementById(
        "tipoUsuarioLogado"
    ).textContent =
        usuarioAtual.tipo === "admin"
            ? "Administrador"
            : "Funcionário";


    configurarPermissoes();


    carregarProdutos();

    carregarProdutosAluguel();


    atualizarTudo();

}


/* =====================================================
   VERIFICAR SESSÃO
===================================================== */

function verificarSessao() {

    const salvo =
        sessionStorage.getItem(
            "ortopedica_usuario"
        );


    if (!salvo) {

        telaLogin.classList.remove(
            "escondido"
        );

        sistema.classList.add(
            "escondido"
        );

        return;

    }


    try {

        usuarioAtual =
            JSON.parse(salvo);

        entrarNoSistema();

    } catch {

        sessionStorage.removeItem(
            "ortopedica_usuario"
        );

    }

}


/* =====================================================
   SAIR
===================================================== */

btnSair.addEventListener(
    "click",
    function () {

        salvarTodosOsDados();


        const confirmar =
            confirm(
                "Deseja realmente sair do sistema?"
            );


        if (!confirmar) {
            return;
        }


        usuarioAtual = null;


        sessionStorage.removeItem(
            "ortopedica_usuario"
        );


        sistema.classList.add(
            "escondido"
        );


        telaLogin.classList.remove(
            "escondido"
        );


        usuarioLogin.value = "";

        senhaLogin.value = "";

        mensagemLogin.textContent = "";

    }
);


/* =====================================================
   PERMISSÕES
===================================================== */

function configurarPermissoes() {

    const admin =
        usuarioAtual &&
        usuarioAtual.tipo === "admin";


    const menuEstoque =
        document.getElementById(
            "menuEstoque"
        );

    const menuHistorico =
        document.getElementById(
            "menuHistorico"
        );


    if (admin) {

        menuEstoque.classList.remove(
            "escondido"
        );

        menuHistorico.classList.remove(
            "escondido"
        );


        document
            .querySelectorAll(
                ".admin-aluguel"
            )
            .forEach(
                elemento =>
                    elemento.classList.remove(
                        "escondido"
                    )
            );

    } else {

        menuEstoque.classList.add(
            "escondido"
        );

        menuHistorico.classList.add(
            "escondido"
        );


        document
            .querySelectorAll(
                ".admin-aluguel"
            )
            .forEach(
                elemento =>
                    elemento.classList.add(
                        "escondido"
                    )
            );

    }

}


/* =====================================================
   MENU PRINCIPAL
===================================================== */

document
    .querySelectorAll(".menu-btn")
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                function () {

                    const aba =
                        this.dataset.aba;


                    if (
                        usuarioAtual.tipo ===
                            "funcionario" &&
                        (
                            aba === "estoque" ||
                            aba === "historico"
                        )
                    ) {

                        alert(
                            "Você não possui permissão para acessar esta área."
                        );

                        return;

                    }


                    document
                        .querySelectorAll(
                            ".menu-btn"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "ativo"
                                )
                        );


                    document
                        .querySelectorAll(
                            ".aba"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "ativa"
                                )
                        );


                    this.classList.add(
                        "ativo"
                    );


                    const elemento =
                        document.getElementById(
                            "aba-" + aba
                        );


                    if (elemento) {

                        elemento.classList.add(
                            "ativa"
                        );

                    }


                    atualizarTudo();

                }

            );

        }
    );


/* =====================================================
   PRODUTOS
===================================================== */

function carregarProdutos() {

    const produtos =
        carregarDados(
            CHAVES.produtos
        );


    const select =
        document.getElementById(
            "produtoVenda"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">Selecione um produto</option>';


    produtos.forEach(
        produto => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                produto.id;


            option.textContent =
                `${produto.code} - ${produto.name} | ${formatarMoeda(produto.price)} | Estoque: ${produto.quantity}`;


            select.appendChild(
                option
            );

        }
    );


    renderizarEstoque();

}


/* =====================================================
   CADASTRAR PRODUTO
===================================================== */

document
    .getElementById(
        "formProduto"
    )
    .addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            if (
                !usuarioAtual ||
                usuarioAtual.tipo !== "admin"
            ) {

                alert(
                    "Somente o administrador pode cadastrar produtos."
                );

                return;

            }


            const produtos =
                carregarDados(
                    CHAVES.produtos
                );


            const codigo =
                document
                    .getElementById(
                        "codigoProduto"
                    )
                    .value.trim();


            const nome =
                document
                    .getElementById(
                        "nomeProduto"
                    )
                    .value.trim();


            const quantidade =
                Number(
                    document
                        .getElementById(
                            "quantidadeProduto"
                        )
                        .value
                );


            const preco =
                Number(
                    document
                        .getElementById(
                            "precoProduto"
                        )
                        .value
                );


            if (
                produtos.some(
                    produto =>
                        produto.code.toLowerCase() ===
                        codigo.toLowerCase()
                )
            ) {

                alert(
                    "Já existe um produto com este código."
                );

                return;

            }


            produtos.push({

                id:
                    Date.now(),

                code:
                    codigo,

                name:
                    nome,

                quantity:
                    quantidade,

                price:
                    preco

            });


            salvarDados(
                CHAVES.produtos,
                produtos
            );


            this.reset();


            alert(
                "Produto cadastrado com sucesso!"
            );


            carregarProdutos();

            atualizarTudo();

        }
    );


/* =====================================================
   RENDERIZAR ESTOQUE
===================================================== */

function renderizarEstoque(
    termo = ""
) {

    const produtos =
        carregarDados(
            CHAVES.produtos
        );


    const tabela =
        document.getElementById(
            "tabelaEstoque"
        );


    tabela.innerHTML = "";


    const filtrados =
        produtos.filter(
            produto => {

                const texto =
                    (
                        produto.code +
                        " " +
                        produto.name
                    ).toLowerCase();


                return texto.includes(
                    termo.toLowerCase()
                );

            }
        );


    if (!filtrados.length) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;

        return;

    }


    filtrados.forEach(
        produto => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escaparHTML(
                        produto.code
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        produto.name
                    )}
                </td>

                <td>
                    <strong>
                        ${produto.quantity}
                    </strong>
                </td>

                <td>
                    ${formatarMoeda(
                        produto.price
                    )}
                </td>

                <td>

                    <div class="acao-tabela">

                        <button
                            class="btn-mini btn-editar"
                            onclick="adicionarEstoque(${produto.id})"
                        >
                            + Estoque
                        </button>

                        <button
                            class="btn-mini btn-excluir"
                            onclick="excluirProduto(${produto.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>

            `;


            tabela.appendChild(
                tr
            );

        }
    );

}


/* =====================================================
   ADICIONAR ESTOQUE
===================================================== */

function adicionarEstoque(
    id
) {

    if (
        !usuarioAtual ||
        usuarioAtual.tipo !== "admin"
    ) {

        alert(
            "Somente o administrador pode alterar o estoque."
        );

        return;

    }


    const quantidade =
        prompt(
            "Digite a quantidade que chegou:"
        );


    if (quantidade === null) {
        return;
    }


    const valor =
        Number(
            quantidade
        );


    if (
        !Number.isFinite(valor) ||
        valor <= 0
    ) {

        alert(
            "Digite uma quantidade válida."
        );

        return;

    }


    const produtos =
        carregarDados(
            CHAVES.produtos
        );


    const produto =
        produtos.find(
            item =>
                item.id === id
        );


    if (!produto) {
        return;
    }


    produto.quantity += valor;


    salvarDados(
        CHAVES.produtos,
        produtos
    );


    carregarProdutos();


    alert(
        "Estoque atualizado!"
    );

}


/* =====================================================
   EXCLUIR PRODUTO
===================================================== */

function excluirProduto(
    id
) {

    if (
        !usuarioAtual ||
        usuarioAtual.tipo !== "admin"
    ) {

        alert(
            "Somente o administrador pode excluir produtos."
        );

        return;

    }


    const confirmar =
        confirm(
            "Deseja realmente excluir este produto?"
        );


    if (!confirmar) {
        return;
    }


    let produtos =
        carregarDados(
            CHAVES.produtos
        );


    produtos =
        produtos.filter(
            produto =>
                produto.id !== id
        );


    salvarDados(
        CHAVES.produtos,
        produtos
    );


    carregarProdutos();

}


/* =====================================================
   BUSCA ESTOQUE
===================================================== */

document
    .getElementById(
        "buscaEstoque"
    )
    .addEventListener(
        "input",
        function () {

            renderizarEstoque(
                this.value
            );

        }
    );


/* =====================================================
   VENDA
===================================================== */

const produtoVenda =
    document.getElementById(
        "produtoVenda"
    );

const quantidadeVenda =
    document.getElementById(
        "quantidadeVenda"
    );

const precoVenda =
    document.getElementById(
        "precoVenda"
    );

const totalVenda =
    document.getElementById(
        "totalVenda"
    );

const valorRecebido =
    document.getElementById(
        "valorRecebido"
    );

const trocoVenda =
    document.getElementById(
        "trocoVenda"
    );

const areaDinheiro =
    document.getElementById(
        "areaDinheiro"
    );


produtoVenda.addEventListener(
    "change",
    atualizarVenda
);


quantidadeVenda.addEventListener(
    "input",
    atualizarVenda
);


document
    .querySelectorAll(
        'input[name="pagamento"]'
    )
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                atualizarPagamento
            );

        }
    );


valorRecebido.addEventListener(
    "input",
    calcularTroco
);


/* =====================================================
   ATUALIZAR VENDA
===================================================== */

function atualizarVenda() {

    const produtos =
        carregarDados(
            CHAVES.produtos
        );


    const produto =
        produtos.find(
            item =>
                String(item.id) ===
                String(
                    produtoVenda.value
                )
        );


    const quantidade =
        Number(
            quantidadeVenda.value
        ) || 0;


    if (!produto) {

        precoVenda.value =
            "R$ 0,00";

        totalVenda.value =
            "R$ 0,00";

        calcularTroco();

        return;

    }


    precoVenda.value =
        formatarMoeda(
            produto.price
        );


    totalVenda.value =
        formatarMoeda(
            produto.price *
            quantidade
        );


    calcularTroco();

}


/* =====================================================
   PAGAMENTO
===================================================== */

function obterPagamento() {

    const selecionado =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    return selecionado
        ? selecionado.value
        : "Pix";

}


function atualizarPagamento() {

    const pagamento =
        obterPagamento();


    if (
        pagamento ===
        "Dinheiro"
    ) {

        areaDinheiro.classList.remove(
            "escondido"
        );

    } else {

        areaDinheiro.classList.add(
            "escondido"
        );

        valorRecebido.value = "";

        trocoVenda.value =
            "R$ 0,00";

    }

}


/* =====================================================
   TROCO
===================================================== */

function calcularTroco() {

    const pagamento =
        obterPagamento();


    if (
        pagamento !==
        "Dinheiro"
    ) {

        trocoVenda.value =
            "R$ 0,00";

        return;

    }


    const total =
        obterTotalVenda();


    const recebido =
        Number(
            valorRecebido.value
        ) || 0;


    const troco =
        recebido -
        total;


    trocoVenda.value =
        formatarMoeda(
            troco > 0
                ? troco
                : 0
        );

}


/* =====================================================
   OBTER TOTAL
===================================================== */

function obterTotalVenda() {

    const produtos =
        carregarDados(
            CHAVES.produtos
        );


    const produto =
        produtos.find(
            item =>
                String(item.id) ===
                String(
                    produtoVenda.value
                )
        );


    const quantidade =
        Number(
            quantidadeVenda.value
        ) || 0;


    if (!produto) {
        return 0;
    }


    return produto.price *
        quantidade;

}


/* =====================================================
   FINALIZAR VENDA
===================================================== */

document
    .getElementById(
        "formVenda"
    )
    .addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const produtos =
                carregarDados(
                    CHAVES.produtos
                );


            const produto =
                produtos.find(
                    item =>
                        String(item.id) ===
                        String(
                            produtoVenda.value
                        )
                );


            if (!produto) {

                alert(
                    "Selecione um produto."
                );

                return;

            }


            const quantidade =
                Number(
                    quantidadeVenda.value
                );


            if (
                quantidade <= 0 ||
                !Number.isInteger(
                    quantidade
                )
            ) {

                alert(
                    "Digite uma quantidade válida."
                );

                return;

            }


            if (
                quantidade >
                produto.quantity
            ) {

                alert(
                    `Estoque insuficiente. Disponível: ${produto.quantity}`
                );

                return;

            }


            const total =
                produto.price *
                quantidade;


            const pagamento =
                obterPagamento();


            let recebido = 0;

            let troco = 0;


            if (
                pagamento ===
                "Dinheiro"
            ) {

                recebido =
                    Number(
                        valorRecebido.value
                    ) || 0;


                if (
                    recebido < total
                ) {

                    alert(
                        "O valor recebido é menor que o total da venda."
                    );

                    return;

                }


                troco =
                    recebido -
                    total;

            }


            /* =============================================
               DIMINUI ESTOQUE
            ============================================= */

            produto.quantity -=
                quantidade;


            const estoqueSalvo =
                salvarDados(
                    CHAVES.produtos,
                    produtos
                );


            if (!estoqueSalvo) {

                return;

            }


            /* =============================================
               CRIA VENDA
            ============================================= */

            const vendas =
                carregarDados(
                    CHAVES.vendas
                );


            const venda = {

                id:
                    Date.now(),

                date:
                    new Date().toISOString(),

                customer:
                    document
                        .getElementById(
                            "clienteVenda"
                        )
                        .value.trim(),

                productId:
                    produto.id,

                productCode:
                    produto.code,

                productName:
                    produto.name,

                quantity:
                    quantidade,

                unitPrice:
                    produto.price,

                total:
                    total,

                payment:
                    pagamento,

                cashReceived:
                    recebido,

                change:
                    troco,

                impresso:
                    false,

                impressoEm:
                    null

            };


            vendas.push(
                venda
            );


            /* =============================================
               SALVA A VENDA ANTES DA IMPRESSÃO
            ============================================= */

            const vendaSalva =
                salvarDados(
                    CHAVES.vendas,
                    vendas
                );


            if (!vendaSalva) {

                return;

            }


            prepararRecibo(
                venda
            );


            alert(
                "Venda realizada com sucesso!"
            );


            carregarProdutos();

            atualizarTudo();


            this.reset();


            document
                .querySelector(
                    'input[value="Pix"]'
                )
                .checked = true;


            atualizarPagamento();

            atualizarVenda();


            /* =============================================
               IMPRESSÃO
            ============================================= */

            setTimeout(
                function () {

                    window.print();


                    registrarImpressaoVenda(
                        venda.id
                    );

                },
                300
            );

        }
    );


/* =====================================================
   REGISTRAR IMPRESSÃO
===================================================== */

function registrarImpressaoVenda(
    idVenda
) {

    const vendas =
        carregarDados(
            CHAVES.vendas
        );


    const venda =
        vendas.find(
            item =>
                item.id === idVenda
        );


    if (!venda) {
        return;
    }


    venda.impresso =
        true;


    venda.impressoEm =
        new Date().toISOString();


    salvarDados(
        CHAVES.vendas,
        vendas
    );

}


/* =====================================================
   RECIBO
===================================================== */

function prepararRecibo(
    venda
) {

    const data =
        new Date(
            venda.date
        );


    const html = `

        <p>
            <strong>Cliente:</strong>
            ${escaparHTML(
                venda.customer
            )}
        </p>

        <p>
            <strong>Data:</strong>
            ${formatarData(data)}
        </p>

        <br>

        <p>
            <strong>Produto:</strong>
            ${escaparHTML(
                venda.productName
            )}
        </p>

        <p>
            <strong>Quantidade:</strong>
            ${venda.quantity}
        </p>

        <p>
            <strong>Valor unitário:</strong>
            ${formatarMoeda(
                venda.unitPrice
            )}
        </p>

        <br>

        <p>
            <strong>Pagamento:</strong>
            ${escaparHTML(
                venda.payment
            )}
        </p>

        ${
            venda.payment ===
            "Dinheiro"
                ? `

                    <p>
                        <strong>Recebido:</strong>
                        ${formatarMoeda(
                            venda.cashReceived
                        )}
                    </p>

                    <p>
                        <strong>Troco:</strong>
                        ${formatarMoeda(
                            venda.change
                        )}
                    </p>

                `
                : ""
        }

        <br>

        <h2>
            TOTAL:
            ${formatarMoeda(
                venda.total
            )}
        </h2>

    `;


    document.getElementById(
        "conteudoRecibo"
    ).innerHTML =
        html;

}


/* =====================================================
   HISTÓRICO
===================================================== */

function renderizarHistorico() {

    const vendas =
        carregarDados(
            CHAVES.vendas
        );


    const tabela =
        document.getElementById(
            "tabelaHistorico"
        );


    const filtro =
        document.getElementById(
            "filtroMes"
        ).value;


    tabela.innerHTML = "";


    const filtradas =
        vendas.filter(
            venda => {

                if (!filtro) {
                    return true;
                }


                const data =
                    new Date(
                        venda.date
                    );


                const ano =
                    data.getFullYear();


                const mes =
                    String(
                        data.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    );


                return `${ano}-${mes}` ===
                    filtro;

            }
        );


    if (!filtradas.length) {

        tabela.innerHTML = `

            <tr>

                <td colspan="6">
                    Nenhuma venda encontrada.
                </td>

            </tr>

        `;


        atualizarIndicadores(
            filtradas
        );


        return;

    }


    filtradas
        .slice()
        .reverse()
        .forEach(
            venda => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${formatarData(
                            new Date(
                                venda.date
                            )
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            venda.customer
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            venda.productName
                        )}
                    </td>

                    <td>
                        ${venda.quantity}
                    </td>

                    <td>
                        <strong>
                            ${formatarMoeda(
                                venda.total
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escaparHTML(
                            venda.payment
                        )}
                    </td>

                `;


                tabela.appendChild(
                    tr
                );

            }
        );


    atualizarIndicadores(
        filtradas
    );

}


function atualizarIndicadores(
    vendas
) {

    const total =
        vendas.reduce(
            (
                soma,
                venda
            ) =>
                soma +
                Number(
                    venda.total
                ),
            0
        );


    document.getElementById(
        "totalHistorico"
    ).textContent =
        formatarMoeda(
            total
        );


    document.getElementById(
        "quantidadeHistorico"
    ).textContent =
        vendas.length;


    const produtos = {};


    vendas.forEach(
        venda => {

            produtos[
                venda.productName
            ] = (
                produtos[
                    venda.productName
                ] || 0
            ) +
            Number(
                venda.quantity
            );

        }
    );


    let maisVendido =
        "—";


    let maiorQuantidade =
        0;


    Object.entries(
        produtos
    ).forEach(
        (
            [
                nome,
                quantidade
            ]
        ) => {

            if (
                quantidade >
                maiorQuantidade
            ) {

                maiorQuantidade =
                    quantidade;

                maisVendido =
                    nome;

            }

        }
    );


    document.getElementById(
        "maisVendido"
    ).textContent =
        maisVendido;

}


document
    .getElementById(
        "filtroMes"
    )
    .addEventListener(
        "change",
        renderizarHistorico
    );


/* =====================================================
   PRODUTOS DE ALUGUEL
===================================================== */

function carregarProdutosAluguel() {

    const produtos =
        carregarDados(
            CHAVES.produtosAluguel
        );


    const select =
        document.getElementById(
            "produtoAluguel"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">Selecione o produto</option>';


    produtos
        .filter(
            produto =>
                produto.quantity > 0
        )
        .forEach(
            produto => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    produto.id;


                option.textContent =
                    `${produto.code} - ${produto.name} | Disponível: ${produto.quantity}`;


                select.appendChild(
                    option
                );

            }
        );


    renderizarEstoqueAluguel();

}


/* =====================================================
   CADASTRAR PRODUTO DE ALUGUEL
===================================================== */

document
    .getElementById(
        "formProdutoAluguel"
    )
    .addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            if (
                !usuarioAtual ||
                usuarioAtual.tipo !== "admin"
            ) {

                alert(
                    "Somente o administrador pode cadastrar produtos de aluguel."
                );

                return;

            }


            const produtos =
                carregarDados(
                    CHAVES.produtosAluguel
                );


            const codigo =
                document
                    .getElementById(
                        "codigoProdutoAluguel"
                    )
                    .value.trim();


            const nome =
                document
                    .getElementById(
                        "nomeProdutoAluguel"
                    )
                    .value.trim();


            const quantidade =
                Number(
                    document
                        .getElementById(
                            "quantidadeProdutoAluguel"
                        )
                        .value
                );


            if (
                produtos.some(
                    produto =>
                        produto.code.toLowerCase() ===
                        codigo.toLowerCase()
                )
            ) {

                alert(
                    "Já existe um produto de aluguel com este código."
                );

                return;

            }


            produtos.push({

                id:
                    Date.now(),

                code:
                    codigo,

                name:
                    nome,

                quantity:
                    quantidade

            });


            salvarDados(
                CHAVES.produtosAluguel,
                produtos
            );


            this.reset();


            alert(
                "Produto de aluguel cadastrado!"
            );


            carregarProdutosAluguel();

        }
    );


/* =====================================================
   RENDERIZAR ESTOQUE DE ALUGUEL
===================================================== */

function renderizarEstoqueAluguel() {

    const produtos =
        carregarDados(
            CHAVES.produtosAluguel
        );


    const tabela =
        document.getElementById(
            "tabelaEstoqueAluguel"
        );


    tabela.innerHTML = "";


    if (!produtos.length) {

        tabela.innerHTML = `

            <tr>

                <td colspan="4">
                    Nenhum produto cadastrado.
                </td>

            </tr>

        `;

        return;

    }


    produtos.forEach(
        produto => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escaparHTML(
                        produto.code
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        produto.name
                    )}
                </td>

                <td>
                    <strong>
                        ${produto.quantity}
                    </strong>
                </td>

                <td>

                    <div class="acao-tabela">

                        <button
                            class="btn-mini btn-editar"
                            onclick="adicionarEstoqueAluguel(${produto.id})"
                        >
                            + Estoque
                        </button>

                        <button
                            class="btn-mini btn-excluir"
                            onclick="excluirProdutoAluguel(${produto.id})"
                        >
                            Excluir
                        </button>

                    </div>

                </td>

            `;


            tabela.appendChild(
                tr
            );

        }
    );

}


/* =====================================================
   ADICIONAR ESTOQUE DE ALUGUEL
===================================================== */

function adicionarEstoqueAluguel(
    id
) {

    if (
        !usuarioAtual ||
        usuarioAtual.tipo !== "admin"
    ) {

        alert(
            "Somente o administrador pode alterar o estoque de aluguel."
        );

        return;

    }


    const quantidade =
        Number(
            prompt(
                "Quantidade que chegou:"
            )
        );


    if (
        !Number.isFinite(
            quantidade
        ) ||
        quantidade <= 0
    ) {

        return;

    }


    const produtos =
        carregarDados(
            CHAVES.produtosAluguel
        );


    const produto =
        produtos.find(
            item =>
                item.id === id
        );


    if (!produto) {
        return;
    }


    produto.quantity +=
        quantidade;


    salvarDados(
        CHAVES.produtosAluguel,
        produtos
    );


    carregarProdutosAluguel();

}


/* =====================================================
   EXCLUIR PRODUTO DE ALUGUEL
===================================================== */

function excluirProdutoAluguel(
    id
) {

    if (
        !usuarioAtual ||
        usuarioAtual.tipo !== "admin"
    ) {

        alert(
            "Somente o administrador pode excluir produtos."
        );

        return;

    }


    if (
        !confirm(
            "Deseja excluir este produto?"
        )
    ) {

        return;

    }


    let produtos =
        carregarDados(
            CHAVES.produtosAluguel
        );


    produtos =
        produtos.filter(
            produto =>
                produto.id !== id
        );


    salvarDados(
        CHAVES.produtosAluguel,
        produtos
    );


    carregarProdutosAluguel();

}


/* =====================================================
   NOVO ALUGUEL
===================================================== */

document
    .getElementById(
        "formAluguel"
    )
    .addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const produtos =
                carregarDados(
                    CHAVES.produtosAluguel
                );


            const produto =
                produtos.find(
                    item =>
                        String(item.id) ===
                        String(
                            document
                                .getElementById(
                                    "produtoAluguel"
                                )
                                .value
                        )
                );


            if (!produto) {

                alert(
                    "Selecione um produto."
                );

                return;

            }


            if (
                produto.quantity <= 0
            ) {

                alert(
                    "Este produto não possui unidades disponíveis."
                );

                return;

            }


            const dias =
                Number(
                    document
                        .getElementById(
                            "duracaoAluguel"
                        )
                        .value
                );


            if (
                !Number.isInteger(dias) ||
                dias <= 0
            ) {

                alert(
                    "Digite uma duração válida."
                );

                return;

            }


            const inicio =
                new Date();


            const vencimento =
                new Date(
                    inicio
                );


            vencimento.setDate(
                vencimento.getDate() +
                dias
            );


            produto.quantity -= 1;


            const estoqueSalvo =
                salvarDados(
                    CHAVES.produtosAluguel,
                    produtos
                );


            if (!estoqueSalvo) {
                return;
            }


            const alugueis =
                carregarDados(
                    CHAVES.alugueis
                );


            alugueis.push({

                id:
                    Date.now(),

                customer:
                    document
                        .getElementById(
                            "clienteAluguel"
                        )
                        .value.trim(),

                cpf:
                    document
                        .getElementById(
                            "cpfAluguel"
                        )
                        .value.trim(),

                phone:
                    document
                        .getElementById(
                            "telefoneAluguel"
                        )
                        .value.trim(),

                address:
                    document
                        .getElementById(
                            "enderecoAluguel"
                        )
                        .value.trim(),

                productId:
                    produto.id,

                productCode:
                    produto.code,

                productName:
                    produto.name,

                startDate:
                    inicio.toISOString(),

                dueDate:
                    vencimento.toISOString(),

                durationDays:
                    dias,

                returned:
                    false,

                returnDate:
                    null

            });


            const aluguelSalvo =
                salvarDados(
                    CHAVES.alugueis,
                    alugueis
                );


            if (!aluguelSalvo) {
                return;
            }


            this.reset();


            alert(
                "Aluguel registrado com sucesso!"
            );


            carregarProdutosAluguel();

            renderizarAlugueis();

            verificarAtrasos();

        }
    );


/* =====================================================
   RENDERIZAR ALUGUÉIS
===================================================== */

function renderizarAlugueis() {

    const alugueis =
        carregarDados(
            CHAVES.alugueis
        );


    const tabela =
        document.getElementById(
            "tabelaAlugueis"
        );


    tabela.innerHTML = "";


    if (!alugueis.length) {

        tabela.innerHTML = `

            <tr>

                <td colspan="6">
                    Nenhum aluguel registrado.
                </td>

            </tr>

        `;

        return;

    }


    alugueis
        .slice()
        .reverse()
        .forEach(
            aluguel => {

                const status =
                    obterStatusAluguel(
                        aluguel
                    );


                const tr =
                    document.createElement(
                        "tr"
                    );


                let botoes = "";


                if (
                    !aluguel.returned
                ) {

                    botoes += `

                        <button
                            class="btn-mini btn-devolver"
                            onclick="devolverAluguel(${aluguel.id})"
                        >
                            Devolver
                        </button>

                        <button
                            class="btn-mini btn-renovar"
                            onclick="renovarAluguel(${aluguel.id})"
                        >
                            Renovar
                        </button>

                    `;

                }


                tr.innerHTML = `

                    <td>
                        ${escaparHTML(
                            aluguel.customer
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            aluguel.productName
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            new Date(
                                aluguel.startDate
                            )
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            new Date(
                                aluguel.dueDate
                            )
                        )}
                    </td>

                    <td>
                        ${status.html}
                    </td>

                    <td>

                        <div class="acao-tabela">
                            ${botoes}
                        </div>

                    </td>

                `;


                tabela.appendChild(
                    tr
                );

            }
        );

}


/* =====================================================
   STATUS DO ALUGUEL
===================================================== */

function obterStatusAluguel(
    aluguel
) {

    if (
        aluguel.returned
    ) {

        return {

            texto:
                "Devolvido",

            html:
                '<span class="status status-devolvido">Devolvido</span>'

        };

    }


    const agora =
        new Date();


    const vencimento =
        new Date(
            aluguel.dueDate
        );


    if (
        agora >
        vencimento
    ) {

        return {

            texto:
                "Atrasado",

            html:
                '<span class="status status-atrasado">Atrasado</span>'

        };

    }


    return {

        texto:
            "Alugado",

        html:
            '<span class="status status-ativo">Alugado</span>'

    };

}


/* =====================================================
   DEVOLVER ALUGUEL
===================================================== */

function devolverAluguel(
    id
) {

    const alugueis =
        carregarDados(
            CHAVES.alugueis
        );


    const aluguel =
        alugueis.find(
            item =>
                item.id === id
        );


    if (
        !aluguel ||
        aluguel.returned
    ) {

        return;

    }


    if (
        !confirm(
            "Confirmar devolução do produto?"
        )
    ) {

        return;

    }


    aluguel.returned =
        true;


    aluguel.returnDate =
        new Date().toISOString();


    const aluguelSalvo =
        salvarDados(
            CHAVES.alugueis,
            alugueis
        );


    if (!aluguelSalvo) {
        return;
    }


    const produtos =
        carregarDados(
            CHAVES.produtosAluguel
        );


    const produto =
        produtos.find(
            item =>
                item.id ===
                aluguel.productId
        );


    if (produto) {

        produto.quantity +=
            1;

    }


    salvarDados(
        CHAVES.produtosAluguel,
        produtos
    );


    carregarProdutosAluguel();

    renderizarAlugueis();

    verificarAtrasos();


    alert(
        "Produto devolvido e estoque atualizado!"
    );

}


/* =====================================================
   RENOVAR ALUGUEL
===================================================== */

function renovarAluguel(
    id
) {

    const dias =
        Number(
            prompt(
                "Quantos dias deseja acrescentar?",
                "7"
            )
        );


    if (
        !Number.isFinite(dias) ||
        dias <= 0
    ) {

        return;

    }


    const alugueis =
        carregarDados(
            CHAVES.alugueis
        );


    const aluguel =
        alugueis.find(
            item =>
                item.id === id
        );


    if (!aluguel) {
        return;
    }


    const vencimento =
        new Date(
            aluguel.dueDate
        );


    vencimento.setDate(
        vencimento.getDate() +
        dias
    );


    aluguel.dueDate =
        vencimento.toISOString();


    salvarDados(
        CHAVES.alugueis,
        alugueis
    );


    renderizarAlugueis();

    verificarAtrasos();


    alert(
        "Aluguel renovado com sucesso!"
    );

}


/* =====================================================
   VERIFICAR ATRASOS
===================================================== */

function verificarAtrasos() {

    const alugueis =
        carregarDados(
            CHAVES.alugueis
        );


    const atrasados =
        alugueis.filter(
            aluguel => {

                if (
                    aluguel.returned
                ) {

                    return false;

                }


                return new Date() >
                    new Date(
                        aluguel.dueDate
                    );

            }
        );


    const alerta =
        document.getElementById(
            "alertaAluguel"
        );


    if (
        atrasados.length > 0
    ) {

        alerta.classList.remove(
            "escondido"
        );


        alerta.textContent =
            `⚠️ Existem ${atrasados.length} aluguel(is) atrasado(s)!`;

    } else {

        alerta.classList.add(
            "escondido"
        );

    }

}


/* =====================================================
   SUB-MENU ALUGUEL
===================================================== */

document
    .querySelectorAll(
        ".sub-btn"
    )
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                function () {

                    const sub =
                        this.dataset.sub;


                    if (
                        sub ===
                        "estoque-aluguel" &&
                        usuarioAtual.tipo !==
                        "admin"
                    ) {

                        alert(
                            "Somente o administrador pode acessar o estoque de aluguel."
                        );

                        return;

                    }


                    document
                        .querySelectorAll(
                            ".sub-btn"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "ativo"
                                )
                        );


                    document
                        .querySelectorAll(
                            ".sub-aba"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "ativa"
                                )
                        );


                    this.classList.add(
                        "ativo"
                    );


                    const elemento =
                        document.getElementById(
                            "sub-" + sub
                        );


                    if (elemento) {

                        elemento.classList.add(
                            "ativa"
                        );

                    }

                }
            );

        }
    );


/* =====================================================
   ATUALIZAR TUDO
===================================================== */

function atualizarTudo() {

    if (!usuarioAtual) {
        return;
    }


    carregarProdutos();

    carregarProdutosAluguel();

    renderizarAlugueis();

    renderizarHistorico();

    verificarAtrasos();

    atualizarPagamento();

    atualizarVenda();

}


/* =====================================================
   FORMULÁRIOS
===================================================== */

document
    .getElementById(
        "formVenda"
    )
    .addEventListener(
        "reset",
        function () {

            setTimeout(
                function () {

                    atualizarPagamento();

                    atualizarVenda();

                },
                0
            );

        }
    );


/* =====================================================
   SALVAMENTO AUTOMÁTICO DE SEGURANÇA
===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        salvarTodosOsDados();

    }
);


/* =====================================================
   VISIBILIDADE DA PÁGINA
===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "hidden"
        ) {

            salvarTodosOsDados();

        }

    }
);


/* =====================================================
   FORMATAR MOEDA
===================================================== */

function formatarMoeda(
    valor
) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(
        Number(valor) || 0
    );

}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatarData(
    data
) {

    return data.toLocaleDateString(
        "pt-BR"
    );

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INICIAR SISTEMA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        verificarSessao();

    }
);
