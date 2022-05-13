import express from 'express';
import {registrar, perfil, confirmar, autenticar, recuperarPass, nuevoPass, comprobarToken, actualizarPerfil, actualizarPass} from '../controllers/VeterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//Area publica
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/recoverPassword', recuperarPass);
//Otra manera para no repetir la ruta para dos metodos
router.route('/recoverPassword/:token').get(comprobarToken).post(nuevoPass);

//Area Privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-pass', checkAuth, actualizarPass);

export default router;
