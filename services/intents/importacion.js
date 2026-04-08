const { includesAny } = require("./utils");

function detectImportacionIntent(text = "") {
  // =========================
  // IMPORTACIÓN - INFORMACIÓN GENERAL
  // =========================

  if (
    includesAny(text, [
      "informacion de importacion",
      "informacion sobre importacion",
      "quiero informacion de importacion",
      "quiero informacion sobre importacion",
      "quiero importar",
      "quiero importar productos",
      "quiero importar de china",
      "quiero importar desde china",
      "quiero importar desde usa",
      "quiero importar de usa",
      "como importar",
      "como funciona importar",
      "como funciona la importacion",
      "como funciona la importacion desde china",
      "explicame importacion",
      "explicame como importar",
      "explícame importacion",
      "explícame cómo importar",
      "info de importacion",
      "info sobre importacion",
      "ayuda con importacion",
      "ayuda para importar",
      "quiero ayuda para importar",
      "quiero ayuda con importacion",
      "que incluye importacion",
      "que incluye el servicio de importacion",
      "como me ayudan con importacion",
      "en que me ayudan con importacion",
      "que apoyo dan para importar",
      "que acompañamiento dan para importar",
      "que acompanamiento dan para importar"
    ])
  ) {
    return "import_info";
  }

  // =========================
  // IMPORTACIÓN - ETAPA DE INICIO
  // =========================

  if (
    includesAny(text, [
      "quiero empezar a importar",
      "quiero comenzar a importar",
      "quiero iniciar a importar",
      "quiero arrancar a importar",
      "quiero empezar con importaciones",
      "quiero comenzar con importaciones",
      "quiero iniciar con importaciones",
      "quiero importar por primera vez",
      "seria mi primera vez importando",
      "sería mi primera vez importando",
      "nunca he importado",
      "no he importado antes",
      "soy nuevo importando",
      "soy principiante importando",
      "quiero empezar desde cero a importar",
      "quiero comenzar desde cero a importar",
      "quiero iniciar desde cero a importar",
      "estoy empezando a importar",
      "quiero aprender a importar"
    ])
  ) {
    return "import_start";
  }

  // =========================
  // IMPORTACIÓN - SIN PRODUCTO DEFINIDO
  // =========================

  if (
    includesAny(text, [
      "no se que importar",
      "no se que producto importar",
      "no se que producto elegir para importar",
      "no se que traer",
      "no se que traer de china",
      "no se que importar de china",
      "aun no se que importar",
      "aún no sé qué importar",
      "aun no tengo producto",
      "aún no tengo producto",
      "aun no tengo definido el producto",
      "aún no tengo definido el producto",
      "estoy buscando producto para importar",
      "necesito ayuda para elegir producto",
      "quiero saber que importar",
      "quiero saber qué importar",
      "que producto me recomiendan importar",
      "qué producto me recomiendan importar",
      "que producto conviene importar",
      "qué producto conviene importar",
      "quiero importar pero no se que producto elegir",
      "quiero importar pero no se que traer",
      "quiero importar pero aun no se que producto elegir",
      "quiero importar pero aún no sé qué producto elegir"
    ])
  ) {
    return "import_no_product";
  }

  // =========================
  // IMPORTACIÓN - YA TIENE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "ya tengo producto para importar",
      "ya tengo un producto para importar",
      "ya se que producto quiero importar",
      "ya sé qué producto quiero importar",
      "ya tengo definido el producto",
      "ya tengo un producto definido",
      "ya elegi el producto",
      "ya elegí el producto",
      "ya tengo la idea del producto",
      "tengo un producto para importar",
      "tengo producto definido para importar",
      "ya se que quiero traer",
      "ya sé qué quiero traer",
      "ya tengo claro que quiero importar",
      "ya tengo claro qué quiero importar"
    ])
  ) {
    return "import_with_product";
  }

  // =========================
  // IMPORTACIÓN - VALIDACIÓN DE PRODUCTO
  // =========================

  if (
    includesAny(text, [
      "quiero validar mi producto para importar",
      "quiero validar un producto para importar",
      "quiero validar si mi producto conviene importar",
      "quiero validar si este producto conviene importar",
      "quiero saber si este producto conviene importar",
      "quiero saber si mi producto conviene importar",
      "quiero saber si vale la pena importar este producto",
      "quiero saber si vale la pena importar mi producto",
      "mi producto conviene importar",
      "este producto conviene importar",
      "ese producto conviene importar",
      "quiero validar una idea de producto para importar",
      "validar producto importacion",
      "validar producto para importacion",
      "validar idea de producto importacion",
      "quiero revisar si este producto sirve para importar",
      "quiero revisar si mi producto sirve para importar",
      "quiero analizar si este producto conviene importar",
      "quiero analizar si mi producto conviene importar",
      "quiero analizar si esta idea conviene para importar",
      "quiero ver si este producto sirve para importar",
      "quiero ver si mi producto sirve para importar",
      "necesito validar un producto para importar",
      "necesito validar si este producto conviene importar",
      "quiero revisar una idea de producto para importar",
      "quiero analizar una idea de producto para importar"
    ])
  ) {
    return "import_product_validation";
  }

  // =========================
  // IMPORTACIÓN - BÚSQUEDA DE PROVEEDOR / FABRICANTE
  // =========================

  if (
    includesAny(text, [
      "busco proveedor",
      "busco proveedores",
      "busco proveedor en china",
      "busco proveedores en china",
      "busco proveedor en usa",
      "busco fabricante",
      "busco fabricante en china",
      "quiero encontrar proveedor",
      "quiero encontrar proveedores",
      "quiero encontrar fabricante",
      "quiero buscar proveedor",
      "quiero buscar proveedores",
      "quiero buscar fabricante",
      "quiero conseguir proveedor",
      "quiero conseguir fabricante",
      "necesito proveedor",
      "necesito un proveedor",
      "necesito proveedor en china",
      "necesito fabricante en china",
      "quiero ayuda para buscar proveedor",
      "quiero ayuda para encontrar proveedor",
      "quiero ayuda con proveedores",
      "quiero ayuda con fabricante",
      "quiero buscar proveedor o fabricante",
      "busco proveedor o fabricante"
    ])
  ) {
    return "import_supplier_search";
  }

  // =========================
  // IMPORTACIÓN - IMPORTAR DESDE CHINA / USA
  // =========================

  if (
    includesAny(text, [
      "quiero importar de china",
      "quiero importar desde china",
      "quiero traer productos de china",
      "quiero comprar en china para importar",
      "quiero importar productos chinos",
      "quiero importar desde usa",
      "quiero importar de usa",
      "quiero traer productos de usa",
      "quiero importar desde estados unidos",
      "quiero traer productos de estados unidos",
      "como importar desde china",
      "como importar de china",
      "como importar desde usa",
      "como importar de usa",
      "importar desde china",
      "importar desde usa",
      "traer productos de china",
      "traer productos de usa"
    ])
  ) {
    return "import_from_china";
  }

  // =========================
  // IMPORTACIÓN - COSTOS / INVERSIÓN / MÁRGENES
  // =========================

  if (
    includesAny(text, [
      "cuanto cuesta importar",
      "cuanto cuesta una importacion",
      "cuanto cuesta importar desde china",
      "cuanto cuesta importar de china",
      "cuanto cuesta traer productos de china",
      "cuanto necesito para importar",
      "cuanta inversion necesito para importar",
      "cuánta inversión necesito para importar",
      "que costos tiene importar",
      "qué costos tiene importar",
      "como calcular costos de importacion",
      "cómo calcular costos de importación",
      "quiero saber los costos de importacion",
      "quiero saber los costos de importar",
      "quiero saber cuanto invertir para importar",
      "quiero saber cuánto invertir para importar",
      "quiero saber si deja margen importar",
      "quiero saber si es rentable importar",
      "quiero saber si vale la pena importar",
      "costos de importacion",
      "costos de importar",
      "inversion para importar",
      "inversión para importar",
      "rentabilidad de importar"
    ])
  ) {
    return "import_costs_question";
  }

  // =========================
  // IMPORTACIÓN - PROCESO / REQUISITOS / PASOS
  // =========================

  if (
    includesAny(text, [
      "como es el proceso para importar",
      "como funciona el proceso de importacion",
      "cuales son los pasos para importar",
      "cuáles son los pasos para importar",
      "que necesito para importar",
      "qué necesito para importar",
      "que requisitos necesito para importar",
      "qué requisitos necesito para importar",
      "como traer un producto desde china",
      "cómo traer un producto desde china",
      "como empezar el proceso de importacion",
      "cómo empezar el proceso de importación",
      "quiero entender el proceso de importacion",
      "quiero entender el proceso para importar",
      "quiero entender los pasos para importar",
      "proceso de importacion",
      "proceso para importar",
      "pasos para importar",
      "requisitos para importar"
    ])
  ) {
    return "import_process_question";
  }

  // =========================
  // IMPORTACIÓN - SIGUIENTE PASO
  // =========================

  if (
    includesAny(text, [
      "como avanzar con importacion",
      "como sigo con importacion",
      "cual seria el siguiente paso en importacion",
      "cuál sería el siguiente paso en importación",
      "quiero avanzar con importacion",
      "quiero seguir con importacion",
      "que debo hacer para avanzar con importacion",
      "qué debo hacer para avanzar con importación",
      "como continuo con importacion",
      "cómo continúo con importación",
      "que hago ahora con importacion",
      "qué hago ahora con importación",
      "cual es el siguiente paso para importar",
      "cuál es el siguiente paso para importar"
    ])
  ) {
    return "import_next_step";
  }

  // =========================
  // IMPORTACIÓN - AGENDAR
  // =========================

  if (
    includesAny(text, [
      "quiero agendar importacion",
      "quiero agendar para importacion",
      "agendar reunion importacion",
      "agendar reunión importación",
      "quiero una llamada para importacion",
      "quiero hablar con alguien sobre importacion",
      "quiero coordinar una llamada sobre importacion",
      "quiero una reunion sobre importacion",
      "quiero una reunión sobre importación",
      "quiero agendar una llamada para importacion",
      "quiero agendar una reunion para importacion",
      "quiero agendar una reunión para importación"
    ])
  ) {
    return "import_schedule";
  }

  // =========================
  // IMPORTACIÓN - TIPOS DE AYUDA / OPCIONES
  // =========================

  if (
    includesAny(text, [
      "que tipo de ayuda ofrecen para importar",
      "que tipos de ayuda ofrecen para importar",
      "que nivel de ayuda ofrecen para importar",
      "que opciones tienen para importacion",
      "que opciones ofrecen para importacion",
      "que acompañamiento tienen para importacion",
      "que acompanamiento tienen para importacion",
      "como me pueden ayudar con importacion",
      "de que forma ayudan con importacion",
      "que apoyo ofrecen para importacion",
      "que apoyo ofrecen para importar",
      "en que me ayudan con importacion",
      "en qué me ayudan con importación"
    ])
  ) {
    return "import_help_options";
  }

  return null;
}

module.exports = { detectImportacionIntent };