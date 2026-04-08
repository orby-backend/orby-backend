const { includesAny } = require("./utils");

function detectDigitalIntent(text = "") {
  // =========================
  // DIGITAL - INFORMACIÓN GENERAL
  // =========================
  if (
    includesAny(text, [
      "informacion de ecommerce",
      "informacion sobre ecommerce",
      "informacion de tienda online",
      "informacion sobre tienda online",
      "informacion de automatizacion",
      "informacion sobre automatizacion",
      "informacion de ia",
      "informacion sobre ia",
      "informacion de marketing digital",
      "informacion sobre marketing digital",
      "quiero informacion de ecommerce",
      "quiero informacion sobre ecommerce",
      "quiero informacion de automatizacion",
      "quiero informacion sobre automatizacion",
      "quiero informacion de ia",
      "quiero informacion sobre ia",
      "quiero informacion de marketing digital",
      "quiero informacion sobre marketing digital",
      "info de ecommerce",
      "info de automatizacion",
      "info de ia",
      "info de marketing digital",
      "explicame ecommerce",
      "explícame ecommerce",
      "explicame automatizacion",
      "explícame automatización",
      "explicame ia",
      "explícame ia",
      "explicame marketing digital",
      "explícame marketing digital",
      "como me ayudan con ecommerce",
      "como me ayudan con automatizacion",
      "como me ayudan con ia",
      "como me ayudan con marketing digital",
      "que incluye el servicio digital",
      "que incluye ecommerce",
      "que incluye automatizacion",
      "que incluye ia",
      "que incluye marketing digital"
    ])
  ) {
    return "digital_info";
  }

  // =========================
  // DIGITAL - CREAR TIENDA / ECOMMERCE DESDE CERO
  // =========================
  if (
    includesAny(text, [
      "quiero crear una tienda online",
      "quiero crear un ecommerce",
      "quiero hacer una tienda online",
      "quiero montar una tienda online",
      "quiero abrir una tienda online",
      "quiero empezar una tienda online",
      "quiero empezar un ecommerce",
      "quiero una tienda online desde cero",
      "quiero un ecommerce desde cero",
      "quiero vender por mi web",
      "quiero tener mi propia tienda online",
      "quiero crear una tienda en shopify",
      "quiero crear una tienda en woocommerce",
      "quiero crear una tienda en wordpress",
      "quiero crear una tienda en prestashop"
    ])
  ) {
    return "digital_create_store";
  }

  // =========================
  // DIGITAL - MEJORAR / REPARAR TIENDA EXISTENTE
  // =========================
  if (
    includesAny(text, [
      "quiero mejorar mi tienda online",
      "quiero mejorar mi ecommerce",
      "quiero reparar mi tienda online",
      "quiero arreglar mi tienda online",
      "quiero optimizar mi tienda online",
      "quiero mejorar una tienda existente",
      "mi tienda no vende",
      "mi ecommerce no vende",
      "mi tienda tiene errores",
      "mi tienda esta lenta",
      "mi tienda está lenta",
      "quiero mejorar diseño de mi tienda",
      "quiero mejorar conversiones de mi tienda",
      "quiero soporte para mi tienda online"
    ])
  ) {
    return "digital_improve_store";
  }

  // =========================
  // DIGITAL - IA / AUTOMATIZACIÓN
  // =========================
  if (
    includesAny(text, [
      "quiero implementar ia",
      "quiero implementar automatizacion",
      "quiero automatizar mi negocio",
      "quiero automatizar ventas",
      "quiero automatizar atencion al cliente",
      "quiero automatizar atención al cliente",
      "quiero un chatbot",
      "quiero un bot",
      "quiero un agente con ia",
      "quiero un agente tipo orby",
      "quiero un asistente con ia",
      "quiero automatizar procesos internos",
      "quiero usar ia para vender mas",
      "quiero usar ia para vender más",
      "quiero implementar un chatbot en mi web",
      "quiero implementar un bot de whatsapp",
      "quiero automatizacion con ia",
      "quiero automatización con ia"
    ])
  ) {
    return "digital_ai_automation";
  }

  // =========================
  // DIGITAL - MARKETING / SEO / VENTAS
  // =========================
  if (
    includesAny(text, [
      "quiero mejorar mi marketing digital",
      "quiero mejorar mis ventas online",
      "quiero generar mas ventas",
      "quiero generar más ventas",
      "quiero generar mas leads",
      "quiero generar más leads",
      "quiero mejorar seo",
      "quiero posicionar mi web",
      "quiero mejorar campañas",
      "quiero mejorar mis campañas",
      "quiero mejorar meta ads",
      "quiero mejorar google ads",
      "quiero mas trafico",
      "quiero más tráfico",
      "quiero mejorar conversiones",
      "quiero una estrategia digital",
      "quiero mejorar mi ecommerce con marketing",
      "necesito marketing digital"
    ])
  ) {
    return "digital_marketing_sales";
  }

  // =========================
  // DIGITAL - PLATAFORMAS ESPECÍFICAS
  // =========================
  if (
    includesAny(text, [
      "shopify",
      "tienda en shopify",
      "ecommerce en shopify"
    ])
  ) {
    return "digital_shopify_interest";
  }

  if (
    includesAny(text, [
      "woocommerce",
      "wordpress",
      "tienda en wordpress",
      "tienda en woocommerce",
      "ecommerce en wordpress",
      "ecommerce en woocommerce"
    ])
  ) {
    return "digital_wordpress_interest";
  }

  if (
    includesAny(text, [
      "prestashop",
      "tienda en prestashop",
      "ecommerce en prestashop"
    ])
  ) {
    return "digital_prestashop_interest";
  }

  // =========================
  // DIGITAL - CHATBOT / AGENTE / BOT
  // =========================
  if (
    includesAny(text, [
      "quiero un chatbot para ventas",
      "quiero un chatbot para atencion",
      "quiero un chatbot para atención",
      "quiero un bot para ventas",
      "quiero un bot para whatsapp",
      "quiero un agente con ia para ventas",
      "quiero un agente con ia para leads",
      "quiero un agente comercial con ia",
      "quiero un agente tipo orby",
      "quiero automatizar whatsapp con ia"
    ])
  ) {
    return "digital_chatbot_interest";
  }

  // =========================
  // DIGITAL - SIGUIENTE PASO
  // =========================
  if (
    includesAny(text, [
      "como avanzar con ecommerce",
      "como avanzar con digital",
      "como sigo con ecommerce",
      "como sigo con digital",
      "cual seria el siguiente paso en ecommerce",
      "cuál sería el siguiente paso en ecommerce",
      "cual seria el siguiente paso en digital",
      "cuál sería el siguiente paso en digital",
      "quiero avanzar con ecommerce",
      "quiero avanzar con digital",
      "quiero seguir con ecommerce",
      "quiero seguir con digital",
      "que debo hacer para avanzar con ecommerce",
      "qué debo hacer para avanzar con ecommerce",
      "que debo hacer para avanzar con digital",
      "qué debo hacer para avanzar con digital",
      "como continuo con ecommerce",
      "cómo continúo con ecommerce",
      "como continuo con digital",
      "cómo continúo con digital",
      "que hago ahora con ecommerce",
      "qué hago ahora con ecommerce",
      "que hago ahora con digital",
      "qué hago ahora con digital"
    ])
  ) {
    return "digital_next_step";
  }

  // =========================
  // DIGITAL - AGENDAR
  // =========================
  if (
    includesAny(text, [
      "quiero agendar ecommerce",
      "quiero agendar digital",
      "quiero agendar para ecommerce",
      "quiero agendar para digital",
      "agendar reunion ecommerce",
      "agendar reunión ecommerce",
      "agendar reunion digital",
      "agendar reunión digital",
      "quiero una llamada para ecommerce",
      "quiero una llamada para digital",
      "quiero hablar con alguien sobre ecommerce",
      "quiero hablar con alguien sobre digital",
      "quiero coordinar una llamada sobre ecommerce",
      "quiero coordinar una llamada sobre digital",
      "quiero una reunion sobre ecommerce",
      "quiero una reunión sobre ecommerce",
      "quiero una reunion sobre digital",
      "quiero una reunión sobre digital"
    ])
  ) {
    return "digital_schedule";
  }

  // =========================
  // DIGITAL - TIPOS DE AYUDA / OPCIONES
  // =========================
  if (
    includesAny(text, [
      "que tipo de ayuda ofrecen para ecommerce",
      "que tipo de ayuda ofrecen para digital",
      "que tipos de ayuda ofrecen para ecommerce",
      "que tipos de ayuda ofrecen para digital",
      "que nivel de ayuda ofrecen para ecommerce",
      "que nivel de ayuda ofrecen para digital",
      "que opciones tienen para ecommerce",
      "que opciones tienen para digital",
      "que opciones ofrecen para ecommerce",
      "que opciones ofrecen para digital",
      "que acompañamiento tienen para ecommerce",
      "que acompañamiento tienen para digital",
      "que acompanamiento tienen para ecommerce",
      "que acompanamiento tienen para digital",
      "como me pueden ayudar con ecommerce",
      "como me pueden ayudar con digital",
      "de que forma ayudan con ecommerce",
      "de que forma ayudan con digital",
      "que apoyo ofrecen para ecommerce",
      "que apoyo ofrecen para digital",
      "en que me ayudan con ecommerce",
      "en qué me ayudan con ecommerce",
      "en que me ayudan con digital",
      "en qué me ayudan con digital"
    ])
  ) {
    return "digital_help_options";
  }

  return null;
}

module.exports = { detectDigitalIntent };