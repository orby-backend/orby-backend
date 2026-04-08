const {
  logLeadEvent,
  logErrorEvent
} = require("../logger");

function handleImportacionFlow({
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
}) {
  try {
    // =========================
    // FLUJO DE CONTACTO ASESOR - IMPORTACIÓN
    // =========================

    if (user.estado === "importacion_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "importacion_asesor_horario";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "importacion_asesor_otro_numero";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportAdvisorAskNewPhoneReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2.",
        source: "backend"
      };
    }

    if (user.estado === "importacion_asesor_otro_numero") {
      if (!isLikelyPhoneNumber(message)) {
        return {
          reply: "Envíame un número válido para contacto y seguimos con el horario.",
          source: "backend"
        };
      }

      user.callback_phone = String(message).trim();
      user.estado = "importacion_asesor_horario";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "importacion",
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
        reply: getImportAdvisorAskScheduleReply(),
        source: "backend"
      };
    }

    if (user.estado === "importacion_asesor_horario") {
      if (cleanMessage === "1") {
        user.callback_schedule = "9_12";
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportAdvisorFinalReply(user),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.callback_schedule = "2_6";
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportAdvisorFinalReply(user),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2 para elegir el horario.",
        source: "backend"
      };
    }

    // =========================
    // IMPORTACIÓN - PASO 1
    // =========================

    if (user.estado === "importacion_p1") {
      if (cleanMessage === "1") {
        user.estado = "importacion_p2";
        user.subopcion = "producto_definido";
        user.detalle_importacion = null;
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "1",
            step: "importacion_p1_to_p2"
          }
        });

        return {
          reply: getImportacionCaso1(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "importacion_p2";
        user.subopcion = "sin_producto";
        user.detalle_importacion = null;
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "2",
            step: "importacion_p1_to_p2"
          }
        });

        return {
          reply: getImportacionCaso2(),
          source: "backend"
        };
      }

      if (cleanMessage === "3") {
        user.estado = "importacion_p2";
        user.subopcion = "busca_proveedor";
        user.detalle_importacion = null;
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "3",
            step: "importacion_p1_to_p2"
          }
        });

        return {
          reply: getImportacionCaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "4") {
        user.estado = "lead_curioso";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportacionInfoGeneral(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1, 2, 3 o 4.",
        source: "backend"
      };
    }

    // =========================
    // IMPORTACIÓN - PASO 2
    // =========================

    if (user.estado === "importacion_p2") {
      if (user.subopcion === "producto_definido") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.detalle_importacion = "ya_importo";
        } else if (cleanMessage === "2") {
          user.score += 1;
          user.detalle_importacion = "primera_vez";
        } else {
          return {
            reply: "Por favor responde con 1 o 2.",
            source: "backend"
          };
        }
      }

      if (user.subopcion === "sin_producto") {
        if (cleanMessage === "1") {
          user.score += 2;
          user.detalle_importacion = "vender_ecuador";
        } else if (cleanMessage === "2") {
          user.score += 2;
          user.detalle_importacion = "vender_amazon";
        } else if (cleanMessage === "3") {
          user.score += 0;
          user.detalle_importacion = "explorando";
        } else {
          return {
            reply: "Por favor responde con 1, 2 o 3.",
            source: "backend"
          };
        }
      }

      if (user.subopcion === "busca_proveedor") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.detalle_importacion = "producto_definido_proveedor";
        } else if (cleanMessage === "2") {
          user.score += 2;
          user.detalle_importacion = "definir_producto_y_proveedor";
        } else {
          return {
            reply: "Por favor responde con 1 o 2.",
            source: "backend"
          };
        }
      }

      const previousState = user.estado;
      user.estado = classifyLead(user);
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "importacion",
        event_type: "lead_classified",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          previous_state: previousState,
          selected_option: cleanMessage,
          detalle_importacion: user.detalle_importacion
        }
      });

      if (user.estado === "lead_calificado") {
        return {
          reply: getImportLeadCalificadoReply(user),
          source: "backend"
        };
      }

      if (user.estado === "lead_tibio") {
        return {
          reply: getImportLeadTibioReply(user),
          source: "backend"
        };
      }

      return {
        reply: getImportLeadCuriosoReply(user),
        source: "backend"
      };
    }

    // =========================
    // LEADS - IMPORTACIÓN
    // =========================

    if (user.estado === "lead_curioso" && user.interes_principal === "importacion") {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "importacion",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "importacion_asesor_confirmar_numero";
        saveUser(phone, user);

        return {
          reply: getImportAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportMeetingReply(),
          source: "backend"
        };
      }

      return {
        reply: getImportLeadCuriosoReply(user),
        source: "backend"
      };
    }

    if (user.estado === "lead_tibio" && user.interes_principal === "importacion") {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "importacion",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "importacion_asesor_confirmar_numero";
        saveUser(phone, user);

        return {
          reply: getImportAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportMeetingReply(),
          source: "backend"
        };
      }

      return {
        reply: getImportLeadTibioReply(user),
        source: "backend"
      };
    }

    if (
      user.estado === "lead_calificado" &&
      user.interes_principal === "importacion"
    ) {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "importacion",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "importacion_asesor_confirmar_numero";
        saveUser(phone, user);

        return {
          reply: getImportAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "importacion",
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
          reply: getImportMeetingReply(),
          source: "backend"
        };
      }

      return {
        reply: getImportLeadCalificadoReply(user),
        source: "backend"
      };
    }

    return null;
  } catch (error) {
    console.error("Error en handleImportacionFlow:", error);

    logErrorEvent({
      phone,
      module: "importacion",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: message || cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "importacion"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = {
  handleImportacionFlow
};