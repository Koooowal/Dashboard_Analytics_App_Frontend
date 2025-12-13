export interface ExportColumn {
  key: string
  header: string
  format?: (value: unknown) => string
}

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  const headers = columns.map((col) => col.header).join(',')
  
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key]
        const formatted = col.format ? col.format(value) : String(value ?? '')
        return `"${formatted.replace(/"/g, '""')}"`
      })
      .join(',')
  )

  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

export function exportToJSON<T>(data: T[], filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  downloadBlob(blob, `${filename}.json`)
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateReportHTML(
  title: string,
  subtitle: string,
  sections: { title: string; content: string }[],
  stats?: { label: string; value: string }[]
): string {
  const statsHTML = stats
    ? `<div class="stats-grid">${stats
        .map(
          (s) => `<div class="stat-card"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div>`
        )
        .join('')}</div>`
    : ''

  const sectionsHTML = sections
    .map(
      (s) => `<div class="section"><h2>${s.title}</h2><div class="section-content">${s.content}</div></div>`
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1a1a2e; }
        .header { margin-bottom: 32px; border-bottom: 2px solid #3b82f6; padding-bottom: 16px; }
        .header h1 { font-size: 28px; color: #1a1a2e; }
        .header p { color: #64748b; margin-top: 4px; }
        .header .date { font-size: 12px; color: #94a3b8; margin-top: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
        .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
        .stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
        .section { margin-bottom: 32px; }
        .section h2 { font-size: 18px; color: #1a1a2e; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        .section-content { color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #64748b; }
        td { font-size: 14px; }
        @media print { body { padding: 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>${subtitle}</p>
        <div class="date">Generated on ${new Date().toLocaleString()}</div>
      </div>
      ${statsHTML}
      ${sectionsHTML}
    </body>
    </html>
  `
}

export function exportToPDF(html: string, filename: string): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(html)
  printWindow.document.close()
  
  printWindow.onload = () => {
    printWindow.print()
  }
}

export function printReport(html: string): void {
  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'absolute'
  printFrame.style.top = '-10000px'
  printFrame.style.left = '-10000px'
  document.body.appendChild(printFrame)

  const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document
  if (!frameDoc) return

  frameDoc.open()
  frameDoc.write(html)
  frameDoc.close()

  printFrame.onload = () => {
    printFrame.contentWindow?.print()
    setTimeout(() => document.body.removeChild(printFrame), 1000)
  }
}

export function generateTableHTML<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[]
): string {
  const headers = columns.map((col) => `<th>${col.header}</th>`).join('')
  const rows = data
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => {
            const value = row[col.key]
            const formatted = col.format ? col.format(value) : String(value ?? '')
            return `<td>${formatted}</td>`
          })
          .join('')}</tr>`
    )
    .join('')

  return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
}

