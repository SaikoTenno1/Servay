# أصول الاستبيان (Python + uv)

## الإعداد (مرة واحدة)

```bash
cd py
uv sync
```

## توليد الصور

```bash
uv run python generate_assets.py
```

الناتج في `../assets/img/`:

| الملف | الاستخدام |
|---|---|
| `hero-bg.png` | خلفية الهيدر (1600×560) |
| `og-cover.png` | صورة المشاركة (1200×630) |
| `success.png` | شاشة النجاح |
| `sec-{social,env,economy,urban,culture,priority}.png` | أغلفة الأقسام (512) |
| `icon-*.png` | أيقونات صغيرة بجانب عنوان القسم (128) |

كل الصور من Pillow فقط (بدون APIs خارجية) وبنفس الهوية اللونية للمشروع.
