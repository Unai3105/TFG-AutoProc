import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import NavBar from '../components/NavBar/NavBar';
import EditableDataTableComponent from '../components/EditableDataTableComponent';

const DBManagePage = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <NavBar />
            <h1>Visualización de Bases de Datos</h1>
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
    );
};

export default DBManagePage;
