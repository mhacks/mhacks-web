export function generateCSV(arr) {
    if (arr.length === 0) {
        return;
    }
    const keys = Object.keys(arr[0]);
    const meta = 'data:text/csv;charset=utf-8,';
    const keyList = keys.join(',') + '\n';
    const data = arr
        .map(obj => {
            return keys.map(key => obj[key]).join(',');
        })
        .join('\n');
    window.open(encodeURI(meta + keyList + data));
}
