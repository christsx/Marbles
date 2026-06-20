import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export async function makeSampleContractBase64(): Promise<string> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([612, 792])

  page.drawText("STATEMENT OF WORK", {
    x: 60,
    y: 720,
    size: 22,
    font: bold,
    color: rgb(0, 0, 0),
  })

  const lines = [
    "This Statement of Work is entered into between Marbles and the",
    "client named below for the engagement described herein.",
    "",
    "1. Scope of work",
    "   Design and build a client onboarding automation.",
    "",
    "2. Deliverables",
    "   - Discovery brief and architecture plan",
    "   - Working automation with tests",
    "   - Delivery handoff document",
    "",
    "3. Timeline and investment",
    "   Three phases over six weeks. Total investment: $24,000.",
  ]

  let y = 680
  for (const line of lines) {
    page.drawText(line, { x: 60, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) })
    y -= 20
  }

  page.drawText("Client signature", {
    x: 60,
    y: 250,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0),
  })
  page.drawText("Marbles", {
    x: 320,
    y: 250,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0),
  })

  const bytes = await doc.save()
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
