import React from 'react';
import { Dialog } from 'primereact/dialog';

const EmailPasswordSetupDialog = ({ email, visible, onHide }) => {

    // Definir las Notas Importantes en una variable
    const ImportantNotes = (
        <>
            <h3>Notas Importantes:</h3>
            <ul>
                <li style={{ marginBottom: '1rem' }}>No compartas estas contraseñas con nadie más que la aplicación o dispositivo que las necesita.</li>
                <li style={{ marginBottom: '1rem' }}>Estas contraseñas son independientes de tu contraseña principal y no requieren que cambies tu contraseña habitual.</li>
            </ul>
        </>
    );

    // Función para renderizar las instrucciones de configuración de la contraseña del email
    const renderEmailInstructions = () => {

        // Si email no está definido, no se renderiza nada
        if (!email) {
            return null;
        }

        const emailDomain = email.split('@')[1];

        if (emailDomain.includes('gmail')) {
            return (
                <>
                    <h3>Pasos para Gmail:</h3>
                    <ul>
                        <li style={{ marginBottom: '1rem' }}>Activa la <a href="https://myaccount.google.com/security-checkup" target="_blank" rel="noopener noreferrer">verificación en dos pasos</a> en tu cuenta de Google, si aún no lo has hecho.</li>
                        <li style={{ marginBottom: '1rem' }}>Ve a la <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">página de Contraseñas de Aplicaciones de Google</a>.</li>
                        <li style={{ marginBottom: '1rem' }}>Inicia sesión con tu cuenta de Google y selecciona la opción "Seleccionar aplicación" en el menú desplegable.</li>
                        <li style={{ marginBottom: '1rem' }}>Elige la aplicación y el dispositivo para el que necesitas la contraseña.</li>
                        <li style={{ marginBottom: '1rem' }}>Haz clic en "Generar" para obtener una contraseña de 16 dígitos.</li>
                        <li style={{ marginBottom: '1rem' }}>Utiliza esta contraseña en lugar de tu contraseña habitual cuando configures tu cuenta en una aplicación de terceros.</li>
                    </ul>
                    {ImportantNotes}
                </>
            );
        } else if (emailDomain.includes('outlook') || emailDomain.includes('hotmail') || emailDomain.includes('live')) {
            return (
                <>
                    <h3>Pasos para Outlook:</h3>
                    <ul>
                        <li style={{ marginBottom: '1rem' }}>Activa la <a href="https://account.microsoft.com/security" target="_blank" rel="noopener noreferrer">verificación en dos pasos</a> en tu cuenta de Microsoft.</li>
                        <li style={{ marginBottom: '1rem' }}>Dirígete a las <a href="https://account.microsoft.com/security" target="_blank" rel="noopener noreferrer">Opciones de seguridad avanzadas de tu cuenta Microsoft</a>.</li>
                        <li style={{ marginBottom: '1rem' }}>Desplázate hasta la sección "Contraseñas de aplicación" y haz clic en "Crear una nueva contraseña de aplicación".</li>
                        <li style={{ marginBottom: '1rem' }}>Utiliza la contraseña generada para configurar tu correo en la aplicación correspondiente.</li>
                    </ul>
                    {ImportantNotes}
                </>
            );
        } else if (emailDomain.includes('yahoo')) {
            return (
                <>
                    <h3>Pasos para Yahoo:</h3>
                    <ul>
                        <li style={{ marginBottom: '1rem' }}>Accede a tu <a href="https://login.yahoo.com/account/security" target="_blank" rel="noopener noreferrer">página de Seguridad de la cuenta Yahoo</a>.</li>
                        <li style={{ marginBottom: '1rem' }}>Haz clic en "Generar contraseña de aplicación" o "Gestionar contraseñas de aplicaciones".</li>
                        <li style={{ marginBottom: '1rem' }}>Escribe el nombre de la aplicación para la que necesitas la contraseña y haz clic en "Generar".</li>
                        <li style={{ marginBottom: '1rem' }}>Utiliza la contraseña generada para acceder a tu cuenta de Yahoo desde la aplicación de terceros.</li>
                    </ul>
                    {ImportantNotes}
                </>
            );
        } else if (emailDomain.includes('icloud') || emailDomain.includes('me.com') || emailDomain.includes('mac.com')) {
            return (
                <>
                    <h3>Pasos para iCloud:</h3>
                    <ul>
                        <li style={{ marginBottom: '1rem' }}>Activa la <a href="https://support.apple.com/es-es/HT204915" target="_blank" rel="noopener noreferrer">autenticación de dos factores</a> en tu Apple ID.</li>
                        <li style={{ marginBottom: '1rem' }}>Visita la <a href="https://appleid.apple.com" target="_blank" rel="noopener noreferrer">página de Apple ID</a> e inicia sesión.</li>
                        <li style={{ marginBottom: '1rem' }}>En la sección Seguridad, selecciona "Generar contraseña de aplicación".</li>
                        <li style={{ marginBottom: '1rem' }}>Introduce una etiqueta para recordar por qué creaste la contraseña y haz clic en "Crear".</li>
                        <li style={{ marginBottom: '1rem' }}>Usa esta contraseña en la aplicación donde estás configurando tu correo de iCloud.</li>
                    </ul>
                    {ImportantNotes}
                </>
            );
        } else {
            return (
                <>
                    <h3>Pasos generales:</h3>
                    <ul>
                        <li style={{ marginBottom: '1rem' }}>Verifica si tu proveedor de correo ofrece la opción de generar contraseñas específicas para aplicaciones.</li>
                        <li style={{ marginBottom: '1rem' }}>Activa la autenticación en dos pasos y sigue las instrucciones de tu proveedor.</li>
                    </ul>
                    {ImportantNotes}
                </>
            );
        }
    };

    return (
        <Dialog header="Configurar contraseña del email para aplicaciones de terceros." visible={visible} onHide={onHide} style={{ width: '1000px' }}>
            {renderEmailInstructions()}
        </Dialog>
    );
};

export default EmailPasswordSetupDialog;