import { loadCutSettings } from "./loadCutSettings";
import { createBookFolder } from "./createBookFolder";

function main() {
  const cutSettings = loadCutSettings();

  if (!cutSettings) return;

  createBookFolder(cutSettings.book.toLowerCase());

  console.log(cutSettings);
}

main();
