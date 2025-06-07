import mongoose from 'mongoose';

export default class Database {
    static instance;

    constructor() {
        const uri = 'mongodb://localhost:27017/chatbot';
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.connection = mongoose.connection;

        this.connection.on('connected', () => {
            console.log('✅ MongoDB conectado com sucesso!');
        });

        this.connection.on('error', (err) => {
            console.error('❌ Erro na conexão com o MongoDB:', err);
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
