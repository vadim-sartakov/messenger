DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "${DIR}/.."
heroku container:login
heroku container:push web
heroku container:release web