const CALENDLY_LINK = "https://calendly.com/oneorbix/30min";

// =========================
// AMAZON - HELPERS DE INTENTS
// =========================

function isAmazonFreeTextIntent(intent) {
  return [
    "amazon_info",
    "amazon_price",
    "amazon_start",
    "amazon_no_product",
    "amazon_with_product",
    "amazon_product_validation",
    "amazon_category_interest",
    "amazon_import_to_amazon",
    "amazon_viability_question",
    "amazon_next_step",
    "amazon_schedule",
    "amazon_help_options"
  ].includes(intent);
}

// =========================
// AMAZON - RESPUESTAS BACKEND
// =========================

function getAmazonInfoAnswer() {
  return `En OneOrbix te ayudamos a ordenar mejor el camino para vender en Amazon FBA, sobre todo para que no avances con piezas sueltas ni con decisiones tomadas a medias.

La orientación normalmente se enfoca en:
- elección o validación de producto
- claridad sobre el modelo con el que quieres entrar
- revisión de viabilidad general
- orden del proceso antes de ejecutar

La idea no es empujarte a moverte rápido por moverte, sino ayudarte a que el siguiente paso tenga lógica.

Si quieres, te ubico rápido según tu caso. ¿Ya tienes producto o todavía estás definiendo qué vender?`;
}

function getAmazonPriceAnswer() {
  return `Ahora mismo en este flujo no tengo una tarifa cerrada publicada para Amazon FBA como sí ocurre con el Club de Importadores.

Lo que sí puedo hacer es orientarte primero según tu etapa para que entiendas mejor por dónde conviene avanzar y no llegues a una llamada en blanco.

Si prefieres verlo directamente en reunión, aquí puedes agendar:
${CALENDLY_LINK}

Y si quieres, también puedo ayudarte aquí primero. Solo dime:
- ya tengo producto
o
- todavía no sé qué vender`;
}

function getAmazonStartAnswer() {
  return `Si estás empezando desde cero en Amazon, lo más importante no es correr a abrir cuenta o buscar cualquier producto, sino ordenar bien el punto de partida.

Ahí conviene aclarar primero:
- qué tipo de producto tendría sentido
- si buscas marca propia o reventa
- qué nivel de riesgo quieres asumir al inicio
- qué tan claro tienes el modelo

Ese orden evita varios errores típicos del arranque.

Si quieres, te ayudo a aterrizarlo mejor. ¿Ya tienes aunque sea una idea de producto o todavía estás totalmente en blanco?`;
}

function getAmazonNoProductAnswer() {
  return `Perfecto. Ese punto es más común de lo que parece.

Cuando alguien quiere entrar a Amazon sin producto definido, la prioridad no es moverse rápido, sino elegir con criterio. Ahí es donde se decide buena parte del resultado.

Normalmente conviene mirar cosas como:
- tipo de producto
- saturación o competencia
- margen potencial
- facilidad para entrar sin complicarte de más

Si quieres, te ayudo a ordenar eso mejor. ¿Tu idea sería vender marca propia, revender productos o todavía estás explorando posibilidades?`;
}

function getAmazonWithProductAnswer() {
  return `Perfecto. Si ya tienes producto o una idea bastante definida, entonces tu caso ya no está en la etapa de “qué quiero hacer”, sino en la de revisar si realmente tiene sentido llevar eso a Amazon.

Antes de avanzar más, normalmente conviene ver:
- si el producto tiene potencial real
- qué tan competido está
- si puede dejar margen razonable
- si conviene empujarlo tal como está o ajustar

Si quieres, cuéntame qué tipo de producto tienes en mente y te doy una orientación inicial más aterrizada.`;
}

function getAmazonProductValidationAnswer() {
  return `Sí, esa es exactamente una de las preguntas que conviene hacerse antes de avanzar.

Validar un producto para Amazon no es solo preguntarse si “se ve interesante” o si se vende en general. La clave es ver si tiene sentido dentro de Amazon y en qué condiciones tendría una entrada razonable.

Ahí normalmente se revisa:
- demanda real
- nivel de competencia
- margen después de costos y comisiones
- dificultad para entrar con ese producto

En resumen, no es solo “me gusta la idea”, sino “¿vale la pena empujarla por este canal?”.

Si quieres, dime qué producto tienes en mente y te doy una primera lectura más concreta.`;
}

function getAmazonCategoryInterestAnswer() {
  return `Sí puede haber potencial en esa categoría, pero en Amazon no conviene enamorarse de una categoría solo porque suena atractiva.

Dentro de una misma categoría puede haber productos con muy buena salida y otros que están demasiado competidos o mal estructurados para entrar.

Por eso, antes de avanzar, normalmente conviene mirar:
- demanda real
- nivel de competencia
- margen
- facilidad de entrada
- posibles restricciones según el tipo de producto

La categoría te da una dirección, pero la decisión real se toma producto por producto.

Si quieres, te ayudo a aterrizarlo mejor. ¿Ya tienes un producto específico en mente dentro de esa categoría o todavía estás explorando opciones?`;
}

function getAmazonImportToAmazonAnswer() {
  return `Sí, ese camino puede tener bastante sentido, pero conviene estructurarlo bien.

Si tu idea es importar desde China para vender en Amazon, no se trata solo de traer un producto y subirlo. Antes de eso normalmente hay que validar si ese producto realmente conviene para Amazon y no solo para comprarlo barato.

Ahí suelen entrar preguntas como:
- si el producto tiene demanda
- qué tan competido está
- cuánto margen deja después de logística, comisiones y otros costos
- si hay requisitos o restricciones según la categoría

Es un camino con potencial, pero mal planteado puede terminar siendo una mala compra con mucha facilidad.

Si quieres, te ayudo a ubicar mejor tu caso. ¿Ya tienes un producto específico en mente o todavía estás evaluando opciones?`;
}

function getAmazonViabilityQuestionAnswer() {
  return `Sí, esa es la clase de pregunta que conviene hacerse antes de avanzar de verdad.

Cuando alguien habla de viabilidad en Amazon, la conversación ya no va solo de producto, sino de si realmente vale la pena entrar por ese canal en esas condiciones.

Ahí suele revisarse:
- nivel de demanda
- competencia
- margen
- facilidad de entrada
- riesgo general de la idea

En otras palabras, la pregunta correcta ya no es solo “¿me gusta este producto?”, sino “¿tiene sentido venderlo en Amazon y con qué expectativas reales?”.

Si quieres, dime qué producto o categoría estás evaluando y te doy una orientación inicial.`;
}

function getAmazonNextStepAnswer(user) {
  if (user && user.subopcion === "producto") {
    return `Como ya vienes por la línea de producto definido, el siguiente paso lógico es revisar si ese producto realmente encaja bien para Amazon antes de asumir que ya está listo para moverse.

Ahí normalmente conviene revisar viabilidad, competencia y estructura.

Si quieres, cuéntame qué producto tienes en mente y te doy una orientación inicial. Y si prefieres verlo directo en reunión, también puedes agendar aquí:
${CALENDLY_LINK}`;
  }

  if (user && user.subopcion === "sin_producto") {
    return `Como todavía no tienes producto definido, el siguiente paso lógico es ordenar bien esa decisión antes de pensar en ejecutar.

En Amazon, elegir mal el producto suele costar más que tomarse un poco más de tiempo para decidir bien.

Si quieres, te ayudo a aterrizar eso mejor según si buscas marca propia, reventa o si todavía estás explorando.`;
  }

  if (user && user.subopcion === "guia") {
    return `Como tu caso va más por guía completa para comenzar, el siguiente paso lógico es estructurar bien el punto de partida para que no avances con piezas sueltas.

Eso normalmente implica ordenar etapa, producto, enfoque y forma de entrada.

Si quieres, te oriento aquí mismo o, si prefieres verlo con más calma, puedes agendar una reunión:
${CALENDLY_LINK}`;
  }

  return `El siguiente paso depende bastante de si ya tienes producto, si todavía no sabes qué vender o si lo que necesitas es una guía más completa para arrancar bien.

Si quieres, te ubico rápido aquí mismo. Y si prefieres verlo en llamada, puedes agendar aquí:
${CALENDLY_LINK}`;
}

function getAmazonScheduleAnswer() {
  return `Perfecto. Aquí puedes agendar una reunión para revisar tu caso:

${CALENDLY_LINK}

Si quieres, antes de eso también te puedo orientar un poco aquí para que llegues con más claridad a la llamada.`;
}

function getAmazonHelpOptionsAnswer() {
  return `En Amazon no estamos manejando aquí un esquema público de planes cerrados como en el Club.

Lo que sí hacemos es orientar según la etapa real en la que estés, por ejemplo:
- si ya tienes producto
- si todavía no sabes qué vender
- si necesitas guía para arrancar
- si quieres validar si una idea realmente sirve para Amazon

La lógica aquí no es meterte en una caja por capricho, sino ayudarte según tu punto real de partida.

Si quieres, dime en cuál de esos casos estás y te digo cuál sería la ayuda más lógica para ti.`;
}

function getAmazonGeneralFallbackAnswer() {
  return `Perfecto. En Amazon lo más importante primero es ubicar bien tu etapa, porque no es lo mismo entrar con producto definido que entrar todavía explorando.

Para orientarte mejor, dime cuál se parece más a tu caso:
1️⃣ Ya tengo producto
2️⃣ Todavía no sé qué vender
3️⃣ Necesito guía para empezar

Y si prefieres verlo directamente en llamada, aquí puedes agendar:
${CALENDLY_LINK}`;
}

function buildAmazonIntentResponse(intent, user) {
  if (intent === "amazon_info") return getAmazonInfoAnswer();
  if (intent === "amazon_price") return getAmazonPriceAnswer();
  if (intent === "amazon_start") return getAmazonStartAnswer();
  if (intent === "amazon_no_product") return getAmazonNoProductAnswer();
  if (intent === "amazon_with_product") return getAmazonWithProductAnswer();
  if (intent === "amazon_product_validation") {
    return getAmazonProductValidationAnswer();
  }
  if (intent === "amazon_category_interest") {
    return getAmazonCategoryInterestAnswer();
  }
  if (intent === "amazon_import_to_amazon") {
    return getAmazonImportToAmazonAnswer();
  }
  if (intent === "amazon_viability_question") {
    return getAmazonViabilityQuestionAnswer();
  }
  if (intent === "amazon_next_step") return getAmazonNextStepAnswer(user);
  if (intent === "amazon_schedule") return getAmazonScheduleAnswer();
  if (intent === "amazon_help_options") return getAmazonHelpOptionsAnswer();

  return null;
}

module.exports = {
  CALENDLY_LINK,
  isAmazonFreeTextIntent,
  buildAmazonIntentResponse,
  getAmazonGeneralFallbackAnswer
};