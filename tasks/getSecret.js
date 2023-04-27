const vaultSecrets = JSON.parse(process.env.VAULT_SECRETS);

const args = process.argv.slice(2);
const secretId = args[0];

const credential = vaultSecrets.data.credentialManagement["secretText"].find(
  (credential) => credential.id === secretId
);

console.log(credential["secret"]);
