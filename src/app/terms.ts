export const terms = {
    
    appVersion: '2022.08.16.5',
    home: 'סמס לו - שליחת מסרים לסלולרי',
    UserRoleNOTSET:'חובה סוג הרשאה',
    appName: 'מנהיגות תורנית',
    name: 'שם',
    requiredField: 'חובה', 
    uniqueField:'קיים',
    status: 'סטטוס',
    coordinstall: 'תיאום התקנות',
    missions: 'משימות',
    customers: 'לקוחות',
    reports: 'דוחות',
    username: "שם משתמש",
    mobile: 'סלולרי',
    createDate: 'נוצר ב',
    signIn: "כניסה",
    confirmPassword: "אימות סיסמה",
    signUp: "הרשמה",
    signOut: "התנתקות",
    date: "תאריך",
    resetPassword: 'איפוס סיסמה',
    doesNotMatchPassword: "סיסמאות אינן דומות",
    passwordDeletedSuccessful: 'סיסמה אופסה בהצלחה',
    password: 'סיסמה',
    updateInfo: "עדכון פרטים",
    changePassword: "שינוי סיסמה",
    hello: "שלום",
    invalidOperation: "פעולה אינה חוקית",
    admin: 'אדמין',
    manager: 'מנהל',
    shluch: 'שליח',
    avrech: 'אברך',
    shluchim: 'שלוחים',
    avrechim: 'אברכים',
    userAccounts: 'משתמשים',
    currentState: 'תצוגת מצב',
    myDetails: 'פרטים שלי',
    myLectures: 'נושאים שלי',
    yes: 'כן',
    update: 'עדכן',
    no: 'לא',
    ok: 'אישור',
    areYouSureYouWouldLikeToDelete: "בטוח למחוק את ",
    cancel: 'ביטול',
    users: 'משתמשים',
    couriers: 'שליחים',
    welcome: 'ברוכים הבאים',
    invalidSignIn: 'פרטי התחברות שגויים',
    invalidSignUp:'שגיאה בהרשמה',
    rememberOnThisDevice: 'זכור אותי',
    passwordDeleteConfirmOf: 'בטוח לאפס סיסמה ל: ',
    addUser: 'הוספת משתמש',
    addShluch: 'הוספת שליח',
    addAvrech: 'הוספת אברך',
    addCourse: 'הוספת קורס',
    addLecture: 'הוספת נושא חדש',
    addLectureExists:'הוספת  קיים',
    addLecturesGrades:'העלאת גליון ציונים',
    sendSigninDetails: 'שלח פרטי התחברות',
    send:'שליחה',
    mobiles:'סלולרים',
    groups:'קבוצות',
    smsim:'הודעות'
}

export const DEFUALT_TIME_WIDTH = '69'
export const DEFUALT_DATE_WIDTH = '99'
export const DEFUALT_BOOL_WIDTH = '45'
export const DEFUALT_DAY_WIDTH = '45'
export const DEFUALT_STRING_WIDTH = '99'
export const DEFUALT_MOBILE_WIDTH = '109'

declare module 'remult' {
    export interface UserInfo {
        isAdmin: boolean;
        // isManager: boolean;
        // isShluch: boolean;
        // isAvrech: boolean;
    }
}
