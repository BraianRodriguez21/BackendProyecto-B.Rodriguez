const socket = io();
const productForm = document.getElementById('productForm');
const cartForm = document.getElementById('cartForm');
const cardContainer = document.querySelector('.card-container');

// Manejar el envío del formulario de producto
productForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        title: productForm.elements['title'].value,
        price: productForm.elements['price'].value,
        description: productForm.elements['description'].value
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    };

    fetch('http://localhost:8080/api/products', options)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message);
                return;
            }

            alert('Producto registrado con éxito!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al registrar el producto');
        });
});

// Manejar el envío del formulario del carrito
cartForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        productId: cartForm.elements['productId'].value,
        quantity: cartForm.elements['quantity'].value,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    };

    fetch('http://localhost:8080/api/carts', options)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message);
                return;
            }

            alert('Producto agregado al carrito!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al agregar el producto al carrito');
        });
});

socket.on('new-product', (product) => {
    const newCard = `
        <div class="card">
            <h3>${product.title}</h3>
            <p>Precio: ${product.price}</p>
            <p>Descripción: ${product.description}</p>
        </div>`;

    cardContainer.innerHTML += newCard;
});
