import os

file_path = r"C:\Users\YASHI SRIVASTAVA\.gemini\antigravity\scratch\startsmart-ai\frontend\src\pages\EvaluationForm.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content_norm = content.replace("\r\n", "\n")

# Replace first check (resCreate)
old_check1 = """      if (!resCreate.ok) {

        const errorData = await resCreate.json();

        throw new Error(errorData.detail || "Failed to save startup idea.");

      }"""

new_check1 = """      if (!resCreate.ok) {
        const errorData = await resCreate.json();
        let errMsg = "Failed to save startup idea.";
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errMsg = errorData.detail.map(err => {
              const field = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : "Field";
              return `${field}: ${err.msg}`;
            }).join(", ");
          } else if (typeof errorData.detail === 'object') {
            errMsg = JSON.stringify(errorData.detail);
          }
        }
        throw new Error(errMsg);
      }"""

# Replace second check (resEvaluate)
old_check2 = """      if (!resEvaluate.ok) {

        const errorData = await resEvaluate.json();

        throw new Error(errorData.detail || "Failed during AI evaluation process.");

      }"""

new_check2 = """      if (!resEvaluate.ok) {
        const errorData = await resEvaluate.json();
        let errMsg = "Failed during AI evaluation process.";
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errMsg = errorData.detail.map(err => {
              const field = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : "Field";
              return `${field}: ${err.msg}`;
            }).join(", ");
          } else if (typeof errorData.detail === 'object') {
            errMsg = JSON.stringify(errorData.detail);
          }
        }
        throw new Error(errMsg);
      }"""

# Normalize all templates to avoid match failures
old_check1_norm = old_check1.replace("\r\n", "\n")
new_check1_norm = new_check1.replace("\r\n", "\n")
old_check2_norm = old_check2.replace("\r\n", "\n")
new_check2_norm = new_check2.replace("\r\n", "\n")

if old_check1_norm in content_norm:
    content_norm = content_norm.replace(old_check1_norm, new_check1_norm)
    print("Updated resCreate error handling!")
else:
    print("Could not find resCreate pattern in content.")

if old_check2_norm in content_norm:
    content_norm = content_norm.replace(old_check2_norm, new_check2_norm)
    print("Updated resEvaluate error handling!")
else:
    print("Could not find resEvaluate pattern in content.")

with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(content_norm.replace("\n", "\r\n"))

print("Finished processing EvaluationForm.jsx error handling.")
