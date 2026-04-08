const {
  getDigitalMejorarTiendaPaso4,
  getDigitalIAPaso3,
  getDigitalIAPaso4,
  getDigitalMarketingPaso4,
  getDigitalInfoGeneral,
  getDigitalInfoGeneralPaso3
} = require("../menu");

const {
  logLeadEvent,
  logErrorEvent
} = require("../logger");

function isLikelyPhoneNumber(value = "") {
  const cleaned = String(value).replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function getDigitalLeadOfferOptions() {
  return `

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

function getDigitalProfileContext(user) {
  if (!user) {
    return `Perfecto. Ya tengo una idea inicial de tu caso digital.`;
  }

  if (user.subopcion === "crear_tienda") {
    return `Perfecto. Veo que tu interés está en crear o estructurar mejor tu canal digital.

Eso normalmente significa que estás en una etapa donde conviene ordenar bien plataforma, alcance y prioridad para no avanzar con una tienda incompleta o mal planteada.`;
  }

  if (user.subopcion === "mejorar_tienda") {
    return `Perfecto. Veo que ya tienes una base digital y lo importante ahora no es seguir moviendo piezas al azar, sino detectar qué está frenando resultados y cómo corregirlo con criterio.`;
  }

  if (user.subopcion === "ia_automatizacion") {
    return `Perfecto. Veo que tu interés va por automatización o IA, y ahí lo más importante es definir bien qué parte del negocio quieres mejorar primero para que la solución tenga sentido comercial.`;
  }

  if (user.subopcion === "marketing_ventas") {
    return `Perfecto. Veo que tu caso está más enfocado en visibilidad, leads o ventas, así que aquí conviene ordenar mejor el punto de partida antes de meter más esfuerzo o presupuesto sin dirección clara.`;
  }

  if (user.subopcion === "info_general") {
    return `Perfecto. Veo que todavía estás ordenando el panorama, así que lo importante es identificar qué área te conviene trabajar primero para que el siguiente paso tenga más sentido.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu caso digital.`;
}

function getDigitalLeadCuriosoReply() {
  return `Veo que por ahora estás explorando posibilidades. En esta etapa, lo más útil suele ser aclarar bien qué necesitas y cuál sería el camino más conveniente antes de avanzar.${getDigitalLeadOfferOptions()}`;
}

function getDigitalLeadTibioReply(user) {
  return `${getDigitalProfileContext(user)}

Ya hay señales claras de interés, así que sí vale la pena revisar tu caso con más enfoque para ayudarte a tomar mejores decisiones.${getDigitalLeadOfferOptions()}`;
}

function getDigitalLeadCalificadoReply(user) {
  return `${getDigitalProfileContext(user)}

Tu caso ya está en un punto donde tiene bastante sentido avanzar con guía más directa para ayudarte a estructurar mejor tu ecommerce, automatización o estrategia digital.${getDigitalLeadOfferOptions()}`;
}

function getDigitalAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`;
}

function getDigitalAdvisorAskNewPhoneReply() {
  return `Perfecto. Envíame el número al que deseas que te contacten y seguimos.`;
}

function getDigitalAdvisorAskScheduleReply() {
  return `Perfecto. ¿En qué horario te conviene más que te contacten?

1️⃣ De 9 a 12 pm
2️⃣ De 2 a 6 pm`;
}

function getDigitalAdvisorFinalReply(user) {
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

En breve estaremos contigo para revisar tu caso de ecommerce, automatización o crecimiento digital.`;
}

function getDigitalMeetingReply(calendlyLink) {
  const link = calendlyLink || "https://calendly.com/oneorbix/asesoria";

  return `Perfecto. Aquí tienes el enlace para agendar tu reunión sobre Ecommerce e IA:

${link}

Así podemos revisar tu caso con más calma y orientarte según la etapa exacta en la que estás.`;
}

function buildDigitalLeadReply(user) {
  if (user.estado === "digital_lead_calificado") {
    return getDigitalLeadCalificadoReply(user);
  }

  if (user.estado === "digital_lead_tibio") {
    return getDigitalLeadTibioReply(user);
  }

  return getDigitalLeadCuriosoReply();
}

function closeDigitalLead({ user, phone, saveUser, classifyLead }) {
  const resultTag = classifyLead(user);
  const previousState = user.estado;

  if (resultTag === "lead_calificado") {
    user.estado = "digital_lead_calificado";
  } else if (resultTag === "lead_tibio") {
    user.estado = "digital_lead_tibio";
  } else {
    user.estado = "digital_lead_curioso";
  }

  saveUser(phone, user);

  logLeadEvent({
    phone,
    module: "digital",
    event_type: "lead_classified",
    estado: user.estado,
    interes_principal: user.interes_principal,
    subopcion: user.subopcion,
    score: user.score,
    detail: {
      previous_state: previousState,
      result_tag: resultTag
    }
  });

  return {
    reply: buildDigitalLeadReply(user),
    source: "backend"
  };
}

function handleDigitalFlow({
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
}) {
  try {
    // ========================================================
    // 1. CAPA DE CONTACTO DIGITAL
    // ========================================================
    if (
      ["digital_lead_curioso", "digital_lead_tibio", "digital_lead_calificado"].includes(user.estado)
    ) {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "digital",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "digital_asesor_confirmar_numero";
        saveUser(phone, user);

        return {
          reply: getDigitalAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "digital",
          event_type: "meeting_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "meeting_requested"
          }
        });

        user.estado = "finalizado";
        saveUser(phone, user);

        return {
          reply: getDigitalMeetingReply(CALENDLY_LINK),
          source: "backend"
        };
      }

      return {
        reply: buildDigitalLeadReply(user),
        source: "backend"
      };
    }

    if (user.estado === "digital_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "digital_asesor_horario";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
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
          reply: getDigitalAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "digital_asesor_otro_numero";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
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
          reply: getDigitalAdvisorAskNewPhoneReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2.",
        source: "backend"
      };
    }

    if (user.estado === "digital_asesor_otro_numero") {
      if (!isLikelyPhoneNumber(cleanMessage)) {
        return {
          reply: "Envíame un número válido para contacto y seguimos con el horario.",
          source: "backend"
        };
      }

      user.callback_phone = String(cleanMessage).trim();
      user.estado = "digital_asesor_horario";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
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
        reply: getDigitalAdvisorAskScheduleReply(),
        source: "backend"
      };
    }

    if (user.estado === "digital_asesor_horario") {
      if (cleanMessage === "1") {
        user.callback_schedule = "9_12";
        user.estado = "finalizado";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
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
          reply: getDigitalAdvisorFinalReply(user),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.callback_schedule = "2_6";
        user.estado = "finalizado";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
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
          reply: getDigitalAdvisorFinalReply(user),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2 para elegir el horario.",
        source: "backend"
      };
    }

    // ========================================================
    // 2. PASO 1 - ENTRADA AL MÓDULO DIGITAL
    // ========================================================
    if (user.estado === "digital_p1") {
      const p1Options = {
        "1": {
          estado: "digital_crear_p2",
          subopcion: "crear_tienda",
          reply: getDigitalCrearTiendaPaso2
        },
        "2": {
          estado: "digital_mejorar_p2",
          subopcion: "mejorar_tienda",
          reply: getDigitalMejorarTiendaPaso2
        },
        "3": {
          estado: "digital_ia_p2",
          subopcion: "ia_automatizacion",
          reply: getDigitalIAPaso2
        },
        "4": {
          estado: "digital_marketing_p2",
          subopcion: "marketing_ventas",
          reply: getDigitalMarketingPaso2
        }
      };

      if (p1Options[cleanMessage]) {
        user.estado = p1Options[cleanMessage].estado;
        user.subopcion = p1Options[cleanMessage].subopcion;
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: cleanMessage,
            step: "digital_p1_transition",
            branch: user.subopcion
          }
        });

        return {
          reply: p1Options[cleanMessage].reply(),
          source: "backend"
        };
      }

      if (cleanMessage === "5") {
        user.estado = "digital_info_p2";
        user.subopcion = "info_general";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "digital",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "5",
            step: "digital_p1_to_info_p2",
            branch: user.subopcion
          }
        });

        return {
          reply: getDigitalInfoGeneral(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con un número del 1 al 5.",
        source: "backend"
      };
    }

    // ========================================================
    // 3. RAMA CREAR TIENDA
    // ========================================================
    if (user.estado === "digital_crear_p2") {
      if (!["1", "2", "3", "4"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2, 3 o 4.",
          source: "backend"
        };
      }

      user.score += cleanMessage === "4" ? 1 : 3;
      user.estado = "digital_crear_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_crear_p2_to_p3",
          branch: "crear_tienda"
        }
      });

      return {
        reply: getDigitalCrearTiendaPaso3(),
        source: "backend"
      };
    }

    if (user.estado === "digital_crear_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 2;
      if (cleanMessage === "3") user.score += 1;

      user.estado = "digital_crear_p4";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_crear_p3_to_p4",
          branch: "crear_tienda"
        }
      });

      return {
        reply: getDigitalPreguntaIntencion(),
        source: "backend"
      };
    }

    if (user.estado === "digital_crear_p4") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 1;
      if (cleanMessage === "3") user.score += 0;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // ========================================================
    // 4. RAMA MEJORAR TIENDA
    // ========================================================
    if (user.estado === "digital_mejorar_p2") {
      if (!["1", "2", "3", "4"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2, 3 o 4.",
          source: "backend"
        };
      }

      user.score += cleanMessage === "4" ? 1 : 2;
      user.estado = "digital_mejorar_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_mejorar_p2_to_p3",
          branch: "mejorar_tienda"
        }
      });

      return {
        reply: getDigitalMejorarTiendaPaso3(),
        source: "backend"
      };
    }

    if (user.estado === "digital_mejorar_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 2;
      if (cleanMessage === "3") user.score += 3;

      user.estado = "digital_mejorar_p4";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_mejorar_p3_to_p4",
          branch: "mejorar_tienda"
        }
      });

      return {
        reply: getDigitalMejorarTiendaPaso4(),
        source: "backend"
      };
    }

    if (user.estado === "digital_mejorar_p4") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 1;
      if (cleanMessage === "3") user.score += 0;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // ========================================================
    // 5. RAMA IA / AUTOMATIZACIÓN
    // ========================================================
    if (user.estado === "digital_ia_p2") {
      if (!["1", "2", "3", "4"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2, 3 o 4.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 3;
      if (cleanMessage === "3") user.score += 2;
      if (cleanMessage === "4") user.score += 1;

      user.estado = "digital_ia_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_ia_p2_to_p3",
          branch: "ia_automatizacion"
        }
      });

      return {
        reply: getDigitalIAPaso3(),
        source: "backend"
      };
    }

    if (user.estado === "digital_ia_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 2;
      if (cleanMessage === "3") user.score += 1;

      user.estado = "digital_ia_p4";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_ia_p3_to_p4",
          branch: "ia_automatizacion"
        }
      });

      return {
        reply: getDigitalIAPaso4(),
        source: "backend"
      };
    }

    if (user.estado === "digital_ia_p4") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 1;
      if (cleanMessage === "3") user.score += 0;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // ========================================================
    // 6. RAMA MARKETING / SEO / VENTAS
    // ========================================================
    if (user.estado === "digital_marketing_p2") {
      if (!["1", "2", "3", "4"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2, 3 o 4.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 2;
      if (cleanMessage === "3") user.score += 3;
      if (cleanMessage === "4") user.score += 1;

      user.estado = "digital_marketing_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_marketing_p2_to_p3",
          branch: "marketing_ventas"
        }
      });

      return {
        reply: getDigitalMarketingPaso3(),
        source: "backend"
      };
    }

    if (user.estado === "digital_marketing_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 2;
      if (cleanMessage === "3") user.score += 1;

      user.estado = "digital_marketing_p4";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_marketing_p3_to_p4",
          branch: "marketing_ventas"
        }
      });

      return {
        reply: getDigitalMarketingPaso4(),
        source: "backend"
      };
    }

    if (user.estado === "digital_marketing_p4") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 1;
      if (cleanMessage === "3") user.score += 0;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // ========================================================
    // 7. RAMA INFORMACIÓN GENERAL
    // ========================================================
    if (user.estado === "digital_info_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.score += 2;
        user.subopcion = "crear_tienda";
      }

      if (cleanMessage === "2") {
        user.score += 3;
        user.subopcion = "ia_automatizacion";
      }

      if (cleanMessage === "3") {
        user.score += 2;
        user.subopcion = "marketing_ventas";
      }

      user.estado = "digital_info_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "digital_info_p2_to_p3",
          branch: "info_general"
        }
      });

      return {
        reply: getDigitalInfoGeneralPaso3(),
        source: "backend"
      };
    }

    if (user.estado === "digital_info_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") user.score += 3;
      if (cleanMessage === "2") user.score += 1;
      if (cleanMessage === "3") user.score += 0;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    return null;
  } catch (error) {
    console.error("Error en handleDigitalFlow:", error);

    logErrorEvent({
      phone,
      module: "digital",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "digital"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = { handleDigitalFlow };