const {
  getDigitalMejorarTiendaPaso4,
  getDigitalIAPaso3,
  getDigitalMarketingPaso4,
  getDigitalCrearTiendaPreguntaTipoNegocio,
  getDigitalCrearTiendaPreguntaIntegracion,
  getDigitalCrearTiendaRespuestaProductosFisicos,
  getDigitalCrearTiendaRespuestaServicios,
  getDigitalCrearTiendaRespuestaPagos,
  getDigitalCrearTiendaRespuestaEnvios
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

// ─── Helpers de nombre de plataforma ─────────────────────────────────────────

function getPlatformName(plataformaKey) {
  const map = {
    shopify: "Shopify",
    wordpress: "WordPress / WooCommerce",
    prestashop: "PrestaShop"
  };
  return map[plataformaKey] || "la plataforma seleccionada";
}

// ─── CTA y lead ──────────────────────────────────────────────────────────────

function getDigitalLeadOfferOptions() {
  return `─────────────────────────
Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:

1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

function getDigitalProfileContext(user) {
  if (!user) return `Perfecto. Ya tengo una idea inicial de tu caso digital.`;

  if (user.subopcion === "crear_tienda") {
    return `Perfecto. Veo que tu interés está en crear o estructurar tu canal digital.`;
  }

  if (user.subopcion === "mejorar_tienda") {
    return `Perfecto. Veo que ya tienes una base digital y necesitas optimizar resultados.`;
  }

  if (user.subopcion === "ia_automatizacion") {
    return `Perfecto. Veo que buscas automatización o IA aplicada a negocio.`;
  }

  if (user.subopcion === "marketing_ventas") {
    return `Perfecto. Veo que tu foco está en ventas, leads o crecimiento digital.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu caso digital.`;
}

function getDigitalLeadReply(user) {
  return `${getDigitalProfileContext(user)}

${getDigitalLeadOfferOptions()}`;
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
  return `Perfecto. Hemos tomado tu solicitud.

Te contactaremos en breve para revisar tu caso.`;
}

function getDigitalMeetingReply(link) {
  return `Perfecto. Aquí puedes agendar tu reunión:

${link}`;
}

function closeDigitalLead({ user, phone, saveUser, classifyLead }) {
  user.estado = "digital_lead_calificado";
  saveUser(phone, user);

  return {
    reply: getDigitalLeadReply(user),
    source: "backend"
  };
}

// ─── Cierre con respuesta final personalizada (Rama 6-1) ─────────────────────

function closeDigitalLeadWithReply({ user, phone, saveUser, reply }) {
  user.estado = "digital_lead_calificado";
  saveUser(phone, user);

  return {
    reply,
    source: "backend"
  };
}

// ─── Flujo principal ──────────────────────────────────────────────────────────

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

    // ===============================
    // LEAD / CTA
    // ===============================
    if (user.estado === "digital_lead_calificado") {
      if (cleanMessage === "1") {
        user.estado = "digital_asesor_confirmar_numero";
        saveUser(phone, user);
        return { reply: getDigitalAdvisorConfirmationReply(phone), source: "backend" };
      }

      if (cleanMessage === "2") {
        user.estado = "finalizado";
        saveUser(phone, user);
        return { reply: getDigitalMeetingReply(CALENDLY_LINK), source: "backend" };
      }

      return { reply: getDigitalLeadReply(user), source: "backend" };
    }

    // ===============================
    // ASESOR: confirmar número
    // ===============================
    if (user.estado === "digital_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "digital_asesor_horario";
        saveUser(phone, user);
        return { reply: getDigitalAdvisorAskScheduleReply(), source: "backend" };
      }

      if (cleanMessage === "2") {
        user.estado = "digital_asesor_otro_numero";
        saveUser(phone, user);
        return { reply: getDigitalAdvisorAskNewPhoneReply(), source: "backend" };
      }

      return { reply: getDigitalAdvisorConfirmationReply(phone), source: "backend" };
    }

    // ===============================
    // ASESOR: otro número
    // ===============================
    if (user.estado === "digital_asesor_otro_numero") {
      if (isLikelyPhoneNumber(cleanMessage)) {
        user.callback_phone = cleanMessage;
        user.estado = "digital_asesor_horario";
        saveUser(phone, user);
        return { reply: getDigitalAdvisorAskScheduleReply(), source: "backend" };
      }

      return { reply: getDigitalAdvisorAskNewPhoneReply(), source: "backend" };
    }

    // ===============================
    // ASESOR: horario
    // ===============================
    if (user.estado === "digital_asesor_horario") {
      if (!["1", "2"].includes(cleanMessage)) {
        return { reply: getDigitalAdvisorAskScheduleReply(), source: "backend" };
      }

      user.callback_schedule = cleanMessage === "1" ? "09:00-12:00" : "14:00-18:00";
      user.estado = "finalizado";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "digital",
        event_type: "advisor_requested",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          callback_phone: user.callback_phone,
          callback_schedule: user.callback_schedule
        }
      });

      return { reply: getDigitalAdvisorFinalReply(user), source: "backend" };
    }

    // ===============================
    // PASO 1 — Menú digital
    // ===============================
    if (user.estado === "digital_p1") {
      const map = {
        "1": { estado: "digital_crear_p2", sub: "crear_tienda",      reply: getDigitalCrearTiendaPaso2 },
        "2": { estado: "digital_mejorar_p2", sub: "mejorar_tienda",  reply: getDigitalMejorarTiendaPaso2 },
        "3": { estado: "digital_ia_p2", sub: "ia_automatizacion",    reply: getDigitalIAPaso2 },
        "4": { estado: "digital_marketing_p2", sub: "marketing_ventas", reply: getDigitalMarketingPaso2 }
      };

      if (map[cleanMessage]) {
        user.estado = map[cleanMessage].estado;
        user.subopcion = map[cleanMessage].sub;
        saveUser(phone, user);
        return { reply: map[cleanMessage].reply(), source: "backend" };
      }
    }

    // ================================================================
    // 6-1 CREAR TIENDA
    // ================================================================

    // p2: usuario elige plataforma (1=Shopify, 2=WordPress, 3=PrestaShop)
    if (user.estado === "digital_crear_p2") {
      const plataformaMap = {
        "1": "shopify",
        "2": "wordpress",
        "3": "prestashop"
      };

      if (!plataformaMap[cleanMessage]) {
        return { reply: "Responde 1, 2 o 3 para continuar.", source: "backend" };
      }

      user.crear_plataforma = plataformaMap[cleanMessage];
      user.estado = "digital_crear_p3";
      saveUser(phone, user);
      return { reply: getDigitalCrearTiendaPaso3(), source: "backend" };
    }

    // p3: usuario elige tipo de desarrollo
    // 1 = tienda completa    → pregunta tipo de negocio
    // 2 = ya avanzado        → pregunta tipo de negocio
    // 3 = recomendación      → pregunta integración (pagos / envíos)
    if (user.estado === "digital_crear_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return { reply: "Responde 1, 2 o 3 para continuar.", source: "backend" };
      }

      user.crear_tipo = cleanMessage;
      saveUser(phone, user);

      if (cleanMessage === "1" || cleanMessage === "2") {
        // Ruta 6-1-1 y 6-1-2-1 → preguntar tipo de negocio
        user.estado = "digital_crear_p4_negocio";
        saveUser(phone, user);
        return { reply: getDigitalCrearTiendaPreguntaTipoNegocio(), source: "backend" };
      }

      if (cleanMessage === "3") {
        // Ruta 6-1-2-2 → preguntar integración
        user.estado = "digital_crear_p4_integracion";
        saveUser(phone, user);
        return { reply: getDigitalCrearTiendaPreguntaIntegracion(), source: "backend" };
      }
    }

    // p4 rama negocio: 1=productos físicos, 2=servicios
    if (user.estado === "digital_crear_p4_negocio") {
      if (!["1", "2"].includes(cleanMessage)) {
        return { reply: "Responde 1 o 2 para continuar.", source: "backend" };
      }

      const plat = getPlatformName(user.crear_plataforma);

      const reply = cleanMessage === "1"
        ? getDigitalCrearTiendaRespuestaProductosFisicos(plat)
        : getDigitalCrearTiendaRespuestaServicios(plat);

      return closeDigitalLeadWithReply({ user, phone, saveUser, reply });
    }

    // p4 rama integración: 1=pagos, 2=envíos
    if (user.estado === "digital_crear_p4_integracion") {
      if (!["1", "2"].includes(cleanMessage)) {
        return { reply: "Responde 1 o 2 para continuar.", source: "backend" };
      }

      const plat = getPlatformName(user.crear_plataforma);

      const reply = cleanMessage === "1"
        ? getDigitalCrearTiendaRespuestaPagos(plat)
        : getDigitalCrearTiendaRespuestaEnvios(plat);

      return closeDigitalLeadWithReply({ user, phone, saveUser, reply });
    }

    // Alias de compatibilidad: si por alguna razón llega al estado viejo digital_crear_p4
    if (user.estado === "digital_crear_p4") {
      if (!["1", "2"].includes(cleanMessage)) {
        return { reply: "Responde 1 o 2.", source: "backend" };
      }
      return closeDigitalLead({ user, phone, saveUser, classifyLead });
    }

    // ===============================
    // 6-2 MEJORAR TIENDA
    // ===============================
    if (user.estado === "digital_mejorar_p2") {
      user.estado = "digital_mejorar_p3";
      saveUser(phone, user);
      return { reply: getDigitalMejorarTiendaPaso3(), source: "backend" };
    }

    if (user.estado === "digital_mejorar_p3") {
      user.estado = "digital_mejorar_p4";
      saveUser(phone, user);
      return { reply: getDigitalMejorarTiendaPaso4(), source: "backend" };
    }

    if (user.estado === "digital_mejorar_p4") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return { reply: "Responde 1, 2 o 3.", source: "backend" };
      }
      return closeDigitalLead({ user, phone, saveUser, classifyLead });
    }

    // ===============================
    // 6-3 IA HÍBRIDO
    // ===============================
    if (user.estado === "digital_ia_p2") {
      user.estado = "digital_ia_p3";
      saveUser(phone, user);
      return { reply: getDigitalIAPaso3(), source: "backend" };
    }

    if (user.estado === "digital_ia_p3") {
      user.estado = "digital_ia_hibrido";
      saveUser(phone, user);

      return {
        reply: "Cuéntame qué necesitas automatizar o mejorar con IA en tu negocio.",
        source: "backend"
      };
    }

    if (user.estado === "digital_ia_hibrido") {
      return closeDigitalLead({ user, phone, saveUser, classifyLead });
    }

    // ===============================
    // 6-4 MARKETING
    // ===============================
    if (user.estado === "digital_marketing_p2") {
      user.estado = "digital_marketing_p3";
      saveUser(phone, user);
      return { reply: getDigitalMarketingPaso3(), source: "backend" };
    }

    if (user.estado === "digital_marketing_p3") {
      user.estado = "digital_marketing_p4";
      saveUser(phone, user);
      return { reply: getDigitalMarketingPaso4(), source: "backend" };
    }

    if (user.estado === "digital_marketing_p4") {
      if (!["1", "2"].includes(cleanMessage)) {
        return { reply: "Responde 1 o 2.", source: "backend" };
      }
      return closeDigitalLead({ user, phone, saveUser, classifyLead });
    }

    return null;

  } catch (error) {
    logErrorEvent({
      phone,
      module: "digital",
      error_message: error.message
    });

    return {
      reply: "Hubo un error. Intenta nuevamente.",
      source: "backend"
    };
  }
}

module.exports = { handleDigitalFlow };
