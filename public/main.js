// const csv = require('csv-parser');
// const fs = require('fs');
const results = [];

// fs.createReadStream('items.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     //console.log(data);
//     results.push(data);
//   })
//   .on('end', () => {
//     //console.log(results); // You can now work with the parsed CSV data in the `results` array

//     const filteredResults = results.filter(item => item.category === 'Tops');
//     //console.log(filteredResults.length);

//     results.forEach(item => {
//         console.log(`Item: ${item.name}`);
//         console.log(`Image: ${item.image}`);
//        // console.log(item.price);
//         //console.log(item.image);
//     });
// });

// View Available Items: Users can browse through the inventory of clothing items available in the store.

document.addEventListener('DOMContentLoaded', () => {

  console.log('DOMContentLoaded event fired');

  // Fetch data
  fetch('/items')
    .then(response => response.json())
    .then(data => {
      console.log(`Data: ${data}`);

      const displayItems = document.getElementById('view-available-items');
      const itemLayout = document.getElementById('item-layout').content;

      data.forEach(item => {
        const clone = itemLayout.cloneNode(true);
        console.log(`Item: ${item}`);

        clone.querySelector('.item-name').textContent = item.name;
        clone.querySelector('.item-image').src = item.image;
        clone.querySelector('.item-image').alt = item.name;
        clone.querySelector('.item-price').textContent = `Price: $${item.price}`;
        clone.querySelector('.item-color').textContent = `Color: ${item.color}`;
        clone.querySelector('.item-size').textContent = `Size: ${item.size}`;

        displayItems.appendChild(clone);
      });
    })
    .catch(error => console.error('Error fetching items:', error));
});

console.log('bo')

