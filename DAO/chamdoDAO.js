import Chamado from "../Model/ChamadoModel.js";

export default class ChamadoDAO {
    salvar(chamado) {
        try {
            return Chamado.create(chamado);
        } catch (error) {
            console.log(error);
        }
    }

    buscar(id) {
        try {
            return Chamado.findByPk(id);
        } catch (error) {
            console.log(error);
        }
    }

    buscarTodos() {
        try {
            return Chamado.find();
        } catch (error) {
            console.log(error);
        }
    }

    atualizar(chamado) {
        try {
            return Chamado.update(chamado, {
                where: { id: chamado.id }
            });
        } catch (error) {
            console.log(error);
        }
    }

    excluir(id) {
        try {
            return Chamado.destroy({
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
        }
    }
}