<template>
    <div class="error-page">
        <b-container>
            <div class="errorContainer mx-auto">
                <h1 class="errorCode">404</h1>
                <p class="errorInfo">
                    الصفحة غير موجودة
                </p>
            </div>
            <footer class="pageFooter">
                2020 &copy;
            </footer>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: 'ErrorPage',
    };
</script>

<style src="./Error.scss" lang="scss" scoped/>
