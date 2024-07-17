import { Fragment, useState, useRef, useEffect } from "react";
import uuid4 from 'uuid4';
import ContactoItem from "./ContactoItem";

const ContactDirectory = () => {
  const KEY = 'contactos';
  const CONTACTOS_POR_PAGINA = 8;

  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [alertaColor, setAlertaColor] = useState(null);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [contactoEditando, setContactoEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const storedContactos = JSON.parse(localStorage.getItem(KEY)) || [];
    setContactos(storedContactos);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(contactos));
  }, [contactos]);

  const nombreRef = useRef();
  const emailRef = useRef();
  const telefonoRef = useRef();

  const validarNombre = (nombre) => {
    const nombreCaracteres = /^[A-Za-z\s]+$/;
    return nombreCaracteres.test(nombre);
  };

  const validarEmail = (email) => {
    const mailCaracteres = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return mailCaracteres.test(String(email).toLowerCase());
  };

  const validarTelefono = (telefono) => {
    const telefCaracteres = /^\d{9}$/;
    return telefCaracteres.test(String(telefono));
  };

  const limpiarAlertas = () => {
    setAlertaColor(null);
    setAlertaMensaje('');
  };

  const agregarContacto = () => {
    const nombreContacto = nombreRef.current.value.trim();
    const emailContacto = emailRef.current.value.trim();
    const telefonoContacto = telefonoRef.current.value.trim();

    let camposFaltantes = 0;
    let camposInvalidos = 0;

    // Validación de campos
    if (nombreContacto === '') {
      camposFaltantes++;
    } else if (!validarNombre(nombreContacto)) {
      camposInvalidos++;
    }

    if (emailContacto === '') {
      camposFaltantes++;
    } else if (!validarEmail(emailContacto)) {
      camposInvalidos++;
    }

    if (telefonoContacto === '') {
      camposFaltantes++;
    } else if (!validarTelefono(telefonoContacto)) {
      camposInvalidos++;
    }

    // Mostrar alerta según la cantidad de campos faltantes
    if (camposFaltantes === 0 && camposInvalidos === 0) {
      if (contactoEditando) {
        // Editar contacto existente
        const contactosActualizados = contactos.map(contacto => {
          if (contacto.id === contactoEditando.id) {
            return {
              ...contacto,
              Nombre: nombreContacto,
              Email: emailContacto,
              Telefono: telefonoContacto
            };
          }
          return contacto;
        });
        setContactos(contactosActualizados);
        limpiarAlertas();
        setAlertaColor("alert-success");
        setAlertaMensaje("Contacto editado correctamente.");
        setTimeout(() => limpiarAlertas(), 2000);
        limpiarCampos();
        setContactoEditando(null); 
      } else {
        // Agregar nuevo contacto
        const nuevoContacto = {
          id: uuid4(),
          Nombre: nombreContacto,
          Email: emailContacto,
          Telefono: telefonoContacto
        };
        const contactosActualizados = [...contactos, nuevoContacto];
        setContactos(contactosActualizados);
        limpiarAlertas();
        setAlertaColor("alert-success");
        setAlertaMensaje("Contacto agregado correctamente.");
        setTimeout(() => limpiarAlertas(), 2000);
        limpiarCampos();
      }
    } else if (camposFaltantes > 0) {
      setAlertaColor("alert-warning");
      setAlertaMensaje("Por favor completa todos los campos.");
    } else if (camposInvalidos > 0) {
      setAlertaColor("alert-danger");
      setAlertaMensaje("Por favor introduce valores válidos.");
    }
  };

  const eliminarContacto = (id) => {
    const nuevosContactos = contactos.filter(contacto => contacto.id !== id);
    setContactos(nuevosContactos);
    limpiarAlertas();
    setAlertaColor("alert-success");
    setAlertaMensaje("Contacto eliminado correctamente.");
    setTimeout(() => limpiarAlertas(), 2000);
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase().trim());
  };

  const cargarContacto = (contacto) => {
    setContactoEditando(contacto);
    nombreRef.current.value = contacto.Nombre;
    emailRef.current.value = contacto.Email;
    telefonoRef.current.value = contacto.Telefono;
  };

  const limpiarCampos = () => {
    nombreRef.current.value = '';
    emailRef.current.value = '';
    telefonoRef.current.value = '';
  };

  // Ordenar contactos por nombre antes de la paginación y el filtrado
  const contactosOrdenados = contactos.sort((a, b) => a.Nombre.localeCompare(b.Nombre, 'es', { sensitivity: 'base' }));

  // Paginación
  const indiceUltimoContacto = paginaActual * CONTACTOS_POR_PAGINA;
  const indicePrimerContacto = indiceUltimoContacto - CONTACTOS_POR_PAGINA;
  const contactosFiltrados = contactosOrdenados.filter(contacto =>
    contacto.Nombre.toLowerCase().includes(busqueda) ||
    contacto.Email.toLowerCase().includes(busqueda) ||
    contacto.Telefono.includes(busqueda)
  );
  const contactosPaginados = contactosFiltrados.slice(indicePrimerContacto, indiceUltimoContacto);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <Fragment>
      <div className="container" style={{ backgroundColor: '#D1CFDD', color: '#566572', paddingTop: '20px' }}>
        <h1 className="display-5 my-4 fw-bold">Lista de Contactos ☎</h1>

        <div className="mb-3">
          <label className="form-label fw-bold">Nombre👩🏻👨🏻</label>
          <input type="text" className="form-control" id="nombre" ref={nombreRef} onChange={() => {}} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Correo Electrónico ✉</label>
          <input type="email" className="form-control" id="email" ref={emailRef} onChange={() => {}} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Número de Teléfono📱</label>
          <input type="tel" className="form-control" id="telefono" ref={telefonoRef} onChange={() => {}} />
        </div>

        {alertaColor && (
          <div className={`alert ${alertaColor} alert-dismissible fade show mt-3`} role="alert">
            <span>{alertaMensaje}</span>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        <div className="mb-3">
          <button className="btn btn-primary" onClick={agregarContacto} style={{ backgroundColor: '#6D8FBD', borderColor: '#6D8FBD' }}>
            {contactoEditando ? 'Guardar Cambios' : 'Agregar Contacto'}
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label mt-4 fw-bold">Buscar Contacto</label>
          <input type="text" className="form-control" id="busqueda" value={busqueda} onChange={manejarBusqueda} />
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {contactosPaginados.map(contacto => (
            <div key={contacto.id} className="col">
              <ContactoItem
                contacto={contacto}
                onDelete={eliminarContacto}
                onEdit={() => cargarContacto(contacto)}
                cardColor="#72766D"
                textColor="#566572"
              />
            </div>
          ))}
        </div>

        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(contactosFiltrados.length / CONTACTOS_POR_PAGINA) }, (_, index) => (
              <li key={index} className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => cambiarPagina(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default ContactDirectory;












