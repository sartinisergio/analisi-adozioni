import * as pdfjsLib from 'pdfjs-dist';

// Configurazione del worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class PDFService {
  async extractText(file: File): Promise<string> {
    try {
      console.log('Inizio estrazione testo da PDF:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      console.log('PDF caricato, numero pagine:', pdf.numPages);
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
        
        console.log(`Pagina ${i}/${pdf.numPages} estratta`);
      }
      
      console.log('Estrazione completata, lunghezza testo:', fullText.length);
      
      return fullText;
    } catch (error) {
      console.error('Errore durante l\'estrazione del testo:', error);
      throw new Error('Impossibile estrarre il testo dal PDF');
    }
  }
}
