// Libraries
// - Express
const express = require('express');
const app = express();
const PORT = 3001;

// - Handlebars
const { engine } = require('express-handlebars');

// - Path
const path = require('path');

// - File System
const fs = require('fs');

// Configurations
// - Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', engine());

// - Forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data paths
const paths = {
    products: path.join(__dirname, 'data', 'products.json'),
    categories: path.join(__dirname, 'data', 'categories.json'),
    users: path.join(__dirname, 'data', 'users.json'),
};

// Routes
// - General
app.get('/', (req, res) => {
    const message = 'Hello, world!';
    res.render('index', { title: 'Application', message });
});

// - Admin
app.get('/admin/painel', (req, res) => {
    res.render('admin/panel', { title: 'Painel Administrativo' });
});

app.get('/admin/produtos', (req, res) => {
    const products = require(paths.products);
    res.render('admin/product/list', { title: 'ADM : Produtos', products });
});


app.get('/admin/produtos/editar/:id', (req, res) => {
    const products = require(paths.products);
    const { id: parameter_id } = req.params;

    products.forEach((product) => {
        const { id } = product;

        if (parameter_id == id) {
            const { name, description, price, tag } = product;
            res.render('admin/product/edit_form', { id: parameter_id, name, description, price, tag, title: 'ADM : Editar' });
        }
    });
});

app.post('/admin/produtos/editar', (req, res) => {
    const products = require(paths.products);
    const { id, name, description, price, tag } = req.body;

    let newProducts = [...products];
    products.forEach((product, index) => {
        if (id === product.id) {
            const newProduct = {
                id: product.id,
                name,
                description,
                price,
                tag,
            };
            newProducts[index] = newProduct;

            fs.writeFile(paths.products, JSON.stringify(newProducts, null, 4), (error) => {
                console.log(error ? `ERROR: ${error}` : 'SUCCESS');
            });
        }
    });

    res.redirect('/admin/painel');
});

app.get('/admin/produtos/deletar', (req, res) => {
    res.render('admin/product/delete_form', { title: 'ADM : Deletar' });
});

app.post('/admin/produtos/deletar', (req, res) => {
    const products = require(paths.products);
    const { id } = req.body;

    let newProducts = products.filter(product => id !== product.id);
    fs.writeFile(paths.products, JSON.stringify(newProducts, null, 4), (error) => {
        console.log(error ? `ERROR: ${error}` : 'SUCCESS');
    });

    res.redirect('/admin/painel');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});