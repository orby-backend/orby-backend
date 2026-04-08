const { includesAny } = require("./utils");

function detectAsesoriaIntent(text = "") {
  // =========================
  // ASESORÍA - INFORMACIÓN GENERAL
  // =========================

  if (
    includesAny(text, [
      "informacion de asesoria",
      "informacion sobre asesoria",
      "informacion de asesoria personalizada",
      "informacion sobre asesoria personalizada",
      "quiero informacion de asesoria",
      "quiero informacion sobre asesoria",
      "quiero informacion de asesoria personalizada",
      "quiero informacion sobre asesoria personalizada",
      "info de asesoria",
      "info sobre asesoria",
      "info de asesoria personalizada",
      "explicame asesoria",
      "explícame asesoría",
      "explicame asesoria personalizada",
      "explícame asesoría personalizada",
      "como funciona la asesoria",
      "cómo funciona la asesoría",
      "como funciona la asesoria personalizada",
      "cómo funciona la asesoría personalizada",
      "que incluye la asesoria",
      "qué incluye la asesoría",
      "que incluye la asesoria personalizada",
      "qué incluye la asesoría personalizada",
      "como me ayudan con asesoria",
      "cómo me ayudan con asesoría",
      "en que me ayudan con asesoria",
      "en qué me ayudan con asesoría"
    ])
  ) {
    return "asesoria_info";
  }

  // =========================
  // ASESORÍA - COMERCIO / IMPORTAR / EXPORTAR
  // =========================

  if (
    includesAny(text, [
      "necesito ayuda para importar",
      "necesito ayuda para exportar",
      "necesito asesoria para importar",
      "necesito asesoría para importar",
      "necesito asesoria para exportar",
      "necesito asesoría para exportar",
      "quiero asesoria para importar",
      "quiero asesoría para importar",
      "quiero asesoria para exportar",
      "quiero asesoría para exportar",
      "quiero ayuda con comercio exterior",
      "necesito ayuda con comercio exterior",
      "asesoria en comercio exterior",
      "asesoría en comercio exterior",
      "quiero ayuda para comercio exterior"
    ])
  ) {
    return "asesoria_trade";
  }

  // =========================
  // ASESORÍA - NEGOCIO / ESTRUCTURA
  // =========================

  if (
    includesAny(text, [
      "quiero estructurar mi negocio",
      "necesito estructurar mi negocio",
      "quiero ordenar mi negocio",
      "necesito ordenar mi negocio",
      "quiero estructurar un ecommerce",
      "quiero estructurar amazon",
      "quiero estructurar mi proyecto",
      "necesito estructura para mi negocio",
      "quiero una asesoria para mi negocio",
      "quiero una asesoría para mi negocio",
      "asesoria para estructurar negocio",
      "asesoría para estructurar negocio",
      "quiero ayuda para definir modelo de negocio",
      "necesito ayuda para definir mi negocio"
    ])
  ) {
    return "asesoria_business";
  }

  // =========================
  // ASESORÍA - ESCALAR / OPTIMIZAR
  // =========================

  if (
    includesAny(text, [
      "quiero escalar mi negocio",
      "necesito escalar mi negocio",
      "quiero optimizar mi negocio",
      "necesito optimizar mi negocio",
      "quiero mejorar mi estructura comercial",
      "quiero crecer con mi negocio",
      "quiero hacer crecer mi negocio",
      "quiero mejorar resultados de mi negocio",
      "necesito ayuda para escalar",
      "necesito ayuda para optimizar",
      "asesoria para escalar negocio",
      "asesoría para escalar negocio",
      "asesoria para optimizar negocio",
      "asesoría para optimizar negocio"
    ])
  ) {
    return "asesoria_scale";
  }

  // =========================
  // ASESORÍA - CONSULTA PUNTUAL
  // =========================

  if (
    includesAny(text, [
      "tengo una consulta puntual",
      "quiero hacer una consulta puntual",
      "solo tengo una consulta",
      "solo tengo una duda puntual",
      "quiero resolver una duda puntual",
      "necesito orientacion para una decision",
      "necesito orientación para una decisión",
      "quiero ayuda para tomar una decision",
      "quiero ayuda para tomar una decisión",
      "tengo una duda de negocio",
      "tengo una duda comercial",
      "quiero una asesoria puntual",
      "quiero una asesoría puntual"
    ])
  ) {
    return "asesoria_specific_question";
  }

  // =========================
  // ASESORÍA - YA TIENE IDEA CLARA
  // =========================

  if (
    includesAny(text, [
      "ya tengo una idea clara",
      "ya tengo claro lo que quiero hacer",
      "ya tengo claro el producto",
      "ya tengo claro el mercado",
      "ya tengo claro el proyecto",
      "ya tengo una direccion clara",
      "ya tengo una dirección clara"
    ])
  ) {
    return "asesoria_clear_case";
  }

  // =========================
  // ASESORÍA - IDEA GENERAL / NECESITA ESTRUCTURA
  // =========================

  if (
    includesAny(text, [
      "tengo una idea general pero necesito estructura",
      "tengo una idea pero necesito estructura",
      "tengo una idea pero no esta estructurada",
      "tengo una idea pero no está estructurada",
      "quiero ordenar una idea de negocio",
      "necesito aterrizar una idea de negocio",
      "tengo una idea pero no se como avanzar",
      "tengo una idea pero no sé cómo avanzar"
    ])
  ) {
    return "asesoria_general_idea";
  }

  // =========================
  // ASESORÍA - NO SABE POR DÓNDE EMPEZAR
  // =========================

  if (
    includesAny(text, [
      "no se por donde empezar",
      "no sé por dónde empezar",
      "no tengo claro por donde empezar",
      "no tengo claro por dónde empezar",
      "estoy perdido con mi negocio",
      "necesito orientacion desde cero",
      "necesito orientación desde cero",
      "quiero empezar pero no se como",
      "quiero empezar pero no sé cómo",
      "estoy explorando pero necesito claridad"
    ])
  ) {
    return "asesoria_no_clear_start";
  }

  // =========================
  // ASESORÍA - SIGUIENTE PASO
  // =========================

  if (
    includesAny(text, [
      "como avanzar con asesoria",
      "cómo avanzar con asesoría",
      "como sigo con asesoria",
      "cómo sigo con asesoría",
      "cual seria el siguiente paso en asesoria",
      "cuál sería el siguiente paso en asesoría",
      "quiero avanzar con asesoria",
      "quiero avanzar con asesoría",
      "quiero seguir con asesoria",
      "quiero seguir con asesoría",
      "que debo hacer para avanzar con asesoria",
      "qué debo hacer para avanzar con asesoría",
      "como continuo con asesoria",
      "cómo continúo con asesoría",
      "que hago ahora con asesoria",
      "qué hago ahora con asesoría"
    ])
  ) {
    return "asesoria_next_step";
  }

  // =========================
  // ASESORÍA - AGENDAR
  // =========================

  if (
    includesAny(text, [
      "quiero agendar asesoria",
      "quiero agendar asesoria",
      "quiero agendar asesoría",
      "quiero agendar para asesoria",
      "quiero agendar para asesoría",
      "agendar reunion asesoria",
      "agendar reunión asesoría",
      "quiero una llamada para asesoria",
      "quiero una llamada para asesoría",
      "quiero hablar con alguien sobre asesoria",
      "quiero hablar con alguien sobre asesoría",
      "quiero coordinar una llamada sobre asesoria",
      "quiero coordinar una llamada sobre asesoría",
      "quiero una reunion sobre asesoria",
      "quiero una reunión sobre asesoría",
      "quiero agendar una reunion para asesoria",
      "quiero agendar una reunión para asesoría"
    ])
  ) {
    return "asesoria_schedule";
  }

  // =========================
  // ASESORÍA - TIPOS DE AYUDA / OPCIONES
  // =========================

  if (
    includesAny(text, [
      "que tipo de ayuda ofrecen en asesoria",
      "qué tipo de ayuda ofrecen en asesoría",
      "que tipos de ayuda ofrecen en asesoria",
      "qué tipos de ayuda ofrecen en asesoría",
      "que nivel de ayuda ofrecen en asesoria",
      "qué nivel de ayuda ofrecen en asesoría",
      "que opciones tienen para asesoria",
      "qué opciones tienen para asesoría",
      "que opciones ofrecen para asesoria",
      "qué opciones ofrecen para asesoría",
      "que acompañamiento tienen para asesoria",
      "qué acompañamiento tienen para asesoría",
      "que acompanamiento tienen para asesoria",
      "como me pueden ayudar con asesoria",
      "cómo me pueden ayudar con asesoría",
      "de que forma ayudan con asesoria",
      "de qué forma ayudan con asesoría",
      "que apoyo ofrecen en asesoria",
      "qué apoyo ofrecen en asesoría",
      "en que me ayudan con asesoria",
      "en qué me ayudan con asesoría"
    ])
  ) {
    return "asesoria_help_options";
  }

  return null;
}

module.exports = { detectAsesoriaIntent };