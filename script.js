let addresses = [];
let selectedAddressIndex = null;

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1499,
    quantity: 1,
    image: "https://placehold.co/80x80/198754/FFFFFF.png?text=Headphones",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2599,
    quantity: 1,
    image: "https://placehold.co/80x80/198754/FFFFFF.png?text=Watch",
  },
];

const addressForm = document.getElementById("addressForm");
const addressList = document.getElementById("addressList");
const productList = document.getElementById("productList");
const totalItems = document.getElementById("totalItems");
const totalPrice = document.getElementById("totalPrice");
const grandTotal = document.getElementById("grandTotal");
const payBtn = document.getElementById("payBtn");
const saveAddressBtn = document.getElementById("saveAddressBtn");


addressForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const editIndex = document.getElementById("editIndex").value;

  if (!name || !phone || !address || !city || !state || !pincode) {
    showToast("Please fill in all address fields.", "danger");
    return;
  }

  // Phone validation
  if (!/^\d{10}$/.test(phone)) {
    showToast("Please enter a valid 10-digit phone number.", "danger");
    return;
  }

  // Pincode validation
  if (!/^\d{6}$/.test(pincode)) {
    showToast("Please enter a valid 6-digit pincode.", "danger");
    return;
  }

  const newAddress = { name, phone, address, city, state, pincode };

  if (editIndex) {
    addresses[editIndex] = newAddress;
    showToast("Address updated successfully!", "success");
    saveAddressBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Address';
  } else {
    addresses.push(newAddress);
    showToast("New address added successfully!", "success");
  }

  addressForm.reset();
  document.getElementById("editIndex").value = "";
  renderAddresses();
});

function renderAddresses() {
  if (addresses.length === 0) {
    addressList.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-map-marker-alt fa-3x mb-3 opacity-25"></i>
        <p>No addresses added yet.</p>
      </div>
    `;
    return;
  }

  addressList.innerHTML = "";
  addresses.forEach((addr, index) => {
    const div = document.createElement("div");
    div.className = `card mb-3 address-card ${
      index === selectedAddressIndex ? "selected-address" : ""
    }`;

    div.innerHTML = `
      <div class="card-body p-3">
        <div class="d-flex justify-content-between">
          <div class="address-content" onclick="selectAddress(${index})">
            <div class="d-flex">
              ${
                index === selectedAddressIndex
                  ? '<i class="fas fa-check-circle text-success me-2 mt-1"></i>'
                  : ""
              }
              <div>
                <h6 class="fw-bold mb-1">${addr.name}</h6>
                <p class="mb-1 text-muted small">${addr.address}, ${
      addr.city
    }, ${addr.state} - ${addr.pincode}</p>
                <p class="mb-0 text-muted small">Phone: ${addr.phone}</p>
              </div>
            </div>
          </div>
          <div class="edit-icons">
            <i class="fas fa-edit" onclick="editAddress(${index})" title="Edit"></i>
            <i class="fas fa-trash" onclick="deleteAddress(${index})" title="Delete"></i>
          </div>
        </div>
      </div>
    `;
    addressList.appendChild(div);
  });
}


function selectAddress(index) {
  selectedAddressIndex = index;
  renderAddresses();
  showToast("Delivery address selected!", "success");
}

// Edit Address
function editAddress(index) {
  const addr = addresses[index];
  document.getElementById("name").value = addr.name;
  document.getElementById("phone").value = addr.phone;
  document.getElementById("address").value = addr.address;
  document.getElementById("city").value = addr.city;
  document.getElementById("state").value = addr.state;
  document.getElementById("pincode").value = addr.pincode;
  document.getElementById("editIndex").value = index;


  saveAddressBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Address';


  document
    .getElementById("addressFormSection")
    .scrollIntoView({ behavior: "smooth" });
}

// Delete Address
function deleteAddress(index) {
  if (confirm("Are you sure you want to delete this address?")) {
    addresses.splice(index, 1);
    if (selectedAddressIndex === index) selectedAddressIndex = null;
    else if (selectedAddressIndex !== null && selectedAddressIndex > index)
      selectedAddressIndex--;
    renderAddresses();
    showToast("Address deleted successfully!", "info");
  }
}


function renderProducts() {
  productList.innerHTML = "";
  products.forEach((product, index) => {
    const subtotal = product.price * product.quantity;
    const div = document.createElement("div");
    div.className = "p-4 border-bottom";
    div.innerHTML = `
      <div class="d-flex product-details">
        <img src="${product.image}" alt="${
      product.name
    }" class="product-image me-3">
        <div class="flex-grow-1">
          <h5 class="mb-1">${product.name}</h5>
          <p class="text-success fw-medium mb-2">₹${product.price.toLocaleString()}</p>
        </div>
        <div class="product-quantity">
          <div class="quantity-control mb-2">
            <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-value mx-2" id="qty-${index}">${
      product.quantity
    }</span>
            <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="text-end">
            Subtotal: <span class="fw-medium">₹${subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(div);
  });

  updateSummary();
}


function changeQuantity(index, change) {
  if (products[index].quantity + change >= 1) {
    products[index].quantity += change;
    renderProducts();
  }
}

// Update Summary
function updateSummary() {
  const totalItemsVal = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPriceVal = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  totalItems.textContent = totalItemsVal;
  totalPrice.textContent = totalPriceVal.toLocaleString();
  grandTotal.textContent = totalPriceVal.toLocaleString();
}

// Place Order
payBtn.addEventListener("click", () => {
  if (selectedAddressIndex === null) {
    showToast("Please select a delivery address before proceeding.", "danger");
    return;
  }

  const totalItemsVal = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPriceVal = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const selected = addresses[selectedAddressIndex];

  //  a modal for order confirmation
  const modalHTML = `
    <div class="modal fade" id="orderConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Order Placed Successfully!</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <div class="text-center mb-4">
              <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
              <h4>Thank you for your order!</h4>
              <p class="text-muted">Your order has been placed successfully.</p>
            </div>
            
            <div class="card mb-3">
              <div class="card-header bg-light">
                <h6 class="mb-0">Delivery Address</h6>
              </div>
              <div class="card-body">
                <p class="mb-1"><strong>${selected.name}</strong></p>
                <p class="mb-1">${selected.address}, ${selected.city},</p>
                <p class="mb-1">${selected.state} - ${selected.pincode}</p>
                <p class="mb-0">Phone: ${selected.phone}</p>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header bg-light">
                <h6 class="mb-0">Order Summary</h6>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <span>${totalItemsVal}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">Total Amount:</span>
                  <span class="fw-bold">₹${totalPriceVal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  //  modal to body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  //  the modal
  const modal = new bootstrap.Modal(
    document.getElementById("orderConfirmModal")
  );
  modal.show();

  //  modal from DOM after it's hidden
  document
    .getElementById("orderConfirmModal")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
});

// Toast notification 
function showToast(message, type = "info") {
  // Create toast container 
  if (!document.getElementById("toast-container")) {
    const toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1050";
    document.body.appendChild(toastContainer);
  }

  const toastId = "toast-" + Date.now();
  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  document
    .getElementById("toast-container")
    .insertAdjacentHTML("beforeend", toastHTML);
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();

  // Remove toast from DOM after it's hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    this.remove();
  });
}

renderProducts();
