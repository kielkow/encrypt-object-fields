const crypto = require('crypto');

module.exports = async (obj, arrayOfFields) => {
    for (const field of arrayOfFields) {
        const props = field.split(".");
        
        let finalProp = "obj";

        for (const prop of props) {
            finalProp = finalProp.concat(`['${prop}']`);
        }

        eval(
            `var fn = async function() { 
                const criptoParams = {
                    "algoritm": "aes256",
                    "secret": "samsungsds",
                };

                const cipher = await crypto.createCipher(criptoParams.algoritm ,criptoParams.secret);

                let encrypted = cipher.update(${finalProp}, 'utf8', 'hex');

                encrypted += cipher.final('hex');

                ${finalProp} = encrypted;
            }`
        );

        await fn();
    }

    return obj;
};
