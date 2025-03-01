### 1. Number Input Field

#### Interface

| Prop       | Type               | Description                                      |
| ---------- | ------------------ | ------------------------------------------------ |
| `value`    | `number`           | The current value of the input field             |
| `onChange` | `(number) => void` | The callback to be called when the value changes |

#### Behavior


- [ ] The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed  
- [ ] Clicking outside the input field removes focus and changes the value  
- [ ] Clicking on the native step buttons immediately changes the value  
- [ ] Pressing up arrow or down arrow keys immediately changes the value  
- [ ] Entire text is selected when the input field gains focus  
- [ ] Entire text is selected after using the native step buttons  
- [ ] Entire text is selected after using the up arrow or down arrow keys  
- [ ] Pressing Enter confirms the new value and removes focus  
- [ ] Pressing Escape reverts to the original value and removes focus  
- [ ] Leading zeros are automatically removed  
- [ ] Negative values are automatically adjusted to the minimum allowed value  
- [ ] Decimal values are automatically rounded to the nearest integer  
- [ ] Invalid inputs (non-numeric) revert to the previous valid value  