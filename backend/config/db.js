import mongoose from "mongoose"
// import 'dotenv/config'
const conectarDB = async () => {
    try {
        const connection =await mongoose.connect('mongodb+srv://cursos_complementarios:root@cursoscomplentarios.qxim8nn.mongodb.net/');
            // useNewUrlParser : true,
            // useUnifiestopology:true
        
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongDB conectado en : ${url}`)
    } catch (error) {
        console.log(`error: ${error.message}`)
        // console.log(12)
        process.exit(1);
    }
}

export default conectarDB;