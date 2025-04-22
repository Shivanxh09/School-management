const db = require('../db');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => value * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "School added successfully", id: result.insertId });
  });
};

exports.listSchools = (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  db.query("SELECT * FROM schools", (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const sorted = results.map(school => ({
      ...school,
      distance: calculateDistance(userLat, userLng, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
};
