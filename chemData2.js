function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
} // Source: stackExchange

class DataStruct {
  constructor() {
    this.title = "";
    this.properties = new Properties();
    this.manufacturing = new Manufacturing();
    this.names = new Names();
    this.pharmacology = new Pharmacology();
    this.safety = new Safety();
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
        this.properties.load(section.Section);
        break;
      case "Names and Identifiers":
        this.names.load(section.Section);
        break;
      case "Chemical Safety":
        this.safety.loadSafety(section);
        this.safety.createSafetyIcons();
        break;
      case "Use and Manufacturing":
        this.manufacturing.load(section.Section);
        break;
      case "Pharmacology and Biochemistry":
        this.pharmacology.load(section.Section);
        break;
      default:
        break;
    }
  }

  clear() {
    this.title = "";
    this.names.clear();
    this.properties.clear();
    this.manufacturing.clear();
    this.pharmacology.clear();
    this.safety.clear();
  }
}
