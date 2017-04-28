const Generator = function Generator(dependencies) {
  const id = 'dariush-alipour.onecalendar.generator.basic';
  const name = 'Basic';
  const inputs = [
    {
      title: 'Basic',
      fields: [
        {
          id: 'title',
          label: 'Title',
          type: 'text',
        },
        {
          id: 'note',
          label: 'Note',
          type: 'wysiwyg',
        },
        {
          id: 'since',
          label: 'Since',
          type: 'date',
          comment: 'Choose the beginning date',
        },
        {
          id: 'till',
          label: 'Till',
          type: 'date',
          comment: 'Choose the last day',
          optional: true,
        },
      ],
    },
    {
      title: 'Repeats',
      fields: [
        {
          id: 'repeats',
          label: 'Repeats',
          type: 'repeats',
          optional: true,
        },
      ],
    },
    {
      title: 'Sequels',
      fields: [
        {
          id: 'sequels',
          label: 'Sequels',
          type: 'sequels',
          optional: true,
        },
      ],
    },
    {
      title: 'Overlap Policy',
      fields: [
        {
          id: 'internalOverlap',
          label: 'Internal Overlaps Policy',
          type: 'overlapRule',
          comment: 'Internal overlaps can happen via sequels',
          optional: true,
        },
        {
          id: 'externalOverlap',
          label: 'External Overlaps Policy',
          type: 'overlapRule',
          comment: 'External overlaps can happen via sequels and repeats',
          optional: true,
        },
      ],
    },
  ];
  const helper = {
    getAdapter: dependencies.getAdapter,
    primaryAdapterId: dependencies.primaryAdapterId,
  };

  const generate = (config) => {
    const event = new dependencies.Event({
      title: config.title,
      note: config.note,
      since: new dependencies.OneDate(config.since, helper),
      till: new dependencies.OneDate((config.till || config.since), helper),
      repeats: config.repeats,
      sequels: config.sequels,
      overlap: { internal: config.internalOverlap, external: config.externalOverlap },
    });
    return event;
  };

  return { id, name, inputs, generate };
};

exports.Generator = Generator;
