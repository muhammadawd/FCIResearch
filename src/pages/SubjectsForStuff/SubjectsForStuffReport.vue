<template>
    <div class="dashboard-page">
        <div class="loading text-center" v-if="loading"
             style="z-index: 9999;position:fixed;line-height: 550px;width: 100%;height: 100%;background: rgba(255,255,255,0.6);left: 0;top: 0;">
            <i class="fa fa-spin fa-spinner fa-2x"></i>
            <span>Loading</span>
            <span v-if="progress"> {{progress}}%</span>
        </div>

        <!--<h3 class="page-title text-right">تقرير المواد</h3>-->

        <b-row class="text-right direction">
            <b-col xs="12">
                <Widget
                        title="<h5> <span class='fw-semi-bold'>بيانات المواد</span></h5>"
                        bodyClass="widget-table-overflow"
                        customHeader>
                    <div class="table-responsive">
                        <div class="span-text-validation text-center text-danger text-bold"
                             id="file_error"></div>
                        <table class="table table-striped table-lg mb-0 requests-table">
                            <thead>
                            <tr class="text-muted">
                                <th>اسم المادة</th>
                                <th>القسم</th>
                                <th>جميع الطلاب</th>
                                <th>عدد الملفات المرفوعة</th>
                                <th>عدد الملفات الغير مرفوعة</th>
                            </tr>
                            </thead>
                            <tbody v-if="subjects.length ==0">
                            <tr>
                                <td colspan="7">لا توجد بيانات</td>
                            </tr>
                            </tbody>
                            <tbody>
                            <tr v-for="row in subjects"
                                :key="row.id">
                                <td>{{row.subject_name}}</td>
                                <td>{{row.dept_name}}</td>
                                <td>{{row.statistics.all_students_count}}</td>
                                <td>{{row.statistics.files_count}}</td>
                                <td>{{row.statistics.student_without_files}}</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr class="text-info">
                                <td colspan="2"></td>
                                <td class="font-weight-bold">{{statistics.all_students_count}}</td>
                                <td class="font-weight-bold">{{statistics.files_count}}</td>
                                <td class="font-weight-bold">{{statistics.student_without_files}}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </Widget>
            </b-col>
        </b-row>
    </div>
</template>
<script>
    import Widget from '@/components/Widget/Widget';
    import BigStat from './components/BigStat/BigStat';
    import Multiselect from 'vue-multiselect'

    export default {
        name: 'SubjectForStuff',
        components: {
            Widget, BigStat, Multiselect
        },
        data() {
            return {
                loading: false,
                progress: 0,
                subjects: [],
                statistics: null,
            };
        },
        methods: {
            getDataApi() {
                let vm = this;
                vm.loading = true
                vm.$serviceAPI.API().get(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.GET_ALL_SUBJECTS_REPORT)
                    .then(function (response) {
                        // handle success
                        vm.loading = false
                        response = response.data;
                        let status = response.status;
                        let data = response.data;
                        if (status) {
                            vm.subjects = data.subjects;
                            vm.statistics = data.statistics;
                            return
                        }
                        vm.subjects = []
                        vm.statistics = null

                    })
                    .catch(function (error) {
                        vm.loading = false
                        vm.subjects = []
                        vm.statistics = null
                        // handle error
                        vm.$helper.handleError(error, vm)
                    })
            },
        },
        mounted() {
            this.getDataApi();
        },
        computed: {}
    };
</script>


<style src="./Dashboard.scss" lang="scss"/>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
