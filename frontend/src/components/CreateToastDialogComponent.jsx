const CreateToastDialogComponent = (message, onDetailsClick) => {
    return (
        <div>
            <span>{message}</span>
            <a
                href="#"
                onClick={onDetailsClick}
                style={{ textDecoration: 'none', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <i className="pi pi-pen-to-square" style={{ marginRight: '7px' }}></i> Ver más detalles
            </a>
        </div>
    )
}

export default CreateToastDialogComponent;