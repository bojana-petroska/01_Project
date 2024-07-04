// const csv = require('csv-parser');
// const fs = require('fs');
// import csv from 'csv-parser';
// import fs from 'fs';

const results = [];
console.log('bo');

// fs.createReadStream('items.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     //console.log(data);
//     results.push(data);
//   })
//   .on('end', () => {
//     //console.log(results);
//     // You can now work with the parsed CSV data in the `results` array

//     const filteredResults = results.filter((item) => item.category === 'Tops');
//     //console.log(filteredResults);

//     // results.forEach(item => {
//     //     console.log(`Item: ${item.name}`);
//     //     console.log(`Image: ${item.image}`);
//     //     console.log(item.price);
//     //     console.log(item.image);
//     // });

//     function displayItems(items) {
//       const itemTemplate = document.getElementById('item-layout');
//       const displayedItems = document.getElementById('item');

//       items.forEach((item) => {
//         const clone = document.importNode(itemTemplate.content, true);
//         clone.querySelector('.item-image').src = item.image;
//         clone.querySelector('.item-name').textContent = item.name;
//         clone.querySelector('.item-price').textContent = item.price;

//         displayedItems.appendChild(clone);
//       });
//     }

//     console.log(results);
//     displayItems(results);
//   });

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('DOMContentLoaded event fired');

//   // Fetch data
//   fetch('/items')
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(`Data: ${data}`);

// //View Available Items: Users can browse through the inventory of clothing items available in the store.

//       const displayItems = document.getElementById('view-available-items');
//       const itemLayout = document.getElementById('item-layout').content;

//       data.forEach((item) => {
//         const clone = itemLayout.cloneNode(true);
//         clone.querySelector('.item-name').textContent = item.name;
//         clone.querySelector('.item-image').src = item.image;
//         clone.querySelector('.item-image').alt = item.name;
//         clone.querySelector(
//           '.item-price'
//         ).textContent = `Price: $${item.price}`;

//         // 'Add to Cart' button functionality comes here
//         displayItems.appendChild(clone);
//       });
//     })
//     .catch((error) => console.error('Error fetching items:', error));
// });


