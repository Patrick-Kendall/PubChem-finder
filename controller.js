class Controller {
  constructor() {}

  loadEventListeners() {
    const UISelectors = ui.getSelectors();

    // handle chemical search
    document
      .querySelector(UISelectors.searchInput)
      .addEventListener("keypress", this.chemicalSearchSubmit.bind(this));
  }

  createClickEventDetailedInformation() {
    const UISelectors = ui.getSelectors();

    // handle click on description
    document
      .querySelector(UISelectors.description)
      .addEventListener("click", this.detailedInfoClick);

    // handle click on manufacturing
    document
      .querySelector(UISelectors.manufacturing)
      .addEventListener("click", this.detailedInfoClick);

    // handle click on uses
    document
      .querySelector(UISelectors.uses)
      .addEventListener("click", this.detailedInfoClick);

    // handle click on moa
    document
      .querySelector(UISelectors.moa)
      .addEventListener("click", this.detailedInfoClick);

    // handle click on absorption
    document
      .querySelector(UISelectors.absorption)
      .addEventListener("click", this.detailedInfoClick);
  }

  detailedInfoClick(e) {
    //window.open("details.html", "_parent"); //open new page
    let temp = ""; //variable to store HTML

    const code = e.target.id;

    switch (code) {
      case "details-d":
        break;
      case "details-m":
        temp += chemData2.manufacturing.genDetails(
          chemData2.manufacturing.manufacturing,
          "Manufacturing"
        );
        ui.showDetails(temp);
        ui.filters.shortParagraph();
        break;
      case "details-u":
        temp += chemData2.manufacturing.genDetails(
          chemData2.manufacturing.uses,
          "Use"
        );
        ui.showDetails(temp);
        ui.filters.shortParagraph();
        break;
      case "details-moa":
        break;
      case "details-a":
        temp += chemData2.pharmacology.genDetails(
          chemData2.pharmacology.absorption,
          "Absorption"
        );
        ui.showDetails(temp);
        ui.filters.shortParagraph();
        break;
      default:
        break;
    }
  }

  async chemicalSearchSubmit(e) {
    // Get input text
    const userText = e.target.value;

    const key = e.code;

    // check if input is empty
    if (key == "Enter") {
      chemData2.clear();

      // GET FULL RECORD FROM PUBVIEW
      // get CID from pubchem rest (APIConnect)
      await APIConnect.getCID(userText).then((CID) => {
        // get neighbors [experimental functionality] AND full record from PubView
        pubViewConnect.getNeighbors(CID.CID);
        pubViewConnect.getFullRecord(CID.CID).then(async (data) => {
          console.log(data.chemical2);
          ui.clearDetails();
          chemData2.loadTitle(data.chemical2.Record);
          chemData2.loadAll(data.chemical2.Record.Section);

          await sleep(300);
          // get image; another fetch
          APIConnect.getImage(userText).then((image2) => {
            // show profile with fetched data
            ui.showProfile(image2.image);
            // filters on HTML; prettify
            ui.filters.shortPropTable();
            ui.filters.shortParagraph();

            this.createClickEventDetailedInformation();
          });
        });
      });
    }
  }
}
