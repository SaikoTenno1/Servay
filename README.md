# استبيان تقييم منطقة جديلة

مشروع ويب (HTML + CSS + JS بدون أي مكتبات) لجمع آراء السكان حول تطوير منطقة جديلة.

## هيكل المشروع

```
M/
├── index.html            # الهيكل الدلالي + مكتبة أيقونات SVG
├── css/
│   ├── tokens.css        # متغيرات التصميم
│   ├── base.css          # reset + خطوط
│   ├── layout.css        # الشريط العلوي + الهيرو + orbs + الظهور عند التمرير
│   ├── components.css    # الكروت + الخيارات + الأزرار + الأنيميشن
│   └── responsive.css    # موبايل أولًا: 380px / 600px / 960px
├── js/
│   ├── config.js         # رابط الـ API + الثوابت
│   ├── survey-data.js    # كل الأسئلة والأقسام
│   ├── utils.js          # esc + helpers
│   ├── storage.js        # حفظ المسودة في localStorage
│   ├── api.js            # collect() + submitSurvey()
│   ├── validation.js     # قواعد التحقق
│   ├── renderer.js       # بناء الفورم + الأيقونات
│   ├── progress.js       # شريط التقدم والعداد
│   └── main.js           # نقطة الدخول وربط الأحداث
└── assets/
    └── favicon.svg
```

## الأيقونات والأنيميشن

- 7 أيقونات SVG خطية (stroke) معرّفة كـ `<symbol>` في `index.html`، تُستخدم عبر `<use>` — خفيفة وتتلوّن بـ `currentColor` مع خلفية ملوّنة لكل قسم من `renderer.js`.
- الهيرو فيه 3 كرات ضبابية متحركة (`drift`) + دخول متدرج للمحتوى (`rise`).
- الأقسام والكروت تظهر تدريجيًا عند التمرير عبر `IntersectionObserver` في `main.js` (كلاس `rv`).
- لمعة متحركة على شريط التقدم (`shimmer`) وزر الإرسال، ونبضة (`pop`) عند اختيار إجابة، ورسمة متحركة لعلامة النجاح (`draw`).
- كل الأنيميشن يتوقف مع `prefers-reduced-motion`.

## التشغيل

```bash
python3 -m http.server 8000
```

ثم افتح `http://localhost:8000` (وحدات `type="module"` تحتاج `http`).

## التعديل

- **رابط الإرسال:** `js/config.js`
- **الأسئلة:** `js/survey-data.js`
- **الألوان:** `css/tokens.css`
- **قواعد التحقق:** `js/validation.js`
- **أيقونات الأقسام:** `index.html` (الـ symbols) + جدول `ICONS` في `js/renderer.js`
