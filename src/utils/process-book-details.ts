import { writeFile, readFile, mkdir } from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import cliProgress from 'cli-progress';

// Parse command line arguments
const args = process.argv.slice(2);
const isDevMode = args.includes('--dev');

async function processBookDetails() {
    console.log(`Running in ${isDevMode ? 'development' : 'production'} mode`);

    // Read highlights
    const highlightsRaw = await fetch(process.env.HIGHLIGHTS_API);
    const highlights = await highlightsRaw.json();

    // Collect unique OLIDs
    const uniqueOLIDs = [...new Set(Object.values(highlights).map(h => h.OLID))];
    const findFirstHighlightByOLID = (highlights: any, targetOLID: string) => {
        return Object.values(highlights).find(highlight => highlight.OLID === targetOLID);
    };

    // Create a new progress bar instance
    const progressBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
    );

    // Start the progress bar
    progressBar.start(uniqueOLIDs.length, 0);

    // Fetch details for each unique OLID
    const bookDetailsMap = {};

    for (const olid of uniqueOLIDs) {
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

        // Increment the progress bar
        progressBar.increment();
    }

    // Stop the progress bar
    progressBar.stop();

    // Write book details to a JSON file
    await writeFile(
        'src/data/books.json',
        JSON.stringify(bookDetailsMap, null, 2)
    );

    console.log(`Processed ${Object.keys(bookDetailsMap).length} unique books`);
}

async function handleCoverImage(imageUrl: string | undefined, olid: string, size: string): Promise<string | null> {
    if (!imageUrl) {
        return null;
    }

    // In dev mode, return the original URL
    if (isDevMode) {
        return imageUrl;
    }

    // For production, we'll save to the public directory so Astro copies it to dist
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const extension = path.extname(imageUrl) || '.jpg'; // Default to .jpg if no extension

        const directory = './public/images/covers';

        // Create directory if it doesn't exist
        await mkdir(directory, { recursive: true });

        const filename = `${olid}-${size}${extension}`;
        const filePath = `${directory}/${filename}`;

        // Save the image
        await writeFile(filePath, Buffer.from(buffer));

        return `/images/covers/${filename}`;
    } catch (error) {
        console.error(`Error downloading cover image for OLID ${olid}:`, error);
        return null;
    }
}

export async function fetchBookDetails(olid: string, fallbackData?: any) {
    try {
        const bookResponse = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${olid}&format=json&jscmd=data`);
        const bookData = await bookResponse.json();

        const fullKey = `OLID:${olid}`;
        const bookDetails = bookData[fullKey];

        if (!bookDetails) {
            throw new Error(`No book details found for OLID: ${olid}`);
        }

        const processedDetails = {
            title: bookDetails.title || fallbackData?.title || 'Unknown Title',
            subtitle: bookDetails.subtitle || fallbackData?.subtitle || '',
            author: bookDetails.authors?.[0]?.name || fallbackData?.author || 'Unknown Author',
            coverImage: {
                small: await handleCoverImage(bookDetails.cover?.small, olid, 'small'),
                medium: await handleCoverImage(bookDetails.cover?.medium, olid, 'medium'),
                large: await handleCoverImage(bookDetails.cover?.large, olid, 'large')
            },
            publishDate: bookDetails.publish_date || fallbackData?.publishDate || null,
            publishers: bookDetails.publishers?.map(p => p.name) || fallbackData?.publishers || [],
            subjects: bookDetails.subjects?.map(s => s.name) || fallbackData?.subjects || [],
            pageCount: bookDetails.number_of_pages || fallbackData?.pageCount || null,
            url: bookDetails.url || fallbackData?.url || null
        };

        return processedDetails;
    } catch (error) {
        console.error(`Error fetching book details for OLID ${olid}:`, error);

        // Use fallback data if available
        if (fallbackData) {
            return {
                title: fallbackData.title || 'Unknown Title',
                subtitle: fallbackData.subtitle || '',
                author: fallbackData.author || 'Unknown Author',
                coverImage: {
                    small: await handleCoverImage(fallbackData.coverImage?.small, olid, 'small'),
                    medium: await handleCoverImage(fallbackData.coverImage?.medium, olid, 'medium'),
                    large: await handleCoverImage(fallbackData.coverImage?.large, olid, 'large')
                },
                publishDate: fallbackData.publishDate || null,
                publishers: fallbackData.publishers || [],
                subjects: fallbackData.subjects || [],
                pageCount: fallbackData.pageCount || null,
                url: fallbackData.url || null
            };
        }

        // Completely fallback default if no fallback data
        return {
            title: 'Unknown Title',
            subtitle: '',
            author: 'Unknown Author',
            coverImage: { small: null, medium: null, large: null },
            publishDate: null,
            publishers: [],
            subjects: [],
            pageCount: null,
            url: null
        };
    }
}

processBookDetails();
