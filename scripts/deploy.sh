git checkout -b build
DIR="$( cd "$( dirname "$0" )" && pwd )"
"${DIR}/test.sh"
"${DIR}/build.sh"
cd "${DIR}/.."
git add --all
git commit -m "Update build"
git subtree push --prefix server heroku master
git checkout master
git branch -D build