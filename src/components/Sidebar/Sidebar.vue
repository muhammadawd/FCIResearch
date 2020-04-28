<template>
    <div class="sidebar-wrapper d-print-none">
        <nav
                :class="{sidebar: true, sidebarStatic, sidebarOpened}"
        >
            <!--@mouseenter="sidebarMouseEnter"-->
            <!--@mouseleave="sidebarMouseLeave"-->
            <header class="logo">
                <router-link to="/"><span class="primary-word">FCI</span></router-link>
            </header>
            <ul class="nav">
                <NavLink
                        v-if="getAuthType() == 'student'"
                        :activeItem="activeItem"
                        header="لوحة التحكم"
                        link="/SubjectsForStudent"
                        iconName="flaticon-home"
                        index="dashboard"
                        isHeader
                />
                <NavLink
                        v-if="getAuthType() == 'stuff'"
                        :activeItem="activeItem"
                        header="لوحة التحكم"
                        link="/SubjectsForStuff"
                        iconName="flaticon-home"
                        index="dashboard"
                        isHeader
                />
                <NavLink
                        v-if="getAuthType() == 'stuff'"
                        :activeItem="activeItem"
                        header="تقرير جميع المواد"
                        link="/SubjectsForStuffReport"
                        iconName="flaticon-file"
                        index="dashboard"
                        isHeader
                />
            </ul>

        </nav>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import isScreen from '@/core/screenHelper';
    import NavLink from './NavLink/NavLink';

    export default {
        name: 'Sidebar',
        components: {NavLink},
        data() {
            return {
                alerts: [],
            };
        },
        methods: {
            ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
            getAuthType() {
                let auth_data = JSON.parse(localStorage.getItem('auth_data'));
                if (auth_data) {
                    return auth_data.user.type
                }
                return ''
            },
            setActiveByRoute() {
                const paths = this.$route.fullPath.split('/');
                paths.pop();
                this.changeSidebarActive(paths.join('/'));
            },
            sidebarMouseEnter() {
                if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
                    this.switchSidebar(false);
                    this.setActiveByRoute();
                }
            },
            sidebarMouseLeave() {
                if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
                    this.switchSidebar(true);
                    this.changeSidebarActive(null);
                }
            },
        },
        created() {
            this.setActiveByRoute();
        },
        computed: {
            ...mapState('layout', {
                sidebarStatic: state => state.sidebarStatic,
                sidebarOpened: state => !state.sidebarClose,
                activeItem: state => state.sidebarActiveElement,
            }),
        },
    };
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
