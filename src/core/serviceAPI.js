import axios from 'axios'

let vm = this;
let BASE_URL = 'http://approc.com/~approctest/students/api/';

export const serviceAPI = {
    BASE_URL: 'http://approc.com/~approctest/students/api/',
    AUTH_LOGIN: 'common/login',
    AUTH_FORGET_PASSWORD: 'common/resetPassword',
    AUTH_RESET_PASSWORD: 'common/handleResetPassword',
    FIND_SSN: 'student/findByNationalNumber/',
    DELETE_FILE: 'student/deleteSubjectFile/',
    UPLOAD_FILE: 'student/uploadSubjectFile',
    GET_ALL_SUBJECTS: 'stuff/getAllSubjectsStuff',
    GET_ALL_STUDENT_SUBJECTS: 'student/getStudentSubject',
    GET_DOWNLOAD_LINK: 'student/downloadSubjectFiles',

    GET_ALL_SUBJECTS_REPORT: 'student/getAllSubjects',


    API: () => {

        let token = null;
        try {
            let auth_data = localStorage.getItem('auth_data');
            auth_data = JSON.parse(auth_data);
            token = auth_data.token;
        } catch (e) {
            token = null;
        }
        return axios.create({
            baseURL: BASE_URL,
            withCredentials: false,
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
    },
}
