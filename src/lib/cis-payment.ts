/**
 * TARJUMAN — CIS Payment Adapter (UzCard / Humo)
 *
 * This is a clean adapter/placeholder for integrating Uzbekistan
 * payment providers (Payme, Click, etc.).
 *
 * To integrate Payme (paycom.uz):
 * 1. Register merchant at https://payme.uz/main/registration
 * 2. Get MERCHANT_ID and SECRET_KEY
 * 3. Implement the methods below according to Payme API docs:
 *    https://developer.paycom.uz/
 *
 * To integrate Click:
 *    https://docs.click.uz/
 */

export interface CISCheckoutOptions {
  applicationId:  string
  userId:         string
  amountUZS:      number      // amount in Uzbek soums
  description:    string
  returnUrl:      string
  callbackUrl:    string
}

export interface CISCheckoutResult {
  checkoutUrl:   string
  transactionId: string
}

/**
 * Create a checkout session with the CIS payment provider.
 * Replace the body of this function with your provider's SDK calls.
 */
export async function createCISCheckout(options: CISCheckoutOptions): Promise<CISCheckoutResult> {
  const { applicationId, amountUZS, description, returnUrl, callbackUrl } = options

  const merchantId = process.env.CIS_PAYMENT_MERCHANT_ID
  const secretKey  = process.env.CIS_PAYMENT_SECRET_KEY
  const apiUrl     = process.env.CIS_PAYMENT_API_URL ?? 'https://checkout.paycom.uz'

  if (!merchantId || !secretKey) {
    throw new Error('CIS payment credentials not configured')
  }

  // ─────────────────────────────────────────────
  // TODO: Replace with actual Payme/Click API call
  // ─────────────────────────────────────────────
  //
  // Example for Payme:
  // const params = {
  //   merchant:    merchantId,
  //   amount:      amountUZS * 100,  // in tiyin (1 UZS = 100 tiyin)
  //   account:     { order_id: applicationId },
  //   callback:    callbackUrl,
  //   return_url:  returnUrl,
  //   description,
  //   lang:        'ru',
  // }
  // const base64 = btoa(`${merchantId}:${secretKey}`)
  // const encoded = btoa(JSON.stringify(params))
  // return {
  //   checkoutUrl:   `${apiUrl}/${encoded}`,
  //   transactionId: applicationId,
  // }

  throw new Error('CIS payment not yet implemented. See src/lib/cis-payment.ts')
}

/**
 * Verify a callback from the payment provider.
 * Call this from your CIS webhook route.
 */
export async function verifyCISPayment(transactionId: string): Promise<{
  paid:   boolean
  amount: number
}> {
  // TODO: Verify payment status with provider API
  throw new Error('Not implemented')
}
