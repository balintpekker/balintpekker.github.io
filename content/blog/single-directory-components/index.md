---
title: Single Directory Components
date: "2023-12-12T18:12:03.284Z"
description: "The Drupal frontend development has long been intricate and demanding, however Drupal 10 introduces a game-changer — Single Directory Components (SDC)."
tags: ["drupal", "frontend", "initiative", "sdc"]
---

The Drupal frontend development has long been intricate and demanding, however Drupal 10 introduces a game-changer — [Single Directory Components (SDC)](https://www.drupal.org/project/sdc).

Today we'll dive into the challenges of Drupal frontend development, explore how other systems handle UI components, and how SDC can change the way we build Drupal websites and applications. __We'll also cover the creating and rendering of the components__.

> [TL;DR; - Jump to the 'How to' section](#how-to-create-a-component)

### Demanding Drupal Frontend

For many developers over the years, working with Drupal themes has been a source of confusion and complexity. The process of attaching libraries in a performance-optimized way — where you only load libraries when the component is used — can be overly complicated. Currently, to be a successful Drupal frontend developer often demands an in-depth understanding of the rendering mechanisms, posing a significant learning curve that shouldn't be necessary.

Other content management systems (like WordPress with its [Block Pattern Directory](https://wordpress.org/patterns/)) have already embraced the concept of components or plugins. These reduce development time and enhance reusability, allowing for a more modular approach and an efficient site-building process.

Imagine a common scenario where a client walks in with a request for a one-pager featuring a jumbotron, news feed, services, latest events showcase, testimonials, and possibly a contact form. Traditionally, developing this from scratch would be a time-consuming process, involving the creation and styling of these components, and the next client could ask for something similar. You would need to do the same tasks over and over again. However, with pre-defined SDC components at hand, the development time can be reduced, with the possibility of using them on different websites with slightly different styling.

This new initiative — which is already an experimental feature of Drupal core _(at the time of writing)_ — has started because many companies already have custom implementations of such components (some use the [UI Patterns](https://www.drupal.org/project/ui_patterns) module, others developed custom components), and standardizing these could help in simplifying the frontend, removing barriers, and possibly luring in more developers, which can mean some contributed components as well.

### What Is SDC

As mentioned above, SDC introduces a standardized structure for organizing frontend components, making them more reusable and easily maintainable. Here are some of the features it offers:

* <ins>_Single Directory Component_ approach</ins>: Everything you need for your component is in the same directory, whether it's `.twig`, `.css`, `.js`, or `.php` files. This approach ensures that there is no unaccounted code in other places in the system related to your components. This results in fewer errors when making changes or deleting a twig file somewhere deep in the code.

* <ins>Cacheable YML plugin definitions:</ins> The team behind SDC decided that components should be plugins to make them cacheable. Therefore, __components will be discovered if__:
  * they are in a directory called `components` in your module or theme (at any depth)
  * and if they have a `my_component.component.yml` file

* <ins>Automated library generation:</ins> Most components will have `.css` and/or `.js` files in the component's folder, and SDC will generate and attach these on the fly.

* <ins>Component API</ins>: SDC uses JSON schema for component definitions to contain their props. While Drupal employs a slightly different approach, the most popular choice is JSON schema for validating JSON and YML data structures. Currently, these schemas for props are optional but can be made required by using `enforce_sdc_schemas: true` in your theme info file.

* <ins>TWIG compatibility</ins>: To print a component, you can use  `include`, `extend`, or `embed` as well. However, SDC somewhat differs from the usual Drupal templates. Drupal uses base hooks to render different constructs like entities, blocks, forms, or views, with different variables available in each of these pre-defined TWIG templates.

  These templates were filled with a lot of variables and HTML, usually resulting in an un-maintainable code. However, SDC does not replace the Drupal templates, the components can be embedded in them, meaning those templates will be significantly shorter.

### How To Create A Component

You can either use the [Component Libraries: Generator](https://www.drupal.org/project/cl_generator) module, which is a CLI tool to help you create components, or you can define them manually. For the sake of better understanding, we'll cover the manual declaration steps:

1. Create a new `/components` directory in your theme or module.
2. Create a new directory within the `/components` folder with the name of your component. For example, if you want to create a __my-button__ component, then the files would be placed in `/components/my-button` folder.
3. Create 2 new files within the component library:
   * A TWIG file with the name of your component (in this case `my-button.twig`)
   * A YAML file with the `*.component.yml` extension that is also named after your component (in this case `my-button.component.yml`)
     * If you do not know what to put in your YML file, you can put `null` in it (especially if you have a linter) or check the [Annotated example](https://www.drupal.org/node/3352951) in Drupal.org
4. <ins>_Optional_</ins>: You can create CSS and JS files associated with your component. (`my-button.css` and `my-button.js`)
5. <ins>_Optional_</ins>: You can also load additional libraries with the `libraryOverrides` key within your component's YML file if needed (for example minified CSS files from a CDN).

So your final directory structure should look something like this:
```
|- my-theme
    |- components
        |- my-button
            |- my-button.twig (required)
            |- my-button.component.yml (required)
            |- README.md
            |- thumbnail.png
            |- my-button.js
            |- my-button.css
            |- assets
                |- img1.png
```

### Props And Slots

Usually, when we needed a component in multiple pages with different types of content, or possibly different styling (like the color of a button), those components were duplicated, and required changes were made in the newer version of the component. This created extra code and overhead for a developer to worry about. Not to mention, if the component needed structural changes, they had to be made as many times as there were component copies in the code. 

The power of SDC is that it separates the component itself from the data passed to it. This means there is no need for duplicating components with the same structure; we just need to change the data passed to it. In SDC, props and slots are the ways to pass data to these components, which can be familiar for Vue and React developers.

##### Requirements For Using Props And Slots

As mentioned in the "[What is SDC](#what-is-sdc)" section, you can enforce the usage of SDC schemas, however by default the content of the YAML file is ignored by the TWIG file. This means, you can have an empty YAML file, and __props and slots could be declared and used in the TWIG template without the requirements of defining it in the YAML file__.

##### How To Use Props

In your Twig you can define your own props as Twig variables, so for example a button would look like:
 ```twig
 my-button.twig
 <a class="{{ btnclass }}" href="{{ link }}">{{ text }}</a>
 ```

The component will be rendered eventually using `include`, `extend` or `embed` in a Twig template, and when that happens the props will be populated. If no props has been given to the component, or that prop is not declared then it would simply be ignored.

* Include without props: `{{ include('my-theme:my-button') }}`
* Include with props: 
  * To include with props, you need to pass the props in a JSON string, therefore your `include` statement would look something like this:
    ```twig
    {{ include('my-theme:my-button', {
      link: 'http://google.com',
      text: 'Google It!',
      btnclass: 'red'
      })
    }}
    ```
    And if you want to include the same component with different props, you can do so:
    ```twig
    {{ include('my-theme:my-button', { link: 'https://www.drupal.org', text: 'Drupal It!', btnclass: 'blue' })}}
    ```

The result (with proper CSS styling on the different classes):
![Google It!, Drupal It!](./my-buttons.png)

### Rendering The Component

You can render components the same 2 ways one would render HTML in Drupal, by using a render array, or TWIG:

##### Using A Render Array

Currently, SDC introduces a render element which we can use called `\Drupal\sdc\Element\ComponentElement`. There is an already fixed [issue](https://www.drupal.org/project/drupal/issues/3365693) to move this to the core namespace, so you might find it under Drupal core. Let's see the code:

```php
$element['my-button'] = [
  '#type' => 'component',
  '#component' => 'my-theme:my-button,
  '#props' => [
    'link' => Url::fromUri('http://google.com', ['absolute' => TRUE])->toString(),
    'text' => $this->t('Google It!'),
    'btnclass' => 'blue',
  ],
  '#slots' => [],
];
```

Props and slots will be passed to your component the same way as you would pass them to a Twig template, only you don't need to implement `hook_theme()`.

##### Using TWIG

It is much simpler to use Twig for rendering the component, you only need to `include` or `embed` it:

```twig
{{ include('my-theme:my-button', {
  text: 'Google It!',
  btnclass: 'blue'
}) }}
```

> Now that we have components we can build a component library. Thanks to [CL Server](https://www.drupal.org/project/cl_server) this is super easy!


### Join The Discussion

To engage with SDC and stay up-to-date with the latest improvements, join the discussion in the [#components](https://drupal.slack.com/archives/C4EDNHFGS) slack channel. Share your experience, learn from others, and contribute to shaping the future of Drupal frontend development.
