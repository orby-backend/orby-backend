const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");
const leadsLogPath = path.join(logsDir, "leads.jsonl");
const errorsLogPath = path.join(logsDir, "errors.jsonl");
const customerQueriesLogPath = path.join(logsDir, "customer_queries.jsonl");

function ensureLogsDir() {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (error) {
    console.error("No se pudo crear la carpeta de logs:", error.message);
  }
}

function appendJsonLine(filePath, payload) {
  try {
    ensureLogsDir();

    const line = `${JSON.stringify(payload)}\n`;
    fs.appendFileSync(filePath, line, "utf8");
    return true;
  } catch (error) {
    console.error("Error escribiendo log:", error.message);
    return false;
  }
}

function buildBaseEvent(data = {}) {
  return {
    timestamp: new Date().toISOString(),
    phone: data.phone || null,
    module: data.module || null,
    event_type: data.event_type || "unknown",
    estado: data.estado || null,
    interes_principal: data.interes_principal || null,
    subopcion: data.subopcion || null,
    score: typeof data.score === "number" ? data.score : null,
    source: data.source || "backend",
    detail: data.detail || {}
  };
}

function logLeadEvent(data = {}) {
  const payload = buildBaseEvent(data);
  return appendJsonLine(leadsLogPath, payload);
}

function logCustomerQuery(data = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    phone: data.phone || null,
    module: data.module || "atencion_cliente",
    event_type: data.event_type || "customer_query",
    estado: data.estado || null,
    interes_principal: data.interes_principal || null,
    query: data.query || "",
    detail: data.detail || {}
  };

  return appendJsonLine(customerQueriesLogPath, payload);
}

function logErrorEvent(data = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    phone: data.phone || null,
    module: data.module || null,
    event_type: data.event_type || "error",
    estado: data.estado || null,
    interes_principal: data.interes_principal || null,
    incoming_message: data.incoming_message || null,
    error_message: data.error_message || "Error no especificado",
    stack: data.stack || null,
    detail: data.detail || {}
  };

  return appendJsonLine(errorsLogPath, payload);
}

module.exports = {
  logLeadEvent,
  logCustomerQuery,
  logErrorEvent
};