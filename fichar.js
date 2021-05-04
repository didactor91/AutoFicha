const axios = require("axios");
const args = require("minimist")(process.argv.slice(2));
const schedule = require("node-schedule");
const dotenv = require("dotenv");
dotenv.config();

//

const url = process.env.oceanBaseUrl;
const token = process.env.oceanAppToken;
let entrada = args["entry"];
let hr = args["hours"];
let minutes = args["minutes"];
let planNumber = args["plan"];
let breakHour = args["break-hour"];
let breakDuration = args["break-duration"];
let nonstop = args["nonstop"];
let localTest = args["test"];
let noBreak = false;

if (localTest == "true") {
  localTest = true;
} else {
  localTest = false;
}

if (!entrada) {
  entrada = true;
}

if (!breakDuration) {
  breakDuration = 1;
}

function getPlan(number) {
  const plan = {
    1: () => {
      hr = 8;
      minutes = 30;
      noBreak = nonstop == "true" ? true : false;
    },
    2: () => {
      hr = 6;
      minutes = 0;
      noBreak = true;
    },
    3: () => {
      hr = 4;
      minutes = 0;
      noBreak = true;
    },
    0: () => {
      noBreak = nonstop == "true" ? true : false;
    },
    default: () => {
      hr = 8;
      minutes = 0;
      noBreak = nonstop == "true" ? true : false;
    },
  };
  (plan[number] || plan["default"])();
}
getPlan(planNumber);

if (!breakHour) {
  breakHour = noBreak ? 0 : Math.ceil(hr / 2);
}

breakDuration = noBreak ? 0 : Math.ceil(breakDuration);

if (planNumber == 0) {
  try {
    if (!hr) {
      throw new Error("invalid --hours argument");
    }
    if (!minutes) {
      minutes = 0;
    }
    if (nonstop == "true") {
      noBreak = true;
      breakDuration = 0;
      breakHour = 0;
    }
  } catch (err) {
    return console.log(err.message);
  }
}

const secRnd = () => Math.floor(Math.random() * 360);

const entryDate = new Date().getTime();

const workingTime =
  (Number(hr) * 3600 + secRnd() + Number(minutes) * 60) * 1000;
const breakTime = (Number(breakHour) * 3600 + secRnd()) * 1000;

const breakDurationTime = (Number(breakDuration) * 3600 + secRnd()) * 1000;
const startBreakDate = new Date(entryDate + breakTime);
const stopBreakDate = new Date(entryDate + breakTime + breakDurationTime);

const exitDate = new Date(entryDate + workingTime + breakDurationTime);

// CONSOLE LOGS TO SHOW INFORMATION
localTest &&
  console.log("/_/-/_/-/MODO TEST: SIMULA FUNCIONAMIENTO, NO FICHA/-/_/-/_/");
console.log("/_/-/_/-/_/-/_/-/_/");
console.log(`ENTRY: ${new Date(entryDate).toLocaleString()}`);
!noBreak
  ? console.log(
      `BREAK: ${startBreakDate.toLocaleString()} to ${stopBreakDate.toLocaleString()}`
    )
  : console.log(`BREAK: NO`);
console.log(`EXIT: ${exitDate.toLocaleString()}`);
console.log(`WORK DURATION: ${hr}hr ${minutes}min`);
!noBreak
  ? console.log(`BREAK DURATION: ${breakDuration}hr`)
  : console.log(`BREAK DURATION: NO`);
console.log("/_/-/_/-/_/-/_/-/_/");
//

if (!noBreak) {
  const startBreak = schedule.scheduleJob(startBreakDate, function () {
    console.log("STOP WORKING! START BREAK!", new Date().toLocaleString());
    console.log("/_/-/_/-/_/-/_/-/_/");
    !localTest && fichar("out");
  });
  const stopBreak = schedule.scheduleJob(stopBreakDate, function () {
    console.log("STOP BREAK! START WORKING!", new Date().toLocaleString());
    console.log("/_/-/_/-/_/-/_/-/_/");
    !localTest && fichar("in");
  });
}

const exitJob = schedule.scheduleJob(exitDate, function () {
  console.log("BYE, STOP WORKING!", new Date().toLocaleString());
  console.log("/_/-/_/-/_/-/_/-/_/");
  !localTest && fichar("out");
});

const fichar = async (forceInOut = false) => {
  try {
    if (!token) {
      throw new Error("invalid token in env file");
    }
    if (!entrada && forceInOut === false) {
      throw new Error("invalid --entrada argument");
    }
    if (forceInOut !== false) {
      entrada = forceInOut === "out" ? false : true;
    }

    const response = await axios.post(
      url + "/data/marcajes/realizar-manual",
      {
        IncidenciaId: null,
        EsEntrada: entrada,
        Nota: null,
        GeoLat: 0,
        GeoLong: 0,
        Tipo: "P",
        TipoProd: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    console.log(`ID MARCAJE: ${data.Ids}`);
    console.log("/_/-/_/-/_/-/_/-/_/");
    const last = await consultar();
    console.log(
      `ULTIMO MARCAJE: ${new Date(
        last.FechaHoraUltimoMarcaje
      ).toLocaleString()}`
    );
    console.log("/_/-/_/-/_/-/_/-/_/");
  } catch (error) {
    console.log("ERROR::", error.message);
  }
};

const consultar = async () => {
  try {
    const response = await axios.get(url + "/data/marcajes/boton-a-mostrar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("ERROR::", error.message);
  }
};

console.log("HELLO, START WORKING!", new Date().toLocaleString());
console.log("/_/-/_/-/_/-/_/-/_/");
!localTest && fichar();
