import mongoose, { type Connection } from "mongoose"

/**
 * Serverless-sichere MongoDB-Verbindung.
 *
 * Auf Vercel wird pro Lambda-Instanz mehrfach importiert; ohne Zwischenspeicher
 * entstünde bei jedem Aufruf eine neue Verbindung, bis Atlas die Obergrenze
 * meldet. Der Cache liegt bewusst am globalThis, weil Module bei HMR und
 * zwischen Requests neu ausgewertet werden können.
 */
interface ConnectionCache {
  conn: Connection | null
  promise: Promise<Connection> | null
}

const globalCache = globalThis as typeof globalThis & {
  __yunityMongoose?: ConnectionCache
}

const cache: ConnectionCache = (globalCache.__yunityMongoose ??= {
  conn: null,
  promise: null,
})

export async function getConnection(): Promise<Connection> {
  if (cache.conn) {
    return cache.conn
  }
  if (!cache.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI ist nicht gesetzt.")
    }
    cache.promise = mongoose
      .connect(uri, {
        // In einer Lambda-Instanz genügt eine kleine Poolgröße; viele parallele
        // Instanzen teilen sich sonst das Verbindungslimit von Atlas.
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .then((m) => m.connection)
  }
  try {
    cache.conn = await cache.promise
  } catch (error) {
    // Fehlgeschlagene Verbindung nicht zwischenspeichern, sonst bleibt die
    // Instanz dauerhaft kaputt.
    cache.promise = null
    throw error
  }
  return cache.conn
}
