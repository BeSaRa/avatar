export type SelectedValue<T> = T extends object ? T | T[keyof T] : T
export type OptionValue<T> = T extends object ? keyof T : never
