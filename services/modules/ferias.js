// services/modules/ferias.js
const CALENDLY_LINK = "https://calendly.com/oneorbix/30min";

function getFeriasLeadCuriosoReply(user) {
  return `${getFeriasProfileContext(user)}

Todavía estás en una etapa de exploración, pero sí vale la pena darte una orientación inicial para que no pierdas tiempo mirando ferias al azar.

Tienes estas opciones:
1️⃣ Quiero orientación aquí
2️⃣ Quiero agendar una reunión`;
}

function getFeriasLeadTibioReply(user) {
  return `${getFeriasProfileContext(user)}

Ya hay señales claras de interés, así que sí vale la pena orientarte con más enfoque para que tomes una mejor decisión sobre qué feria te conviene y cómo prepararte.

Tienes estas opciones:
1️⃣ Quiero orientación aquí
2️⃣ Quiero agendar una reunión`;
}

function getFeriasLeadCalificadoReply(user) {
  return `${getFeriasProfileContext(user)}

Tu caso ya está en un punto donde sí tiene sentido orientarte con más enfoque para ayudarte a elegir mejor la feria, el objetivo y la preparación previa.

Tienes estas opciones:
1️⃣ Quiero orientación aquí
2️⃣ Quiero agendar una reunión`;
}

function getFeriasProfileContext(user) {
  if (!user) {
    return `Perfecto. Ya tengo una idea inicial de tu interés en ferias internacionales.`;
  }

  if (user.subopcion === "feria_especifica") {
    return `Excelente. Veo que ya tienes una intención bastante clara, porque no estás preguntando si una feria “suena interesante”, sino cómo aterrizar mejor esa participación.`;
  }

  if (user.subopcion === "no_sabe") {
    return `Perfecto. Veo que todavía no tienes definida la feria ideal, así que la prioridad no es elegir por impulso, sino ver cuál sí encaja con lo que realmente buscas.`;
  }

  if (user.subopcion === "proveedores") {
    return `Perfecto. Veo que tu interés está más orientado a encontrar proveedores o productos específicos, así que aquí lo importante es que la feria realmente te acerque a ese objetivo y no se vuelva solo un paseo caro.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu interés en ferias internacionales.`;
}

function getFeriasOrientationStarter(user) {
  if (user?.subopcion === "feria_especifica") {
    return `Perfecto. Como ya vienes con una feria específica en mente, ahora lo importante es aterrizar si realmente te conviene ir y con qué objetivo claro.

Cuéntame en una sola línea:
- qué feria tienes en mente
o
- qué tipo de productos o proveedores buscas

También tienes estas opciones:
1️⃣ Quiero que me orienten mejor
2️⃣ Quiero agendar una reunión`;
  }

  if (user?.subopcion === "no_sabe") {
    return `Perfecto. Como todavía no tienes clara la feria ideal, aquí lo más útil es ubicar primero qué estás buscando, porque no todas las ferias sirven para lo mismo.

Cuéntame en una sola línea cuál de estos casos se parece más a ti:
- busco productos para importar
- busco alianzas o contactos
- quiero explorar opciones

También tienes estas opciones:
1️⃣ Quiero que me orienten mejor
2️⃣ Quiero agendar una reunión`;
  }

  if (user?.subopcion === "proveedores") {
    return `Perfecto. Como tu objetivo es encontrar proveedores o productos específicos en ferias, aquí lo importante es definir mejor qué buscas para saber qué feria sí tiene sentido.

Cuéntame en una sola línea:
- qué tipo de producto buscas
o
- qué tipo de proveedor te interesa

También tienes estas opciones:
1️⃣ Quiero que me orienten mejor
2️⃣ Quiero agendar una reunión`;
  }

  return `Perfecto. Cuéntame un poco más de tu caso y te orientamos mejor según tu interés en ferias internacionales.

También tienes estas opciones:
1️⃣ Quiero que me orienten mejor
2️⃣ Quiero agendar una reunión`;
}

function getFeriasOrientationFollowup(user, cleanMessage) {
  const text = String(cleanMessage || "").toLowerCase();

  if (
    text === "2" ||
    /agendar|reunion|reunión|llamada|meeting|calendly/.test(text)
  ) {
    return getFeriasScheduleReply();
  }

  if (user?.subopcion === "feria_especifica") {
    return `Perfecto. Si ya tienes una feria en mente, la clave no es solo asistir, sino saber si realmente te conviene según el tipo de producto, proveedor o alianza que estás buscando.

Lo más útil ahora es revisar:
- si esa feria sí encaja con tu objetivo
- si conviene asistir en esta etapa
- cómo prepararte mejor para aprovecharla

Si prefieres verlo con más calma, responde 2 y te paso el enlace de reunión.`;
  }

  if (user?.subopcion === "no_sabe") {
    return `Perfecto. Como todavía no tienes definida la feria ideal, lo más importante es elegir según tu objetivo real, no según la fama del evento.

Normalmente conviene definir primero si buscas:
- productos para importar
- proveedores
- alianzas comerciales
- o simplemente explorar opciones

Si prefieres verlo con más calma, responde 2 y te paso el enlace de reunión.`;
  }

  if (user?.subopcion === "proveedores") {
    return `Perfecto. Si tu objetivo es encontrar proveedores o productos específicos en una feria, entonces la prioridad es definir mejor qué buscas y qué tan avanzado está ese interés.

Eso ayuda a identificar si la mejor vía es una feria específica, una estrategia de preparación distinta o incluso una reunión previa para aterrizar mejor el enfoque.

Si prefieres verlo con más calma, responde 2 y te paso el enlace de reunión.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu caso.

Si quieres seguir aquí, cuéntame un poco más en una sola línea.
Y si prefieres verlo en reunión, responde 2.`;
}

function getFeriasInfoGeneralReply() {
  return `Perfecto. Las ferias internacionales pueden ayudarte a encontrar productos, proveedores, alianzas y oportunidades comerciales, pero conviene elegirlas con criterio y no solo por nombre o por moda.

Si quieres, puedo ayudarte de dos formas:
1️⃣ Te oriento aquí según tu objetivo
2️⃣ Te paso el enlace para agendar una reunión`;
}

function getFeriasScheduleReply() {
  return `Perfecto. Aquí tienes el enlace para agendar tu reunión:

${CALENDLY_LINK}

Así podemos revisar tu caso con más calma y ayudarte a identificar qué feria o qué enfoque puede tener más sentido para ti.`;
}

function handleFeriasHybrid({
  user,
  cleanMessage
}) {
  if (user.interes_principal !== "ferias") {
    return null;
  }

  if (user.estado === "lead_curioso") {
    if (cleanMessage === "1") {
      user.estado = "ferias_orientacion_en_curso";
      return {
        reply: getFeriasOrientationStarter(user),
        source: "backend",
        userUpdated: true
      };
    }

    if (cleanMessage === "2") {
      return {
        reply: getFeriasScheduleReply(),
        source: "backend"
      };
    }

    return {
      reply: getFeriasLeadCuriosoReply(user),
      source: "backend"
    };
  }

  if (user.estado === "lead_tibio") {
    if (cleanMessage === "1") {
      user.estado = "ferias_orientacion_en_curso";
      return {
        reply: getFeriasOrientationStarter(user),
        source: "backend",
        userUpdated: true
      };
    }

    if (cleanMessage === "2") {
      return {
        reply: getFeriasScheduleReply(),
        source: "backend"
      };
    }

    return {
      reply: getFeriasLeadTibioReply(user),
      source: "backend"
    };
  }

  if (user.estado === "lead_calificado") {
    if (cleanMessage === "1") {
      user.estado = "ferias_orientacion_en_curso";
      return {
        reply: getFeriasOrientationStarter(user),
        source: "backend",
        userUpdated: true
      };
    }

    if (cleanMessage === "2") {
      return {
        reply: getFeriasScheduleReply(),
        source: "backend"
      };
    }

    return {
      reply: getFeriasLeadCalificadoReply(user),
      source: "backend"
    };
  }

  if (user.estado === "ferias_orientacion_en_curso") {
    return {
      reply: getFeriasOrientationFollowup(user, cleanMessage),
      source: "backend"
    };
  }

  return null;
}

module.exports = {
  CALENDLY_LINK,
  getFeriasLeadCuriosoReply,
  getFeriasLeadTibioReply,
  getFeriasLeadCalificadoReply,
  getFeriasInfoGeneralReply,
  getFeriasScheduleReply,
  handleFeriasHybrid
};