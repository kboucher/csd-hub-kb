# BSD Hub Knowledge Base Portlet

This portlet was generated using Xtivia's Jetray portlet generator and written in Angular 4. It has additional dependencies on Liferay's AUI framework and jQuery.

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

## Articles List

### JSON Structure
```
[{
	"title": "First Article Title",
	"id": 1,
	"body": "BODY TEXT HERE", // can be empty for list call
	"date": "Thu Nov 16 2017"
}, {
	"title": "Second Article Title",
	"id": 2,
	"body": "BODY TEXT HERE",
	"date": "Thu Nov 16 2017"
}, {
	"title": "Third Article Title",
	"id": 3,
	"body": "BODY TEXT HERE",
	"date": "Thu Nov 16 2017"
}, {
	"title": "Fourth Article Title",
	"id": 4,
	"body": "BODY TEXT HERE",
	"date": "Thu Nov 16 2017"
}, {
	"title": "Fifth Article Title",
	"id": 5,
	"body": "BODY TEXT HERE",
	"date": "Thu Nov 16 2017"
}]
```

## Web Service Dependencies

### Get unread count

http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadcount/{userId}/v1

Example: http://localhost:8080/o/kb-rest-api/article/0/unreadcount/20120/v1

### Get unread article list:

http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/{userId}/page/{page}/size/{size}/v1
http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/{userId}/v1

Example: http://localhost:8080/o/kb-rest-api/article/20143/unreadarticle/50201/v1
Example: http://localhost:8080/o/kb-rest-api/article/20143/unreadarticle/50201/page/1/size/10/v1

### Get the category tree

http://{hostname}:{port}/o/kb-rest-api/category/{groupId}/tree/v1/

Example: http://localhost:8080/o/kb-rest-api/category/20143/tree/v1/

### Get article list for a category

http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryUuid}/page/{page}/size/{size}/v1

Example: http://localhost:8080/o/kb-rest-api/article/20143/category/22bf2b0d-5aa1-8680-ca13-e5542f25e98f/page/1/size/10/v1

## Development notes

### GOGO Shell Telnet
Connect: `telnet localhost 11311`
Check modules: `lb|grep kb`
Uninstall modules: `uninstall [id]`
