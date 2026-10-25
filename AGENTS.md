# AI Working Agreement

These instructions apply to every task in this repository.

## Business Context for Future Work

- Before planning or changing business operations, pricing, payments, inventory, manufacturing, shipping, messaging, invoicing, or automation, read `docs/business-operations-reference.md` and `docs/business-automation-requirements.md`.
- These files preserve the owner interview, explicit corrections, approval requirements, and unresolved choices. Do not ask the owner to repeat confirmed answers.
- Distinguish owner-confirmed business facts from assistant recommendations and implementation status. Consult `docs/platform-roadmap.md` for release scope and code/tests for implemented behavior; `docs/operations-automation-plan.md` contains proposals, not vendor-adoption approval.
- If business intent conflicts with existing release scope or behavior, identify the discrepancy before implementation. Update the business references when the owner explicitly changes a rule, preserving the correction and date.

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
