const CreateToastDialogComponent = (message, onDetailsClick, linkText = "Ver más detalles") => {
    return (
        <div>
            <span>{message}</span>
            <a
                href="#"
                onClick={onDetailsClick}
                style={{ textDecoration: 'none', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <i className="pi pi-pen-to-square" style={{ marginRight: '7px' }}></i> {linkText}
            </a>
        </div>
    )
}

export default CreateToastDialogComponent;