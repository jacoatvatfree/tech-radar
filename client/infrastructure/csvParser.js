export const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csv = event.target.result;
      const data = [];

      // Parse headers
      let pos = 0;
      let headers = parseCSVLine(csv);
      pos = headers.nextPos;

      // Parse data rows
      while (pos < csv.length) {
        const { fields, nextPos } = parseCSVLine(csv, pos);
        pos = nextPos;

        // Skip empty lines
        if (fields.length === 1 && fields[0] === "") continue;

        if (fields.length === headers.fields.length) {
          const item = headers.fields.reduce((obj, header, index) => {
            // Remove any surrounding quotes and unescape double quotes
            obj[header] = fields[index]
              .replace(/^"(.*)"$/, "$1")
              .replace(/""/g, '"');
            return obj;
          }, {});
          data.push(item);
        }
      }
      resolve(data);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };

    reader.readAsText(file);
  });
};

function parseCSVLine(csv, startPos = 0) {
  const fields = [];
  let pos = startPos;
  let field = "";
  let inQuotes = false;

  while (pos < csv.length) {
    const char = csv[pos];

    // Handle end of line
    if (char === "\n" && !inQuotes) {
      fields.push(field.trim());
      pos++;
      break;
    }
    // Handle carriage return (Windows line endings)
    if (char === "\r" && !inQuotes) {
      fields.push(field.trim());
      pos += 2; // Skip \r\n
      break;
    }
    // Handle quotes
    if (char === '"') {
      if (!inQuotes) {
        inQuotes = true;
      } else {
        // Check for escaped quotes
        if (pos + 1 < csv.length && csv[pos + 1] === '"') {
          field += '"';
          pos++;
        } else {
          inQuotes = false;
        }
      }
    }
    // Handle commas
    else if (char === "," && !inQuotes) {
      fields.push(field.trim());
      field = "";
    }
    // Add character to current field
    else {
      field += char;
    }
    pos++;
  }

  // Add the last field if we haven't already
  if (field || fields.length > 0) {
    fields.push(field.trim());
  }

  return { fields, nextPos: pos };
}
