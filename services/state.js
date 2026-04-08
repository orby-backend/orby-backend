const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");

function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }
}

function readUsers() {
  ensureFile();
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "{}");
}

function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

function getUser(phone) {
  const users = readUsers();
  return users[phone] || null;
}

function saveUser(phone, userData) {
  const users = readUsers();
  users[phone] = userData;
  writeUsers(users);
}

function resetUser(phone) {
  const users = readUsers();
  delete users[phone];
  writeUsers(users);
}

module.exports = {
  getUser,
  saveUser,
  resetUser
};