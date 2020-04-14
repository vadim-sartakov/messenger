function getShortName(name) {
  const parts = name.split(' ');
  const string = parts.length > 1 ?
    parts[0].charAt(0) + parts[1].charAt(0) :
    name.substring(0, 2);
  return string.toUpperCase();
}

module.exports = getShortName;