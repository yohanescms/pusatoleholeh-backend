
# PusatOlehOleh-backend

Backed for pusatoleholeh Souvenir Marketplace Website written in JavaScript using Express.JS framework


## Added Features

- User registration as buyer
- User registration as seller
- User registration as admin*
- User authentication using Email and Password
- User authentication using Google Account (only as a buyer)
- User profile update
- Shop creation for user with seller role
- Product creation to the owned shop
- Product update
- Product deletion
- Global product search
- Shop product search
- ProductImages update
- ProductImages deletion
- Primary ProductImages set
- Show random product by mumber


## To be Added Features

- cart 
- TBA
## API
```
POST    /auth/register
POST    /auth/register/seller
POST    /auth/register/admin
POST    /auth/login
GET     /google
GET     /google/callback
GET     /product/search?query=
GET     /product/:shopId/search?query=
GET     /product/:productId
GET     /product
GET     /product/:shopId
POST    /product/:shopId
PUT     /product/:productId
DELETE  /product/:productId
PUT    /product/:productId/images/:imagesIndex
DELETE    /product/:productId/images/:imagesIndex
PUT    /product/:productId/images/:imagesIndex/star
GET     /product/random/:count
POST    /shop/create
GET     /profile
PUT     /profile
```

## To be Added API

TBA
## Full Documentation

Full documentation can be accessed at
[Documentation](https://wiki.anemona.cloud)


## Screenshots

Current Database schema

![Diagram](https://raw.githubusercontent.com/Anemonastrum/pusatoleholeh-backend/refs/heads/main/schema.png)

