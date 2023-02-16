const db = require('./conn.js');
const getAccounts = require('../twentyfour/getAccounts.js');
const getAccountsFromDB = require('./getAccountsFromDB.js');

const AcountClasses = {
    "10": "Immatrielle eiendeler",
    "11": "Anleggsmidler",
    "12": "Anleggsmidler",
    "13": "Finansielle anleggsmidler",
    "14": "Varelager",
    "15": "Kortsigtig fordring",
    "17": "Forskuddsbetalt inntekt",
    "18": "Kortsiktige investeringer",
    "19": "Bankinnskudd",
    "20": "Egenkapital",
    "21": "Avsetninger",
    "22": "Annen langsiktig gjeld",
    "23": "Gjeld til kredittinstitusjoner",
    "24": "Leverandørgjeld",
    "26": "Andre trekk",
    "27": "Skyldige offentlige avgifter",
    "29": "Annen kortsigktig gjeld",
    "30": "Salgsinntekter",
    "31": "Bedriftsinntekter",
    "33": "Annen støtte",
    "34": "Medlemskontigent",
    "36": "Annen driftsrelatert inntekt",
    "40": "Varekostnader",
    "50": "Lønn til ansatte",
    "52": "Fordel i arbeidsforhold",
    "53": "Anenn oppgavepliktig godgjørelse",
    "54": "Annen personalkostnad",
    "60": "Avskrivninger",
    "61": "Frakt og transportkostnad",
    "62": "Strømkostnad",
    "63": "Kostnad lokaler",
    "64": "Leve maskiner, inventar, teknisk",
    "65": "Inventar og driftsmateriale",
    "67": "Fremmedtjenester",
    "68": "Kontor og IT kostnader",
    "69": "Telefonkostnader",
    "71": "Kostnad og godtgj. for reiser, diett",
    "72": "Enhetsstyre, mlter og arrangementskost",
    "73": "Markedsføringskostnader og klær",
    "74": "Representasjonskostnader",
    "75": "Kontigent, donasjon og gave",
    "76": "Lisenskostnader",
    "77": "Annen kostnad",
    "78": "Tap på krav o.l.",
    "79": "Internstøtte kostnad",
    "80": "Finansinntekt",
    "81": "Finanskostnad",
    "88": "Årsresultat", 
  }

const postAccounts = async () => {

        const accounts24 = await getAccounts();
        const accountsDB = await getAccountsFromDB();

       //Create a new object called accountClassId. The accountClassId is the first 2 digits of the account number.
        accounts24.forEach(account => {
            account.accountClassId = account.AccountNo.substring(0, 2);
        });

        //Create a new object called accountClassName. The accountClassName is the value of the accountClassId key in the AcountClasses object.
        accounts24.forEach(account => {
            account.accountClassName = AcountClasses[account.accountClassId];
        });

        //Check if accountNo exists in DB. If it does, check if AccountName matches. If it doesn't, update AccountName. Otherwise, insert account into DB it doesn't exist.
        //Fields: AccountId, AccountNo, AccountName
        accounts24.forEach(account => {
            if (accountsDB.some(dbAccount => dbAccount.AccountNo === account.AccountNo)) {
                if (accountsDB.some(dbAccount => dbAccount.AccountNo === account.AccountNo && dbAccount.AccountName !== account.AccountName)) {
                    db.query(`UPDATE accounts SET AccountName = '${account.AccountName}' WHERE AccountNo = '${account.AccountNo}'`);
                }
            } else {
                db.query(`INSERT INTO accounts (AccountId, AccountNo, AccountName, AccountClassId, AccountClassName) VALUES ('${account.AccountNo}', '${account.AccountNo}', '${account.AccountName}', '${account.accountClassId}', '${account.accountClassName}')`);
            }
        });
    };

module.exports = postAccounts;