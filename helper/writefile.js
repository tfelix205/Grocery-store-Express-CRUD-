const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../db/database.json");

const writeFile = async (data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
};

module.exports = writeFile;
