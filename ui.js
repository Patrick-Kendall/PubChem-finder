class UI {
  constructor() {
    this.profile = document.getElementById("profile");
    this.imageURL = "";
  }

  // receive data from fetch; print to webpage
  showProfile(image) {
    this.imageURL = image.url;

    // printing literal string to an html div
    this.profile.innerHTML = `
      <div class="spec-sheet">
          <h4 class=""> ${chemData.title}</h4><br>
          <div class="spec-sheet-container">
            <div class="spec-sheet-image">
              <img class="chemicalStructure" src="${this.imageURL}">
              <p class="spec-sheet-CAS">CAS #: ${chemData.CAS}</p>
            </div>
            <div class="spec-sheet-text">
              
              
            <h6>Chemical and Physical Properties</h4>
            <table class="property-table">
             <tr>
              <td class="row__header">Boiling Point</td>
              <td class="row__element">${chemData.BP}</td>
            </tr>
            <tr>
              <td class="row__header">Vapor Pressure</td>
              <td class="row__element">${chemData.VP}</td>
            </tr>
            <tr>
              <td class="row__header">Density</td>
              <td class="row__element">${chemData.D}</td>
            </tr>
            <tr>
              <td class="row__header">Molecular Weight</td>
              <td class="row__element">${chemData.molecularWeight}</td>
            </tr>
            <tr>
              <td class="row__header">Soluble In</td>
              <td class="row__element">${chemData.solubleCSV}</td>
            </tr>
            <tr>
              <td class="row__header">Flash Point</td>
              <td class="row__element">${chemData.FP}</td>
            </tr>

            </table>
            </div> 
          </div>
          <li class="list-group"><h6>Description:</h6>${chemData.recordDescription} </li><br>
          <li class="list-group"><h6>Methods of Manufacture:</h6> ${chemData.manufacturing[0]} </li><br>
          <li class="list-group"> ${chemData.manufacturing[1]}</li><br>
          <br>

          <h5> Pharmacology: <br>  </h5><br>
          <li class="list-group"><h6>Mechanism of Action</h6>  ${chemData.mechOfAction[0]} </li><br>
          <li class="list-group"><h6>Absorption, Distribution, Excretion</h6> <p>${chemData.absorption[0]} </p></li><br>


        </div>
    `;
  }

  showNew() {}

  showChemAndPhysProperties(data) {
    this.propTable.innerHTML = `
    `;
  }
}
