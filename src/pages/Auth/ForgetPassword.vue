<template>
    <div class="auth-page">
        <b-container>
            <h5 class="auth-logo">
                <i class="fa fa-circle text-primary"></i>
                مرحبا بك
                <i class="fa fa-circle text-danger"></i>
            </h5>
            <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>نسيت كلمة المرور  </h3>" customHeader>
                <p class="widget-auth-info">
                    ادخل البريد الالكتروني
                </p>
                <form class="mt" @submit.prevent="login">
                    <div class="form-group">
                        <input class="form-control no-border" ref="email" required type="email" name="email"
                               placeholder="Email"/>
                        <span id="email_error" class="span-text-validation text-danger text-bold"></span>
                    </div>
                    <b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">تأكيد</b-button>
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
                $('.span-text-validation').text('');

                vm.$serviceAPI.API().post(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.AUTH_FORGET_PASSWORD, {
                    email: email,
                })
                    .then(function (response) {
                        // handle success
                        response = response.data;
                        let status = response.status;
                        if (status) {
                            vm.$helper.showMessage('success', vm);
                            // localStorage.setItem('auth_data', JSON.stringify(response.data));
                            vm.$router.push({name: 'Login'})
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
