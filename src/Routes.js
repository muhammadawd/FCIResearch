import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Auth/Login';
import ResetPassword from '@/pages/Auth/ResetPassword';
import ForgetPassword from '@/pages/Auth/ForgetPassword';
import ErrorPage from '@/pages/Error/Error';
import Error403 from '@/pages/Error/Error403';
// Main
import DashboardPage from '@/pages/Dashboard/Dashboard';
import SubjectsForStuff from '@/pages/SubjectsForStuff/SubjectsForStuff';
import SubjectsForStuffReport from '@/pages/SubjectsForStuff/SubjectsForStuffReport';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '*',
            name: 'Error',
            component: ErrorPage,
            meta: {requiresAuth: false}
        },
        {
            path: '/Error403',
            name: 'Error403',
            component: Error403,
            meta: {requiresAuth: false}
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {requiresAuth: false}
        },
        {
            path: '/ForgetPassword',
            name: 'ForgetPassword',
            component: ForgetPassword,
            meta: {requiresAuth: false}
        },
        {
            path: '/ResetPassword/:token',
            name: 'ResetPassword',
            component: ResetPassword,
            meta: {requiresAuth: false}
        },
        {
            path: '/',
            name: 'Layout',
            component: Layout,
            children: [
                {
                    path: 'SubjectsForStudent',
                    name: 'DashboardPage',
                    component: DashboardPage,
                    meta: {
                        requiresAuth: true,
                        type: 'student'
                    }
                },
                {
                    path: 'SubjectsForStuff',
                    name: 'SubjectsForStuff',
                    component: SubjectsForStuff,
                    meta: {
                        requiresAuth: true,
                        type: 'stuff'
                    }
                },
                {
                    path: 'SubjectsForStuffReport',
                    name: 'SubjectsForStuffReport',
                    component: SubjectsForStuffReport,
                    meta: {
                        requiresAuth: true,
                        type: 'stuff'
                    }
                },
            ],
        },
    ],
});
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        let auth_data = JSON.parse(localStorage.getItem('auth_data'));
        // this route requires auth, check if logged in
        // console.log(auth_data)
        if (!auth_data) {
            next({
                name: 'Login', // query: {redirect: to.fullPath}
            })
        } else {
            if(to.meta.type == auth_data.user.type){

                next()

            }else{

                next({
                    name: 'Error403', // query: {redirect: to.fullPath}
                })
            }
        }
        // next()
    } else {
        next() // make sure to always call next()!
    }
});


export default router