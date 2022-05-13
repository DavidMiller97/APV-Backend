import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try {
            //Se obtiene el token sin el bearer
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //Se guarda el veterinario pero sin la password, token y el confirmado
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            return next();
            

        } catch (e) {
            
            const error = new Error('Token no valido!');
            return res.status(403).json({msg: error.message});
        }
    }

    if(!token){

        const error = new Error('Token no valido o inexistente!');
        res.status(403).json({msg: error.message});
    }
    
    return next();

}

export default checkAuth;