import Const from './Const';
import { EventEmitter } from 'events';

export class Filter extends EventEmitter {
  constructor(data) {
    super(data);
    this.currentFilter = {};
  }

  handleFilter(dataField, value, type) {
    const filterType = type || Const.FILTER_TYPE.CUSTOM;
    console.log('filterType: ', type);
    if (value !== null && typeof value === 'object') {
      // value of the filter is an object
      let hasValue = true;
      for (const prop in value) {
        if (!value[prop] || value[prop] === '') {
          hasValue = false;
          break;
        }
      }
      // if one of the object properties is undefined or empty, we remove the filter
      if (hasValue) {
        this.currentFilter[dataField] = { value: value, type: filterType };
      } else {
        delete this.currentFilter[dataField];
      }
    } else if (!value || value.trim() === '') {
      delete this.currentFilter[dataField];
    } else {
      this.currentFilter[dataField] = { value: value.trim(), type: filterType };
    }
    this.emit('onFilterChange', this.currentFilter);
  }
}
