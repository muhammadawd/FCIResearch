<template>
    <div class="dashboard-page">
        <div class="loading text-center" v-if="loading"
             style="z-index: 9999;position:fixed;line-height: 550px;width: 100%;height: 100%;background: rgba(255,255,255,0.6);left: 0;top: 0;">
            <i class="fa fa-spin fa-spinner fa-2x"></i>
            <span>Loading</span>
            <span v-if="progress"> {{progress}}%</span>
        </div>

        <h3 class="page-title text-right">بيانات المواد</h3>

        <widget>
            <b-row class="text-right mb-3 direction">
                <!--<b-col md="4"></b-col>-->
                <b-col md="4" class="mb-2">
                    <label>المواد الخاصة بك</label>
                    <multiselect v-model="selected_subject" deselect-label="Can't remove this value" track-by="id"
                                 label="subject_name"
                                 placeholder="Select one" :options="subjects" :searchable="true" :allow-empty="false">
                    </multiselect>
                    <span id="subject_id_error" class="span-text-validation text-danger text-bold"></span>
                </b-col>
                <b-col md="12" class="text-right">
                    <button class="btn btn-primary" @click="getSubjectData()" :disabled="!selected_subject">
                        بحث
                    </button>
                </b-col>
            </b-row>
        </widget>

        <b-row v-if="statistics" class="text-right mb-3 direction">
            <b-col md="3">
                <div class="pb-xlg h-100">
                    <section class="h-100 mb-0 widget">
                        <i class="la la-users w-25 la-3x text-primary"></i>
                        <h6 class="title w-75 d-inline-block"> اجمالى عدد الطلاب فى المادة المختارة </h6>
                        <div class="widgetControls widget-controls">

                        </div>
                        <div class="widgetBody widget-body ">
                            <h4 class="font-weight-bold text-center">{{statistics.all_students_count}}</h4>
                        </div>
                    </section>
                </div>
            </b-col>
            <b-col md="3">
                <div class="pb-xlg h-100">
                    <section class="h-100 mb-0 widget">
                        <i class="la la-file w-25 la-3x text-primary"></i>
                        <h6 class="title w-75 d-inline-block"> اجمالى عدد الملفات المرفوعة فى المادة </h6>
                        <div class="widgetControls widget-controls">

                        </div>
                        <div class="widgetBody widget-body ">
                            <h4 class="font-weight-bold text-center">{{statistics.files_count}}</h4>
                        </div>
                    </section>
                </div>
            </b-col>
            <b-col md="3">
                <div class="pb-xlg h-100">
                    <section class="h-100 mb-0 widget">
                        <i class="la la-file w-25 la-3x text-primary"></i>
                        <h6 class="title w-75 d-inline-block">اجمالى الطلاب الغير رافعين ملفات</h6>
                        <div class="widgetControls widget-controls">

                        </div>
                        <div class="widgetBody widget-body ">
                            <h4 class="font-weight-bold text-center">{{statistics.student_without_files}}</h4>
                        </div>
                    </section>
                </div>
            </b-col>
            <b-col md="3">
                <div class="pb-xlg h-100">
                    <section class="h-100 mb-0 widget">
                        <div class="widgetBody widget-body ">
                            <h5 class="font-weight-bold text-center">
                                <i class="la la-download   la-3x text-primary"></i>
                                <a :href="getDownloadLink(selected_subject.id)">
                                    تحميل جميع الملفات
                                </a>
                            </h5>
                        </div>
                    </section>
                </div>
            </b-col>

        </b-row>


        <b-row class="text-right direction">
            <b-col xs="12">
                <Widget
                        title="<h5> <span class='fw-semi-bold'>بيانات الطلاب</span></h5>"
                        bodyClass="widget-table-overflow"
                        customHeader>
                    <div class="table-responsive">
                        <div class="span-text-validation text-center text-danger text-bold"
                             id="file_error"></div>
                        <table class="table table-striped table-lg mb-0 requests-table">
                            <thead>
                            <tr class="text-muted">
                                <th>اسم الطالب</th>
                                <th>الرقم القومي</th>
                                <th>الايميل</th>
                                <th>القسم</th>
                                <th>الحالة</th>
                                <th>المستوي</th>
                                <th>الملف</th>
                            </tr>
                            </thead>
                            <tbody v-if=" students.length ==0">
                            <tr>
                                <td colspan="7">لا توجد بيانات</td>
                            </tr>
                            </tbody>
                            <tbody>
                            <tr v-for="row in students"
                                :key="row.id">
                                <td>{{row.student.stu_name}}</td>
                                <td>{{row.student.academic_email}}</td>
                                <td>{{row.student.dept}}</td>
                                <td>{{row.student.status}}</td>
                                <td>{{row.student.level}}</td>
                                <td>{{row.student.national_num}}</td>
                                <td>
                                    <a v-if="row.file" :href="row.file.file_path" target="_blank">
                                        تحميل
                                    </a>
                                </td>
                            </tr>
                            </tbody>
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
                selected_subject: null,
                subjects: [],
                students: [],
                statistics: null,
            };
        },
        methods: {
            getDataApi() {
                let vm = this;
                vm.loading = true
                vm.$serviceAPI.API().get(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.GET_ALL_SUBJECTS)
                    .then(function (response) {
                        // handle success
                        vm.loading = false
                        response = response.data;
                        let status = response.status;
                        let data = response.data;
                        if (status) {
                            vm.subjects = data.subjects;
                            return
                        }
                        vm.subjects = []

                    })
                    .catch(function (error) {
                        vm.loading = false
                        vm.subjects = []
                        // handle error
                        vm.$helper.handleError(error, vm)
                    })
            },
            getDownloadLink(id) {
                return this.$serviceAPI.BASE_URL + this.$serviceAPI.GET_DOWNLOAD_LINK + `/${id}`;
            },
            getSubjectData() {
                let vm = this;
                vm.loading = true
                let id = vm.selected_subject ? vm.selected_subject.id : null;
                vm.$serviceAPI.API().get(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.GET_ALL_STUDENT_SUBJECTS + `/${id}`)
                    .then(function (response) {
                        // handle success
                        vm.loading = false
                        response = response.data;
                        let status = response.status;
                        let data = response.data;
                        if (status) {
                            vm.students = data.students;
                            vm.statistics = data.statistics;
                            return
                        }
                        vm.students = []
                        vm.statistics = []

                    })
                    .catch(function (error) {
                        vm.loading = false
                        vm.statistics = []
                        vm.students = []
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
