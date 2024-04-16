---
title: "Enhancing Drupal with GitHub Actions"
date: "2024-04-16T10:49:12.123Z"
description: "When it comes to Drupal development, GitHub Actions offers invaluable assistance
in automating repetitive tasks, standardizing your processes, and enhancing code
quality. By defining workflows as code in YAML files that can react to various events,
it provides flexible customization and scalability. Pre-built actions can handle
common tasks like building and testing code, while custom actions can be tailored to
project-specific requirements. Let's explore some of the best practices along with
examples of actions you could use in your next Drupal project."
tags: ["actions", "drupal", "github", "tests"]
---

When it comes to Drupal development, GitHub Actions offers invaluable assistance
in automating repetitive tasks, standardizing your processes, and enhancing code
quality. By defining workflows as code in YAML files that can react to various events,
it provides flexible customization and scalability. Pre-built actions can handle
common tasks like building and testing code, while custom actions can be tailored to
project-specific requirements. Let's explore some of the best practices along with
examples of actions you could use in your next Drupal project.

> [TL;DR; - Jump to the 'Let's get into action' section](#lets-get-into-action)

### What to Expect From This Article

By the end of this post, you'll have a fully-equipped Drupal project which uses
actions to automate and enforce the usage of Drupal coding standards and detects bugs
before they reach production through PHPStan and PHPUnit tests.

_Note: This post focuses on implementing and optimizing actions within your Drupal
workflow. For in-depth understanding of how the platform works,
please read the [documentation](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)._

### Why GitHub actions?

Mostly, __because it's free for both public and private repositories__
(with free accounts getting [500 Mb storage and 2,000 minutes monthly](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions#included-storage-and-minutes)), making it
accessible to all developers. It also provides real-time feedback to catch issues early,
and __allows for reuse of workflows and actions across several projects__, saving time while
promoting consistency. You could have various Drupal projects using the same
process(es) for testing, validating or building an artifact, the limit is the sky.
Moreover, its integration with [GitHub's package and container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#about-the-container-registry)
offers a comprehensive suite of tools that align well with the needs of a Drupal project.

### The Basics

#### Action

An action is a reusable piece of code or script designed to execute a specific task,
like installing dependencies with Composer. Typically written in YAML format (and
stored in `.github/actions`, actions can be easily integrated into workflows,
automating tasks and reducing action runtime to conserve those free minutes. They
promote code reuse and maintainability by centralizing common logic, __eliminating
the need to modify every workflow individually when adjustments needed__, such as
changing the PHP version. Actions serve as building blocks for constructing a
robust and powerful workflow.

#### Workflow

Workflows are also defined using YAML syntax and must be stored in the `.github/workflows`
directory within your repository. The key aspect of the design involves
defining the events that trigger the workflow's execution. These include a
wide range of actions like pushes to the repository, pull request related events,
issue comments, and [many more](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
This customisation allows developers to ensure automated tasks are triggered precisely
when needed.

> For example, you could save minutes of runtime on a free account by not running
> the workflow [until a pull request is approved](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#running-a-workflow-when-a-pull-request-is-approved).

It begs for the question: Why would anyone opt for manual code review, consuming
valuable man-hours, just to know once they reviewed the code the tests could still
fail. It is unnecessary. However, we have the option to generate artifacts for a
staging environment only after the successful execution of tests, and approval of
the code review. This approach ensures that the application is built on a solid
foundation, minimizing the risk of deploying flawed code to production.

Understanding and configuring the triggers is crucial for tailoring workflows to suit
specific project requirements, ensuring efficient automation processes.

### Let's get into action

Our main objective is to subject every opened pull request to a series
of assessments, including PHPCS, PHPStan analysis and PHPUnit tests. However, we
prefer not to test draft pull requests. Additionally, there might be instances
where we prefer to manually initiate tests for a pull request before commencing
the code review process. Fortunately, we have the flexibility to accommodate both
approaches, making sure our testing strategy aligns with our project's specific needs
and workflows.

> To run PHPCS, PHPUnit and PHPStan, the necessary packages should be listed in your
> repository's `composer.json` file if you are following along. You could require the packages directly in the GitHub action using the global
> Composer, but we aim to use project specific settings. For this, it is
> recommended to use [drupal/core-dev](https://packagist.org/packages/drupal/core-dev)

Our workflow for all opened pull requests consists of the following:
* Running a PHP setup with a pre-defined version
* Validating composer.json and installing dependencies
* Running PHPCS, PHPStan and PHPUnit

> The full configuration can be found [here](https://github.com/balintpekker/drupal-template), in a Drupal Recommended Template capable of running with both Lando and DDEV. You are free to fork, copy, or do anything with the repository.

### The composite action

[(What is a composite action?)](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action)

In the repository linked above, you'll find a [composite action]((https://github.com/balintpekker/drupal-template/blob/main/.github/actions/composer/action.yml)) detailed in `.github/actions/composer/action.yml`. Composite actions, as mentioned earlier, are reusable components in a workflow. They eliminate the need for redundant code, thus simplifying maintenance efforts. This action accomplishes two main tasks:

* It configures PHP with a predetermined version (you can conveniently adjust this version using GitHub environment variables via the UI).
* It validates composer.json and installs dependencies.

This functionality is beneficial for our workflow as it enables us to utilize the packages installed via Composer later.

The action uses inputs for PHP and Composer version with default values provided:

```yaml
inputs:
  php_version:
    description: "PHP Version to run."
    default: "8.2"
  composer_version:
    description: "Composer version to run."
    default: "2"
```

and then it runs the steps based on these values listed above:

```yaml
runs:
  using: "composite"
  steps:
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        # Using the php_version input here.
        php-version: ${{ inputs.php_version }}
        extensions: gd

    - name: Validate composer.json
      shell: bash
      run: composer validate --no-check-all

    - name: Check composer.lock
      shell: bash
      run: |
        composer install --dry-run
        if [ $? -ne 0 ]; then
          echo "composer.lock is out of date. Please run 'composer update' to generate an updated lock file."
          exit 1
        fi

    - name: Install dependencies via composer
      uses: "php-actions/composer@v6"
      env:
        COMPOSER: "composer.json"
      with:
        # Using both inputs here.
        php_version: ${{ inputs.php_version }}
        version: ${{ inputs.composer_version }}
        args: "--ignore-platform-reqs --optimize-autoloader"
```

### The workflow

The workflow for running the tests [can also be found in the repository](https://github.com/balintpekker/drupal-template/blob/main/.github/workflows/tests.yml), located at `.github/workflows/tests.yml`. It consists of three jobs, one for each of the commands:

#### PHPCS

```yaml
jobs:
  run-phpcs:
    runs-on: ubuntu-latest
    # Disabling the job for Draft pull requests.
    if: github.event.pull_request.draft == false
    # Setting GitHub token to use GitHub CLI.
    env:
      GH_TOKEN: ${{ github.token }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Using our custom composite action to run composer checks and composer install.
      - name: Composer validate and install
        uses: ./.github/actions/composer
        id: composer
        with:
          php_version: ${{ env.PHP_VERSION }}
          composer_version: ${{ env.COMPOSER_VERSION }}

      # We are using phpcs.xml.dist from the project root to determine --extension list, ignores and Drupal,
      # DrupalPractice standards.
      - name: Run PHPCS on Pull Request Files
        run: |
          gh pr diff ${{ github.event.number }} --name-only | xargs find 2> /dev/null | xargs vendor/bin/phpcs -nq
```

As can be seen, the second step of the PHPCS job utilizes our previously defined custom composite action, helping us with the package installation process, thereby facilitating the use of PHPCS in the next step.

Following that, the step employs the `gh pr diff` command, a GitHub CLI command utilized to examine the modified files in the PR (as we do not want to run PHPCS for all the files in the repository). To enable this functionality, we've incorporated an environment variable `GH_TOKEN`, necessary for GitHub CLI operations.

Also, it is important to note that we rely on the repository's [phpcs.xml.dist](https://github.com/balintpekker/drupal-template/blob/main/phpcs.xml.dist) configuration to specify various parameters. This configuration dictates the extensions to be checked, specifies exclusions, defines the standards to adhere to (such as Drupal and DrupalPractice), and determines the folders subject to examination (although this aspect is irrelevant in this scenario).

#### PHPStan

PHPStan also relies on its own configuration file located at [phpstan.neon](https://github.com/balintpekker/drupal-template/blob/main/phpstan.neon), which contains distinct rules not elaborated on in this article. In our workflow, we execute the `analyse` command for the entire codebase to identify any deprecations or errors. While it's possible to analyze only the changes in a PR, for the sake of this example, we opt to analyze the entire codebase. However, it's important to note that __this approach is not recommended__, especially for large repositories, due to the considerable time it consumes. Alternatively, you can customize the phpstan.neon file to include specific paths or adjust the action based on the example provided above to analyze only the files modified in the PR.

```yaml
jobs:
  run-phpstan:
    runs-on: ubuntu-latest
    # Disabling the job for Draft pull requests.
    if: github.event.pull_request.draft == false
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Using our custom composite action to run composer checks and composer install.
      - name: Composer validate and install
        uses: ./.github/actions/composer
        id: composer
        with:
          php_version: ${{ env.PHP_VERSION }}
          composer_version: ${{ env.COMPOSER_VERSION }}

      - name: Run PHPStan analysis
        run: vendor/bin/phpstan analyse
```

#### PHPUnit

The unit test segment closely resembles the PHPStan section, with the distinction that it targets the 'Unit' testsuite specified in the repository's [phpunit.xml.dist](https://github.com/balintpekker/drupal-template/blob/main/phpunit.xml.dist) file.  This configuration directs the script to locate test files accordingly. In our scenario, the repository features an [ExampleTest](https://github.com/balintpekker/drupal-template/blob/main/tests/src/Unit/ExampleTest.php) class containing a simple true assertion, serving to validate the proper execution of the action.

```yaml
jobs:
  run-phpunit:
    runs-on: ubuntu-latest
    # Disabling the job for Draft pull requests.
    if: github.event.pull_request.draft == false
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Using our custom composite action to run composer checks and composer install.
      - name: Composer validate and install
        uses: ./.github/actions/composer
        id: composer
        with:
          php_version: ${{ env.PHP_VERSION }}
          composer_version: ${{ env.COMPOSER_VERSION }}

      # We are using phpunit.xml.dist from the project root to determine the directory of the 'Unit' testsuite,
      # in this case 'tests/Unit'.
      - name: Run unit tests
        run: vendor/bin/phpunit --testsuite Unit
```

Additionally, you can discover [two pull requests](https://github.com/balintpekker/drupal-template/pulls) within the repository, showcasing both a failing and a successful action for the tests. These PRs serve as demonstrations, allowing you to observe how the process unfolds and understand the underlying concept.

### Thoughts

Using GitHub Actions with Drupal is incredibly user-friendly, making continuous integration and deployment a breeze. It is free for a given amount of minutes, and the ability to reuse actions shared by the community saves time and effort. Additionally, GitHub Actions offer the functionality to generate artifacts, suitable for deployment on shared hosting providers. Hence, while valuable, we opted not to include it in this article due to its need for project customization.
