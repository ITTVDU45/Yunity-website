# Datenbank-Migrationen

Indizes werden in diesem Projekt von Mongoose beim Applikationsstart angelegt
(`autoIndex` aktiv). Die Grunddaten (Site, Systemrollen, Super-Admin) erzeugt der
**idempotente Seed** (`npm run seed`), der im Deploy-Ablauf läuft.

Für kontrollierte Schema- oder Datenänderungen in Produktion wird
[`migrate-mongo`](https://github.com/seppevs/migrate-mongo) empfohlen:

1. `npm i -D migrate-mongo` im `apps/api`-Workspace.
2. `migrate-mongo-config.js` mit `mongodb.url = process.env.MONGODB_URI` und
   `migrationsDir = "migrations"` anlegen.
3. Migrationen hier als `NNNN-beschreibung.js` mit `up(db)` / `down(db)` ablegen.
4. Im Deploy vor dem Start als Job-Container ausführen: `npx migrate-mongo up`.

Regel: keine manuellen Änderungen an der Produktionsdatenbank — ausschließlich
über versionierte, wiederholbare Migrationen bzw. den Seed.
