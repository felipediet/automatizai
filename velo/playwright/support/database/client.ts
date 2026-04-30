import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { promises as dns } from 'dns'
import type { Database } from './schema'

export async function createDbClient(): Promise<Kysely<Database>> {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not defined.\n' +
      'Add it to your .env file:\n' +
      'DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres'
    )
  }

  const url = new URL(connectionString)
  const hostname = url.hostname

  // On Windows, dns.lookup (used by pg) may fail for IPv6-only hosts.
  // Pre-resolve via dns.resolve6 and connect directly to the IPv6 address.
  let resolvedHost = hostname
  try {
    const addresses = await dns.resolve6(hostname)
    if (addresses.length > 0) {
      resolvedHost = addresses[0]
    }
  } catch {
    // fallback: use the original hostname and let pg try
  }

  const dialect = new PostgresDialect({
    pool: new Pool({
      host: resolvedHost,
      port: parseInt(url.port || '5432'),
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      ssl: {
        rejectUnauthorized: false,
        servername: hostname,
      },
    }),
  })

  return new Kysely<Database>({ dialect })
}

export async function destroyDbClient(db: Kysely<Database>): Promise<void> {
  await db.destroy()
}
