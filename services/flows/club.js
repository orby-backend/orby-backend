const {
  logLeadEvent,
  logErrorEvent
} = require("../logger");

const CLUB_GENERAL_LINK =
  "https://oneorbix.com/club-de-exportadores-e-importadores-oneorbix/";

// ========================================================
// HELPERS DE TEXTO
// ========================================================
function capitalizeText(text = "") {
  const value = String(text || "").trim();
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getUserInput(message, cleanMessage) {
  const raw = String(message || "").trim();
  if (raw) return raw;
  return String(cleanMessage || "").trim();
}

function buildPlanLine(plan) {
  if (!plan) return "";
  return `• ${plan.nombre} — ${plan.precio}\nVer más: ${plan.link}\nComprar ahora: ${plan.payLink}`;
}

function buildPlansOverviewReply(memberships, intro = "") {
  return `${intro}

Estos son los planes disponibles del Club de Importadores OneOrbix:

${buildPlanLine(memberships?.basico)}

${buildPlanLine(memberships?.profesional)}

${buildPlanLine(memberships?.premium)}

También puedes ver la información general aquí:
${CLUB_GENERAL_LINK}`;
}

function buildPlanChoiceCTA() {
  return `Si quieres, responde:

1️⃣ Ver planes disponibles
2️⃣ Recomiéndame un plan según mi caso`;
}

function buildGeneralClubInfoReply() {
  return `Claro. Te explico cómo funciona el Club de Importadores OneOrbix de forma simple:

Es una membresía pensada para ayudarte a importar con acompañamiento real, evitando errores comunes y tomando decisiones más sólidas desde el inicio.

Dentro del club trabajamos en:

- búsqueda y validación de proveedores
- simulación de costos de importación
- logística desde origen hasta destino
- acceso a carga consolidada
- asesoría paso a paso según tu caso

La idea no es que avances a ciegas, sino con más claridad, mejor estructura y apoyo durante el proceso.

Puedes conocer más aquí:
${CLUB_GENERAL_LINK}

${buildPlanChoiceCTA()}`;
}

function buildAmazonFBAReply(memberships) {
  return `Bien. Si tu objetivo es vender en Amazon FBA, el club puede ayudarte a elegir mejor, estructurar el proceso y reducir errores antes de mover dinero.

Estas son las membresías disponibles:

${buildPlanLine(memberships?.basico)}

${buildPlanLine(memberships?.profesional)}

${buildPlanLine(memberships?.premium)}

También puedes revisar la página general del club aquí:
${CLUB_GENERAL_LINK}

Si quieres continuar, responde:

1️⃣ Recomiéndame el mejor plan para Amazon FBA
2️⃣ Volver al menú principal`;
}

function buildEcuadorSellReply(memberships) {
  return `Entiendo. Si quieres importar para vender en Ecuador, el club puede ayudarte a avanzar con más estructura, mejor criterio y menos improvisación.

Estas son las membresías disponibles:

${buildPlanLine(memberships?.basico)}

${buildPlanLine(memberships?.profesional)}

${buildPlanLine(memberships?.premium)}

También puedes revisar la página general del club aquí:
${CLUB_GENERAL_LINK}

Si quieres continuar, responde:

1️⃣ Recomiéndame el mejor plan para vender en Ecuador
2️⃣ Volver al menú principal`;
}

function buildCourierIntroReply() {
  return `Perfecto. El servicio de casillero funciona de forma simple:

- compras en cualquier tienda internacional
- envías el producto a tu dirección en el exterior
- nosotros lo recibimos, consolidamos y lo enviamos a Ecuador

Este formato suele funcionar muy bien para productos pequeños, compras personales y envíos rápidos.

Si quieres, dime qué producto deseas traer y te ayudamos a estimar mejor el escenario 👇`;
}

function buildCourierProductReply(userInput) {
  const product = capitalizeText(userInput);

  return `Bien. Para un producto como "${product}", lo primero es revisar:

- peso aproximado
- tamaño
- valor del producto
- país de origen

Con esos datos ya se puede estimar mejor si te conviene traerlo por courier o casillero, y si existe una forma más eficiente de hacerlo.

Si luego quieres avanzar con acompañamiento más estructurado, el club también puede ayudarte a tomar mejores decisiones de compra y logística.

Ver más sobre el club:
${CLUB_GENERAL_LINK}

${buildPlanChoiceCTA()}`;
}

function buildSpecificImportChoiceReply() {
  return `Perfecto. Para orientarte mejor, dime:

1️⃣ Ya tengo el producto definido
2️⃣ Necesito ayuda para encontrar proveedor`;
}

function buildSpecificDefinedReply() {
  return `Excelente. Eso acelera mucho el proceso.

En ese punto podemos ayudarte con:

- revisión inicial del caso
- cálculo estimado de costos
- orientación logística para traerlo a Ecuador

Para avanzar, envíame:

- nombre o link del producto
- país de origen, si lo sabes
- cantidad aproximada

y te doy una orientación inicial 👇`;
}

function buildSpecificDefinedProductReply(userInput, memberships) {
  const product = capitalizeText(userInput);

  return `Bien. Para un producto como "${product}", lo importante es revisar con cuidado:

- proveedor
- condiciones de compra
- costos logísticos
- forma más eficiente de importarlo

Si tu objetivo es avanzar con apoyo más estructurado, normalmente el ${memberships?.profesional?.nombre} suele encajar muy bien, porque te da herramientas, asesoría y acompañamiento práctico para ejecutar con más claridad.

Ver detalles:
${memberships?.profesional?.link}

Comprar ahora:
${memberships?.profesional?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildSpecificSupplierReply() {
  return `Tiene sentido. Podemos ayudarte a buscar proveedores más confiables y evaluar opciones según el tipo de producto que necesitas.

Para empezar, dime:

👉 qué producto estás buscando importar

y te orientamos sobre los siguientes pasos 👇`;
}

function buildSpecificSupplierProductReply(userInput, memberships) {
  const product = capitalizeText(userInput);

  return `Perfecto. Si estás buscando importar "${product}", el siguiente paso es identificar proveedores más confiables y evaluar si la operación realmente tiene sentido para tu caso.

En escenarios así, normalmente el ${memberships?.profesional?.nombre} suele ser una muy buena opción porque incluye acompañamiento más práctico para avanzar con mayor claridad.

Ver detalles:
${memberships?.profesional?.link}

Comprar ahora:
${memberships?.profesional?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildExploringSuggestionsChoiceReply() {
  return `Perfecto. Para darte mejores sugerencias, dime:

1️⃣ Quiero vender en Ecuador
2️⃣ Quiero vender en Amazon
3️⃣ Quiero opciones para ambos`;
}

function buildEcuadorIdeasReply() {
  return `Bien. Para vender en Ecuador, suelen funcionar mejor productos que sean:

- de uso cotidiano
- fáciles de vender en redes o marketplaces
- de buena rotación
- con margen atractivo

Algunas categorías interesantes para explorar pueden ser:

- accesorios para celular
- productos para hogar y organización
- artículos para mascotas
- productos fitness pequeños
- iluminación decorativa
- gadgets prácticos

Si quieres, también puedo orientarte según tu presupuesto o tipo de cliente.`;
}

function buildAmazonIdeasReply() {
  return `Claro. Para Amazon conviene enfocarse en productos que sean:

- ligeros
- fáciles de enviar
- con demanda constante
- sin restricciones complejas

Algunas categorías interesantes para evaluar son:

- organizadores
- accesorios de cocina
- productos fitness compactos
- accesorios de viaje
- artículos de oficina
- productos para mascotas

Si quieres, también puedo orientarte sobre qué tipo de producto suele convenir más según inversión y competencia.`;
}

function buildBothMarketsIdeasReply() {
  return `Buena dirección. Si estás evaluando opciones para ambos mercados, lo ideal es separar bien la estrategia:

Para Ecuador suelen funcionar productos de rotación rápida y venta práctica.
Para Amazon convienen productos ligeros, fáciles de enviar y con demanda más estable.

Si quieres, puedo ayudarte a definir cuál mercado te conviene más según tu presupuesto, experiencia y tipo de producto.`;
}

function buildProductGuidanceReply() {
  return `Elegir bien el producto cambia por completo el resultado.

Para tomar una buena decisión conviene considerar:

- inversión disponible
- facilidad de importación
- competencia
- canal de venta (Ecuador o Amazon)

Si quieres, dime:

👉 cuánto te gustaría invertir

y te orientamos mejor 👇`;
}

function buildValidatedStartReply() {
  return `Muy bien. Si ya tienes el producto validado, el siguiente paso es estructurar bien el proceso para importar y vender sin errores evitables.

Para orientarte mejor, dime:

👉 ¿Qué producto específico quieres importar?
(puedes enviarme el nombre o el link)

Con eso puedo decirte:

- qué debes revisar antes de comprar
- cómo calcular costos
- y qué tipo de acompañamiento te conviene según tu caso 👇`;
}

function buildValidatedStartProductReply(userInput, memberships) {
  const product = capitalizeText(userInput);

  return `Perfecto. Para un producto como "${product}", lo más importante es:

- validar proveedor correctamente
- calcular costos reales
- definir estrategia de compra
- revisar la logística adecuada

En tu caso, el plan que mejor suele encajar es:

👉 ${memberships?.profesional?.nombre}

porque incluye:

- asesoría personalizada
- simulación de costos
- verificación de proveedores
- acompañamiento paso a paso

Ver detalles:
${memberships?.profesional?.link}

Comprar ahora:
${memberships?.profesional?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildValidatedHelpReply() {
  return `Cuando ya tienes el producto validado, el valor del club no está solo en aprender, sino en ayudarte a ejecutar con más claridad, menos errores y mejor estructura.

Dentro del club puedes apoyarte en:

- revisión del caso
- simulación de costos
- orientación logística
- acompañamiento para tomar mejores decisiones

${buildPlanChoiceCTA()}`;
}

function buildCostsActionReply() {
  return `Aquí es donde muchos importadores pierden margen sin darse cuenta.

En el Club de Importadores OneOrbix podemos ayudarte a optimizar:

- costos de compra y negociación con proveedores
- costos logísticos desde China
- estructura de importación para mejorar márgenes

Además, cuando trabajas con carga consolidada, puedes reducir significativamente el costo por unidad.

Para orientarte mejor, dime:

👉 ¿Qué producto estás importando actualmente?
(puedes enviarme el nombre o un link)

Con eso te doy una referencia inicial de mejoras posibles 👇`;
}

function buildCostsActionProductReply(userInput, memberships) {
  const product = capitalizeText(userInput);

  return `Perfecto. Para un producto como "${product}", normalmente se puede optimizar:

- selección de proveedor
- condiciones de compra
- tipo de envío
- consolidación de carga

En tu caso, el plan que mejor suele encajar es:

👉 ${memberships?.premium?.nombre}

porque incluye:

- asesoría continua
- acompañamiento más estratégico
- análisis más profundo de proveedores y costos
- apoyo para mejorar logística y ejecución

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildCostsValueReply() {
  return `Exacto. Cuando ya estás importando, el valor del club no está en empezar de cero, sino en ayudarte a importar mejor.

Muchos importadores logran:

- reducir costos logísticos
- mejorar condiciones con proveedores
- aumentar márgenes
- evitar errores costosos

Si quieres, puedo orientarte según tu caso y ver qué plan tendría más sentido.

${buildPlanChoiceCTA()}`;
}

function buildLogisticsControlReply() {
  return `Entiendo. Cuando ya estás importando, uno de los mayores problemas suele ser la falta de control sobre tiempos, coordinación y visibilidad del proceso.

Podemos ayudarte a:

- mejorar la planificación de envíos
- reducir retrasos
- tener mayor visibilidad de tu operación
- optimizar la logística desde origen hasta destino

Además, cuando trabajas con carga consolidada, puedes reducir costos y mejorar eficiencia.

Para orientarte mejor, dime:

👉 ¿Cómo estás trayendo actualmente tu producto?
(aéreo, marítimo, courier, etc.)`;
}

function buildLogisticsControlModeReply(userInput, memberships) {
  const mode = capitalizeText(userInput);

  return `Perfecto. Si actualmente estás trabajando con "${mode}", seguramente hay puntos de mejora en coordinación, tiempos o estructura de operación.

Si buscas optimizar tu logística de forma más ordenada, el club está diseñado justo para ese punto.

👉 El plan que suele ser más recomendable en estos casos es el ${memberships?.premium?.nombre}, porque te permite:

- optimizar logística de forma continua
- mejorar coordinación de envíos
- reducir tiempos y costos
- trabajar con procesos más eficientes

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildLogisticsReviewReply() {
  return `Muy buena observación. Cuando ya estás importando, muchas veces el problema no está en el producto, sino en cómo se está gestionando la logística.

Ahí es donde se suele perder tiempo y dinero.

Normalmente revisamos:

- cómo estás coordinando tus envíos
- qué tipo de transporte estás usando
- si estás consolidando correctamente la carga
- y cómo estás gestionando los tiempos

Con pequeños ajustes, se puede mejorar bastante la eficiencia.

Si quieres, cuéntame:

👉 cómo estás manejando actualmente tu logística

y te doy una orientación inicial 👇`;
}

function buildLogisticsReviewContextReply(userInput, memberships) {
  const context = capitalizeText(userInput);

  return `Perfecto. Si actualmente estás manejando tu logística de esta forma: "${context}", seguramente hay puntos de mejora en organización, seguimiento o estructura.

Si buscas ordenar mejor la operación y reducir errores en el proceso, el ${memberships?.premium?.nombre} suele ser el plan más recomendado para este tipo de caso.

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildPlanRecommendationReply(user, memberships) {
  const context = user?.club_context || "";
  const professional = memberships?.profesional;
  const premium = memberships?.premium;

  if (
    [
      "amazon_fba",
      "validated_product",
      "specific_import",
      "supplier_search",
      "sell_ecuador"
    ].includes(context)
  ) {
    return `Por lo que me has compartido, el plan que mejor suele ajustarse a tu caso es:

👉 ${professional?.nombre}

porque te da más estructura, herramientas y acompañamiento práctico para avanzar con claridad.

Ver detalles:
${professional?.link}

Comprar ahora:
${professional?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
  }

  if (
    [
      "costs_optimization",
      "logistics_control",
      "logistics_review",
      "experienced_importer",
      "business_structure"
    ].includes(context)
  ) {
    return `Por el tipo de necesidad que estás describiendo, el plan que mejor suele ajustarse a tu caso es:

👉 ${premium?.nombre}

porque está pensado para quienes ya están importando y quieren optimizar costos, logística y operación con más acompañamiento.

Ver detalles:
${premium?.link}

Comprar ahora:
${premium?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
  }

  return `Si estás empezando o todavía estás aterrizando mejor tu proceso, normalmente el plan que más suele equilibrar claridad y acompañamiento es:

👉 ${professional?.nombre}

Ver detalles:
${professional?.link}

Comprar ahora:
${professional?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`;
}

function buildHiddenExploringReply() {
  return `Perfecto. Cuando quieras revisar tu caso con más claridad, aquí estaremos para orientarte.`;
}

// ========================================================
// HELPERS DE ESTADO / LOGS
// ========================================================
function saveAndLog({
  phone,
  user,
  saveUser,
  eventType,
  detail = {}
}) {
  saveUser(phone, user);

  try {
    logLeadEvent({
      phone,
      module: "club",
      event_type: eventType,
      estado: user.estado,
      interes_principal: user.interes_principal,
      subopcion: user.subopcion,
      score: user.score,
      detail
    });
  } catch (error) {
    console.error("Error registrando log club:", error.message);
  }
}

function moveToState({
  phone,
  user,
  saveUser,
  nextState,
  detail = {},
  eventType = "flow_step"
}) {
  user.estado = nextState;
  saveAndLog({
    phone,
    user,
    saveUser,
    eventType,
    detail
  });
}

// ========================================================
// FLOW CLUB
// ========================================================
function handleClubFlow({
  user,
  phone,
  cleanMessage,
  message,
  saveUser,
  classifyLead,
  getClubCaso1,
  getClubCaso2,
  getClubCaso3,
  getClubInfoGeneralReply,
  getClubPreguntaFinal,
  getLeadTibioReply,
  getLeadCuriosoReply,
  getClubLeadQualifiedReply,
  memberships
}) {
  try {
    const userInput = getUserInput(message, cleanMessage);

    // =====================================================
    // CLUB - PASO 1
    // =====================================================
    if (user.estado === "club_p1") {
      if (cleanMessage === "1") {
        user.subopcion = "cero";
        moveToState({
          phone,
          user,
          saveUser,
          nextState: "club_p2",
          detail: {
            selected_option: "1",
            branch: "desde_cero"
          }
        });

        return {
          reply: getClubCaso1(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.subopcion = "idea_producto";
        moveToState({
          phone,
          user,
          saveUser,
          nextState: "club_p2",
          detail: {
            selected_option: "2",
            branch: "idea_producto"
          }
        });

        return {
          reply: getClubCaso2(),
          source: "backend"
        };
      }

      if (cleanMessage === "3") {
        user.subopcion = "ya_importo";
        moveToState({
          phone,
          user,
          saveUser,
          nextState: "club_p2",
          detail: {
            selected_option: "3",
            branch: "ya_importo"
          }
        });

        return {
          reply: getClubCaso3(),
          source: "backend"
        };
      }

      if (cleanMessage === "4") {
        user.club_context = "general_info";
        moveToState({
          phone,
          user,
          saveUser,
          nextState: "club_info_general",
          detail: {
            selected_option: "4",
            branch: "general_info"
          }
        });

        return {
          reply: buildGeneralClubInfoReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1️⃣, 2️⃣, 3️⃣ o 4️⃣.",
        source: "backend"
      };
    }

    // =====================================================
    // CLUB - PASO 2
    // =====================================================
    if (user.estado === "club_p2") {
      // ---------------------------------
      // DESDE CERO
      // ---------------------------------
      if (user.subopcion === "cero") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.club_context = "sell";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "1",
              sub_branch: "sell"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Quiero vender en Ecuador
2️⃣ Quiero vender en Amazon FBA`,
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          user.club_context = "personal_use";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "2",
              sub_branch: "personal_use"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Quiero traer productos pequeños (casillero / courier)
2️⃣ Quiero importar algo específico para mi negocio o uso personal`,
            source: "backend"
          };
        }

        if (cleanMessage === "3") {
          user.score += 0;
          user.club_context = "exploring_ideas";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "3",
              sub_branch: "exploring_ideas"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Sugerencias de productos
2️⃣ Quiero entender mejor qué producto me conviene`,
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣, 2️⃣ o 3️⃣.",
          source: "backend"
        };
      }

      // ---------------------------------
      // YA TENGO IDEA DE PRODUCTO
      // ---------------------------------
      if (user.subopcion === "idea_producto") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.club_context = "validated_product";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "1",
              sub_branch: "validated_product"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ ¿Cómo puedo empezar?
2️⃣ ¿Cómo me ayudaría el club en mi caso?`,
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 2;
          user.club_context = "need_validation";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "2",
              sub_branch: "need_validation"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Quiero validar si mi idea tiene potencial
2️⃣ Quiero entender qué debo revisar antes de importar`,
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      // ---------------------------------
      // YA IMPORTO
      // ---------------------------------
      if (user.subopcion === "ya_importo") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.club_context = "costs_optimization";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "1",
              sub_branch: "costs_optimization"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Quiero optimizar costos y logística
2️⃣ ¿Cómo me ayudaría el club en mi caso específico?`,
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 3;
          user.club_context = "logistics_control";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "2",
              sub_branch: "logistics_control"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Quiero mejorar tiempos y control logístico
2️⃣ Quiero revisar si estoy gestionando bien mi logística actual`,
            source: "backend"
          };
        }

        if (cleanMessage === "3") {
          user.score += 3;
          user.club_context = "business_structure";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_p3",
            detail: {
              selected_option: "3",
              sub_branch: "business_structure"
            }
          });

          return {
            reply: `Ahora dime:

1️⃣ Quiero estructurar mi operación con más claridad
2️⃣ Quiero ver qué plan puede ayudarme mejor`,
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣, 2️⃣ o 3️⃣.",
          source: "backend"
        };
      }
    }

    // =====================================================
    // CLUB - PASO 3
    // =====================================================
    if (user.estado === "club_p3") {
      if (user.club_context === "sell") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.club_context = "sell_ecuador";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_sell_ecuador",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: buildEcuadorSellReply(memberships),
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 3;
          user.club_context = "amazon_fba";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_sell_amazon",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: buildAmazonFBAReply(memberships),
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "personal_use") {
        if (cleanMessage === "1") {
          user.score += 3;
          user.club_context = "courier";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_personal_courier_waiting_product",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: buildCourierIntroReply(),
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          user.club_context = "specific_import";
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_personal_specific_choice",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: buildSpecificImportChoiceReply(),
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "exploring_ideas") {
        if (cleanMessage === "1") {
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_exploring_suggestions_market",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: buildExploringSuggestionsChoiceReply(),
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_exploring_product_guidance",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: buildProductGuidanceReply(),
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "validated_product") {
        if (cleanMessage === "1") {
          user.score += 3;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_validated_start_waiting_product",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: buildValidatedStartReply(),
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_validated_help",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: buildValidatedHelpReply(),
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "need_validation") {
        if (cleanMessage === "1") {
          user.score += 3;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_need_validation_potential",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: `Aquí es donde muchos fallan al importar 👇

Para validar si tu idea tiene potencial, lo más importante es revisar:

- demanda real
- facilidad de importación
- margen posible
- nivel de competencia

Si quieres, dime qué producto tienes en mente y te orientamos mejor.`,
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_need_validation_review",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: `Antes de importar, conviene tener claras cinco cosas:

- si el producto realmente tiene sentido comercial
- costos reales
- proveedor adecuado
- logística correcta
- nivel de riesgo

Si quieres, también puedo orientarte sobre qué plan del club encaja mejor con tu caso.

${buildPlanChoiceCTA()}`,
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "costs_optimization") {
        if (cleanMessage === "1") {
          user.score += 3;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_costs_action_waiting_product",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: buildCostsActionReply(),
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_costs_value",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: buildCostsValueReply(),
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "logistics_control") {
        if (cleanMessage === "1") {
          user.score += 3;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_logistics_control_waiting_mode",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: buildLogisticsControlReply(),
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_logistics_review_waiting_context",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: buildLogisticsReviewReply(),
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }

      if (user.club_context === "business_structure") {
        if (cleanMessage === "1") {
          user.score += 3;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_business_structure_action",
            detail: {
              selected_option: "1"
            }
          });

          return {
            reply: `Perfecto. Si ya importas y quieres estructurar mejor tu operación, el siguiente paso es ordenar compras, logística, márgenes y decisiones comerciales.

Si quieres, cuéntame:

👉 qué producto importas actualmente
👉 y cuál es el principal problema que quieres resolver

Con eso te doy una orientación inicial 👇`,
            source: "backend"
          };
        }

        if (cleanMessage === "2") {
          user.score += 1;
          moveToState({
            phone,
            user,
            saveUser,
            nextState: "club_business_structure_plan",
            detail: {
              selected_option: "2"
            }
          });

          return {
            reply: `En esta etapa, normalmente el plan más recomendable suele ser el ${memberships?.premium?.nombre}, porque te permite trabajar la operación con más estructura y acompañamiento continuo.

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`,
            source: "backend"
          };
        }

        return {
          reply: "Por favor responde con 1️⃣ o 2️⃣.",
          source: "backend"
        };
      }
    }

    // =====================================================
    // ESTADOS POSTERIORES / ESPERA DE INFORMACIÓN
    // =====================================================

    if (user.estado === "club_info_general") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: buildPlanChoiceCTA(),
        source: "backend"
      };
    }

    if (user.estado === "club_sell_ecuador") {
      if (cleanMessage === "1") {
        user.club_context = "sell_ecuador";
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "menu_enviado";
        user.interes_principal = null;
        user.subopcion = null;
        user.club_context = null;
        saveUser(phone, user);

        return {
          reply: `Perfecto 👌

${require("../menu").getMenu()}`,
          source: "backend"
        };
      }

      return {
        reply: `Si quieres continuar, responde:

1️⃣ Recomiéndame el mejor plan para vender en Ecuador
2️⃣ Volver al menú principal`,
        source: "backend"
      };
    }

    if (user.estado === "club_sell_amazon") {
      if (cleanMessage === "1") {
        user.club_context = "amazon_fba";
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.estado = "menu_enviado";
        user.interes_principal = null;
        user.subopcion = null;
        user.club_context = null;
        saveUser(phone, user);

        return {
          reply: `Perfecto 👌

${require("../menu").getMenu()}`,
          source: "backend"
        };
      }

      return {
        reply: `Si quieres continuar, responde:

1️⃣ Recomiéndame el mejor plan para Amazon FBA
2️⃣ Volver al menú principal`,
        source: "backend"
      };
    }

    if (user.estado === "club_personal_courier_waiting_product") {
      moveToState({
        phone,
        user,
        saveUser,
        nextState: "club_personal_courier_result",
        detail: {
          captured_input: userInput
        }
      });

      return {
        reply: buildCourierProductReply(userInput),
        source: "backend"
      };
    }

    if (user.estado === "club_personal_courier_result") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.club_context = "personal_use";
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1️⃣ o 2️⃣.",
        source: "backend"
      };
    }

    if (user.estado === "club_personal_specific_choice") {
      if (cleanMessage === "1") {
        moveToState({
          phone,
          user,
          saveUser,
          nextState: "club_personal_specific_defined_waiting_product",
          detail: {
            selected_option: "1"
          }
        });

        return {
          reply: buildSpecificDefinedReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        moveToState({
          phone,
          user,
          saveUser,
          nextState: "club_personal_specific_supplier_waiting_product",
          detail: {
            selected_option: "2"
          }
        });

        return {
          reply: buildSpecificSupplierReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1️⃣ o 2️⃣.",
        source: "backend"
      };
    }

    if (user.estado === "club_personal_specific_defined_waiting_product") {
      return {
        reply: buildSpecificDefinedProductReply(userInput, memberships),
        source: "backend"
      };
    }

    if (user.estado === "club_personal_specific_supplier_waiting_product") {
      return {
        reply: buildSpecificSupplierProductReply(userInput, memberships),
        source: "backend"
      };
    }

    if (user.estado === "club_exploring_suggestions_market") {
      if (cleanMessage === "1") {
        return {
          reply: buildEcuadorIdeasReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        return {
          reply: buildAmazonIdeasReply(),
          source: "backend"
        };
      }

      if (cleanMessage === "3") {
        return {
          reply: buildBothMarketsIdeasReply(),
          source: "backend"
        };
      }

      return {
        reply: "Por favor responde con 1️⃣, 2️⃣ o 3️⃣.",
        source: "backend"
      };
    }

    if (user.estado === "club_exploring_product_guidance") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: `Perfecto. Con un presupuesto aproximado de "${userInput}", ya se puede aterrizar mejor qué tipo de producto podría convenirte según mercado, competencia y logística.

Si quieres, también puedo ayudarte a revisar los planes del club:

1️⃣ Ver planes disponibles
2️⃣ Recomiéndame un plan según mi caso`,
        source: "backend"
      };
    }

    if (user.estado === "club_validated_start_waiting_product") {
      return {
        reply: buildValidatedStartProductReply(userInput, memberships),
        source: "backend"
      };
    }

    if (user.estado === "club_validated_help") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.club_context = "validated_product";
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: buildPlanChoiceCTA(),
        source: "backend"
      };
    }

    if (user.estado === "club_need_validation_potential") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: `Perfecto. Para una idea como "${capitalizeText(userInput)}", lo más importante es revisar si el producto tiene sentido comercial, margen suficiente y una logística manejable.

Si quieres apoyo para avanzar con más claridad, el club puede ayudarte en ese proceso.

${buildPlanChoiceCTA()}`,
        source: "backend"
      };
    }

    if (user.estado === "club_need_validation_review") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.club_context = "validated_product";
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: buildPlanChoiceCTA(),
        source: "backend"
      };
    }

    if (user.estado === "club_costs_action_waiting_product") {
      return {
        reply: buildCostsActionProductReply(userInput, memberships),
        source: "backend"
      };
    }

    if (user.estado === "club_costs_value") {
      if (cleanMessage === "1") {
        return {
          reply: buildPlansOverviewReply(
            memberships,
            "Perfecto. Aquí tienes los planes disponibles del Club de Importadores OneOrbix:"
          ),
          source: "backend"
        };
      }

      if (cleanMessage === "2") {
        user.club_context = "costs_optimization";
        return {
          reply: buildPlanRecommendationReply(user, memberships),
          source: "backend"
        };
      }

      return {
        reply: buildPlanChoiceCTA(),
        source: "backend"
      };
    }

    if (user.estado === "club_logistics_control_waiting_mode") {
      return {
        reply: buildLogisticsControlModeReply(userInput, memberships),
        source: "backend"
      };
    }

    if (user.estado === "club_logistics_review_waiting_context") {
      return {
        reply: buildLogisticsReviewContextReply(userInput, memberships),
        source: "backend"
      };
    }

    if (user.estado === "club_business_structure_action") {
      return {
        reply: `Perfecto. Con una operación como la que describes ("${capitalizeText(
          userInput
        )}"), lo más importante es ordenar mejor compras, logística, costos y márgenes.

En este tipo de caso, el plan que más suele encajar es:

👉 ${memberships?.premium?.nombre}

porque te permite trabajar tu operación con más estructura y acompañamiento continuo.

Ver detalles:
${memberships?.premium?.link}

Comprar ahora:
${memberships?.premium?.payLink}

También puedes revisar la página general del club:
${CLUB_GENERAL_LINK}`,
        source: "backend"
      };
    }

    if (user.estado === "club_business_structure_plan") {
      return {
        reply: buildPlanRecommendationReply(
          { ...user, club_context: "experienced_importer" },
          memberships
        ),
        source: "backend"
      };
    }

    return null;
  } catch (error) {
    console.error("Error en handleClubFlow:", error);

    try {
      logErrorEvent({
        phone,
        module: "club",
        estado: user?.estado || null,
        interes_principal: user?.interes_principal || null,
        incoming_message: cleanMessage || null,
        error_message: error.message,
        stack: error.stack,
        detail: {
          flow: "club"
        }
      });
    } catch (logErr) {
      console.error("Error registrando log de error club:", logErr.message);
    }

    return {
      reply: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
      source: "backend"
    };
  }
}

module.exports = {
  handleClubFlow
};