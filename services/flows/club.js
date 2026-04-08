const {
  logLeadEvent,
  logErrorEvent
} = require("../logger");

function handleClubFlow({
  user,
  phone,
  cleanMessage,
  saveUser,
  classifyLead,
  getClubCaso1,
  getClubCaso2,
  getClubCaso3,
  getClubInfoGeneralReply,
  getClubPreguntaFinal,
  getLeadTibioReply,
  getLeadCuriosoReply,
  getClubLeadQualifiedReply,
  memberships
}) {
  try {
    // =========================
    // CLUB - PASO 1
    // =========================
    if (user.estado === "club_p1") {
      if (cleanMessage === "1") {
        user.estado = "club_p2";
        user.subopcion = "cero";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "club",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "1",
            step: "club_p1_to_p2"
          }
        });

        return {
          reply: getClubCaso1(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "club_p2";
        user.subopcion = "idea_producto";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "club",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "2",
            step: "club_p1_to_p2"
          }
        });

        return {
          reply: getClubCaso2(),
          source: "backend"
        };
      }

      if (cleanMessage === "3") {
        user.estado = "club_p2";
        user.subopcion = "ya_importo";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "club",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "3",
            step: "club_p1_to_p2"
          }
        });

        return {
          reply: getClubCaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "4") {
        user.estado = "lead_tibio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "club",
          event_type: "lead_classified",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "4",
            reason: "info_general",
            membership_interest: "info_general"
          }
        });

        return {
          reply: getClubInfoGeneralReply(memberships),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1, 2, 3 o 4.",
        source: "backend"
      };
    }

    // =========================
    // CLUB - PASO 2
    // =========================
    if (user.estado === "club_p2") {
      if (user.subopcion === "cero") {
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
      }

      if (user.subopcion === "idea_producto") {
        if (cleanMessage === "1") {
          user.score += 3;
        } else if (cleanMessage === "2") {
          user.score += 2;
        } else {
          return {
            reply: "Por favor responde con 1 o 2.",
            source: "backend"
          };
        }
      }

      if (user.subopcion === "ya_importo") {
        if (
          cleanMessage === "1" ||
          cleanMessage === "2" ||
          cleanMessage === "3"
        ) {
          user.score += 3;
        } else {
          return {
            reply: "Por favor responde con 1, 2 o 3.",
            source: "backend"
          };
        }
      }

      user.estado = "club_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "club",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "club_p2_to_p3"
        }
      });

      return {
        reply: getClubPreguntaFinal(),
        source: "backend"
      };
    }

    // =========================
    // CLUB - PASO 3
    // =========================
    if (user.estado === "club_p3") {
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
        module: "club",
        event_type: "lead_classified",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          previous_state: previousState,
          selected_option: cleanMessage,
          membership_interest:
            user.estado === "lead_calificado"
              ? "alto"
              : user.estado === "lead_tibio"
              ? "medio"
              : "bajo"
        }
      });

      if (user.estado === "lead_calificado") {
        return {
          reply: getClubLeadQualifiedReply(),
          source: "backend"
        };
      }

      if (user.estado === "lead_tibio") {
        return {
          reply: getLeadTibioReply(),
          source: "backend"
        };
      }

      return {
        reply: getLeadCuriosoReply("3"),
        source: "backend"
      };
    }

    return null;
  } catch (error) {
    console.error("Error en handleClubFlow:", error);

    logErrorEvent({
      phone,
      module: "club",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "club"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = {
  handleClubFlow
};