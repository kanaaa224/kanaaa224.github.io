const { createApp, ref, onMounted } = Vue;
const { createVuetify, useTheme } = Vuetify;

const vuetify = createVuetify({
    theme: {
        defaultTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    background: '#fff',
                    surface:    '#fff',
                    primary:    '#2196f3',
                    secondary:  '#444',
                    error:      '#c23131'
                }
            },
            dark: {
                dark: true,
                colors: {
                    background: '#222',
                    surface:    '#222',
                    primary:    '#2196f3',
                    secondary:  '#eee',
                    error:      '#c23131'
                }
            }
        }
    }
});

const app = createApp({
    setup() {
        const theme = useTheme();

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const logging = (d = '') => {
            console.log(`[ ${(new Date()).toISOString()} ] ${d}`);
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const snackbar_visible = ref(false);
        const snackbar_message = ref('');
        const snackbar_color   = ref('');
        const snackbar_time    = ref(5000);

        const snackbar = (message = null, color = null, time = null) => {
            if(!snackbar_visible.value) {
                snackbar_message.value = message ?? snackbar_message.value;
                snackbar_color.value   = color   ?? snackbar_color.value;
                snackbar_time.value    = time    ?? snackbar_time.value;
                snackbar_visible.value = true;
            }
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const callAPI = async (uri = '', queries = '', requestBody = null, endpoint = API_ENDPOINTS[0]) => {
            uri = `${endpoint}${uri}`;

            if(queries) uri += /\?/.test(uri) ? `&${queries}` : `?${queries}`;

            let request = { method: 'GET' };

            if(requestBody) request = { method: 'POST', body: JSON.stringify(requestBody) };

            const response = await fetch(uri, request);
            const data     = await response.json();

            if(!response.ok) throw `api-bad-status: ${response.status}`;

            return data;
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const dialog_loading_visible = ref(false);
        const dialog_loading_title   = ref('');
        const dialog_loading_icon    = ref('');

        const dialog_loading = (title = null, icon = null) => {
            if(!dialog_loading_visible.value) {
                dialog_loading_title.value   = title ?? dialog_loading_title.value;
                dialog_loading_icon.value    = icon  ?? dialog_loading_icon.value;
                dialog_loading_visible.value = true;
            }
        };

        const dialog_settings_visible = ref(false);

        const dialog_settings = () => {
            dialog_settings_visible.value = true;
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const repos_loading = ref(false);
        const repos         = ref([]);

        const REPOS_PER_PAGE = 10;

        const loadRepos = async () => {
            repos_loading.value = true;

            const currentPage = Math.floor(repos.value.length / REPOS_PER_PAGE) + 1;

            const result = await callAPI('/repos', `per_page=${REPOS_PER_PAGE}&page=${currentPage}`);

            repos.value.push(...result);

            if(result.length >= REPOS_PER_PAGE) repos_loading.value = false;
        };

        const user = ref({});

        const initialize = async () => {
            const lenis = new Lenis({
                autoRaf: true,
                duration: 1.5
            });

            user.value = await callAPI();

            await loadRepos();

            document.querySelector("link[rel='icon']").href             = user.value.avatar_url;
            document.querySelector("link[rel='apple-touch-icon']").href = user.value.avatar_url;

            logging(`initialized`);
        };

        const container_visible  = ref(false);
        const navigator_visible  = ref(false);
        const top_button_visible = ref(false);

        onMounted(() => {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                theme.global.name.value = e.matches ? 'dark' : 'light';
            });

            window.addEventListener('load', async () => {
                await initialize();

                container_visible.value = true;
            });

            window.addEventListener('scroll', e => {
                top_button_visible.value = window.scrollY >= 50;
            });

            const onResize = () => {
                navigator_visible.value = window.innerWidth >= 600;
            };

            onResize();

            window.addEventListener('resize', onResize);
        });

        return {
            theme,

            snackbar_visible,
            snackbar_message,
            snackbar_color,
            snackbar_time,
            snackbar,

            dialog_loading_visible,
            dialog_loading_title,
            dialog_loading_icon,
            dialog_loading,
            dialog_settings_visible,
            dialog_settings,

            repos_loading,
            repos,
            user,

            loadRepos,

            container_visible,
            navigator_visible,
            top_button_visible
        };
    }
});

app.use(vuetify).mount('#app');