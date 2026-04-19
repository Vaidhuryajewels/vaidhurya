# AI Working Agreement

These instructions apply to every task in this repository.

## Backlog Execution

- Break large architecture work into small, meaningful problems that can be completed without losing context.
- Prefer bounded slices that reduce hallucination risk by relying on code and repo evidence instead of assumptions.
- Execute backlog items one by one instead of mixing multiple major problem areas in the same pass.
- Preserve the established VAIDHURYA premium jewelry theme while extending commerce behavior.

## Delivery Standard

- Every code change must be backed by automated tests.
- Every behavior change should also have an end-to-end browser test when the app surface can support it.
- After each pass, run verification so we know the slice did not break existing behavior.
- If an environment issue blocks a verification step, report the exact blocker and keep the remaining checks green.

## Validation Checklist

- Run targeted unit or integration tests for the changed logic.
- Run end-to-end coverage for the changed shopper or admin flow.
- Run typechecking and linting after each completed slice.
- Prefer moving forward only after the current slice is stable.
