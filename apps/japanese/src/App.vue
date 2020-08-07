<template>
    <div id="app">
        <v-app>
            <v-app-bar app>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
                <v-toolbar-title>
                    <v-btn flat text to="report">Report</v-btn>
                    <v-btn flat text to="radicals">Radicals</v-btn>
                </v-toolbar-title>
            </v-app-bar>
            <v-main>
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </v-main>
        </v-app>
    </div>
</template>