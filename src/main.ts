import path from "node:path";
import fastify from "fastify";
import { z } from "zod";
import cors from "@fastify/cors";

import { createBookFolder } from "./services/createBookFolder";
import { loadHomeDir } from "./lib/loadHomeDir";
import { cutBook } from "./services/cutBook";
import { generateCutSettings } from "./services/generateCutSettings";
import { CutSettings } from "./@types/cutSettings";
import { projectFolderName } from "./constants";
import { createCutSettingsBackup } from "./services/createCutSettingsBackup";
import { validateBackupExpiry } from "./services/validateBackupExpiry";

function main(cutSettings: CutSettings) {
  cutSettings.forEach(async (file) => {
    const filePath = path.join(loadHomeDir(), projectFolderName, file.filename);

    file.books.forEach(async (book) => {
      const range = book.chapters.map((chapter) =>
        chapter.split("-").map((num) => +num)
      );

      const folderPath = createBookFolder(book.title.toLowerCase());

      if (!folderPath) return;

      await cutBook(filePath, folderPath, range);
    });

    createCutSettingsBackup(cutSettings);
    await validateBackupExpiry();
  });
}

const app = fastify();

app.register(cors, {
  origin: true,
});

app.get("/status", (_request, reply) => {
  return reply.status(200).send({
    status: "200",
    message: "server is ok",
  });
});

const bodySchema = z.object({
  fileName: z.string(),
  booksRange: z.array(
    z.record(
      z.string(),
      z.array(
        z.object({
          chapterId: z.string(),
          range: z
            .string()
            .regex(/^\d+-\d+$/, "Range must be in 'number-number' format"),
        })
      )
    )
  ),
});

app.post("/cut-books", (request, reply) => {
  const bodyRequest = bodySchema.safeParse(request.body);

  if (bodyRequest.error) {
    return reply.status(400).send({
      error: "Bad request",
      message: bodyRequest.error.message,
    });
  }

  const { fileName, booksRange } = bodyRequest.data;

  const cutSettings = generateCutSettings(fileName, booksRange);

  main(cutSettings);

  return reply.status(201).send({
    success: true,
    message: "All chapters have been generated",
  });
});

app.listen({ port: 3000, host: "0.0.0.0" }, () =>
  console.log("Server listening at http://localhost:3000")
);
