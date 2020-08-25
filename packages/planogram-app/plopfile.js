module.exports = function(plop) {
  // create your generators here
  plop.setGenerator('dot-env', {
    description: 'dot-env file generator',
    prompts: [
      {
        type: 'input',
        name: 'build',
        message: 'enter the build type(development/production)',
      },
      {
        type: 'input',
        name: 'dotenv',
        message: 'dotenv',
      },
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: '.env.{{dotenv}}',
        force: true,
        templateFile: 'plop-templates/dot-env/env.{{build}}.hbs',
      },
    ], // array of actions
  });
};
