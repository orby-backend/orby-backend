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
  getDigitalCrearTiendaPaso4FisicosServicios,
  getDigitalCrearTiendaPaso4ServiciosOnline,
  getDigitalCrearTiendaPaso4PagosEnvios,
  getDigitalMejorarTiendaPaso2,
  getDigitalMejorarTiendaPaso3,
  getDigitalMejorarTiendaPaso4,
  getDigitalIAPaso2,
  getDigitalIAPaso3,
  getDigitalIAChatbotProblemaPrompt,
  getDigitalIAAutomatizacionPrompt,
  getDigitalIAAgentePaso3,
  getDigitalIAAgenteConcretarVentasPrompt,
  getDigitalIAAgenteMulticanalPrompt,
  getDigitalIAProcesosPaso3,
  getDigitalIAProcesamientoDocumentosPrompt,
  getDigitalIATicketsPrompt,
  getDigitalMarketingPaso2,
  getDigitalMarketingCampanasPaso3,
  getDigitalMarketingCampanasPaso4,
  getDigitalMarketingSEOPaso3,
  getDigitalMarketingSEOPaso4,
  getDigitalMarketingSEOSEMPaso4,
  getDigitalMarketingLeadsPaso3,
  getDigitalMarketingLeadsPaso4,
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
  return cleanMessage === "atras";
}

function isFinalState(estado = "") {
  return [
    "lead_curioso",
    "lead_tibio",
    "lead_calificado",
    "digital_lead_curioso",
    "digital_lead_tibio",
    "digital_lead_calificado",
    "asesoria_consulta_respondida",
    "finalizado"
  ].includes(estado) || String(estado).endsWith("_lead_calificado");
}

function isConversationalState(estado = "") {
  return [
    "lead_curioso",
    "lead_tibio",
    "lead_calificado",
    "digital_lead_curioso",
    "digital_lead_tibio",
    "digital_lead_calificado",
    "asesoria_consulta_respondida"
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
  return `${reply}

También puedes usar:

🔸 *MENU*
🔸 *REINICIAR*
🔸 *ATRAS*`;
}

function shouldAppendNavigationHint(reply, user) {
  const text = String(reply || "");
  const normalizedText = normalizeText(text);

  if (!text.trim()) return false;

  if (
    normalizedText.includes("*menu*") ||
    normalizedText.includes("*reiniciar*") ||
    normalizedText.includes("*atras*") ||
    normalizedText.includes("menu para") ||
    normalizedText.includes("reiniciar para") ||
    normalizedText.includes("atras para")
  ) {
    return false;
  }

  const guidedReplyPatterns = [
    /ahora dime/i,
    /para orientarte mejor/i,
    /^dime:/i,
    /\ndime:/i,
    /si quieres, responde:/i,
    /^responde:/i,
    /\nresponde:/i,
    /enviame:/i,
    /envíame:/i,
    /cuentame:/i,
    /cuéntame:/i
  ];

  if (guidedReplyPatterns.some((pattern) => pattern.test(text))) {
    return false;
  }

  if (isFinalState(user?.estado)) return true;

  if (
    text.includes(CALENDLY_LINK) ||
    text.includes(CLUB_GENERAL_LINK) ||
    /comprar ahora:/i.test(text) ||
    /ver detalles:/i.test(text) ||
    /ver mas:/i.test(normalizedText) ||
    /ver m[aá]s:/i.test(text)
  ) {
    return true;
  }

  const fallbackOrOpenEndPatterns = [
    /no entendi/i,
    /no entend[ií]/i,
    /cuando quieras retomar/i,
    /aqui estaremos para orientarte/i,
    /aquí estaremos para orientarte/i,
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

  return fallbackOrOpenEndPatterns.some((pattern) => pattern.test(text));
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
    origen: "manual",
    club_context: null,
    estado_anterior_digital: null,
    digital_context_detail: null
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
1️⃣ Ver planes disponibles
2️⃣ Recomiéndame un plan según mi caso`;
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
      "logistics_review_context",
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

// ========================================================
// HELPERS DIGITAL
// ========================================================
function getDigitalAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`;
}

function getDigitalAdvisorAskNewPhoneReply() {
  return "Perfecto. Envíame el número al que deseas que te contacten y seguimos.";
}

function getDigitalAdvisorAskScheduleReply() {
  return `Perfecto. ¿En qué horario te conviene más que te contacten?

1️⃣ De 9 a 12 pm
2️⃣ De 2 a 6 pm`;
}

function getDigitalContextPrefix(user) {
  const context = String(user?.digital_context_detail || "");

  switch (context) {
    case "crear_tienda_productos_fisicos":
      return "Perfecto. Veo que tu interés está en crear una tienda para vender productos físicos.";
    case "crear_tienda_servicios":
      return "Perfecto. Veo que tu interés está en crear una tienda o canal digital para vender servicios.";
    case "crear_tienda_servicios_online":
      return "Perfecto. Veo que tu caso está más orientado a vender servicios online.";
    case "crear_tienda_pagos":
      return "Perfecto. Veo que lo que necesitas resolver está más orientado a integraciones de pago para tu tienda.";
    case "crear_tienda_envios_facturas":
      return "Perfecto. Veo que tu caso está más enfocado en módulo de envíos, etiquetas o facturación.";
    case "mejorar_tienda_ventas":
      return "Perfecto. Veo que tu prioridad es corregir una tienda que no está generando ventas.";
    case "mejorar_tienda_diseno":
      return "Perfecto. Veo que tu prioridad está en mejorar diseño, velocidad o estructura de la tienda.";
    case "mejorar_tienda_soporte":
      return "Perfecto. Veo que tu caso está más enfocado en errores técnicos o soporte.";
    case "ia_chatbot_atencion_ventas":
      return "Perfecto. Veo que tu interés está en mejorar atención, ventas o seguimiento con ayuda de IA.";
    case "ia_chatbot_automatizacion":
      return "Perfecto. Veo que buscas automatizar tareas comerciales u operativas con apoyo de IA.";
    case "ia_agente_concretar_ventas":
      return "Perfecto. Veo que tu enfoque está en concretar ventas con un Agente AI.";
    case "ia_agente_multicanal":
      return "Perfecto. Veo que tu interés está en vender con un Agente AI en varios canales como WhatsApp, Facebook, Instagram y Web.";
    case "ia_documentos":
      return "Perfecto. Veo que tu caso está más orientado al procesamiento de documentos.";
    case "ia_tickets":
      return "Perfecto. Veo que tu prioridad está en gestión de tickets, triaje o clasificación inteligente.";
    case "marketing_campanas_auditoria":
      return "Perfecto. Veo que tu prioridad está en una auditoría de campañas.";
    case "marketing_campanas_rendimiento":
      return "Perfecto. Veo que tu interés está en diseñar campañas de alto rendimiento.";
    case "marketing_seo":
      return "Perfecto. Veo que tu caso está enfocado en SEO.";
    case "marketing_seo_sem":
      return "Perfecto. Veo que tu caso requiere una revisión combinada de SEO y SEM.";
    case "marketing_clientes_nuevos":
      return "Perfecto. Veo que tu prioridad es conseguir clientes nuevos.";
    case "marketing_retargeting":
      return "Perfecto. Veo que tu prioridad está en una campaña de retargeting o remarketing.";
    default:
      return "Perfecto. Ya veo que tu caso digital merece una revisión más directa.";
  }
}

function buildDigitalAdvisorCTAReply(user) {
  return `${getDigitalContextPrefix(user)}

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

// ========================================================
// NAVEGACIÓN ATRÁS CLUB
// ========================================================
function getClubBackNavigation(user) {
  const currentState = String(user?.estado || "");
  const currentContext = String(user?.club_context || "");
  const currentSuboption = String(user?.subopcion || "");

  if (currentState === "club_p1") {
    return {
      estado: "menu_enviado",
      interes_principal: null,
      subopcion: null,
      club_context: null,
      reply: `Perfecto 👌

Volvemos al menú principal:

${getMenu()}`
    };
  }

  if (currentState === "club_p2") {
    return {
      estado: "club_p1",
      interes_principal: "club",
      subopcion: null,
      club_context: null,
      reply: getClubIntro()
    };
  }

  if (currentState === "club_p3") {
    if (currentSuboption === "cero") {
      return {
        estado: "club_p2",
        interes_principal: "club",
        subopcion: "cero",
        club_context: null,
        reply: getClubCaso1()
      };
    }

    if (currentSuboption === "idea_producto") {
      return {
        estado: "club_p2",
        interes_principal: "club",
        subopcion: "idea_producto",
        club_context: null,
        reply: getClubCaso2()
      };
    }

    if (currentSuboption === "ya_importo") {
      return {
        estado: "club_p2",
        interes_principal: "club",
        subopcion: "ya_importo",
        club_context: null,
        reply: getClubCaso3()
      };
    }
  }

  if (currentState === "club_info_general") {
    return {
      estado: "club_p1",
      interes_principal: "club",
      subopcion: null,
      club_context: null,
      reply: getClubIntro()
    };
  }

  if (["club_sell_ecuador", "club_sell_amazon"].includes(currentState)) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "cero",
      club_context: "sell",
      reply: `Ahora dime:

1️⃣ Quiero vender en Ecuador
2️⃣ Quiero vender en Amazon FBA`
    };
  }

  if (
    [
      "club_personal_courier_waiting_product",
      "club_personal_courier_result",
      "club_personal_specific_choice"
    ].includes(currentState)
  ) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "cero",
      club_context: "personal_use",
      reply: `Ahora dime:

1️⃣ Quiero traer productos pequeños (casillero / courier)
2️⃣ Quiero importar algo específico para mi negocio o uso personal`
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
      interes_principal: "club",
      subopcion: "cero",
      club_context: "specific_import",
      reply: `Perfecto. Para orientarte mejor, dime:

1️⃣ Ya tengo el producto definido
2️⃣ Necesito ayuda para encontrar proveedor`
    };
  }

  if (
    ["club_exploring_suggestions_market", "club_exploring_product_guidance"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "cero",
      club_context: "exploring_ideas",
      reply: `Ahora dime:

1️⃣ Sugerencias de productos
2️⃣ Quiero entender mejor qué producto me conviene`
    };
  }

  if (
    ["club_validated_start_waiting_product", "club_validated_help"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "idea_producto",
      club_context: "validated_product",
      reply: `Ahora dime:

1️⃣ ¿Cómo puedo empezar?
2️⃣ ¿Cómo me ayudaría el club en mi caso?`
    };
  }

  if (
    ["club_need_validation_potential", "club_need_validation_review"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "idea_producto",
      club_context: "need_validation",
      reply: `Ahora dime:

1️⃣ Quiero validar si mi idea tiene potencial
2️⃣ Quiero entender qué debo revisar antes de importar`
    };
  }

  if (["club_costs_action_waiting_product", "club_costs_value"].includes(currentState)) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "ya_importo",
      club_context: "costs_optimization",
      reply: `Ahora dime:

1️⃣ Quiero optimizar costos y logística
2️⃣ ¿Cómo me ayudaría el club en mi caso específico?`
    };
  }

  if (
    ["club_logistics_control_waiting_mode", "club_logistics_review_waiting_context"].includes(
      currentState
    )
  ) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "ya_importo",
      club_context: "logistics_control",
      reply: `Ahora dime:

1️⃣ Quiero mejorar tiempos y control logístico
2️⃣ Quiero revisar si estoy gestionando bien mi logística actual`
    };
  }

  if (["club_business_structure_action", "club_business_structure_plan"].includes(currentState)) {
    return {
      estado: "club_p3",
      interes_principal: "club",
      subopcion: "ya_importo",
      club_context: "business_structure",
      reply: `Ahora dime:

1️⃣ Quiero estructurar mi operación con más claridad
2️⃣ Quiero ver qué plan puede ayudarme mejor`
    };
  }

  if (currentContext || currentSuboption || user?.interes_principal === "club") {
    return {
      estado: "club_p1",
      interes_principal: "club",
      subopcion: null,
      club_context: null,
      reply: getClubIntro()
    };
  }

  return null;
}

// ========================================================
// NAVEGACIÓN ATRÁS ASESORÍA
// ========================================================
function getAsesoriaBackNavigation(user, phone) {
  const currentState = String(user?.estado || "");
  const currentSuboption = String(user?.subopcion || "");

  if (currentState === "asesoria_p1") {
    return {
      estado: "menu_enviado",
      interes_principal: null,
      subopcion: null,
      reply: `Perfecto 👌

Volvemos al menú principal:

${getMenu()}`
    };
  }

  if (currentState === "asesoria_p2") {
    return {
      estado: "asesoria_p1",
      interes_principal: "asesoria",
      subopcion: null,
      reply: getAsesoriaIntro()
    };
  }

  if (currentState === "asesoria_p3") {
    if (currentSuboption === "comercio") {
      return {
        estado: "asesoria_p2",
        interes_principal: "asesoria",
        subopcion: "comercio",
        reply: getAsesoriaCaso1()
      };
    }

    if (currentSuboption === "negocio") {
      return {
        estado: "asesoria_p2",
        interes_principal: "asesoria",
        subopcion: "negocio",
        reply: getAsesoriaCaso2()
      };
    }

    if (currentSuboption === "escalar") {
      return {
        estado: "asesoria_p2",
        interes_principal: "asesoria",
        subopcion: "escalar",
        reply: getAsesoriaCaso3()
      };
    }
  }

  if (["lead_curioso", "lead_tibio", "lead_calificado"].includes(currentState)) {
    return {
      estado: "asesoria_p3",
      interes_principal: "asesoria",
      subopcion: currentSuboption || null,
      reply: getAsesoriaPreguntaFinal()
    };
  }

  if (currentState === "asesoria_consulta_pedir") {
    return {
      estado: "asesoria_p1",
      interes_principal: "asesoria",
      subopcion: null,
      reply: getAsesoriaIntro()
    };
  }

  if (currentState === "asesoria_consulta_respondida") {
    return {
      estado: "asesoria_consulta_pedir",
      interes_principal: "asesoria",
      subopcion: "consulta",
      reply: "Perfecto. Por favor escribe tu consulta puntual y te orientaré con la mayor claridad posible."
    };
  }

  if (currentState === "asesoria_asesor_confirmar_numero") {
    if (currentSuboption === "consulta") {
      return {
        estado: "asesoria_consulta_respondida",
        interes_principal: "asesoria",
        subopcion: "consulta",
        reply: `Perfecto. Si quieres, puedo seguir ayudándote con tu consulta o, si prefieres avanzar directamente, aquí tienes las dos opciones disponibles.

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`
      };
    }

    return {
      estado: "asesoria_p3",
      interes_principal: "asesoria",
      subopcion: currentSuboption || null,
      reply: getAsesoriaPreguntaFinal()
    };
  }

  if (currentState === "asesoria_asesor_otro_numero") {
    return {
      estado: "asesoria_asesor_confirmar_numero",
      interes_principal: "asesoria",
      subopcion: currentSuboption || null,
      reply: `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`
    };
  }

  if (currentState === "asesoria_asesor_horario") {
    if (
      user?.callback_phone &&
      String(user.callback_phone).trim() &&
      String(user.callback_phone).trim() !== String(phone).trim()
    ) {
      return {
        estado: "asesoria_asesor_otro_numero",
        interes_principal: "asesoria",
        subopcion: currentSuboption || null,
        reply: "Perfecto. Envíame el número al que deseas que te contacten y seguimos."
      };
    }

    return {
      estado: "asesoria_asesor_confirmar_numero",
      interes_principal: "asesoria",
      subopcion: currentSuboption || null,
      reply: `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`
    };
  }

  if (currentState === "finalizado" && user?.interes_principal === "asesoria") {
    if (currentSuboption === "consulta") {
      return {
        estado: "asesoria_consulta_respondida",
        interes_principal: "asesoria",
        subopcion: "consulta",
        reply: `Perfecto. Si quieres, puedo seguir ayudándote con tu consulta o, si prefieres avanzar directamente, aquí tienes las dos opciones disponibles.

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`
      };
    }

    return {
      estado: "asesoria_p3",
      interes_principal: "asesoria",
      subopcion: currentSuboption || null,
      reply: getAsesoriaPreguntaFinal()
    };
  }

  if (user?.interes_principal === "asesoria") {
    return {
      estado: "asesoria_p1",
      interes_principal: "asesoria",
      subopcion: null,
      reply: getAsesoriaIntro()
    };
  }

  return null;
}

// ========================================================
// NAVEGACIÓN ATRÁS DIGITAL
// ========================================================
function getDigitalBackNavigation(user, phone) {
  const currentState = String(user?.estado || "");
  const currentSuboption = String(user?.subopcion || "");
  const previousDigitalState = String(user?.estado_anterior_digital || "");
  const digitalContextDetail = String(user?.digital_context_detail || "");

  if (currentState === "digital_p1") {
    return {
      estado: "menu_enviado",
      interes_principal: null,
      subopcion: null,
      reply: `Perfecto 👌

Volvemos al menú principal:

${getMenu()}`
    };
  }

  if (currentState === "digital_crear_p2") {
    return {
      estado: "digital_p1",
      interes_principal: "digital",
      subopcion: null,
      reply: getDigitalIntro()
    };
  }

  if (currentState === "digital_crear_p3") {
    return {
      estado: "digital_crear_p2",
      interes_principal: "digital",
      subopcion: "crear_tienda",
      reply: getDigitalCrearTiendaPaso2()
    };
  }

  if (
    [
      "digital_crear_p4_fisicos_servicios",
      "digital_crear_p4_servicios_online",
      "digital_crear_p4_pagos_envios"
    ].includes(currentState)
  ) {
    return {
      estado: "digital_crear_p3",
      interes_principal: "digital",
      subopcion: "crear_tienda",
      reply: getDigitalCrearTiendaPaso3()
    };
  }

  if (currentState === "digital_mejorar_p2") {
    return {
      estado: "digital_p1",
      interes_principal: "digital",
      subopcion: null,
      reply: getDigitalIntro()
    };
  }

  if (currentState === "digital_mejorar_p3") {
    return {
      estado: "digital_mejorar_p2",
      interes_principal: "digital",
      subopcion: "mejorar_tienda",
      reply: getDigitalMejorarTiendaPaso2()
    };
  }

  if (currentState === "digital_mejorar_p4") {
    return {
      estado: "digital_mejorar_p3",
      interes_principal: "digital",
      subopcion: "mejorar_tienda",
      reply: getDigitalMejorarTiendaPaso3()
    };
  }

  if (currentState === "digital_ia_p2") {
    return {
      estado: "digital_p1",
      interes_principal: "digital",
      subopcion: null,
      reply: getDigitalIntro()
    };
  }

  if (
    [
      "digital_ia_chatbot_p3",
      "digital_ia_agente_p3",
      "digital_ia_procesos_p3"
    ].includes(currentState)
  ) {
    return {
      estado: "digital_ia_p2",
      interes_principal: "digital",
      subopcion: "ia_automatizacion",
      reply: getDigitalIAPaso2()
    };
  }

  if (currentState === "digital_ia_chatbot_hibrido") {
    return {
      estado: "digital_ia_chatbot_p3",
      interes_principal: "digital",
      subopcion: "ia_automatizacion",
      reply: getDigitalIAPaso3()
    };
  }

  if (currentState === "digital_ia_agente_hibrido") {
    return {
      estado: "digital_ia_agente_p3",
      interes_principal: "digital",
      subopcion: "ia_automatizacion",
      reply: getDigitalIAAgentePaso3()
    };
  }

  if (currentState === "digital_ia_procesos_hibrido") {
    return {
      estado: "digital_ia_procesos_p3",
      interes_principal: "digital",
      subopcion: "ia_automatizacion",
      reply: getDigitalIAProcesosPaso3()
    };
  }

  if (currentState === "digital_marketing_p2") {
    return {
      estado: "digital_p1",
      interes_principal: "digital",
      subopcion: null,
      reply: getDigitalIntro()
    };
  }

  if (
    [
      "digital_marketing_campanas_p3",
      "digital_marketing_seo_p3",
      "digital_marketing_leads_p3"
    ].includes(currentState)
  ) {
    return {
      estado: "digital_marketing_p2",
      interes_principal: "digital",
      subopcion: "marketing_ventas",
      reply: getDigitalMarketingPaso2()
    };
  }

  if (currentState === "digital_marketing_campanas_p4") {
    return {
      estado: "digital_marketing_campanas_p3",
      interes_principal: "digital",
      subopcion: "marketing_ventas",
      reply: getDigitalMarketingCampanasPaso3()
    };
  }

  if (
    ["digital_marketing_seo_p4", "digital_marketing_seosem_p4"].includes(currentState)
  ) {
    return {
      estado: "digital_marketing_seo_p3",
      interes_principal: "digital",
      subopcion: "marketing_ventas",
      reply: getDigitalMarketingSEOPaso3()
    };
  }

  if (currentState === "digital_marketing_leads_p4") {
    return {
      estado: "digital_marketing_leads_p3",
      interes_principal: "digital",
      subopcion: "marketing_ventas",
      reply: getDigitalMarketingLeadsPaso3()
    };
  }

  if (
    ["digital_lead_curioso", "digital_lead_tibio", "digital_lead_calificado"].includes(
      currentState
    )
  ) {
    if (previousDigitalState) {
      if (
        [
          "digital_crear_p4_fisicos_servicios",
          "digital_crear_p4_servicios_online",
          "digital_crear_p4_pagos_envios"
        ].includes(previousDigitalState)
      ) {
        let reply = getDigitalCrearTiendaPaso3();

        if (previousDigitalState === "digital_crear_p4_fisicos_servicios") {
          reply = getDigitalCrearTiendaPaso4FisicosServicios();
        }

        if (previousDigitalState === "digital_crear_p4_servicios_online") {
          reply = getDigitalCrearTiendaPaso4ServiciosOnline();
        }

        if (previousDigitalState === "digital_crear_p4_pagos_envios") {
          reply = getDigitalCrearTiendaPaso4PagosEnvios();
        }

        return {
          estado: previousDigitalState,
          interes_principal: "digital",
          subopcion: "crear_tienda",
          reply
        };
      }

      if (previousDigitalState === "digital_mejorar_p4") {
        return {
          estado: "digital_mejorar_p4",
          interes_principal: "digital",
          subopcion: "mejorar_tienda",
          reply: getDigitalMejorarTiendaPaso4()
        };
      }

      if (previousDigitalState === "digital_marketing_campanas_p4") {
        return {
          estado: "digital_marketing_campanas_p4",
          interes_principal: "digital",
          subopcion: "marketing_ventas",
          reply: getDigitalMarketingCampanasPaso4()
        };
      }

      if (previousDigitalState === "digital_marketing_seo_p4") {
        return {
          estado: "digital_marketing_seo_p4",
          interes_principal: "digital",
          subopcion: "marketing_ventas",
          reply: getDigitalMarketingSEOPaso4()
        };
      }

      if (previousDigitalState === "digital_marketing_seosem_p4") {
        return {
          estado: "digital_marketing_seosem_p4",
          interes_principal: "digital",
          subopcion: "marketing_ventas",
          reply: getDigitalMarketingSEOSEMPaso4()
        };
      }

      if (previousDigitalState === "digital_marketing_leads_p4") {
        return {
          estado: "digital_marketing_leads_p4",
          interes_principal: "digital",
          subopcion: "marketing_ventas",
          reply: getDigitalMarketingLeadsPaso4()
        };
      }

      if (previousDigitalState === "digital_ia_chatbot_hibrido") {
        let reply = getDigitalIAChatbotProblemaPrompt();

        if (digitalContextDetail === "ia_chatbot_automatizacion") {
          reply = getDigitalIAAutomatizacionPrompt();
        }

        return {
          estado: "digital_ia_chatbot_hibrido",
          interes_principal: "digital",
          subopcion: "ia_automatizacion",
          reply
        };
      }

      if (previousDigitalState === "digital_ia_agente_hibrido") {
        let reply = getDigitalIAAgenteConcretarVentasPrompt();

        if (digitalContextDetail === "ia_agente_multicanal") {
          reply = getDigitalIAAgenteMulticanalPrompt();
        }

        return {
          estado: "digital_ia_agente_hibrido",
          interes_principal: "digital",
          subopcion: "ia_automatizacion",
          reply
        };
      }

      if (previousDigitalState === "digital_ia_procesos_hibrido") {
        let reply = getDigitalIAProcesamientoDocumentosPrompt();

        if (digitalContextDetail === "ia_tickets") {
          reply = getDigitalIATicketsPrompt();
        }

        return {
          estado: "digital_ia_procesos_hibrido",
          interes_principal: "digital",
          subopcion: "ia_automatizacion",
          reply
        };
      }
    }

    if (currentSuboption === "crear_tienda") {
      return {
        estado: "digital_crear_p3",
        interes_principal: "digital",
        subopcion: "crear_tienda",
        reply: getDigitalCrearTiendaPaso3()
      };
    }

    if (currentSuboption === "mejorar_tienda") {
      return {
        estado: "digital_mejorar_p4",
        interes_principal: "digital",
        subopcion: "mejorar_tienda",
        reply: getDigitalMejorarTiendaPaso4()
      };
    }

    if (currentSuboption === "ia_automatizacion") {
      return {
        estado: "digital_ia_p2",
        interes_principal: "digital",
        subopcion: "ia_automatizacion",
        reply: getDigitalIAPaso2()
      };
    }

    if (currentSuboption === "marketing_ventas") {
      return {
        estado: "digital_marketing_p2",
        interes_principal: "digital",
        subopcion: "marketing_ventas",
        reply: getDigitalMarketingPaso2()
      };
    }
  }

  if (currentState === "digital_asesor_confirmar_numero") {
    if (
      currentSuboption &&
      [
        "crear_tienda",
        "mejorar_tienda",
        "ia_automatizacion",
        "marketing_ventas",
        "asesor_directo"
      ].includes(currentSuboption)
    ) {
      return {
        estado: "digital_lead_calificado",
        interes_principal: "digital",
        subopcion: currentSuboption || null,
        reply: buildDigitalAdvisorCTAReply(user)
      };
    }

    return {
      estado: "digital_p1",
      interes_principal: "digital",
      subopcion: null,
      reply: getDigitalIntro()
    };
  }

  if (currentState === "digital_asesor_otro_numero") {
    return {
      estado: "digital_asesor_confirmar_numero",
      interes_principal: "digital",
      subopcion: currentSuboption || null,
      reply: getDigitalAdvisorConfirmationReply(phone)
    };
  }

  if (currentState === "digital_asesor_horario") {
    if (
      user?.callback_phone &&
      String(user.callback_phone).trim() &&
      String(user.callback_phone).trim() !== String(phone).trim()
    ) {
      return {
        estado: "digital_asesor_otro_numero",
        interes_principal: "digital",
        subopcion: currentSuboption || null,
        reply: getDigitalAdvisorAskNewPhoneReply()
      };
    }

    return {
      estado: "digital_asesor_confirmar_numero",
      interes_principal: "digital",
      subopcion: currentSuboption || null,
      reply: getDigitalAdvisorConfirmationReply(phone)
    };
  }

  if (currentState === "finalizado" && user?.interes_principal === "digital") {
    if (user?.callback_schedule) {
      return {
        estado: "digital_asesor_horario",
        interes_principal: "digital",
        subopcion: currentSuboption || null,
        reply: getDigitalAdvisorAskScheduleReply()
      };
    }

    if (user?.callback_phone) {
      return {
        estado: "digital_asesor_confirmar_numero",
        interes_principal: "digital",
        subopcion: currentSuboption || null,
        reply: getDigitalAdvisorConfirmationReply(phone)
      };
    }

    return {
      estado: "digital_lead_calificado",
      interes_principal: "digital",
      subopcion: currentSuboption || null,
      reply: buildDigitalAdvisorCTAReply(user)
    };
  }

  if (user?.interes_principal === "digital") {
    return {
      estado: "digital_p1",
      interes_principal: "digital",
      subopcion: null,
      reply: getDigitalIntro()
    };
  }

  return null;
}

// ========================================================
// RUTEO POR INTENCIÓN CLUB
// ========================================================
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
// RUTEO POR INTENCIÓN DIGITAL
// ========================================================
function routeDigitalIntent({
  detectedIntent,
  user,
  phone,
  saveUser
}) {
  if (!isDigitalIntent(detectedIntent)) return null;

  user.interes_principal = "digital";

  if (
    detectedIntent === "digital_info" ||
    detectedIntent === "digital_help_options"
  ) {
    user.estado = "digital_p1";
    user.subopcion = null;
    saveUser(phone, user);

    return {
      reply: getDigitalIntro(),
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
      reply: buildDigitalAdvisorCTAReply(user),
      source: "backend"
    };
  }

  user.estado = "digital_p1";
  user.subopcion = null;
  saveUser(phone, user);

  return {
    reply: getDigitalIntro(),
    source: "backend"
  };
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

// ========================================================
// WEBHOOK PRINCIPAL
// ========================================================
app.post("/webhook", async (req, res) => {
  try {
    const isMetaWebhook =
      req.body?.object === "whatsapp_business_account" ||
      !!req.body?.entry?.[0]?.changes?.[0]?.value;

    let metaPhone = null;

    if (isMetaWebhook) {
      const extracted = extractMetaMessage(req.body);

      if (!extracted) {
        return res.sendStatus(200);
      }

      metaPhone = extracted.phone;

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
        user.club_context = null;
        user.estado_anterior_digital = null;
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
    // 1.2 DETECCIÓN DE ENTRADA DIRECTA CLUB
    // ========================================================
    const clubAdKeywords = [
      "quiero club oneorbix",
      "info club oneorbix",
      "club oneorbix",
      "quiero informacion del club",
      "quiero información del club",
      "info club",
      "membresia club",
      "membresía club"
    ];

    const isClubAdEntry = clubAdKeywords.some((keyword) =>
      cleanMessage.includes(keyword)
    );

    if (isClubAdEntry && !user.interes_principal) {
      user.estado = "club_p1";
      user.interes_principal = "club";
      user.subopcion = null;
      user.club_context = null;

      saveUser(phone, user);

      return res.json({
        reply: getClubIntro(),
        source: "backend"
      });
    }

    // ========================================================
    // 1.3 DETECCIÓN DE ENTRADA DIRECTA ASESORÍA
    // ========================================================
    const asesoriaAdKeywords = [
      "necesito informacion de asesoria",
      "necesito información de asesoría",
      "quiero asesoria",
      "info asesoria",
      "asesoria personalizada",
      "asesoría personalizada",
      "quiero hablar con un asesor",
      "quiero hablar con un experto",
      "necesito asesoria",
      "quiero informacion de asesoria",
      "quiero información de asesoría"
    ];

    const isAsesoriaAdEntry = asesoriaAdKeywords.some((keyword) =>
      cleanMessage.includes(keyword)
    );

    if (isAsesoriaAdEntry && !user.interes_principal) {
      user.estado = "asesoria_p1";
      user.interes_principal = "asesoria";
      user.subopcion = null;

      saveUser(phone, user);

      return res.json({
        reply: getAsesoriaIntro(),
        source: "backend"
      });
    }

    // ========================================================
    // 1.4 DETECCIÓN DE ENTRADA DIRECTA DIGITAL
    // ========================================================
    const digitalAdKeywords = [
      "quiero crear una tienda online",
      "quiero automatizar mi negocio",
      "quiero mejorar mi ecommerce",
      "quiero ecommerce",
      "quiero automatizacion",
      "quiero automatización",
      "quiero marketing digital",
      "quiero mejorar mi tienda online"
    ];

    const isDigitalAdEntry = digitalAdKeywords.some((keyword) =>
      cleanMessage.includes(keyword)
    );

    if (isDigitalAdEntry && !user.interes_principal) {
      user.estado = "digital_p1";
      user.interes_principal = "digital";
      user.subopcion = null;

      saveUser(phone, user);

      return res.json({
        reply: getDigitalIntro(),
        source: "backend"
      });
    }

    // ========================================================
    // 1.5 ATRÁS - CLUB / ASESORÍA / DIGITAL
    // ========================================================
    if (isBackCommand(cleanMessage)) {
      if (user.interes_principal === "club") {
        const backNav = getClubBackNavigation(user);

        if (backNav) {
          user.estado = backNav.estado;

          if (Object.prototype.hasOwnProperty.call(backNav, "interes_principal")) {
            user.interes_principal = backNav.interes_principal;
          }

          if (Object.prototype.hasOwnProperty.call(backNav, "subopcion")) {
            user.subopcion = backNav.subopcion;
          }

          if (Object.prototype.hasOwnProperty.call(backNav, "club_context")) {
            user.club_context = backNav.club_context;
          }

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
              trigger: "atras_command",
              restored_context: user.club_context || null
            }
          });

          return res.json({
            reply: backNav.reply,
            source: "backend"
          });
        }
      }

      if (user.interes_principal === "asesoria") {
        const backNav = getAsesoriaBackNavigation(user, phone);

        if (backNav) {
          user.estado = backNav.estado;

          if (Object.prototype.hasOwnProperty.call(backNav, "interes_principal")) {
            user.interes_principal = backNav.interes_principal;
          }

          if (Object.prototype.hasOwnProperty.call(backNav, "subopcion")) {
            user.subopcion = backNav.subopcion;
          }

          saveUser(phone, user);

          logLeadEvent({
            phone,
            module: "asesoria",
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

      if (user.interes_principal === "digital") {
        const backNav = getDigitalBackNavigation(user, phone);

        if (backNav) {
          user.estado = backNav.estado;

          if (Object.prototype.hasOwnProperty.call(backNav, "interes_principal")) {
            user.interes_principal = backNav.interes_principal;
          }

          if (Object.prototype.hasOwnProperty.call(backNav, "subopcion")) {
            user.subopcion = backNav.subopcion;
          }

          saveUser(phone, user);

          logLeadEvent({
            phone,
            module: "digital",
            event_type: "back_navigation",
            estado: user.estado,
            interes_principal: user.interes_principal,
            subopcion: user.subopcion,
            score: user.score,
            detail: {
              trigger: "atras_command",
              estado_anterior_digital: user.estado_anterior_digital || null
            }
          });

          return res.json({
            reply: backNav.reply,
            source: "backend"
          });
        }
      }

      return res.json({
        reply: "Ahora mismo ATRAS está disponible dentro de los módulos Club, Asesoría y Digital. Si quieres, escribe MENU para ver las opciones principales.",
        source: "backend"
      });
    }

    // ========================================================
    // 2. REDIRECCIÓN MÓDULO DIGITAL
    // ========================================================
    if (String(user.estado || "").startsWith("digital_") || cleanMessage === "6") {
      if (cleanMessage === "6" && !String(user.estado || "").startsWith("digital_")) {
        user.estado = "digital_p1";
        user.interes_principal = "digital";
        user.subopcion = null;
        user.estado_anterior_digital = null;
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
        message,
        saveUser,
        classifyLead,
        CALENDLY_LINK
      });

      if (digitalRes) {
        return res.json(digitalRes);
      }
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

    const clubRes = await handleClubFlow({
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
      memberships,
      getGeminiReplyWithFallback
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
      saveUser
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
      user.club_context = null;
      user.estado_anterior_digital = null;
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

      if (
        [
          "digital_ia_chatbot_hibrido",
          "digital_ia_agente_hibrido",
          "digital_ia_procesos_hibrido"
        ].includes(String(user.estado || ""))
      ) {
        user.estado_anterior_digital = user.estado;
        user.estado = "digital_lead_calificado";
        saveUser(phone, user);

        return res.json({
          reply: `${aiReply}

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`,
          source: "gemini"
        });
      }

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
        user.club_context = null;
        user.subopcion = null;
        user.estado_anterior_digital = null;
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

También puedes usar:

🔸 *MENU*
🔸 *REINICIAR*
🔸 *ATRAS*`;
    } else if (user.interes_principal === "asesoria") {
      fallbackReply = `Entiendo. Si quieres, puedo seguir ayudándote con asesoría personalizada.

También puedes usar:

🔸 *MENU*
🔸 *REINICIAR*
🔸 *ATRAS*`;
    } else if (user.interes_principal === "digital") {
      fallbackReply = `Entiendo. Si quieres, puedo seguir ayudándote con ecommerce, automatización o crecimiento digital.

También puedes usar:

🔸 *MENU*
🔸 *REINICIAR*
🔸 *ATRAS*`;
    } else if (user.interes_principal) {
      fallbackReply = `Entiendo. Si quieres, puedo seguir ayudándote con ${user.interes_principal}.

También puedes escribir *MENU* para ver otras opciones.`;
    } else {
      fallbackReply = "No entendí del todo tu mensaje. Escribe *MENU* para ver las opciones disponibles.";
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