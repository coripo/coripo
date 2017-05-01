'use strict';

var i18next = require('i18next');
var locales = require('../locales/index.js');

var Generator = function Generator(dependencies) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  i18next.init({
    lng: config.locale || 'en',
    fallbackLng: 'en',
    initImmediate: false,
    resources: locales
  });
  var trl = function trl(key) {
    i18next.store.data = locales;
    return i18next.t(key);
  };
  var id = 'coripo.coripo.generator.basic';
  var name = trl('basic-generator.name');
  var description = trl('basic-generator.description');
  var inputs = [{
    title: trl('basic-generator.field-group.basic.title'),
    fields: [{
      id: 'title',
      label: trl('basic-generator.field-group.basic.field.title.label'),
      type: 'text'
    }, {
      id: 'note',
      label: trl('basic-generator.field-group.basic.field.note.label'),
      type: 'wysiwyg'
    }, {
      id: 'since',
      label: trl('basic-generator.field-group.basic.field.since.label'),
      type: 'date',
      comment: trl('basic-generator.field-group.basic.field.since.comment')
    }, {
      id: 'till',
      label: trl('basic-generator.field-group.basic.field.till.label'),
      type: 'date',
      comment: trl('basic-generator.field-group.basic.field.till.comment'),
      optional: true
    }]
  }, {
    title: trl('basic-generator.field-group.repeats.title'),
    fields: [{
      id: 'repeats',
      label: trl('basic-generator.field-group.repeats.field.repeats.label'),
      type: 'repeats',
      optional: true
    }]
  }, {
    title: trl('basic-generator.field-group.sequels.title'),
    fields: [{
      id: 'sequels',
      label: trl('basic-generator.field-group.sequels.field.sequels.label'),
      type: 'sequels',
      optional: true
    }]
  }, {
    title: trl('basic-generator.field-group.overlap-policy.title'),
    fields: [{
      id: 'internalOverlap',
      label: trl('basic-generator.field-group.overlap-policy.field.internal.label'),
      type: 'select',
      data: {
        items: [{
          title: trl('basic-generator.field-group.overlap-policy.field.internal.data.allow'),
          value: 'allow'
        }, {
          title: trl('basic-generator.field-group.overlap-policy.field.internal.data.remove'),
          value: 'remove'
        }, {
          title: trl('basic-generator.field-group.overlap-policy.field.internal.data.trim'),
          value: 'trim'
        }]
      },
      optional: true
    }, {
      id: 'externalOverlap',
      label: trl('basic-generator.field-group.overlap-policy.field.external.label'),
      type: 'select',
      data: {
        items: [{
          title: trl('basic-generator.field-group.overlap-policy.field.external.data.allow'),
          value: 'allow'
        }, {
          title: trl('basic-generator.field-group.overlap-policy.field.external.data.remove'),
          value: 'remove'
        }, {
          title: trl('basic-generator.field-group.overlap-policy.field.external.data.remove-forever'),
          value: 'remove-forever'
        }, {
          title: trl('basic-generator.field-group.overlap-policy.field.external.data.trim'),
          value: 'trim'
        }, {
          title: trl('basic-generator.field-group.overlap-policy.field.external.data.trim-forever'),
          value: 'trim-forever'
        }]
      },
      optional: true
    }]
  }];
  var helper = {
    getAdapter: dependencies.getAdapter,
    primaryAdapterId: dependencies.primaryAdapterId
  };

  var generate = function generate(cfg) {
    var event = new dependencies.Event({
      id: cfg.id,
      generatorId: id,
      title: cfg.title,
      note: cfg.note,
      since: new dependencies.OneDate(cfg.since, helper),
      till: new dependencies.OneDate(cfg.till || cfg.since, helper),
      repeats: cfg.repeats,
      sequels: cfg.sequels,
      overlap: {
        internal: cfg.internalOverlap,
        external: cfg.externalOverlap
      }
    });
    return event;
  };

  return {
    id: id,
    name: name,
    description: description,
    inputs: inputs,
    generate: generate
  };
};

exports.Generator = Generator;
//# sourceMappingURL=basic.generator.js.map