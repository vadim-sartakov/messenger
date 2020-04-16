DIR="$( cd "$( dirname "$0" )" && pwd )"
"${DIR}/test.sh"
"${DIR}/build.sh"
cd "${DIR}/.."
git subtree push --prefix server heroku master