import * as base64 from 'base64-js';
import { DataFrame } from 'danfojs-node';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';
import { TextDecoder } from 'util';
import * as fs from 'fs';


function getCSVDownloadLink(df:DataFrame,filename:string,text:string): string {
    const csv = df.toCSV();
    const b64 = base64.fromByteArray(new TextEncoder().encode(csv));
    const href = `<a href="data:text/csv;base64,${b64}" download="${filename}">${text}</a>`;
    return href;
}


async function pdfReader(file: string): Promise<string> {
    const data = new Uint8Array(fs.readFileSync(file));
    const pdf: PDFDocumentProxy = await getDocument({ data }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => 'str' in item ? item.str : '');
        text += strings.join(' ');
    }

    return text;
}

function showPDF(filePath: string): string {
    const fileData = fs.readFileSync(filePath);
    const base64PDF = base64.fromByteArray(fileData);
    const pdfDisplay = `<iframe src="data:application/pdf;base64,${base64PDF}" width="700" height="1000" type="application/pdf"></iframe>`;
    return pdfDisplay;
}
