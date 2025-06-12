import * as Vue     from 'vue';
import * as Vuetify from 'vuetify';

import * as consts from './consts.js';
import * as api    from './api.js';

import snackbar        from './app-snackbar.js';
import dialog_settings from './app-dialog-settings.js';

import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.3.15/+esm';

const state = Vue.reactive({
    visible: false,

    top_button_visible: false,

    repos: [],
    repos_load_disabled: false,

    loading: false
});

const methods = {
    async repos_load() {
        state.loading = true;

        const REPOS_PER_PAGE = 10;

        try {
            const currentPage = Math.floor(state.repos.length / REPOS_PER_PAGE) + 1;

            const result = await api.call(`https://api.github.com/users/${'kanaaa224'}/repos?per_page=${REPOS_PER_PAGE}&page=${currentPage}`);

            state.repos.push(...result);

            if(result.length < REPOS_PER_PAGE) state.repos_load_disabled = true;
        } catch(e) {
            console.error(e);

            await snackbar.show('ページのロード中にエラーが発生しました', 'error');
        }

        state.loading = false;
    }
};

const component = {
    setup() {
        const display = Vuetify.useDisplay();
        const theme   = Vuetify.useTheme();

        Vue.onMounted(async () => {
            document.title = consts.app.name;

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                theme.global.name.value = e.matches ? 'dark' : 'light';
            });

            const lenis = new Lenis({ autoRaf: true, duration: 1.5 });

            state.visible = true;

            await Vue.nextTick();

            window.addEventListener('scroll', () => {
                state.top_button_visible = window.scrollY >= 50;
            });

            await methods.repos_load();
        });

        return {
            state, methods,

            display, theme,

            dialog_settings
        }
    },
    template: `
        <v-main>
            <v-fade-transition mode="out-in">
                <v-container v-if="state.visible">
                    <div class="d-flex align-center justify-space-between position-sticky top-0" :class="display.xs.value ? 'py-2' : 'py-4'" style="z-index: 1; backdrop-filter: blur(2rem);">
                        <span class="pl-4" @click="dialog_settings.open()">kanaaa224</span>
                        <div class="d-flex">
                            <div v-if="!display.xs.value">
                                <v-btn variant="plain" href="#links">Links</v-btn>
                                <v-btn variant="plain" href="#repositories">Repositories</v-btn>
                            </div>
                            <v-btn variant="plain" @click="theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'"><v-icon :icon="theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'" /></v-btn>
                        </div>
                    </div>
                    <div class="d-flex flex-column mt-4" :class="display.xs.value ? 'ga-4' : 'ga-6'">
                        <v-card elevation="0" rounded="lg" class="pa-6">
                            <div class="d-flex flex-column flex-md-row align-md-center justify-md-space-between">
                                <div class="d-flex align-center">
                                    <v-avatar size="64" class="me-4">
                                        <v-img src="https://github.com/kanaaa224.png">
                                    </v-avatar>
                                    <div class="d-flex flex-column">
                                        <span class="text-h6">Kanato Shimabukuro</span>
                                        <span class="text-subtitle-2 text-grey">@kanaaa224</span>
                                    </div>
                                </div>
                                <div class="d-flex justify-center justify-md-end flex-wrap">
                                    <v-btn variant="plain" target="_blank" rel="noopener" href="https://instagram.com/kanaaa224" icon="mdi-instagram" />
                                    <v-btn variant="plain" target="_blank" rel="noopener" href="https://soundcloud.com/kanaaa224" icon="mdi-soundcloud" />
                                    <v-btn variant="plain" target="_blank" rel="noopener" href="https://steamcommunity.com/profiles/76561198377009596" icon="mdi-steam" />
                                    <v-btn variant="plain" target="_blank" rel="noopener" href="https://profile.playstation.com/kanaaa224" icon="mdi-sony-playstation" />
                                    <v-btn variant="plain" target="_blank" rel="noopener" href="https://discord.com/users/551228674784100361" icon><i class="bi bi-discord" /></v-btn>
                                    <v-btn variant="plain" target="_blank" rel="noopener" href="https://github.com/kanaaa224" icon="mdi-github" />
                                </div>
                            </div>
                        </v-card>
                        <v-card elevation="0" rounded="lg" class="pa-2" :class="{ 'shadow-1': !theme.global.current.value.dark }" id="links">
                            <v-card-title class="text-h5">リンク</v-card-title>
                            <v-row dense :class="display.xs.value ? 'px-1 mb-1' : 'px-3 mb-2'">
                                <v-col v-for="(link, index) in [ { name: 'ポートフォリオ', url: 'https://kanaaa224.github.io/portfolio', icon: '' }, { name: '自宅サーバー', url: 'https://ponzu.server-on.net', icon: 'https://cdn.jsdelivr.net/gh/kanaaa224/home-server@master/logo.png' } ]" :key="index" class="d-flex pa-2" cols="12" sm="6" md="4" lg="3" xl="2">
                                    <v-card elevation="0" rounded="lg" hover link class="flex-grow-1" :style="{ backgroundColor: theme.global.current.value.dark ? '#333' : '#f5f5f5' }" :href="link.url" target="_blank" rel="noopener">
                                        <v-card-text class="d-flex pa-3">
                                            <v-avatar class="mr-3">
                                                <v-img v-if="link.icon" :src="link.icon" cover />
                                                <v-icon v-else icon="mdi-link" />
                                            </v-avatar>
                                            <div class="d-flex flex-column justify-center" style="min-width: 0;">
                                                <span class="text-truncate">{{ link.name }}</span>
                                                <span class="text-caption text-medium-emphasis text-truncate">{{ link.url }}</span>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card elevation="0" rounded="lg" class="pa-2" :class="{ 'shadow-1': !theme.global.current.value.dark }" :loading="state.loading" :disabled="state.loading" id="repositories">
                            <v-card-title class="text-h5">リポジトリ</v-card-title>
                            <v-fade-transition mode="out-in">
                                <v-list v-if="state.repos.length > 0" :class="display.xs.value ? 'mx-2' : 'mx-4'">
                                    <v-list-item v-for="(repo, index) in state.repos" :key="repo.id" rounded="lg" class="py-2" :style="{ backgroundColor: index % 2 === 1 ? (theme.global.current.value.dark ? '#333' : '#f5f5f5') : '' }">
                                        <div class="d-flex align-center justify-space-between" :class="display.xs.value ? 'pl-3' : 'pl-4'">
                                            <div class="text-truncate">
                                                <v-list-item-title v-text="repo.name" />
                                                <v-list-item-subtitle v-if="repo.description" v-text="repo.description" />
                                                <v-list-item-subtitle class="text-caption grey--text text--darken-1">
                                                    スター: {{ repo.stargazers_count }} | フォーク: {{ repo.forks_count }}
                                                    <span v-if="repo.language"> | 使用言語: {{ repo.language }}</span>
                                                </v-list-item-subtitle>
                                            </div>
                                            <div class="d-flex">
                                                <v-btn v-if="repo.has_pages" :class="display.xs.value ? '' : 'mr-2'" variant="plain" icon="mdi-web" :href="repo.homepage" target="_blank" rel="noopener" />
                                                <v-btn variant="plain" icon="mdi-github" :href="repo.html_url" target="_blank" rel="noopener" />
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                                <v-skeleton-loader v-else type="article, text" />
                            </v-fade-transition>
                            <v-card-text class="d-flex justify-end">
                                <v-btn variant="plain" :size="display.xs.value ? 'small' : 'default'" :disabled="state.repos_load_disabled" @click="methods.repos_load()"><v-icon class="mr-1" icon="mdi-download" />さらに読み込む</v-btn>
                                <v-btn variant="plain" :size="display.xs.value ? 'small' : 'default'" href="https://github.com/kanaaa224" target="_blank" rel="noopener"><v-icon class="mr-1" icon="mdi-github" />GitHubで確認</v-btn>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-container>
            </v-fade-transition>
            <v-fade-transition mode="out-in">
                <v-btn v-if="state.top_button_visible" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 999;" variant="plain" icon="mdi-arrow-up" :size="display.xs.value ? 'small' : 'default'" href="#top" />
            </v-fade-transition>
        </v-main>
    `
};

export default { state, ...methods, component }
export function use() { return { state, ...methods } }