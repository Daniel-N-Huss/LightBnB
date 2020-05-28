SELECT properties.*, AVG(property_reviews.rating)
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%Vancouver'
GROUP BY properties.id
HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;