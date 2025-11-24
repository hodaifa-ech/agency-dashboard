// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // 1. Lire et importer les Agences (tous les CSV)
  const agenciesPath = path.join(__dirname, 'data/agencies_agency_rows.csv');
  const agenciesCsv = fs.readFileSync(agenciesPath, 'utf-8');
  
  const parsedAgencies = Papa.parse(agenciesCsv, { header: true, skipEmptyLines: true });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agenciesToInsert = parsedAgencies.data as any[];
  
  console.log(`Traitement de ${agenciesToInsert.length} agences...`);

  // On utilise createMany pour aller plus vite, ou une boucle pour gérer les doublons
  // Ici on fait simple et robuste
  for (const row of agenciesToInsert) {
    if (!row.id || !row.name) continue;
    
    await prisma.agency.upsert({
      where: { originalId: row.id }, // On suppose que 'id' est unique dans le CSV
      update: {},
      create: {
        originalId: row.id,
        name: row.name,
        state: row.state,
        type: row.type,
        website: row.website,
      }
    });
  }
  
  // 2. Créer une Agence "Orpheline" par défaut pour les contacts sans agence valide
  const orphanAgency = await prisma.agency.upsert({
    where: { originalId: 'orphan-agency' },
    update: {},
    create: {
      originalId: 'orphan-agency',
      name: 'Unknown Agency',
      state: 'NA'
    }
  });

  // 3. Lire et importer les Contacts (tous les CSV)
  const contactsPath = path.join(__dirname, 'data/contacts_contact_rows.csv');
  const contactsCsv = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = Papa.parse(contactsCsv, { header: true, skipEmptyLines: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contactsToInsert = parsedContacts.data as any[];

  console.log(`Traitement de ${contactsToInsert.length} contacts...`);

  for (const row of contactsToInsert) {
    if (!row.id || !row.first_name) continue;

    // Vérifier si l'agence existe, sinon lier à l'orpheline
    let agencyConnectId = orphanAgency.id;
    
    if (row.agency_id) {
        const existingAgency = await prisma.agency.findUnique({
            where: { originalId: row.agency_id }
        });
        if (existingAgency) {
            agencyConnectId = existingAgency.id;
        }
    }

    await prisma.contact.upsert({
      where: { originalId: row.id },
      update: {},
      create: {
        originalId: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        title: row.title,
        agency: { connect: { id: agencyConnectId } }
      }
    });
  }

  console.log('✅ Seeding terminé !');
  console.log(`📊 Résumé:`);
  console.log(`   - ${agenciesToInsert.length} agences insérées`);
  console.log(`   - ${contactsToInsert.length} contacts insérés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });