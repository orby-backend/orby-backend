const CALENDLY_LINK = "https://calendly.com/oneorbix/30min";

// =========================
// IMPORTACIÓN - HELPERS DE INTENTS
// =========================

function isImportFreeTextIntent(intent) {
  return [
    "import_info",
    "import_start",
    "import_no_product",
    "import_with_product",
    "import_product_validation",
    "import_supplier_search",
    "import_from_china",
    "import_costs_question",
    "import_process_question",
    "import_next_step",
    "import_schedule",
    "import_help_options"
  ].includes(intent);
}

// =========================
// IMPORTACIÓN - RESPUESTAS BACKEND
// =========================

function getImportInfoAnswer() {
  return `En OneOrbix te ayudamos a ordenar el proceso de importación para que no avances a ciegas ni termines comprando por impulso solo porque el proveedor se veía bonito en una foto.

La orientación normalmente se enfoca en:
- elección o validación de producto
- búsqueda de proveedor o fabricante
- estructura del proceso de compra
- claridad sobre costos y pasos antes de ejecutar

La idea no es empujarte a importar por importar, sino ayudarte a que el siguiente paso tenga sentido.

Si quieres, te ubico rápido según tu caso. ¿Ya tienes producto definido o todavía estás viendo qué te conviene importar?`;
}

function getImportStartAnswer() {
  return `Si estás empezando desde cero en importación, lo más importante no es correr a pedir cotizaciones, sino ordenar primero el punto de partida.

Ahí conviene aclarar:
- si ya tienes producto o todavía no
- si tu meta es vender, uso personal o explorar
- si necesitas proveedor o primero validar mejor la idea
- qué tan claro tienes el proceso

Ese orden evita varios errores típicos, sobre todo el más caro de todos: comprar mal.

Si quieres, te ayudo a aterrizarlo mejor. ¿Ya tienes aunque sea una idea de producto o todavía estás completamente en blanco?`;
}

function getImportNoProductAnswer() {
  return `Perfecto. Ese punto es más común de lo que parece.

Cuando alguien quiere importar pero todavía no tiene producto definido, la prioridad no es moverse rápido, sino elegir bien. Ahí se decide buena parte del resultado.

Normalmente conviene mirar cosas como:
- tipo de producto
- margen potencial
- facilidad de venta o uso
- complejidad logística
- riesgo de empezar con algo demasiado enredado

Si quieres, te ayudo a ordenar eso mejor. ¿Tu idea sería importar para vender en Ecuador, vender en Amazon o todavía estás explorando posibilidades?`;
}

function getImportWithProductAnswer() {
  return `Perfecto. Si ya tienes producto o una idea bastante definida, entonces tu caso ya no está en la etapa de “qué podría importar”, sino en la de revisar si realmente conviene moverte con eso.

Antes de avanzar más, normalmente conviene ver:
- si el producto tiene sentido comercial
- si es razonable para importar
- qué tan complejo puede ser el proceso
- si vale la pena buscar proveedor ya o ajustar primero la idea

Si quieres, cuéntame qué producto tienes en mente y te doy una orientación inicial más aterrizada.`;
}

function getImportProductValidationAnswer() {
  return `Sí, esa es exactamente una de las preguntas que conviene hacerse antes de avanzar.

Validar un producto para importación no es solo preguntarse si “se ve bueno” o si viene barato. La clave es ver si realmente tiene sentido importarlo y en qué condiciones.

Ahí normalmente se revisa:
- potencial comercial o utilidad real
- margen después de costos
- complejidad logística
- riesgo de comprar mal o traer algo poco conveniente

En resumen, no es solo “me gusta esta idea”, sino “¿vale la pena moverme con esto?”.

Si quieres, dime qué producto tienes en mente y te doy una primera lectura más concreta.`;
}

function getImportSupplierSearchAnswer() {
  return `Sí, esa es una parte clave del proceso.

Buscar proveedor o fabricante no debería hacerse a ciegas ni solo por precio, porque ahí es donde mucha gente se emociona rápido y luego termina pagando la novatada completa.

Normalmente conviene mirar:
- si ya tienes claro el producto
- qué tan específico debe ser el proveedor
- si necesitas fabricante o un proveedor comercial
- qué nivel de validación hace falta antes de comprar

Si quieres, te ubico mejor según tu caso. ¿Ya tienes producto definido o todavía necesitas ayuda para definir producto y proveedor al mismo tiempo?`;
}

function getImportFromChinaAnswer() {
  return `Sí, ese camino puede tener bastante sentido, pero conviene estructurarlo bien.

Si tu idea es importar desde China o USA, no se trata solo de encontrar algo barato y traerlo. Antes de eso normalmente hay que revisar si el producto realmente conviene, qué tipo de proveedor necesitas y cómo se ordena el proceso.

Ahí suelen entrar preguntas como:
- si el producto tiene sentido comercial
- cuánto puede costar realmente importarlo
- qué tan complejo sería el proceso
- si vale la pena avanzar ya o validar mejor primero

Es un camino con potencial, pero mal planteado puede terminar en una compra floja, y eso sale caro aunque el proveedor te sonría en Alibaba.

Si quieres, te ayudo a ubicar mejor tu caso. ¿Ya tienes un producto específico en mente o todavía estás evaluando opciones?`;
}

function getImportCostsQuestionAnswer() {
  return `Sí, esa es una de las preguntas más importantes, porque mucha gente mira solo el precio del producto y se olvida de todo lo demás. Luego vienen las sorpresas, y las sorpresas en importación casi nunca son románticas.

Cuando hablas de costos de importación, normalmente conviene revisar:
- costo del producto
- logística y envío
- estructura general del proceso
- margen o viabilidad según el objetivo

La pregunta correcta no es solo “¿cuánto cuesta comprarlo?”, sino “¿cuánto sentido tiene importarlo en mi caso?”.

Si quieres, te ayudo a aterrizarlo mejor. ¿Ya tienes producto definido o todavía estás viendo qué conviene importar?`;
}

function getImportProcessQuestionAnswer() {
  return `Sí, claro. El proceso de importación no debería verse como una lista suelta de pasos, sino como una secuencia con lógica para no improvisar.

Normalmente el camino se ordena así:
- definir o validar producto
- ubicar proveedor o fabricante adecuado
- entender costos y viabilidad general
- estructurar el siguiente paso antes de ejecutar

La idea es evitar que alguien salte directo a comprar cuando todavía no tiene claras las piezas importantes.

Si quieres, te lo aterrizo según tu etapa. ¿Ya tienes producto o todavía estás en la parte de decidir qué te conviene importar?`;
}

function getImportNextStepAnswer(user) {
  if (user && user.subopcion === "producto_definido") {
    return `Como ya vienes por la línea de producto definido, el siguiente paso lógico es revisar si ese producto realmente conviene importar antes de asumir que ya está listo para moverse.

Ahí normalmente conviene revisar viabilidad, costos, proveedor y estructura del proceso.

Si quieres, cuéntame qué producto tienes en mente y te doy una orientación inicial. Y si prefieres verlo directo en reunión, también puedes agendar aquí:
${CALENDLY_LINK}`;
  }

  if (user && user.subopcion === "sin_producto") {
    return `Como todavía no tienes producto definido, el siguiente paso lógico es ordenar bien esa decisión antes de pensar en ejecutar.

En importación, elegir mal el producto suele costar más que tomarse un poco más de tiempo para decidir bien.

Si quieres, te ayudo a aterrizar eso mejor según si buscas vender en Ecuador, vender en Amazon o si todavía estás explorando ideas.`;
  }

  if (user && user.subopcion === "busca_proveedor") {
    return `Como tu caso va más por búsqueda de proveedor o fabricante, el siguiente paso lógico es aclarar si ya tienes producto definido o si todavía necesitas ayuda para definir producto y proveedor al mismo tiempo.

Eso cambia bastante el enfoque, porque no es lo mismo buscar proveedor para algo claro que salir a buscar sin tener bien aterrizado lo que quieres traer.

Si quieres, te oriento aquí mismo o, si prefieres verlo con más calma, puedes agendar una reunión:
${CALENDLY_LINK}`;
  }

  return `El siguiente paso depende bastante de si ya tienes producto, si todavía no sabes qué importar o si lo que necesitas es proveedor.

Si quieres, te ubico rápido aquí mismo. Y si prefieres verlo en llamada, puedes agendar aquí:
${CALENDLY_LINK}`;
}

function getImportScheduleAnswer() {
  return `Perfecto. Aquí puedes agendar una reunión para revisar tu caso:

${CALENDLY_LINK}

Si quieres, antes de eso también te puedo orientar un poco aquí para que llegues con más claridad a la llamada.`;
}

function getImportHelpOptionsAnswer() {
  return `En importación no estamos manejando aquí un esquema público de planes cerrados como en el Club.

Lo que sí hacemos es orientar según la etapa real en la que estés, por ejemplo:
- si ya tienes producto
- si todavía no sabes qué importar
- si buscas proveedor o fabricante
- si quieres entender costos, proceso o viabilidad

La lógica aquí no es meterte en una caja por capricho, sino ayudarte según tu punto real de partida.

Si quieres, dime en cuál de esos casos estás y te digo cuál sería la ayuda más lógica para ti.`;
}

function getImportGeneralFallbackAnswer() {
  return `Perfecto. En importación lo más importante primero es ubicar bien tu etapa, porque no es lo mismo entrar con producto definido que entrar todavía explorando o buscando proveedor.

Para orientarte mejor, dime cuál se parece más a tu caso:
1️⃣ Ya tengo producto definido
2️⃣ Todavía no sé qué importar
3️⃣ Busco proveedor o fabricante

Y si prefieres verlo directamente en reunión, aquí puedes agendar:
${CALENDLY_LINK}`;
}

function buildImportIntentResponse(intent, user) {
  if (intent === "import_info") return getImportInfoAnswer();
  if (intent === "import_start") return getImportStartAnswer();
  if (intent === "import_no_product") return getImportNoProductAnswer();
  if (intent === "import_with_product") return getImportWithProductAnswer();
  if (intent === "import_product_validation") {
    return getImportProductValidationAnswer();
  }
  if (intent === "import_supplier_search") {
    return getImportSupplierSearchAnswer();
  }
  if (intent === "import_from_china") {
    return getImportFromChinaAnswer();
  }
  if (intent === "import_costs_question") {
    return getImportCostsQuestionAnswer();
  }
  if (intent === "import_process_question") {
    return getImportProcessQuestionAnswer();
  }
  if (intent === "import_next_step") return getImportNextStepAnswer(user);
  if (intent === "import_schedule") return getImportScheduleAnswer();
  if (intent === "import_help_options") return getImportHelpOptionsAnswer();

  return null;
}

// =========================
// IMPORTACIÓN - CIERRES COMERCIALES POR LEAD
// =========================

function getImportLeadOfferOptions() {
  return `

Si deseas que uno de nuestros asesores te guíe, tienes estas opciones:
1️⃣ Quiero que un asesor me guíe
2️⃣ Quiero agendar una reunión vía meeting`;
}

function getImportProfileContext(user) {
  if (!user) return "";

  if (user.subopcion === "producto_definido") {
    if (user.detalle_importacion === "ya_importo") {
      return `Perfecto. Entonces ya tienes el producto definido y además ya has importado antes.

Eso hace que tu caso esté en una etapa más práctica, donde conviene revisar cómo afinar mejor el siguiente paso, validar si vale la pena moverte con ese producto y ordenar proveedor, costos y proceso con más criterio.`;
    }

    if (user.detalle_importacion === "primera_vez") {
      return `Perfecto. Entonces ya tienes definido el producto, pero al ser tu primera vez importando, lo más importante ahora es ayudarte a ordenar bien el proceso para que no avances con dudas ni tomes decisiones apresuradas.

En esta etapa conviene revisar viabilidad, costos y cómo estructurar el siguiente paso con más claridad.`;
    }

    return `Perfecto. Entonces ya tienes una base importante, que es haber definido el producto.

Lo que conviene ahora es revisar si realmente vale la pena moverte con ese producto y cómo ordenar bien el siguiente paso antes de buscar o comprar a la carrera.`;
  }

  if (user.subopcion === "sin_producto") {
    if (user.detalle_importacion === "vender_ecuador") {
      return `Perfecto. Entonces tu caso va más por elegir bien qué producto te conviene importar para vender en Ecuador antes de tomar decisiones apresuradas.

Ese orden es importante porque una mala elección al inicio suele salir bastante más cara después.`;
    }

    if (user.detalle_importacion === "vender_amazon") {
      return `Perfecto. Entonces tu caso va más por elegir bien qué producto te conviene importar si tu objetivo es vender luego en Amazon.

Ahí conviene ordenar muy bien la elección, porque no cualquier producto barato termina siendo una buena oportunidad.`;
    }

    if (user.detalle_importacion === "explorando") {
      return `Perfecto. Entonces todavía estás explorando ideas, y eso no tiene nada de malo.

En esta etapa lo más útil es ayudarte a aterrizar opciones con más criterio antes de pasar a proveedores o compras.`;
    }

    return `Perfecto. Entonces tu caso va más por elegir bien qué producto te conviene importar antes de tomar decisiones apresuradas.`;
  }

  if (user.subopcion === "busca_proveedor") {
    if (user.detalle_importacion === "producto_definido_proveedor") {
      return `Perfecto. Entonces ya tienes el producto definido y ahora el foco está en encontrar el proveedor o fabricante correcto.

Ahí conviene ordenar bien la búsqueda para que no se vuelva una colección de cotizaciones sin dirección.`;
    }

    if (user.detalle_importacion === "definir_producto_y_proveedor") {
      return `Perfecto. Entonces tu caso va más por definir bien qué producto te conviene y luego buscar el proveedor correcto.

Ese orden es clave para no salir a cotizar sin una dirección clara.`;
    }

    return `Perfecto. Entonces tu caso va más por ordenar bien la búsqueda de proveedor para que tenga sentido y no se vuelva improvisación.`;
  }

  return `Perfecto. Ya tengo una idea inicial de tu caso en importación.`;
}

function getImportLeadCuriosoReply(user) {
  return `${getImportProfileContext(user)}${getImportLeadOfferOptions()}`;
}

function getImportLeadTibioReply(user) {
  return `${getImportProfileContext(user)}

Ya hay señales claras de interés, así que sí vale la pena que uno de nuestros asesores revise tu caso con más enfoque.${getImportLeadOfferOptions()}`;
}

function getImportLeadCalificadoReply(user) {
  return `${getImportProfileContext(user)}

Tu caso ya está en un punto donde tiene bastante sentido avanzar con guía más directa para ayudarte a tomar mejores decisiones.${getImportLeadOfferOptions()}`;
}

function getImportAdvisorConfirmationReply(phone) {
  return `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?

${phone}

1️⃣ Sí, a este número
2️⃣ No, quiero dar otro número`;
}

function getImportAdvisorAskNewPhoneReply() {
  return `Perfecto. Envíame el número al que deseas que te contacten y seguimos.`;
}

function getImportAdvisorAskScheduleReply() {
  return `Perfecto. ¿En qué horario te conviene más que te contacten?

1️⃣ De 9 a 12 pm
2️⃣ De 2 a 6 pm`;
}

function getImportAdvisorFinalReply(user) {
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

En breve estaremos contigo para orientarte mejor según tu caso.`;
}

function getImportMeetingReply() {
  return `Perfecto. Aquí tienes el enlace para agendar tu reunión vía meeting:

${CALENDLY_LINK}

Así podemos revisar tu caso con más calma y orientarte según la etapa exacta en la que estás.`;
}

function isLikelyPhoneNumber(value = "") {
  const cleaned = String(value).replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

module.exports = {
  CALENDLY_LINK,
  isImportFreeTextIntent,
  buildImportIntentResponse,
  getImportGeneralFallbackAnswer,
  getImportLeadCuriosoReply,
  getImportLeadTibioReply,
  getImportLeadCalificadoReply,
  getImportAdvisorConfirmationReply,
  getImportAdvisorAskNewPhoneReply,
  getImportAdvisorAskScheduleReply,
  getImportAdvisorFinalReply,
  getImportMeetingReply,
  isLikelyPhoneNumber
};