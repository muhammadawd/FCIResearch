<template>
    <div class="error-page">
        <b-container>
            <div class="errorContainer mx-auto">
                <h1 class="errorCode">403</h1>
                <p class="errorInfo">
                    غير مسموح لك بدخول هذه الصفحة
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
