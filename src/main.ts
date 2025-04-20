import path from "node:path";

import { loadCutSettings } from "./services/loadCutSettings";
import { createBookFolder } from "./services/createBookFolder";
import { loadHomeDir } from "./lib/loadHomeDir";
import { cutBook } from "./services/cutBook";

function main() {
  const cutSettings = loadCutSettings();

  if (!cutSettings) return;

  cutSettings.forEach((file) => {
    const filePath = path.join(loadHomeDir(), "cutBook", file.filename);

    file.books.forEach(async (book) => {
      const range = book.chapters
        .map((chapter) => chapter.split("-").map(num => +num));
      
      const folderPath = createBookFolder(book.title.toLowerCase());

      if (!folderPath) return;

      await cutBook(filePath, folderPath, range);
    })

    // console.log(filePath);
    // console.log(file.books)
  })

  // console.log(cutSettings);
}

main();
