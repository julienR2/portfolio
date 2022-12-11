export type Script = {
  id: string
  name: string
  description: string
  cron?: string
  run: () => Promise<void>
  logs?: string
  isRunning?: boolean
}
