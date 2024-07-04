document.addEventListener('DOMContentLoaded', () => {
  loadCSV('items.csv', (data) => {
    const inventory = parseCSV(data);
    console.log(inventory);
    displayItems(inventory);  
  });
});

function loadCSV(url, callback) {
  fetch(url)
    .then(response => response.text())
    .then(data => callback(data))
    .catch(error => console.error('Error loading CSV file:', error));
}

function parseCSV(data) {
  const lines = data.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const items = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].split(',');
    if (line.length === headers.length) {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = line[index].trim();
      });
      items.push(item);
    }
  }
  return items;
}

function displayItems(items) {
  const itemTemplate = document.getElementById('item-layout');
  const displayedItems = document.getElementById('view-available-items');  
  displayedItems.innerHTML = ''; 

  items.forEach((item) => {
    const clone = document.importNode(itemTemplate.content, true);
    clone.querySelector('.item-image').src = item.image;
    clone.querySelector('.item-image').alt = item.name;
    clone.querySelector('.item-name').textContent = item.name;
    clone.querySelector('.item-price').textContent = `$${item.price}`;
    displayedItems.appendChild(clone);
  });
}


