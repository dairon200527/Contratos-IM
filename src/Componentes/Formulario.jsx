import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

import generarPDF from "../Servicios/generarPDF";
import "../Style/Formulario.css";

function Formulario() {
  const firmaRef = useRef(null);

  const limpiarFirma = () => {
    if (firmaRef.current) {
      firmaRef.current.clear();
    }
  };

  const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  const manejarGenerarPDF = (e) => {
    e.preventDefault();

    // Validar si hay firma
    if (!firmaRef.current || firmaRef.current.isEmpty()) {
      alert("Debe agregar una firma.");
      return;
    }

    const formulario = e.target;
    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());

    // Llamar al servicio para generar PDF
    generarPDF(datos, firmaRef);
  };

  return (
    <>
      <h1>Contrato</h1>

      <form onSubmit={manejarGenerarPDF}>
        <h2>Datos personales</h2>

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
            <option value="">Seleccione</option>
            <option value="Persona Natural">Persona natural</option>
            <option value="Persona Jurídica">Persona jurídica</option>
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

        <label>
          Tipo:
          <select
            name="tipoParticipante"
            required
          >
            <option value="">Seleccione</option>
            <option value="Talento">Talento</option>
            <option value="Agencia">Agencia</option>
          </select>
        </label>

        <label>
          Representante legal (si aplica agencia):
          <input
            type="text"
            name="representanteLegal"
          />
        </label>

        <label>
          Documento del representante (si aplica agencia):
          <input
            type="text"
            name="documentoRepresentante"
            inputMode="numeric"
            maxLength="15"
            onInput={soloNumeros}
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
          Cliente (@cliente):
          <input
            type="text"
            name="cliente"
            placeholder="@marca"
            required
          />
        </label>

        <label>
          Duración de campaña:
          <input
            type="text"
            name="duracionCampana"
            placeholder="Ej: 3 meses"
            required
          />
        </label>

        <label>
          Cantidad de Reels:
          <input
            type="number"
            name="cantidadReels"
            min="0"
            defaultValue="0"
            required
          />
        </label>

        <label>
          Cantidad de TikToks:
          <input
            type="number"
            name="cantidadTikToks"
            min="0"
            defaultValue="0"
            required
          />
        </label>

        <label>
          Cantidad de Posts/Carruseles:
          <input
            type="number"
            name="cantidadPosts"
            min="0"
            defaultValue="0"
            required
          />
        </label>

        <label>
          Cantidad de Historias:
          <input
            type="number"
            name="cantidadHistorias"
            min="0"
            defaultValue="0"
            required
          />
        </label>

        <label>
          Otro formato:
          <input
            type="text"
            name="otroFormato"
          />
        </label>

        <h2>Condiciones económicas</h2>

        <label>
          Valor del contrato (en letras):
          <input
            type="text"
            name="remuneracionLetras"
            placeholder="Ej: TRES MILLONES DE PESOS M/CTE"
            required
          />
        </label>

        <label>
          Valor del contrato (en número):
          <input
            type="text"
            name="remuneracionNumero"
            placeholder="Ej: 3.000.000"
            required
            inputMode="numeric"
          />
        </label>

        <label>
          Moneda:
          <select name="moneda" required>
            <option value="COP">COP (Pesos Colombianos)</option>
            <option value="USD">USD (Dólares)</option>
            <option value="EUR">EUR (Euros)</option>
          </select>
        </label>

        <label>
          Plazo de pago (días calendario):
          <input
            type="number"
            name="plazoPago"
            min="1"
            defaultValue="45"
            required
          />
        </label>

        <h2>Condiciones contractuales</h2>

        <label>
          Meses de exclusividad posteriores al contrato:
          <input
            type="number"
            name="exclusividadMeses"
            min="0"
            defaultValue="3"
            required
          />
        </label>

        <h2>Firma del contrato</h2>

        <label>
          Ciudad de firma:
          <input
            type="text"
            name="ciudadFirma"
            defaultValue="Bogotá"
            required
          />
        </label>

        <label>
          Fecha de firma:
          <input
            type="date"
            name="fechaFirma"
            required
          />
        </label>

        <p>Firme dentro del recuadro:</p>

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

        <button type="submit">
          Generar PDF
        </button>
      </form>
    </>
  );
}

export default Formulario;