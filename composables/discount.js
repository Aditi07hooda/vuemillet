export const calculateDiscount = (price, offerPrice) => {
    const discount = ((price - offerPrice) / price) * 100
    return Math.round(discount)
}