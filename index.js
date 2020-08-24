const crypto = require('crypto');

module.exports = async (obj, arrayOfFields) => {
    for (const field of arrayOfFields) {
        const props = field.split(".");

        let finalProp = "obj";

        for (const prop of props) {
            if (prop.includes('[') && prop.includes(']')) {
                const splitPositionArray = prop.split("[");

                finalProp = finalProp.concat(`['${splitPositionArray[0]}']`);
                finalProp = finalProp.concat(`['${splitPositionArray[1].replace("]", "")}']`);
            } 
            else {
                finalProp = finalProp.concat(`['${prop}']`);
            }
        }

        eval(
            `var fn = async function() {
                try {
                    const criptoParams = {
                        "algoritm": "aes256",
                        "secret": "encryptobjectfields",
                    };

                    const cipher = await crypto.createCipher(criptoParams.algoritm ,criptoParams.secret);

                    let encrypted = cipher.update(${finalProp}, 'utf8', 'hex');

                    encrypted += cipher.final('hex');

                    ${finalProp} = encrypted;
                }
                catch (err) {
                    throw new Error(err.message || err);
                }
            }`
        );

        await fn();
    }

    return obj;
};