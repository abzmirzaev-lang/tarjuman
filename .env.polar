# ─── POLAR.SH ──────────────────────────────────────────────
# 1. Создай организацию на https://polar.sh
# 2. Перейди: Settings → API → Create Token
POLAR_ACCESS_TOKEN=pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# "sandbox" для тестирования, "production" для боевого
POLAR_SERVER=sandbox

# 3. Создай 3 продукта в Polar (Products → New Product) и скопируй их ID:
#    - SUBMISSION  ($49 или другая цена)
#    - STANDARD    ($99 или другая цена)
#    - VIP         ($199 или другая цена)
POLAR_PRODUCT_SUBMISSION=prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POLAR_PRODUCT_STANDARD=prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POLAR_PRODUCT_VIP=prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 4. Создай Webhook: Settings → Webhooks → New Endpoint
#    URL: https://твой-домен.com/api/polar/webhook
#    Events: order.paid
#    Скопируй секрет:
POLAR_WEBHOOK_SECRET=whs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
