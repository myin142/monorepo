export class Path {
    static join(...paths: string[]): string {
        let joined = paths.map((x) => x.replace(/^\/+|\/+$/g, '')).join('/');
        if (paths.length > 0) {
            if (paths[0].startsWith('/')) {
                joined = `/${joined}`;
            }
            if (paths[paths.length - 1].endsWith('/')) {
                joined += '/';
            }
        }
        return joined;
    }
}
