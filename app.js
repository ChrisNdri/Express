
// Importer les modules nécessaires
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const businessHoursMiddleware = require('./middleware/businessHours');

// Créer l'application Express
const app = express();

// Configurer Handlebars comme moteur de template
app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials')
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir les fichiers statiques (CSS, images, JS) depuis le dossier 'public'
app.use(express.static('public'));

// Appliquer le middleware de vérification des heures de travail
// à TOUTES les routes (sauf les fichiers statiques)
app.use(businessHoursMiddleware);b

// Route 1 : Page d'accueil
app.get('/', (req, res) => {
    // render() utilise Handlebars pour générer une page HTML
    // en remplaçant les variables du template par les données
    res.render('accueil', {
        titre: 'Accueil',
        pages: [
            { url: '/', label: 'Accueil', active: true },
            { url: '/services', label: 'Nos services', active: false },
            { url: '/contact', label: 'Nous contacter', active: false }
        ]
    });
});

// Route 2 : Page Nos services
app.get('/services', (req, res) => {
    res.render('services', {
        titre: 'Nos services',
        pages: [
            { url: '/', label: 'Accueil', active: false },
            { url: '/services', label: 'Nos services', active: true },
            { url: '/contact', label: 'Nous contacter', active: false }
        ]
    });
});

// Route 3 : Page Nous contacter
app.get('/contact', (req, res) => {
    res.render('contact', {
        titre: 'Nous contacter',
        pages: [
            { url: '/', label: 'Accueil', active: false },
            { url: '/services', label: 'Nos services', active: false },
            { url: '/contact', label: 'Nous contacter', active: true }
        ]
    });
});

// Route pour les pages non trouvées (404)
app.use((req, res) => {
    res.status(404).render('404', {
        titre: 'Page non trouvée',
        pages: [
            { url: '/', label: 'Accueil', active: false },
            { url: '/services', label: 'Nos services', active: false },
            { url: '/contact', label: 'Nous contacter', active: false }
        ]
    });
});

// Définir le port sur lequel le serveur va écouter (3000 par défaut)
const PORT = process.env.PORT || 3000;

// Démarrer le serveur et écouter sur le port spécifié
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    console.log(`📅 Heures de travail : lundi-vendredi, 09:00-17:00`);
});
