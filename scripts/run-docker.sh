#Build docker container for testing purposes

DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "${DIR}/.."
docker container stop messenger
docker container rm messenger
docker build -t messenger .
docker run --name messenger -d -p 8080:8080\
  --env JWT_SECRET=123456\
  --env MONGODB_URI=mongodb://host.docker.internal/messenger\
  --env DEBUG=app:*,db:*,cleanup:*\
  messenger:latest