# BSD Hub Knowledge Base Portlet

This portlet was generated using Xtivia's Jetray portlet generator and written in Angular 4. It has additional dependencies on Liferay's AUI framework and jQuery.

## Build & Deploy

From project root:

1. `npm install`
2. `gulp build`
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

### Get the Category Tree

`http://{hostname}:{port}/o/kb-rest-api/category/{groupId}/tree/v1/`

### Get Article and Unread Count

`http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/content/{articleId}/v1`

### Get Unread Count

`http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadcount/v1`

### Get Unread Article List

#### With Pagination
`http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/page/{page}/size/{size}/sort/{column}/{asc}/v1`

#### Without Pagination
`http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/sort/{column}/{asc}/v1`

### Get Article List for a Category

#### With Pagination
`http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/page/{page}/size/{size}/sort/{column}/{asc}/v1`

#### Without Pagination
`http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/sort/{column}/{asc}/v1`

## Development Notes

### Linter (Extends codelyzer)

`tslint "app/src/**/*.ts"`
<!---
    ### GOGO Shell Telnet
    Connect: `telnet localhost 11311`
    Check modules: `lb|grep kb`
    Uninstall modules: `uninstall [id]`
-->
