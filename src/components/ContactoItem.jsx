import  { Fragment, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";

const ContactoItem = (props) => {
  const { contacto, onDelete, onEdit } = props;
  const [editando, setEditando] = useState(false);
  const [contactoEditado, setContactoEditado] = useState(contacto);
  const nombreRef = useRef(contacto.Nombre);
  const emailRef = useRef(contacto.Email);
  const telefonoRef = useRef(contacto.Telefono);
  const [showModal, setShowModal] = useState(false);

  const handleEliminarContacto = () => {
    setShowModal(true);
  };

  const confirmarEliminarContacto = () => {
    onDelete(contacto.id);
    setShowModal(false);
  };

  const handleEditarContacto = () => {
    setEditando(true);
    setContactoEditado(contacto);
  };

  const handleGuardarCambios = () => {
    const nombreEditado = nombreRef.current.value.trim();
    const emailEditado = emailRef.current.value.trim();
    const telefonoEditado = telefonoRef.current.value.trim();

    if (nombreEditado !== "" && emailEditado !== "" && telefonoEditado !== "") {
      setContactoEditado({
        ...contactoEditado,
        Nombre: nombreEditado,
        Email: emailEditado,
        Telefono: telefonoEditado,
      });

      onEdit(contactoEditado);
      setEditando(false);
    } else {
      alert("Por favor completa todos los campos.");
    }
  };

  const handleCancelarEdicion = () => {
    setEditando(false);
  };

  return (
    <Fragment>
      <li className="card mb-3" style={{ backgroundColor: '#2A2133', color: '#EAE5E6' }}>
        <div className="card-body">
          {editando ? (
            <Fragment>
              <input
                type="text"
                className="form-control mb-2"
                defaultValue={contactoEditado.Nombre}
                ref={nombreRef}
                style={{ backgroundColor: '#EAE5E6', color: '#2A2133' }}
              />
              <input
                type="email"
                className="form-control mb-2"
                defaultValue={contactoEditado.Email}
                ref={emailRef}
                style={{ backgroundColor: '#EAE5E6', color: '#2A2133' }}
              />
              <input
                type="tel"
                className="form-control mb-2"
                defaultValue={contactoEditado.Telefono}
                ref={telefonoRef}
                style={{ backgroundColor: '#EAE5E6', color: '#2A2133' }}
              />
              <div className="d-flex justify-content-end">
                <button className="btn btn-success me-2" onClick={handleGuardarCambios} style={{ backgroundColor: '#5cb85c', borderColor: '#5cb85c' }}>
                  Guardar
                </button>
                <button className="btn btn-secondary" onClick={handleCancelarEdicion} style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}>
                  Cancelar
                </button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <h5 className="card-title">{contactoEditado.Nombre}</h5>
              <p className="card-text mb-1">{contactoEditado.Email}</p>
              <p className="card-text">{contactoEditado.Telefono}</p>
              <div className="d-flex justify-content-end">
                <button className="btn btn-danger me-2" onClick={handleEliminarContacto} style={{ backgroundColor: '#9E8759', borderColor: '#9E8759' }}>
                  Eliminar
                </button>
                <button className="btn btn-primary" onClick={handleEditarContacto} style={{ backgroundColor: '#4f9699', borderColor: '#4f9699' }}>
                  Editar
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </li>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar el contacto <strong>{contactoEditado.Nombre}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminarContacto}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default ContactoItem;



