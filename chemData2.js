function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
} // Source: stackExchange

class ChemProperties {
  constructor() {
    this.recordDescription = "";
    this.description = [];
    this.molecularWeight = "";
    this.form = [];
    this.odor = [];
    this.taste = [];
    this.density = [];
    this.boilPoint = [];
    this.meltPoint = [];
    this.flashPoint = [];
    this.manufacturing = [];
    this.USProduction = [];
    this.impurities = [];
    this.absorption = [""];
    this.mechOfAction = [""];
    this.safetyIconList = [""];
    this.solubility = {
      base: [],
      chemicals: [""],
    };
    this.solubleCSV = "";
    this.vapPressure = [];
    this.BP = "";
    this.VP = "";
    this.D = "";
    this.FP = "";
    this.title = "";
  }

  loadTitle(record) {
    this.title = record.RecordTitle;
  }

  loadAll(sections) {
    sections.forEach((section) => {
      this.sortSection(section);
    });
  }

  sortSection(section) {
    switch (section.TOCHeading) {
      case "Chemical and Physical Properties":
        console.log(section);
        this.loadProp(section.Section);
        break;
      case "Names and Identifiers":
        this.loadNames(section.Section);
        break;
      case "Chemical Safety":
        this.loadSafety(section);
        break;
      case "Use and Manufacturing":
        this.loadManufacturing(section.Section);
        break;
      case "Pharmacology and Biochemistry":
        this.loadPharmacology(section.Section);
        break;
      default:
        break;
    }
  }
  // ------------------------------------------------------------------------------------------------
  loadProp(section) {
    section.forEach((el) => {
      this.sortProp(el);
    });
  }

  sortProp(subSection) {
    switch (subSection.TOCHeading) {
      case "Computed Properties":
        this.loadComputedProp(subSection.Section);
        break;
      case "Experimental Properties":
        this.loadExperimentalProp(subSection.Section);
        break;
      default:
        break;
    }
  }

  loadExperimentalProp(properties) {
    properties.forEach((property) => {
      this.sortExperimentalProp(property);
    });
  }

  async sortExperimentalProp(data) {
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
      default:
        break;
    }
  }
  //-----------------------------------------------------------------------------------------
  loadNames(properties) {
    properties.forEach((property) => {
      this.sortNames(property);
    });
  }

  sortNames(subSection) {
    switch (subSection.TOCHeading) {
      case "Other Identifiers":
        this.loadIdentifiers(subSection.Section);
        break;
    }
  }

  loadIdentifiers(properties) {
    properties.forEach((section) => {
      this.sortIdentifiers(section);
    });
  }

  sortIdentifiers(data) {
    switch (data.TOCHeading) {
      case "CAS":
        this.CAS = this.extractFirst(data.Information);
        break;
    }
  }
  //------------------------------------------------------------------------------------------------------------
  // fill data structure with URLs of all GHS hazard icons associated with a chemical
  loadSafety(safety) {
    console.log(safety);
    this.safetyIconList = this.extractURLs(safety.Information);
  }

  //-------------------------------------------------------------------------------------------------------------
  loadPharmacology(properties) {
    properties.forEach((section) => {
      this.sortPharmacology(section);
    });
  }

  sortPharmacology(data) {
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
        } catch {
          this.absorption = ["not available"];
        }
        break;
    }
  }

  // the description of chemical with Name=="Record Description" is a reliable description
  loadRecordDescription(descriptions) {
    descriptions.forEach((description) => {
      if (description.Name == "Record Description") {
        this.recordDescription += description.Value.StringWithMarkup[0].String;
      }
    });
  }

  loadComputedProp(properties) {
    properties.forEach((property) => {
      this.sortComputedProp(property);
    });
  }

  sortComputedProp(data) {
    switch (data.TOCHeading) {
      case "Molecular Weight":
        this.molecularWeight +=
          data.Information[0].Value.StringWithMarkup[0].String;
        break;
      default:
        break;
    }
  }

  loadManufacturing(section) {
    section.forEach((subsection) => {
      this.sortManufacturing(subsection);
    });
  }

  sortManufacturing(subSection) {
    switch (subSection.TOCHeading) {
      case "Methods of Manufacturing":
        try {
          this.manufacturing = this.extractList(subSection.Information);
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
      default:
        break;
    }
  }

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

  // extract list of URLs for GHS chemical safety icons
  extractURLs(data) {
    let result = [];

    data[0].Value.StringWithMarkup[0].Markup.forEach((element) => {
      try {
        result.push(element.URL);
      } catch (error) {}
    });

    return result;
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

  // extract name from response provided by getChemName from class PubChem
  extractName(data) {
    let result = ``;

    result += `${data.PropertyTable.Properties[0].Title}`;

    return result;
  }

  // data is response from getChemicalNames; return array of chemical names
  extractNames(data) {
    let result = [];
    data.PropertyTable.Properties.forEach((element) => {
      result.push(element.Title);
    });

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
    console.log(this.solubility.chemicals);

    try {
      this.solubility.chemicals[0].forEach((el) => {
        result += `${el}, `;
      });
    } catch {}

    this.solubleCSV = result;
  }

  clear() {
    this.recordDescription = "";
    this.description = [];
    this.molecularWeight = "";
    this.form = [];
    this.odor = [];
    this.taste = [];
    this.density = [];
    this.boilPoint = [];
    this.meltPoint = [];
    this.flashPoint = [];
    this.manufacturing = [];
    this.USProduction = [];
    this.impurities = [];
    this.absorption = [""];
    this.mechOfAction = [""];
    this.solubility = {
      base: [],
      chemicals: [""],
    };
    this.solubleCSV = ``;
    this.vapPressure = [];
    this.BP = "";
    this.VP = "";
    this.D = "";
    this.FP = "";
    this.title = "";
  }
}
