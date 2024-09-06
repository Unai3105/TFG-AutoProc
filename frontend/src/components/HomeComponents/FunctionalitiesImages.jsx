import React from 'react';
import { Image } from 'primereact/image';

const FunctionalitiesImages = () => {
    return (
        <div style={{ marginTop: '75px', textAlign: 'center' }}>
            <h2>Explora Nuestras Funcionalidades</h2>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6em', color: '#555' }}>
                Echa un vistazo a algunas de las características clave de AutoProc.
            </p>

            {/* Fila 1 con dos imágenes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <Image src="DBManagement.png" width="500" height='230' preview />
                <Image src="automaticEmails.png" width="500" height='230' preview />
            </div>

            {/* Fila 2 con dos imágenes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <Image src="manualEmail.png" width="500" height='385' preview />
                <Image src="Profile.png" width="500" height='385' preview />
            </div>

            {/* Fila 3 con una imagen centrada */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image src="Notifications.png" width="500" preview />
            </div>
        </div>
    );
};

export default FunctionalitiesImages;
