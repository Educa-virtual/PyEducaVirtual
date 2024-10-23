export const removeHTML = (textWithHTML): string => {
    return textWithHTML.replace(/<\/?[^>]+(>|$)/g, '')
}
