DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "${DIR}/.."
"${DIR}"/test.sh &&\
  heroku container:login &&\
  heroku container:push web --app vs-messenger-staging &&\
  heroku container:release web --app vs-messenger-staging