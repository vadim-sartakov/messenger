const Model = jest.fn(function Model(value) {
  Object.assign(this, value);
});

Model.idCounter = 0;

Model.prototype.save = jest.fn(function() {
  this._id = Model.idCounter++;
  return this;
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