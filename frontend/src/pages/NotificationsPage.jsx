import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import NavBar from '../components/NavBar/NavBar';
import LocalFolderViewerComponent from '../components/LocalFolderViewerComponent';

const NotificationsPage = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="p-grid p-nogutter">
            <NavBar />
            <div style={{ marginTop: '2rem' }}>
                <TabView activeIndex={activeIndex} onTabChange={(event) => setActiveIndex(event.index)}>
                    <TabPanel
                        header="Notificaciones recibidas"
                        leftIcon={<i className="pi pi-file-import" style={{ marginRight: '0.5rem' }} />}
                    >
                        <LocalFolderViewerComponent
                            subFolder="Notificaciones recibidas"
                        />
                    </TabPanel>

                    <TabPanel
                        header="Notificaciones enviadas"
                        leftIcon={<i className="pi pi-file-check" style={{ marginRight: '0.5rem' }} />}
                    >
                        <LocalFolderViewerComponent
                            subFolder="Notificaciones enviadas"
                        />
                    </TabPanel>

                    <TabPanel
                        header="Notificaciones sin enviar"
                        leftIcon={<i className="pi pi-file-excel" style={{ marginRight: '0.5rem' }} />}
                    >
                        <LocalFolderViewerComponent
                            subFolder="Notificaciones sin enviar"
                        />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default NotificationsPage;