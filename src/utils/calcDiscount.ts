/**
 ** ======================================================
 ** Utility Method [calcDiscount]
 ** ======================================================
 */
export const calcDiscount = (price: number, selling_price: number) => {
    return {
        discount_percent: (((price - selling_price) * 100) / price).toFixed(2),
        discount_value: (price - selling_price).toFixed(2),
    }
}
