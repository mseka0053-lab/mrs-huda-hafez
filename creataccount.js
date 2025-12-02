const fs = require('fs'); // لو شغال على Node.js
const readline = require('readline-sync'); // لتجربة على الترمنال

// تحميل بيانات الطلاب
let students = [];
if (fs.existsSync('students.json')) {
    const data = fs.readFileSync('students.json', 'utf8');
    students = JSON.parse(data);
}

// دالة لتوليد الكود تلقائي
function generateStudentCode(grade) {
    // تحديد الرقم الأول حسب المرحلة
    const gradeNumberMap = {
        "الصف الأول الإعدادي": 1,
        "الصف الثاني الإعدادي": 2,
        "الصف الثالث الإعدادي": 3,
        "الصف الأول الثانوي": 4,
        "الصف الثاني الثانوي": 5
    };

    const gradeNum = gradeNumberMap[grade];

    // الرقم الثاني حسب المستوى
    let levelNum = 0;
    if (gradeNum <= 3) levelNum = 1; // إعدادي
    else levelNum = 2; // ثانوي

    // الرقمين الأخيرين ترتيب الطالب في نفس المرحلة والمستوى
    const sameGrade = students.filter(s => {
        const firstDigit = parseInt(s.id.charAt(0));
        const secondDigit = parseInt(s.id.charAt(1));
        return firstDigit === gradeNum && secondDigit === levelNum;
    });

    let orderNum = sameGrade.length + 1;
    if (orderNum > 99) orderNum = 99; // أقصى ترتيب 99

    // تحويل الرقمين الأخيرين لسلسلة مكونة من رقمين
    const orderStr = orderNum.toString().padStart(2, '0');

    return `${gradeNum}${levelNum}${orderStr}`;
}

// دالة إنشاء الطالب الجديد
function createStudent(name, grade) {
    const id = generateStudentCode(grade);
    const newStudent = {
        id: id,
        name: name,
        grade: grade,
        unitProgress: {},
        assignments: {},
        exams: {}
    };
    students.push(newStudent);

    // حفظ البيانات مرة أخرى في JSON
    fs.writeFileSync('students.json', JSON.stringify(students, null, 2), 'utf8');
    console.log(`تم إنشاء الحساب بنجاح! كود الطالب: ${id}`);
}

// === تجربة على الترمنال ===
const studentName = readline.question("ادخل اسم الطالب: ");
console.log("اختر المرحلة: \n1- الصف الأول الإعدادي\n2- الصف الثاني الإعدادي\n3- الصف الثالث الإعدادي\n4- الصف الأول الثانوي\n5- الصف الثاني الثانوي");
const gradeChoice = readline.question("ادخل رقم المرحلة: ");

const gradeMap = {
    "1": "الصف الأول الإعدادي",
    "2": "الصف الثاني الإعدادي",
    "3": "الصف الثالث الإعدادي",
    "4": "الصف الأول الثانوي",
    "5": "الصف الثاني الثانوي"
};

createStudent(studentName, gradeMap[gradeChoice]);
