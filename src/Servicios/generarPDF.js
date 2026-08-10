import jsPDF from "jspdf";

const generarPDF = (datos, firmaRef) => {

  const pdf = new jsPDF();

  const margen = 20;
  const margenInferior = 22; // espacio reservado para el pie de página
  const anchoPagina = pdf.internal.pageSize.getWidth();
  const altoPagina = pdf.internal.pageSize.getHeight();
  const alturaUtil = altoPagina - margenInferior;


  // =========================
  // FUNCIONES AUXILIARES
  // =========================

  // NUEVO: si lo que sigue no cabe antes del pie de página, salta de página.
  const saltoSiNecesario = (y, alturaNecesaria = 20) => {
    if (y + alturaNecesaria > alturaUtil) {
      pdf.addPage();
      return margen;
    }
    return y;
  };

  const tituloSeccion = (titulo, y) => {

    // Antes de dibujar el título, garantiza espacio para el título
    // + al menos una fila de contenido debajo (evita títulos huérfanos).
    y = saltoSiNecesario(y, 25);

    pdf.setFillColor(40, 40, 40);

    pdf.roundedRect(
      margen,
      y,
      anchoPagina - margen * 2,
      9,
      2,
      2,
      "F"
    );

    pdf.setTextColor(255, 255, 255);

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      titulo,
      margen + 5,
      y + 6
    );

    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");

    return y + 16;
  };


  const texto = (
    label,
    valor,
    x,
    y,
    ancho = 80
  ) => {

    pdf.setFontSize(9);

    pdf.setFont("helvetica", "bold");

    pdf.text(
      label,
      x,
      y
    );

    pdf.setFont("helvetica", "normal");

    const textoValor =
      valor || "No especificado";

    const lineas =
      pdf.splitTextToSize(
        textoValor,
        ancho
      );

    pdf.text(
      lineas,
      x,
      y + 5
    );

    return y + 5 + (lineas.length * 4);
  };


  const textoLargo = (
    label,
    valor,
    x,
    y
  ) => {

    pdf.setFontSize(9);

    pdf.setFont("helvetica", "bold");

    pdf.text(
      label,
      x,
      y
    );

    pdf.setFont("helvetica", "normal");

    const lineas =
      pdf.splitTextToSize(
        valor || "No especificado",
        anchoPagina - margen * 2
      );

    pdf.text(
      lineas,
      x,
      y + 6
    );

    return y + 8 + (lineas.length * 4);
  };


  const piePagina = () => {

    const paginas =
      pdf.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {

      pdf.setPage(i);

      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);

      pdf.text(
        `Documento generado electrónicamente - Página ${i} de ${paginas}`,
        anchoPagina / 2,
        altoPagina - 10,
        {
          align: "center"
        }
      );

      pdf.setTextColor(0, 0, 0);
    }
  };


  // =========================
  // ENCABEZADO
  // =========================

  pdf.setFillColor(30, 30, 30);

  pdf.rect(
    0,
    0,
    anchoPagina,
    35,
    "F"
  );

  pdf.setTextColor(255, 255, 255);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);

  pdf.text(
    "FORMULARIO DE CONTRATO",
    anchoPagina / 2,
    15,
    {
      align: "center"
    }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  pdf.text(
    "Documento de información contractual",
    anchoPagina / 2,
    24,
    {
      align: "center"
    }
  );

  pdf.setTextColor(0, 0, 0);


  // =========================
  // DATOS PERSONALES
  // =========================

  let y = 50;

  y = tituloSeccion(
    "DATOS PERSONALES",
    y
  );

  // NUEVO: cada fila de dos columnas verifica espacio antes de dibujarse
  y = saltoSiNecesario(y, 18);
  texto("Nombre completo:", datos.nombre, 20, y, 75);
  texto("Documento:", `${datos.tipoDocumento} ${datos.documento}`, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Fecha de nacimiento:", datos.fechaNacimiento, 20, y, 75);
  texto("Teléfono:", datos.telefono, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Correo electrónico:", datos.correo, 20, y, 75);
  texto("Ciudad:", datos.ciudad, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Dirección:", datos.direccion, 20, y, 75);
  texto("Departamento:", datos.departamento, 110, y, 75);


  // =========================
  // DATOS DEL CONTRATO
  // =========================

  y += 25;

  y = tituloSeccion(
    "DATOS DEL CONTRATO",
    y
  );

  y = saltoSiNecesario(y, 18);
  texto("Tipo de contrato:", datos.tipoContrato, 20, y, 75);
  texto("Cargo:", datos.cargo, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Área:", datos.area, 20, y, 75);
  texto("Salario / Valor:", datos.salario, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Fecha de inicio:", datos.fechaInicio, 20, y, 75);
  texto("Fecha de terminación:", datos.fechaTerminacion, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Forma de pago:", datos.formaPago, 20, y, 75);
  texto("Horario:", datos.horario, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Lugar de trabajo:", datos.lugarTrabajo, 20, y, 160);


  // =========================
  // DATOS DE LA EMPRESA
  // =========================

  y += 25;

  y = tituloSeccion(
    "DATOS DE LA EMPRESA",
    y
  );

  y = saltoSiNecesario(y, 18);
  texto("Empresa:", datos.empresa, 20, y, 75);
  texto("NIT:", datos.nit, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Representante legal:", datos.representante, 20, y, 75);
  texto("Documento:", datos.documentoRepresentante, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Cargo representante:", datos.cargoRepresentante, 20, y, 75);
  texto("Teléfono:", datos.telefonoEmpresa, 110, y, 75);
  y += 18;

  y = saltoSiNecesario(y, 18);
  texto("Dirección:", datos.direccionEmpresa, 20, y, 75);
  texto("Correo:", datos.correoEmpresa, 110, y, 75);


  // =========================
  // INFORMACIÓN ADICIONAL
  // =========================

  pdf.addPage();

  y = 25;

  y = tituloSeccion(
    "INFORMACIÓN ADICIONAL",
    y
  );

  y = textoLargo("Objeto del contrato:", datos.objetoContrato, margen, y);
  y += 10;

  y = saltoSiNecesario(y, 20);
  y = textoLargo("Obligaciones:", datos.obligaciones, margen, y);
  y += 10;

  y = saltoSiNecesario(y, 20);
  y = textoLargo("Observaciones:", datos.observaciones, margen, y);


  // =========================
  // FECHA
  // =========================

  y += 15;
  y = saltoSiNecesario(y, 15);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);

  pdf.text("Fecha de elaboración:", margen, y);

  pdf.setFont("helvetica", "normal");

  pdf.text(
    datos.fechaElaboracion || "No especificada",
    margen + 40,
    y
  );


  // =========================
  // FIRMA
  // =========================

  y += 25;

  // El bloque de firma necesita ~70mm de alto (título + caja + margen).
  // Si no cabe, lo movemos completo a la siguiente página en vez de
  // dejarlo partido a la mitad.
  y = saltoSiNecesario(y, 70);

  y = tituloSeccion("FIRMA", y);

  pdf.setFontSize(9);
  pdf.text("Firma del contratista:", margen, y);

  y += 7;

  pdf.setDrawColor(150, 150, 150);
  pdf.rect(margen, y, 90, 45);

  if (firmaRef && !firmaRef.current.isEmpty()) {
    const imagenFirma = firmaRef.current.toDataURL("image/png");
    pdf.addImage(imagenFirma, "PNG", margen + 5, y + 5, 80, 35);
  }

  // Línea de "Firma" bajo la caja, centrada con ella (antes estaba
  // suelta a la derecha, sin ninguna caja ni etiqueta asociada).
  pdf.setDrawColor(0, 0, 0);
  pdf.line(margen, y + 52, margen + 90, y + 52);

  pdf.setFontSize(8);
  pdf.text("Firma", margen + 45, y + 58, { align: "center" });


  // =========================
  // PIE DE PÁGINA
  // =========================

  piePagina();


  // =========================
  // DESCARGAR
  // =========================

  pdf.save("contrato.pdf");
};

export default generarPDF;