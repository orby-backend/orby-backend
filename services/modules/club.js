const CALENDLY_LINK = "https://calendly.com/oneorbix/30min";

function formatPlanDetails(plan) {
  return `${plan.nombre} (${plan.precio})

Este plan suele encajar muy bien con:
${plan.idealPara}

¿Qué incluye?
- ${plan.incluye.join("\n- ")}

¿Por qué suele ser una buena opción?
${plan.resumen}

${plan.link ? `Puedes ver la página del plan aquí:
${plan.link}

` : ""}${plan.payLink ? `Y si ya lo tienes claro, este es el enlace de pago directo:
${plan.payLink}

` : ""}Si quieres, también te lo comparo con otro plan para ayudarte a elegir con más seguridad.`;
}

function formatPlanPrice(plan) {
  return `${plan.nombre}

Precio:
${plan.precio}

¿Por qué puede tener sentido para ti?
${plan.resumen}

${plan.link ? `Primero puedes revisar el plan aquí:
${plan.link}

` : ""}${plan.payLink ? `Y si ya lo tienes claro, este es el enlace de pago directo:
${plan.payLink}

` : ""}Si quieres, también te resumo qué incluye o te ayudo a ver si este plan realmente encaja contigo.`;
}

function getPlanLinkAnswer(plan) {
  return `Claro. Aquí tienes la página del ${plan.nombre}:

${plan.link}

Si después quieres, también te paso el enlace de pago directo o te ayudo a confirmar si ese plan realmente encaja contigo.`;
}

function getPlanPaymentAnswer(plan) {
  return `Perfecto. Si ya estás pensando en avanzar con el ${plan.nombre}, aquí tienes primero la página del plan para revisarlo con calma:

${plan.link}

Y aquí está el enlace de pago directo:
${plan.payLink}

Si quieres, antes de pagar también te ayudo a confirmar si este plan es el más conveniente para tu etapa actual.`;
}

function recommendPlanForBeginner(memberships) {
  const plan = memberships.basico;

  return `Si estás empezando desde cero, lo más lógico suele ser arrancar con el ${plan.nombre}.

La razón es simple: te permite entrar al proceso con una inversión accesible, entender mejor cómo funciona todo y evitar varios errores comunes del inicio sin complicarte de más.

Te da una base muy útil para arrancar bien:
- ${plan.incluye.slice(0, 4).join("\n- ")}

Precio:
${plan.precio}

Puedes ver el plan aquí:
${plan.link}

Y si ya lo tienes claro, este es el enlace de pago:
${plan.payLink}

Si quieres, también te explico qué cambia exactamente entre el Básico y el Profesional.`;
}

function recommendPlanForExperienced(memberships) {
  const plan = memberships.profesional;

  return `Si ya has importado antes y ahora lo que buscas es más estructura, mejores herramientas y acompañamiento más útil, el ${plan.nombre} suele ser el punto más equilibrado.

En esta etapa ya no se trata de descubrir lo básico, sino de tomar mejores decisiones con más respaldo y con menos improvisación.

Te aporta bastante valor por cosas como:
- ${plan.incluye.slice(0, 4).join("\n- ")}

Precio:
${plan.precio}

Puedes ver el plan aquí:
${plan.link}

Y si ya quieres avanzar, este es el enlace de pago:
${plan.payLink}

Si quieres, también te explico cuándo sí tendría sentido pasar al Premium.`;
}

function recommendPlanForValidatedProduct(memberships) {
  const plan = memberships.profesional;

  return `Si ya validaste el producto, normalmente el ${plan.nombre} es la opción más conveniente.

En ese punto ya no necesitas solo una base inicial, sino herramientas, verificación y un acompañamiento más práctico para ejecutar mejor.

Te aporta bastante valor por cosas como:
- ${plan.incluye.slice(0, 4).join("\n- ")}

Precio:
${plan.precio}

Puedes ver el plan aquí:
${plan.link}

Y si ya lo tienes claro, este es el enlace de pago:
${plan.payLink}

Si quieres, también te explico cuándo sí tendría sentido subir al Premium.`;
}

function recommendPlanForPersonalUse(memberships) {
  const plan = memberships.basico;

  return `Si lo que buscas es importar para uso personal, normalmente el ${plan.nombre} es la opción más lógica.

Te permite entender el proceso, orientarte bien y tomar mejores decisiones sin irte a una membresía más robusta de la que realmente necesitas.

Precio:
${plan.precio}

Puedes ver el plan aquí:
${plan.link}

Y si ya lo tienes claro, este es el enlace de pago:
${plan.payLink}

Si luego tu idea cambia y pasas a importar para vender, ahí sí te puedo decir cuándo conviene pasar al Profesional.`;
}

function recommendPlanForScaling(memberships) {
  const plan = memberships.premium;

  return `Si tu objetivo es escalar, tener más acompañamiento y tomar decisiones con un nivel más alto de respaldo, la opción más fuerte es el ${plan.nombre}.

Ese plan tiene sentido cuando ya quieres algo más serio, más continuo y con apoyo más estratégico, no solo herramientas sueltas.

Precio:
${plan.precio}

Puedes ver el plan aquí:
${plan.link}

Y si ya quieres avanzar, este es el enlace de pago:
${plan.payLink}

Si quieres, también te comparo Premium vs Profesional para ver si realmente necesitas el nivel más alto o si con Profesional ya te basta por ahora.`;
}

function recommendPlanGeneral(memberships) {
  return `La mejor membresía no se elige por escoger la más completa, sino por la etapa en la que estás hoy.

${memberships.basico.nombre} — ${memberships.basico.precio}
Funciona muy bien si estás empezando, quieres entender el proceso con orden y prefieres entrar con una inversión más accesible.

${memberships.profesional.nombre} — ${memberships.profesional.precio}
Tiene más sentido si ya tienes una idea más definida, quieres más herramientas, verificación y un acompañamiento más práctico.

${memberships.premium.nombre} — ${memberships.premium.precio}
Es la opción más fuerte si buscas seguimiento más constante, apoyo más completo y un nivel más alto de respaldo.

Si me dices si estás empezando, si ya validaste producto o si ya has importado antes, te digo cuál te conviene más y por qué.`;
}

function compareMembershipPlans(memberships) {
  return `Claro. La diferencia entre los planes no está solo en “traer más cosas”, sino en el nivel de acompañamiento, herramientas y profundidad que necesitas según tu etapa.

${memberships.basico.nombre} — ${memberships.basico.precio}
Es la mejor puerta de entrada si estás empezando o si todavía quieres avanzar con una base clara y una inversión más accesible. Te ayuda a ordenar el proceso sin complicarte de más.

${memberships.profesional.nombre} — ${memberships.profesional.precio}
Aquí ya das un paso más serio. Tiene más sentido si ya tienes una idea mejor definida y quieres herramientas más prácticas, soporte más útil y más respaldo para ejecutar.

${memberships.premium.nombre} — ${memberships.premium.precio}
Es la opción más completa. Encaja mejor cuando buscas acompañamiento más constante, seguimiento más cercano y apoyo más fuerte en decisiones, proveedores, cotizaciones y ejecución.

La clave no es cuál trae más, sino cuál encaja mejor con lo que tú necesitas hoy.

Si quieres, ahora mismo te comparo Básico vs Profesional o Profesional vs Premium.`;
}

function compareBasicVsProfessional(memberships) {
  return `Te lo pongo claro y sin adornos.

${memberships.basico.nombre}
- Mejor si estás empezando desde cero
- Te ayuda a entrar con orden y con una inversión más accesible
- Sirve muy bien para entender el proceso, validar ideas y no empezar improvisando

${memberships.profesional.nombre}
- Tiene más sentido si ya quieres avanzar con más estructura
- Te da herramientas más prácticas para ejecutar mejor
- Ya incluye verificación de proveedor y soporte por WhatsApp, así que el acompañamiento se siente bastante más completo

En resumen:
Si quieres empezar bien, con bajo riesgo y una base clara, Básico.
Si ya estás más decidido y quieres más respaldo para moverte mejor, Profesional.

Si quieres, te digo cuál de los dos encaja mejor contigo según tu etapa actual.`;
}

function compareProfessionalVsPremium(memberships) {
  return `La diferencia real entre ${memberships.profesional.nombre} y ${memberships.premium.nombre} está en la intensidad del acompañamiento.

${memberships.profesional.nombre}
- Es una opción muy equilibrada
- Te da herramientas, soporte y estructura para avanzar con bastante respaldo
- Funciona muy bien si todavía no necesitas seguimiento tan cercano o tan continuo

${memberships.premium.nombre}
- Tiene sentido cuando buscas un nivel más alto de apoyo
- Incluye asesoría mensual personalizada
- Es mejor si quieres acompañamiento más constante, análisis más profundo y apoyo más fuerte en ejecución y decisiones importantes

En pocas palabras:
Profesional es muy buena opción si quieres avanzar con estructura y buen respaldo.
Premium es para quien quiere un acompañamiento más completo y sostenido.

Si me dices qué tanto apoyo necesitas realmente, te digo cuál encaja mejor contigo.`;
}

function getWhatsAppSupportAnswer(memberships) {
  return `Si para ti es importante tener soporte por WhatsApp, el plan que ya lo incluye es el ${memberships.profesional.nombre}. El ${memberships.premium.nombre} también lo contempla, pero con un nivel de acompañamiento más alto.

El ${memberships.basico.nombre}, en cambio, maneja soporte por correo.

Si quieres, te comparo rápidamente Básico vs Profesional para que veas cuál te conviene más.`;
}

function getSupplierVerificationAnswer(memberships) {
  return `La verificación de proveedor internacional ya está incluida en el ${memberships.profesional.nombre}.

Si además quieres un acompañamiento más sólido en análisis de cotizaciones, proveedores y parte logística, entonces el ${memberships.premium.nombre} te da un nivel más alto de respaldo.

Si quieres, te ayudo a ver cuál de los dos encaja mejor contigo.`;
}

function getMonthlyAdvisoryAnswer(memberships) {
  return `La asesoría mensual personalizada está incluida en el ${memberships.premium.nombre}.

Ese plan tiene más sentido cuando buscas un acompañamiento más constante, análisis más profundo y apoyo más completo durante el proceso.

Si quieres, también te explico qué cambia realmente entre el Profesional y el Premium, sin darte vueltas.`;
}

function getPriceObjectionAnswer(memberships) {
  return `Te entiendo, y esa duda es totalmente válida.

Aquí lo importante no es solo mirar el precio, sino cuánto apoyo necesitas para evitar errores, perder tiempo o tomar malas decisiones al importar.

Si lo que buscas es una entrada más accesible para empezar con una base clara, el ${memberships.basico.nombre} suele ser el punto lógico:
- Precio: ${memberships.basico.precio}
- Página del plan: ${memberships.basico.link}
- Enlace de pago: ${memberships.basico.payLink}

Si quieres, en lugar de soltarte opciones al azar, te digo cuál de los planes tiene más sentido para tu caso real.`;
}

function getValueQuestionAnswer() {
  return `Sí puede valer mucho la pena, pero depende de cómo piensas usarlo.

El valor de una membresía no está solo en “tener acceso”, sino en avanzar con más claridad, mejores herramientas, menos improvisación y menos riesgo al tomar decisiones.

Según el plan, puedes tener cosas como:
- asesoría inicial o personalizada
- herramientas para calcular costos
- verificación de proveedor
- soporte por WhatsApp
- análisis más profundo y acompañamiento más constante

Si alguien ya domina todo el proceso y no necesita respaldo, probablemente no necesite el mismo nivel de apoyo. Pero si quiere evitar errores y avanzar con más estructura, ahí sí la membresía aporta valor real.

Si quieres, te ayudo a ver cuál de los tres planes tendría más sentido para ti y por qué.`;
}

function getBuySignalAnswer(memberships) {
  return `Perfecto. Si ya quieres avanzar, aquí tienes las opciones más directas.

Ver los planes en la web:
- Básico: ${memberships.basico.link}
- Profesional: ${memberships.profesional.link}
- Premium: ${memberships.premium.link}

Ir directo al pago:
- Básico: ${memberships.basico.payLink}
- Profesional: ${memberships.profesional.payLink}
- Premium: ${memberships.premium.payLink}

Si todavía no tienes claro cuál elegir, también puedes agendar aquí:
${CALENDLY_LINK}

Y si prefieres, te digo primero cuál encaja mejor contigo antes de pagar.`;
}

function getScheduleCallAnswer() {
  return `Perfecto. Aquí tienes el enlace para agendar tu reunión:

${CALENDLY_LINK}

Si quieres, antes de agendar también te puedo orientar rápidamente sobre qué plan o servicio encaja mejor contigo para que llegues a la llamada con más claridad.`;
}

function getNotReadyYetAnswer() {
  return `No pasa nada. A veces lo más inteligente no es correr, sino entender bien antes de avanzar.

Cuando quieras, puedo ayudarte de dos formas:
- compararte los planes en corto
- decirte cuál tendría más sentido según tu etapa actual

Y si prefieres hablarlo con calma, también puedes agendar aquí:
${CALENDLY_LINK}`;
}

function detectPlanFromMessage(message = "", memberships) {
  const text = String(message)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (text.includes("premium")) {
    return memberships.premium;
  }

  if (text.includes("profesional") || text.includes("professional")) {
    return memberships.profesional;
  }

  if (text.includes("basico") || text.includes("básico")) {
    return memberships.basico;
  }

  return null;
}

function getSpecificBuySignalAnswer(message = "", memberships) {
  const detectedPlan = detectPlanFromMessage(message, memberships);

  if (detectedPlan) {
    return `Perfecto. Si ya quieres avanzar con el ${detectedPlan.nombre}, aquí tienes primero la página del plan para revisarlo:

${detectedPlan.link}

Y aquí está el enlace de pago directo:
${detectedPlan.payLink}

Si quieres, antes de pagar también te ayudo a confirmar si este plan es el más conveniente para tu etapa actual.`;
  }

  return getBuySignalAnswer(memberships);
}

function getClubLeadQualifiedReply() {
  return `Perfecto. Veo que el Club de Importadores puede encajar muy bien contigo.

Tenemos tres opciones según tu etapa:

🔹 Plan Básico
🔹 Plan Profesional
🔹 Plan Premium

1️⃣ Quiero recomendación
2️⃣ Quiero ver los planes`;
}

function getClubInfoGeneralReply(memberships) {
  return `Perfecto. El Club de Importadores es una membresía que te permite aprender, ejecutar y escalar tus importaciones con acompañamiento paso a paso.

Incluye herramientas, asesoría y acceso a oportunidades reales de negocio.

Estos son los planes disponibles:
- ${memberships.basico.nombre}: ${memberships.basico.link}
- ${memberships.profesional.nombre}: ${memberships.profesional.link}
- ${memberships.premium.nombre}: ${memberships.premium.link}

Si quieres, puedo hacer una de estas dos cosas:
1️⃣ Recomendarte cuál te conviene
2️⃣ Mostrarte los 3 planes con más detalle`;
}

function getClubShowPlansReply(memberships) {
  return `Perfecto. Aquí tienes las tres opciones del Club de Importadores OneOrbix, resumidas de forma clara para que las veas mejor.

🔹 ${memberships.basico.nombre} — ${memberships.basico.precio}
Suele encajar muy bien si estás empezando y quieres una base clara para avanzar con orden.
Incluye, entre otras cosas:
- ${memberships.basico.incluye.slice(0, 3).join("\n- ")}
Página: ${memberships.basico.link}
Pago: ${memberships.basico.payLink}

🔹 ${memberships.profesional.nombre} — ${memberships.profesional.precio}
Tiene más sentido si ya quieres más herramientas, más respaldo práctico y un acompañamiento más útil para ejecutar.
Incluye, entre otras cosas:
- ${memberships.profesional.incluye.slice(0, 4).join("\n- ")}
Página: ${memberships.profesional.link}
Pago: ${memberships.profesional.payLink}

🔹 ${memberships.premium.nombre} — ${memberships.premium.precio}
Es la opción más completa para quienes buscan apoyo más constante, asesoría mensual y un acompañamiento más sólido.
Incluye, entre otras cosas:
- ${memberships.premium.incluye.slice(0, 4).join("\n- ")}
Página: ${memberships.premium.link}
Pago: ${memberships.premium.payLink}

Si quieres, ahora mismo puedo hacer una de estas dos cosas:
1️⃣ Recomendarte cuál te conviene según tu etapa
2️⃣ Compararte dos planes para que elijas con más seguridad`;
}

function getClubRecommendedReply(user, memberships) {
  if (user?.subopcion === "cero") {
    return recommendPlanForBeginner(memberships);
  }

  if (user?.subopcion === "idea_producto") {
    return recommendPlanForValidatedProduct(memberships);
  }

  if (user?.subopcion === "ya_importo") {
    return recommendPlanForExperienced(memberships);
  }

  return recommendPlanGeneral(memberships);
}

function isClubHybridIntent(detectedIntent) {
  return [
    "show_plans",
    "payment_help",
    "basic_plan_details",
    "professional_plan_details",
    "premium_plan_details",
    "basic_plan_price",
    "professional_plan_price",
    "premium_plan_price",
    "basic_plan_link",
    "professional_plan_link",
    "premium_plan_link",
    "basic_plan_payment",
    "professional_plan_payment",
    "premium_plan_payment",
    "beginner_recommendation",
    "experienced_recommendation",
    "validated_product_recommendation",
    "personal_use_recommendation",
    "scaling_recommendation",
    "compare_plans",
    "basic_vs_professional",
    "professional_vs_premium",
    "whatsapp_support_plan",
    "supplier_verification_plan",
    "monthly_advisory_plan",
    "recommend_plan",
    "price_objection",
    "value_question",
    "buy_signal",
    "schedule_call",
    "not_ready_yet"
  ].includes(detectedIntent);
}

function buildClubHybridResponse({
  user,
  cleanMessage,
  message,
  detectedIntent,
  memberships
}) {
  const normalized = String(cleanMessage || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/amazon/.test(normalized)) {
    return `Perfecto. El Club también puede servirte si tu objetivo es vender en Amazon, sobre todo para ayudarte a ordenar mejor el punto de partida, entender costos, validar producto y tomar mejores decisiones antes de avanzar.

Si estás empezando desde cero, normalmente lo más lógico suele ser arrancar con el ${memberships.basico.nombre}.

Precio:
${memberships.basico.precio}

Puedes ver el plan aquí:
${memberships.basico.link}

Y si ya lo tienes claro, este es el enlace de pago:
${memberships.basico.payLink}

Si quieres, también te explico cuándo conviene subir al Profesional.`;
  }

  if (/uso personal/.test(normalized)) {
    return recommendPlanForPersonalUse(memberships);
  }

  if (
    /explorando ideas|explorar|todavia no se|todavia no se que importar|aun no se|aun no se que importar/.test(
      normalized
    )
  ) {
    return recommendPlanForBeginner(memberships);
  }

  if (/ya importe|tengo experiencia|he importado antes|ya he importado/.test(normalized)) {
    return recommendPlanForExperienced(memberships);
  }

  if (/validar producto|validacion|validar idea|quiero validar/.test(normalized)) {
    return recommendPlanForValidatedProduct(memberships);
  }

  if (detectedIntent === "show_plans") {
    return getClubShowPlansReply(memberships);
  }

  if (detectedIntent === "payment_help") {
    return getBuySignalAnswer(memberships);
  }

  if (detectedIntent === "basic_plan_details") {
    return formatPlanDetails(memberships.basico);
  }

  if (detectedIntent === "professional_plan_details") {
    return formatPlanDetails(memberships.profesional);
  }

  if (detectedIntent === "premium_plan_details") {
    return formatPlanDetails(memberships.premium);
  }

  if (detectedIntent === "basic_plan_price") {
    return formatPlanPrice(memberships.basico);
  }

  if (detectedIntent === "professional_plan_price") {
    return formatPlanPrice(memberships.profesional);
  }

  if (detectedIntent === "premium_plan_price") {
    return formatPlanPrice(memberships.premium);
  }

  if (detectedIntent === "basic_plan_link") {
    return getPlanLinkAnswer(memberships.basico);
  }

  if (detectedIntent === "professional_plan_link") {
    return getPlanLinkAnswer(memberships.profesional);
  }

  if (detectedIntent === "premium_plan_link") {
    return getPlanLinkAnswer(memberships.premium);
  }

  if (detectedIntent === "basic_plan_payment") {
    return getPlanPaymentAnswer(memberships.basico);
  }

  if (detectedIntent === "professional_plan_payment") {
    return getPlanPaymentAnswer(memberships.profesional);
  }

  if (detectedIntent === "premium_plan_payment") {
    return getPlanPaymentAnswer(memberships.premium);
  }

  if (detectedIntent === "beginner_recommendation") {
    return recommendPlanForBeginner(memberships);
  }

  if (detectedIntent === "experienced_recommendation") {
    return recommendPlanForExperienced(memberships);
  }

  if (detectedIntent === "validated_product_recommendation") {
    return recommendPlanForValidatedProduct(memberships);
  }

  if (detectedIntent === "personal_use_recommendation") {
    return recommendPlanForPersonalUse(memberships);
  }

  if (detectedIntent === "scaling_recommendation") {
    return recommendPlanForScaling(memberships);
  }

  if (detectedIntent === "compare_plans") {
    return compareMembershipPlans(memberships);
  }

  if (detectedIntent === "basic_vs_professional") {
    return compareBasicVsProfessional(memberships);
  }

  if (detectedIntent === "professional_vs_premium") {
    return compareProfessionalVsPremium(memberships);
  }

  if (detectedIntent === "whatsapp_support_plan") {
    return getWhatsAppSupportAnswer(memberships);
  }

  if (detectedIntent === "supplier_verification_plan") {
    return getSupplierVerificationAnswer(memberships);
  }

  if (detectedIntent === "monthly_advisory_plan") {
    return getMonthlyAdvisoryAnswer(memberships);
  }

  if (detectedIntent === "recommend_plan") {
    return getClubRecommendedReply(user, memberships);
  }

  if (detectedIntent === "price_objection") {
    return getPriceObjectionAnswer(memberships);
  }

  if (detectedIntent === "value_question") {
    return getValueQuestionAnswer();
  }

  if (detectedIntent === "buy_signal") {
    return getSpecificBuySignalAnswer(message, memberships);
  }

  if (detectedIntent === "schedule_call") {
    return getScheduleCallAnswer();
  }

  if (detectedIntent === "not_ready_yet") {
    return getNotReadyYetAnswer();
  }

  if (cleanMessage === "1") {
    return getClubRecommendedReply(user, memberships);
  }

  if (cleanMessage === "2") {
    return getClubShowPlansReply(memberships);
  }

  return null;
}

module.exports = {
  CALENDLY_LINK,
  formatPlanDetails,
  formatPlanPrice,
  getPlanLinkAnswer,
  getPlanPaymentAnswer,
  recommendPlanForBeginner,
  recommendPlanForExperienced,
  recommendPlanForValidatedProduct,
  recommendPlanForPersonalUse,
  recommendPlanForScaling,
  recommendPlanGeneral,
  compareMembershipPlans,
  compareBasicVsProfessional,
  compareProfessionalVsPremium,
  getWhatsAppSupportAnswer,
  getSupplierVerificationAnswer,
  getMonthlyAdvisoryAnswer,
  getPriceObjectionAnswer,
  getValueQuestionAnswer,
  getBuySignalAnswer,
  getScheduleCallAnswer,
  getNotReadyYetAnswer,
  detectPlanFromMessage,
  getSpecificBuySignalAnswer,
  getClubLeadQualifiedReply,
  getClubInfoGeneralReply,
  getClubShowPlansReply,
  getClubRecommendedReply,
  isClubHybridIntent,
  buildClubHybridResponse
};