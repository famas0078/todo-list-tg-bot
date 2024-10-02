import { AppService } from './app.service';
import {Action, Ctx, InjectBot, Message, On, Start, Update} from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { Context } from './app.interface'
import { actionButtons } from "./app.buttons";
import {login} from "telegraf/typings/button";

const showList = (list: any) => {

  return (`Your to-do list: \n\n${
      list.map(item => (item.isCompleted ? '✅' : '🚫') + item.name + ' ID:'+ item.id + '\n\n').join('')
  }`);
}


// const todos = [
//   {
//     id: 1,
//     name: 'Buy goods',
//     isCompleted: false,
//   },
//   {
//     id: 2,
//     name: 'Go to walk',
//     isCompleted: false,
//   },
//   {
//     id: 3,
//     name: 'Travel',
//     isCompleted: true,
//   }
// ]

@Update()
export class AppUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>, private readonly appService: AppService) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! Friend 😁');
    const buttons = actionButtons();
    await ctx.reply('What do you want to do?', buttons);
  }

  @Action('list')
  async getAll(ctx: Context) {
    const todos = await this.appService.getAll()
    await ctx.reply(showList(todos));
  }

  @Action('create')
  async create(ctx: Context) {
    await ctx.reply('write the task name');
    ctx.session.type = 'create'
  }

  @Action('done')
  async  doneTask(ctx: Context) {
    await ctx.reply('Write the task ID: ')
    ctx.session.type = 'done'
  }

  @Action('edit')
  async edit(ctx: Context) {
    await ctx.reply('write the task ID for edit: example 1 | name ');
    ctx.session.type = 'edit'
  }

  @Action('remove')
  async delete(ctx: Context) {
    await ctx.replyWithHTML('<b>Deleting an item from your to-do list... </b>');
    ctx.session.type = 'remove'
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx:Context){

    await ctx.deleteMessage();

    await ctx.sendChatAction('typing');

    if (!ctx.session.type) return

    if (ctx.session.type === 'done') {

      const todos = await this.appService.doneTask(Number(message))

      if (!todos) {

        await ctx.reply('Task was not found', actionButtons());
        return

      }

      await ctx.reply(showList(todos))


    }

    if (ctx.session.type === 'create') {

      const todos = await  this.appService.createTask(message)

      await ctx.reply(showList(todos))

    }
    if (ctx.session.type === 'edit') {

      const [taskId, taskName] = message.split(' | ')

      const todos = await this.appService.editTask(Number(taskId), taskName)

      if (!todos) {

        await ctx.reply('Task was not found', actionButtons());
        return

      }

      await ctx.reply(showList(todos))

    }

    if (ctx.session.type === 'remove'){

      const todos = await this.appService.deleteTask(Number(message))

      if (!todos) {

        await ctx.reply('Task was not found', actionButtons());
        return

      }

      await ctx.reply(showList(todos))

    }

    setTimeout(() => {

    }, 2000)

  }

}