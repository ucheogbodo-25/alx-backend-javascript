const fs = require('fs');

const countStudents = (dataPath) => {
  if (!fs.existsSync(dataPath)) {
    throw new Error('Cannot load the database');
  }
  if (!fs.statSync(dataPath).isFile()) {
    throw new Error('Cannot load the database');
  }
  const fileLines = fs
    .readFileSync(dataPath, 'utf-8')
    .toString('utf-8')
    .trim()
    .split('\n');
  const studentGroups = {};
  const uniqueStudents = new Set(); // Set to store unique student objects

  const dbFieldNames = fileLines[0].split(',');
  const studentPropNames = dbFieldNames.slice(0, dbFieldNames.length - 1);

  for (const line of fileLines.slice(1)) {
    const studentRecord = line.split(',');
    const studentPropValues = studentRecord.slice(0, studentRecord.length - 1);
    const field = studentRecord[studentRecord.length - 1];
    if (!Object.keys(studentGroups).includes(field)) {
      studentGroups[field] = [];
    }
    const studentEntries = studentPropNames
      .map((propName, idx) => [propName, studentPropValues[idx]]);
    const studentObject = Object.fromEntries(studentEntries);
    studentGroups[field].push(studentObject);
    uniqueStudents.add(JSON.stringify(studentObject)); // Add stringified student object to set
  }

  const totalStudents = uniqueStudents.size; // Count unique students
  console.log(`Number of students: ${totalStudents}`);
  
  for (const [field, group] of Object.entries(studentGroups)) {
    const studentNames = group.map((student) => student.firstname).join(', ');
    console.log(`Number of students in ${field}: ${group.length}. List: ${studentNames}`);
  }
};

module.exports = countStudents;
