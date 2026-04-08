const { includesAny } = require("./utils");

function detectAmazonIntent(text = "") {
  // =========================
  // AMAZON FBA - INFORMACIÓN GENERAL
  // =========================

  if (
    includesAny(text, [
      "que incluye amazon",
      "que incluye amazon fba",
      "que incluye el servicio amazon",
      "que incluye el servicio amazon fba",
      "como funciona amazon fba",
      "como funciona el servicio amazon",
      "en que me ayudan con amazon",
      "como me ayudan con amazon",
      "que apoyo dan para amazon",
      "que acompanamiento dan para amazon",
      "que acompañamiento dan para amazon",
      "que incluye el acompanamiento amazon",
      "que incluye el acompañamiento amazon",
      "informacion de amazon fba",
      "info de amazon fba",
      "explicame amazon fba",
      "explícame amazon fba",
      "quiero informacion de amazon",
      "quiero información de amazon",
      "quiero informacion de amazon fba",
      "quiero información de amazon fba"
    ])
  ) {
    return "amazon_info";
  }

  if (
    includesAny(text, [
      "cuanto cuesta amazon",
      "cuanto cuesta amazon fba",
      "precio amazon",
      "precio amazon fba",
      "costo amazon",
      "costo amazon fba",
      "valor amazon",
      "valor amazon fba",
      "cuanto cobran por amazon",
      "cuanto cobran por amazon fba",
      "precio del servicio amazon",
      "precio del servicio amazon fba",
      "cuanto vale la asesoria amazon",
      "cuanto vale la guia amazon",
      "cuanto vale la guía amazon",
      "cuanto cuesta la asesoria amazon",
      "cuanto cuesta la guía amazon",
      "cuanto cuesta la guia amazon"
    ])
  ) {
    return "amazon_price";
  }

  // =========================
  // AMAZON FBA - ETAPA DE INICIO
  // =========================

  if (
    includesAny(text, [
      "quiero empezar en amazon",
      "quiero comenzar en amazon",
      "quiero vender en amazon",
      "quiero arrancar en amazon",
      "quiero iniciar en amazon",
      "empezar desde cero amazon",
      "comenzar desde cero amazon",
      "iniciar desde cero amazon",
      "soy nuevo en amazon",
      "soy principiante en amazon",
      "nunca he vendido en amazon",
      "seria mi primera vez en amazon",
      "sería mi primera vez en amazon",
      "quiero empezar desde cero en amazon",
      "quiero comenzar desde cero en amazon",
      "quiero iniciar desde cero en amazon"
    ])
  ) {
    return "amazon_start";
  }

  // =========================
  // AMAZON FBA - SIN PRODUCTO / ELECCIÓN DE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "no se que vender",
      "no se que producto vender",
      "no se que producto vender en amazon",
      "no se que vender en amazon",
      "no se que producto elegir",
      "no se que producto elegir para amazon",
      "no tengo producto para amazon",
      "aun no se que vender",
      "aún no sé qué vender",
      "aun no tengo producto",
      "aún no tengo producto",
      "estoy buscando producto para amazon",
      "necesito ayuda para elegir producto amazon",
      "quiero saber que vender en amazon",
      "quiero saber qué vender en amazon",
      "que producto me recomiendan para amazon",
      "qué producto me recomiendan para amazon",
      "que producto conviene para amazon",
      "qué producto conviene para amazon"
    ])
  ) {
    return "amazon_no_product";
  }

  // =========================
  // AMAZON FBA - YA TIENE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "ya tengo producto amazon",
      "ya tengo un producto para amazon",
      "ya tengo producto para vender en amazon",
      "ya tengo un producto definido",
      "ya tengo producto definido para amazon",
      "ya se que producto vender en amazon",
      "ya sé qué producto vender en amazon",
      "ya elegi producto para amazon",
      "ya elegí producto para amazon",
      "ya tengo una idea de producto para amazon",
      "tengo un producto para amazon",
      "tengo producto definido para amazon"
    ])
  ) {
    return "amazon_with_product";
  }

  // =========================
  // AMAZON FBA - VALIDACIÓN DE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "quiero validar mi producto para amazon",
      "quiero validar si mi producto sirve para amazon",
      "quiero validar un producto para amazon",
      "quiero validar si un producto sirve para amazon",
      "quiero saber si mi producto sirve para amazon",
      "quiero saber si un producto sirve para amazon",
      "quiero saber si este producto sirve para amazon",
      "quiero saber si ese producto sirve para amazon",
      "mi producto sirve para amazon",
      "un producto sirve para amazon",
      "este producto sirve para amazon",
      "ese producto sirve para amazon",
      "crees que este producto funciona en amazon",
      "crees que mi producto funciona en amazon",
      "quiero validar una idea de producto para amazon",
      "validar producto amazon",
      "validar idea de producto amazon",
      "quiero revisar si un producto funciona en amazon",
      "quiero revisar si este producto funciona en amazon",
      "quiero revisar si mi producto funciona en amazon",
      "quiero revisar si ese producto funciona en amazon",
      "quiero analizar si este producto sirve para amazon",
      "quiero analizar si mi producto sirve para amazon",
      "quiero analizar si un producto sirve para amazon",
      "quiero analizar si esta idea sirve para amazon",
      "quiero analizar si esta idea conviene para amazon",
      "quiero ver si este producto sirve para amazon",
      "quiero ver si un producto sirve para amazon",
      "quiero ver si mi producto sirve para amazon",
      "quiero ver si esta idea funciona en amazon",
      "quiero comprobar si este producto sirve para amazon",
      "necesito validar un producto para amazon",
      "necesito validar si este producto sirve para amazon",
      "quiero revisar una idea de producto para amazon",
      "quiero analizar una idea de producto para amazon",
      "quiero saber si conviene este producto para amazon",
      "quiero saber si conviene vender este producto en amazon"
    ])
  ) {
    return "amazon_product_validation";
  }

  // =========================
  // AMAZON FBA - INTERÉS POR CATEGORÍA O TIPO DE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "quiero vender productos electronicos",
      "quiero vender productos electrónicos",
      "quiero vender electronicos en amazon",
      "quiero vender electrónicos en amazon",
      "quiero vender articulos electronicos en amazon",
      "quiero vender artículos electrónicos en amazon",
      "quiero vender productos tecnologicos en amazon",
      "quiero vender productos tecnológicos en amazon",
      "quiero vender gadgets en amazon",
      "quiero vender productos de hogar en amazon",
      "quiero vender productos de cocina en amazon",
      "quiero vender accesorios en amazon",
      "quiero vender productos de belleza en amazon",
      "quiero vender articulos de oficina en amazon",
      "quiero vender artículos de oficina en amazon",
      "quiero vender herramientas en amazon",
      "quiero vender juguetes en amazon",
      "quiero vender ropa en amazon",
      "quiero vender accesorios para mascotas en amazon",
      "quiero vender suplementos en amazon",
      "quiero vender un tipo de producto en amazon",
      "estoy pensando vender electronicos en amazon",
      "estoy pensando vender electrónicos en amazon",
      "estoy pensando vender gadgets en amazon",
      "estoy pensando vender productos de hogar en amazon"
    ])
  ) {
    return "amazon_category_interest";
  }

  // =========================
  // AMAZON FBA - IMPORTAR DESDE CHINA PARA VENDER EN AMAZON
  // =========================

  if (
    includesAny(text, [
      "quiero importar productos de china para vender en amazon",
      "quiero importar de china para vender en amazon",
      "quiero traer productos de china para vender en amazon",
      "quiero traer de china para amazon",
      "quiero importar productos electronicos de china",
      "quiero importar productos electrónicos de china",
      "quiero importar electronicos de china para amazon",
      "quiero importar electrónicos de china para amazon",
      "quiero importar gadgets de china para amazon",
      "quiero traer electronicos de china para amazon",
      "quiero traer electrónicos de china para amazon",
      "quiero importar productos de china para amazon fba",
      "quiero importar de china para amazon fba",
      "quiero vender en amazon con productos de china",
      "quiero vender productos chinos en amazon",
      "quiero importar para vender en amazon"
    ])
  ) {
    return "amazon_import_to_amazon";
  }

  // =========================
  // AMAZON FBA - VIABILIDAD / COMPETENCIA / MÁRGENES
  // =========================

  if (
    includesAny(text, [
      "quiero saber si es viable vender en amazon",
      "quiero saber si vale la pena vender en amazon",
      "quiero saber si vale la pena este producto en amazon",
      "quiero saber si hay competencia en amazon",
      "quiero saber si hay mucha competencia en amazon",
      "quiero saber si hay margen en amazon",
      "quiero saber si da rentabilidad en amazon",
      "quiero saber si es rentable vender en amazon",
      "quiero saber si este producto es rentable en amazon",
      "hay mercado para este producto en amazon",
      "hay competencia para este producto en amazon",
      "sera rentable vender esto en amazon",
      "será rentable vender esto en amazon"
    ])
  ) {
    return "amazon_viability_question";
  }

  // =========================
  // AMAZON FBA - SIGUIENTE PASO
  // =========================

  if (
    includesAny(text, [
      "como avanzar en amazon",
      "como sigo con amazon",
      "cual seria el siguiente paso en amazon",
      "cuál sería el siguiente paso en amazon",
      "quiero avanzar con amazon",
      "quiero seguir con amazon",
      "que debo hacer para avanzar en amazon",
      "que hago para seguir con amazon",
      "cual seria el siguiente paso",
      "cuál sería el siguiente paso",
      "como continuo con amazon",
      "cómo continúo con amazon",
      "que hago ahora con amazon",
      "qué hago ahora con amazon"
    ])
  ) {
    return "amazon_next_step";
  }

  // =========================
  // AMAZON FBA - AGENDAR
  // =========================

  if (
    includesAny(text, [
      "quiero agendar amazon",
      "quiero agendar para amazon",
      "agendar reunion amazon",
      "agendar reunión amazon",
      "quiero una llamada para amazon",
      "quiero hablar con alguien sobre amazon",
      "quiero coordinar una llamada sobre amazon",
      "quiero una reunion sobre amazon",
      "quiero una reunión sobre amazon",
      "quiero agendar una llamada para amazon",
      "quiero agendar una reunion para amazon",
      "quiero agendar una reunión para amazon"
    ])
  ) {
    return "amazon_schedule";
  }

  // =========================
  // AMAZON FBA - TIPOS DE AYUDA / OPCIONES
  // =========================

  if (
    includesAny(text, [
      "que tipo de ayuda ofrecen para amazon",
      "que tipos de ayuda ofrecen para amazon",
      "que nivel de ayuda ofrecen para amazon",
      "diferencia entre ayudas de amazon",
      "diferencia entre niveles de ayuda amazon",
      "que opciones tienen para amazon",
      "que opciones ofrecen para amazon",
      "que acompañamiento tienen para amazon",
      "que acompanamiento tienen para amazon",
      "como me pueden ayudar con amazon",
      "de que forma ayudan con amazon",
      "que apoyo ofrecen para amazon"
    ])
  ) {
    return "amazon_help_options";
  }

  return null;
}

module.exports = { detectAmazonIntent };