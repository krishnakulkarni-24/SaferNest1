# SaferNest API Documentation

Base URL: `http://localhost:8081/api`

Auth header for secured routes:
`Authorization: Bearer <JWT_TOKEN>`

## Auth

### POST /auth/register
Registers a user.

Request body:
```json
{
  "name": "Sameer",
  "email": "sameer@example.com",
  "password": "Pass@123",
  "phone": "9999999999",
  "role": "CITIZEN"
}
```

### POST /auth/login
Logs in and returns JWT.

Request body:
```json
{
  "email": "sameer@example.com",
  "password": "Pass@123"
}
```

## Incidents

### POST /incidents
Roles: CITIZEN, AUTHORITY, ADMIN

### GET /incidents
Roles: Any authenticated user

### PUT /incidents/{id}/status
Roles: AUTHORITY, ADMIN

Body:
```json
{ "status": "IN_PROGRESS" }
```

## Resources

### POST /resources
Roles: AUTHORITY, ADMIN

### GET /resources
Roles: Any authenticated user

## Tasks

### POST /tasks
Roles: AUTHORITY, ADMIN

### GET /tasks
Roles: Any authenticated user

### PUT /tasks/{id}/assign
Roles: AUTHORITY, ADMIN, VOLUNTEER

Body:
```json
{ "volunteerId": "<uuid>" }
```

## Requests

### POST /requests
Roles: CITIZEN, VOLUNTEER, AUTHORITY, ADMIN

Body:
```json
{ "resourceId": "<uuid>" }
```

### GET /requests
Roles: AUTHORITY, ADMIN

## Real-time Updates

WebSocket endpoint: `/ws` (SockJS + STOMP)

Topic subscription:
- `/topic/updates`

Event types:
- `NEW_INCIDENT`
- `INCIDENT_STATUS_UPDATED`
- `TASK_CREATED`
- `TASK_ASSIGNED`

## AI

### POST /ai/summarize
Roles: AUTHORITY, ADMIN

Request body:
```json
{
  "reports": [
    "Flood water entered houses in area A",
    "People stuck on rooftops",
    "Rescue boats needed urgently"
  ]
}
```

Response body:
```json
{
  "summary": "Severe flooding has affected multiple areas, leaving people stranded. Immediate rescue operations are required."
}
```
