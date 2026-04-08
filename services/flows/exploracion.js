const {
  logLeadEvent,
  logCustomerQuery,
  logErrorEvent
} = require("../logger");

function handleExploracionFlow({
  user,
  phone,
  cleanMessage,
  message,
  saveUser,
  getAtencionClienteConfirmacion
}) {
  try {
    // =========================
    // ATENCIÓN AL CLIENTE / EXPLORACIÓN
    // =========================
    // Este módulo solo recibe la consulta,
    // la registra y confirma recepción.
    // No clasifica leads ni aplica scoring comercial.
    // =========================

    if (user.estado === "atencion_cliente_p1") {
      const rawMessage = String(message || "").trim();

      if (!rawMessage || cleanMessage === "8") {
        return {
          reply: "Perfecto. Déjanos tu consulta y en breve nos comunicaremos contigo.",
          source: "backend"
        };
      }

      // Registro principal de la consulta recibida
      logCustomerQuery({
        phone,
        module: "atencion_cliente",
        estado: user.estado,
        interes_principal: user.interes_principal,
        query: rawMessage,
        detail: {
          source: "backend"
        }
      });

      // Registro resumido en leads.jsonl para trazabilidad general
      logLeadEvent({
        phone,
        module: "atencion_cliente",
        event_type: "customer_query",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          query: rawMessage
        }
      });

      user.estado = "finalizado";
      saveUser(phone, user);

      return {
        reply: getAtencionClienteConfirmacion(),
        source: "backend"
      };
    }

    return null;
  } catch (error) {
    console.error("Error en handleExploracionFlow:", error);

    logErrorEvent({
      phone,
      module: "atencion_cliente",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: message || cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "exploracion"
      }
    });

    return {
      reply: "Hubo un problema al registrar tu consulta. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = {
  handleExploracionFlow
};