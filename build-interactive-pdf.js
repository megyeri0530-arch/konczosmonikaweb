const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

async function buildFillablePDF() {
    const pdfPath = path.join(__dirname, 'downloads', '7-napos-mini-feladat-visszatalalas-onmagamhoz.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    const pages = pdfDoc.getPages();
    console.log(`Processing ${pages.length} pages for interactive AcroForm fields...`);

    // Color definitions
    const textColor = rgb(0.17, 0.12, 0.25); // #2D1F3F
    const borderColor = rgb(0.77, 0.62, 0.32); // #C6A052

    // Helper to add multiline text field
    function addField(pageObj, name, x, y, width, height, placeholder) {
        try {
            const textField = form.createTextField(name);
            textField.enableMultiline();
            textField.addToPage(pageObj, {
                x,
                y,
                width,
                height,
                borderWidth: 1,
                borderColor: borderColor,
                backgroundColor: rgb(0.99, 0.99, 0.97),
                textColor: textColor,
            });
            if (placeholder) {
                textField.setText('');
            }
        } catch (err) {
            console.error(`Error creating field ${name}:`, err);
        }
    }

    // Page 2: How to use
    const page2 = pages[1];
    addField(page2, 'card_name', 55, 530, 485, 55, 'Kártya neve...');
    addField(page2, 'card_sentence', 55, 330, 485, 110, 'A mondat, amit magammal viszek...');

    // Pages 3-8 (Days 1 to 6)
    for (let day = 1; day <= 6; day++) {
        const pageObj = pages[1 + day];
        addField(pageObj, `day${day}_q1`, 55, 550, 485, 75, 'Írd ide a válaszodat...');
        addField(pageObj, `day${day}_q2`, 55, 395, 485, 75, 'Írd ide a válaszodat...');
        addField(pageObj, `day${day}_step`, 65, 235, 465, 55, 'Mai apró lépésem...');
        addField(pageObj, `day${day}_insight`, 55, 105, 485, 55, 'Mai felismerésem...');
    }

    // Page 9 (Day 7)
    const page9 = pages[8];
    addField(page9, 'day7_q1', 55, 595, 485, 50, 'Mit ismertem fel...');
    addField(page9, 'day7_q2', 55, 490, 485, 50, 'Mit hagyok magam mögött...');
    addField(page9, 'day7_q3', 55, 385, 485, 50, 'Mit adok magamnak...');
    addField(page9, 'day7_step', 65, 235, 465, 50, 'Mai lépés...');
    addField(page9, 'day7_insight', 55, 105, 485, 50, 'Felismerésem...');

    // Page 10 (Closing)
    const page10 = pages[9];
    addField(page10, 'closing_q1', 55, 505, 485, 105, 'Kártya üzenete...');
    addField(page10, 'closing_q2', 55, 320, 485, 105, 'Az én útravalóm...');

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);
    console.log('SUCCESS: Interactive fillable PDF generated successfully!');
}

buildFillablePDF().catch(err => {
    console.error('FAILED to build fillable PDF:', err);
    process.exit(1);
});
