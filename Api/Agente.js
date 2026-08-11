import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


app.post("/api/agente", async (req, res) => {

  try {

    const datos = req.body;

    const prompt = `
Eres un asistente especializado en analizar contratos.

Analiza únicamente la información proporcionada en el contrato.

No inventes información.

Si un dato no aparece en el contrato, indica:
"No especificado en el contrato."

Tu función es ayudar al usuario a comprender el contrato
de forma clara y sencilla.


DATOS DEL CONTRATO:

Nombre del contratista:
${datos.nombre}

Tipo de documento:
${datos.tipoDocumento}

Documento:
${datos.documento}

Teléfono:
${datos.telefono}

Correo:
${datos.correo}

Tipo de contrato:
${datos.tipoContrato}

Cargo:
${datos.cargo}

Área:
${datos.area}

Fecha de inicio:
${datos.fechaInicio}

Fecha de terminación:
${datos.fechaTerminacion}

Salario o valor:
${datos.salario}

Forma de pago:
${datos.formaPago}

Empresa:
${datos.empresa}

NIT:
${datos.nit}

Representante legal:
${datos.representante}

Objeto del contrato:
${datos.objetoContrato}

Obligaciones:
${datos.obligaciones}

Observaciones:
${datos.observaciones}


PREGUNTA DEL USUARIO:

${datos.pregunta}


INSTRUCCIONES:

Responde directamente la pregunta del usuario.

Si la pregunta solicita un resumen,
presenta los puntos más importantes.

No inventes cláusulas, fechas,
valores u obligaciones que no estén
en los datos proporcionados.
`;


    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });


    res.json({
      respuesta: response.text
    });


  } catch (error) {

    console.error("Error Gemini:", error);

    res.status(500).json({
      error: "No fue posible consultar el agente."
    });

  }

});


app.listen(3000, () => {

  console.log(
    "Servidor del agente ejecutándose en http://localhost:3000"
  );

});