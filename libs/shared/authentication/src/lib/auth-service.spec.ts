import { AuthService } from './auth-service';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    it('should parse token from url', () => {
        authService.handleAuthCallback('/login?id_token=TOKEN&token_type=Bearer');
        expect(authService.getToken()).toEqual('Bearer TOKEN');
    });

    it('should be authenticated if token is defined', () => {
        authService.handleAuthCallback('/login?id_token=TOKEN&token_type=Bearer');
        expect(authService.isAuthenticated()).toBeTruthy();
    });
});
