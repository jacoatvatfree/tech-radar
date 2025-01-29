export const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length === headers.length) {
          const item = headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
          data.push(item);
        }
      }
      resolve(data);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    reader.readAsText(file);
  });
};
