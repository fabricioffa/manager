import jsPDF from "jspdf";
import type { ReceiptSchema } from "../server/schemas/receipt.schema";
import { formatCpf, formatCurrency, formatDate } from './function/prod'
import { porExtenso } from "./NumberToWord";

type Line = {
  texts: string[],
  bolds: number[]
}

export default class Receipt {
  private readonly doc = new jsPDF({ unit: 'mm', })
  private readonly titleText = 'Recibo'

  private readonly firstParagraph = [
    {
      texts: ['Recebi de ', this.receipt.tenant.name, ', inscrito no CPF ', formatCpf(this.receipt.tenant.cpf), ','],
      bolds: [1, 3]
    },
    {
      texts: ['o valor de ', formatCurrency(this.receipt.amount), ' (', porExtenso.format(this.receipt.amount), '),'],
      bolds: [1, 3]
    },
    {
      texts: ['correspondente ao aluguel do mês de ', formatDate(this.receipt.rentingPeriod, { month: 'long', year: 'numeric' })],
      bolds: [1]
    },
    {
      texts: ['do imóvel situado em ', this.receipt.house.street, ', ', this.receipt.house.number, '.'],
      bolds: [1, 3]
    },
  ]

  private readonly secondParagraph = [
    {
      texts: ['E para clareza confirmo o presente na cidade de ', this.receipt.city, ','],
      bolds: [1]
    },
    {
      texts: ['no dia ', formatDate(this.receipt.date, { day: "numeric", month: 'long', year: 'numeric' })],
      bolds: [1]
    },
  ]

  private readonly footerParagraph = [
    {
      texts: ['Assinatura: '],
      bolds: []
    },
    {
      texts: ['Nome por extenso: ', 'Francisco Isaac Agostinho'],
      bolds: [1]
    },
  ]

  private readonly lineHeight = this.doc.setFontSize(16).getTextDimensions('Uma linha').h + 1.5

  private readonly page = {
    w: this.doc.internal.pageSize.width,
    h: this.doc.internal.pageSize.height,
    m: 10,
    fontSize: 16,
  } as const

  private readonly mainBox = {
    x: this.page.m,
    y: this.page.m,
    w: this.page.w - (this.page.m * 2),
    h: 105,
    mx: 8,
    mt: 15,
    mb: 6,
    rounded: 2,
    bgColor: [219, 234, 254] as const
  } as const

  private readonly title = {
    x: this.page.w / 2,
    y: this.page.m + this.mainBox.mt / 2 + this.doc.setFontSize(19).getTextDimensions(this.titleText).h * .3,
    h: this.doc.setFontSize(19).getTextDimensions(this.titleText).h,
    text: this.titleText,
    fontSize: 19,
  }

  private readonly body = {
    x: this.page.m + this.mainBox.mx,
    y: this.mainBox.y + this.mainBox.mt,
    w: this.mainBox.w - (this.mainBox.mx * 2),
    h: this.lineHeight * (this.firstParagraph.length + this.secondParagraph.length + 1.5),
    mx: 4,
    my: 10,
    bgColor: [255, 255, 255] as const,
    rounded: this.mainBox.rounded,
  } as const

  private readonly numberBox = {
    x: this.page.w - this.page.m - this.mainBox.mx - this.doc.getTextDimensions('Nº 0000').w,
    y: this.page.m + this.body.my / 2 - 2.5,
    w: this.doc.getTextDimensions('Nº 0000').w,
    h: this.lineHeight + 3,
    bgColor: [255, 255, 255] as const,
    rounded: this.mainBox.rounded,
  }

  private readonly footer = {
    x: this.page.m + this.mainBox.mx,
    y: this.body.y + this.body.h + 4,
    w: this.mainBox.w - (this.mainBox.mx * 2),
    h: this.lineHeight * (this.footerParagraph.length + 1.5),
    mx: 4,
    my: 10,
    bgColor: [255, 255, 255] as const,
    rounded: this.mainBox.rounded,
  }

  private readonly wordSpace = 4;

  constructor(public receipt: ReceiptSchema, public pastPaidDebitsCount: number = 1) { }

  public makePdf() {
    const pdfNumber = (this.pastPaidDebitsCount + 1).toString().padStart(4, '0')
    this.doc.setFillColor(...this.mainBox.bgColor)
      .roundedRect(this.mainBox.x, this.mainBox.y, this.mainBox.w, this.mainBox.h, this.mainBox.rounded, this.mainBox.rounded, 'F')
      .setFont('Times', 'bold')
      .setFontSize(this.title.fontSize)
      .text(this.title.text, this.title.x, this.title.y, { align: 'center' })
      .setFillColor(...this.body.bgColor)
      .roundedRect(this.numberBox.x, this.numberBox.y, this.numberBox.w, this.numberBox.h, this.numberBox.rounded, this.numberBox.rounded, 'F')
      .roundedRect(this.body.x, this.body.y, this.body.w, this.body.h, this.body.rounded, this.body.rounded, 'F')
      .roundedRect(this.footer.x, this.footer.y, this.footer.w, this.footer.h, this.footer.rounded, this.footer.rounded, 'F')

    this.writeLine([`Nº ${pdfNumber}`], [], this.numberBox.x + 3, this.numberBox.y + 7)
    this.writeParagraph(this.firstParagraph, this.body.x + this.body.mx, this.body.y + this.body.my)
    this.writeParagraph(this.secondParagraph, this.body.x + this.body.mx, this.body.y + this.body.my + this.lineHeight * 4 + 4)
    this.writeParagraph(this.footerParagraph, this.body.x + this.body.mx, this.footer.y + this.footer.my)
    return this.doc
  }

  private previousTextSpace(previousText: string) {
    return this.doc.getTextWidth(previousText)
  }

  private writeLine(strs: string[], bolds: number[], initialX: number, y: number) {
    let currentX = initialX;
    strs.forEach((str, i) => {
      this.doc
        .setFont('Times', bolds.includes(i) ? 'bold' : 'normal')
        .setFontSize(this.page.fontSize)
        .text(str, currentX, y)
      currentX += this.previousTextSpace(str)
    })
    return this.doc
  }

  private writeParagraph(lines: Line[], initialX: number, initialY: number) {
    let currentY = initialY;
    lines.forEach(line => {
      this.writeLine(line.texts, line.bolds, initialX, currentY)
      currentY += this.lineHeight
    })
  }

}
