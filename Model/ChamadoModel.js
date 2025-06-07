import mongoose from 'mongoose';

const chamdoSchema = new mongoose.Schema({
    nome: { type: String, required: true, },
    descricao: { type: String, required: true, },
    numero: { type: Number, required: true, },
    status: { type: String, required: true, },
}, { timestamps: true });

const Chamado = mongoose.model('Chamado', chamdoSchema);

export default Chamado;
