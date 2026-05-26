# TARJUMAN — Brand Assets

## Цвета бренда

| Название | HEX | Использование |
|---|---|---|
| Forest Green | `#1B4332` | Основной цвет бренда |
| Gold | `#C9922A` | Акцент (элемент T) |
| Gold Light | `#D4A943` | Акцент на тёмных фонах |
| White | `#FFFFFF` | На тёмных фонах |

---

## Файлы логотипа

### Полный логотип (вертикальный)
| Файл | Когда использовать |
|---|---|
| `logo-green.svg` | Белый / светлый фон |
| `logo-white.svg` | Тёмный / зелёный фон |
| `logo-black.svg` | Печать / монохром |

### Горизонтальный логотип (для навбара)
| Файл | Когда использовать |
|---|---|
| `logo-horizontal-green.svg` | Светлый фон |
| `logo-horizontal-white.svg` | Тёмный фон / поверх фото |

### Только знак (иконка)
| Файл | Когда использовать |
|---|---|
| `mark-green.svg` | Светлый фон, аватар, иконка |
| `mark-white.svg` | Тёмный фон |

---

## Как вставить в React/Next.js

```jsx
// Горизонтальный — светлый фон
<img src="/brand/logo-horizontal-green.svg" height={36} alt="TARJUMAN" />

// Вертикальный — светлый фон
<img src="/brand/logo-green.svg" height={80} alt="TARJUMAN" />

// Только знак
<img src="/brand/mark-green.svg" height={40} alt="TARJUMAN" />
```

## Фавиконы (в /public/)
- `favicon.ico` — браузерная иконка
- `favicon-16x16.png` — 16×16
- `favicon-32x32.png` — 32×32
- `apple-touch-icon.png` — 180×180 (iPhone)
- `icon-512.png` — 512×512 (PWA / соцсети)
