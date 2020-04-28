<template>
    <div class="dashboard-page">
        <div class="loading text-center" v-if="loading"
             style="z-index: 9999;position:fixed;line-height: 550px;width: 100%;height: 100%;background: rgba(255,255,255,0.6);left: 0;top: 0;">
            <i class="fa fa-spin fa-spinner fa-2x"></i>
            <span>Loading</span>
            <!--<span v-if="progress"> {{progress}}%</span>-->
        </div>

        <h3 class="page-title text-right">بيانات الطلاب</h3>

        <widget>
            <b-row class="text-right mb-3 direction">
                <!--<b-col md="4"></b-col>-->
                <b-col md="4" class="mb-2">
                    <label>ادخل رقم البطاقة</label>
                    <the-mask mask="##############" type="text" class="form-control text-left"
                              @keyup.enter="getDataApi()"
                              v-model="national_num"></the-mask>
                    <span id="national_num_error" class="span-text-validation text-danger text-bold"></span>
                </b-col>
                <b-col md="12" class="text-right">
                    <button class="btn btn-primary" @click="getDataApi()">
                        بحث
                    </button>
                </b-col>
            </b-row>
        </widget>

        <widget v-if="student">
            <b-row class="text-right mb-3 direction">
                <b-col md="4">
                    <label>اسم الطالب</label>
                    <input type="text" class="form-control" :value="student.stu_name" disabled>
                </b-col>
                <b-col md="4">
                    <label>سنة الدراسة</label>
                    <input type="text" class="form-control" :value="student.level" disabled>
                </b-col>
                <b-col md="4">
                    <label>القسم</label>
                    <input type="text" class="form-control" :value="student.dept" disabled>
                </b-col>
                <b-col md="4">
                    <label>الحالة</label>
                    <input type="text" class="form-control" :value="student.status" disabled>
                </b-col>
                <b-col md="4">
                    <label>الايميل الرسمي</label>
                    <input type="text" class="form-control" :value="student.academic_email" disabled>
                </b-col>
            </b-row>
        </widget>

        <b-row class="text-right direction">
            <b-col xs="12">
                <Widget
                        title="<h5>المواد المسجلة <span class='fw-semi-bold'>للطالب</span></h5>"
                        bodyClass="widget-table-overflow"
                        customHeader>
                    <div class="table-responsive">
                        <div class="span-text-validation text-center text-danger text-bold"
                             id="file_error"></div>
                        <table class="table table-striped table-lg mb-0 requests-table">
                            <thead>
                            <tr class="text-muted">
                                <th>اسم المادة</th>
                                <th>الكود</th>
                                <th>الملف المرفوع</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody v-if="!student || student.student_subjects.length ==0">
                            <tr>
                                <td colspan="3">لا توجد بيانات</td>
                            </tr>
                            </tbody>
                            <tbody v-if="student">
                            <tr
                                    v-for="row in student.student_subjects"
                                    :key="row.id"
                            >
                                <td>{{row.subject.subject_name}}</td>
                                <td>{{row.subject.dept_name}}</td>
                                <td>
                                    <div v-if="row.file == null">
                                        <!--accept="application/pdf,application/vnd.ms-excel"-->
                                        <input type="file" ref="file"
                                               accept="application/pdf,application/vnd.ms-excel"
                                               class="vs-inputx vs-input--input normal"
                                               v-on:change="handleFileUpload(row.id)">
                                        <div class="progress-sm mb-xs progress mt-2">
                                            <div role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                                 :aria-valuenow="progress" class="progress-bar bg-primary"
                                                 :style="{width:`${progress}%`}">
                                                <!----></div>
                                        </div>
                                    </div>
                                    <div style="overflow: hidden" v-if="row.file"
                                         :id="'file_row_'+row.file.id">
                                        <a class="text-info" :href="row.file.file_path" target="_blank">عرض الملف</a>
                                        <button class="btn btn-danger float-left" @click="deleteFile(row.file.id)">حذف
                                            الملف
                                        </button>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Widget>
                <div class="alert alert-sm alert-info">
                    يجب عدم رفع اى ملف منسوخ او منقول من احد لان الملفات المرفوعة سيتم مراجعتها ببرنامج كشف الاقتباس
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
    import Widget from '@/components/Widget/Widget';
    import BigStat from './components/BigStat/BigStat';
    import {TheMask, mask} from 'vue-the-mask'

    export default {
        name: 'Dashboard',
        components: {
            Widget, BigStat, TheMask
        },
        directives: {mask},
        data() {
            return {
                national_num: '',
                student: null,
                file: null,
                loading: false,
                progress: 0,
            };
        },
        methods: {
            getDataApi() {
                let vm = this;
                vm.loading = true
                if (vm.national_num.length < 14) {
                    document.getElementById('national_num_error').innerText = 'رقم البطاقة يجب ان يكون 14 رقم';
                    vm.loading = false
                    return;
                } else {
                    document.getElementById('national_num_error').innerText = '';
                }

                vm.$serviceAPI.API().get(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.FIND_SSN + vm.national_num)
                    .then(function (response) {
                        // handle success
                        vm.loading = false
                        response = response.data;
                        let status = response.status;
                        let data = response.data;
                        try {
                            if (!status) {
                                vm.student = null;
                                let validation_messages = (data.validation_errors)
                                for (var key in validation_messages) {
                                    // skip loop if the property is from prototype
                                    if (!validation_messages.hasOwnProperty(key)) continue;

                                    var obj = validation_messages[key];
                                    for (var prop in obj) {
                                        // skip loop if the property is from prototype
                                        if (!obj.hasOwnProperty(prop)) continue;

                                        // your code
                                        document.getElementById(key + "_error").innerText = obj[prop];
                                    }
                                }
                                return
                            }
                            vm.student = data.student;

                            vm.loading = false
                        } catch (e) {
                            vm.loading = false
                            vm.student = null;
                        }
                    })
                    .catch(function (error) {
                        vm.loading = false
                        // handle error
                        vm.$helper.handleError(error, vm)
                    })
            },
            handleFileUpload(id) {
                let vm = this;
                vm.uploadFile(id, vm.$refs.file[0].files[0])
            },
            deleteFile(id) {
                let vm = this;
                vm.$swal({
                    title: 'تنبيه',
                    text: 'هل انت متأكد ؟',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'نعم',
                    cancelButtonText: 'لا',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {

                        // vm.loading = true
                        vm.$serviceAPI.API().post(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.DELETE_FILE + id).then(response => {
                            response = response.data;
                            if (response.status) {
                                // document.getElementById('file_row_' + id).remove()
                                vm.$swal({
                                    title: 'الحذف',
                                    text: 'تمت عملية الحذف بنجاح',
                                    type: 'success',
                                    timer: 2000
                                });
                                vm.getDataApi()
                            }
                            // vm.loading = false
                            console.log(response)
                        }).catch(error => {
                            // vm.loading = false
                            vm.$helper.handleError(error, vm)
                        })

                    } else {

                    }
                })
            },
            uploadFile(id, file) {
                const vm = this;
                vm.progress = 0;
                vm.loading = true;
                let form_data = new FormData();
                form_data.append('students_subjects_id', id);
                form_data.append('file', file);
                try {
                    vm.$serviceAPI.API().post(vm.$serviceAPI.BASE_URL + vm.$serviceAPI.UPLOAD_FILE, form_data, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }, onUploadProgress: function (progressEvent) {
                            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            vm.progress = percentCompleted;
                            console.log(percentCompleted)
                        }
                    })
                        .then((response) => {
                            vm.$swal({
                                title: 'تنبيه',
                                text: 'تمت رفع الملف بنجاح',
                                type: 'success',
                                timer: 1000
                            })
                            vm.progress = 0;
                            vm.loading = false
                            vm.getDataApi()
                            // location.reload()
                        }).catch((error) => {
                        vm.loading = false
                        vm.progress = 0;
                        vm.dataModel = {file: ''}
                        vm.$helper.handleError(error, vm);

                    });
                } catch (e) {

                }
            },

        },
        computed: {}
    };
</script>


<style src="./Dashboard.scss" lang="scss"/>
