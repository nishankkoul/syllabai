#!/bin/sh
# This script is run when the Docker container starts

# Create the env.js file with the runtime environment variable
# This makes the backend URL available to the frontend code in the browser
echo "window.env = { NEXT_PUBLIC_BACKEND_URL: \"$NEXT_PUBLIC_BACKEND_URL\" };" > /app/public/env.js

# Execute the original container command (npm start)
exec npm start 