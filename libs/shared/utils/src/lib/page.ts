export interface Page<T> {
    content: T[];
    page: number;
    pageSize: number;
    total: number;
}

export interface PageRequest {
    page: number;
    pageSize: number;
}
