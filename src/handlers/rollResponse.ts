import type { StateSetter } from '@/types';
import { RollResponse } from '../messaging/message';

export function handleRollResponse(message: RollResponse, setRollMessages: StateSetter<{ id: string; text: string }[]>) {
    const rollMessage = message as RollResponse;
    setRollMessages(prev => [...prev, { id: rollMessage.id, text: rollMessage.message }])
}