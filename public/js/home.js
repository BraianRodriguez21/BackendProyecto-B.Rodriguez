const socket = io();
const form = document.getElementById('productForm'); 
const cardContainer = document.querySelector('.card-container');

form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const formData = {
        title: form.elements['title'].value,
        price: form.elements['price'].value, 
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
                </div>`;

    cardContainer.innerHTML += newCard;
});
