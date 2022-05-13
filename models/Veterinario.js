import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({

    nombre: {

        type: String,
        required: true,
        trim: true
    },
    password: {

        type: String,
        required: true,

    },
    email: {

        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {

        type: String,
        default: null,
        trim: true
    },
    web:{

        type: String,
        default: null,

    },
    token: {

        type: String,
        default: generarId()
    },
    confirmado: {

        type: Boolean,
        default: false
    }
    
});

/* ------------Middleware antes de almacenarlo--------------------
Aqui se utiliza function porque se utilizara this
en function this hace referencia al objeto y en un arrow function
hace referencia a la ventana global, es por eso que se usa function
*/
veterinarioSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        //Para que se vaya al siguiente middleware y no lo vuelva a hashear
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPass = async function(passForm){

    return await bcrypt.compare(passForm, this.password);

}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;