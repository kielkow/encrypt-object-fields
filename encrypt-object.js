const crypto = require('crypto');

async function getEncryptedObject(payload, fields) {
    for (const field of fields) {
        if (!field || field === "" || field === {}) continue;

        if (typeof field === "object") {
            const key = Object.keys(field)[0];

            eval(
                `var encrypt = async function() {
                    try {
                        for (const element of payload.${key}) {
                            const values = Object.keys(element);

                            for (const value of values) {
                                if (
                                    Object.values(field)[0].includes(value) && 
                                    element[value] &&
                                    element[value] !== "" &&
                                    element[value] !== {} &&
                                    element[value] !== null &&
                                    element[value] !== undefined
                                ) {
                                    const criptoParams = {
                                        algoritm: "aes256",
                                        secret: "encryptobjectfields",
                                    };

                                    const cipher = await crypto.createCipher(criptoParams.algoritm, criptoParams.secret);

                                    let encrypted = cipher.update(element[value].toString(), 'utf8', 'hex');

                                    encrypted += cipher.final('hex');

                                    element[value] = encrypted;
                                }
                            }
                        }
                    }
                    catch (err) {
                        throw new Error(err.message || err);
                    }
                }`
            );

            await encrypt();
        }
        else {
            eval(
                `var encrypt = async function() {
                    if (
                        payload.${field} && 
                        payload.${field} !== "" && 
                        payload.${field} !== {} &&
                        payload.${field} !== null &&
                        payload.${field} !== undefined
                    ) {
                        try {
                            const criptoParams = {
                                algoritm: "aes256",
                                secret: "encryptobjectfields",
                            };
        
                            const cipher = await crypto.createCipher(criptoParams.algoritm, criptoParams.secret);
        
                            let encrypted = cipher.update(payload.${field}.toString(), 'utf8', 'hex');
        
                            encrypted += cipher.final('hex');
        
                            payload.${field} = encrypted;
                        }
                        catch (err) {
                            throw new Error(err.message || err);
                        }
                    }
                }`
            );

            await encrypt();
        }
    }

    return payload;
};

module.exports = async (payload, fields) => {
    return getEncryptedObject(
        JSON.parse(JSON.stringify(payload)),
        fields
    );
}
