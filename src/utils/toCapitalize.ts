/**
 ** ======================================================
 ** Utility Method [toCapitalize]
 ** ======================================================
 */
export const toCapitalize = (val: string) => {
    if (!val) return ''
    return val.slice(0, 1).toUpperCase() + val.slice(1)
}
