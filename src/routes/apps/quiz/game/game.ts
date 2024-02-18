import { get } from "svelte/store";
import type { Quiz, QuizData } from "../quiz.js";
import { GAME_DATA, gameData } from "../stores.js";
import { client } from "../client.js";
import { events } from "@omuchatjs/chat";
import type { AuthorJson } from "@omuchatjs/chat/models/author.js";

export interface GameData {
    id: string;
    data: QuizData;
    currentQuestion: number;
    times: Record<number, {
        start: number;
        end: number;
    }>;
    players: Record<string, {
        author: AuthorJson;
        answers: Record<number, Record<number, number>>
    }>;
    status: 'waiting' | 'playing' | 'finished';
}

export async function createGame(quiz: Quiz) {
    await updateGame(() => ({
        id: quiz.id,
        data: quiz.data,
        currentQuestion: 0,
        gameStartedAt: Date.now(),
        times: {},
        players: {},
        status: 'waiting',
    }));
}

export async function updateGame(fn: (data: GameData) => GameData) {
    if (!get(gameData)) {
        throw new Error('Game not started');
    }
    await GAME_DATA.update((data) => {
        return fn(data!);
    });
}

export async function endGame() {
    await GAME_DATA.update(() => null);
}

client.on(events.MessageCreate, async (message) => {
    if (!message.author_id) {
        return;
    }
    const authorId = message.author_id;
    if (!authorId) {
        return;
    }
    const game = get(gameData);
    if (!game) {
        return;
    }
    if (game.status !== 'playing') {
        return;
    }
    const question = game.data.questions[game.currentQuestion];
    if (game.players[authorId]?.answers[game.currentQuestion]) {
        return;
    }
    const answers = {} as { [key: number]: number };
    const answered = question.options.some((option, index) => {
        if (message.text.toLowerCase() === option.key.toLowerCase()) {
            answers[index] = message.created_at.getTime();
            return true;
        }
    });
    if (!answered) {
        return;
    }
    const author = await client.chat.authors.get(authorId);
    if (!author) {
        return;
    }
    await updateGame((data) => {
        data.players[authorId] = {
            author: author.toJson(),
            answers: {
                ...data.players[authorId]?.answers,
                [game.currentQuestion]: answers
            }
        };
        return data;
    });
});
