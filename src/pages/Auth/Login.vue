<template>
    <div class="auth-page">
        <b-container>
            <h5 class="auth-logo">
                <i class="fa fa-circle text-primary"></i>
                مرحبا بك
                <i class="fa fa-circle text-danger"></i>
            </h5>
            <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>تسجيل الدخول</h3>" customHeader>
                <p class="widget-auth-info">
                    ادخل البريد وكلمة المرور
                </p>
                <form class="mt" @submit.prevent="login">
                    <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
                        {{errorMessage}}
                    </b-alert>
                    <div class="form-group">
                        <input class="form-control no-border" ref="email" required type="email" name="email"
                               placeholder="Email"/>
                        <span id="email_error" class="span-text-validation text-danger text-bold"></span>
                    </div>
                    <div class="form-group">
                        <input class="form-control no-border" ref="password" required type="password" name="password"
                               placeholder="Password"/>
                        <span id="password_error" class="span-text-validation text-danger text-bold"></span>
                    </div>
                    <b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">دخول</b-button>
                    <div class="text-center">
                        <router-link :to="{name:'ForgetPassword'}">نسيت كلمة المرور</router-link>
                    </div>
                </form>
            </Widget>
        </b-container>
        <footer class="auth-footer">
            2020 &copy;
        </footer>
    </div>
</template>

<script>
    import Widget from '@/components/Widget/Widget';

    export default {
        name: 'LoginPage',
        components: {Widget},
        data() {
            return {
                errorMessage: null,
            };
        },
        methods: {
            login() {
                let vm = this;
                const email = this.$refs.email.value;
                const password = this.$refs.password.value;
                $('.span-text-validation').text('');

                vm.$serviceAPI.API().post(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.AUTH_LOGIN, {
                    email: email,
                    password: password,
                })
                    .then(function (response) {
                        // handle success
                        response = response.data;
                        let status = response.status;
                        if (status) {
                            localStorage.setItem('auth_data', JSON.stringify(response.data));
                            if (response.data.user.type == 'student') {
                                vm.$router.push({name: 'DashboardPage'})
                            } else {
                                vm.$router.push({name: 'SubjectsForStuff'})
                            }
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        vm.$helper.handleError(error, vm)
                    })
            },
        },
        created() {
            if (window.localStorage.getItem('authenticated') === 'true') {
                // this.$router.push('/');
            }
        },
    };
</script>
