module.exports = function adjust(arr) {
    function compare(str1, str2) {
        let len1 = str1.length,
            len2 = str2.length;
        for (let i = 0; i < len1 && i < len2; i++) {
            if (str1[i] === ':' || str1[i] === '*') {
                return -1;
            }
            if (str2[i] === ':' || str2[i] === '*') {
                return 1;
            }
            if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
                return str1.charCodeAt(i) - str2.charCodeAt(i);
            }
        }
        return len1 - len2;
    }
    arr.sort(function (a, b) {
        if (a.type === 'use' || b.type === 'use') {
            if (a.type === b.type) {
                return compare(a.path, b.path);
            } else {
                return a.type === 'use' ? -1 : 1;
            }
        }
        return compare(a.path, b.path);
    });
    return arr;
};
