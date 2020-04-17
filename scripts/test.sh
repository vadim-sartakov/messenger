DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "${DIR}/../web" && npm run test && cd ../server && npm run test