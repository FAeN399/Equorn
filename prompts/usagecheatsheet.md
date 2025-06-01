# 🔨 Build the image
docker build -t equorn:latest .

# 🚀 Run (stand-alone)
docker run --init -p 3000:3000 --env-file .env equorn

# 🐳 Or, with Postgres & hot-reload dev workflow
docker compose up --build
