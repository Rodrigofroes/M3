import { obterCardChamados } from "../DialogFlow/funcoes.js";
import ChamadoDAO from "../DAO/chamdoDAO.js";

export default class DialogFlowControl {
    async DialogFlow(req, res) {
        const dados = req.body;
        const nomeIntencao = dados.queryResult.intent.displayName;
        console.log(nomeIntencao);
        switch (nomeIntencao) {
            case "ListarChamados":
                await this.listarChamados(dados, res);
                break;
            case "CadastrarChamado":
                await this.cadastrarChamado(dados, res);
                break;
            case "BuscarChamadoPorNumero":
                await this.buscarChamadoPorNumero(dados, res);
                break;
            default:
                this.respostaGenerica(res);
        }
    }

    async listarChamados(dados, res) {
        const origem = dados?.originalDetectIntentRequest?.source;
        if (origem) {
            obterCardChamados("custom").then((cards) => {
                let respostaDF = {
                    "fulfillmentMessages": []
                };
                respostaDF.fulfillmentMessages.push({
                    "text": {
                        "text": [
                            "Olá, eu sou o bot do Help Desk, em que posso ajudar? \n"
                            + "Escolha uma opção: \n"
                            + "1 - Cadastrar chamado \n"
                            + "2 - Listar chamados \n"
                            + "3 - Buscar chamado por número \n"
                        ]
                    }
                });
                res.status(200).json(respostaDF);
            }).catch((err) => {
                this.respostaErro(res);
            });
        } else {
            obterCardChamados("messenger").then((cards) => {
                let respostaDF = {
                    "fulfillmentMessages": []
                };
                respostaDF.fulfillmentMessages.push({
                    "payload": {
                        "richContent": [[
                            {
                                "type": "description",
                                "title": "Bem vindo ao Help Desk!",
                                "text": [
                                    "Estamos muito felizes em ter você por aqui!",
                                    "Abaixo você encontra os chamados abertos. \n",
                                ]
                            },
                            ...cards,
                            {
                                "type": "description",
                                "title": "Escolha uma opção:"
                            },
                            {
                                "type": "chips",
                                "options": [
                                    { "text": "Cadastrar chamado" },
                                    { "text": "Listar chamados" }
                                ]
                            }
                        ]]
                    }
                });
                res.json(respostaDF);
            }).catch((erro) => {
                this.respostaErro(res);
            });
        }
    }


    async cadastrarChamado(dados, res) {
        try {
            const parameters = dados.queryResult.parameters;
            const novoChamado = {
                nome: parameters.nome,
                descricao: parameters.descricao,
                numero: Math.floor(Math.random() * 10000),
                status: "Aberto"
            };
            const chamadoDAO = new ChamadoDAO();
            await chamadoDAO.salvar(novoChamado);

            const respostaDF = {
                "fulfillmentMessages": [{
                    "text": {
                        "text": [
                            `Chamado #${novoChamado.numero} cadastrado com sucesso!`
                        ]
                    },
                    

                }]
            };

            res.status(200).json(respostaDF);
        } catch (error) {
            this.respostaErro(res);
        }
    }

    async buscarChamadoPorNumero(dados, res) {
        try {
            const numero = dados.queryResult.parameters.numero;
            const chamadoDAO = new ChamadoDAO();
            const chamado = await chamadoDAO.obterChamadoPorNumero(numero);

            if (chamado) {
                const respostaDF = {
                    "fulfillmentMessages": [{
                        "text": {
                            "text": [
                                `Chamado #${chamado.numero}:\nNome: ${chamado.nome}\nDescrição: ${chamado.descricao}\nStatus: ${chamado.status}`
                            ]
                        }
                    }]
                };
                res.status(200).json(respostaDF);
            } else {
                const respostaDF = {
                    "fulfillmentMessages": [{
                        "text": {
                            "text": [
                                `Chamado #${numero} não encontrado.`
                            ]
                        }
                    }]
                };
                res.status(200).json(respostaDF);
            }
        } catch (error) {
            this.respostaErro(res);
        }
    }

    respostaErro(res) {
        const respostaDF = {
            "fulfillmentMessages": [{
                "text": {
                    "text": [
                        "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde."
                    ]
                }
            }]
        };
        res.status(200).json(respostaDF);
    }

    respostaGenerica(res) {
        const respostaDF = {
            "fulfillmentMessages": [{
                "text": {
                    "text": [
                        "Desculpe, não entendi o que você deseja. Como posso ajudar?"
                    ]
                }
            }]
        };
        res.status(200).json(respostaDF);
    }
}
