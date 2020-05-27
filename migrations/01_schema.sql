DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;



CREATE TABLE users (
  id        SERIAL PRIMARY KEY  NOT NULL,
  name      VARCHAR(255)        NOT NULL,     
  email     VARCHAR(255)        NOT NULL,
  password  VARCHAR(255)        NOT NULL
);

CREATE TABLE properties (
  id                    SERIAL PRIMARY KEY NOT NULL,
  owner_id              INTEGER REFERENCES users(id)  ON DELETE CASCADE,
  
  title                 VARCHAR(255)  NOT NULL,
  description           VARCHAR(255),
  thumbnail_photo_url   VARCHAR(255)  NOT NULL,
  cover_photo_url       VARCHAR(255)  NOT NULL,
  cost_per_night        INTEGER       NOT NULL DEFAULT 0,
  parking_spaces        SMALLINT      NOT NULL DEFAULT 0,
  num_bathrooms         SMALLINT      NOT NULL DEFAULT 0,
  num_bedrooms          SMALLINT      NOT NULL DEFAULT 0,

  country               VARCHAR(255)  NOT NULL,
  street                VARCHAR(255)  NOT NULL,
  city                  VARCHAR(255)  NOT NULL,
  province              VARCHAR(255)  NOT NULL,
  postal_code           VARCHAR(255)  NOT NULL,
  
  active                BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE TABLE reservations (
  id            SERIAL PRIMARY KEY NOT NULL,
  property_id   INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  guest_id      INTEGER REFERENCES users(id)      ON DELETE CASCADE,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL
);

CREATE TABLE reviews (
  id                SERIAL PRIMARY KEY NOT NULL,
  property_id       INTEGER REFERENCES properties(id)   ON DELETE CASCADE,
  reservation_id    INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
  guest_id          INTEGER REFERENCES users(id)        ON DELETE CASCADE,
  message           VARCHAR(255),
  rating            SMALLINT NOT NULL DEFAULT 0
);