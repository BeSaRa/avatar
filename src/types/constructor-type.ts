// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConstructorType<T> = new (...args: any[]) => T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructorType<T> = abstract new (...args: any[]) => T
