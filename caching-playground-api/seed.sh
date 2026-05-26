#!/bin/bash

docker exec -i test-postgres psql -U test_user -d test_db <<'SQL'

DROP TABLE IF EXISTS businesses;

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  rating NUMERIC,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO businesses (name, city, type, description, rating, lat, lng, updated_at)
SELECT
  'Business ' || i,
  (ARRAY['Nablus', 'Ramallah', 'Hebron', 'Jenin'])[floor(random() * 4 + 1)],
  (ARRAY['restaurant', 'pharmacy', 'cafe', 'gym', 'supermarket'])[floor(random() * 5 + 1)],
  'Fake business description ' || i,
  round((random() * 5)::numeric, 1),
  31 + random() * 2,
  35 + random(),
  NOW()
FROM generate_series(1, 500) AS i;

CREATE INDEX idx_businesses_city_type ON businesses(city, type);
CREATE INDEX idx_businesses_type ON businesses(type);

SELECT COUNT(*) FROM businesses;

SQL