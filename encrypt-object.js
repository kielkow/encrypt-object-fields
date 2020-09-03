const crypto = require('crypto');
const _ = require('lodash');

async function getEncryptedObject(payload, fields) {
    for (const field of fields) {
        if (!field || field === "" || field === {}) continue;

        if (typeof field === "object") {
            const key = Object.keys(field)[0];
            const props = Object.values(field)[0];

            eval(
                `var encrypt = async function() {
                    try {
                        for (const element of payload.${key}) {
                            const values = Object.keys(element);

                            for (const value of values) {
                                if (props.includes(value) && element[value]) {
                                    const criptoParams = {
                                        algoritm: "aes256",
                                        secret: "encryptobjectfields",
                                    };

                                    const cipher = await crypto.createCipher(criptoParams.algoritm, criptoParams.secret);

                                    let encrypted = cipher.update(element[value], 'utf8', 'hex');

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
            if (!_.get(payload, field)) continue;

            eval(
                `var encrypt = async function() {
                    if (payload.${field}) {
                        try {
                            const criptoParams = {
                                algoritm: "aes256",
                                secret: "encryptobjectfields",
                            };
        
                            const cipher = await crypto.createCipher(criptoParams.algoritm, criptoParams.secret);
        
                            let encrypted = cipher.update(payload.${field}, 'utf8', 'hex');
        
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
    let encryptobject = JSON.parse(JSON.stringify(payload));

    encryptobject = await getEncryptedObject(encryptobject, fields);

    return encryptobject;
}