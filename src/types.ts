export type ServerAction = (formData: FormData) => Promise<void>;
export type FormErrors = Record<string, string[]>;

export type ArrayItem<T> = T extends Array<infer U> ? U : never;
