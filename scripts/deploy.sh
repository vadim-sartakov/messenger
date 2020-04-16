DIR="$( cd "$( dirname "$0" )" && pwd )"
"${DIR}/test.sh"
"${DIR}/build.sh"
git subtree push --prefix server heroku master