// scripts/process-book-details.ts
import { writeFile, readFile } from 'fs/promises';
import { fetchBookDetails } from './openLibrary';

async function processBookDetails() {
    // Read highlights
    const highlightsRaw = await readFile('src/data/highlights.json', 'utf-8');
    const highlights = JSON.parse(highlightsRaw);

    // Collect unique OLIDs
    const uniqueOLIDs = [...new Set(Object.values(highlights).map(h => h.OLID))];
    const findFirstHighlightByOLID = (highlights: any, targetOLID: string) => {
        return Object.values(highlights).find(highlight => highlight.OLID === targetOLID);
    };

    // Fetch details for each unique OLID
    const bookDetailsMap = {};

    for (const olid of uniqueOLIDs) {
        await new Promise(resolve => setTimeout(resolve, 200));
        try {
            const highlight = findFirstHighlightByOLID(highlights, olid);
            const bookDetails = await fetchBookDetails(olid, {
                title: highlight.title,
                author: highlight.author,
            });
            bookDetailsMap[olid] = bookDetails;
        } catch (error) {
            console.error(`Failed to fetch details for OLID ${olid}`, error);
        }
    }

    // Write book details to a JSON file
    await writeFile(
        'src/data/books.json',
        JSON.stringify(bookDetailsMap, null, 2)
    );

    console.log(`Processed ${Object.keys(bookDetailsMap).length} unique books`);
}

processBookDetails();
