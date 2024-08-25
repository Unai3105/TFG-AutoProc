import React, { useState  } from 'react';
import NavBar from '../components/NavBar/NavBar';
import ProfileSettingsComponent from '../components/ProfileSettingsComponent';

const ProfileSettingsPage = () => {

    const [localPath, setLocalPath] = useState('');

    // Función para manejar el cambio de localPath
    const handleLocalPathChange = (newLocalPath) => {
        console.log('ProfileSettingsPage')
        setLocalPath(newLocalPath); // Actualiza el estado del localPath
    };

    return (
        <div className="p-grid p-nogutter">
            <div className="p-col-12">
                <NavBar localPath={localPath} />
                <ProfileSettingsComponent avatarUrl='' onLocalPathChange={handleLocalPathChange} />
            </div>
        </div>
    );
};

export default ProfileSettingsPage;