![Description]("resources/system_design.png")

# CodeRoom — Real-Time Collaborative Coding Platform

## Overview

CodeRoom is a real-time collaborative coding platform that allows users to:
- create coding sessions instantly
- share collaborative links
- edit code together live
- execute code securely in isolated sandbox containers

The initial MVP focuses on:
- anonymous collaboration
- Python execution
- low-latency websocket synchronization
- lightweight session-based architecture

Future versions may support:
- authentication
- multi-language execution
- persistent accounts
- permissions/roles
- AI-assisted coding
- code history/versioning

---

# Core Features

## Real-Time Collaborative Editing
Multiple users can edit the same document simultaneously.

Features:
- live code synchronization
- cursor tracking
- concurrent typing
- websocket-based communication

---

## Anonymous Session Sharing
Users can generate shareable collaborative coding rooms without signing in.

Example:

```text
coderoom.dev/s/abc123
```

---

## Secure Code Execution
Users can execute code in isolated sandbox environments.

Initial support:
- Python

Future support:
- Java
- C++
- Go
- Rust
- JavaScript

---

# Functional Requirements

- User can generate a collaborative coding session
- Users can share session links
- Multiple users can edit concurrently
- Changes should appear in real time
- Users can compile/run code
- Users cannot edit while execution is active
- Support hundreds of collaborators/viewers
- Anonymous collaboration (no auth required initially)
- Future restriction/permission support

---

# Non-Functional Requirements

- Runtime limit: 10 seconds
- Memory limits enforced
- Low latency collaborative editing (<100ms preferred)
- High websocket concurrency
- Availability prioritized over strict consistency
- Convenience-first UX
- Rate limit abusive users by hashed IP
- Secure sandboxed execution
- Horizontally scalable architecture later
- Initially deployable as monolith

---

# High-Level Architecture

```text
Client
  ↓
API Gateway
  ↓
WebSocket Service
  ↓
CRDT / OT Sync Engine
  ↓
Session Service
  ↓
Postgres

Execution Flow:
Client
  ↓
Execution Service
  ↓
Kafka Execution Queue
  ↓
Sandbox Workers
  ↓
Ephemeral Docker Containers
  ↓
Results Service
```

---

# Core Components

## API Gateway
Handles:
- REST APIs
- session generation
- execution requests
- rate limiting

---

## WebSocket Service
Handles:
- real-time edits
- presence updates
- cursor movement
- websocket connections

---

## CRDT / OT Engine
Handles concurrent edit synchronization.

Purpose:
- prevent overwrite conflicts
- synchronize concurrent edits
- preserve document consistency

---

## Session Service
Responsible for:
- coding sessions
- document persistence
- metadata management

---

## Execution Service
Responsible for:
- validating execution requests
- creating execution jobs
- enqueueing sandbox workloads

---

## Sandbox Workers
Responsible for:
- spinning up isolated execution containers
- executing user code
- collecting outputs
- destroying containers after execution

---

# Execution Isolation

User code is executed inside:

```text
ephemeral Docker containers
```

Sandbox protections:
- CPU limits
- memory limits
- execution timeout
- read-only filesystem
- no outbound network access

Potential future hardening:
- gVisor
- Firecracker
- seccomp

---

# API Design

# Generate Session

```http
POST /generate_session
```

Response:

```json
{
  "session_id": "abc123",
  "share_url": "codeshare.io/s/abc123",
  "edit_token": "xyz789"
}
```

Purpose:
- create collaborative room
- generate anonymous edit token

---

# Execute Code

```http
POST /execute/session={session_id}
```

Request:

```json
{
  "stdin": "5\n"
}
```

Response:

```json
{
  "output": "7 is a prime number"
}
```

---

# Get Session

```http
GET /session/{session_id}
```

Returns:
- current document state
- language
- metadata

---

# WebSocket Connection

```http
WS /sessions/abc123/connect?token=xyz789
```

Used for:
- real-time edits
- cursor synchronization
- presence tracking

---

# WebSocket Events

## Edit Event

```json
{
  "type": "EDIT_OPERATION",
  "position": 42,
  "content": "print('hello')"
}
```

---

## Cursor Update

```json
{
  "type": "CURSOR_UPDATE",
  "cursor_position": 120
}
```

---

## Presence Event

```json
{
  "type": "USER_JOINED"
}
```

---

# Core Data Models

# CodingSession

```json
CodingSession {
  session_id: UUID
  language: enum(PYTHON, JAVA, CPP)
  share_token: string
  status: enum(ACTIVE, RUNNING, CLOSED)
  created_at: timestamp
  updated_at: timestamp
}
```

---

# CodeDocument

```json
CodeDocument {
  document_id: UUID
  session_id: UUID
  current_content: text
  version: int
  updated_at: timestamp
}
```

---

# EditOperation

```json
EditOperation {
  operation_id: UUID
  session_id: UUID
  operation_type: enum(
    INSERT,
    DELETE,
    REPLACE
  )
  position: int
  content: string
  document_version: int
  created_at: timestamp
}
```

---

# SessionParticipant

```json
SessionParticipant {
  participant_id: UUID
  session_id: UUID
  websocket_connection_id: string
  cursor_position: int
  is_active: boolean
  last_heartbeat: timestamp
}
```

---

# ExecutionJob

```json
ExecutionJob {
  job_id: UUID
  session_id: UUID
  language: string
  code_snapshot: text
  stdin: text
  status: enum(
    QUEUED,
    RUNNING,
    FAILED,
    COMPLETED,
    TIMEOUT
  )
  created_at: timestamp
}
```

---

# ExecutionResult

```json
ExecutionResult {
  result_id: UUID
  job_id: UUID
  stdout: text
  stderr: text
  exit_code: int
  runtime_ms: int
  memory_used_mb: int
}
```

---

# DocumentSnapshot

```json
DocumentSnapshot {
  snapshot_id: UUID
  session_id: UUID
  content: text
  version: int
  created_at: timestamp
}
```

---

# Database Choices

| Component | Technology |
|---|---|
| Metadata DB | Postgres |
| Presence / Cache | Redis |
| Execution Queue | Kafka |
| Sandbox Runtime | Docker |
| WebSockets | Socket.IO/ws |
| Frontend Editor | Monaco Editor |
| Infrastructure | Kubernetes (future) |

---

# Scalability Considerations

## WebSocket Scaling
Future support:
- Redis PubSub
- sticky sessions
- distributed websocket nodes

---

## Sandbox Scaling
Future support:
- autoscaling workers
- execution quotas
- pre-warmed containers

---

## Persistence
Future support:
- object storage for logs/artifacts
- session expiration
- replayable edit history

---

# Security Considerations

- sandboxed execution
- runtime limits
- memory limits
- no outbound networking
- hashed IP storage
- rate limiting
- isolated execution workers

---

# Future Improvements

- authentication
- private/public rooms
- AI coding assistant
- voice collaboration
- terminal support
- multi-file projects
- git integration
- persistent accounts
- collaborative debugging
- live interview mode

---

# Design Tradeoffs

## Availability over Consistency
The system prioritizes:
- low latency
- responsiveness
- collaboration continuity

over strict synchronization guarantees.

Minor temporary edit divergence is acceptable in exchange for better real-time performance.

---

# MVP Deployment Strategy

Initial deployment:

```text
single VPS + Docker containers
```

Future deployment:

```text
Kubernetes-based distributed architecture
```