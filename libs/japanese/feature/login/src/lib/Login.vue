<template>
    <div class="login">
        <v-btn data-cy-login-btn @click="login()">Login</v-btn>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Inject } from 'vue-property-decorator';
import { AuthService } from '@myin/shared/authentication';

@Component
export default class Login extends Vue {
    @Inject()
    private authService: AuthService;

    created() {
        this.authService.handleAuthCallback(window.location.href);
        if (this.authService.isAuthenticated()) {
            this.$router.push({ name: 'Home' });
        }
    }

    login() {
        this.authService.login();
    }
}
</script>