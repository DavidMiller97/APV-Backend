import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePass from "../helpers/emailOlvidePass.js";

const registrar = async (req, res) => {

    const {email, nombre} = req.body;

    //Prevenir usuarios duplicados
    const existe = await Veterinario.findOne({email: email});

    if(existe){

        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {

        //Guardar veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar Email
        emailRegistro({email, nombre, token: veterinarioGuardado.token});

        res.json(veterinarioGuardado);
        
    } catch (error) {
        
        console.log(error);
    }

    
};

const perfil = (req, res) => {

    const {veterinario} = req;
    
    res.json(veterinario);

};

const confirmar = async (req, res) => {

    //Para leer datos de la URL se utiliza req.params
    const {token} = req.params;

    try {
    
        const usuarioConfirmar = await Veterinario.findOne({token});

        if(!usuarioConfirmar){

            const error = new Error('Token no valido');
            return res.status(404).json({msg: error.message});
        }

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente!'});
        
    } catch (error) {
        
        console.log(error);
    }


}

const autenticar = async (req, res) => {

    const {email, password} = req.body;

    const usuario = await Veterinario.findOne({email});

    if(!usuario){

        const error = new Error('Usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    //Comprobar si esta confirmado o no
    if(!usuario.confirmado){

        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    //Revisar password
    if(await usuario.comprobarPass(password)){

        //Autenticar a un usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)

        });

    }else{

        const error = new Error('La contraseña es incorrecta');
        return res.status(403).json({msg: error.message});
    }

}

const recuperarPass = async (req, res) => {

    const {email} = req.body;

    const isUser = await Veterinario.findOne({email: email});

    if(!isUser) {

        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    try {

        isUser.token = generarId();
        await isUser.save();

        //Enviar email con las instrcciones.
        emailOlvidePass({

            email,
            nombre: isUser.nombre,
            token: isUser.token

        });

        res.json({msg: 'Hemos enviado un Email con las instrucciones'});
        
    } catch (error) {
        
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const isToken = await Veterinario.findOne({ token: token});

    if(isToken){

        //Token valido
        res.json({msg: 'Token valido y el usuario existe!'});

    }else{

        const error = new Error('Token no valido!');
        return res.status(403).json({msg: error.message});
    }
}

const nuevoPass = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){

        const error = new Error('Hubo un error!');
        return res.status(403).json({msg: error.message});
    }

    try {
        
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        return res.json({msg: 'Contraseña modificada correctamente!'});

    } catch (error) {
        
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){

        const error = new Error('Hubo un error!');
        return res.status(400).json({msg: error.message});
    
    }

    if(veterinario.email !== req.body.email){

        const isEmail = await Veterinario.findOne({email: req.body.email});
        if(isEmail){

            const error = new Error('Ese email ya existe!');
            return res.status(400).json({msg: error.message});
        }
    }

    try {

        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
        
    } catch (error) {
        
        console.log(error);
    }

}

const actualizarPass = async (req, res) => {

    
    const { id } = req.veterinario;
    const { pass, passNew } = req.body;

    const veterinario = await Veterinario.findById(id);

    if(!veterinario){

        const error = new Error('Hubo un error!');
        return res.status(400).json({msg: error.message});
    
    }

    if(!await veterinario.comprobarPass(pass)){

        const error = new Error('La contraseña no es correcta!');
        return res.status(400).json({msg: error.message});
    }

    veterinario.password = passNew;
    await veterinario.save();
    res.json({msg: 'Contraseña modificada correctamente!'});

}

export {

    registrar,
    perfil,
    confirmar, 
    autenticar,
    recuperarPass,
    comprobarToken,
    nuevoPass,
    actualizarPerfil,
    actualizarPass
}