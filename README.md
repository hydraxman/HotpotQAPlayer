# HotpotQAPlayer

## Publish to Azure

```bash
az login
az acr login --name {acrName}
docker build -t {loginServer}/hotpotviewer:0.x .
docker push {loginServer}/hotpotviewer:0.x
# run below for the first time deployment
# az acr update -n {acrName} --admin-enabled true
az webapp config container set --name {app-name} --resource-group {resourceGoupName} --docker-custom-image-name {acrName}.azurecr.io/hotpotviewer:0.x --docker-registry-server-url https://{acrName}.azurecr.io
```

- [Azure deployment doc](https://docs.microsoft.com/en-us/azure/app-service/tutorial-custom-container?pivots=container-linux)
- [Docker login: token & cli](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-authentication#az-acr-login-with---expose-token)