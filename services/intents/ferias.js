const { includesAny } = require("./utils");

function detectFeriasIntent(text = "") {
  // =========================
  // FERIAS - INFORMACIÓN GENERAL
  // =========================

  if (
    includesAny(text, [
      "informacion de ferias",
      "informacion sobre ferias",
      "informacion de ferias internacionales",
      "informacion sobre ferias internacionales",
      "quiero informacion de ferias",
      "quiero informacion sobre ferias",
      "quiero informacion de ferias internacionales",
      "quiero informacion sobre ferias internacionales",
      "info de ferias",
      "info sobre ferias",
      "info de ferias internacionales",
      "como funcionan las ferias",
      "como funciona una feria internacional",
      "explicame ferias internacionales",
      "explícame ferias internacionales",
      "ayuda con ferias",
      "ayuda con ferias internacionales",
      "quiero ayuda con ferias",
      "quiero ayuda con ferias internacionales",
      "que incluye el servicio de ferias",
      "que incluye el servicio de ferias internacionales",
      "como me ayudan con ferias",
      "como me ayudan con ferias internacionales",
      "en que me ayudan con ferias",
      "en que me ayudan con ferias internacionales",
      "que apoyo dan para ferias",
      "que acompañamiento dan para ferias",
      "que acompanamiento dan para ferias"
    ])
  ) {
    return "ferias_info";
  }

  // =========================
  // FERIAS - QUIERE IR / EMPEZAR
  // =========================

  if (
    includesAny(text, [
      "quiero ir a una feria",
      "quiero asistir a una feria",
      "quiero participar en una feria",
      "quiero ir a ferias internacionales",
      "quiero asistir a ferias internacionales",
      "quiero participar en ferias internacionales",
      "quiero empezar con ferias internacionales",
      "quiero comenzar con ferias internacionales",
      "quiero explorar ferias internacionales",
      "nunca he ido a una feria internacional",
      "seria mi primera vez en una feria",
      "sería mi primera vez en una feria",
      "soy nuevo en ferias internacionales",
      "quiero prepararme para una feria internacional"
    ])
  ) {
    return "ferias_start";
  }

  // =========================
  // FERIAS - FERIA ESPECÍFICA
  // =========================

  if (
    includesAny(text, [
      "ya tengo una feria definida",
      "ya se a que feria quiero ir",
      "ya sé a qué feria quiero ir",
      "quiero ir a una feria especifica",
      "quiero ir a una feria específica",
      "quiero asistir a una feria especifica",
      "quiero asistir a una feria específica",
      "ya elegi la feria",
      "ya elegí la feria",
      "tengo una feria en mente",
      "quiero asistir a canton fair",
      "quiero ir a canton fair",
      "quiero asistir a la feria de canton",
      "quiero ir a la feria de canton"
    ])
  ) {
    return "ferias_specific_fair";
  }

  // =========================
  // FERIAS - NO SABE QUÉ FERIA LE CONVIENE
  // =========================

  if (
    includesAny(text, [
      "no se que feria me conviene",
      "no sé qué feria me conviene",
      "no se a que feria ir",
      "no sé a qué feria ir",
      "no se cual feria elegir",
      "no sé cuál feria elegir",
      "quiero ir a una feria pero no se cual",
      "quiero ir a una feria pero no sé cuál",
      "aun no se que feria me conviene",
      "aún no sé qué feria me conviene",
      "necesito ayuda para elegir feria",
      "quiero ayuda para elegir una feria",
      "quiero saber que feria me conviene",
      "quiero saber qué feria me conviene"
    ])
  ) {
    return "ferias_no_specific_fair";
  }

  // =========================
  // FERIAS - BUSCA PRODUCTOS O PROVEEDORES
  // =========================

  if (
    includesAny(text, [
      "busco proveedores en ferias",
      "busco productos en ferias",
      "quiero buscar proveedores en ferias",
      "quiero buscar productos en ferias",
      "quiero encontrar proveedores en ferias",
      "quiero encontrar productos en ferias",
      "quiero ir a una feria para buscar proveedores",
      "quiero ir a una feria para buscar productos",
      "quiero conseguir proveedores en una feria",
      "quiero conseguir productos en una feria",
      "quiero buscar fabricantes en ferias",
      "quiero encontrar fabricantes en ferias",
      "ferias para buscar proveedores",
      "ferias para buscar fabricantes",
      "ferias para buscar productos"
    ])
  ) {
    return "ferias_supplier_search";
  }

  // =========================
  // FERIAS - IMPORTACIÓN / ALIANZAS / EXPLORACIÓN
  // =========================

  if (
    includesAny(text, [
      "quiero ir a una feria para importar",
      "quiero buscar productos para importar en ferias",
      "quiero usar ferias para importar",
      "quiero ir a ferias para importar"
    ])
  ) {
    return "ferias_import_goal";
  }

  if (
    includesAny(text, [
      "quiero buscar alianzas en ferias",
      "quiero buscar oportunidades de negocio en ferias",
      "quiero hacer networking en ferias",
      "quiero ir a una feria por alianzas",
      "quiero ir a una feria por oportunidades de negocio"
    ])
  ) {
    return "ferias_business_goal";
  }

  if (
    includesAny(text, [
      "solo estoy explorando ferias",
      "solo quiero explorar opciones de ferias",
      "estoy explorando ferias internacionales",
      "quiero explorar opciones de ferias internacionales"
    ])
  ) {
    return "ferias_exploration_goal";
  }

  // =========================
  // FERIAS - PRIMERA VEZ / EXPERIENCIA
  // =========================

  if (
    includesAny(text, [
      "seria mi primera vez asistiendo",
      "sería mi primera vez asistiendo",
      "seria mi primera vez en una feria internacional",
      "sería mi primera vez en una feria internacional",
      "nunca he asistido a una feria internacional",
      "primera vez en ferias internacionales"
    ])
  ) {
    return "ferias_first_time";
  }

  if (
    includesAny(text, [
      "ya he asistido a ferias internacionales",
      "ya fui a ferias internacionales",
      "tengo experiencia en ferias internacionales",
      "ya he ido a ferias internacionales"
    ])
  ) {
    return "ferias_experienced";
  }

  // =========================
  // FERIAS - PREPARACIÓN / REQUISITOS / PROCESO
  // =========================

  if (
    includesAny(text, [
      "que necesito para ir a una feria internacional",
      "qué necesito para ir a una feria internacional",
      "como prepararme para una feria internacional",
      "cómo prepararme para una feria internacional",
      "que debo hacer para asistir a una feria",
      "qué debo hacer para asistir a una feria",
      "requisitos para asistir a una feria internacional",
      "proceso para ir a una feria internacional",
      "pasos para asistir a una feria internacional",
      "como funciona el proceso para asistir a una feria",
      "cómo funciona el proceso para asistir a una feria"
    ])
  ) {
    return "ferias_process_question";
  }

  // =========================
  // FERIAS - SIGUIENTE PASO
  // =========================

  if (
    includesAny(text, [
      "como avanzar con ferias",
      "como sigo con ferias",
      "cual seria el siguiente paso en ferias",
      "cuál sería el siguiente paso en ferias",
      "quiero avanzar con ferias",
      "quiero seguir con ferias",
      "que debo hacer para avanzar con ferias",
      "qué debo hacer para avanzar con ferias",
      "como continuo con ferias",
      "cómo continúo con ferias",
      "que hago ahora con ferias",
      "qué hago ahora con ferias",
      "cual es el siguiente paso para una feria",
      "cuál es el siguiente paso para una feria"
    ])
  ) {
    return "ferias_next_step";
  }

  // =========================
  // FERIAS - AGENDAR
  // =========================

  if (
    includesAny(text, [
      "quiero agendar ferias",
      "quiero agendar para ferias",
      "agendar reunion ferias",
      "agendar reunión ferias",
      "quiero una llamada para ferias",
      "quiero hablar con alguien sobre ferias",
      "quiero coordinar una llamada sobre ferias",
      "quiero una reunion sobre ferias",
      "quiero una reunión sobre ferias",
      "quiero agendar una llamada para ferias",
      "quiero agendar una reunion para ferias",
      "quiero agendar una reunión para ferias"
    ])
  ) {
    return "ferias_schedule";
  }

  // =========================
  // FERIAS - TIPOS DE AYUDA / OPCIONES
  // =========================

  if (
    includesAny(text, [
      "que tipo de ayuda ofrecen para ferias",
      "que tipos de ayuda ofrecen para ferias",
      "que nivel de ayuda ofrecen para ferias",
      "que opciones tienen para ferias",
      "que opciones ofrecen para ferias",
      "que acompañamiento tienen para ferias",
      "que acompanamiento tienen para ferias",
      "como me pueden ayudar con ferias",
      "de que forma ayudan con ferias",
      "que apoyo ofrecen para ferias",
      "en que me ayudan con ferias",
      "en qué me ayudan con ferias"
    ])
  ) {
    return "ferias_help_options";
  }

  return null;
}

module.exports = { detectFeriasIntent };