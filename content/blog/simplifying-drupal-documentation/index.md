---
title: Simplifying Drupal Documentation
date: "2024-04-27T00:58:07.684Z"
description: "Are you new to the world of Drupal, eager to dive into its powerful capabilities, but encountering obstacles in the form of outdated tutorials and confusing documentation? You're not alone. Beginning your Drupal journey can feel like navigating uncharted territory, leaving many feeling frustrated before they even begin."
tags: ["concept", "documentation", "drupal"]
---

Are you new to the world of Drupal, eager to dive into its powerful capabilities, but
encountering obstacles in the form of outdated tutorials and confusing documentation?
You're not alone. Beginning your Drupal journey can feel like navigating uncharted
territory, leaving many feeling frustrated before they even begin.

### The Problem

It often starts with the tutorials provided on Drupal.org. While these aim to
guide beginners through the process of setting up and using Drupal, they often fall short
of delivering a smooth experience. There are outdated instructions, conflicting
information, and a lack of an actual, recommended step-by-step guidance that one could
follow.

For instance, the following guides each seem to have their own issues, in my opinion:
- [Installing Drupal](https://www.drupal.org/docs/getting-started/installing-drupal) -
  While the first chapter advises using one of the recommended [Docker-based solutions](https://www.drupal.org/docs/develop/local-server-setup/docker-based-development-environments-for-macos-linux-and-windows),
  it only offers links to various quickstart guides without providing clear, concise
  instructions. As a result, users are left to navigate multiple sites in search of the
  necessary information, making it difficult to gather just the prerequisites. Installing
  Drupal should not be that hard, and the process should be more straightforward.
- [Drupal User Guide](https://www.drupal.org/docs/user_guide/en/index.html) - While the
  guide offers a thorough explanation of Drupal site building, it lacks the interactive
  experience of navigating through an actual Drupal site. As a result, it primarily serves
  as a valuable resource once you already have Drupal installed. Without that, reading
  through the documentation may not provide the full understanding of its functionality.
- [Docs](https://www.drupal.org/docs) - The documentation includes references to
  multiple guides, such as the 'Installing Drupal' guide mentioned earlier, which we've
  identified as lacking clarity. The guides listed here span various levels of expertise
  covering topics from site building to development tasks. The structure may not
  be well-suited for beginners, as it lacks clear progression for someone who is just
  starting out.

> Of course, you could opt for the one-liner from the [download page](https://www.drupal.org/download) to create the Umami
> demo site, but if your goal is to truly understand Drupal, taking the shortcut might
> leave you feeling like you missed the whole show, not to mention you need PHP and Composer for it to work.

For someone with no prior knowledge of the platform, __choosing which guide to follow
can be challenging__, and make this seemingly simple task feel daunting. Also,
investing time in a process that should be as simple as making toast might leave
you questioning if you accidentally signed up for a crash course in rocket science
instead!

### Possible Solution: Concept and Proposal

What's essential is a beginner-friendly, comprehensive guide — __a single source of truth__
— that provides clear, step-by-step instructions for installing Drupal on your computer,
from start to finish. However, it's not just about having the right instructions. It's also about providing
newcomers with the tools they need to succeed. This is where the Drupal community can
step in and make a real difference.

Lately, some experienced developers are taking their knowledge for granted. It's all
too easy to forget the challenges we faced when we were first starting out with Drupal
and to overlook the struggles of newcomers.

For example, how can you expect your sales team to effectively promote Drupal over other CMS solutions
if they lack insight into Drupal's capabilities? Moreover, how can you address the
inconvenience of developers needing to attend sales meetings to provide answers for
stakeholders? While one solution might involve providing the user guide to your sales team
and encouraging them to read it, the reality is that they may not prioritize doing so.
Even if they do, they won't gain the same level of expertise as someone who actively
navigates through Drupal, exploring the connections between custom content types and
views firsthand. __Sales representatives could more effectively sell products they
understand.__

#### The structure of the SSOT

First, we need __audience identification__, to provide clear sections for both newcomers
and developers, guiding them through the process of getting started or delving deeper
into development aspects.

Once we identified the target audience (and we are targeting the newcomers in this post,
therefore we are not describing the other parts), we can create the most easy, step-by-step
guide by providing tools and commands to install drupal on a local computer.

![concept_for_documentation.png](concept_for_documentation.png)

As one can see, there are already some recommendations present in both the current
documentation on Drupal.org's docker-based tutorial and the proposed concept above.
However, this presents a challenge as it lacks a straightforward solution, leaving
the task of deciding between options like Lando or DDEV, which can be overwhelming
without prior experience. ("Am I choosing the right one?")

If the Drupal community were to take a more decisive approach and collectively opt
for one of these solutions, we could establish a streamlined process that guides
users through a step-by-step local Drupal installation.

The primary question at hand is: Who bears the responsibility for making that decision?

#### Example

Create your local environment on MacOS with Lando, following the concept above:

1. Prerequisites (Tooling and environment)
    * __Install Homebrew__  
      Open your terminal by pressing "Cmd+Space" to open
      Spotlight search, and typing 'Terminal' then hitting return. Then, copy
      and paste the following script and hit enter:
      ```cli
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      ```
      The script will start to download [Homebrew](https://brew.sh/), which is a package manager for macOS.
    * __Get PHP__  
      For the next part, we'll need [PHP](https://www.php.net/), so use the Terminal again, and the previously
      downloaded homebrew to download PHP with the following script:
      ```cli
      brew install php
      ```
    * __Get Composer__  
      In your Terminal, copy and paste the following to download [Composer](https://getcomposer.org/), which is a dependency
      manager for PHP:
      ```cli
      php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
      php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
      php composer-setup.php
      php -r "unlink('composer-setup.php');" 
      ```
    * __Download OrbStack__
      Using your Terminal and Homebrew again, install [OrbStack](https://orbstack.dev/) to be able to run Docker
      containers:
      ```cli
      brew install orbstack
      ```
      Once installed, you should open it the same way you are opening the Terminal, with spotlight search (CMD+Space). There is nothing else you need to do, we just need it to run in the backgorund.
    * __Install Lando__
      Install the local development environment tool called [Lando](https://lando.dev/), which is built on Docker, and will help us
      create our docker-based Drupal installation:
      ```cli
      brew install --cask lando
      ```
2. Download and Install Drupal (Installation Script)
    * Run the following commands after each other in your Terminal
      ```cli
      cd ~
      ```
      ```cli
      mkdir my-first-drupal10-app \
        && cd my-first-drupal10-app \
        && lando init \
           --source cwd \
           --recipe drupal10 \
           --webroot web \
           --name my-first-drupal10-app
      ```
      ```cli
      lando composer create-project drupal/recommended-project:10.0.x-dev@dev tmp && cp -r tmp/. . && rm -rf tmp
      ```
      ```cli
      lando start
      ```
      ```cli
      lando composer require drush/drush
      ```
      ```cli
      lando drush site:install --account-name=admin --account-pass=admin --db-url=mysql://drupal10:drupal10@database/drupal10 -y
      ```
      ```cli
      lando start
      ```
      At the end, you should be provided with some URLs, on which you can reach your installed, locally running Drupal site. 
       * https://my-first-drupal10-app.lndo.site/

      To log in and start exploring, you can use the following credentials:
       * Username: admin
       * Password: admin

### Thoughts

First of all, I don't want to discourage those updating the guides; __they are doing an
awesome work__, and I truly appreciate their efforts, which reflect the spirit of the
open-source community. My focus is solely on enhancing the existing guides to draw more
people to Drupal, without causing offense to anyone in the process. I strongly believe small adjustments
such as these, coupled with initiatives like the Project Browser and Automatic Updates,
have the potential to make Drupal bigger and more impactful than ever before.
