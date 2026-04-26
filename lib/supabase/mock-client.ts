import { mockTaskApplications, mockTasks, mockUsers, mockWorkforceApplications } from '@/lib/mock-data'
import type { User } from '@/types'

type TableName = 'tasks' | 'users' | 'task_applications' | 'workforce_applications' | 'task_assignments'
type Row = Record<string, unknown>
type QueryResult<T> = Promise<{ data: T | null; error: Error | null; count?: number | null }>

const db: Record<TableName, Row[]> = {
  tasks: [...mockTasks],
  users: [...mockUsers],
  task_applications: [...mockTaskApplications],
  workforce_applications: [...mockWorkforceApplications],
  task_assignments: [],
}

const sessionUser: User = mockUsers[0]

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

    if (!terms.length) return this

    this.rows = this.rows.filter((row) =>
      terms.some((term) =>
        Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(term))
      )
    )
    return this
  }

  order(column: string, opts?: { ascending?: boolean }) {
    const ascending = opts?.ascending ?? true
    this.rows = [...this.rows].sort((a, b) => {
      const av = a[column]
      const bv = b[column]
      if (av === bv) return 0
      if (av == null) return 1
      if (bv == null) return -1
      return av < bv ? (ascending ? -1 : 1) : (ascending ? 1 : -1)
    })
    return this
  }

  limit(size: number) {
    this.rows = this.rows.slice(0, size)
    return this
  }

  single<T = unknown>(): QueryResult<T> {
    const item = this.rows[0]
    return Promise.resolve({ data: (item as T) ?? null, error: item ? null : new Error('Not found') })
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
    const records = Array.isArray(payload) ? payload : [payload]
    db[this.table].push(...records)
    return Promise.resolve({ data: records, error: null })
  }

  then(resolve: (value: { data: unknown; error: Error | null }) => unknown) {
    if (this.shouldDelete) {
      const ids = new Set(this.rows.map((r) => r.id))
      db[this.table] = db[this.table].filter((row) => !ids.has(row.id))
      return Promise.resolve(resolve({ data: null, error: null }))
    }

    if (this.updates) {
      const ids = new Set(this.rows.map((r) => r.id))
      db[this.table] = db[this.table].map((row) => (ids.has(row.id) ? { ...row, ...this.updates } : row))
      return Promise.resolve(resolve({ data: this.rows, error: null }))
    }

    return Promise.resolve(resolve({ data: this.rows, error: null }))
  }
}

export function createMockClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: sessionUser }, error: null }
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
