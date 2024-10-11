import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import NavBar from '../components/NavBar/NavBar';
import DataTableComponent from '../components/DataTableComponent';
import FileUploadComponent from '../components/FileUploadComponent';
import { useToast } from '../context/ToastProvider';

const DBUploadPage = () => {

    // Definir estados separados para cada tabla
    const [lawyersData, setLawyersData] = useState([]);
    const [casesData, setCasesData] = useState([]);

    // Obtener el valor del parámetro `tab` desde la URL
    const getPathFromURL = () => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('path');
        return tab === 'cases' ? 1 : 0;
    };

    const [activeIndex, setActiveIndex] = useState(getPathFromURL()); // Estado para la pestaña activa

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast } = useToast();

    // Efecto para reiniciar los datos cuando cambia la pestaña activa
    useEffect(() => {
        if (activeIndex === 0) {
            setCasesData([]); // Reinicia los datos de la segunda pestaña
        } else if (activeIndex === 1) {
            setLawyersData([]); // Reinicia los datos de la primera pestaña
        }
    }, [activeIndex]);

    // Función que maneja la carga de archivos para Lawyers
    const uploadLawyersFile = (loadedData) => {
        try {
            setLawyersData(loadedData);
        } catch (error) {
            const errorMsg = 'Error al cargar los datos de abogados.';
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: errorMsg,
            });
            console.log(errorMsg);
        }
    };

    // Función que maneja la carga de archivos para casos
    const uploadCasesFile = (loadedData) => {
        try {
            setCasesData(loadedData);
        } catch (error) {
            const errorMsg = 'Error al cargar los datos de casos.';
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: errorMsg,
            });
            console.log(errorMsg);
        }
    };

    return (
        <div>
            <NavBar />
            <div style={{
                position: 'fixed', // Fija el contenedor
                top: 75, // Deja espacio debajo del NavBar
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
                width: '945px', // Establece el ancho del componente
            }}>
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
        </div>
    );
};

export default DBUploadPage;