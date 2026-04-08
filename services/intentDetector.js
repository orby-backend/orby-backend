const { normalizeText } = require("./intents/utils");
const { detectImportacionIntent } = require("./intents/importacion");
const { detectAmazonIntent } = require("./intents/amazon");
const { detectExportacionIntent } = require("./intents/exportacion");
const { detectClubIntent } = require("./intents/club");
const { detectDigitalIntent } = require("./intents/digital");

function detectIntent(message = "") {
  const text = normalizeText(message);

  const importIntent = detectImportacionIntent(text);
  if (importIntent) return importIntent;

  const amazonIntent = detectAmazonIntent(text);
  if (amazonIntent) return amazonIntent;

  const exportIntent = detectExportacionIntent(text);
  if (exportIntent) return exportIntent;

  const clubIntent = detectClubIntent(text);
  if (clubIntent) return clubIntent;

  const digitalIntent = detectDigitalIntent(text);
  if (digitalIntent) return digitalIntent;

  return "general_service_question";
}

module.exports = { detectIntent };