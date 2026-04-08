const { CALENDLY_LINK } = require("../gemini"); // Ajustado según tu estructura de services

const {
  logLeadEvent,
  logErrorEvent
} = require("../logger");

function isLikelyPhoneNumber(value = "") {
  const cleaned = String(value).replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function getFeriasContactOptions() {
  return `

Si quieres avanzar con ayuda más directa para tu viaje o participación, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión`;
}

function getFeriasProfileContext(user) {
  const base = "Perfecto. Ya tengo una idea inicial de tu interés en ferias internacionales.";
  if (!user) return base;

  const contexts = {
    feria_especifica:
      "Perfecto. Veo que ya tienes una feria en mente, así que lo importante es validar logística, agenda de negocios y preparación previa.",
    no_sabe:
      "Perfecto. Como aún no defines la feria, el primer paso es identificar cuál encaja mejor con tu sector y objetivos comerciales.",
    proveedores:
      "Perfecto. Tu enfoque es buscar proveedores; aquí la prioridad es filtrar ferias con fabricantes reales y capacidad de exportación."
  };

  return contexts[user.subopcion] || base;
}

function getFeriasLeadCuriosoReply(user) {
  return `${getFeriasProfileContext(user)}${getFeriasContactOptions()}`;
}

function getFeriasLeadTibioReply(user) {
  return `${getFeriasProfileContext(user)}\n\nHay un interés claro en asistir, así que vale la pena revisar los detalles de tu participación.${getFeriasContactOptions()}`;
}

function getFeriasLeadCalificadoReply(user) {
  return `${getFeriasProfileContext(user)}\n\nTu caso ya está en un punto donde tiene sentido avanzar con guía directa para asegurar el éxito en la feria.${getFeriasContactOptions()}`;
}

function withFeriasContactOptions(text) {
  return `${text}${getFeriasContactOptions()}`;
}

// Reutilizamos la lógica de contacto de asesoría
function getExportAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?\n\n${phone}\n\n1️⃣ Sí, a este número\n2️⃣ No, quiero dar otro número`;
}

function getFeriasAdvisorAskNewPhoneReply() {
  return "Envíame el número al que deseas que te contacten y seguimos.";
}

function getFeriasAdvisorAskScheduleReply() {
  return `¿En qué horario te conviene más el contacto?\n1️⃣ De 9 a 12 pm\n2️⃣ De 2 a 6 pm`;
}

function getFeriasAdvisorFinalReply(user) {
  const scheduleText =
    user.callback_schedule === "9_12"
      ? "de 9 a 12 pm"
      : user.callback_schedule === "2_6"
      ? "de 2 a 6 pm"
      : "en el horario indicado";

  return `Perfecto. Hemos tomado tu solicitud.

Uno de nuestros asesores te contactará al número:
${user.callback_phone || "no especificado"}

Horario solicitado:
${scheduleText}

En breve estaremos contigo para orientarte mejor sobre tu participación en ferias.`;
}

function buildFeriasLeadFreeTextReply(user, cleanMessage) {
  const text = String(cleanMessage || "").toLowerCase();

  if (/agendar|reunion|reunión|llamada|meeting|calendly/.test(text)) {
    return {
      type: "meeting",
      reply: `Perfecto. Aquí tienes el enlace para agendar tu reunión sobre ferias:\n\n${CALENDLY_LINK}\n\nAsí coordinamos los detalles con más calma.`
    };
  }

  if (/asesor|asesoria|asesoría|ayuda directa|contacto/.test(text)) {
    return { type: "advisor" };
  }

  if (/canton|cantón|china/.test(text)) {
    return {
      type: "backend",
      reply: withFeriasContactOptions(
        `La Canton Fair es la feria más grande de China. Para asistir, te ayudamos a validar si tu sector está en la fase correcta, requisitos de visa y agenda de proveedores.`
      )
    };
  }

  return null;
}

function handleFeriasFlow({
  user,
  phone,
  cleanMessage,
  saveUser,
  classifyLead,
  getFeriasCaso1,
  getFeriasCaso2,
  getFeriasCaso3,
  getFeriasInfoGeneral,
  getFeriasPreguntaFinal
}) {
  try {
    // =========================================
    // 1. FLUJO DE CONTACTO (ASESOR)
    // =========================================
    if (user.estado === "exportacion_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "exportacion_asesor_horario";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "ferias",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            flow: "ferias",
            phone_confirmation: "same_number",
            callback_phone: user.callback_phone
          }
        });

        return {
          reply: getFeriasAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "exportacion_asesor_otro_numero";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "ferias",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            flow: "ferias",
            phone_confirmation: "other_number"
          }
        });

        return {
          reply: getFeriasAdvisorAskNewPhoneReply(),
          source: "backend"
        };
      }

      return { reply: "Por favor responde con 1 o 2.", source: "backend" };
    }

    if (user.estado === "exportacion_asesor_otro_numero") {
      if (!isLikelyPhoneNumber(cleanMessage)) {
        return {
          reply: "Envíame un número válido para contacto y seguimos.",
          source: "backend"
        };
      }

      user.callback_phone = String(cleanMessage).trim();
      user.estado = "exportacion_asesor_horario";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "ferias",
        event_type: "advisor_request",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          flow: "ferias",
          phone_confirmation: "other_number_provided",
          callback_phone: user.callback_phone
        }
      });

      return {
        reply: getFeriasAdvisorAskScheduleReply(),
        source: "backend"
      };
    }

    if (user.estado === "exportacion_asesor_horario") {
      if (cleanMessage === "1") {
        user.callback_schedule = "9_12";
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "ferias",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            flow: "ferias",
            callback_phone: user.callback_phone,
            callback_schedule: user.callback_schedule
          }
        });

        return {
          reply: getFeriasAdvisorFinalReply(user),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.callback_schedule = "2_6";
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "ferias",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            flow: "ferias",
            callback_phone: user.callback_phone,
            callback_schedule: user.callback_schedule
          }
        });

        return {
          reply: getFeriasAdvisorFinalReply(user),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2 para elegir el horario.",
        source: "backend"
      };
    }

    // =========================================
    // 2. CUESTIONARIO DE FERIAS (P1 A P3)
    // =========================================
    if (user.estado === "ferias_p1") {
      const cases = {
        "1": "feria_especifica",
        "2": "no_sabe",
        "3": "proveedores"
      };

      if (cases[cleanMessage]) {
        user.subopcion = cases[cleanMessage];
        user.estado = "ferias_p2";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "ferias",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: cleanMessage,
            step: "ferias_p1_to_p2"
          }
        });

        const getReply = {
          "1": getFeriasCaso1,
          "2": getFeriasCaso2,
          "3": getFeriasCaso3
        };

        return { reply: getReply[cleanMessage](), source: "backend" };
      }

      if (cleanMessage === "4") {
        user.estado = "lead_curioso";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "ferias",
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

        return { reply: getFeriasInfoGeneral(), source: "backend" };
      }

      return { reply: "Por favor responde con 1, 2, 3 o 4.", source: "backend" };
    }

    if (user.estado === "ferias_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return { reply: "Responde con 1, 2 o 3.", source: "backend" };
      }

      user.score += cleanMessage === "1" ? 3 : 1;
      user.estado = "ferias_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "ferias",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "ferias_p2_to_p3"
        }
      });

      return { reply: getFeriasPreguntaFinal(), source: "backend" };
    }

    if (user.estado === "ferias_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return { reply: "Responde con 1, 2 o 3.", source: "backend" };
      }

      user.score += cleanMessage === "1" ? 3 : 0;

      const previousState = user.estado;
      user.estado = classifyLead(user);
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "ferias",
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
        lead_calificado: getFeriasLeadCalificadoReply,
        lead_tibio: getFeriasLeadTibioReply,
        lead_curioso: getFeriasLeadCuriosoReply
      };

      return { reply: leadReplies[user.estado](user), source: "backend" };
    }

    // ========================================================
    // 3. MANEJO DE SELECCIÓN DIRECTA
    // ========================================================
    if (
      ["lead_curioso", "lead_tibio", "lead_calificado"].includes(user.estado) &&
      user.interes_principal === "ferias"
    ) {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "ferias",
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

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "ferias",
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
          reply: `Perfecto. Aquí tienes el enlace para agendar tu reunión sobre ferias:\n\n${CALENDLY_LINK}\n\nAsí coordinamos tu participación de inmediato.`,
          source: "backend"
        };
      }

      const freeText = buildFeriasLeadFreeTextReply(user, cleanMessage);
      if (freeText) {
        if (freeText.type === "advisor") {
          logLeadEvent({
            phone,
            module: "ferias",
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
            module: "ferias",
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
    console.error("Error en handleFeriasFlow:", error);

    logErrorEvent({
      phone,
      module: "ferias",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "ferias"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = { handleFeriasFlow };