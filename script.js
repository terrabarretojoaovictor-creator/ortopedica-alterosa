/* ==========================================================
   ORTOPÉDICA ALTEROSA
   SISTEMA DE VENDAS, ESTOQUE E ALUGUÉIS
========================================================== */


/* ==========================================================
   DADOS
========================================================== */

let produtos = JSON.parse(
    localStorage.getItem("ortopedica_produtos")
) || [];

let pedidos = JSON.parse(
    localStorage.getItem("ortopedica_pedidos")
) || [];

let produtosAluguel = JSON.parse(
    localStorage.getItem("ortopedica_produtos_aluguel")
) || [];

let alugueis = JSON.parse(
    localStorage.getItem("ortopedica_alugueis")
) || [];

let mesesFechados = JSON.parse(
    localStorage.getItem("ortopedica_meses_fechados")
) || [];



/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    atualizarData();

    preencherAnos();

    definirMesAtual();

    definirDataAluguel();

    atualizarTudo();

    verificarAlugueisAtrasados();

});



/* ==========================================================
   SALVAR DADOS
========================================================== */

function salvarDados() {

    localStorage.setItem(
        "ortopedica_produtos",
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        "ortopedica_pedidos",
        JSON.stringify(pedidos)
    );

    localStorage.setItem(
        "ortopedica_produtos_aluguel",
        JSON.stringify(produtosAluguel)
    );

    localStorage.setItem(
        "ortopedica_alugueis",
        JSON.stringify(alugueis)
    );

    localStorage.setItem(
        "ortopedica_meses_fechados",
        JSON.stringify(mesesFechados)
    );

}



/* ==========================================================
   DATA
========================================================== */

function atualizarData() {

    const elemento = document.getElementById("dataAtual");

    if (!elemento) return;

    const agora = new Date();

    elemento.textContent = agora.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}



function preencherAnos() {

    const select = document.getElementById("anoHistorico");

    if (!select) return;

    const anoAtual = new Date().getFullYear();

    select.innerHTML = "";

    for (
        let ano = anoAtual - 5;
        ano <= anoAtual + 5;
        ano++
    ) {

        const option = document.createElement("option");

        option.value = ano;

        option.textContent = ano;

        if (ano === anoAtual) {
            option.selected = true;
        }

        select.appendChild(option);

    }

}



function definirMesAtual() {

    const mes = document.getElementById("mesHistorico");

    if (!mes) return;

    mes.value = new Date().getMonth();

}



/* ==========================================================
   ABAS PRINCIPAIS
========================================================== */

function abrirAba(id, botao) {

    document.querySelectorAll(".aba").forEach(
        aba => aba.classList.remove("ativa")
    );

    const aba = document.getElementById(id);

    if (aba) {
        aba.classList.add("ativa");
    }


    document.querySelectorAll(".menu-btn").forEach(
        btn => btn.classList.remove("ativo")
    );

    if (botao) {
        botao.classList.add("ativo");
    }


    if (id === "estoque") {
        mostrarEstoque();
    }

    if (id === "historico") {
        mostrarHistorico();
    }

    if (id === "alugueis") {
        mostrarEstoqueAluguel();
        atualizarSelectAluguel();
        mostrarAlugueis();
        verificarAlugueisAtrasados();
    }

}



/* ==========================================================
   PRODUTOS
========================================================== */

function abrirCadastroProduto() {

    document
        .getElementById("cadastroProduto")
        .classList.remove("oculto");

}



function fecharCadastroProduto() {

    document
        .getElementById("cadastroProduto")
        .classList.add("oculto");

}



function salvarProduto() {

    const codigo =
        document.getElementById("codigoProduto").value.trim();

    const nome =
        document.getElementById("nomeProduto").value.trim();

    const quantidade =
        Number(document.getElementById("quantidadeProduto").value);

    const preco =
        Number(document.getElementById("precoProduto").value);


    if (!codigo || !nome) {

        alert("Informe o código e o nome do produto.");

        return;
    }


    if (quantidade < 0 || preco < 0) {

        alert("Quantidade e preço não podem ser negativos.");

        return;
    }


    const codigoExiste = produtos.some(
        produto => produto.codigo.toLowerCase() === codigo.toLowerCase()
    );


    if (codigoExiste) {

        alert("Já existe um produto com este código.");

        return;
    }


    const produto = {

        id: Date.now(),

        codigo: codigo,

        nome: nome,

        quantidade: quantidade,

        preco: preco,

        criadoEm: new Date().toISOString()

    };


    produtos.push(produto);

    salvarDados();

    limparFormularioProduto();

    fecharCadastroProduto();

    atualizarTudo();

    alert("Produto cadastrado com sucesso!");

}



function limparFormularioProduto() {

    document.getElementById("codigoProduto").value = "";

    document.getElementById("nomeProduto").value = "";

    document.getElementById("quantidadeProduto").value = 0;

    document.getElementById("precoProduto").value = "";

}



/* ==========================================================
   ESTOQUE
========================================================== */

function mostrarEstoque() {

    const tabela =
        document.getElementById("tabelaEstoque");

    const pesquisa =
        document.getElementById("pesquisaEstoque")
            ?.value
            .toLowerCase()
            .trim() || "";


    tabela.innerHTML = "";


    const lista = produtos.filter(produto => {

        return (
            produto.nome.toLowerCase().includes(pesquisa) ||
            produto.codigo.toLowerCase().includes(pesquisa)
        );

    });


    if (lista.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(produto => {

        let status = "";

        if (produto.quantidade <= 0) {

            status =
                `<span class="status status-esgotado">
                    Esgotado
                </span>`;

        } else if (produto.quantidade <= 3) {

            status =
                `<span class="status status-baixo">
                    Estoque baixo
                </span>`;

        } else {

            status =
                `<span class="status status-ok">
                    Disponível
                </span>`;

        }


        tabela.innerHTML += `

            <tr>

                <td>
                    <strong>${escaparHTML(produto.codigo)}</strong>
                </td>

                <td>
                    ${escaparHTML(produto.nome)}
                </td>

                <td>
                    <strong>${produto.quantidade}</strong>
                </td>

                <td>
                    ${formatarMoeda(produto.preco)}
                </td>

                <td>
                    ${status}
                </td>

                <td>

                    <button
                        class="btn btn-pequeno btn-principal"
                        onclick="alterarEstoque(${produto.id})"
                    >
                        Alterar
                    </button>

                    <button
                        class="btn btn-pequeno btn-perigo"
                        onclick="excluirProduto(${produto.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `;

    });

}



/* ==========================================================
   ALTERAR ESTOQUE
========================================================== */

function alterarEstoque(id) {

    const produto = produtos.find(
        item => item.id === id
    );

    if (!produto) return;


    const novaQuantidade = prompt(
        `Quantidade atual: ${produto.quantidade}\n\nDigite a nova quantidade:`,
        produto.quantidade
    );


    if (novaQuantidade === null) return;


    const valor = Number(novaQuantidade);


    if (!Number.isInteger(valor) || valor < 0) {

        alert("Digite uma quantidade inteira válida.");

        return;
    }


    produto.quantidade = valor;

    salvarDados();

    atualizarTudo();

}



function excluirProduto(id) {

    const produto = produtos.find(
        item => item.id === id
    );

    if (!produto) return;


    const confirmar = confirm(
        `Deseja realmente excluir "${produto.nome}"?`
    );


    if (!confirmar) return;


    produtos = produtos.filter(
        item => item.id !== id
    );


    salvarDados();

    atualizarTudo();

}



/* ==========================================================
   PEDIDO
========================================================== */

function atualizarSelectProdutos() {

    const select =
        document.getElementById("produtoVenda");

    if (!select) return;


    const valorAtual = select.value;


    select.innerHTML = `
        <option value="">
            Selecione um produto
        </option>
    `;


    produtos
        .filter(produto => produto.quantidade > 0)
        .forEach(produto => {

            const option =
                document.createElement("option");

            option.value = produto.id;

            option.textContent =
                `${produto.nome} — ${formatarMoeda(produto.preco)} — Estoque: ${produto.quantidade}`;

            select.appendChild(option);

        });


    if (
        produtos.some(
            produto => String(produto.id) === String(valorAtual)
        )
    ) {

        select.value = valorAtual;

    }

}



function selecionarProdutoVenda() {

    const id =
        Number(
            document.getElementById("produtoVenda").value
        );


    const produto =
        produtos.find(
            item => item.id === id
        );


    const codigo =
        document.getElementById("codigoVenda");

    const preco =
        document.getElementById("precoVenda");


    if (!produto) {

        codigo.value = "";

        preco.value = "";

        calcularVenda();

        return;
    }


    codigo.value = produto.codigo;

    preco.value = produto.preco;

    calcularVenda();

}



function calcularVenda() {

    const preco =
        Number(
            document.getElementById("precoVenda").value
        ) || 0;


    const quantidade =
        Number(
            document.getElementById("quantidadeVenda").value
        ) || 0;


    const total = preco * quantidade;


    document.getElementById("totalProdutoVenda")
        .value = formatarMoeda(total);


    document.getElementById("subtotalVenda")
        .textContent = formatarMoeda(total);


    document.getElementById("totalVenda")
        .textContent = formatarMoeda(total);


    calcularTroco();

}



function alterarPagamento() {

    const pagamento =
        document.querySelector(
            'input[name="formaPagamento"]:checked'
        )?.value;


    const area =
        document.getElementById("areaDinheiro");


    if (pagamento === "Dinheiro") {

        area.classList.remove("oculto");

    } else {

        area.classList.add("oculto");

        document.getElementById("valorRecebido").value = "";

        document.getElementById("troco").value =
            "R$ 0,00";

    }

}



function calcularTroco() {

    const forma =
        document.querySelector(
            'input[name="formaPagamento"]:checked'
        )?.value;


    if (forma !== "Dinheiro") return;


    const total =
        Number(
            document.getElementById("precoVenda").value
        ) *
        Number(
            document.getElementById("quantidadeVenda").value
        );


    const recebido =
        Number(
            document.getElementById("valorRecebido").value
        ) || 0;


    const troco = recebido - total;


    document.getElementById("troco").value =
        formatarMoeda(
            troco > 0 ? troco : 0
        );

}



function finalizarVenda() {

    const cliente =
        document.getElementById("clienteVenda").value.trim();


    const cpf =
        document.getElementById("cpfVenda").value.trim();


    const produtoId =
        Number(
            document.getElementById("produtoVenda").value
        );


    const quantidade =
        Number(
            document.getElementById("quantidadeVenda").value
        );


    const formaPagamento =
        document.querySelector(
            'input[name="formaPagamento"]:checked'
        )?.value;


    if (!cliente) {

        alert("Informe o nome do cliente.");

        return;
    }


    if (!produtoId) {

        alert("Selecione um produto.");

        return;
    }


    if (!quantidade || quantidade <= 0) {

        alert("Informe uma quantidade válida.");

        return;
    }


    if (!formaPagamento) {

        alert("Selecione a forma de pagamento.");

        return;
    }


    const produto =
        produtos.find(
            item => item.id === produtoId
        );


    if (!produto) {

        alert("Produto não encontrado.");

        return;
    }


    if (produto.quantidade < quantidade) {

        alert(
            `Estoque insuficiente.\n\nDisponível: ${produto.quantidade}`
        );

        return;
    }


    const total =
        produto.preco * quantidade;


    let recebido = total;

    let troco = 0;


    if (formaPagamento === "Dinheiro") {

        recebido =
            Number(
                document.getElementById("valorRecebido").value
            ) || 0;


        if (recebido < total) {

            alert(
                "O valor recebido é menor que o valor da venda."
            );

            return;
        }


        troco = recebido - total;

    }


    /* BAIXA DO ESTOQUE */

    produto.quantidade -= quantidade;


    /* REGISTRA PEDIDO */

    const pedido = {

        id: Date.now(),

        cliente: cliente,

        cpf: cpf,

        produtoId: produto.id,

        produto: produto.nome,

        codigo: produto.codigo,

        quantidade: quantidade,

        precoUnitario: produto.preco,

        total: total,

        formaPagamento: formaPagamento,

        recebido: recebido,

        troco: troco,

        data: new Date().toISOString(),

        mes: new Date().getMonth(),

        ano: new Date().getFullYear()

    };


    pedidos.push(pedido);

    salvarDados();

    prepararRecibo(pedido);

    atualizarTudo();

    limparPedido();


    /*
       Abre automaticamente a tela de impressão
    */

    setTimeout(() => {

        window.print();

    }, 300);

}



/* ==========================================================
   RECIBO
========================================================== */

function prepararRecibo(pedido) {

    document.getElementById("reciboData")
        .textContent =
        formatarDataHora(pedido.data);


    document.getElementById("reciboCliente")
        .textContent =
        pedido.cliente;


    document.getElementById("reciboCPF")
        .textContent =
        pedido.cpf || "Não informado";


    document.getElementById("reciboProduto")
        .textContent =
        pedido.produto;


    document.getElementById("reciboCodigo")
        .textContent =
        pedido.codigo;


    document.getElementById("reciboQuantidade")
        .textContent =
        pedido.quantidade;


    document.getElementById("reciboValor")
        .textContent =
        formatarMoeda(pedido.precoUnitario);


    document.getElementById("reciboPagamento")
        .textContent =
        pedido.formaPagamento;


    document.getElementById("reciboTotal")
        .textContent =
        formatarMoeda(pedido.total);


    const recebido =
        document.getElementById("reciboRecebido");

    const troco =
        document.getElementById("reciboTroco");


    if (pedido.formaPagamento === "Dinheiro") {

        recebido.textContent =
            "Valor recebido: " +
            formatarMoeda(pedido.recebido);


        troco.textContent =
            "Troco: " +
            formatarMoeda(pedido.troco);

    } else {

        recebido.textContent = "";

        troco.textContent = "";

    }

}



/* ==========================================================
   LIMPAR PEDIDO
========================================================== */

function limparPedido() {

    document.getElementById("clienteVenda").value = "";

    document.getElementById("cpfVenda").value = "";

    document.getElementById("produtoVenda").value = "";

    document.getElementById("codigoVenda").value = "";

    document.getElementById("precoVenda").value = "";

    document.getElementById("quantidadeVenda").value = 1;

    document.getElementById("totalProdutoVenda").value =
        "R$ 0,00";

    document.getElementById("subtotalVenda").textContent =
        "R$ 0,00";

    document.getElementById("totalVenda").textContent =
        "R$ 0,00";

    document.getElementById("valorRecebido").value = "";

    document.getElementById("troco").value =
        "R$ 0,00";


    document.querySelectorAll(
        'input[name="formaPagamento"]'
    ).forEach(
        radio => radio.checked = false
    );


    document
        .getElementById("areaDinheiro")
        .classList.add("oculto");

}



/* ==========================================================
   HISTÓRICO
========================================================== */

function mostrarHistorico() {

    const mes =
        Number(
            document.getElementById("mesHistorico").value
        );


    const ano =
        Number(
            document.getElementById("anoHistorico").value
        );


    const lista =
        pedidos.filter(
            pedido =>
                pedido.mes === mes &&
                pedido.ano === ano
        );


    const total =
        lista.reduce(
            (soma, pedido) =>
                soma + Number(pedido.total),
            0
        );


    document.getElementById("totalVendidoMes")
        .textContent =
        formatarMoeda(total);


    document.getElementById("quantidadePedidosMes")
        .textContent =
        lista.length;


    const contagem = {};


    lista.forEach(pedido => {

        if (!contagem[pedido.produto]) {

            contagem[pedido.produto] = 0;

        }

        contagem[pedido.produto] += pedido.quantidade;

    });


    let produtoMais = "Nenhum";

    let maiorQuantidade = 0;


    Object.keys(contagem).forEach(nome => {

        if (contagem[nome] > maiorQuantidade) {

            maiorQuantidade = contagem[nome];

            produtoMais = nome;

        }

    });


    document.getElementById("produtoMaisVendido")
        .textContent =
        produtoMais;


    const chaveMes =
        `${ano}-${String(mes + 1).padStart(2, "0")}`;


    const fechado =
        mesesFechados.includes(chaveMes);


    document.getElementById("statusMes")
        .textContent =
        fechado ? "Fechado" : "Em aberto";


    document.getElementById("tituloFechamento")
        .textContent =
        `${nomeMes(mes)} de ${ano}`;


    document.getElementById("textoFechamento")
        .textContent =
        fechado
            ? `Mês fechado. Total vendido: ${formatarMoeda(total)}.`
            : `Mês em aberto. Total até agora: ${formatarMoeda(total)}.`;


    const tabela =
        document.getElementById("tabelaHistorico");


    tabela.innerHTML = "";


    if (lista.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    Nenhum pedido neste mês.
                </td>
            </tr>
        `;

        return;
    }


    lista
        .slice()
        .reverse()
        .forEach(pedido => {

            tabela.innerHTML += `

                <tr>

                    <td>
                        ${formatarData(pedido.data)}
                    </td>

                    <td>
                        ${escaparHTML(pedido.cliente)}
                    </td>

                    <td>
                        ${escaparHTML(pedido.produto)}
                    </td>

                    <td>
                        ${escaparHTML(pedido.codigo)}
                    </td>

                    <td>
                        ${pedido.formaPagamento}
                    </td>

                    <td>
                        <strong>
                            ${formatarMoeda(pedido.total)}
                        </strong>
                    </td>

                    <td>

                        <button
                            class="btn btn-pequeno btn-principal"
                            onclick="imprimirPedido(${pedido.id})"
                        >
                            🖨️ Recibo
                        </button>

                    </td>

                </tr>

            `;

        });

}



/* ==========================================================
   IMPRIMIR PEDIDO NOVAMENTE
========================================================== */

function imprimirPedido(id) {

    const pedido =
        pedidos.find(
            item => item.id === id
        );


    if (!pedido) return;


    prepararRecibo(pedido);

    setTimeout(() => {

        window.print();

    }, 200);

}



/* ==========================================================
   FECHAMENTO DO MÊS
========================================================== */

function fecharMes() {

    const mes =
        Number(
            document.getElementById("mesHistorico").value
        );


    const ano =
        Number(
            document.getElementById("anoHistorico").value
        );


    const chave =
        `${ano}-${String(mes + 1).padStart(2, "0")}`;


    if (mesesFechados.includes(chave)) {

        alert("Este mês já está fechado.");

        return;
    }


    const pedidosMes =
        pedidos.filter(
            pedido =>
                pedido.mes === mes &&
                pedido.ano === ano
        );


    const total =
        pedidosMes.reduce(
            (soma, pedido) =>
                soma + Number(pedido.total),
            0
        );


    const confirmar =
        confirm(
            `Fechar ${nomeMes(mes)} de ${ano}?\n\n` +
            `Pedidos: ${pedidosMes.length}\n` +
            `Total vendido: ${formatarMoeda(total)}`
        );


    if (!confirmar) return;


    mesesFechados.push(chave);

    salvarDados();

    mostrarHistorico();

    alert(
        `${nomeMes(mes)} de ${ano} foi fechado com sucesso!`
    );

}



/* ==========================================================
   PRODUTOS DE ALUGUEL
========================================================== */

function abrirCadastroAluguel() {

    document
        .getElementById("cadastroProdutoAluguel")
        .classList.remove("oculto");

}



function fecharCadastroAluguel() {

    document
        .getElementById("cadastroProdutoAluguel")
        .classList.add("oculto");

}



function salvarProdutoAluguel() {

    const codigo =
        document
            .getElementById("codigoAluguelProduto")
            .value
            .trim();


    const nome =
        document
            .getElementById("nomeAluguelProduto")
            .value
            .trim();


    const quantidade =
        Number(
            document
                .getElementById("quantidadeAluguelProduto")
                .value
        );


    const diaria =
        Number(
            document
                .getElementById("valorDiariaAluguel")
                .value
        );


    if (!codigo || !nome) {

        alert(
            "Informe o código e o nome do produto."
        );

        return;
    }


    if (quantidade < 0 || diaria < 0) {

        alert(
            "Quantidade e valor não podem ser negativos."
        );

        return;
    }


    const codigoExiste =
        produtosAluguel.some(
            produto =>
                produto.codigo.toLowerCase() ===
                codigo.toLowerCase()
        );


    if (codigoExiste) {

        alert(
            "Já existe um produto de aluguel com este código."
        );

        return;
    }


    produtosAluguel.push({

        id: Date.now(),

        codigo: codigo,

        nome: nome,

        quantidade: quantidade,

        diaria: diaria

    });


    salvarDados();

    document.getElementById(
        "codigoAluguelProduto"
    ).value = "";


    document.getElementById(
        "nomeAluguelProduto"
    ).value = "";


    document.getElementById(
        "quantidadeAluguelProduto"
    ).value = 0;


    document.getElementById(
        "valorDiariaAluguel"
    ).value = "";


    fecharCadastroAluguel();

    atualizarTudo();

    alert(
        "Produto de aluguel cadastrado com sucesso!"
    );

}



/* ==========================================================
   ESTOQUE DE ALUGUEL
========================================================== */

function mostrarEstoqueAluguel() {

    const tabela =
        document.getElementById(
            "tabelaEstoqueAluguel"
        );


    tabela.innerHTML = "";


    if (produtosAluguel.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    Nenhum produto de aluguel cadastrado.
                </td>
            </tr>
        `;

        return;
    }


    produtosAluguel.forEach(produto => {

        tabela.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${escaparHTML(produto.codigo)}
                    </strong>
                </td>

                <td>
                    ${escaparHTML(produto.nome)}
                </td>

                <td>

                    <strong>
                        ${produto.quantidade}
                    </strong>

                </td>

                <td>
                    ${formatarMoeda(produto.diaria)}
                </td>

                <td>

                    <button
                        class="btn btn-pequeno btn-principal"
                        onclick="alterarEstoqueAluguel(${produto.id})"
                    >
                        Alterar
                    </button>

                    <button
                        class="btn btn-pequeno btn-perigo"
                        onclick="excluirProdutoAluguel(${produto.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `;

    });

}



function alterarEstoqueAluguel(id) {

    const produto =
        produtosAluguel.find(
            item => item.id === id
        );


    if (!produto) return;


    const novaQuantidade =
        prompt(
            `Quantidade atual: ${produto.quantidade}\n\nDigite a nova quantidade:`,
            produto.quantidade
        );


    if (novaQuantidade === null) return;


    const valor =
        Number(novaQuantidade);


    if (!Number.isInteger(valor) || valor < 0) {

        alert(
            "Digite uma quantidade inteira válida."
        );

        return;
    }


    produto.quantidade = valor;

    salvarDados();

    atualizarTudo();

}



function excluirProdutoAluguel(id) {

    const produto =
        produtosAluguel.find(
            item => item.id === id
        );


    if (!produto) return;


    const confirmar =
        confirm(
            `Excluir "${produto.nome}" do estoque de aluguel?`
        );


    if (!confirmar) return;


    produtosAluguel =
        produtosAluguel.filter(
            item => item.id !== id
        );


    salvarDados();

    atualizarTudo();

}



/* ==========================================================
   SELECT DO ALUGUEL
========================================================== */

function atualizarSelectAluguel() {

    const select =
        document.getElementById("produtoAluguel");


    if (!select) return;


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione o produto
        </option>
    `;


    produtosAluguel
        .filter(
            produto => produto.quantidade > 0
        )
        .forEach(produto => {

            const option =
                document.createElement("option");


            option.value =
                produto.id;


            option.textContent =
                `${produto.nome} — Disponível: ${produto.quantidade}`;


            select.appendChild(option);

        });


    if (
        produtosAluguel.some(
            produto =>
                String(produto.id) ===
                String(valorAtual)
        )
    ) {

        select.value = valorAtual;

    }

}



function selecionarProdutoAluguel() {

    const id =
        Number(
            document.getElementById(
                "produtoAluguel"
            ).value
        );


    const produto =
        produtosAluguel.find(
            item => item.id === id
        );


    if (!produto) {

        document.getElementById(
            "diariaAluguel"
        ).value = "R$ 0,00";

        calcularAluguel();

        return;
    }


    document.getElementById(
        "diariaAluguel"
    ).value =
        formatarMoeda(produto.diaria);


    calcularAluguel();

}



/* ==========================================================
   DATA DO ALUGUEL
========================================================== */

function definirDataAluguel() {

    const input =
        document.getElementById(
            "dataInicioAluguel"
        );


    if (!input) return;


    const hoje =
        new Date();


    input.value =
        formatarDataInput(hoje);


    calcularAluguel();

}



function calcularAluguel() {

    const dataInicio =
        document.getElementById(
            "dataInicioAluguel"
        ).value;


    const dias =
        Number(
            document.getElementById(
                "diasAluguel"
            ).value
        ) || 0;


    const produtoId =
        Number(
            document.getElementById(
                "produtoAluguel"
            ).value
        );


    const produto =
        produtosAluguel.find(
            item => item.id === produtoId
        );


    if (dataInicio && dias > 0) {

        const data =
            criarDataLocal(dataInicio);


        data.setDate(
            data.getDate() + dias
        );


        document.getElementById(
            "dataFimAluguel"
        ).value =
            formatarDataInput(data);

    }


    if (produto) {

        const quantidade =
            Number(
                document.getElementById(
                    "quantidadeAluguel"
                ).value
            ) || 0;


        const total =
            produto.diaria *
            dias *
            quantidade;


        document.getElementById(
            "totalAluguel"
        ).textContent =
            formatarMoeda(total);

    } else {

        document.getElementById(
            "totalAluguel"
        ).textContent =
            "R$ 0,00";

    }

}



/* ==========================================================
   FINALIZAR ALUGUEL
========================================================== */

function finalizarAluguel() {

    const cliente =
        document
            .getElementById("clienteAluguel")
            .value
            .trim();


    const cpf =
        document
            .getElementById("cpfAluguel")
            .value
            .trim();


    const telefone =
        document
            .getElementById("telefoneAluguel")
            .value
            .trim();


    const endereco =
        document
            .getElementById("enderecoAluguel")
            .value
            .trim();


    const produtoId =
        Number(
            document
                .getElementById("produtoAluguel")
                .value
        );


    const quantidade =
        Number(
            document
                .getElementById("quantidadeAluguel")
                .value
        );


    const dataInicio =
        document
            .getElementById("dataInicioAluguel")
            .value;


    const dias =
        Number(
            document
                .getElementById("diasAluguel")
                .value
        );


    if (!cliente) {

        alert(
            "Informe o nome do cliente."
        );

        return;
    }


    if (!cpf) {

        alert(
            "Informe o CPF."
        );

        return;
    }


    if (!produtoId) {

        alert(
            "Selecione o produto."
        );

        return;
    }


    if (!quantidade || quantidade <= 0) {

        alert(
            "Informe uma quantidade válida."
        );

        return;
    }


    if (!dataInicio || !dias || dias <= 0) {

        alert(
            "Informe o período do aluguel."
        );

        return;
    }


    const produto =
        produtosAluguel.find(
            item => item.id === produtoId
        );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;
    }


    if (produto.quantidade < quantidade) {

        alert(
            `Quantidade insuficiente.\n\nDisponível: ${produto.quantidade}`
        );

        return;
    }


    const dataFim =
        criarDataLocal(dataInicio);


    dataFim.setDate(
        dataFim.getDate() + dias
    );


    const total =
        produto.diaria *
        dias *
        quantidade;


    /* BAIXA DO ESTOQUE */

    produto.quantidade -= quantidade;


    /* REGISTRA ALUGUEL */

    const aluguel = {

        id: Date.now(),

        cliente: cliente,

        cpf: cpf,

        telefone: telefone,

        endereco: endereco,

        produtoId: produto.id,

        produto: produto.nome,

        codigo: produto.codigo,

        quantidade: quantidade,

        diaria: produto.diaria,

        dias: dias,

        total: total,

        dataInicio: dataInicio,

        dataFim: formatarDataInput(dataFim),

        status: "ativo",

        criadoEm: new Date().toISOString()

    };


    alugueis.push(aluguel);

    salvarDados();

    limparAluguel();

    atualizarTudo();

    abrirSubAbaAluguelPorId("pendentesAluguel");


    alert(
        "Aluguel registrado com sucesso!"
    );

}



/* ==========================================================
   LIMPAR ALUGUEL
========================================================== */

function limparAluguel() {

    document.getElementById(
        "clienteAluguel"
    ).value = "";


    document.getElementById(
        "cpfAluguel"
    ).value = "";


    document.getElementById(
        "telefoneAluguel"
    ).value = "";


    document.getElementById(
        "enderecoAluguel"
    ).value = "";


    document.getElementById(
        "produtoAluguel"
    ).value = "";


    document.getElementById(
        "quantidadeAluguel"
    ).value = 1;


    document.getElementById(
        "diariaAluguel"
    ).value = "R$ 0,00";


    document.getElementById(
        "diasAluguel"
    ).value = 7;


    document.getElementById(
        "totalAluguel"
    ).textContent = "R$ 0,00";


    definirDataAluguel();

}



/* ==========================================================
   SUB-ABAS ALUGUEL
========================================================== */

function abrirSubAbaAluguel(id, botao) {

    document.querySelectorAll(".sub-aba").forEach(
        aba => aba.classList.remove("aluguel-ativa")
    );


    const alvo =
        document.getElementById(id);


    if (alvo) {

        alvo.classList.add("aluguel-ativa");

    }


    document.querySelectorAll(".sub-btn").forEach(
        btn => btn.classList.remove("ativo")
    );


    if (botao) {

        botao.classList.add("ativo");

    }


    if (id === "estoqueAluguel") {

        mostrarEstoqueAluguel();

    }


    if (id === "novoAluguel") {

        atualizarSelectAluguel();

    }


    if (id === "pendentesAluguel") {

        mostrarAlugueis();

    }

}



function abrirSubAbaAluguelPorId(id) {

    const botoes =
        document.querySelectorAll(".sub-btn");


    if (id === "estoqueAluguel") {

        abrirSubAbaAluguel(
            id,
            botoes[0]
        );

    }


    if (id === "novoAluguel") {

        abrirSubAbaAluguel(
            id,
            botoes[1]
        );

    }


    if (id === "pendentesAluguel") {

        abrirSubAbaAluguel(
            id,
            botoes[2]
        );

    }

}



/* ==========================================================
   ALUGUÉIS ATIVOS
========================================================== */

function mostrarAlugueis() {

    const tabela =
        document.getElementById(
            "tabelaAlugueis"
        );


    tabela.innerHTML = "";


    const ativos =
        alugueis.filter(
            aluguel =>
                aluguel.status !== "devolvido"
        );


    let atrasados = 0;

    let vencendoHoje = 0;


    ativos.forEach(aluguel => {

        const status =
            verificarStatusAluguel(aluguel);


        if (status === "atrasado") {

            atrasados++;

        }


        if (status === "vencendo") {

            vencendoHoje++;

        }


        tabela.innerHTML += `

            <tr>

                <td>

                    <strong>
                        ${escaparHTML(aluguel.cliente)}
                    </strong>

                    <br>

                    <small>
                        CPF: ${escaparHTML(aluguel.cpf)}
                    </small>

                </td>


                <td>

                    ${escaparHTML(aluguel.produto)}

                    <br>

                    <small>
                        Qtd: ${aluguel.quantidade}
                    </small>

                </td>


                <td>
                    ${formatarDataBR(aluguel.dataInicio)}
                </td>


                <td>
                    ${formatarDataBR(aluguel.dataFim)}
                </td>


                <td>
                    ${formatarMoeda(aluguel.total)}
                </td>


                <td>
                    ${criarStatusAluguel(status)}
                </td>


                <td>

                    <button
                        class="btn btn-pequeno btn-sucesso"
                        onclick="devolverAluguel(${aluguel.id})"
                    >
                        Devolver
                    </button>

                    <button
                        class="btn btn-pequeno btn-aviso"
                        onclick="renovarAluguel(${aluguel.id})"
                    >
                        Renovar
                    </button>

                </td>

            </tr>

        `;

    });


    document.getElementById(
        "totalAlugueisAtivos"
    ).textContent =
        ativos.length;


    document.getElementById(
        "totalAlugueisHoje"
    ).textContent =
        vencendoHoje;


    document.getElementById(
        "totalAlugueisAtrasados"
    ).textContent =
        atrasados;


    const alerta =
        document.getElementById(
            "alertaAlugueis"
        );


    if (atrasados > 0) {

        alerta.classList.remove("oculto");

        alerta.innerHTML =
            `🚨 Atenção: existem <strong>${atrasados}</strong> aluguel(is) atrasado(s). Verifique os clientes abaixo.`;

    } else {

        alerta.classList.add("oculto");

        alerta.innerHTML = "";

    }


    if (ativos.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    Nenhum aluguel ativo no momento.
                </td>
            </tr>
        `;

    }

}



/* ==========================================================
   STATUS DO ALUGUEL
========================================================== */

function verificarStatusAluguel(aluguel) {

    if (aluguel.status === "devolvido") {

        return "devolvido";

    }


    const hoje =
        zerarHora(new Date());


    const fim =
        zerarHora(
            criarDataLocal(aluguel.dataFim)
        );


    if (hoje > fim) {

        aluguel.status = "atrasado";

        return "atrasado";

    }


    if (
        hoje.getTime() ===
        fim.getTime()
    ) {

        aluguel.status = "vencendo";

        return "vencendo";

    }


    aluguel.status = "ativo";

    return "ativo";

}



function criarStatusAluguel(status) {

    if (status === "atrasado") {

        return `
            <span class="status status-atrasado">
                🚨 ATRASADO
            </span>
        `;

    }


    if (status === "vencendo") {

        return `
            <span class="status status-vencendo">
                ⚠️ DEVOLVER HOJE
            </span>
        `;

    }


    if (status === "devolvido") {

        return `
            <span class="status status-devolvido">
                ✓ DEVOLVIDO
            </span>
        `;

    }


    return `
        <span class="status status-ativo">
            ✓ ATIVO
        </span>
    `;

}



/* ==========================================================
   DEVOLVER
========================================================== */

function devolverAluguel(id) {

    const aluguel =
        alugueis.find(
            item => item.id === id
        );


    if (!aluguel) return;


    const confirmar =
        confirm(
            `Registrar devolução?\n\n` +
            `Cliente: ${aluguel.cliente}\n` +
            `Produto: ${aluguel.produto}`
        );


    if (!confirmar) return;


    const produto =
        produtosAluguel.find(
            item =>
                item.id === aluguel.produtoId
        );


    if (produto) {

        produto.quantidade +=
            aluguel.quantidade;

    }


    aluguel.status = "devolvido";

    aluguel.dataDevolucao =
        formatarDataInput(
            new Date()
        );


    salvarDados();

    atualizarTudo();

    alert(
        "Devolução registrada e produto devolvido ao estoque."
    );

}



/* ==========================================================
   RENOVAÇÃO
========================================================== */

function renovarAluguel(id) {

    const aluguel =
        alugueis.find(
            item => item.id === id
        );


    if (!aluguel) return;


    const dias =
        prompt(
            "Quantos dias deseja renovar?",
            "7"
        );


    if (dias === null) return;


    const quantidadeDias =
        Number(dias);


    if (
        !Number.isInteger(quantidadeDias) ||
        quantidadeDias <= 0
    ) {

        alert(
            "Informe uma quantidade válida de dias."
        );

        return;
    }


    let dataBase;


    if (
        aluguel.status === "atrasado"
    ) {

        dataBase = new Date();

    } else {

        dataBase =
            criarDataLocal(
                aluguel.dataFim
            );

    }


    dataBase.setDate(
        dataBase.getDate() + quantidadeDias
    );


    aluguel.dataFim =
        formatarDataInput(dataBase);


    aluguel.dias += quantidadeDias;


    const produto =
        produtosAluguel.find(
            item =>
                item.id === aluguel.produtoId
        );


    if (produto) {

        aluguel.total +=
            produto.diaria *
            aluguel.quantidade *
            quantidadeDias;

    }


    aluguel.status = "ativo";


    salvarDados();

    atualizarTudo();


    alert(
        `Aluguel renovado por mais ${quantidadeDias} dia(s).`
    );

}



/* ==========================================================
   VERIFICAÇÃO DE ATRASOS
========================================================== */

function verificarAlugueisAtrasados() {

    let mudou = false;


    alugueis.forEach(aluguel => {

        if (
            aluguel.status !== "devolvido"
        ) {

            const antigo =
                aluguel.status;


            const novo =
                verificarStatusAluguel(aluguel);


            if (antigo !== novo) {

                mudou = true;

            }

        }

    });


    if (mudou) {

        salvarDados();

    }


    mostrarAlugueis();

}



/* ==========================================================
   ATUALIZAR TUDO
========================================================== */

function atualizarTudo() {

    atualizarSelectProdutos();

    mostrarEstoque();

    mostrarHistorico();

    mostrarEstoqueAluguel();

    atualizarSelectAluguel();

    mostrarAlugueis();

}



/* ==========================================================
   MODAL
========================================================== */

function abrirModal(conteudo) {

    document.getElementById(
        "conteudoModal"
    ).innerHTML = conteudo;


    document.getElementById(
        "modal"
    ).classList.add("aberto");

}



function fecharModal() {

    document.getElementById(
        "modal"
    ).classList.remove("aberto");

}



/* ==========================================================
   FORMATAÇÕES
========================================================== */

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



function formatarData(data) {

    return new Date(data).toLocaleDateString(
        "pt-BR"
    );

}



function formatarDataHora(data) {

    return new Date(data).toLocaleString(
        "pt-BR"
    );

}



function formatarDataInput(data) {

    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}



function formatarDataBR(data) {

    if (!data) return "";

    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}



function criarDataLocal(valor) {

    if (!valor) {

        return new Date();

    }


    const partes =
        valor.split("-");


    if (partes.length !== 3) {

        return new Date(valor);

    }


    return new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );

}



function zerarHora(data) {

    const nova =
        new Date(data);


    nova.setHours(
        0,
        0,
        0,
        0
    );


    return nova;

}



function nomeMes(mes) {

    const meses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];


    return meses[mes];

}



/* ==========================================================
   SEGURANÇA BÁSICA PARA TEXTOS
========================================================== */

function escaparHTML(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}