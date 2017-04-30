'use strict';

var Generator = function Generator(dependencies) {
  var id = 'coripo.coripo.generator.basic';
  var name = 'Basic';
  var description = 'Create custom events, simple or extremely sophisticated';
  var inputs = [{
    title: 'Basic',
    fields: [{
      id: 'title',
      label: 'Title',
      type: 'text'
    }, {
      id: 'note',
      label: 'Note',
      type: 'wysiwyg'
    }, {
      id: 'since',
      label: 'Since',
      type: 'date',
      comment: 'Choose the beginning date'
    }, {
      id: 'till',
      label: 'Till',
      type: 'date',
      comment: 'Choose the last day',
      optional: true
    }]
  }, {
    title: 'Repeats',
    fields: [{
      id: 'repeats',
      label: 'Repeats',
      type: 'repeats',
      optional: true
    }]
  }, {
    title: 'Sequels',
    fields: [{
      id: 'sequels',
      label: 'Sequels',
      type: 'sequels',
      optional: true
    }]
  }, {
    title: 'Overlap Policy',
    fields: [{
      id: 'internalOverlap',
      label: 'Internal Overlaps Policy',
      type: 'overlapRule',
      comment: 'Internal overlaps can happen via sequels',
      optional: true
    }, {
      id: 'externalOverlap',
      label: 'External Overlaps Policy',
      type: 'overlapRule',
      comment: 'External overlaps can happen via sequels and repeats',
      optional: true
    }]
  }];
  var helper = {
    getAdapter: dependencies.getAdapter,
    primaryAdapterId: dependencies.primaryAdapterId
  };

  var generate = function generate(config) {
    var event = new dependencies.Event({
      id: config.id,
      generatorId: id,
      title: config.title,
      note: config.note,
      since: new dependencies.OneDate(config.since, helper),
      till: new dependencies.OneDate(config.till || config.since, helper),
      repeats: config.repeats,
      sequels: config.sequels,
      overlap: { internal: config.internalOverlap, external: config.externalOverlap }
    });
    return event;
  };

  return { id: id, name: name, description: description, inputs: inputs, generate: generate };
};

exports.Generator = Generator;
//# sourceMappingURL=basic.generator.js.map