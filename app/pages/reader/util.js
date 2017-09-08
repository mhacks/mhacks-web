import csv from 'json2csv';
import fileDownload from 'react-file-download';

export function generateCSV(arr, fileName) {
    csv({ data: arr }, function(err, csvString) {
        fileDownload(csvString, fileName);
    });
}
