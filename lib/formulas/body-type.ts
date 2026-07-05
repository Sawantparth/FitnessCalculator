import { round } from "@/lib/core/precision";
import { validateInputs, checkEnum, ValidationIssue } from "@/lib/core/validation";
import { classifyBodyType, BODY_TYPE_LABELS } from "@/lib/calculators/body-type";
import type { BodyType, BodyTypeResult } from "@/lib/calculators/body-type";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export { BodyType, BodyTypeResult };
export { BODY_TYPE_LABELS };
export { classifyBodyType };

export const bodyTypeFormula: ICalculatorFormula = {
  id: "body-type",
  name: "Body Type Calculator",
  description: "Estimates your body type (somatotype) based on anthropometric measurements using a simplified Heath-Carter approach.",
  sourceStandard: "Heath-Carter somatotyping method (1967); Sheldon (1940) constitutional psychology",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["heightCm", "weightKg", "shoulderCm", "waistCm", "hipCm", "gender"],
      [checkEnum("gender", Number(inputs.gender), [0, 1])].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const bodyType = classifyBodyType(
      inputs.heightCm, inputs.weightKg,
      inputs.shoulderCm, inputs.waistCm, inputs.hipCm,
      inputs.gender === 0,
    );
    const primaryInfo = BODY_TYPE_LABELS[bodyType.primary];

    let interpretation = `Your estimated body type is ${primaryInfo.label}. ${primaryInfo.traits}.`;
    if (bodyType.secondary) {
      const secondaryInfo = BODY_TYPE_LABELS[bodyType.secondary];
      interpretation += ` You also show ${secondaryInfo.label} characteristics.`;
    }
    interpretation += " Body type is a general classification and not a diagnostic category. Discuss these results with your healthcare provider.";

    return {
      primary: {
        label: "Body type",
        value: 0,
        unit: primaryInfo.label,
      },
      secondary: [
        { label: "Characteristics", value: 0, unit: primaryInfo.traits },
        { label: "Secondary type", value: 0, unit: bodyType.secondary ? BODY_TYPE_LABELS[bodyType.secondary].label : "None dominant" },
        { label: "Height", value: round(inputs.heightCm, "weight", 0), unit: "cm" },
        { label: "Weight", value: round(inputs.weightKg, "weight", 1), unit: "kg" },
        { label: "Shoulder-to-waist ratio", value: round(inputs.shoulderCm / inputs.waistCm, "generic", 2), unit: "" },
        { label: "Waist-to-hip ratio", value: round(inputs.waistCm / inputs.hipCm, "generic", 2), unit: "" },
        { label: "Ponderal index", value: round(inputs.heightCm / Math.cbrt(inputs.weightKg), "generic", 1), unit: "" },
      ],
      interpretation,
      limitations: [
        "Simplified somatotype estimation; Heath-Carter method requires skinfold measurements for full accuracy.",
        "Body type can change with training and nutrition over time.",
        "Most individuals are a mix of types rather than a single pure type.",
        "Not a medical diagnosis; body composition analysis (DXA, calipers) is more precise.",
      ],
      sourceStandard: "Heath-Carter somatotyping method (1967); Sheldon (1940) constitutional psychology",
      sourceLinks: [
        { label: "Heath-Carter somatotype method", url: "https://pubmed.ncbi.nlm.nih.gov/6049236" },
      ],
    };
  },
};
