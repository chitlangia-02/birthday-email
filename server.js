const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(cors());

// Function to read data from employees.csv
const getBirthdaysFromCSV = () => {
    return new Promise((resolve, reject) => {
        const employees = [];
        fs.createReadStream('employees.csv')
            .pipe(csv())
            .on('data', (row) => {
                // Push each row to the employees array
                employees.push(row);
            })
            .on('end', () => {
                resolve(employees);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Endpoint to get employee birthdays
app.get('/api/birthdays', async (req, res) => {
    try {
        const employees = await getBirthdaysFromCSV();
        res.json(employees);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
