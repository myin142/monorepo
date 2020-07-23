import { Path } from '@myin/shared/utils';

export class AuthService {
    private static TOKEN_KEY = 'myin-admin-login-token';

    private token = '';
    private readonly domain = 'myin-user-domain.auth.eu-central-1.amazoncognito.com';
    private readonly clientId = '1t6881tdaibngg1ujtrbk5cnb9';

    constructor() {
        this.token = sessionStorage.getItem(AuthService.TOKEN_KEY);
    }

    login() {
        const redirectUri = Path.join(document.baseURI, 'login');
        const url = `https://${this.domain}/login?client_id=${this.clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email+openid`;
        window.location.href = url;
    }

    handleAuthCallback(url: string) {
        const index = url.indexOf('id_token');
        const queryParams = url.substring(index);
        const urlParams = new URLSearchParams(queryParams);

        const token = urlParams.get('id_token');
        const type = urlParams.get('token_type');

        if (type != null && token != null) {
            this.token = `${type} ${token}`;
            sessionStorage.setItem(AuthService.TOKEN_KEY, this.token);
        }
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    getToken(): string {
        return this.token;
    }
}

export const auth = new AuthService();
