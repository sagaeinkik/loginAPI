# API för inloggning

av S.E.K för Backendbaserad Webbutveckling på Mittuniversitetets Webbutvecklingsprogram.

## Bakgrund

API:et är ena halvan av moment 4 i kursen. Momentet går ut på att skapa en webbtjänst som kan hantera registrering och inloggning av användare. Den andra halvan går ut på att skapa en helt separat frontend-sida som utnyttjar webbtjänsten, och ha skyddade sidor som man bara kommer åt som inloggad användare.

## Uppbyggnad

API:et är skapat med MongoDB som DBMS.

-   Express
-   Mongoose - för att strukturera data
-   Cookie-parser - lagrar JWT-tokens i cookies
-   jsonwebtoken - genererar tokens
-   dotenv - för lagring av känsliga miljövariabler
-   bcrypt - hasha lösenord innan lagring i databasen
-   validator - kontrollera epost-adresser
-   nodemon - uppdatering av server
-   cors - tillåter anrop från andra domäner

## Anslutning till databas

Port och länk till databas ligger i en .env-fil. Det du behöver för att återskapa projektet är en egen .env-fil med följande:

```
PORT=YOUR_PORT
DB_URI=YOUR_DB_URI
JWT_SECRET_KEY=YOUR_SECRET_KEY
```

Your_secret_key kan genereras med hjälp av filen `generateSecret.js` i vilken crypto används för att generera fram en slumpmässig kodnyckel som du kan lägga in i din .env-fil.

## Ändpunkter

|  Metod | Ändpunkt    | Beskrivning                              |
| ------ | ----------- | ---------------------------------------- |
| POST   |  /signup    | Registrerar ny användare enligt Schema   |
|  POST  |  /login     |  Genererar web token och lagrar i cookie |
|  GET   |  /protected |  Skyddad route som kräver giltig JWT     |
