## Setup (recommended)

1. Install:
   npm i -D figact

2. Create `.figactrc` in your project root:
   {
     "personalAccessToken": "FIGMA_TOKEN",
     "fileKey": "FIGMA_FILE_KEY",
     "outDir": "src/styles/figAct"
   }

   Add `.figactrc` to `.gitignore` if it contains secrets.

3. Run:
   npx figact styles --type='FILL'
# figact
