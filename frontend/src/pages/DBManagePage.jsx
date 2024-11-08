import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import NavBar from '../components/NavBar/NavBar';
import EditableDataTableComponent from '../components/DBManageComponents/EditableDataTableComponent';

const DBManagePage = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <NavBar />
            <div style={{
                position: 'absolute', // Fija el contenedor
                top: 75, // Deja espacio debajo del NavBar
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
                minWidth: '900px', // Establece el ancho mínimo
                maxWidth: '100%', // Establece el ancho máximo
                overflowY: 'auto'
            }}>
                <TabView activeIndex={activeIndex} onTabChange={(event) => setActiveIndex(event.index)}>
                    <TabPanel
                        header="Base de datos de Abogados"
                        leftIcon={<i className="pi pi-users" style={{ marginRight: '0.5rem' }} />}
                    >
                        <EditableDataTableComponent path="lawyers" />
                    </TabPanel>
                    <TabPanel
                        header="Base de datos de Casos"
                        leftIcon={<i className="pi pi-briefcase" style={{ marginRight: '0.5rem' }} />}
                    >
                        <EditableDataTableComponent path="cases" />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default DBManagePage;
