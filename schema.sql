
DROP TABLE IF EXISTS favMovies;

CREATE TABLE IF NOT EXISTS favMovies (
   id SERIAL PRIMARY KEY,
   title VARCHAR(300),
   overview  VARCHAR(700),
   poster_path  VARCHAR(700),
   note  VARCHAR(700)
); 