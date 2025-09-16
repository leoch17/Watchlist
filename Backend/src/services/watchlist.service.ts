// services/watchlist.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WatchlistService {
  public async createWatchlist(name: string, terms: string[]): Promise<any> {
    // Aquí usamos el método 'create' de Prisma para guardar los datos
    const newWatchlist = await prisma.watchlist.create({
      data: {
        name,
        terms,
      },
    });
    return newWatchlist;
  }

  // Mantienes el método getWatchlistTerms
  public async getWatchlistTerms(): Promise<string[]> {
    const watchlists = await prisma.watchlist.findMany({
      select: {
        terms: true, // Selecciona solo el campo 'terms'
      },
    });

    // Aplana el arreglo de objetos para obtener un solo arreglo de términos
    const allTerms = watchlists.flatMap((watchlist) => watchlist.terms);

    return allTerms;
  }
}
