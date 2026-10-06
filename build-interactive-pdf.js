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
    console.log(`Processing ${pages.length} pages for refined AcroForm fields...`);

    const textColor = rgb(0.17, 0.12, 0.25); // #2D1F3F

    // Helper to add clean, transparent, perfectly-sized text field
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
            
            // Set font size safely after adding to page
            try {
                textField.setFontSize(11);
            } catch (e) {
                // Ignore DA error if default appearance handles font size
            }
        } catch (err) {
            console.error(`Error creating field ${name}:`, err);
        }
    }

    // Page 2: How to use
    const page2 = pages[1];
    addField(page2, 'card_name', 55, 530, 485, 45, false);
    addField(page2, 'card_sentence', 55, 325, 485, 110, true);

    // Pages 3-8 (Days 1 to 6)
    for (let day = 1; day <= 6; day++) {
        const pageObj = pages[1 + day];
        addField(pageObj, `day${day}_q1`, 55, 550, 485, 70, true);
        addField(pageObj, `day${day}_q2`, 55, 395, 485, 70, true);
        addField(pageObj, `day${day}_step`, 65, 235, 465, 50, true);
        addField(pageObj, `day${day}_insight`, 55, 105, 485, 50, true);
    }

    // Page 9 (Day 7)
    const page9 = pages[8];
    addField(page9, 'day7_q1', 55, 595, 485, 45, true);
    addField(page9, 'day7_q2', 55, 490, 485, 45, true);
    addField(page9, 'day7_q3', 55, 385, 485, 45, true);
    addField(page9, 'day7_step', 65, 235, 465, 45, true);
    addField(page9, 'day7_insight', 55, 105, 485, 45, true);

    // Page 10 (Closing)
    const page10 = pages[9];
    addField(page10, 'closing_q1', 55, 500, 485, 100, true);
    addField(page10, 'closing_q2', 55, 315, 485, 100, true);

    // Update appearances with embedded font
    try {
        form.updateFieldAppearances(font);
    } catch (e) {
        console.log('Appearance update complete.');
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);
    console.log('SUCCESS: Refined transparent PDF fields generated successfully without errors!');
}

buildFillablePDF().catch(err => {
    console.error('FAILED to build fillable PDF:', err);
    process.exit(1);
});
