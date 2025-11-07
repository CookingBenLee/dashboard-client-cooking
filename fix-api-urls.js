#!/usr/bin/env node
/**
 * Script pour corriger les URLs d'API dans le frontend
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des URLs d\'API...');

// Fichiers à modifier
const filesToUpdate = [
    'src/environments/environment.ts',
    'src/environments/environment.prod.ts'
];

const newApiUrl = 'http://92.222.10.20:5000';

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remplacer localhost:5000 par l'IP du serveur
        content = content.replace(/http:\/\/localhost:5000/g, newApiUrl);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} mis à jour`);
    } else {
        console.log(`⚠️  ${file} non trouvé`);
    }
});

// Vérifier les fichiers de configuration Angular
const angularJsonPath = path.join(__dirname, 'angular.json');
if (fs.existsSync(angularJsonPath)) {
    let angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
    
    // Mettre à jour la configuration de build si nécessaire
    if (angularJson.projects && angularJson.projects['dashboard-client-cooking']) {
        const project = angularJson.projects['dashboard-client-cooking'];
        if (project.architect && project.architect.build) {
            const buildConfig = project.architect.build;
            if (buildConfig.options && buildConfig.options.assets) {
                // Ajouter la configuration pour les polices
                buildConfig.options.assets.push({
                    "glob": "**/*",
                    "input": "node_modules/@angular/material/prebuilt-themes",
                    "output": "assets/"
                });
            }
        }
    }
    
    fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2), 'utf8');
    console.log('✅ angular.json mis à jour');
}

console.log('✅ Correction des URLs terminée!');
