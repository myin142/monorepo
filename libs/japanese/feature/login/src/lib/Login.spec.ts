import { mock, MockProxy } from 'jest-mock-extended';
import { AuthService } from '@myin/shared/authentication';
import { Wrapper, shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Login from './Login.vue';

describe('Login', () => {
    let authService: MockProxy<AuthService>;
    let wrapper: Wrapper<Login>;
    let defaultWrapperOpt: ThisTypedShallowMountOptions<Login>;

    beforeEach(() => {
        authService = mock<AuthService>();
        defaultWrapperOpt = {
            provide: { authService },
        };
    });

    it('should handle auth callback', () => {
        wrapper = shallowMount(Login, defaultWrapperOpt);
        expect(authService.handleAuthCallback).toHaveBeenCalledWith(window.location.href);
    });

    it('redirect if authenticated', () => {
        const $router = mock<VueRouter>();
        authService.isAuthenticated.mockReturnValueOnce(true);
        wrapper = shallowMount(Login, {
            ...defaultWrapperOpt,
            mocks: { $router },
        });

        expect($router.push).toHaveBeenCalledWith({ name: 'Home' });
    });

    it('redirect if authenticated', async () => {
        wrapper = shallowMount(Login, defaultWrapperOpt);
        await wrapper.find('v-btn').trigger('click');
        await wrapper.vm.$nextTick();

        expect(authService.login).toHaveBeenCalled();
    });
});
