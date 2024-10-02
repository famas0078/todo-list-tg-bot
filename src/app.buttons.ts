import { Markup } from "telegraf";

export function actionButtons() {
    return Markup.inlineKeyboard(
        [
            [Markup.button.callback('⚡️ create task', 'create')],
            [Markup.button.callback('🎲 to-do-list', 'list')],
            [Markup.button.callback('👌 done task', 'done')],
            [Markup.button.callback('🏒 edit', 'edit')],
            [Markup.button.callback('🚫 to-do-delete', 'remove')]
        ]
    );
}