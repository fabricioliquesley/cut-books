import { loadCutSettings } from "./services/loadCutSettings";
import { createBookFolder } from "./services/createBookFolder";

function main() {
  const cutSettings = loadCutSettings();

  if (!cutSettings) return;

  createBookFolder(cutSettings[0].books[0].title.toLowerCase());

  console.log(cutSettings);
}

main();
