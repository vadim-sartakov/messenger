class Model {
  static documents = [];
  static idCounter = 0;
  
  constructor() {
    this.id = Model.idCounter++;
  }

  async save() {
    Model.documents = [...Model.documents, this];
  }
}

module.exports = Model;