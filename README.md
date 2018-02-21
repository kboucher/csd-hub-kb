# BSD Hub Knowledge Base Portlet

This portlet was generated using Xtivia's Jetray portlet generator and written in Angular 4. It has additional dependencies on Liferay's AUI framework and jQuery.

## Build & Deploy (from project root)

This app has dependencies on NodeJs/NPM and requires `gulp` to be installed globally.

`npm install -g gulp`

### Development build

1. `npm install`
2. `gulp build`
3. `gulp deploy`

### Production build

1. `npm install`
2. `gulp prod`
3. `gulp deploy`

## Liferay Configurations

### portal-ext.properties
`javascript.single.page.application.enabled=false`

## Third-party Components

### jsTree jQuery Plugin

The tree-view component utilizes the jsTree jQuery Plugin for basic UI functionality.

https://www.jstree.com/

#### JSON Structure

```
    [{
        "text": "Category Name",
        "id": "categoryID001",          // jsTree appears to require a string
        "image": "CATEGORY_ICON",       // Documents & Images item ID or URL?
        "children": [{                  // Children are additional objects with the same format
            "text": "Category Name",
            "id": "categoryID003",
            "image": "CATEGORY_ICON",
            "children": []              // Leaf nodes have empty array for children
        }, {
            "text": "Category Name",
            "id": "categoryID004",
            "image": "CATEGORY_ICON",
            "children": []
        }]
    }, {
        "text": "Category Name",
        "id": "categoryID002",
        "image": "CATEGORY_ICON",
        "children": []
    }]
```

## Web Service Dependencies

The CSD Hub Knowledge Base portlet requires the csd-hub-lws web-service project for data access.

## Development Notes

### Linter (Extends codelyzer)

`tslint "app/src/**/*.ts"`
<!---
    ### GOGO Shell Telnet
    Connect: `telnet localhost 11311`
    Check modules: `lb|grep kb`
    Uninstall modules: `uninstall [id]`
-->
