import { parse } from 'json2csv';
import fileDownload from 'react-file-download';

export function generateCSV(arr, fileName) {
    const csvString = parse(arr);
    fileDownload(csvString, fileName);
}
