const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("GET /api/shoes", function() {
  it("shoeld respond with json", function(done) {
    request(baseURL)
      .get("/api/shoes")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /api/shoes/brand/:brandname", function() {
  it("shoeld respond with json", function(done) {
    request(baseURL)
      .get(`/api/shoes/brand/Lacoste`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /api/shoes/size/:size", function() {
  it("shoeld respond with json", function(done) {
    request(baseURL)
      .get("/api/shoes/size/8")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /api/shoes/brand/:brandname/size/:size", function() {
  it("shoeld respond with json", function(done) {
    request(baseURL)
      .get("/api/shoes/brand/:Lacoste/size/8")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("POST /api/shoes/sold/:id", function() {
  it("shoeld respond with json", function(done) {
    request(baseURL)
      .post(`/api/shoes/sold/2`)
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) {
          console.log("Oh no! error");
          return done(err);
        } else {
          console.log("yay got " + JSON.stringify(res.body));
        }
        done();
      });
  });
});

describe("POST /api/shoes/", function() {
  let shoe = {
    color: "brown",
    brand: "Tommy Helfiger",
    price: "860.00",
    size: 8,
    in_stock: 9
  };

  it("shoeld respond with json", function(done) {
    request(baseURL)
      .post("/api/shoes/")
      .send(shoe)
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) {
          console.log("Oh no! error");
          return done(err);
        } else {
          console.log("yay got " + JSON.stringify(res.body));
        }
        done();
      });
  });
});

describe("POST /api/clear/", function() {
  it("shoeld respond with json", function(done) {
    request(baseURL)
      .post("/api/clear/")
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) {
          console.log("Oh no! error");
          return done(err);
        } else {
          console.log("yay got " + JSON.stringify(res.body));
        }
        done();
      });
  });
});

/*shoes: [
      {
        brand: "Tommy Helfiger",
        color: "brown",
        in_stock: 9,
        price: "860.00",
        size: 8
      },
      {
        brand: "Lacoste",
        color: "maroon",
        in_stock: 9,
        price: "860.00",
        size: 8
      },
      {
        brand: "Tommy Helfiger",
        color: "brown",
        in_stock: 9,
        price: "860.00",
        size: 5
      },
      {
        brand: "Lacoste",
        color: "maroon",
        in_stock: 9,
        price: "860.00",
        size: 7
      },
      {
        brand: "Prada",
        color: "white",
        in_stock: 12,
        price: "800.00",
        size: 7
      }
    ],
    shoppingBasketItems: []*/
