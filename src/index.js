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
const { json } = require('express');

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

app.get('/admin/produtos/criar', (req, res) => {
    res.render('admin/product/create_form', { title: 'ADM : Criar' });
});

app.post('/admin/produtos/criar', (req, res) => {
    const products = require(paths.products);
    const { name, description, price, tag } = req.body;

    const newId = Number(products[products.length - 1].id) + 1;

    const newProduct = {
        id: String(newId),
        name,
        description,
        price,
        tag,
    };

    const newProducts = [...products];
    newProducts.push(newProduct);

    fs.writeFile(paths.products, JSON.stringify(newProducts, null, 4), (error) => {
        console.log(error ? `ERROR: ${error}` : 'SUCCESS');
    });

    res.redirect('/admin/produtos');
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

    res.redirect('/admin/produtos');
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

    res.redirect('/admin/produtos');
});

app.get('/admin/categorias/criar', (req, res) => {
    res.render('admin/category/create_form');
})

app.post('/admin/categorias/criar', (req, res) => {
    const categories = require(paths.categories);
    const categoryName = req.body.name;

    const newId = Number(categories[categories.length - 1].id) + 1;

    const newCategory = {
        id: String(newId),
        name: categoryName,
    };

    const newCategories = [...categories];
    newCategories.push(newCategory);

    fs.writeFile(paths.categories, JSON.stringify(newCategories, null, 4), (error) => {
        console.log(error ? `ERROR: ${error}` : 'SUCCESS');
    });

    res.redirect('/admin/categorias');
});

app.get('/admin/categorias', (req, res) => {
    const categories = require(paths.categories);
    res.render('admin/category/list', { title: "ADM : Categorias", categories });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});