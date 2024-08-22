import { insertNote, getCumulative, getData, saveInDataBase } from "./index.js";

// This variable represents the number of notes to enter, the counter starts at 1
const cantidadParcial = 6;
const getNotes = async () => {
  try {
    for (let index = 1; index <= cantidadParcial; index++) {
      await insertNote(index);
    }
    await getCumulative();
    await getData();
    await saveInDataBase();
  } catch (error) {
    console.log("an error has occurred in getNotes");
  }
};

getNotes();
