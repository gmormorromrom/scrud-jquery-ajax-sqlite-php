// Importer les modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');

// Créer une application Express
const app = express();
const port = 3000;

// Middleware pour analyser les données JSON dans les requêtes
app.use(bodyParser.json());

// Liste d'éléments en mémoire (simulée)
let items = [];

// Endpoint pour créer un nouvel élément
app.post('/api/items', (req, res) => {
    const newItem = req.body.name;
    const name = req.body.name;
    if (newItem) {
        items.push({ name: name });
        res.status(201).send('Élément créé avec succès');
    } else {
        res.status(400).send('Le champ "name" est requis');
    }
});

// Endpoint pour récupérer tous les éléments
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Endpoint pour mettre à jour un élément
app.put('/api/items', (req, res) => {
    const updatedItem = req.body.name;
    if (updatedItem) {
        // Rechercher l'élément à mettre à jour (par exemple, par son index)
        const index = items.findIndex(item => item.name === updatedItem);
        if (index !== -1) {
            items[index].name = updatedItem;
            res.send('Élément mis à jour avec succès');
        } else {
            res.status(404).send('Élément non trouvé');
        }
    } else {
        res.status(400).send('Le champ "name" est requis');
    }
});

// Endpoint pour supprimer un élément
app.delete('/api/items', (req, res) => {
    const deletedItem = req.body.name;
    if (deletedItem) {
        // Filtrer les éléments pour exclure celui à supprimer
        items = items.filter(item => item.name !== deletedItem);
        res.send('Élément supprimé avec succès');
    } else {
        res.status(400).send('Le champ "name" est requis');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
