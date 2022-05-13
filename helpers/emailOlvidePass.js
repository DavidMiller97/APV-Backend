import nodemailer from 'nodemailer';

const emailOlvidePass = async (datos) => {

    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const {nombre, email, token} = datos;
    //Enviar email
    const info = await transporter.sendMail({

        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Reestablece tu contraseña',
        text: 'Restablece tu contraseña',
        html: ` <p>Hola ${nombre}, has solicitado reestablecer tu contraseña.</p>
                <p>Sigue el enlace para generar una nueva contraseña:
                <a href="${process.env.FRONTEND_URL}/recuperar/${token}">Cambiar Contraseña</a></p>
                <p>Si tu no creaste la cuenta ignora el mensaje</p>`
    });
    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOlvidePass;