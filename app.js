// entry point

// instance of object with methods to fetch from PubChem
const chemical2 = new PubChem;

// instance of UI which prints html to div with id = "profile"
const ui = new UI;

// getting user input from webpage
const searchUser = document.getElementById('searchUser');

searchUser.addEventListener('keyup', (e) => {
  // Get input text
  const userText = e.target.value;

  // check if input is empty
  if(userText !== '') {
    // get selected properties: IUPAC Name, Title, MW, Mol. Formula
    chemical2.getChemical(userText)
    .then(data => {
      // get description; separate fetch due to structure of PubChem API
      chemical2.getDescription(data.chemical2.PropertyTable.Properties[0].CID)
      .then(desc => {
        // get synonyms; another fetch
        chemical2.getSynonyms(userText)
        .then(syn => {
            // get image; another fetch
            chemical2.getImage(userText)
            .then(image2 =>  {
              // show profile with fetched data
              ui.showProfile(data.chemical2,syn.synonyms,desc.description,image2.image);
            })
        })
      })
    })
  }
})