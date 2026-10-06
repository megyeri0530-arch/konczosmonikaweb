const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function buildPrecisionPDF() {
    const htmlPath = path.join(__dirname, 'downloads', '7-napos-mini-feladat-visszatalalas-onmagamhoz.html');
    const pdfPath = path.join(__dirname, 'downloads', '7-napos-mini-feladat-visszatalalas-onmagamhoz.pdf');
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

    console.log('Launching Puppeteer with Edge...');
    const browser = await puppeteer.launch({
        executablePath: edgePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 }); // A4 at 96 DPI
    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

    // Extract exact pixel bounding boxes of all pdf-target-field elements
    const fieldPositions = await page.evaluate(() => {
        const pages = document.querySelectorAll('.page');
        const results = [];

        pages.forEach((pageElem, pageIndex) => {
            const pageRect = pageElem.getBoundingClientRect();
            const fields = pageElem.querySelectorAll('.pdf-target-field');

            fields.forEach((field) => {
                const rect = field.getBoundingClientRect();
                results.push({
                    pageIndex,
                    name: field.getAttribute('data-name'),
                    // Relative coordinates inside the A4 page container
                    relX: rect.left - pageRect.left,
                    relY: rect.top - pageRect.top,
                    width: rect.width,
                    height: rect.height,
                    pageWidth: pageRect.width,
                    pageHeight: pageRect.height
                });
            });
        });

        return results;
    });

    console.log(`Measured ${fieldPositions.length} target field positions via DOM bounding boxes.`);

    // Generate base PDF from Puppeteer
    const basePdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    // Now process with pdf-lib to add pixel-exact AcroForm fields
    const pdfDoc = await PDFDocument.load(basePdfBuffer);
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pdfPages = pdfDoc.getPages();

    const textColor = rgb(0.17, 0.12, 0.25); // #2D1F3F

    // A4 dimensions in PDF points (72 points per inch)
    const PDF_PAGE_WIDTH = 595.28;
    const PDF_PAGE_HEIGHT = 841.89;

    fieldPositions.forEach((item) => {
        const targetPage = pdfPages[item.pageIndex];
        if (!targetPage) return;

        // Convert CSS pixels to PDF points
        const scaleX = PDF_PAGE_WIDTH / item.pageWidth;
        const scaleY = PDF_PAGE_HEIGHT / item.pageHeight;

        const pdfX = item.relX * scaleX;
        const pdfY = PDF_PAGE_HEIGHT - (item.relY * scaleY) - (item.height * scaleY);
        const pdfWidth = item.width * scaleX;
        const pdfHeight = item.height * scaleY;

        try {
            const textField = form.createTextField(item.name);
            textField.enableMultiline();
            textField.addToPage(targetPage, {
                x: pdfX,
                y: pdfY,
                width: pdfWidth,
                height: pdfHeight,
                borderWidth: 0,
                borderColor: undefined,
                backgroundColor: undefined,
                textColor: textColor
            });

            try {
                textField.setFontSize(10.5);
            } catch (e) {
                // Font size handled by default appearance
            }
        } catch (err) {
            console.error(`Error injecting field ${item.name}:`, err);
        }
    });

    try {
        form.updateFieldAppearances(font);
    } catch (e) {
        console.log('Appearances updated.');
    }

    const finalPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, finalPdfBytes);
    console.log('SUCCESS: DOM-measured precision PDF generated successfully!');
}

buildPrecisionPDF().catch(err => {
    console.error('FAILED to build precision PDF:', err);
    process.exit(1);
});
