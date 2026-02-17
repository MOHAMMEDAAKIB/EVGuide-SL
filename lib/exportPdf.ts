import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export comparison table to PDF
 * @param element - HTML element to capture (comparison table)
 * @param vehicleNames - Array of vehicle names for filename
 */
export async function exportComparisonToPdf(
  element: HTMLElement,
  vehicleNames: string[]
): Promise<void> {
  try {
    // Show loading state
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Reset overflow
    document.body.style.overflow = originalOverflow;

    // Calculate PDF dimensions (A4 landscape)
    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > 210 ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42); // slate-900
    pdf.text('EVGuide SL - Vehicle Comparison', 14, 15);

    // Add timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // slate-500
    const timestamp = new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    pdf.text(`Generated: ${timestamp}`, 14, 22);

    // Add captured image
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 28, imgWidth - 20, imgHeight);

    // Add footer with URL
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.text('evguide.lk/compare', 14, pageHeight - 10);

    // Generate filename
    const filename = `ev-comparison-${vehicleNames.join('-').replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;

    // Download
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to export comparison as PDF');
  }
}

/**
 * Copy current comparison URL to clipboard
 * @param vehicleIds - Array of vehicle IDs in comparison
 */
export async function copyComparisonLink(vehicleIds: string[]): Promise<void> {
  const url = `${window.location.origin}/compare?ids=${vehicleIds.join(',')}`;
  
  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy link:', err);
      throw new Error('Failed to copy link to clipboard');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
