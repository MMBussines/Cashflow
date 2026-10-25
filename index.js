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
  nombre: "El Espacio de Mamá",
  agente: "Cris",
  lema: "Acompañando tu maternidad paso a paso",
  publico: "Mamás con bebés pequeños, especialmente mamás primerizas",

  productos: {
    kitMaternidad: {
      nombre: "Kit Maternidad",
      precio: 100
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

const SYSTEM_PROMPT = [
  "Eres Cris, asistente de soporte de El Espacio de Mamá.",
  "",
  "Tu trabajo es atender por WhatsApp a mamás interesadas en el Kit Maternidad y el Paquete Premium.",
  "",
  "Tu personalidad es cálida, cercana, clara, profesional y humana.",
  "Hablas como una persona real por WhatsApp.",
  "",
  "REGLAS DE ESTILO:",
  "",
  "- Responde siempre en español.",
  "- Utiliza párrafos cortos y fáciles de leer.",
  "- Deja una línea en blanco entre ideas cuando ayude a la lectura.",
  "- Usa emojis de forma moderada. 💗👶✨",
  "- Evita bloques largos de texto.",
  "- No repitas información innecesariamente.",
  "- No saludes nuevamente si la conversación ya comenzó.",
  "- No hagas preguntas abiertas innecesarias.",
  "- Responde directamente la duda de la clienta.",
  "- No uses Markdown como encabezados con símbolos #.",
  "- No digas que eres una inteligencia artificial.",
  "- No presiones a la clienta.",
  "- No satures con información que no haya solicitado.",
  "- Puedes usar expresiones naturales como mamita, nena, hermana, mira o te cuento, pero sin repetirlas de forma mecánica.",
  "",
  "REGLAS OBLIGATORIAS:",
  "",
  "- Utiliza exclusivamente la información oficial incluida en esta base de conocimiento.",
  "- No inventes información.",
  "- No inventes precios, promociones, productos, beneficios, garantías, políticas, tiempos, enlaces, cuentas bancarias, números de tarjeta, CLABE, referencias de pago ni instrucciones que no estén autorizadas aquí.",
  "- No contradigas los precios, condiciones, forma de entrega ni métodos de pago oficiales.",
  "- Si no existe información suficiente para responder, indica de manera natural que necesitas confirmar ese dato con el equipo.",
  "- Nunca asegures algo que no aparezca expresamente en esta información oficial.",
  "- Una pregunta sobre un producto NO significa que la clienta ya lo eligió.",
  "- Solo considera una elección de paquete cuando el mensaje confirme claramente que quiere o prefiere ese paquete.",
  "",
  "SEGURIDAD Y SALUD:",
  "",
  "- El material es informativo y de acompañamiento.",
  "- No sustituye la valoración, diagnóstico ni indicaciones de un pediatra u otro profesional de la salud.",
  "- No prometas que una guía resolverá problemas de sueño, cólicos, alimentación, lactancia o salud.",
  "- No prometas noches completas de sueño ni resultados garantizados.",
  "- Si la consulta describe síntomas preocupantes, una emergencia o pide diagnóstico o tratamiento, recomienda consultar a un profesional de salud.",
  "",
  "INFORMACIÓN OFICIAL DEL NEGOCIO:",
  "",
  "Nombre del negocio: El Espacio de Mamá.",
  "Lema: Acompañando tu maternidad paso a paso.",
  "Nombre del agente: Cris.",
  "",
  "La oferta está dirigida a mamás con bebés pequeños, con especial conexión con mamás primerizas, sin excluir a quienes ya tienen otros hijos.",
  "",
  "PRODUCTOS Y PRECIOS:",
  "",
  "- Kit Maternidad: $100 MXN.",
  "- Paquete Premium: $130 MXN.",
  "",
  "MÉTODOS DE PAGO:",
  "",
  "- Transferencia bancaria.",
  "- Depósito en OXXO.",
  "",
  "No tienes datos bancarios, números de cuenta, CLABE, tarjeta, QR ni referencias de pago autorizados dentro de esta base.",
  "Si la clienta solicita alguno de esos datos específicos, indica que necesitas confirmar ese dato con el equipo.",
  "",
  "KIT MATERNIDAD — $100 MXN:",
  "",
  "Es un paquete digital de acompañamiento para maternidad que incluye cuatro archivos PDF:",
  "",
  "1. El Arte de Dormir a tu Bebé:",
  "- Rutinas de sueño.",
  "- Despertares nocturnos.",
  "- Organización de siestas.",
  "- Hábitos y ambiente de descanso.",
  "",
  "2. Cólicos en Bebés:",
  "- Información sobre señales del cólico.",
  "- Posibles razones del llanto.",
  "- Diferencias entre causas de malestar.",
  "- Formas de reconfortar al bebé.",
  "- Es material informativo, no diagnóstico ni tratamiento médico.",
  "",
  "3. Manual de Cuidados / El Manual de la Mamá Novata:",
  "- Cuidados del recién nacido.",
  "- Higiene.",
  "- Baño.",
  "- Cambio de pañales.",
  "- Conexión piel con piel.",
  "- Temas de cuidado general.",
  "",
  "4. BONO GRATIS — Guía de Relajación para Madres Estresadas:",
  "- Ejercicios de respiración.",
  "- Técnicas de relajación.",
  "- Rutinas para descansar.",
  "- Manejo del estrés.",
  "- Sugerencias para buscar apoyo.",
  "",
  "El Kit Maternidad cuesta $100 MXN, pago único.",
  "",
  "ENTREGA DEL KIT MATERNIDAD:",
  "",
  "Después de comprobar el pago, los cuatro PDF se envían digitalmente por WhatsApp.",
  "No es un producto físico.",
  "",
  "PAQUETE PREMIUM — $130 MXN:",
  "",
  "Incluye el contenido del Kit Maternidad y recursos adicionales organizados por temas:",
  "",
  "- Sueño y descanso ampliado: recursos de sueño y masajes para el bebé.",
  "- Lactancia materna: información práctica.",
  "- Seguridad y prevención: cuidados y prevención de accidentes.",
  "- Alimentación complementaria y BLW: guías para esta etapa.",
  "- Recetarios: papillas y recetas para bebés.",
  "",
  "Entre los recursos del Paquete Premium se encuentran:",
  "- Super Baby Dormilón.",
  "- 6 Técnicas de Masajes.",
  "- Lactancia Exitosa.",
  "- Prevención Muerte Infantil / Accidentes.",
  "- Alimentación Complementaria Perfecta.",
  "- Rechazos Alimentarios.",
  "- Sin Dientes y a Bocados.",
  "- Método BLW con un Presupuesto Limitado.",
  "- Recetarios para bebés.",
  "",
  "El Paquete Premium cuesta $130 MXN.",
  "",
  "ENTREGA DEL PAQUETE PREMIUM:",
  "",
  "Una vez confirmado el pago, se entrega acceso digital a los recursos organizados por tema.",
  "",
  "FORMATO:",
  "",
  "Los materiales son digitales.",
  "El Kit Maternidad se entrega en archivos PDF.",
  "No se envía material físico.",
  "",
  "ACCESO Y GARANTÍAS:",
  "",
  "No hay una duración de acceso, política de garantía o reembolso autorizada dentro de esta base de conocimiento.",
  "Si la clienta pregunta por esos puntos, indica que necesitas confirmarlos con el equipo.",
  "",
  "ELECCIÓN DE PAQUETE:",
  "",
  "Si la clienta confirma que desea el Paquete Premium, reconoce su elección y guíala a elegir método de pago:",
  "- Transferencia bancaria.",
  "- Depósito en OXXO.",
  "",
  "Si la clienta confirma que desea el Kit Maternidad, reconoce su elección y guíala a elegir método de pago:",
  "- Transferencia bancaria.",
  "- Depósito en OXXO.",
  "",
  "OBJETIVO DE LA CONVERSACIÓN:",
  "",
  "- Atender dudas de forma breve y clara.",
  "- Explicar qué incluye cada opción.",
  "- Presentar las dos opciones disponibles.",
  "- Guiar al siguiente paso de compra cuando corresponda.",
  "",
  "El siguiente paso puede ser:",
  "- Elegir entre Kit Maternidad y Paquete Premium.",
  "- Elegir entre transferencia bancaria y depósito en OXXO.",
  "- Continuar con el proceso para completar su acceso.",
  "",
  "CIERRE COMERCIAL:",
  "",
  "- Agrega un cierre comercial únicamente cuando resulte natural y útil.",
  "- No agregues un cierre de compra automáticamente a todas las respuestas.",
  "- Si la clienta pregunta por precio, contenido, opciones de compra o métodos de pago, puedes guiarla al siguiente paso.",
  "- Si solo hace una duda informativa, responde primero la duda sin presionarla."
].join("\n");

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
    "💗 ¿Cuál prefieres: Kit Maternidad por $100 MXN o Paquete Premium por $130 MXN?",
    "😊 Si deseas continuar, ¿cuál opción prefieres: Kit Maternidad o Paquete Premium?",
    "✨ ¿Te gustaría continuar con el Kit Maternidad o con el Paquete Premium?"
  ]);
}

function cierreMetodoPago() {
  return elegirAleatoria([
    "💳 Puedes continuar por transferencia bancaria 🏦 o depósito en OXXO 🏪. ¿Cuál prefieres? 😊",
    "💗 Para continuar, puedes elegir transferencia bancaria 🏦 o depósito en OXXO 🏪. ¿Cuál opción prefieres?",
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
      "kit maternidad",
      "maternidad",
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
  const respuestaLimpia = limpiarRespuesta(respuesta);

  if (!respuestaLimpia) {
    return "Necesito confirmar ese dato con el equipo para darte información correcta. 💗";
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

  return respuestaLimpia + "\n\n" + cierre;
}

// ==========================================================
// RESPUESTAS OFICIALES REUTILIZABLES
// ==========================================================

function respuestaEleccionPremium() {
  return elegirAleatoria([
    "💗 ¡Excelente elección! Elegiste el Paquete Premium por $130 MXN. ✨\n\n💳 ¿Cómo prefieres realizar tu pago: transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "✨ Perfecto, elegiste el Paquete Premium por $130 MXN. 💗\n\n¿Prefieres realizar tu pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "💗 Perfecto 😊 Continuamos con el Paquete Premium de $130 MXN.\n\n💳 ¿Cómo prefieres pagar: transferencia bancaria 🏦 u OXXO 🏪?"
  ]);
}

function respuestaEleccionMaternidad() {
  return elegirAleatoria([
    "💗 ¡Excelente elección! Elegiste el Kit Maternidad por $100 MXN. ✨\n\n💳 ¿Cómo prefieres realizar tu pago: transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "✨ Perfecto, elegiste el Kit Maternidad por $100 MXN. 💗\n\n¿Prefieres realizar tu pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪?",
    "💗 Perfecto 😊 Continuamos con el Kit Maternidad de $100 MXN.\n\n💳 ¿Cómo prefieres pagar: transferencia bancaria 🏦 u OXXO 🏪?"
  ]);
}

function respuestaContenidoKit() {
  return elegirAleatoria([
    "💗 El Kit Maternidad incluye 4 guías digitales: El Arte de Dormir a tu Bebé, Cólicos en Bebés, Manual de Cuidados para el recién nacido y, como bono, la Guía de Relajación para Madres Estresadas. Todo por $100 MXN.",
    "👶✨ Con el Kit Maternidad recibes 4 PDF: sueño del bebé, cólicos, cuidados del recién nacido y una guía de relajación para mamá. El precio es de $100 MXN.",
    "💗 Son 4 guías digitales pensadas para acompañarte en temas de sueño, cólicos, cuidados cotidianos del bebé y bienestar de mamá. El Kit Maternidad cuesta $100 MXN."
  ]);
}

function respuestaContenidoPremium() {
  return elegirAleatoria([
    "💗 El Paquete Premium incluye todo el Kit Maternidad y recursos adicionales sobre sueño y masajes, lactancia, seguridad y prevención, alimentación complementaria y BLW, además de recetarios para bebés. Su precio es de $130 MXN.",
    "👶✨ Con el Paquete Premium recibes las 4 guías iniciales más materiales organizados por temas: sueño y descanso, lactancia, seguridad, alimentación complementaria, BLW y recetarios. Cuesta $130 MXN.",
    "💗 El Premium reúne el Kit Maternidad y material adicional para distintas etapas: sueño, masajes, lactancia, prevención, alimentación complementaria, BLW y recetas para bebés. Todo por $130 MXN."
  ]);
}

function respuestaDatosPagoNoDisponibles() {
  return elegirAleatoria([
    "💗 Para darte los datos correctos de transferencia u OXXO, necesito confirmar esa información con el equipo.",
    "😊 Necesito confirmar con el equipo los datos específicos de pago para compartirte la información correcta. 💗",
    "💗 Los datos específicos de cuenta, CLABE, tarjeta, código o QR no están disponibles en mi información autorizada. Necesito confirmarlos con el equipo."
  ]);
}

function respuestaMetodosPago() {
  return elegirAleatoria([
    "💳 Puedes realizar tu pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪✨.",
    "💗 Aceptamos pago mediante transferencia bancaria 🏦 o depósito en OXXO 🏪✨.",
    "😊 Puedes pagar por transferencia bancaria 🏦 o mediante depósito en OXXO 🏪. 💳✨"
  ]);
}

function respuestaEntrega() {
  return elegirAleatoria([
    "📲 Una vez confirmado tu pago, la entrega es digital. Si eliges el Kit Maternidad, recibes los 4 PDF por WhatsApp. 💗✨",
    "💗 Después de comprobar tu pago, recibes tu material de forma digital. El Kit Maternidad se envía directamente por WhatsApp. 📲",
    "📄✨ Al confirmarse tu pago, recibes el material digital correspondiente a tu paquete. El Kit Maternidad se entrega por WhatsApp."
  ]);
}

function respuestaFormato() {
  return elegirAleatoria([
    "📲 Es material digital, no físico. El Kit Maternidad se entrega en archivos PDF. 💗",
    "💗 Todo el material es digital. No se envían libros ni productos físicos. 📄✨",
    "📄 El material se entrega digitalmente; el Kit Maternidad está compuesto por archivos PDF."
  ]);
}

function respuestaAccesoNoConfirmado() {
  return elegirAleatoria([
    "💗 Para no darte información incorrecta, necesito confirmar con el equipo la duración exacta del acceso.",
    "😊 La duración específica del acceso no está confirmada en mi información autorizada. Necesito validarla con el equipo. 💗",
    "💗 Necesito confirmar con el equipo ese dato antes de decirte una duración de acceso."
  ]);
}

function respuestaGarantiaNoConfirmada() {
  return elegirAleatoria([
    "💗 La política específica de garantía o reembolso necesito confirmarla con el equipo para darte la información correcta.",
    "😊 No tengo autorizada una política de garantía o reembolso dentro de mi información. Necesito confirmarla con el equipo. 💗"
  ]);
}

function respuestaPrecio() {
  return elegirAleatoria([
    "💗 El Kit Maternidad cuesta $100 MXN y el Paquete Premium cuesta $130 MXN. ✨",
    "✨ Puedes elegir el Kit Maternidad por $100 MXN o el Paquete Premium por $130 MXN. 💗",
    "💗 Tenemos dos opciones: Kit Maternidad $100 MXN y Paquete Premium $130 MXN."
  ]);
}

function respuestaSueno() {
  return elegirAleatoria([
    "🌙 La guía El Arte de Dormir a tu Bebé aborda rutinas de sueño, despertares nocturnos, siestas, hábitos y ambiente de descanso. Es información de acompañamiento y no promete resultados garantizados.",
    "💗 Dentro del Kit Maternidad tienes una guía sobre sueño del bebé con información para organizar rutinas, siestas, hábitos y ambiente de descanso. 🌙"
  ]);
}

function respuestaColicos() {
  return elegirAleatoria([
    "👶 La guía Cólicos en Bebés reúne información sobre señales del cólico, posibles razones del llanto y formas de reconfortar al bebé. Es material informativo y no sustituye una valoración médica.",
    "💗 Sí, el Kit incluye una guía sobre cólicos y llanto del bebé, con información práctica y formas de acompañarlo. No es diagnóstico ni tratamiento médico."
  ]);
}

function respuestaCuidados() {
  return elegirAleatoria([
    "🍼 El Manual de Cuidados aborda cuidados del recién nacido, higiene, baño, pañales, conexión piel con piel y temas cotidianos de cuidado.",
    "💗 Incluye un manual para mamás con información sobre higiene, baño, pañales, piel con piel y cuidados generales del recién nacido."
  ]);
}

function respuestaRelajacionMama() {
  return elegirAleatoria([
    "💗 También recibes como bono una Guía de Relajación para Madres Estresadas con ejercicios de respiración, técnicas de relajación, rutinas de descanso y sugerencias para buscar apoyo.",
    "✨ El bono para mamá incluye respiración, relajación, ideas para descansar y herramientas de manejo del estrés. 💗"
  ]);
}

// ==========================================================
// RESPUESTAS DIRECTAS
// ==========================================================

function respuestaDirecta(mensajeOriginal) {
  const texto = normalizarTexto(mensajeOriginal);

  if (!texto) {
    return null;
  }

  const preguntaContenidoPremium =
    contieneAlguna(texto, [
      "que incluye el premium",
      "que incluye premium",
      "que incluye el paquete premium",
      "que contiene el premium",
      "que contiene el paquete premium",
      "que trae el premium",
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
      "paq premium",
      "paq premium 130"
    ]);

  if (eleccionPremium) {
    return {
      intencion: "eleccion_paquete_premium",
      paquete_elegido: "premium",
      respuesta: respuestaEleccionPremium()
    };
  }

  const eleccionMaternidad =
    esIgualAAlguna(texto, [
      "maternidad",
      "kit maternidad",
      "kit de maternidad",
      "quiero maternidad",
      "quiero el kit maternidad",
      "quiero el kit de maternidad",
      "me quedo con maternidad",
      "me quedo con el kit maternidad",
      "prefiero maternidad",
      "prefiero el kit maternidad",
      "elijo maternidad",
      "elijo el kit maternidad",
      "kit maternidad 100"
    ]);

  if (eleccionMaternidad) {
    return {
      intencion: "eleccion_kit_maternidad",
      paquete_elegido: "maternidad",
      respuesta: respuestaEleccionMaternidad()
    };
  }

  const preguntaContenidoKit =
    contieneAlguna(texto, [
      "que incluye el kit maternidad",
      "que incluye maternidad",
      "que contiene el kit maternidad",
      "que contiene maternidad",
      "que trae el kit maternidad",
      "contenido del kit maternidad",
      "que viene en el kit",
      "que son las 4 guias",
      "cuales son las guias"
    ]);

  if (preguntaContenidoKit) {
    return {
      intencion: "contenido_kit_maternidad",
      paquete_elegido: "ninguno",
      respuesta: respuestaContenidoKit()
    };
  }

  const preguntaSueno =
    contieneAlguna(texto, [
      "sueno",
      "dormir",
      "duerme",
      "siestas",
      "despertares",
      "arte de dormir"
    ]);

  if (preguntaSueno) {
    return {
      intencion: "guia_sueno",
      paquete_elegido: "ninguno",
      respuesta: respuestaSueno()
    };
  }

  const preguntaColicos =
    contieneAlguna(texto, [
      "colicos",
      "colico",
      "llanto",
      "llora mucho"
    ]);

  if (preguntaColicos) {
    return {
      intencion: "guia_colicos",
      paquete_elegido: "ninguno",
      respuesta: respuestaColicos()
    };
  }

  const preguntaCuidados =
    contieneAlguna(texto, [
      "cuidados",
      "recien nacido",
      "higiene",
      "bano",
      "pañales",
      "panales",
      "piel con piel",
      "mama novata"
    ]);

  if (preguntaCuidados) {
    return {
      intencion: "guia_cuidados",
      paquete_elegido: "ninguno",
      respuesta: respuestaCuidados()
    };
  }

  const preguntaRelajacion =
    contieneAlguna(texto, [
      "relajacion",
      "estres",
      "estresada",
      "ansiedad de mama",
      "descansar mama",
      "bono para mama"
    ]);

  if (preguntaRelajacion) {
    return {
      intencion: "guia_relajacion_mama",
      paquete_elegido: "ninguno",
      respuesta: respuestaRelajacionMama()
    };
  }

  const preguntaFormato =
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

  if (preguntaFormato) {
    return {
      intencion: "formato_digital",
      paquete_elegido: "ninguno",
      respuesta: respuestaFormato()
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
      "despues del pago",
      "despues de pagar",
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

  const preguntaAcceso =
    contieneAlguna(texto, [
      "acceso de por vida",
      "acceso para siempre",
      "cuanto dura el acceso",
      "duracion del acceso",
      "cuanto tiempo tengo acceso"
    ]);

  if (preguntaAcceso) {
    return {
      intencion: "acceso_por_confirmar",
      paquete_elegido: "ninguno",
      respuesta: respuestaAccesoNoConfirmado()
    };
  }

  const preguntaGarantia =
    contieneAlguna(texto, [
      "garantia",
      "reembolso",
      "devolucion",
      "devolver dinero"
    ]);

  if (preguntaGarantia) {
    return {
      intencion: "garantia_por_confirmar",
      paquete_elegido: "ninguno",
      respuesta: respuestaGarantiaNoConfirmada()
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
      "$100",
      "$130",
      "100 pesos",
      "130 pesos"
    ]);

  if (preguntaPrecio) {
    return {
      intencion: "precio",
      paquete_elegido: "ninguno",
      respuesta: respuestaPrecio()
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
      "Agente de El Espacio de Mamá activo ✅"
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
        ? "[contenido recibido: " + textoUsuario.length + " caracteres]"
        : "[vacío]"
    );

    if (!textoUsuario) {
      return res.json({
        respuesta:
          "Estoy aquí para ayudarte 😊\n\nPuedes escribirme tu duda sobre el Kit Maternidad, el Paquete Premium, la entrega o las formas de pago. 💗",
        paquete_elegido: "ninguno"
      });
    }

    const directa =
      respuestaDirecta(textoUsuario);

    if (directa) {
      const noAgregarCierre =
        directa.intencion === "datos_pago_por_confirmar" ||
        directa.intencion === "acceso_por_confirmar" ||
        directa.intencion === "garantia_por_confirmar" ||
        directa.intencion === "eleccion_paquete_premium" ||
        directa.intencion === "eleccion_kit_maternidad";

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
        "Necesito confirmar ese dato con el equipo para darte información correcta. 💗";

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
          "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 💗",
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
        "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 💗",
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
      "En este momento no pude procesar tu mensaje. Por favor, inténtalo nuevamente en unos minutos. 💗",
    paquete_elegido: "ninguno"
  });
});

// ==========================================================
// INICIAR SERVIDOR
// ==========================================================

app.listen(PORT, () => {
  console.log(
    "Servidor corriendo en puerto " + PORT
  );
});
