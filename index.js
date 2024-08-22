import readline from "readline";
import { saveDataInDb } from "./DB/connectionToDb.js";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let notas = [];
const cantidadParcial = 4;
let counter = 0;
let examGoldPoints = 15;
let cumulativeGoldPoints = 40;
const finalGrade = 0;
let stdentData = {
  name: "",
  subject: "",
};
const todoPromise = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (response) => {
      resolve(response);
    });
  });
};
export const insertNote = (index) => {
  if (counter < cantidadParcial) {
    return todoPromise(`Ingrese la calificación del ${index} parcial: `).then(
      (respuesta) => {
        const nota = parseFloat(respuesta);
        if (nota < 0 || nota > 100) {
          console.log("Por favor, ingrese una calificación entre 0 y 100.");
          return insertNote(index);
        } else {
          const value = (examGoldPoints * nota) / 100;
          const noteInBase = Math.ceil(value);
          notas.push(noteInBase);
          counter++;
          console.log("Your note has been successfully registered:", noteInBase);
          return insertNote(index + 1);
        }
      }
    );
  }
};

export const getCumulative = () => {
  return todoPromise("Ingrese su nota acumulativa: ").then((respuesta) => {
    const notaAcumulativa = parseFloat(respuesta);
    const valueAcumulative = (notaAcumulativa * cumulativeGoldPoints) / 100;
    const noteFinalCumulative = Math.ceil(valueAcumulative);
    notas.push(noteFinalCumulative);
    if (notaAcumulativa < 0 || notaAcumulativa > 100) {
      console.log(
        "Por favor, ingrese una nota acumulativa válida entre 0 y 100."
      );
      return getCumulative();
    }
  });
};
export const getData = async () => {
  return todoPromise("Ingrese su nombre: ")
    .then((respuesta) => {
      stdentData.name = respuesta;
      return todoPromise("Ingrese la materia: ");
    })
    .then((respuesta) => {
      stdentData.subject = respuesta;
      return stdentData;
    });
};

export const saveInDataBase = async () => {
  try {
    const [I_partial, II_partial, III_partial, IV_partial, acumulativo] = notas;
    const finalGrade =
      I_partial + II_partial + III_partial + IV_partial + acumulativo;
    await saveDataInDb(
      stdentData.name,
      stdentData.subject,
      I_partial,
      II_partial,
      III_partial,
      IV_partial,
      acumulativo,
      finalGrade
    );
    rl.close();
  } catch (error) {
    console.log("An error has occurred in saveInDataBase", error);
  }
};
