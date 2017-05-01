const i18next = require('i18next');
const locales = require('../locales/index.js');

const Generator = function Generator(dependencies, config = {}) {
  i18next.init({
    lng: config.locale || 'en',
    fallbackLng: 'en',
    initImmediate: false,
    resources: locales,
  });
  const id = 'coripo.coripo.generator.basic';
  const name = i18next.t('basic-generator.name');
  const description = i18next.t('basic-generator.description');
  const inputs = [
    {
      title: i18next.t('basic-generator.field-group.basic.title'),
      fields: [
        {
          id: 'title',
          label: i18next.t('basic-generator.field-group.basic.field.title.label'),
          type: 'text',
        },
        {
          id: 'note',
          label: i18next.t('basic-generator.field-group.basic.field.note.label'),
          type: 'wysiwyg',
        },
        {
          id: 'since',
          label: i18next.t('basic-generator.field-group.basic.field.since.label'),
          type: 'date',
          comment: i18next.t('basic-generator.field-group.basic.field.since.comment'),
        },
        {
          id: 'till',
          label: i18next.t('basic-generator.field-group.basic.field.till.label'),
          type: 'date',
          comment: i18next.t('basic-generator.field-group.basic.field.till.comment'),
          optional: true,
        },
      ],
    },
    {
      title: i18next.t('basic-generator.field-group.repeats.title'),
      fields: [
        {
          id: 'repeats',
          label: i18next.t('basic-generator.field-group.repeats.field.repeats.label'),
          type: 'repeats',
          optional: true,
        },
      ],
    },
    {
      title: i18next.t('basic-generator.field-group.sequels.title'),
      fields: [
        {
          id: 'sequels',
          label: i18next.t('basic-generator.field-group.sequels.field.sequels.label'),
          type: 'sequels',
          optional: true,
        },
      ],
    },
    {
      title: i18next.t('basic-generator.field-group.overlap-policy.title'),
      fields: [
        {
          id: 'internalOverlap',
          label: i18next.t('basic-generator.field-group.overlap-policy.field.internal.label'),
          type: 'select',
          data: {
            items: [
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.internal.data.allow'),
                value: 'allow',
              },
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.internal.data.remove'),
                value: 'remove',
              },
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.internal.data.trim'),
                value: 'trim',
              },
            ],
          },
          optional: true,
        },
        {
          id: 'externalOverlap',
          label: i18next.t('basic-generator.field-group.overlap-policy.field.external.label'),
          type: 'select',
          data: {
            items: [
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.external.data.allow'),
                value: 'allow',
              },
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.external.data.remove'),
                value: 'remove',
              },
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.external.data.remove-forever'),
                value: 'remove-forever',
              },
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.external.data.trim'),
                value: 'trim',
              },
              {
                title: i18next.t('basic-generator.field-group.overlap-policy.field.external.data.trim-forever'),
                value: 'trim-forever',
              },
            ],
          },
          optional: true,
        },
      ],
    },
  ];
  const helper = {
    getAdapter: dependencies.getAdapter,
    primaryAdapterId: dependencies.primaryAdapterId,
  };

  const generate = (cfg) => {
    const event = new dependencies.Event({
      id: cfg.id,
      generatorId: id,
      title: cfg.title,
      note: cfg.note,
      since: new dependencies.OneDate(cfg.since, helper),
      till: new dependencies.OneDate((cfg.till || cfg.since), helper),
      repeats: cfg.repeats,
      sequels: cfg.sequels,
      overlap: {
        internal: cfg.internalOverlap,
        external: cfg.externalOverlap,
      },
    });
    return event;
  };

  return {
    id,
    name,
    description,
    inputs,
    generate,
  };
};

exports.Generator = Generator;
