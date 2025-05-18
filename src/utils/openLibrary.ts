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
                small: bookDetails.cover?.small || fallbackData?.coverImage?.small || null,
                medium: bookDetails.cover?.medium || fallbackData?.coverImage?.medium || null,
                large: bookDetails.cover?.large || fallbackData?.coverImage?.large || null
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
                    small: fallbackData.coverImage?.small || null,
                    medium: fallbackData.coverImage?.medium || null,
                    large: fallbackData.coverImage?.large || null
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
