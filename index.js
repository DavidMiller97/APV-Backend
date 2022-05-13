import express from "express";
import dotenv from 'dotenv';
import conectarDB from "./config/db.js";
import veterinarioRouter from "./routes/veterinarioRoutes.js";
import pacienteRouter from "./routes/pacienteRoutes.js";
import chatbotRouter from "./routes/chatbotRoutes.js";
import cors from 'cors';


const app = express();
app.use(express.json());
//Para que puede interpretar las variabls de entorno
dotenv.config();
//conectar a la DB
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2];
const corsOptions = {

    origin: '*'/*function(origin, callback) {

        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen esta permitidos 
            callback(null, true);
        }else{

            callback(new Error('No permitido por CORS'));
        }
    }*/
};
app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRouter);
app.use('/api/pacientes', pacienteRouter);
app.use('/api/messenger', chatbotRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {

    console.log('Servidor funcionando en el puerto ' + port);
});