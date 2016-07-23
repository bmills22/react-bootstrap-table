import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import Const from '../Const';

const legalComparators = [ '=', '>', '>=', '<', '<=', '!=' ];

class NumberRangeFilter extends Component {
  constructor(props) {
    super(props);
    this.numberComparators = this.props.numberComparators || legalComparators;
    this.timeout = null;
    this.state = {
      isPlaceholderSelected: (this.props.defaultValue === undefined ||
        this.props.defaultValue.number === undefined ||
        (this.props.options &&
          this.props.options.indexOf(this.props.defaultValue.number) === -1))
    };
    this.onChangeMaxNumber = this.onChangeMaxNumber.bind(this);
    this.onChangeMinNumber = this.onChangeMinNumber.bind(this);
  }

  onChangeMinNumber(event) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const filterValue = event.target.value;
    this.minNumber = filterValue;
    this.timeout = setTimeout(() => {
      this.props.filterHandler({ minNumber: this.minNumber, maxNumber: this.maxNumber , comparator: '>' }, Const.FILTER_TYPE.NUMBER_RANGE)
    }, this.props.delay);
  }

  onChangeMaxNumber(event) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const filterValue = event.target.value;
    this.maxNumber = filterValue;
    this.timeout = setTimeout(() => {
      this.props.filterHandler({ minNumber: this.minNumber, maxNumber: this.maxNumber , comparator: '<' }, Const.FILTER_TYPE.NUMBER_RANGE)
    }, this.props.delay);
  }

  getComparatorOptions() {
    const optionTags = [];
    optionTags.push(<option key='-1'></option>);
    for (let i = 0; i < this.numberComparators.length; i++) {
      optionTags.push(
        <option key={ i } value={ this.numberComparators[i] }>
          { this.numberComparators[i] }
        </option>
      );
    }
    return ['<', '>'];
  }

  getNumberOptions() {
    const optionTags = [];
    const { options } = this.props;

    optionTags.push(
      <option key='-1' value=''>
        { this.props.placeholder || `Select ${this.props.columnName}...` }
      </option>
    );
    for (let i = 0; i < options.length; i++) {
      optionTags.push(<option key={ i } value={ options[i] }>{ options[i] }</option>);
    }
    return optionTags;
  }

  componentDidMount() {
    this.minNumber = this.refs.minNumberFilter.value;
    this.maxNumber = this.refs.maxNumberFilter.value;
    if (this.minNumber && this.maxNumber) {
      this.props.filterHandler({ minNumber: this.minNumber, maxNumber: this.maxNumber }, Const.FILTER_TYPE.NUMBER_RANGE);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const selectClass = classSet(
      'select-filter', 'number-filter-input', 'form-control',
      { 'placeholder-selected': this.state.isPlaceholderSelected });

    return (
      <div className='filter number-filter'>
          <div>
            <input ref='minNumberFilter'
                   type='number'
                   className='number-filter-input form-control'
                   placeholder={ this.props.placeholder || `Enter minNumber` }
                   onChange={ this.onChangeMinNumber }
                   defaultValue={
                     (this.props.defaultValue) ? this.props.defaultValue.number : ''
                   } />
           <input ref='maxNumberFilter'
                   type='number'
                   className='number-filter-input form-control'
                   placeholder={ this.props.placeholder || `Enter maxNumber` }
                   onChange={ this.onChangeMaxNumber }
                   defaultValue={
                     (this.props.defaultValue) ? this.props.defaultValue.number : ''
                   } />
                   </div>
      </div>
    );
  }
}

NumberRangeFilter.propTypes = {
  filterHandler: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number),
  defaultValue: PropTypes.shape({
    number: PropTypes.number,
    comparator: PropTypes.oneOf(legalComparators)
  }),
  delay: PropTypes.number,
  /* eslint consistent-return: 0 */
  numberComparators: function(props, propName) {
    if (!props[propName]) {
      return;
    }
    for (let i = 0; i < props[propName].length; i++) {
      let comparatorIsValid = false;
      for (let j = 0; j < legalComparators.length; j++) {
        if (legalComparators[j] === props[propName][i]) {
          comparatorIsValid = true;
          break;
        }
      }
      if (!comparatorIsValid) {
        return new Error(`Number comparator provided is not supported.
          Use only ${legalComparators}`);
      }
    }
  },
  placeholder: PropTypes.string,
  columnName: PropTypes.string
};

NumberRangeFilter.defaultProps = {
  delay: Const.FILTER_DELAY
};

export default NumberRangeFilter;
