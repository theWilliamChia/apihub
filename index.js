var express = require("express")
var bodyParser = require("body-parser")
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()

var app = express()
const corsOptions = {
  origin: "https://www.buoyant.io",
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (request, response) => {
  response.send("pagina Principal")
})

app.post("/", function (req, res) {
  var email = req.body.email

  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")
  myHeaders.append("Authorization", "Bearer " + process.env.HSAPIKEY)

  const raw = JSON.stringify({
    filters: [
      {
        propertyName: "email",
        operator: "EQ",
        value: email
      }
    ]
  })

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  }

  fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      res.end(result)
    })
    .catch((error) => console.error(error))
})

// certifier
app.post("/certifier", async function (req, res) {
  const { name, email, issueDate, expiryDate, groupId } = req.body

  axios
    .request({
      method: "POST",
      url: "https://api.certifier.io/v1/credentials/create-issue-send",
      headers: {
        accept: "application/json",
        "Certifier-Version": "2022-10-26",
        "content-type": "application/json",
        authorization: "Bearer " + process.env.CERTTOKEN
      },
      data: {
        recipient: {
          name: name,
          email: email,
        },
        issueDate: issueDate,
        expiryDate: expiryDate,
        groupId: groupId
      }
    })
    .then(({ data }) => res.json(data))
    .catch((err) => {
      res.status(500).send(err)
    })

})

app.listen(3000, () => {
  console.log("Server listen in port 3000")
})
