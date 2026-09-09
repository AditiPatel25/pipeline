import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import client from '../config/supabase.js';

export async function extractResumeText(
    filePath: string,
    fileName: string
): Promise<string> {
    const { data, error } = await client.storage
        .from('resumes')
        .download(filePath);

    if (error) {
        throw error;
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    if (fileName.toLowerCase().endsWith('.pdf')) {
        const parser = new PDFParse({
            data: buffer,
        });

        const result = await parser.getText();

        await parser.destroy();

        return result.text;
    }

    if (fileName.toLowerCase().endsWith('.docx')) {
        const result = await mammoth.extractRawText({
            buffer,
        });

        return result.value;
    }

    throw new Error('Unsupported resume file type');
}