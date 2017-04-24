const Generator = function Generator(dependencies) {
  const id = 'dariush-alipour.onecalendar.generator.basic';
  const name = 'Basic';
  const inputs = [
    { id: 'title', label: 'Title', type: 'text', comment: '' },
    { id: 'note', label: 'Note', type: 'wysiwyg', comment: '' },
    { id: 'since', label: 'Since', type: 'date', comment: '' },
    { id: 'till', label: 'Till', type: 'date', comment: '' },
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
    });
    return event;
  };

  return { id, name, inputs, generate };
};

exports.Generator = Generator;
