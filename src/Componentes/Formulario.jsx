import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import generarPDF from "../Servicios/generarPDF";

import "../Style/Formulario.css";


function Formulario() {

  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  const firmaRef = useRef(null);


  const limpiarFirma = () => {
    firmaRef.current.clear();
  };


  const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };


  const manejarGenerarPDF = () => {

    const formulario = document.querySelector("form");

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    if (firmaRef.current.isEmpty()) {
      alert("Debe agregar una firma.");
      return;
    }

    const formData = new FormData(formulario);

    const datos = Object.fromEntries(
      formData.entries()
    );

    generarPDF(datos, firmaRef);
  };


  const consultarAgente = async () => {

    const formulario = document.querySelector("form");

    const formData = new FormData(formulario);

    const datos = Object.fromEntries(
      formData.entries()
    );


    if (!pregunta.trim()) {
      alert("Escribe una pregunta.");
      return;
    }


    try {

      setCargando(true);
      setRespuesta("");


      const response = await fetch(
        "http://localhost:3000/api/agente",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            ...datos,
            pregunta
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.error);
      }


      setRespuesta(data.respuesta);


    } catch (error) {

      console.error("Error:", error);

      setRespuesta(
        "No fue posible consultar el agente."
      );


    } finally {

      setCargando(false);

    }
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
            required
          />

        </label>


        <label>
          Tipo de documento:

          <select
            name="tipoDocumento"
            required
          >

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
            required
            inputMode="numeric"
            maxLength="15"
            onInput={soloNumeros}
          />

        </label>


        <label>
          Teléfono:

          <input
            type="tel"
            name="telefono"
            required
            inputMode="numeric"
            maxLength="10"
            onInput={soloNumeros}
          />

        </label>


        <label>
          Correo electrónico:

          <input
            type="email"
            name="correo"
            required
          />

        </label>



        <h2>Datos del contrato</h2>


        <label>
          Tipo de contrato:

          <select
            name="tipoContrato"
            required
          >

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
            required
          />

        </label>


        <label>
          Área:

          <input
            type="text"
            name="area"
            required
          />

        </label>


        <label>
          Fecha de inicio:

          <input
            type="date"
            name="fechaInicio"
            required
          />

        </label>


        <label>
          Fecha de terminación:

          <input
            type="date"
            name="fechaTerminacion"
            required
          />

        </label>


        <label>
          Salario / Valor del contrato:

          <input
            type="number"
            name="salario"
            required
            min="0"
          />

        </label>


        <label>
          Forma de pago:

          <select
            name="formaPago"
            required
          >

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



        <h2>Datos de la empresa</h2>


        <label>
          Nombre de la empresa:

          <input
            type="text"
            name="empresa"
            required
          />

        </label>


        <label>
          NIT:

          <input
            type="text"
            name="nit"
            required
            inputMode="numeric"
            maxLength="15"
            onInput={soloNumeros}
          />

        </label>


        <label>
          Representante legal:

          <input
            type="text"
            name="representante"
            required
          />

        </label>


        <label>
          Documento del representante:

          <input
            type="text"
            name="documentoRepresentante"
            required
            inputMode="numeric"
            maxLength="15"
            onInput={soloNumeros}
          />

        </label>


        <label>
          Cargo del representante:

          <input
            type="text"
            name="cargoRepresentante"
            required
          />

        </label>


        <label>
          Dirección de la empresa:

          <input
            type="text"
            name="direccionEmpresa"
            required
          />

        </label>


        <label>
          Teléfono de la empresa:

          <input
            type="tel"
            name="telefonoEmpresa"
            required
            inputMode="numeric"
            maxLength="10"
            onInput={soloNumeros}
          />

        </label>


        <label>
          Correo de la empresa:

          <input
            type="email"
            name="correoEmpresa"
            required
          />

        </label>



        <h2>Información adicional</h2>


        <label>
          Objeto del contrato:

          <textarea
            name="objetoContrato"
            required
          ></textarea>

        </label>


        <label>
          Obligaciones:

          <textarea
            name="obligaciones"
            required
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
            required
          />

        </label>



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


        <button
          type="button"
          onClick={manejarGenerarPDF}
        >
          Generar PDF
        </button>



        {/* ASISTENTE */}

        <h2>Asistente del contrato</h2>


        <textarea
          placeholder="Escribe tu pregunta sobre el contrato..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
        />


        <button
          type="button"
          onClick={consultarAgente}
          disabled={cargando}
        >

          {cargando
            ? "Consultando..."
            : "Consultar agente"
          }

        </button>


        {respuesta && (

          <div className="respuesta-agente">

            <h3>
              Respuesta
            </h3>

            <p>
              {respuesta}
            </p>

          </div>

        )}


      </form>

    </>
  );
}


export default Formulario;