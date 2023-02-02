

export default class NumberToWord {
  private static readonly units = [
    '',
    'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
    'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'
  ] as const
  private static readonly tens = [
    '', '',
    'vinte', 'trinta', 'quarenta', 'cinquenta', 'secenta', 'setenta', 'oitenta', 'noventa'] as const
  private static readonly hundreds = [
    '',
    'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'] as const

  private static hasThousands = false
  private static hasDecimals = false

  public static format(n: number) {
    const digits = n.toFixed(2).replace(/\D/, '').padStart(8, '0').split('')
    if (n < 20) return NumberToWord.units[n]
    const thousands = digits.slice(0, 3)
    const hundreds = digits.slice(3, 6)
    const decimals = digits.slice(6)

    NumberToWord.hasThousands = thousands.some(n => n !== '0')
    NumberToWord.hasDecimals = decimals.some(n => n !== '0')

    const thousandsText = NumberToWord.hasThousands ? NumberToWord.formatBlock('thousands', ...thousands,) : ''
    const hundredsText = NumberToWord.formatBlock('hundreds', ...hundreds,)
    const decimalsText = NumberToWord.hasDecimals ? NumberToWord.formatBlock('decimals', ...['0', ...decimals]) : ''
    const hasFullOrNoHundred = Number(hundreds.join('')) < 100 || (hundreds[0] !== '0' && hundreds.slice(1).join('') === '00')
    const hasConjunction = NumberToWord.hasThousands && hasFullOrNoHundred

    return `${thousandsText} ${hasConjunction ? 'e' : ''} ${hundredsText} ${decimalsText}`.trim().replaceAll('  ', ' ');
  }

  private static formatBlock(type: 'thousands' | 'hundreds' | 'decimals', ...digits: string[]) {
    let rawText = ''

    const lastTwo = Number(digits.join('').slice(1))

    const [hundred = 0, ten = 0, unit = 0] = digits.map(digit => Number(digit))
    const hundredText = hundred ? NumberToWord.hundreds[hundred] + ' e' : ''
    const lastTwoText = lastTwo < 20
      ? `${NumberToWord.units[lastTwo]}`
      : `${NumberToWord.tens[ten]}${unit ? ' e ' + NumberToWord.units[unit] : ''}`

    rawText = `${hundredText} ${lastTwoText}`
    if (digits.join('') === '000') rawText = ''
    if (digits.join('') === '001' && type === 'thousands') rawText = ''
    if (digits.join('') === '100') rawText = 'cem'

    switch (type) {
      case 'thousands': return `${rawText} mil`
      case 'hundreds': return `${rawText} reais`
      case 'decimals': return `e ${rawText} centavos`
      default: return rawText
    }
  }
}
