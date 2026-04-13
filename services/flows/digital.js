const {
  getDigitalCrearTiendaPaso2,
  getDigitalCrearTiendaPaso3,
  getDigitalCrearTiendaPaso4FisicosServicios,
  getDigitalCrearTiendaPaso4ServiciosOnline,
  getDigitalCrearTiendaPaso4PagosEnvios,
  getDigitalMejorarTiendaPaso2,
  getDigitalMejorarTiendaPaso3,
  getDigitalMejorarTiendaPaso4,
  getDigitalIAPaso2,
  getDigitalIAPaso3,
  getDigitalIAChatbotProblemaPrompt,
  getDigitalIAAutomatizacionPrompt,
  getDigitalIAAgentePaso3,
  getDigitalIAAgenteConcretarVentasPrompt,
  getDigitalIAAgenteMulticanalPrompt,
  getDigitalIAProcesosPaso3,
  getDigitalIAProcesamientoDocumentosPrompt,
  getDigitalIATicketsPrompt,
  getDigitalMarketingPaso2,
  getDigitalMarketingCampanasPaso3,
  getDigitalMarketingCampanasPaso4,
  getDigitalMarketingSEOPaso3,
  getDigitalMarketingSEOPaso4,
  getDigitalMarketingSEOSEMPaso4,
  getDigitalMarketingLeadsPaso3,
  getDigitalMarketingLeadsPaso4
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

En breve estaremos contigo para revisar tu caso digital.`;
}

function getDigitalMeetingReply(calendlyLink) {
  const link = calendlyLink || "https://calendly.com/oneorbix/asesoria";

  return `Perfecto. Aquí tienes el enlace para agendar tu reunión sobre ecommerce, automatización o crecimiento digital:

${link}

Así podemos revisar tu caso con más calma y orientarte según la etapa exacta en la que estás.`;
}

function getDigitalProfileContext(user) {
  const context = String(user?.digital_context_detail || "");

  switch (context) {
    case "crear_tienda_productos_fisicos":
      return `Perfecto. Veo que tu interés está en crear una tienda para vender productos físicos.

En este caso conviene estructurar bien catálogo, pagos, logística y la base comercial para que tu tienda salga bien planteada desde el inicio.`;

    case "crear_tienda_servicios":
      return `Perfecto. Veo que tu interés está en crear una tienda o canal digital para vender servicios.

Aquí lo importante es definir bien la propuesta, la forma de captación y una estructura clara para que el canal comercial realmente ayude a convertir.`;

    case "crear_tienda_servicios_online":
      return `Perfecto. Veo que tu caso está más orientado a vender servicios online.

Eso requiere una estructura distinta a una tienda tradicional, porque aquí pesa mucho cómo presentas la oferta, el proceso de contacto y la conversión.`;

    case "crear_tienda_pagos":
      return `Perfecto. Veo que lo que necesitas resolver está más orientado a integraciones de pago para tu tienda.

Aquí conviene ordenar bien los métodos de pago y su implementación para evitar fricciones y facilitar la conversión.`;

    case "crear_tienda_envios_facturas":
      return `Perfecto. Veo que tu caso está más enfocado en módulo de envíos, etiquetas o facturación.

Eso suele ser clave para que la operación funcione con orden y no se convierta en un problema apenas empiecen a entrar pedidos.`;

    case "mejorar_tienda_ventas":
      return `Perfecto. Veo que tu prioridad es corregir una tienda que no está generando ventas.

Aquí lo importante no es mover piezas a ciegas, sino detectar con criterio qué está frenando resultados y cómo corregirlo.`;

    case "mejorar_tienda_diseno":
      return `Perfecto. Veo que tu prioridad está en mejorar diseño, velocidad o estructura de la tienda.

Eso puede marcar una diferencia importante en la experiencia del usuario y en la conversión.`;

    case "mejorar_tienda_soporte":
      return `Perfecto. Veo que tu caso está más enfocado en errores técnicos o soporte.

Conviene revisar bien el origen del problema para corregirlo sin seguir acumulando fallas.`;

    case "ia_chatbot_atencion_ventas":
      return `Perfecto. Veo que tu interés está en mejorar atención, ventas o seguimiento con ayuda de IA.

Aquí una solución bien planteada puede ayudarte a responder mejor, filtrar oportunidades y convertir con más orden.`;

    case "ia_chatbot_automatizacion":
      return `Perfecto. Veo que buscas automatizar tareas comerciales u operativas con apoyo de IA.

Eso tiene mucho sentido cuando quieres ahorrar tiempo y evitar procesos manuales repetitivos.`;

    case "ia_agente_concretar_ventas":
      return `Perfecto. Veo que tu enfoque está en concretar ventas con un Agente AI.

Eso suele ser potente cuando quieres responder más rápido, acompañar mejor al prospecto y cerrar oportunidades con más consistencia.`;

    case "ia_agente_multicanal":
      return `Perfecto. Veo que tu interés está en vender con un Agente AI en varios canales como WhatsApp, Facebook, Instagram y Web.

Ahí lo clave es tener una lógica comercial unificada para no atender bien en un canal y mal en los otros.`;

    case "ia_documentos":
      return `Perfecto. Veo que tu caso está más orientado al procesamiento de documentos.

Bien implementado, eso puede ayudarte a ahorrar tiempo, reducir errores y ordenar mejor el flujo operativo.`;

    case "ia_tickets":
      return `Perfecto. Veo que tu prioridad está en gestión de tickets, triaje o clasificación inteligente.

Eso puede mejorar bastante el orden de atención y la velocidad de respuesta.`;

    case "marketing_campanas_auditoria":
      return `Perfecto. Veo que tu prioridad está en una auditoría de campañas.

Eso es lo correcto cuando quieres entender con claridad qué está fallando antes de seguir invirtiendo.`;

    case "marketing_campanas_rendimiento":
      return `Perfecto. Veo que tu interés está en diseñar campañas de alto rendimiento.

Eso tiene sentido cuando quieres dejar de improvisar y estructurar una estrategia con más criterio comercial.`;

    case "marketing_seo":
      return `Perfecto. Veo que tu caso está enfocado en SEO.

Aquí conviene revisar el estado actual del sitio y detectar qué oportunidades reales hay para mejorar posicionamiento y captar tráfico útil.`;

    case "marketing_seo_sem":
      return `Perfecto. Veo que tu caso requiere una revisión combinada de SEO y SEM.

Eso permite trabajar mejor tanto la captación orgánica como la de pago, sin dejar huecos entre una y otra.`;

    case "marketing_clientes_nuevos":
      return `Perfecto. Veo que tu prioridad es conseguir clientes nuevos.

Aquí conviene trabajar una estrategia clara de adquisición para no depender del azar ni de campañas mal enfocadas.`;

    case "marketing_retargeting":
      return `Perfecto. Veo que tu prioridad está en una campaña de retargeting o remarketing.

Eso suele ser muy útil cuando ya hay tráfico o interés, pero falta empujar mejor la conversión.`;

    default:
      return `Perfecto. Ya tengo una idea inicial de tu caso digital.`;
  }
}

function getDigitalLeadCuriosoReply(user) {
  return `${getDigitalProfileContext(user)}

Veo que por ahora estás explorando posibilidades. En esta etapa, lo más útil suele ser aclarar bien qué necesitas y cuál sería el camino más conveniente antes de avanzar.

${getDigitalLeadOfferOptions()}`;
}

function getDigitalLeadTibioReply(user) {
  return `${getDigitalProfileContext(user)}

Ya hay señales claras de interés, así que sí vale la pena revisar tu caso con más enfoque para ayudarte a tomar mejores decisiones.

${getDigitalLeadOfferOptions()}`;
}

function getDigitalLeadCalificadoReply(user) {
  return `${getDigitalProfileContext(user)}

Tu caso ya está en un punto donde tiene bastante sentido avanzar con guía más directa para ayudarte a estructurar mejor tu ecommerce, automatización o estrategia digital.

${getDigitalLeadOfferOptions()}`;
}

function buildDigitalLeadReply(user) {
  if (user.estado === "digital_lead_calificado") {
    return getDigitalLeadCalificadoReply(user);
  }

  if (user.estado === "digital_lead_tibio") {
    return getDigitalLeadTibioReply(user);
  }

  return getDigitalLeadCuriosoReply(user);
}

function closeDigitalLead({ user, phone, saveUser, classifyLead }) {
  const resultTag = classifyLead(user);
  const previousState = user.estado;

  user.estado_anterior_digital = previousState;

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
      result_tag: resultTag,
      digital_context_detail: user.digital_context_detail || null
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
  message,
  saveUser,
  classifyLead,
  CALENDLY_LINK
}) {
  try {
    // ========================================================
    // 1. CAPA DE CONTACTO DIGITAL
    // ========================================================
    if (
      ["digital_lead_curioso", "digital_lead_tibio", "digital_lead_calificado"].includes(user.estado)
    ) {
      if (cleanMessage === "1") {
        user.estado = "digital_asesor_confirmar_numero";
        saveUser(phone, user);

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

        return {
          reply: getDigitalAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "finalizado";
        saveUser(phone, user);

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

        return {
          reply: getDigitalAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "digital_asesor_otro_numero";
        saveUser(phone, user);

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
      if (!isLikelyPhoneNumber(message || cleanMessage)) {
        return {
          reply: "Envíame un número válido para contacto y seguimos con el horario.",
          source: "backend"
        };
      }

      user.callback_phone = String(message || cleanMessage).trim();
      user.estado = "digital_asesor_horario";
      saveUser(phone, user);

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

        return {
          reply: getDigitalAdvisorFinalReply(user),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.callback_schedule = "2_6";
        user.estado = "finalizado";
        saveUser(phone, user);

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
        },
        "5": {
          estado: "digital_asesor_confirmar_numero",
          subopcion: "asesor_directo",
          reply: null
        }
      };

      if (!p1Options[cleanMessage]) {
        return {
          reply: "Por favor responde con un número del 1 al 5.",
          source: "backend"
        };
      }

      user.estado = p1Options[cleanMessage].estado;
      user.subopcion = p1Options[cleanMessage].subopcion;
      saveUser(phone, user);

      if (cleanMessage === "5") {
        return {
          reply: getDigitalAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      return {
        reply: p1Options[cleanMessage].reply(),
        source: "backend"
      };
    }

    // ========================================================
    // 3. RAMA 6-1 CREAR TIENDA
    // ========================================================
    if (user.estado === "digital_crear_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      user.digital_create_platform = cleanMessage;
      user.score += 3;
      user.estado = "digital_crear_p3";
      saveUser(phone, user);

      return {
        reply: getDigitalCrearTiendaPaso3(),
        source: "backend"
      };
    }

    if (user.estado === "digital_crear_p3") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1 o 2.",
          source: "backend"
        };
      }

      user.digital_create_need = cleanMessage;

      if (cleanMessage === "1") {
        if (["1", "3"].includes(String(user.digital_create_platform || ""))) {
          user.estado = "digital_crear_p4_fisicos_servicios";
          user.score += 3;
          saveUser(phone, user);

          return {
            reply: getDigitalCrearTiendaPaso4FisicosServicios(),
            source: "backend"
          };
        }

        if (String(user.digital_create_platform || "") === "2") {
          user.estado = "digital_crear_p4_servicios_online";
          user.score += 2;
          saveUser(phone, user);

          return {
            reply: getDigitalCrearTiendaPaso4ServiciosOnline(),
            source: "backend"
          };
        }
      }

      if (cleanMessage === "2") {
        user.estado = "digital_crear_p4_pagos_envios";
        user.score += 2;
        saveUser(phone, user);

        return {
          reply: getDigitalCrearTiendaPaso4PagosEnvios(),
          source: "backend"
        };
      }

      return {
        reply: "No pude identificar esa opción. Escribe MENU y volvemos a empezar.",
        source: "backend"
      };
    }

    if (user.estado === "digital_crear_p4_fisicos_servicios") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.digital_context_detail = "crear_tienda_productos_fisicos";
        user.score += 3;
      } else {
        user.digital_context_detail = "crear_tienda_servicios";
        user.score += 2;
      }

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    if (user.estado === "digital_crear_p4_servicios_online") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.digital_context_detail = "crear_tienda_productos_fisicos";
        user.score += 3;
      } else {
        user.digital_context_detail = "crear_tienda_servicios_online";
        user.score += 2;
      }

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    if (user.estado === "digital_crear_p4_pagos_envios") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.digital_context_detail = "crear_tienda_pagos";
        user.score += 2;
      } else {
        user.digital_context_detail = "crear_tienda_envios_facturas";
        user.score += 2;
      }

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // ========================================================
    // 4. RAMA 6-2 MEJORAR TIENDA
    // ========================================================
    if (user.estado === "digital_mejorar_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      user.digital_improve_platform = cleanMessage;
      user.score += 2;
      user.estado = "digital_mejorar_p3";
      saveUser(phone, user);

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

      if (cleanMessage === "1") {
        user.score += 3;
        user.digital_context_detail = "mejorar_tienda_ventas";
      }
      if (cleanMessage === "2") {
        user.score += 2;
        user.digital_context_detail = "mejorar_tienda_diseno";
      }
      if (cleanMessage === "3") {
        user.score += 3;
        user.digital_context_detail = "mejorar_tienda_soporte";
      }

      user.estado = "digital_mejorar_p4";
      saveUser(phone, user);

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

      if (cleanMessage === "1") {
        user.score += 3;
      }
      if (cleanMessage === "2") {
        user.score += 2;
      }
      if (cleanMessage === "3") {
        user.score += 3;
      }

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // ========================================================
    // 5. RAMA 6-3 IA / AUTOMATIZACIÓN
    // ========================================================

    if (user.estado === "digital_ia_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      user.digital_ia_branch = cleanMessage;
      user.score += cleanMessage === "3" ? 2 : 3;

      if (cleanMessage === "1") {
        user.estado = "digital_ia_chatbot_p3";
        saveUser(phone, user);

        return {
          reply: getDigitalIAPaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "digital_ia_agente_p3";
        saveUser(phone, user);

        return {
          reply: getDigitalIAAgentePaso3(),
          source: "backend"
        };
      }

      user.estado = "digital_ia_procesos_p3";
      saveUser(phone, user);

      return {
        reply: getDigitalIAProcesosPaso3(),
        source: "backend"
      };
    }

    // 6-3-1 Chatbot
    if (user.estado === "digital_ia_chatbot_p3") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.score += 3;
        user.digital_context_detail = "ia_chatbot_atencion_ventas";
        user.estado = "digital_ia_chatbot_hibrido";
        saveUser(phone, user);

        return {
          reply: getDigitalIAChatbotProblemaPrompt(),
          source: "backend"
        };
      }

      user.score += 2;
      user.digital_context_detail = "ia_chatbot_automatizacion";
      user.estado = "digital_ia_chatbot_hibrido";
      saveUser(phone, user);

      return {
        reply: getDigitalIAAutomatizacionPrompt(),
        source: "backend"
      };
    }

    // 6-3-2 Agente AI
    if (user.estado === "digital_ia_agente_p3") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.score += 3;
        user.digital_context_detail = "ia_agente_concretar_ventas";
        user.estado = "digital_ia_agente_hibrido";
        saveUser(phone, user);

        return {
          reply: getDigitalIAAgenteConcretarVentasPrompt(),
          source: "backend"
        };
      }

      user.score += 3;
      user.digital_context_detail = "ia_agente_multicanal";
      user.estado = "digital_ia_agente_hibrido";
      saveUser(phone, user);

      return {
        reply: getDigitalIAAgenteMulticanalPrompt(),
        source: "backend"
      };
    }

    // 6-3-3 Procesos internos
    if (user.estado === "digital_ia_procesos_p3") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.score += 2;
        user.digital_context_detail = "ia_documentos";
        user.estado = "digital_ia_procesos_hibrido";
        saveUser(phone, user);

        return {
          reply: getDigitalIAProcesamientoDocumentosPrompt(),
          source: "backend"
        };
      }

      user.score += 2;
      user.digital_context_detail = "ia_tickets";
      user.estado = "digital_ia_procesos_hibrido";
      saveUser(phone, user);

      return {
        reply: getDigitalIATicketsPrompt(),
        source: "backend"
      };
    }

    // Estados híbridos:
    // Aquí Gemini responde desde app.js y backend retoma control después.
    if (
      [
        "digital_ia_chatbot_hibrido",
        "digital_ia_agente_hibrido",
        "digital_ia_procesos_hibrido"
      ].includes(user.estado)
    ) {
      if (!cleanMessage) {
        return {
          reply: "Cuéntame con más detalle qué necesitas y te ayudo a orientarte mejor.",
          source: "backend"
        };
      }

      if (["1", "2", "3", "4", "5"].includes(cleanMessage)) {
        return {
          reply: "Cuéntame un poco más de tu caso para poder orientarte mejor.",
          source: "backend"
        };
      }

      user.estado_anterior_digital = user.estado;
      user.estado = "digital_lead_calificado";
      saveUser(phone, user);

      return null;
    }

    // ========================================================
    // 6. RAMA 6-4 MARKETING / SEO / VENTAS
    // ========================================================
    if (user.estado === "digital_marketing_p2") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      user.digital_marketing_branch = cleanMessage;
      user.score += cleanMessage === "2" ? 2 : 3;

      if (cleanMessage === "1") {
        user.estado = "digital_marketing_campanas_p3";
        saveUser(phone, user);

        return {
          reply: getDigitalMarketingCampanasPaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "digital_marketing_seo_p3";
        saveUser(phone, user);

        return {
          reply: getDigitalMarketingSEOPaso3(),
          source: "backend"
        };
      }

      user.estado = "digital_marketing_leads_p3";
      saveUser(phone, user);

      return {
        reply: getDigitalMarketingLeadsPaso3(),
        source: "backend"
      };
    }

    // Campañas
    if (user.estado === "digital_marketing_campanas_p3") {
      if (!["1", "2", "3"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1, 2 o 3.",
          source: "backend"
        };
      }

      user.score += cleanMessage === "1" ? 3 : cleanMessage === "2" ? 2 : 1;
      user.estado = "digital_marketing_campanas_p4";
      saveUser(phone, user);

      return {
        reply: getDigitalMarketingCampanasPaso4(),
        source: "backend"
      };
    }

    if (user.estado === "digital_marketing_campanas_p4") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.digital_context_detail = "marketing_campanas_auditoria";
        user.score += 2;
      } else {
        user.digital_context_detail = "marketing_campanas_rendimiento";
        user.score += 3;
      }

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // SEO
    if (user.estado === "digital_marketing_seo_p3") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.digital_context_detail = "marketing_seo";
        user.score += 2;
        user.estado = "digital_marketing_seo_p4";
        saveUser(phone, user);

        return {
          reply: getDigitalMarketingSEOPaso4(),
          source: "backend"
        };
      }

      user.digital_context_detail = "marketing_seo_sem";
      user.score += 3;
      user.estado = "digital_marketing_seosem_p4";
      saveUser(phone, user);

      return {
        reply: getDigitalMarketingSEOSEMPaso4(),
        source: "backend"
      };
    }

    if (user.estado === "digital_marketing_seo_p4") {
      if (cleanMessage !== "1") {
        return {
          reply: "Por favor responde con 1.",
          source: "backend"
        };
      }

      user.score += 3;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    if (user.estado === "digital_marketing_seosem_p4") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      user.score += cleanMessage === "1" ? 3 : 1;

      return closeDigitalLead({
        user,
        phone,
        saveUser,
        classifyLead
      });
    }

    // Leads / ventas
    if (user.estado === "digital_marketing_leads_p3") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      user.estado = "digital_marketing_leads_p4";
      user.score += 3;
      saveUser(phone, user);

      return {
        reply: getDigitalMarketingLeadsPaso4(),
        source: "backend"
      };
    }

    if (user.estado === "digital_marketing_leads_p4") {
      if (!["1", "2"].includes(cleanMessage)) {
        return {
          reply: "Por favor responde con 1 o 2.",
          source: "backend"
        };
      }

      if (cleanMessage === "1") {
        user.digital_context_detail = "marketing_clientes_nuevos";
        user.score += 3;
      } else {
        user.digital_context_detail = "marketing_retargeting";
        user.score += 3;
      }

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
      incoming_message: message || cleanMessage || null,
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