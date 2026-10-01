# QA R&D Lab

A free, static browser automation practice playground for QA engineers. The site is framework-neutral: complete the exercises with Playwright, Selenium, Cypress, or another browser automation tool.

## Features

- Inputs: common fields and editable, readonly, and disabled states
- Selections: radio groups, checkboxes, and native dropdowns
- Buttons: enabled, disabled, and state-changing controls
- Forms: local registration form with validation feedback
- Tables: stable sample data with search, sorting, and row actions
- Dynamic elements and dialogs: visibility, bounded loading, changing state, modal, toast, and browser confirmation
- Responsive, keyboard-accessible single-page navigation

All exercise data and behavior run in the browser. There is no backend, account, or data persistence. Reloading restores the initial exercise state.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Local development

```sh
npm install
npm run dev
```

Create and serve a production build locally:

```sh
npm run build
npm run preview
```

## Deployment to GitHub Pages

The included GitHub Actions workflow builds and deploys `main` to GitHub Pages using `/qa-r-and-d-lab/` as the project-site base path. After pushing the repository, enable GitHub Pages in **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.

For a differently named GitHub Pages project site, configure the build base path to match the repository name:

```powershell
$env:VITE_BASE_PATH = "/qa-r-and-d-lab/"
npm run build
```

For a user/organization site served from the domain root, the default `/` base path is appropriate. For a user/organization site served from the domain root, the default `/` base path is appropriate.

## Practice approach

Each exercise provides a task and a visible result to verify. No framework-specific solution code is included, so learners can choose their own automation tool and locator strategy. Core scenarios use stable data and bounded timing to keep automation repeatable.
