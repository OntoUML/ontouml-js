# OntoUML Example Models

Repository with OntoUML models for development tests

## Invalid OntoUML Models

| Model | Version | Valid Model | Valid OntoUML Model | Error Description |
|:----:|:----:|:----:| :----:| 
| m1.invalid.json | - | ✅ | ❌| Stereotypes missing |
| m2.invalid.json | - | ✅ | ❌| Stereotypes missing |
| m3.invalid.json | `1.0` | ✅ | ❌| Invalid Stereotype |
| m4.invalid.json | `1.0` | ✅ | ❌| Endurant sortal `role` without specialization |
| m5.invalid.json | `1.0` | ✅ | ❌| Kind cannot specialize another kind |
| m6.invalid.json | `1.0` | ✅ | ❌| Non Sortal not specialized by a Sortal. |