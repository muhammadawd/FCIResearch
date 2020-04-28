export const helper = {
    prepareObjectToSend: (request_data) => {
        return request_data;
    },
    removeFromArray: (array, remove) => {
        const index = array.indexOf(remove);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array
    },
    generateRandomValues() {
        return Math.random().toString(36).slice(-8);
    },
    diffForhuman(date) {
        if (!date) return '';
        let delta = Math.round((new Date() - new Date(date)) / 1000);

        let minute = 60;
        let hour = minute * 60;
        let day = hour * 24;
        let week = day * 7;

        let fuzzy = '';

        if (delta < 30) {
            fuzzy = 'just then.';
        } else if (delta < minute) {
            fuzzy = delta + ' seconds ago.';
        } else if (delta < 2 * minute) {
            fuzzy = 'a minute ago.'
        } else if (delta < hour) {
            fuzzy = Math.floor(delta / minute) + ' minutes ago.';
        } else if (Math.floor(delta / hour) == 1) {
            fuzzy = '1 hour ago.'
        } else if (delta < day) {
            fuzzy = Math.floor(delta / hour) + ' hours ago.';
        } else if (delta < day * 2) {
            fuzzy = 'yesterday';
        } else if (delta < week) {
            fuzzy = Math.floor(delta / day) + 1 + ' days ago.';
        } else {
            fuzzy = ''
        }

        return fuzzy
    },
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    hasAccessPermission: (permission) => {
        // return true;
        let user = JSON.parse(localStorage.getItem('auth_data'));
        if (permission == 'ALLOW_ALL') {
            return true
        } else if (user.permissions.includes(permission)) {

            return true;
        } else {

            return false;
        }
        // if (user.permissions.includes(permission)) return true;
    },
    deleteMulti(ids, collection) {
        return _.dropWhile(collection, function (n) {
            return _.includes(ids, n.id);
        });
    },
    getTranslatedData(model, l = 'ar') {
        let lang = _.map(model.details, function (o) {
            if (o.lang == l) return o;
        });
        lang = _.without(lang, undefined);
        return lang[0];
    },
    JSON_to_URLEncoded(element, key, list) {
        var list = list || [];
        if (typeof (element) == 'object') {
            for (var idx in element)
                JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
        } else {
            list.push(key + '=' + encodeURIComponent(element));
        }
        return list.join('&');
    },
    showMessage: (type, vm, message = '') => {
        console.log(`${type == 'success' ? vm.$ml.get('success') : vm.$ml.get('error')}`)
        vm.$swal({
            icon: 'info',
            title: `${type == 'success' ? vm.$ml.get('success') : vm.$ml.get('error')}`,
            text: `${type == 'success' ? vm.$ml.get('success_msg') + ' ' + message : vm.$ml.get('error_msg') + ' ' + message}`,
            timer: 1000
        });
    },
    validationGroupingData: (xs, key) => {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    },
    addErrors: (inputs, errors) => {
        for (let input in inputs) {
            try {
                // console.log(input)
                document.getElementById(input + '_error').innerText = ' ';
            } catch (e) {

                console.log(e)
            }
        }
        for (const [key, value] of Object.entries(errors)) {
            try {
                // console.log(key)
                setTimeout(() => {
                    document.getElementById(key + '_error').innerText = value[0];
                }, 300)
            } catch (e) {
                console.log(e)
            }
        }
    },
    handleError: (error, vm) => {
        // request error cause of offline using
        if (!navigator.onLine) return;

        if (error.response) {
            // The request was made and the server responded with a status code

            if (error.response.status == 422) {
                // let validations = window.helper.validationGroupingData(error.response.data.data, 'param');
                let validations = error.response.data.data.validation_errors;
                try {
                    for (const [key, value] of Object.entries(validations)) {
                        if (key == 'error_delete') vm.displayError = true;
                    }
                    vm.$helper.addErrors(vm.dataModel, validations);
                } catch (e) {

                }
                return;
            }
            if (error.response.status == 401) {
                vm.$router.push({name: 'login'})
                return;
            }

            if (error.response.status == 403) {
                vm.$router.push({name: 'pageError403'})
                return;
            }

            // default 500 message
            let message = 'حدث خطأ غير متوقع من الخادم';
            if (error.response.status == 401) message = 'انتهت الجلسة عليك تسجيل الدخول';
            if (error.response.status == 403) message = 'غير مسموح';
            if (error.response.status == 404) message = 'الرابط غير موجود';

            // vm.$notify({
            //   // icon: "ti-info",
            //   horizontalAlign: 'center',
            //   verticalAlign: 'top',
            //   text: `Server Error Code : ${error.response.status}`,
            //   title: `${message}`,
            //   type: 'danger'
            // });
            // console.log(error.response.data, error.response.status, error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // vm.$notify({
            //   // icon: "ti-info",
            //   horizontalAlign: 'center',
            //   verticalAlign: 'top',
            //   text: `${vm.$ml.get('error')}`,
            //   title: `خطأ فى استرجاع البيانات من الخادم برجاء المحاولة مرة اخري`,
            //   type: 'danger'
            // });
            // console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            // vm.$notify({
            //   icon: "ti-info",
            //   horizontalAlign: 'center',
            //   verticalAlign: 'top',
            //   title: `${vm.$ml.get('error')}`,
            //   message: error.message,
            //   type: 'danger'
            // });
            // console.log('Error', error.message);
        }
    },
    formatDate: (value, format = 'MM-DD hh:mm a') => {
        if (value) {
            return moment(new Date(value)).format(format)
        }
    },
    diffTwoDates: (from_date, to_date) => {
        return moment(new Date(from_date)).diff(to_date, 'days')
    },
    splitHostname() {
        let result = {};
        let url = window.location.href;

        url = url.replace(new RegExp(/^\s+/), "");
        url = url.replace(new RegExp(/\s+$/), "");
        url = url.replace(new RegExp(/\\/g), "/");
        url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i), "");
        url = url.replace(new RegExp(/^www\./i), "");
        url = url.replace(new RegExp(/\/(.*)/), "");
        if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
            url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");
        } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
            url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
        }
        result.hasSubdomain = (url.match(new RegExp(/\./g))) ? true : false;
        result.data = url.split('.');
        return result;
    },
    saveAccountCredential(data) {
        let key = 'accountApi';
        let accountApi = JSON.parse(localStorage.getItem(key));
        if (accountApi) {
            // append data
            _.forEach(data, (v, k) => {
                accountApi[k] = v
            })
            localStorage.setItem(key, JSON.stringify(accountApi));
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
};
