import jsPDF from "jspdf";

const generarPDF = (datos, firmaRef) => {

  const pdf = new jsPDF();

  const margen = 20;
  const margenInferior = 22;
  const anchoPagina = pdf.internal.pageSize.getWidth();
  const altoPagina = pdf.internal.pageSize.getHeight();
  const alturaUtil = altoPagina - margenInferior;

  const tituloSeccion = (titulo, y) => {

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
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      titulo,
      margen + 5,
      y + 6
    );

    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");

    return y + 15;
  };


  const texto = (
    label, valor, x, y, ancho = 80
  ) => {

    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      label,
      x,
      y
    );

    pdf.setFont("helvetica", "normal");

    const lineas = pdf.splitTextToSize(
      valor || "No especificado",
      ancho
    );

    pdf.text(
      lineas,
      x,
      y + 4
    );

    return y + 4 + (lineas.length * 3.5);
  };


  const textoLargo = (
    label, valor, x, y
  ) => {

    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      label,
      x,
      y
    );

    pdf.setFont("helvetica", "normal");

    const lineas = pdf.splitTextToSize(
      valor || "No especificado",
      anchoPagina - margen * 2
    );

    pdf.text(
      lineas,
      x,
      y + 5
    );

    return y + 7 + (lineas.length * 3.5);
  };


  const piePagina = () => {

    const paginas = pdf.getNumberOfPages();

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


  // ENCABEZADO

  pdf.setFillColor(30, 30, 30);

  pdf.rect(
    0, 0,
    anchoPagina, 35,
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


  // DATOS PERSONALES

  let y = 48;

  y = tituloSeccion(
    "DATOS PERSONALES",
    y
  );

  texto("Nombre completo:", datos.nombre, 20, y, 75);
  texto("Documento:", `${datos.tipoDocumento} ${datos.documento}`, 110, y, 75);
  y += 16;

  texto("Teléfono:", datos.telefono, 20, y, 75);
  texto("Correo electrónico:", datos.correo, 110, y, 75);
  y += 16;

  texto("Dirección:", datos.direccion, 20, y, 75);
  texto("Ciudad:", datos.ciudad, 110, y, 75);
  y += 16;

  texto("Departamento:", datos.departamento, 20, y, 75);


  // DATOS DEL CONTRATO

  y += 18;

  y = tituloSeccion(
    "DATOS DEL CONTRATO",
    y
  );

  texto("Tipo de contrato:", datos.tipoContrato, 20, y, 75);
  texto("Cargo:", datos.cargo, 110, y, 75);
  y += 16;

  texto("Área:", datos.area, 20, y, 75);
  texto("Salario / Valor:", datos.salario, 110, y, 75);
  y += 16;

  texto("Fecha de inicio:", datos.fechaInicio, 20, y, 75);
  texto("Fecha de terminación:", datos.fechaTerminacion, 110, y, 75);
  y += 16;

  texto("Forma de pago:", datos.formaPago, 20, y, 75);


  // DATOS DE LA EMPRESA

  y += 18;

  y = tituloSeccion(
    "DATOS DE LA EMPRESA",
    y
  );

  texto("Empresa:", datos.empresa, 20, y, 75);
  texto("NIT:", datos.nit, 110, y, 75);
  y += 16;

  texto("Representante legal:", datos.representante, 20, y, 75);
  texto("Documento:", datos.documentoRepresentante, 110, y, 75);
  y += 16;

  texto("Cargo representante:", datos.cargoRepresentante, 20, y, 75);
  texto("Teléfono:", datos.telefonoEmpresa, 110, y, 75);
  y += 16;

  texto("Dirección:", datos.direccionEmpresa, 20, y, 75);
  texto("Correo:", datos.correoEmpresa, 110, y, 75);


  // SEGUNDA PÁGINA

  pdf.addPage();

  y = 25;

  y = tituloSeccion(
    "INFORMACIÓN ADICIONAL",
    y
  );

  y = textoLargo(
    "Objeto del contrato:",
    datos.objetoContrato,
    margen,
    y
  );

  y += 8;

  y = textoLargo(
    "Obligaciones:",
    datos.obligaciones,
    margen,
    y
  );

  y += 8;

  y = textoLargo(
    "Observaciones:",
    datos.observaciones,
    margen,
    y
  );


  // FECHA

  y += 12;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);

  pdf.text(
    "Fecha de elaboración:",
    margen,
    y
  );

  pdf.setFont("helvetica", "normal");

  pdf.text(
    datos.fechaElaboracion || "No especificada",
    margen + 40,
    y
  );


  // FIRMA

  y += 20;

  y = tituloSeccion(
    "FIRMA",
    y
  );

  pdf.setFontSize(8.5);

  pdf.text(
    "Firma del contratista:",
    margen,
    y
  );

  y += 7;

  pdf.setDrawColor(150, 150, 150);

  pdf.rect(
    margen,
    y,
    90,
    40
  );

  if (
    firmaRef &&
    !firmaRef.current.isEmpty()
  ) {

    const imagenFirma =
      firmaRef.current.toDataURL("image/png");

    pdf.addImage(
      imagenFirma,
      "PNG",
      margen + 5,
      y + 3,
      80,
      34
    );
  }

  pdf.setDrawColor(0, 0, 0);

  pdf.line(
    margen,
    y + 47,
    margen + 90,
    y + 47
  );

  pdf.setFontSize(8);

  pdf.text(
    datos.nombre || "Contratista",
    margen + 45,
    y + 53,
    {
      align: "center"
    }
  );


  // PIE DE PÁGINA

  piePagina();


  // DESCARGAR PDF

  pdf.save("contrato.pdf");
};

export default generarPDF;

