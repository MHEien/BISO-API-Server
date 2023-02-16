const db = require('./conn.js');
const getDepartments = require('../twentyfour/getDepartments.js');
const getDepartmentsFromDB = require('./departmentsFromDB.js');



//Opprette nye avdelinger i databasen. Hentes selvsagt fra 24SevenOffice
const compareDepartments = async () => {
    const departmentsFromDB = await getDepartmentsFromDB();
    const departmentsFrom24SO = await getDepartments();



    const campusNo = {
      "Oslo": 1,
      "Bergen": 2,
      "Trondheim": 3,
      "Stavanger": 4,
      "National": 5
    };



    const newDepartments = departmentsFrom24SO.filter(department => {
      return !departmentsFromDB.some(departmentFromDB => departmentFromDB.Id === department.Id);
    });
    newDepartments.forEach(department => {
      db.query(`INSERT INTO departments SET Id = '${department.Id}', Name = '${department.Name}', Campus = '${department.Campus}', CampusNo = '${campusNo[department.Campus]}'`, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result);
        });
    });
    };

module.exports = compareDepartments;