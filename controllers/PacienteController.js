import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {

    const paciente = new Paciente(req.body);

    paciente.veterinario_id = req.veterinario._id;
    
    try {

        const pacienteGuardado = await paciente.save();
        return res.json(pacienteGuardado);
        
    } catch (error) {
        
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {

    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario_id);

    res.json(pacientes);

}

const obtenerPaciente = async (req, res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){

        return res.status(404).json({msg: 'No encontrado'});
    }

    //Se usa el metodo toString para que se comparen como cadenas y no como objectID
    if(paciente.veterinario_id.toString() !== req.veterinario._id.toString()){

        return res.json({msg: 'Accion no valida!'});
    }

    if(paciente){

        return res.json(paciente);
    }

    
}

const actualizarPaciente = async (req, res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){

        return res.status(404).json({msg: 'No encontrado'});
    }

    //Se usa el metodo toString para que se comparen como cadenas y no como objectID
    if(paciente.veterinario_id.toString() !== req.veterinario._id.toString()){

        return res.json({msg: 'Accion no valida!'});
    }

    if(paciente){
        
        //Actualizar paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        try {

            const pacienteActualizado = await paciente.save();
            return res.json(pacienteActualizado);

        } catch (error) {

            console.log(error);
        }
    }
}

const eliminarPaciente = async (req, res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){

        return res.status(404).json({msg: 'No encontrado'});
    }

    //Se usa el metodo toString para que se comparen como cadenas y no como objectID
    if(paciente.veterinario_id.toString() !== req.veterinario._id.toString()){

        return res.json({msg: 'Accion no valida!'});
    }

    try {
        
        await paciente.deleteOne();
        return res.json({msg: 'Paciente eliminado!'});


    } catch (error) {

        console.log(error);
    }
}

export {

    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}