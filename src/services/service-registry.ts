export class ServiceRegistry {
  private static services: Map<string, unknown> = new Map<string, unknown>()

  static set(name: string, service: unknown): void {
    ServiceRegistry.services.set(name, service)
  }

  static get<T>(name: string): T {
    if (!ServiceRegistry.services.has(name)) {
      throw Error(`${name} not registered, please provide it to ServiceRegistry.set method before asking for it`)
    }
    return ServiceRegistry.services.get(name) as T
  }
}
