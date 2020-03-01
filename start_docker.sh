docker stop imagescaler
docker rm imagescaler
docker build -t imagescaler .
docker run -d --name imagescaler -p 8300:3000 -v /tank/photos:/data/tank/photos:ro imagescaler