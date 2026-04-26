import type { User } from '@/types'

type TableName = 'tasks' | 'users' | 'task_applications' | 'workforce_applications' | 'task_assignments'

type QueryResult<T> = Promise<{ data: T | null; error: Error | null; count?: number | null }>

type Row = Record<string, unknown>

const mockSessionUser: User = {
  id: 'demo-user-1',
  email: 'demo@hirecore.local',
  role: 'workforce',
  full_name: 'Demo Worker',
  created_at: new Date().toISOString(),
}

const now = Date.now()

const db: Record<TableName, Row[]> = {
  users: [
    mockSessionUser,
    {
      id: 'admin-1',
      email: 'admin@hirecore.local',
      role: 'admin',
      full_name: 'Admin User',
      created_at: new Date(now - 86400000 * 30).toISOString(),
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Same-day Home Cleaning',
      description: 'Clean a 2-bedroom apartment before 6PM. Bring your own gloves and supplies.',
      pay: 420,
      location: 'Accra Central',
      category: 'Cleaning',
      status: 'OPEN',
      created_by: 'admin-1',
      created_at: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Office IT Setup Support',
      description: 'Install 12 laptops, printers and Wi-Fi extender for a small office.',
      pay: 980,
      location: 'East Legon',
      category: 'Tech Support',
      status: 'OPEN',
      created_by: 'admin-1',
      created_at: new Date(now - 86400000 * 2).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Furniture Delivery + Assembly',
      description: 'Deliver and assemble dining set for a client, includes lifting support.',
      pay: 760,
      location: 'Tema Community 25',
      category: 'Delivery',
      status: 'ASSIGNED',
      created_by: 'admin-1',
      created_at: new Date(now - 86400000 * 4).toISOString(),
    },
  ],
  task_applications: [],
  workforce_applications: [],
  task_assignments: [],
}

class QueryBuilder {
  private rows: Row[]
  private updates: Row | null = null
  private shouldDelete = false

  constructor(private table: TableName) {
    this.rows = [...db[table]]
  }

  select(_columns?: string, opts?: { count?: 'exact'; head?: boolean }) {
    if (opts?.head && opts.count === 'exact') {
      return Promise.resolve({ data: null, error: null, count: this.rows.length })
    }
    return this
  }

  eq(column: string, value: unknown) {
    this.rows = this.rows.filter((row) => row[column] === value)
    return this
  }

  in(column: string, values: unknown[]) {
    this.rows = this.rows.filter((row) => values.includes(row[column]))
    return this
  }

  or(filter: string) {
    const terms = filter
      .split(',')
      .map((f) => f.split('.ilike.%')[1]?.replace('%', '').toLowerCase())
      .filter(Boolean) as string[]

    this.rows = this.rows.filter((row) =>
      terms.some((term) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(term))
      )
    )
    return this
  }

  order(column: string, opts?: { ascending?: boolean }) {
    const ascending = opts?.ascending ?? true
    this.rows = [...this.rows].sort((a, b) => {
      if (a[column] < b[column]) return ascending ? -1 : 1
      if (a[column] > b[column]) return ascending ? 1 : -1
      return 0
    })
    return this
  }

  limit(size: number) {
    this.rows = this.rows.slice(0, size)
    return this
  }

  single<T = unknown>(): QueryResult<T> {
    const item = this.rows[0]
    return Promise.resolve({
      data: (item as T) ?? null,
      error: item ? null : new Error('Not found'),
    })
  }

  returns<T = unknown>(): QueryResult<T> {
    return Promise.resolve({ data: this.rows as T, error: null })
  }

  update(values: Row) {
    this.updates = values
    return this
  }

  delete() {
    this.shouldDelete = true
    return this
  }

  insert(payload: Row | Row[]) {
    const items = Array.isArray(payload) ? payload : [payload]
    db[this.table].push(...items)
    return Promise.resolve({ data: items, error: null })
  }

  then(resolve: (value: { data: unknown; error: Error | null }) => unknown) {
    if (this.shouldDelete) {
      const ids = new Set(this.rows.map((r) => r.id))
      db[this.table] = db[this.table].filter((row) => !ids.has(row.id))
      return Promise.resolve(resolve({ data: null, error: null }))
    }

    if (this.updates) {
      const ids = new Set(this.rows.map((r) => r.id))
      db[this.table] = db[this.table].map((row) =>
        ids.has(row.id) ? { ...row, ...this.updates } : row
      )
      return Promise.resolve(resolve({ data: this.rows, error: null }))
    }

    return Promise.resolve(resolve({ data: this.rows, error: null }))
  }
}

export function createMockClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: mockSessionUser }, error: null }
      },
      async signOut() {
        return { error: null }
      },
      async signInWithPassword() {
        return { error: null }
      },
      async signUp() {
        return { error: null }
      },
      async signInWithOAuth() {
        return { error: null }
      },
      async exchangeCodeForSession() {
        return { error: null }
      },
    },
    from(table: TableName) {
      return new QueryBuilder(table)
    },
  }
}
