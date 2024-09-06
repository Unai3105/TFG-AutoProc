import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const CourtsMapComponent = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [selectedJuzgado, setSelectedJuzgado] = useState(null);
    const [directions, setDirections] = useState(null);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);

    const mapStyles = {
        height: "420px",
        width: "90%"
    };

    // Definir defaultCenter como el centro aproximado del País Vasco
    const defaultCenter = {
        lat: 43.200,
        lng: -2.500
    };

    // Ajustar el zoom para abarcar todo el País Vasco
    const defaultZoom = 9;

    const juzgados = [
        // Álava
        {
            lat: 42.844228,
            lng: -2.677709,
            name: "Juzgado de Primera Instancia e Instrucción de Vitoria-Gasteiz",
            address: "Av. Gasteiz, 18, 01008 Vitoria-Gasteiz"
        },
        {
            lat: 42.844228,
            lng: -2.677709,
            name: "Juzgado de Guardia de Vitoria-Gasteiz",
            address: "Av. Gasteiz, 18, 01008 Vitoria-Gasteiz"
        },
        // Guipúzcoa
        {
            lat: 43.304745,
            lng: -1.984410,
            name: "Juzgado de Donostia-San Sebastián",
            address: "Av. de Zarautz, 8, 20018 Donostia-San Sebastián"
        },
        {
            lat: 43.338605,
            lng: -1.789332,
            name: "Juzgado de Irún",
            address: "Calle Iparralde, 43, 20304 Irún, Guipúzcoa"
        },
        {
            lat: 43.134972,
            lng: -2.074377,
            name: "Juzgado de Tolosa",
            address: "Calle Rondilla, 2, 20400 Tolosa, Guipúzcoa"
        },
        {
            lat: 43.182148,
            lng: -2.471489,
            name: "Juzgado de Eibar",
            address: "Txaltxa Zelai Kalea, 14, 20600 Eibar, Guipúzcoa"
        },
        {
            lat: 43.183674,
            lng: -2.266424,
            name: "Juzgado de Azpeitia",
            address: "Calle Urola, 43, 20730 Azpeitia, Guipúzcoa"
        },
        // Vizcaya
        {
            lat: 43.262679,
            lng: -2.924097,
            name: "Juzgado de Bilbao",
            address: "Calle Buenos Aires, 6, 48001 Bilbao, Vizcaya"
        },
        {
            lat: 43.293653,
            lng: -2.989184,
            name: "Juzgado de Barakaldo",
            address: "Calle Justicia, 1, 48901 Barakaldo, Vizcaya"
        },
        {
            lat: 43.329160,
            lng: -3.010421,
            name: "Juzgado de Getxo",
            address: "Calle Aiboa, 1, 48992 Getxo, Vizcaya"
        },
        {
            lat: 43.170847,
            lng: -2.633595,
            name: "Juzgado de Durango",
            address: "Calle Askatasun Etorbidea, 1, 48200 Durango, Vizcaya"
        },
        {
            lat: 43.316978,
            lng: -2.676947,
            name: "Juzgado de Gernika-Lumo",
            address: "Calle San Juan Ibarra, 11, 48300 Gernika-Lumo, Vizcaya"
        },
        {
            lat: 43.192256,
            lng: -3.197640,
            name: "Juzgado de Balmaseda",
            address: "Calle Correría, 4, 48800 Balmaseda, Vizcaya"
        },
    ];

    // Obtener la ubicación actual del dispositivo
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            error => console.error(error),
            { enableHighAccuracy: true }
        );
    }, []);

    // Función para calcular y mostrar la ruta
    const calculateRoute = useCallback((destination) => {
        if (currentPosition) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: currentPosition,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`Error en el cálculo de la ruta: ${status}`);
                    }
                }
            );
        }
    }, [currentPosition]);

    // Manejar el clic en un juzgado
    const handleMarkerClick = (juzgado) => {
        setSelectedJuzgado(juzgado);
        setInfoWindowOpen(true);
        calculateRoute({ lat: juzgado.lat, lng: juzgado.lng });
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={defaultZoom}
                center={currentPosition || defaultCenter}
            >
                {currentPosition && (
                    <Marker
                        position={currentPosition}
                        icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        label="Tú estás aquí"
                    />
                )}

                {juzgados.map((juzgado, index) => (
                    <Marker
                        key={index}
                        position={{ lat: juzgado.lat, lng: juzgado.lng }}
                        onClick={() => handleMarkerClick(juzgado)}
                    />
                ))}

                {selectedJuzgado && infoWindowOpen && (
                    <InfoWindow
                        position={{ lat: selectedJuzgado.lat, lng: selectedJuzgado.lng }}
                        onCloseClick={() => setInfoWindowOpen(false)}
                    >
                        <div>
                            <h4>{selectedJuzgado.name}</h4>
                            <p>Haz clic para ver la ruta desde tu ubicación actual.</p>
                        </div>
                    </InfoWindow>
                )}

                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default CourtsMapComponent;
