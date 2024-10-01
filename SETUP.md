# Steps to setup the repo locally

1. Fork the repo into your account
2. Clone the forked repo and open in terminal

```bash
git clone <your_forked_repo_url>
```

2. Check whether upstream is set successfully by running:

   ```
   git remote
   ```
3. If upstream is not found, add upstream with this command:

   ```
   git remote add upstream https://github.com/Varun-Kolanu/issue-assigner.git
   ```
4. Fetch the code from remote:

   ```
   git fetch --all
   ```
5. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

    Now, open http://localhost:3000 in the browser

## For New contributors to the repo:

4. Click on `Register GitHub app` button and create an app by following the instructions from GitHub. Recommended approach is to create a private test repo and install the app into that repo.
5. The required environment variables will be created automatically in the .env root file
6. Restart the server by closing the terminal, opening again and running 	`npm run dev` to start the server.
7. The server has been setup successfully! Pat on your back :)

## Old contributors:

If you have already made an app in your github account and want tp use the same app again:

4. Click on `or Use an existing GitHub app` to open the setup page
5. As said in its step 1, copy the given Webhook URL into your GitHub app's Webhook URL
6. Fill the App Id, Webhook secret fields with the info of your existing GitHub app
7. Create a New private key in the app settings and select that downloaded file in Private key field
8. Submit and you can see .env created for you in the repo's root
9. If you can't see GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET fields filled, add them manually from your GitHub app
10. Restart the server. Server setup successful! Good job :)

### Note

- If you get the error that PORT is already in use, create a PORT=3001 field in .env and restart the server. Our app automatically uses that PORT field to start at the desired port.
