## Tentative Description:

A webapp/PWA dating app (frontend in React, backend in FastAPI) that uses a collaborative filtering ML layer to match users based on the their top artists and songs (provided by the Spotify API).

### Running
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

### Documentation
You can find our documentation at our [GitHub Pages](https://jho44.github.io/YouDate/)!

### Test Scenarios
#### Frontend (via Cypress)
*Cypress setup thanks to Zifan, from another project*

**Navbar**
- Navigate to profile page via navbar button
    1. click on button corresponding to Profile page on navbar
    2. assert that a Login button exists on the resulting page after navigation

**Profile**
- Profile page requires login (fake for now)
    1. click on button corresponding to Profile page on navbar
    2. click on the Login button on the resulting page after navigation
    3. assert that the resulting page after logging in has a "Favorite Artists" section

- Toggle Delete Account Confirmation modal open
    1. click on button corresponding to Profile page on navbar
    2. click on the Login button on the resulting page after navigation
    3. click on the "Delete Account" button/switch
    4. assert that the modal popped up

- Toggle Delete Account Confirmation modal closed
    1. click on button corresponding to Profile page on navbar
    2. click on the Login button on the resulting page after navigation
    3. click on the "Delete Account" button/switch
    4. click on the "Cancel" button
    5. assert that the modal is gone
    6. assert that the "Delete Account" switch is switched off

**Matched**
- Matched page requires login and renders dummy matches
    1. click on button corresponding to Matches page on navbar
    2. click on the Login button on the resulting page after navigation
    3. assert the resulting page after logging in has 1 div with class `container`
    4. assert the resulting page has the word "Matches"
    5. assert that there are 8 dummy matches

- Open Delete Match modal
    1. click on button corresponding to Matches page on navbar
    2. click on the Login button on the resulting page after navigation
    3. click on Delete Match button on first match
    4. assert that an Ant Design modal opened with the words "Delete Match" in it

- Close Delete Match modal
    1. click on button corresponding to Matches page on navbar
    2. click on the Login button on the resulting page after navigation
    3. click on Delete Match button on first match
    4. click on the Cancel button
    5. assert that the Ant Design modal is gone

**Meet**
- Meet page requires login
    1. click on button corresponding to Meet page on navbar
    2. click on the Login button on the resulting page after navigation
    3. assert the resulting page after logging in has the words "Artists in Common"

#### Backend (Integration tests via Postman)

Postman tests must be imported as a collection into Postman in order to run them. They are saved as a JSON file in our repository.

**Create Artist**
- Create a valid test artist
    1. assert that response code is 200
    2. assert that the artist name is returned

**Create User**
- Create a valid, previously unseen user
    1. assert that response code is 200
    2. assert that the user data is correct

**Create User from Spotify Profile**
- Create a valid, previously unseen user from their Spotify credentials
    1. assert that response code is 200
    2. assert that user data matches the user data of the test Spotify user

**Delete User**
- Delete a created user
    1. assert that response code is 200
    2. assert that the user is deleted

#### Backend (Unit tests via Pytest and Monkeypatch)

Virtual env with required dependencies must be active

**Create User from Spotify Token**
- Ensures the logic to parse the json object returned by spotify is accurate and robust

**Other unit tests test the same routes as integration tests**
- Ensures ONLY that the API contract is valid (aka unchanged from a previous valid execution). This is useful when refactoring to ensure there are no service disruptions.
