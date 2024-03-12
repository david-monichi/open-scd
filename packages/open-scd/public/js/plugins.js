export const officialPlugins = [
  {
    name: 'IED',
    src: '/dist/src/editors/IED.js',
    icon: 'developer_board',
    default: true,
    kind: 'editor',
  },
  {
    name: 'Substation',
    src: '/dist/src/editors/Substation.js',
    icon: 'margin',
    default: true,
    kind: 'editor',
  },
  {
    name: 'Single Line Diagram',
    src: '/dist/src/editors/SingleLineDiagram.js',
    icon: 'edit',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Subscriber Message Binding (GOOSE)',
    src: '/dist/src/editors/GooseSubscriberMessageBinding.js',
    icon: 'link',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Subscriber Data Binding (GOOSE)',
    src: '/dist/src/editors/GooseSubscriberDataBinding.js',
    icon: 'link',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Subscriber Later Binding (GOOSE)',
    src: '/dist/src/editors/GooseSubscriberLaterBinding.js',
    icon: 'link',
    default: true,
    kind: 'editor',
  },
  {
    name: 'Subscriber Message Binding (SMV)',
    src: '/dist/src/editors/SMVSubscriberMessageBinding.js',
    icon: 'link',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Subscriber Data Binding (SMV)',
    src: '/dist/src/editors/SMVSubscriberDataBinding.js',
    icon: 'link',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Subscriber Later Binding (SMV)',
    src: '/dist/src/editors/SMVSubscriberLaterBinding.js',
    icon: 'link',
    default: true,
    kind: 'editor',
  },
  {
    name: 'Communication',
    src: '/dist/src/editors/Communication.js',
    icon: 'settings_ethernet',
    default: true,
    kind: 'editor',
  },
  {
    name: '104',
    src: '/dist/src/editors/Protocol104.js',
    icon: 'settings_ethernet',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Templates',
    src: '/dist/src/editors/Templates.js',
    icon: 'copy_all',
    default: true,
    kind: 'editor',
  },
  {
    name: 'Publisher',
    src: '/dist/src/editors/Publisher.js',
    icon: 'publish',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Cleanup',
    src: '/dist/src/editors/Cleanup.js',
    icon: 'cleaning_services',
    default: false,
    kind: 'editor',
  },
  {
    name: 'Open project',
    src: '/dist/src/menu/OpenProject.js',
    icon: 'folder_open',
    default: true,
    kind: 'menu',
    requireDoc: false,
    position: 'top',
  },
  {
    name: 'New project',
    src: '/dist/src/menu/NewProject.js',
    icon: 'create_new_folder',
    default: true,
    kind: 'menu',
    requireDoc: false,
    position: 'top',
  },
  {
    name: 'Save project',
    src: '/dist/src/menu/SaveProject.js',
    icon: 'save',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'top',
  },
  {
    name: 'Validate Schema',
    src: '/dist/src/validators/ValidateSchema.js',
    icon: 'rule_folder',
    default: true,
    kind: 'validator',
  },
  {
    name: 'Validate Templates',
    src: '/dist/src/validators/ValidateTemplates.js',
    icon: 'rule_folder',
    default: true,
    kind: 'validator',
  },
  {
    name: 'Import IEDs',
    src: '/dist/src/menu/ImportIEDs.js',
    icon: 'snippet_folder',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Create Virtual IED',
    src: '/dist/src/menu/VirtualTemplateIED.js',
    icon: 'developer_board',
    default: false,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Subscriber Update',
    src: '/dist/src/menu/SubscriberInfo.js',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Update desc (ABB)',
    src: '/dist/src/menu/UpdateDescriptionABB.js',
    default: false,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Update desc (SEL)',
    src: '/dist/src/menu/UpdateDescriptionSEL.js',
    default: false,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Merge Project',
    src: '/dist/src/menu/Merge.js',
    icon: 'merge_type',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Update Substation',
    src: '/dist/src/menu/UpdateSubstation.js',
    icon: 'merge_type',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Compare IED',
    src: '/dist/src/menu/CompareIED.js',
    icon: 'compare_arrows',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
  {
    name: 'Show SCL History',
    src: '/dist/src/menu/SclHistory.js',
    icon: 'history_toggle_off',
    default: true,
    kind: 'menu',
    requireDoc: true,
    position: 'bottom',
  },
  {
    name: 'Help',
    src: '/dist/src/menu/Help.js',
    icon: 'help',
    default: true,
    kind: 'menu',
    requireDoc: false,
    position: 'bottom',
  },
  {
    name: 'Export Communication Section',
    src: '/dist/src/menu/ExportCommunication.js',
    icon: 'sim_card_download',
    default: false,
    kind: 'menu',
    requireDoc: true,
    position: 'middle',
  },
];
