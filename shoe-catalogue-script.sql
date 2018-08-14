drop table if exists shoes, shopping_basket, shopping_basket_item;

CREATE TABLE shoes
(
  id serial not null primary key,
  color VARCHAR not null,
  brand VARCHAR not null,
  price DECIMAL(7, 2) not null,
  size SMALLINT not null,
  in_stock SMALLINT not null
)

CREATE TABLE shopping_basket
(
  id serial not null primary key,
  basket_status VARCHAR,
  date_created DATE DEFAULT GETDATE(),
  date_checked_out DATE,
  total INTEGER
)

CREATE TABLE shopping_basket_item
(
  id serial not null primary key,
  basket_id INTEGER not null,
  shoe_id int not null,
  price DECIMAL(7, 2) not null,
  qty SMALLINT DEFAULT 1,
  FOREIGN KEY (shoe_id) REFERENCES shoes(id),
  FOREIGN KEY (basket_id) REFERENCES shopping_basket(id)
)


