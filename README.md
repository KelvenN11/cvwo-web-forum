SIMPLE WEB FORUM

This project is designed to apply core web development principles in a minimalist way to create a functional "Social CRUD" application. To achieve this, I utilized the MVC (Model-View-Controller) architecture. This pattern allows for a clear separation of concerns, structuring the code so that it is significantly easier to maintain, scale, and debug.

For the detail, MVC will be divided as so.
1. Model (backend) located at the server folder
2. View (frontend) located at the src folder
3. Controller (API) located at the src/services folder

As the main guideline of features, users stories is used.
User stories define the requirements of the application from the perspective of the end-user. For this minimalist web forum, it prioritize the "Social CRUD" experience:
- As a Guest: I want to view a feed of all posts so that I can see what the community is discussing without needing an account.- As a Registered User: I want to create text-based posts and comments so that I can share my thoughts with others.
- As an Author: I want to edit or delete my own posts so that I can correct mistakes or remove content I no longer wish to share.
- As a Reader: I want to comment on a post so that I can engage in an active conversation.

By those user stories, I conclude the features that will be added

1. Login system
As guest, I don't want any hassle while logging in, out, or maybe not even having an account. Furthermore, the requirement of the assignment is only to have the username only. So, I decided to not dedicated a page only for login but rather put the login in the header which make it easy to access.

2. Post section
As an author, I want to edit, delete, and post my own posts. To do so, CRUD for posts must be made, however back to the original purpose which is minimalist, I intend to merge it with the main page so that when I need to make a post, I don't need to change page which could lead to longer time.

3. Comment section
As a Reader and community, I want to comment on a post to make it more engaging. To do so, the feature will be added will be similar to the post section since it is the same functionality. 



AI Usage Declaration:

I use AI to build the frontend and teach me backend

prompt mainly :
- how to copy paste from MUI
- how to write API ?
- how can I connect to SQL ?
- can you explain it like I know nothing
- why dont you write it in full CRUD and only post and few operation
- Can you help me write report in MVC ?

(also several prompt to improve the backend and css, also to debug)
(I will refrain from providing link in the github since it may contain personal data, I will put it into the google form for cvwo)










