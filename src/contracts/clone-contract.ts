export interface CloneContract {
  clone<T extends object>(overrides?: Partial<T>): T
}
