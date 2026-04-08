const { saveUser } = require('../state');
const menu = require('../menu');
const { CALENDLY_LINK } = require("../gemini");

/**
 * Módulo Digital: Ecommerce, IA y Crecimiento.
 * Basado en la arquitectura de ferias.js para asegurar capas de contacto funcionales.
 */
function handleDigitalFlow(message, user, phone) {
  const cleanMessage = message.trim();

  // ========================================================
  // 1. CAPA DE CONTACTO ACTIVA (Mismo comportamiento que Ferias/Exportación)
  // ========================================================
  if (user.estado === "digital_lead_calificado") {
    
    // OPCIÓN 1: Orientación con Asesor (Confirmar número)
    if (cleanMessage === "1") {
      user.estado = "exportacion_asesor_confirmar_numero"; // Reutilizamos lógica de app.js
      saveUser(phone, user);
      return { 
        reply: `Perfecto. ¿Deseas que uno de nuestros asesores te contacte a este mismo número?\n\n${phone}\n\n1️⃣ Sí, a este número\n2️⃣ No, quiero dar otro número`, 
        source: "backend" 
      };
    }

    // OPCIÓN 2: Agendar Reunión (Calendly)
    if (cleanMessage === "2") {
      user.estado = "finalizado";
      saveUser(phone, user);
      return { 
        reply: `Excelente decisión. Aquí tienes el enlace para agendar tu reunión sobre Ecommerce e IA:\n\n${CALENDLY_LINK}\n\nReserva el espacio que mejor te convenga para revisar tu proyecto.`, 
        source: "backend" 
      };
    }
  }

  // =========================
  // PASO 1: SUB-OPCIONES
  // =========================
  if (user.estado === "digital_p1") {
    const options = {
      "1": { estado: "digital_crear_p2", sub: "crear_tienda", reply: menu.getDigitalCrearTiendaPaso2() },
      "2": { estado: "digital_mejorar_p2", sub: "mejorar_tienda", reply: menu.getDigitalMejorarTiendaPaso2() },
      "3": { estado: "digital_ia_p2", sub: "ia_automatizacion", reply: menu.getDigitalIAPaso2() },
      "4": { estado: "digital_marketing_p2", sub: "marketing_ventas", reply: menu.getDigitalMarketingPaso2() }
    };

    if (options[cleanMessage]) {
      user.estado = options[cleanMessage].estado;
      user.subopcion = options[cleanMessage].sub;
      saveUser(phone, user);
      return { reply: options[cleanMessage].reply, source: "backend" };
    }
    if (cleanMessage === "5") {
      return { reply: menu.getDigitalInfoGeneral(), source: "backend" };
    }
    return { reply: "Por favor, elige una opción del 1 al 5.", source: "backend" };
  }

  // =========================
  // PASO 2: SELECCIÓN TÉCNICA
  // =========================
  const step2Match = user.estado.match(/digital_(crear|mejorar|ia|marketing)_p2/);
  if (step2Match) {
    const sub = step2Match[1];
    if (["1", "2", "3", "4"].includes(cleanMessage)) {
      user.score = (user.score || 0) + 3;
      user.estado = `digital_${sub}_p3`;
      saveUser(phone, user);

      const nextSteps = {
        crear: menu.getDigitalCrearTiendaPaso3(),
        mejorar: menu.getDigitalMejorarTiendaPaso3(),
        ia: menu.getDigitalIAPaso3(),
        marketing: menu.getDigitalMarketingPaso3()
      };
      return { reply: nextSteps[sub], source: "backend" };
    }
    return { reply: "Elige una opción numérica para continuar.", source: "backend" };
  }

  // ==========================================
  // PASO 3: CIERRE Y SALTO A CAPA CONTACTO
  // ==========================================
  if (user.estado.includes("_p3")) {
    if (["1", "2", "3"].includes(cleanMessage)) {
      user.score += 5;
      
      // CRÍTICO: Saltamos al estado que escucha las opciones 1 y 2 de contacto
      user.estado = "digital_lead_calificado"; 
      saveUser(phone, user);
      
      const finalMessage = `He analizado tu perfil y estás en un punto ideal para escalar con nuestras soluciones digitales.\n\n${menu.getLeadCalificadoReply()}`;
      return { reply: finalMessage, source: "backend" };
    }
    return { reply: "Por favor, selecciona una opción para avanzar.", source: "backend" };
  }

  return null;
}

module.exports = { handleDigitalFlow };