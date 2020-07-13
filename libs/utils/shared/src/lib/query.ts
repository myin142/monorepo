export class Query {
    static create(obj: object): string {
        if (obj == null) return '';
        return Object.keys(obj)
            .map((k) => `${k}=${obj[k]}`)
            .join('&');
    }
}
