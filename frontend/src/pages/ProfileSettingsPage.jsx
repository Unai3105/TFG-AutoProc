import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import ProfileSettingsComponent from '../components/ProfileSettingsComponents/ProfileSettingsComponent';

const ProfileSettingsPage = () => {

    const [localPath, setLocalPath] = useState('');

    // Función para manejar el cambio de localPath
    const handleLocalPathChange = (newLocalPath) => {
        console.log('ProfileSettingsPage')
        setLocalPath(newLocalPath);
    };

    return (
        <div>
            <NavBar localPath={localPath} />
            <ProfileSettingsComponent onLocalPathChange={handleLocalPathChange} />
        </div>
    );
};

export default ProfileSettingsPage;