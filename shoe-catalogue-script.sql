drop table if exists shoes, shopping_basket, shopping_basket_item;

CREATE TABLE shoes
(
  id serial not null primary key,
  color VARCHAR not null,
  brand VARCHAR not null,
  price DECIMAL(10, 2) not null,
  size SMALLINT not null,
  in_stock SMALLINT not null
);

CREATE TABLE shopping_basket
(
  id serial not null primary key,
  basket_status VARCHAR,
  date_created date not null default now(),
  date_checked_out date,
  total DECIMAL(10, 2) default 0.00
);

CREATE TABLE shopping_basket_item
(
  id serial not null primary key,
  basket_id INTEGER not null,
  shoe_id int not null,
  shoe_price DECIMAL(10, 2) not null,
  total_price DECIMAL(10, 2) not null,
  qty SMALLINT DEFAULT 1,
  FOREIGN KEY (shoe_id) REFERENCES shoes(id),
  FOREIGN KEY (basket_id) REFERENCES shopping_basket(id)
);

INSERT INTO shoes
  (color, brand, price, size, in_stock)
VALUES
  ('brown', 'Tommy Helfiger', 860, 8, 9);

INSERT INTO shoes
  (color, brand, price, size, in_stock)
VALUES
  ('maroon', 'Lacoste', 860, 8, 9);

INSERT INTO shoes
  (color, brand, price, size, in_stock)
VALUES
  ('brown', 'Tommy Helfiger', 860, 5, 9);

INSERT INTO shoes
  (color, brand, price, size, in_stock)
VALUES
  ('maroon', 'Lacoste', 860, 7, 9);

