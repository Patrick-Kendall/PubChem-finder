class PubView {
  constructor() {
    this.baseEndpoint = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view";
  }

  async getFullRecord(CID) {
    const chemicalResponse = await fetch(
      `${this.baseEndpoint}/data/compound/${CID}/JSON`
    );

    const chemical2 = await chemicalResponse.json();

    return {
      chemical2,
    };
  }

  async getExpProperties(CID) {
    const chemicalResponse = await fetch(
      `${this.baseEndpoint}/data/compound/${CID}/JSON?heading=Experimental+Properties`
    );

    const chemical2 = await chemicalResponse.json();

    return {
      chemical2,
    };
  }

  async getNeighbors(CID) {
    const chemicalResponse = await fetch(
      `${this.baseEndpoint}/neighbors/compound/${CID}/JSON`
    );

    const chemical2 = await chemicalResponse.json();

    console.log(chemical2);

    return {
      chemical2,
    };
  }
}
