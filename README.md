## Tentative Description:

A webapp/PWA dating app (frontend in React, backend in FastAPI) that uses a collaborative filtering ML layer to match users based on the their top artists and songs (provided by the Spotify API).

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
