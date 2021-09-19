class UI {
  constructor() {
    this.profile = document.getElementById("profile");
    this.title = "";
    this.imageURL = "";
    this.description = "";
    this.molWeight = "";
    this.molFormula = "";
    this.IUPACName = "";
    this.charge = "";
    this.synonyms = "";
  }

  // receive data from fetch; print to webpage
  showProfile(chemical,synonym,description,record) {
    // storing data from API path in object properties
    this.title = chemical.PropertyTable.Properties[0].Title;
    this.imageURL = record.url;
    this.description = description.InformationList.Information[1].Description;
    this.molWeight = chemical.PropertyTable.Properties[0].MolecularWeight;
    this.molFormula = chemical.PropertyTable.Properties[0].MolecularFormula;
    this.IUPACName = chemical.PropertyTable.Properties[0].IUPACName;
    this.charge = chemical.PropertyTable.Properties[0].Charge;
    
    // clearing synonym list
    this.synonyms = "";

    // choosing six synonyms from list fetched from PubChem
    for(let i = 9; i < 15; i++) {
      if(i == 14) {
        this.synonyms += synonym.InformationList.Information[0].Synonym[i];
      } else {
      this.synonyms += synonym.InformationList.Information[0].Synonym[i] + ", ";
      }
    }

    // printing literal string to an html div
    this.profile.innerHTML = `
      <div class="col spec-sheet">
          <h4 class=""> ${this.title}</h4><br>
          <div class="spec-sheet-container">
            <div class="spec-sheet-image">
              <img src="${this.imageURL}">
            </div>
            <div class="spec-sheet-text">
              <li class="list-group" >Description: <br> ${this.description}</li><br>
              <li class="list-group">Molecular Weight: ${this.molWeight}
              </li><br>
            </div> 
          </div>
          <li class="list-group">Synonyms: <br>${this.synonyms} </li><br>
        </div>
    `;
  }
}