# Use My Tech Stuff API

Endpoints with an (auth) require an authorization token like so: 

Headers:
| Key | Value |
| :-- | :-- |
| Authorization | <AUTH_TOKEN> |

## Authorization

### Register an Account

<details>
  <summary>
    POST /api/auth/register
  </summary>

  Body:
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | username | string | (required) |
  | password | string | (required) |
  | email | string | |

  Response:
  ```
  { token: <AUTH_TOKEN> }
  ```
</details>

### Login

<details>
  <summary>
    POST /api/auth/login
  </summary> 

  Body:
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | username | string | (required) |
  | password | string | (required) |

  Response:
  ```
  { token: <AUTH_TOKEN> }
  ```
</details>

## Items

### Get all items

<details>
  <summary>
    GET /api/items (auth)
  </summary>

  Response:
  ```
  [
    {
      item_id: 1,
      name: "Television",
      owner: "Iron Man",
      rented_by: "Thor",
    },
    {
      item_id: 2,
      name: "Camera",
      owner: "Spiderman",
      renter: null (No one is renting this item)
    },
    ...
  ]
  ```
</details>

### Get item by id

<details>
  <summary>
    GET /api/items/:item_id (auth)
  </summary>

  Response:
  ```
  {
    item_id: 1,
    name: "Television",
    owner_id: 1,
    renter_id: 2
  }
  ```
</details>

### Post an item

<details>
  <summary>
    POST /api/items (auth)
  </summary>
  
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | name | string | (required) |
  | description | string | |
</details>

### Edit your own item

<details>
  <summary>
    POST /api/items/:item_id (auth)
  </summary>
  
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | name | string | |
  | description | string | |
</details>

## Requests

### Make a request

<details>
  <summary>
    POST /api/requests (auth)
  </summary>
  
  Body:
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | item_id | int | (required) |
</details>

### Get request by id

<details>
  <summary>
    GET /api/requests/:request_id (auth)
  </summary>
  
  Response:
  ```
  {
    request_id: 1,
    item_id: 2,
    owner_id: 3,
    renter_id: 4,
    status: <Status as a string: "pending", "accepted", "rejected", or "completed">
  }
  ```
</details>

### Respond to a request

<details>
  <summary>
    PUT /api/requests/:request_id (auth)
  </summary>
  
  Can only be performed by the owner of the item.
  
  Body:
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | accepted | boolean | Accept or decline a request. (required) |
</details>

### Cancel a request

<details>
  <summary>
    DELETE /api/requests/:request_id (auth)
  </summary>
  
  Can only be performed by the user who made the request.
  
  Response: The request that was deleted
  ```
  {
    request_id: 1,
    item_id: 2,
    owner_id: 3,
    renter_id: 4,
    status: <Status as a string: "pending", "accepted", "rejected", or "completed">
  }
  ```
</details>

## Your Account

### Get your own account info

<details>
  <summary>
    GET /api/account (auth)
  </summary>

  Response:
  ```
  {
    user_id: 1,
    username: "Iron Man",
    email: "IAmIronMan@mail.com"
  }
  ```
</details>

### Get items you own

<details>
  <summary>
    GET /api/account/items (auth)
  </summary>

  Response:
  ```
  [
    {
      item_id: 1,
      name: "Television",
      renter: "Iron Man",
    },
    {
      item_id: 2,
      name: "Speakers",
      renter: "Captain America",
    }
    ...
  ]
  ```
</details>

### Get requests you made

<details>
  <summary>
    GET /api/account/requests (auth)
  </summary>

  Response:
  ```
  [
    { request_id: 1, item: "Microphone", owner: "Superman", status: "Pending" },
    { request_id: 2, item: "Headphones", owner: "Batman", status: "Accepted" },
    ...
  ]
  ```
</details>

### Get requests for your items

<details>
  <summary>
    GET /api/account/requests/owned (auth)
  </summary>

  Response:
  ```
  [
    { request_id: 1, item: "Keyboard", requester: "Iron Man" },
    { request_id: 2, item: "Android", requester: "Captain America" },
    ...
  ]
  ```
</details>
