# TheExhibit </br>
The Exhibit is a hybrid social media/ecommerce website where users can share their artwork and photography with other people. Users are also invited to explore the collection of art, view artist profiles, like the artwork, leave comments on the art pieces, and even have the opportunity to purchase and sell artwork. If you find an artist whose work really captivates your attention, you can follow them to keep up to date on their portfolio and to build out your personal feed. Additionally, if you’d like to get in touch with another user, you also have the ability to message and have conversations with them to talk more about their work or to negotiate a price over a product.

[View The Exhibit Here](https://theexhibit.herokuapp.com/)

## **====Technologies Used====** </br>
NEM Stack | Node.js | Express.js | MongoDB | Mongoose | Embedded Javascript | Bootstrap | Axios | Flexbox | Grid | Javascript | Stripe API | Picsum API | AWS S3 Cloud 



## **====User Stories/Sprints=====** </br>
Sprint 1: User Auth/Profile View </br>
<ol>
<li>	User should navigate to “/” directory and see a splash page with description of the website and links to login/signup.</li>
<li>	User can sign up for an account and then login which will redirect them to their profile page which displays: name, biography, and an avatar they submitted.</li>
<li>	On their profile, user should be able to view all posts that they have submitted.</li>
  <li> Bonus: User can also view “saved/liked” posts that the user has saved/liked. </li>
  </ol>
Sprint 2: CRUD (Post) </br>
<ol>
<li>	User can submit a new post either from their feed or from their profile page.</li>
<li>  User can upload their artwork which will be hosted using AWS S3 cloud hosting </li>
<li>	Post has: an image, a title, description, tags, (price)</li>
<li>	After creating the new post, user will be redirected to this post view page where they can update or delete it only if they are the author of the post.</li>
<li>	The Post view page will show the author, author’s avatar, post title, image, description, tags, number of likes, and comments</li>
<li>	ALL posts will display on the gallery/explore view page. </li>
</ol>
Sprint 3: Comments </br>
<ol>
<li>	Users should be able to leave comments on posts.</li>
<li>	The comments will appear on the post view page alongside the commenter’s avatar and name.</li>
<li>	User should be able to delete only their comments.</li>
</ol>
Sprint 4: Likes </br>
<ol>
<li>	Users can “like” a post which will increase the amount of likes that post has.</li>
<li>	The “liked” post will also appear in that user’s profile under a separate section.</li>
<li>	Users can only like a particular post only once. </li>
  <li>	Bonus: Add ability to unlike a post.</li>
  </ol>
  
Sprint 5: Messaging </br>
<ol>
<li>	Logged in users can view another user’s profile and have an option to send a message to that user.</li>
<li>	If a conversation does not exist between the two users already, a new one will be made. </li>
<li>	Users will be able to view their list of conversations in a separate Conversations page</li>
<li>	Two users can send messages back and forth between each other through these conversations.</li>
</ol>
Sprint 6: Follow </br>
<ol>
<li>	User A should be able to “follow” other users. </li>
<li>	By following another user, the user who is being followed will have their posts show up on User A’s feed.</li>
<li>	A list of all users that user A is following will be displayed on the right side of the feed page.</li>
  <li>	Bonus: Add ability to unfollow a user.</li>
  </ol>
Sprint 7: Shopping  </br>
<ol>
<li>	Users (Buyers) should be able to add Posts (now considered products) to their shopping cart.</li>
<li>	Users (Buyers) can view their shopping cart which adds up the total amount of money for their whole purchase.</li>
<li>	Users (Buyers) can checkout (and do payment processing with Stripe API)  </li>
<li>	Users (Buyers) can view their history of purchases  </li>
<li>	Sellers can view their sales history  </li>
</ol>


## **====Entity Relationship Diagram====** </br>
<img src='https://i.imgur.com/iVio8U3.jpg' />


## **====Wireframes====** </br>
Splash Page </br>
<img src='https://i.imgur.com/3Q9o89e.jpg' />

Form Pages </br>
<img src='https://i.imgur.com/KWWYAe4.jpg' />

Feed Page </br>
<img src='https://i.imgur.com/WKr9rEZ.jpg' />

Post View Page </br>
<img src='https://i.imgur.com/vEFmKaB.jpg' />

User Profile Page </br>
<img src='https://i.imgur.com/iEimf7Y.jpg' />

Conversations View page </br>
<img src='https://i.imgur.com/FygIHw5.jpg' />

Sales/Purchase History Page </br>
<img src='https://i.imgur.com/YiKw6jx.jpg' />

Shopping Cart Page </br>
<img src='https://i.imgur.com/J4FLZYf.jpg' />

## **====Color Palette====** </br>
https://coolors.co/0081a7-00afb9-fdfcdc-fed9b7-f07167

## **====Future Improvements====** </br> 
<ul> 
  <li>Will have to refactor the sales tracking portion, for now it works fine but it can be optimized by making that aspect a separate model for organization.</li>
</ul>
