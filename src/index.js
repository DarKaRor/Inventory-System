import Product from '../classes/Product.js';

const select = (query) => document.querySelector(query);

// Form elements
const form = select('form');
const inputCode = select('#code');
const inputDescription = select('#description');
const inputQuantity = select('#quantity');
const inputPrice = select('#price');
let inputs = [inputCode, inputDescription, inputQuantity, inputPrice];
let toDisable = [inputDescription, inputPrice];

// Table elements
const tbody = select('#body');

// Result elements
const total = select('#total');
const totalQuantity = select('#totalQuantity');
const totalValue = select('#value');

let products = [];


// Turn the code to uppercase, check if the code is already in the array.
inputCode.addEventListener('input', () => {
    inputCode.value = inputCode.value.toUpperCase();

    const product = products.find(product => product.code === inputCode.value);

    if (product) {
        toDisable.map(input => input.disabled = true);

        // Fill the inputs with the product's data

        inputCode.value = product.code;
        inputDescription.value = product.description;
        inputQuantity.value = product.quantity;
        inputPrice.value = product.price;
    }

    else toDisable.map(input => input.disabled = false);

});

// Form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    inputs.map(input => input.value = input.value.trim());

    let code = inputCode.value.toUpperCase();
    let description = inputDescription.value;
    let quantity = +inputQuantity.value;
    let price = parseFloat(inputPrice.value);

    // Clear the inputs
    inputs.map(input => input.value = '');

    let possibleProduct = products.find(product => product.code === code);
    if (possibleProduct) {
        possibleProduct.quantity += quantity;
        renderTable();
        return;
    }

    let product = new Product(code, description, quantity, price);
    products.push(product);
    renderTable();
});

// Render the table
const renderTable = () => {
    tbody.innerHTML = '';
    products.map(product => {
        let tr = document.createElement('tr');
        tr.classList.add('table__row');
        tr.id = "_" + product.code;

        ['description', 'code', 'price', 'quantity'].map(key => {
            if (key === 'code') tr.innerHTML += "<td class='table__item'>" + product.code + "</td>";
            else {
                let td = createTD();
                td.classList.add('table__item');
                td.appendChild(createInput('text', key, product[key]));
                tr.appendChild(td);
            }
        });

        tr.innerHTML += `
            <td class="table__item flex">
                <button class="btn btn-danger button button--mini">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn btn-warning button button--mini">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);

        let buttons = document.querySelectorAll(`#_${product.code} button`);
        buttons[0].addEventListener('click', () => deleteProduct(product.code));
        buttons[1].addEventListener('click', () => editProduct(product.code));

    });

    deleteLastRowBorder();
    renderTotal();
}



const deleteLastRowBorder = () => {
    // Select last found element with the class 'table__row'
    let allRows = document.querySelectorAll('.table__row');
    allRows.forEach(row => {
        row.setAttribute('style', '');
    })
    let lastRow = allRows[allRows.length - 1];
    lastRow.style.borderBottom = 'none';
}

deleteLastRowBorder();

const deleteProduct = (code) => {
    products = products.filter(product => product.code !== code);
    renderTable();
}

const editProduct = (code) => {
    let tr = select(`#_${code}`);
    let product = products.find(product => product.code === code);

    let description = tr.querySelector('input[name="description"]');
    let price = tr.querySelector('input[name="price"]');
    let quantity = tr.querySelector('input[name="quantity"]');

    product.description = description.value;
    product.price = parseFloat(price.value);
    product.quantity = parseInt(quantity.value);

    alert("Se actualizó el producto");
    renderTable();
}

const createInput = (type, name, value) => {
    let input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.setAttribute('value', value);
    return input;
}

const createTD = () => document.createElement('td');

const inventoryValue = () => {
    let total = 0;
    products.map(product => total += product.price * product.quantity);
    return total;
}

const inventoryQuantity = () => {
    let total = 0;
    products.map(product => total += product.quantity);
    return total;
}

const productsQuantity = () => products.length;

const renderTotal = () => {
    total.innerHTML = "Total de productos: " + inventoryQuantity();
    totalQuantity.innerHTML = "Cantidad de productos: " + productsQuantity();
    totalValue.innerHTML = "Valor de inventario: $" + inventoryValue();
}

renderTotal();
