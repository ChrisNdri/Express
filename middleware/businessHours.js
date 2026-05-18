
const businessHoursMiddleware = (req, res, next) => {
    // Récupère la date et l'heure actuelle
    const now = new Date();

    // Récupère le jour de la semaine (0=dimanche, 1=lundi, ..., 6=samedi)
    const dayOfWeek = now.getDay();

    // Récupère l'heure actuelle (0-23)
    const currentHour = now.getHours();

    // Vérification 1 : Vérifier que c'est un jour de semaine (lundi=1 à vendredi=5)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    // Vérification 2 : Vérifier que c'est entre 9h et 17h (17h inclus = avant 18h)
    const isWorkingHour = currentHour >= 9 && currentHour < 17;

    // Si c'est un jour ouvrable ET pendant les heures de travail, continuer
    if (isWeekday && isWorkingHour) {
        // Passer au middleware suivant ou à la route
        next();
    } else {
        // Sinon, retourner une erreur 403 (Accès interdit)
        // et afficher un message d'explication
        res.status(403).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service indisponible</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <div class="error-container">
          <h1>🚫 Service indisponible</h1>
          <p>Notre application est disponible uniquement pendant les heures de travail :</p>
          <p><strong>Lundi à vendredi, de 09:00 à 17:00</strong></p>
          <p>Actuellement : ${now.toLocaleString('fr-FR')}</p>
          <a href="/" class="btn-back">Retour</a>
        </div>
      </body>
      </html>
    `);
    }
};

// Exporter le middleware pour l'utiliser dans app.js
module.exports = businessHoursMiddleware;
