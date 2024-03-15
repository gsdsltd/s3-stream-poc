import crypto from "@aws-crypto/client-node";


const generatorKeyId =
// "arn:aws:kms:eu-west-2:137428472897:key/e79a115e-ed0a-41fe-b4b0-d84516882862";
    "arn:aws:kms:eu-west-2:412902867581:key/4f3d4185-339a-465a-9c66-17929cba10fc";


const config = () => {
    return new crypto.KmsKeyringNode({ generatorKeyId });
}

const encryptionStream = (keyring) => {
    return crypto.buildClient().encryptStream(keyring, {
        suiteId: crypto.AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16_HKDF_SHA512_COMMIT_KEY,
    });
}


export default  {
    encryptionStream,
    config
}