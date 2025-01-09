// src/docs/websocket-events.md

/**
 * WebSocket Events Documentation
 * 
 * Recipe Namespace (/recipes):
 * 
 * Client -> Server:
 * - join-recipe: { recipeId: string }
 * - recipe-update: { recipeId: string, updates: object }
 * - start-cooking: { recipeId: string }
 * 
 * Server -> Client:
 * - user-joined: { userId: string, username: string }
 * - recipe-updated: { updates: object, updatedBy: string }
 * - cooking-started: { userId: string, username: string }
 * 
 * Collaboration Namespace (/collaboration):
 * 
 * Client -> Server:
 * - join-session: { recipeId: string }
 * - cursor-move: { recipeId: string, position: { x: number, y: number } }
 * - content-change: { recipeId: string, changes: array }
 * 
 * Server -> Client:
 * - user-joined: { userId: string, username: string, timestamp: date }
 * - cursor-update: { userId: string, username: string, position: object }
 * - content-update: { userId: string, username: string, changes: array, timestamp: date }
 * - user-left: { userId: string, username: string }
 * 
 * Notifications Namespace (/notifications):
 * 
 * Client -> Server:
 * - mark-read: { notificationId: string }
 * - clear-all: void
 * 
 * Server -> Client:
 * - notification-read: { notificationId: string, timestamp: date }
 * - notifications-cleared: { timestamp: date }
 */
