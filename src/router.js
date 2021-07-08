import Vue from 'vue'
import Router from 'vue-router'
import BookUser from './components/book/BookUser.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
// import Dashboard from './components/Dashboard.vue'

const store = require('./store').default

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            name: 'Home',
            path: '/', component: BookUser,
            // props: route => ({ page: route.query.page, limit: route.query.limit })
            props: route => ({ page: Number(route.query.pages) })
        },
        {
            name: 'Dashboard', path: '/dashboard',
            component: () => import('./components/Dashboard'),
            children: [
                {
                    path: '/home',
                    redirect: { name: 'Home' }
                },
                {
                    name: 'BooksManagement',
                    path: 'books-management',
                    component: () => import('./components/book/BooksManagement'),
                },
                {
                    name: 'AddBook',
                    path: 'add-book',
                    component: () => import('./components/book/BookForm'),
                },
                {
                    name: 'EditBook',
                    path: 'books-management/edit-book',
                    component: () => import('./components/book/EditBook'),
                },
                {
                    name: 'CategoriesManagement',
                    path: 'categories-management',
                    component: () => import('./components/category/CategoriesManagement'),
                },
                {
                    name: 'AddCategory',
                    path: 'add-category',
                    component: () => import('./components/category/AddCategory'),
                },
                {
                    name: 'EditCategory',
                    path: 'categories-management/edit-category',
                    component: () => import('./components/category/EditCategory'),
                },
                {
                    name: 'UsersManagement',
                    path: 'users-management',
                    component: () => import('./components/user/UsersManagement'),
                },
                {
                    name: 'AddUser',
                    path: 'add-user',
                    component: () => import('./components/user/AddUser'),
                },
                {
                    name: 'EditUser',
                    path: 'users-management/edit-user',
                    component: () => import('./components/user/EditUser'),
                },
            ]
        },
        { name: 'Login', path: '/login', component: Login },
        { name: 'Register', path: '/register', component: Register },
        {
            name: 'ChangePassword', path: '/change-password',
            component: () => import('./components/ChangePassword'),
        },
        {
            name: 'BookDetail', path: '/book-detail',
            component: () => import('./components/book/BookDetail'),
        },
    ]
})

const permission = [
    {
        roles: 'normal',
        namePage: [
            'Home', 'ChangePassword', 'BookDetail'
        ]
    },
    {
        roles: 'contributor',
        namePage: [
            'Home', 'ChangePassword', 'BookDetail', 'Dashboard', 'BooksManagement',
            'AddBook', 'EditBook'
        ]
    },
]


router.beforeEach((to, from, next) => {
    const token = store.getters.GET_TOKEN;
    var role = ''
    if (token) {
        role = store.getters.GET_ROLE
    }

    const permissionObj = permission.find(({ roles }) => roles === role)
    if (to.name == 'Home' && !token) {
        next({ name: 'Login' })
    } else if (to.name === 'Login' && token) {
        next({ name: 'Home' })
    } else if (permissionObj) {
        if (permissionObj.namePage.includes(to.name)) {
            next()
        } else {
            next({ name: 'Home' })
        }
    } else next()
})

export default router;