until $(curl --output /dev/null --silent --head localhost:4200); do
    sleep 5
done
