# Description:

A webapp/PWA dating app (frontend in React, backend in FastAPI) that
quickly exposes users to each other and match based on the their top
artists and songs (provided by the Spotify API).

## Running
To run backend in one terminal:
1. Install the necessary Python packages
    ```
    cd src/back
    pip install -r ./requirements.txt
    ```
2. Use `uvicorn` to run the server manually (by default, will run on port 8000)
    ```
    uvicorn main:app
    ```

To run frontend in another terminal:
1. Install the necessary Javascript packages
    ```
    cd src/front
    yarn
    ```

2. Run
    ```
    yarn start
    ```

## Documentation
You can find our documentation at our [GitHub Pages](https://jho44.github.io/YouDate/)!

## Test Scenarios
### Frontend (via Cypress)
*Cypress setup thanks to Zifan He, from another project*
Disabled Spotify authentication for tests since we can't login via
Cypress from 3rd-party site (because we shouldn't be testing
services outside of our control). Set test user for content behind
login with the following information.
```
{
    user_id: "fake_test_user_id",
    email: "fakeemail@fake.com",
    pic: null,
    name: "Fake User",
    pronouns: "fake pronouns",
    age: 0,
    description: "fake description",
    top_artists: [],
    top_songs: [],
    life_goal: "fake life goal",
    believe_or_not: "fake believe it or not",
    life_peaked: "fake life peaked",
    feel_famous: "fake feel famous",
    biggest_risk: "fake biggest risk",
    desired_relationship: "Other",
    education: "fake education",
    occupation: "fake occupation",
    sexual_orientation: "fake sexual orientation",
    location: "fake location",
    political_view: "fake political view",
    height: "fake height",
}
```
Also created 2 such fake users in Neo4j and had them like each other
so something shows on the Matched page.

**Navbar**
- Navigate to profile page via navbar button
    1. click on button corresponding to Profile page on navbar
    2. assert that url includes "/profile"
- Navigate to meet page via navbar button
    1. click on button corresponding to Profile page on navbar
    2. assert that url includes "/meet"
- Navigate to matched page via navbar button
    1. click on button corresponding to Profile page on navbar
    2. assert that url includes "/matched"

**Profile**

*(Before each test, visit `localhost:3000/profile`)*
- Profile page renders
    1. check that fake user's name, pronouns, age, description,
    artists, and songs rendered.
    2. check that input fields for tidbits and QAs rendered.
    3. check that Submit and Reset buttons rendered (for edit info form)
    4. check that Logout button rendered

- Toggle Delete Account Confirmation modal open
    1. click on the "Delete Account" button/switch
    2. assert that the modal popped up

- Toggle Delete Account Confirmation modal closed
    1. click on the "Delete Account" button/switch
    2. click on the "Cancel" button
    3. assert that the modal is gone
    4. assert that the "Delete Account" switch is switched off

**Matched**

*(Before each test, visit `localhost:3000/matched`)*
- Matched page renders
    1. assert the page has the word "Matches"
    2. assert that there's at least one Match component

- Open Delete Match modal
    1. click on Delete Match button on first match
    2. assert that an Ant Design modal opened with the words "Delete Match" in it

- Close Delete Match modal
    1. click on Delete Match button on first match
    2. click on the Cancel button
    3. assert that the Ant Design modal is gone

**Meet**

*(Before each test, visit `localhost:3000/meet`)*
- Meet page loading
    1. check that the loading icon appears when first open page

- Unmet user rendered
    1. assert "Songs in Common" and "Artists in Common" rendered
    2. assert that unmet user's profile picture and DISLIKE and
    LIKE buttons appeared.

### Backend (Integration tests via Postman)

Postman tests must be imported as a collection into Postman in order to run them. They are saved as a JSON file in our repository. Spotify credentials must be imported manually. The tests are not idempotent, so we run them in an order that makes clean-up unnecessary (ex. run the create user test then delete user test). The oracle in these tests are the postman assertions.

**Backend is reachable**
- Get any response from backend server
- Input: null
    1. assert that response code is 200

**Frontend is accessible**
- Get any response from frontend deployment
- Input: null
    1. assert that response code is 200

**Create User from Spotify Profile**
- Create a valid, previously unseen user from their Spotify credentials
- Input: valid Spotify credentials and user data (name, pronouns, birth month, etc)
    1. assert that response code is 200
    2. assert that user data matches the user data of the test Spotify user

**Create User from Spotify Profile with Invalid Credentials**
- Create a valid, previously unseen user from invalid Spotify credentials
- Input: invalid Spotify credentials and valid user data (name, pronouns, birth month, etc)
    1. assert that response code is 404

**Create Artist**
- Create a valid test artist
- Input: artist name
    1. assert that response code is 200
    2. assert that the artist name is returned

**Delete User**
- Delete a created user
- Input: valid user email
    1. assert that response code is 200

**Delete User (User Not Found)**
- Delete a nonexistant user
- Input: invalid user email
    1. assert that response code is 404 (User Not Found)

**Update User Facts**
- Update user facts of existing user
- Input: valid user email and updated user facts (school: UCLA)
    1. assert that response code is 200
    2. assert that data has changed (e.g. school changed to UCLA)

**Update User Facts (Invalid Email)**
- Update user facts of invalid user
- Input: invalid user email and updated user facts
    1. assert that response code is 404 (User Not Found)

**Like User**
- Send a like from User A to User B for two valid users
- Input: two valid user IDs
    1. assert that response code is 200

**Dislike User**
- Send a dislike from User A to User B for two valid users
- Input: two valid user IDs
    1. assert that response code is 200

**Get Shared Artists**
- Get shared artists between User A and User B for two valid users
- Input: two valid user IDs
    1. assert that response code is 200
    2. assert that shared artists are correct

**Get Matches**
- Get matches for an existing user
- Input: valid user email
    1. assert that response code is 200
    2. assert that there is a list of matches

**Get Unmet**
- Get dislikes for an existing user
- Input: valid user email
    1. assert that response code is 200
    2. assert that there is a list of disliked users

**Get User**
- Get a valid user
- Input: valid user access token
    1. assert that response code is 200
    2. assert that user data matches the user data of the test Spotify user

**Get User (User Not Found)**
- Get a nonexistant user
- Input: invalid user access token
    1. assert that response code is 404 (User Not Found)

### Backend (Unit tests via Pytest and Monkeypatch)

Virtual env with required dependencies must be active. The tests are idempotent - the only setup needed is handled by pytest fixtures in conftest.py. The oracle are the pytest assertions documented below. While they cover the same routes as the integration tests, they aim to specifically test the json parsing logic of these routes, which may be missed when simply testing the output of the API. 

**test_create_spotify_user**
- Process user data from Spotify API accurately
- Input: Fixture of sample response from Spotify API {top_tracks: [...], top_artists: [...], ...}
    1. assert that retrieved name is correct
    2. assert that retrieved email is correct
    3. assert that top_artists is correct
    4. assert that top_songs is correct

**test_user_create**
- Store user data from Spotify API correctly
- Input: Fixture of sample response from Spotify API {top_tracks: [...], top_artists: [...], ...}
    1. assert that stored, then retrieved, name is same as API response
    2. assert that stored, then retrieved, email is same as API response
    3. assert that stored, then retrieved, top_artists are same as API response
    4. assert that stored, then retrieved, top_songs are same as API response
 
**test_user_like - SUCCESS**
- Like user when both users exist
- Input: email of user to like, email of user performing the like
    1. assert that status code is 200 (200 code branch reached implies no JSON parsing errors)

**test_user_like - FAILURE**
- Like user when one or more users don't exist
- Input: email of user to dislike, email of user performing the dislike
    1. assert that status code is not 200 (404 code branch reached implies error was caught)

**test_user_dislike - SUCCESS**
- Dislike user when both users exist
- Input: email of user to dislike, email of user performing the dislike
    1. assert that status code is 200 (200 code branch reached implies no JSON parsing errors)

**test_user_dislike - FAILURE**
- Dislike user when one or more users don't exist 
- Input: email of user to dislike, email of user performing the dislike
    1. assert that status code is not 200 (404 code branch reached implies error was caught)

**test_get_matched**
- Get user's matched list
- Input: email of user's matches to retrieve
    1. assert that returned list is accurate and status code is 200 (200 code branch reached implies no JSON parsing errors)

## Directory Structure
```
.
├── README.md
├── docs                                # documentation
│   ├── front                           # frontend documentation generated from JSDoc
│   │   ├── About.html
│   │   ├── App.html
│   │   ├── App.js.html
│   │   ├── Context.js.html
│   │   ├── ContextProvider.html
│   │   ├── EditInfo.html
│   │   ├── InfoForm.html
│   │   ├── InputForm.html
│   │   ├── Landing.html
│   │   ├── Login.html
│   │   ├── Login.js.html
│   │   ├── Match.html
│   │   ├── MatchInfo.html
│   │   ├── Matched.html
│   │   ├── Matched.js.html
│   │   ├── Meet.html
│   │   ├── Meet.js.html
│   │   ├── Navbar.html
│   │   ├── Navbar.js.html
│   │   ├── NavbarBtn.html
│   │   ├── NotFound.html
│   │   ├── PrivateRoute.html
│   │   ├── PrivateRoute.js.html
│   │   ├── Profile.html
│   │   ├── Profile.js.html
│   │   ├── ProfileModal.html
│   │   ├── QA.html
│   │   ├── SpotifyDataBlock.html
│   │   ├── Tidbit.html
│   │   ├── components_InfoForm.js.html
│   │   ├── components_Landing.js.html
│   │   ├── components_Matched.js.html
│   │   ├── components_Meet.js.html
│   │   ├── components_Navbar.js.html
│   │   ├── components_NotFound.js.html
│   │   ├── components_Profile.js.html
│   │   ├── components_common_About.js.html
│   │   ├── components_common_EditInfo.js.html
│   │   ├── components_common_InputForm.js.html
│   │   ├── components_common_MatchInfo.js.html
│   │   ├── components_common_QA.js.html
│   │   ├── components_common_SpotifyDataBlock.js.html
│   │   ├── components_common_Tidbit.js.html
│   │   ├── fakeAuth.authenticate.html
│   │   ├── fakeAuth.html
│   │   ├── fakeAuth.js.html
│   │   ├── fileUpload.js.html
│   │   ├── fonts
│   │   │   ├── OpenSans-Bold-webfont.eot
│   │   │   ├── OpenSans-Bold-webfont.svg
│   │   │   ├── OpenSans-Bold-webfont.woff
│   │   │   ├── OpenSans-BoldItalic-webfont.eot
│   │   │   ├── OpenSans-BoldItalic-webfont.svg
│   │   │   ├── OpenSans-BoldItalic-webfont.woff
│   │   │   ├── OpenSans-Italic-webfont.eot
│   │   │   ├── OpenSans-Italic-webfont.svg
│   │   │   ├── OpenSans-Italic-webfont.woff
│   │   │   ├── OpenSans-Light-webfont.eot
│   │   │   ├── OpenSans-Light-webfont.svg
│   │   │   ├── OpenSans-Light-webfont.woff
│   │   │   ├── OpenSans-LightItalic-webfont.eot
│   │   │   ├── OpenSans-LightItalic-webfont.svg
│   │   │   ├── OpenSans-LightItalic-webfont.woff
│   │   │   ├── OpenSans-Regular-webfont.eot
│   │   │   ├── OpenSans-Regular-webfont.svg
│   │   │   └── OpenSans-Regular-webfont.woff
│   │   ├── global.html
│   │   ├── helpers.js.html
│   │   ├── index.html
│   │   ├── scripts
│   │   │   ├── linenumber.js
│   │   │   └── prettify
│   │   │       ├── Apache-License-2.0.txt
│   │   │       ├── lang-css.js
│   │   │       └── prettify.js
│   │   └── styles
│   │       ├── jsdoc-default.css
│   │       ├── prettify-jsdoc.css
│   │       └── prettify-tomorrow.css
│   ├── index.html
│   └── main.html                               # backend documentation generated from pdoc
└── src                                         # source code
    ├── back                                    # backend
    │   ├── config.py
    │   ├── conftest.py
    │   ├── main.py
    │   ├── match_pool.py
    │   ├── postman                             # backend Postman tests
    │   │   └── datify.postman_collection.json
    │   ├── requirements.txt
    │   ├── scripts
    │   │   ├── extract.py
    │   │   └── top_artists.py
    │   ├── spotify.py
    │   └── test_main.py
    └── front                                   # frontend
        ├── cypress                             # frontend testing
        │   ├── fixtures
        │   │   └── example.json
        │   ├── integration
        │   │   ├── matched.test.js
        │   │   ├── meet.test.js
        │   │   ├── navbar.test.js
        │   │   └── profile.test.js
        │   ├── plugins
        │   │   └── index.js
        │   └── support
        │       ├── commands.js
        │       └── index.js
        ├── cypress.json
        ├── jsconf.json
        ├── package.json
        ├── public                             # images/logo
        │   ├── EducationIcon.png
        │   ├── LookingIcon.png
        │   ├── favicon.ico
        │   ├── index.html
        │   ├── logo192.png
        │   ├── logo512.png
        │   ├── manifest.json
        │   └── robots.txt
        ├── src                             # frontend source code                 
        │   ├── API_README.md
        │   ├── App.css
        │   ├── App.js                      # App.js performs the routing
        │   ├── App.test.js
        │   ├── Context.js
        │   ├── PrivateRoute.js
        │   ├── components                  # components in this dir
        │   │   ├── InfoForm.js
        │   │   ├── Landing.js
        │   │   ├── Matched.js
        │   │   ├── Meet.js
        │   │   ├── Navbar.js
        │   │   ├── NotFound.js
        │   │   ├── Profile.js
        │   │   ├── common                  # common subcomponents shared between multiple components
        │   │   │   ├── About.js
        │   │   │   ├── EditInfo.js
        │   │   │   ├── InputForm.js
        │   │   │   ├── MatchInfo.js
        │   │   │   ├── QA.js
        │   │   │   ├── SpotifyDataBlock.js
        │   │   │   └── Tidbit.js
        │   │   └── fakeData.json
        │   ├── datifyLogo.png
        │   ├── fileUpload.js
        │   ├── gotham-bold-webfont.woff
        │   ├── gotham-bold-webfont.woff2
        │   ├── gotham-light-webfont.woff
        │   ├── gotham-light-webfont.woff2
        │   ├── helpers.js                   # stores helper functions for Tidbit and QA sections
        │   ├── index.css
        │   ├── index.js
        │   ├── reportWebVitals.js
        │   ├── service-worker.js
        │   ├── serviceWorkerRegistration.js
        │   ├── setupTests.js
        │   └── spotify.js
        └── yarn.lock
```
