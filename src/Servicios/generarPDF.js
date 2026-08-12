import jsPDF from "jspdf";

const generarPDF = (datos, firmaRef) => {

  const pdf = new jsPDF("p", "mm", "a4");

  const ancho = pdf.internal.pageSize.getWidth();
  const alto = pdf.internal.pageSize.getHeight();

  const margen = 20;

  let y = 25;

  const verificarSalto = (espacio = 20) => {
    if (y + espacio > alto - 25) {
      pdf.addPage();
      y = 25;
    }
  };

  const titulo = (texto) => {

    verificarSalto(15);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    pdf.text(
      texto,
      margen,
      y
    );

    y += 8;
  };

  const parrafo = (texto) => {

    verificarSalto(25);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const lineas = pdf.splitTextToSize(
      texto,
      ancho - (margen * 2)
    );

    pdf.text(
      lineas,
      margen,
      y
    );

    y += (lineas.length * 5) + 4;
  };

  const piePagina = () => {

    const paginas = pdf.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {

      pdf.setPage(i);

      pdf.setFontSize(8);

      pdf.text(
        `Página ${i} de ${paginas}`,
        ancho / 2,
        alto - 10,
        {
          align: "center"
        }
      );
    }
  };

  // ENCABEZADO

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);

  pdf.text(
    "CONTRATO DE PRESTACIÓN DE SERVICIOS",
    ancho / 2,
    y,
    {
      align: "center"
    }
  );

  y += 15;

  parrafo(
    `Entre LOOP y ${datos.nombreCompleto}, identificado(a) con documento de identidad No. ${datos.documentoIdentidad}, actuando como ${datos.tipoPersona}, titular de la cuenta ${datos.redSocial}, se celebra el presente contrato de prestación de servicios para la ejecución de campañas publicitarias y creación de contenido digital.`
  );

  titulo("PRIMERA. OBJETO");

  parrafo(
    `El contratista participará en la campaña "${datos.campana}" correspondiente a la marca "${datos.marcaCampana}", ejecutando las acciones negociadas descritas en el presente documento.`
  );

  titulo("SEGUNDA. ACCIONES NEGOCIADAS");

  parrafo(
    datos.accionesNegociadas || "No especificadas."
  );

  titulo("TERCERA. DURACIÓN");

  parrafo(
    `La duración acordada para la campaña será de ${datos.duracionCampana}.`
  );

  titulo("CUARTA. PLAZO DE PAGO");

  parrafo(
    `El pago correspondiente será realizado dentro del plazo de ${datos.plazoPago}.`
  );

  titulo("QUINTA. MONEDA");

  parrafo(
    `La remuneración pactada será cancelada en ${datos.moneda}.`
  );

  titulo("SEXTA. OBLIGACIONES DEL TALENTO");

  parrafo(
    `El contratista se compromete a desarrollar las actividades pactadas, respetar los lineamientos de la campaña, cumplir los tiempos de entrega y mantener una conducta profesional durante toda la ejecución del proyecto.`
  );

  titulo("SÉPTIMA. OBLIGACIONES DE LOOP");

  parrafo(
    `LOOP suministrará la información necesaria para la ejecución de la campaña y realizará los pagos conforme a las condiciones pactadas.`
  );

  titulo("OCTAVA. CONFIDENCIALIDAD");

  parrafo(
    `Toda la información relacionada con la campaña, la marca y los acuerdos comerciales tendrá carácter confidencial.`
  );

  titulo("NOVENA. PROPIEDAD INTELECTUAL");

  parrafo(
    `El contenido generado en desarrollo de la campaña podrá ser utilizado conforme a los acuerdos comerciales establecidos entre las partes.`
  );

  if (datos.tipoParticipante === "Agencia") {

    titulo("REPRESENTACIÓN LEGAL");

    parrafo(
      `La participación se realiza a través de una agencia representada legalmente por ${datos.representanteLegal}, identificado(a) con documento No. ${datos.documentoRepresentante}.`
    );
  }

  titulo("ACEPTACIÓN");

  parrafo(
    `Las partes manifiestan haber leído, comprendido y aceptado todas las condiciones establecidas en el presente contrato.`
  );

  // FIRMAS

  verificarSalto(80);

  y += 10;

  pdf.setFont("helvetica", "bold");
  pdf.text(
    "FIRMAS",
    margen,
    y
  );

  y += 15;

  // Firma talento

  pdf.rect(
    margen,
    y,
    80,
    35
  );

  if (
    firmaRef &&
    firmaRef.current &&
    !firmaRef.current.isEmpty()
  ) {

    const firma = firmaRef.current.toDataURL(
      "image/png"
    );

    pdf.addImage(
      firma,
      "PNG",
      margen + 3,
      y + 3,
      74,
      25
    );
  }

  pdf.line(
    margen,
    y + 42,
    margen + 80,
    y + 42
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  pdf.text(
    datos.nombreCompleto,
    margen + 40,
    y + 48,
    {
      align: "center"
    }
  );

  pdf.text(
    datos.documentoIdentidad,
    margen + 40,
    y + 53,
    {
      align: "center"
    }
  );

  // Firma LOOP

  const xLoop = 115;

  pdf.line(
    xLoop,
    y + 42,
    xLoop + 60,
    y + 42
  );

  pdf.text(
    "LOOP",
    xLoop + 30,
    y + 48,
    {
      align: "center"
    }
  );

  pdf.text(
    "Representante autorizado",
    xLoop + 30,
    y + 53,
    {
      align: "center"
    }
  );

  piePagina();

  pdf.save(
    `Contrato_${datos.nombreCompleto}.pdf`
  );
};

export default generarPDF;