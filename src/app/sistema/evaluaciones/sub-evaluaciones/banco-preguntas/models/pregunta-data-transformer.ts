import {
    mapAlternativa,
    mapEncabezado,
    mapPregunta,
} from '@/app/sistema/aula-virtual/utils/map-pregunta'

export const formatTime = (hours, minutes, seconds) => {
    return `${hours}h ${minutes}m ${seconds}s`
}

export const findCorrectAlternativeSingle = (alternatives) => {
    return alternatives?.find((alt) => alt.bAlternativaCorrecta)
        ?.cAlternativaLetra
}

export const findCorrectAlternativeMultiple = (alternatives) => {
    const alt = alternatives
        ?.filter((alt) => alt.bAlternativaCorrecta)
        .map((item) => item.cAlternativaLetra)
    return alt
}

export const processItem = (item) => {
    if (item.preguntas != null) {
        item.preguntas = item.preguntas.map((subItem) => {
            if (subItem.iTipoPregId === 1) {
                subItem.alternativaCorrecta = findCorrectAlternativeSingle(
                    subItem.alternativas
                )
            }
            if (subItem.iTipoPregId === 2) {
                subItem.alternativaCorrecta = findCorrectAlternativeMultiple(
                    subItem.alternativas
                )
            }
            return {
                ...subItem,
                time: formatTime(
                    subItem.iHoras,
                    subItem.iMinutos,
                    subItem.iSegundos
                ),
            }
        })
    } else {
        item.time = formatTime(item.iHoras, item.iMinutos, item.iSegundos)
        if (item.iTipoPregId === 1) {
            item.alternativaCorrecta = findCorrectAlternativeSingle(
                item.alternativas
            )
        }
        if (item.iTipoPregId === 2) {
            item.alternativaCorrecta = findCorrectAlternativeMultiple(
                item.alternativas
            )
        }
    }
    return item
}

function processItemBancoToEre(item) {
    if (item.idEncabPregId == -1) {
        const alternativas = item.alternativas?.map(mapAlternativa)
        return mapPregunta(item, alternativas)
    } else {
        return mapEncabezado(item)
    }
}

export function mapItemsBancoToEre(data) {
    return data.map(processItemBancoToEre)
}

export const mapData = (data) => {
    return data.map(processItem)
}
