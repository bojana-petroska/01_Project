const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('items.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    //console.log(results); // You can now work with the parsed CSV data in the `results` array

    const filteredResults = results.filter(item => item.category === 'Tops');
    console.log(filteredResults.length);

    results.forEach(item => {
        console.log(item.name);
    })
});

// View Available Items: Users can browse through the inventory of clothing items available in the store.

