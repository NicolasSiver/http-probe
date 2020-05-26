module.exports.isJsonCollection = entity => {
    let result, value;

    try {
        value = JSON.parse(entity);
        result = Array.isArray(value) || (typeof value === 'object' && value !== null);
    } catch (error) {
        result = false;
    }

    return result;
};
