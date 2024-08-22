import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import NavBar from '../components/NavBar/NavBar';
import DataTableComponent from '../components/DataTableComponent';
import FileUploadComponent from '../components/FileUploadComponent';

const DBUploadPage = () => {
    
    // Definir estados separados para cada tabla
    const [lawyersData, setLawyersData] = useState([]);
    const [casesData, setCasesData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // Estado para la pestaña activa

    // Hook para el Toast
    const toast = useRef(null);

    // Función que maneja la carga de archivos para Lawyers
    const uploadLawyersFile = (loadedData) => {
        try {
            setLawyersData(loadedData);
        } catch (error) {
            const errorMsg = 'Error al cargar los datos de abogados.';
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMsg,
            });
            console.log(errorMsg);
        }
    };

    // Efecto para reiniciar los datos cuando cambia la pestaña activa
    useEffect(() => {
        if (activeIndex === 0) {
            setCasesData([]); // Reinicia los datos de la segunda pestaña
        } else if (activeIndex === 1) {
            setLawyersData([]); // Reinicia los datos de la primera pestaña
        }
    }, [activeIndex]);

    // Función que maneja la carga de archivos para casos
    const uploadCasesFile = (loadedData) => {
        try {
            setCasesData(loadedData);
        } catch (error) {
            const errorMsg = 'Error al cargar los datos de casos.';
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMsg,
            });
            console.log(errorMsg);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <NavBar />
            <h1>Gestión de Bases de Datos</h1>
            <Toast ref={toast} />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel
                    header="Base de datos de Abogados"
                    leftIcon={<i className="pi pi-users" style={{ marginRight: '0.5rem' }} />}
                >
                    <FileUploadComponent
                        onFileLoad={uploadLawyersFile}
                        uploadPath="lawyers"
                    />
                    {lawyersData && lawyersData.length > 0 && <DataTableComponent data={lawyersData} />}
                </TabPanel>
                <TabPanel
                    header="Base de datos de Casos"
                    leftIcon={<i className="pi pi-briefcase" style={{ marginRight: '0.5rem' }} />}
                >
                    <FileUploadComponent
                        onFileLoad={uploadCasesFile}
                        uploadPath="cases"
                    />
                    {casesData && casesData.length > 0 && <DataTableComponent data={casesData} />}
                </TabPanel>
            </TabView>
        </div>
    );
};

export default DBUploadPage;