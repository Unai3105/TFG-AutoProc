import React from 'react';
import { Button } from 'primereact/button';

const SignupButton = () => {
    return (
        <div>
            <Button type="submit" label="Registrar" severity="success" className="p-mt-2" />
        </div>
    );
};

export default SignupButton;
