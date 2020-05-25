'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  async random(ctx) {
    const events = await strapi.services.event.find();
    const randomIndex = Math.floor(Math.random() * events.length);
    const randomEvent = events[randomIndex];
    return sanitizeEntity(randomEvent, {model: strapi.models.event});
  },

  async create(ctx) {
    const host = ctx.state.user.id;
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      const {title, date, location} = data;
      const duplicate = await strapi.services.event.findOne({title, date, location});
      if (duplicate) {
        return ctx.forbidden('An event with the same location, title and date already exists');
      }
      entity = await strapi.services.event.create({...data, host}, { files });
    } else {
      const {title, date, location} = ctx.request.body;
      const duplicate = await strapi.services.event.findOne({title, date, location});
      if (duplicate) {
        return ctx.forbidden('An event with the same location, title and date already exists');
      }
      entity = await strapi.services.event.create({...ctx.request.body, host});
    }
    return sanitizeEntity(entity, { model: strapi.models.event });
  },
};
