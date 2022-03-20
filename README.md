# LannisterPay
A transaction fee processing service. This service is meant to calculate the fee applicable to a transaction based on specific fee configurations they will shared.
Access the docs
 [here](https://documenter.getpostman.com/view/18194317/UVsPR5N8)

<hr>

Built With

- nodejs, express, mongoDb, redis & hosted on heroku

<hr>

Trying to get started?

- Make sure to have `node`, `git`, `mongodb` and `redis` installed on your computer
- Clone this project using this link - <https://github.com/bellogo/tyrion.git>
- Run `npm install` to install all dependencies
- Add the following env variables as dictated in the .env.example file: `PORT`, `MONGODB_URL` & `REDIS_URL`

- Run `npm run dev` to start the server

<hr>

HTTP request method used in this project:

| Method   | Action                                                      |
|---       | ---                                                                       |
| `POST`   | This method is used to *create* a resource or *send* data   |

<hr>

These are the HTTP response codes used in this project:

| Status Codes | Indication                                                                                            |
|   ---        | ---                                                                                                   |
|  `200`       | This `OK` status code indicates that a request has succeeded                                          |
|  `400`       | This `bad request error` status code indicates that the request sent to the server is incorrect       |
|  `500`       | This `internal server error` status code indicates that something has gone wrong on the web server           |

<hr>

The routes featured in this project:

| API routes(url)       | Method   | Description                                         |
| ---                   | ---      | ---                                                 |
| /fees         | `POST`   |  Add fee configurations info                    |
| /compute-transaction-fee   | `POST`   | computes the applicable transaction fee                  |


<hr>

Usage:

- Make a `POST` request to `https://tyrion-lannister.herokuapp.com/fees` to add fee configurations.


sample request: 
```
{
  "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
}
```

sample response:
```

{
    "status": "ok"
}

```

- Make a `POST` request to `https://tyrion-lannister.herokuapp.com/compute-transaction-fee` to compute transaction fee.


sample request: 
```
{
    "ID": 91203,
    "Amount": 5000,
    "Currency": "NGN",
    "CurrencyCountry": "NG",
    "Customer": {
        "ID": 2211232,
        "EmailAddress": "anonimized29900@anon.io",
        "FullName": "Abel Eden",
        "BearsFee": true
    },
    "PaymentEntity": {
        "ID": 2203454,
        "Issuer": "GTBANK",
        "Brand": "MASTERCARD",
        "Number": "530191******2903",
        "SixID": 530191,
        "Type": "CREDIT-CARD",
        "Country": "NG"
    }
}
```

sample response:
```
{
    "AppliedFeeID": "LNPY1223",
    "AppliedFeeValue": 120,
    "ChargeAmount": 5120,
    "SettlementAmount": 5000
}
```

- For more information here's the documentation link `https://documenter.getpostman.com/view/18194317/UVsPR5N8`
<hr>


👤 **Author**

- Github: [@bellogo](https://github.com/bellogo)
- Linkedin: [Ufuoma Ogodo](https://ng.linkedin.com/in/ufuoma-ogodo)
