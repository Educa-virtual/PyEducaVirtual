const Letras = {
    a: 'a',
    b: 'b',
    c: 'c',
    d: 'd',
    e: 'e',
    f: 'f',
    g: 'g',
    h: 'h',
    i: 'i',
    j: 'j',
    k: 'k',
    l: 'l',
    m: 'm',
    n: 'n',
    o: 'o',
    p: 'p',
    q: 'q',
    r: 'r',
    s: 's',
    t: 't',
    u: 'u',
    v: 'v',
    w: 'w',
    x: 'x',
    y: 'y',
    z: 'z',
}
export type TLetra = keyof typeof Letras

export const letras: TLetra[] = Object.keys(Letras) as TLetra[]

// filtrar preguntas usadas
export const filtrarPreguntasUsadas = (
    letrasUsadas: TLetra[],
    exception?: TLetra
) => {
    const letrasOutput = letras.filter((letra) => {
        const isUsed = letrasUsadas.includes(letra)
        const isException = letra === exception
        return !isUsed || isException
    })
    return letrasOutput
}
