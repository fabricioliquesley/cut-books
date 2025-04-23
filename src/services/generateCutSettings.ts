import { CutSettings } from "../@types/cutSettings";

type BooksRange = Record<string, {
  range: string;
  chapterId: string;
}[]>[]

export function generateCutSettings(fileName: string, booksRange: BooksRange): CutSettings {
  const cutSettings: CutSettings = [{
    filename: fileName,
    books: []
  }];

  booksRange.forEach(books => {
    for (let book in books) {
      cutSettings[0].books.push({
        title: book,
        chapters: books[book].map(chap => chap.range)
      })
    }
  })

  return cutSettings;
}