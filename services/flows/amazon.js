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

function getAmazonLeadOfferOptions() {
  return `

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

function getAmazonProfileContext(user) {
  if (!user) {
    return `Perfecto. Ya tengo una idea inicial de tu caso en Amazon.`;
  }

  if (user.subopcion === "producto") {
    return `Perfecto. Veo que ya vienes con una intención bastante clara para Amazon.

Eso normalmente significa que ya no estás en la etapa de “a ver qué se me ocurre”, sino en una fase donde conviene revisar si el producto realmente vale la pena, qué tan competido está y cómo se debería mover con más criterio.`;
  }

  if (user.subopcion === "sin_producto") {
    return `Perfecto. Veo que todavía no tienes producto definido, así que la prioridad no es correr a abrir cuenta o buscar cualquier cosa, sino elegir con más criterio qué sí tendría sentido vender en Amazon.`;
  }

  if (user.subopcion === "guia") {
    return `Perfecto. Veo que tu caso va más por guía completa para comenzar, y ahí lo más importante es ordenar bien el punto de partida para no avanzar con piezas sueltas.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu caso en Amazon.`;
}

function getAmazonLeadCuriosoReply(user) {
  return `${getAmazonProfileContext(user)}${getAmazonLeadOfferOptions()}`;
}

function getAmazonLeadTibioReply(user) {
  return `${getAmazonProfileContext(user)}

Ya hay señales claras de interés, así que sí vale la pena que uno de nuestros asesores revise tu caso con más enfoque.${getAmazonLeadOfferOptions()}`;
}

function getAmazonLeadCalificadoReply(user) {
  return `${getAmazonProfileContext(user)}

Tu caso ya está en un punto donde tiene bastante sentido avanzar con guía más directa para ayudarte a tomar mejores decisiones en Amazon.${getAmazonLeadOfferOptions()}`;
}

function getAmazonAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`;
}

function getAmazonAdvisorAskNewPhoneReply() {
  return `Perfecto. Envíame el número al que deseas que te contacten y seguimos.`;
}

function getAmazonAdvisorAskScheduleReply() {
  return `Perfecto. ¿En qué horario te conviene más que te contacten?

1️⃣ De 9 a 12 pm
2️⃣ De 2 a 6 pm`;
}

function getAmazonAdvisorFinalReply(user) {
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

En breve estaremos contigo para orientarte mejor según tu caso en Amazon.`;
}

function handleAmazonFlow({
  user,
  phone,
  cleanMessage,
  saveUser,
  classifyLead,
  getAmazonCaso1,
  getAmazonCaso2,
  getAmazonCaso3,
  getAmazonInfoGeneral,
  getAmazonPreguntaFinal
}) {
  try {
    // =========================
    // AMAZON - CONTACTO ASESOR
    // =========================

    if (user.estado === "amazon_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "amazon_asesor_horario";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
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
          reply: getAmazonAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "amazon_asesor_otro_numero";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
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
          reply: getAmazonAdvisorAskNewPhoneReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2.",
        source: "backend"
      };
    }

    if (user.estado === "amazon_asesor_otro_numero") {
      if (!isLikelyPhoneNumber(cleanMessage)) {
        return {
          reply: "Envíame un número válido para contacto y seguimos con el horario.",
          source: "backend"
        };
      }

      user.callback_phone = String(cleanMessage).trim();
      user.estado = "amazon_asesor_horario";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "amazon",
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

      return {
        reply: getAmazonAdvisorAskScheduleReply(),
        source: "backend"
      };
    }

    if (user.estado === "amazon_asesor_horario") {
      if (cleanMessage === "1") {
        user.callback_schedule = "9_12";
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
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

        return {
          reply: getAmazonAdvisorFinalReply(user),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.callback_schedule = "2_6";
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
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

        return {
          reply: getAmazonAdvisorFinalReply(user),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2 para elegir el horario.",
        source: "backend"
      };
    }

    // =========================
    // AMAZON - PASO 1
    // =========================

    if (user.estado === "amazon_p1") {
      if (cleanMessage === "1") {
        user.estado = "amazon_p2";
        user.subopcion = "producto";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "1",
            step: "amazon_p1_to_p2"
          }
        });

        return {
          reply: getAmazonCaso1(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "amazon_p2";
        user.subopcion = "sin_producto";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "2",
            step: "amazon_p1_to_p2"
          }
        });

        return {
          reply: getAmazonCaso2(),
          source: "backend"
        };
      }

      if (cleanMessage === "3") {
        user.estado = "amazon_p2";
        user.subopcion = "guia";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "3",
            step: "amazon_p1_to_p2"
          }
        });

        return {
          reply: getAmazonCaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "4") {
        user.estado = "lead_curioso";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "amazon",
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

        return {
          reply: getAmazonInfoGeneral(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1, 2, 3 o 4.",
        source: "backend"
      };
    }

    // =========================
    // AMAZON - PASO 2
    // =========================

    if (user.estado === "amazon_p2") {
      if (user.subopcion === "producto") {
        if (cleanMessage === "1") {
          user.score += 3;
        } else if (cleanMessage === "2" || cleanMessage === "3") {
          user.score += 2;
        } else {
          return {
            reply: "Por favor responde con 1, 2 o 3.",
            source: "backend"
          };
        }
      }

      if (user.subopcion === "sin_producto") {
        if (cleanMessage === "1") {
          user.score += 3;
        } else if (cleanMessage === "2") {
          user.score += 2;
        } else if (cleanMessage === "3") {
          user.score += 0;
        } else {
          return {
            reply: "Por favor responde con 1, 2 o 3.",
            source: "backend"
          };
        }
      }

      if (user.subopcion === "guia") {
        if (cleanMessage === "1") {
          user.score += 1;
        } else if (cleanMessage === "2") {
          user.score += 2;
        } else if (cleanMessage === "3") {
          user.score += 3;
        } else {
          return {
            reply: "Por favor responde con 1, 2 o 3.",
            source: "backend"
          };
        }
      }

      user.estado = "amazon_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "amazon",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "amazon_p2_to_p3"
        }
      });

      return {
        reply: getAmazonPreguntaFinal(),
        source: "backend"
      };
    }

    // =========================
    // AMAZON - PASO 3
    // =========================

    if (user.estado === "amazon_p3") {
      if (cleanMessage === "1") {
        user.score += 3;
      } else if (cleanMessage === "2") {
        user.score += 1;
      } else if (cleanMessage === "3") {
        user.score += 0;
      } else {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      const previousState = user.estado;
      user.estado = classifyLead(user);
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "amazon",
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

      if (user.estado === "lead_calificado") {
        return {
          reply: getAmazonLeadCalificadoReply(user),
          source: "backend"
        };
      }

      if (user.estado === "lead_tibio") {
        return {
          reply: getAmazonLeadTibioReply(user),
          source: "backend"
        };
      }

      return {
        reply: getAmazonLeadCuriosoReply(user),
        source: "backend"
      };
    }

    // =========================
    // AMAZON - LEADS
    // =========================
    // CIERRE DIRECTO:
    // 1 -> asesor
    // 2 -> meeting
    // Sin capas extra de submenú
    // =========================

    if (
      user.interes_principal === "amazon" &&
      ["lead_curioso", "lead_tibio", "lead_calificado"].includes(user.estado)
    ) {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "amazon",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "amazon_asesor_confirmar_numero";
        saveUser(phone, user);

        return {
          reply: getAmazonAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "amazon",
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
          reply: `Perfecto. Aquí tienes el enlace para agendar tu reunión vía meeting:

${CALENDLY_LINK}

Así podemos revisar tu caso con más calma y orientarte según la etapa exacta en la que estás con Amazon.`,
          source: "backend"
        };
      }

      if (user.estado === "lead_calificado") {
        return {
          reply: getAmazonLeadCalificadoReply(user),
          source: "backend"
        };
      }

      if (user.estado === "lead_tibio") {
        return {
          reply: getAmazonLeadTibioReply(user),
          source: "backend"
        };
      }

      return {
        reply: getAmazonLeadCuriosoReply(user),
        source: "backend"
      };
    }

    return null;
  } catch (error) {
    console.error("Error en handleAmazonFlow:", error);

    logErrorEvent({
      phone,
      module: "amazon",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "amazon"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = {
  handleAmazonFlow
};