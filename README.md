# Masheel
 
 ## Tech Stack 
 - Database: PostgresSQL, hosted on ElephantSQL.
 - Backend API: Express, hosted on Heroku.
 - Frontend: React, hosted on netlify.

 ## Database Design
 ### Searcher
| Variable      | Type |
| ----------- | ----------- |
| Name      | String       |
| Email   | String        |
| Password   | String        |
| About   | String        |
| Experience   | [Array of Experience Object] |
| Education   | [Array of Experience Object]  |
| Recommendations   | [Array of Recommendation Objects]        |
| Search Time   | Number        |
| Sector Preference   | Sector Preference Object        |
| Money Needed   | Requirement Breakdown Object        |
| Co-Searchers   | [Searcher Array] |
| Messages sent   | [Array of message objects]|
| Messages received   | [Array of message objects]        |

### Investor

| Variable      | Type |
| ----------- | ----------- |
| Name      | String       |
| Email   | String        |
| Password   | String        |
| About   | String        |
| Experience   | [Array of Experience Object] |
| Education   | [Array of Experience Objext] |
| Recommendations   | [Array of Recommendation Objects]        |
| Search Time   | Number        |
| Sector Preference   | Sector Preference Object        |
| Money Offering   | [Size 2 array of Numbers]      |
| Co-Investors   | [Investor Array] |
| Messages sent   | [Array of message objects]|
| Messages received   | [Array of message objects]        |
| Active or passive   | activeness Object |

### Experience Object
| Variable      | Type |
| ----------- | ----------- |
| Name      | String       |
| Description      | String       |
| Time      | String       |

### Recommendation Object
| Variable      | Type |
| ----------- | ----------- |
| Recomender      | String       |
| Description      | String       |
### Sector Preference Object
| Variable      | Type |
| ----------- | ----------- |
| Sector      | String       |


### Requirement Breakdown Object
| Variable      | Type |
| ----------- | ----------- |
| Total      | Number       |
| Breakdown      | Dictionary with total = TOTAL |

### Activeness Object
| Variable      | Type |
| ----------- | ----------- |
| Active      | Boolean       |
| Philosophy      | String       |

### Message Objects
| Variable      | Type |
| ----------- | ----------- |
| Sender      | User / Investor / Searcher       |
| Receiver      |  User / Investor / Searcher         |
| Body      | String       |
| TimeStamp      | Date       |

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

### Folder Structure
```
├── src
|   ├── server.js # Server layer, starts up server, connects to db.
|   ├── routes  # Contains API endpoints and routes.
|   ├── models  # db Models and access functions.
|   ├── tests   # Test suit
|   ├── config  # Configurations and env variables.
```
### Endpoints
Defines endpoint as *endpoint* with params ***param1***...***paramN*** that returns type TYPE and value VALUE.

### Example
- *endpoint* : Get endpoint with params ***param1***...***paramN***. Returns type TYPE and value VALUE.
> Called using masheel-api.com/endpoint/:endpoint syntax.

**Get Endpoints**

*get user* : Get endpoint with params ***userID***, ***userName***, or ***userEmail***. Returns type Investor or Searcher.
> masheel-api.com/getuser/userID/:userID | masheel-api.com/getuser/userName/:userName | masheel-api.com/getuser/userEmail/:userEmail

*get messages* : Get endpoint with param ***userID***. Returns type messages:{received: message[], send: message[]}.
> masheel-api.com/getmessages/userID/:userID

*get user auth* : Get endpoint with param ***userEmail*** and ***userPassword***. Returns JWT payload which contains ***userName***, ***userEmail**, and ***userId***.

**Post Endpoints**

*post user* : Post endpoint with params ***userName***, ***userEmail***, ***invOrSearch(boolean)***. Returns type success or failure. HTTP code 200(Success) or 400(Bad request).
> masheel-api.com/postuser/userName/:userName/userEmail/:userEmail/invOrSearch/:invOrSearch

*post userdetail* : Post endpoint with no params and content ***userDetail*** object. Returns code 200(Success) or 400(Bad request).
> masheel-api.com/postuserdetail/

*post userRecommendation* : Post endpoint with params ***userID***, ***recommendation***, ***sender***. Returns code 200(Success) or 400(Bad request).
> masheel-api.com/postuserrec/userID/:userID/recomm/:recomm

*post message* : Post endpoint with params ***senderID***, ***receiverID***, ***messageBody***, ***timeStamp***. Returns code 200(Success) or 400(Bad request).
> masheel-api.com/postmessage/senderID/:senderID/receiverID/:receiverID/messageBody/:messageBody

**Middleware**

*auth user* : Middleware that authenticates user and returns JWT with payload as ***userID*** and ***userEmail***. No params, only uses Authentication header with JWT.


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


