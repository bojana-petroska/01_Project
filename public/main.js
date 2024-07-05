let inventory = [];
let cart = [];

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

  document.getElementById('apply-filters').addEventListener('click', applyFilters);
  document.getElementById('cart-button').addEventListener('click', showCart);
  updateCartButton();

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
    
    const addToCartBtn = clone.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(item));
    
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

function addToCart(item) {
  cart.push({
      name: item.name,
      price: item.price,
      image: item.image  // Asegúrate de que esto esté incluido
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  showMessage('Product added to cart');
  updateCartButton();
}

function showMessage(text) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = text;
  messageElement.classList.add('show');
  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 3000);
}

function updateCartButton() {
  const cartButton = document.getElementById('cart-button');
  cartButton.innerHTML = `
    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.85704 23C9.51605 23 9.18902 22.8654 8.94791 22.6257C8.70679 22.3861 8.57134 22.0611 8.57134 21.7222C8.57134 21.3833 8.70679 21.0583 8.94791 20.8187C9.18902 20.5791 9.51605 20.4444 9.85704 20.4444C10.198 20.4444 10.525 20.5791 10.7662 20.8187C11.0073 21.0583 11.1427 21.3833 11.1427 21.7222C11.1427 22.0611 11.0073 22.3861 10.7662 22.6257C10.525 22.8654 10.198 23 9.85704 23ZM18.4284 23C18.0874 23 17.7604 22.8654 17.5192 22.6257C17.2781 22.3861 17.1427 22.0611 17.1427 21.7222C17.1427 21.3833 17.2781 21.0583 17.5192 20.8187C17.7604 20.5791 18.0874 20.4444 18.4284 20.4444C18.7694 20.4444 19.0964 20.5791 19.3375 20.8187C19.5786 21.0583 19.7141 21.3833 19.7141 21.7222C19.7141 22.0611 19.5786 22.3861 19.3375 22.6257C19.0964 22.8654 18.7694 23 18.4284 23ZM0.857134 1.7037C0.629808 1.7037 0.411792 1.61396 0.251049 1.4542C0.0903049 1.29445 0 1.07778 0 0.851852C0 0.625927 0.0903049 0.409255 0.251049 0.249502C0.411792 0.0897484 0.629808 0 0.857134 0H5.1428C5.34088 0.000118888 5.5328 0.0684141 5.68594 0.193274C5.83907 0.318134 5.94397 0.491851 5.98279 0.684889L6.87421 5.11111H23.1426C23.2705 5.11107 23.3967 5.13947 23.5121 5.19421C23.6275 5.24895 23.7291 5.32865 23.8095 5.42748C23.8899 5.52631 23.947 5.64176 23.9766 5.76537C24.0063 5.88898 24.0077 6.01761 23.9809 6.14185L21.4095 18.0678C21.3683 18.2583 21.2626 18.4291 21.1101 18.5516C20.9575 18.674 20.7673 18.7408 20.5712 18.7407H8.57134C8.37326 18.7406 8.18134 18.6723 8.0282 18.5475C7.87507 18.4226 7.77017 18.2489 7.73135 18.0559L4.43995 1.7037H0.857134ZM9.27419 17.037H19.8786L22.0832 6.81482H7.21707L9.27419 17.037Z" fill="black"/>
    </svg>
    <span class="cart-count">${cart.length}</span>
  `;
}

function showCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.open('cart.html', '_blank');
}

function resetCart() {
  cart = [];
  updateCartButton();
}

window.addEventListener('message', (event) => {
  if (event.data === 'resetCart') {
      resetCart();
  }
});