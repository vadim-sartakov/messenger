DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "${DIR}/.."
"${DIR}"/test.sh &&\
  heroku container:login &&\
  heroku container:push web &&\
  heroku container:release web