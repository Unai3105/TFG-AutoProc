import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = ({ onSuccess, onFailure }) => {
    return (
        <GoogleOAuthProvider clientId="410887368709-mj8kiu822fl6hts6gcnim2eg040eu0j4.apps.googleusercontent.com">
            <div className="p-d-flex p-flex-column p-align-center">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                    className="p-mb-3"
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginComponent;
