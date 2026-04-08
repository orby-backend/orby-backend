const { includesAny, detectPlan } = require("./utils");

function detectClubIntent(text = "") {
  const plan = detectPlan(text);

  // =========================
  // CLUB - LINKS GENERALES / VER PLANES
  // =========================

  if (
    includesAny(text, [
      "quiero ver los planes",
      "quiero ver las membresias",
      "quiero ver las membresías",
      "pasame los planes",
      "pásame los planes",
      "pasame el link de los planes",
      "pásame el link de los planes",
      "enviame el link de los planes",
      "envíame el link de los planes",
      "pasame el link de las membresias",
      "pásame el link de las membresías",
      "enviame el link de las membresias",
      "envíame el link de las membresías",
      "mandame el link de los planes",
      "mándame el link de los planes",
      "quiero ver los planes en la web",
      "quiero ver las membresias en la web",
      "quiero ver las membresías en la web",
      "link de los planes",
      "link de las membresias",
      "link de las membresías",
      "enlace de los planes",
      "enlace de las membresias",
      "enlace de las membresías",
      "pagina de los planes",
      "pagina de las membresias",
      "pagina de las membresías",
      "web de los planes",
      "web de las membresias",
      "web de las membresías",
      "mandame los links de las membresias",
      "mándame los links de las membresías",
      "pasame los links de las membresias",
      "pásame los links de las membresías",
      "que planes hay",
      "qué planes hay",
      "que planes manejan",
      "qué planes manejan",
      "que planes ofrecen",
      "qué planes ofrecen",
      "que membresias hay",
      "qué membresías hay",
      "que membresias manejan",
      "qué membresías manejan",
      "que opciones hay",
      "qué opciones hay",
      "que opciones tienen en el club",
      "qué opciones tienen en el club",
      "que opciones de membresia hay",
      "qué opciones de membresía hay",
      "que opciones de planes hay",
      "qué opciones de planes hay",
      "planes disponibles",
      "cuales son los planes",
      "cuáles son los planes",
      "cuales son las membresias",
      "cuáles son las membresías",
      "que planes tienen",
      "qué planes tienen",
      "que membresias tienen",
      "qué membresías tienen",
      "ver los planes",
      "ver planes",
      "mostrar planes",
      "mostrame los planes",
      "muestrame los planes",
      "muéstrame los planes",
      "quiero conocer los planes",
      "quiero ver opciones del club"
    ])
  ) {
    return "show_plans";
  }

  // =========================
  // CLUB - AYUDA GENERAL PARA PAGAR
  // =========================

  if (
    includesAny(text, [
      "como puedo pagar",
      "cómo puedo pagar",
      "como pago",
      "cómo pago",
      "ayudame a pagar",
      "ayúdame a pagar",
      "me ayudas con el link para pagar",
      "me ayudas con el enlace para pagar",
      "pasame el link de pago",
      "pásame el link de pago",
      "enviame el link de pago",
      "envíame el link de pago",
      "mandame el link de pago",
      "mándame el link de pago",
      "quiero el link de pago",
      "necesito el link de pago",
      "como puedo comprar",
      "cómo puedo comprar",
      "quiero pagar una membresia",
      "quiero pagar una membresía",
      "quiero comprar una membresia",
      "quiero comprar una membresía",
      "ayudame con el pago",
      "ayúdame con el pago",
      "link para pagar",
      "enlace para pagar",
      "como hago el pago",
      "cómo hago el pago",
      "como puedo hacer el pago",
      "cómo puedo hacer el pago",
      "donde pago",
      "dónde pago",
      "ayudame con el link de pago",
      "ayúdame con el link de pago"
    ])
  ) {
    return "payment_help";
  }

  // =========================
  // CLUB - LINKS DE PLANES
  // =========================

  if (
    includesAny(text, [
      "link del plan basico",
      "link de la membresia basica",
      "link de la mebresia basica",
      "enlace del plan basico",
      "url del plan basico",
      "pasame el link del plan basico",
      "pasame el link de la membresia basica",
      "tienes el link del plan basico",
      "tienes el link de la membresia basica",
      "tienes el link de la mebresia basica",
      "dame el link del plan basico",
      "dame el link de la membresia basica",
      "link plan basico",
      "enlace plan basico",
      "ver plan basico",
      "pagina del plan basico",
      "pagina plan basico"
    ])
  ) {
    return "basic_plan_link";
  }

  if (
    includesAny(text, [
      "link del plan profesional",
      "link del plan professional",
      "link de la membresia profesional",
      "link de la membresia professional",
      "link de la mebresia profesional",
      "link de la mebresia professional",
      "enlace del plan profesional",
      "enlace del plan professional",
      "url del plan profesional",
      "url del plan professional",
      "pasame el link del plan profesional",
      "pasame el link del plan professional",
      "pasame el link de la membresia profesional",
      "pasame el link de la membresia professional",
      "tienes el link del plan profesional",
      "tienes el link del plan professional",
      "tienes el link de la membresia profesional",
      "tienes el link de la membresia professional",
      "tienes el link de la mebresia profesional",
      "tienes el link de la mebresia professional",
      "dame el link del plan profesional",
      "dame el link del plan professional",
      "dame el link de la membresia profesional",
      "dame el link de la membresia professional",
      "link plan profesional",
      "link plan professional",
      "enlace plan profesional",
      "enlace plan professional",
      "ver plan profesional",
      "ver plan professional",
      "pagina del plan profesional",
      "pagina del plan professional",
      "pagina plan profesional",
      "pagina plan professional"
    ])
  ) {
    return "professional_plan_link";
  }

  if (
    includesAny(text, [
      "link del plan premium",
      "link de la membresia premium",
      "link de la mebresia premium",
      "enlace del plan premium",
      "url del plan premium",
      "pasame el link del plan premium",
      "pasame el link de la membresia premium",
      "tienes el link del plan premium",
      "tienes el link de la membresia premium",
      "tienes el link de la mebresia premium",
      "dame el link del plan premium",
      "dame el link de la membresia premium",
      "link plan premium",
      "enlace plan premium",
      "ver plan premium",
      "pagina del plan premium",
      "pagina plan premium"
    ])
  ) {
    return "premium_plan_link";
  }

  // =========================
  // CLUB - LINKS DE PAGO ESPECÍFICOS
  // =========================

  if (
    includesAny(text, [
      "link de pago del plan basico",
      "link de pago de la membresia basica",
      "link de pago de la mebresia basica",
      "quiero pagar el plan basico",
      "quiero pagar la membresia basica",
      "pagar plan basico",
      "pagar membresia basica",
      "comprar plan basico",
      "comprar membresia basica",
      "quiero comprar el plan basico",
      "quiero comprar la membresia basica",
      "como compro la membresia basica",
      "como compro la mebresia basica",
      "como compro el plan basico"
    ])
  ) {
    return "basic_plan_payment";
  }

  if (
    includesAny(text, [
      "link de pago del plan profesional",
      "link de pago del plan professional",
      "link de pago de la membresia profesional",
      "link de pago de la membresia professional",
      "link de pago de la mebresia profesional",
      "quiero pagar el plan profesional",
      "quiero pagar el plan professional",
      "quiero pagar la membresia profesional",
      "quiero pagar la membresia professional",
      "pagar plan profesional",
      "pagar plan professional",
      "pagar membresia profesional",
      "pagar membresia professional",
      "comprar plan profesional",
      "comprar plan professional",
      "comprar membresia profesional",
      "comprar membresia professional",
      "quiero comprar el plan profesional",
      "quiero comprar el plan professional",
      "quiero comprar la membresia profesional",
      "quiero comprar la membresia professional",
      "como compro la membresia profesional",
      "como compro la membresia professional",
      "como compro el plan profesional",
      "como compro el plan professional"
    ])
  ) {
    return "professional_plan_payment";
  }

  if (
    includesAny(text, [
      "link de pago del plan premium",
      "link de pago de la membresia premium",
      "link de pago de la mebresia premium",
      "quiero pagar el plan premium",
      "quiero pagar la membresia premium",
      "pagar plan premium",
      "pagar membresia premium",
      "comprar plan premium",
      "comprar membresia premium",
      "quiero comprar el plan premium",
      "quiero comprar la membresia premium",
      "como compro la membresia premium",
      "como compro la mebresia premium",
      "como compro el plan premium"
    ])
  ) {
    return "premium_plan_payment";
  }

  // =========================
  // CLUB - DETALLES / INFO / EXPLICACIÓN POR PLAN
  // =========================

  if (
    plan === "basico" &&
    includesAny(text, [
      "que incluye",
      "que trae",
      "detalles",
      "informacion",
      "info",
      "mas info",
      "dame mas info",
      "dame info",
      "explicame",
      "explicame en que consiste",
      "en que consiste",
      "puedes explicarme",
      "quiero mas info",
      "beneficios"
    ]) &&
    !includesAny(text, [
      "precio",
      "costo",
      "valor",
      "link",
      "enlace",
      "pago",
      "comprar"
    ])
  ) {
    return "basic_plan_details";
  }

  if (
    plan === "profesional" &&
    includesAny(text, [
      "que incluye",
      "que trae",
      "detalles",
      "informacion",
      "info",
      "mas info",
      "dame mas info",
      "dame info",
      "explicame",
      "explicame en que consiste",
      "en que consiste",
      "puedes explicarme",
      "quiero mas info",
      "beneficios"
    ]) &&
    !includesAny(text, [
      "precio",
      "costo",
      "valor",
      "link",
      "enlace",
      "pago",
      "comprar"
    ])
  ) {
    return "professional_plan_details";
  }

  if (
    plan === "premium" &&
    includesAny(text, [
      "que incluye",
      "que trae",
      "detalles",
      "informacion",
      "info",
      "mas info",
      "dame mas info",
      "dame info",
      "explicame",
      "explicame en que consiste",
      "en que consiste",
      "puedes explicarme",
      "quiero mas info",
      "beneficios"
    ]) &&
    !includesAny(text, [
      "precio",
      "costo",
      "valor",
      "link",
      "enlace",
      "pago",
      "comprar"
    ])
  ) {
    return "premium_plan_details";
  }

  // =========================
  // CLUB - DETALLES LEGACY
  // =========================

  if (
    includesAny(text, [
      "que incluye el plan basico",
      "que incluye plan basico",
      "que incluye la membresia basica",
      "que incluye la mebresia basica",
      "que trae el plan basico",
      "que trae plan basico",
      "detalles del plan basico",
      "dame detalles del plan basico",
      "informacion del plan basico",
      "info del plan basico",
      "beneficios del plan basico",
      "plan basico"
    ]) &&
    !includesAny(text, ["link", "enlace", "comprar", "precio", "costo", "pago"])
  ) {
    return "basic_plan_details";
  }

  if (
    includesAny(text, [
      "que incluye el plan profesional",
      "que incluye plan profesional",
      "que incluye el plan professional",
      "que incluye plan professional",
      "que incluye la membresia profesional",
      "que incluye la membresia professional",
      "que trae el plan profesional",
      "que trae plan profesional",
      "que trae el plan professional",
      "detalles del plan profesional",
      "detalles del plan professional",
      "dame detalles del plan profesional",
      "informacion del plan profesional",
      "info del plan profesional",
      "beneficios del plan profesional",
      "plan profesional",
      "plan professional"
    ]) &&
    !includesAny(text, ["precio", "costo", "pago", "link", "enlace", "comprar"])
  ) {
    return "professional_plan_details";
  }

  if (
    includesAny(text, [
      "que incluye el plan premium",
      "que incluye plan premium",
      "que incluye la membresia premium",
      "que trae el plan premium",
      "que trae plan premium",
      "detalles del plan premium",
      "dame detalles del plan premium",
      "informacion del plan premium",
      "info del plan premium",
      "beneficios del plan premium",
      "plan premium"
    ]) &&
    !includesAny(text, ["precio", "costo", "pago", "link", "enlace", "comprar"])
  ) {
    return "premium_plan_details";
  }

  // =========================
  // CLUB - PRECIOS / COSTOS POR PLAN
  // =========================

  if (
    plan === "basico" &&
    includesAny(text, ["precio", "costo", "cuanto cuesta", "cuanto vale", "valor"])
  ) {
    return "basic_plan_price";
  }

  if (
    plan === "profesional" &&
    includesAny(text, ["precio", "costo", "cuanto cuesta", "cuanto vale", "valor"])
  ) {
    return "professional_plan_price";
  }

  if (
    plan === "premium" &&
    includesAny(text, ["precio", "costo", "cuanto cuesta", "cuanto vale", "valor"])
  ) {
    return "premium_plan_price";
  }

  // =========================
  // CLUB - PRECIOS LEGACY
  // =========================

  if (
    includesAny(text, [
      "precio del plan basico",
      "costo del plan basico",
      "cuanto cuesta el plan basico",
      "valor del plan basico",
      "precio de la membresia basica",
      "costo de la membresia basica"
    ])
  ) {
    return "basic_plan_price";
  }

  if (
    includesAny(text, [
      "precio del plan profesional",
      "precio del plan professional",
      "costo del plan profesional",
      "costo del plan professional",
      "cuanto cuesta el plan profesional",
      "cuanto cuesta el plan professional",
      "valor del plan profesional",
      "precio de la membresia profesional",
      "precio de la membresia professional",
      "costo de la membresia profesional",
      "costo de la membresia professional"
    ])
  ) {
    return "professional_plan_price";
  }

  if (
    includesAny(text, [
      "precio del plan premium",
      "costo del plan premium",
      "cuanto cuesta el plan premium",
      "valor del plan premium",
      "precio de la membresia premium",
      "costo de la membresia premium"
    ])
  ) {
    return "premium_plan_price";
  }

  // =========================
  // CLUB - BENEFICIOS ESPECÍFICOS
  // =========================

  if (
    includesAny(text, [
      "cual tiene whatsapp",
      "cual incluye whatsapp",
      "que plan incluye whatsapp",
      "soporte por whatsapp",
      "cual tiene soporte por whatsapp"
    ])
  ) {
    return "whatsapp_support_plan";
  }

  if (
    includesAny(text, [
      "cual incluye verificacion de proveedor",
      "que plan incluye verificacion de proveedor",
      "que plan verifica proveedor",
      "verificacion de proveedor"
    ])
  ) {
    return "supplier_verification_plan";
  }

  if (
    includesAny(text, [
      "cual incluye asesoria mensual",
      "que plan incluye asesoria mensual",
      "asesoria mensual",
      "cual tiene asesoria mensual"
    ])
  ) {
    return "monthly_advisory_plan";
  }

  // =========================
  // CLUB - RECOMENDACIONES SEGÚN PERFIL
  // =========================

  if (
    includesAny(text, [
      "ya he importado antes",
      "ya importe antes",
      "ya tengo experiencia importando",
      "ya importo pero quiero mejorar",
      "ya tengo experiencia"
    ])
  ) {
    return "experienced_recommendation";
  }

  if (
    includesAny(text, [
      "quiero empezar desde cero",
      "quiero comenzar desde cero",
      "estoy empezando desde cero",
      "soy principiante",
      "estoy empezando",
      "no he importado antes",
      "nunca he importado",
      "quiero iniciar desde cero",
      "quiero arrancar desde cero"
    ])
  ) {
    return "beginner_recommendation";
  }

  if (
    includesAny(text, [
      "ya valide el producto",
      "ya validé el producto",
      "tengo el producto validado",
      "ya tengo producto validado",
      "ya se que producto quiero",
      "ya sé que producto quiero",
      "ya se cual producto quiero",
      "ya sé cuál producto quiero"
    ])
  ) {
    return "validated_product_recommendation";
  }

  if (
    includesAny(text, [
      "quiero importar para uso personal",
      "es para uso personal",
      "solo para mi",
      "solo para mí",
      "quiero importar para mi"
    ])
  ) {
    return "personal_use_recommendation";
  }

  if (
    includesAny(text, [
      "quiero escalar",
      "quiero crecer mas",
      "quiero crecer más",
      "quiero mejorar mi estructura",
      "quiero mas acompanamiento",
      "quiero más acompañamiento",
      "quiero algo mas completo",
      "quiero algo más completo"
    ])
  ) {
    return "scaling_recommendation";
  }

  // =========================
  // CLUB - COMPARACIONES
  // =========================

  if (
    includesAny(text, [
      "comparar planes",
      "comparame los planes",
      "compárame los planes",
      "comparacion de planes",
      "comparación de planes",
      "diferencia entre planes",
      "diferencias entre planes",
      "diferencia entre los planes",
      "diferencias entre los planes",
      "diferencia entre membresias",
      "diferencias entre membresias",
      "diferencia entre las membresias",
      "diferencias entre las membresias",
      "que cambia entre planes",
      "qué cambia entre planes",
      "que cambia entre los planes",
      "qué cambia entre los planes",
      "cual es la diferencia entre planes",
      "cuál es la diferencia entre planes",
      "cual es la diferencia entre los planes",
      "cuál es la diferencia entre los planes",
      "cual es la diferencia entre las membresias",
      "cuál es la diferencia entre las membresías",
      "explicame las diferencias",
      "explícame las diferencias",
      "explicame cuales son las diferencias",
      "explícame cuáles son las diferencias",
      "quiero entender las diferencias",
      "quiero entender que cambia",
      "quiero entender qué cambia",
      "que diferencia hay entre un plan y otro",
      "qué diferencia hay entre un plan y otro",
      "que cambia de un plan a otro",
      "qué cambia de un plan a otro",
      "que trae cada plan",
      "qué trae cada plan",
      "que incluye cada plan",
      "qué incluye cada plan",
      "cual plan es mejor",
      "cuál plan es mejor",
      "que plan cambia"
    ])
  ) {
    return "compare_plans";
  }

  if (
    includesAny(text, [
      "diferencia entre el basico y el profesional",
      "diferencia entre el basico y el professional",
      "diferencias entre basico y profesional",
      "diferencias entre basico y professional",
      "que cambia entre basico y profesional",
      "qué cambia entre básico y profesional",
      "basico vs profesional",
      "basico vs professional",
      "plan basico o profesional",
      "plan basico o professional",
      "cual conviene basico o profesional",
      "cuál conviene básico o profesional",
      "cual conviene basico o professional",
      "basico o profesional",
      "basico o professional"
    ])
  ) {
    return "basic_vs_professional";
  }

  if (
    includesAny(text, [
      "diferencia entre el profesional y el premium",
      "diferencia entre el professional y el premium",
      "diferencias entre profesional y premium",
      "diferencias entre professional y premium",
      "que cambia entre profesional y premium",
      "qué cambia entre profesional y premium",
      "profesional vs premium",
      "professional vs premium",
      "plan profesional o premium",
      "plan professional o premium",
      "cual conviene profesional o premium",
      "cuál conviene profesional o premium",
      "cual conviene professional o premium",
      "profesional o premium",
      "professional o premium"
    ])
  ) {
    return "professional_vs_premium";
  }

  // =========================
  // CLUB - RECOMENDACIÓN GENERAL
  // =========================

  if (
    includesAny(text, [
      "que plan me conviene",
      "qué plan me conviene",
      "cual plan me conviene",
      "cuál plan me conviene",
      "que me recomiendas",
      "qué me recomiendas",
      "cual me recomiendas",
      "cuál me recomiendas",
      "que plan me recomiendas",
      "qué plan me recomiendas",
      "cual plan me recomiendas",
      "cuál plan me recomiendas",
      "que membresia me conviene",
      "qué membresía me conviene",
      "cual membresia me conviene",
      "cuál membresía me conviene",
      "que membresia me recomiendas",
      "qué membresía me recomiendas",
      "cual membresia me recomiendas",
      "cuál membresía me recomiendas",
      "cual me conviene",
      "cuál me conviene",
      "que conviene mas",
      "qué conviene más",
      "que me conviene mas",
      "qué me conviene más",
      "cual deberia elegir",
      "cuál debería elegir",
      "ayudame a elegir",
      "ayúdame a elegir"
    ])
  ) {
    return "recommend_plan";
  }

  // =========================
  // CLUB - OBJECIONES / VALOR
  // =========================

  if (
    includesAny(text, [
      "esta caro",
      "está caro",
      "muy caro",
      "se me hace caro",
      "es mucho dinero",
      "no quiero gastar tanto",
      "hay algo mas barato",
      "hay algo más barato",
      "cual es el mas economico",
      "cual es el más economico",
      "cual es el más económico"
    ])
  ) {
    return "price_objection";
  }

  if (
    includesAny(text, [
      "vale la pena",
      "por que cuesta eso",
      "por qué cuesta eso",
      "por que pagaria una membresia",
      "por qué pagaria una membresia",
      "por qué pagaría una membresía",
      "que gano pagando",
      "que beneficio tiene pagar",
      "por que no hacerlo solo",
      "por qué no hacerlo solo"
    ])
  ) {
    return "value_question";
  }

  // =========================
  // CLUB - SEÑALES DE COMPRA / CIERRE
  // =========================

  if (
    includesAny(text, [
      "quiero comprar",
      "quiero unirme",
      "quiero inscribirme",
      "quiero entrar al club",
      "quiero pagar",
      "quiero avanzar",
      "como me uno",
      "cómo me uno",
      "como compro",
      "cómo compro"
    ])
  ) {
    return "buy_signal";
  }

  if (
    includesAny(text, [
      "quiero agendar",
      "agendar reunion",
      "agendar reunión",
      "quiero una reunion",
      "quiero una reunión",
      "quiero hablar con alguien",
      "quiero una llamada",
      "quiero coordinar una llamada"
    ])
  ) {
    return "schedule_call";
  }

  if (
    includesAny(text, [
      "todavia no",
      "todavía no",
      "lo voy a pensar",
      "dejame pensarlo",
      "déjame pensarlo",
      "mas adelante",
      "más adelante",
      "solo estoy viendo",
      "solo estoy evaluando"
    ])
  ) {
    return "not_ready_yet";
  }

  return null;
}

module.exports = { detectClubIntent };