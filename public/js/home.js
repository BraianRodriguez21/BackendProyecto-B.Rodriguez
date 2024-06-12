const socket = io();
const form = document.getElementById('productForm'); 
const cardContainer = document.querySelector('.card-container');
const cartButton = document.getElementById('addToCart'); 

form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const formData = {
        title: form.elements['title'].value,
        price: form.elements['price'].value, 
        description: form.elements['description'].value
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
    };

    fetch('http://localhost:8080/api/products', options) 
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                alert(data.message);
                return;
            }

            alert('Producto registrado con éxito!'); 
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al registrar el producto'); 
        });
});

socket.on('new-product', (product) => { 
    const newCard = `
                <div class="card">
                    <h3>${product.title}</h3>
                    <p>Precio: ${product.price}</p> 
                    <p>Descripción: ${product.description}</p>
                    <button class="addToCart" data-id="${product._id}">Agregar al carrito</button>
                </div>`;

    cardContainer.innerHTML += newCard;
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('addToCart')) {
        const productId = event.target.getAttribute('data-id');
        
        fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'POST' })
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
    }
});
