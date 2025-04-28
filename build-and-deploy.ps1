# 1. Run 'pnpm build' command
Set-Location -Path "D:\Projects\Omnicx-New\Microservices20\n8n-nodes-bettercommerce"
pnpm build

# 2. Copy files from the 'dist' folder to the target location
$sourcePath = "D:\Projects\Omnicx-New\Microservices20\n8n-nodes-bettercommerce\dist"
$destinationPath = "D:\Projects\Omnicx-New\Microservices20\n8n-custom\n8n-nodes-betterccommerce"
Copy-Item -Path "$sourcePath\*" -Destination $destinationPath -Recurse -Force

# 3. Restart the Docker container (replace <container_id> with the actual container ID)
$containerId = "63dadf044ce7"
docker restart $containerId
