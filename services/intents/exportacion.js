const { includesAny } = require("./utils");

function detectExportacionIntent(text = "") {
  // =========================
  // EXPORTACIÓN - INFORMACIÓN GENERAL
  // =========================

  if (
    includesAny(text, [
      "informacion de exportacion",
      "informacion sobre exportacion",
      "quiero informacion de exportacion",
      "quiero informacion sobre exportacion",
      "quiero exportar",
      "quiero exportar productos",
      "como exportar",
      "como funciona exportar",
      "como funciona la exportacion",
      "explicame exportacion",
      "explicame como exportar",
      "explícame exportacion",
      "explícame cómo exportar",
      "info de exportacion",
      "info sobre exportacion",
      "ayuda con exportacion",
      "ayuda para exportar",
      "quiero ayuda para exportar",
      "quiero ayuda con exportacion",
      "que incluye exportacion",
      "que incluye el servicio de exportacion",
      "como me ayudan con exportacion",
      "en que me ayudan con exportacion",
      "que apoyo dan para exportar",
      "que acompañamiento dan para exportar",
      "que acompanamiento dan para exportar"
    ])
  ) {
    return "export_info";
  }

  // =========================
  // EXPORTACIÓN - ETAPA DE INICIO
  // =========================

  if (
    includesAny(text, [
      "quiero empezar a exportar",
      "quiero comenzar a exportar",
      "quiero iniciar a exportar",
      "quiero arrancar a exportar",
      "quiero empezar con exportaciones",
      "quiero comenzar con exportaciones",
      "quiero iniciar con exportaciones",
      "quiero exportar por primera vez",
      "seria mi primera vez exportando",
      "sería mi primera vez exportando",
      "nunca he exportado",
      "no he exportado antes",
      "soy nuevo exportando",
      "soy principiante exportando",
      "quiero empezar desde cero a exportar",
      "quiero comenzar desde cero a exportar",
      "quiero iniciar desde cero a exportar",
      "estoy empezando a exportar",
      "quiero aprender a exportar",
      "no se por donde empezar a exportar",
      "no sé por dónde empezar a exportar"
    ])
  ) {
    return "export_start";
  }

  // =========================
  // EXPORTACIÓN - YA TIENE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "ya tengo producto para exportar",
      "ya tengo un producto para exportar",
      "ya tengo un producto listo para exportar",
      "ya tengo producto listo para exportar",
      "ya se que producto quiero exportar",
      "ya sé qué producto quiero exportar",
      "ya tengo definido el producto para exportar",
      "ya tengo un producto definido para exportar",
      "ya elegi el producto para exportar",
      "ya elegí el producto para exportar",
      "tengo un producto para exportar",
      "tengo producto definido para exportar",
      "ya tengo claro que quiero exportar",
      "ya tengo claro qué quiero exportar"
    ])
  ) {
    return "export_with_product";
  }

  // =========================
  // EXPORTACIÓN - VALIDACIÓN DE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "quiero validar mi producto para exportar",
      "quiero validar un producto para exportar",
      "quiero validar si mi producto sirve para exportacion",
      "quiero validar si mi producto sirve para exportar",
      "quiero validar si este producto sirve para exportacion",
      "quiero validar si este producto sirve para exportar",
      "quiero saber si mi producto sirve para exportacion",
      "quiero saber si mi producto sirve para exportar",
      "quiero saber si este producto sirve para exportacion",
      "quiero saber si este producto sirve para exportar",
      "quiero saber si vale la pena exportar este producto",
      "mi producto sirve para exportacion",
      "mi producto sirve para exportar",
      "este producto sirve para exportacion",
      "este producto sirve para exportar",
      "quiero validar una idea de producto para exportacion",
      "validar producto exportacion",
      "validar producto para exportacion",
      "potencial exportable",
      "quiero revisar si este producto conviene para exportacion",
      "quiero revisar si mi producto conviene para exportacion",
      "quiero analizar si este producto conviene exportarlo",
      "quiero analizar si mi producto conviene exportarlo",
      "quiero ver si este producto tiene potencial exportable",
      "quiero ver si mi producto tiene potencial exportable",
      "necesito validar un producto para exportar",
      "necesito validar si este producto conviene para exportacion"
    ])
  ) {
    return "export_product_validation";
  }

  // =========================
  // EXPORTACIÓN - SIN MERCADO DEFINIDO
  // =========================

  if (
    includesAny(text, [
      "no se a que mercado exportar",
      "no se a que pais exportar",
      "no se a que país exportar",
      "no se a donde exportar",
      "no sé a qué mercado exportar",
      "no sé a qué país exportar",
      "no sé a dónde exportar",
      "aun no se a que mercado exportar",
      "aún no sé a qué mercado exportar",
      "aun no tengo mercado definido",
      "aún no tengo mercado definido",
      "no tengo definido el mercado para exportar",
      "quiero exportar pero no se a que mercado apuntar",
      "quiero exportar pero no sé a qué mercado apuntar",
      "quiero exportar pero no se a donde",
      "quiero exportar pero no sé a dónde",
      "no tengo claro el mercado destino",
      "quiero ayuda para definir mercado de exportacion",
      "necesito ayuda para definir mercado de exportacion"
    ])
  ) {
    return "export_no_market";
  }

  // =========================
  // EXPORTACIÓN - MERCADO USA
  // =========================

  if (
    includesAny(text, [
      "quiero exportar a estados unidos",
      "quiero exportar a usa",
      "quiero exportar a eeuu",
      "quiero vender en estados unidos",
      "quiero vender en usa",
      "quiero vender en eeuu",
      "exportar a estados unidos",
      "exportar a usa",
      "exportar a eeuu",
      "mercado de estados unidos",
      "mercado usa",
      "mercado eeuu",
      "como exportar a usa",
      "cómo exportar a usa",
      "como exportar a estados unidos",
      "cómo exportar a estados unidos",
      "exportar a usa desde ecuador",
      "exportar a estados unidos desde ecuador",
      "quiero saber como exportar a usa",
      "quiero saber cómo exportar a usa",
      "quiero saber como exportar a estados unidos",
      "quiero saber cómo exportar a estados unidos"
    ])
  ) {
    return "export_us_market";
  }

  // =========================
  // EXPORTACIÓN - MERCADO CHINA
  // =========================

  if (
    includesAny(text, [
      "quiero exportar a china",
      "quiero vender en china",
      "exportar a china",
      "mercado de china",
      "mercado chino",
      "como exportar a china",
      "cómo exportar a china"
    ])
  ) {
    return "export_china_market";
  }

  // =========================
  // EXPORTACIÓN - MERCADO EUROPA
  // =========================

  if (
    includesAny(text, [
      "quiero exportar a europa",
      "quiero vender en europa",
      "exportar a europa",
      "mercado europeo",
      "mercado de europa",
      "como exportar a europa",
      "cómo exportar a europa"
    ])
  ) {
    return "export_europe_market";
  }

  // =========================
  // EXPORTACIÓN - MERCADO DUBÁI
  // =========================

  if (
    includesAny(text, [
      "quiero exportar a dubai",
      "quiero exportar a dubái",
      "quiero vender en dubai",
      "quiero vender en dubái",
      "exportar a dubai",
      "exportar a dubái",
      "mercado de dubai",
      "mercado de dubái",
      "como exportar a dubai",
      "cómo exportar a dubái"
    ])
  ) {
    return "export_dubai_market";
  }

  // =========================
  // EXPORTACIÓN - REQUISITOS
  // =========================

  if (
    includesAny(text, [
      "que necesito para exportar",
      "qué necesito para exportar",
      "que requisitos necesito para exportar",
      "qué requisitos necesito para exportar",
      "requisitos para exportar",
      "documentos para exportar",
      "que documentos necesito para exportar",
      "qué documentos necesito para exportar",
      "condiciones para exportar",
      "que se revisa para exportar",
      "qué se revisa para exportar",
      "que requisitos necesito para exportar a usa",
      "qué requisitos necesito para exportar a usa",
      "requisitos para exportar a usa",
      "documentos para exportar a usa"
    ])
  ) {
    return "export_requirements_question";
  }

  // =========================
  // EXPORTACIÓN - PROCESO / PASOS
  // =========================

  if (
    includesAny(text, [
      "como es el proceso para exportar",
      "como funciona el proceso de exportacion",
      "cómo funciona el proceso de exportación",
      "cuales son los pasos para exportar",
      "cuáles son los pasos para exportar",
      "quiero entender el proceso de exportacion",
      "quiero entender el proceso de exportación",
      "quiero entender los pasos para exportar",
      "proceso de exportacion",
      "proceso de exportación",
      "proceso para exportar",
      "pasos para exportar",
      "como empezar el proceso de exportacion",
      "cómo empezar el proceso de exportación",
      "como exportar a usa paso a paso",
      "cómo exportar a usa paso a paso"
    ])
  ) {
    return "export_process_question";
  }

  // =========================
  // EXPORTACIÓN - VIABILIDAD / POTENCIAL
  // =========================

  if (
    includesAny(text, [
      "quiero saber si es viable exportar",
      "quiero saber si vale la pena exportar",
      "quiero saber si vale la pena exportar este producto",
      "quiero saber si mi producto tiene potencial exportable",
      "quiero saber si este producto tiene potencial exportable",
      "quiero saber si mi producto conviene para exportacion",
      "quiero saber si este producto conviene para exportacion",
      "quiero saber si es rentable exportar",
      "quiero saber si mi producto puede exportarse",
      "quiero saber si este producto puede exportarse",
      "viabilidad de exportacion",
      "viabilidad de exportación",
      "potencial exportable de mi producto",
      "potencial exportable de este producto"
    ])
  ) {
    return "export_viability_question";
  }

  // =========================
  // EXPORTACIÓN - SIGUIENTE PASO
  // =========================

  if (
    includesAny(text, [
      "como avanzar con exportacion",
      "como sigo con exportacion",
      "cual seria el siguiente paso en exportacion",
      "cuál sería el siguiente paso en exportación",
      "quiero avanzar con exportacion",
      "quiero seguir con exportacion",
      "que debo hacer para avanzar con exportacion",
      "qué debo hacer para avanzar con exportación",
      "como continuo con exportacion",
      "cómo continúo con exportación",
      "que hago ahora con exportacion",
      "qué hago ahora con exportación",
      "cual es el siguiente paso para exportar",
      "cuál es el siguiente paso para exportar"
    ])
  ) {
    return "export_next_step";
  }

  // =========================
  // EXPORTACIÓN - AGENDAR
  // =========================

  if (
    includesAny(text, [
      "quiero agendar exportacion",
      "quiero agendar para exportacion",
      "agendar reunion exportacion",
      "agendar reunión exportación",
      "quiero una llamada para exportacion",
      "quiero hablar con alguien sobre exportacion",
      "quiero coordinar una llamada sobre exportacion",
      "quiero una reunion sobre exportacion",
      "quiero una reunión sobre exportación",
      "quiero agendar una llamada para exportacion",
      "quiero agendar una reunion para exportacion",
      "quiero agendar una reunión para exportación"
    ])
  ) {
    return "export_schedule";
  }

  // =========================
  // EXPORTACIÓN - TIPOS DE AYUDA / OPCIONES
  // =========================

  if (
    includesAny(text, [
      "que tipo de ayuda ofrecen para exportar",
      "que tipos de ayuda ofrecen para exportar",
      "que nivel de ayuda ofrecen para exportar",
      "que opciones tienen para exportacion",
      "que opciones ofrecen para exportacion",
      "que acompañamiento tienen para exportacion",
      "que acompanamiento tienen para exportacion",
      "como me pueden ayudar con exportacion",
      "de que forma ayudan con exportacion",
      "que apoyo ofrecen para exportacion",
      "que apoyo ofrecen para exportar",
      "en que me ayudan con exportacion",
      "en qué me ayudan con exportación"
    ])
  ) {
    return "export_help_options";
  }

  return null;
}

module.exports = { detectExportacionIntent };