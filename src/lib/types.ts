export interface KVNamespace {
    get: (key: string) => string,
    put: (key: string, value: string) => void,
}