const crypto = require('crypto');

async function getDecryptedObject(payload, fields) {
    for (const field of fields) {
        if (!field || field === "" || field === {}) continue;

        if (typeof field === "object") {
            const key = Object.keys(field)[0];
            const props = Object.values(field)[0];

            eval(
                `var decrypt = async function() {
                    try {
                        for (const element of payload.${key}) {
                            const values = Object.keys(element);

                            for (const value of values) {
                                if (props.includes(value) && element[value]) {
                                    const criptoParams = {
                                        algoritm: "aes256",
                                        secret: "encryptobjectfields",
                                    };

                                    const decipher = await crypto.createDecipher(criptoParams.algoritm, criptoParams.secret);

                                    let decrypted = decipher.update(element[value].toString(), 'hex', 'utf8');
                
                                    decrypted += decipher.final('utf8');

                                    element[value] = decrypted;
                                }
                            }
                        }
                    }
                    catch (err) {
                        throw new Error(err.message || err);
                    }
                }`
            );

            await decrypt();
        }
        else {
            eval(
                `var decrypt = async function() {
                    if (payload.${field}) {
                        try {
                            const criptoParams = {
                                algoritm: "aes256",
                                secret: "encryptobjectfields",
                            };
        
                            const decipher = await crypto.createDecipher(criptoParams.algoritm, criptoParams.secret);

                            let decrypted = decipher.update(payload.${field}.toString(), 'hex', 'utf8');
        
                            decrypted += decipher.final('utf8');
        
                            payload.${field} = decrypted;
                        }
                        catch (err) {
                            throw new Error(err.message || err);
                        }
                    }
                }`
            );
    
            await decrypt();
        }
    }

    return payload;
};

module.exports = async (payload, fields) => {
    return getDecryptedObject(
        JSON.parse(JSON.stringify(payload)), 
        fields
    );
}
