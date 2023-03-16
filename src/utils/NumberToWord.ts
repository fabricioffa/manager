import { myObjKeys } from "./function/prod"

export default class NumberToWord {
  readonly numberClasses = {
    decimals: {
      plural: 'centavos',
      singular: 'centavo'
    },
    units: {
      plural: 'reais',
      singular: 'real'
    },
    thousands: {
      plural: 'mil',
      singular: 'mil'
    },
    millions: {
      plural: 'milhões',
      singular: 'milhão'
    },
  }

  private readonly maxDigitsCount = Object.keys(this.numberClasses).length * 3

  private readonly oneToTwenty = [
    '',
    'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
    'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'
  ] as const
  private readonly tens = [
    '', '',
    'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'] as const
  private readonly hundreds = [
    '',
    'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'] as const

  public format(n: number) {
    if (n === 0) return 'zero reais';
    if (n.toFixed(2).length > this.maxDigitsCount) throw new Error(`NumberToWord currently supports only number ranging from 0 to ${'9'.repeat(this.maxDigitsCount)}.`);

    const numberParts = this.separateNumberByClasses(n)

    const partsTexts = this.getPartsText(numberParts)
    const partsTextsWithCurrency = this.needToAddCurrency(numberParts)
      ? this.addCurrency(partsTexts, this.getCurrencyText(n))
      : partsTexts

    return partsTextsWithCurrency.reverse().join(' ').replace(/(\s+,\s+)|\s+/gi, (match, group1) => group1 ? ', ' : ' ')
  }

  private needToAddCurrency(numberParts: string[]) {
    return numberParts.at(1) !== '000'
      ? false
      : numberParts.slice(2).some(part => part !== '000')
  }

  private getCurrencyText(n: number) {
    return n >= 1_000_000 ? 'de reais' : 'reais'
  }

  private addCurrency(partsTexts: string[], currencyText: 'de reais' | 'reais') {
    const partIndex = partsTexts.at(-1)?.match(/centavo|centavos/)
      ? partsTexts.length - 2
      : partsTexts.length - 1
    return partsTexts.map((part, i) => i === partIndex ? `${part} ${currencyText}` : part)
  }

  private separateNumberByClasses(n: number) {
    return n.toFixed(2)
      .padStart(this.maxDigitsCount, '0')
      .replace(/\D/, '0')
      .match(/.{1,3}/g)
      ?.reverse() as string[]
  }

  private getPartsText(numberParts: string[]) {
    return myObjKeys(this.numberClasses)
      .slice(0, numberParts.length)
      .map((nClass, i) => {
        const firstNonZeroHigherClassPart = numberParts.slice(i + 1).find(part => part !== '000')
        if (this.areJoinedByConjunction(firstNonZeroHigherClassPart, numberParts[i], nClass))
          return ` e ${this.formatBlock(nClass, numberParts[i] as string)}`
        if (numberParts[i] !== '000' && firstNonZeroHigherClassPart && !['decimals', 'units'].includes(nClass))
          return `, ${this.formatBlock(nClass, numberParts[i] as string)}`
        return this.formatBlock(nClass, numberParts[i] as string)
      }
)
      .filter(Boolean)
  }

  private areJoinedByConjunction(higherClassDigits = '000', lowerClassDigits = '000', lowerClass: NumberClasses) {
    return (![higherClassDigits, lowerClassDigits].includes('000') && ['decimals', 'units'].includes(lowerClass)) &&
      (Number(lowerClassDigits) < 100 || lowerClassDigits.slice(1) === '00')
  }

  private formatBlock(numberClass: NumberClasses, digits: string) {
    if (digits === '000') return ''
    if (digits === '100') return this.addUnit('cem', numberClass)
    if (digits === '001' && numberClass === 'thousands') return 'mil'
    const digitsTexts = this.getDigitsTexts(digits)
    const blockTextWhithoutUnit = this.joinDigitsTexts(digitsTexts, this.digitshaveConjunction(digits))
    return this.addUnit(blockTextWhithoutUnit, numberClass)
  }

  private getDigitsTexts(digits: string) {
    const lastTwo = Number(digits.slice(1))
    const [hundred = 0, ten = 0, unit = 0] = Array.from(digits, Number)

    const hundredText = this.hundreds[hundred] as string
    const lastTwoText = lastTwo < 20
      ? `${this.oneToTwenty[lastTwo]}`
      : `${this.tens[ten]}${unit ? ' e ' + this.oneToTwenty[unit] : ''}`
    return [hundredText, lastTwoText].filter(Boolean)
  }

  private digitshaveConjunction(digits: string) {
    return digits.slice(1) !== '00' && Number(digits.charAt(0)) > 0
  }

  private joinDigitsTexts(strs: string[], hasConjunction: boolean) {
    return strs.join(hasConjunction ? ' e ' : ' ')
  }

  private addUnit(numberStr: string, numberClass: NumberClasses) {
    return `${numberStr} ${this.numberClasses[numberClass][numberStr === 'um' ? 'singular' : 'plural']}`
  }
}

export const porExtenso = new NumberToWord
type NumberClasses = keyof typeof porExtenso.numberClasses;
