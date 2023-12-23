---
title: Attributes In Drupal
date: "2023-12-18T13:01:03.284Z"
description: "Drupal 10.2 is out, with an easier content management by improving user experience, and with some performance improvements in caching and HTTP responses. It is also compatible with PHP 8.3, and it started using PHP attributes."
tags: ["attributes", "doctrine", "php", "drupal"]
---

[Drupal 10.2](https://www.drupal.org/project/drupal/releases/10.2.0) is out, with an easier content management by improving user experience, and with some performance improvements in caching and HTTP responses. It is also compatible with PHP 8.3, and it started using PHP attributes.

> [TL;DR; - Jump to the 'How to' section](#how-does-the-code-change)

### What are attributes in PHP?

They introduce a flexible and standardized approach to add metadata to your code — similar to Doctrine annotations —, enhancing readability and documentation. Attributes are declared using the `#[...]` syntax, positioned above the element to which you want to attach them. These can also take arguments, allowing you to convey specific information. For instance:

```php
#[ExampleAttribute('argument')]
class ExampleClass {
    // Class code here.
}
```

To retrieve information about a class which is using attributes, the [Reflection API](https://www.php.net/manual/en/book.reflection.php) comes to the rescue. Using its `getAttributes()` method, you'll find yourself with an array of [ReflectionAttribute](https://www.php.net/manual/en/class.reflectionattribute.php) objects:

```php
$class = new ReflectionClass(ExampleClass::class);
$attributes = $class->getAttributes();

/** @var \ReflectionAttribute $attribute */
foreach ($attributes as $attribute) {
    $name = $attribute->getName(); // 'ExampleAttribute'
    $arguments = $attribute->getArguments(); // ['argument'] 
}
```

Drupal uses a new class to parse attributes (e.g. from a Block plugin) based on this API, which we will talk about later.

##### Handling Sensitive Data (Use Case)

In PHP 8.2 a new attribute called [`#[\SensitiveParameter]`](https://www.php.net/manual/en/class.sensitiveparameter.php) has been introduced. This attribute proves to be invaluable when dealing with sensitive information in stack traces generated for exceptions. It allows for the redaction of specific parameters, such as passwords, ensuring enhanced security when debugging, or when looking at logs.

> Note: Since PHP 7.4 the `zend.exception_ignore_args = On` setting is available for use which allows to include or exclude arguments from stack traces generated for exceptions.

For example, PDO uses the `$password` as a constructor parameter, and immediately tries to connect to the database. When this fails, the stack trace will include the password:

```
PDOException: SQLSTATE[HY000] [2002] No such file or directory in /var/www/html/test.php:3
Stack trace:
#0 /var/www/html/test.php(3): PDO->__construct('mysql:host=loca...', 'root', 'password')
#1 {main}
```

When those sensitive parameters are marked by the new attribute, their value will be redacted, meaning instead of `'password'`, we should receive an __`Object(SensitiveParameterValue)`__ in the stack trace.

_More information about the attribute can be found in the [RFC](https://wiki.php.net/rfc/redact_parameters_in_back_traces)._


### Why Change From Doctrine Annotations?

Doctrine Annotations are primarily used by [Doctrine ORM](https://github.com/doctrine/orm), and they already started to migrate to PHP attributes. Consequently, __annotations might face deprecation sooner or later__. Given that Drupal utilizes Doctrine Annotations solely for metadata, and with PHP 8 providing a built-in approach for this purpose (further enhanced by PHP 8.1 readonly properties), Drupal has the option to remove the dependency on Doctrine Annotations for good.

##### Does this mean I can't use annotations anymore?

Drupal 10.2 lets you use attributes to declare custom classes, methods, parameters, properties or constants, but it does not explicitly use them to maintain backwards compatibility. This means contributed and custom modules can start migrating their code, aligning with the evolving standards (something that Drush 11 already did) before Drupal 11.

This change will lead to:
* Possibly a deprecated [AnnotatedClassDiscovery](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Component/Annotation/Plugin/Discovery/AnnotatedClassDiscovery.php) removed in Drupal 11.
* __A new [AttributeClassDiscovery](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Component/Plugin/Discovery/AttributeClassDiscovery.php) using Reflection API to find plugins with attributes__ (introduced in Drupal 10.2) - There is [an active Drupal 11 issue](https://www.drupal.org/project/drupal/issues/3395260) to investigate possibilities on how to improve performance by using something different than the Reflection API.


### How does the code change

Let's see Drupal Core's `PageTitleBlock` for our example, which [in Drupal 10.1, uses annotations](https://git.drupalcode.org/project/drupal/-/blob/10.1.x/core/lib/Drupal/Core/Block/Annotation/Block.php):

```php
<?php

namespace Drupal\Core\Block\Plugin\Block;

use ...

/**
 * Provides a block to display the page title.
 *
 * @Block(
 *   id = "page_title_block",
 *   admin_label = @Translation("Page title"),
 *   forms = {
 *     "settings_tray" = FALSE,
 *   },
 * )
 */
class PageTitleBlock extends BlockBase implements TitleBlockPluginInterface {

```

However, [in Drupal 10.2 it uses PHP attributes](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Core/Block/Attribute/Block.php).

```php
<?php

namespace Drupal\Core\Block\Plugin\Block;

use ...

/**
 * Provides a block to display the page title.
 */
#[Block(
  id: "page_title_block",
  admin_label: new TranslatableMarkup("Page title"),
  forms: [
    'settings_tray' => FALSE,
  ]
)]
class PageTitleBlock extends BlockBase implements TitleBlockPluginInterface {

```

The [change record](https://www.drupal.org/node/3395575) says currently all Actions and Blocks are converted to use attributes, but what if I am a contrib/custom module developer and I define custom plugins?

If we carefully inspect the `DefaultPluginManager` in Drupal 10.2, we notice there is a new constructor parameter called `$plugin_definition_attribute_name` which is initially `NULL`. This means, you'll need to add a new parameter to the parent constructor call (at least until `$plugin_definition_annotation_name` parameter is still in use and not deprecated.)

If we check the `BlockManager` class, you can see the parent constructor call uses __`Block::class`__ as the __5th parameter__ in 10.2

```php
// Before Drupal 10.2
parent::__construct('Plugin/Block', $namespaces, $module_handler, 'Drupal\Core\Block\BlockPluginInterface', 'Drupal\Core\Block\Annotation\Block');

// After
parent::__construct('Plugin/Block', $namespaces, $module_handler, 'Drupal\Core\Block\BlockPluginInterface', Block::class, 'Drupal\Core\Block\Annotation\Block');
```

This parameter is then stored in the `$pluginDefinitionAttributeName` property, and that gets used later in the `getDiscovery()` method of [DefaultPluginManager](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Core/Plugin/DefaultPluginManager.php#L290).

As you can see, this method then decides if it should use:
* [AttributeDiscoveryWithAnnotations](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Core/Plugin/Discovery/AttributeDiscoveryWithAnnotations.php)
* [AttributeClassDiscovery](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Core/Plugin/Discovery/AttributeClassDiscovery.php)
* [AnnotatedClassDiscovery](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Core/Plugin/Discovery/AnnotatedClassDiscovery.php)
* or [ContainerDerivativeDiscoveryDecorator](https://git.drupalcode.org/project/drupal/-/blob/10.2.x/core/lib/Drupal/Core/Plugin/Discovery/ContainerDerivativeDiscoveryDecorator.php)

### Thoughts

When creating new plugins from now on, developers should primarily focus on using Attributes in the plugin definitions instead of Doctrine Annotations and ensuring that the appropriate parameters are included in the parent constructor call. The good news is that the process of registering the plugin in the `services.yml` file remains unchanged, allowing the developers to continue using `parent: default_plugin_manager`.

While the changes may seem subtle, the adoption of PHP attributes opens up new possibilities leading to a more standardized, advanced way of code organization and metadata handling.
