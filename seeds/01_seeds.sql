
INSERT INTO users (name, email, password)
VALUES ('Daniel Huss', 'daniel.n.huss@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jessica Huss', 'jd_huss@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Kevin Good', 'kgood@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Arminnie Good', 'arminnie@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Mr. Monopoly', 'moneybags$$cashmoney@money.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
cost_per_night, parking_spaces, num_bathrooms, num_bedrooms,
country, street, city, province, postal_code,
active)
VALUES 
(5, 'Moneybag Ranch', 'description', 'https://via.placeholder.com/350', 'https://via.placeholder.com/1350',
50000, 10, 3, 5, 
'Canada', 'RR450', 'Salmon Arm', 'BC', 'B0X 3R2',
'TRUE'),
(1, 'Dan''s place', 'description', 'https://via.placeholder.com/350', 'https://via.placeholder.com/1350',
9900, 1, 1, 1, 
'Canada', '1809 12 Ave', 'Calgary', 'AB', 'T3C 0R7',
'TRUE'),
(3, 'The Good''s', 'description', 'https://via.placeholder.com/350', 'https://via.placeholder.com/1350',
17500, 2, 4, 3, 
'Canada', '7 Charles Ave', 'Red Deer', 'AB', 'T3C 1Y2',
'FALSE');


INSERT INTO reservations (property_id, guest_id, start_date, end_date)
VALUES (1, 3, '2020/12/01', '2020/12/08'),
(2, 5, '2019/01/05', '2019/01/25'),
(1, 2, '2020/06/07', '2020/06/15');

INSERT INTO reviews (property_id, reservation_id, guest_id, message, rating)
VALUES (1, 1, 3, 'message', 5),
(2, 2, 5, 'this place sux not enough gold decor', 0),
(1, 3, 2, 'message', 4);