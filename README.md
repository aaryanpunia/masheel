# Masheel

## Tech Stack

- Database: PostgresSQL, hosted on ElephantSQL.
- Backend API: Express, hosted on Heroku.
- Frontend: React, hosted on netlify.

## Database Design

### Searcher

| Variable          | Type                              |
| ----------------- | --------------------------------- |
| Name              | String                            |
| Email             | String                            |
| ProfilePicture    | String                            |
| Password          | String                            |
| About             | String                            |
| Experience        | [Array of Experience Object]      |
| Education         | [Array of Experience Object]      |
| Recommendations   | [Array of Recommendation Objects] |
| Search Time       | Number                            |
| Sector Preference | Sector Preference Object          |
| Money Needed      | Requirement Breakdown Object      |
| Co-Searchers      | [Searcher Array]                  |
| Messages sent     | [Array of message objects]        |
| Messages received | [Array of message objects]        |

### Investor

| Variable          | Type                              |
| ----------------- | --------------------------------- |
| Name              | String                            |
| Email             | String                            |
| Password          | String                            |
| ProfilePicture    | String                            |
| About             | String                            |
| Experience        | [Array of Experience Object]      |
| Education         | [Array of Experience Objext]      |
| Recommendations   | [Array of Recommendation Objects] |
| Search Time       | Number                            |
| Sector Preference | Sector Preference Object          |
| Money Offering    | [Size 2 array of Numbers]         |
| Co-Investors      | [Investor Array]                  |
| Messages sent     | [Array of message objects]        |
| Messages received | [Array of message objects]        |
| Active or passive | activeness Object                 |

### Experience Object

| Variable    | Type   |
| ----------- | ------ |
| Name        | String |
| Description | String |
| Time        | String |

### Recommendation Object

| Variable    | Type   |
| ----------- | ------ |
| Recomender  | String |
| Description | String |

### Sector Preference Object

| Variable | Type   |
| -------- | ------ |
| Sector   | String |

### Requirement Breakdown Object

| Variable  | Type                          |
| --------- | ----------------------------- |
| Total     | Number                        |
| Breakdown | Dictionary with total = TOTAL |

### Activeness Object

| Variable   | Type    |
| ---------- | ------- |
| Active     | Boolean |
| Philosophy | String  |

### Message Objects

| Variable  | Type                       |
| --------- | -------------------------- |
| Sender    | User / Investor / Searcher |
| Receiver  | User / Investor / Searcher |
| Body      | String                     |
| TimeStamp | Date                       |

## Backend-API

**REST API:** masheel-api.com

### Frameworks / Libraries

- pg
- bcrypt
- jsonwebtoken
- socket.io
- cors
- passport.js
- express.js
- sequalize
- chai
- mocha

### Folder Structure

```
├── src
    ├── server.js # Server layer, starts up server, connects to db.
    ├── routes  # Contains API endpoints and routes.
    ├── models  # db Models and access functions.
    ├── tests   # Test suit
    ├── config  # Configurations and env variables.
    ├── db
        ├── index.js
```

### Endpoints

Defines endpoint as _endpoint_ with params **_param1_**...**_paramN_** that returns type TYPE and value VALUE.

### Example

- _endpoint_ : Get endpoint with params **_param1_**...**_paramN_**. Returns type TYPE and value VALUE.
  > Called using masheel-api.com/endpoint/:endpoint syntax.

**Get Endpoints**

_get user_ : Get endpoint with params **_userID_**, **_userName_**, or **_userEmail_**. Returns type Investor or Searcher.

> masheel-api.com/getuser/userID/:userID | masheel-api.com/getuser/userName/:userName | masheel-api.com/getuser/userEmail/:userEmail

_get messages_ : Get endpoint with param **_userID_**. Returns type messages:{received: message[], send: message[]}.

> masheel-api.com/getmessages/userID/:userID

_get user auth_ : Get endpoint with param **_userEmail_** and **_userPassword_**. Returns JWT payload which contains **_userName_**, **\*userEmail**, and **_userId_**.

**Post Endpoints**

_post user_ : Post endpoint with params **_userName_**, **_userEmail_**, **_invOrSearch(boolean)_**. Returns type success or failure. HTTP code 200(Success) or 400(Bad request).

> masheel-api.com/postuser/userName/:userName/userEmail/:userEmail/invOrSearch/:invOrSearch

_post userdetail_ : Post endpoint with no params and content **_userDetail_** object. Returns code 200(Success) or 400(Bad request).

> masheel-api.com/postuserdetail/

_post userRecommendation_ : Post endpoint with params **_userID_**, **_recommendation_**, **_sender_**. Returns code 200(Success) or 400(Bad request).

> masheel-api.com/postuserrec/userID/:userID/recomm/:recomm

_post message_ : Post endpoint with params **_senderID_**, **_receiverID_**, **_messageBody_**, **_timeStamp_**. Returns code 200(Success) or 400(Bad request).

> masheel-api.com/postmessage/senderID/:senderID/receiverID/:receiverID/messageBody/:messageBody

**Middleware**

_auth user_ : Middleware that authenticates user and returns JWT with payload as **_userID_** and **_userEmail_**. No params, only uses Authentication header with JWT.

## Frontend

### Frameworks / Libraries

- React.js
- Vite
- Material UI
- React-forms
- Mobx
- React animation group
- Cloudinary

### Page Layout

```
├── masheel.com # Home Page to choose from being an investor or searcher.
|   |
|   ├──masheel.com/investor # Home page for Investors.
|   |   |
|   |   ├──masheel.com/invester/signup
|   |   |
|   |   ├──masheel.com/investor/login
|   |       |
|   |       ├──masheel.com/investor/explore
|   |       |
|   |       ├──masheel.com/investor/:accountname
|   |       |
|   |       ├──masheel.com/investor/:searchuser
|   |
|   ├──masheel.com/searcher # Home page for searcher.
|       |
|       ├──masheel.com/searcher/signup
|       |
|       ├──masheel.com/searcher/login
|           |
|           ├──masheel.com/searcher/explore
|           |
|           ├──masheel.com/searcher/:accountname
|           |
|           ├──masheel.com/investor/:searchuser
|
├── masheel.com/404pagenotfound
```

### Src Layout

```
├──src
|   |
|   ├──views
|   |
|   ├──component
|   |
|   ├──static
|   |   |
|   |   ├──css
|   |
|   ├──index.html
|   |
|   ├──app.jsx
|   |
|   ├──main.jsx
```
