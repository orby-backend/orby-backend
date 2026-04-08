const CALENDLY_LINK = "https://calendly.com/oneorbix/30min";

// =========================
// EXPORTACIÓN - HELPERS DE INTENTS
// =========================

function isExportFreeTextIntent(intent) {
  return [
    "export_info",
    "export_start",
    "export_with_product",
    "export_product_validation",
    "export_no_market",
    "export_us_market",
    "export_china_market",
    "export_europe_market",
    "export_dubai_market",
    "export_requirements_question",
    "export_process_question",
    "export_viability_question",
    "export_next_step",
    "export_schedule",
    "export_help_options"
  ].includes(intent);
}

// =========================
// EXPORTACIÓN - RESPUESTAS BACKEND
// =========================

function getExportInfoAnswer() {
  return `En OneOrbix te ayudamos a estructurar exportaciones con más criterio para que no avances con una idea suelta como si ya fuera un plan internacional sólido.

La orientación normalmente se enfoca en:
- validación de producto
- mercado objetivo
- requisitos generales
- estructura comercial y logística
- claridad sobre el siguiente paso antes de ejecutar

La idea no es empujarte a exportar por entusiasmo, sino ayudarte a que el proceso tenga sentido desde el inicio.

Si quieres, te ubico rápido según tu caso. ¿Ya tienes producto listo, necesitas validar si sirve o todavía estás definiendo producto o mercado?`;
}

function getExportStartAnswer() {
  return `Si estás empezando desde cero en exportación, lo más importante no es salir a buscar compradores a ciegas, sino ordenar primero el punto de partida.

Ahí conviene aclarar:
- si ya tienes producto o todavía no
- si el producto realmente tiene potencial exportable
- a qué mercado tendría sentido apuntar
- qué tan estructurada está tu parte comercial

Ese orden evita varios errores típicos, sobre todo el de querer vender afuera algo que todavía no está listo para competir afuera.

Si quieres, te ayudo a aterrizarlo mejor. ¿Ya tienes producto definido o todavía estás en una etapa más exploratoria?`;
}

function getExportWithProductAnswer() {
  return `Perfecto. Si ya tienes un producto listo o bastante definido, entonces tu caso ya no está en la etapa de “quiero exportar algún día”, sino en la de revisar si realmente tiene sentido moverlo a un mercado concreto.

Antes de avanzar más, normalmente conviene ver:
- si el producto tiene potencial exportable
- a qué mercado podría encajar mejor
- qué tan exigente puede ser ese mercado
- si tu estructura comercial está lista para dar ese paso

Si quieres, cuéntame qué producto tienes en mente y te doy una orientación inicial más aterrizada.`;
}

function getExportProductValidationAnswer() {
  return `Sí, esa es exactamente una de las preguntas que conviene hacerse antes de avanzar.

Validar un producto para exportación no es solo preguntarse si “es bueno” o si aquí se vende bien. La clave es ver si realmente tiene sentido moverlo a otro mercado y en qué condiciones.

Ahí normalmente se revisa:
- potencial comercial en el mercado destino
- nivel de exigencia general
- viabilidad logística
- coherencia entre producto, mercado y propuesta comercial

En resumen, no es solo “me gusta esta idea”, sino “¿vale la pena empujarla fuera y hacia dónde tendría más lógica hacerlo?”.

Si quieres, dime qué producto tienes en mente y te doy una primera lectura más concreta.`;
}

function getExportNoMarketAnswer() {
  return `Perfecto. Ese punto es más común de lo que parece.

Cuando alguien quiere exportar pero todavía no tiene claro el mercado, la prioridad no es escoger un país por intuición, sino ordenar bien la decisión. Ahí se define una parte importante del resultado.

Normalmente conviene mirar cosas como:
- tipo de producto
- nivel de exigencia del mercado
- encaje comercial
- capacidad de respuesta del negocio
- viabilidad general para empezar sin complicarte de más

Si quieres, te ayudo a aterrizar eso mejor. ¿Tu idea va más hacia Estados Unidos, Europa, China, Dubái o todavía estás explorando sin definir mercado?`;
}

function getExportUSMarketAnswer() {
  return `Sí, Estados Unidos puede ser un mercado muy interesante, pero conviene verlo con criterio.

No se trata solo de decir “quiero vender allá”, sino de revisar si el producto realmente encaja, qué tan exigente puede ser el mercado y si tu estructura comercial está preparada para responder.

A nivel general, si alguien quiere exportar a USA normalmente conviene revisar:
- si el producto tiene encaje real
- qué nivel de exigencia puede tener ese mercado
- si la propuesta comercial está clara
- viabilidad logística y documental en términos generales

En otras palabras, el mercado puede ser atractivo, pero el paso correcto es validar si tu producto y tu propuesta tienen sentido para entrar ahí con lógica.

Si quieres, dime qué producto estás evaluando y te ayudo a aterrizar mejor si USA parece una dirección razonable.`;
}

function getExportChinaMarketAnswer() {
  return `China puede ser un mercado interesante, pero no conviene mirarlo como un destino automático solo porque suena grande.

Antes de avanzar, normalmente conviene revisar:
- si el producto tiene sentido para ese mercado
- qué tan clara está tu propuesta comercial
- qué tan preparado está el negocio para entrar con una estrategia seria

Es un mercado con potencial, sí, pero no suele premiar la improvisación.

Si quieres, te ayudo a aterrizar mejor si China tiene lógica para tu caso según el producto que tienes en mente.`;
}

function getExportEuropeMarketAnswer() {
  return `Europa puede ser una muy buena dirección, pero suele exigir bastante claridad y consistencia.

Antes de pensar en avanzar, conviene revisar:
- si el producto realmente tiene encaje
- qué tan exigente puede ser ese mercado para tu categoría
- si tu estructura comercial está lista para sostener una propuesta más sólida

No es un mercado para improvisar, pero bien trabajado puede tener mucho sentido.

Si quieres, dime qué producto estás evaluando y te ayudo a ver si Europa parece una dirección razonable.`;
}

function getExportDubaiMarketAnswer() {
  return `Dubái puede ser una puerta comercial interesante, pero conviene analizarlo con calma y no solo por atractivo de nombre.

Antes de avanzar, normalmente conviene revisar:
- si el producto realmente encaja en ese entorno comercial
- si hay una propuesta clara detrás
- si tu negocio está listo para sostener una estrategia bien planteada

Puede ser una dirección valiosa, pero no conviene asumir que solo por apuntar ahí ya existe oportunidad real.

Si quieres, dime qué producto estás evaluando y te ayudo a aterrizar si Dubái tiene lógica para tu caso.`;
}

function getExportRequirementsAnswer() {
  return `Sí, claro. Cuando alguien pregunta por requisitos para exportar, lo importante es no convertir eso en una lista técnica interminable antes de entender el caso.

A nivel general, normalmente conviene revisar:
- producto
- mercado destino
- condiciones generales del proceso
- estructura comercial del negocio
- viabilidad logística según la operación

La pregunta correcta no es solo “¿qué papeles necesito?”, sino “¿qué tan preparado está mi caso para avanzar hacia ese mercado con sentido?”.

Si quieres, te ayudo a ordenarlo mejor. ¿Ya tienes producto definido o todavía estás validando si realmente conviene exportarlo?`;
}

function getExportProcessQuestionAnswer() {
  return `Sí, claro. El proceso de exportación no debería verse como una lista suelta de pasos, sino como una secuencia con lógica para no improvisar.

Normalmente el camino se ordena así:
- definir o validar producto
- revisar mercado objetivo
- entender viabilidad general
- ordenar la parte comercial y logística antes de ejecutar

La idea es evitar que alguien salte directo a “quiero vender afuera” cuando todavía no están claras las piezas importantes.

Si quieres, te lo aterrizo según tu etapa. ¿Ya tienes producto o todavía estás en la parte de validar qué tan exportable es tu caso?`;
}

function getExportViabilityQuestionAnswer() {
  return `Sí, esa es la clase de pregunta que conviene hacerse antes de avanzar de verdad.

Cuando alguien habla de viabilidad en exportación, la conversación ya no va solo de producto, sino de si realmente vale la pena moverlo a un mercado internacional bajo ciertas condiciones.

Ahí suele revisarse:
- encaje comercial
- mercado destino
- nivel general de exigencia
- viabilidad logística
- coherencia entre producto, propuesta y estructura del negocio

En otras palabras, la pregunta correcta ya no es solo “¿me gusta este producto?”, sino “¿tiene sentido exportarlo y hacia dónde tendría más lógica hacerlo?”.

Si quieres, dime qué producto o mercado estás evaluando y te doy una orientación inicial.`;
}

function getExportNextStepAnswer(user) {
  if (user && user.subopcion === "producto_listo") {
    return `Como ya vienes por la línea de producto listo, el siguiente paso lógico es revisar si ese producto realmente tiene potencial exportable y hacia qué mercado tendría más sentido moverlo.

Ahí normalmente conviene revisar viabilidad, mercado y estructura comercial.

Si quieres, cuéntame qué producto tienes en mente y te doy una orientación inicial. Y si prefieres verlo directo en reunión, también puedes agendar aquí:
${CALENDLY_LINK}`;
  }

  if (user && user.subopcion === "producto_no_valido") {
    return `Como tu caso va más por validar si el producto realmente sirve para exportación, el siguiente paso lógico es revisar con criterio qué tan exportable es y qué mercado tendría más sentido.

Eso evita perder tiempo tratando de empujar algo que todavía no tiene una base clara para salir afuera.

Si quieres, dime qué producto estás evaluando y te ayudo a aterrizar mejor el panorama.`;
  }

  if (user && user.subopcion === "sin_definir") {
    return `Como todavía no tienes definido producto o mercado, el siguiente paso lógico es ordenar bien esa base antes de pensar en ejecución.

En exportación, empezar sin claridad suele salir más caro que tomarse un poco más de tiempo para estructurar bien el punto de partida.

Si quieres, te ayudo a aterrizar eso mejor según la idea general que tienes en mente.`;
  }

  return `El siguiente paso depende bastante de si ya tienes producto, si todavía no sabes si realmente conviene exportarlo o si aún no tienes claro el mercado.

Si quieres, te ubico rápido aquí mismo. Y si prefieres verlo en llamada, puedes agendar aquí:
${CALENDLY_LINK}`;
}

function getExportScheduleAnswer() {
  return `Perfecto. Aquí puedes agendar una reunión para revisar tu caso:

${CALENDLY_LINK}

Si quieres, antes de eso también te puedo orientar un poco aquí para que llegues con más claridad a la llamada.`;
}

function getExportHelpOptionsAnswer() {
  return `En exportación no estamos manejando aquí un esquema público de planes cerrados como en el Club.

Lo que sí hacemos es orientar según la etapa real en la que estés, por ejemplo:
- si ya tienes producto
- si necesitas validar si realmente sirve
- si todavía no sabes a qué mercado apuntar
- si quieres entender proceso, requisitos o viabilidad

La lógica aquí no es meterte en una caja por capricho, sino ayudarte según tu punto real de partida.

Si quieres, dime en cuál de esos casos estás y te digo cuál sería la ayuda más lógica para ti.`;
}

function getExportGeneralFallbackAnswer() {
  return `Perfecto. En exportación lo más importante primero es ubicar bien tu etapa, porque no es lo mismo entrar con producto listo que entrar todavía validando o definiendo mercado.

Para orientarte mejor, dime cuál se parece más a tu caso:
1️⃣ Ya tengo producto listo
2️⃣ No sé si mi producto realmente sirve para exportar
3️⃣ Todavía no tengo claro producto o mercado

Y si prefieres verlo directamente en reunión, aquí puedes agendar:
${CALENDLY_LINK}`;
}

function buildExportIntentResponse(intent, user) {
  if (intent === "export_info") return getExportInfoAnswer();
  if (intent === "export_start") return getExportStartAnswer();
  if (intent === "export_with_product") return getExportWithProductAnswer();
  if (intent === "export_product_validation") {
    return getExportProductValidationAnswer();
  }
  if (intent === "export_no_market") return getExportNoMarketAnswer();
  if (intent === "export_us_market") return getExportUSMarketAnswer();
  if (intent === "export_china_market") return getExportChinaMarketAnswer();
  if (intent === "export_europe_market") return getExportEuropeMarketAnswer();
  if (intent === "export_dubai_market") return getExportDubaiMarketAnswer();
  if (intent === "export_requirements_question") {
    return getExportRequirementsAnswer();
  }
  if (intent === "export_process_question") {
    return getExportProcessQuestionAnswer();
  }
  if (intent === "export_viability_question") {
    return getExportViabilityQuestionAnswer();
  }
  if (intent === "export_next_step") return getExportNextStepAnswer(user);
  if (intent === "export_schedule") return getExportScheduleAnswer();
  if (intent === "export_help_options") return getExportHelpOptionsAnswer();

  return null;
}

module.exports = {
  CALENDLY_LINK,
  isExportFreeTextIntent,
  buildExportIntentResponse,
  getExportGeneralFallbackAnswer
};