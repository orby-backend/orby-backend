require("dotenv").config();
const express = require("express");

// Se importa askGemini y CALENDLY_LINK desde gemini.js
const { askGemini, CALENDLY_LINK } = require("./services/gemini");
const { getUser, saveUser, resetUser } = require("./services/state");
const { detectIntent } = require("./services/intentDetector");
const { memberships } = require("./data/memberships");
const {
  logLeadEvent,
  logErrorEvent
} = require("./services/logger");

// Módulos de Flow
const { handleImportacionFlow } = require("./services/flows/importacion");
const { handleAmazonFlow } = require("./services/flows/amazon");
const { handleClubFlow } = require("./services/flows/club");
const { handleExportacionFlow } = require("./services/flows/exportacion");
const { handleFeriasFlow } = require("./services/flows/ferias");
const { handleAsesoriaFlow } = require("./services/flows/asesoria");
const { handleExploracionFlow } = require("./services/flows/exploracion");
const { handleDigitalFlow } = require("./services/flows/digital");

const {
  getImportLeadCuriosoReply,
  getImportLeadTibioReply,
  getImportLeadCalificadoReply,
  getImportAdvisorConfirmationReply,
  getImportAdvisorAskNewPhoneReply,
  getImportAdvisorAskScheduleReply,
  getImportAdvisorFinalReply,
  getImportMeetingReply,
  isLikelyPhoneNumber
} = require("./services/modules/importacion");

const {
  getMenu,
  getImportacionIntro,
  getImportacionCaso1,
  getImportacionCaso2,
  getImportacionCaso3,
  getImportacionInfoGeneral,
  getAmazonIntro,
  getAmazonCaso1,
  getAmazonCaso2,
  getAmazonCaso3,
  getAmazonInfoGeneral,
  getAmazonPreguntaFinal,
  getClubIntro,
  getClubCaso1,
  getClubCaso2,
  getClubCaso3,
  getClubInfoGeneral,
  getClubPreguntaFinal,
  getExportacionIntro,
  getExportacionCaso1,
  getExportacionCaso2,
  getExportacionCaso3,
  getExportacionInfoGeneral,
  getExportacionPreguntaFinal,
  getFeriasIntro,
  getFeriasCaso1,
  getFeriasCaso2,
  getFeriasCaso3,
  getFeriasInfoGeneral,
  getFeriasPreguntaFinal,
  getDigitalIntro,
  getDigitalCrearTiendaPaso2,
  getDigitalCrearTiendaPaso3,
  getDigitalPreguntaIntencion,
  getDigitalMejorarTiendaPaso2,
  getDigitalMejorarTiendaPaso3,
  getDigitalIAPaso2,
  getDigitalMarketingPaso2,
  getDigitalMarketingPaso3,
  getDigitalInfoGeneral,
  getAsesoriaIntro,
  getAsesoriaCaso1,
  getAsesoriaCaso2,
  getAsesoriaCaso3,
  getAsesoriaPreguntaFinal,
  getAtencionClienteIntro,
  getAtencionClienteConfirmacion,
  getLeadCuriosoReply,
  getLeadTibioReply,
  getLeadCalificadoReply
} = require("./services/menu");

const app = express();
app.use(express.json());

const CLUB_GENERAL_LINK =
  "https://oneorbix.com/club-de-exportadores-e-importadores-oneorbix/";

// ========================================================
// HELPERS DE TEXTO Y NAVEGACIÓN
// ========================================================
function normalizeText(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function isMenuCommand(cleanMessage = "") {
  return cleanMessage === "menu";
}

function isRestartCommand(cleanMessage = "") {
  return cleanMessage === "reiniciar";
}

function isBackCommand(cleanMessage = "") {
  return cleanMessage === "atras" || cleanMessage === "atrás";
}

function isFinalState(estado = "") {
  return [
    "lead_curioso",
    "lead_tibio",
    "lead_calificado",
    "digital_lead_calificado"
  ].includes(estado) || String(estado).endsWith("_lead_calificado");
}

function isConversationalState(estado = "") {
  return [
    "lead_curioso",
    "lead_tibio",
    "lead_calificado",
    "digital_lead_calificado"
  ].includes(estado) || String(estado).endsWith("_lead_calificado");
}

function isFreeTextMessage(cleanMessage = "") {
  if (!cleanMessage) return false;
  if (
    isMenuCommand(cleanMessage) ||
    isRestartCommand(cleanMessage) ||
    isBackCommand(cleanMessage)
  ) {
    return false;
  }
  if (isClosedOption(cleanMessage)) return false;
  return true;
}

function appendNavigationHint(reply) {
  return `${reply}\n\nSi quieres ver otras opciones, escribe MENU.\nSi quieres empezar de cero, escribe REINICIAR.\nSi quieres volver al paso anterior dentro del Club, escribe ATRAS.`;
}

function shouldAppendNavigationHint(reply, user) {
  const text = String(reply || "");

  if (!text.trim()) return false;
  if (
    text.includes("escribe MENU") ||
    text.includes("escribe REINICIAR") ||
    text.includes("escribe ATRAS")
  ) {
    return false;
  }

  if (text.includes(CALENDLY_LINK)) return true;
  if (isFinalState(user?.estado)) return true;

  const finalReplyPatterns = [
    /hemos tomado tu solicitud/i,
    /te contactara/i,
    /te contactará/i,
    /horario solicitado/i,
    /en breve estaremos contigo/i,
    /aqui tienes el enlace para agendar/i,
    /aquí tienes el enlace para agendar/i,
    /reunion via meeting/i,
    /reunión vía meeting/i
  ];

  return finalReplyPatterns.some((pattern) => pattern.test(text));
}

function decorateReplyPayload(payload, phone) {
  if (!payload || typeof payload !== "object") return payload;
  if (!payload.reply || typeof payload.reply !== "string") return payload;

  const latestUser = phone ? getUser(phone) : null;

  if (shouldAppendNavigationHint(payload.reply, latestUser)) {
    return {
      ...payload,
      reply: appendNavigationHint(payload.reply)
    };
  }

  return payload;
}

function createNewUser() {
  return {
    estado: "menu_enviado",
    score: 0,
    interes_principal: null,
    subopcion: null,
    detalle_importacion: null,
    callback_phone: null,
    callback_schedule: null,
    origen: "manual"
  };
}

function classifyLead(user) {
  if (user.score >= 10) return "lead_calificado";
  if (user.score >= 5) return "lead_tibio";
  return "lead_curioso";
}

function isClosedOption(cleanMessage) {
  return ["1", "2", "3", "4", "5", "6", "7", "8"].includes(cleanMessage);
}

function isKnownBackendIntent(intent = "") {
  return intent && intent !== "general_service_question";
}

function isDigitalIntent(intent = "") {
  return String(intent).startsWith("digital_");
}

function isClubIntent(intent = "") {
  return [
    "show_plans",
    "payment_help",
    "basic_plan_link",
    "professional_plan_link",
    "premium_plan_link",
    "basic_plan_payment",
    "professional_plan_payment",
    "premium_plan_payment",
    "basic_plan_details",
    "professional_plan_details",
    "premium_plan_details",
    "basic_plan_price",
    "professional_plan_price",
    "premium_plan_price",
    "whatsapp_support_plan",
    "supplier_verification_plan",
    "monthly_advisory_plan",
    "experienced_recommendation",
    "beginner_recommendation",
    "validated_product_recommendation",
    "personal_use_recommendation",
    "scaling_recommendation",
    "compare_plans",
    "basic_vs_professional",
    "professional_vs_premium",
    "recommend_plan",
    "price_objection",
    "value_question",
    "buy_signal",
    "schedule_call",
    "not_ready_yet"
  ].includes(intent);
}

function shouldUseGemini(user, cleanMessage, rawMessage) {
  if (!user) return false;
  if (!isFreeTextMessage(cleanMessage)) return false;

  const detectedIntent = detectIntent(rawMessage);

  if (isKnownBackendIntent(detectedIntent)) {
    return false;
  }

  if (isConversationalState(user.estado)) {
    return true;
  }

  if (user.interes_principal && isFreeTextMessage(cleanMessage)) {
    return true;
  }

  return false;
}

async function getGeminiReplyWithFallback(prompt, user, fallbackReply) {
  try {
    const aiReply = await askGemini(prompt, user);
    if (!aiReply || typeof aiReply !== "string" || !aiReply.trim()) {
      return fallbackReply;
    }
    return aiReply.trim();
  } catch (error) {
    console.error("Error obteniendo respuesta de Gemini:", error);
    return fallbackReply;
  }
}

// ========================================================
// HELPERS CLUB
// ========================================================
function buildPlanLine(plan) {
  if (!plan) return "";
  return `• ${plan.nombre} — ${plan.precio}\nVer más: ${plan.link}\nComprar ahora: ${plan.payLink}`;
}

function buildPlansOverviewReply(memberships, intro = "") {
  return `${intro}

Estos son los planes disponibles del Club de Importadores OneOrbix:

${buildPlanLine(memberships?.basico)}

${buildPlanLine(memberships?.profesional)}

${buildPlanLine(memberships?.premium)}

También puedes revisar la página general del club aquí:
${CLUB_GENERAL_LINK}`;
}

function buildPlanDetailsReply(plan, customIntro = "") {
  if (!plan) return "No encontré ese plan en este momento.";
  const includes = Array.isArray(plan.incluye)
    ? plan.incluye.map((item) => `- ${item}`).join("\n")
    : "";

  return `${customIntro}${customIntro ? "\n\n" : ""}${plan.nombre} — ${plan.precio}

Ideal para:
${plan.idealPara}

Incluye:
${includes}

Resumen:
${plan.resumen}

Ver más:
${plan.link}

Comprar ahora:
${plan.payLink}`;
}

function buildPlanPriceReply(plan) {
  if (!plan) return "No encontré ese plan en este momento.";
  return `${plan.nombre} tiene un valor de ${plan.precio}.

Ver detalles:
${plan.link}

Comprar ahora:
${plan.payLink}`;
}

function buildPlanLinkReply(plan) {
  if (!plan) return "No encontré ese plan en este momento.";
  return `Claro. Aquí tienes el enlace de ${plan.nombre}:

${plan.link}

Y si quieres avanzar directamente con la compra:
${plan.payLink}`;
}

function buildPlanPaymentReply(plan) {
  if (!plan) return "No encontré ese plan en este momento.";
  return `Perfecto. Si quieres comprar ${plan.nombre}, aquí tienes el enlace de pago directo:

${plan.payLink}

Y aquí puedes ver más detalles del plan:
${plan.link}`;
}

function buildClubGeneralInfoReply() {
  return `Perfecto. Te explico de forma simple cómo funciona el Club de Importadores OneOrbix:

Es una membresía diseñada para ayudarte a importar con acompañamiento real, evitando errores y mejorando tus resultados desde el inicio.

Dentro del club trabajamos en:

- búsqueda y validación de proveedores
- simulación de costos de importación
- logística desde origen hasta destino
- acceso a carga consolidada
- asesoría paso a paso según tu caso

Nuestras membresías funcionan con un único pago anual, y cada plan incluye beneficios pensados tanto para quienes están empezando como para quienes ya tienen experiencia importando.

Además, durante todo el tiempo de tu membresía cuentas con acompañamiento y asesoría continua para ayudarte a avanzar con mayor claridad y seguridad.

Puedes revisar más aquí:
${CLUB_GENERAL_LINK}

Si quieres, responde:
1. Ver planes disponibles
2. Recomiéndame un plan según mi caso`;
}

function buildClubComparisonReply() {
  return `Perfecto. La diferencia principal entre los planes del Club de Importadores OneOrbix está en el nivel de acompañamiento, herramientas y profundidad del apoyo.

👉 ${memberships?.basico?.nombre}
Es ideal para empezar con una base clara y una inversión más contenida.

👉 ${memberships?.profesional?.nombre}
Es una opción más completa para quienes quieren avanzar con más estructura, herramientas y acompañamiento práctico.

👉 ${memberships?.premium?.nombre}
Es la opción más robusta para quienes buscan apoyo continuo, análisis más profundo y una ejecución más completa.

Puedes ver todos los planes aquí:
${CLUB_GENERAL_LINK}`;
}

function buildClubRecommendationReply(user) {
  const context = user?.club_context || "";

  if (
    [
      "amazon_fba",
      "validated_product",
      "specific_import",
      "supplier_search",
      "sell_ecuador"
    ].includes(context)
  ) {
    return `Por lo que me has compartido, el plan que mejor suele ajustarse a tu caso es:

👉 ${memberships?.profesional?.nombre}

porque te da más estructura, herramientas y acompañamiento práctico para avanzar con claridad.

Ver detalles:
${memberships?.profesional?.link}

Comprar ahora:
${memberships?.profesional?.payLink}`;
  }

  if (
    [
      "costs_optimization",
      "logistics_control",
      "logistics_review",
      "business_structure",
      "experienced_importer"
    ].includes(context)
  ) {
    return `Por el tipo de necesidad que estás describiendo, el plan que mejor suele ajustarse a tu caso es:

👉 ${memberships?.premium?.nombre}

porque está pensado para quienes ya están importando y quieren optimizar costos, logística y operación con más acompañamiento.

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}`;
  }

  return `Perfecto. Si estás empezando o todavía estás aterrizando mejor tu proceso, normalmente el plan que más suele equilibrar claridad y acompañamiento es:

👉 ${memberships?.profesional?.nombre}

Ver detalles:
${memberships?.profesional?.link}

Comprar ahora:
${memberships?.profesional?.payLink}`;
}

function getClubBackNavigation(user) {
  const currentState = String(user?.estado || "");
  const currentContext = String(user?.club_context || "");
  const currentSuboption = String(user?.subopcion || "");

  // Si está en el inicio del club, ATRAS vuelve al menú
  if (currentState === "club_p1") {
    return {
      estado: "menu_enviado",
      reply: `Perfecto 👌\n\nVolvemos al menú principal:\n\n${getMenu()}`
    };
  }

  // Si está en p2, vuelve a p1
  if (currentState === "club_p2") {
    return {
      estado: "club_p1",
      reply: getClubIntro()
    };
  }

  // Si está en p3, vuelve a p2 según subopción
  if (currentState === "club_p3") {
    if (currentSuboption === "cero") {
      return {
        estado: "club_p2",
        reply: getClubCaso1()
      };
    }

    if (currentSuboption === "idea_producto") {
      return {
        estado: "club_p2",
        reply: getClubCaso2()
      };
    }

    if (currentSuboption === "ya_importo") {
      return {
        estado: "club_p2",
        reply: getClubCaso3()
      };
    }
  }

  // General info
  if (currentState === "club_info_general") {
    return {
      estado: "club_p1",
      reply: getClubIntro()
    };
  }

  // Desde cero -> vender
  if (["club_sell_ecuador", "club_sell_amazon"].includes(currentState)) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Quiero vender en Ecuador
2. Quiero vender en Amazon FBA`
    };
  }

  // Desde cero -> uso personal
  if (
    [
      "club_personal_courier_waiting_product",
      "club_personal_courier_result",
      "club_personal_specific_choice"
    ].includes(currentState)
  ) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Quiero traer productos pequeños (casillero / courier)
2. Quiero importar algo específico para mi negocio o uso personal`
    };
  }

  if (
    [
      "club_personal_specific_defined_waiting_product",
      "club_personal_specific_supplier_waiting_product"
    ].includes(currentState)
  ) {
    return {
      estado: "club_personal_specific_choice",
      reply: `Perfecto. Para orientarte mejor, dime:

1. Ya tengo el producto definido
2. Necesito ayuda para encontrar proveedor`
    };
  }

  // Desde cero -> explorando ideas
  if (
    ["club_exploring_suggestions_market", "club_exploring_product_guidance"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Sugerencias de productos
2. Quiero entender mejor qué producto me conviene`
    };
  }

  // Idea producto -> validado
  if (
    ["club_validated_start_waiting_product", "club_validated_help"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. ¿Cómo puedo empezar?
2. ¿Cómo me ayudaría el club en mi caso?`
    };
  }

  // Idea producto -> necesita validar
  if (
    ["club_need_validation_potential", "club_need_validation_review"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Quiero validar si mi idea tiene potencial
2. Quiero entender qué debo revisar antes de importar`
    };
  }

  // Ya importa -> costos
  if (["club_costs_action_waiting_product", "club_costs_value"].includes(currentState)) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Quiero optimizar costos y logística
2. ¿Cómo me ayudaría el club en mi caso específico?`
    };
  }

  // Ya importa -> logística
  if (
    ["club_logistics_control_waiting_mode", "club_logistics_review_waiting_context"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Quiero mejorar tiempos y control logístico
2. Quiero revisar si estoy gestionando bien mi logística actual`
    };
  }

  // Ya importa -> estructura
  if (["club_business_structure_action", "club_business_structure_plan"].includes(currentState)) {
    return {
      estado: "club_p3",
      reply: `Ahora dime:

1. Quiero estructurar mi operación con más claridad
2. Quiero ver qué plan puede ayudarme mejor`
    };
  }

  // fallback suave dentro de club
  if (currentContext || currentSuboption || user?.interes_principal === "club") {
    return {
      estado: "club_p1",
      reply: getClubIntro()
    };
  }

  return null;
}

function routeClubIntent({ detectedIntent, user }) {
  if (!isClubIntent(detectedIntent)) return null;

  switch (detectedIntent) {
    case "show_plans":
      return {
        reply: buildPlansOverviewReply(
          memberships,
          "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
        ),
        source: "backend",
        intent: detectedIntent
      };

    case "payment_help":
      return {
        reply: `Claro. Si quieres comprar una membresía, aquí tienes las opciones disponibles:

${buildPlanLine(memberships?.basico)}

${buildPlanLine(memberships?.profesional)}

${buildPlanLine(memberships?.premium)}

También puedes revisar la página general del club aquí:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    case "basic_plan_link":
      return {
        reply: buildPlanLinkReply(memberships?.basico),
        source: "backend",
        intent: detectedIntent
      };

    case "professional_plan_link":
      return {
        reply: buildPlanLinkReply(memberships?.profesional),
        source: "backend",
        intent: detectedIntent
      };

    case "premium_plan_link":
      return {
        reply: buildPlanLinkReply(memberships?.premium),
        source: "backend",
        intent: detectedIntent
      };

    case "basic_plan_payment":
      return {
        reply: buildPlanPaymentReply(memberships?.basico),
        source: "backend",
        intent: detectedIntent
      };

    case "professional_plan_payment":
      return {
        reply: buildPlanPaymentReply(memberships?.profesional),
        source: "backend",
        intent: detectedIntent
      };

    case "premium_plan_payment":
      return {
        reply: buildPlanPaymentReply(memberships?.premium),
        source: "backend",
        intent: detectedIntent
      };

    case "basic_plan_details":
      return {
        reply: buildPlanDetailsReply(memberships?.basico),
        source: "backend",
        intent: detectedIntent
      };

    case "professional_plan_details":
      return {
        reply: buildPlanDetailsReply(memberships?.profesional),
        source: "backend",
        intent: detectedIntent
      };

    case "premium_plan_details":
      return {
        reply: buildPlanDetailsReply(memberships?.premium),
        source: "backend",
        intent: detectedIntent
      };

    case "basic_plan_price":
      return {
        reply: buildPlanPriceReply(memberships?.basico),
        source: "backend",
        intent: detectedIntent
      };

    case "professional_plan_price":
      return {
        reply: buildPlanPriceReply(memberships?.profesional),
        source: "backend",
        intent: detectedIntent
      };

    case "premium_plan_price":
      return {
        reply: buildPlanPriceReply(memberships?.premium),
        source: "backend",
        intent: detectedIntent
      };

    case "whatsapp_support_plan":
      return {
        reply: `Si buscas soporte por WhatsApp, los planes que más suelen encajar son:

👉 ${memberships?.profesional?.nombre}
👉 ${memberships?.premium?.nombre}

Si quieres más acompañamiento y seguimiento continuo, normalmente el ${memberships?.premium?.nombre} suele ser la opción más robusta.`,
        source: "backend",
        intent: detectedIntent
      };

    case "supplier_verification_plan":
      return {
        reply: `Si te interesa la verificación de proveedor, normalmente el ${memberships?.profesional?.nombre} suele ser una muy buena opción para empezar con más estructura, y el ${memberships?.premium?.nombre} si buscas un acompañamiento más profundo.

Ver planes:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    case "monthly_advisory_plan":
      return {
        reply: `Si lo que buscas es asesoría mensual continua, el plan que normalmente mejor encaja es:

👉 ${memberships?.premium?.nombre}

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}`,
        source: "backend",
        intent: detectedIntent
      };

    case "experienced_recommendation":
    case "scaling_recommendation":
      return {
        reply: `Por lo que me comentas, el plan que más suele ajustarse a tu caso es:

👉 ${memberships?.premium?.nombre}

porque está pensado para quienes ya están importando y quieren optimizar, estructurar mejor su operación o crecer con más acompañamiento.

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}`,
        source: "backend",
        intent: detectedIntent
      };

    case "validated_product_recommendation":
      return {
        reply: `Si ya tienes el producto validado, normalmente el plan que mejor suele encajar es:

👉 ${memberships?.profesional?.nombre}

porque te ayuda a avanzar con más estructura, herramientas y acompañamiento práctico.

Ver detalles:
${memberships?.profesional?.link}

Comprar ahora:
${memberships?.profesional?.payLink}`,
        source: "backend",
        intent: detectedIntent
      };

    case "beginner_recommendation":
    case "personal_use_recommendation":
      return {
        reply: `Si estás empezando desde cero o todavía estás aterrizando mejor tu caso, normalmente una muy buena forma de avanzar es revisar el ${memberships?.basico?.nombre} o el ${memberships?.profesional?.nombre}, según el nivel de acompañamiento que necesites.

Ver planes:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    case "compare_plans":
    case "basic_vs_professional":
    case "professional_vs_premium":
      return {
        reply: buildClubComparisonReply(),
        source: "backend",
        intent: detectedIntent
      };

    case "recommend_plan":
      return {
        reply: buildClubRecommendationReply(user),
        source: "backend",
        intent: detectedIntent
      };

    case "price_objection":
      return {
        reply: `Entiendo. Cuando alguien siente que una membresía puede ser costosa, lo importante no es solo el precio, sino cuánto puede ayudarte a evitar errores, mejorar decisiones y avanzar con más estructura.

Si quieres, puedo recomendarte el plan que mejor se ajusta a tu caso para que no pagues de más.

Ver planes:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    case "value_question":
      return {
        reply: `Buena pregunta. El valor del club no está solo en acceder a información, sino en contar con acompañamiento real para:

- tomar mejores decisiones
- evitar errores costosos
- mejorar costos, logística y proveedores
- avanzar con más claridad según tu etapa

Si quieres, puedo orientarte sobre qué plan tendría más sentido en tu caso.`,
        source: "backend",
        intent: detectedIntent
      };

    case "buy_signal":
      return {
        reply: `Perfecto. Si quieres avanzar con una membresía, aquí tienes los planes disponibles:

${buildPlanLine(memberships?.basico)}

${buildPlanLine(memberships?.profesional)}

${buildPlanLine(memberships?.premium)}

También puedes revisar la página general del club aquí:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    case "schedule_call":
      return {
        reply: `Perfecto. Si prefieres hablar con alguien antes de tomar una decisión, podemos orientarte mejor según tu caso.

Y si mientras tanto quieres revisar las membresías, aquí tienes la página general del club:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    case "not_ready_yet":
      return {
        reply: `Perfecto. Cuando quieras retomar el tema, aquí estaremos para orientarte.

Mientras tanto, puedes revisar cómo funciona el club y los planes disponibles aquí:
${CLUB_GENERAL_LINK}`,
        source: "backend",
        intent: detectedIntent
      };

    default:
      return {
        reply: buildClubGeneralInfoReply(),
        source: "backend",
        intent: detectedIntent
      };
  }
}

// ========================================================
// HEALTH CHECK
// ========================================================
app.get("/", (req, res) => {
  res.status(200).send("Orby backend activo 🚀");
});

// ========================================================
// VERIFICACIÓN WEBHOOK META / WHATSAPP CLOUD API
// ========================================================
app.get("/webhook", (req, res) => {
  try {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (!VERIFY_TOKEN) {
      console.error("❌ Falta WHATSAPP_VERIFY_TOKEN en variables de entorno");
      return res.sendStatus(500);
    }

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente con Meta");
      return res.status(200).send(challenge);
    }

    console.warn("❌ Error de verificación del webhook: token inválido");
    return res.sendStatus(403);
  } catch (error) {
    console.error("❌ Error en GET /webhook:", error.message);
    return res.sendStatus(500);
  }
});

// ========================================================
// UTILIDADES WHATSAPP CLOUD API
// ========================================================
async function sendWhatsAppText(to, text) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error("Faltan WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID");
  }

  const response = await fetch(
    `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error enviando mensaje a WhatsApp: ${response.status} ${JSON.stringify(data)}`
    );
  }

  return data;
}

function extractMetaMessage(body) {
  const value = body?.entry?.[0]?.changes?.[0]?.value;
  const incomingMessage = value?.messages?.[0];

  if (!incomingMessage) return null;

  const phone = incomingMessage.from;
  let message = "";

  if (incomingMessage.type === "text") {
    message = incomingMessage.text?.body || "";
  } else if (incomingMessage.type === "button") {
    message =
      incomingMessage.button?.text ||
      incomingMessage.button?.payload ||
      "";
  } else if (incomingMessage.type === "interactive") {
    if (incomingMessage.interactive?.button_reply) {
      message =
        incomingMessage.interactive.button_reply.title ||
        incomingMessage.interactive.button_reply.id ||
        "";
    } else if (incomingMessage.interactive?.list_reply) {
      message =
        incomingMessage.interactive.list_reply.title ||
        incomingMessage.interactive.list_reply.id ||
        "";
    }
  }

  if (!phone || !message) return null;

  return { phone, message };
}

function routeDigitalIntent({
  detectedIntent,
  user,
  phone,
  saveUser,
  getDigitalIntro,
  getDigitalCrearTiendaPaso2,
  getDigitalMejorarTiendaPaso2,
  getDigitalIAPaso2,
  getDigitalMarketingPaso2,
  getDigitalInfoGeneral,
  getLeadCalificadoReply
}) {
  if (!isDigitalIntent(detectedIntent)) return null;

  user.interes_principal = "digital";

  if (
    detectedIntent === "digital_info" ||
    detectedIntent === "digital_help_options"
  ) {
    user.estado = "lead_curioso";
    saveUser(phone, user);
    return {
      reply: getDigitalInfoGeneral(),
      source: "backend"
    };
  }

  if (
    detectedIntent === "digital_create_store" ||
    detectedIntent === "digital_shopify_interest" ||
    detectedIntent === "digital_wordpress_interest" ||
    detectedIntent === "digital_prestashop_interest"
  ) {
    user.estado = "digital_crear_p2";
    user.subopcion = "crear_tienda";
    saveUser(phone, user);
    return {
      reply: getDigitalCrearTiendaPaso2(),
      source: "backend"
    };
  }

  if (detectedIntent === "digital_improve_store") {
    user.estado = "digital_mejorar_p2";
    user.subopcion = "mejorar_tienda";
    saveUser(phone, user);
    return {
      reply: getDigitalMejorarTiendaPaso2(),
      source: "backend"
    };
  }

  if (
    detectedIntent === "digital_ai_automation" ||
    detectedIntent === "digital_chatbot_interest"
  ) {
    user.estado = "digital_ia_p2";
    user.subopcion = "ia_automatizacion";
    saveUser(phone, user);
    return {
      reply: getDigitalIAPaso2(),
      source: "backend"
    };
  }

  if (detectedIntent === "digital_marketing_sales") {
    user.estado = "digital_marketing_p2";
    user.subopcion = "marketing_ventas";
    saveUser(phone, user);
    return {
      reply: getDigitalMarketingPaso2(),
      source: "backend"
    };
  }

  if (
    detectedIntent === "digital_next_step" ||
    detectedIntent === "digital_schedule"
  ) {
    user.score = Math.max(user.score || 0, 6);
    user.estado = "digital_lead_calificado";
    saveUser(phone, user);
    return {
      reply: `Perfecto. Ya veo que quieres avanzar con ecommerce o automatización.\n\n${getLeadCalificadoReply()}`,
      source: "backend"
    };
  }

  user.estado = "digital_p1";
  saveUser(phone, user);
  return {
    reply: getDigitalIntro(),
    source: "backend"
  };
}

app.post("/webhook", async (req, res) => {
  try {
    const isMetaWebhook =
      req.body?.object === "whatsapp_business_account" ||
      !!req.body?.entry?.[0]?.changes?.[0]?.value;

    let metaPhone = null;

    if (isMetaWebhook) {
      const extracted = extractMetaMessage(req.body);

      // Si es un webhook de estados, entregas u otros eventos sin mensaje
      if (!extracted) {
        return res.sendStatus(200);
      }

      metaPhone = extracted.phone;

      // Adaptar payload de Meta al formato interno de Orby
      req.body = {
        phone: extracted.phone,
        message: extracted.message
      };

      const originalJson = res.json.bind(res);

      res.json = (payload) => {
        (async () => {
          try {
            const decoratedPayload = decorateReplyPayload(payload, req.body?.phone);

            if (decoratedPayload?.reply) {
              await sendWhatsAppText(metaPhone, decoratedPayload.reply);
            }

            return originalJson({
              received: true,
              source: "meta",
              forwarded: !!decoratedPayload?.reply
            });
          } catch (sendError) {
            console.error("Error enviando respuesta a WhatsApp:", sendError);

            try {
              logErrorEvent({
                phone: metaPhone,
                module: "whatsapp_send",
                estado: null,
                interes_principal: null,
                incoming_message: req.body?.message || null,
                error_message: sendError.message,
                stack: sendError.stack,
                detail: {
                  route: "/webhook"
                }
              });
            } catch (logErr) {
              console.error("Error registrando log de envío:", logErr.message);
            }

            return originalJson({
              received: true,
              source: "meta",
              forwarded: false,
              error: "No se pudo enviar la respuesta por WhatsApp"
            });
          }
        })();

        return res;
      };
    }

    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: "phone y message son obligatorios" });
    }

    const cleanMessage = normalizeText(message);
    const detectedIntent = detectIntent(message);

    let user = getUser(phone);

    // ========================================================
    // 1. COMANDOS DE SISTEMA
    // ========================================================
    if (isMenuCommand(cleanMessage)) {
      if (!user) {
        user = createNewUser();
        logLeadEvent({
          phone,
          module: "system",
          event_type: "user_created",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            trigger: "menu"
          }
        });
      } else {
        user.estado = "menu_enviado";
        user.score = 0;
        user.interes_principal = null;
        user.subopcion = null;
      }

      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "system",
        event_type: "menu_opened",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          trigger: "menu_command"
        }
      });

      return res.json({ reply: getMenu(), source: "backend" });
    }

    if (isRestartCommand(cleanMessage)) {
      resetUser(phone);
      const newUser = createNewUser();
      saveUser(phone, newUser);

      logLeadEvent({
        phone,
        module: "system",
        event_type: "conversation_reset",
        estado: newUser.estado,
        interes_principal: newUser.interes_principal,
        subopcion: newUser.subopcion,
        score: newUser.score,
        detail: {
          trigger: "reiniciar_command"
        }
      });

      return res.json({
        reply: `Perfecto. Empezamos desde cero 👌\n\n${getMenu()}`,
        source: "backend"
      });
    }

    if (!user) {
      user = createNewUser();
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "system",
        event_type: "user_created",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          trigger: "first_message",
          incoming_message: message
        }
      });

      return res.json({
        reply: getMenu(),
        source: "backend"
      });
    }

    // ========================================================
    // 1.5 ATRAS - NAVEGACIÓN BÁSICA CLUB
    // ========================================================
    if (isBackCommand(cleanMessage)) {
      if (user.interes_principal === "club") {
        const backNav = getClubBackNavigation(user);

        if (backNav) {
          user.estado = backNav.estado;
          saveUser(phone, user);

          logLeadEvent({
            phone,
            module: "club",
            event_type: "back_navigation",
            estado: user.estado,
            interes_principal: user.interes_principal,
            subopcion: user.subopcion,
            score: user.score,
            detail: {
              trigger: "atras_command"
            }
          });

          return res.json({
            reply: backNav.reply,
            source: "backend"
          });
        }
      }

      return res.json({
        reply: "Ahora mismo ATRAS está disponible dentro del módulo Club. Si quieres, escribe MENU para ver las opciones principales.",
        source: "backend"
      });
    }

    // ========================================================
    // 2. REDIRECCIÓN MÓDULO DIGITAL
    // ========================================================
    if (user.estado.startsWith("digital_") || cleanMessage === "6") {
      if (cleanMessage === "6" && !user.estado.startsWith("digital_")) {
        user.estado = "digital_p1";
        user.interes_principal = "digital";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
          event_type: "module_entry",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            entry_method: "menu_option",
            selected_option: "6"
          }
        });

        return res.json({
          reply: getDigitalIntro(),
          source: "backend"
        });
      }

      const digitalRes = handleDigitalFlow({
        user,
        phone,
        cleanMessage,
        saveUser,
        classifyLead,
        CALENDLY_LINK,
        getDigitalCrearTiendaPaso2,
        getDigitalCrearTiendaPaso3,
        getDigitalPreguntaIntencion,
        getDigitalMejorarTiendaPaso2,
        getDigitalMejorarTiendaPaso3,
        getDigitalIAPaso2,
        getDigitalMarketingPaso2,
        getDigitalMarketingPaso3
      });

      if (digitalRes) return res.json(digitalRes);
    }

    // ========================================================
    // 3. RESTO DE MÓDULOS
    // ========================================================
    const amazonRes = handleAmazonFlow({
      user,
      phone,
      cleanMessage,
      saveUser,
      classifyLead,
      getAmazonCaso1,
      getAmazonCaso2,
      getAmazonCaso3,
      getAmazonInfoGeneral,
      getAmazonPreguntaFinal,
      getLeadCuriosoReply,
      getLeadTibioReply,
      getLeadCalificadoReply
    });
    if (amazonRes) return res.json(amazonRes);

    const importRes = handleImportacionFlow({
      user,
      phone,
      cleanMessage,
      message,
      saveUser,
      classifyLead,
      getImportacionIntro,
      getImportacionCaso1,
      getImportacionCaso2,
      getImportacionCaso3,
      getImportacionInfoGeneral,
      getImportLeadCuriosoReply,
      getImportLeadTibioReply,
      getImportLeadCalificadoReply,
      getImportAdvisorConfirmationReply,
      getImportAdvisorAskNewPhoneReply,
      getImportAdvisorAskScheduleReply,
      getImportAdvisorFinalReply,
      getImportMeetingReply,
      isLikelyPhoneNumber
    });
    if (importRes) return res.json(importRes);

    const clubRes = handleClubFlow({
      user,
      phone,
      cleanMessage,
      message,
      saveUser,
      classifyLead,
      getClubCaso1,
      getClubCaso2,
      getClubCaso3,
      getClubInfoGeneralReply: getClubInfoGeneral,
      getClubPreguntaFinal,
      getLeadTibioReply,
      getLeadCuriosoReply,
      getClubLeadQualifiedReply: getLeadCalificadoReply,
      memberships
    });
    if (clubRes) return res.json(clubRes);

    const exportRes = handleExportacionFlow({
      user,
      phone,
      cleanMessage,
      saveUser,
      classifyLead,
      getExportacionCaso1,
      getExportacionCaso2,
      getExportacionCaso3,
      getExportacionInfoGeneral,
      getExportacionPreguntaFinal,
      getLeadCuriosoReply,
      getLeadTibioReply,
      getLeadCalificadoReply
    });
    if (exportRes) return res.json(exportRes);

    const feriasRes = handleFeriasFlow({
      user,
      phone,
      cleanMessage,
      saveUser,
      classifyLead,
      getFeriasCaso1,
      getFeriasCaso2,
      getFeriasCaso3,
      getFeriasInfoGeneral,
      getFeriasPreguntaFinal,
      getLeadCuriosoReply,
      getLeadTibioReply,
      getLeadCalificadoReply
    });
    if (feriasRes) return res.json(feriasRes);

    const asesoriaRes = await handleAsesoriaFlow({
      user,
      phone,
      cleanMessage,
      message,
      saveUser,
      classifyLead,
      detectIntent,
      getGeminiReplyWithFallback,
      CALENDLY_LINK,
      getAsesoriaCaso1,
      getAsesoriaCaso2,
      getAsesoriaCaso3,
      getAsesoriaPreguntaFinal
    });
    if (asesoriaRes) return res.json(asesoriaRes);

    const exploracionRes = handleExploracionFlow({
      user,
      phone,
      cleanMessage,
      message,
      saveUser,
      getAtencionClienteConfirmacion
    });
    if (exploracionRes) return res.json(exploracionRes);

    // ========================================================
    // 4. RUTEO POR INTENCIÓN DIGITAL ANTES DEL FALLBACK
    // ========================================================
    const digitalIntentRes = routeDigitalIntent({
      detectedIntent,
      user,
      phone,
      saveUser,
      getDigitalIntro,
      getDigitalCrearTiendaPaso2,
      getDigitalMejorarTiendaPaso2,
      getDigitalIAPaso2,
      getDigitalMarketingPaso2,
      getDigitalInfoGeneral,
      getLeadCalificadoReply
    });

    if (digitalIntentRes) {
      return res.json(digitalIntentRes);
    }

    // ========================================================
    // 4.2 RUTEO POR INTENCIÓN CLUB ANTES DEL FALLBACK
    // ========================================================
    const clubIntentRes = routeClubIntent({
      detectedIntent,
      user
    });

    if (clubIntentRes) {
      if (!user.interes_principal) {
        user.interes_principal = "club";
        saveUser(phone, user);
      }

      return res.json(clubIntentRes);
    }

    // ========================================================
    // 4.5 RETORNO AL MENÚ SOLO POR COMANDO EXPLÍCITO
    // ========================================================
    if (
      isFinalState(user.estado) &&
      (isMenuCommand(cleanMessage) || isRestartCommand(cleanMessage))
    ) {
      if (isRestartCommand(cleanMessage)) {
        resetUser(phone);
        const newUser = createNewUser();
        saveUser(phone, newUser);

        return res.json({
          reply: `Perfecto. Empezamos desde cero 👌\n\n${getMenu()}`,
          source: "backend"
        });
      }

      user.estado = "menu_enviado";
      user.score = 0;
      user.subopcion = null;
      user.interes_principal = null;
      saveUser(phone, user);

      return res.json({
        reply: `Perfecto 👌\n\nVolvemos al menú principal:\n\n${getMenu()}`,
        source: "backend"
      });
    }

    // ========================================================
    // 5. FALLBACK CONTROLADO
    // ========================================================
    if (shouldUseGemini(user, cleanMessage, message)) {
      const prompt = `
Eres Orby, asistente comercial de OneOrbix.
El usuario está interesado en: ${user.interes_principal || "servicios generales"}.
Estado actual: ${user.estado || "sin_estado"}.
Responde de forma breve, natural, útil y comercial.
No repitas el menú salvo que sea necesario.
Mensaje del usuario: ${message}
      `.trim();

      const aiReply = await getGeminiReplyWithFallback(
        prompt,
        user,
        "Entiendo. ¿Quieres que te ayude a dar el siguiente paso o prefieres que agendemos una reunión?"
      );

      return res.json({
        reply: aiReply,
        source: "gemini"
      });
    }

    // ========================================================
    // 6. MENÚ INICIAL
    // ========================================================
    if (user.estado === "menu_enviado") {
      const options = {
        "1": {
          estado: "importacion_p1",
          interes: "importacion",
          reply: getImportacionIntro,
          module: "importacion"
        },
        "2": {
          estado: "amazon_p1",
          interes: "amazon",
          reply: getAmazonIntro,
          module: "amazon"
        },
        "3": {
          estado: "club_p1",
          interes: "club",
          reply: getClubIntro,
          module: "club"
        },
        "4": {
          estado: "exportacion_p1",
          interes: "exportacion",
          reply: getExportacionIntro,
          module: "exportacion"
        },
        "5": {
          estado: "ferias_p1",
          interes: "ferias",
          reply: getFeriasIntro,
          module: "ferias"
        },
        "6": {
          estado: "digital_p1",
          interes: "digital",
          reply: getDigitalIntro,
          module: "digital"
        },
        "7": {
          estado: "asesoria_p1",
          interes: "asesoria",
          reply: getAsesoriaIntro,
          module: "asesoria"
        },
        "8": {
          estado: "atencion_cliente_p1",
          interes: "atencion_cliente",
          reply: getAtencionClienteIntro,
          module: "atencion_cliente"
        }
      };

      if (options[cleanMessage]) {
        user.estado = options[cleanMessage].estado;
        user.interes_principal = options[cleanMessage].interes;
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: options[cleanMessage].module,
          event_type: "module_entry",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            entry_method: "menu_option",
            selected_option: cleanMessage
          }
        });

        return res.json({
          reply: options[cleanMessage].reply(),
          source: "backend"
        });
      }
    }

    let fallbackReply = "No entendí del todo tu mensaje.";

    if (user.estado === "menu_enviado") {
      fallbackReply = `No entendí tu respuesta.\n\n${getMenu()}`;
    } else if (user.interes_principal === "club") {
      fallbackReply = `Entiendo. Si quieres, puedo seguir ayudándote con el Club de Importadores OneOrbix.

También puedes escribir:
ATRAS para volver al paso anterior
MENU para ver otras opciones
REINICIAR para empezar desde cero`;
    } else if (user.interes_principal) {
      fallbackReply = `Entiendo. Si quieres, puedo seguir ayudándote con ${user.interes_principal}.

También puedes escribir MENU para ver otras opciones.`;
    } else {
      fallbackReply = "No entendí del todo tu mensaje. Escribe MENU para ver las opciones disponibles.";
    }

    return res.json({
      reply: fallbackReply,
      source: "backend"
    });
  } catch (error) {
    console.error("Error en webhook:", error);

    try {
      const safeBody = req && req.body ? req.body : {};
      const safePhone = safeBody.phone || null;
      const safeMessage = safeBody.message || null;

      logErrorEvent({
        phone: safePhone,
        module: "webhook",
        estado: null,
        interes_principal: null,
        incoming_message: safeMessage,
        error_message: error.message,
        stack: error.stack,
        detail: {
          route: "/webhook"
        }
      });
    } catch (logError) {
      console.error("Error registrando log de error:", logError.message);
    }

    return res.status(500).json({ error: "Error interno" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=======================================");
  console.log(`🚀 Orby backend corriendo en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log("=======================================");
});