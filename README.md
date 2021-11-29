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

Postman tests must be imported as a collection into Postman in order to run them. They are saved as a JSON file in our repository. Spotify credentials must be imported manually.

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

Virtual env with required dependencies must be active

**Create User from Spotify Token**
- Ensures the logic to parse the json object returned by spotify is accurate and robust

**Other unit tests test the same routes as integration tests**
- Ensures ONLY that the API contract is valid (aka unchanged from a previous valid execution). This is useful when refactoring to ensure there are no service disruptions.
