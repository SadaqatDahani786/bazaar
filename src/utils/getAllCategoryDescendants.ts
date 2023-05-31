import { ICategory } from '../store/categoryReducer'

/**
 ** ======================================================
 ** Utility Method [getAllCategoryDescendants]
 ** ======================================================
 */
export const getAllCategoryDescendants = (
    categories: ICategory[],
    slugs: string[],
    acc: ICategory[] = []
): ICategory[] => {
    if (categories.some((cat) => slugs.includes(cat.parent?.slug))) {
        const catsinParent = categories.filter((cat) =>
            slugs.includes(cat.parent?.slug)
        )

        acc.push(...catsinParent)

        return getAllCategoryDescendants(
            categories,
            catsinParent.map((cat) => cat.slug),
            acc
        )
    } else return acc
}
