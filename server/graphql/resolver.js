const root = {
  getOverview: (args, req) => {
    console.log('args = %o', args);
    //console.log(two);
    //console.log(three);
    return 'Response from graphql';
  }
};

module.exports = root;