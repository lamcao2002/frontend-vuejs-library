const snackbarPlugin = {
    install: (Vue, { store }) => {
        if (!store) {
            throw new Error('Please provide vuex store.');
        }

        Vue.prototype.$notificate = {
            showMessage: function ({
                content = '',
                color = ''
            }) {
                store.commit(
                    'SHOW_TOASK',
                    { content, color },
                    { root: true }
                );
            }
        };
    },
};
export default snackbarPlugin;