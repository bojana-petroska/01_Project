let allItems = [];

document.addEventListener('DOMContentLoaded', () => {
  loadCSV('items.csv', (data) => {

    const inventory = parseCSV(data);
    console.log(inventory);
    displayItems(inventory);

    const searchForm = document.getElementById('search-form');

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const searchNameInput = document
        .getElementById('search-name')
        .value.trim()
        .toLowerCase();
      const searchSizeInput = document
        .getElementById('search-size')
        .value.trim();

      const results = searchItems(inventory, searchNameInput, searchSizeInput);

      displayItems(results);
    });

    allItems = parseCSV(data);
    console.log("Loaded items:", allItems);
    displayItems(allItems);
    populateFilterOptions(allItems);

  });

  document.getElementById('apply-filters').addEventListener('click', applyFilters);
});

function loadCSV(url, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => callback(data))
    .catch((error) => console.error('Error loading CSV file:', error));
}

function parseCSV(data) {
  const lines = data.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());
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


const searchItems = (items, searchName = '', searchSize = '') => {
  // Filter items based on search criteria
  const results = items.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchName);
    const sizeMatch = item.size.toLowerCase() === searchSize.toLowerCase();
    return (searchName === '' || nameMatch) && (searchSize === '' || sizeMatch);
  });

  return results;
};

console.log('bo')

function populateFilterOptions(items) {
  const sexes = new Set(items.map(item => item.sex));
  const categories = new Set(items.map(item => item.category));
  const sizes = new Set(items.map(item => item.size));
  const colors = new Set(items.map(item => item.color));

  populateSelect('sex-filter', sexes);
  populateSelect('category-filter', categories);
  populateSelect('size-filter', sizes);
  populateSelect('color-filter', colors);
}

function populateSelect(id, options) {
  const select = document.getElementById(id);
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

function applyFilters() {
  const sexFilter = document.getElementById('sex-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  const sizeFilter = document.getElementById('size-filter').value;
  const colorFilter = document.getElementById('color-filter').value;
  const sortOption = document.getElementById('sort-option').value;

  console.log("Applying filters:", { sexFilter, categoryFilter, sizeFilter, colorFilter, sortOption });

  let filteredItems = allItems.filter(item => 
    (sexFilter === '' || item.sex === sexFilter) &&
    (categoryFilter === '' || item.category === categoryFilter) &&
    (sizeFilter === '' || item.size === sizeFilter) &&
    (colorFilter === '' || item.color === colorFilter)
  );

  if (sortOption === 'price-asc') {
    filteredItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortOption === 'price-desc') {
    filteredItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  console.log("Filtered and sorted items:", filteredItems);


  displayItems(filteredItems);
}