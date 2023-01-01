class Section {
  constructor() {}

  load(section) {
    section.forEach((el) => {
      this.sort(el);
    });
  }

  // when using loadAny(), one needs to add .bind() to reference this
  loadAny(section, userFunction) {
    for (let i = 0; i < section.length; i++) {
      userFunction(section[i]);
    }
  }

  sort(el) {
    return;
  }

  // ------HTML METHODS--------------
  genDetails(stringArray, title) {
    if (!stringArray) {
      console.log("empty stringArray");
      return;
    }

    let temp = "<div class='spec-sheet'>";
    let index = 0;

    for (index = 0; index < stringArray.length; index = index + 2) {
      if (index <= stringArray.length - 2) {
        temp += `
        <div class="spec-sheet-container">
        <div class="spec-sheet-text">
          <li class="list-group"><h6>${title} ${index}:</h6><span class='paragraph-shorten'> ${
          stringArray[index]
        }</span> </li>
        </div>
        <div class="spec-sheet-text">
  
        <li class="list-group"><h6>${title} ${
          index + 1
        }:</h6><span class='paragraph-shorten '>${
          stringArray[index + 1]
        }</span> </li>
        </div> 
      </div>`;
      } else {
        temp += `
        <div class="spec-sheet-container">
        <div class="spec-sheet-text">
          <li class="list-group"><h6>${title} ${index}:</h6><span class='paragraph-shorten'> ${stringArray[index]}</span> </li>
        </div>
        <div class="spec-sheet-text">
        </div> 
      </div>`;
      }
    }

    temp += "</div>";

    return temp;
  }

  // ------UTILITY METHODS--------------

  // return array of the values stored for any chemical property
  extractList(data) {
    let result = [];

    data.forEach((element) => {
      try {
        result.push(element.Value.StringWithMarkup[0].String);
      } catch (error) {}
    });

    return result;
  }

  // extract first string from an information array
  extractFirst(data) {
    let result = data[0].Value.StringWithMarkup[0].String;
    return result;
  }
}

// Chemical and Physical Properties
class Properties extends Section {
  constructor() {
    super();
    this.molecularWeight = "";
    this.form = [];
    this.odor = [];
    this.taste = [];
    this.density = [];
    this.boilPoint = [];
    this.meltPoint = [];
    this.flashPoint = [];
    this.solubility = {
      base: [],
      chemicals: [""],
    };
    this.solubleCSV = "";
    this.vapPressure = [];
    this.BP = "";
    this.VP = "";
    this.pH = "";
    this.D = "";
    this.FP = "";
    this.title = "";
  }

  sort(subSection) {
    switch (subSection.TOCHeading) {
      case "Computed Properties":
        this.loadAny(subSection.Section, this.sortComputed.bind(this));
        break;
      case "Experimental Properties":
        this.loadAny(subSection.Section, this.sortExperimental.bind(this));
        break;
      default:
        break;
    }
  }

  clear() {
    this.molecularWeight = "";
    this.form = [];
    this.odor = [];
    this.taste = [];
    this.density = [];
    this.boilPoint = [];
    this.meltPoint = [];
    this.flashPoint = [];
    this.solubility = {
      base: [],
      chemicals: [""],
    };
    this.solubleCSV = "";
    this.vapPressure = [];
    this.BP = "";
    this.VP = "";
    this.pH = "";
    this.D = "";
    this.FP = "";
    this.title = "";
  }

  // ------SECTION SPECIFIC SORTING---------

  sortComputed(data) {
    switch (data.TOCHeading) {
      case "Molecular Weight":
        this.molecularWeight = this.extractFirst(data.Information);
        break;
      default:
        break;
    }
  }

  async sortExperimental(data) {
    switch (data.TOCHeading) {
      case "Boiling Point":
        this.boilPoint = this.extractList(data.Information);
        this.BP = this.extractPeerReviewed(data.Information);
        break;
      case "Melting Point":
        this.meltPoint = this.extractList(data.Information);
        break;
      case "Flash Point":
        this.flashPoint = this.extractList(data.Information);
        this.FP = this.extractPeerReviewed(data.Information);
        break;
      case "Solubility":
        this.solubility.base = this.extractList(data.Information);
        await this.getSolvents(data.Information);
        break;
      case "Density":
        this.density = this.extractList(data.Information);
        this.D = this.extractPeerReviewed(data.Information);
        break;
      case "Physical Description":
        this.description = this.extractList(data.Information);
        break;
      case "Vapor Pressure":
        this.vapPressure = this.extractList(data.Information);
        this.VP = this.extractPeerReviewed(data.Information);
        break;
      case "pH":
        this.pH = this.extractPeerReviewed(data.Information);
        break;
      default:
        break;
    }
  }

  // ------UTILITY METHODS--------------

  extractPeerReviewed(data) {
    let result = "";

    data.forEach((el) => {
      try {
        if (el.Description == "PEER REVIEWED" && result == "") {
          result += `${el.Value.StringWithMarkup[0].String}`;
        }
      } catch (err) {}
    });

    return result;
  }

  // data is response from getChemicalNames; return array of chemical names
  extractNames(data) {
    let result = [];

    try {
      data.PropertyTable.Properties.forEach((element) => {
        result.push(element.Title);
      });
    } catch (error) {}

    return [result];
  }

  // array of CIDs from response -> remove "CID-" -> assemble in csv list
  assembleCIDs(data) {
    let temp = [];

    data[0].forEach((element) => {
      temp.push(element.replace("CID-", ""));
    });

    let result = ``;

    for (let i = 0; i < temp.length; i++) {
      if (i == temp.length - 1) {
        result += temp[i];
      } else {
        result += temp[i] + ",";
      }
    }

    return result;
  }

  // get CIDs of chemical in which search is soluble -> assemble CIDS in format to send to pubChem -> get names of the solvents
  async getSolvents(data) {
    let temp = this.extractSolubilityCIDs(data);
    let CIDs = this.assembleCIDs(temp);

    let api = new PubChem();

    api.getChemName(CIDs).then((response) => {
      this.solubility.chemicals = this.extractNames(response.chemical2);
    });
  }

  assembleSolvents() {
    let result = ``;

    try {
      this.solubility.chemicals[0].forEach((el) => {
        result += `${el}, `;
      });
    } catch {}

    this.solubleCSV = result;
  }

  extractSolubilityCIDs(data) {
    let result = [];

    data.forEach((element) => {
      try {
        element.Value.StringWithMarkup[0].Markup.forEach((chemical) => {
          if (!chemical.Extra) {
          } else {
            result.push(chemical.Extra);
          }
        });
      } catch (error) {}
    });

    result = result.filter(onlyUnique);

    return [result];
  }
}

class Manufacturing extends Section {
  constructor() {
    super();
    this.manufacturing = [];
    this.USProduction = [];
    this.impurities = [];
    this.uses = [];
  }

  sort(subSection) {
    switch (subSection.TOCHeading) {
      case "Methods of Manufacturing":
        try {
          this.manufacturing = this.extractList(subSection.Information);
          console.log(this);
        } catch {}
        break;
      case "Impurities":
        try {
          this.impurities = this.extractList(subSection.Information);
        } catch {}
        break;
      case "U.S. Production":
        try {
          this.USProduction = this.extractList(subSection.Information);
        } catch {}
        break;
      case "Uses":
        try {
          this.uses = this.extractList(subSection.Information);
        } catch {}
      default:
        break;
    }
  }

  clear() {
    this.manufacturing = [];
    this.USProduction = [];
    this.impurities = [];
    this.uses = [];
  }

  // ------SECTION SPECIFIC SORTING---------

  // ------UTILITY METHODS--------------
}

class Names extends Section {
  constructor() {
    super();
    this.CAS = "";
    this.recordDescription = "";
  }

  sort(subSection) {
    switch (subSection.TOCHeading) {
      case "Other Identifiers":
        this.loadAny(subSection.Section, this.sortIdentifiers.bind(this));
        break;
      case "Record Description":
        this.loadAny(subSection.Information, this.sortDescriptions.bind(this));
        break;
      default:
        break;
    }
  }

  clear() {
    this.CAS = "";
    this.recordDescription = "";
  }

  // ------SECTION SPECIFIC SORTING---------
  sortIdentifiers(data) {
    switch (data.TOCHeading) {
      case "CAS":
        try {
          this.CAS = this.extractFirst(data.Information);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  }

  sortDescriptions(data) {
    switch (data.Name) {
      case "Record Description":
        try {
          this.recordDescription = data.Value.StringWithMarkup[0].String;
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  }

  // ------UTILITY METHODS--------------
}

class Pharmacology extends Section {
  constructor() {
    super();
    this.absorption = [""];
    this.mechOfAction = [""];
  }

  sort(data) {
    switch (data.TOCHeading) {
      case "Mechanism of Action":
        try {
          this.mechOfAction = this.extractList(data.Information);
        } catch {
          this.mechOfAction = ["not available"];
        }
        break;
      case "Absorption, Distribution and Excretion":
        try {
          this.absorption = this.extractList(data.Information);
          console.log(this);
        } catch {
          this.absorption = ["not available"];
        }
        break;
    }
  }

  clear() {
    this.absorption = [""];
    this.mechOfAction = [""];
  }

  // ------SECTION SPECIFIC SORTING---------

  // ------UTILITY METHODS--------------
}

class Safety {
  constructor() {
    this.safetyIconList = [""];
    this.safetyIcons = "";
  }

  loadSafety(safety) {
    this.safetyIconList = this.extractURLs(safety.Information);
  }

  createSafetyIcons() {
    let result = ``;
    this.safetyIconList.forEach((icon) => {
      result += `<img src='${icon}' height="75">`;
    });

    this.safetyIcons = result;
  }

  extractURLs(data) {
    let result = [];

    try {
      data[0].Value.StringWithMarkup[0].Markup.forEach((element) => {
        try {
          result.push(element.URL);
        } catch (error) {}
      });
    } catch (error) {}

    return result;
  }

  clear() {
    this.safetyIconList = [""];
    this.safetyIcons = "";
  }
}

class Blank extends Section {
  constructor() {
    super();
  }

  sort(subSection) {}

  // ------SECTION SPECIFIC SORTING---------

  // ------UTILITY METHODS--------------
}
