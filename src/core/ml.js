import Vue from 'vue'
import {MLInstaller, MLCreate, MLanguage} from 'vue-multilanguage'

Vue.use(MLInstaller);

export default new MLCreate({
    initial: 'ar',
    gettingStrategy: 'default',
    // development  , production
    save: process.env.NODE_ENV === 'development',
    languages: [
        new MLanguage('en').create({
            ar: 'Arabic language',
            en: 'English language',
            app: 'App',
            control_panel: 'Control Panel',
            home: 'Home',
            notifications: 'Notifications',
            statistics: 'Statistics',
            app_core: 'App Core',
            meals: 'Meals',
            categories: 'Categories',
            units: 'Units',
            options: 'Options',
            menu: 'Menu',
            all_items: 'All Items',
            orders: 'Orders',
            subscription: 'Subscription',
            delivery: 'Delivery',
            offers: 'Offers',
            printing: 'Printing',
            reports: 'Reports',
            invoices: 'Invoices',
            uncompleted_order_report: 'Uncompleted Order Report',
            cancelled_order_report: 'Cancelled Order Report',
            subscriptions_report: 'Subscriptions Report',
            user_rates_report: 'Users Rate Reports',
            uses_monthly_report: 'Uses Monthly Stock Report',
            orders_monthly_report: 'Orders Monthly Report',
            search: 'Search',
            about_categories: 'About Categories',
            search_word: 'Search Work In Description',

        }),

        new MLanguage('ar').create({
            ar: 'اللغة العربية',
            en: 'اللغة الانجليزية',
            app: 'التطبيق',
            loading: 'جاري التحميل',
            success: 'نجاح',
            error: 'خطأ',
            success_msg: 'تمت العملية بنجاح',
            error_msg: 'حدث خطأ',
            are_sure: 'هل انت متأكد سيتم حذف جميع البيانات المرتبطة بها !',
            are_sure_: 'هل انت متأكد !',
            confirm: 'تأكيد',
            yes: 'نعم',
            no: 'ﻻ',
            show_image: 'عرض الصورة',
            // title:'',
        })
    ]
})
