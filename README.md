# Workflow
1. Start 1st phase:
    1. deploy initial airdrop (mainnet only)
    1. open registration for 2nd phase
1. end 1st phase:
    1. close registration
    1. sweep unclaimed funds from 1st phase
    1. calculate claim data for 2nd phase on mainnet and xDai
    1. clear all "nextAmount" entries in database
1. start 2nd phase:
    1. deploy airdrops on mainnet and xDai
    1. open registration for 3rd phase
1. end 2nd phase:
    1. close registration
    1. sweep unclaimed funds from 2nd phase
    1. calculate claim data for 3rd phase on mainnet and xDai
    1. clear all "nextAmount" entries in database
1. start 3rd phase:
    1. ...
    
Frontend needs to know what phase we currently in:
- Registration enabled (currentPhaseEnd > now()): 
  - show registration flow
- Registration disabled (currentPhaseEnd < now()):
  - Will there be another phase (nextPhaseStart > 0)? Then show info "We are preparing the next airdrop. Registration for next phase will open in 2h30m"
  - Was this the last phase (nextPhaseStart == 0)? Then show info "Registration is over"

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
