class PubChem {
  constructor() {

  }

  //calling URL with fetch; fetching title, charge, etc..
  async getChemical(chemical) {
    const chemicalResponse = await fetch (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/property/Title,IUPACName,Charge,MolecularFormula,MolecularWeight/JSON`);

    const chemical2 = await chemicalResponse.json();

    // return response from website in JSON format
    return {
      chemical2
    }
  }

  //calling URL with fetch; fetching synonyms in "InformationList" array; printing six synonyms
  async getSynonyms(chemical) {
    const synResponse = await fetch (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/synonyms/JSON`);

    const synonyms = await synResponse.json();

    // return response from website in JSON format
    return {
      synonyms
    }

  }

  // fetch descriptions; print first description
  async getDescription(chemicalCID) {
    const descResponse = await fetch (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${chemicalCID}/description/JSON`);

    const description = await descResponse.json();

    // return response from website in JSON format
    return {
      description
    }

  }

  // currently unused method
  async getFullRecord(chemical) {
    const recordResponse = await fetch (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/SDF`)

    const record = await recordResponse;

    // return response from website in JSON format
    return {
      record
    }


  }

  // fetch data on image; utilize URL property in html img tag
  async getImage(chemical) {
    const imageResponse = await fetch (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/PNG`)

    const image = await imageResponse;

    // return response from website in JSON format
    return {
      image
    }


  }
}