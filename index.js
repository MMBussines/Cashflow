require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ==========================================================
// INFORMACIÓN OFICIAL
// ==========================================================

const NEGOCIO = {
  nombre: "Enseña Sin Estrés",
  agente: "Cris",
  edadRecomendada: "3 a 8 años",

  productos: {
    kitAntipantallas: {
      nombre: "Kit Anti-Pantallas",
      precio: 99
    },

    paquetePremium: {
      nombre: "Paquete Premium",
      precio: 130
    }
  },

  metodosPago: [
    "Transferencia bancaria",
    "Depósito en OXXO"
  ]
};

// ==========================================================
// PROMPT DEL AGENTE
// ==========================================================

const SYSTEM_PROMPT = `
Eres Cris, asistente de soporte de Enseña Sin Estrés.

Tu trabajo es atender por WhatsApp a personas interesadas
en el Kit Anti-Pantallas y el Paquete Premium.

Tu personalidad es cálida, amable, cercana, profesional
y humana.

Responde como una persona real por WhatsApp.

REGLAS DE ESTILO:

- Responde siempre en español.
- Utiliza párrafos cortos y fáciles de leer.
- Deja una línea en blanco entre ideas cuando ayude a la lectura.
- Usa emojis de forma moderada. 💛😊
- Evita bloques largos de texto.
- No repitas información innecesariamente.
- No saludes nuevamente si la conversación ya comenzó.
- No hagas preguntas abiertas innecesarias.
- Responde directamente la duda del cliente.
- No uses Markdown como encabezados con símbolos #.
- No digas que eres una inteligencia artificial.
- No presiones al cliente.
- No satures al cliente con información que no haya solicitado.
- Responde normalmente en uno o dos párrafos cortos,
  salvo que sea necesario enumerar contenido.

REGLAS OBLIGATORIAS:

- Utiliza exclusivamente la información oficial incluida
  en esta base de conocimiento.
- No inventes información.
- No inventes precios, promociones, productos,
  características, beneficios, garantías, políticas,
  condiciones, tiempos, enlaces, cuentas bancarias,
  números de tarjeta, CLABE, referencias de pago
  ni instrucciones que no estén autorizadas aquí.
- No contradigas los precios, condiciones, edades,
  formas de entrega ni métodos de pago oficiales.
- Si no existe información suficiente para responder,
  indica de manera natural que necesitas confirmar ese dato
  con el equipo para brindar información correcta.
- Nunca asegures algo que no aparezca expresamente
  en esta información oficial.
- Cuando respondas una pregunta concreta,
  contesta únicamente lo necesario.
- Una pregunta sobre un producto NO significa que el cliente ya lo eligió.
- Solo considera una elección de paquete cuando el mensaje confirme claramente
  que quiere o prefiere ese paquete.

INFORMACIÓN OFICIAL DEL NEGOCIO:

Nombre del negocio: Enseña Sin Estrés.

Nombre del agente: Cris.

Producto principal: Kit Anti-Pantallas.

También se ofrece el Paquete Premium.

El producto es digital, descargable e imprimible.

El material está recomendado para pequeños de 3 a 8 años.

PRECIO:

- Kit Anti-Pantallas: $99 MXN.
- Paquete Premium: $130 MXN.

MÉTODOS DE PAGO:

- Transferencia bancaria.
- Depósito en OXXO.

No tienes datos bancarios, números de cuenta, CLABE,
tarjeta, QR ni referencias de pago autorizados dentro
de esta base.

Si el cliente solicita alguno de esos datos específicos,
indica que necesitas confirmar ese dato con el equipo.

FORMA DE ENTREGA OFICIAL:

Una vez confirmado el pago, el cliente recibe
inmediatamente una Guía de Acceso en PDF.

La Guía de Acceso contiene las instrucciones y enlaces
para acceder y descargar los materiales.

CONTENIDO DEL KIT ANTI-PANTALLAS:

El Kit Anti-Pantallas incluye:

- Juegos y desafíos.
- Recortables.
- Actividades de motricidad.
- Inteligencia emocional.
- Coloreables.
- Cuadernillos.
- Más de 500 actividades.
- Todos los bonos incluidos.

BONOS OFICIALES:

- Tarjetas "Mamá, Estoy Aburrido".
- Sistema de Recompensas Anti-Pantallas.
- Guía rápida para padres.
- Libro personalizable.
- Pack Paper Craft 3D.

KIT PEQUEÑOS GENIOS:

El Kit Pequeños Genios incluye actividades de:

- Lectoescritura.
- Pensamiento Matemático.
- Lógica.

El material está listo para imprimir.

PAQUETE PREMIUM:

El Paquete Premium cuesta $130 MXN e incluye:

- Kit Anti-Pantallas.
- Kit Pequeños Genios.
- Biblioteca Premium de Refuerzo Escolar.
- Todos los bonos.
- Acceso de por vida.

BIBLIOTECA PREMIUM DE REFUERZO ESCOLAR:

Contiene material complementario para seguir
fortaleciendo el aprendizaje durante preescolar
y los primeros años de primaria.

Incluye recursos adicionales para continuar
practicando en casa.

FORMATO DEL MATERIAL:

El producto es 100% digital.

Los materiales se manejan en formato PDF
listo para descargar e imprimir.

No es un solo libro.

El cliente recibe una biblioteca digital completa
con cuadernillos, actividades y diferentes recursos
organizados por categorías.

ACCESO Y DESCARGA:

No existe límite de tiempo para descargar los archivos.

El acceso es permanente.

El cliente puede descargar los archivos cuando lo necesite.

SEGURIDAD DE LA COMPRA:

Llevamos tiempo trabajando con madres, padres,
docentes y profesionales.

Gracias a Dios no hemos tenido inconvenientes
con la entrega de nuestros materiales.

La decisión de confiar en nosotros
es completamente del cliente.

CASO DE PEQUEÑOS DE 2 AÑOS:

El material está recomendado para pequeños
de 3 a 8 años.

Sin embargo, algunas mamás nos cuentan que también
lo utilizan con pequeños de 2 años, especialmente
en actividades sencillas de:

- Trazos.
- Motricidad.
- Coloreado.
- Recortables.

Siempre adaptándolas a sus habilidades.

ELECCIÓN DE PAQUETE:

Si el cliente confirma que desea el Paquete Premium,
debes reconocer su elección y guiarlo a elegir método de pago:

- Transferencia bancaria.
- Depósito en OXXO.

Si el cliente confirma que desea el Kit Anti-Pantallas,
debes reconocer su elección y guiarlo a elegir método de pago:

- Transferencia bancaria.
- Depósito en OXXO.

OBJETIVO DE LA CONVERSACIÓN:

Atender a clientes interesados.

Resolver sus dudas de forma breve y clara.

Presentar las opciones disponibles.

Guiarlos hacia el siguiente paso de la compra
cuando corresponda.

El siguiente paso puede ser:

- Elegir entre el Kit Anti-Pantallas y el Paquete Premium.
- Elegir entre transferencia bancaria y depósito en OXXO.
- Continuar con el proceso para completar su acceso.

CIERRE COMERCIAL:

- Agrega un cierre comercial únicamente cuando
  resulte natural y útil.
- No agregues un cierre de compra automáticamente
  a todas las respuestas.
- Si el cliente pregunta por precio, contenido del producto,
  opciones de compra o métodos de pago,
  puedes guiarlo al siguiente paso.
- Si el cliente solo pregunta por edad, formato,
  descarga, entrega, seguridad o una duda informativa,
  responde primero la duda sin presionarlo.
`;

// ==========================================================
// FUNCIONES GENERALES
// ==========================================================

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:()[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contieneAlguna(texto, frases) {
  return frases.some((frase) =>
    texto.includes(normalizarTexto(frase))
  );
}

function esIgualAAlguna(texto, frases) {
  return frases.some(
    (frase) => texto === normalizarTexto(frase)
  );
}

function elegirAleatoria(opciones) {
  return opciones[
    Math.floor(Math.random() * opciones.length)
  ];
}

function limpiarRespuesta(valor) {
  return String(valor ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ==========================================================
// CIERRES COMERCIALES
// ==========================================================

function cierrePaquete() {
  return elegirAleatoria([
    "💛 ¿Cuál prefieres para tu peque: Kit Anti-Pantallas o Paquete Premium?",
    "😊 Si deseas continuar, ¿cuál opción prefieres: Kit Anti-Pantallas o Paquete Premium?",
    "✨ ¿Te gustaría continuar con el Kit Anti-Pantallas o con el Paquete Premium?"
  ]);
}

function cierreMetodoPago() {
  return elegirAleatoria([
    "💳 Puedes continuar por transferencia bancaria 🏦 o depósito en OXXO 🏪. ¿Cuál prefieres? 😊",
    "💛 Para continuar, puedes elegir transferencia bancaria 🏦 o depósito en OXXO 🏪. ¿Cuál opción prefieres?",
    "😊 El siguiente paso es elegir tu método de pago: transferencia bancaria 🏦 u OXXO 🏪."
  ]);
}

function debeAgregarCierre(textoNormalizado) {
  const intencionPago =
    contieneAlguna(textoNormalizado, [
      "metodo de pago",
      "metodos de pago",
      "formas de pago",
      "forma de pago",
      "como puedo pagar",
      "como pago",
      "quiero pagar",
      "pagar"
    ]);

  const intencionProducto =
    contieneAlguna(textoNormalizado, [
      "precio",
      "cuanto cuesta",
      "cuanto vale",
      "costo",
      "que incluye",
      "que contiene",
      "que trae",
      "incluye el kit",
      "actividades",
      "pequenos genios",
      "kit antipantallas",
      "paquete premium",
      "comprar",
      "quiero comprar",
      "me interesa"
    ]);

  const pareceConsultaDeEntrega =
    contieneAlguna(textoNormalizado, [
      "despues de pagar",
      "despues del pago",
      "cuando me llega",
      "cuando lo recibo",
      "cuanto tarda",
      "como se entrega",
      "entrega"
    ]);

  if (pareceConsultaDeEntrega) {
    return null;
  }

  if (intencionPago) {
    return "pago";
  }

  if (intencionProducto) {
    return "paquete";
  }

  return null;
}

function agregarCierre(respuesta, mensajeOriginal) {
  const respuestaLimpia =
    limpiarRespuesta(respuesta);

  if (!respuestaLimpia) {
    return "Necesito confirmar ese dato con el equipo para darte información correcta. 💛";
  }

  const tipoCierre =
    debeAgregarCierre(
      normalizarTexto(mensajeOriginal)
    );

  if (!tipoCierre) {
    return respuestaLimpia;
  }

  const normalizada =
    normalizarTexto(respuestaLimpia);

  const yaIncluyeCierre =
    normalizada.includes("cual prefieres") ||
    normalizada.includes("cual opcion prefieres") ||
    normalizada.includes("puedes elegir entre el kit") ||
    (
      normalizada.includes("transferencia bancaria") &&
      normalizada.includes("deposito en oxxo") &&
      normalizada.includes("prefieres")
    );

  if (yaIncluyeCierre) {
    return respuestaLimpia;
  }

  const cierre =
    tipoCierre === "pago"
      ? cierreMetodoPago()
      : cierrePaquete();

  return `${respuestaLimpia}\n\n${cierre}`;
}

// ==========================================================
// RESPUESTAS OFICIALES REUTILIZABLES
// ==========================================================

function respuestaEleccionPremium() {
  return elegirAleatoria([
    "💛 ¡Excelente elección! Elegiste el Paquete Premium por $130 MXN. ✨\n\n💳 ¿Cómo prefieres realizar tu pago: transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "✨ Perfecto, elegiste el Paquete Premium por $130 MXN. 💛\n\n¿Prefieres realizar tu pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "💛 Perfecto 😊 Continuamos con el Paquete Premium de $130 MXN.\n\n💳 ¿Cómo prefieres pagar: transferencia bancaria 🏦 u OXXO 🏪?"
  ]);
}

function respuestaEleccionAntipantallas() {
  return elegirAleatoria([
    "💛 ¡Excelente elección! Elegiste el Kit Anti-Pantallas por $99 MXN. ✨\n\n💳 ¿Cómo prefieres realizar tu pago: transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "✨ Perfecto, elegiste el Kit Anti-Pantallas por $99 MXN. 💛\n\n¿Prefieres realizar tu pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "💛 Perfecto 😊 Continuamos con el Kit Anti-Pantallas de $99 MXN.\n\n💳 ¿Cómo prefieres pagar: transferencia bancaria 🏦 u OXXO 🏪?"
  ]);
}

function respuestaContenidoPremium() {
  return elegirAleatoria([
    "💛 El Paquete Premium incluye el Kit Anti-Pantallas, el Kit Pequeños Genios, la Biblioteca Premium de Refuerzo Escolar y todos los bonos. 📚✨ Además, tienes acceso de por vida.",
    "📚✨ El Paquete Premium incluye Kit Anti-Pantallas + Kit Pequeños Genios + Biblioteca Premium de Refuerzo Escolar + todos los bonos, con acceso de por vida. 💛",
    "💛 Con el Paquete Premium recibes el Kit Anti-Pantallas, el Kit Pequeños Genios, la Biblioteca Premium de Refuerzo Escolar y todos los bonos. ✨ El acceso es de por vida."
  ]);
}

function respuestaDatosPagoNoDisponibles() {
  return elegirAleatoria([
    "💛 Para darte los datos correctos de transferencia u OXXO, necesito confirmar esa información con el equipo.",
    "😊 Necesito confirmar con el equipo los datos específicos de pago para compartirte la información correcta. 💛",
    "💛 Los datos específicos de cuenta, CLABE, tarjeta, código o QR no están disponibles en mi información autorizada. Necesito confirmarlos con el equipo."
  ]);
}

function respuestaMetodosPago() {
  return elegirAleatoria([
    "💳 Puedes realizar tu pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪✨.",
    "💛 Aceptamos pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪✨.",
    "😊 Puedes pagar por transferencia bancaria 🏦 o mediante depósito en OXXO 🏪. 💳✨"
  ]);
}

function respuestaEntrega() {
  return elegirAleatoria([
    "📄 En cuanto se confirme tu pago, recibirás inmediatamente una Guía de Acceso en PDF con las instrucciones y enlaces para acceder y descargar tus materiales. 🔗📚✨",
    "💛 Una vez confirmado tu pago, recibirás inmediatamente una Guía de Acceso en PDF que contiene las instrucciones y enlaces para entrar y descargar tus materiales. 📄🔗",
    "📲 Al confirmarse tu pago, recibirás inmediatamente una Guía de Acceso en PDF con las instrucciones y enlaces necesarios para acceder y descargar tus materiales. 💛✨"
  ]);
}

function respuestaSeguridad() {
  return elegirAleatoria([
    "💛 ¡Claro! 😊 Llevamos tiempo trabajando con madres, padres, docentes y profesionales. Gracias a Dios no hemos tenido inconvenientes con la entrega de nuestros materiales. 🙏✨ Al final, la decisión de confiar en nosotros es completamente tuya. 🤍",
    "💛 Llevamos tiempo trabajando con madres, padres, docentes y profesionales y, gracias a Dios, no hemos tenido inconvenientes con la entrega de nuestros materiales. 🙏✨ La decisión de confiar en nosotros es completamente tuya. 😊",
    "😊💛 Hemos trabajado con madres, padres, docentes y profesionales y, gracias a Dios, no hemos tenido inconvenientes con nuestras entregas. 🙏✨ Al final, la decisión de confiar en nosotros siempre es completamente tuya. 🤍"
  ]);
}

function respuestaDosAnos() {
  return elegirAleatoria([
    "💛 Nuestro material está recomendado para pequeños de 3 a 8 años. 😊 Sin embargo, algunas mamás nos cuentan que también lo utilizan con sus pequeños de 2 años, especialmente en actividades sencillas de trazos, motricidad, coloreado y recortables, siempre adaptándolas a sus habilidades. 🎨✂️✨",
    "💛 El material está recomendado para pequeños de 3 a 8 años. 😊 Algunas mamás también lo utilizan con pequeños de 2 años en actividades sencillas como trazos, motricidad, coloreado y recortables, adaptándolas siempre a sus habilidades. 🎨✂️✨",
    "😊 La edad recomendada es de 3 a 8 años. 💛 Aun así, algunas mamás nos cuentan que con pequeños de 2 años usan actividades sencillas de trazos, motricidad, coloreado y recortables, siempre ajustándolas a sus habilidades. 🎨✨"
  ]);
}

function respuestaFisico() {
  return elegirAleatoria([
    "📲 No. Es un producto 100% digital, en formato PDF listo para descargar e imprimir. 🖨️✨",
    "📲 El material no es físico; es 100% digital y está en formato PDF listo para descargar e imprimir. 🖨️✨",
    "💛 Es un producto completamente digital en formato PDF, listo para descargar e imprimir. No es material físico. 📲🖨️"
  ]);
}

function respuestaDescarga() {
  return elegirAleatoria([
    "⏰ No hay límite. Tu acceso es permanente y puedes descargar los archivos cuando lo necesites. 📚✨",
    "💛 No tienes límite de tiempo para descargarlo. El acceso es permanente y puedes descargar los archivos cuando lo necesites. 📚✨",
    "📚 Tu acceso es permanente, así que no hay límite de tiempo para descargar los archivos. Puedes hacerlo cuando lo necesites. ⏰✨"
  ]);
}

function respuestaLibro() {
  return elegirAleatoria([
    "💛 No. Recibes una biblioteca digital completa con cuadernillos, actividades y diferentes recursos organizados por categorías. 📚🧩",
    "📚 No es solo un libro. Recibes una biblioteca digital completa con cuadernillos, actividades y distintos recursos organizados por categorías. 💛🧩",
    "💛 Recibes mucho más que un solo libro: es una biblioteca digital con cuadernillos, actividades y diferentes recursos organizados por categorías. 📚✨"
  ]);
}

function respuestaKitAntipantallas() {
  return elegirAleatoria([
    "🎨 El Kit Anti-Pantallas incluye juegos, desafíos, recortables, motricidad, inteligencia emocional, coloreables, cuadernillos y más de 500 actividades, además de todos los bonos. 🎁✨",
    "🎨 Incluye juegos, desafíos, recortables, motricidad, inteligencia emocional, coloreables, cuadernillos y más de 500 actividades, además de todos los bonos. 🎁✨",
    "💛 En el Kit Anti-Pantallas encontrarás juegos, desafíos, recortables, motricidad, inteligencia emocional, coloreables, cuadernillos y más de 500 actividades, además de todos los bonos. 🎨🎁"
  ]);
}

function respuestaPequenosGenios() {
  return elegirAleatoria([
    "📚 El Kit Pequeños Genios incluye actividades de Lectoescritura, Pensamiento Matemático y Lógica, listas para imprimir. ✏️🔢🧩",
    "📚 Pequeños Genios incluye actividades listas para imprimir de Lectoescritura, Pensamiento Matemático y Lógica. ✏️🔢🧩",
    "✏️📚 El Kit Pequeños Genios contiene actividades de Lectoescritura, Pensamiento Matemático y Lógica, todas listas para imprimir. 🔢🧩"
  ]);
}

function respuestaPrecio() {
  return elegirAleatoria([
    `💛 El ${NEGOCIO.productos.kitAntipantallas.nombre} cuesta $${NEGOCIO.productos.kitAntipantallas.precio} MXN. También puedes adquirir el ${NEGOCIO.productos.paquetePremium.nombre} por $${NEGOCIO.productos.paquetePremium.precio} MXN. ✨`,
    `💛 El precio del ${NEGOCIO.productos.kitAntipantallas.nombre} es de $${NEGOCIO.productos.kitAntipantallas.precio} MXN y el ${NEGOCIO.productos.paquetePremium.nombre} tiene un costo de $${NEGOCIO.productos.paquetePremium.precio} MXN. ✨`,
    `✨ Puedes elegir el ${NEGOCIO.productos.kitAntipantallas.nombre} por $${NEGOCIO.productos.kitAntipantallas.precio} MXN o el ${NEGOCIO.productos.paquetePremium.nombre} por $${NEGOCIO.productos.paquetePremium.precio} MXN. 💛`
  ]);
}

// ==========================================================
// RESPUESTAS DIRECTAS
// ==========================================================

function respuestaDirecta(mensajeOriginal) {
  const texto =
    normalizarTexto(mensajeOriginal);

  if (!texto) {
    return null;
  }

  // --------------------------------------------------------
  // CONTENIDO DEL PAQUETE PREMIUM
  // --------------------------------------------------------

  const preguntaContenidoPremium =
    contieneAlguna(texto, [
      "que incluye el premium",
      "que incluye premium",
      "que incluye el paquete premium",
      "que contiene el premium",
      "que contiene premium",
      "que contiene el paquete premium",
      "que trae el premium",
      "que trae premium",
      "que trae el paquete premium",
      "contenido del premium",
      "contenido del paquete premium"
    ]);

  if (preguntaContenidoPremium) {
    return {
      intencion: "contenido_paquete_premium",
      paquete_elegido: "ninguno",
      respuesta: respuestaContenidoPremium()
    };
  }

  // --------------------------------------------------------
  // ELECCIÓN PREMIUM
  // --------------------------------------------------------

  const eleccionPremium =
    esIgualAAlguna(texto, [
      "premium",
      "paquete premium",
      "el premium",
      "quiero premium",
      "quiero el premium",
      "quiero el paquete premium",
      "me quedo con premium",
      "me quedo con el premium",
      "me quedo con el paquete premium",
      "prefiero premium",
      "prefiero el premium",
      "prefiero el paquete premium",
      "elijo premium",
      "elijo el premium",
      "elijo el paquete premium",
      "quiero ese premium",
      "quiero ese paquete"
    ]);

  if (eleccionPremium) {
    return {
      intencion: "eleccion_paquete_premium",
      paquete_elegido: "premium",
      respuesta: respuestaEleccionPremium()
    };
  }

  // --------------------------------------------------------
  // ELECCIÓN ANTI-PANTALLAS
  // --------------------------------------------------------

  const eleccionAntipantallas =
    esIgualAAlguna(texto, [
      "anti-pantallas",
      "anti pantallas",
      "antipantallas",
      "kit anti-pantallas",
      "kit anti pantallas",
      "kit antipantallas",
      "quiero anti-pantallas",
      "quiero anti pantallas",
      "quiero antipantallas",
      "quiero el kit anti-pantallas",
      "quiero el kit anti pantallas",
      "quiero el kit antipantallas",
      "me quedo con anti-pantallas",
      "me quedo con anti pantallas",
      "me quedo con antipantallas",
      "prefiero anti-pantallas",
      "prefiero anti pantallas",
      "prefiero antipantallas",
      "elijo anti-pantallas",
      "elijo anti pantallas",
      "elijo antipantallas"
    ]);

  if (eleccionAntipantallas) {
    return {
      intencion: "eleccion_kit_antipantallas",
      paquete_elegido: "antipantallas",
      respuesta: respuestaEleccionAntipantallas()
    };
  }

  const preguntaDosAnos =
    contieneAlguna(texto, [
      "2 años",
      "2 ano",
      "dos años",
      "tiene 2",
      "mi hijo tiene 2",
      "mi hija tiene 2"
    ]);

  if (preguntaDosAnos) {
    return {
      intencion: "edad_2_anos",
      paquete_elegido: "ninguno",
      respuesta: respuestaDosAnos()
    };
  }

  const preguntaGenios =
    contieneAlguna(texto, [
      "genios",
      "pequenos genios",
      "kit pequenos genios",
      "que incluye pequenos genios",
      "que trae pequenos genios",
      "contenido pequenos genios"
    ]);

  if (preguntaGenios) {
    return {
      intencion: "kit_pequenos_genios",
      paquete_elegido: "ninguno",
      respuesta: respuestaPequenosGenios()
    };
  }

  const preguntaFisico =
    contieneAlguna(texto, [
      "fisico",
      "es fisico",
      "material fisico",
      "producto fisico",
      "me llega fisico",
      "es digital",
      "material digital",
      "producto digital",
      "es pdf",
      "formato pdf"
    ]);

  if (preguntaFisico) {
    return {
      intencion: "material_fisico",
      paquete_elegido: "ninguno",
      respuesta: respuestaFisico()
    };
  }

  const preguntaDescarga =
    contieneAlguna(texto, [
      "descarga",
      "descargar",
      "cuanto tiempo tengo para descargar",
      "tiempo para descargar",
      "hay limite para descargar",
      "limite de descarga",
      "puedo descargar despues",
      "cuando puedo descargar"
    ]);

  if (preguntaDescarga) {
    return {
      intencion: "tiempo_descarga",
      paquete_elegido: "ninguno",
      respuesta: respuestaDescarga()
    };
  }

  const preguntaLibro =
    contieneAlguna(texto, [
      "libro",
      "es solo un libro",
      "solo es un libro",
      "un solo libro",
      "cuadernillos",
      "biblioteca digital"
    ]);

  if (preguntaLibro) {
    return {
      intencion: "biblioteca_no_libro",
      paquete_elegido: "ninguno",
      respuesta: respuestaLibro()
    };
  }

  const preguntaEntrega =
    contieneAlguna(texto, [
      "entrega",
      "como se entrega",
      "como lo recibo",
      "como recibo",
      "cuando lo recibo",
      "cuando me llega",
      "cuanto tarda",
      "cuanto tarda en llegar",
      "despues del pago",
      "despues de pagar",
      "despues de realizar el pago",
      "guia de acceso",
      "como llega",
      "donde lo recibo"
    ]);

  if (preguntaEntrega) {
    return {
      intencion: "entrega",
      paquete_elegido: "ninguno",
      respuesta: respuestaEntrega()
    };
  }

  const preguntaSeguridad =
    contieneAlguna(texto, [
      "seguro",
      "es seguro",
      "compra segura",
      "es confiable",
      "confiable",
      "puedo confiar",
      "como se que me llega",
      "como se que lo recibire",
      "es real",
      "estafa",
      "fraude"
    ]);

  if (preguntaSeguridad) {
    return {
      intencion: "seguridad_compra",
      paquete_elegido: "ninguno",
      respuesta: respuestaSeguridad()
    };
  }

  const preguntaPrecio =
    contieneAlguna(texto, [
      "precio",
      "cuanto cuesta",
      "cuanto vale",
      "costo",
      "que precio tiene",
      "cuanto sale",
      "precio del kit",
      "precio del paquete",
      "$99",
      "$130"
    ]);

  if (preguntaPrecio) {
    return {
      intencion: "precio",
      paquete_elegido: "ninguno",
      respuesta: respuestaPrecio()
    };
  }

  const preguntaActividades =
    contieneAlguna(texto, [
      "actividades",
      "que incluye el kit antipantallas",
      "que incluye el kit anti pantallas",
      "que trae el kit antipantallas",
      "que trae el kit anti pantallas",
      "contenido del kit antipantallas",
      "contenido del kit anti pantallas",
      "que viene en el kit"
    ]);

  if (preguntaActividades) {
    return {
      intencion: "contenido_kit_antipantallas",
      paquete_elegido: "ninguno",
      respuesta: respuestaKitAntipantallas()
    };
  }

  const preguntaDatosPago =
    contieneAlguna(texto, [
      "numero de cuenta",
      "numero para transferir",
      "datos bancarios",
      "datos de transferencia",
      "cuenta bancaria",
      "a que cuenta",
      "cual es la cuenta",
      "pasame la cuenta",
      "mandame la cuenta",
      "clabe",
      "tarjeta para depositar",
      "numero de tarjeta",
      "codigo de oxxo",
      "qr de oxxo",
      "codigo para oxxo"
    ]);

  if (preguntaDatosPago) {
    return {
      intencion: "datos_pago_por_confirmar",
      paquete_elegido: "ninguno",
      respuesta: respuestaDatosPagoNoDisponibles()
    };
  }

  const preguntaPago =
    contieneAlguna(texto, [
      "pago",
      "metodo de pago",
      "metodos de pago",
      "forma de pago",
      "formas de pago",
      "como puedo pagar",
      "como pago",
      "donde pago",
      "transferencia",
      "transferencia bancaria",
      "oxxo",
      "deposito en oxxo"
    ]);

  if (preguntaPago) {
    return {
      intencion: "metodos_pago",
      paquete_elegido: "ninguno",
      respuesta: respuestaMetodosPago()
    };
  }

  return null;
}

// ==========================================================
// RUTAS
// ==========================================================

app.get("/", (req, res) => {
  return res
    .status(200)
    .send(
      "Agente de Enseña Sin Estrés activo ✅"
    );
});

app.post("/mensaje", async (req, res) => {
  try {
    const mensaje =
      req.body?.texto ??
      req.body?.mensaje ??
      req.body?.message ??
      "";

    const textoUsuario =
      String(mensaje ?? "").trim();

    console.log(
      "Mensaje recibido:",
      textoUsuario
        ? `[contenido recibido: ${textoUsuario.length} caracteres]`
        : "[vacío]"
    );

    if (!textoUsuario) {
      return res.json({
        respuesta:
          "Estoy aquí para ayudarte 😊\n\nPuedes escribirme tu duda sobre el Kit Anti-Pantallas, el Paquete Premium, la entrega o las formas de pago. 💛",
        paquete_elegido: "ninguno"
      });
    }

    const directa =
      respuestaDirecta(textoUsuario);

    if (directa) {
      const noAgregarCierre =
        directa.intencion === "datos_pago_por_confirmar" ||
        directa.intencion === "eleccion_paquete_premium" ||
        directa.intencion === "eleccion_kit_antipantallas";

      const respuestaFinal =
        noAgregarCierre
          ? limpiarRespuesta(directa.respuesta)
          : agregarCierre(
              directa.respuesta,
              textoUsuario
            );

      console.log(
        "Intención detectada:",
        directa.intencion
      );

      console.log(
        "Paquete elegido:",
        directa.paquete_elegido || "ninguno"
      );

      return res.json({
        respuesta: respuestaFinal,
        paquete_elegido:
          directa.paquete_elegido || "ninguno"
      });
    }

    try {
      const response =
        await openai.responses.create({
          model: "gpt-4.1-mini",
          temperature: 0.3,
          input: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: textoUsuario
            }
          ]
        });

      const respuestaIA =
        limpiarRespuesta(
          response.output_text || ""
        );

      const respuestaBase =
        respuestaIA ||
        "Necesito confirmar ese dato con el equipo para darte información correcta. 💛";

      const respuestaFinal =
        agregarCierre(
          respuestaBase,
          textoUsuario
        );

      return res.json({
        respuesta: respuestaFinal,
        paquete_elegido: "ninguno"
      });
    } catch (openaiError) {
      console.error(
        "Error de OpenAI en /mensaje:",
        openaiError.message
      );

      return res.status(200).json({
        respuesta:
          "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 💛",
        paquete_elegido: "ninguno"
      });
    }
  } catch (error) {
    console.error(
      "Error en /mensaje:",
      error.message
    );

    return res.status(200).json({
      respuesta:
        "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 💛",
      paquete_elegido: "ninguno"
    });
  }
});

// ==========================================================
// MANEJO DE ERRORES
// ==========================================================

app.use((error, req, res, next) => {
  console.error(
    "Error no controlado:",
    error.message
  );

  return res.status(200).json({
    respuesta:
      "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 💛",
    paquete_elegido: "ninguno"
  });
});

// ==========================================================
// INICIAR SERVIDOR
// ==========================================================

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );
});
