import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

import generarPDF from "../Servicios/generarPDF";

import "../Style/Formulario.css";

function Formulario() {

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

  return (
    <>

      <h1>Contrato</h1>

      <form>

        <h2>Datos del creador</h2>

        <label>
          Nombre y apellidos:

          <input
            type="text"
            name="nombreCompleto"
            required
          />

        </label>

        <label>
          Documento de identidad:

          <input
            type="text"
            name="documentoIdentidad"
            required
            inputMode="numeric"
            maxLength="15"
            onInput={soloNumeros}
          />

        </label>

        <label>
          Persona natural o jurídica:

          <select
            name="tipoPersona"
            required
          >

            <option value="">
              Seleccione
            </option>

            <option value="Persona Natural">
              Persona natural
            </option>

            <option value="Persona Jurídica">
              Persona jurídica
            </option>

          </select>

        </label>

        <label>
          Cuenta de Instagram o TikTok:

          <input
            type="text"
            name="redSocial"
            required
          />

        </label>



        <h2>Información de la campaña</h2>

        <label>
          Campaña:

          <input
            type="text"
            name="campana"
            required
          />

        </label>

        <label>
          Marca de la campaña:

          <input
            type="text"
            name="marcaCampana"
            required
          />

        </label>

        <label>
          Acciones negociadas:

          <textarea
            name="accionesNegociadas"
            required
          ></textarea>

        </label>

        <label>
          Plazo de pago:

          <input
            type="text"
            name="plazoPago"
            required
          />

        </label>

        <label>
          Moneda:

          <select
            name="moneda"
            required
          >

            <option value="">
              Seleccione
            </option>

            <option value="COP">
              COP
            </option>

            <option value="USD">
              USD
            </option>

            <option value="EUR">
              EUR
            </option>

          </select>

        </label>

        <label>
          Duración de campaña:

          <input
            type="text"
            name="duracionCampana"
            required
          />

        </label>

        <label>
          Tipo:

          <select
            name="tipoParticipante"
            required
          >

            <option value="">
              Seleccione
            </option>

            <option value="Talento">
              Talento
            </option>

            <option value="Agencia">
              Agencia
            </option>

          </select>

        </label>

        <label>
          Representante legal:

          <input
            type="text"
            name="representanteLegal"
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

      </form>

    </>
  );
}

export default Formulario;