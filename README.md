# BSD Hub Knowledge Base Portlet

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
