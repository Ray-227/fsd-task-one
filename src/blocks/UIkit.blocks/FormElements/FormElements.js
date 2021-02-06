require('@/blocks/common.blocks/form.elements/dropdown/dropdown.js');

require('@/blocks/common.blocks/form.elements/masked-date-field/masked-date-field.js');

require('@/blocks/common.blocks/form.elements/date-dropdown/date-dropdown.js');

const {range} = require('@/blocks/common.blocks/form.elements/range-slider/range-slider.js');
/* y
  Number: min
  Number: max
  Number: step
*/
range.create(0, 20000, 5000, 10000, 100);

require('@/blocks/common.blocks/form.elements/pagination/pagination.js');

require('@/blocks/common.blocks/form.elements/expandable-checkbox-list/expandable-checkbox-list.js');

require('@/blocks/common.blocks/form.elements/like-button/like-button.js');
