import mongoose from 'mongoose';

export default class Database {
    static instance;

    constructor() {
        const uri = 'mongodb://mongo:340b099cd0bf23c5ccbb@100.42.187.253:9090/?tls=false';
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
