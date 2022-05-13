import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

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
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: ` <p>Hola ${nombre}, compureba tu cuenta en APV.</p>
                <p>Tu cuenta ya esta lista solo debes de confirmarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
                <p>Si tu no creaste la cuenta ignora el mensaje</p>`
    });
    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailRegistro;