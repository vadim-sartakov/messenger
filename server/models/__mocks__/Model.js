class Model {
  static idCounter = 0;
  constructor(value) {
    Object.assign(this, value);
  }
}

Model.prototype.save = jest.fn(function() {
  return { ...this, _id: Model.idCounter++ };
});
Model.prototype.populate = jest.fn(function() {
  return this;
});
Model.prototype.execPopulate = jest.fn(function() {
  return this;
});
Model.find = jest.fn();
Model.findOne = jest.fn();
Model.findById = jest.fn();

Model.mockReset = () => {
  Model.prototype.save.mockClear();
  Model.prototype.populate.mockClear();
  Model.prototype.execPopulate.mockClear();
  Model.idCounter = 0;
  Model.find.mockReset();
  Model.findOne.mockReset();
  Model.findById.mockReset();
}

module.exports = Model;