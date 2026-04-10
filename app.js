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

function isFinalState(estado = "") {
  return [
    "lead_curioso",
    "lead_tibio",
    "lead_calificado",
    "digital_lead_calificado"
  ].includes(estado) || String(estado).endsWith("_lead_calificado");
}

function appendNavigationHint(reply) {
  return `${reply}\n\nSi quieres ver otras opciones, escribe MENU.\nSi quieres empezar de cero, escribe REINICIAR.`;
}

function shouldAppendNavigationHint(reply, user) {
  const text = String(reply || "");

  if (!text.trim()) return false;
  if (text.includes("escribe MENU") || text.includes("escribe REINICIAR")) {
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

function shouldUseGemini(user, cleanMessage, rawMessage) {
  if (!user) return false;

  const detectedIntent = detectIntent(rawMessage);
  if (isKnownBackendIntent(detectedIntent)) {
    return false;
  }

  const isQualifiedLead =
    user.estado === "lead_tibio" || user.estado === "lead_calificado";

  return isQualifiedLead && !isClosedOption(cleanMessage);
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
        reply: `Hola 👋 Soy Orby, el asistente comercial de OneOrbix.\n\n${getMenu()}`,
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
    // 4.5 RETORNO AUTOMÁTICO AL MENÚ DESDE ESTADOS FINALES
    // ========================================================
    if (
      isFinalState(user.estado) &&
      !isMenuCommand(cleanMessage) &&
      !isRestartCommand(cleanMessage)
    ) {
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
      const prompt = `Usuario interesado en ${user.interes_principal}. Responde breve y comercial: ${message}`;
      const aiReply = await getGeminiReplyWithFallback(
        prompt,
        user,
        "Entiendo. ¿Quieres que agendemos una reunión?"
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

    return res.json({
      reply: "No entendí tu respuesta. Escribe MENU para volver al inicio.",
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