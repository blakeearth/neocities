import { readFile, writeFile } from 'fs';

function transformData(inputData) {
  const outputData = {
    _template: "highlights",
    highlights: []
  };

  Object.keys(inputData).forEach(key => {
    const item = inputData[key];
    const highlight = {
      text: item.text,
      timestamp: new Date(item.timestamp).toISOString(), // Ensures correct format for timestamp
      source: item.OLID,
      tag: item.tags.split(',').map(tag => tag.trim())
    };

    outputData.highlights.push(highlight);
  });

  return outputData;
}

// Function to read input file and write output file
function processFile(inputFile, outputFile) {
  readFile(inputFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading the input file:', err);
      return;
    }

    try {
      const inputData = JSON.parse(data);
      const transformedData = transformData(inputData);

      writeFile(outputFile, JSON.stringify(transformedData, null, 2), 'utf-8', (err) => {
        if (err) {
          console.error('Error writing the output file:', err);
        } else {
          console.log('File transformed successfully.');
        }
      });

    } catch (err) {
      console.error('Error parsing the input JSON:', err);
    }
  });
}

// Example usage
const inputFile = 'src/data/highlights/highlights.json';  // Path to the input JSON file
const outputFile = 'src/data/highlights/highlightso.json'; // Path where the output JSON will be saved

processFile(inputFile, outputFile);
