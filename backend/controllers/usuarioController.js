import Usario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';


const registrar = async (req, res) => {

    const { email } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usario.findOne({ email });
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuario = new Usario(req.body);
        
        // Gnerar un token único para el usuario
        usuario.token = generarId();
        // Guardar el usuario en la base de datos
        await usuario.save();
        // Enviar un email de confirmación al usuario   
        res.json({ 
            msg: 'Usuario registrado correctamente, revisa tu email para confirmar tu cuenta'
        });

    } catch (error) {
        console.log(error);
    }
}
export { registrar };