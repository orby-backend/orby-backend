const {
  getDigitalMejorarTiendaPaso4,
  getDigitalIAPaso3,
  getDigitalMarketingPaso4
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
    // PASO 1
    // ===============================
    if (user.estado === "digital_p1") {
      const map = {
        "1": { estado: "digital_crear_p2", sub: "crear_tienda", reply: getDigitalCrearTiendaPaso2 },
        "2": { estado: "digital_mejorar_p2", sub: "mejorar_tienda", reply: getDigitalMejorarTiendaPaso2 },
        "3": { estado: "digital_ia_p2", sub: "ia_automatizacion", reply: getDigitalIAPaso2 },
        "4": { estado: "digital_marketing_p2", sub: "marketing_ventas", reply: getDigitalMarketingPaso2 }
      };

      if (map[cleanMessage]) {
        user.estado = map[cleanMessage].estado;
        user.subopcion = map[cleanMessage].sub;
        saveUser(phone, user);

        return { reply: map[cleanMessage].reply(), source: "backend" };
      }
    }

    // ===============================
    // 6-1 CREAR TIENDA
    // ===============================
    if (user.estado === "digital_crear_p2") {
      user.estado = "digital_crear_p3";
      saveUser(phone, user);
      return { reply: getDigitalCrearTiendaPaso3(), source: "backend" };
    }

    if (user.estado === "digital_crear_p3") {
      user.estado = "digital_crear_p4";
      saveUser(phone, user);
      return { reply: getDigitalPreguntaIntencion(), source: "backend" };
    }

    if (user.estado === "digital_crear_p4") {
      if (!["1", "2"].includes(cleanMessage)) {
        return { reply: "Responde 1 o 2.", source: "backend" };
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