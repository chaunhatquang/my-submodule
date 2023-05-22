export const checkIsNotNull = (value: any) => {
    if (value != null && value.length > 0) {
        return true
    } else {
        return false
    }
}