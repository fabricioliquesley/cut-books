import path from "node:path";
import fastify from "fastify";
import { z } from "zod";
import cors from "@fastify/cors";

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
      const range = book.chapters.map((chapter) =>
        chapter.split("-").map((num) => +num)
      );

      const folderPath = createBookFolder(book.title.toLowerCase());

      if (!folderPath) return;

      await cutBook(filePath, folderPath, range);
    });

    // console.log(filePath);
    // console.log(file.books)
  });

  // console.log(cutSettings);
}

// main();

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
  const bodyResponse = bodySchema.safeParse(request.body);

  if (bodyResponse.error) {
    return reply.status(400).send({
      error: "Bad request",
      message: bodyResponse.error.message,
    });
  }

  const { fileName, booksRange } = bodyResponse.data;

  return reply.status(201).send({
    fileName,
    booksRange,
  });
});

app.listen({ port: 3000, host: "0.0.0.0" }, () =>
  console.log("Server listening at http://localhost:3000")
);
