import { loadCutSettings } from "./services/loadCutSettings";
import { createBookFolder } from "./services/createBookFolder";

function main() {
  const cutSettings = loadCutSettings();

  if (!cutSettings) return;

  createBookFolder(cutSettings.book.toLowerCase());

  console.log(cutSettings);
}

main();
