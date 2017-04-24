const Generator = function Generator(Event) {
  const id = 'dariush-alipour.onecalendar.generator.basic';
  const name = 'Basic';
  const inputs = [
    { id: 'title', label: 'Title', type: 'text', comment: '' },
    { id: 'note', label: 'Note', type: 'wysiwyg', comment: '' },
    { id: 'since', label: 'Since', type: 'date', comment: '' },
    { id: 'till', label: 'Till', type: 'date', comment: '' },
  ];

  const generate = (config) => {
    const event = new Event({
      title: config.title,
      note: config.note,
      since: config.since,
      till: config.till,
    });
    return event;
  };

  return { id, name, inputs, generate };
};

exports.Generator = Generator;
