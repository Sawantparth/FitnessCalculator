# Calculator Platform — Medical Content Rules

## Disclaimer Requirements
Every calculator page MUST display the `<DisclaimerBanner />` component.
It must read:

> This calculator provides estimates for informational purposes only and
> does not constitute medical advice. Always consult a qualified
> healthcare professional for personal medical decisions.

## Calculator Content Rules
1. **No diagnostic claims** — Never state that a result "diagnoses" or
   "confirms" a condition. Use "indicates", "suggests", "may be
   associated with".
2. **Source citation** — Every formula must cite its source standard
   (e.g. WHO, NIH, CDC, peer-reviewed study) in the
   `result.sourceStandard` field.
3. **Limitations** — Each calculator must enumerate known limitations
   (population, age range, measurement method).
4. **Interpretation guidance** — Provide interpretation context but
   never prescribe action. End with "Discuss these results with your
   healthcare provider."
