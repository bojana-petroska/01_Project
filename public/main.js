let inventory = [];

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-filters');
  const filterContainer = document.getElementById('filter-container');
  const searchNameInput = document.getElementById('search-name');
  const searchSizeInput = document.getElementById('search-size');
  const searchIcon = document.getElementById('search-icon');
  const searchForm = document.getElementById('search-form');

  toggleButton.addEventListener('click', () => {
    filterContainer.classList.toggle('show');
  });

  searchIcon.addEventListener('click', function (event) {
    event.preventDefault();
    console.log('bo');

    searchForm.classList.toggle('active');

    if (searchForm.classList.contains('active')) {
      searchNameInput.style.display = 'inline-block';
      searchSizeInput.style.display = 'inline-block';
    } else {
      searchNameInput.style.display = 'none';
      searchSizeInput.style.display = 'none';
    }
  });

  // Close search form when clicking outside
  document.addEventListener('click', function (event) {
    const isClickInsideSearchForm = searchForm.contains(event.target);
    const isToggleButton = event.target === searchIcon;

    if (!isClickInsideSearchForm && !isToggleButton) {
      searchForm.classList.remove('active');
      searchNameInput.style.display = 'none';
      searchSizeInput.style.display = 'none';
    }
  });

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchName = searchNameInput
      .value.trim()
      .toLowerCase();

    const results = searchItems(inventory, searchName, searchSizeInput.value);

    displayItems(results);
  });

  loadCSV('items.csv', (data) => {
    inventory = parseCSV(data);
    console.log(inventory);

    shuffleArray(inventory);
    displayItems(inventory);

    populateFilterOptions(inventory);
  });

  document
    .getElementById('apply-filters')
    .addEventListener('click', applyFilters);
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

// Random loading of the items on each refresh
function shuffleArray(items) {
  for (let i = items.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
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

function searchItems(items, searchName = '', searchSize = '') {
  // Filter items based on search criteria
  const results = items.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchName);
    const sizeMatch = item.size.toLowerCase() === searchSize.toLowerCase();
    return (searchName === '' || nameMatch) && (searchSize === '' || sizeMatch);
  });

  console.log('buuuuu');
  return results;
}

function populateFilterOptions(items) {
  const genders = new Set(items.map((item) => item.gender));
  const categories = new Set(items.map((item) => item.category));
  const sizes = new Set(items.map((item) => item.size));
  const colors = new Set(items.map((item) => item.color));

  populateSelect('gender-filter', genders);
  populateSelect('category-filter', categories);
  populateSelect('size-filter', sizes);
  populateSelect('color-filter', colors);
}

function populateSelect(id, options) {
  const select = document.getElementById(id);
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

function applyFilters() {
  const genderFilter = document.getElementById('gender-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  const sizeFilter = document.getElementById('size-filter').value;
  const colorFilter = document.getElementById('color-filter').value;
  const sortOption = document.getElementById('sort-option').value;

  console.log('Applying filters:', {
    genderFilter,
    categoryFilter,
    sizeFilter,
    colorFilter,
    sortOption,
  });

  let filteredItems = inventory.filter(
    (item) =>
      (genderFilter === '' || item.gender === genderFilter) &&
      (categoryFilter === '' || item.category === categoryFilter) &&
      (sizeFilter === '' || item.size === sizeFilter) &&
      (colorFilter === '' || item.color === colorFilter)
  );

  if (sortOption === 'price-asc') {
    filteredItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortOption === 'price-desc') {
    filteredItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  console.log('Filtered and sorted items:', filteredItems);
  displayItems(filteredItems);
}
