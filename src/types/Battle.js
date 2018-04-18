// @flow

import type { Id } from './Id'

export type Battle = {
  id: Id,
  players: [Id, Id],
  winnerId: Id,
  loserId: Id,
  isComplete: boolean,
  createdAt: number
}
