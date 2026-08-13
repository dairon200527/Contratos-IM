import jsPDF from "jspdf";

// Datos fijos
const CONTRATANTE = {
  nombre: "INTERACTIVE MEDIA S.A.S.",
  nit: "900.483.066-2",
  representante: "JUAN SEBASTIÁN MURCIA",
  cedulaRepresentante: "1.032.412.851"
};

const generarPDF = (datos, firmaRef) => {

  const pdf = new jsPDF("p", "mm", "a4");
  const ancho = pdf.internal.pageSize.getWidth();
  const alto = pdf.internal.pageSize.getHeight();
  const margen = 20;
  let y = 25;

  // Parámetros de diseño visual
  const LINE_HEIGHT = 5.5; 
  const PARRAFO_GAP = 6;   

  const verificarSalto = (espacio = 20) => {
    if (y + espacio > alto - 25) {
      pdf.addPage();
      y = 25;
    }
  };

  const titulo = (texto) => {
    verificarSalto(20);
    y += 4; // Espacio extra superior antes de un título
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    const lineas = pdf.splitTextToSize(texto, ancho - (margen * 2));
    pdf.text(lineas, margen, y);
    y += (lineas.length * LINE_HEIGHT) + PARRAFO_GAP;
  };

  const parrafo = (texto) => {
    verificarSalto(25);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const lineas = pdf.splitTextToSize(texto, ancho - (margen * 2));
    pdf.text(lineas, margen, y);
    y += (lineas.length * LINE_HEIGHT) + PARRAFO_GAP;
  };

  const bullet = (texto) => {
    verificarSalto(20);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const indent = 6; // Sangría para el texto de la viñeta
    const anchoTexto = ancho - (margen * 2) - indent;
    const lineas = pdf.splitTextToSize(texto, anchoTexto);
    
    // Dibujamos el punto separado del texto
    pdf.text("•", margen + 1, y);
    pdf.text(lineas, margen + indent, y);
    
    y += (lineas.length * LINE_HEIGHT) + 3; // Espaciado entre viñetas
  };

  // Párrafo con soporte para etiquetas <b> y </b>
  const parrafonegrilla = (texto) => {
    verificarSalto(25);
    const maxWidth = ancho - (margen * 2);
    let cursorX = margen;
    let cursorY = y;

    pdf.setFontSize(10);

    const palabras = texto.trim().split(" ");
    let esNegrita = false;

    palabras.forEach((palabra) => {
      if (palabra.includes("<b>")) {
        esNegrita = true;
        palabra = palabra.replace(/<b>/g, "");
      }

      let apagarNegrita = false;
      if (palabra.includes("</b>")) {
        apagarNegrita = true;
        palabra = palabra.replace(/<\/b>/g, "");
      }

      pdf.setFont("helvetica", esNegrita ? "bold" : "normal");

      const anchoPalabra = pdf.getTextWidth(palabra);
      const anchoEspacio = pdf.getTextWidth(" ");

      // Salto de línea automático
      if (cursorX + anchoPalabra > margen + maxWidth) {
        cursorX = margen;
        cursorY += LINE_HEIGHT;
        
        y = cursorY;
        verificarSalto(10);
        cursorY = y; 
      }

      pdf.text(palabra, cursorX, cursorY);
      cursorX += anchoPalabra + anchoEspacio;

      if (apagarNegrita) {
        esNegrita = false;
      }
    });

    y = cursorY + PARRAFO_GAP; 
  };

  const piePagina = () => {
    const paginas = pdf.getNumberOfPages();
    for (let i = 1; i <= paginas; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        `Página ${i} de ${paginas}`,
        ancho / 2,
        alto - 12,
        { align: "center" }
      );
      pdf.setTextColor(0); // Reset a color negro
    }
  };

  // Valores de respaldo
  const marca = (datos.marcaCampana || "LA MARCA").toUpperCase();
  const cliente = datos.cliente || "@marca";
  const valorLetras = datos.valorLetras || "CERO";
  const valorNumeros = datos.valorNumeros || "0";
  const ciudadFirma = datos.ciudadFirma || "Bogotá";
  const diaFirma = datos.diaFirma || new Date().getDate();
  const mesFirma = datos.mesFirma || "enero";
  const anioFirma = datos.anioFirma || new Date().getFullYear();

  const esAgencia = datos.tipoParticipante === "Agencia";

  // enccabezado 
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  const tituloContrato = pdf.splitTextToSize(
    `CONTRATO DE PRESTACIÓN DE SERVICIOS SUSCRITO ENTRE ${CONTRATANTE.nombre} Y ${datos.nombreCompleto.toUpperCase()}`,
    ancho - (margen * 2)
  );
  pdf.text(tituloContrato, ancho / 2, y, { align: "center" });
  y += (tituloContrato.length * 6) + 10; // Espaciado amplio debajo del título principal

  // cuerpo
  parrafo(`${CONTRATANTE.nombre}, sociedad legalmente constituida, identificada con NIT ${CONTRATANTE.nit}, representada legalmente por el señor ${CONTRATANTE.representante}, mayor de edad, identificado con cédula de ciudadanía No. ${CONTRATANTE.cedulaRepresentante}, quien para efectos del presente contrato se denominará EL CONTRATANTE.`);

  const textoContratista = esAgencia 
    ? `${datos.nombreCompleto}, identificada con número ${datos.documentoIdentidad} de Colombia en representación de ${datos.representanteLegal} identificado con numero de cedula ${datos.documentoRepresentante} con cuenta de instagram @${datos.redSocial}) quien para efectos del presente contrato se denominará EL CONTRATISTA.`
    : `${datos.nombreCompleto}, identificado(a) con documento de identidad No. ${datos.documentoIdentidad} con cuenta de instagram @${datos.redSocial}) quien para efectos del presente contrato se denominará EL CONTRATISTA.`;
  
  parrafo(textoContratista);

  parrafo(`Quienes conjuntamente se llamarán las "PARTES" e individualmente la "PARTE", celebran el presente CONTRATO DE PRESTACIÓN DE SERVICIOS, en adelante, el "CONTRATO", conforme a las siguientes:`);

  titulo("CLÁUSULAS");

  parrafo(`PRIMERA. OBJETO. El Influenciador se obliga a crear y publicar para la campaña ${datos.campana} los siguientes CONTENIDOS: ${datos.cantidadReels || 0} publicación(es) tipo Reel en Instagram, ${datos.cantidadTikToks || 0} video(s) en TikTok, ${datos.cantidadPosts || 0} publicación(es) tipo Post/Carrusel en Instagram, ${datos.cantidadHistorias || 0} historia(s) en Instagram y/o ${datos.otroFormato || "ningún formato adicional"}, mencionando las cuentas oficiales de ${cliente} y cumpliendo con los lineamientos establecidos en el Brief de la campaña. Todos los CONTENIDOS deberán ser creados y publicados por el Influenciador en ejecución del presente Contrato y de acuerdo con las indicaciones del Contratante. (los “CONTENIDOS”).`);

  parrafo(`Con la firma del presente Contrato, el Influenciador autoriza al Contratante y al Cliente el uso de los Contenidos bajo los términos del presente Contrato (en adelante los “CONTENIDOS”).`);

  parrafo(`SEGUNDA. LUGAR DE CUMPLIMIENTO DEL CONTRATO. El presente contrato se desarrollará y cumplirá en el territorio colombiano.`);

  parrafo(`TERCERA. PLAZO: El presente Contrato tendrá una duración inicial de ${datos.duracionCampana}, contados a partir de la primera publicación del Influenciador en las Redes del Influenciador de cualquiera de los Contenidos aprobados previamente por la marca. La Vigencia del Contrato podrá prorrogarse de mutuo acuerdo siempre y cuando conste acuerdo previo y por escrito de las Partes. En caso de extenderse la Vigencia del Contrato y salvo que medie acuerdo escrito en contrario, este se extenderá en las mismas condiciones inicialmente acordadas por las Partes.`);

  parrafo(`CUARTA. OBLIGACIONES DEL CONTRATISTA. El CONTRATISTA deberá promover los lineamientos de la CAMPAÑA ${datos.campana.toUpperCase()} durante el plazo de la campaña en las fechas establecidas, teniendo en cuenta que todo el contenido de marca debe cumplir con los aspectos de reconocimiento publicitario solicitados por la SIC (#patrocinadopor #publicidad, ${cliente} y derivación de tráfico si es requerido).\nTodo contenido debe ser enviado por lo menos cuarenta y ocho (48) horas antes de la publicación y este debe ser aprobado por la MARCA, de lo contrario no se podrá publicar.`);

  parrafo(`El CONTRATISTA deberá llevar a cabo las siguientes acciones:`);

  bullet(`1.1.1. El Contratista se compromete a realizar una (1) publicaciones tipo REEL + 1 tiktok+ 1 historia con el propósito de promocionar los servicios y productos de ${marca} en diferentes momentos.`);
  bullet(`1.1.2. El Contratista se compromete a crear contenido de alta calidad que refleje positivamente la marca de ${marca} y sus productos, siguiendo las pautas y directrices proporcionadas por ${marca}.`);
  bullet(`1.1.3. El Contratista se compromete a mencionar y etiquetar adecuadamente ${marca} en cada una de las publicaciones, asegurándose de utilizar los hashtags proporcionados por ${marca} para la campaña.`);
  bullet(`1.1.4. En caso de que ${marca} lo requiera, el Contratista se compromete a proporcionar previamente el contenido para su revisión y aprobación antes de su publicación.`);
  bullet(`1.1.5. Cualquier modificación o ajuste solicitado por ${marca} al contenido propuesto deberá ser implementado por el Contratista antes de la fecha acordada de publicación. El CONTRATANTE solo podrá usar el contenido (videos) entregado, para uso interno a menos que dentro de la negociación se acuerde lo contrario.`);
  bullet(`1.1.6. Cumplimiento de KPIs: El CONTRATISTA se compromete a cumplir con los KPIs (Indicadores Clave de Desempeño) establecidos en el presente contrato. Estos KPIs serán determinados conjuntamente por las partes contratantes y se utilizarán para evaluar y medir el rendimiento y los resultados de las actividades acordadas. El incumplimiento de los KPIs acordados podrá dar lugar a sanciones o medidas adicionales según lo estipulado en este contrato. Ambas partes acuerdan revisar y ajustar los KPIs de manera periódica, si es necesario, para garantizar que sigan siendo relevantes y alcanzables en función de los objetivos del contrato.`);
  bullet(`1.1.7. Cuando la naturaleza de la campaña así lo requiera y el CONTRATANTE lo informe previamente al CONTRATISTA, este último deberá devolver, al finalizar el proyecto, todos los productos, equipos, muestras o demás elementos suministrados por el CONTRATANTE y/o el Cliente, en perfecto estado de conservación, dentro de un plazo máximo de cinco (5) días hábiles contados a partir de la solicitud de devolución, a la dirección que le sea indicada. En caso de pérdida, daño atribuible al CONTRATISTA o no devolución de los elementos cuya restitución haya sido previamente informada, el CONTRATISTA deberá asumir el costo total de los mismos, de acuerdo con la valoración realizada por el CONTRATANTE. En las campañas en las que no se haya informado expresamente la obligación de devolución, la presente cláusula no será aplicable.`);
  bullet(`Asimismo, todos los contenidos generados serán compartidos en la cuenta oficial de ${cliente} Se aplicarán los derechos de uso de imagen orgánicos.`);
  bullet(`Derechos de uso de imagen orgánicos.`);
  bullet(`Todos los contenidos serán reposteados en la cuenta de ${cliente}`);

  y += 3; // Margen extra de separación tras finalizar el bloque de viñetas

  parrafo(`QUINTA. EXCLUSIVIDAD Y NO COMPETENCIA. El CONTRATISTA no está obligado a prestar ningún servicio de exclusividad, permitiéndole colaborar con otras marcas o proyectos fuera de la competencia directa. Durante la Vigencia del Contrato y un periodo adicional de tres (3) meses, el Influenciador se obliga a no promover, proporcionar servicio alguno, figurar, ser la imagen de, respaldar, auspiciar, aparecer frente a cámaras, conceda entrevistas, publique en las Redes del Influenciador ni permitirá que se utilice su imagen para la promoción, asoció respaldo, auspicio o patrocinio de cualquier marca que sea competidora del Cliente o de la Marca del Cliente, con independencia del medio.`);
  parrafo(`Las Partes entienden y acuerdan que la Contraprestación incluye el pago por tales derechos durante el periodo de tres (3) meses de exclusividad posteriores a la terminación del Contrato.`);

  parrafo(`SEXTA. CRONOGRAMA. La fecha pactada con el CONTRATISTA para la obtención del contenido será acordada durante la primera reunión y quedará por escrito. El Influencer debe cumplir a cabalidad este cronograma, para el buen funcionamiento de lo acordado.`);

  parrafo(`SÉPTIMA. REMUNERACIÓN. A cambio del cumplimiento de las obligaciones establecidas en este Contrato, el CONTRATANTE pagará al CONTRATISTA la suma total de ${valorLetras} PESOS ($${valorNumeros} COP). Una vez el contenido objeto del presente Contrato haya sido publicado y el CONTRATISTA haya entregado las métricas correspondientes, el CONTRATANTE solicitará por correo electrónico la documentación requerida para el trámite de pago. El término de cuarenta y cinco (45) días calendario para efectuar el pago comenzará a contar a partir de la fecha en que el CONTRATISTA remita por correo electrónico la totalidad de los documentos solicitados, siempre que estos se encuentren completos, cumplan con los requisitos establecidos por el CONTRATANTE y sean validados por su equipo administrativo. En caso de que la documentación esté incompleta, presente inconsistencias o no cumpla con los requisitos exigidos, el término de los cuarenta y cinco (45) días calendario empezará a contar únicamente a partir de la recepción de la documentación completa y correcta.`);

  parrafo(`El pago únicamente se realizará una vez el CONTRATANTE verifique que el CONTRATISTA ha cumplido con la totalidad de las acciones y obligaciones pactadas en el presente Contrato, de conformidad con los lineamientos establecidos para la campaña, incluyendo la publicación de los contenidos, la entrega de las métricas correspondientes y el cumplimiento de las obligaciones previstas en las cláusulas de confidencialidad y aclaración. Asimismo, el CONTRATISTA se obliga a abstenerse de realizar comentarios, manifestaciones o publicaciones negativas, despectivas o peyorativas respecto de la marca ${marca}, sus productos, servicios o campañas durante la ejecución del presente Contrato y con posterioridad a su terminación, salvo que exista una obligación legal que disponga lo contrario.`);

  parrafo(`Documentos y soportes:\nUn reporte de las actividades que realizó y una declaración de cumplimiento de los servicios.\nFacturación electrónica.\nEn caso de presentación de cuenta de cobro: Constancia de pago de la seguridad social y parafiscales correspondientes por el valor de la cuenta de cobro según la normativa vigente. Las Partes aceptan y reconocen que la presentación de esto es un requisito fundamental para el pago de la contraprestación.`);

  parrafo(`A la suma pagada por el Contratante se aplicarán todos los impuestos y retenciones aplicables de acuerdo con la normatividad fiscal vigente.`);
  parrafo(`Los anteriores elementos conjuntamente denominados la “Contraprestación”.`);

  parrafo(`CONTRATANTE podrá, en cualquier momento y de manera unilateral terminar de forma inmediata y unilateral el Contrato, sin que medie penalidad, multa, apremio o sanción alguna si:\n\nEl Influenciador se niega o no realiza los Servicios contratados o los realiza de forma defectuosa sin enmendarlos en un periodo de 24 horas desde la notificación del incumplimiento parcial por parte del Cliente o el Contratante.\nEl Influenciador es vinculado a un proceso penal en calidad de indiciado, sindicado o condenado, o en caso de que el Influenciador resultare estar involucrado en cualquier noticia o escándalo que pueda afectar, a criterio del Contratante o del Cliente, la reputación de la Marca del Cliente o de cualquiera de las empresas del Cliente.`);

  parrafo(`En caso de que el Influenciador no preste el Servicio, lo preste de forma deficiente o defectuosa a juicio del Contratante o no lo preste de forma total o parcial, las Partes acuerdan que el Contratante podrá a su total y absoluta discreción abstenerse de realizar los pagos por los Servicios y cobrar la cláusula penal acordada por las Partes, sin perjuicio de la eventual reclamación judicial de los perjuicios y daños que haya sufrido el Contratante o el Cliente con ocasión del incumplimiento por parte del Influenciador. Cualquier pago de la Contraprestación estará supeditado a la realización efectiva de los Servicios por parte del Influenciador y a satisfacción del Contratante.`);

  parrafo(`OCTAVA. PENALIDAD EN CASO DE INCUMPLIMIENTO. Salvo que exista un motivo de fuerza mayor o caso fortuito debidamente acreditado y aceptado por escrito por ${marca} y por el CONTRATANTE, el incumplimiento del CONTRATISTA en cualquiera de las obligaciones pactadas en este Contrato, ya sea en tiempo, forma, calidad o contenido, para la CAMPAÑA, dará lugar a las siguientes consecuencias, las cuales podrán aplicarse de manera acumulativa y no excluyente entre sí:

    a) Pérdida total e inmediata del derecho al pago de la remuneración pactada en la Cláusula Séptima, sin que ello genere derecho a reclamación, indemnización o compensación alguna a favor del CONTRATISTA.

    b) Restitución inmediata de cualquier suma que hubiere sido entregada al CONTRATISTA a título de anticipo, dentro de los cinco (5) días hábiles siguientes a la fecha en que se configure el incumplimiento.

    c) Pago a título de cláusula penal, sin necesidad de constitución en mora ni de requerimiento judicial o extrajudicial previo, y sin perjuicio de la indemnización de los perjuicios mayores a que haya lugar, de una suma equivalente al ciento cincuenta por ciento (150%) del valor total pactado en la Cláusula Séptima. El CONTRATANTE y/o ${marca} podrán compensar dicha suma con cualquier valor que adeuden al CONTRATISTA por cualquier concepto.

    d) Reconocimiento y pago, a cargo exclusivo del CONTRATISTA, de todos los perjuicios, daños, costos, gastos y honorarios (incluidos los de abogados y peritos) en que deban incurrir el CONTRATANTE, la AGENCIA y/o la MARCA como consecuencia directa o indirecta del incumplimiento.

    e) Terminación inmediata y unilateral del presente Contrato por parte del CONTRATANTE, sin lugar a preaviso ni a indemnización alguna a favor del CONTRATISTA.
    
    f) El incumplimiento no exonera al CONTRATISTA de sus obligaciones de confidencialidad, no desprestigio y propiedad intelectual, las cuales permanecerán vigentes con independencia de la terminación anticipada del Contrato.`);

  parrafo(`Así mismo, el CONTRATISTA debe seguir las normas de publicidad requeridas en la normativa de la SIC, ya que, de no cumplir con esta, deberá asumir la correspondiente sanción, sin perjuicio de las consecuencias descritas en esta cláusula.`);

  parrafo(`NOVENA. CONFIDENCIALIDAD Y NO DESPRESTIGIO. Este Contrato, sus condiciones y términos, así como toda información de ${marca} a que el CONTRATISTA tenga acceso durante la prestación de los servicios será confidencial y deberá tratarse con absoluta discreción. Consecuentemente, no podrá ser divulgada a terceros, ni al público en general bajo ningún término de este sin la autorización previa por escrito de ${marca} por un periodo de 5 Años . Adicionalmente, durante o posterior a la vigencia del presente Contrato, el CONTRATISTA no podrá dar a conocer a ningún tercero ni a utilizar en provecho propio el contenido del presente contrato o cualquier información relacionada a la compañía, la cual únicamente podrá ser utilizada para los fines del presente contrato, y en ningún caso sin la autorización por escrito de MARCA.`);

  parrafo(`LAS PARTES acuerdan expresamente que ninguna de ellas, por sí misma, por sus representantes legales, administradores, empleados, contratistas o por interpuesta persona, podrá realizar, publicar, emitir, autorizar o facilitar declaraciones, comentarios, publicaciones, reseñas o manifestaciones públicas o privadas, verbales o escritas, en cualquier medio o canal (incluyendo, sin limitación, redes sociales, medios de comunicación, entrevistas, comunicados de prensa, foros o cualquier otro medio digital o físico), que denigren, desacrediten, ridiculicen, difamen o de cualquier otra forma dañen o puedan dañar la reputación, imagen, buen nombre, prestigio o intereses comerciales de la otra PARTE, de INTERACTIVE MEDIA S.A.S. en su calidad de agencia y CONTRATANTE, de la MARCA ${marca} (cualquiera que ésta sea) y/o de sus respectivos representantes legales, socios, directivos, empleados o productos.`);
  
  parrafo(`Esta obligación de no desprestigio (i) aplica por igual a ambas PARTES, sin que ninguna de ellas pueda alegar un trato desigual; (ii) subsistirá de manera plena e incondicional aun cuando existan controversias, reclamaciones, procesos judiciales o extrajudiciales, o disputas activas entre LAS PARTES derivadas del presente Contrato o de su terminación; y (iii) permanecerá vigente durante la ejecución del Contrato y por un término de cinco (5) años contados a partir de su terminación o vencimiento, cualquiera que sea la causa de dicha terminación.`);
  
  parrafo(`El incumplimiento de esta cláusula constituirá una violación grave del presente Contrato y dará lugar, de manera acumulativa, a: (a) la indemnización de todos los perjuicios materiales e inmateriales causados al CONTRATANTE, a la AGENCIA y/o a la MARCA, incluyendo el daño reputacional y el lucro cesante que se llegue a acreditar; y (b) la aplicación de las sanciones y penalidades previstas en la Cláusula Octava de este Contrato, en lo que resulten aplicables.`);

  parrafo(`DÉCIMA. PROPIEDAD INTELECTUAL. LAS PARTES acuerdan que los signos distintivos, derechos de imagen o cualquier otro tipo de documento o procedimientos amparados por derechos de propiedad intelectual que cualquiera de LAS PARTES entregue a la otra, podrán ser utilizados única y exclusivamente en los términos y para los efectos previstos en el presente Contrato.`);
  parrafo(`Garantía de Originalidad. El Creador garantiza que todo el contenido entregado (incluyendo, de manera enunciativa más no limitativa: videos, imágenes, música, efectos sonoros, fuentes tipográficas, logotipos y elementos gráficos) es de su autoría original o que posee las licencias, permisos y autorizaciones necesarias para su uso comercial y explotación por parte de la Agencia y sus clientes y exonera al CONTRATANTE y LA MARCA de cualquier reclamación futura.`);
  parrafo(`Responsabilidad y Exclusión de Culpa. El Creador asume la responsabilidad total y exclusiva sobre cualquier reclamación relativa a derechos de propiedad intelectual, derechos de autor o derechos de imagen de terceros. En consecuencia, el Creador libera de toda responsabilidad a la Agencia, sus representantes legales, sus directivos, empleados y al cliente, es decir a la Marca a la cual le desarrolló los contenidos, ante cualquier demanda, litigio, sanción administrativa, multa pecuniaria o reclamación extrajudicial derivada del contenido proporcionado.`);
  parrafo(`Indemnización. En caso de que la Agencia o el cliente sea objeto de una reclamación por parte de un tercero debido a una presunta infracción de derechos de autor en el contenido entregado por el Creador, este último se obliga a:\nDefender a la Agencia y el cliente: Asumir la defensa legal y los costos asociados (abogados, peritos y costas judiciales).\nReembolsar Gastos: Indemnizar a la Agencia y/o al cliente por cualquier daño, perjuicio, multa o pago que esta se vea obligada a realizar como consecuencia de dicha reclamación.\nSustitución de Material: Reemplazar o modificar el contenido infractor de manera inmediata y sin costo adicional para la Agencia y el cliente, asegurando que el nuevo material cumpla con la legalidad y permisos vigentes.`);

  parrafo(`DÉCIMA PRIMERA. AUTORIZACIÓN DE TRATAMIENTO DE DATOS PERSONALES. Por medio de la suscripción del presente Contrato, el CONTRATISTA declara ser el titular de la información personal suministrada en ejecución de este. Así mismo, el tratamiento de dicha información personal, conforme a la Política de Tratamiento de Datos Personales. En todo caso, el titular de la información, tendrá sobre dicha información todos los siguientes derechos: (i) conocer, actualizar y rectificar sus datos personales; (ii) solicitar prueba de la autorización otorgada a ${CONTRATANTE.nombre}; (iii) ser informado respecto del uso que le ha dado a sus datos personales; (iv) presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en las normas de protección de datos personales; (v) revocar la autorización y/o solicitar la supresión de sus datos personales, conforme a las normas pertinentes; (vi) acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento. Estos derechos podrán ser ejercidos por el titular de la información mediante consultas y/o reclamos dirigidos a las direcciones físicas y de correo electrónico indicadas en la Política de Tratamiento de Datos Personales de ${CONTRATANTE.nombre}.`);

  parrafo(`DÉCIMA SEGUNDA. SDN LIST – PTEE Y SAGRILAFT. El CONTRATISTA declara, bajo la gravedad del juramento, que no está actualmente, ni ha estado jamás, incluido en la lista Special Designated Nationals and Blocked Persons, emitida por el Departamento del Tesoro de los Estados Unidos de América (esta lista es conocida como la "Lista Clinton"). También declara que no es socio, accionista, inversionista o participante en sociedades o empresas, de cualquier nacionalidad, que estén actualmente, o hayan estado jamás, incluidas en la mencionada lista. Si se demuestra que esta declaración jurada del CONTRATISTA es falsa, este Contrato terminará automáticamente y será un incumplimiento gravísimo de las obligaciones a cargo del CONTRATISTA. Como indemnización, en este caso, el CONTRATISTA deberá indemnizar a ${CONTRATANTE.nombre} por lucro cesante, daño emergente y perjuicios en general, según la estimación de perjuicios que para el efecto realice ${CONTRATANTE.nombre} en el momento de la terminación del Contrato por la causa a la que se refiere esta cláusula. El CONTRATISTA renuncia por este medio a oponerse a la estimación de perjuicios que en estos términos realice ${CONTRATANTE.nombre}.`);

  parrafo(`DÉCIMA TERCERA. RELACIÓN ENTRE LAS PARTES. Con motivo del Contrato no surge entre LAS PARTES, ni entre ellas y sus dependientes, contratistas o empleados, relación alguna de carácter laboral. En consecuencia, cada una de LAS PARTES será responsable del pago de todas las obligaciones contractuales y legales derivadas de la contratación de su personal, incluyendo salarios, honorarios, prestaciones sociales, aportes al sistema de seguridad social, contribuciones parafiscales, entre otras. En consecuencia, las Partes se obligan a mantener indemne a la otra Parte de cualquier reclamación judicial, extrajudicial o administrativa derivada de su incumplimiento de las mencionadas obligaciones, debiendo pagar o reembolsar a la parte afectada los costos de defensa legal en los que haya incurrido, las costas judiciales y la indemnización de perjuicios o pago de sanciones a que haya lugar, en virtud de condena judicial, conciliación, transacción o cualquier mecanismo de resolución de conflictos. Así mismo, la relación entre LAS PARTES será la de dos partes independientes contratantes y ambas aceptan que el presente acuerdo no supondrá un joint venture, relación de agencia comercial ni asociación entre ellas.`);

  parrafo(`DÉCIMA CUARTA. TERMINACIÓN ANTICIPADA: El Contratante o el Cliente podrán dar por terminado anticipadamente el presente Contrato, sin que por ello deban asumir ningún tipo de responsabilidad, penalidad o sanción y sin necesidad de justificación, mediante aviso escrito, enviado al Contratista y/o al Influenciador con al menos 15 días calendario de anticipación a la fecha que se pretenda como la de finalización del Contrato. La Agencia pagará la Contraprestación efectivamente causada y no pagada por los Servicios efectivamente prestados por el Influenciador hasta la fecha efectiva de terminación; y el Influenciador prestará los Servicios que hayan sido pagados hasta el momento de la terminación. En caso de terminación de acuerdo con este parágrafo, el Cliente podrá utilizar los Contenidos entregados y publicados durante hasta la fecha efectiva de terminación y por un periodo adicional de cuatro (4) meses desde la fecha de la última publicación de Contenido por parte del Influenciador.`);

  parrafo(`LAS PARTES manifiestan que, en la elaboración del presente Contrato, su voluntad no se vio influenciada por algún vicio del consentimiento que pudiere anularlo en todo o en parte, por lo que, enteradas de su contenido, alcance y fuerza legal, lo suscriben el día ${diaFirma} del mes de ${mesFirma} del año ${anioFirma}, en la Ciudad de ${ciudadFirma}.`);

  // firmas
  verificarSalto(75); 
  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("FIRMAS", margen, y);
  y += 10;

  const boxY = y;
  const boxHeight = 30; // Altura caja firma

  // Firma (Izquierda)
  pdf.rect(margen, boxY, 75, boxHeight);

  if (firmaRef && firmaRef.current && !firmaRef.current.isEmpty()) {
    const firma = firmaRef.current.toDataURL("image/png");
    pdf.addImage(firma, "PNG", margen + 10, boxY + 2.5, 55, 25);
  }

  pdf.line(margen, boxY + boxHeight + 5, margen + 75, boxY + boxHeight + 5);
 
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(CONTRATANTE.representante, margen + 37.5, boxY + boxHeight + 11, { align: "center" });
  pdf.text(`C.C. No. ${CONTRATANTE.cedulaRepresentante}`, margen + 37.5, boxY + boxHeight + 16, { align: "center" });
  pdf.text("Representante Legal - EL CONTRATANTE", margen + 37.5, boxY + boxHeight + 21, { align: "center" });

  // Firma (Derecha)
  const xContratista = 115;
  const widthContratista = 75;

  pdf.rect(xContratista, boxY, widthContratista, boxHeight);
  pdf.line(xContratista, boxY + boxHeight + 5, xContratista + widthContratista, boxY + boxHeight + 5);

  pdf.text(datos.nombreCompleto, xContratista + (widthContratista / 2), boxY + boxHeight + 11, { align: "center" });
  pdf.text(`C.C. / ID: ${datos.documentoIdentidad}`, xContratista + (widthContratista / 2), boxY + boxHeight + 16, { align: "center" });
  pdf.text(esAgencia ? "Influenciador / Manager" : "EL CONTRATISTA", xContratista + (widthContratista / 2), boxY + boxHeight + 21, { align: "center" });

  // Pie de página
  piePagina();
  pdf.save(`Contrato_${datos.nombreCompleto.replace(/\s+/g, '_')}.pdf`);
};

export default generarPDF;