// entry point
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// instance of object with methods to fetch from PubChem
const APIConnect = new PubChem();
const pubViewConnect = new PubView();

// instance of UI which prints html to div with id = "profile"
const ui = new UI();

const chemData2 = new DataStruct();

const control = new Controller();

control.loadEventListeners();
