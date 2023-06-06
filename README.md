
API Documentation
This document provides detailed information about the APIs available in this project.

User APIs
Register a User
POST /api/register

Create a new user account.

Request Body

Field	Type	Description
name	string	User's name
email	string	User's email
password	string	User's password
dob	string	User's date of birth (optional)
bio	string	User's biography (optional)
Response

201 Created: User created successfully
400 Bad Request: User already exists
500 Internal Server Error: An error occurred on the server
User Login
POST /api/login

Authenticate a user and generate a JWT token for subsequent API requests.

Request Body

Field	Type	Description
email	string	User's email
password	string	User's password
Response

201 Created: User logged in successfully
token: JWT token for authentication
user: User object
400 Bad Request: Invalid credentials
500 Internal Server Error: An error occurred on the server
Get All Users
GET /api/users

Retrieve a list of all users.

Response

200 OK: Users fetched successfully
users: Array of user objects
500 Internal Server Error: An error occurred on the server
Get Friends of a User
GET /api/users/:id/friends

Retrieve the list of friends for a specific user.

URL Parameters

Parameter	Type	Description
id	string	User ID (MongoDB ID)
Response

200 OK: Friends fetched successfully
friends: Array of user objects representing friends
400 Bad Request: User does not exist
500 Internal Server Error: An error occurred on the server
Send Friend Request
POST /api/users/:id/friends

Send a friend request to a specific user.

URL Parameters

Parameter	Type	Description
id	string	User ID (MongoDB ID)
Authentication

Requires a valid JWT token in the request header.
Response

200 OK: Friend request sent successfully
400 Bad Request: Friend request already sent or user does not exist
500 Internal Server Error: An error occurred on the server
Accept/Reject Friend Request
PATCH /api/users/:id/friends/:friendId

Accept or reject a friend request from a specific user.

URL Parameters

Parameter	Type	Description
id	string	User ID (MongoDB ID)
friendId	string	Friend's User ID (MongoDB ID)
Authentication

Requires a valid JWT token in the request header.
Request Body

Field	Type	Description
flag	boolean	true to accept, false to reject
Response

200 OK: Friend request accepted successfully
400 Bad Request: Friend request does not exist
500 Internal Server Error: An error occurred on the server
Post APIs
Get All Posts
GET /api/posts

Retrieve a list of all posts.

Response

200 OK: Posts fetched successfully
posts: Array of post objects
500 Internal Server Error: An error occurred on the server
Create a Post
POST /api/posts

Create a new post associated with a specific user.

Authentication

Requires a valid JWT token in the request header.
Request Body

Field	Type	Description
text	string	Post content (optional)
image	string	Image URL (optional)
Response

200 OK: Post created successfully
500 Internal Server Error: An error occurred on the server
Update a Post
PATCH /api/posts/:id

Update the content of a specific post.

URL Parameters

Parameter	Type	Description
id	string	Post ID (MongoDB ID)
Authentication

Requires a valid JWT token in the request header.
Request Body

Any field(s) to be updated
Response

200 OK: Post updated successfully
500 Internal Server Error: An error occurred on the server
Delete a Post
DELETE /api/posts/:id

Delete a specific post.

URL Parameters

Parameter	Type	Description
id	string	Post ID (MongoDB ID)
Authentication

Requires a valid JWT token in the request header.
Response

200 OK: Post deleted successfully
500 Internal Server Error: An error occurred on the server
Like a Post
POST /api/posts/:id/like

Like a specific post.

URL Parameters

Parameter	Type	Description
id	string	Post ID (MongoDB ID)
Authentication

Requires a valid JWT token in the request header.
Response

200 OK: Post liked successfully
500 Internal Server Error: An error occurred on the server
Comment on a Post
POST /api/posts/:id/comment

Add a comment to a specific post.

URL Parameters

Parameter	Type	Description
id	string	Post ID (MongoDB ID)
Authentication

Requires a valid JWT token in the request header.
Request Body

Field	Type	Description
text	string	Comment text
Response

200 OK: Commented successfully
500 Internal Server Error: An error occurred on the server
Get a Post by ID
GET /api/posts/:id

Retrieve a specific post by its ID.

URL Parameters

Parameter	Type	Description
id	string	Post ID (MongoDB ID)
Response

200 OK: Post fetched successfully
post: Post object
500 Internal Server Error: An error occurred on the server