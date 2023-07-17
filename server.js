const express = require("express");
const pool = require("./db");
const port = 3000;
app.listen(port, () => console.log(`Server has started on port: ${port}`));

const app = express();
app.use(express.json());

//routes
app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM shipments");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  const { id, destination, origin, status } = req.body;
  //You put the columns of your table here and then you declare it again at the end of the pool query
  try {
    await pool.query(
      "INSERT INTO shipments (id, destination, origin, status) VALUES ($1, $2, $3, $4)",
      [id, destination, origin, status]
    );
    //The values are like $1, $2, $3, $4 because it's more of a mapping thing and not the actual values
    //This is a short hand version of this kind of code => const id = req.body.id, const destination = req.body.destination etc so we dont have to type too much
    res
      .status(200)
      .send({ message: "Successfully added shipment into database." });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/setupdb", async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE shipments(id INTEGER PRIMARY KEY, destination VARCHAR(50) NOT NULL, origin VARCHAR(50) NOT NULL, status VARCHAR(50) NOT NULL);"
    );
    res.status(200).send({ message: "Shipments table created." });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM shipments WHERE id = $1", [id]);
    res.status(200).send({ message: "Successfully deleted shipment." });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { origin, destination, status } = req.body;
  try {
    await pool.query(
      "UPDATE shipments SET id = $1, origin = $2, destination = $3, status=$4",
      [id, origin, destination, status]
    );
    res.status(200).send({ message: "Successfully updated shipment." });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
