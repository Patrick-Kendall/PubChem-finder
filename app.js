// entry point

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// instance of object with methods to fetch from PubChem
const APIConnect = new PubChem;
const pubViewConnect = new PubView;

// instance of UI which prints html to div with id = "profile"
const ui = new UI;

const chemData = new ChemProperties;

// getting user input from webpage
const searchUser = document.getElementById('searchUser');

searchUser.addEventListener('keypress', async (e) => {
  // Get input text
  const userText = e.target.value;

  console.log(userText);

  const key = e.code;

  // check if input is empty
  if(key == 'Enter') {

    chemData.clear();


    // APIConnect.getChemName(userText)
    // .then(response =>
    //   {
    //     console.log(response.chemical2);
    //     console.log(chemData.extractName(response.chemical2));
        
    //   })


    // GET EXPERIMENTAL PROPERTIES FROM NAME OF COMPOUND

    // APIConnect.getCID(userText)
    // .then(CID =>
    //   {
    //     pubViewConnect.getExpProperties(CID.CID)
    //     .then(data =>
    //       {
    //         console.log(data.chemical2);
    //         chemData.loadProp(data.chemical2.Record.Section[0].Section[0].Section);
    //         console.log(chemData);
    //         console.log(chemData.assembleCIDs());
    //       })
    //   })

    // GET FULL RECORD FROM PUBVIEW
    
    await APIConnect.getCID(userText)
    .then(CID =>
      {
        pubViewConnect.getFullRecord(CID.CID)
        .then(async data =>
          {
            console.log(data.chemical2);
            chemData.loadTitle(data.chemical2.Record);
            chemData.loadAll(data.chemical2.Record.Section);
            try {
              chemData.loadRecordDescription(data.chemical2.Record.Section[2].Section[0].Information);
            } catch {
              chemData.recordDescription = chemData.description[0];
            }

            await sleep(300);
            console.log(chemData);
            // get image; another fetch
            APIConnect.getImage(userText)
            .then(image2 =>  {
              chemData.assembleSolvents();
            
            // show profile with fetched data
            ui.showProfile(image2.image);
            })
          })
      });







  }
})