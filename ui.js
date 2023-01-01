class UI {
  constructor() {
    this.profile = document.getElementById("profile");
    this.imageURL = "";
    this.details = document.getElementById("details__profile");

    this.UISelectors = {
      searchInput: "#searchUser",
      description: "#details-d",
      manufacturing: "#details-m",
      uses: "#details-u",
      moa: "#details-moa",
      absorption: "#details-a",
    };

    this.filters = {
      shortPropTable() {
        let tableElements = document.querySelectorAll(".row__element");
        let OG = [];

        let temp1 = Array.from(tableElements);

        // extract strings from node list
        let temp = temp1.map((el) => {
          return el.innerHTML;
        });

        let array = temp.map((el) => {
          if (el.length > 33) {
            OG.push(el);
            return el.slice(0, 28) + "<b class='row__trigger'> [...]</b>";
          } else {
            //use NA as key to ignore the row while maintaining row identity
            OG.push("NA");
            return "NA";
          }
        });

        //edit HTML with shortened string
        for (let i = 0; i < array.length; i++) {
          if (array[i] == "NA") {
            //element does not need to be shortened
          } else {
            //store full text in aria-label attribute; display on hover
            tableElements[i].innerHTML =
              `<span class="replaced" aria-label='${OG[i]}'>` +
              array[i] +
              "</span>";
          }
        }
      },
      shortParagraph() {
        let paragraphElements = document.querySelectorAll(".paragraph-shorten");
        let OG = [];

        let temp1 = Array.from(paragraphElements);

        // extract strings from node list
        let temp = temp1.map((el) => {
          return el.innerHTML;
        });

        let array = temp.map((el) => {
          if (el.length > 453) {
            OG.push(el);
            return el.slice(0, 452) + "<b class='row__trigger'> [...]</b>";
          } else {
            //use NA as key to ignore the row while maintaining row identity
            OG.push("NA");
            return "NA";
          }
        });

        //edit HTML with shortened string
        for (let i = 0; i < array.length; i++) {
          if (array[i] == "NA") {
            //element does not need to be shortened
          } else {
            paragraphElements[i].classList.remove("paragraph-shorten");
            paragraphElements[i].classList.add("paragraph-lengthen");
            //store full text in aria-label attribute; display on hover
            paragraphElements[i].innerHTML =
              `<span class="lengthen" aria-label='${OG[i]}'>` +
              array[i] +
              "</span>";
          }
        }
      },
      shortDescription() {
        let description = document.querySelector(".description");
        let OG = description.innerHTML;

        let temp1 = "";

        if (OG.length > 243) {
          temp1 = OG.slice(0, 242) + "<b class='row__trigger'> [...]</b>";
          description.innerHTML =
            `<span class="lengthen" aria-label='${OG}'>` + temp1 + "</span>";
        } else {
          //use NA as key to ignore the row while maintaining row identity
          OG = "NA";
          return "NA";
        }
      },
    };
  }

  // receive data from fetch; print to webpage
  showProfile(image) {
    this.imageURL = image.url;

    // printing literal string to an html div
    this.profile.innerHTML = `
      <div class="spec-sheet">
          <h4 class=""> ${chemData2.title} (${chemData2.names.CAS})</h4><br>
          <div class="spec-sheet-container">
            <div class="spec-sheet-image">
              <img class="chemicalStructure" src="${this.imageURL}">
              <div class='safety-icons'>
                ${chemData2.safety.safetyIcons}
              </div>
            </div>
            <div class="spec-sheet-text">
            <h6>Chemical and Physical Properties</h4>
            <table class="property-table">
             <tr>
              <td class="row__header">Boiling Point</td>
              <td class="row__element">${chemData2.properties.BP}</td>
            </tr>
            <tr>
              <td class="row__header">Vapor Pressure</td>
              <td class="row__element">${chemData2.properties.VP}</td>
            </tr>
            <tr>
              <td class="row__header">pH</td>
              <td class="row__element">${chemData2.properties.pH}</td>
            </tr>
            <tr>
              <td class="row__header">Density</td>
              <td class="row__element">${chemData2.properties.D}</td>
            </tr>
            <tr>
              <td class="row__header">Molecular Weight</td>
              <td class="row__element">${chemData2.properties.molecularWeight}</td>
            </tr>
            <tr>
              <td class="row__header">Soluble In</td>
              <td class="row__element">${chemData2.properties.solubleCSV}</td>
            </tr>
            <tr>
              <td class="row__header">Flash Point</td>
              <td class="row__element">${chemData2.properties.FP}</td>
            </tr>
            </table>
            <li class="list-group"><h6 id="details-d">Description:</h6><span class='description'>${chemData2.names.recordDescription}</span> </li>
            </div> 
          </div>
          <div class="spec-sheet-container">
            <div class="spec-sheet-image">
              <li class="list-group details-section"><h6 id="details-m">Methods of Manufacture:</h6><span class='paragraph-shorten'> ${chemData2.manufacturing.manufacturing[0]}</span> </li>
            </div>
            <div class="spec-sheet-text">

            <li class="list-group details-section"><h6 id="details-u">Uses:</h6><span class='paragraph-shorten '>${chemData2.manufacturing.uses[0]}</span> </li>
            </div> 
          </div>

          <div class="spec-sheet-container">
            <div class="spec-sheet-image">
              <li class="list-group details-section" id="details-moa"><h6>Mechanism of Action</h6><span class='paragraph-shorten'>  ${chemData2.pharmacology.mechOfAction[0]} </span> </li>
            </div>
            <div class="spec-sheet-text">

              <li class="list-group details-section"><h6 id="details-a">Absorption, Distribution, Excretion</h6><span class="paragraph-shorten">${chemData2.pharmacology.absorption[0]}</span></li>
            </div> 
          </div>



        </div>
    `;
  }

  // get details__profile by id
  createDetails() {
    this.details = document.getElementById("details__profile");
    this.heading = document.getElementById("details__heading");
  }

  showDetails(details) {
    this.details.innerHTML = details;
  }

  clearDetails() {
    this.details.innerHTML = "";
  }

  getSelectors() {
    return this.UISelectors;
  }
}
