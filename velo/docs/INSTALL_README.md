Como instalar

instalar cursor
instalar node
instalar supabase

acessa a pasta velo
yarn install

Configurar o arquivo .env da pasta Velo com os dados de Connect - Framework do Supabase

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY


Rodar a aplicação
yarn dev


Comandos básicos para rodar testes

  yarn playwright test
    Runs the end-to-end tests.

  yarn playwright test --ui
    Starts the interactive UI mode.

  yarn playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  yarn playwright test example
    Runs the tests in a specific file.

  yarn playwright test -g 'webapp deve estar online'
    Runs the tests with an especific scneario.

  yarn playwright test --debug
    Runs the tests in debug mode.

  yarn playwright test --debug -g 'webapp deve estar online'
    Runs the tests in debug mode with an especific scneario.

  yarn playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    yarn playwright test