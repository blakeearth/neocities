import { readFileSync, writeFileSync } from 'fs';

// Sample JSON data (this would usually be loaded from a file)
const inputData = JSON.parse(readFileSync('src/data/statuses/site-updates.json', 'utf-8'));


// Function to convert input JSON to the desired output format
function convertJson(input) {
  const result = {
    "_template": "site-updates",
    "site-updates": Object.values(input)
  };
  
  return result;
}

// Call the function to convert the input data
const outputData = convertJson(inputData);

// Output the result
console.log(JSON.stringify(outputData, null, 2));

// If you want to save the result to a file:
writeFileSync('src/data/statuses/site-updateso.json', JSON.stringify(outputData, null, 2));
