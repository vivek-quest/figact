export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
