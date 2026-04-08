function normalizeText(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, patterns = []) {
  return patterns.some((pattern) => text.includes(pattern));
}

function detectPlan(text = "") {
  if (
    includesAny(text, [
      "premium",
      "membresia premium",
      "mebresia premium",
      "plan premium"
    ])
  ) {
    return "premium";
  }

  if (
    includesAny(text, [
      "profesional",
      "professional",
      "membresia profesional",
      "membresia professional",
      "mebresia profesional",
      "mebresia professional",
      "plan profesional",
      "plan professional"
    ])
  ) {
    return "profesional";
  }

  if (
    includesAny(text, [
      "basico",
      "membresia basica",
      "mebresia basica",
      "plan basico"
    ])
  ) {
    return "basico";
  }

  return null;
}

module.exports = {
  normalizeText,
  includesAny,
  detectPlan
};