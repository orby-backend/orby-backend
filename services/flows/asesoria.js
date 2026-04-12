const {
  logLeadEvent,
  logCustomerQuery,
  logErrorEvent
} = require("../logger");

function isLikelyPhoneNumber(value = "") {
  const cleaned = String(value).replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function getAsesoriaLeadOfferOptions() {
  return `

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:

1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

function getAsesoriaProfileContext(user) {
  if (!user) {
    return `Perfecto. Ya tengo una idea inicial de tu caso de asesoría.`;
  }

  if (user.subopcion === "comercio") {
    return `Perfecto. Veo que tu caso está relacionado con **importación, exportación o estructura comercial**, así que lo más importante es ordenar bien el punto de partida antes de avanzar.`;
  }

  if (user.subopcion === "negocio") {
    return `Perfecto. Veo que tu interés está en **estructurar un negocio**, así que conviene aterrizar mejor modelo, oferta, canal y siguiente paso antes de ejecutar.`;
  }

  if (user.subopcion === "escalar") {
    return `Perfecto. Veo que ya tienes una base y lo importante ahora no es mover piezas al azar, sino detectar **qué está frenando resultados** y cómo escalar con más criterio.`;
  }

  if (user.subopcion === "consulta") {
    return `Perfecto. Veo que tienes una **consulta puntual**, así que lo más útil es revisar bien el contexto para darte una orientación clara y accionable.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu caso de asesoría.`;
}

function getAsesoriaLeadCuriosoReply(user) {
  return `${getAsesoriaProfileContext(user)}

En esta etapa, lo más útil suele ser **aclarar bien el panorama** para que no avances con dudas sueltas o decisiones poco claras.${getAsesoriaLeadOfferOptions()}`;
}

function getAsesoriaLeadTibioReply(user) {
  return `${getAsesoriaProfileContext(user)}

Ya hay señales claras de interés, así que sí vale la pena revisar tu caso con más enfoque para ayudarte a **decidir mejor el siguiente paso**.${getAsesoriaLeadOfferOptions()}`;
}

function getAsesoriaLeadCalificadoReply(user) {
  return `${getAsesoriaProfileContext(user)}

Tu caso ya está en un punto donde tiene bastante sentido avanzar con **orientación más directa** para ayudarte a resolverlo con más criterio.${getAsesoriaLeadOfferOptions()}`;
}

function getAsesoriaAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`;
}

function getAsesoriaAdvisorAskNewPhoneReply() {
  return `Perfecto. Envíame el número al que deseas que te contacten y seguimos.`;
}

function getAsesoriaAdvisorAskScheduleReply() {
  return `Perfecto. ¿En qué horario te conviene más que te contacten?

1️⃣ De 9 a 12 pm
2️⃣ De 2 a 6 pm`;
}

function getAsesoriaAdvisorFinalReply(user) {
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

En breve estaremos contigo para revisar tu caso y orientarte mejor según lo que necesitas.`;
}

function getAsesoriaMeetingReply(calendlyLink) {
  const link = calendlyLink || "https://calendly.com/oneorbix/30min";

  return `Perfecto. Aquí tienes el enlace para agendar tu reunión:

${link}

Así podemos revisar tu caso con más calma y orientarte según la etapa exacta en la que estás.`;
}

function getAsesoriaAskConsultationReply() {
  return `Perfecto. Por favor escribe tu consulta puntual y te orientaré con la mayor claridad posible.`;
}

function getAsesoriaConsultaClosure() {
  return `

Si deseas avanzar con uno de nuestros asesores, tienes estas opciones:

1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

function inferAsesoriaConsultTopic(message = "", detectedIntent = "") {
  const text = String(message || "").toLowerCase();
  const intent = String(detectedIntent || "").toLowerCase();

  if (intent.startsWith("amazon")) return "amazon";
  if (intent.startsWith("export")) return "exportacion";
  if (intent.startsWith("import")) return "importacion";
  if (intent.startsWith("club")) return "club";
  if (intent.startsWith("digital")) return "digital";

  const hasExportKeyword =
    /\bexportar\b|\bexportación\b|\bexportacion\b|\bmercado internacional\b|\bmercado exterior\b|\bcompradores\b|\bdistribuidores\b|\bexportable\b/.test(
      text
    );

  const hasImportKeyword =
    /\bimportar\b|\bimportación\b|\bimportacion\b|\bproveedor\b|\bfabricante\b|\balibaba\b|\baduana\b|\btraer productos\b|\btraer mercadería\b|\btraer mercaderia\b/.test(
      text
    );

  const hasAmazonKeyword =
    /\bamazon\b|\bfba\b|\basin\b|\bmarca propia\b|\bprivate label\b|\bseller\b|\bseller central\b/.test(
      text
    );

  const hasDigitalKeyword =
    /\becommerce\b|\be-commerce\b|\btienda online\b|\bshopify\b|\bwoocommerce\b|\bwordpress\b|\bprestashop\b|\bseo\b|\bmeta ads\b|\bgoogle ads\b|\bia\b|\binteligencia artificial\b|\bautomatización\b|\bautomatizacion\b|\bchatbot\b|\bleads\b/.test(
      text
    );

  const hasClubKeyword =
    /\bclub de importadores\b|\bmembresía\b|\bmembresia\b|\bplan básico\b|\bplan basico\b|\bplan profesional\b|\bplan premium\b/.test(
      text
    );

  if (hasAmazonKeyword) return "amazon";

  if (hasExportKeyword && !hasImportKeyword) return "exportacion";
  if (hasImportKeyword && !hasExportKeyword) return "importacion";

  if (hasExportKeyword && hasImportKeyword) {
    const exportScore =
      (/\bexportar\b|\bexportación\b|\bexportacion\b/.test(text) ? 3 : 0) +
      (/\bmercado internacional\b|\bmercado exterior\b/.test(text) ? 2 : 0) +
      (/\bcompradores\b|\bdistribuidores\b/.test(text) ? 1 : 0);

    const importScore =
      (/\bimportar\b|\bimportación\b|\bimportacion\b/.test(text) ? 3 : 0) +
      (/\bproveedor\b|\bfabricante\b|\balibaba\b/.test(text) ? 2 : 0) +
      (/\baduana\b|\btraer productos\b|\btraer mercadería\b|\btraer mercaderia\b/.test(text) ? 1 : 0);

    if (exportScore >= importScore) return "exportacion";
    return "importacion";
  }

  if (hasDigitalKeyword) return "digital";
  if (hasClubKeyword) return "club";

  return "general";
}

function buildAsesoriaConsultBackendReply(message = "", detectedIntent = "") {
  const text = String(message || "").toLowerCase();
  const topic = inferAsesoriaConsultTopic(message, detectedIntent);

  if (topic === "amazon") {
    return `Si tu consulta está relacionada con Amazon, lo más importante es **ordenar bien en qué etapa estás** antes de ejecutar.

Si ya tienes producto, conviene validar primero **viabilidad, competencia y encaje real** en Amazon. Si aún no lo tienes definido, la prioridad no es correr a abrir todo, sino elegir con más criterio qué tendría sentido vender.

Desde ahí ya puedes aterrizar mejor el siguiente paso con más claridad.`;
  }

  if (topic === "exportacion") {
    return `Si tu consulta va por exportación, lo más importante es **no asumir que el producto ya está listo para salir al exterior** solo por tenerlo definido.

Primero conviene validar **potencial exportable, mercado objetivo y nivel de preparación comercial**. Ahí se aclara si el siguiente paso es trabajar producto, mercado o estructura antes de intentar moverlo afuera.

Desde ahí puedes tomar decisiones con más criterio.`;
  }

  if (topic === "importacion") {
    return `Si tu consulta va por importación, lo más importante es **no saltar directo a comprar o pedir cotizaciones** sin ordenar antes el punto de partida.

Primero conviene definir si ya tienes producto claro, si necesitas validarlo mejor o si realmente estás en etapa de búsqueda de proveedor.

Desde ahí ya puedes aterrizar **costos, viabilidad y siguiente paso con más sentido**.`;
  }

  if (topic === "digital") {
    return `Si tu consulta está relacionada con ecommerce, automatización o crecimiento digital, lo más útil es **definir primero qué parte del negocio quieres mejorar** para no mover piezas sin dirección.

No es lo mismo crear una tienda desde cero, reparar una estructura que no convierte o implementar IA para ventas o procesos.

Cuando eso se aclara, el siguiente paso se vuelve mucho más concreto.`;
  }

  if (topic === "club") {
    return `Si tu consulta va por el Club de Importadores, lo importante es identificar si necesitas **una base inicial, acompañamiento más práctico o un apoyo más completo y continuo**.

Ahí normalmente se define qué plan tiene más sentido según tu etapa, tu nivel de claridad y qué tanto acompañamiento realmente necesitas para avanzar con orden.`;
  }

  if (
    /usa|estados unidos|europa|dubai|dubái|china/.test(text) &&
    /\bvender\b|\bmercado\b|\bcompradores\b/.test(text)
  ) {
    return `Si tu consulta apunta a vender en mercados internacionales, lo más importante es aclarar primero si estás hablando de **exportación, validación de mercado o estructura comercial**.

Cuando eso se define bien, ya se puede aterrizar mejor el camino y evitar decisiones apresuradas.`;
  }

  return `Entiendo tu consulta. Para orientarte bien, conviene revisar primero **tu contexto y el punto exacto en el que estás** antes de tomar decisiones apresuradas.`;
}

function buildAsesoriaConsultPrompt(message = "", detectedIntent = "", backendGuide = "") {
  const topic = inferAsesoriaConsultTopic(message, detectedIntent);

  return `Eres Orby, asistente comercial de OneOrbix.
El usuario está en el módulo de asesoría personalizada y acaba de hacer una consulta puntual.

Tema inferido de la consulta: ${topic}

Consulta del usuario:
${message}

Base estratégica que ya definió el backend:
${backendGuide}

Tu tarea es complementar SIEMPRE esa base con una respuesta breve, natural, útil y comercial.
No contradigas la base del backend.
No inventes precios, servicios ni procesos no definidos.
No conviertas la respuesta en algo demasiado técnico.
No repitas el menú.
No uses listas largas.
Aterriza mejor la orientación y añade un toque más humano y convincente.
Responde en español en un solo bloque breve.`;
}

function mergeBackendAndGeminiReply(backendReply = "", geminiReply = "") {
  const base = String(backendReply || "").trim();
  const ai = String(geminiReply || "").trim();

  if (!ai) return base;
  if (!base) return ai;
  if (ai === base) return base;

  return `${base}

${ai}`;
}

async function resolveAsesoriaConsultation({
  message,
  detectIntent,
  getGeminiReplyWithFallback,
  user
}) {
  const detectedIntent =
    typeof detectIntent === "function"
      ? detectIntent(message)
      : "general_service_question";

  const inferredTopic = inferAsesoriaConsultTopic(message, detectedIntent);
  const backendReply = buildAsesoriaConsultBackendReply(message, detectedIntent);

  if (typeof getGeminiReplyWithFallback === "function") {
    const prompt = buildAsesoriaConsultPrompt(message, detectedIntent, backendReply);
    const geminiFallback =
      "Si quieres, también podemos aterrizar tu caso con más enfoque para ayudarte a decidir mejor el siguiente paso.";

    const geminiReply = await getGeminiReplyWithFallback(prompt, user, geminiFallback);

    return {
      replyText: mergeBackendAndGeminiReply(backendReply, geminiReply),
      source: "hybrid",
      inferredTopic
    };
  }

  return {
    replyText: backendReply,
    source: "backend",
    inferredTopic
  };
}

async function handleAsesoriaFlow({
  user,
  phone,
  cleanMessage,
  message,
  saveUser,
  classifyLead,
  detectIntent,
  getGeminiReplyWithFallback,
  CALENDLY_LINK,
  getAsesoriaCaso1,
  getAsesoriaCaso2,
  getAsesoriaCaso3,
  getAsesoriaPreguntaFinal
}) {
  try {
    // =========================
    // ASESORÍA - CAPA DE CONTACTO
    // =========================

    if (
      user.interes_principal === "asesoria" &&
      ["lead_curioso", "lead_tibio", "lead_calificado", "asesoria_consulta_respondida"].includes(user.estado)
    ) {
      if (cleanMessage === "1") {
        logLeadEvent({
          phone,
          module: "asesoria",
          event_type: "cta_selected",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            action: "advisor_requested"
          }
        });

        user.estado = "asesoria_asesor_confirmar_numero";
        saveUser(phone, user);

        return {
          reply: getAsesoriaAdvisorConfirmationReply(phone),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        logLeadEvent({
          phone,
          module: "asesoria",
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
          reply: getAsesoriaMeetingReply(CALENDLY_LINK),
          source: "backend"
        };
      }

      if (user.estado === "lead_calificado") {
        return {
          reply: getAsesoriaLeadCalificadoReply(user),
          source: "backend"
        };
      }

      if (user.estado === "lead_tibio") {
        return {
          reply: getAsesoriaLeadTibioReply(user),
          source: "backend"
        };
      }

      if (user.estado === "lead_curioso") {
        return {
          reply: getAsesoriaLeadCuriosoReply(user),
          source: "backend"
        };
      }

      return {
        reply: `Puedo seguir ayudándote con tu consulta o, si prefieres avanzar directamente, aquí tienes las dos opciones disponibles.${getAsesoriaLeadOfferOptions()}`,
        source: "backend"
      };
    }

    if (user.estado === "asesoria_asesor_confirmar_numero") {
      if (cleanMessage === "1") {
        user.callback_phone = phone;
        user.estado = "asesoria_asesor_horario";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
          event_type: "advisor_request",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            callback_phone: user.callback_phone,
            phone_confirmation: "same_number"
          }
        });

        return {
          reply: getAsesoriaAdvisorAskScheduleReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "asesoria_asesor_otro_numero";
        saveUser(phone, user);

        return {
          reply: getAsesoriaAdvisorAskNewPhoneReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2.",
        source: "backend"
      };
    }

    if (user.estado === "asesoria_asesor_otro_numero") {
      if (!isLikelyPhoneNumber(message || cleanMessage)) {
        return {
          reply: "Envíame un número válido para contacto y seguimos con el horario.",
          source: "backend"
        };
      }

      user.callback_phone = String(message || cleanMessage).trim();
      user.estado = "asesoria_asesor_horario";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "asesoria",
        event_type: "advisor_request",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          callback_phone: user.callback_phone,
          phone_confirmation: "other_number"
        }
      });

      return {
        reply: getAsesoriaAdvisorAskScheduleReply(),
        source: "backend"
      };
    }

    if (user.estado === "asesoria_asesor_horario") {
      if (cleanMessage === "1") {
        user.callback_schedule = "9_12";
        user.estado = "finalizado";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
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
          reply: getAsesoriaAdvisorFinalReply(user),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.callback_schedule = "2_6";
        user.estado = "finalizado";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
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
          reply: getAsesoriaAdvisorFinalReply(user),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1 o 2 para elegir el horario.",
        source: "backend"
      };
    }

    // =========================
    // ASESORÍA - PASO 1
    // =========================

    if (user.estado === "asesoria_p1") {
      if (cleanMessage === "1") {
        user.estado = "asesoria_p2";
        user.subopcion = "comercio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "1",
            step: "asesoria_p1_to_p2"
          }
        });

        return {
          reply: getAsesoriaCaso1(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "asesoria_p2";
        user.subopcion = "negocio";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "2",
            step: "asesoria_p1_to_p2"
          }
        });

        return {
          reply: getAsesoriaCaso2(),
          source: "backend"
        };
      }

      if (cleanMessage === "3") {
        user.estado = "asesoria_p2";
        user.subopcion = "escalar";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "3",
            step: "asesoria_p1_to_p2"
          }
        });

        return {
          reply: getAsesoriaCaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "4") {
        user.estado = "asesoria_consulta_pedir";
        user.subopcion = "consulta";
        saveUser(phone, user);

        logLeadEvent({
          phone,
          module: "asesoria",
          event_type: "flow_step",
          estado: user.estado,
          interes_principal: user.interes_principal,
          subopcion: user.subopcion,
          score: user.score,
          detail: {
            selected_option: "4",
            step: "asesoria_p1_to_consulta"
          }
        });

        return {
          reply: getAsesoriaAskConsultationReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1, 2, 3 o 4.",
        source: "backend"
      };
    }

    // =========================
    // ASESORÍA - PASO 2
    // =========================

    if (user.estado === "asesoria_p2") {
      if (user.subopcion === "comercio") {
        if (cleanMessage === "1") {
          user.score += 3;
        } else if (cleanMessage === "2") {
          user.score += 2;
        } else if (cleanMessage === "3") {
          user.score += 1;
        } else {
          return {
            reply: "Por favor responde con 1, 2 o 3.",
            source: "backend"
          };
        }
      }

      if (user.subopcion === "negocio") {
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

      if (user.subopcion === "escalar") {
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

      user.estado = "asesoria_p3";
      saveUser(phone, user);

      logLeadEvent({
        phone,
        module: "asesoria",
        event_type: "flow_step",
        estado: user.estado,
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        detail: {
          selected_option: cleanMessage,
          step: "asesoria_p2_to_p3"
        }
      });

      return {
        reply: getAsesoriaPreguntaFinal(),
        source: "backend"
      };
    }

    // =========================
    // ASESORÍA - PASO 3
    // =========================

    if (user.estado === "asesoria_p3") {
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
        module: "asesoria",
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
          reply: getAsesoriaLeadCalificadoReply(user),
          source: "backend"
        };
      }

      if (user.estado === "lead_tibio") {
        return {
          reply: getAsesoriaLeadTibioReply(user),
          source: "backend"
        };
      }

      return {
        reply: getAsesoriaLeadCuriosoReply(user),
        source: "backend"
      };
    }

    // =========================
    // ASESORÍA - CONSULTA PUNTUAL
    // =========================

    if (user.estado === "asesoria_consulta_pedir") {
      const rawMessage = String(message || "").trim();

      if (!rawMessage) {
        return {
          reply: getAsesoriaAskConsultationReply(),
          source: "backend"
        };
      }

      const { replyText, source, inferredTopic } = await resolveAsesoriaConsultation({
        message: rawMessage,
        detectIntent,
        getGeminiReplyWithFallback,
        user
      });

      logCustomerQuery({
        phone,
        module: "asesoria",
        estado: user.estado,
        interes_principal: user.interes_principal,
        query: rawMessage,
        detail: {
          subopcion: "consulta",
          inferred_topic: inferredTopic,
          source
        }
      });

      logLeadEvent({
        phone,
        module: "asesoria",
        event_type: "advisory_query",
        estado: "asesoria_consulta_respondida",
        interes_principal: user.interes_principal,
        subopcion: user.subopcion,
        score: user.score,
        source,
        detail: {
          query: rawMessage,
          inferred_topic: inferredTopic
        }
      });

      user.estado = "asesoria_consulta_respondida";
      saveUser(phone, user);

      return {
        reply: `${replyText}${getAsesoriaConsultaClosure()}`,
        source: "backend"
      };
    }

    return null;
  } catch (error) {
    console.error("Error en handleAsesoriaFlow:", error);

    logErrorEvent({
      phone,
      module: "asesoria",
      estado: user?.estado || null,
      interes_principal: user?.interes_principal || null,
      incoming_message: message || cleanMessage || null,
      error_message: error.message,
      stack: error.stack,
      detail: {
        flow: "asesoria"
      }
    });

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = {
  handleAsesoriaFlow
};