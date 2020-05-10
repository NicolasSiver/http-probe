module.exports = function (collection, prefix, selector) {
    let length = collection.length;

    return {
        length             : length,
        [prefix]           : length > 0,
        [prefix + 'Once']  : length === 1,
        [prefix + 'Twice'] : length === 2,
        [prefix + 'Thrice']: length === 3,
        first              : selector(collection[0]),
        second             : selector(collection[1]),
        third              : selector(collection[2]),
        last               : selector(collection[collection.length - 1])
    };
};
