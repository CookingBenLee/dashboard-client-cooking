#!/usr/bin/env node
/**
 * Script pour mettre à jour automatiquement la date de version
 * Utilisé par le hook pre-commit Git
 */

const fs = require('fs');
const path = require('path');

// Obtenir la date et l'heure actuelles
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

const currentDate = `${year}/${month}/${day}_${hours}:${minutes}`;

// Chemin vers le fichier full.component.ts
const componentFile = path.join(__dirname, 'src', 'app', 'layouts', 'full', 'full.component.ts');

try {
    // Vérifier si le fichier existe
    if (fs.existsSync(componentFile)) {
        // Lire le contenu du fichier
        let content = fs.readFileSync(componentFile, 'utf8');
        
        // Remplacer la ligne fixedDateTime avec la nouvelle date
        const pattern = /fixedDateTime: string = 'N° de version : [^']*';/;
        const replacement = `fixedDateTime: string = 'N° de version : ${currentDate}';`;
        
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            
            // Écrire le nouveau contenu
            fs.writeFileSync(componentFile, content, 'utf8');
            
            console.log(`✅ Version mise à jour automatiquement : ${currentDate}`);
        } else {
            console.log('⚠️  Pattern de version non trouvé dans le fichier');
        }
    } else {
        console.log(`❌ Fichier ${componentFile} non trouvé`);
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la version:', error.message);
    process.exit(1);
}
