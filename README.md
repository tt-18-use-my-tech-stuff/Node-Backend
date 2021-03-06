# Use My Tech Stuff API

Hosted Backend URL: https://tt18-build-week.herokuapp.com/

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
      item_name: "Television",
      item_description: "New TV. Remote not included",
      price: 15.00,
      category: "Displays",
      owner: "Iron Man",
      owner_id: 1,
      renter: "Spiderman",
      renter_id: 2
    },
    {
      item_id: 2,
      item_name: "Camera",
      item_description: "A really expensive camera. Neat!",
      price: 20.00,
      category: "Photography",
      owner_id: 2,
      renter_id: null, (no one is renting this)
      owner: "Spiderman",
      renter: null
    },
    ...
  ]
  ```
</details>

### Get available items

<details>
  <summary>
    GET /api/items/available (auth)
  </summary>

  Response:
  ```
  [
    {
      item_id: 1,
      item_name: "Television",
      item_description: "New TV. Remote not included",
      price: 15.00,
      category: "Displays",
      owner_id: 1,
      owner: "Iron Man"
    },
    {
      item_id: 2,
      item_name: "Camera",
      item_description: "A really expensive camera. Neat!",
      price: 20.00,
      category: "Photography",
      owner_id: 2,
      owner: "Spiderman"
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
    item_name: "Television",
    item_description: "A nice TV! Remote not included",
    price: 15.00,
    category: "Displays"
    owner_id: 1,
    renter_id: 2,
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
  | item_name | string | (required) |
  | item_description | string | (required) |
  | price | number | (required) Cannot be less than $0.00 or more than $999,999.99 |
  | category | string | (required) |

  Response: The created item
  ```
  {
    item_id: 1,
    item_name: "Television",
    item_description: "A nice TV! Remote not included",
    price: 15.00,
    category: "Displays"
    owner_id: 1,
  }
  ```
</details>

### Edit your own item

<details>
  <summary>
    PUT /api/items/:item_id (auth)
  </summary>
  
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | item_name | string | |
  | item_description | string | |

  Response: Item with new edits
  ```
  {
    item_id: 1,
    item_name: "Television",
    item_description: "Just broke it, but it works still? sort of? Still can't find the remote",
    owner_id: 1,
    renter_id: 2,
    price: 5.00,
    category: "Displays"
  }
  ```
</details>

### Delete your own item

<details>
  <summary>
    DELETE /api/items/:item_id (auth)
  </summary>
  
  Response: Deleted item_id
  ```
  1
  ```
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
  
  Response: Newly created request
  ```
  {
    request_id: 1,
    item_id: 2,
    owner_id: 3,
    requester_id: 4,
    status: "pending"
  }
  ```
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
    requester_id: 4,
    status: <Status as a string: "pending", "accepted", "rejected", or "completed">
  }
  ```
</details>

### Respond to a request

<details>
  <summary>
    PUT /api/requests/:request_id/respond (auth)
  </summary>
  
  Can only be performed by the owner of the item.
  
  Body:
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | response | string | (required) Must be "accepted", "declined", or "completed". Can only accept or decline requests with status "pending". Can only accept requests that haven't been accepted already. Can only complete requests with status "accepted".  |
  
  Response: Request with new status
  ```
  {
    request_id: 1,
    item_id: 2,
    owner_id: 3,
    requester_id: 4,
    status: <Status as a string: "accepted", "rejected", or "completed">
  }
  ```
</details>

### Cancel a request

<details>
  <summary>
    DELETE /api/requests/:request_id (auth)
  </summary>
  
  Can only be performed by the user who made the request.
  
  Response: Deleted request request_id
  ```
  2
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

### Edit your own account info

<details>
  <summary>
    PUT /api/account (auth)
  </summary>

  Body:
  | Parameter | Type | Notes |
  | :-- | :-- | :-- |
  | username | string | |
  | password | string | |
  | email | string | |
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
      item_description: "New TV. Remote not included",
      renter: "Thor",
      price: 15.00,
      category: "Displays"
    },
    {
      item_id: 4,
      item_name: "Speakers",
      item_description: "Powered bookshelf speakers.".
      renter: null (No one is renting this item),
      price: 11.00,
      category: "Audio"
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
    { request_id: 1, item: "Microphone", owner: "Superman", status: "pending" },
    { request_id: 2, item: "Headphones", owner: "Batman", status: "accepted" },
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
