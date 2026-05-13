const db = require('../db');

const calculateDistance = require('../utils/distanceCalculator');

//add school
exports.addSchool = (req,res)=>{
    const {name, address, latitude, longitude} = req.body;

    if(!name || !address || !latitude || !longitude){
        return res.status(400).json({error: 'All fields are required'});
    }

    if(isNaN(latitude) || isNaN(longitude)){
        return res.status(400).json({error: 'Latitude and Longitude must be numbers'});
    }

    const sql = `
        INSERT INTO schools(name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, address, latitude, longitude], (error, results) => {
        if(error){
            return res.status(500).json({error: 'Error adding school'});
        }
        res.status(201).json({message: 'School added successfully', school: {...req.body, id: results.insertId}});
    });

};

//list schools
exports.listSchools = (req,res)=>{
    const userLat  = parseFloat(req.query.latitude);
    const userLon  = parseFloat(req.query.longitude);

    if(isNaN(userLat) || isNaN(userLon)){
        return res.status(400).json({error: 'Latitude and Longitude query parameters are required and must be numbers'});
    }

    const sql = `SELECT * FROM schools`;

    db.query(sql, (error, results) => {
        if(error){
            return res.status(500).json({error: 'Error fetching schools'});
        }

        const sortedSchools = results.map((school)=>{
            const distance = calculateDistance(userLat, userLon, school.latitude,school.longitude);
            return {
                ...school,
                distance: distance.toFixed(2)+ " km"
            };
        }).sort((a,b)=>{
            return parseFloat(a.distance) - parseFloat(b.distance);
        });

        return res.status(200).json(sortedSchools);
    });
        
};