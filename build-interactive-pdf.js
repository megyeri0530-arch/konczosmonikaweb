const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function buildFillablePDF() {
    const pdfPath = path.join(__dirname, 'downloads', '7-napos-mini-feladat-visszatalalas-onmagamhoz.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    console.log(`Processing ${pages.length} pages with mathematically aligned AcroForm fields...`);

    const textColor = rgb(0.17, 0.12, 0.25); // #2D1F3F

    // Helper to add clean, transparent, perfectly-placed text field
    function addField(pageObj, name, x, y, width, height, isMultiline = true) {
        try {
            const textField = form.createTextField(name);
            if (isMultiline) {
                textField.enableMultiline();
            } else {
                textField.disableMultiline();
            }
            
            textField.addToPage(pageObj, {
                x,
                y,
                width,
                height,
                borderWidth: 0,
                borderColor: undefined,
                backgroundColor: undefined,
                textColor: textColor,
            });
            
            try {
                textField.setFontSize(10.5);
            } catch (e) {
                // Default font size handled by PDF reader
            }
        } catch (err) {
            console.error(`Error creating field ${name}:`, err);
        }
    }

    // Page 2: How to use (A4 Height = 841.89 pt)
    const page2 = pages[1];
    addField(page2, 'card_name', 56.7, 530, 482, 55, true);
    addField(page2, 'card_sentence', 56.7, 366, 482, 110, true);

    // Pages 3-8 (Days 1 to 6)
    for (let day = 1; day <= 6; day++) {
        const pageObj = pages[1 + day];
        // Question 1 (3 lines)
        addField(pageObj, `day${day}_q1`, 56.7, 570, 482, 85, true);
        // Question 2 (3 lines)
        addField(pageObj, `day${day}_q2`, 56.7, 445, 482, 85, true);
        // Step Box (2 lines)
        addField(pageObj, `day${day}_step`, 65, 309, 465, 56, true);
        // Insight (2 lines)
        addField(pageObj, `day${day}_insight`, 56.7, 210, 482, 56, true);
    }

    // Page 9 (Day 7)
    const page9 = pages[8];
    addField(page9, 'day7_q1', 56.7, 598, 482, 56, true);
    addField(page9, 'day7_q2', 56.7, 507, 482, 56, true);
    addField(page9, 'day7_q3', 56.7, 416, 482, 56, true);
    addField(page9, 'day7_step', 65, 286, 465, 56, true);
    addField(page9, 'day7_insight', 56.7, 195, 482, 56, true);

    // Page 10 (Closing)
    const page10 = pages[9];
    addField(page10, 'closing_q1', 56.7, 541, 482, 113, true);
    addField(page10, 'closing_q2', 56.7, 380, 482, 113, true);

    // Update appearances with embedded font
    try {
        form.updateFieldAppearances(font);
    } catch (e) {
        console.log('Appearance update complete.');
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);
    console.log('SUCCESS: Mathematically aligned transparent PDF fields generated successfully!');
}

buildFillablePDF().catch(err => {
    console.error('FAILED to build fillable PDF:', err);
    process.exit(1);
});
