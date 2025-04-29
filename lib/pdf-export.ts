import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function exportToPDF(elementId: string, filename = "theory-of-change.pdf") {
  try {
    // Show loading state
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error("Element not found")
    }

    // Get the original dimensions
    const originalWidth = element.offsetWidth
    const originalHeight = element.offsetHeight

    // Calculate PDF dimensions (A4 is 210x297mm at 72dpi)
    const pdfWidth = 210
    const pdfHeight = (originalHeight * pdfWidth) / originalWidth

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Create PDF
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
      unit: "mm",
    })

    // Add image to PDF (centered if possible)
    const pdfWidth2 = pdf.internal.pageSize.getWidth()
    const pdfHeight2 = (canvas.height * pdfWidth2) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth2, pdfHeight2)

    // Save the PDF
    pdf.save(filename)

    return true
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    return false
  }
}
