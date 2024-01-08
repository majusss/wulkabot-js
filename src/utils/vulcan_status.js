const axios = require("axios");
const cheerio = require("cheerio");

class Domain {
  constructor(name, host, expectedTitle) {
    this.name = name;
    this.host = host;
    this.expectedTitle = expectedTitle;
  }
}

const DOMAINS = [
  new Domain(
    "vulcan.net.pl",
    "https://uonetplus.vulcan.net.pl/warszawa/",
    "Dziennik UONET+",
  ),
  new Domain(
    "vulcan.net.pl: Uczeń",
    "https://uonetplus-uczen.vulcan.net.pl/warszawa",
    "Uczeń",
  ),
  new Domain(
    "vulcan.net.pl: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.vulcan.net.pl/warszawa",
    "Wiadomości Plus",
  ),
  new Domain(
    "vulcan.net.pl: Aplikacja mobilna",
    "https://lekcjaplus.vulcan.net.pl",
    "Eduone",
  ),
  new Domain(
    "umt.tarnow.pl",
    "https://uonetplus.umt.tarnow.pl/tarnow",
    "Zaloguj",
  ),
  new Domain(
    "umt.tarnow.pl: Uczeń",
    "https://uonetplus-uczen.umt.tarnow.pl/tarnow",
    "Zaloguj",
  ),
  new Domain(
    "umt.tarnow.pl: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.umt.tarnow.pl/tarnow",
    "Zaloguj",
  ),
  new Domain(
    "umt.tarnow.pl: Aplikacja mobilna",
    "https://uonetplus-komunikacja.umt.tarnow.pl/tarnow",
    "UONET+ dla urządzeń mobilnych",
  ),
  new Domain(
    "eszkola.opolskie.pl",
    "https://uonetplus.eszkola.opolskie.pl/opole",
    "Logowanie do systemu Opolska e-Szkola",
  ),
  new Domain(
    "eszkola.opolskie.pl: Uczeń",
    "https://uonetplus-uczen.eszkola.opolskie.pl/opole",
    "Logowanie do systemu Opolska e-Szkola",
  ),
  new Domain(
    "eszkola.opolskie.pl: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.eszkola.opolskie.pl/opole",
    "Logowanie do systemu Opolska e-Szkola",
  ),
  new Domain(
    "eszkola.opolskie.pl: Aplikacja mobilna",
    "https://uonetplus-komunikacja.eszkola.opolskie.pl/opole",
    "UONET+ dla urządzeń mobilnych",
  ),
  new Domain(
    "Rzeszów",
    "https://portal.vulcan.net.pl/rzeszowprojekt",
    "Platforma VULCAN",
  ),
  new Domain(
    "Rzeszów: Uczeń",
    "https://uonetplus-uczen.vulcan.net.pl/rzeszowprojekt",
    "Logowanie do systemu",
  ),
  new Domain(
    "Rzeszów: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.vulcan.net.pl/rzeszowprojekt",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.gdansk.pl",
    "https://uonetplus.edu.gdansk.pl/gdansk",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.gdansk.pl: Uczeń",
    "https://uonetplus-uczen.edu.gdansk.pl/gdansk",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.gdansk.pl: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.edu.gdansk.pl/gdansk",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.gdansk.pl: Aplikacja mobilna",
    "https://uonetplus-komunikacja.edu.gdansk.pl/gdansk",
    "UONET+ dla urządzeń mobilnych",
  ),
  new Domain(
    "edu.lublin.eu",
    "https://uonetplus.edu.lublin.eu/lublin",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.lublin.eu: Uczeń",
    "https://uonetplus-uczen.edu.lublin.eu/lublin",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.lublin.eu: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.edu.lublin.eu/lublin",
    "Logowanie do systemu",
  ),
  new Domain(
    "edu.lublin.eu: Aplikacja mobilna",
    "https://uonetplus-komunikacja.edu.lublin.eu/lublin",
    "UONET+ dla urządzeń mobilnych",
  ),
  new Domain(
    "eduportal.koszalin.pl",
    "https://uonetplus.eduportal.koszalin.pl/koszalin",
    "Zaloguj",
  ),
  new Domain(
    "eduportal.koszalin.pl: Uczeń",
    "https://uonetplus-uczen.eduportal.koszalin.pl/koszalin",
    "Zaloguj",
  ),
  new Domain(
    "eduportal.koszalin.pl: Wiadomości Plus",
    "https://uonetplus-wiadomosciplus.eduportal.koszalin.pl/koszalin",
    "Zaloguj",
  ),
  new Domain(
    "eduportal.koszalin.pl: Aplikacja mobilna",
    "https://uonetplus-komunikacja.eduportal.koszalin.pl/koszalin",
    "UONET+ dla urządzeń mobilnych",
  ),
];

const Result = {
  OK: 0,
  DATABASE_UPDATE: 1,
  BREAK: 2,
  ERROR: 3,
  TIMEOUT: 4,
  UNKNOWN: 5,
};

class Status {
  constructor(state, statusCode, message) {
    this.state = state;
    this.statusCode = statusCode;
    this.message = message;
  }
}

async function checkStatus(url, expectedTitle) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    const title = $("title").text();

    if (title === expectedTitle) {
      return new Status(Result.OK, response.status, null);
    }

    return new Status(Result.UNKNOWN, response.status, title);
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return new Status(Result.TIMEOUT, null, "Timeout");
    } else {
      return new Status(Result.ERROR, null, error.message);
    }
  }
}

module.exports.checkAll = async function checkAll() {
  const status = await Promise.all(
    DOMAINS.map((domain) => checkStatus(domain.host, domain.expectedTitle)),
  );
  return DOMAINS.map((domain, i) => [domain.name, status[i]]);
};
