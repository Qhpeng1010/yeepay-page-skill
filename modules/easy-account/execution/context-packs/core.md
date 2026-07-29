# Easy Account Page Spec Core Context

- `EA-VIS-001` to `EA-VIS-007` define the visual constitution.
- `EA-TPL-001` to `EA-TPL-005` define page family and capability selection.
- `EA-INT-001` to `EA-INT-008` define workflow, state, permission and acceptance behavior.
- Amounts use integer minor units or strings; never perform accounting arithmetic with JavaScript floating point.
- The renderer owns only Easy Account shell and components. Unsupported capability declarations are rejected by contract validation.
