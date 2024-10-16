import dayjs from 'dayjs'

export const convertStringToDate = (date) => {
    const dateToTransform = dayjs(date)
    return dateToTransform.isValid() ? dateToTransform.toDate() : null
}

export const getTimeFromDatetime = (date, format = 'HH:mm') => {
    const datetime = dayjs(date)

    const time = datetime.format(format)
    return time
}
