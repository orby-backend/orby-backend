const CALENDLY_LINK = "https://calendly.com/oneorbix/30min";

const {
  logLeadEvent,
  logErrorEvent
} = require("../logger");

function isLikelyPhoneNumber(value = "") {
  const cleaned = String(value).replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function getExportContactOptions() {
  return `

Si quieres avanzar con ayuda más directa, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión`;
}

function getExportProfileContext(user) {
  const base = "Perfecto. Ya tengo una idea inicial de tu caso de exportación.";
  if (!user) return base;

  const contexts = {
    producto_listo:
      "Perfecto. Veo que ya tienes un producto listo, así que lo importante es validar potencial exportable y mercado objetivo.",
    producto_no_valido:
      "Perfecto. Tu caso va por validar si el producto sirve para exportación; la prioridad es revisar mercado y viabilidad.",
    sin_definir:
      "Perfecto. Como estás definiendo producto o mercado, lo más importante es ordenar el punto de partida antes de ejecutar."
  };

  return contexts[user.subopcion] || base;
}

// Respuestas de clasificación que entregan el menú inicial
function getExportLeadCuriosoReply(user) {
  return `${getExportProfileContext(user)}${getExportContactOptions()}`;
}

function getExportLeadTibioReply(user) {
  return `${getExportProfileContext(user)}\n\nYa hay señales claras de interés, vale la pena revisar tu caso con más enfoque.${getExportContactOptions()}`;
}

function getExportLeadCalificadoReply(user) {
  return `${getExportProfileContext(user)}\n\nTu caso ya permite avanzar con guía directa para tomar mejores decisiones.${getExportContactOptions()}`;
}

function withContactOptions(text) {
  return `${text}${getExportContactOptions()}`;
}

function getExportAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?\n\n${phone}\n\n1️⃣ Sí, a este número\n2️⃣ No, quiero dar otro número`;
}

function getExportAdvisorAskNewPhoneReply() {
  return `Perfecto. Envíame el número al que deseas que te contacten y seguimos.`;
}

function getExportAdvisorAskScheduleReply() {
  return `Perfecto. ¿En qué horario te conviene más que te contacten?\n\n1️⃣ De 9 a 12 pm\n2️⃣ De 2 a 6 pm`;
}

function getExportAdvisorFinalReply(user) {
  const scheduleText =
    user.callback_schedule === "9_12" ? "de 9 a 12 pm" : "de 2 a 6 pm";

  return `Perfecto. Hemos tomado tu solicitud.\n\nUno de nuestros asesores te contactará al número:\n${user.callback_phone || "no especificado"}\n\nHorario solicitado:\n${scheduleText}\n\nEn breve estaremos contigo para orientarte mejor.`;
}

function buildExportLeadFreeTextReply(user, cleanMessage) {
  const text = String(cleanMessage || "").toLowerCase();

  if (/agendar|reunion|reunión|llamada|meeting|calendly/.test(text)) {
    return {
      type: "meeting",
      reply: `Perfecto. Aquí tienes el enlace para agendar tu reunión:\n\n${CALENDLY_LINK}\n\nAsí podemos revisar tu caso con más calma.`
    };
  }

  if (/asesor|asesoria|asesoría|ayuda directa|contacto/.test(text)) {
    return { type: "advisor" };
  }

  // Respuestas informativas si el usuario pregunta en lugar de elegir número
  if (/usa|estados unidos|eeuu/.test(text)) {
    return {
      type: "backend",
      reply: withContactOptions(
        `Para exportar a Estados Unidos, primero validamos el encaje del producto y la viabilidad logística. Es un mercado exigente pero con gran potencial si se ordena bien la base.`
      )
    };
  }

  return null;
}

function handleExportacionFlow({
  user,
  phone,
  cleanMessage,
  saveUser,
  classifyLead,
  getExportacionCaso1,
  getExportacionCaso2,
  getExportacionCaso3,
  getExportacionInfoGeneral,
  getExportacionPreguntaFinal
}) {
  try {
    // =========================================
    // 1. FLUJO DE ASESOR (CONFIRMACIONES)
    // =========================================
    if (user.estado === "exportacion_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "exportacion_asesor_horario";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            phone_confirmation: "same_number",
            callback_phone: user.callback_phone
          }
        });

        return {
          reply: getExportAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "exportacion_asesor_otro_numero";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            phone_confirmation: "other_number"
          }
        });

        return {
          reply: getExportAdvisorAskNewPhoneReply(),
          source: "backend"
        };
      }

      return { reply: "Por favor responde con 1 o 2.", source: "backend" };
    }

    if (user.estado === "exportacion_asesor_otro_numero") {
      if (!isLikelyPhoneNumber(cleanMessage)) {
        return {
          reply: "Envíame un número válido para contacto.",
          source: "backend"
        };
      }

      user.callback_phone = String(cleanMessage).trim();
      user.estado = "exportacion_asesor_horario";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "exportacion",
        event_type: "advisor_request",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          phone_confirmation: "other_number_provided",
          callback_phone: user.callback_phone
        }
      });

      return { reply: getExportAdvisorAskScheduleReply(), source: "backend" };
    }

    if (user.estado === "exportacion_asesor_horario") {
      if (["1", "2"].includes(cleanMessage)) {
        user.callback_schedule = cleanMessage === "1" ? "9_12" : "2_6";
        user.estado = "lead_tibio"; // Finaliza el flujo de contacto
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            callback_phone: user.callback_phone,
            callback_schedule: user.callback_schedule
          }
        });

        return { reply: getExportAdvisorFinalReply(user), source: "backend" };
      }

      return {
        reply: "Por favor responde con 1 o 2 para elegir el horario.",
        source: "backend"
      };
    }

    // =========================================
    // 2. CUESTIONARIO INICIAL (P1 A P3)
    // =========================================
    if (user.estado === "exportacion_p1") {
      const cases = {
        "1": "producto_listo",
        "2": "producto_no_valido",
        "3": "sin_definir"
      };

      if (cases[cleanMessage]) {
        user.subopcion = cases[cleanMessage];
        user.estado = "exportacion_p2";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: cleanMessage,
            step: "exportacion_p1_to_p2"
          }
        });

        const getReply = {
          "1": getExportacionCaso1,
          "2": getExportacionCaso2,
          "3": getExportacionCaso3
        };

        return { reply: getReply[cleanMessage](), source: "backend" };
      }

      if (cleanMessage === "4") {
        user.estado = "lead_curioso";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "lead_classified",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "4",
            reason: "informacion_general"
          }
        });

        return { reply: getExportacionInfoGeneral(), source: "backend" };
      }

      return { reply: "Por favor responde con 1, 2, 3 o 4.", source: "backend" };
    }

    if (user.estado === "exportacion_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return { reply: "Responde con 1, 2 o 3.", source: "backend" };
      }

      user.score += cleanMessage === "1" ? 3 : 1;
      user.estado = "exportacion_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "exportacion",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "exportacion_p2_to_p3"
        }
      });

      return { reply: getExportacionPreguntaFinal(), source: "backend" };
    }

    if (user.estado === "exportacion_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return { reply: "Responde con 1, 2 o 3.", source: "backend" };
      }

      user.score += cleanMessage === "1" ? 3 : 0;

      const previousState = user.estado;
      user.estado = classifyLead(user);
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "exportacion",
        event_type: "lead_classified",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          previous_state: previousState,
          selected_option: cleanMessage
        }
      });

      const leadReplies = {
        lead_calificado: getExportLeadCalificadoReply,
        lead_tibio: getExportLeadTibioReply,
        lead_curioso: getExportLeadCuriosoReply
      };

      return { reply: leadReplies[user.estado](user), source: "backend" };
    }

    // ========================================================
    // 3. MANEJO DE SELECCIÓN (ELIMINA LA CAPA 4-1-1-1 ERRÓNEA)
    // ========================================================
    if (["lead_curioso", "lead_tibio", "lead_calificado"].includes(user.estado)) {
      // OPCIÓN 1: IR DIRECTO AL ASESOR (CONFIRMAR NÚMERO)
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "exportacion_asesor_confirmar_numero";
        saveUser(phone, user);

        return { reply: getExportAdvisorConfirmationReply(phone), source: "backend" };
      }

      // OPCIÓN 2: IR DIRECTO AL LINK DE REUNIÓN
      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "exportacion",
          event_type: "meeting_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "meeting_requested"
          }
        });

        return {
          reply: `Perfecto. Aquí tienes el enlace para agendar tu reunión:\n\n${CALENDLY_LINK}\n\nAsí revisamos tu caso directamente.`,
          source: "backend"
        };
      }

      // Si envía texto libre, procesamos con Regex
      const freeText = buildExportLeadFreeTextReply(user, cleanMessage);
      if (freeText) {
        if (freeText.type === "advisor") {
          logLeadEvent({
            phone,
            module: "exportacion",
            event_type: "cta_selected",
            estado: user.estado,
            interes_principal: user.interes_principal,
            subopcion: user.subopcion,
            score: user.score,
            detail: {
              action: "advisor_requested",
              trigger: "free_text"
            }
          });

          user.estado = "exportacion_asesor_confirmar_numero";
          saveUser(phone, user);

          return { reply: getExportAdvisorConfirmationReply(phone), source: "backend" };
        }

        if (freeText.type === "meeting") {
          logLeadEvent({
            phone,
            module: "exportacion",
            event_type: "meeting_request",
            estado: user.estado,
            interes_principal: user.interes_principal,
            subopcion: user.subopcion,
            score: user.score,
            detail: {
              action: "meeting_requested",
              trigger: "free_text"
            }
          });
        }

        return { reply: freeText.reply, source: "backend" };
      }
    }

    return null;
  } catch (error) {
    console.error("Error en handleExportacionFlow:", error);

    logErrorEvent({
      phone,
      module: "exportacion",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "exportacion"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = { handleExportacionFlow };