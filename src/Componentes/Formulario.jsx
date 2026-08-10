
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import generarPDF from "../Servicios/generarPDF";
import "../Style/Formulario.css";

function Formulario() {

  const firmaRef = useRef(null);

  const limpiarFirma = () => {
    firmaRef.current.clear();
  };

  const manejarGenerarPDF = () => {

    const formulario = document.querySelector("form");

    const formData = new FormData(formulario);

    const datos = Object.fromEntries(
      formData.entries()
    );

    generarPDF(datos, firmaRef);
  };


  return (
    <>
      <h1>Contrato</h1>

      <form>
        <h2>Datos personales</h2>

        <label>
          Nombre completo:
          <input
            type="text"
            name="nombre"
          />
        </label>

        <label>
          Tipo de documento:
          <select name="tipoDocumento">
            <option value="">
              Seleccione
            </option>

            <option value="CC">
              Cédula de ciudadanía
            </option>

            <option value="CE">
              Cédula de extranjería
            </option>

            <option value="TI">
              Tarjeta de identidad
            </option>
          </select>
        </label>

        <label>
          Número de documento:
          <input
            type="text"
            name="documento"
          />
        </label>

        <label>
          Teléfono:
          <input
            type="tel"
            name="telefono"
          />
        </label>

        <label>
          Correo electrónico:
          <input
            type="email"
            name="correo"
          />
        </label>


        {/* DATOS DEL CONTRATO */}

        <h2>Datos del contrato</h2>

        <label>
          Tipo de contrato:

          <select name="tipoContrato">

            <option value="">
              Seleccione
            </option>

            <option value="Contrato laboral">
              Contrato laboral
            </option>

            <option value="Prestación de servicios">
              Prestación de servicios
            </option>

            <option value="Contrato de aprendizaje">
              Contrato de aprendizaje
            </option>

            

          </select>
        </label>

        <label>
          Cargo:
          <input
            type="text"
            name="cargo"
          />
        </label>

        <label>
          Área:
          <input
            type="text"
            name="area"
          />
        </label>

        <label>
          Fecha de inicio:
          <input
            type="date"
            name="fechaInicio"
          />
        </label>

        <label>
          Fecha de terminación:
          <input
            type="date"
            name="fechaTerminacion"
          />
        </label>

        <label>
          Salario / Valor del contrato:
          <input
            type="number"
            name="salario"
          />
        </label>

        <label>
          Forma de pago:

          <select name="formaPago">

            <option value="">
              Seleccione
            </option>

            <option value="Mensual">
              Mensual
            </option>

            <option value="Quincenal">
              Quincenal
            </option>

            <option value="Pago único">
              Pago único
            </option>

          </select>
        </label>

     

        {/* DATOS DE LA EMPRESA */}

        <h2>Datos de la empresa</h2>

        <label>
          Nombre de la empresa:
          <input
            type="text"
            name="empresa"
          />
        </label>

        <label>
          NIT:
          <input
            type="text"
            name="nit"
          />
        </label>

        <label>
          Representante legal:
          <input
            type="text"
            name="representante"
          />
        </label>

        <label>
          Documento del representante:
          <input
            type="text"
            name="documentoRepresentante"
          />
        </label>

        <label>
          Cargo del representante:
          <input
            type="text"
            name="cargoRepresentante"
          />
        </label>

        <label>
          Dirección de la empresa:
          <input
            type="text"
            name="direccionEmpresa"
          />
        </label>

        <label>
          Teléfono de la empresa:
          <input
            type="tel"
            name="telefonoEmpresa"
          />
        </label>

        <label>
          Correo de la empresa:
          <input
            type="email"
            name="correoEmpresa"
          />
        </label>


        {/* INFORMACIÓN ADICIONAL */}

        <h2>Información adicional</h2>

        <label>
          Objeto del contrato:

          <textarea
            name="objetoContrato"
          ></textarea>

        </label>

        <label>
          Obligaciones:

          <textarea
            name="obligaciones"
          ></textarea>

        </label>

        <label>
          Observaciones:

          <textarea
            name="observaciones"
          ></textarea>

        </label>

        <label>
          Fecha de elaboración:

          <input
            type="date"
            name="fechaElaboracion"
          />

        </label>


        {/* FIRMA */}

        <h2>Firma</h2>

        <p>
          Firme dentro del recuadro:
        </p>

        <div className="firma-container">

          <SignatureCanvas
            ref={firmaRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "firma"
            }}
          />

        </div>

        <button
          type="button"
          onClick={limpiarFirma}
        >
          Limpiar firma
        </button>


        <br />
        <br />


        {/* GENERAR PDF */}

        <button
          type="button"
          onClick={manejarGenerarPDF}
        >
          Generar PDF
        </button>

      </form>
    </>
  );
}

export default Formulario;

